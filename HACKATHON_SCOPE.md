# Hackathon Scope

## Pre-existing backbone

This repository starts from an existing x402-paid tool router that provided:

- x402-protected model-call endpoint
- x402-protected market-signal endpoint
- Coinbase CDP/x402 payment integration
- Bazaar discovery metadata
- Railway deployment
- buyer scripts
- provider integrations for Anthropic and DexScreener
- existing route tests, provider tests, schema tests, and x402 middleware tests

## Built during the hackathon

The hackathon work is **Tab**, the spend layer for AI agents:

- Tab product framing
- agent budget policy
- spend request lifecycle
- auto-approval rules
- paid tool selection
- receipt ledger
- agent run trace
- demo runner
- judge-facing documentation

## Positioning

The existing x402 router is the payment/tool backbone.

Tab is the new agent spend-control layer built on top of it.
