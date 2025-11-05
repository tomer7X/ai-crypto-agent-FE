import { Typography } from '@mui/material';
import { FloatingCard } from '../FloatingCard';
import { useUserData } from '../../context/useUserDataProvider';


export const FunTimeCard = () => {
  const { preferences } = useUserData();
  if (!preferences!.content.includes('fun')) return null;

  return (
    <FloatingCard title="Fun Time">
      <Typography color="white" variant="body2">
        Coming soon: Quick trade actions and alerts
      </Typography>
    </FloatingCard>
  );
};