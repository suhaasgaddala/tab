import type { AgentTraceStep, CanvasAction, VoyaAgentPolicy } from "./types.js";

export const voyaAgentPolicy: VoyaAgentPolicy = {
  maxActionsPerRun: 12,
  allowedActions: [
    "create_object",
    "update_object",
    "move_object",
    "create_connection",
    "create_group",
    "summarize_canvas",
    "organize_canvas"
  ],
  blockedActions: ["delete_all_objects", "export_private_data", "access_external_accounts"],
  requireConfirmationFor: ["deleting objects", "sharing canvases", "exporting data"]
};

export function applyVoyaPolicy(actions: CanvasAction[]): {
  actions: CanvasAction[];
  trace: AgentTraceStep[];
} {
  const trace: AgentTraceStep[] = [];
  const approved: CanvasAction[] = [];

  for (const action of actions) {
    if (approved.length >= voyaAgentPolicy.maxActionsPerRun) {
      trace.push({
        step: "Apply policy",
        status: "skipped",
        detail: `Skipped ${action.type}; maxActionsPerRun is ${voyaAgentPolicy.maxActionsPerRun}.`
      });
      continue;
    }

    if (!voyaAgentPolicy.allowedActions.includes(action.type)) {
      trace.push({
        step: "Apply policy",
        status: "skipped",
        detail: `Skipped ${action.type}; it requires confirmation or is not allowed in Phase 1.`
      });
      continue;
    }

    approved.push(action);
  }

  trace.push({
    step: "Apply policy",
    status: "approved",
    detail: `Approved ${approved.length} structured canvas action${approved.length === 1 ? "" : "s"}.`
  });

  return { actions: approved, trace };
}
