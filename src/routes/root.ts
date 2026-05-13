import { Router } from "express";
import type { AppConfig } from "../config.js";
import { getPriceForModel } from "../billing/pricing.js";

export function createRootRouter(config: AppConfig): Router {
  const router = Router();

  router.get("/v1/status", (_req, res) => {
    const modelProvider = config.anthropic.apiKey ? "anthropic" : "mock";
    const modelCallPrice = getPriceForModel("claude-sonnet", config.pricing);

    res.status(200).json({
      ok: true,
      service: "tab",
      backbone_service: "agentic-x402-router",
      status: "live",
      product: "Tab",
      tagline: "The spend layer for AI agents.",
      description: "Tab opens budgets for AI agents, routes spend requests through the existing x402-paid tool backbone, and returns receipts.",
      public_base_url: config.publicBaseUrl ?? null,
      endpoints: {
        "POST /v1/tab/run": {
          description: "Open a Tab, set a limit, auto-approve spend requests, collect receipts, and close the Tab with a trace",
          price_usd: 0,
          provider: "Tab",
          discovery: "agent-run capability"
        },
        "POST /v1/model-call": {
          description: "x402-paid Claude/model-call API for agents",
          price_usd: modelCallPrice,
          provider: modelProvider,
          discovery: "Bazaar indexed"
        },
        "POST /v1/market-signal": {
          description: "x402-paid DexScreener onchain market-signal API",
          price_usd: config.marketSignal.priceUsd,
          provider: config.marketSignal.provider,
          discovery: "Bazaar indexed"
        }
      },
      health_url: "/health",
      models_url: "/v1/models",
      capabilities_url: "/v1/capabilities",
      tab_run_url: "/v1/tab/run"
    });
  });

  return router;
}
