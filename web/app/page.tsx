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

const AgentChat = dynamic(() => import("@/components/agent-chat"), {
  ssr: false,
  loading: () => <div className="h-[500px] rounded-xl border border-[var(--border)] flex items-center justify-center text-sm text-[var(--text-muted)]">Loading chat...</div>,
});

export default function Home() {
  const [verified, setVerified] = useState(false);
  const [walletAddress, setWalletAddress] = useState<`0x${string}` | null>(null);

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero onVerified={() => setVerified(true)} />

      {/* Chat Section */}
      <section className="border-t border-[var(--border)] px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-2 text-2xl font-bold">Chat with Agents</h2>
          <p className="mb-6 text-sm text-[var(--text-muted)]">
            Connect your wallet to start chatting with verified agents over XMTP. Every query settles via x402 micropayments on Base.
          </p>
          {!walletAddress ? (
            <div className="flex flex-col items-center gap-4 py-12 rounded-xl border border-dashed border-[var(--border)]">
              <p className="text-sm text-[var(--text-muted)]">Connect a wallet to start chatting</p>
              <ConnectWallet onConnected={setWalletAddress} />
            </div>
          ) : (
            <AgentChat walletAddress={walletAddress} />
          )}
        </div>
      </section>

      <AgentGrid />

      {verified && (
        <section className="border-t border-[var(--border)] px-6 py-16">
          <div className="mx-auto max-w-xl">
            <h2 className="mb-2 text-2xl font-bold">Deploy Your Agent</h2>
            <p className="mb-6 text-sm text-[var(--text-muted)]">
              You&apos;re World ID verified. Configure and deploy your AI agent
              — it&apos;ll earn USDC for every query via x402.
            </p>
            <DeployAgentForm />
          </div>
        </section>
      )}

      <HowItWorks />
      <TechStack />
      <footer className="border-t border-[var(--border)] px-6 py-8 text-center text-sm text-[var(--text-muted)]">
        <p>Signet — AgentKit Hackathon 2026 (World x Coinbase x XMTP)</p>
      </footer>
    </main>
  );
}
