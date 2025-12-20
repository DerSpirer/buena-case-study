import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities';
import { CreatePropertyDto } from './dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  async create(dto: CreatePropertyDto): Promise<Property> {
    const property = this.propertyRepository.create({
      managementType: dto.managementType,
      name: dto.name,
      propertyManager: dto.propertyManager,
      accountant: dto.accountant,
      declarationFilePath: dto.declarationFilePath,
      buildings: dto.buildings,
    });

    const saved = await this.propertyRepository.save(property);
    return this.findOne(saved.id);
  }

  async findAll(): Promise<Property[]> {
    return this.propertyRepository.find({
      relations: ['buildings', 'buildings.units'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['buildings', 'buildings.units'],
    });

    if (!property) {
      throw new NotFoundException(`Property with ID "${id}" not found`);
    }

    return property;
  }
}
