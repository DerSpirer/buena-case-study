import type { FC } from 'react';
import { Box, Typography, alpha } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const EmptyBuildingsState: FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
          Unit Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add units (apartments, offices, gardens, parking spaces) to your buildings.
        </Typography>
      </Box>

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
          borderColor: 'warning.main',
          bgcolor: (theme) => alpha(theme.palette.warning.main, 0.04),
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <WarningAmberIcon sx={{ fontSize: 32, color: 'warning.main' }} />
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1" fontWeight={500} color="text.primary">
            No buildings available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Please add at least one building in the previous step before adding units.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default EmptyBuildingsState;

