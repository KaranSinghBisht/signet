import "dotenv/config";
import { Agent, getTestUrl, filter } from "@xmtp/agent-sdk";
import { createRouter } from "./handlers/commands.js";

const agent = await Agent.createFromEnv();
const router = createRouter();

agent.on("text", async (ctx) => {
  if (filter.fromSelf(ctx.message, agent.client)) return;
  await router.handle(ctx);
});

agent.on("start", () => {
  console.info("Signet XMTP Agent started");
  console.info(`Address: ${agent.address}`);
  console.info(`Test: ${getTestUrl(agent.client)}`);
});

agent.on("unhandledError", (error) => {
  console.error("Unhandled error:", error);
});

// Sync conversations before streaming so the local DB is up-to-date
try {
  await agent.client.conversations.syncAll();
} catch (err) {
  console.warn("syncAll failed (non-fatal):", err);
}

await agent.start();
