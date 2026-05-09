import { formatUsdNumber } from "../billing/money.js";
import { createBudgetPolicy, evaluateSpendRequest } from "./budgetPolicy.js";
import { createReceiptsForApprovedRequests } from "./receipts.js";
import {
  applyPolicyResult,
  createMarketSignalSpendRequest,
  createModelCallSpendRequest
} from "./spendRequests.js";
import type { BudgetPolicy, SpendRequest, TabRunInput, TabRunResult } from "./types.js";

const SCOPE_NOTE =
  "Existing x402 router is the backbone; Tab spend-control layer was built during the hackathon." as const;

function buildPlan(input: TabRunInput): string[] {
  return [
    "inspect paid capabilities",
    input.token ? "buy market data if a token is present" : "skip market data because no token was provided",
    "buy model inference to synthesize the result if budget remains",
    "return answer and receipts"
  ];
}

function buildFinalAnswer(input: TabRunInput, requests: SpendRequest[], confidence: "high" | "medium"): string {
  const marketRequest = requests.find((request) => request.tool === "market-signal");
  const modelRequest = requests.find((request) => request.tool === "model-call");
  const tokenPhrase = input.token ? ` for token ${input.token} on ${input.chain ?? "base"}` : "";
  const modelPhrase =
    modelRequest?.status === "auto-approved"
      ? "Tab also approved a small inference call to synthesize the report."
      : "Tab stopped before inference because the remaining budget was below the model-call price.";
  const marketPhrase =
    marketRequest?.status === "auto-approved"
      ? `Tab purchased market-signal data${tokenPhrase} and recorded the x402 receipt.`
      : "Tab did not purchase market-signal data.";

  return `${marketPhrase} ${modelPhrase} Total spend stayed inside the opened budget. This is an informational spend trace, not trading advice. Confidence is ${confidence}.`;
}

export function runTab(input: TabRunInput, policyOverrides: Partial<BudgetPolicy> = {}): TabRunResult {
  const policy = createBudgetPolicy(
    input.max_tool_calls === undefined
      ? policyOverrides
      : {
          ...policyOverrides,
          maxToolCalls: input.max_tool_calls
        }
  );
  const chain = input.chain ?? "base";
  const startingBudgetUsd = formatUsdNumber(input.budget_usd);
  const plan = buildPlan(input);
  const spendRequests: SpendRequest[] = [];
  let remainingBudgetUsd = startingBudgetUsd;
  let approvedToolCalls = 0;

  if (input.token) {
    const pendingMarketRequest = createMarketSignalSpendRequest();
    const marketEvaluation = evaluateSpendRequest(pendingMarketRequest, policy, {
      remainingBudgetUsd,
      approvedToolCalls
    });
    const marketRequest = applyPolicyResult(pendingMarketRequest, marketEvaluation);
    spendRequests.push(marketRequest);

    if (marketEvaluation.approved) {
      remainingBudgetUsd = formatUsdNumber(remainingBudgetUsd - marketRequest.amountUsd);
      approvedToolCalls += 1;
    }
  }

  const pendingModelRequest = createModelCallSpendRequest();
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

  const receipts = createReceiptsForApprovedRequests(spendRequests);
  const totalSpentUsd = formatUsdNumber(receipts.reduce((total, receipt) => total + receipt.amountUsd, 0));
  const normalizedRemainingBudgetUsd = formatUsdNumber(startingBudgetUsd - totalSpentUsd);
  const hasBudgetLimit = spendRequests.some(
    (request) => request.status === "skipped" && request.policyResult === "insufficient_budget"
  );
  const status = hasBudgetLimit ? "completed_with_budget_limit" : "completed";
  const confidence = status === "completed" ? "high" : "medium";

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
