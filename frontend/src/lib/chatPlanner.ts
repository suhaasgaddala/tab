import type { TabRunRequest } from "./types";

export const DEMO_USDC_TOKEN = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

const MARKET_SIGNAL_PRICE = 0.02;
const MODEL_CALL_PRICE = 0.001;
const BOTH_TOOLS_PRICE = MARKET_SIGNAL_PRICE + MODEL_CALL_PRICE;

export interface PlannedTool {
  id: "market-signal" | "model-call";
  label: string;
  priceUsd: number;
  provider: string;
  category: string;
}

export interface ProposedTabRun {
  id: string;
  payload: TabRunRequest;
  estimatedSpendUsd: number;
  estimatedRemainingUsd: number;
  tools: PlannedTool[];
  warnings: string[];
  notes: string[];
}

export function formatPlannerUsd(value: number, precision = 4) {
  return `$${value.toFixed(precision).replace(/0+$/, "").replace(/\.$/, "")}`;
}

export function createChatPlan(message: string, sequence: number): ProposedTabRun {
  const normalized = message.toLowerCase();
  const address = message.match(/0x[a-fA-F0-9]{40}/)?.[0];
  const notes: string[] = [];
  const warnings: string[] = [];

  let budgetUsd = 0.05;
  let maxToolCalls = 3;

  const isTightBudget = normalized.includes("tight") || normalized.includes("2.05 cent");

  if (isTightBudget) {
    budgetUsd = 0.0205;
  } else if (normalized.includes("5 cent") || normalized.includes("five cent")) {
    budgetUsd = 0.05;
  }

  if (normalized.includes("one call") || /\b1\s+call\b/.test(normalized)) {
    maxToolCalls = 1;
  }

  const token = address ?? DEMO_USDC_TOKEN;

  if (normalized.includes("weth") && !address) {
    notes.push("Demo defaults to USDC unless a WETH asset address is provided.");
  }

  let estimatedSpendUsd = 0;
  if (budgetUsd < MARKET_SIGNAL_PRICE) {
    warnings.push("Budget is below market-signal price; no paid tool may run.");
  } else if (maxToolCalls === 1) {
    estimatedSpendUsd = MARKET_SIGNAL_PRICE;
    warnings.push("Max calls is 1, so model-call may be skipped after market-signal.");
  } else if (budgetUsd >= BOTH_TOOLS_PRICE && maxToolCalls >= 2) {
    estimatedSpendUsd = BOTH_TOOLS_PRICE;
  } else if (budgetUsd >= MARKET_SIGNAL_PRICE && budgetUsd < BOTH_TOOLS_PRICE) {
    estimatedSpendUsd = MARKET_SIGNAL_PRICE;
    warnings.push("Budget can cover market-signal, but model-call may be skipped.");
  }

  return {
    id: `apr_demo_${String(sequence).padStart(3, "0")}`,
    payload: {
      goal: message.trim(),
      token,
      chain: "base",
      budget_usd: budgetUsd,
      max_tool_calls: maxToolCalls,
    },
    estimatedSpendUsd,
    estimatedRemainingUsd: Math.max(0, budgetUsd - estimatedSpendUsd),
    tools: [
      {
        id: "market-signal",
        label: "market-signal",
        priceUsd: MARKET_SIGNAL_PRICE,
        provider: "DexScreener",
        category: "market-data",
      },
      {
        id: "model-call",
        label: "model-call",
        priceUsd: MODEL_CALL_PRICE,
        provider: "Anthropic via Tab router",
        category: "inference",
      },
    ],
    warnings,
    notes,
  };
}
