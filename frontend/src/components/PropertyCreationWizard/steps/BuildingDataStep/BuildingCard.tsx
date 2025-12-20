import type { FC } from 'react';
import { memo, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Collapse,
  alpha,
} from '@mui/material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { usePropertyCreationWizard } from '../../usePropertyCreationWizard';
import type { CreateBuildingData } from '../../usePropertyCreationWizard';

interface BuildingCardProps {
  index: number;
}

const BuildingCard: FC<BuildingCardProps> = ({ index }) => {
  const { formData, setFormData } = usePropertyCreationWizard();
  const building = formData.buildings[index];
  const [isExpanded, setIsExpanded] = useState(true);

  const updateField = useCallback(
    (field: keyof CreateBuildingData, value: string) => {
      setFormData((prev) => ({
        ...prev,
        buildings: prev.buildings.map((b, i) => (i === index ? { ...b, [field]: value } : b)),
      }));
    },
    [setFormData, index]
  );

  const handleDelete = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      buildings: prev.buildings.filter((_, i) => i !== index),
    }));
  }, [setFormData, index]);

  if (!building) return null;

  const displayAddress =
    building.street && building.houseNumber
      ? `${building.street} ${building.houseNumber}`
      : `Building ${index + 1}`;

  return (
    <Paper
      sx={{
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease',
        '&:hover': {
          boxShadow: (theme) => `0 4px 20px ${alpha(theme.palette.primary.main, 0.12)}`,
        },
      }}
    >
      {/* Header */}
      <Box
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{
          px: 2.5,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          cursor: 'pointer',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.03),
          borderBottom: isExpanded ? 1 : 0,
          borderColor: 'divider',
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
          },
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ApartmentIcon sx={{ color: 'primary.main', fontSize: 22 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body1" fontWeight={600} color="text.primary">
            {displayAddress}
          </Typography>
          {building.city && (
            <Typography variant="body2" color="text.secondary">
              {[building.postalCode, building.city, building.country].filter(Boolean).join(', ')}
            </Typography>
          )}
        </Box>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              color: 'error.main',
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
            },
          }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" sx={{ color: 'text.secondary' }}>
          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Collapsible Form */}
      <Collapse in={isExpanded}>
        <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Street & House Number Row */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr' }, gap: 2 }}>
            <TextField
              label="Street"
              value={building.street}
              onChange={(e) => updateField('street', e.target.value)}
              placeholder="e.g., Musterstraße"
              fullWidth
              size="small"
            />
            <TextField
              label="House Number"
              value={building.houseNumber}
              onChange={(e) => updateField('houseNumber', e.target.value)}
              placeholder="e.g., 42a"
              fullWidth
              size="small"
            />
          </Box>

          {/* Postal Code & City Row */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 2fr' }, gap: 2 }}>
            <TextField
              label="Postal Code"
              value={building.postalCode}
              onChange={(e) => updateField('postalCode', e.target.value)}
              placeholder="e.g., 10115"
              fullWidth
              size="small"
            />
            <TextField
              label="City"
              value={building.city}
              onChange={(e) => updateField('city', e.target.value)}
              placeholder="e.g., Berlin"
              fullWidth
              size="small"
            />
          </Box>

          {/* Country Row */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Country"
              value={building.country}
              onChange={(e) => updateField('country', e.target.value)}
              placeholder="e.g., Germany"
              fullWidth
              size="small"
            />
          </Box>

          {/* Units summary */}
          <Box
            sx={{
              mt: 1,
              p: 1.5,
              borderRadius: 1,
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.06),
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Units: {building.units.length}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
              Add units in the next step
            </Typography>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default memo(BuildingCard);
