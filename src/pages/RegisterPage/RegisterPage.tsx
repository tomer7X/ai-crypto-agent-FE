import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import { createAccount } from "../../api";

type Props = {
  onSwitchToLogin?: () => void;
};

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export default function RegisterPage({ onSwitchToLogin }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; password?: string; confirm?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function validate() {
    const next: typeof errors = {};
    if (!fullName.trim()) next.fullName = "Full name is required";
    if (!email) next.email = "Email is required";
    else if (!emailRegex.test(email)) next.email = "Invalid email";
    if (!password) next.password = "Password is required";
    else if (password.length < 6) next.password = "Password must be at least 6 characters";
    if (!confirm) next.confirm = "Please confirm your password";
    else if (password !== confirm) next.confirm = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      console.log("Register payload:", { fullName, email });
      await createAccount(fullName, email, password);
      setMessage("✅ (Demo) Account created — you can now sign in");
    } catch (err) {
      setMessage("❌ Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box sx={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Container maxWidth="sm" sx={{ zIndex: 2 }}>
        <Paper elevation={3} sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography component="h1" variant="h5" gutterBottom>
            Create an account
          </Typography>

          <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 2, width: "100%" }}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                id="fullName"
                label="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={!!errors.fullName}
                helperText={errors.fullName}
              />

              <TextField
                fullWidth
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />

              <TextField
                fullWidth
                id="password"
                label="Password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
              />

              <TextField
                fullWidth
                id="confirm"
                label="Password again"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                error={!!errors.confirm}
                helperText={errors.confirm}
              />

              <Button type="submit" fullWidth variant="contained" disabled={submitting}>
                {submitting ? "Creating..." : "Create account"}
              </Button>

              {message && (
                <Typography color={message.includes("✅") ? "success" : "error"} variant="body2" sx={{ textAlign: "center" }}>
                  {message}
                </Typography>
              )}

              <Typography variant="body2" sx={{ textAlign: "center" }}>
                Already have an account?{' '}
                <Link href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin?.(); }}>
                  Sign in
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
