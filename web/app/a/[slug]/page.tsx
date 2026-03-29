import type { AgentListItem } from "@signet/shared";
import Link from "next/link";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

const domainColors: Record<string, string> = {
  "Software Engineering": "#3b82f6",
  "Legal Advisory": "#8b5cf6",
  "Fitness & Nutrition": "#10b981",
  "Finance & Investing": "#6d28d9",
  "Marketing & Growth": "#ec4899",
  "Data Science": "#06b6d4",
};

async function getAgent(slug: string): Promise<(AgentListItem & { deployedBy?: string; twitterHandle?: string }) | null> {
  try {
    const res = await fetch(`${SERVER_URL}/agents/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function AgentProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const agent = await getAgent(slug);

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-center space-y-4">
          <div className="text-6xl font-bold text-[var(--text-dim)]">404</div>
          <p className="text-[var(--text-muted)] font-medium">Agent not found</p>
          <Link href="/" className="inline-block mt-4 px-6 py-3 rounded-full bg-black text-white text-sm font-bold hover:bg-[var(--accent)] transition-all">
            Back to Signet
          </Link>
        </div>
      </div>
    );
  }

  const color = domainColors[agent.domain] || "#6d28d9";
  const handle = agent.twitterHandle ?? slug;

  return (
    <main className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center px-6 py-24">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-dim)] uppercase tracking-widest hover:text-[var(--accent)] transition-colors mb-8">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5"/><path d="m12 5-7 7 7 7"/></svg>
            Signet Marketplace
          </Link>
        </div>

        <div className="bg-white rounded-[32px] border border-[var(--border)] shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden">
          {/* Agent hero */}
          <div className="px-8 pt-10 pb-8" style={{ background: `linear-gradient(135deg, ${color}08 0%, transparent 60%)` }}>
            <div className="flex items-start gap-5">
              <div
                className="h-20 w-20 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-sm shrink-0"
                style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
              >
                {agent.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">{agent.domain}</p>
                </div>
                <h1 className="text-2xl font-bold text-[var(--text)] leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                  {agent.name}
                </h1>
                {handle && (
                  <a
                    href={`https://twitter.com/${handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-1 text-xs text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    @{handle}
                  </a>
                )}
              </div>
            </div>

            <p className="mt-6 text-sm text-[var(--text-muted)] leading-relaxed">{agent.description}</p>
          </div>

          {/* Stats bar */}
          <div className="px-8 py-4 border-t border-b border-[var(--border)] bg-[var(--bg-subtle)] flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-dim)]">Price</span>
              <span className="text-sm font-bold text-[var(--accent)]">{agent.priceUsd} / query</span>
            </div>
            <div className="w-px h-8 bg-[var(--border)]" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-dim)]">Network</span>
              <span className="text-xs font-bold text-[var(--text-muted)] font-mono">Base Sepolia</span>
            </div>
            <div className="w-px h-8 bg-[var(--border)]" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-dim)]">Verified</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                World ID
              </span>
            </div>
            {agent.voiceEnabled && (
              <>
                <div className="w-px h-8 bg-[var(--border)]" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-dim)]">Voice</span>
                  <span className="text-xs font-bold text-purple-600">🎙️ Enabled</span>
                </div>
              </>
            )}
          </div>

          {/* CTA */}
          <div className="px-8 py-6">
            <Link
              href={`/?agent=${agent.id}#chat`}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-black text-white px-6 py-4 text-sm font-bold hover:bg-[var(--accent)] transition-all shadow-xl active:scale-95"
            >
              Chat with {agent.name}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <p className="mt-4 text-center text-[10px] text-[var(--text-dim)]">
              Powered by <span className="font-bold">Signet</span> — World ID × XMTP × x402
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
