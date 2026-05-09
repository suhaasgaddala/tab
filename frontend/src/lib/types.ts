export type TabChain = "base";

export type SpendRequestStatus = "pending" | "auto-approved" | "denied" | "skipped";

export type PolicyResult =
  | "approved"
  | "blocked_category"
  | "category_not_allowed"
  | "max_price_per_call_exceeded"
  | "insufficient_budget"
  | "max_tool_calls_exceeded";

export interface TabRunRequest {
  goal: string;
  token?: string;
  chain: TabChain;
  budget_usd: number;
  max_tool_calls?: number;
  live_tool_calls?: boolean;
}

export interface SpendRequest {
  id: string;
  tool: "market-signal" | "model-call";
  category: "market-data" | "inference" | "trading-execution";
  amountUsd: number;
  reason: string;
  status: SpendRequestStatus;
  policyResult?: PolicyResult;
  policyExplanation?: string;
}

export interface Receipt {
  id: string;
  spendRequestId: string;
  tool: "market-signal" | "model-call";
  provider: string;
  amountUsd: number;
  rail: "x402";
  network: "base-sepolia";
  status: "completed";
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
  confidence: "high" | "medium";
  status: "completed" | "completed_with_budget_limit";
  hackathonScopeNote: string;
}

export type RunState =
  | { status: "idle"; result: null; error: null }
  | { status: "loading"; result: null; error: null }
  | { status: "success"; result: TabRunResult; error: null }
  | { status: "error"; result: null; error: string };
