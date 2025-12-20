import type { FC } from 'react';
import { Box } from '@mui/material';
import DeclarationUpload from './DeclarationUpload';
import PropertyDetailsForm from './PropertyDetailsForm';

const GeneralInfoStep: FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <DeclarationUpload />
      <PropertyDetailsForm />
    </Box>
  );
};

export default GeneralInfoStep;
