import { AGENTS } from "@signet/shared";
import type { AgentConfig } from "@signet/shared";

export const XMTP_AGENT_ADDRESS =
  process.env.NEXT_PUBLIC_XMTP_AGENT_ADDRESS || "";
export const XMTP_CHAT_URL = `https://xmtp.chat/dev/dm/${XMTP_AGENT_ADDRESS}`;

export function getAgents(): AgentConfig[] {
  return AGENTS;
}

export function getAgent(id: string): AgentConfig | undefined {
  return AGENTS.find((a) => a.id === id);
}
