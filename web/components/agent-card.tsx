import type { AgentListItem } from "@signet/shared";

const domainColors: Record<string, string> = {
  "Software Engineering": "var(--blue)",
  "Legal Advisory": "var(--purple)",
  "Fitness & Nutrition": "var(--success)",
  "Finance & Investing": "var(--accent)",
  "Marketing & Growth": "var(--pink)",
  "Data Science": "var(--cyan)",
};

export function AgentCard({ agent, onSelect, isNew = false }: { agent: AgentListItem; onSelect?: (id: string, voiceEnabled?: boolean, name?: string, domain?: string) => void; isNew?: boolean }) {
  const color = domainColors[agent.domain] || "var(--accent)";

  return (
    <div className="group relative flex flex-col rounded-2xl border border-[var(--border)] bg-white p-8 hover:border-[var(--accent)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 overflow-hidden">
      {/* Accent corner */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[var(--bg-subtle)] to-transparent rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700 opacity-20" />
      
      <div className="mb-6 flex items-start justify-between relative z-10">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold shadow-sm ring-1 ring-inset transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
          style={{
            background: `${color}10`,
            color: color,
            boxShadow: `0 0 0 1px ${color}20`,
          }}
        >
          {agent.name.slice(0, 1).toUpperCase()}
        </div>
        <div className="flex flex-col items-end gap-2">
          {isNew && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent)] px-3 py-1 text-[10px] font-bold text-white shadow-lg shadow-[var(--accent-light)] animate-pulse">
              NEW
            </span>
          )}
          {agent.voiceEnabled && (
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold" style={{ background: "rgba(139,92,246,0.08)", color: "#7c3aed", border: "1px solid rgba(139,92,246,0.2)" }}>
              🎙️ Voice
            </span>
          )}
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest">
              {agent.priceUsd} / Query
            </span>
            <span className="text-[9px] text-[var(--text-dim)] font-mono uppercase tracking-tighter">
              Settled on Base
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-1 mb-4 relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
          <p className="text-[10px] font-bold tracking-widest uppercase text-[var(--text-muted)]">
            {agent.domain}
          </p>
        </div>
        <h3 className="text-2xl font-bold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)] transition-colors leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
          {agent.name}
        </h3>
      </div>

      <p className="mb-8 text-sm text-[var(--text-muted)] leading-relaxed font-medium line-clamp-3 h-15 relative z-10">
        {agent.description}
      </p>

      <div className="mt-auto flex items-center justify-between pt-6 border-t border-[var(--border)] relative z-10">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-[var(--text-dim)] uppercase tracking-widest mb-1">
            Agent ID
          </span>
          <span
            className="text-[10px] text-[var(--text-muted)] font-mono truncate max-w-[100px]"
            title={agent.id}
          >
            {agent.id.slice(0, 8)}...
          </span>
        </div>
        <button
          onClick={() => onSelect?.(agent.id, agent.voiceEnabled, agent.name, agent.domain)}
          className="relative group/btn overflow-hidden rounded-xl bg-black px-6 py-3 text-xs font-bold text-white hover:bg-[var(--accent)] transition-all shadow-xl active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-2">
            Chat Now
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </button>
      </div>
      
      {/* Bottom line accent */}
      <div className="absolute bottom-0 left-0 w-0 h-1 group-hover:w-full transition-all duration-700" style={{ backgroundColor: color }} />
    </div>
  );
}
