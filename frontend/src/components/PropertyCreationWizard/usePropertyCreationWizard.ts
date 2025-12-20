import { createContext, useContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';

// Types matching backend DTOs
export type ManagementType = 'WEG' | 'MV';
export type UnitType = 'Apartment' | 'Office' | 'Garden' | 'Parking';

// Matches CreateUnitDto
export interface CreateUnitData {
  unitNumber: string;
  type: UnitType;
  floor: number;
  entrance: string;
  size: number;
  coOwnershipShare: number;
  constructionYear: number;
  rooms: number;
}

// Matches CreateBuildingDto
export interface CreateBuildingData {
  street: string;
  houseNumber: string;
  city: string;
  postalCode: string;
  country: string;
  units: CreateUnitData[];
}

// Matches CreatePropertyDto structure
export interface CreatePropertyData {
  managementType: ManagementType | '';
  name: string;
  propertyManager: string;
  accountant: string;
  declarationFilePath: string;
  buildings: CreateBuildingData[];
}

export const initialFormData: CreatePropertyData = {
  managementType: '',
  name: '',
  propertyManager: '',
  accountant: '',
  declarationFilePath: '',
  buildings: [],
};

export interface PropertyCreationWizardContextValue {
  formData: CreatePropertyData;
  setFormData: Dispatch<SetStateAction<CreatePropertyData>>;
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
  selectedBuildingIndex: number;
  setSelectedBuildingIndex: Dispatch<SetStateAction<number>>;
  reset: () => void;
}

export const PropertyCreationWizardContext = createContext<PropertyCreationWizardContextValue | null>(null);

export function usePropertyCreationWizard() {
  const context = useContext(PropertyCreationWizardContext);
  if (!context) {
    throw new Error('usePropertyCreationWizard must be used within PropertyCreationWizardProvider');
  }
  return context;
}
