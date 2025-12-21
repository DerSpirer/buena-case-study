import { Chip, TableCell, TableRow, Typography } from '@mui/material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import type { Property } from '../../types/Property';

interface PropertyTableRowProps {
  property: Property;
}

const PropertyTypeChip = ({ type }: { type: Property['managementType'] }) => {
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

const PropertyTableRow = ({ property }: PropertyTableRowProps) => {
  // Use first 8 chars of UUID as display ID
  const shortId = property.id.slice(0, 8).toUpperCase();

  return (
    <TableRow>
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
    </TableRow>
  );
};

export default PropertyTableRow;
