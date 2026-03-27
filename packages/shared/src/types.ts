export type AgentType = "free" | "free-trial" | "discount";

export interface AgentConfig {
  id: string;
  name: string;
  domain: string;
  description: string;
  systemPrompt: string;
  priceUsd: string;
  type: AgentType;
  freeTrialUses: number;
  avatarUrl?: string;
}

export type AgentListItem = Omit<AgentConfig, "systemPrompt" | "freeTrialUses">;

export interface QueryRequest {
  question: string;
  agentId: string;
}

export interface QueryResponse {
  answer: string;
  agentId: string;
  model: string;
  paid: boolean;
}
