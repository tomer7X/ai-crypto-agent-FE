import { useQuery, useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { fetchCryptoNews, getPreferences, putPreferences, createAccount, validateLogin } from '../api';

// News
export function useCryptoNewsQuery() {
  return useQuery({
    queryKey: ['cryptoNews'],
    queryFn: fetchCryptoNews,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnMount: false,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
}

// Preferences
export function usePreferencesQuery(token?: string, enabled: boolean = !!token) {
  return useQuery({
    queryKey: ['preferences', token],
    queryFn: () => getPreferences(token as string),
    enabled,
  });
}

export function useSavePreferencesMutation(token: string, options?: UseMutationOptions<any, Error, any>) {
  return useMutation<any, Error, any>({
    mutationKey: ['putPreferences', token],
    mutationFn: (prefs: any) => putPreferences(token, prefs),
    ...options,
  });
}

// Auth
export function useRegisterMutation(options?: UseMutationOptions<any, Error, { fullName: string; email: string; password: string }>) {
  return useMutation<any, Error, { fullName: string; email: string; password: string }>({
    mutationKey: ['register'],
    mutationFn: ({ fullName, email, password }: { fullName: string; email: string; password: string }) => createAccount(fullName, email, password),
    ...options,
  });
}

export function useLoginMutation(options?: UseMutationOptions<any, Error, { email: string; password: string }>) {
  return useMutation<any, Error, { email: string; password: string }>({
    mutationKey: ['login'],
    mutationFn: ({ email, password }: { email: string; password: string }) => validateLogin(email, password),
    ...options,
  });
}
