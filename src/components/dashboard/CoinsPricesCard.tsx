import { Typography } from '@mui/material';
import { FloatingCard } from '../FloatingCard';
import { useUserData } from '../../context/useUserDataProvider';

export const CoinsPricesCard = () => {
  const { preferences } = useUserData();
  if (!preferences!.content.includes('charts')) return null;

  return (
    <FloatingCard title="Coins Prices">
      <Typography color="white" variant="body2">
        Coming soon: Live market data and trends
      </Typography>
    </FloatingCard>
  );
};