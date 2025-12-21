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
  _tempId: crypto.randomUUID(),
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
  _tempId: crypto.randomUUID(),
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

      // When duplicating, remove the id so it creates a new unit, and generate a new _tempId
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, _tempId: _oldTempId, ...unitWithoutIds } = unit;

      return {
        payload: {
          ...state.payload,
          buildings: state.payload.buildings.map((b, i) =>
            i === buildingIndex
              ? { ...b, units: [...b.units, { ...unitWithoutIds, _tempId: crypto.randomUUID(), unitNumber: '' }] }
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
  // Sanitizes unit data to ensure null values are converted to proper defaults
  // Strips _tempId fields which are only used for React keys
  getPayload: () => {
    const payload = get().payload;
    return {
      ...payload,
      buildings: payload.buildings.map((building) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _tempId: _buildingTempId, ...buildingRest } = building;
        return {
          ...buildingRest,
          units: building.units.map((unit) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { _tempId: _unitTempId, ...unitRest } = unit;
            return {
              ...unitRest,
              // Ensure numeric fields are never null
              floor: unit.floor ?? 0,
              size: unit.size ?? 0,
              coOwnershipShare: unit.coOwnershipShare ?? 0,
              constructionYear: unit.constructionYear ?? new Date().getFullYear(),
              rooms: unit.rooms ?? 0,
              // Convert null entrance to undefined (optional field)
              entrance: unit.entrance ?? undefined,
            };
          }),
        };
      }),
    };
  },

  // Set extracted data from AI, merging with existing payload
  // Sanitizes unit data to ensure null values are converted to proper defaults
  // Adds _tempId for React keys
  setExtractedData: (data) =>
    set((state) => {
      // Sanitize buildings and units if present
      const sanitizedData = { ...data };
      if (sanitizedData.buildings) {
        sanitizedData.buildings = sanitizedData.buildings.map((building) => ({
          ...building,
          _tempId: building._tempId ?? crypto.randomUUID(),
          units: building.units.map((unit) => ({
            ...unit,
            _tempId: unit._tempId ?? crypto.randomUUID(),
            // Ensure numeric fields are never null
            floor: unit.floor ?? 0,
            size: unit.size ?? 0,
            coOwnershipShare: unit.coOwnershipShare ?? 0,
            constructionYear: unit.constructionYear ?? new Date().getFullYear(),
            rooms: unit.rooms ?? 0,
            // Ensure string fields have defaults
            unitNumber: unit.unitNumber ?? '',
            type: unit.type ?? 'Apartment',
            // Convert null entrance to undefined (optional field)
            entrance: unit.entrance ?? undefined,
          })),
        }));
      }
      return {
        payload: { ...state.payload, ...sanitizedData },
      };
    }),

  // Edit mode helpers
  isEditMode: () => get().editingPropertyId !== null,

  // Load an existing property into the store for editing
  // Uses entity IDs as _tempId since they're already stable
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
          _tempId: building.id, // Use entity ID as stable key
          street: building.street,
          houseNumber: building.houseNumber,
          city: building.city,
          postalCode: building.postalCode,
          country: building.country,
          units: building.units.map((unit) => ({
            id: unit.id,
            _tempId: unit.id, // Use entity ID as stable key
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

// Get sanitized payload for API submission
export const useGetPayload = () => useWizardStore((state) => state.getPayload);

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

export const getStep1ValidationErrors = (payload: PropertyPayload): string[] => {
  const errors: string[] = [];
  if (payload.managementType !== 'WEG' && payload.managementType !== 'MV') {
    errors.push('Management Type');
  }
  if (!payload.name.trim()) {
    errors.push('Property Name');
  }
  if (!payload.propertyManager.trim()) {
    errors.push('Property Manager');
  }
  if (!payload.accountant.trim()) {
    errors.push('Accountant');
  }
  if (!payload.declarationFileName.trim()) {
    errors.push('Declaration of Division');
  }
  return errors;
};

const isUnitValid = (unit: UnitPayload): boolean => {
  const currentYear = new Date().getFullYear();
  const validTypes: UnitType[] = ['Apartment', 'Office', 'Garden', 'Parking'];

  const floor = Number(unit.floor);
  const size = Number(unit.size);
  const coOwnershipShare = Number(unit.coOwnershipShare);
  const constructionYear = Number(unit.constructionYear);
  const rooms = Number(unit.rooms);

  return (
    unit.unitNumber.trim().length > 0 &&
    validTypes.includes(unit.type) &&
    Number.isInteger(floor) &&
    size > 0 &&
    coOwnershipShare > 0 &&
    coOwnershipShare <= 1 &&
    Number.isInteger(constructionYear) &&
    constructionYear >= 1000 &&
    constructionYear <= currentYear &&
    Number.isInteger(rooms) &&
    rooms >= 0
  );
};

const getUnitValidationErrors = (unit: UnitPayload, unitIndex: number): string[] => {
  const currentYear = new Date().getFullYear();
  const validTypes: UnitType[] = ['Apartment', 'Office', 'Garden', 'Parking'];
  const errors: string[] = [];
  const unitLabel = unit.unitNumber.trim() || `Unit ${unitIndex + 1}`;

  const floor = Number(unit.floor);
  const size = Number(unit.size);
  const coOwnershipShare = Number(unit.coOwnershipShare);
  const constructionYear = Number(unit.constructionYear);
  const rooms = Number(unit.rooms);

  if (!unit.unitNumber.trim()) {
    errors.push(`${unitLabel}: Unit Number`);
  }
  if (!validTypes.includes(unit.type)) {
    errors.push(`${unitLabel}: Type`);
  }
  if (!Number.isInteger(floor)) {
    errors.push(`${unitLabel}: Floor`);
  }
  if (size <= 0) {
    errors.push(`${unitLabel}: Size`);
  }
  if (coOwnershipShare <= 0 || coOwnershipShare > 1) {
    errors.push(`${unitLabel}: Co-Ownership Share`);
  }
  if (!Number.isInteger(constructionYear) || constructionYear < 1000 || constructionYear > currentYear) {
    errors.push(`${unitLabel}: Construction Year`);
  }
  if (!Number.isInteger(rooms) || rooms < 0) {
    errors.push(`${unitLabel}: Rooms`);
  }
  return errors;
};

const isBuildingAddressValid = (building: BuildingPayload): boolean => {
  return (
    (building.street ?? '').trim().length > 0 &&
    (building.houseNumber ?? '').trim().length > 0 &&
    (building.city ?? '').trim().length > 0 &&
    (building.postalCode ?? '').trim().length > 0 &&
    (building.country ?? '').trim().length > 0
  );
};

const getBuildingAddressErrors = (building: BuildingPayload, buildingIndex: number): string[] => {
  const errors: string[] = [];
  const buildingLabel = `Building ${buildingIndex + 1}`;

  if (!(building.street ?? '').trim()) {
    errors.push(`${buildingLabel}: Street`);
  }
  if (!(building.houseNumber ?? '').trim()) {
    errors.push(`${buildingLabel}: House Number`);
  }
  if (!(building.city ?? '').trim()) {
    errors.push(`${buildingLabel}: City`);
  }
  if (!(building.postalCode ?? '').trim()) {
    errors.push(`${buildingLabel}: Postal Code`);
  }
  if (!(building.country ?? '').trim()) {
    errors.push(`${buildingLabel}: Country`);
  }
  return errors;
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

export const getStep2ValidationErrors = (payload: PropertyPayload): string[] => {
  const errors: string[] = [];
  if (payload.buildings.length === 0) {
    errors.push('At least one building is required');
    return errors;
  }

  payload.buildings.forEach((building, index) => {
    errors.push(...getBuildingAddressErrors(building, index));
  });

  return errors;
};

export const isStep3Valid = (payload: PropertyPayload): boolean => {
  if (payload.buildings.length === 0) return false;

  return payload.buildings.every(
    (b) => b.units.length >= 1 && b.units.every(isUnitValid)
  );
};

export const getStep3ValidationErrors = (payload: PropertyPayload): string[] => {
  const errors: string[] = [];
  if (payload.buildings.length === 0) {
    errors.push('At least one building is required');
    return errors;
  }

  payload.buildings.forEach((building, buildingIndex) => {
    const buildingLabel = `Building ${buildingIndex + 1}`;
    if (building.units.length === 0) {
      errors.push(`${buildingLabel}: At least one unit is required`);
    } else {
      building.units.forEach((unit, unitIndex) => {
        const unitErrors = getUnitValidationErrors(unit, unitIndex);
        errors.push(...unitErrors.map(e => `${buildingLabel} - ${e}`));
      });
    }
  });

  return errors;
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

export const useCurrentStepValidationErrors = () =>
  useWizardStore(
    useShallow((state) => {
      switch (state.activeStep) {
        case 0:
          return getStep1ValidationErrors(state.payload);
        case 1:
          return getStep2ValidationErrors(state.payload);
        case 2:
          return getStep3ValidationErrors(state.payload);
        default:
          return [];
      }
    })
  );
