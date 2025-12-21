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
import { useGeneralInfo, useUpdateGeneralInfo } from '../../wizardStore';
import type { ManagementType } from '../../wizardStore';

const PropertyDetailsForm: FC = () => {
  const generalInfo = useGeneralInfo();
  const updateGeneralInfo = useUpdateGeneralInfo();

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
            value={generalInfo.managementType}
            label="Management Type"
            onChange={(e) => updateGeneralInfo('managementType', e.target.value as ManagementType)}
          >
            <MenuItem value="WEG">WEG</MenuItem>
            <MenuItem value="MV">MV</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Property Name"
          value={generalInfo.name}
          onChange={(e) => updateGeneralInfo('name', e.target.value)}
          placeholder="e.g., Sonnenhof Residenz"
          fullWidth
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
        <TextField
          label="Property Manager"
          value={generalInfo.propertyManager}
          onChange={(e) => updateGeneralInfo('propertyManager', e.target.value)}
          placeholder="e.g., Anna Schmidt"
          fullWidth
        />

        <TextField
          label="Accountant"
          value={generalInfo.accountant}
          onChange={(e) => updateGeneralInfo('accountant', e.target.value)}
          placeholder="e.g., Klaus Fischer"
          fullWidth
        />
      </Box>
    </Box>
  );
};

export default memo(PropertyDetailsForm);
