import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import OpenAI from 'openai';
import { Property } from './entities';
import { CreatePropertyDto } from './dto';

@Injectable()
export class PropertyService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');
  private readonly openai: OpenAI;

  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }

    this.openai = new OpenAI();
  }

  async create(dto: CreatePropertyDto): Promise<Property> {
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

  fileExists(filename: string): boolean {
    const filePath = path.join(this.uploadDir, filename);
    return fs.existsSync(filePath);
  }

  async extractDataWithOpenAI(
    filename: string,
  ): Promise<Partial<CreatePropertyDto>> {
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

If any field cannot be determined from the document, use reasonable defaults:
- For managementType, default to "WEG" if it's a condominium/apartment building
- For missing names, use "Unknown"
- For missing addresses, extract what's available
- For units, extract all individual units mentioned with their details
- For coOwnershipShare, if given as MEA (Miteigentumsanteile), convert to decimal
- For constructionYear, if not found, use current year

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
      const parsedData = JSON.parse(responseText) as Partial<CreatePropertyDto>;
      return parsedData;
    } catch {
      throw new Error(
        `Failed to parse OpenAI response as JSON: ${responseText}`,
      );
    }
  }
}
