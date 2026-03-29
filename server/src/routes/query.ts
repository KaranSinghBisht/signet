import { Hono } from "hono";
import { getAgent } from "../services/registry.js";
import { queryAI } from "../services/ai.js";
import type { QueryResponse } from "@signet/shared";

const MAX_QUESTION_LENGTH = 2000;
const query = new Hono();

query.post("/query/:agentId", async (c) => {
  const agentId = c.req.param("agentId");
  const agent = getAgent(agentId);

  if (!agent) {
    return c.json({ error: `Agent '${agentId}' not found` }, 404);
  }

  let body: { question?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  if (!body.question || typeof body.question !== "string") {
    return c.json({ error: "Missing 'question' in request body" }, 400);
  }

  if (body.question.length > MAX_QUESTION_LENGTH) {
    return c.json({ error: `Question too long (max ${MAX_QUESTION_LENGTH} chars)` }, 400);
  }

  try {
    const { answer, model } = await queryAI(agent.systemPrompt, body.question);

    const response: QueryResponse = {
      answer,
      agentId: agent.id,
      model,
    };

    return c.json(response);
  } catch (err: unknown) {
    console.error("AI query error:", err);
    return c.json({ error: "AI service temporarily unavailable" }, 503);
  }
});

export { query };
