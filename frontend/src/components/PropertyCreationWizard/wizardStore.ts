import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

// Types matching backend DTOs
export type ManagementType = 'WEG' | 'MV';
export type UnitType = 'Apartment' | 'Office' | 'Garden' | 'Parking';

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

export interface CreateBuildingData {
  street: string;
  houseNumber: string;
  city: string;
  postalCode: string;
  country: string;
  units: CreateUnitData[];
}

export interface GeneralInfoData {
  managementType: ManagementType | '';
  name: string;
  propertyManager: string;
  accountant: string;
  declarationFileName: string;
}

// The full property data for API submission
export interface CreatePropertyData extends GeneralInfoData {
  buildings: CreateBuildingData[];
}

const initialGeneralInfo: GeneralInfoData = {
  managementType: '',
  name: '',
  propertyManager: '',
  accountant: '',
  declarationFileName: '',
};

const createEmptyUnit = (): CreateUnitData => ({
  unitNumber: '',
  type: 'Apartment',
  floor: 0,
  entrance: '',
  size: 0,
  coOwnershipShare: 0,
  constructionYear: new Date().getFullYear(),
  rooms: 0,
});

const createEmptyBuilding = (): CreateBuildingData => ({
  street: '',
  houseNumber: '',
  city: '',
  postalCode: '',
  country: 'Germany',
  units: [],
});

// Stable empty array reference to avoid creating new arrays in selectors
const EMPTY_UNITS: CreateUnitData[] = [];

interface WizardState {
  // Navigation
  activeStep: number;
  selectedBuildingIndex: number;

  // Form data (separated for fine-grained subscriptions)
  generalInfo: GeneralInfoData;
  buildings: CreateBuildingData[];
}

interface WizardActions {
  // Navigation
  setActiveStep: (step: number | ((prev: number) => number)) => void;
  setSelectedBuildingIndex: (index: number | ((prev: number) => number)) => void;

  // General info
  updateGeneralInfo: <K extends keyof GeneralInfoData>(field: K, value: GeneralInfoData[K]) => void;

  // Buildings
  addBuilding: () => void;
  updateBuilding: <K extends keyof CreateBuildingData>(
    index: number,
    field: K,
    value: CreateBuildingData[K]
  ) => void;
  deleteBuilding: (index: number) => void;

  // Units
  addUnit: (buildingIndex: number) => void;
  addMultipleUnits: (buildingIndex: number, count: number) => void;
  updateUnit: <K extends keyof CreateUnitData>(
    buildingIndex: number,
    unitIndex: number,
    field: K,
    value: CreateUnitData[K]
  ) => void;
  duplicateUnit: (buildingIndex: number, unitIndex: number) => void;
  deleteUnit: (buildingIndex: number, unitIndex: number) => void;

  // Utility
  reset: () => void;
  getFormData: () => CreatePropertyData;
}

export type WizardStore = WizardState & WizardActions;

export const useWizardStore = create<WizardStore>((set, get) => ({
  // Initial state
  activeStep: 0,
  selectedBuildingIndex: 0,
  generalInfo: initialGeneralInfo,
  buildings: [],

  // Navigation
  setActiveStep: (step) =>
    set((state) => ({
      activeStep: typeof step === 'function' ? step(state.activeStep) : step,
    })),

  setSelectedBuildingIndex: (index) =>
    set((state) => ({
      selectedBuildingIndex: typeof index === 'function' ? index(state.selectedBuildingIndex) : index,
    })),

  // General info - only updates generalInfo slice
  updateGeneralInfo: (field, value) =>
    set((state) => ({
      generalInfo: { ...state.generalInfo, [field]: value },
    })),

  // Buildings
  addBuilding: () =>
    set((state) => ({
      buildings: [...state.buildings, createEmptyBuilding()],
    })),

  updateBuilding: (index, field, value) =>
    set((state) => ({
      buildings: state.buildings.map((b, i) => (i === index ? { ...b, [field]: value } : b)),
    })),

  deleteBuilding: (index) =>
    set((state) => ({
      buildings: state.buildings.filter((_, i) => i !== index),
      // Adjust selectedBuildingIndex if needed
      selectedBuildingIndex:
        state.selectedBuildingIndex >= state.buildings.length - 1
          ? Math.max(0, state.buildings.length - 2)
          : state.selectedBuildingIndex,
    })),

  // Units
  addUnit: (buildingIndex) =>
    set((state) => ({
      buildings: state.buildings.map((b, i) =>
        i === buildingIndex ? { ...b, units: [...b.units, createEmptyUnit()] } : b
      ),
    })),

  addMultipleUnits: (buildingIndex, count) =>
    set((state) => ({
      buildings: state.buildings.map((b, i) =>
        i === buildingIndex
          ? { ...b, units: [...b.units, ...Array.from({ length: count }, createEmptyUnit)] }
          : b
      ),
    })),

  updateUnit: (buildingIndex, unitIndex, field, value) =>
    set((state) => ({
      buildings: state.buildings.map((b, bIdx) =>
        bIdx === buildingIndex
          ? {
              ...b,
              units: b.units.map((u, uIdx) => (uIdx === unitIndex ? { ...u, [field]: value } : u)),
            }
          : b
      ),
    })),

  duplicateUnit: (buildingIndex, unitIndex) =>
    set((state) => {
      const unit = state.buildings[buildingIndex]?.units[unitIndex];
      if (!unit) return state;

      return {
        buildings: state.buildings.map((b, i) =>
          i === buildingIndex ? { ...b, units: [...b.units, { ...unit, unitNumber: '' }] } : b
        ),
      };
    }),

  deleteUnit: (buildingIndex, unitIndex) =>
    set((state) => ({
      buildings: state.buildings.map((b, bIdx) =>
        bIdx === buildingIndex ? { ...b, units: b.units.filter((_, uIdx) => uIdx !== unitIndex) } : b
      ),
    })),

  // Utility
  reset: () =>
    set({
      activeStep: 0,
      selectedBuildingIndex: 0,
      generalInfo: initialGeneralInfo,
      buildings: [],
    }),

  // Aggregate all data for API submission
  getFormData: () => {
    const state = get();
    return {
      ...state.generalInfo,
      buildings: state.buildings,
    };
  },
}));

// Selector hooks for fine-grained subscriptions
// These prevent unnecessary re-renders by subscribing to specific slices

export const useActiveStep = () => useWizardStore((state) => state.activeStep);
export const useSetActiveStep = () => useWizardStore((state) => state.setActiveStep);

export const useSelectedBuildingIndex = () => useWizardStore((state) => state.selectedBuildingIndex);
export const useSetSelectedBuildingIndex = () => useWizardStore((state) => state.setSelectedBuildingIndex);

export const useGeneralInfo = () => useWizardStore((state) => state.generalInfo);
export const useUpdateGeneralInfo = () => useWizardStore((state) => state.updateGeneralInfo);

export const useBuildings = () => useWizardStore((state) => state.buildings);
export const useBuilding = (index: number) => useWizardStore((state) => state.buildings[index]);
export const useBuildingsCount = () => useWizardStore((state) => state.buildings.length);

export const useUnits = (buildingIndex: number) =>
  useWizardStore((state) => state.buildings[buildingIndex]?.units ?? EMPTY_UNITS);
export const useUnit = (buildingIndex: number, unitIndex: number) =>
  useWizardStore((state) => state.buildings[buildingIndex]?.units[unitIndex]);

export const useReset = () => useWizardStore((state) => state.reset);

// Building actions - useShallow prevents infinite loops by doing shallow equality check
export const useBuildingActions = () =>
  useWizardStore(
    useShallow((state) => ({
      addBuilding: state.addBuilding,
      updateBuilding: state.updateBuilding,
      deleteBuilding: state.deleteBuilding,
    }))
  );

// Unit actions - useShallow prevents infinite loops by doing shallow equality check
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

