"use client";

import { useState } from "react";
import type { AgentListItem } from "@signet/shared";

const EXPERTISE_OPTIONS = [
  "Software Engineering",
  "Legal Advisory",
  "Fitness & Nutrition",
  "Finance & Investing",
  "Marketing & Growth",
  "Data Science",
];

const STYLE_OPTIONS = [
  {
    id: "direct",
    label: "Direct & Punchy",
    icon: "⚡",
    desc: "Get to the point fast. No fluff.",
    prompt: "Be direct, concise, and punchy. Get to the point immediately. No filler words.",
  },
  {
    id: "thoughtful",
    label: "Thoughtful & Deep",
    icon: "🧠",
    desc: "Explore multiple angles before concluding.",
    prompt: "Be thorough and nuanced. Explore multiple angles. Show your reasoning.",
  },
  {
    id: "technical",
    label: "Technical & Precise",
    icon: "🔬",
    desc: "Correct terminology, no oversimplification.",
    prompt: "Be technically precise. Use correct terminology. Don't oversimplify for the sake of it.",
  },
  {
    id: "warm",
    label: "Warm & Encouraging",
    icon: "🤝",
    desc: "Meet people where they are.",
    prompt: "Be warm, supportive, and encouraging. Meet people where they are. Celebrate progress.",
  },
];

function buildSystemPrompt(name: string, domain: string, bio: string, faq: string, contrarian: string, style: string, avoid: string): string {
  const styleObj = STYLE_OPTIONS.find((s) => s.id === style);
  const stylePrompt = styleObj?.prompt ?? "";
  const avoidSection = avoid.trim()
    ? `\n\nTopics you decline to cover: ${avoid.trim()}`
    : "";
  const faqSection = faq.trim()
    ? `\n\nMost commonly asked question: "${faq.trim()}" — you have deep, specific opinions on this.`
    : "";
  const contrarianSection = contrarian.trim()
    ? `\n\nYour contrarian take: ${contrarian.trim()}`
    : "";
  return `You are ${name}, a verified ${domain} expert with a World ID-verified identity on Signet.\n\nAbout you: ${bio.trim()}${faqSection}${contrarianSection}${avoidSection}\n\n${stylePrompt}\n\nKeep responses under 400 words unless depth is genuinely required. Always answer from your own expertise and documented perspective.`;
}

interface DeployAgentFormProps {
  verifiedBy: string;
  twitterHandle?: string;
  twitterName?: string;
  knownFor?: string;
  onDeployed: (agent: AgentListItem & { deployedBy: string }) => void;
}

export function DeployAgentForm({ verifiedBy, twitterHandle, twitterName, knownFor = "", onDeployed }: DeployAgentFormProps) {
  const [step, setStep] = useState(1);
  const [deployed, setDeployed] = useState<(AgentListItem & { deployedBy: string; twitterHandle?: string }) | null>(null);
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState("");

  // Step 1
  const [name, setName] = useState(twitterName ?? "");
  const [domain, setDomain] = useState(EXPERTISE_OPTIONS[0]);
  const [bio, setBio] = useState(knownFor);

  // Step 2: Interview
  const [faq, setFaq] = useState("");
  const [contrarian, setContrarian] = useState("");

  // Step 3: Style
  const [style, setStyle] = useState("direct");
  const [avoidTopics, setAvoidTopics] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const generatedPrompt = buildSystemPrompt(name, domain, bio, faq, contrarian, style, avoidTopics);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [promptEdited, setPromptEdited] = useState(false);
  const finalPrompt = promptEdited ? systemPrompt : generatedPrompt;

  const handleDeploy = async () => {
    setDeploying(true);
    setError("");
    try {
      const res = await fetch("/api/deploy-agent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          domain,
          description: bio.slice(0, 300),
          systemPrompt: finalPrompt,
          deployedBy: verifiedBy,
          voiceEnabled,
          twitterHandle,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Deploy failed" }));
        throw new Error(err.error || "Deploy failed");
      }
      const agent = await res.json() as AgentListItem & { deployedBy: string; twitterHandle?: string };
      setDeployed(agent);
      onDeployed(agent);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Deploy failed");
    } finally {
      setDeploying(false);
    }
  };

  if (deployed) {
    const profileUrl = `/a/${deployed.twitterHandle ?? deployed.id}`;
    return (
      <div className="rounded-2xl border border-[var(--success)] bg-[var(--success-light)] p-8 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success)] text-white shadow-lg">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mb-3 text-2xl font-bold text-[var(--success)]" style={{ fontFamily: "var(--font-heading)" }}>
          Your agent is live!
        </h3>
        <p className="mb-6 text-[var(--text-muted)] max-w-sm mx-auto">
          <strong className="text-[var(--text)]">{deployed.name}</strong> is now on Signet. Share your profile link to start earning.
        </p>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-5 py-3 text-sm font-bold hover:bg-[var(--accent)] transition-all shadow-md mb-4"
        >
          View Profile →
          <span className="font-mono text-[10px] opacity-60">signet.vercel.app{profileUrl}</span>
        </a>
        <p className="text-xs text-[var(--text-dim)] mt-4">
          Query via XMTP: <code className="font-mono">/ask {deployed.id} your question</code>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Step progress */}
      <div className="mb-10 flex items-center gap-2 px-1">
        {["Identity", "Expertise", "Style", "Review"].map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className="flex flex-col gap-1.5 flex-1">
              <div className={`h-1.5 rounded-full transition-all duration-500 ${step > i + 1 ? "bg-[var(--accent)]" : step === i + 1 ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`} />
              <span className={`text-[10px] font-bold uppercase tracking-tighter ${step >= i + 1 ? "text-[var(--accent)]" : "text-[var(--text-dim)]"}`}>
                {label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Step 1: Identity */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-heading)" }}>Who are you?</h3>
            <p className="text-sm text-[var(--text-muted)]">This becomes your public agent profile.</p>
          </div>

          {twitterHandle && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)]">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-[var(--text-muted)] shrink-0" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="text-sm font-semibold text-[var(--text)]">@{twitterHandle}</span>
              <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Identity verified</span>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Display Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Andrej Karpathy"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-paper)] px-4 py-3 text-sm focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-light)] focus:outline-none transition-all placeholder:text-[var(--text-dim)]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Your Domain</label>
            <div className="grid grid-cols-2 gap-2">
              {EXPERTISE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setDomain(opt)}
                  className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all ${
                    domain === opt
                      ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm"
                      : "bg-[var(--bg-paper)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border-light)]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">What are you known for?</label>
            <textarea
              required
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. AI researcher, ex-Tesla/OpenAI. I teach neural nets from scratch and believe anyone can learn ML with the right intuition..."
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-paper)] px-4 py-3 text-sm focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-light)] focus:outline-none transition-all placeholder:text-[var(--text-dim)] resize-none"
            />
            <p className="mt-1.5 text-[11px] text-[var(--text-dim)]">This becomes the foundation of your agent&apos;s knowledge and persona.</p>
          </div>

          <button
            type="button"
            disabled={!name.trim() || !bio.trim()}
            onClick={() => setStep(2)}
            className="w-full rounded-full bg-[var(--text)] px-6 py-4 text-sm font-bold text-white hover:bg-[var(--accent)] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            Continue →
          </button>
        </div>
      )}

      {/* Step 2: Expertise Interview */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-heading)" }}>Tell us more about your expertise</h3>
            <p className="text-sm text-[var(--text-muted)]">These answers shape your agent&apos;s personality and depth.</p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">What question do people ask you most?</label>
            <textarea
              rows={2}
              value={faq}
              onChange={(e) => setFaq(e.target.value)}
              placeholder="e.g. How do I get started with machine learning? What's the best way to learn transformers?"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-paper)] px-4 py-3 text-sm focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-light)] focus:outline-none transition-all placeholder:text-[var(--text-dim)] resize-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">What&apos;s your contrarian take?</label>
            <textarea
              rows={2}
              value={contrarian}
              onChange={(e) => setContrarian(e.target.value)}
              placeholder="e.g. Most people overcomplicate ML — you don't need a PhD, just start building things from scratch..."
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-paper)] px-4 py-3 text-sm focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-light)] focus:outline-none transition-all placeholder:text-[var(--text-dim)] resize-none"
            />
            <p className="mt-1.5 text-[11px] text-[var(--text-dim)]">What do you believe that most people in your field don&apos;t?</p>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="flex-1 rounded-full border border-[var(--border)] px-6 py-4 text-sm font-bold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] transition-all">
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex-[2] rounded-full bg-[var(--text)] px-6 py-4 text-sm font-bold text-white hover:bg-[var(--accent)] transition-all shadow-md"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Style */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-heading)" }}>How do you communicate?</h3>
            <p className="text-sm text-[var(--text-muted)]">Your agent will match your natural style.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {STYLE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setStyle(opt.id)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  style === opt.id
                    ? "bg-[var(--accent-light)] border-[var(--accent)]"
                    : "bg-[var(--bg-paper)] border-[var(--border)] hover:border-[var(--border-light)]"
                }`}
              >
                <span className="text-xl">{opt.icon}</span>
                <p className={`text-xs font-bold mt-2 mb-1 ${style === opt.id ? "text-[var(--accent)]" : "text-[var(--text)]"}`}>{opt.label}</p>
                <p className="text-[11px] text-[var(--text-dim)]">{opt.desc}</p>
              </button>
            ))}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Topics you won&apos;t cover <span className="font-normal normal-case">(optional)</span></label>
            <textarea
              rows={2}
              value={avoidTopics}
              onChange={(e) => setAvoidTopics(e.target.value)}
              placeholder="e.g. I don't give specific stock picks or medical diagnoses..."
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-paper)] px-4 py-3 text-sm focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-light)] focus:outline-none transition-all placeholder:text-[var(--text-dim)] resize-none"
            />
          </div>

          <button
            type="button"
            onClick={() => setVoiceEnabled((v) => !v)}
            className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
              voiceEnabled
                ? "bg-[var(--accent-light)] border-[var(--accent)] text-[var(--accent)]"
                : "bg-[var(--bg-paper)] border-[var(--border)] text-[var(--text-muted)]"
            }`}
          >
            <span className="flex items-center gap-2">
              {voiceEnabled ? "🎙️" : "🔇"} Voice Responses
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${voiceEnabled ? "text-[var(--accent)]" : "text-[var(--text-dim)]"}`}>
              {voiceEnabled ? "ON" : "OFF"}
            </span>
          </button>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(2)} className="flex-1 rounded-full border border-[var(--border)] px-6 py-4 text-sm font-bold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] transition-all">
              Back
            </button>
            <button
              type="button"
              onClick={() => { setSystemPrompt(generatedPrompt); setStep(4); }}
              className="flex-[2] rounded-full bg-[var(--text)] px-6 py-4 text-sm font-bold text-white hover:bg-[var(--accent)] transition-all shadow-md"
            >
              Preview Agent →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-heading)" }}>Review &amp; Launch</h3>
            <p className="text-sm text-[var(--text-muted)]">Your agent&apos;s system prompt — edit if needed.</p>
          </div>

          <div className="rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-sm font-bold">
                {name.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold">{name}</p>
                <p className="text-[11px] text-[var(--text-muted)]">{domain} · $0.001/query</p>
              </div>
              {twitterHandle && (
                <span className="ml-auto text-[11px] text-[var(--text-dim)] font-mono">@{twitterHandle}</span>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              System Prompt
              <span className="normal-case font-normal text-[11px]">Auto-generated — edit freely</span>
            </label>
            <textarea
              rows={8}
              value={finalPrompt}
              onChange={(e) => { setSystemPrompt(e.target.value); setPromptEdited(true); }}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-paper)] px-4 py-3 text-xs focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-light)] focus:outline-none transition-all resize-none font-mono leading-relaxed"
            />
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(3)} className="flex-1 rounded-full border border-[var(--border)] px-6 py-4 text-sm font-bold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] transition-all">
              Back
            </button>
            <button
              type="button"
              disabled={!finalPrompt.trim() || deploying}
              onClick={handleDeploy}
              className="flex-[2] rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-bold text-white hover:opacity-90 transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {deploying ? "Deploying..." : "Deploy Agent — $0.001/query"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
