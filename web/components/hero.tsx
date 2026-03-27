"use client";

import { useState } from "react";
import { XMTP_CHAT_URL } from "@/lib/agents-data";
import { WorldIDButton } from "./world-id-button";

interface HeroProps {
  onVerified: () => void;
}

export function Hero({ onVerified: notifyParent }: HeroProps) {
  const [verified, setVerified] = useState(false);

  return (
    <section className="px-6 py-20 text-center">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 inline-block rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]">
          Built with World ID + x402 + XMTP
        </div>
        <h1 className="mb-4 text-5xl font-bold tracking-tight leading-tight">
          Verified Human Agents,
          <br />
          <span className="text-[var(--accent)]">Always On</span>
        </h1>
        <p className="mb-8 text-lg text-[var(--muted)] leading-relaxed max-w-2xl mx-auto">
          A marketplace where World ID-verified humans deploy AI agents as their
          24/7 paid representatives. Chat via XMTP. Pay per query via x402
          micropayments.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <WorldIDButton onVerified={() => { setVerified(true); notifyParent(); }} />
          {verified && (
            <a
              href={XMTP_CHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-[var(--border)] px-6 py-3 text-sm font-medium hover:bg-[var(--border)] transition-colors"
            >
              Chat with Agents on XMTP
            </a>
          )}
        </div>
        {verified && (
          <p className="mt-4 text-sm text-[var(--success)]">
            You&apos;re verified! Browse agents below or deploy your own.
          </p>
        )}
      </div>
    </section>
  );
}
