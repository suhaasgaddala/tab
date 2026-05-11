export type CanvasObjectType = "note" | "task" | "group" | "diagram" | "shape" | "connector";

export interface CanvasObject {
  id: string;
  type: CanvasObjectType;
  title?: string;
  text?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
  metadata?: Record<string, unknown>;
}

export type CanvasActionType =
  | "create_object"
  | "update_object"
  | "delete_object"
  | "move_object"
  | "create_connection"
  | "create_group"
  | "summarize_canvas"
  | "organize_canvas";

export interface CanvasAction {
  type: CanvasActionType;
  payload: Record<string, unknown>;
}

export interface AgentRunRequest {
  canvasId: string;
  command: string;
  mode: "voice" | "text" | "gesture";
  selectedObjectIds?: string[];
  objects: CanvasObject[];
}

export interface AgentTraceStep {
  step: string;
  status: "approved" | "skipped" | "completed";
  detail: string;
}

export interface AgentRunResponse {
  answer: string;
  summary?: string;
  actions: CanvasAction[];
  trace: AgentTraceStep[];
}

export interface VoyaAgentPolicy {
  maxActionsPerRun: number;
  allowedActions: CanvasActionType[];
  blockedActions: string[];
  requireConfirmationFor: string[];
}
