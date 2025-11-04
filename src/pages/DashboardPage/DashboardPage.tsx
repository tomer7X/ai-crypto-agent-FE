import { Box, Typography } from '@mui/material';
import { FloatingCard } from '../../components/FloatingCard';
import type { Preferences } from '../../App';

export const DashboardPage = ({
token,
preferences,
}:{
    token: string
    preferences: Preferences
}) => {
    console.log("DashboardPage preferences:", preferences);
    console.log("DashboardPage token:", token);
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
        <Box sx={{ display: 'flex', gap: 3, flex: 1 }}>
            {preferences.content.includes('news') &&           
          <FloatingCard title="Market News">
            <Typography color="white" variant="body2">
              Coming soon: Market News
            </Typography>
          </FloatingCard>
          }

          {preferences.content.includes('charts') && <FloatingCard title="Charts">
            <Typography color="white" variant="body2">
              Coming soon: Live market data and trends
            </Typography>
          </FloatingCard>}
        </Box>

        {/* Bottom Row */}
        <Box sx={{ display: 'flex', gap: 3, flex: 1 }}>
          {preferences.content.includes('social') && <FloatingCard title="Social">
            <Typography color="white" variant="body2">
              Coming soon: Latest crypto news and updates
            </Typography>
          </FloatingCard>}

          {preferences.content.includes('fun') && <FloatingCard title="Fun Time">
            <Typography color="white" variant="body2">
              Coming soon: Quick trade actions and alerts
            </Typography>
          </FloatingCard>}
        </Box>
      </Box>
    </Box>
  );
};