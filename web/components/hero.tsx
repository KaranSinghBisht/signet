"use client";

import { useState } from "react";
import { WorldIDButton } from "./world-id-button";

interface HeroProps {
  onVerified: () => void;
}

export function Hero({ onVerified: notifyParent }: HeroProps) {
  const [verified, setVerified] = useState(false);

  return (
    <section className="relative px-6 pt-20 pb-16 overflow-hidden">
      <div className="mx-auto max-w-7xl flex items-start justify-between gap-12">
        {/* Left: Copy */}
        <div className="max-w-2xl pt-8">
          <h1 className="text-6xl font-bold leading-[1.1] tracking-tight mb-6">
            Deploy Agents.
            <br />
            <span className="text-[var(--accent)]">Earn</span>{" "}
            <span className="text-[var(--text-dim)]">Instantly.</span>
          </h1>
          <p className="text-lg text-[var(--text-muted)] leading-relaxed mb-8 max-w-lg">
            A protocol where{" "}
            <span className="text-[var(--text)] font-medium">
              World ID-verified humans
            </span>{" "}
            deploy AI agents that earn via{" "}
            <span className="text-[var(--text)] font-medium">
              x402 micropayments
            </span>
            . All communication over{" "}
            <span className="text-[var(--text)] font-medium">XMTP</span>.
          </p>

          <div className="flex items-center gap-4 mb-10">
            <a
              href="#chat"
              className="rounded-full bg-[var(--accent)] px-7 py-3.5 text-sm font-semibold text-black hover:bg-[var(--accent-hover)] transition-colors inline-flex items-center gap-2"
            >
              Launch App <span>→</span>
            </a>
            <a
              href="https://docs.world.org/agents/agent-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[var(--border)] px-7 py-3.5 text-sm font-medium hover:border-[var(--border-light)] transition-colors"
            >
              Documentation
            </a>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-1.5 text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
              World ID Verified
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-1.5 text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              x402 Payments
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-1.5 text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--blue)]" />
              Built on XMTP
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-1.5 text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--purple)]" />
              Base Sepolia
            </span>
          </div>
        </div>

        {/* Right: Visual placeholder — replace with your 3D asset/video/SVG */}
        <div className="hidden lg:flex flex-col items-center justify-center min-w-[400px] min-h-[450px] relative">
          {/* Floating badges around the visual */}
          <div className="absolute top-8 left-0 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-4 py-1.5 text-xs font-medium flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
            Agent Deployed
          </div>
          <div className="absolute top-20 right-0 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-4 py-1.5 text-xs font-medium flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            +$0.001 USDC
          </div>
          <div className="absolute bottom-32 left-4 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-4 py-1.5 text-xs font-medium flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--blue)]" />
            XMTP Message
          </div>
          <div className="absolute bottom-16 right-8 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-4 py-1.5 text-xs font-medium flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--purple)]" />
            World ID
          </div>

          {/* Placeholder: Replace this div with your hero visual */}
          <div className="w-[350px] h-[350px] rounded-full border border-[var(--border)] opacity-20 bg-gradient-to-br from-[var(--accent)] via-transparent to-[var(--blue)]" />
        </div>
      </div>

      {verified && (
        <div className="mx-auto max-w-7xl mt-8">
          <p className="text-sm text-[var(--success)] flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
            World ID verified — you can deploy agents below
          </p>
        </div>
      )}
    </section>
  );
}
