import { Chip } from "@mui/material";

export const ALLOWED_STATUSES = [
  "running",
  "completed",
  "needs_review",
  "failed",
  "success",
  "error",
] as const;

export type ChipStatus = (typeof ALLOWED_STATUSES)[number];

const STATUS_STYLES: Record<
  ChipStatus,
  { color: string; bg: string; border: string; label: string }
> = {
  running: {
    color: "#0c4a6e",
    bg: "#e0f2fe",
    border: "#38bdf8",
    label: "RUNNING",
  },
  success: {
    color: "#155724",
    bg: "#e9f4ea",
    border: "#34c759",
    label: "SUCCESS",
  },
  completed: {
    color: "#065f46",
    bg: "#d1fae5",
    border: "#10b981",
    label: "COMPLETED",
  },
  needs_review: {
    color: "#7c2d12",
    bg: "#fff7ed",
    border: "#f97316",
    label: "REVIEW",
  },
  error: { color: "#721c24", bg: "#fbe9eb", border: "#ff4d4f", label: "ERROR" },
  failed: {
    color: "#991b1b",
    bg: "#fee2e2",
    border: "#ef4444",
    label: "FAILED",
  },
};

interface StatusChipProps {
  status: ChipStatus;
  secondary?: boolean;
}

const StatusChip: React.FC<StatusChipProps> = ({
  status,
  secondary = false,
}) => {
  const styles = STATUS_STYLES[status];

  return (
    <Chip
      label={styles.label}
      size="small"
      sx={{
        fontWeight: 600,
        fontSize: "0.75rem",
        borderRadius: "1rem",
        color: styles.color,
        backgroundColor: styles.bg,
        border: `1px solid ${styles.border}`,
        minWidth: 100,
        textAlign: "center",
        opacity: secondary ? 0.7 : 1,
        ...(status === "needs_review" && {
          animation: "pulse 2s ease-in-out infinite",
          "@keyframes pulse": {
            "0%, 100%": { boxShadow: `0 0 0 0 ${styles.border}66` },
            "50%": { boxShadow: `0 0 0 0.5rem ${styles.border}00` },
          },
        }),
      }}
    />
  );
};

export default StatusChip;
