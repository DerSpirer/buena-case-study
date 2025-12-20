import type { FC } from 'react';
import { Box, Typography, alpha } from '@mui/material';
import { usePropertyCreationWizard } from '../../usePropertyCreationWizard';

const UnitTableFooter: FC = () => {
  const { formData, selectedBuildingIndex } = usePropertyCreationWizard();
  const building = formData.buildings[selectedBuildingIndex];
  const units = building?.units ?? [];

  if (units.length === 0) return null;

  const buildingLabel =
    building?.street && building?.houseNumber
      ? `${building.street} ${building.houseNumber}`
      : `Building ${selectedBuildingIndex + 1}`;

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
};

export default UnitTableFooter;
