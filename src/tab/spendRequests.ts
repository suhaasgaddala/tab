import type {
  PolicyEvaluation,
  SpendRequest,
  TabCategory,
  TabToolId
} from "./types.js";

interface CreateSpendRequestInput {
  id: string;
  tool: TabToolId;
  category: TabCategory;
  amountUsd: number;
  reason: string;
}

export function createSpendRequest(input: CreateSpendRequestInput): SpendRequest {
  return {
    id: input.id,
    tool: input.tool,
    category: input.category,
    amountUsd: input.amountUsd,
    reason: input.reason,
    status: "pending"
  };
}

export function applyPolicyResult(
  request: SpendRequest,
  evaluation: PolicyEvaluation,
  deniedStatus: "denied" | "skipped" = "denied"
): SpendRequest {
  return {
    ...request,
    status: evaluation.approved ? "auto-approved" : deniedStatus,
    policyResult: evaluation.result,
    policyExplanation: evaluation.explanation
  };
}

export function createMarketSignalSpendRequest(): SpendRequest {
  return createSpendRequest({
    id: "spend_req_001",
    tool: "market-signal",
    category: "market-data",
    amountUsd: 0.02,
    reason: "The goal requires token liquidity data."
  });
}

export function createModelCallSpendRequest(): SpendRequest {
  return createSpendRequest({
    id: "spend_req_002",
    tool: "model-call",
    category: "inference",
    amountUsd: 0.001,
    reason: "The agent needs model inference to synthesize the final report."
  });
}
