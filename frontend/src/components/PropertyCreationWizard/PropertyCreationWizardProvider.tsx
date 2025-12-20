import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  PropertyCreationWizardContext,
  initialFormData,
} from './usePropertyCreationWizard';
import type { PropertyFormData } from './usePropertyCreationWizard';

export default function PropertyCreationWizardProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [activeStep, setActiveStep] = useState(0);

  const reset = () => {
    setFormData(initialFormData);
    setActiveStep(0);
  };

  return (
    <PropertyCreationWizardContext.Provider value={{ formData, setFormData, activeStep, setActiveStep, reset }}>
      {children}
    </PropertyCreationWizardContext.Provider>
  );
}

