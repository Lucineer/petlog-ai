# petlog-ai 🐾

You stop digging through different apps and text threads when your pet gets sick. This is a single place for their care, running on infrastructure you control. No one else holds your data.

**Live Demo:** https://petlog-ai.casey-digennaro.workers.dev
Test the full interface with sample pets and logs before deploying your own.

## Why This Exists
When your pet has a medical episode, you need immediate access to their history, not a login wall or a deprecated app. This was built for that moment. It runs on your account, so its lifespan is tied to yours.

## Quick Start
You own your copy. Start by forking.
1.  **Fork** this repository.
2.  **Deploy** to Cloudflare Workers. Run `npx wrangler deploy` from the directory.
3.  Go to `/setup` on your new worker URL to configure your pets and LLM keys.

## Architecture
A single Cloudflare Worker serves the web UI, API, and stores encrypted data in Cloudflare KV. AI context is built locally from your pet’s history before being sent to your chosen LLM provider. Zero runtime dependencies. The entire application bundle is under 100KB.

## Features
*   **Health Record Tracking**: Log vet visits, medications, symptoms, and weight with timestamps. Attach photos of lab work or prescriptions.
*   **Silent Scheduling**: Set reminders for medications, feeding, or treatments. Notifications are managed by your worker, not a third-party service.
*   **Vet Visit Prep**: Generate a clean, chronological summary of symptoms and medications for your vet with one click.
*   **Contextual Care Q&A**: Ask questions. Answers are synthesized solely from your pet's logged history.
*   **Bring Your Own Keys**: Use OpenAI, Anthropic, or any compatible LLM API. Your keys are stored encrypted in your KV store.
*   **Fleet Updates**: Safely pull upstream updates for the app framework without overwriting your data or customizations.
*   **Zero Telemetry**: No tracking, analytics, or external calls except those you explicitly trigger (like an LLM request).

## An Honest Limitation
To keep responses fast and relevant, the AI context window includes your pet's **last 50 log entries**. For long-term history analysis, you can use the vet visit prep tool, which compiles the full timeline. This is not a substitute for professional veterinary advice.

## What Makes This Different
1.  **You Control the Infrastructure**: It runs on your Cloudflare account. There is no central service to shut down.
2.  **Data Sovereignty**: No pet health data or usage patterns ever leave your worker except for explicit LLM queries using your own API key.
3.  **Fully Modifiable**: You can change any part of the logic, UI, or data structure directly in your fork.

## License
MIT. Use it, change it, share it. The only request is that you don't use it to lock others out of their own data.

<div style="text-align:center;padding:16px;color:#64748b;font-size:.8rem"><a href="https://the-fleet.casey-digennaro.workers.dev" style="color:#64748b">The Fleet</a> &middot; <a href="https://cocapn.ai" style="color:#64748b">Cocapn</a></div>