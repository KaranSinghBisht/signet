import { CommandRouter } from "@xmtp/agent-sdk";
import { AGENTS } from "@signet/shared";
import type { AgentListItem, QueryResponse } from "@signet/shared";
import { paymentFetch } from "../services/payment-client.js";
import { config } from "../config.js";

async function fetchLiveAgents(): Promise<AgentListItem[]> {
  try {
    const res = await fetch(`${config.serverUrl}/agents`);
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const data = (await res.json()) as { agents: AgentListItem[] };
    return data.agents ?? [];
  } catch (err: unknown) {
    console.warn(
      "Failed to fetch live agents, falling back to static list:",
      err instanceof Error ? err.message : err,
    );
    return AGENTS.map(({ systemPrompt: _s, freeTrialUses: _f, ...rest }) => rest);
  }
}

export function createRouter(): CommandRouter {
  const router = new CommandRouter({ helpCommand: "/help" });

  router.command("/help", "Show available commands", async (ctx) => {
    const helpText = [
      "**Signet** — Verified Human Agents",
      "",
      "Commands:",
      "  `/list` — Browse available agents",
      "  `/ask <agent> <question>` — Query an agent",
      "  `/help` — Show this help message",
      "",
      "Example:",
      "  `/ask codesage How do I structure a Next.js project?`",
      "",
      "First 3 queries per agent are free (World ID verified).",
      "After that, micropayments in USDC via x402.",
    ].join("\n");
    await ctx.sendTextReply(helpText);
  });

  router.command("/list", "List available agents", async (ctx) => {
    const agents = await fetchLiveAgents();
    const lines = agents.map(
      (a) =>
        `**${a.name}** (${a.id}) — ${a.domain}\n  ${a.description}\n  Price: ${a.priceUsd}/query`,
    );
    const text = ["**Available Agents:**", "", ...lines].join("\n");
    await ctx.sendTextReply(text);
  });

  router.command("/ask", "Query an agent", async (ctx) => {
    const text = ctx.message.content;
    const parts = text.replace("/ask", "").trim().split(/\s+/);
    const agentId = parts[0]?.toLowerCase();
    const question = parts.slice(1).join(" ");

    if (!agentId || !question) {
      await ctx.sendTextReply(
        "Usage: `/ask <agent-id> <question>`\nExample: `/ask codesage How do I use React hooks?`",
      );
      return;
    }

    const agents = await fetchLiveAgents();
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) {
      const ids = agents.map((a) => a.id).join(", ");
      await ctx.sendTextReply(`Agent "${agentId}" not found. Available: ${ids}`);
      return;
    }

    await ctx.sendTextReply(`Querying **${agent.name}**... ⏳`);

    try {
      const response = await paymentFetch(
        `${config.serverUrl}/query/${agentId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, agentId }),
        },
      );

      if (!response.ok) {
        const errBody = await response.text();
        console.error(`Query error for agent ${agent.id} (HTTP ${response.status}):`, errBody);
        await ctx.sendTextReply(`${agent.name} is temporarily unavailable. Please try again.`);
        return;
      }

      const data = (await response.json()) as QueryResponse;
      await ctx.sendTextReply(`**${agent.name}** (via x402):\n\n${data.answer}`);
    } catch (err: unknown) {
      console.error(`Agent query error (${agent.id}):`, err);
      await ctx.sendTextReply(`Failed to query ${agent.name}. Please try again.`);
    }
  });

  router.default(async (ctx) => {
    await ctx.sendTextReply(
      "I didn't understand that. Type `/help` for available commands.",
    );
  });

  return router;
}
