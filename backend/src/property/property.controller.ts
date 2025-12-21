import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto';
import { Property } from './entities';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  create(@Body() dto: CreatePropertyDto): Promise<Property> {
    return this.propertyService.create(dto);
  }

  @Get()
  findAll(): Promise<Property[]> {
    return this.propertyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Property> {
    return this.propertyService.findOne(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: { originalname: string; buffer: Buffer },
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const result = await this.propertyService.saveFile(file);

    return {
      message: 'File uploaded successfully',
      filename: result.filename,
    };
  }
}
