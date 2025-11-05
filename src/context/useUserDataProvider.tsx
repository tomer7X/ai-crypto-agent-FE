import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type UserPreferences = {
  id: number;
  userId: number;
  currencies: string[];
  investorType: string;
  content: string[];
};

type UserDataContextValue = {
  token: string | null;
  preferences: UserPreferences | null;
  setToken: (t: string | null) => void;
  setPreferences: (p: UserPreferences | null) => void;
  logout: () => void;
};

const UserDataContext = createContext<UserDataContextValue | undefined>(undefined);

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  const value = useMemo<UserDataContextValue>(() => ({
    token,
    preferences,
    setToken,
    setPreferences,
    logout: () => {
      setToken(null);
      setPreferences(null);
    },
  }), [token, preferences]);

  return (
    <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>
  );
}

export function useUserData() {
  const ctx = useContext(UserDataContext);
  if (!ctx) throw new Error('useUserData must be used within a UserDataProvider');
  return ctx;
}
