import type { ManagementType } from '../entities';
import { CreateBuildingDto } from './create-building.dto';

export class CreatePropertyDto {
  managementType: ManagementType;
  name: string;
  propertyManager: string;
  accountant: string;
  declarationFilePath: string;
  buildings: CreateBuildingDto[];
}
