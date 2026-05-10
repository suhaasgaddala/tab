# Tab — The Spend Layer for AI Agents

Tab gives AI agents controlled access to paid tools with per-session budget enforcement, policy-based spend approval, and cryptographic receipts for every call — built on the x402 payment rail and Base.

---

## Quick Start

**Prerequisites:** Node.js 20+, npm 10+

```bash
# 1. Clone and install
git clone https://github.com/your-org/tab.git
cd tab
npm install
npm --prefix frontend install

# 2. Configure environment
cp .env.example .env
# Edit .env — see "Environment Variables" below

# 3. Run (development)
npm run dev               # backend  → http://localhost:3000
npm run dev:frontend      # frontend → http://localhost:5173  (separate terminal)
```

Open `http://localhost:5173`, sign in, and click **Open a Tab**.

**Production build (single server):**

```bash
npm run build:all
npm start
# Open http://localhost:3000/demo
```

**CLI demo:**

```bash
npm run demo:tab              # happy path    — $0.050 budget, 2 tool calls
npm run demo:tab:budget       # constrained   — $0.0205, inference skipped
```

**Tests:**

```bash
npm test
npm run typecheck
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend runtime | Node.js 20 + TypeScript 5 |
| HTTP framework | Express 5 |
| Payment rail | x402 protocol (`@coinbase/x402`, `@x402/express`) |
| Inference | Anthropic Claude (`@anthropic-ai/sdk`) |
| Schema validation | Zod |
| Logging | Pino |
| Tests | Vitest + Supertest |
| Frontend | React 18 + Vite 6 + TypeScript |
| Styling | Tailwind CSS 3 + Framer Motion |
| Routing | React Router v6 |
| Auth | Supabase (scaffolded; localStorage bridge in demo) |
| Deployment | Railway |
| Blockchain | Base / Base Sepolia (USDC) |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  Browser  (React + Vite, served from /demo)                  │
│                                                              │
│  Auth page ──► Dashboard ──► POST /v1/tab/run                │
└──────────────────────────┬───────────────────────────────────┘
                           │ JSON
                           ▼
┌──────────────────────────────────────────────────────────────┐
│  Express server  (src/server.ts)                             │
│                                                              │
│  POST /v1/tab/run                                            │
│    └── Tab Runner  (src/tab/runTab.ts)                       │
│          │                                                   │
│          ├── Budget Policy Engine                            │
│          │     (src/tab/budgetPolicy.ts)                     │
│          │     · maxToolCalls  · maxPricePerCall             │
│          │     · allowedCategories · blockedCategories       │
│          │                                                   │
│          ├── Spend Request queue                             │
│          │     (src/tab/spendRequests.ts)                    │
│          │     · auto-approve / deny / skip each request     │
│          │                                                   │
│          ├── Paid tool calls  ◄── x402 middleware            │
│          │     POST /v1/market-signal  →  DexScreener        │
│          │     POST /v1/model-call     →  Anthropic          │
│          │                                                   │
│          └── Receipt Ledger  (src/tab/receipts.ts)           │
│                · rail: x402 · network: base-sepolia          │
└──────────────────────────────────────────────────────────────┘
```

**Request lifecycle:**

1. Frontend sends `POST /v1/tab/run` with `{ goal, token, chain, budget_usd, max_tool_calls }`.
2. Tab Runner opens a budget session and loads the default policy.
3. For each planned tool call, Tab creates a **spend request** and evaluates it against the policy.
4. Approved requests execute the paid tool; denied/skipped requests are recorded with the reason.
5. Completed calls produce **receipts** (rail, provider, amount, timestamp).
6. The runner returns the final answer, spend trace, receipts, and budget summary.

---

## Reproducing the Demo

### Step 1 — Copy the env file

```bash
cp .env.example .env
```

Minimum required to run locally with **mock data** (no real API keys needed):

```env
NODE_ENV=development
PORT=3000
MARKET_SIGNAL_PROVIDER=mock
```

### Step 2 — Optional: enable real providers

**Real Anthropic inference:**
```env
ANTHROPIC_API_KEY=sk-ant-...
```

**Live DexScreener market data:**
```env
MARKET_SIGNAL_PROVIDER=dexscreener
```

**x402 on-chain payments (Base Sepolia):**
```env
X402_ENABLED=true
X402_PAY_TO=0xYourWalletAddress
X402_NETWORK=base-sepolia
CDP_API_KEY_ID=your-cdp-key-id
CDP_API_KEY_SECRET=your-cdp-key-secret
# On Railway use CDP_API_KEY_SECRET_B64 (base64-encoded) to avoid newline mangling
```

### Sample `.env` (full reference)

```env
# ── Server ─────────────────────────────────────────────────
NODE_ENV=development
PORT=3000
PUBLIC_BASE_URL=http://localhost:3000

# ── Anthropic ──────────────────────────────────────────────
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_HAIKU_MODEL=claude-haiku-4-5
ANTHROPIC_SONNET_MODEL=claude-sonnet-4-6
ANTHROPIC_OPUS_MODEL=claude-opus-4-7
MODEL_PROVIDER_TIMEOUT_MS=60000
MODEL_CALL_MAX_INPUT_CHARS=8000
MODEL_CALL_MAX_OUTPUT_TOKENS=512

# ── Market data ────────────────────────────────────────────
MARKET_SIGNAL_PROVIDER=mock         # mock | dexscreener
MARKET_SIGNAL_PROVIDER_TIMEOUT_MS=5000
DEXSCREENER_BASE_URL=https://api.dexscreener.com

# ── x402 payments (optional) ───────────────────────────────
X402_ENABLED=false
X402_PAY_TO=
X402_NETWORK=base-sepolia
X402_FACILITATOR_URL=
CDP_API_KEY_ID=
CDP_API_KEY_SECRET=
# CDP_API_KEY_SECRET_B64=           # base64 variant for Railway

# ── Pricing ────────────────────────────────────────────────
PRICE_MARKET_SIGNAL_USD=0.02
PRICE_MODEL_CALL_USD=0.001

# ── Frontend auth (Vite — set before build) ────────────────
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

> **Railway:** `VITE_*` variables must be set in Railway **Variables** before the build step — Vite bakes them at build time, not runtime.

### Demo scenarios

| Scenario | Budget | Outcome |
|---|---|---|
| Happy path | $0.050 | market-signal ✓ + model-call ✓ · total spent $0.021 |
| Constrained | $0.0205 | market-signal ✓ · model-call skipped (budget exhausted) |
| Blocked category | any | `trading-execution` always denied by policy |

Run via curl:

```bash
curl -sS -X POST http://localhost:3000/v1/tab/run \
  -H "content-type: application/json" \
  -d '{
    "goal": "Analyze USDC liquidity on Base with a 5 cent budget.",
    "token": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    "chain": "base",
    "budget_usd": 0.05,
    "max_tool_calls": 3
  }'
```

### Default policy

```json
{
  "maxToolCalls": 3,
  "maxPricePerCallUsd": 0.02,
  "allowedCategories": ["market-data", "inference"],
  "blockedCategories": ["trading-execution"],
  "approvalRequiredAboveUsd": 0.10
}
```

---

## Datasets & Synthetic Data

| Data | Source | Provenance |
|---|---|---|
| **Market signal (mock)** | `src/market/mock.ts` | Hardcoded deterministic fixture. Returns a fixed USDC/Base liquidity snapshot so the demo is reproducible without any API keys. No external data fetched. |
| **Market signal (live)** | [DexScreener API](https://docs.dexscreener.com/) | Free public API, no auth required. Real-time DEX pair data for the token address in the request. |
| **Agent inference** | Anthropic Claude (Haiku by default) | The model receives the market signal payload and the agent goal; it returns the final analysis. When `ANTHROPIC_API_KEY` is absent the server returns a deterministic stub from `src/providers/mock.ts`. |
| **Spend requests & receipts** | Generated in-process by Tab Runner | Not fetched from any external source. Computed from the policy engine and returned in the API response only. Nothing is persisted. |

No proprietary datasets. No scraped data. No user data is collected or stored.

---

## Known Limitations & Next Steps

### Current limitations

- **Auth is a placeholder.** Supabase is scaffolded but the frontend uses `localStorage` as a session bridge. Real multi-tenant auth (user rows, org isolation) is not yet wired.
- **No persistent storage.** Spend requests, receipts, and run history exist only in the API response for the current session — there is no database backing them.
- **Deterministic demo mode.** `POST /v1/tab/run` executes a fixed tool plan (market-signal → model-call) rather than a live LLM planning loop. The demo is reproducible and fast but does not reflect a fully autonomous agent.
- **x402 payments are simulated by default.** With `X402_ENABLED=false` (the default), no on-chain transactions occur. Receipt metadata is generated locally and references `base-sepolia` as the intended network.
- **Single agent, single run.** No multi-agent orchestration, no streaming responses, no long-running session state.
- **One market data provider.** DexScreener only — no fallback aggregator.

### Next steps

- [ ] Wire Supabase auth end-to-end: session tokens, user rows, org-scoped policy configs
- [ ] Persist runs and receipts to Supabase Postgres
- [ ] Replace fixed tool plan with a live LLM planning loop
- [ ] Stream spend events to the frontend via SSE instead of a single blocking response
- [ ] On-chain settlement on Base mainnet with real USDC
- [ ] Multi-agent support: one Tab session spanning several sub-agents with a shared budget
- [ ] Policy editor UI in the dashboard — operators configure categories and limits without touching code
- [ ] Webhook / alert when spend approaches the budget ceiling

---

## API Reference

| Method | Route | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/v1/capabilities` | List available paid tools and prices |
| `POST` | `/v1/tab/run` | Run a Tab agent session |
| `POST` | `/v1/market-signal` | Paid tool: DEX market data (x402) |
| `POST` | `/v1/model-call` | Paid tool: LLM inference (x402) |

---

## License

MIT
