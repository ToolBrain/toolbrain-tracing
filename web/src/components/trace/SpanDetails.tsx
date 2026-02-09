import React from "react";
import { Box, Typography } from "@mui/material";
import type { Span } from "../../types/trace";
import { parseLLMContent } from "./utils";
import SpanContent from "./SpanContent";
import TokenUsageBar from "./TokenUsageBar";

interface SpanDetailsProps {
  span: Span | null;
}

const SpanDetails: React.FC<SpanDetailsProps> = ({ span }) => {
  // Capturing JSON span attributes
  const spanType = span?.attributes["toolbrain.span.type"];
  const toolName = span?.attributes["toolbrain.tool.name"];
  const hasError = span?.attributes["otel.status_code"] === "ERROR";
  const usage = span?.attributes["toolbrain.usage"];
  const input =
    spanType === "llm_inference"
      ? span?.attributes["toolbrain.llm.new_content"]
      : span?.attributes["toolbrain.tool.input"];
  const output =
    spanType === "llm_inference"
      ? span?.attributes["toolbrain.llm.completion"]
      : span?.attributes["toolbrain.tool.output"];
  const systemPrompt = span?.attributes["system_prompt"];

  return (
    <Box sx={{ width: "75%", bgcolor: "background.paper", overflowY: "auto" }}>
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.default",
        }}
      >
        <Typography variant="h5">Span Details</Typography>
      </Box>
      {span ? (
        <Box sx={{ p: 2 }}>
          <SpanContent
            title="System Prompt"
            subtitle="System"
            content={systemPrompt}
            hasError={hasError}
          />

          {spanType === "tool_execution" && (
            <>
              {
                <SpanContent
                  title="Tool"
                  subtitle="Tool"
                  content={toolName}
                  hasError={hasError}
                />
              }
              {
                <SpanContent
                  title="Input"
                  subtitle="AI"
                  content={input}
                  hasError={hasError}
                />
              }
              {
                <SpanContent
                  title="Output"
                  subtitle="Tool"
                  content={output}
                  hasError={hasError}
                />
              }
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
        </Box>
      ) : (
        <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
          Select a span to view details
        </Box>
      )}
    </Box>
  );
};

export default SpanDetails;
