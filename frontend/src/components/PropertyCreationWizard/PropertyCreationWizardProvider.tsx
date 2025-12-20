import { useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import {
  PropertyCreationWizardContext,
  initialFormData,
} from './usePropertyCreationWizard';
import type { CreatePropertyData } from './usePropertyCreationWizard';

export default function PropertyCreationWizardProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<CreatePropertyData>(initialFormData);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedBuildingIndex, setSelectedBuildingIndex] = useState(0);

  const reset = useCallback(() => {
    setFormData(initialFormData);
    setActiveStep(0);
    setSelectedBuildingIndex(0);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      formData,
      setFormData,
      activeStep,
      setActiveStep,
      selectedBuildingIndex,
      setSelectedBuildingIndex,
      reset,
    }),
    [formData, activeStep, selectedBuildingIndex, reset]
  );

  return (
    <PropertyCreationWizardContext.Provider value={contextValue}>
      {children}
    </PropertyCreationWizardContext.Provider>
  );
}

