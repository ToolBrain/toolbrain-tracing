import type { Trace } from "../../types/trace";

export const fetchTraces = async (): Promise<Trace[]> => {
  try {
    const response = await fetch("/api/traces");
    if (!response.ok) {
      throw new Error(`Failed to fetch traces: ${response.status}`);
    }
    const data = await response.json();
    return data.traces;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchTrace = async (id: string): Promise<Trace[]> => {
  try {
    const response = await fetch(`/api/traces/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch trace: ${response.status}`);
    }
    const trace: Trace = await response.json();
    return [trace];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
