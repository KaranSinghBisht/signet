"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { AgentListItem } from "@signet/shared";
import { AgentGrid } from "@/components/agent-grid";
import { DeployAgentForm } from "@/components/deploy-agent-form";
import { ConnectWallet } from "@/components/connect-wallet";
import { WorldIDButton } from "@/components/world-id-button";
import { TwitterAuthButton } from "@/components/twitter-auth-button";
import { ArrowUpRight } from "lucide-react";

const AgentChat = dynamic(() => import("@/components/agent-chat"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] rounded-xl border border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-center text-sm text-[var(--text-muted)]">
      Loading chat...
    </div>
  ),
});

export default function AppPage() {
  const [nullifier, setNullifier] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [twitterName, setTwitterName] = useState("");
  const [twitterKnownFor, setTwitterKnownFor] = useState("");
  const [walletAddress, setWalletAddress] = useState<`0x${string}` | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<{ id: string; name: string; domain: string } | null>(null);
  const [selectedAgentVoice, setSelectedAgentVoice] = useState(false);
  const [deployedAgents, setDeployedAgents] = useState<(AgentListItem & { deployedBy: string })[]>([]);

  const handleDeployed = (agent: AgentListItem & { deployedBy: string }) => {
    setDeployedAgents((prev) => [...prev, agent]);
    setTimeout(() => {
      document.getElementById("agents")?.scrollIntoView({ behavior: "smooth" });
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] selection:bg-[var(--accent)] selection:text-white pb-24">
      {/* App Navbar — same style as hero */}
      <nav className="fixed top-8 left-0 right-0 z-50 mx-auto flex items-center justify-between w-full max-w-5xl px-6 py-3 bg-white/90 backdrop-blur-md rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm tracking-tighter">
            S
          </div>
          <span className="font-bold text-lg tracking-tight">Signet</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-[13px] font-medium tracking-wide uppercase text-neutral-500">
          {[
            { label: "Agents", href: "#agents" },
            { label: "Chat", href: "#chat" },
            { label: "Deploy", href: "#deploy" },
          ].map((item) => (
            <a key={item.href} href={item.href} className="hover:text-black transition-colors duration-300">
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="#deploy"
          className="flex items-center gap-2 bg-[#222] text-white px-5 py-2.5 rounded-full text-[13px] font-semibold hover:bg-black transition-all group active:scale-95 shadow-lg shadow-black/10"
        >
          Deploy Agent
          <div className="bg-white/10 p-1 rounded-full group-hover:rotate-45 transition-transform duration-300">
            <ArrowUpRight size={14} className="text-white" />
          </div>
        </a>
      </nav>

      <div className="px-6 space-y-24 max-w-7xl mx-auto pt-32">
        {/* Agents Section */}
        <section id="agents" className="relative group">
          <div className="absolute inset-0 bg-white/40 blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="bg-[var(--bg-paper)] rounded-[32px] border border-[var(--border)] shadow-[0_8px_32px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
            <AgentGrid
              onSelect={(id, voiceEnabled, name, domain) => {
                setSelectedAgent({ id, name: name ?? id, domain: domain ?? "" });
                setSelectedAgentVoice(voiceEnabled ?? false);
                document.getElementById("chat")?.scrollIntoView({ behavior: "smooth" });
              }}
              extraAgents={deployedAgents}
            />
          </div>
        </section>

        {/* Chat Section */}
        <section id="chat" className="relative">
          <div className="bg-[var(--bg-paper)] rounded-[32px] border border-[var(--border)] shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-8 md:p-16 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-light)] rounded-full blur-[100px] -mr-32 -mt-32 opacity-50" />

            <div className="mx-auto max-w-3xl relative z-10">
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-1 rounded-full bg-[var(--accent-light)] text-[var(--accent)] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                  Interactive Terminal
                </span>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                  Chat with <span className="italic font-serif font-medium">Verified</span> Agents
                </h2>
                <p className="text-[var(--text-muted)] text-lg max-w-xl mx-auto">
                  Connect your wallet, send{" "}
                  <code className="text-xs bg-[var(--bg-subtle)] px-1.5 py-0.5 rounded font-mono">/ask</code>{" "}
                  commands, and pay seamlessly via x402.
                </p>
              </div>

              {!walletAddress ? (
                <div className="flex flex-col items-center gap-8 py-20 rounded-2xl border-2 border-dashed border-[var(--border)] bg-white/50 backdrop-blur-sm group hover:border-[var(--accent)] transition-colors duration-500">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[var(--bg-subtle)] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                      <div className="w-8 h-8 rounded-full border-2 border-[var(--text-dim)] border-t-[var(--accent)] animate-spin" />
                    </div>
                    <p className="text-lg font-bold mb-2">Connect your wallet to begin</p>
                    <p className="text-sm text-[var(--text-dim)]">Used for XMTP identity and x402 payments</p>
                  </div>
                  <ConnectWallet onConnected={setWalletAddress} />
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-[var(--border)] shadow-xl overflow-hidden">
                  <AgentChat
                    walletAddress={walletAddress}
                    selectedAgent={selectedAgent}
                    voiceEnabled={selectedAgentVoice}
                    onClearAgent={() => setSelectedAgent(null)}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Deploy Section */}
        <section id="deploy" className="relative">
          <div className="bg-[#111] text-white rounded-[32px] border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.2)] p-8 md:p-16 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-emerald-500/10 opacity-50" />

            <div className="mx-auto max-w-xl relative z-10">
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                  Creator Protocol
                </span>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                  Deploy Your <span className="italic font-serif font-medium">Digital</span> Twin
                </h2>
                <p className="text-white/60 text-lg">
                  Verify once with World ID. Deploy an agent with a custom prompt. Earn $0.001 per query, 24/7.
                </p>
              </div>

              {/* Step indicators */}
              <div className="flex items-center gap-3 mb-10 justify-center">
                {[
                  { n: 1, label: "World ID", done: !!nullifier },
                  { n: 2, label: "Twitter", done: !!twitterHandle },
                  { n: 3, label: "Deploy", done: false },
                ].map((s, i) => (
                  <div key={s.n} className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${s.done ? "bg-emerald-500 text-white" : i === [!!nullifier, !!twitterHandle].filter(Boolean).length ? "bg-white text-black" : "bg-white/10 text-white/30"}`}>
                        {s.done ? "✓" : s.n}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${s.done ? "text-emerald-400" : "text-white/30"}`}>{s.label}</span>
                    </div>
                    {i < 2 && <div className={`h-px w-8 mb-4 transition-all ${s.done ? "bg-emerald-500" : "bg-white/10"}`} />}
                  </div>
                ))}
              </div>

              {!nullifier ? (
                <div className="flex flex-col items-center gap-8 py-16 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 group hover:border-white/30 transition-colors duration-500">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-white">
                        <path d="M16 4L4 10V22L16 28L28 22V10L16 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 12V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 16H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-lg font-bold mb-2">Step 1: Prove you&apos;re human</p>
                    <p className="text-white/40 text-sm">One unique person, one agent. No bot farms.</p>
                  </div>
                  <WorldIDButton onVerified={(n) => setNullifier(n)} />
                </div>
              ) : !twitterHandle ? (
                <div className="flex flex-col items-center gap-8 py-16 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 group hover:border-white/30 transition-colors duration-500">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                      <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </div>
                    <p className="text-lg font-bold mb-2">Step 2: Claim your identity</p>
                    <p className="text-white/40 text-sm">Connect X/Twitter to prove who you are.</p>
                  </div>
                  <TwitterAuthButton
                    onAuthenticated={(handle, name, _avatar, knownFor) => {
                      setTwitterHandle(handle);
                      setTwitterName(name);
                      if (knownFor) setTwitterKnownFor(knownFor);
                    }}
                  />
                </div>
              ) : (
                <div className="bg-white text-black rounded-2xl p-8 shadow-2xl">
                  <DeployAgentForm
                    verifiedBy={nullifier}
                    twitterHandle={twitterHandle}
                    twitterName={twitterName}
                    knownFor={twitterKnownFor}
                    onDeployed={handleDeployed}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
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
