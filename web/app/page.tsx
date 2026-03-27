"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { AgentGrid } from "@/components/agent-grid";
import { HowItWorks } from "@/components/how-it-works";
import { TechStack } from "@/components/tech-stack";
import { DeployAgentForm } from "@/components/deploy-agent-form";

export default function Home() {
  const [verified, setVerified] = useState(false);

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero onVerified={() => setVerified(true)} />
      <AgentGrid />
      {verified && (
        <section className="border-t border-[var(--border)] px-6 py-16">
          <div className="mx-auto max-w-xl">
            <h2 className="mb-2 text-2xl font-bold">Deploy Your Agent</h2>
            <p className="mb-6 text-sm text-[var(--muted)]">
              You&apos;re World ID verified. Configure and deploy your AI agent
              — it&apos;ll earn USDC for every query via x402.
            </p>
            <DeployAgentForm />
          </div>
        </section>
      )}
      <HowItWorks />
      <TechStack />
      <footer className="border-t border-[var(--border)] px-6 py-8 text-center text-sm text-[var(--muted)]">
        <p>Signet — AgentKit Hackathon 2026 (World x Coinbase x XMTP)</p>
      </footer>
    </main>
  );
}
