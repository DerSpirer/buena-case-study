import { Chip, IconButton, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import DeleteIcon from '@mui/icons-material/Delete';
import type { PropertySummary } from '../../types/Property';

interface PropertyTableRowProps {
  property: PropertySummary;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
}

const PropertyTypeChip = ({ type }: { type: PropertySummary['managementType'] }) => {
  const isWEG = type === 'WEG';

  return (
    <Chip
      icon={isWEG ? <ApartmentIcon /> : <HomeWorkIcon />}
      label={type}
      size="small"
      color={isWEG ? 'primary' : 'secondary'}
      sx={{
        color: 'white',
        bgcolor: isWEG ? 'primary.main' : 'secondary.main',
        '& .MuiChip-icon': { color: 'white' },
      }}
    />
  );
};

const PropertyTableRow = ({ property, onClick, onDelete }: PropertyTableRowProps) => {
  // Use first 8 chars of UUID as display ID
  const shortId = property.id.slice(0, 8).toUpperCase();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    onDelete(property.id);
  };

  return (
    <TableRow
      hover
      onClick={() => onClick(property.id)}
      sx={{ cursor: 'pointer' }}
    >
      <TableCell>
        <Typography variant="bodyEmphasis">{property.name}</Typography>
      </TableCell>
      <TableCell>
        <PropertyTypeChip type={property.managementType} />
      </TableCell>
      <TableCell>
        <Typography variant="mono" color="text.secondary">
          {shortId}
        </Typography>
      </TableCell>
      <TableCell align="right" sx={{ width: 60 }}>
        <Tooltip title="Delete property">
          <IconButton
            size="small"
            color="error"
            onClick={handleDelete}
            sx={{
              opacity: 0.6,
              '&:hover': { opacity: 1 },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default PropertyTableRow;
