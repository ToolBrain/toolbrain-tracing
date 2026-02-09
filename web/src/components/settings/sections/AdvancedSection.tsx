import { Stack, TextField, Typography, MenuItem } from "@mui/material";
import { useSettings } from "../../../contexts/SettingsContext";

const MODELS = [
  { value: "qwen-14b", label: "Qwen 14B (Local)" },
  { value: "gpt-4", label: "ChatGPT (GPT-4)" },
  { value: "claude-3-opus", label: "Claude 3 Opus" },
  { value: "gemini-pro", label: "Gemini Pro" },
];

const AdvancedSection: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h6">AI Evaluation</Typography>
        <Typography variant="body2" color="text.secondary">
          Language model used for trace evaluation.
        </Typography>
      </Stack>

      <TextField
        select
        label="Model"
        value={settings.llm.model}
        onChange={(e) =>
          updateSettings((draft) => {
            draft.llm.model = e.target.value;
          })
        }
        helperText="API credentials must be configured for certain models."
      >
        {MODELS.map((model) => (
          <MenuItem key={model.value} value={model.value}>
            {model.label}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
};

export default AdvancedSection;
