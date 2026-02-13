import type { Trace } from "../../types/trace";

export function traceGetEpisodeId(trace: Trace | null) {
  return trace?.attributes["tracebrain.episode.id"];
}

export function traceGetStatus(trace: Trace | null) {
  return trace?.attributes["tracebrain.trace.status"];
}

export function traceGetPriority(trace: Trace | null) {
  return trace?.attributes["tracebrain.trace.priority"];
}
