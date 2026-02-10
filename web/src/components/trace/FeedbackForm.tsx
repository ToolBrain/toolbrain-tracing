import React from "react";
import { Box, TextField, Typography, Rating } from "@mui/material";

export interface RatingMetrics {
  accuracy: number | null;
  completeness: number | null;
  relevance: number | null;
  safety: number | null;
}

interface FeedbackFormProps {
  ratings: RatingMetrics;
  feedback: string;
  onRatingsChange: (ratings: RatingMetrics) => void;
  onFeedbackChange: (value: string) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  ratings,
  feedback,
  onRatingsChange,
  onFeedbackChange,
}) => {
  const handleRatingChange = (
    metric: keyof RatingMetrics,
    value: number | null,
  ) => {
    onRatingsChange({
      ...ratings,
      [metric]: value,
    });
  };

  const metrics: Array<{ key: keyof RatingMetrics; label: string }> = [
    { key: "accuracy", label: "Accuracy" },
    { key: "completeness", label: "Completeness" },
    { key: "relevance", label: "Relevance" },
    { key: "safety", label: "Safety" },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Box>
        <Typography
          variant="subtitle2"
          sx={{
            mb: 2.5,
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "text.secondary",
            textTransform: "uppercase",
          }}
        >
          Ratings
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {metrics.map(({ key, label }) => (
            <Box
              key={key}
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: "30%" }}>
                <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                  {label}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: "70%",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Rating
                  value={ratings[key]}
                  onChange={(_, newValue) => handleRatingChange(key, newValue)}
                  precision={1}
                  max={5}
                  size="large"
                />
                <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                  {ratings[key] !== null ? `${ratings[key]}/5` : ""}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box>
        <Typography
          variant="subtitle2"
          sx={{
            mb: 1.5,
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "text.secondary",
            textTransform: "uppercase",
          }}
        >
          Comments
        </Typography>
        <TextField
          multiline
          rows={10}
          fullWidth
          placeholder="Enter your comments here..."
          value={feedback}
          onChange={(e) => onFeedbackChange(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontFamily: "monospace",
              fontSize: "0.875rem",
              backgroundColor: "background.paper",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default FeedbackForm;
