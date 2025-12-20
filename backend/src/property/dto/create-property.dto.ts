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
import { CreateBuildingDto } from './create-building.dto';

export class CreatePropertyDto {
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
  declarationFilePath: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateBuildingDto)
  buildings: CreateBuildingDto[];
}
