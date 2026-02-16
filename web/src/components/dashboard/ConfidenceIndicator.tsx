import React from "react";
import { Box, LinearProgress, Typography, CircularProgress } from "@mui/material";
import { CheckCircle, Schedule, VerifiedUser } from "@mui/icons-material";

interface ConfidenceIndicatorProps {
  confidence?: number | null;
  status?: "pending_review" | "auto_verified" | "completed" | null;
}

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  confidence,
  status,
}) => {
  if (confidence === undefined || confidence === null) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CircularProgress size={14} thickness={5} />
        <Typography variant="body2" color="text.disabled">
          Analyzing...
        </Typography>
      </Box>
    );
  }

  const percentage = confidence * 100;
  const progressColor =
    confidence < 0.2 ? "error" : confidence < 0.8 ? "warning" : "success";

  const resolvedStatus = status ?? "pending_review";

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Box sx={{ flexGrow: 1 }}>
        <LinearProgress
          variant="determinate"
          value={percentage}
          color={progressColor}
          sx={{
            height: 6,
            borderRadius: 2,
          }}
        />
      </Box>
      <Typography
        variant="body2"
        sx={{
          fontFamily: "monospace",
          fontSize: "0.75rem",
          color: "text.secondary",
        }}
      >
        {percentage.toFixed(0)}%
      </Typography>

      {resolvedStatus === "completed" ? (
        <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />
      ) : resolvedStatus === "auto_verified" ? (
        <VerifiedUser sx={{ fontSize: 16, color: "success.light" }} />
      ) : (
        <Schedule sx={{ fontSize: 16, color: "warning.main" }} />
      )}
    </Box>
  );
};

export default ConfidenceIndicator;
