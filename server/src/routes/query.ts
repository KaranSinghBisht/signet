import { Hono } from "hono";
import { getAgent } from "../services/registry.js";
import { queryAI } from "../services/ai.js";
import type { QueryRequest, QueryResponse } from "@signet/shared";

const query = new Hono();

query.post("/query/:agentId", async (c) => {
  const agentId = c.req.param("agentId");
  const agent = getAgent(agentId);

  if (!agent) {
    return c.json({ error: `Agent '${agentId}' not found` }, 404);
  }

  const body = await c.req.json<QueryRequest>();
  if (!body.question || typeof body.question !== "string") {
    return c.json({ error: "Missing 'question' in request body" }, 400);
  }

  const { answer, model } = await queryAI(agent.systemPrompt, body.question);

  const response: QueryResponse = {
    answer,
    agentId: agent.id,
    model,
    paid: true,
  };

  return c.json(response);
});

export { query };
