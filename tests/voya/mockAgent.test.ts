import { describe, expect, it } from "vitest";
import { runMockVoyaAgent } from "../../src/voya/mockAgent.js";

const baseRequest = {
  canvasId: "demo",
  mode: "text" as const,
  selectedObjectIds: [],
  objects: [
    {
      id: "insights",
      type: "note" as const,
      title: "user insights",
      text: "onboarding needs clarity",
      x: 100,
      y: 100
    }
  ]
};

describe("runMockVoyaAgent", () => {
  it("creates three task actions for task commands", () => {
    const result = runMockVoyaAgent({
      ...baseRequest,
      command: "Turn this into tasks"
    });

    expect(result.actions).toHaveLength(3);
    expect(result.actions.every((action) => action.type === "create_object")).toBe(true);
  });

  it("creates flow nodes and connectors for diagram commands", () => {
    const result = runMockVoyaAgent({
      ...baseRequest,
      command: "Create a flow diagram"
    });

    expect(result.actions.some((action) => action.type === "create_connection")).toBe(true);
    expect(result.actions.filter((action) => action.type === "create_object")).toHaveLength(4);
  });
});
