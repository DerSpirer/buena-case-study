import { Box, TableCell, TableRow, Typography } from '@mui/material';
import DoorSlidingIcon from '@mui/icons-material/DoorSliding';

export default function UnitTableEmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={9} sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            color: 'text.secondary',
          }}
        >
          <DoorSlidingIcon sx={{ fontSize: 28, opacity: 0.5 }} />
          <Typography variant="body2">
            No units in this building yet. Click "Add Unit" to start.
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
}

