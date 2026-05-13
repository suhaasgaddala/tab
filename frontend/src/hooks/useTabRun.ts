import { useCallback, useRef, useState } from "react";
import type { RunState, TabRunRequest, TabRunResult } from "../lib/types";

const INITIAL_STATE: RunState = {
  status: "idle",
  result: null,
  error: null
};

export function useTabRun() {
  const [state, setState] = useState<RunState>(INITIAL_STATE);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState(INITIAL_STATE);
  }, []);

  const run = useCallback(async (input: TabRunRequest) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setState({ status: "loading", result: null, error: null });

    try {
      const response = await fetch("/v1/tab/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal: controller.signal
      });

      const body = (await response.json().catch(() => null)) as TabRunResult | { error?: { message?: string } } | null;

      if (!response.ok || !body || !("ok" in body)) {
        const message =
          body && "error" in body && body.error?.message
            ? body.error.message
            : `Tab run failed with HTTP ${response.status}`;
        setState({ status: "error", result: null, error: message });
        return;
      }

      setState({ status: "success", result: body, error: null });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      setState({
        status: "error",
        result: null,
        error: error instanceof Error ? error.message : "Tab run failed"
      });
    }
  }, []);

  return { state, run, reset };
}
