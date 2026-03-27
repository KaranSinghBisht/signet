"use client";

import { useState } from "react";

const EXPERTISE_OPTIONS = [
  "Software Engineering",
  "Legal Advisory",
  "Fitness & Nutrition",
  "Finance & Investing",
  "Marketing & Growth",
  "Data Science",
  "Other",
];

export function DeployAgentForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState(EXPERTISE_OPTIONS[0]);
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[var(--success)] bg-[var(--success-light)] p-8 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success)] text-white shadow-lg">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mb-3 text-2xl font-bold text-[var(--success)]" style={{ fontFamily: "var(--font-heading)" }}>
          Agent Deployed Successfully!
        </h3>
        <p className="mb-6 text-[var(--text-muted)] max-w-sm mx-auto">
          <strong className="text-[var(--text)]">{name}</strong> is now live on XMTP. Users can start chatting and pay via x402 instantly.
        </p>
        <div className="rounded-xl bg-white border border-[var(--border)] p-4 flex flex-col items-center gap-2 mb-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)]">Agent XMTP Address</span>
          <code className="text-xs font-mono break-all text-[var(--accent)] font-semibold">
            {process.env.NEXT_PUBLIC_XMTP_AGENT_ADDRESS}
          </code>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
        >
          Deploy another agent →
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-10 flex items-center justify-between gap-2 px-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 flex flex-col gap-2">
            <div className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`} />
            <span className={`text-[10px] font-bold uppercase tracking-tighter ${step >= i ? "text-[var(--accent)]" : "text-[var(--text-dim)]"}`}>
              Step {i}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Identity & Domain</h3>
              <p className="text-sm text-[var(--text-muted)]">Choose a name and category for your agent.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Agent Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. CodeSage"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-paper)] px-4 py-3 text-sm focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-light)] focus:outline-none transition-all placeholder:text-[var(--text-dim)]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Expertise</label>
                <div className="grid grid-cols-2 gap-2">
                  {EXPERTISE_OPTIONS.filter(o => o !== "Other").map((opt) => (
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
            </div>
            <button
              type="button"
              disabled={!name}
              onClick={nextStep}
              className="w-full rounded-full bg-[var(--text)] px-6 py-4 text-sm font-bold text-white hover:bg-[var(--accent)] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Description</h3>
              <p className="text-sm text-[var(--text-muted)]">Tell users what your agent can help them with.</p>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Short Description</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your agent's capabilities..."
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-paper)] px-4 py-3 text-sm focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-light)] focus:outline-none transition-all placeholder:text-[var(--text-dim)] resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 rounded-full border border-[var(--border)] px-6 py-4 text-sm font-bold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] transition-all"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!description}
                onClick={nextStep}
                className="flex-[2] rounded-full bg-[var(--text)] px-6 py-4 text-sm font-bold text-white hover:bg-[var(--accent)] transition-all disabled:opacity-50 shadow-md"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>AI Configuration</h3>
              <p className="text-sm text-[var(--text-muted)]">Define the system prompt and instructions for your agent.</p>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">System Prompt</label>
              <textarea
                required
                rows={6}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="You are a senior engineer... Be concise..."
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-paper)] px-4 py-3 text-sm focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-light)] focus:outline-none transition-all placeholder:text-[var(--text-dim)] resize-none font-mono"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 rounded-full border border-[var(--border)] px-6 py-4 text-sm font-bold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!systemPrompt}
                className="flex-[2] rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-bold text-white hover:opacity-90 transition-all shadow-lg active:scale-95"
              >
                Deploy Agent — $0.001/query
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
