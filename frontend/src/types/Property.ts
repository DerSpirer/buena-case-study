// ============================================================================
// Enums / Union Types
// ============================================================================

export type ManagementType = 'WEG' | 'MV';
export type UnitType = 'Apartment' | 'Office' | 'Garden' | 'Parking';

// ============================================================================
// Create Payloads (matching backend DTOs)
// ============================================================================

/** Matches backend CreateUnitDto */
export interface CreateUnitPayload {
  unitNumber: string;
  type: UnitType;
  floor: number;
  entrance?: string;
  size: number;
  coOwnershipShare: number;
  constructionYear: number;
  rooms: number;
}

/** Matches backend CreateBuildingDto */
export interface CreateBuildingPayload {
  street: string;
  houseNumber: string;
  city: string;
  postalCode: string;
  country: string;
  units: CreateUnitPayload[];
}

/** Matches backend CreatePropertyDto - this is what we send to the API */
export interface CreatePropertyPayload {
  managementType: ManagementType | '';
  name: string;
  propertyManager: string;
  accountant: string;
  declarationFileName: string;
  buildings: CreateBuildingPayload[];
}

// ============================================================================
// Entity Types (returned from API)
// ============================================================================

export interface Property {
  id: string;
  name: string;
  type: ManagementType;
  uniqueNumber: string;
  address?: string;
  createdAt: Date;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface UploadFileResponse {
  message: string;
  filename: string;
}

export interface ExtractWithAIResponse {
  message: string;
  data: Partial<CreatePropertyPayload>;
}

