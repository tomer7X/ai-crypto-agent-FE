import { Box } from '@mui/material';
import { useUserData } from '../../context/useUserDataProvider';
import { LoadingDashboard, CoinsPricesCard, FunTimeCard, MarketNewsCard, SocialCard } from '../../components/dashboard';

export const DashboardPage = () => {
  const { preferences } = useUserData();

  if(!preferences) {
    return <LoadingDashboard />;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        margin: 0,
        padding: 0,
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
      }}
    >
      <Box
        sx={{
          width: '90vw',
          height: '90vh',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {/* Top Row */}
        <Box sx={{ display: 'flex', gap: 3, flex: 1 }}>
          <MarketNewsCard />
          <CoinsPricesCard />
        </Box>

        {/* Bottom Row */}
        <Box sx={{ display: 'flex', gap: 3, flex: 1 }}>
          <SocialCard />
          <FunTimeCard />
        </Box>
      </Box>
    </Box>
  );
};