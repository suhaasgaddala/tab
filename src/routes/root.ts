import { Router } from "express";
import type { AppConfig } from "../config.js";
export function createRootRouter(config: AppConfig): Router {
  const router = Router();

  router.get("/", (_req, res) => {
    res.status(200).json({
      ok: true,
      service: "voya",
      status: "live",
      product: "voya",
      tagline: "Think out loud. Build visually.",
      description: "voya is a voice and gesture-powered AI infinite canvas for turning messy thoughts into organized notes, tasks, diagrams, and workflows.",
      public_url: config.publicUrl ?? null,
      endpoints: {
        "GET /v1/voya/capabilities": {
          description: "List voya canvas assistant capabilities and policy limits"
        },
        "POST /v1/voya/agent/run": {
          description: "Run the voya assistant against canvas context and return structured canvas actions"
        },
        "POST /v1/voya/canvas/summarize": {
          description: "Summarize a canvas from its object context"
        },
        "POST /v1/voya/canvas/organize": {
          description: "Organize a canvas into useful sections"
        },
        "POST /v1/voya/voice/command": {
          description: "Handle a mock or transcribed voice command"
        }
      },
      health_url: "/health",
      capabilities_url: "/v1/voya/capabilities",
      agent_run_url: "/v1/voya/agent/run"
    });
  });

  return router;
}
