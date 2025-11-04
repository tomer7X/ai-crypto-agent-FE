import { Typography } from '@mui/material';
import { FloatingCard } from '../FloatingCard';
import type { Preferences } from '../../App';

interface FunTimeCardProps {
  preferences: Preferences;
}

export const FunTimeCard = ({ preferences }: FunTimeCardProps) => {
  if (!preferences.content.includes('fun')) return null;

  return (
    <FloatingCard title="Fun Time">
      <Typography color="white" variant="body2">
        Coming soon: Quick trade actions and alerts
      </Typography>
    </FloatingCard>
  );
};