import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import OpenAI from 'openai';
import { Property, Building, Unit } from './entities';
import { PropertyDto } from './dto';

@Injectable()
export class PropertyService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');
  private readonly openai: OpenAI;

  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
  ) {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }

    this.openai = new OpenAI();
  }

  async create(dto: PropertyDto): Promise<Property> {
    const property = this.propertyRepository.create({
      managementType: dto.managementType,
      name: dto.name,
      propertyManager: dto.propertyManager,
      accountant: dto.accountant,
      declarationFileName: dto.declarationFileName,
      buildings: dto.buildings,
    });

    const saved = await this.propertyRepository.save(property);
    return this.findOne(saved.id);
  }

  async update(id: string, dto: PropertyDto): Promise<Property> {
    const existingProperty = await this.findOne(id);

    // Get existing building and unit IDs for cleanup
    const existingBuildingIds = existingProperty.buildings.map((b) => b.id);
    const existingUnitIds = existingProperty.buildings.flatMap((b) =>
      b.units.map((u) => u.id),
    );

    // Determine which buildings/units to delete (those not in the update payload)
    const incomingBuildingIds = dto.buildings
      .filter((b) => b.id)
      .map((b) => b.id);
    const incomingUnitIds = dto.buildings.flatMap((b) =>
      b.units.filter((u) => u.id).map((u) => u.id),
    );

    const buildingsToDelete = existingBuildingIds.filter(
      (id) => !incomingBuildingIds.includes(id),
    );
    const unitsToDelete = existingUnitIds.filter(
      (id) => !incomingUnitIds.includes(id),
    );

    // Delete removed units and buildings
    if (unitsToDelete.length > 0) {
      await this.unitRepository.delete(unitsToDelete);
    }
    if (buildingsToDelete.length > 0) {
      await this.buildingRepository.delete(buildingsToDelete);
    }

    // Update property fields
    existingProperty.managementType = dto.managementType;
    existingProperty.name = dto.name;
    existingProperty.propertyManager = dto.propertyManager;
    existingProperty.accountant = dto.accountant;
    existingProperty.declarationFileName = dto.declarationFileName;

    // Update buildings and units
    existingProperty.buildings = dto.buildings.map((buildingDto) => {
      const building = buildingDto.id
        ? existingProperty.buildings.find((b) => b.id === buildingDto.id) ||
          new Building()
        : new Building();

      building.street = buildingDto.street;
      building.houseNumber = buildingDto.houseNumber;
      building.city = buildingDto.city;
      building.postalCode = buildingDto.postalCode;
      building.country = buildingDto.country;
      building.propertyId = id;

      building.units = buildingDto.units.map((unitDto) => {
        const unit = unitDto.id
          ? building.units?.find((u) => u.id === unitDto.id) || new Unit()
          : new Unit();

        unit.unitNumber = unitDto.unitNumber;
        unit.type = unitDto.type;
        unit.floor = unitDto.floor;
        unit.entrance = unitDto.entrance || null;
        unit.size = unitDto.size;
        unit.coOwnershipShare = unitDto.coOwnershipShare;
        unit.constructionYear = unitDto.constructionYear;
        unit.rooms = unitDto.rooms;

        return unit;
      });

      return building;
    });

    await this.propertyRepository.save(existingProperty);
    return this.findOne(id);
  }

  async findAll(): Promise<Property[]> {
    return this.propertyRepository.find({
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

  async delete(id: string): Promise<void> {
    const property = await this.findOne(id);

    // Delete all units from all buildings first
    const unitIds = property.buildings.flatMap((b) => b.units.map((u) => u.id));
    if (unitIds.length > 0) {
      await this.unitRepository.delete(unitIds);
    }

    // Delete all buildings
    const buildingIds = property.buildings.map((b) => b.id);
    if (buildingIds.length > 0) {
      await this.buildingRepository.delete(buildingIds);
    }

    // Delete the property
    await this.propertyRepository.delete(id);
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

  fileExists(filename: string): boolean {
    const filePath = path.join(this.uploadDir, filename);
    return fs.existsSync(filePath);
  }

  async extractDataWithOpenAI(filename: string): Promise<Partial<PropertyDto>> {
    const filePath = path.join(this.uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`File "${filename}" not found`);
    }

    // Read file and convert to base64
    const fileData = fs.readFileSync(filePath);
    const base64String = fileData.toString('base64');

    // Determine MIME type based on extension
    const ext = path.extname(filename).toLowerCase();
    const mimeType =
      ext === '.pdf' ? 'application/pdf' : 'application/octet-stream';

    const prompt = `You are a document parser that extracts property information from declaration of division documents (Teilungserklärung) and similar property documents.

Extract the data and return it as a valid JSON object with the following structure:
{
  "managementType": "WEG" or "MV",
  "name": "property name",
  "propertyManager": "property manager name",
  "accountant": "accountant name",
  "buildings": [
    {
      "street": "street name",
      "houseNumber": "house number",
      "city": "city name",
      "postalCode": "postal code",
      "country": "country name",
      "units": [
        {
          "unitNumber": "unit identifier",
          "type": "Apartment" or "Office" or "Garden" or "Parking",
          "floor": floor number (integer),
          "entrance": "entrance identifier",
          "size": size in square meters (number),
          "coOwnershipShare": ownership share as decimal between 0 and 1 (e.g., 0.05 for 5%),
          "constructionYear": year of construction (integer),
          "rooms": number of rooms (integer)
        }
      ]
    }
  ]
}

IMPORTANT: Only include fields that are explicitly stated in the document.
- If a field cannot be determined from the document, set it to null
- For coOwnershipShare, if given as MEA (Miteigentumsanteile), convert to decimal
- Extract all individual units mentioned with their available details

Return ONLY the JSON object, no additional text or markdown formatting.`;

    // Send request to OpenAI with file as attachment
    const response = await this.openai.responses.create({
      model: 'gpt-4o',
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_file',
              filename: filename,
              file_data: `data:${mimeType};base64,${base64String}`,
            },
            {
              type: 'input_text',
              text: prompt,
            },
          ],
        },
      ],
    });

    // Parse the JSON response
    let responseText = response.output_text;

    // Remove markdown code blocks if present
    responseText = responseText
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    try {
      const parsedData = JSON.parse(responseText) as Partial<PropertyDto>;
      return parsedData;
    } catch {
      throw new Error(
        `Failed to parse OpenAI response as JSON: ${responseText}`,
      );
    }
  }
}
