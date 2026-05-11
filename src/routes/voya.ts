import { Router, json } from "express";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import type { AppConfig } from "../config.js";
import { voyaAgentPolicy } from "../voya/agentPolicy.js";
import { runVoyaAgent } from "../voya/runVoyaAgent.js";

const canvasObjectSchema = z.object({
  id: z.string().trim().min(1),
  type: z.enum(["note", "task", "group", "diagram", "shape", "connector"]),
  title: z.string().optional(),
  text: z.string().optional(),
  x: z.number().finite(),
  y: z.number().finite(),
  width: z.number().finite().positive().optional(),
  height: z.number().finite().positive().optional(),
  color: z.string().optional(),
  metadata: z.record(z.unknown()).optional()
});

const agentRunSchema = z.object({
  canvasId: z.string().trim().min(1),
  command: z.string().trim().min(1).max(2_000),
  mode: z.enum(["voice", "text", "gesture"]),
  selectedObjectIds: z.array(z.string()).optional(),
  objects: z.array(canvasObjectSchema).default([])
});

export function createVoyaRouter(config: AppConfig): Router {
  const router = Router();
  const parseBody = json({ limit: config.jsonBodyLimit });

  const sendCapabilities = (_req: Request, res: Response) => {
    res.status(200).json({
      product: "voya",
      tagline: "Think out loud. Build visually.",
      mock_ai: config.voya.mockAi,
      capabilities: [
        "summarize_canvas",
        "turn_notes_into_tasks",
        "create_flow_diagram",
        "find_related_ideas",
        "organize_canvas"
      ],
      policy: voyaAgentPolicy
    });
  };

  router.get("/v1/voya/capabilities", sendCapabilities);
  router.get("/api/voya/capabilities", sendCapabilities);

  const runAgent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = agentRunSchema.parse(req.body);
      const result = await runVoyaAgent(parsed);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  router.post("/v1/voya/agent/run", parseBody, runAgent);
  router.post("/api/voya/agent/run", parseBody, runAgent);

  router.post("/v1/voya/canvas/summarize", parseBody, async (req, res, next) => {
    try {
      const parsed = agentRunSchema
        .omit({ command: true, mode: true })
        .extend({ command: z.string().optional(), mode: z.enum(["voice", "text", "gesture"]).optional() })
        .parse(req.body);
      const result = await runVoyaAgent({
        ...parsed,
        command: parsed.command ?? "Summarize this space",
        mode: parsed.mode ?? "text"
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post("/v1/voya/canvas/organize", parseBody, async (req, res, next) => {
    try {
      const parsed = agentRunSchema
        .omit({ command: true, mode: true })
        .extend({ command: z.string().optional(), mode: z.enum(["voice", "text", "gesture"]).optional() })
        .parse(req.body);
      const result = await runVoyaAgent({
        ...parsed,
        command: parsed.command ?? "Organize this canvas",
        mode: parsed.mode ?? "text"
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post("/v1/voya/voice/command", parseBody, async (req, res, next) => {
    try {
      const parsed = agentRunSchema.omit({ mode: true }).extend({ mode: z.literal("voice").optional() }).parse(req.body);
      const result = await runVoyaAgent({
        ...parsed,
        mode: "voice"
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
