import { Box, IconButton } from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Sidebar from "./SideBar";
import MainContent from "./MainContent";
import type { Trace } from "../../types/trace";
import type { FilterOption } from "./types";
import { fetchTraces } from "../utils/api";
import TraceGraph from "./TraceGraph";
import { calculateCounts } from "./traceFilters";
import { useSettings } from "../../contexts/SettingsContext";

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 60;

const Dashboard: React.FC = () => {
  const { settings } = useSettings();
  const [traces, setTraces] = useState<Trace[]>([]);
  const [open, setOpen] = useState(true);
  const [showContent, setShowContent] = useState(true);

  const [filters, setFilters] = useState<Record<string, FilterOption[]>>({
    Status: [
      { label: "Success", checked: false, count: 0 },
      { label: "Error", checked: false, count: 0 },
    ],
  });

  // Calculate filter counts based on traces
  useEffect(() => {
    const counts = calculateCounts(traces);

    setFilters((prevFilters) => ({
      ...prevFilters,
      Status: [
        { ...prevFilters.Status[0], count: counts.Status[0].count },
        { ...prevFilters.Status[1], count: counts.Status[1].count },
      ],
    }));
  }, [traces]);

  // Function to fetch the latest traces
  const handleFetchTraces = async () => {
    try {
      const newTraces = await fetchTraces();
      if (newTraces) setTraces(newTraces);
    } catch (error) {
      console.error("Failed to fetch traces:", error);
    }
  };

  // Initial traces fetch
  useEffect(() => {
    handleFetchTraces();
  }, []);

  // Auto refresh traces
  useEffect(() => {
    if (!settings.refresh.autoRefresh) return;

    const interval = setInterval(
      handleFetchTraces,
      settings.refresh.refreshInterval * 1000,
    );

    return () => clearInterval(interval);
  }, [settings.refresh.autoRefresh, settings.refresh.refreshInterval]);

  // Check if any filter is checked
  const hasActiveFilters = Object.values(filters).some((category) =>
    category.some((filter) => filter.checked),
  );

  // Clear all filters
  const clearFilters = () => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      Object.keys(newFilters).forEach((category) => {
        newFilters[category] = newFilters[category].map((filter) => ({
          ...filter,
          checked: false,
        }));
      });
      return newFilters;
    });
  };

  // Filter traces based on active filters
  const filteredTraces = useMemo(() => {
    if (!hasActiveFilters) {
      return traces;
    }

    // Checked filters
    const checkedFilters: Record<string, string[]> = {};
    Object.keys(filters).forEach((category) => {
      const checked = filters[category]
        .filter((f) => f.checked)
        .map((f) => f.label);

      if (checked.length > 0) {
        checkedFilters[category] = checked;
      }
    });

    // Filter traces
    return traces.filter((trace) => {
      const hasError = trace.spans.some(
        (span) => span.attributes?.["otel.status_code"] === "ERROR",
      );

      const isEpisode = trace.attributes?.["toolbrain.episode.id"];

      const traceProperties: Record<string, string> = {
        Status: hasError ? "Error" : "Success",
        Type: isEpisode ? "Episode" : "Trace",
      };

      return Object.keys(checkedFilters).every((category) => {
        const traceValue = traceProperties[category];
        return checkedFilters[category].includes(traceValue);
      });
    });
  }, [traces, filters, hasActiveFilters]);

  // Slight delay before displaying contents
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setShowContent(true), 200);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [open]);

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <Box
        sx={{
          width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
          flexShrink: 0,
          bgcolor: "background.paper",
          borderRight: 1,
          borderColor: "divider",
          transition: "width 0.3s",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: open ? "flex-end" : "center",
            p: 1,
            float: "right",
          }}
        >
          <IconButton onClick={() => setOpen(!open)}>
            {open ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Box>
        {showContent && (
          <Sidebar
            filters={filters}
            setFilters={setFilters}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        )}
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          overflow: "auto",
        }}
      >
        <MainContent
          traces={filteredTraces}
          onFetchTraces={handleFetchTraces}
          graph={<TraceGraph traces={traces} />}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
