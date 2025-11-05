import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.tsx";
import { getPreferences } from './api';
import { usePreferencesQuery } from './hooks/queries';
import OnboardingPage from "./pages/OnboardingPage/OnboardingPage.tsx";
import { DashboardPage } from "./pages/DashboardPage/DashboardPage.tsx";
import Particles from './Particles';

export type Pages = "login" | "register" | "onboarding" | "home";

export interface Preferences {
  id: number;
  userId: number;
  currencies: string[];
  investorType: string;
  content: string[];
}

export default function App() {
  const [view, setView] = useState<Pages>("login");
  const [token, setToken] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<Preferences | null>(null);

  // React Query: load preferences when token exists
  const { data: prefsData, isLoading: prefsLoading } = usePreferencesQuery(token || undefined, !!token);

  // React Query side-effect: decide where to route once preferences are known
  useEffect(() => {
    if (!token) return;

    // While loading, show the dashboard loader if we're already on home
    if (prefsLoading) {
      // Ensure we are on a loading-friendly view
      if (view !== 'home') setView('home');
      return;
    }

    // After loading completes, route based on data
    if (prefsData && (prefsData as any).preferences) {
      setPreferences((prefsData as any).preferences);
      setView('home');
    } else {
      setView('onboarding');
    }
  }, [token, prefsLoading, prefsData]);

  async function handleLogin(jwt: string) {
    if (!jwt) {
      console.error("No token received during login");
      return;
    }

    setToken(jwt);

    // Switch to home to show loader while React Query fetches preferences
    setView('home');
  }

  return (
    <>
    <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, backgroundColor: '#121212ff' }}>
        <Particles
          particleColors={["#9d00ffff", "#9d00ffff"]}
          particleCount={2000}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 2, width: '100%', minHeight: '100vh' }}>
        {view === "login" && (
          <LoginPage onSwitchToRegister={() => setView("register")} onLogin={(jwt) => handleLogin(jwt)} />
        )}

        {view === "register" && (
          <RegisterPage onSwitchToLogin={() => setView("login")} />
        )}

        {view === "onboarding" && (
          <OnboardingPage token={token || undefined} onComplete={async () => {
            // after onboarding completes, try to fetch preferences (if token available) or read local saved
            if (token) {
              try {
                const prefs = await getPreferences(token);
                if (prefs && prefs.preferences) {
                  setPreferences(prefs.preferences);
                } else {
                  console.warn('No preferences found after onboarding');
                  return;
                }
              } catch (err) {
                console.warn('Could not fetch preferences after onboarding', err);
                return;
              }
            }
            setView("home");
          }} />
        )}

        {view === "home" && token && preferences ? (
          <DashboardPage token={token} preferences={preferences}/>
        ) : view === "home" ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Typography color="white" variant="h6">Loading dashboard...</Typography>
          </Box>
        ) : null}
      </div>
    </>
  );
}

