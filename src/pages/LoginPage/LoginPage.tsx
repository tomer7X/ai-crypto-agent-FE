import { useState } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { validateLogin } from "../../api";
import { useLoginMutation } from "../../hooks/queries";

type FormState = {
  email: string;
  password: string;
};

const emailRegex =
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

type Props = {
  onSwitchToRegister?: () => void;
  /** Called with JWT token when login succeeds */
  onLogin: (token: string, expirationDate: Date) => void;
};

export const Login = ({ onSwitchToRegister, onLogin }: Props) => {
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const loginMutation = useLoginMutation();

  function validate() {
    const next: typeof errors = {};
    if (!form.email) next.email = "Email is required";
    else if (!emailRegex.test(form.email)) next.email = "Invalid email";
    if (!form.password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const response = await loginMutation.mutateAsync({ email: form.email, password: form.password });
      setMessage("✅ Logged in successfully");
      const token = response?.token;
      const expirationDate = response?.tokenExpirationDate;
      onLogin(token, expirationDate);
    } catch (err: any) {
      const text = JSON.parse(err.message).error ?? "Something went wrong";
      setMessage(`❌ ${text}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        margin: 0,
        padding: 0,
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            Sign in to your account
          </Typography>

          <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 3, width: "100%" }}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                error={!!errors.email}
                helperText={errors.email}
                placeholder="you@example.com"
              />

              <TextField
                fullWidth
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={!!errors.password}
                helperText={errors.password}
                placeholder="••••••••"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((show) => !show)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={submitting}
              sx={{ mt: 3, mb: 2 }}
            >
              {submitting ? "Signing in..." : "Sign in"}
            </Button>

            {message && (
              <Typography
                color={message.includes("✅") ? "success" : "error"}
                variant="body2"
                sx={{ mt: 2, textAlign: "center" }}
              > 
                {message}
              </Typography>
            )}
          </Box>
          <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{" "}
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToRegister?.();
              }}
              variant="body2"
            >
              Create one
            </Link>
          </Typography>
        </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
