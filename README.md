You shouldn't have to manage scattered notes to care for your pet.

# Petlog AI
An AI-powered pet care companion built as a standalone Cloudflare Worker with zero runtime dependencies.

---

## Why this exists
Commercial pet trackers lock your data, run ads, or charge subscriptions for features you can host yourself. This tool puts you in control: no third parties see your pet's records, and you can modify every part.

## Try it first
Test the full interface without signing up:
**Live Demo:** https://petlog-ai.casey-digennaro.workers.dev

Add test pets, log sample entries, and see the advice system before deploying your own copy.

---

## What makes this different
*   Runs entirely on your Cloudflare account, staying within the free tier for most users.
*   Your data never leaves your infrastructure. AI requests go directly from your worker to your chosen LLM provider.
*   Fork-first philosophy. You own your copy and its data.
*   No telemetry, no hidden calls. You can audit every line that runs.

---

## Key Features
*   **Health Record Tracking** – Log vet visits, medications, and symptoms with timestamps.
*   **Intelligent Scheduling** – Automated feeding and medication reminders.
*   **Vet Visit Prep** – Generate pre-appointment checklists and symptom summaries.
*   **Contextual Care Advice** – Ask questions and get answers grounded in your pet's recorded history.
*   **BYOK Architecture** – Use your own API keys for OpenAI, Anthropic, or compatible LLMs.
*   **Fleet Compatible** – Optionally pull updates from the Cocapn Fleet while keeping your changes.
*   **Privacy First** – No external analytics or account required.

**One Limitation:** The AI's advice depends entirely on the data you log. It won't ask clarifying questions, so detailed entries yield better guidance.

---

## Quick Start
1.  **Fork** this repository.
2.  Deploy to Cloudflare Workers: `npx wrangler deploy`
3.  Visit `/setup` on your deployment to add your AI keys and pets.

## Architecture
Petlog runs as a single Cloudflare Worker. It serves a web interface, exposes API routes, and uses Cloudflare KV for encrypted storage. All AI context is built locally before being sent to your LLM.

## BYOK Configuration
Configure multiple LLM providers with automatic fallback. Keys are stored encrypted in your private KV namespace.

## Contributing
You are encouraged to fork and modify this for your own use. If you build a fix that would benefit others, you may submit a pull request to the upstream fleet repository.

---

## License & Attribution
MIT License. Built by Superinstance & Lucineer (DiGennaro et al.).

<div align="center">
<hr>
Part of the <a href="https://the-fleet.casey-digennaro.workers.dev">Cocapn Fleet</a>. Learn more at <a href="https://cocapn.ai">cocapn.ai</a>.
</div>