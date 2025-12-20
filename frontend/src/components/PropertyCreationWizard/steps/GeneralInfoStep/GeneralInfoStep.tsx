import { useCallback, useRef, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  IconButton,
  alpha,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { usePropertyCreationWizard, type ManagementType } from '../../usePropertyCreationWizard';

export default function GeneralInfoStep() {
  const { formData, setFormData } = usePropertyCreationWizard();
  const { generalInfo } = formData;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const updateGeneralInfo = useCallback(
    (field: keyof typeof generalInfo, value: string) => {
      setFormData((prev) => ({
        ...prev,
        generalInfo: {
          ...prev.generalInfo,
          [field]: value,
        },
      }));
    },
    [setFormData]
  );

  const handleFileChange = (file: File | null) => {
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      updateGeneralInfo('declarationFilePath', file.name);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0] || null;
    handleFileChange(file);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    updateGeneralInfo('declarationFilePath', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* File Upload Section */}
      <Box>
        <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
          Declaration of Division
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Upload the Teilungserklärung to automatically extract property details
        </Typography>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />

        {!uploadedFile ? (
          <Paper
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
            sx={{
              p: 4,
              border: '2px dashed',
              borderColor: isDragOver ? 'primary.main' : 'divider',
              bgcolor: (theme) =>
                isDragOver
                  ? alpha(theme.palette.primary.main, 0.04)
                  : 'background.paperLight',
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              '&:hover': {
                borderColor: 'primary.light',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02),
              },
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 28, color: 'primary.main' }} />
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" fontWeight={500} color="text.primary">
                Drop your PDF here or click to browse
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Supports PDF files up to 10MB
              </Typography>
            </Box>
          </Paper>
        ) : (
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.04),
              borderColor: 'secondary.main',
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 1,
                bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <InsertDriveFileIcon sx={{ color: 'secondary.main' }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                fontWeight={500}
                color="text.primary"
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {uploadedFile.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {(uploadedFile.size / 1024).toFixed(1)} KB
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AutoAwesomeIcon />}
              sx={{ mr: 1 }}
            >
              Extract with AI
            </Button>
            <IconButton size="small" onClick={handleRemoveFile} sx={{ color: 'text.secondary' }}>
              <DeleteOutlineIcon />
            </IconButton>
          </Paper>
        )}
      </Box>

      {/* Form Fields */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h6" fontWeight={600} color="text.primary">
          Property Details
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="management-type-label">Management Type</InputLabel>
            <Select
              labelId="management-type-label"
              value={generalInfo.managementType}
              label="Management Type"
              onChange={(e) => updateGeneralInfo('managementType', e.target.value as ManagementType)}
            >
              <MenuItem value="WEG">WEG</MenuItem>
              <MenuItem value="MV">MV</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Property Name"
            value={generalInfo.name}
            onChange={(e) => updateGeneralInfo('name', e.target.value)}
            placeholder="e.g., Sonnenhof Residenz"
            fullWidth
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
          <TextField
            label="Property Manager"
            value={generalInfo.propertyManager}
            onChange={(e) => updateGeneralInfo('propertyManager', e.target.value)}
            placeholder="e.g., Anna Schmidt"
            fullWidth
          />

          <TextField
            label="Accountant"
            value={generalInfo.accountant}
            onChange={(e) => updateGeneralInfo('accountant', e.target.value)}
            placeholder="e.g., Klaus Fischer"
            fullWidth
          />
        </Box>
      </Box>
    </Box>
  );
}

