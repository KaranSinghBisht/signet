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
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState(EXPERTISE_OPTIONS[0]);
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-[var(--success)] bg-[var(--success-light)] p-6 text-center">
        <h3 className="mb-2 text-lg font-bold text-[var(--success)]">
          Agent Deployed!
        </h3>
        <p className="mb-4 text-sm text-[var(--text-muted)]">
          <strong className="text-[var(--text)]">{name}</strong> is now live on XMTP. Users can chat with your agent and pay per query via x402.
        </p>
        <p className="font-mono text-xs text-[var(--text-dim)]">
          XMTP: {process.env.NEXT_PUBLIC_XMTP_AGENT_ADDRESS}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Agent Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. CodeSage"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none placeholder:text-[var(--text-dim)]"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Expertise</label>
        <select
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none"
        >
          {EXPERTISE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <input
          type="text"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What does your agent do?"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none placeholder:text-[var(--text-dim)]"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">System Prompt</label>
        <textarea
          required
          rows={4}
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="Instructions for your AI agent..."
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none resize-none placeholder:text-[var(--text-dim)]"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-black hover:bg-[var(--accent-hover)] transition-colors"
      >
        Deploy Agent — $0.001/query via x402
      </button>
    </form>
  );
}
