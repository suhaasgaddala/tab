export type TabChain = "base";

export type TabToolId = "market-signal" | "model-call";

export type TabCategory = "market-data" | "inference" | "trading-execution";

export type SpendRequestStatus = "pending" | "auto-approved" | "denied" | "skipped";

export type PolicyResult =
  | "approved"
  | "blocked_category"
  | "category_not_allowed"
  | "max_price_per_call_exceeded"
  | "insufficient_budget"
  | "max_tool_calls_exceeded";

export type TabReceiptStatus = "completed";

export type TabRunStatus = "completed" | "completed_with_budget_limit";

export type TabConfidence = "high" | "medium";

export interface TabRunInput {
  goal: string;
  token?: string;
  chain?: TabChain;
  budget_usd: number;
  max_tool_calls?: number;
  live_tool_calls?: boolean;
}

export interface BudgetPolicy {
  maxToolCalls: number;
  maxPricePerCallUsd: number;
  allowedCategories: TabCategory[];
  blockedCategories: TabCategory[];
  approvalRequiredAboveUsd: number;
}

export interface SpendRequest {
  id: string;
  tool: TabToolId;
  category: TabCategory;
  amountUsd: number;
  reason: string;
  status: SpendRequestStatus;
  policyResult?: PolicyResult;
  policyExplanation?: string;
}

export interface Receipt {
  id: string;
  spendRequestId: string;
  tool: TabToolId;
  provider: string;
  amountUsd: number;
  rail: "x402";
  network: "base-sepolia";
  status: TabReceiptStatus;
}

export interface PolicyEvaluationContext {
  remainingBudgetUsd: number;
  approvedToolCalls: number;
}

export interface PolicyEvaluation {
  approved: boolean;
  result: PolicyResult;
  explanation: string;
}

export interface TabRunResult {
  ok: true;
  product: "Tab";
  tagline: "The spend layer for AI agents.";
  agent: "ResearchAgent";
  goal: string;
  startingBudgetUsd: number;
  totalSpentUsd: number;
  remainingBudgetUsd: number;
  plan: string[];
  spendRequests: SpendRequest[];
  receipts: Receipt[];
  finalAnswer: string;
  confidence: TabConfidence;
  status: TabRunStatus;
  hackathonScopeNote: "Existing x402 router is the backbone; Tab spend-control layer was built during the hackathon.";
}
