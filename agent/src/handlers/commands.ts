import { CommandRouter } from "@xmtp/agent-sdk";
import { AGENTS } from "@signet/shared";
import type { QueryResponse } from "@signet/shared";
import { paymentFetch } from "../services/payment-client.js";
import { config } from "../config.js";

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
    const lines = AGENTS.map(
      (a) => `**${a.name}** (${a.id}) — ${a.domain}\n  ${a.description}\n  Price: ${a.priceUsd}/query | ${a.freeTrialUses} free queries`,
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

    const agent = AGENTS.find((a) => a.id === agentId);
    if (!agent) {
      const ids = AGENTS.map((a) => a.id).join(", ");
      await ctx.sendTextReply(
        `Agent "${agentId}" not found. Available: ${ids}`,
      );
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
        const err = await response.text();
        await ctx.sendTextReply(`Error from ${agent.name}: ${err}`);
        return;
      }

      const data = (await response.json()) as QueryResponse;
      await ctx.sendTextReply(
        `**${agent.name}** (via x402):\n\n${data.answer}`,
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      await ctx.sendTextReply(`Failed to query ${agent.name}: ${msg}`);
    }
  });

  router.default(async (ctx) => {
    await ctx.sendTextReply(
      "I didn't understand that. Type `/help` for available commands.",
    );
  });

  return router;
}
