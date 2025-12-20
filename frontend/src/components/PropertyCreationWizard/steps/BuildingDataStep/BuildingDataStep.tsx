import { useCallback } from 'react';
import { Box, Typography, Button, alpha } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { usePropertyCreationWizard } from '../../usePropertyCreationWizard';
import type { BuildingFormData } from '../../usePropertyCreationWizard';
import BuildingCard from './BuildingCard';

export default function BuildingDataStep() {
  const { formData, setFormData } = usePropertyCreationWizard();
  const { buildings } = formData;

  const addBuilding = useCallback(() => {
    const newBuilding: BuildingFormData = {
      street: '',
      houseNumber: '',
      city: '',
      postalCode: '',
      country: 'Germany',
      units: [],
    };

    setFormData((prev) => ({
      ...prev,
      buildings: [...prev.buildings, newBuilding],
    }));
  }, [setFormData]);

  const updateBuilding = useCallback(
    (index: number, field: keyof BuildingFormData, value: string) => {
      setFormData((prev) => ({
        ...prev,
        buildings: prev.buildings.map((building, i) =>
          i === index ? { ...building, [field]: value } : building
        ),
      }));
    },
    [setFormData]
  );

  const deleteBuilding = useCallback(
    (index: number) => {
      setFormData((prev) => ({
        ...prev,
        buildings: prev.buildings.filter((_, i) => i !== index),
      }));
    },
    [setFormData]
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box>
        <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
          Building Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add the buildings that belong to this property. Each building can contain multiple units.
        </Typography>
      </Box>

      {/* Building List or Empty State */}
      {buildings.length === 0 ? (
        <Box
          sx={{
            py: 6,
            px: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            borderRadius: 2,
            border: '2px dashed',
            borderColor: 'divider',
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.02),
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ApartmentIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" fontWeight={500} color="text.primary">
              No buildings added yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Start by adding the first building to your property
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addBuilding}
            sx={{ mt: 1 }}
          >
            Add First Building
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {buildings.map((building, index) => (
            <BuildingCard
              key={index}
              building={building}
              index={index}
              onUpdate={updateBuilding}
              onDelete={deleteBuilding}
            />
          ))}

          {/* Add More Button */}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addBuilding}
            sx={{
              py: 1.5,
              borderStyle: 'dashed',
              '&:hover': {
                borderStyle: 'dashed',
              },
            }}
          >
            Add Another Building
          </Button>
        </Box>
      )}
    </Box>
  );
}
