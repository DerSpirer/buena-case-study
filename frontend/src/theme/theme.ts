import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypeBackground {
    gradient: string;
    paperLight: string;
  }

  interface TypographyVariants {
    mono: React.CSSProperties;
    label: React.CSSProperties;
    statValue: React.CSSProperties;
    bodyEmphasis: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    mono?: React.CSSProperties;
    label?: React.CSSProperties;
    statValue?: React.CSSProperties;
    bodyEmphasis?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    mono: true;
    label: true;
    statValue: true;
    bodyEmphasis: true;
  }
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
      paperLight: 'rgba(255, 255, 255, 0.6)',
      gradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%)',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    divider: 'rgba(100, 116, 139, 0.15)',
    grey: {
      300: '#cbd5e1',
      600: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Roboto", -apple-system, BlinkMacSystemFont, sans-serif',
    button: {
      textTransform: 'none',
    },
    mono: {
      fontFamily: 'monospace',
      fontSize: '0.85rem',
    },
    label: {
      fontSize: '0.8rem',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    statValue: {
      fontSize: '2.25rem',
      fontWeight: 500,
      lineHeight: 1,
    },
    bodyEmphasis: {
      fontSize: '0.95rem',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 500,
          fontSize: '0.75rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: '#64748b',
        },
      },
    },
  },
});

export default theme;
