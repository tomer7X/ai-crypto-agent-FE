import { Typography } from '@mui/material';
import { FloatingCard } from '../FloatingCard';
import type { Preferences } from '../../App';

interface ChartsCardProps {
  preferences: Preferences;
}

export const ChartsCard = ({ preferences }: ChartsCardProps) => {
  if (!preferences.content.includes('charts')) return null;

  return (
    <FloatingCard title="Charts">
      <Typography color="white" variant="body2">
        Coming soon: Live market data and trends
      </Typography>
    </FloatingCard>
  );
};