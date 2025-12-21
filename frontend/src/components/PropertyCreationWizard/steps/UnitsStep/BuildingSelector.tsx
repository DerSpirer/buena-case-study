import type { FC } from 'react';
import { useCallback } from 'react';
import { Box, TextField, MenuItem, Button, Chip, alpha } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  useBuildings,
  useSelectedBuildingIndex,
  useSetSelectedBuildingIndex,
  useUnitActions,
} from '../../wizardStore';

const BuildingSelector: FC = () => {
  const buildings = useBuildings();
  const selectedBuildingIndex = useSelectedBuildingIndex();
  const setSelectedBuildingIndex = useSetSelectedBuildingIndex();
  const { addUnit, addMultipleUnits } = useUnitActions();

  const handleAddUnit = useCallback(() => {
    addUnit(selectedBuildingIndex);
  }, [addUnit, selectedBuildingIndex]);

  const handleAdd5 = useCallback(() => {
    addMultipleUnits(selectedBuildingIndex, 5);
  }, [addMultipleUnits, selectedBuildingIndex]);

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
      <TextField
        select
        label="Building"
        value={selectedBuildingIndex}
        onChange={(e) => setSelectedBuildingIndex(Number(e.target.value))}
        size="small"
        sx={{ minWidth: 240 }}
      >
        {buildings.map((building, index) => {
          const label =
            building.street && building.houseNumber
              ? `${building.street} ${building.houseNumber}`
              : `Building ${index + 1}`;

          return (
            <MenuItem key={index} value={index}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {label}
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
          );
        })}
      </TextField>

      <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
        <Button variant="outlined" size="small" onClick={handleAdd5} sx={{ whiteSpace: 'nowrap' }}>
          +5 Rows
        </Button>
        <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={handleAddUnit}>
          Add Unit
        </Button>
      </Box>
    </Box>
  );
};

export default BuildingSelector;
