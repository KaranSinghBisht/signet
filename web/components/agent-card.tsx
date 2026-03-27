import type { AgentListItem } from "@signet/shared";

const domainColors: Record<string, string> = {
  "Software Engineering": "var(--blue)",
  "Legal Advisory": "var(--purple)",
  "Fitness & Nutrition": "var(--success)",
};

export function AgentCard({ agent }: { agent: AgentListItem }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6 hover:shadow-sm transition-shadow">
      <div className="mb-4 flex items-start justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold"
          style={{
            background: `${domainColors[agent.domain] || "var(--accent)"}10`,
            color: domainColors[agent.domain] || "var(--accent)",
          }}
        >
          {agent.name.slice(0, 2)}
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[10px] text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>
          <span className="h-1 w-1 rounded-full bg-[var(--success)]" />
          3 free
        </span>
      </div>
      <h3 className="mb-0.5 text-base font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
        {agent.name}
      </h3>
      <p className="mb-3 text-xs font-medium" style={{ color: domainColors[agent.domain] || "var(--accent)" }}>
        {agent.domain}
      </p>
      <p className="mb-5 text-sm text-[var(--text-muted)] leading-relaxed line-clamp-2">
        {agent.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--text-dim)]" style={{ fontFamily: "var(--font-mono)" }}>
          {agent.priceUsd}/query
        </span>
        <a
          href="#chat"
          className="rounded-md border border-[var(--border)] px-3.5 py-1.5 text-xs font-medium text-[var(--text-muted)] hover:border-[var(--border-light)] hover:text-[var(--text)] transition-colors"
        >
          Chat →
        </a>
      </div>
    </div>
  );
}
