import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { TechStack } from "@/components/tech-stack";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <Hero />
      <div className="relative z-20 -mt-24 px-6 space-y-24 max-w-7xl mx-auto pb-24">
        <HowItWorks />
        <TechStack />
      </div>
      <footer className="px-6 py-24 text-center">
        <div className="max-w-xl mx-auto border-t border-[var(--border)] pt-12">
          <div className="h-10 w-10 bg-black rounded-xl flex items-center justify-center text-white font-bold text-sm tracking-tighter mx-auto mb-6">
            S
          </div>
          <p className="text-sm font-semibold tracking-wider uppercase mb-2">Signet</p>
          <p className="text-xs text-[var(--text-dim)]">
            AgentKit Hackathon 2026 — Built at the World × Coinbase × XMTP Hackathon
          </p>
        </div>
      </footer>
    </main>
  );
}
