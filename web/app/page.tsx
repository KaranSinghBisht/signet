"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { AgentGrid } from "@/components/agent-grid";
import { HowItWorks } from "@/components/how-it-works";
import { TechStack } from "@/components/tech-stack";
import { DeployAgentForm } from "@/components/deploy-agent-form";
import { ConnectWallet } from "@/components/connect-wallet";
import { WorldIDButton } from "@/components/world-id-button";

const AgentChat = dynamic(() => import("@/components/agent-chat"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] rounded-xl border border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-center text-sm text-[var(--text-muted)]">
      Loading chat...
    </div>
  ),
});

export default function Home() {
  const [verified, setVerified] = useState(false);
  const [walletAddress, setWalletAddress] = useState<`0x${string}` | null>(null);

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />

      {/* App Section: Chat */}
      <section id="chat" className="border-t border-[var(--border)] px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-2 text-3xl font-bold">Chat with Agents</h2>
          <p className="mb-8 text-[var(--text-muted)]">
            Connect wallet → chat over XMTP → every query settles via x402 on Base.
          </p>
          {!walletAddress ? (
            <div className="flex flex-col items-center gap-6 py-16 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-card)]">
              <div className="text-center">
                <p className="text-sm text-[var(--text-muted)] mb-1">Step 1: Connect your wallet</p>
                <p className="text-xs text-[var(--text-dim)]">Used for XMTP identity and x402 payments</p>
              </div>
              <ConnectWallet onConnected={setWalletAddress} />
            </div>
          ) : (
            <AgentChat walletAddress={walletAddress} />
          )}
        </div>
      </section>

      <AgentGrid />

      {/* Deploy Section */}
      <section id="deploy" className="border-t border-[var(--border)] px-6 py-20">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-2 text-3xl font-bold">Deploy Your Agent</h2>
          <p className="mb-8 text-[var(--text-muted)]">
            Verify with World ID to prove you&apos;re human, then deploy your agent.
          </p>
          {!verified ? (
            <div className="flex flex-col items-center gap-6 py-16 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-card)]">
              <div className="text-center">
                <p className="text-sm text-[var(--text-muted)] mb-1">Verify with World ID to deploy</p>
                <p className="text-xs text-[var(--text-dim)]">One human, one identity, no bot farms</p>
              </div>
              <WorldIDButton onVerified={() => setVerified(true)} />
            </div>
          ) : (
            <DeployAgentForm />
          )}
        </div>
      </section>

      <HowItWorks />
      <TechStack />

      <footer className="border-t border-[var(--border)] px-6 py-10 text-center">
        <p className="text-sm text-[var(--text-dim)]">
          Signet — AgentKit Hackathon 2026
        </p>
        <p className="text-xs text-[var(--text-dim)] mt-1">
          World x Coinbase x XMTP
        </p>
      </footer>
    </main>
  );
}
