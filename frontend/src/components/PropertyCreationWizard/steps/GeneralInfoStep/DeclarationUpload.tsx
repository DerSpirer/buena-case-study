import type { FC } from 'react';
import { memo, useRef, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  alpha,
  CircularProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useUpdatePayload, useSetExtractedData, usePayloadField } from '../../wizardStore';
import { propertyApi } from '../../../../api/propertyApi';
import { useSnackbar } from '../../../Snackbar';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';
type ExtractionStatus = 'idle' | 'extracting' | 'success' | 'error';

/**
 * Extract original filename from the stored filename.
 * Format: {originalName}-{timestamp}-{random}.{ext}
 * Removes the prefix before the first underscore and the timestamp/random suffix.
 */
const getDisplayFileName = (storedFileName: string): string => {
  if (!storedFileName) return '';
  
  // The format is: test_{originalName}-{timestamp}-{random}.{ext}
  // We want to extract just {originalName}.{ext}
  // Remove 'test_' prefix if present
  const withoutPrefix = storedFileName.startsWith('test_') ? storedFileName.slice(5) : storedFileName;
  
  // Find the last extension
  const lastDotIndex = withoutPrefix.lastIndexOf('.');
  if (lastDotIndex === -1) return withoutPrefix;
  
  const ext = withoutPrefix.slice(lastDotIndex);
  const baseName = withoutPrefix.slice(0, lastDotIndex);
  
  // The baseName format is: {originalName}-{timestamp}-{random}
  // Split by '-' and remove last two segments (timestamp and random)
  const parts = baseName.split('-');
  if (parts.length >= 3) {
    // Remove last two parts (timestamp and random number)
    parts.pop(); // random
    parts.pop(); // timestamp
    return parts.join('-') + ext;
  }
  
  return withoutPrefix;
};

const DeclarationUpload: FC = () => {
  const updatePayload = useUpdatePayload();
  const setExtractedData = useSetExtractedData();
  const declarationFileName = usePayloadField('declarationFileName');
  const { showSuccess, showError } = useSnackbar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [pendingFileName, setPendingFileName] = useState<string>(''); // Only used during upload
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [extractionStatus, setExtractionStatus] = useState<ExtractionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Single source of truth: file exists if declarationFileName is set or we're currently uploading
  const hasFile = Boolean(declarationFileName) || uploadStatus === 'uploading';
  // For display: show success if we have a file and we're not currently uploading
  const displayStatus = declarationFileName && uploadStatus === 'idle' ? 'success' : uploadStatus;

  const updateFileName = useCallback(
    (fileName: string) => {
      updatePayload('declarationFileName', fileName);
    },
    [updatePayload]
  );

  const handleExtractWithAI = async () => {
    if (!declarationFileName) return;

    setExtractionStatus('extracting');
    setErrorMessage('');

    try {
      const response = await propertyApi.extractWithAI(declarationFileName);
      setExtractedData(response.data);
      setExtractionStatus('success');
      showSuccess('Data extracted successfully!');
    } catch (error) {
      setExtractionStatus('error');
      const message = error instanceof Error ? error.message : 'Failed to extract data';
      setErrorMessage(message);
      showError(message);
    }
  };

  const handleFileChange = async (file: File | null) => {
    if (!file || file.type !== 'application/pdf') {
      return;
    }

    setPendingFileName(file.name);
    setUploadStatus('uploading');
    setErrorMessage('');

    try {
      const response = await propertyApi.uploadFile(file);
      setUploadStatus('idle'); // Reset to idle - displayStatus will show 'success' because declarationFileName is set
      setPendingFileName('');
      updateFileName(response.filename);
      showSuccess('File uploaded successfully!');
    } catch (error) {
      setUploadStatus('error');
      const message = error instanceof Error ? error.message : 'Failed to upload file';
      setErrorMessage(message);
      updateFileName('');
      showError(message);
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
    setPendingFileName('');
    setUploadStatus('idle');
    setExtractionStatus('idle');
    setErrorMessage('');
    updateFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
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

      {/* Show upload dropzone when no file is present */}
      {!hasFile ? (
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
            bgcolor: (theme) =>
              displayStatus === 'error'
                ? alpha(theme.palette.error.main, 0.04)
                : alpha(theme.palette.secondary.main, 0.04),
            borderColor: displayStatus === 'error' ? 'error.main' : 'secondary.main',
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 1,
              bgcolor: (theme) =>
                displayStatus === 'error'
                  ? alpha(theme.palette.error.main, 0.1)
                  : alpha(theme.palette.secondary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {displayStatus === 'uploading' ? (
              <CircularProgress size={24} color="secondary" />
            ) : displayStatus === 'error' ? (
              <ErrorOutlineIcon sx={{ color: 'error.main' }} />
            ) : displayStatus === 'success' ? (
              <CheckCircleIcon sx={{ color: 'success.main' }} />
            ) : (
              <InsertDriveFileIcon sx={{ color: 'secondary.main' }} />
            )}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              fontWeight={500}
              color="text.primary"
              sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {pendingFileName || getDisplayFileName(declarationFileName)}
            </Typography>
            <Typography
              variant="caption"
              color={displayStatus === 'error' ? 'error.main' : 'text.secondary'}
            >
              {displayStatus === 'uploading'
                ? 'Uploading...'
                : displayStatus === 'error'
                  ? errorMessage
                  : 'Uploaded successfully'}
            </Typography>
          </Box>
          {displayStatus === 'success' && (
            <Button
              variant="outlined"
              size="small"
              startIcon={
                extractionStatus === 'extracting' ? (
                  <CircularProgress size={16} color="inherit" />
                ) : extractionStatus === 'success' ? (
                  <CheckCircleIcon />
                ) : (
                  <AutoAwesomeIcon />
                )
              }
              onClick={handleExtractWithAI}
              disabled={extractionStatus === 'extracting'}
              color={extractionStatus === 'success' ? 'success' : 'primary'}
              sx={{ mr: 1 }}
            >
              {extractionStatus === 'extracting'
                ? 'Extracting...'
                : extractionStatus === 'success'
                  ? 'Extracted!'
                  : 'Extract with AI'}
            </Button>
          )}
          <IconButton
            size="small"
            onClick={handleRemoveFile}
            disabled={displayStatus === 'uploading'}
            sx={{ color: 'text.secondary' }}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Paper>
      )}
    </Box>
  );
};

export default memo(DeclarationUpload);
