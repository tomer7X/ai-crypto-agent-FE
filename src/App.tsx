import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.tsx";
import { fetchCryptoNews, getPreferences } from './api';
import OnboardingPage from "./pages/OnboardingPage/OnboardingPage.tsx";
import Particles from './Particles';

export type Pages = "login" | "register" | "onboarding" | "home";

export default function App() {
  const [view, setView] = useState<Pages>("login");
  const [token, setToken] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<any | null>(null);

  async function handleLogin(jwt: string) {
    setToken(jwt || null);
    if (!jwt) {
      // no token returned -- show onboarding to collect preferences locally
      setView("onboarding");
      return;
    }

    try {
      const prefs = await getPreferences(jwt);
      if (prefs) {
        setPreferences(prefs);
        setView("home");
      } else {
        setView("onboarding");
      }
    } catch (err) {
      console.error("Failed to load preferences, falling back to onboarding:", err);
      setView("onboarding");
    }
  }

  // Fetch crypto news in the background when app loads
  useEffect(() => {
    async function fetchNews() {
      try {
        const news = await fetchCryptoNews();
        console.log('Fetched crypto news:', news);
        // TODO: Store news in state/context when we build the news UI
      } catch (err) {
        console.error('Failed to fetch crypto news:', err);
      }
    }
    fetchNews();
  }, []); // Empty deps array = run once when component mounts

  return (
    <>
    <div style={{ width: '100%', height: '100vh', position: 'relative', backgroundColor: '#121212ff' }}>
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
              setPreferences(prefs);
            } catch (err) {
              console.warn('Could not fetch preferences after onboarding', err);
            }
          }
          setView("home");
        }} />
      )}

      {view === "home" && (
        console.log('we on home page now.')
      )}
    </>
  );
}

