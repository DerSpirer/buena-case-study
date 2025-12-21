// ============================================================================
// Enums / Union Types
// ============================================================================

export type ManagementType = 'WEG' | 'MV';
export type UnitType = 'Apartment' | 'Office' | 'Garden' | 'Parking';

// ============================================================================
// Entity Types (returned from API)
// ============================================================================

/** Unit entity returned from API (with ID) */
export interface Unit {
  id: string;
  unitNumber: string;
  type: UnitType;
  floor: number;
  entrance: string | null;
  size: number;
  coOwnershipShare: number;
  constructionYear: number;
  rooms: number;
  createdAt: string;
  updatedAt: string;
}

/** Building entity returned from API (with ID and units) */
export interface Building {
  id: string;
  street: string;
  houseNumber: string;
  city: string;
  postalCode: string;
  country: string;
  units: Unit[];
  createdAt: string;
  updatedAt: string;
}

/** Full property entity returned from GET /properties/:id */
export interface Property {
  id: string;
  managementType: ManagementType;
  name: string;
  propertyManager: string;
  accountant: string;
  declarationFileName: string;
  buildings: Building[];
  createdAt: string;
  updatedAt: string;
}

/** Lightweight property for list view (GET /properties) */
export interface PropertySummary {
  id: string;
  managementType: ManagementType;
  name: string;
  propertyManager: string;
  accountant: string;
  declarationFileName: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Payload Types (sent to API for create/update)
// ============================================================================

/** Unit payload - id is optional (include for update, omit for create) */
export interface UnitPayload {
  id?: string;
  unitNumber: string;
  type: UnitType;
  floor: number;
  entrance?: string;
  size: number;
  coOwnershipShare: number;
  constructionYear: number;
  rooms: number;
}

/** Building payload - id is optional (include for update, omit for create) */
export interface BuildingPayload {
  id?: string;
  street: string;
  houseNumber: string;
  city: string;
  postalCode: string;
  country: string;
  units: UnitPayload[];
}

/** Property payload for create/update - same structure, IDs determine create vs update */
export interface PropertyPayload {
  managementType: ManagementType | '';
  name: string;
  propertyManager: string;
  accountant: string;
  declarationFileName: string;
  buildings: BuildingPayload[];
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
  data: Partial<PropertyPayload>;
}
