import { Box, Typography, CircularProgress, IconButton } from '@mui/material';
import { useState, useCallback, useRef, useEffect } from 'react';
import { FloatingCard } from '../FloatingCard';
import type { Preferences } from '../../App';
import type { CryptoNewsItem } from '../../api';
import { useCryptoNewsQuery } from '../../hooks/queries';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface MarketNewsCardProps {
  preferences: Preferences;
}

export const MarketNewsCard = ({ preferences }: MarketNewsCardProps) => {
  const { data, isLoading, isError, error } = useCryptoNewsQuery();
  const news: CryptoNewsItem[] = data?.results ?? [];
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const autoScrollInterval = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Auto-scroll news every 5 seconds
  useEffect(() => {
    if (news.length > 0) {
      const scrollInterval = setInterval(() => {
        setCurrentNewsIndex(prev => (prev + 1) % news.length);
      }, 5000);
      autoScrollInterval.current = scrollInterval;

      return () => clearInterval(scrollInterval);
    }
  }, [news.length]);

  const handleNavigate = useCallback((direction: 'prev' | 'next') => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
    }

    setCurrentNewsIndex(prev => {
      if (direction === 'prev') {
        return prev === 0 ? news.length - 1 : prev - 1;
      } else {
        return (prev + 1) % news.length;
      }
    });

    // Restart auto-scroll after manual navigation
    autoScrollInterval.current = setInterval(() => {
      setCurrentNewsIndex(prev => (prev + 1) % news.length);
    }, 5000);
  }, [news.length]);

  if (!preferences.content.includes('news')) return null;

  return (
    <FloatingCard title="Market News" sx={{ height: '100%', minHeight: '45vh' }}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <CircularProgress sx={{ color: 'white' }} />
          </Box>
        ) : isError ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Typography color="error" variant="body2">
              {(error as Error)?.message ?? 'Failed to fetch news'}
            </Typography>
          </Box>
        ) : news.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Typography color="white" variant="body2">
              No news available at the moment
            </Typography>
          </Box>
        ) : (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, position: 'relative' }}>
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center',
              p: 2,
              transition: 'opacity 0.3s ease-in-out',
            }}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: 'white',
                    textDecoration: 'none',
                    mb: 1,
                    '&:hover': {
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      color: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                >
                  {news[currentNewsIndex].title}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.9)',
                    mb: 1,
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {news[currentNewsIndex].description}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {new Date(news[currentNewsIndex].published_at).toLocaleString()}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              gap: 1,
              pb: 1
            }}>
              <IconButton
                size="small"
                onClick={() => handleNavigate('prev')}
                sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                <KeyboardArrowUpIcon />
              </IconButton>
              <Typography color="white" variant="caption" sx={{ alignSelf: 'center' }}>
                {currentNewsIndex + 1} / {news.length}
              </Typography>
              <IconButton
                size="small"
                onClick={() => handleNavigate('next')}
                sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                <KeyboardArrowDownIcon />
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>
    </FloatingCard>
  );
};