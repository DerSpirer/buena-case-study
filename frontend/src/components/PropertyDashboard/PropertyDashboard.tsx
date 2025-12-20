import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { mockProperties } from '../../data/mockProperties';
import PropertyTableRow from './PropertyTableRow';
import StatCard from './StatCard';
import PropertyCreationWizard from '../PropertyCreationWizard';

export default function PropertyDashboard() {
  const [wizardOpen, setWizardOpen] = useState(false);

  const handleCreateProperty = () => {
    setWizardOpen(true);
  };

  const handleCloseWizard = () => {
    setWizardOpen(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'background.gradient', py: 6, px: 4 }}>
      <Container>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 5 }}>
          <Box>
            <Typography variant="h3" color="text.primary" gutterBottom>
              Properties
            </Typography>
            <Typography color="text.secondary">
              Manage your property portfolio
            </Typography>
          </Box>

          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleCreateProperty}>
            Create Property
          </Button>
        </Box>

        {/* Stats Row */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, mb: 5 }}>
          <StatCard label="Total Properties" value={mockProperties.length} variant="primary" />
          <StatCard label="WEG Properties" value={mockProperties.filter((p) => p.type === 'WEG').length} variant="primary" />
          <StatCard label="MV Properties" value={mockProperties.filter((p) => p.type === 'MV').length} variant="secondary" />
        </Box>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Property Number</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockProperties.map((property) => (
                <PropertyTableRow key={property.id} property={property} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Property Creation Wizard */}
      <PropertyCreationWizard open={wizardOpen} onClose={handleCloseWizard} />
    </Box>
  );
}

