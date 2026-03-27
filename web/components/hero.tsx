"use client";

import dynamic from "next/dynamic";

const DottedGlobe = dynamic(
  () => import("./dotted-globe").then((m) => ({ default: m.DottedGlobe })),
  { ssr: false },
);

export function Hero() {
  return (
    <section className="relative px-6 pt-24 pb-20 overflow-hidden">
      <div className="mx-auto max-w-6xl flex items-start justify-between gap-16">
        <div className="max-w-xl pt-4">
          <p className="mb-5 text-sm font-medium text-[var(--accent)] tracking-wide uppercase">
            Verified Agent Protocol
          </p>
          <h1
            className="text-[3.5rem] font-bold leading-[1.08] tracking-tight mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Deploy Agents.
            <br />
            <span className="text-[var(--accent)]">Earn</span>{" "}
            <span className="text-[var(--text-dim)]">Instantly.</span>
          </h1>
          <p className="text-lg leading-relaxed mb-8 text-[var(--text-muted)] max-w-md">
            World ID-verified humans deploy AI agents that earn{" "}
            <span className="text-[var(--text)] font-medium">USDC micropayments</span> via x402.
            All chat over <span className="text-[var(--text)] font-medium">XMTP</span>.
          </p>

          <div className="flex items-center gap-3 mb-10">
            <a
              href="#chat"
              className="rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--accent-hover)] transition-colors"
            >
              Launch App&ensp;→
            </a>
            <a
              href="https://docs.world.org/agents/agent-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-[var(--border)] px-6 py-3 text-sm font-medium text-[var(--text-muted)] hover:border-[var(--border-light)] hover:text-[var(--text)] transition-colors"
            >
              Documentation
            </a>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {[
              { label: "World ID", color: "var(--purple)" },
              { label: "x402 Payments", color: "var(--accent)" },
              { label: "XMTP", color: "var(--blue)" },
              { label: "Base", color: "var(--cyan)" },
            ].map((badge) => (
              <span
                key={badge.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1 text-[11px] tracking-wide text-[var(--text-muted)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: badge.color }} />
                {badge.label}
              </span>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex flex-col items-center justify-center min-w-[400px] min-h-[420px] relative">
          {[
            { label: "Agent Deployed", color: "var(--success)", top: "8%", left: "0" },
            { label: "+$0.001 USDC", color: "var(--accent)", top: "22%", right: "0" },
            { label: "XMTP Message", color: "var(--blue)", bottom: "28%", left: "5%" },
            { label: "World ID", color: "var(--purple)", bottom: "14%", right: "8%" },
          ].map((badge) => (
            <div
              key={badge.label}
              className="absolute rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3.5 py-1.5 text-xs font-medium flex items-center gap-2 shadow-sm"
              style={{
                top: badge.top,
                left: badge.left,
                right: badge.right,
                bottom: badge.bottom,
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: badge.color }} />
              {badge.label}
            </div>
          ))}
          <DottedGlobe />
        </div>
      </div>
    </section>
  );
}
