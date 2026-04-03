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
      return new Response('<h1 style="font-family:monospace;color:#7c6aef">petlog</h1><p>Pet Health & Activity Tracker</p>', { headers: { 'Content-Type': 'text/html' } });
    }

    return new Response("Not found", { status: 404 });
  },
};
