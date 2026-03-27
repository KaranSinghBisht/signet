import { AGENTS } from "@signet/shared";
import type { AgentConfig, AgentListItem } from "@signet/shared";

const agentMap = new Map<string, AgentConfig>();
for (const agent of AGENTS) {
  agentMap.set(agent.id, agent);
}

export function getAgent(id: string): AgentConfig | undefined {
  return agentMap.get(id);
}

export function listAgents(): AgentListItem[] {
  return AGENTS.map(({ systemPrompt, freeTrialUses, ...rest }) => rest);
}
