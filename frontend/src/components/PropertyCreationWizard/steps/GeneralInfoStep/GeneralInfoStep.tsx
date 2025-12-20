import { useCallback } from 'react';
import { Box } from '@mui/material';
import { usePropertyCreationWizard } from '../../usePropertyCreationWizard';
import DeclarationUpload from './DeclarationUpload';
import PropertyDetailsForm from './PropertyDetailsForm';

export default function GeneralInfoStep() {
  const { formData, setFormData } = usePropertyCreationWizard();
  const { generalInfo } = formData;

  const updateGeneralInfo = useCallback(
    (field: keyof typeof generalInfo, value: string) => {
      setFormData((prev) => ({
        ...prev,
        generalInfo: {
          ...prev.generalInfo,
          [field]: value,
        },
      }));
    },
    [setFormData]
  );

  const handleFileChange = (fileName: string) => {
    updateGeneralInfo('declarationFilePath', fileName);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <DeclarationUpload onFileChange={handleFileChange} />
      <PropertyDetailsForm generalInfo={generalInfo} onFieldChange={updateGeneralInfo} />
    </Box>
  );
}
