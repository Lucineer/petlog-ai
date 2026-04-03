# PETLOG-AI

> AI-powered pet health companion — track pet health, schedule care, and log wellness data — part of the [Cocapn](https://cocapn.ai) ecosystem

![Build](https://img.shields.io/badge/build-passing-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-blue)

## Description

AI-powered pet health companion — track pet health, schedule care, and log wellness data. Built as a Cloudflare Worker with BYOK (Bring Your Own Key) architecture.

## ✨ Features

Pet profiles with medical history\n- Vaccination scheduling\n- Weight and activity tracking\n- Feeding logs and diet plans\n- Vet appointment management\n- Medication reminders\n- Multi-pet household support

## 🚀 Getting Started

1. Clone the repo
2. `npm install`
3. `cp .dev.vars.example .dev.vars` and add your KV namespace ID
4. `npm run dev` to start locally
5. Visit `/setup` to configure your LLM provider

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/setup` | GET | BYOK setup wizard |
| `/api/chat` | POST | Chat with the AI agent |
| `/api/seed` | POST | Seed sample data |
| `/api/pets` | GET | List all pets |
| `/api/pets` | POST | Create a pet |
| `/api/pets/:id` | GET | Get a pet |
| `/api/pets/:id` | PATCH | Update a pet |
| `/api/pets/:id` | DELETE | Delete a pet |

## Architecture

Single Cloudflare Worker with inline HTML, BYOK LLM routing, and KV persistence. Zero runtime dependencies.

## License

MIT
