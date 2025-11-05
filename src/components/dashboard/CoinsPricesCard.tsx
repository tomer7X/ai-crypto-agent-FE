import { Box, Chip, Skeleton, Stack, Typography, Badge } from '@mui/material';
import { FloatingCard } from '../FloatingCard';
import { useUserData } from '../../context/useUserDataProvider';
import { useCoinPricesQuery } from '../../hooks/queries';
import { WidthWide } from '@mui/icons-material';

export const CoinsPricesCard = () => {
  const { preferences } = useUserData();
  if (!preferences || !preferences.content?.includes('charts')) return null;

  const fallback = ['btc', 'eth', 'sol', 'ada', 'dot'];
  const symbols = (preferences.currencies && preferences.currencies.length > 0)
    ? preferences.currencies.map((s) => s.toLowerCase())
    : fallback;

  const { data: prices, isLoading, error } = useCoinPricesQuery(symbols, symbols.length > 0);

  return (
    <FloatingCard title="Coins Prices" sx={{ maxWidth: '350px' }}>
      {isLoading && (
        <Stack spacing={1}>
          {symbols.slice(0, 5).map((sym) => (
            <Box key={sym} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Skeleton variant="rounded" width={48} height={24} />
                <Skeleton variant="text" width={120} />
              </Box>
              <Skeleton variant="text" width={80} />
            </Box>
          ))}
        </Stack>
      )}

      {error && (
        <Typography color="error" variant="body2">Failed to load prices</Typography>
      )}

      {!isLoading && !error && (
        <Stack spacing={1}>
          {symbols.map((sym) => {
            const price = prices?.[sym.toLowerCase()];
            return (
              <Box key={sym} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

                  <Typography fontSize="25px" color="#80008fff" variant="body2" paddingRight="10px">
                    {price != null ? `${sym.toUpperCase()}` : '—'}
                </Typography>
                </Box>
                <Typography fontSize="25px" fontStyle="revert-layer" color="#00612cff" variant="body2">
                  {price != null ? `$${price.toLocaleString(undefined, { maximumFractionDigits: 8 })}` : '—'}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      )}
    </FloatingCard>
  );
};