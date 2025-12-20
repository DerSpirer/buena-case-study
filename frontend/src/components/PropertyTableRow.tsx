import { Chip, TableCell, TableRow, Typography } from '@mui/material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import type { Property } from '../types/Property';

interface PropertyTableRowProps {
  property: Property;
}

function PropertyTypeChip({ type }: { type: Property['type'] }) {
  const isWEG = type === 'WEG';

  return (
    <Chip
      icon={isWEG ? <ApartmentIcon /> : <HomeWorkIcon />}
      label={type}
      size="small"
      color={isWEG ? 'primary' : 'secondary'}
    />
  );
}

export default function PropertyTableRow({ property }: PropertyTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <Typography variant="mono" color="grey.300">
          {property.uniqueNumber}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="bodyEmphasis">{property.name}</Typography>
      </TableCell>
      <TableCell>
        <PropertyTypeChip type={property.type} />
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {property.address}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

