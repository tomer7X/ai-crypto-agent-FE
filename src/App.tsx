import { useState } from "react";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.tsx";
import Particles from './Particles';

export default function App() {
  const [view, setView] = useState<"login" | "register">("login");

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

      {view === "login" ? (
        <LoginPage onSwitchToRegister={() => setView("register")} />
      ) : (
        <RegisterPage onSwitchToLogin={() => setView("login")} />
      )}
    </>
  );
}

