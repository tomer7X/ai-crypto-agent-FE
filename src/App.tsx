import { useState, useEffect } from "react";
// import { Box } from "@mui/material";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.tsx";
import { usePreferencesQuery } from './hooks/queries';
import OnboardingPage from "./pages/OnboardingPage/OnboardingPage.tsx";
import { DashboardPage } from "./pages/DashboardPage/DashboardPage.tsx";
import Particles from './Particles';
import { useUserData } from './context/useUserDataProvider';
import LoadingDashboard from './components/LoadingDashboard';
import { useQueryClient } from '@tanstack/react-query';
import { Typography } from "@mui/material";

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
  const { token, setToken, preferences, setPreferences } = useUserData();
  const queryClient = useQueryClient();

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
      {(view === "login" || view === "register") && (
        <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              letterSpacing: '0.4px',
              mb: 1,
              zIndex: 99,
              background: 'linear-gradient(90deg, #50008aff, #1e024dff, #7c4dff, #ffffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '300% 100%',
              animation: 'lg-shift 3s ease-in-out infinite',
              '@keyframes lg-shift': {
                '0%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' },
                '100%': { backgroundPosition: '0% 50%' },
              },
              fontSize: "100px",
              fontFamily: "fantasy",
              textAlign: 'center',
              paddingTop: '20px',
            }}
          >
            Crypto AI Agent
          </Typography>
      )}
        {view === "login" && (
          <LoginPage onSwitchToRegister={() => setView("register")} onLogin={(jwt) => handleLogin(jwt)} />
        )}

        {view === "register" && (
          <RegisterPage onSwitchToLogin={() => setView("login")} />
        )}

        {view === "onboarding" && (
          <OnboardingPage
            onComplete={async () => {
              // Navigate to home first to show the LoadingDashboard immediately
              setView("home");
              // Then refresh preferences via React Query (don't await so loader shows during fetch)
              if (token) {
                queryClient.invalidateQueries({ queryKey: ['preferences', token] });
                queryClient.refetchQueries({ queryKey: ['preferences', token] });
              }
            }}
          />
        )}

        {view === "home" && token && preferences ? (
          <DashboardPage />
        ) : view === "home" ? (
          <LoadingDashboard />
        ) : null}
      </div>
    </>
  );
}

