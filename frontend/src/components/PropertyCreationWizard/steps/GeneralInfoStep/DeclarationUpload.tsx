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

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';
type ExtractionStatus = 'idle' | 'extracting' | 'success' | 'error';

const DeclarationUpload: FC = () => {
  const updatePayload = useUpdatePayload();
  const setExtractedData = useSetExtractedData();
  const declarationFileName = usePayloadField('declarationFileName');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [extractionStatus, setExtractionStatus] = useState<ExtractionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

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
    } catch (error) {
      setExtractionStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to extract data'
      );
    }
  };

  const handleFileChange = async (file: File | null) => {
    if (!file || file.type !== 'application/pdf') {
      return;
    }

    setUploadedFile(file);
    setUploadStatus('uploading');
    setErrorMessage('');

    try {
      const response = await propertyApi.uploadFile(file);
      setUploadStatus('success');
      updateFileName(response.filename);
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to upload file'
      );
      updateFileName('');
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
              uploadStatus === 'error'
                ? alpha(theme.palette.error.main, 0.04)
                : alpha(theme.palette.secondary.main, 0.04),
            borderColor: uploadStatus === 'error' ? 'error.main' : 'secondary.main',
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 1,
              bgcolor: (theme) =>
                uploadStatus === 'error'
                  ? alpha(theme.palette.error.main, 0.1)
                  : alpha(theme.palette.secondary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {uploadStatus === 'uploading' ? (
              <CircularProgress size={24} color="secondary" />
            ) : uploadStatus === 'error' ? (
              <ErrorOutlineIcon sx={{ color: 'error.main' }} />
            ) : uploadStatus === 'success' ? (
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
              {uploadedFile.name}
            </Typography>
            <Typography
              variant="caption"
              color={uploadStatus === 'error' ? 'error.main' : 'text.secondary'}
            >
              {uploadStatus === 'uploading'
                ? 'Uploading...'
                : uploadStatus === 'error'
                  ? errorMessage
                  : uploadStatus === 'success'
                    ? 'Uploaded successfully'
                    : `${(uploadedFile.size / 1024).toFixed(1)} KB`}
            </Typography>
          </Box>
          {uploadStatus === 'success' && (
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
            disabled={uploadStatus === 'uploading'}
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
