import type { FC } from 'react';
import { memo, useCallback } from 'react';
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
import { useUnit, useUnitActions } from '../../wizardStore';
import type { UnitPayload, UnitType } from '../../../../types/Property';

const unitTypeOptions: UnitType[] = ['Apartment', 'Office', 'Garden', 'Parking'];

interface UnitTableRowProps {
  buildingIndex: number;
  unitIndex: number;
}

const UnitTableRow: FC<UnitTableRowProps> = ({ buildingIndex, unitIndex }) => {
  const unit = useUnit(buildingIndex, unitIndex);
  const { updateUnit, duplicateUnit, deleteUnit } = useUnitActions();

  const handleUpdateField = useCallback(
    (field: keyof UnitPayload, value: string | number) => {
      updateUnit(buildingIndex, unitIndex, field, value as never);
    },
    [updateUnit, buildingIndex, unitIndex]
  );

  const handleDuplicate = useCallback(() => {
    duplicateUnit(buildingIndex, unitIndex);
  }, [duplicateUnit, buildingIndex, unitIndex]);

  const handleDelete = useCallback(() => {
    deleteUnit(buildingIndex, unitIndex);
  }, [deleteUnit, buildingIndex, unitIndex]);

  const handleNumberChange = (field: keyof UnitPayload, value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    handleUpdateField(field, numValue);
  };

  if (!unit) return null;

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
          value={unit.unitNumber ?? ''}
          onChange={(e) => handleUpdateField('unitNumber', e.target.value)}
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
          value={unit.type ?? 'Apartment'}
          onChange={(e) => handleUpdateField('type', e.target.value as UnitType)}
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
          value={unit.floor ?? 0}
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
          value={unit.entrance ?? ''}
          onChange={(e) => handleUpdateField('entrance', e.target.value)}
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
          value={unit.size ?? ''}
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
          value={unit.rooms ?? 0}
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
          value={unit.coOwnershipShare ?? ''}
          onChange={(e) => handleNumberChange('coOwnershipShare', e.target.value)}
          placeholder="0.00"
          size="small"
          variant="standard"
          fullWidth
          InputProps={{
            disableUnderline: true,
            inputProps: { min: 0, max: 1, step: 0.0001 },
          }}
          sx={inputSx}
        />
      </TableCell>
      <TableCell sx={{ py: 0.75 }}>
        <TextField
          type="number"
          value={unit.constructionYear ?? ''}
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
              onClick={handleDuplicate}
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
              onClick={handleDelete}
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
};

export default memo(UnitTableRow);
