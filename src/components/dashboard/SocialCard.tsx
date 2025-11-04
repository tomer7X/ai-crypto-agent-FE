import { Typography } from '@mui/material';
import { FloatingCard } from '../FloatingCard';
import type { Preferences } from '../../App';

interface SocialCardProps {
  preferences: Preferences;
}

export const SocialCard = ({ preferences }: SocialCardProps) => {
  if (!preferences.content.includes('social')) return null;

  return (
    <FloatingCard title="Social">
      <Typography color="white" variant="body2">
        Coming soon: Latest crypto news and updates
      </Typography>
    </FloatingCard>
  );
};