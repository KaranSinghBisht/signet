import type { AgentListItem } from "@signet/shared";

const domainColors: Record<string, string> = {
  "Software Engineering": "var(--blue)",
  "Legal Advisory": "var(--purple)",
  "Fitness & Nutrition": "var(--success)",
  "Finance & Investing": "var(--accent)",
  "Marketing & Growth": "var(--pink)",
  "Data Science": "var(--cyan)",
};

export function AgentCard({ agent }: { agent: AgentListItem }) {
  const color = domainColors[agent.domain] || "var(--accent)";

  return (
    <div className="group rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6 hover:border-[var(--border-light)] hover:shadow-lg transition-all duration-300">
      <div className="mb-5 flex items-start justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold shadow-sm ring-1 ring-inset transition-transform group-hover:scale-105"
          style={{
            background: `${color}10`,
            color: color,
            boxShadow: `0 0 0 1px ${color}20`,
          }}
        >
          {agent.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-paper)] px-2.5 py-0.5 text-[10px] font-medium text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
            3 free trial
          </span>
          <span className="text-[10px] text-[var(--text-dim)] font-mono">
            {agent.priceUsd}/query
          </span>
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-lg font-bold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
          {agent.name}
        </h3>
        <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: color }}>
          {agent.domain}
        </p>
      </div>

      <p className="mt-4 mb-6 text-sm text-[var(--text-muted)] leading-relaxed line-clamp-2 h-10">
        {agent.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-6 rounded-full border-2 border-[var(--bg-card)] bg-[var(--bg-subtle)]" />
          ))}
          <div className="h-6 px-2 rounded-full border-2 border-[var(--bg-card)] bg-[var(--bg-subtle)] text-[10px] flex items-center justify-center font-medium">
            +12
          </div>
        </div>
        <a
          href="#chat"
          className="rounded-full bg-[var(--bg-subtle)] px-4 py-1.5 text-xs font-semibold text-[var(--text)] hover:bg-[var(--accent)] hover:text-white transition-all"
        >
          Chat Now
        </a>
      </div>
    </div>
  );
}
