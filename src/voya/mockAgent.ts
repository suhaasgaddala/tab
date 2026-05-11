import {
  createConnectionAction,
  createGroupAction,
  createObjectAction,
  makeCanvasObject,
  moveObjectAction,
  organizeCanvasAction,
  summarizeCanvasAction
} from "./canvasActions.js";
import type { AgentRunRequest, AgentRunResponse, AgentTraceStep, CanvasAction, CanvasObject } from "./types.js";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 36);
}

function textFromObject(object: CanvasObject): string {
  return [object.title, object.text].filter(Boolean).join(": ");
}

function summarizeObjects(objects: CanvasObject[]): string {
  if (objects.length === 0) {
    return "This canvas is ready for a first idea. Add a voice note or card and voya can organize it into structure.";
  }

  const themes = objects
    .filter((object) => object.type !== "connector" && object.type !== "group")
    .slice(0, 5)
    .map((object) => object.title ?? object.text ?? object.id);

  return `This canvas focuses on ${themes.join(", ")} and is moving toward a clearer set of notes, tasks, diagrams, and next steps.`;
}

function taskActions(objects: CanvasObject[]): CanvasAction[] {
  const source = objects.filter((object) => object.type !== "connector" && object.type !== "group").slice(0, 3);
  const fallback = [
    "Interview target users",
    "Prioritize product outcomes",
    "Draft the first workflow"
  ];

  const seed = Array.from({ length: 3 }, (_, index) => {
    return source[index] ?? { id: `seed_${index}`, title: fallback[index], text: fallback[index], type: "note" as const, x: 0, y: 0 };
  });

  return seed
    .map((object, index) =>
      createObjectAction(
        makeCanvasObject({
          id: `task_${slugify(object.title ?? object.id)}_${index + 1}`,
          type: "task",
          title: object.title?.startsWith("Task:") ? object.title : `Task: ${object.title ?? fallback[index]}`,
          text: `Turn "${object.title ?? object.text ?? fallback[index]}" into an owner, deadline, and next action.`,
          x: 520 + index * 230,
          y: 640,
          width: 210,
          height: 126,
          color: "yellow",
          metadata: { generatedBy: "voya", sourceObjectId: object.id }
        })
      )
    );
}

function flowActions(objects: CanvasObject[]): CanvasAction[] {
  const labels = ["capture idea", "organize", "decide", "ship workflow"];
  const nodes = labels.map((label, index) =>
    makeCanvasObject({
      id: `flow_${slugify(label)}`,
      type: "diagram",
      title: label,
      text: index === 0 ? "Voice, gesture, or card input" : undefined,
      x: 460 + index * 190,
      y: 430,
      width: 150,
      height: 82,
      color: index === 1 ? "blue" : index === 2 ? "purple" : "green",
      metadata: { generatedBy: "voya", shape: index === 2 ? "diamond" : "rounded" }
    })
  );

  const connections = nodes.slice(0, -1).map((node, index) =>
    createConnectionAction({
      id: `conn_${node.id}_${nodes[index + 1].id}`,
      fromId: node.id,
      toId: nodes[index + 1].id,
      color: "#0057ff"
    })
  );

  const anchored = objects[0]
    ? [
        createConnectionAction({
          id: `conn_${objects[0].id}_${nodes[0].id}`,
          fromId: objects[0].id,
          toId: nodes[0].id,
          color: "#7c3aed"
        })
      ]
    : [];

  return [...nodes.map(createObjectAction), ...connections, ...anchored];
}

function relatedIdeaActions(objects: CanvasObject[]): CanvasAction[] {
  const topics = objects
    .filter((object) => object.type !== "connector" && object.type !== "group")
    .slice(0, 3)
    .map((object) => object.title ?? object.text ?? "idea");

  const fallback = ["Map user moments", "Compare workflow patterns", "List decision points"];
  const ideas = Array.from({ length: 3 }, (_, index) => (topics[index] ? `Explore adjacent angle: ${topics[index]}` : fallback[index]));

  return ideas.map((idea, index) =>
    createObjectAction(
      makeCanvasObject({
        id: `idea_${slugify(idea)}_${index + 1}`,
        type: "note",
        title: idea,
        text: "Suggested by voya based on the current canvas context.",
        x: 980,
        y: 180 + index * 150,
        width: 240,
        height: 118,
        color: "blue",
        metadata: { generatedBy: "voya", suggestion: true }
      })
    )
  );
}

function organizeActions(objects: CanvasObject[]): CanvasAction[] {
  const movable = objects.filter((object) => object.type !== "connector" && object.type !== "group").slice(0, 6);
  const groups = [
    createGroupAction({
      id: "group_ai_suggested",
      title: "AI suggested group",
      x: 380,
      y: 455,
      width: 610,
      height: 260,
      color: "blue"
    })
  ];

  const moves = movable.map((object, index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    return moveObjectAction(object.id, 430 + column * 180, 535 + row * 90);
  });

  return [...groups, ...moves, organizeCanvasAction("Grouped related ideas into an AI suggested section.")];
}

export function runMockVoyaAgent(request: AgentRunRequest): AgentRunResponse {
  const command = request.command.toLowerCase();
  const trace: AgentTraceStep[] = [
    {
      step: "Read canvas context",
      status: "completed",
      detail: `Loaded ${request.objects.length} canvas object${request.objects.length === 1 ? "" : "s"}.`
    }
  ];

  let answer = "I added a helpful note to your canvas.";
  let summary: string | undefined;
  let actions: CanvasAction[] = [];
  let intent = "create_note";

  if (command.includes("summar")) {
    intent = "summarize_canvas";
    summary = summarizeObjects(request.objects);
    answer = "I summarized the canvas and pulled the main themes into a concise view.";
    actions = [summarizeCanvasAction(summary)];
  } else if (command.includes("task")) {
    intent = "turn_into_tasks";
    summary = summarizeObjects(request.objects);
    answer = "I turned the strongest notes into task cards with clear next actions.";
    actions = taskActions(request.objects);
  } else if (command.includes("flow") || command.includes("diagram")) {
    intent = "create_flow_diagram";
    answer = "I created a simple flow diagram that connects capture, organization, decisions, and execution.";
    actions = flowActions(request.objects);
  } else if (command.includes("organize") || command.includes("group")) {
    intent = "organize_canvas";
    summary = summarizeObjects(request.objects);
    answer = "I organized your canvas into product strategy and next-step sections.";
    actions = organizeActions(request.objects);
  } else if (command.includes("related") || command.includes("ideas")) {
    intent = "find_related_ideas";
    answer = "I found related ideas and placed them as suggestion cards near your active canvas area.";
    actions = relatedIdeaActions(request.objects);
  } else {
    const id = `note_${slugify(request.command || "new_idea") || "new_idea"}`;
    actions = [
      createObjectAction(
        makeCanvasObject({
          id,
          type: "note",
          title: request.command.slice(0, 56),
          text: "Captured from your command.",
          x: 520,
          y: 360,
          width: 240,
          height: 128,
          color: "blue",
          metadata: { generatedBy: "voya", source: request.mode }
        })
      )
    ];
  }

  trace.push(
    {
      step: "Classify intent",
      status: "completed",
      detail: `Detected ${intent} intent from "${request.command}".`
    },
    {
      step: "Generate canvas actions",
      status: "completed",
      detail: `Created ${actions.length} structured action${actions.length === 1 ? "" : "s"} from context: ${request.objects
        .slice(0, 3)
        .map(textFromObject)
        .filter(Boolean)
        .join(" | ") || "empty canvas"}.`
    }
  );

  return { answer, summary, actions, trace };
}
