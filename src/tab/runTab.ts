import { formatUsdNumber } from "../billing/money.js";
import { createBudgetPolicy, evaluateSpendRequest } from "./budgetPolicy.js";
import { createReceiptsForApprovedRequests } from "./receipts.js";
import {
  applyPolicyResult,
  createMarketSignalSpendRequest,
  createModelCallSpendRequest
} from "./spendRequests.js";
import type { BudgetPolicy, SpendRequest, TabRunInput, TabRunResult } from "./types.js";

const SCOPE_NOTE = "Existing x402 router is the backbone; Tab spend-control layer sits on top." as const;

function buildPlan(input: TabRunInput): string[] {
  return [
    "inspect paid capabilities",
    input.token ? "buy market data if a token is present" : "skip market data because no token was provided",
    "buy model inference to synthesize the result if market data was purchased",
    "return answer and receipts"
  ];
}

function buildFinalAnswer(
  input: TabRunInput,
  requests: SpendRequest[],
  confidence: "high" | "medium" | "low"
): string {
  const marketRequest = requests.find((r) => r.tool === "market-signal");
  const modelRequest = requests.find((r) => r.tool === "model-call");
  const tokenPhrase = input.token ? ` for token ${input.token} on ${input.chain ?? "base"}` : "";

  const marketApproved = marketRequest?.status === "auto-approved";
  const modelApproved = modelRequest?.status === "auto-approved";

  // Case 1: market data was not purchased — entire analysis is blocked
  if (!marketApproved) {
    const reason =
      marketRequest?.policyResult === "insufficient_budget"
        ? "the budget was below the tool price"
        : "the spend request was denied by policy";
    return (
      `Tab could not purchase market-signal data because ${reason}. ` +
      `Since no market-data receipt was created, the liquidity analysis is incomplete and confidence is low.`
    );
  }

  // Case 2: market data purchased, inference skipped
  if (!modelApproved) {
    return (
      `Tab purchased market-signal data${tokenPhrase} and recorded the x402 receipt. ` +
      `Tab stopped before inference because the remaining budget was below the model-call price. ` +
      `Market data is available but the synthesis step was skipped. Confidence is medium.`
    );
  }

  // Case 3: both approved — happy path
  return (
    `Tab purchased market-signal data${tokenPhrase} and recorded the x402 receipt. ` +
    `Tab also approved a small inference call to synthesize the report. ` +
    `Total spend stayed inside the opened budget. This is an informational spend trace, not trading advice. ` +
    `Confidence is high.`
  );
}

export function runTab(input: TabRunInput, policyOverrides: Partial<BudgetPolicy> = {}): TabRunResult {
  const policy = createBudgetPolicy(
    input.max_tool_calls === undefined
      ? policyOverrides
      : { ...policyOverrides, maxToolCalls: input.max_tool_calls }
  );
  const chain = input.chain ?? "base";
  const startingBudgetUsd = formatUsdNumber(input.budget_usd);
  const plan = buildPlan(input);
  const spendRequests: SpendRequest[] = [];
  let remainingBudgetUsd = startingBudgetUsd;
  let approvedToolCalls = 0;

  // ── Step 1: market-signal ────────────────────────────────────────────────────
  let marketApproved = false;
  if (input.token) {
    const pendingMarketRequest = createMarketSignalSpendRequest();
    const marketEvaluation = evaluateSpendRequest(pendingMarketRequest, policy, {
      remainingBudgetUsd,
      approvedToolCalls
    });
    const marketRequest = applyPolicyResult(
      pendingMarketRequest,
      marketEvaluation,
      marketEvaluation.result === "insufficient_budget" ? "skipped" : "denied"
    );
    spendRequests.push(marketRequest);

    if (marketEvaluation.approved) {
      remainingBudgetUsd = formatUsdNumber(remainingBudgetUsd - marketRequest.amountUsd);
      approvedToolCalls += 1;
      marketApproved = true;
    }
  }

  // ── Step 2: model-call (depends on market data) ──────────────────────────────
  const pendingModelRequest = createModelCallSpendRequest();

  if (!marketApproved) {
    // Dependency gate: no market data means inference has nothing to synthesize.
    spendRequests.push(
      applyPolicyResult(
        pendingModelRequest,
        { approved: false, result: "dependency_not_met", explanation: "market-signal was not approved" },
        "skipped"
      )
    );
  } else {
    const modelEvaluation = evaluateSpendRequest(pendingModelRequest, policy, {
      remainingBudgetUsd,
      approvedToolCalls
    });
    const modelRequest = applyPolicyResult(
      pendingModelRequest,
      modelEvaluation,
      modelEvaluation.result === "insufficient_budget" ? "skipped" : "denied"
    );
    spendRequests.push(modelRequest);

    if (modelEvaluation.approved) {
      remainingBudgetUsd = formatUsdNumber(remainingBudgetUsd - modelRequest.amountUsd);
      approvedToolCalls += 1;
    }
  }

  // ── Outcomes ─────────────────────────────────────────────────────────────────
  const modelApproved = spendRequests.find((r) => r.tool === "model-call")?.status === "auto-approved";
  const receipts = createReceiptsForApprovedRequests(spendRequests);
  const totalSpentUsd = formatUsdNumber(receipts.reduce((sum, r) => sum + r.amountUsd, 0));
  const normalizedRemainingBudgetUsd = formatUsdNumber(startingBudgetUsd - totalSpentUsd);

  const status: TabRunResult["status"] = !marketApproved
    ? "budget_constrained"
    : modelApproved
      ? "completed"
      : "completed_with_budget_limit";

  const confidence: TabRunResult["confidence"] = !marketApproved ? "low" : modelApproved ? "high" : "medium";

  return {
    ok: true,
    product: "Tab",
    tagline: "The spend layer for AI agents.",
    agent: "ResearchAgent",
    goal: input.goal,
    startingBudgetUsd,
    totalSpentUsd,
    remainingBudgetUsd: normalizedRemainingBudgetUsd,
    plan,
    spendRequests,
    receipts,
    finalAnswer: buildFinalAnswer({ ...input, chain }, spendRequests, confidence),
    confidence,
    status,
    hackathonScopeNote: SCOPE_NOTE
  };
}
