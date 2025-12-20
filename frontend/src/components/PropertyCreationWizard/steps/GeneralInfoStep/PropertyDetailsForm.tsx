import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import type { GeneralInfoFormData, ManagementType } from '../../usePropertyCreationWizard';

interface PropertyDetailsFormProps {
  generalInfo: GeneralInfoFormData;
  onFieldChange: (field: keyof GeneralInfoFormData, value: string) => void;
}

export default function PropertyDetailsForm({ generalInfo, onFieldChange }: PropertyDetailsFormProps) {
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
            onChange={(e) => onFieldChange('managementType', e.target.value as ManagementType)}
          >
            <MenuItem value="WEG">WEG</MenuItem>
            <MenuItem value="MV">MV</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Property Name"
          value={generalInfo.name}
          onChange={(e) => onFieldChange('name', e.target.value)}
          placeholder="e.g., Sonnenhof Residenz"
          fullWidth
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
        <TextField
          label="Property Manager"
          value={generalInfo.propertyManager}
          onChange={(e) => onFieldChange('propertyManager', e.target.value)}
          placeholder="e.g., Anna Schmidt"
          fullWidth
        />

        <TextField
          label="Accountant"
          value={generalInfo.accountant}
          onChange={(e) => onFieldChange('accountant', e.target.value)}
          placeholder="e.g., Klaus Fischer"
          fullWidth
        />
      </Box>
    </Box>
  );
}

