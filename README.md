<p align="center">
  <img src="https://raw.githubusercontent.com/Lucineer/capitaine/master/docs/capitaine-logo.jpg" alt="Capitaine" width="120">
</p>

<h1 align="center">petlog-ai</h1>

<p align="center">A local-first companion for pet health records and care.</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> ·
  <a href="#features">Features</a> ·
  <a href="#limitations">Limitations</a> ·
  <a href="https://petlog-ai.casey-digennaro.workers.dev">Live Demo</a> ·
  <a href="https://github.com/Lucineer/petlog-ai/issues">Issues</a>
</p>

---

You forget the rabies booster date. You stand in the pet store staring at 17 bags of food trying to remember what the vet recommended last visit. They ask for medical history and you are scrolling 18 months of camera roll screenshots.

This is a private companion vessel that lives in your fork, runs on your infrastructure, and organizes the details for the animals you care for.

No account walls. No data mining. No subscription. You never have to send your pet's details to a random startup server.

## Why this exists
Most pet care tools are built for venture exit. They lock your data, kill features when funding runs out, and disappear. This one was built for people with pets:
- It is an agent, not just a form. It can notice patterns in your entries.
- It lives only where you put it.
- It can receive optional updates from the fleet, but you control them.
- It will still work in 10 years, exactly as you left it.

## Quick Start
Fork first. This vessel is designed to be owned.

```bash
gh repo fork Lucineer/petlog-ai --clone
cd petlog-ai
npx wrangler login
npx wrangler deploy
```
Add your LLM API key via Cloudflare Secrets (BYOK v2). The vessel is alive.

## Features
- **Timestamped health records** with attached notes.
- **Feeding schedules** that adjust for age and weight.
- **Vet appointment reminders** with pre-visit checklists.
- **Contextual care advice** that references your pet's history.
- **Vessel standard**: BYOK v2, multi-model routing, session memory, PII safety, rate limiting, health checks.

## Architecture
Single-file Cloudflare Worker. Zero runtime dependencies. Inline HTML serving. Runs at the edge.
```
src/
  worker.ts      # Main application logic and routing
lib/
  byok.ts        # Multi-model routing (BYOK v2)
```

## Limitations
This is a foundational agent. It does not have native mobile notifications or direct calendar sync; you manage updates through the web interface or API.

## The Fleet
petlog-ai is part of the Cocapn Fleet—a network of autonomous vessels that share trust and updates. Your fork can optionally bond with the fleet to receive non-breaking improvements while maintaining full control and ownership.

<div align="center">
  <hr>
  <p>
    Part of the <a href="https://the-fleet.casey-digennaro.workers.dev">Cocapn Fleet</a> · 
    <a href="https://cocapn.ai">Protocol Home</a> · 
    Attribution: Superinstance & Lucineer (DiGennaro et al.)
  </p>
</div>