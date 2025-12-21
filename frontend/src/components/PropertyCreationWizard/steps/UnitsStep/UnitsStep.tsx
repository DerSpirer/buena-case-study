import type { FC } from 'react';
import { useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import DoorSlidingIcon from '@mui/icons-material/DoorSliding';
import { useBuildings, useSelectedBuildingIndex } from '../../wizardStore';
import EmptyBuildingsState from './EmptyBuildingsState';
import BuildingSelector from './BuildingSelector';
import UnitTableRow from './UnitTableRow';
import UnitTableEmptyState from './UnitTableEmptyState';

const UnitsStep: FC = () => {
  const buildings = useBuildings();
  const selectedBuildingIndex = useSelectedBuildingIndex();

  // Ensure selectedBuildingIndex is valid
  const validBuildingIndex =
    buildings.length > 0 ? Math.min(selectedBuildingIndex, buildings.length - 1) : 0;

  const selectedBuilding = buildings[validBuildingIndex];

  const totalUnits = useMemo(
    () => buildings.reduce((sum, building) => sum + building.units.length, 0),
    [buildings]
  );

  // If no buildings exist, show a message
  if (buildings.length === 0) {
    return <EmptyBuildingsState />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
            Unit Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add units to your buildings.
          </Typography>
        </Box>
        <Chip
          icon={<DoorSlidingIcon />}
          label={`${totalUnits} unit${totalUnits !== 1 ? 's' : ''} total`}
          color="primary"
          size="small"
          sx={{ fontWeight: 500 }}
        />
      </Box>

      {/* Building Selector & Actions */}
      <BuildingSelector />

      {/* Units Table */}
      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 90, py: 1.5 }}>Number</TableCell>
                <TableCell sx={{ width: 110, py: 1.5 }}>Type</TableCell>
                <TableCell sx={{ width: 70, py: 1.5 }}>Floor</TableCell>
                <TableCell sx={{ width: 80, py: 1.5 }}>Entrance</TableCell>
                <TableCell sx={{ width: 90, py: 1.5, whiteSpace: 'nowrap' }}>Size (m²)</TableCell>
                <TableCell sx={{ width: 70, py: 1.5 }}>Rooms</TableCell>
                <TableCell sx={{ width: 90, py: 1.5 }}>Share</TableCell>
                <TableCell sx={{ width: 90, py: 1.5 }}>Built</TableCell>
                <TableCell sx={{ width: 80, py: 1.5 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedBuilding?.units.length === 0 ? (
                <UnitTableEmptyState />
              ) : (
                selectedBuilding?.units.map((_, unitIndex) => (
                  <UnitTableRow
                    key={unitIndex}
                    buildingIndex={validBuildingIndex}
                    unitIndex={unitIndex}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default UnitsStep;
