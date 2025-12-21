import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

// ============================================================================
// Types matching backend DTOs exactly
// ============================================================================
export type ManagementType = 'WEG' | 'MV';
export type UnitType = 'Apartment' | 'Office' | 'Garden' | 'Parking';

/** Matches backend CreateUnitDto */
export interface CreateUnitPayload {
  unitNumber: string;
  type: UnitType;
  floor: number;
  entrance: string;
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
// Initial/empty values
// ============================================================================

const createEmptyPayload = (): CreatePropertyPayload => ({
  managementType: '',
  name: '',
  propertyManager: '',
  accountant: '',
  declarationFileName: '',
  buildings: [],
});

const createEmptyUnit = (): CreateUnitPayload => ({
  unitNumber: '',
  type: 'Apartment',
  floor: 0,
  entrance: '',
  size: 0,
  coOwnershipShare: 0,
  constructionYear: new Date().getFullYear(),
  rooms: 0,
});

const createEmptyBuilding = (): CreateBuildingPayload => ({
  street: '',
  houseNumber: '',
  city: '',
  postalCode: '',
  country: 'Germany',
  units: [],
});

// Stable empty array reference to avoid creating new arrays in selectors
const EMPTY_UNITS: CreateUnitPayload[] = [];

// ============================================================================
// Store
// ============================================================================

interface WizardState {
  // Navigation
  activeStep: number;
  selectedBuildingIndex: number;

  // The payload we're building - matches backend CreatePropertyDto
  payload: CreatePropertyPayload;
}

interface WizardActions {
  // Navigation
  setActiveStep: (step: number | ((prev: number) => number)) => void;
  setSelectedBuildingIndex: (index: number | ((prev: number) => number)) => void;

  // Payload updates
  updatePayload: <K extends keyof CreatePropertyPayload>(
    field: K,
    value: CreatePropertyPayload[K]
  ) => void;

  // Buildings
  addBuilding: () => void;
  updateBuilding: <K extends keyof CreateBuildingPayload>(
    index: number,
    field: K,
    value: CreateBuildingPayload[K]
  ) => void;
  deleteBuilding: (index: number) => void;

  // Units
  addUnit: (buildingIndex: number) => void;
  addMultipleUnits: (buildingIndex: number, count: number) => void;
  updateUnit: <K extends keyof CreateUnitPayload>(
    buildingIndex: number,
    unitIndex: number,
    field: K,
    value: CreateUnitPayload[K]
  ) => void;
  duplicateUnit: (buildingIndex: number, unitIndex: number) => void;
  deleteUnit: (buildingIndex: number, unitIndex: number) => void;

  // Utility
  reset: () => void;
  getPayload: () => CreatePropertyPayload;
  setExtractedData: (data: Partial<CreatePropertyPayload>) => void;
}

export type WizardStore = WizardState & WizardActions;

export const useWizardStore = create<WizardStore>((set, get) => ({
  // Initial state
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

      return {
        payload: {
          ...state.payload,
          buildings: state.payload.buildings.map((b, i) =>
            i === buildingIndex ? { ...b, units: [...b.units, { ...unit, unitNumber: '' }] } : b
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
}));

// ============================================================================
// Selector hooks for fine-grained subscriptions
// ============================================================================

// Navigation
export const useActiveStep = () => useWizardStore((state) => state.activeStep);
export const useSetActiveStep = () => useWizardStore((state) => state.setActiveStep);
export const useSelectedBuildingIndex = () =>
  useWizardStore((state) => state.selectedBuildingIndex);
export const useSetSelectedBuildingIndex = () =>
  useWizardStore((state) => state.setSelectedBuildingIndex);

// Payload field selectors
export const usePayload = () => useWizardStore((state) => state.payload);
export const usePayloadField = <K extends keyof CreatePropertyPayload>(field: K) =>
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
