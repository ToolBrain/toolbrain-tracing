import type { Span } from "../../types/trace";

export function spanGetType(span: Span | null) {
  return span?.attributes["toolbrain.span.type"];
}

export function spanGetToolName(span: Span | null) {
  return span?.attributes["toolbrain.tool.name"];
}

export function spanHasError(span: Span | null) {
  return span?.attributes["otel.status_code"] === "ERROR";
}

export function spanGetUsage(span: Span | null) {
  return span?.attributes["toolbrain.usage"];
}

export function spanGetInput(span: Span | null) {
  const type = spanGetType(span);
  return type === "llm_inference"
    ? span?.attributes["toolbrain.llm.new_content"]
    : span?.attributes["toolbrain.tool.input"];
}

export function spanGetOutput(span: Span | null) {
  const type = spanGetType(span);
  return type === "llm_inference"
    ? span?.attributes["toolbrain.llm.completion"]
    : span?.attributes["toolbrain.tool.output"];
}

export function spanGetSystemPrompt(span: Span | null) {
  return span?.attributes["system_prompt"];
}
