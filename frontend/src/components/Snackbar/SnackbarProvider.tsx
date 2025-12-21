import { useState, useCallback, type ReactNode, type FC } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { SnackbarContext } from './snackbarTypes';
import type { SnackbarSeverity } from './snackbarTypes';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
}

interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider: FC<SnackbarProviderProps> = ({ children }) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = useCallback((message: string, severity: SnackbarSeverity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const showSuccess = useCallback((message: string) => {
    showSnackbar(message, 'success');
  }, [showSnackbar]);

  const showError = useCallback((message: string) => {
    showSnackbar(message, 'error');
  }, [showSnackbar]);

  const handleClose = useCallback((_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar, showSuccess, showError }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

