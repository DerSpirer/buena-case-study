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
    mode: 'dark',
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
      default: '#0f172a',
      paper: 'rgba(30, 41, 59, 0.7)',
      paperLight: 'rgba(30, 41, 59, 0.5)',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
    divider: 'rgba(148, 163, 184, 0.1)',
    grey: {
      300: '#cbd5e1',
      600: '#64748b',
    },
  },
  spacing: 8,
  typography: {
    fontFamily: '"Roboto", -apple-system, BlinkMacSystemFont, sans-serif',
    h3: {
      fontWeight: 500,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 500,
      fontSize: '2.25rem',
      lineHeight: 1,
    },
    body1: {},
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
    mono: {
      fontFamily: '"Roboto", monospace',
      fontSize: '0.85rem',
      fontWeight: 400,
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
    MuiCssBaseline: {
      styleOverrides: `
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.4);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.6);
        }
      `,
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          padding: '12px 24px',
          borderRadius: 8,
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
          transition: 'all 0.2s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
          padding: '20px 16px',
        },
        head: {
          fontWeight: 500,
          fontSize: '0.75rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: '#94a3b8',
          borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
          padding: '16px',
        },
        body: {
          fontSize: '0.95rem',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background 0.15s ease',
          '&:hover': {
            background: 'rgba(99, 102, 241, 0.05)',
          },
          '&:last-child td': {
            borderBottom: 0,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: '0.75rem',
          letterSpacing: '0.025em',
        },
        iconSmall: {
          fontSize: 16,
        },
      },
      variants: [
        {
          props: { color: 'primary' },
          style: {
            backgroundColor: 'rgba(99, 102, 241, 0.12)',
            color: '#4f46e5',
            '& .MuiChip-icon': {
              color: 'inherit',
            },
          },
        },
        {
          props: { color: 'secondary' },
          style: {
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            color: '#059669',
            '& .MuiChip-icon': {
              color: 'inherit',
            },
          },
        },
      ],
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: '1200px !important',
        },
      },
    },
  },
});

export default theme;
