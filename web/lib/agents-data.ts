import { AGENTS } from "@signet/shared";
import type { AgentListItem } from "@signet/shared";

export const XMTP_AGENT_ADDRESS =
  process.env.NEXT_PUBLIC_XMTP_AGENT_ADDRESS || "";
export const XMTP_CHAT_URL = `https://xmtp.chat/dev/dm/${XMTP_AGENT_ADDRESS}`;

export function getAgents(): AgentListItem[] {
  return AGENTS.map(({ systemPrompt, freeTrialUses, ...rest }) => rest);
}

export function getAgent(id: string): AgentListItem | undefined {
  const agent = AGENTS.find((a) => a.id === id);
  if (!agent) return undefined;
  const { systemPrompt, freeTrialUses, ...rest } = agent;
  return rest;
}
