import request from "supertest";
import { describe, expect, it } from "vitest";
import { loadConfig } from "../../src/config.js";
import { createApp } from "../../src/app.js";

describe("root and status routes", () => {
  const app = createApp(
    loadConfig({
      NODE_ENV: "test",
      X402_ENABLED: "false"
    })
  );

  it("serves the Tab frontend at root", async () => {
    const res = await request(app).get("/").expect(200).expect("content-type", /html/);
    expect(res.text).toMatch(/Tab/i);
    expect(res.text).toMatch(/<html|id="root"|demo is not built/i);
  });

  it("returns status metadata as JSON", async () => {
    await request(app).get("/v1/status").expect(200).expect("content-type", /json/);
  });

  it("includes required top-level fields", async () => {
    const res = await request(app).get("/v1/status").expect(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.service).toBe("tab");
    expect(res.body.backbone_service).toBe("agentic-x402-router");
    expect(res.body.product).toBe("Tab");
    expect(res.body.status).toBe("live");
    expect(res.body.description).toMatch(/Tab/i);
    expect(res.body.description).toMatch(/x402/i);
  });

  it("includes endpoint entries for Tab and both paid routes", async () => {
    const res = await request(app).get("/v1/status").expect(200);
    expect(res.body.endpoints).toHaveProperty("POST /v1/tab/run");
    expect(res.body.endpoints).toHaveProperty("POST /v1/model-call");
    expect(res.body.endpoints).toHaveProperty("POST /v1/market-signal");
    expect(res.body.endpoints["POST /v1/tab/run"].provider).toBe("Tab");
    expect(res.body.endpoints["POST /v1/model-call"].price_usd).toBeTypeOf("number");
    expect(res.body.endpoints["POST /v1/market-signal"].price_usd).toBeTypeOf("number");
  });

  it("includes navigation urls", async () => {
    const res = await request(app).get("/v1/status").expect(200);
    expect(res.body.health_url).toBe("/health");
    expect(res.body.models_url).toBe("/v1/models");
    expect(res.body.capabilities_url).toBe("/v1/capabilities");
    expect(res.body.tab_run_url).toBe("/v1/tab/run");
  });

  it("keeps health as JSON", async () => {
    await request(app).get("/health").expect(200).expect("content-type", /json/);
  });

  it("keeps capabilities as JSON", async () => {
    await request(app).get("/v1/capabilities").expect(200).expect("content-type", /json/);
  });

  it("serves the browser demo route", async () => {
    const res = await request(app).get("/demo").expect(200).expect("content-type", /html/);
    expect(res.text).toMatch(/Tab/i);
    expect(res.text).toMatch(/demo|not built/i);
  });

  it("serves deep demo routes through the frontend", async () => {
    const res = await request(app).get("/demo/dashboard").expect(200).expect("content-type", /html/);
    expect(res.text).toMatch(/Tab/i);
    expect(res.text).toMatch(/<html|id="root"|demo is not built/i);
  });

  it("shows mock provider when no ANTHROPIC_API_KEY", async () => {
    const res = await request(app).get("/v1/status").expect(200);
    expect(res.body.endpoints["POST /v1/model-call"].provider).toBe("mock");
  });

  it("shows anthropic provider when ANTHROPIC_API_KEY is set", async () => {
    const appWithKey = createApp(
      loadConfig({
        NODE_ENV: "test",
        X402_ENABLED: "false",
        ANTHROPIC_API_KEY: "sk-ant-fake-key-for-test"
      })
    );
    const res = await request(appWithKey).get("/v1/status").expect(200);
    expect(res.body.endpoints["POST /v1/model-call"].provider).toBe("anthropic");
  });

  it("does not expose secrets in the response", async () => {
    const appWithSecrets = createApp(
      loadConfig({
        NODE_ENV: "test",
        X402_ENABLED: "false",
        ANTHROPIC_API_KEY: "sk-ant-super-secret",
        CDP_API_KEY_ID: "cdp-key-id-secret"
      })
    );
    const res = await request(appWithSecrets).get("/v1/status").expect(200);
    const body = JSON.stringify(res.body);
    expect(body).not.toContain("sk-ant-super-secret");
    expect(body).not.toContain("cdp-key-id-secret");
    expect(body).not.toContain("apiKey");
    expect(body).not.toContain("private");
  });
});
