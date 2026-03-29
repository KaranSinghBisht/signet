import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { AGENTS, DEFAULT_FREE_TRIAL_USES } from "@signet/shared";
import type { AgentConfig, AgentListItem } from "@signet/shared";

export interface DeployedAgentPublic extends AgentListItem {
  deployedBy: string;
}

interface DynamicAgentConfig extends AgentConfig {
  deployedBy: string;
}

const MAX_DYNAMIC_AGENTS = 1000;
const TWITTER_HANDLE_RE = /^[a-zA-Z0-9_]{1,15}$/;

const DATA_FILE = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../data/dynamic-agents.json",
);

const staticMap = new Map<string, AgentConfig>();
for (const agent of AGENTS) {
  staticMap.set(agent.id, agent);
}

const dynamicAgents = new Map<string, DynamicAgentConfig>();

function ensureDataDir(): void {
  const dir = dirname(DATA_FILE);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function loadFromDisk(): void {
  try {
    ensureDataDir();
    if (!existsSync(DATA_FILE)) return;
    const data = JSON.parse(readFileSync(DATA_FILE, "utf-8")) as DynamicAgentConfig[];
    for (const agent of data) {
      dynamicAgents.set(agent.id, agent);
    }
  } catch {
    // Corrupt or missing data — start fresh
  }
}

function saveToDisk(): void {
  try {
    ensureDataDir();
    writeFileSync(
      DATA_FILE,
      JSON.stringify(Array.from(dynamicAgents.values()), null, 2),
      "utf-8",
    );
  } catch {
    // Non-fatal — in-memory state is still valid
  }
}

loadFromDisk();

export function registerAgent(data: {
  name: string;
  domain: string;
  description: string;
  systemPrompt: string;
  deployedBy: string;
  voiceEnabled?: boolean;
  twitterHandle?: string;
}): DeployedAgentPublic {
  if (dynamicAgents.size >= MAX_DYNAMIC_AGENTS) {
    throw new Error("Agent registry full");
  }

  const handle = data.twitterHandle?.toLowerCase();
  if (handle && !TWITTER_HANDLE_RE.test(handle)) {
    throw new Error("Invalid Twitter handle format");
  }

  const slug = data.name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 16);
  let id = handle ?? `${slug}-${crypto.randomUUID().slice(0, 8)}`;

  // Avoid collisions with static and dynamic agents
  if (staticMap.has(id) || dynamicAgents.has(id)) {
    id = `${slug}-${crypto.randomUUID().slice(0, 8)}`;
  }

  const agent: DynamicAgentConfig = {
    id,
    name: data.name,
    domain: data.domain,
    description: data.description,
    systemPrompt: data.systemPrompt,
    priceUsd: "$0.001",
    type: "free-trial",
    freeTrialUses: DEFAULT_FREE_TRIAL_USES,
    deployedBy: data.deployedBy,
    voiceEnabled: data.voiceEnabled ?? false,
    twitterHandle: data.twitterHandle,
  };

  dynamicAgents.set(id, agent);
  saveToDisk();

  return {
    id,
    name: agent.name,
    domain: agent.domain,
    description: agent.description,
    priceUsd: agent.priceUsd,
    type: agent.type,
    voiceEnabled: agent.voiceEnabled,
    twitterHandle: agent.twitterHandle,
    deployedBy: data.deployedBy,
  };
}

export function getAgent(id: string): AgentConfig | undefined {
  return staticMap.get(id) ?? dynamicAgents.get(id);
}

export function listAgents(): (AgentListItem & { deployedBy?: string })[] {
  const staticList = AGENTS.map(({ systemPrompt: _s, freeTrialUses: _f, ...rest }) => rest);
  const dynamicList = Array.from(dynamicAgents.values()).map(
    ({ systemPrompt: _s, freeTrialUses: _f, ...rest }) => rest,
  );
  return [...staticList, ...dynamicList];
}
