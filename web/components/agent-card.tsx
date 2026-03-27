import type { AgentListItem } from "@signet/shared";

const domainColors: Record<string, string> = {
  "Software Engineering": "var(--blue)",
  "Legal Advisory": "var(--purple)",
  "Fitness & Nutrition": "var(--success)",
};

export function AgentCard({ agent }: { agent: AgentListItem }) {
  return (
    <div className="group rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6 hover:border-[var(--border-light)] transition-colors">
      <div className="mb-4 flex items-start justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold"
          style={{
            background: `${domainColors[agent.domain] || "var(--accent)"}15`,
            color: domainColors[agent.domain] || "var(--accent)",
          }}
        >
          {agent.name.slice(0, 2)}
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[10px] font-mono uppercase text-[var(--text-muted)]">
          <span className="h-1 w-1 rounded-full bg-[var(--success)]" />
          3 free queries
        </span>
      </div>
      <h3 className="mb-0.5 text-base font-semibold">{agent.name}</h3>
      <p className="mb-3 text-xs font-medium" style={{ color: domainColors[agent.domain] || "var(--accent)" }}>
        {agent.domain}
      </p>
      <p className="mb-5 text-sm text-[var(--text-muted)] leading-relaxed line-clamp-2">
        {agent.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-[var(--text-dim)]">
          {agent.priceUsd}/query
        </span>
        <a
          href="#chat"
          className="rounded-full bg-[var(--bg-subtle)] border border-[var(--border)] px-4 py-1.5 text-xs font-medium hover:border-[var(--border-light)] transition-colors"
        >
          Chat →
        </a>
      </div>
    </div>
  );
}
