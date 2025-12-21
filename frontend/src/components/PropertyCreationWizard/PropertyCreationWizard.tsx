import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import GeneralInfoStep from './steps/GeneralInfoStep';
import BuildingDataStep from './steps/BuildingDataStep';
import UnitsStep from './steps/UnitsStep';
import {
  useActiveStep,
  useSetActiveStep,
  useReset,
  useIsCurrentStepValid,
  usePayload,
  useEditingPropertyId,
  useIsEditMode,
} from './wizardStore';
import type { ManagementType } from '../../types/Property';
import { propertyApi } from '../../api/propertyApi';

interface PropertyCreationWizardProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (wasEdit: boolean) => void;
}

const steps = [
  { label: 'General Info', description: 'Property details & documents' },
  { label: 'Building Data', description: 'Building addresses' },
  { label: 'Units', description: 'Apartments, offices & more' },
];

const WizardContent = ({ onClose, onSuccess }: { onClose: () => void; onSuccess?: (wasEdit: boolean) => void }) => {
  const activeStep = useActiveStep();
  const setActiveStep = useSetActiveStep();
  const reset = useReset();
  const isCurrentStepValid = useIsCurrentStepValid();
  const payload = usePayload();
  const editingPropertyId = useEditingPropertyId();
  const isEditMode = useIsEditMode();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Ensure managementType is valid before sending
      const apiPayload = {
        ...payload,
        managementType: payload.managementType as ManagementType,
      };

      if (isEditMode && editingPropertyId) {
        await propertyApi.update(editingPropertyId, apiPayload);
      } else {
        await propertyApi.create(apiPayload);
      }
      handleSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : `Failed to ${isEditMode ? 'update' : 'create'} property`;
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSuccess = () => {
    const wasEdit = isEditMode;
    reset();
    onSuccess?.(wasEdit);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <GeneralInfoStep />;
      case 1:
        return <BuildingDataStep />;
      case 2:
        return <UnitsStep />;
      default:
        return null;
    }
  };

  const isLastStep = activeStep === steps.length - 1;
  const dialogTitle = isEditMode ? 'Edit Property' : 'Create New Property';
  const submitButtonText = isEditMode
    ? isSubmitting
      ? 'Saving...'
      : 'Save Changes'
    : isSubmitting
    ? 'Creating...'
    : 'Create Property';

  return (
    <>
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1.5,
          }}
        >
          <Typography variant="h6" fontWeight={600} color="text.primary">
            {dialogTitle}
          </Typography>
          <IconButton onClick={handleClose} size="small" sx={{ color: 'text.secondary', p: 0.5 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Stepper
          activeStep={activeStep}
          sx={{
            '& .MuiStepConnector-line': { borderTopWidth: 1 },
            '& .MuiStepIcon-root': { width: 20, height: 20, fontSize: '0.75rem' },
            '& .MuiStepConnector-root': { top: 10 },
          }}
        >
          {steps.map((step, index) => (
            <Step key={step.label} completed={index < activeStep}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    fontSize: '0.8125rem',
                    fontWeight: index === activeStep ? 600 : 400,
                    color: index === activeStep ? 'primary.main' : 'text.secondary',
                  },
                  '& .MuiStepLabel-iconContainer': { pr: 1 },
                }}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Content */}
      <DialogContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 4,
          overflow: 'auto',
          bgcolor: 'background.paper',
        }}
      >
        {renderStepContent()}
      </DialogContent>

      {/* Footer */}
      <Box
        sx={{
          px: 2.5,
          py: 1,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 1 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={handleBack}
            disabled={activeStep === 0 || isSubmitting}
            startIcon={<ArrowBackIcon fontSize="small" />}
            sx={{ visibility: activeStep === 0 ? 'hidden' : 'visible' }}
          >
            Back
          </Button>

          <Typography variant="caption" color="text.secondary">
            Step {activeStep + 1} of {steps.length}
          </Typography>

          <Button
            variant="contained"
            size="small"
            onClick={handleNext}
            disabled={!isCurrentStepValid || isSubmitting}
            endIcon={
              isSubmitting ? (
                <CircularProgress size={16} color="inherit" />
              ) : isLastStep ? (
                <CheckIcon fontSize="small" />
              ) : (
                <ArrowForwardIcon fontSize="small" />
              )
            }
          >
            {isLastStep ? submitButtonText : 'Next'}
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default function PropertyCreationWizard({ open, onClose, onSuccess }: PropertyCreationWizardProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            minHeight: '70vh',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column' as const,
          },
        },
      }}
    >
      <WizardContent onClose={onClose} onSuccess={onSuccess} />
    </Dialog>
  );
}
