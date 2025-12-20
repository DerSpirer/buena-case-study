import type { UnitType } from '../entities';

export class CreateUnitDto {
  unitNumber: string;
  type: UnitType;
  floor: number;
  entrance: string;
  size: number;
  coOwnershipShare: number;
  constructionYear: number;
  rooms: number;
}
