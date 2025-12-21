import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsNumber,
  IsIn,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import type { UnitType } from '../entities';

export class CreateUnitDto {
  @IsString()
  @IsNotEmpty()
  unitNumber: string;

  @IsIn(['Apartment', 'Office', 'Garden', 'Parking'])
  type: UnitType;

  @IsInt()
  floor: number;

  @IsString()
  @IsOptional()
  entrance?: string;

  @IsNumber()
  @Min(0)
  size: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  coOwnershipShare: number;

  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear())
  constructionYear: number;

  @IsInt()
  @Min(0)
  rooms: number;
}
