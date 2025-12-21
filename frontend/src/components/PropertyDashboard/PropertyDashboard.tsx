import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  CircularProgress,
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
import { propertyApi } from '../../api/propertyApi';
import type { PropertySummary } from '../../types/Property';
import PropertyTableRow from './PropertyTableRow';
import StatCard from './StatCard';
import PropertyCreationWizard from '../PropertyCreationWizard';
import { useLoadProperty, useReset } from '../PropertyCreationWizard/wizardStore';

const PropertyDashboard = () => {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [properties, setProperties] = useState<PropertySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProperty, setIsLoadingProperty] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProperty = useLoadProperty();
  const reset = useReset();

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await propertyApi.getAll();
      setProperties(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch properties';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleCreateProperty = () => {
    reset(); // Ensure we're in create mode
    setWizardOpen(true);
  };

  const handlePropertyClick = async (id: string) => {
    setIsLoadingProperty(true);
    try {
      const property = await propertyApi.getById(id);
      loadProperty(property);
      setWizardOpen(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load property';
      setError(message);
    } finally {
      setIsLoadingProperty(false);
    }
  };

  const handleCloseWizard = () => {
    setWizardOpen(false);
  };

  const handleWizardSuccess = () => {
    setWizardOpen(false);
    fetchProperties();
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
          <StatCard label="Total Properties" value={properties.length} variant="primary" />
          <StatCard label="WEG Properties" value={properties.filter((p) => p.managementType === 'WEG').length} variant="primary" />
          <StatCard label="MV Properties" value={properties.filter((p) => p.managementType === 'MV').length} variant="secondary" />
        </Box>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Unique Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading || isLoadingProperty ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={32} />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <Typography color="error">{error}</Typography>
                  </TableCell>
                </TableRow>
              ) : properties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No properties yet. Create your first property!</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                properties.map((property) => (
                  <PropertyTableRow
                    key={property.id}
                    property={property}
                    onClick={handlePropertyClick}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Property Creation Wizard */}
      <PropertyCreationWizard open={wizardOpen} onClose={handleCloseWizard} onSuccess={handleWizardSuccess} />
    </Box>
  );
};

export default PropertyDashboard;
