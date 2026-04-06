import {
  PetProfile,
  HealthRecord,
  FeedingSchedule,
  ActivityTracker,
  VetReminder,
} from "./pet/tracker";

interface Env {
  DEEPSEEK_API_KEY: string;
  DEEPSEEK_API_URL: string;
}

const pets = new PetProfile();
const health = new HealthRecord();
const feeding = new FeedingSchedule();
const activities = new ActivityTracker();
const reminders = new VetReminder();

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// --- SSE chat proxy to DeepSeek ---
async function handleChat(request: Request, env: Env): Promise<Response> {
  const { messages } = (await request.json()) as {
    messages: { role: string; content: string }[];
  };

  const systemPrompt = {
    role: "system",
    content:
      "You are PetLog AI, a friendly pet care assistant. Help users with pet health, feeding, activity, and general care advice. Be warm, concise, and practical.",
  };

  const upstream = await fetch(env.DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      stream: true,
      messages: [systemPrompt, ...messages],
    }),
  });

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

function handlePets(request: Request): Response {
  switch (request.method) {
    case "GET":
      return json(pets.list());
    case "POST": {
      const body = request.json() as Promise<{
        name: string;
        species: string;
        breed: string;
        birthday: string;
      }>;
      return body.then((data) => json(pets.create(data), 201));
    }
    case "PUT": {
      const url = new URL(request.url);

      if (url.pathname === '/health') {
        return new Response(JSON.stringify({ status: 'ok', repo: 'petlog-ai', timestamp: Date.now() }), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
      const id = url.searchParams.get("id");
      if (!id) return json({ error: "id required" }, 400);
      return request
        .json()
        .then((data) => {
          const updated = pets.update(id, data as Parameters<typeof pets.update>[1]);
          return updated ? json(updated) : json({ error: "not found" }, 404);
        });
    }
    case "DELETE": {
      const url = new URL(request.url);
      const id = url.searchParams.get("id");
      if (!id) return json({ error: "id required" }, 400);
      return pets.delete(id) ? json({ ok: true }) : json({ error: "not found" }, 404);
    }
    default:
      return json({ error: "method not allowed" }, 405);
  }
}

function handleHealth(request: Request): Response {
  const url = new URL(request.url);
  const petId = url.searchParams.get("petId");

  switch (request.method) {
    case "GET":
      if (!petId) return json({ error: "petId required" }, 400);
      return json(health.list(petId));
    case "POST":
      return request
        .json()
        .then((data) => json(health.add(data as Parameters<typeof health.add>[0]), 201));
    case "DELETE": {
      const id = url.searchParams.get("id");
      if (!id) return json({ error: "id required" }, 400);
      return health.delete(id) ? json({ ok: true }) : json({ error: "not found" }, 404);
    }
    default:
      return json({ error: "method not allowed" }, 405);
  }
}

function handleFeeding(request: Request): Response {
  const url = new URL(request.url);
  const petId = url.searchParams.get("petId");

  switch (request.method) {
    case "GET":
      if (!petId) return json({ error: "petId required" }, 400);
      return json(feeding.list(petId));
    case "POST":
      return request
        .json()
        .then((data) => json(feeding.add(data as Parameters<typeof feeding.add>[0]), 201));
    case "DELETE": {
      const id = url.searchParams.get("id");
      if (!id) return json({ error: "id required" }, 400);
      return feeding.delete(id) ? json({ ok: true }) : json({ error: "not found" }, 404);
    }
    default:
      return json({ error: "method not allowed" }, 405);
  }
}

function handleActivities(request: Request): Response {
  const url = new URL(request.url);
  const petId = url.searchParams.get("petId");

  switch (request.method) {
    case "GET":
      if (!petId) return json({ error: "petId required" }, 400);
      return json(activities.list(petId));
    case "POST":
      return request
        .json()
        .then((data) => json(activities.add(data as Parameters<typeof activities.add>[0]), 201));
    case "DELETE": {
      const id = url.searchParams.get("id");
      if (!id) return json({ error: "id required" }, 400);
      return activities.delete(id) ? json({ ok: true }) : json({ error: "not found" }, 404);
    }
    default:
      return json({ error: "method not allowed" }, 405);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/health") {
      return new Response(JSON.stringify({ status: "ok", repo: "petlog-ai", timestamp: Date.now() }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // API routes
    if (path.startsWith("/api/")) {
      if (path === "/api/chat" && request.method === "POST") {
        return handleChat(request, env);
      }
      if (path === "/api/pets") return handlePets(request);
      if (path === "/api/health") return handleHealth(request);
      if (path === "/api/feeding") return handleFeeding(request);
      if (path === "/api/activities") return handleActivities(request);
      return json({ error: "not found" }, 404);
    }

    // Serve static HTML
    if (path === "/" || path === "/index.html") {
      return new Response('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PetLog.ai — Pet Health & Activity Tracker</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#0a0f0a;color:#e0f0e0;min-height:100vh}.hero{padding:4rem 2rem;text-align:center;background:linear-gradient(135deg,#0a1a0a,#0a0f1a)}.hero h1{font-size:2.5rem;color:#4ade80;margin-bottom:.5rem}.hero p{color:#6a9b6a;font-size:1.1rem}.features{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1.5rem;padding:2rem;max-width:900px;margin:0 auto}.card{background:#0a1a0a;border:1px solid #1a3a1a;border-radius:12px;padding:1.5rem}.card h3{color:#4ade80;margin-bottom:.5rem}.card p{color:#6a9b6a;font-size:.9rem}.footer{text-align:center;padding:2rem;color:#3a5a3a;font-size:.8rem}a{color:#4ade80}</style></head><body><div class="hero"><h1>PetLog.ai</h1><p>AI-powered pet health & activity tracking. Know your pet better.</p></div><div class="features"><div class="card"><h3>Pet Profiles</h3><p>Track species, breed, birthday, and health history for all your pets.</p></div><div class="card"><h3>Health Records</h3><p>Log vet visits, vaccinations, medications, and weight changes.</p></div><div class="card"><h3>Feeding Schedules</h3><p>Set feeding times, track portions, and get reminders.</p></div><div class="card"><h3>Activity Tracking</h3><p>Log walks, play sessions, and exercise routines.</p></div><div class="card"><h3>AI Chat</h3><p>Ask about pet care, symptoms, nutrition, and behavior.</p></div><div class="card"><h3>Vet Reminders</h3><p>Never miss a checkup or vaccination date.</p></div></div><div class="footer">cocapn vessel &middot; <a href="https://github.com/Lucineer">GitHub</a></div></body></html>', { headers: { 'Content-Type': 'text/html', 'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*;" } });
    }

    return new Response("Not found", { status: 404 });
  },
};
