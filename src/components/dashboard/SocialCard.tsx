import { Typography } from '@mui/material';
import { FloatingCard } from '../FloatingCard';
import { useUserData } from '../../context/useUserDataProvider';

export const SocialCard = () => {
const { preferences } = useUserData();
    if (!preferences!.content.includes('social')) return null;

  return (
    <FloatingCard title="Social">
      <Typography color="white" variant="body2">
        Coming soon: Latest crypto news and updates
      </Typography>
    </FloatingCard>
  );
};