import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.tsx";
import { getPreferences } from './api';
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

  async function handleLogin(jwt: string) {
    setToken(jwt ?? null);
    if (!jwt) {
      // no token returned -- show onboarding to collect preferences locally
      setView("onboarding");
      return;
    }

    try {
      const prefs = await getPreferences(jwt);
      if (prefs) {
        setPreferences(prefs.preferences);
        setView("home");
      } else {
        setView("onboarding");
      }
    } catch (err) {
      console.error("Failed to load preferences, falling back to onboarding:", err);
      setView("onboarding");
    }
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

        {view === "home" && <DashboardPage token={token!} preferences={preferences!}/>}
      </div>
    </>
  );
}

