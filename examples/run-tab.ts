import { runTab } from "../src/tab/runTab.js";
import type { TabRunInput } from "../src/tab/types.js";

const scenario = process.argv.includes("--scenario")
  ? process.argv[process.argv.indexOf("--scenario") + 1]
  : "happy";

const input: TabRunInput =
  scenario === "budget"
    ? {
        goal: "Analyze USDC liquidity on Base with a 2 cent budget.",
        token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        chain: "base",
        budget_usd: 0.0205
      }
    : {
        goal: "Analyze USDC liquidity on Base with a 5 cent budget.",
        token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        chain: "base",
        budget_usd: 0.05
      };

const result = runTab(input);

function formatUsd(value: number, decimals = Number(value.toFixed(3)) === value ? 3 : 4): string {
  return `$${value.toFixed(decimals)}`;
}

function shortReason(reason: string): string {
  if (reason.includes("liquidity")) return "token liquidity data required";
  if (reason.includes("synthesize")) return "synthesize final report";
  return reason;
}

function displayStatus(status: string): string {
  if (status === "auto-approved") return "auto-approved";
  if (status === "skipped") return "skipped";
  return status;
}

console.log("╭────────────────────────────────────────────╮");
console.log("│ Tab                                        │");
console.log("│ The spend layer for AI agents              │");
console.log("╰────────────────────────────────────────────╯");
console.log();
console.log(`Agent: ${result.agent}`);
console.log(`Goal: ${result.goal.replace(/ with a .+ budget\./, "")}`);
console.log(`Budget: ${formatUsd(result.startingBudgetUsd)}`);
console.log();

result.spendRequests.forEach((request, index) => {
  console.log(`Spend request #${index + 1}`);
  console.log(`  Tool: ${request.tool}`);
  console.log(`  Amount: ${formatUsd(request.amountUsd)}`);
  console.log(`  Reason: ${shortReason(request.reason)}`);
  console.log(`  Policy: ${request.policyExplanation ?? request.policyResult ?? "pending"}`);
  console.log(`  Status: ${displayStatus(request.status)}`);
  console.log();
});

console.log("Tab summary");
console.log(`  Total spent: ${formatUsd(result.totalSpentUsd)}`);
console.log(`  Remaining:   ${formatUsd(result.remainingBudgetUsd)}`);
console.log(`  Receipts:    ${result.receipts.length}`);
console.log(`  Confidence:  ${result.confidence}`);
console.log();
console.log("Final answer:");
console.log(`  ${result.finalAnswer}`);
