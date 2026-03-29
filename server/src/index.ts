import "dotenv/config";
import { Hono } from "hono";
import type { Context, Next } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { HTTPFacilitatorClient } from "@x402/core/http";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import {
  paymentMiddlewareFromHTTPServer,
  x402HTTPResourceServer,
  x402ResourceServer,
} from "@x402/hono";
import {
  agentkitResourceServerExtension,
  createAgentBookVerifier,
  createAgentkitHooks,
  declareAgentkitExtension,
  InMemoryAgentKitStorage,
} from "@worldcoin/agentkit";
import { config } from "./config.js";
import { query } from "./routes/query.js";
import { AGENTS, DEFAULT_FREE_TRIAL_USES } from "@signet/shared";
import { getAgent, listAgents, registerAgent } from "./services/registry.js";

const app = new Hono();

// --- Rate limiting ---
function createRateLimiter(limit: number, windowMs: number) {
  const store = new Map<string, { count: number; windowStart: number }>();
  return async (c: Context, next: Next) => {
    const ip =
      c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ??
      c.req.header("cf-connecting-ip") ??
      "unknown";
    const now = Date.now();
    const entry = store.get(ip);
    if (!entry || now - entry.windowStart > windowMs) {
      store.set(ip, { count: 1, windowStart: now });
    } else {
      entry.count += 1;
      if (entry.count > limit) {
        return c.json({ error: "Too many requests. Try again later." }, 429);
      }
    }
    await next();
  };
}

// 120 req/min globally per IP
app.use("/*", createRateLimiter(120, 60_000));

app.use(
  "/*",
  cors({
    origin: [
      "http://localhost:3000",
      ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
    ],
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  }),
);

const facilitatorClient = new HTTPFacilitatorClient({ url: config.facilitatorUrl });
const network = config.paymentNetwork as `${string}:${string}`;

const agentBook = createAgentBookVerifier({ network: "world" });
const storage = new InMemoryAgentKitStorage();
const hooks = createAgentkitHooks({
  agentBook,
  storage,
  mode: { type: "free-trial", uses: DEFAULT_FREE_TRIAL_USES },
  onEvent: (event: unknown) => {
    console.info("[agentkit-event]", JSON.stringify(event));
  },
});

const resourceServer = new x402ResourceServer(facilitatorClient)
  .register(network, new ExactEvmScheme())
  .registerExtension(agentkitResourceServerExtension);

const payTo = config.agentWalletAddress;

function buildRouteConfig(agentName: string) {
  return {
    accepts: [{ scheme: "exact", price: "$0.001", network, payTo }],
    extensions: declareAgentkitExtension({
      statement: `Query ${agentName} - verified human agent on Signet`,
      mode: { type: "free-trial", uses: DEFAULT_FREE_TRIAL_USES },
    }),
  };
}

// Mutable routes config — dynamic agents are added here at registration time
const routesConfig: Record<string, unknown> = {};
for (const agent of AGENTS) {
  routesConfig[`POST /query/${agent.id}`] = buildRouteConfig(agent.name);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const httpServer = new x402HTTPResourceServer(resourceServer, routesConfig as any)
  .onProtectedRequest(hooks.requestHook);

app.use(paymentMiddlewareFromHTTPServer(httpServer));

app.get("/health", (c) =>
  c.json({ status: "ok", service: "signet-server", timestamp: Date.now() }),
);

app.get("/agents", (c) => c.json({ agents: listAgents() }));

// 10 agent registrations per hour per IP
app.use("/agents", createRateLimiter(10, 3_600_000));

app.post("/agents", async (c) => {
  // Require deploy secret when configured
  if (config.deploySecret) {
    const auth = c.req.header("Authorization");
    if (!auth || auth !== `Bearer ${config.deploySecret}`) {
      return c.json({ error: "Unauthorized" }, 401);
    }
  }

  let body: {
    name?: string;
    domain?: string;
    description?: string;
    systemPrompt?: string;
    deployedBy?: string;
    voiceEnabled?: boolean;
    twitterHandle?: string;
  };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  const { name, domain, description, systemPrompt, deployedBy, voiceEnabled, twitterHandle } = body;
  if (!name || !domain || !description || !systemPrompt || !deployedBy) {
    return c.json(
      { error: "Missing required fields: name, domain, description, systemPrompt, deployedBy" },
      400,
    );
  }
  if (name.length > 50 || description.length > 500 || systemPrompt.length > 2000) {
    return c.json({ error: "Field too long" }, 400);
  }

  // Strip HTML/script tags from user-supplied text fields
  const sanitize = (s: string) => s.replace(/<[^>]*>/g, "").trim();

  let agent: ReturnType<typeof registerAgent>;
  try {
    agent = registerAgent({
      name: sanitize(name),
      domain: sanitize(domain),
      description: sanitize(description),
      systemPrompt: systemPrompt.trim(),
      deployedBy,
      voiceEnabled: voiceEnabled === true,
      twitterHandle,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Registration failed";
    return c.json({ error: msg }, 400);
  }

  // Register x402 payment route for this dynamic agent (mutating routesConfig is intentional —
  // the x402 middleware reads it per-request)
  routesConfig[`POST /query/${agent.id}`] = buildRouteConfig(agent.name);

  return c.json(agent, 201);
});

app.get("/agents/:id", (c) => {
  const agent = getAgent(c.req.param("id"));
  if (!agent) return c.json({ error: "Agent not found" }, 404);
  const { systemPrompt: _sp, ...publicInfo } = agent;
  return c.json(publicInfo);
});

app.route("/", query);

serve({ fetch: app.fetch, port: config.port }, () => {
  console.info(`Signet server on http://localhost:${config.port}`);
  console.info(`Network: ${config.paymentNetwork} | Facilitator: ${config.facilitatorUrl}`);
  console.info(`Routes: ${Object.keys(routesConfig).join(", ")}`);
});
