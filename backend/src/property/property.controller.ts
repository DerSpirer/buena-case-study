import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
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
}
