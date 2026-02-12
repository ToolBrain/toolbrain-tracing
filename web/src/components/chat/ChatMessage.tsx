import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import type { Message } from "./engine/chatEngine";
import { AssistantAvatar, UserAvatar } from "./Icons";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        gap: 1,
        mb: 2,
      }}
    >
      {!isUser && <AssistantAvatar />}

      <Paper
        elevation={1}
        sx={{
          maxWidth: "80%",
          px: 1.5,
          py: 1,
          bgcolor: isUser ? "primary.main" : "background.default",
          color: isUser ? "primary.contrastText" : "text.primary",
          borderRadius: 2,
          fontSize: "0.875rem",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.875rem",
            lineHeight: 1.5,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {message.content}
        </Typography>
      </Paper>

      {isUser && <UserAvatar />}
    </Box>
  );
};
