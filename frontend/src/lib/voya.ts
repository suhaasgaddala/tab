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

export interface CanvasAction {
  type:
    | "create_object"
    | "update_object"
    | "delete_object"
    | "move_object"
    | "create_connection"
    | "create_group"
    | "summarize_canvas"
    | "organize_canvas";
  payload: Record<string, unknown>;
}

export interface AgentRunRequest {
  canvasId: string;
  command: string;
  mode: "voice" | "text" | "gesture";
  selectedObjectIds?: string[];
  objects: CanvasObject[];
}

export interface AgentRunResponse {
  answer: string;
  summary?: string;
  actions: CanvasAction[];
  trace: {
    step: string;
    status: "approved" | "skipped" | "completed";
    detail: string;
  }[];
}

export async function runVoyaAgent(input: AgentRunRequest): Promise<AgentRunResponse> {
  if (import.meta.env.DEV && typeof window !== "undefined" && window.location.hostname.startsWith("100.")) {
    return runLocalVoyaFallback(input);
  }

  return postVoyaAgent("/v1/voya/agent/run", input).catch((error: unknown) => {
    if (typeof window !== "undefined" && !["localhost", "127.0.0.1"].includes(window.location.hostname)) {
      return postVoyaAgent("/api/voya/agent/run", input).catch(() => runLocalVoyaFallback(input));
    }

    throw error;
  });
}

async function postVoyaAgent(endpoint: string, input: AgentRunRequest): Promise<AgentRunResponse> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 4_000);

  const response = await fetch(endpoint, {
    method: "POST",
    signal: controller.signal,
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(input)
  }).finally(() => window.clearTimeout(timeout));

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `voya agent failed with ${response.status}`);
  }

  return response.json() as Promise<AgentRunResponse>;
}

function runLocalVoyaFallback(input: AgentRunRequest): AgentRunResponse {
  const command = input.command.toLowerCase();
  const summary =
    input.objects.length > 0
      ? `This canvas focuses on ${input.objects
          .filter((object) => object.type !== "connector" && object.type !== "group")
          .slice(0, 4)
          .map((object) => object.title ?? object.text ?? "ideas")
          .join(", ")} and is ready to become a clearer workflow.`
      : "This canvas is ready for a first idea. Add a note or voice command and voya can organize it.";

  let answer = "I captured that as a new note.";
  let actions: CanvasAction[] = [
    {
      type: "create_object",
      payload: {
        id: `note_${Date.now().toString(36)}`,
        type: "note",
        title: input.command.slice(0, 54),
        text: "Captured from your command.",
        x: 540,
        y: 360,
        width: 230,
        height: 130,
        color: "blue",
        metadata: { generatedBy: "voya" }
      }
    }
  ];

  if (command.includes("summar")) {
    answer = "I summarized the space.";
    actions = [{ type: "summarize_canvas", payload: { summary } }];
  } else if (command.includes("task")) {
    answer = "I turned the strongest notes into task cards with clear next actions.";
    const sources = input.objects.filter((object) => object.type !== "connector" && object.type !== "group").slice(0, 3);
    const fallback = ["Interview target users", "Prioritize product outcomes", "Draft the first workflow"];
    actions = Array.from({ length: 3 }, (_, index) => {
      const object = sources[index];
      const title = object?.title ?? fallback[index];
      return {
        type: "create_object",
        payload: {
          id: `task_${object?.id ?? `seed_${index}`}_${index + 1}`,
          type: "task",
          title: `Task: ${title}`,
          text: `Turn "${title}" into an owner, deadline, and next step.`,
          x: 520 + index * 220,
          y: 660,
          width: 210,
          height: 126,
          color: "yellow",
          metadata: { generatedBy: "voya" }
        }
      };
    });
  } else if (command.includes("flow") || command.includes("diagram")) {
    answer = "I created a simple flow diagram from the canvas context.";
    const nodes: CanvasAction[] = ["capture", "organize", "decide", "ship"].map((title, index) => ({
      type: "create_object" as const,
      payload: {
        id: `flow_${title}`,
        type: "diagram",
        title,
        x: 480 + index * 180,
        y: 430,
        width: 145,
        height: 82,
        color: index === 1 ? "blue" : "purple",
        metadata: { generatedBy: "voya" }
      }
    }));
    const connectors = ["capture", "organize", "decide"].map((title, index) => ({
      type: "create_connection" as const,
      payload: { id: `conn_flow_${title}`, fromId: `flow_${title}`, toId: `flow_${["organize", "decide", "ship"][index]}`, color: "#0057ff" }
    }));
    actions = [...nodes, ...connectors];
  } else if (command.includes("related") || command.includes("ideas")) {
    answer = "I found related ideas and added suggestion cards.";
    actions = ["Map user moments", "Compare workflow patterns", "List decision points"].map((title, index) => ({
      type: "create_object",
      payload: {
        id: `idea_${index + 1}`,
        type: "note",
        title,
        text: "Suggested by voya based on this canvas.",
        x: 980,
        y: 170 + index * 145,
        width: 230,
        height: 118,
        color: "blue",
        metadata: { generatedBy: "voya" }
      }
    }));
  } else if (command.includes("organize")) {
    answer = "I organized your canvas into an AI suggested group.";
    actions = [
      {
        type: "create_group",
        payload: { id: "group_ai_suggested", title: "AI suggested group", x: 380, y: 455, width: 610, height: 260, color: "blue" }
      },
      ...input.objects
        .filter((object) => object.type !== "connector" && object.type !== "group")
        .slice(0, 6)
        .map((object, index) => ({
          type: "move_object" as const,
          payload: { id: object.id, x: 430 + (index % 3) * 180, y: 535 + Math.floor(index / 3) * 90 }
        }))
    ];
  }

  return {
    answer,
    summary,
    actions,
    trace: [
      { step: "Read canvas context", status: "completed", detail: `Loaded ${input.objects.length} canvas objects.` },
      { step: "Classify intent", status: "completed", detail: `Detected command: ${input.command}.` },
      { step: "Generate canvas actions", status: "completed", detail: `Created ${actions.length} structured actions.` },
      { step: "Apply policy", status: "approved", detail: "Approved structured canvas actions." }
    ]
  };
}

export function createCanvasId(): string {
  return `canvas_${Date.now().toString(36)}`;
}

export const sampleCanvasObjects: CanvasObject[] = [
  {
    id: "user_insights",
    type: "note",
    title: "user insights",
    text: "simplify onboarding\nclearer pricing\nmobile-first",
    x: 220,
    y: 120,
    width: 230,
    height: 150,
    color: "blue",
    metadata: { tag: "Research" }
  },
  {
    id: "product_vision",
    type: "note",
    title: "product vision",
    text: "Empower teams to think out loud and build together.",
    x: 560,
    y: 220,
    width: 230,
    height: 160,
    color: "royal",
    metadata: { tag: "Core" }
  },
  {
    id: "key_outcomes",
    type: "note",
    title: "key outcomes",
    text: "faster ideation\naligned teams\nmeasurable impact",
    x: 980,
    y: 200,
    width: 245,
    height: 150,
    color: "purple",
    metadata: { tag: "Goals" }
  },
  {
    id: "next_steps",
    type: "task",
    title: "next steps",
    text: "user interviews\ncompetitor scan\nprototype flow",
    x: 260,
    y: 410,
    width: 210,
    height: 160,
    color: "yellow",
    metadata: { tag: "Today" }
  },
  {
    id: "flow_diagram",
    type: "diagram",
    title: "flow diagram",
    text: "capture -> organize -> decide",
    x: 590,
    y: 470,
    width: 250,
    height: 180,
    color: "white",
    metadata: { tag: "Workflow" }
  },
  {
    id: "design_direction",
    type: "note",
    title: "design direction",
    text: "clean canvas UI\nsoft blue cards\nvoice-first controls",
    x: 930,
    y: 470,
    width: 230,
    height: 170,
    color: "green",
    metadata: { tag: "Design" }
  },
  {
    id: "conn_user_product",
    type: "connector",
    x: 0,
    y: 0,
    metadata: { fromId: "user_insights", toId: "product_vision", color: "#0057ff" }
  },
  {
    id: "conn_steps_product",
    type: "connector",
    x: 0,
    y: 0,
    metadata: { fromId: "next_steps", toId: "product_vision", color: "#0057ff" }
  },
  {
    id: "conn_product_outcomes",
    type: "connector",
    x: 0,
    y: 0,
    metadata: { fromId: "product_vision", toId: "key_outcomes", color: "#9b5cf6" }
  },
  {
    id: "conn_product_design",
    type: "connector",
    x: 0,
    y: 0,
    metadata: { fromId: "product_vision", toId: "design_direction", color: "#22c55e" }
  },
  {
    id: "conn_product_flow",
    type: "connector",
    x: 0,
    y: 0,
    metadata: { fromId: "product_vision", toId: "flow_diagram", color: "#0057ff" }
  }
];
