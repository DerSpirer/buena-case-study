import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<PropertySummary | null>(null);

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

  const handleDeleteClick = (id: string) => {
    const property = properties.find((p) => p.id === id);
    if (property) {
      setPropertyToDelete(property);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPropertyToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!propertyToDelete) return;

    setDeleteDialogOpen(false);
    setIsLoading(true);
    try {
      await propertyApi.delete(propertyToDelete.id);
      setPropertyToDelete(null);
      await fetchProperties();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete property';
      setError(message);
      setIsLoading(false);
    }
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
        <Box sx={{ position: 'relative' }}>
          <TableContainer
            component={Paper}
            sx={{
              opacity: isLoading || isLoadingProperty ? 0.5 : 1,
              pointerEvents: isLoading || isLoadingProperty ? 'none' : 'auto',
              transition: 'opacity 0.2s ease',
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Unique Number</TableCell>
                  <TableCell align="right" sx={{ width: 60 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {error ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography color="error">{error}</Typography>
                    </TableCell>
                  </TableRow>
                ) : properties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No properties yet. Create your first property!</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  properties.map((property) => (
                    <PropertyTableRow
                      key={property.id}
                      property={property}
                      onClick={handlePropertyClick}
                      onDelete={handleDeleteClick}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Loading overlay */}
          {(isLoading || isLoadingProperty) && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress size={40} />
            </Box>
          )}
        </Box>
      </Container>

      {/* Property Creation Wizard */}
      <PropertyCreationWizard open={wizardOpen} onClose={handleCloseWizard} onSuccess={handleWizardSuccess} />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Property</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{propertyToDelete?.name}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PropertyDashboard;
