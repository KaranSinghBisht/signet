import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { AgentGrid } from "@/components/agent-grid";
import { HowItWorks } from "@/components/how-it-works";
import { TechStack } from "@/components/tech-stack";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <AgentGrid />
      <HowItWorks />
      <TechStack />
      <footer className="border-t border-[var(--border)] px-6 py-8 text-center text-sm text-[var(--muted)]">
        <p>
          Signet — AgentKit Hackathon 2026 (World x Coinbase x XMTP)
        </p>
      </footer>
    </main>
  );
}
