import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Property } from './entities';
import { CreatePropertyDto } from './dto';

@Injectable()
export class PropertyService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

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

  async saveFile(file: {
    originalname: string;
    buffer: Buffer;
  }): Promise<{ filename: string; path: string }> {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    const filename = `${path.basename(file.originalname, ext)}-${uniqueSuffix}${ext}`;
    const filePath = path.join(this.uploadDir, filename);

    await fs.promises.writeFile(filePath, file.buffer);

    return {
      filename,
      path: filePath,
    };
  }
}
