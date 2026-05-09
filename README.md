# Tab

**The spend layer for AI agents.**

Tab lets an AI agent receive a goal, open a budget, inspect available paid tools, create spend requests, auto-approve allowed calls under policy, call paid tools through the existing x402 router backbone, track receipts, and return a final spend trace.

The existing x402-paid router remains the backbone for paid tool access. The hackathon-built product layer is Tab: budgets, spend requests, tool selection, receipt ledger, agent run trace, and demo.

## Open a Tab

```bash
npm install
npm --prefix frontend install
npm run dev
```

For the browser demo, run the frontend dev server in a second terminal:

```bash
npm run dev:frontend
```

Then open:

```text
http://localhost:5173
```

Then run the deterministic Tab agent flow:

```bash
curl -sS -X POST http://localhost:3000/v1/tab/run \
  -H "content-type: application/json" \
  -d '{
    "goal": "Analyze USDC liquidity on Base with a 5 cent budget.",
    "token": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    "chain": "base",
    "budget_usd": 0.05
  }'
```

Or use the terminal demo:

```bash
npm run demo:tab
npm run demo:tab:budget
```

Production-style local run:

```bash
npm run build:all
npm start
```

Then open:

```text
http://localhost:3000/demo
```

## Set a Limit

Default Tab policy:

```json
{
  "maxToolCalls": 3,
  "maxPricePerCallUsd": 0.02,
  "allowedCategories": ["market-data", "inference"],
  "blockedCategories": ["trading-execution"],
  "approvalRequiredAboveUsd": 0.1
}
```

The default happy path opens a `$0.050` budget. The budget-constrained demo opens `$0.0205`, buys market data, then skips model inference because the remaining budget is below the model-call price.

## Spend Request

Tab creates explicit spend requests before tool use:

- `market-signal` for `$0.020`, category `market-data`
- `model-call` for `$0.001`, category `inference`

## Auto-Approved

A spend request is auto-approved only when the category is allowed, not blocked, under the max per-call price, inside the remaining budget, and within the max tool-call count.

## Receipt

Approved completed requests create receipts:

- rail: `x402`
- network: `base-sepolia`
- provider: `dexscreener` or `anthropic`
- status: `completed`

Skipped or denied requests do not create receipts.

## Close the Tab

`POST /v1/tab/run` returns the final answer, total spent, remaining budget, spend requests, receipts, status, and confidence.

The browser demo at `/demo` calls the same endpoint with JSON. It does not use SSE and it does not claim live onchain payment settlement inside `/v1/tab/run`; the run is deterministic by default for reliable judging.

The deterministic happy path returns:

- total spent: `$0.021`
- remaining: `$0.029`
- receipts: `2`
- status: `completed`
- confidence: `high`

## Existing x402 Backbone

The original paid tool endpoints are preserved:

| Route | Method | Price | Provider | Category |
|---|---|---:|---|---|
| `/v1/market-signal` | POST | 0.020 USDC | DexScreener | market-data |
| `/v1/model-call` | POST | 0.001 USDC | Anthropic | inference |

When x402 is enabled, those paid routes still run through the existing payment middleware before route-local JSON parsing and business validation.

## Checks

```bash
npm run typecheck
npm test
npm run build
npm run build:frontend
npm run build:all
```
