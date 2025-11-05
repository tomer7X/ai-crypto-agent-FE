import { useEffect, useMemo } from 'react';
import { Box, Button, Typography, CircularProgress, Skeleton } from '@mui/material';
import { FloatingCard } from '../FloatingCard';
import { useOpenRouter } from '../../hooks/useOpenRouter';
import { useUserData } from '../../context/useUserDataProvider';

const DEFAULT_MODEL = 'openrouter/auto';

export function AiOpenRouterCard() {
  const { preferences } = useUserData();
  const { ask, loading, output, error } = useOpenRouter();
  const model = DEFAULT_MODEL;

  const prompt = useMemo(() => {
    const investor = (preferences as any)?.investorType || 'crypto investor';
    const list = ((preferences as any)?.currencies || ['BTC', 'ETH']).join(', ');
    return `I'm a ${investor}. Please give one upbeat crypto market insight today about one of these coins: ${list}. Keep it to 2-3 sentences.`;
  }, [preferences]);

  // Ask on mount and whenever the prompt changes (e.g., preferences updated)
  useEffect(() => {
    // Avoid calling if already loading; fetch initial insight
    if (!loading) {
      ask(prompt, model);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt]);

  return (
    <FloatingCard title="AI Insight">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <Typography color="white" variant="body2" sx={{ opacity: 0.8 }}>
          Personalized insight based on your preferences.
        </Typography>

        <Button
          variant="contained"
          disableElevation
          disabled={loading}
          onClick={() => ask(prompt, model)}
          sx={{
            alignSelf: 'flex-start',
            background: 'linear-gradient(135deg, #9d00ff 0%, #4b0082 100%)',
            color: '#ffffff',
            px: 2.25,
            py: 0.75,
            borderRadius: 999,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 8px 24px rgba(157, 0, 255, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #b000ff 0%, #5a00a8 100%)',
              boxShadow: '0 10px 28px rgba(157, 0, 255, 0.5)',
            },
            '&:active': { transform: 'translateY(1px)' },
            '&.Mui-disabled': {
              background: 'linear-gradient(135deg, rgba(157,0,255,0.5) 0%, rgba(75,0,130,0.5) 100%)',
              color: 'rgba(255,255,255,0.85)',
            },
          }}
          startIcon={loading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : undefined}
        >
          {loading ? 'Fetching…' : 'New insight'}
        </Button>

        {error && (
          <Typography color="error" variant="body2">{error}</Typography>
        )}

        {loading && (
          <Box sx={{ mt: 0.5 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                fontWeight: 600,
                background: 'linear-gradient(90deg, #ffffff 0%, #9d00ff 50%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Generating your insight…
            </Typography>
            <Skeleton variant="text" width="92%" />
            <Skeleton variant="text" width="96%" />
            <Skeleton variant="text" width="88%" />
          </Box>
        )}

        {output && !loading && (
          <Box sx={{
            mt: 0.5,
            p: 1.5,
            borderRadius: 1,
            bgcolor: 'rgba(255,255,255,0.06)',
            maxHeight: 220,
            overflow: 'auto',
          }}>
            <Typography color="white" variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {output}
            </Typography>
          </Box>
        )}
      </Box>
    </FloatingCard>
  );
}
