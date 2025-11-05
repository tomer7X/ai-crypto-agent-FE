import { Box, Typography } from '@mui/material';
import { FloatingCard } from '../FloatingCard';
import { useUserData } from '../../context/useUserDataProvider';
import PNG_JOKE from '../../assets/meme.png';

export const FunTimeCard = () => {
  const { preferences } = useUserData();
  if (!preferences!.content.includes('fun')) return null;


  return (
    <FloatingCard title="Fun Time">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Box
          component="img"
          src={PNG_JOKE}
          alt="Crypto joke"
          sx={{
            width: '100%',
            maxWidth: 360,
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
            objectFit: 'cover',
          }}
        />
        <Typography color="white" variant="caption" sx={{ opacity: 0.7 }}>
          A little fun while the market moves.
        </Typography>
      </Box>
    </FloatingCard>
  );
};