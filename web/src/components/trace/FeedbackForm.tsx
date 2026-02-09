import React from "react";
import { Box, TextField, Typography, Rating, Slider } from "@mui/material";

interface FeedbackFormProps {
  rating: number | null;
  feedback: string;
  onRatingChange: (value: number | null) => void;
  onFeedbackChange: (value: string) => void;
  disabled?: boolean;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  rating,
  feedback,
  onRatingChange,
  onFeedbackChange,
  disabled = false,
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
          Rating
        </Typography>
        <Rating
          value={rating}
          onChange={(_, newValue) => onRatingChange(newValue)}
          precision={0.5}
          size="large"
          disabled={disabled}
        />
        <Slider
          value={rating ?? 0}
          onChange={(_, newValue) => onRatingChange(newValue as number)}
          step={0.1}
          min={0}
          max={5}
          valueLabelDisplay="auto"
          disabled={disabled}
          sx={{ mt: 1 }}
        />
        {rating !== null && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            {rating.toFixed(1)} / 5.0
          </Typography>
        )}
      </Box>

      <Box>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
          Comments
        </Typography>
        <TextField
          multiline
          rows={10}
          fullWidth
          placeholder="Enter your feedback here..."
          value={feedback}
          onChange={(e) => onFeedbackChange(e.target.value)}
          disabled={disabled}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontFamily: "monospace",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default FeedbackForm;
