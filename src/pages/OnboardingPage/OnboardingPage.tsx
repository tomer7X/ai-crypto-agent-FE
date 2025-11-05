import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
// import { putPreferences } from "../../api";
import { useSavePreferencesMutation } from "../../hooks/queries";

type Props = {
  onComplete?: () => void;
  token?: string;
};

const ASSETS_OPTIONS = ["BTC", "ETH", "SOL", "ADA", "DOT"];

const INVESTOR_TYPES = [
  "HODLer",
  "Day Trader",
  "NFT Collector",
  "Swing Trader",
  "Other",
];  


export default function OnboardingPage({ onComplete, token }: Props) {
  const [assets, setAssets] = useState<string[]>([]);
  const [investorType, setInvestorType] = useState<string>("HODLer");
  const [content, setContent] = useState<{ [k: string]: boolean }>({
    news: true,
    charts: true,
    social: true,
    fun: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const savePrefs = useSavePreferencesMutation(token || "");

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setMessage(null);
    if (!investorType) {
      setMessage("Please select an investor type.");
      return;
    }
    setSubmitting(true);
    const selectedContent = Object.keys(content).filter((k) => content[k]);

    try {
      if (token) {
        await savePrefs.mutateAsync({
          currencies: assets,
          investor_type: investorType,
          content: selectedContent,
        });
      }

      setMessage("✅ Preferences saved");
      setTimeout(() => onComplete?.(), 700);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to save preferences");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box sx={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Container maxWidth="sm" sx={{ zIndex: 2 }}>
        <Paper elevation={3} sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography component="h1" variant="h5" gutterBottom>
            Tell us a bit about you
          </Typography>

          <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 2, width: "100%" }}>
            <Stack spacing={2}>
              <Autocomplete
                multiple
                freeSolo
                options={ASSETS_OPTIONS}
                value={assets}
                onChange={(_, v) => setAssets(v)}
                renderTags={(value: string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => <TextField {...params} label="What crypto assets are you interested in?" />}
              />

              <FormControl>
                <FormLabel>What type of investor are you?</FormLabel>
                <RadioGroup value={investorType} onChange={(e) => setInvestorType(e.target.value)}>
                    {INVESTOR_TYPES.map((type) => (
                      <FormControlLabel key={type} value={type} control={<Radio />} label={type} />
                    ))}
                </RadioGroup>
              </FormControl>

              <FormControl component="fieldset">
                <FormLabel component="legend">What kind of content would you like to see?</FormLabel>
                <FormGroup>
                  {Object.keys(content).map((k) => (
                    <FormControlLabel
                      key={k}
                      control={<Checkbox checked={content[k]} onChange={(e) => setContent((c) => ({ ...c, [k]: e.target.checked }))} />}
                      label={k}
                    />
                  ))}
                </FormGroup>
              </FormControl>

              <Button type="submit" fullWidth variant="contained" disabled={submitting} onClick={onSubmit}>
                {submitting ? "Saving..." : "Save preferences"}
              </Button>

              {message && (
                <Typography color={message.includes("✅") ? "success" : "error"} variant="body2" sx={{ textAlign: "center" }}>
                  {message}
                </Typography>
              )}
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
