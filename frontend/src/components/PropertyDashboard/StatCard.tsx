import { Paper, Typography } from '@mui/material';

interface StatCardProps {
  label: string;
  value: number;
  variant: 'primary' | 'secondary';
}

const StatCard = ({ label, value, variant }: StatCardProps) => {
  return (
    <Paper
      sx={{
        p: 3,
        background: 'background.paperLight',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: (theme) =>
            `linear-gradient(90deg, ${theme.palette[variant].main}, transparent)`,
        },
      }}
    >
      <Typography variant="label" color="grey.600" component="div" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <Typography variant="statValue" color="text.primary">
        {value}
      </Typography>
    </Paper>
  );
};

export default StatCard;
