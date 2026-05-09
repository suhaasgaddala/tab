import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../src/app.js";
import { loadConfig } from "../../src/config.js";

const app = createApp(
  loadConfig({
    NODE_ENV: "test",
    X402_ENABLED: "false"
  })
);

describe("POST /v1/tab/run", () => {
  it("returns the expected output", async () => {
    const res = await request(app)
      .post("/v1/tab/run")
      .send({
        goal: "Analyze USDC liquidity on Base with a 5 cent budget.",
        token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        chain: "base",
        budget_usd: 0.05
      })
      .expect(200);

    expect(res.body.ok).toBe(true);
    expect(res.body.product).toBe("Tab");
    expect(res.body.tagline).toBe("The spend layer for AI agents.");
    expect(res.body.agent).toBe("ResearchAgent");
    expect(res.body.totalSpentUsd).toBe(0.021);
    expect(res.body.remainingBudgetUsd).toBe(0.029);
    expect(res.body.receipts).toHaveLength(2);
    expect(res.body.status).toBe("completed");
    expect(res.body.confidence).toBe("high");
    expect(res.body.hackathonScopeNote).toMatch(/x402 router is the backbone/i);
  });

  it("invalid request returns 400", async () => {
    const res = await request(app)
      .post("/v1/tab/run")
      .send({
        goal: "",
        budget_usd: -1
      })
      .expect(400);

    expect(res.body.ok).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});
