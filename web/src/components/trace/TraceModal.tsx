import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import FeedbackForm from "./FeedbackForm";

interface TraceModalProps {
  open: boolean;
  onClose: () => void;
  type: "feedback" | "evaluate";
  id: string;
}

const TraceModal: React.FC<TraceModalProps> = ({ open, onClose, type, id }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");

  const handleSubmitFeedback = async () => {
    await fetch(`api/traces/${id}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, feedback }),
    });
    onClose();
  };

  const renderContent = () => {
    switch (type) {
      case "feedback":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Provide Feedback
            </Typography>

            <FeedbackForm
              rating={rating}
              feedback={feedback}
              onRatingChange={setRating}
              onFeedbackChange={setFeedback}
            />
          </Box>
        );
      case "evaluate":
        return <></>;
    }
  };

  const renderActions = () => {
    switch (type) {
      case "feedback":
        return (
          <>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmitFeedback}>
              Submit
            </Button>
          </>
        );
      case "evaluate":
        return <></>;
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            width: "60vw",
            height: "50vh",
          },
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <Close />
      </IconButton>

      <DialogContent>{renderContent()}</DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>{renderActions()}</DialogActions>
    </Dialog>
  );
};

export default TraceModal;
