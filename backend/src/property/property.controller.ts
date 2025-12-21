import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseUUIDPipe,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PropertyService } from './property.service';
import { PropertyDto } from './dto';
import { Property } from './entities';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  create(@Body() dto: PropertyDto): Promise<Property> {
    return this.propertyService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: PropertyDto,
  ): Promise<Property> {
    return this.propertyService.update(id, dto);
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

  @Post('extract')
  async extractData(@Body('filename') filename: string) {
    if (!filename) {
      throw new BadRequestException('Filename is required');
    }

    if (!this.propertyService.fileExists(filename)) {
      throw new BadRequestException(
        `File "${filename}" not found. Please upload the file first.`,
      );
    }

    const extractedData =
      await this.propertyService.extractDataWithOpenAI(filename);

    return {
      message: 'Data extracted successfully',
      data: extractedData,
    };
  }
}
