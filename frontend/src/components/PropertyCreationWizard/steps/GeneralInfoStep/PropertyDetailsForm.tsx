import type { FC } from 'react';
import { memo } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { usePayload, useUpdatePayload } from '../../wizardStore';
import type { ManagementType } from '../../../../types/Property';

const PropertyDetailsForm: FC = () => {
  const payload = usePayload();
  const updatePayload = useUpdatePayload();

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
            value={payload.managementType}
            label="Management Type"
            onChange={(e) => updatePayload('managementType', e.target.value as ManagementType)}
          >
            <MenuItem value="WEG">WEG</MenuItem>
            <MenuItem value="MV">MV</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Property Name"
          value={payload.name}
          onChange={(e) => updatePayload('name', e.target.value)}
          placeholder="e.g., Sonnenhof Residenz"
          fullWidth
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
        <TextField
          label="Property Manager"
          value={payload.propertyManager}
          onChange={(e) => updatePayload('propertyManager', e.target.value)}
          placeholder="e.g., Anna Schmidt"
          fullWidth
        />

        <TextField
          label="Accountant"
          value={payload.accountant}
          onChange={(e) => updatePayload('accountant', e.target.value)}
          placeholder="e.g., Klaus Fischer"
          fullWidth
        />
      </Box>
    </Box>
  );
};

export default memo(PropertyDetailsForm);
