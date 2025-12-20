import {
  Box,
  TableCell,
  TableRow,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  alpha,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import type { UnitFormData, UnitType } from '../../usePropertyCreationWizard';

const unitTypeOptions: UnitType[] = ['Apartment', 'Office', 'Garden', 'Parking'];

interface UnitTableRowProps {
  unit: UnitFormData;
  unitIndex: number;
  onUpdate: (unitIndex: number, field: keyof UnitFormData, value: string | number) => void;
  onDuplicate: (unitIndex: number) => void;
  onDelete: (unitIndex: number) => void;
}

export default function UnitTableRow({
  unit,
  unitIndex,
  onUpdate,
  onDuplicate,
  onDelete,
}: UnitTableRowProps) {
  const handleNumberChange = (field: keyof UnitFormData, value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    onUpdate(unitIndex, field, numValue);
  };

  const inputSx = {
    '& .MuiInputBase-input': {
      py: 0.5,
      fontSize: '0.875rem',
    },
  };

  return (
    <TableRow
      sx={{
        '&:hover': {
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
        },
      }}
    >
      <TableCell sx={{ py: 0.75 }}>
        <TextField
          value={unit.unitNumber}
          onChange={(e) => onUpdate(unitIndex, 'unitNumber', e.target.value)}
          placeholder="A101"
          size="small"
          variant="standard"
          fullWidth
          InputProps={{ disableUnderline: true }}
          sx={inputSx}
        />
      </TableCell>
      <TableCell sx={{ py: 0.75 }}>
        <TextField
          select
          value={unit.type}
          onChange={(e) => onUpdate(unitIndex, 'type', e.target.value as UnitType)}
          size="small"
          variant="standard"
          fullWidth
          InputProps={{ disableUnderline: true }}
          sx={inputSx}
        >
          {unitTypeOptions.map((type) => (
            <MenuItem key={type} value={type} sx={{ fontSize: '0.875rem' }}>
              {type}
            </MenuItem>
          ))}
        </TextField>
      </TableCell>
      <TableCell sx={{ py: 0.75 }}>
        <TextField
          type="number"
          value={unit.floor || ''}
          onChange={(e) => handleNumberChange('floor', e.target.value)}
          placeholder="0"
          size="small"
          variant="standard"
          fullWidth
          InputProps={{
            disableUnderline: true,
            inputProps: { min: -5, max: 100 },
          }}
          sx={inputSx}
        />
      </TableCell>
      <TableCell sx={{ py: 0.75 }}>
        <TextField
          value={unit.entrance}
          onChange={(e) => onUpdate(unitIndex, 'entrance', e.target.value)}
          placeholder="A"
          size="small"
          variant="standard"
          fullWidth
          InputProps={{ disableUnderline: true }}
          sx={inputSx}
        />
      </TableCell>
      <TableCell sx={{ py: 0.75 }}>
        <TextField
          type="number"
          value={unit.size || ''}
          onChange={(e) => handleNumberChange('size', e.target.value)}
          placeholder="0"
          size="small"
          variant="standard"
          fullWidth
          InputProps={{
            disableUnderline: true,
            inputProps: { min: 0, step: 0.1 },
          }}
          sx={inputSx}
        />
      </TableCell>
      <TableCell sx={{ py: 0.75 }}>
        <TextField
          type="number"
          value={unit.rooms || ''}
          onChange={(e) => handleNumberChange('rooms', e.target.value)}
          placeholder="0"
          size="small"
          variant="standard"
          fullWidth
          InputProps={{
            disableUnderline: true,
            inputProps: { min: 0, max: 50 },
          }}
          sx={inputSx}
        />
      </TableCell>
      <TableCell sx={{ py: 0.75 }}>
        <TextField
          type="number"
          value={unit.coOwnershipShare || ''}
          onChange={(e) => handleNumberChange('coOwnershipShare', e.target.value)}
          placeholder="0"
          size="small"
          variant="standard"
          fullWidth
          InputProps={{
            disableUnderline: true,
            inputProps: { min: 0, max: 100, step: 0.01 },
          }}
          sx={inputSx}
        />
      </TableCell>
      <TableCell sx={{ py: 0.75 }}>
        <TextField
          type="number"
          value={unit.constructionYear || ''}
          onChange={(e) => handleNumberChange('constructionYear', e.target.value)}
          placeholder="2024"
          size="small"
          variant="standard"
          fullWidth
          InputProps={{
            disableUnderline: true,
            inputProps: { min: 1800, max: new Date().getFullYear() },
          }}
          sx={inputSx}
        />
      </TableCell>
      <TableCell sx={{ py: 0.75 }} align="center">
        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
          <Tooltip title="Duplicate unit">
            <IconButton
              size="small"
              onClick={() => onDuplicate(unitIndex)}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              <ContentCopyIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete unit">
            <IconButton
              size="small"
              onClick={() => onDelete(unitIndex)}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'error.main',
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                },
              }}
            >
              <DeleteOutlineIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
}

