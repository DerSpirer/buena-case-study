import { createContext, useContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';

// Types
export type ManagementType = 'WEG' | 'MV';
export type UnitType = 'Apartment' | 'Office' | 'Garden' | 'Parking';

export interface UnitFormData {
  id: string;
  unitNumber: string;
  type: UnitType;
  floor: number;
  entrance: string;
  size: number;
  coOwnershipShare: number;
  constructionYear: number;
  rooms: number;
}

export interface BuildingFormData {
  street: string;
  houseNumber: string;
  city: string;
  postalCode: string;
  country: string;
  units: UnitFormData[];
}

export interface GeneralInfoFormData {
  managementType: ManagementType | '';
  name: string;
  propertyManager: string;
  accountant: string;
  declarationFilePath: string;
}

export interface PropertyFormData {
  generalInfo: GeneralInfoFormData;
  buildings: BuildingFormData[];
}

export const initialFormData: PropertyFormData = {
  generalInfo: {
    managementType: '',
    name: '',
    propertyManager: '',
    accountant: '',
    declarationFilePath: '',
  },
  buildings: [],
};

export interface PropertyCreationWizardContextValue {
  formData: PropertyFormData;
  setFormData: Dispatch<SetStateAction<PropertyFormData>>;
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
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

