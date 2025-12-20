import { useState } from 'react';
import {
  Box,
  Button,
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

interface PropertyCreationWizardProps {
  open: boolean;
  onClose: () => void;
}

const steps = [
  { label: 'General Info', description: 'Property details & documents' },
  { label: 'Building Data', description: 'Building addresses' },
  { label: 'Units', description: 'Apartments, offices & more' },
];

export default function PropertyCreationWizard({ open, onClose }: PropertyCreationWizardProps) {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Final step - submit
      handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    // TODO: Submit property creation
    console.log('Creating property...');
    handleClose();
  };

  const handleClose = () => {
    setActiveStep(0);
    onClose();
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
      {/* Header */}
      <Box
        sx={{
          px: 4,
          pt: 3,
          pb: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        {/* Title row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={600} color="text.primary">
              Create New Property
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {steps[activeStep].description}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={step.label} completed={index < activeStep}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    fontWeight: index === activeStep ? 600 : 400,
                    color: index === activeStep ? 'primary.main' : 'text.secondary',
                  },
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 4,
          py: 3,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={activeStep === 0}
          startIcon={<ArrowBackIcon />}
          sx={{
            visibility: activeStep === 0 ? 'hidden' : 'visible',
          }}
        >
          Back
        </Button>

        <Typography variant="body2" color="text.secondary">
          Step {activeStep + 1} of {steps.length}
        </Typography>

        <Button
          variant="contained"
          onClick={handleNext}
          endIcon={isLastStep ? <CheckIcon /> : <ArrowForwardIcon />}
        >
          {isLastStep ? 'Create Property' : 'Next'}
        </Button>
      </Box>
    </Dialog>
  );
}

