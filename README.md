# PetLog AI

A pet care companion app built on Cloudflare Workers with an AI-powered chat assistant.

## Features

- **Pet Profiles** — Manage your pets (name, species, breed, birthday)
- **Health Timeline** — Track vet visits, vaccinations, and weight
- **Feeding Schedule** — Plan meals with recurring schedules
- **Activity Log** — Log walks, play sessions, and training
- **AI Chat** — Ask pet care questions via DeepSeek (SSE streaming)

## API

| Endpoint | Methods | Description |
|---|---|---|
| `POST /api/chat` | POST | SSE chat proxy to DeepSeek |
| `/api/pets` | GET, POST, PUT, DELETE | Pet CRUD |
| `/api/health` | GET, POST, DELETE | Health records |
| `/api/feeding` | GET, POST, DELETE | Feeding schedules |
| `/api/activities` | GET, POST, DELETE | Activity log |

## Setup

```bash
npm install
```

Set your DeepSeek API key:

```bash
wrangler secret put DEEPSEEK_API_KEY
```

## Develop

```bash
npm run dev
```

## Deploy

```bash
npm run deploy
```

## Tech

- Cloudflare Workers (TypeScript)
- DeepSeek AI (streaming SSE)
- Single-page HTML UI (no framework, no build step)

## License

MIT — Built with ❤️ by [Superinstance](https://github.com/superinstance) & [Lucineer](https://github.com/Lucineer) (DiGennaro et al.)
