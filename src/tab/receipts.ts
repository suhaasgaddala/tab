import type { Receipt, SpendRequest } from "./types.js";

const PROVIDER_BY_TOOL: Record<string, string> = {
  "market-signal": "dexscreener",
  "model-call": "anthropic"
};

export function createReceipt(id: string, request: SpendRequest): Receipt | undefined {
  if (request.status !== "auto-approved" || request.policyResult !== "approved") {
    return undefined;
  }

  return {
    id,
    spendRequestId: request.id,
    tool: request.tool,
    provider: PROVIDER_BY_TOOL[request.tool] ?? "unknown",
    amountUsd: request.amountUsd,
    rail: "x402",
    network: "base-sepolia",
    status: "completed"
  };
}

export function createReceiptsForApprovedRequests(requests: SpendRequest[]): Receipt[] {
  let nextReceipt = 1;
  const receipts: Receipt[] = [];

  for (const request of requests) {
    const receipt = createReceipt(`receipt_${String(nextReceipt).padStart(3, "0")}`, request);
    if (receipt) {
      receipts.push(receipt);
      nextReceipt += 1;
    }
  }

  return receipts;
}
