import { Box, Button } from '@mui/material';
import { useUserData } from '../../context/useUserDataProvider';
import { LoadingDashboard, CoinsPricesCard, FunTimeCard, MarketNewsCard, AiOpenRouterCard } from '../../components/dashboard';

export const DashboardPage = ({ onClickEditPreferences }: { onClickEditPreferences: () => void }) => {
  const { preferences, logout } = useUserData();

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
        {/* Header actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={onClickEditPreferences}
            sx={{
              borderRadius: 999,
              textTransform: 'none',
              color: '#ffffff',
              borderColor: 'rgba(157,0,255,0.6)',
              '&:hover': {
                borderColor: '#9d00ff',
                background: 'rgba(157,0,255,0.08)'
              }
            }}
          >
            Edit preferences
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={() => {
              try {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('TokenExpirationDate');
              } catch {}
              logout();
              window.location.reload();
            }}
            sx={{
              background: 'linear-gradient(135deg, #ff3b3b 0%, #b00020 100%)',
              color: '#fff',
              borderRadius: 999,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #ff4d4d 0%, #c00028 100%)',
              }
            }}
          >
            Logout
          </Button>
        </Box>
        {/* Top Row */}
        <Box sx={{ display: 'flex', gap: 3, flex: 1 }}>
          <MarketNewsCard />
          <CoinsPricesCard />
        </Box>

        {/* Bottom Row */}
        <Box sx={{ display: 'flex', gap: 3, flex: 1 }}>
          <AiOpenRouterCard />
          <FunTimeCard />
        </Box>
      </Box>
    </Box>
  );
};