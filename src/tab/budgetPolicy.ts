import { formatUsdNumber } from "../billing/money.js";
import type { BudgetPolicy, PolicyEvaluation, PolicyEvaluationContext, SpendRequest } from "./types.js";

export const DEFAULT_TAB_POLICY: BudgetPolicy = {
  maxToolCalls: 3,
  maxPricePerCallUsd: 0.02,
  allowedCategories: ["market-data", "inference"],
  blockedCategories: ["trading-execution"],
  approvalRequiredAboveUsd: 0.1
};

export function createBudgetPolicy(overrides: Partial<BudgetPolicy> = {}): BudgetPolicy {
  return {
    ...DEFAULT_TAB_POLICY,
    ...overrides,
    allowedCategories: overrides.allowedCategories ?? DEFAULT_TAB_POLICY.allowedCategories,
    blockedCategories: overrides.blockedCategories ?? DEFAULT_TAB_POLICY.blockedCategories
  };
}

export function evaluateSpendRequest(
  request: SpendRequest,
  policy: BudgetPolicy,
  context: PolicyEvaluationContext
): PolicyEvaluation {
  if (policy.blockedCategories.includes(request.category)) {
    return {
      approved: false,
      result: "blocked_category",
      explanation: "blocked category"
    };
  }

  if (!policy.allowedCategories.includes(request.category)) {
    return {
      approved: false,
      result: "category_not_allowed",
      explanation: "category is not allowed"
    };
  }

  if (request.amountUsd > policy.maxPricePerCallUsd) {
    return {
      approved: false,
      result: "max_price_per_call_exceeded",
      explanation: "price exceeds per-call policy"
    };
  }

  if (formatUsdNumber(context.remainingBudgetUsd - request.amountUsd) < 0) {
    return {
      approved: false,
      result: "insufficient_budget",
      explanation: "remaining budget cannot cover the request"
    };
  }

  if (context.approvedToolCalls >= policy.maxToolCalls) {
    return {
      approved: false,
      result: "max_tool_calls_exceeded",
      explanation: "max tool calls reached"
    };
  }

  return {
    approved: true,
    result: "approved",
    explanation: "allowed category + under budget"
  };
}
