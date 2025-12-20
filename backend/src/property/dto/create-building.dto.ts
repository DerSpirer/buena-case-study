import { CreateUnitDto } from './create-unit.dto';

export class CreateBuildingDto {
  street: string;
  houseNumber: string;
  city: string;
  postalCode: string;
  country: string;
  units: CreateUnitDto[];
}
