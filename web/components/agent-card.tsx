import type { AgentListItem } from "@signet/shared";
import { XMTP_CHAT_URL } from "@/lib/agents-data";

const typeColors: Record<string, string> = {
  free: "bg-[var(--success-light)] text-[var(--success)]",
  "free-trial": "bg-[var(--accent-light)] text-[var(--accent)]",
  discount: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
};

const domainEmoji: Record<string, string> = {
  "Software Engineering": "//",
  "Legal Advisory": "{}",
  "Fitness & Nutrition": "><",
};

export function AgentCard({ agent }: { agent: AgentListItem }) {
  return (
    <div className="group rounded-xl border border-[var(--border)] p-6 hover:border-[var(--accent)] transition-colors">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--accent-light)] text-lg font-mono font-bold text-[var(--accent)]">
          {domainEmoji[agent.domain] || "AI"}
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[agent.type] || ""}`}
        >
          {agent.type === "free-trial" ? "3 free queries" : agent.type}
        </span>
      </div>
      <h3 className="mb-1 text-lg font-semibold">{agent.name}</h3>
      <p className="mb-1 text-xs font-medium text-[var(--accent)]">
        {agent.domain}
      </p>
      <p className="mb-4 text-sm text-[var(--muted)] leading-relaxed line-clamp-2">
        {agent.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-mono text-[var(--muted)]">
          {agent.priceUsd}/query
        </span>
        <a
          href={XMTP_CHAT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-[var(--foreground)] px-4 py-2 text-xs font-medium text-[var(--background)] hover:opacity-80 transition-opacity"
        >
          Chat on XMTP
        </a>
      </div>
    </div>
  );
}
