import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { ManagementType } from '../entities';
import { BuildingDto } from './building.dto';

export class PropertyDto {
  @IsIn(['WEG', 'MV'])
  managementType: ManagementType;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  propertyManager: string;

  @IsString()
  @IsNotEmpty()
  accountant: string;

  @IsString()
  @IsNotEmpty()
  declarationFileName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => BuildingDto)
  buildings: BuildingDto[];
}
