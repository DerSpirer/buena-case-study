import type { FC } from 'react';
import { useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { usePropertyCreationWizard } from '../../usePropertyCreationWizard';
import type { CreatePropertyData, ManagementType } from '../../usePropertyCreationWizard';

const PropertyDetailsForm: FC = () => {
  const { formData, setFormData } = usePropertyCreationWizard();

  const updateField = useCallback(
    <K extends keyof CreatePropertyData>(field: K, value: CreatePropertyData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [setFormData]
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6" fontWeight={600} color="text.primary">
        Property Details
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="management-type-label">Management Type</InputLabel>
          <Select
            labelId="management-type-label"
            value={formData.managementType}
            label="Management Type"
            onChange={(e) => updateField('managementType', e.target.value as ManagementType)}
          >
            <MenuItem value="WEG">WEG</MenuItem>
            <MenuItem value="MV">MV</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Property Name"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="e.g., Sonnenhof Residenz"
          fullWidth
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
        <TextField
          label="Property Manager"
          value={formData.propertyManager}
          onChange={(e) => updateField('propertyManager', e.target.value)}
          placeholder="e.g., Anna Schmidt"
          fullWidth
        />

        <TextField
          label="Accountant"
          value={formData.accountant}
          onChange={(e) => updateField('accountant', e.target.value)}
          placeholder="e.g., Klaus Fischer"
          fullWidth
        />
      </Box>
    </Box>
  );
};

export default PropertyDetailsForm;
