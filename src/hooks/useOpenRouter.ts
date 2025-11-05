import { useCallback, useState } from 'react';
import { postOpenRouter, type OpenRouterResponse } from '../api';

export function useOpenRouter() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ask = useCallback(async (prompt: string, model: string = 'openrouter/auto') => {
    setLoading(true);
    setError(null);
    setOutput(null);
    try {
      const res: OpenRouterResponse = await postOpenRouter(prompt, model);
      setOutput(res.output ?? '');
    } catch (e: any) {
      setError(e?.message || 'Failed to query AI');
    } finally {
      setLoading(false);
    }
  }, []);

  return { ask, loading, output, error };
}
