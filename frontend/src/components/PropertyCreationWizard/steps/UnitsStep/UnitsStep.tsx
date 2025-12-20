import { useCallback, useState, useMemo } from 'react';
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
import { usePropertyCreationWizard } from '../../usePropertyCreationWizard';
import type { UnitFormData, UnitType } from '../../usePropertyCreationWizard';
import EmptyBuildingsState from './EmptyBuildingsState';
import BuildingSelector from './BuildingSelector';
import UnitTableRow from './UnitTableRow';
import UnitTableEmptyState from './UnitTableEmptyState';
import UnitTableFooter from './UnitTableFooter';

const createEmptyUnit = (): UnitFormData => ({
  unitNumber: '',
  type: 'Apartment' as UnitType,
  floor: 0,
  entrance: '',
  size: 0,
  coOwnershipShare: 0,
  constructionYear: new Date().getFullYear(),
  rooms: 0,
});

export default function UnitsStep() {
  const { formData, setFormData } = usePropertyCreationWizard();
  const { buildings } = formData;
  const [selectedBuildingIndex, setSelectedBuildingIndex] = useState<number>(0);

  // Ensure selectedBuildingIndex is valid
  const validBuildingIndex = buildings.length > 0 
    ? Math.min(selectedBuildingIndex, buildings.length - 1) 
    : 0;

  const selectedBuilding = buildings[validBuildingIndex];

  const totalUnits = useMemo(
    () => buildings.reduce((sum, building) => sum + building.units.length, 0),
    [buildings]
  );

  const getBuildingLabel = useCallback((index: number) => {
    const building = buildings[index];
    return building.street && building.houseNumber
      ? `${building.street} ${building.houseNumber}`
      : `Building ${index + 1}`;
  }, [buildings]);

  const addUnit = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      buildings: prev.buildings.map((building, i) =>
        i === validBuildingIndex 
          ? { ...building, units: [...building.units, createEmptyUnit()] } 
          : building
      ),
    }));
  }, [setFormData, validBuildingIndex]);

  const addMultipleUnits = useCallback((count: number) => {
    const newUnits = Array.from({ length: count }, createEmptyUnit);

    setFormData((prev) => ({
      ...prev,
      buildings: prev.buildings.map((building, i) =>
        i === validBuildingIndex 
          ? { ...building, units: [...building.units, ...newUnits] } 
          : building
      ),
    }));
  }, [setFormData, validBuildingIndex]);

  const duplicateUnit = useCallback((unitIndex: number) => {
    const unitToDuplicate = selectedBuilding?.units[unitIndex];
    if (!unitToDuplicate) return;

    const duplicatedUnit: UnitFormData = {
      ...unitToDuplicate,
      unitNumber: '', // Clear unit number for the duplicate
    };

    setFormData((prev) => ({
      ...prev,
      buildings: prev.buildings.map((building, i) =>
        i === validBuildingIndex
          ? { ...building, units: [...building.units, duplicatedUnit] }
          : building
      ),
    }));
  }, [setFormData, validBuildingIndex, selectedBuilding]);

  const updateUnit = useCallback(
    (unitIndex: number, field: keyof UnitFormData, value: string | number) => {
      setFormData((prev) => ({
        ...prev,
        buildings: prev.buildings.map((building, bIdx) =>
          bIdx === validBuildingIndex
            ? {
                ...building,
                units: building.units.map((unit, uIdx) =>
                  uIdx === unitIndex ? { ...unit, [field]: value } : unit
                ),
              }
            : building
        ),
      }));
    },
    [setFormData, validBuildingIndex]
  );

  const deleteUnit = useCallback(
    (unitIndex: number) => {
      setFormData((prev) => ({
        ...prev,
        buildings: prev.buildings.map((building, bIdx) =>
          bIdx === validBuildingIndex
            ? {
                ...building,
                units: building.units.filter((_, uIdx) => uIdx !== unitIndex),
              }
            : building
        ),
      }));
    },
    [setFormData, validBuildingIndex]
  );

  // If no buildings exist, show a message
  if (buildings.length === 0) {
    return <EmptyBuildingsState />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
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
      <BuildingSelector
        buildings={buildings}
        selectedBuildingIndex={validBuildingIndex}
        onBuildingChange={setSelectedBuildingIndex}
        onAddUnit={addUnit}
        onAddMultipleUnits={addMultipleUnits}
      />

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
                <TableCell sx={{ width: 90, py: 1.5 }}>Size (m²)</TableCell>
                <TableCell sx={{ width: 70, py: 1.5 }}>Rooms</TableCell>
                <TableCell sx={{ width: 90, py: 1.5 }}>Share (%)</TableCell>
                <TableCell sx={{ width: 90, py: 1.5 }}>Built</TableCell>
                <TableCell sx={{ width: 80, py: 1.5 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedBuilding?.units.length === 0 ? (
                <UnitTableEmptyState />
              ) : (
                selectedBuilding?.units.map((unit, unitIndex) => (
                  <UnitTableRow
                    key={unitIndex}
                    unit={unit}
                    unitIndex={unitIndex}
                    onUpdate={updateUnit}
                    onDuplicate={duplicateUnit}
                    onDelete={deleteUnit}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Quick summary footer */}
        {selectedBuilding && (
          <UnitTableFooter
            units={selectedBuilding.units}
            buildingLabel={getBuildingLabel(validBuildingIndex)}
          />
        )}
      </Paper>
    </Box>
  );
}
