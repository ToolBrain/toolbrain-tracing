import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  LinearProgress,
  Chip,
  Alert,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import type { Span, Trace } from "../../types/trace";
import { parseLLMContent } from "./utils";
import SpanContent from "./SpanContent";
import TokenUsageBar from "./TokenUsageBar";
import {
  spanGetType,
  spanGetToolName,
  spanHasError,
  spanGetUsage,
  spanGetInput,
  spanGetOutput,
  spanGetSystemPrompt,
} from "../utils/spanUtils";
import { traceGetEvaluation } from "../utils/traceUtils";
import { submitTraceFeedback } from "../utils/api";
import StatusChip from "../dashboard/StatusChip";

interface SpanDetailsProps {
  span: Span | null;
  trace: Trace | null;
}

const SpanDetails: React.FC<SpanDetailsProps> = ({ span, trace }) => {
  const evaluation = useMemo(() => {
    if (!trace) return null;
    return traceGetEvaluation(trace) ?? null;
  }, [trace]);

  const aiRating =
    typeof evaluation?.rating === "number" ? evaluation.rating : null;
  const aiFeedback =
    typeof evaluation?.feedback === "string" ? evaluation.feedback : "";
  const aiConfidence =
    typeof evaluation?.confidence === "number" ? evaluation.confidence : null;
  const aiStatus =
    typeof evaluation?.status === "string" ? evaluation.status : null;

  const [expertRating, setExpertRating] = useState<number | null>(null);
  const [expertComment, setExpertComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(true);

  useEffect(() => {
    setSubmitError("");
    setSuccessOpen(false);
    setExpertRating(aiRating);
    setExpertComment(aiFeedback);
  }, [trace?.trace_id]);

  useEffect(() => {
    if (!trace) return;
    setExpertRating(aiRating);
    setExpertComment(aiFeedback);
  }, [trace, aiRating, aiFeedback]);

  const handleSubmit = async () => {
    if (!trace || expertRating === null) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await submitTraceFeedback(trace.trace_id, expertRating, expertComment);
      setSuccessOpen(true);
    } catch (error: any) {
      setSubmitError(error?.message || "Failed to submit validation.");
    } finally {
      setSubmitting(false);
    }
  };

  const confidenceColor =
    aiConfidence === null
      ? "inherit"
      : aiConfidence < 0.5
        ? "error"
        : aiConfidence < 0.8
          ? "warning"
          : "success";

  const matchesAISuggestion =
    !!evaluation && expertRating === aiRating && expertComment === aiFeedback;

  const hasEdited =
    !!evaluation && (expertRating !== aiRating || expertComment !== aiFeedback);

  // Capturing JSON span attributes
  const spanType = span ? spanGetType(span) : "unknown";
  const toolName = span ? spanGetToolName(span) : "";
  const hasError = span ? spanHasError(span) : false;
  const usage = span ? spanGetUsage(span) : null;
  const input = span ? spanGetInput(span) : "";
  const output = span ? spanGetOutput(span) : "";
  const systemPrompt = span ? spanGetSystemPrompt(span) : "";

  return (
    <Box
      sx={{
        width: "75%",
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.default",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5">Evaluation and Governance</Typography>
        <Button
          size="small"
          variant="outlined"
          onClick={() => setShowEvaluation((prev) => !prev)}
          startIcon={showEvaluation ? <ExpandLess /> : <ExpandMore />}
        >
          {showEvaluation ? "Collapse" : "Expand"}
        </Button>
      </Box>

      {showEvaluation && (
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
            alignItems: "start",
          }}
        >
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px dashed",
              borderColor: "divider",
              bgcolor: "action.hover",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                AI-Generated Assessment
              </Typography>
              <Chip
                label="AI Draft"
                size="small"
                color="primary"
                sx={{
                  borderColor: "divider",
                  border: "1px solid",
                  p: 1,
                  borderRadius: 2,
                }}
              />
            </Box>

            {aiConfidence === null ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <LinearProgress />
                <Typography variant="body2" color="text.secondary">
                  AI Judge is analyzing reasoning patterns...
                </Typography>
              </Box>
            ) : (
              <>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    AI Rating
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Rating
                      value={aiRating}
                      readOnly
                      max={5}
                      precision={1}
                      size="small"
                      sx={{ color: "#f0c36b" }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {aiRating !== null ? `${aiRating}/5` : ""}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Confidence
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(aiConfidence ?? 0) * 100}
                        color={
                          confidenceColor as "error" | "warning" | "success"
                        }
                        sx={{ height: 6, borderRadius: 2 }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {((aiConfidence ?? 0) * 100).toFixed(0)}%
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    AI Rationale
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {aiFeedback || "No AI rationale provided."}
                  </Typography>
                </Box>

                {aiStatus && (
                  <Box>
                    <StatusChip status={aiStatus} />
                  </Box>
                )}
              </>
            )}
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: hasEdited ? "primary.light" : "divider",
              bgcolor: "background.paper",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Reviewer Validation
            </Typography>

            {matchesAISuggestion && (
              <Typography variant="caption" color="success.main">
                Matches AI Suggestion
              </Typography>
            )}
            {hasEdited && (
              <Typography variant="caption" color="text.secondary">
                Edited from AI Suggestion
              </Typography>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Final Rating
              </Typography>
              <Rating
                value={expertRating}
                onChange={(_, value) => setExpertRating(value)}
                max={5}
                precision={1}
                size="medium"
              />
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Comment
              </Typography>
              <TextField
                multiline
                minRows={4}
                fullWidth
                value={expertComment}
                onChange={(e) => setExpertComment(e.target.value)}
                placeholder="Adjust the AI rationale if needed..."
                sx={{
                  mt: 1,
                  "& .MuiOutlinedInput-root": {
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                  },
                }}
              />
            </Box>

            {submitError && <Alert severity="error">{submitError}</Alert>}

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={expertRating === null || submitting}
            >
              {submitting ? "Submitting..." : "Verify and Submit"}
            </Button>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "background.default",
          }}
        >
          <Typography variant="h6">Span Properties</Typography>
        </Box>

        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", p: 2 }}>
          {!span && (
            <Box sx={{ textAlign: "center", color: "text.secondary" }}>
              Select a span to view details
            </Box>
          )}

          {span && (
            <>
              <SpanContent
                title="System Prompt"
                subtitle="System"
                content={systemPrompt}
                hasError={hasError}
              />

              {spanType === "tool_execution" && (
                <>
                  <SpanContent
                    title="Tool"
                    subtitle="Tool"
                    content={toolName}
                    hasError={hasError}
                  />
                  <SpanContent
                    title="Input"
                    subtitle="AI"
                    content={input}
                    hasError={hasError}
                  />
                  <SpanContent
                    title="Output"
                    subtitle="Tool"
                    content={output}
                    hasError={hasError}
                  />
                </>
              )}

              {spanType === "llm_inference" && (
                <>
                  {input &&
                    (() => {
                      const parsed = parseLLMContent(input);
                      return (
                        parsed && (
                          <SpanContent
                            title="Input"
                            subtitle={parsed.subtitle}
                            content={parsed.content}
                            hasError={hasError}
                          />
                        )
                      );
                    })()}
                  {output && (
                    <SpanContent
                      title="Output"
                      subtitle="AI"
                      content={output}
                      hasError={hasError}
                    />
                  )}
                </>
              )}

              {usage && <TokenUsageBar usage={usage} hasError={hasError} />}
            </>
          )}
        </Box>
      </Box>

      <Dialog open={successOpen} onClose={() => setSuccessOpen(false)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Submitted
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Validation saved successfully.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setSuccessOpen(false)}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SpanDetails;
