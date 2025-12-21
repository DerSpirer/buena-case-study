import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import type {
  ManagementType,
  UnitType,
  UnitPayload,
  BuildingPayload,
  PropertyPayload,
  Property,
} from '../../types/Property';

// Re-export types for convenience
export type { ManagementType, UnitType, UnitPayload, BuildingPayload, PropertyPayload };

// ============================================================================
// Initial/empty values
// ============================================================================

const createEmptyPayload = (): PropertyPayload => ({
  managementType: '',
  name: '',
  propertyManager: '',
  accountant: '',
  declarationFileName: '',
  buildings: [],
});

const createEmptyUnit = (): UnitPayload => ({
  unitNumber: '',
  type: 'Apartment',
  floor: 0,
  entrance: undefined,
  size: 0,
  coOwnershipShare: 0,
  constructionYear: new Date().getFullYear(),
  rooms: 0,
});

const createEmptyBuilding = (): BuildingPayload => ({
  street: '',
  houseNumber: '',
  city: '',
  postalCode: '',
  country: 'Germany',
  units: [],
});

// Stable empty array reference to avoid creating new arrays in selectors
const EMPTY_UNITS: UnitPayload[] = [];

// ============================================================================
// Store
// ============================================================================

interface WizardState {
  // Edit mode - if set, we're editing an existing property
  editingPropertyId: string | null;

  // Navigation
  activeStep: number;
  selectedBuildingIndex: number;

  // The payload we're building - matches backend PropertyDto
  payload: PropertyPayload;
}

interface WizardActions {
  // Navigation
  setActiveStep: (step: number | ((prev: number) => number)) => void;
  setSelectedBuildingIndex: (index: number | ((prev: number) => number)) => void;

  // Payload updates
  updatePayload: <K extends keyof PropertyPayload>(
    field: K,
    value: PropertyPayload[K]
  ) => void;

  // Buildings
  addBuilding: () => void;
  updateBuilding: <K extends keyof BuildingPayload>(
    index: number,
    field: K,
    value: BuildingPayload[K]
  ) => void;
  deleteBuilding: (index: number) => void;

  // Units
  addUnit: (buildingIndex: number) => void;
  addMultipleUnits: (buildingIndex: number, count: number) => void;
  updateUnit: <K extends keyof UnitPayload>(
    buildingIndex: number,
    unitIndex: number,
    field: K,
    value: UnitPayload[K]
  ) => void;
  duplicateUnit: (buildingIndex: number, unitIndex: number) => void;
  deleteUnit: (buildingIndex: number, unitIndex: number) => void;

  // Utility
  reset: () => void;
  getPayload: () => PropertyPayload;
  setExtractedData: (data: Partial<PropertyPayload>) => void;

  // Edit mode
  isEditMode: () => boolean;
  loadProperty: (property: Property) => void;
}

export type WizardStore = WizardState & WizardActions;

export const useWizardStore = create<WizardStore>((set, get) => ({
  // Initial state
  editingPropertyId: null,
  activeStep: 0,
  selectedBuildingIndex: 0,
  payload: createEmptyPayload(),

  // Navigation
  setActiveStep: (step) =>
    set((state) => ({
      activeStep: typeof step === 'function' ? step(state.activeStep) : step,
    })),

  setSelectedBuildingIndex: (index) =>
    set((state) => ({
      selectedBuildingIndex:
        typeof index === 'function' ? index(state.selectedBuildingIndex) : index,
    })),

  // Payload updates (for top-level fields like name, managementType, etc.)
  updatePayload: (field, value) =>
    set((state) => ({
      payload: { ...state.payload, [field]: value },
    })),

  // Buildings
  addBuilding: () =>
    set((state) => ({
      payload: {
        ...state.payload,
        buildings: [...state.payload.buildings, createEmptyBuilding()],
      },
    })),

  updateBuilding: (index, field, value) =>
    set((state) => ({
      payload: {
        ...state.payload,
        buildings: state.payload.buildings.map((b, i) =>
          i === index ? { ...b, [field]: value } : b
        ),
      },
    })),

  deleteBuilding: (index) =>
    set((state) => ({
      payload: {
        ...state.payload,
        buildings: state.payload.buildings.filter((_, i) => i !== index),
      },
      selectedBuildingIndex:
        state.selectedBuildingIndex >= state.payload.buildings.length - 1
          ? Math.max(0, state.payload.buildings.length - 2)
          : state.selectedBuildingIndex,
    })),

  // Units
  addUnit: (buildingIndex) =>
    set((state) => ({
      payload: {
        ...state.payload,
        buildings: state.payload.buildings.map((b, i) =>
          i === buildingIndex ? { ...b, units: [...b.units, createEmptyUnit()] } : b
        ),
      },
    })),

  addMultipleUnits: (buildingIndex, count) =>
    set((state) => ({
      payload: {
        ...state.payload,
        buildings: state.payload.buildings.map((b, i) =>
          i === buildingIndex
            ? { ...b, units: [...b.units, ...Array.from({ length: count }, createEmptyUnit)] }
            : b
        ),
      },
    })),

  updateUnit: (buildingIndex, unitIndex, field, value) =>
    set((state) => ({
      payload: {
        ...state.payload,
        buildings: state.payload.buildings.map((b, bIdx) =>
          bIdx === buildingIndex
            ? {
                ...b,
                units: b.units.map((u, uIdx) =>
                  uIdx === unitIndex ? { ...u, [field]: value } : u
                ),
              }
            : b
        ),
      },
    })),

  duplicateUnit: (buildingIndex, unitIndex) =>
    set((state) => {
      const unit = state.payload.buildings[buildingIndex]?.units[unitIndex];
      if (!unit) return state;

      // When duplicating, remove the id so it creates a new unit
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, ...unitWithoutId } = unit;

      return {
        payload: {
          ...state.payload,
          buildings: state.payload.buildings.map((b, i) =>
            i === buildingIndex
              ? { ...b, units: [...b.units, { ...unitWithoutId, unitNumber: '' }] }
              : b
          ),
        },
      };
    }),

  deleteUnit: (buildingIndex, unitIndex) =>
    set((state) => ({
      payload: {
        ...state.payload,
        buildings: state.payload.buildings.map((b, bIdx) =>
          bIdx === buildingIndex
            ? { ...b, units: b.units.filter((_, uIdx) => uIdx !== unitIndex) }
            : b
        ),
      },
    })),

  // Utility
  reset: () =>
    set({
      editingPropertyId: null,
      activeStep: 0,
      selectedBuildingIndex: 0,
      payload: createEmptyPayload(),
    }),

  // Returns the payload object ready to send to the API
  getPayload: () => get().payload,

  // Set extracted data from AI, merging with existing payload
  setExtractedData: (data) =>
    set((state) => ({
      payload: { ...state.payload, ...data },
    })),

  // Edit mode helpers
  isEditMode: () => get().editingPropertyId !== null,

  // Load an existing property into the store for editing
  loadProperty: (property: Property) =>
    set({
      editingPropertyId: property.id,
      activeStep: 0,
      selectedBuildingIndex: 0,
      payload: {
        managementType: property.managementType,
        name: property.name,
        propertyManager: property.propertyManager,
        accountant: property.accountant,
        declarationFileName: property.declarationFileName,
        buildings: property.buildings.map((building) => ({
          id: building.id,
          street: building.street,
          houseNumber: building.houseNumber,
          city: building.city,
          postalCode: building.postalCode,
          country: building.country,
          units: building.units.map((unit) => ({
            id: unit.id,
            unitNumber: unit.unitNumber,
            type: unit.type,
            floor: unit.floor,
            entrance: unit.entrance ?? undefined,
            size: Number(unit.size),
            coOwnershipShare: Number(unit.coOwnershipShare),
            constructionYear: unit.constructionYear,
            rooms: unit.rooms,
          })),
        })),
      },
    }),
}));

// ============================================================================
// Selector hooks
// ============================================================================

// Edit mode
export const useEditingPropertyId = () => useWizardStore((state) => state.editingPropertyId);
export const useIsEditMode = () => useWizardStore((state) => state.editingPropertyId !== null);
export const useLoadProperty = () => useWizardStore((state) => state.loadProperty);

// Navigation
export const useActiveStep = () => useWizardStore((state) => state.activeStep);
export const useSetActiveStep = () => useWizardStore((state) => state.setActiveStep);
export const useSelectedBuildingIndex = () =>
  useWizardStore((state) => state.selectedBuildingIndex);
export const useSetSelectedBuildingIndex = () =>
  useWizardStore((state) => state.setSelectedBuildingIndex);

// Payload field selectors
export const usePayload = () => useWizardStore((state) => state.payload);
export const usePayloadField = <K extends keyof PropertyPayload>(field: K) =>
  useWizardStore((state) => state.payload[field]);
export const useUpdatePayload = () => useWizardStore((state) => state.updatePayload);

// Buildings
export const useBuildings = () => useWizardStore((state) => state.payload.buildings);
export const useBuilding = (index: number) =>
  useWizardStore((state) => state.payload.buildings[index]);
export const useBuildingsCount = () => useWizardStore((state) => state.payload.buildings.length);

// Units
export const useUnits = (buildingIndex: number) =>
  useWizardStore((state) => state.payload.buildings[buildingIndex]?.units ?? EMPTY_UNITS);
export const useUnit = (buildingIndex: number, unitIndex: number) =>
  useWizardStore((state) => state.payload.buildings[buildingIndex]?.units[unitIndex]);

// Reset
export const useReset = () => useWizardStore((state) => state.reset);

// Set extracted data from AI
export const useSetExtractedData = () => useWizardStore((state) => state.setExtractedData);

// Building actions
export const useBuildingActions = () =>
  useWizardStore(
    useShallow((state) => ({
      addBuilding: state.addBuilding,
      updateBuilding: state.updateBuilding,
      deleteBuilding: state.deleteBuilding,
    }))
  );

// Unit actions
export const useUnitActions = () =>
  useWizardStore(
    useShallow((state) => ({
      addUnit: state.addUnit,
      addMultipleUnits: state.addMultipleUnits,
      updateUnit: state.updateUnit,
      duplicateUnit: state.duplicateUnit,
      deleteUnit: state.deleteUnit,
    }))
  );

// ============================================================================
// Validation functions
// ============================================================================

export const isStep1Valid = (payload: PropertyPayload): boolean => {
  return (
    (payload.managementType === 'WEG' || payload.managementType === 'MV') &&
    payload.name.trim().length > 0 &&
    payload.propertyManager.trim().length > 0 &&
    payload.accountant.trim().length > 0 &&
    payload.declarationFileName.trim().length > 0
  );
};

const isUnitValid = (unit: UnitPayload): boolean => {
  const currentYear = new Date().getFullYear();
  const validTypes: UnitType[] = ['Apartment', 'Office', 'Garden', 'Parking'];

  return (
    unit.unitNumber.trim().length > 0 &&
    validTypes.includes(unit.type) &&
    Number.isInteger(unit.floor) &&
    unit.size >= 0 &&
    unit.coOwnershipShare >= 0 &&
    unit.coOwnershipShare <= 1 &&
    Number.isInteger(unit.constructionYear) &&
    unit.constructionYear >= 1000 &&
    unit.constructionYear <= currentYear &&
    Number.isInteger(unit.rooms) &&
    unit.rooms >= 0
  );
};

const isBuildingAddressValid = (building: BuildingPayload): boolean => {
  return (
    building.street.trim().length > 0 &&
    building.houseNumber.trim().length > 0 &&
    building.city.trim().length > 0 &&
    building.postalCode.trim().length > 0 &&
    building.country.trim().length > 0
  );
};

const isBuildingValid = (building: BuildingPayload): boolean => {
  return (
    isBuildingAddressValid(building) &&
    building.units.length >= 1 &&
    building.units.every(isUnitValid)
  );
};

export const isStep2Valid = (payload: PropertyPayload): boolean => {
  if (payload.buildings.length === 0) return false;

  return payload.buildings.every(isBuildingAddressValid);
};

export const isStep3Valid = (payload: PropertyPayload): boolean => {
  if (payload.buildings.length === 0) return false;

  return payload.buildings.every(
    (b) => b.units.length >= 1 && b.units.every(isUnitValid)
  );
};

export const isPayloadValid = (payload: PropertyPayload): boolean => {
  return (
    isStep1Valid(payload) &&
    payload.buildings.length >= 1 &&
    payload.buildings.every(isBuildingValid)
  );
};

export const useIsCurrentStepValid = () =>
  useWizardStore((state) => {
    switch (state.activeStep) {
      case 0:
        return isStep1Valid(state.payload);
      case 1:
        return isStep2Valid(state.payload);
      case 2:
        return isStep3Valid(state.payload);
      default:
        return false;
    }
  });
