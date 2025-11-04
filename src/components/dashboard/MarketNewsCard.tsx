import { Typography } from '@mui/material';
import { FloatingCard } from '../FloatingCard';
import type { Preferences } from '../../App';

interface MarketNewsCardProps {
  preferences: Preferences;
}

export const MarketNewsCard = ({ preferences }: MarketNewsCardProps) => {
  if (!preferences.content.includes('news')) return null;

  return (
    <FloatingCard title="Market News">
      <Typography color="white" variant="body2">
        Coming soon: Market News
      </Typography>
    </FloatingCard>
  );
};