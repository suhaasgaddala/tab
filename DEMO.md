# Demo — Tab

**The spend layer for AI agents.**

Tab demonstrates an agent-native spend workflow on top of the existing x402-paid router backbone.

## Live Story

1. **Open a Tab** — the agent receives a goal.
2. **Set a limit** — the agent starts with a fixed USD budget.
3. **Spend request** — the agent asks to buy a paid tool call.
4. **Auto-approved** — Tab checks category, price, budget, and max calls.
5. **Receipt** — approved completed requests write x402 receipts.
6. **Close the Tab** — Tab returns a final answer and spend trace.

## Terminal Demo

```bash
npm run demo:tab
```

Budget-constrained scenario:

```bash
npm run demo:tab:budget
```

## Browser Demo

Run the API:

```bash
npm install
npm --prefix frontend install
npm run dev
```

Run the frontend in a second terminal:

```bash
npm run dev:frontend
```

Open:

```text
http://localhost:5173
```

The browser demo calls `POST /v1/tab/run` with JSON and renders the goal, budget, plan, spend requests, receipts, final answer, confidence, and run status.

Production-style local demo:

```bash
npm run build:all
npm start
```

Open:

```text
http://localhost:3000/demo
```

`GET /` remains the JSON service root. `/demo` is only the built browser interface.

Expected happy-path summary:

```text
Tab summary
  Total spent: $0.021
  Remaining:   $0.029
  Receipts:    2
  Confidence:  high
```

Expected budget-constrained summary:

```text
Tab summary
  Total spent: $0.020
  Remaining:   $0.0005
  Receipts:    1
  Confidence:  medium
```

## API Demo

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

## Existing Paid Tools

| Route | Method | Price | Provider |
|---|---|---:|---|
| `/v1/market-signal` | POST | 0.020 USDC | DexScreener |
| `/v1/model-call` | POST | 0.001 USDC | Anthropic |

These routes are the pre-existing x402 backbone. Tab is the hackathon-built spend-control layer over them.
