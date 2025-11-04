import { Box, Typography } from '@mui/material';
import type { Preferences } from '../../App';
import { MarketNewsCard } from '../../components/dashboard/MarketNewsCard';
import { ChartsCard } from '../../components/dashboard/ChartsCard';
import { SocialCard } from '../../components/dashboard/SocialCard';
import { FunTimeCard } from '../../components/dashboard/FunTimeCard';

export const DashboardPage = ({
token,
preferences,
}:{
    token: string
    preferences: Preferences
}) => {
    console.log("DashboardPage preferences:", preferences);
    console.log("DashboardPage token:", token);
    
    if (!preferences || !preferences.content) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography color="white" variant="h6">Loading preferences...</Typography>
            </Box>
        );
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
          <MarketNewsCard preferences={preferences} />
          <ChartsCard preferences={preferences} />
        </Box>

        {/* Bottom Row */}
        <Box sx={{ display: 'flex', gap: 3, flex: 1 }}>
          <SocialCard preferences={preferences} />
          <FunTimeCard preferences={preferences} />
        </Box>
      </Box>
    </Box>
  );
};