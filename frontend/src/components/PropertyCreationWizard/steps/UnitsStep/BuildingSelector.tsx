import { Box, TextField, MenuItem, Button, Chip, alpha } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type { BuildingFormData } from '../../usePropertyCreationWizard';

interface BuildingSelectorProps {
  buildings: BuildingFormData[];
  selectedBuildingIndex: number;
  onBuildingChange: (index: number) => void;
  onAddUnit: () => void;
  onAddMultipleUnits: (count: number) => void;
}

const getBuildingLabel = (building: BuildingFormData, index: number) => {
  return building.street && building.houseNumber
    ? `${building.street} ${building.houseNumber}`
    : `Building ${index + 1}`;
};

export default function BuildingSelector({
  buildings,
  selectedBuildingIndex,
  onBuildingChange,
  onAddUnit,
  onAddMultipleUnits,
}: BuildingSelectorProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
      <TextField
        select
        label="Building"
        value={selectedBuildingIndex}
        onChange={(e) => onBuildingChange(Number(e.target.value))}
        size="small"
        sx={{ minWidth: 240 }}
      >
        {buildings.map((building, index) => (
          <MenuItem key={index} value={index}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getBuildingLabel(building, index)}
              <Chip
                size="small"
                label={`${building.units.length}`}
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.15),
                }}
              />
            </Box>
          </MenuItem>
        ))}
      </TextField>

      <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => onAddMultipleUnits(5)}
          sx={{ whiteSpace: 'nowrap' }}
        >
          +5 Rows
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={onAddUnit}
        >
          Add Unit
        </Button>
      </Box>
    </Box>
  );
}

