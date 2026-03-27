import "dotenv/config";
import { Hono } from "hono";
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
import { AGENTS } from "@signet/shared";
import { getAgent, listAgents } from "./services/registry.js";

const app = new Hono();
app.use("/*", cors());

const facilitatorClient = new HTTPFacilitatorClient({
  url: config.facilitatorUrl,
});

const network = config.paymentNetwork as `${string}:${string}`;

const agentBook = createAgentBookVerifier({ network: "world" });
const storage = new InMemoryAgentKitStorage();
const hooks = createAgentkitHooks({
  agentBook,
  storage,
  mode: { type: "free-trial", uses: 3 },
  onEvent: (event: unknown) => {
    console.info("[agentkit-event]", JSON.stringify(event));
  },
});

const resourceServer = new x402ResourceServer(facilitatorClient)
  .register(network, new ExactEvmScheme())
  .registerExtension(agentkitResourceServerExtension);

const payTo = config.agentWalletAddress;
const routesConfig: Record<string, unknown> = {};
for (const agent of AGENTS) {
  routesConfig[`POST /query/${agent.id}`] = {
    accepts: [
      { scheme: "exact", price: agent.priceUsd, network, payTo },
    ],
    extensions: declareAgentkitExtension({
      statement: `Query ${agent.name} - verified human agent on Signet`,
      mode: { type: "free-trial", uses: agent.freeTrialUses },
    }),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const httpServer = new x402HTTPResourceServer(resourceServer, routesConfig as any)
  .onProtectedRequest(hooks.requestHook);

app.use(paymentMiddlewareFromHTTPServer(httpServer));

app.get("/health", (c) =>
  c.json({ status: "ok", service: "signet-server", timestamp: Date.now() }),
);

app.get("/agents", (c) => c.json({ agents: listAgents() }));

app.get("/agents/:id", (c) => {
  const agent = getAgent(c.req.param("id"));
  if (!agent) return c.json({ error: "Agent not found" }, 404);
  const { systemPrompt, ...publicInfo } = agent;
  return c.json(publicInfo);
});

app.route("/", query);

serve({ fetch: app.fetch, port: config.port }, () => {
  console.info(`Signet server on http://localhost:${config.port}`);
  console.info(`Network: ${config.paymentNetwork} | Facilitator: ${config.facilitatorUrl}`);
  console.info(`Routes: ${Object.keys(routesConfig).join(", ")}`);
});
