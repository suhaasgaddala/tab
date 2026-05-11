import type { CanvasAction, CanvasObject, CanvasObjectType } from "./types.js";

export function createObjectAction(object: CanvasObject): CanvasAction {
  return {
    type: "create_object",
    payload: object as unknown as Record<string, unknown>
  };
}

export function createGroupAction(payload: {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
}): CanvasAction {
  return {
    type: "create_group",
    payload
  };
}

export function moveObjectAction(id: string, x: number, y: number): CanvasAction {
  return {
    type: "move_object",
    payload: { id, x, y }
  };
}

export function updateObjectAction(id: string, patch: Partial<CanvasObject>): CanvasAction {
  return {
    type: "update_object",
    payload: { id, ...patch }
  };
}

export function createConnectionAction(payload: {
  id: string;
  fromId: string;
  toId: string;
  label?: string;
  color?: string;
}): CanvasAction {
  return {
    type: "create_connection",
    payload
  };
}

export function summarizeCanvasAction(summary: string): CanvasAction {
  return {
    type: "summarize_canvas",
    payload: { summary }
  };
}

export function organizeCanvasAction(layout: string): CanvasAction {
  return {
    type: "organize_canvas",
    payload: { layout }
  };
}

export function makeCanvasObject(input: {
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
}): CanvasObject {
  return input;
}
