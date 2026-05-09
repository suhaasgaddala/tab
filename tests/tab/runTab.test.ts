import { describe, expect, it } from "vitest";
import { evaluateSpendRequest } from "../../src/tab/budgetPolicy.js";
import { createReceiptsForApprovedRequests } from "../../src/tab/receipts.js";
import { runTab } from "../../src/tab/runTab.js";
import { applyPolicyResult, createSpendRequest } from "../../src/tab/spendRequests.js";

const DEFAULT_INPUT = {
  goal: "Analyze USDC liquidity on Base with a 5 cent budget.",
  token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  chain: "base" as const,
  budget_usd: 0.05
};

describe("runTab", () => {
  it("happy path spends exactly 0.021", () => {
    const result = runTab(DEFAULT_INPUT);

    expect(result.product).toBe("Tab");
    expect(result.totalSpentUsd).toBe(0.021);
    expect(result.remainingBudgetUsd).toBe(0.029);
    expect(result.receipts).toHaveLength(2);
    expect(result.status).toBe("completed");
    expect(result.confidence).toBe("high");
  });

  it("budget scenario skips model-call", () => {
    const result = runTab({
      ...DEFAULT_INPUT,
      goal: "Analyze USDC liquidity on Base with a 2 cent budget.",
      budget_usd: 0.0205
    });

    expect(result.totalSpentUsd).toBe(0.02);
    expect(result.remainingBudgetUsd).toBe(0.0005);
    expect(result.spendRequests[0]?.status).toBe("auto-approved");
    expect(result.spendRequests[1]?.tool).toBe("model-call");
    expect(result.spendRequests[1]?.status).toBe("skipped");
    expect(result.spendRequests[1]?.policyResult).toBe("insufficient_budget");
    expect(result.receipts).toHaveLength(1);
    expect(result.status).toBe("completed_with_budget_limit");
    expect(result.confidence).toBe("medium");
  });

  it("blocked category is denied", () => {
    const request = createSpendRequest({
      id: "spend_req_999",
      tool: "market-signal",
      category: "trading-execution",
      amountUsd: 0.01,
      reason: "Trading execution is blocked."
    });

    const result = evaluateSpendRequest(
      request,
      {
        maxToolCalls: 3,
        maxPricePerCallUsd: 0.02,
        allowedCategories: ["market-data", "inference", "trading-execution"],
        blockedCategories: ["trading-execution"],
        approvalRequiredAboveUsd: 0.1
      },
      { remainingBudgetUsd: 1, approvedToolCalls: 0 }
    );

    expect(result.approved).toBe(false);
    expect(result.result).toBe("blocked_category");
  });

  it("max price per call is enforced", () => {
    const result = runTab(DEFAULT_INPUT, { maxPricePerCallUsd: 0.001 });

    expect(result.spendRequests[0]?.tool).toBe("market-signal");
    expect(result.spendRequests[0]?.status).toBe("denied");
    expect(result.spendRequests[0]?.policyResult).toBe("max_price_per_call_exceeded");
    expect(result.receipts.map((receipt) => receipt.tool)).toEqual(["model-call"]);
  });

  it("max tool calls is enforced", () => {
    const result = runTab({ ...DEFAULT_INPUT, max_tool_calls: 1 });

    expect(result.spendRequests[0]?.status).toBe("auto-approved");
    expect(result.spendRequests[1]?.status).toBe("denied");
    expect(result.spendRequests[1]?.policyResult).toBe("max_tool_calls_exceeded");
    expect(result.receipts).toHaveLength(1);
  });

  it("no secrets appear in serialized output", () => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-super-secret";
    process.env.CDP_API_KEY_SECRET = "cdp-private-key-secret";
    const result = runTab(DEFAULT_INPUT);
    const serialized = JSON.stringify(result);

    expect(serialized).not.toContain("sk-ant-super-secret");
    expect(serialized).not.toContain("cdp-private-key-secret");
    expect(serialized).not.toContain("apiKey");
    expect(serialized).not.toContain("private");
    expect(serialized).not.toContain("CDP_API_KEY");
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.CDP_API_KEY_SECRET;
  });

  it("receipts are generated only for approved completed spend requests", () => {
    const approved = applyPolicyResult(
      createSpendRequest({
        id: "spend_req_001",
        tool: "market-signal",
        category: "market-data",
        amountUsd: 0.02,
        reason: "The goal requires token liquidity data."
      }),
      { approved: true, result: "approved", explanation: "allowed category + under budget" }
    );
    const denied = applyPolicyResult(
      createSpendRequest({
        id: "spend_req_002",
        tool: "model-call",
        category: "inference",
        amountUsd: 0.001,
        reason: "The agent needs model inference to synthesize the final report."
      }),
      { approved: false, result: "insufficient_budget", explanation: "remaining budget cannot cover the request" },
      "skipped"
    );

    const receipts = createReceiptsForApprovedRequests([approved, denied]);

    expect(receipts).toHaveLength(1);
    expect(receipts[0]?.spendRequestId).toBe("spend_req_001");
    expect(receipts[0]?.status).toBe("completed");
  });
});
