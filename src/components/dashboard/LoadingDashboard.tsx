import { Box, CircularProgress, Typography } from '@mui/material';

export const LoadingDashboard = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        px: 2,
      }}
    >
      <Box
        sx={{
          width: 'min(1100px, 92vw)',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {/* Title + Spinner */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              letterSpacing: '0.4px',
              mb: 1,
              background: 'linear-gradient(90deg, #ffffff, #b388ff, #7c4dff, #ffffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '300% 100%',
              animation: 'lg-shift 3s ease-in-out infinite',
              '@keyframes lg-shift': {
                '0%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' },
                '100%': { backgroundPosition: '0% 50%' },
              },
            }}
          >
            Preparing your dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Fetching your preferences and content…
          </Typography>
          <Box sx={{ mt: 2 }}>
            <CircularProgress size={42} sx={{ color: '#ffffff' }} />
          </Box>
        </Box>

        {/* Placeholder layout (2x2 grid) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <Box
              key={i}
              sx={{
                height: { xs: 160, md: 220 },
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                background: 'rgba(18, 18, 18, 0.65)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
                // shimmer
                '::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.04) 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.8s linear infinite',
                },
                '@keyframes shimmer': {
                  '0%': { backgroundPosition: '-200% 0' },
                  '100%': { backgroundPosition: '200% 0' },
                },
              }}
            >
              {/* subtle header bar placeholder */}
              <Box sx={{ position: 'absolute', top: 16, left: 16, right: 16, height: 12, borderRadius: 1, background: 'rgba(255,255,255,0.12)' }} />
              {/* content lines */}
              <Box sx={{ position: 'absolute', top: 46, left: 16, right: '40%', height: 8, borderRadius: 1, background: 'rgba(255,255,255,0.08)' }} />
              <Box sx={{ position: 'absolute', top: 66, left: 16, right: '35%', height: 8, borderRadius: 1, background: 'rgba(255,255,255,0.08)' }} />
              <Box sx={{ position: 'absolute', top: 86, left: 16, right: '55%', height: 8, borderRadius: 1, background: 'rgba(255,255,255,0.08)' }} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default LoadingDashboard;
