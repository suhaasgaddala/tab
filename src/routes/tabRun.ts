import { Router, json } from "express";
import { z } from "zod";
import type { AppConfig } from "../config.js";
import { runTab } from "../tab/runTab.js";

const tabRunSchema = z.object({
  goal: z.string().trim().min(1).max(2_000),
  token: z.string().trim().min(1).optional(),
  chain: z.literal("base").optional().default("base"),
  budget_usd: z.number().finite().positive(),
  max_tool_calls: z.number().int().nonnegative().optional(),
  live_tool_calls: z.boolean().optional().default(false)
});

export function createTabRunRouter(config: AppConfig): Router {
  const router = Router();

  router.post("/v1/tab/run", json({ limit: config.jsonBodyLimit }), (req, res, next) => {
    try {
      const parsed = tabRunSchema.parse(req.body);
      const result = runTab(parsed);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
