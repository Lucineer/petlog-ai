# CLAUDE.md — PetLog

## Project Overview
PetLog is an AI-powered AI-powered pet health companion — track pet health, schedule care, and log wellness data, built as a Cloudflare Worker with BYOK architecture. Part of the Cocapn ecosystem at cocapn.ai.

GitHub Organization: **Lucineer**

## Architecture
Single Cloudflare Worker: inline HTML UI + API routes + BYOK LLM routing + KV persistence.

### Key Routes
- `/health` — Health check
- `/setup` — BYOK provider setup
- `/api/chat` — LLM chat with pets context
- `/api/seed` — Seed sample data
- `/api/pets` — CRUD for pets

## Code Style
- TypeScript throughout, no build step
- Zero runtime dependencies
- Inline HTML pattern (no ASSETS binding)
- Brand accent color: #f59e0b
- All commits: `Author: Superinstance`

## Key Commands
```bash
wrangler dev      # Local dev
wrangler deploy   # Deploy to Cloudflare
```

## What NOT to Change
- BYOK module structure (config discovery cascade)
- Inline HTML pattern
- Zero-dependency constraint
- KV binding name `MEMORY`
