import { Box, Typography, alpha } from '@mui/material';
import type { UnitFormData } from '../../usePropertyCreationWizard';

interface UnitTableFooterProps {
  units: UnitFormData[];
  buildingLabel: string;
}

export default function UnitTableFooter({ units, buildingLabel }: UnitTableFooterProps) {
  if (units.length === 0) return null;

  const totalSize = units.reduce((sum, u) => sum + u.size, 0);
  const totalShare = units.reduce((sum, u) => sum + u.coOwnershipShare, 0);

  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
        display: 'flex',
        gap: 3,
        flexWrap: 'wrap',
      }}
    >
      <Typography variant="caption" color="text.secondary">
        <strong>{units.length}</strong> units in {buildingLabel}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Total size: <strong>{totalSize.toFixed(1)}</strong> m²
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Total share: <strong>{totalShare.toFixed(2)}</strong>%
      </Typography>
    </Box>
  );
}

