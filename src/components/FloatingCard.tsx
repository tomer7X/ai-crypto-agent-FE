import { Paper, type PaperProps, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface FloatingCardProps extends Omit<PaperProps, 'children'> {
  title: string;
  children: ReactNode;
}

export const FloatingCard = ({ title, children, sx, ...props }: FloatingCardProps) => {
  return (
    <Paper
      elevation={3}
      sx={{
        flex: 1,
        p: 3,
        backgroundColor: 'rgba(18, 18, 18, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 40px 0 rgba(31, 38, 135, 0.5)',
        },
        ...sx
      }}
      {...props}
    >
      <Typography 
        variant="h5" 
        color="white" 
        gutterBottom
        sx={{
          fontWeight: 500,
          letterSpacing: '0.5px',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}
      >
        {title}
      </Typography>
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </Paper>
  );
};