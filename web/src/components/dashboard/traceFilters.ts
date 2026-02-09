import type { Trace } from "../../types/trace";

export const calculateCounts = (
  traces: Trace[],
): {
  Status: { label: string; count: number }[];
  Type: { label: string; count: number }[];
} => {
  let successCount = 0;
  let errorCount = 0;
  let traceCount = 0;
  let episodeCount = 0;

  traces.forEach((trace) => {
    // Check for errors
    const hasError = trace.spans.some(
      (span) => span.attributes?.["otel.status_code"] === "ERROR",
    );

    if (hasError) {
      errorCount++;
    } else {
      successCount++;
    }
  });

  return {
    Status: [
      { label: "Success", count: successCount },
      { label: "Error", count: errorCount },
    ],
    Type: [
      { label: "Trace", count: traceCount },
      { label: "Episode", count: episodeCount },
    ],
  };
};
