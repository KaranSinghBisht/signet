"use client";

import { useState, useEffect } from "react";
import { getAgents } from "@/lib/agents-data";
import { AgentCard } from "./agent-card";
import type { AgentListItem } from "@signet/shared";

type AgentWithMeta = AgentListItem & { deployedBy?: string };

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

const DOMAINS = [
  "All",
  "Software Engineering",
  "Legal Advisory",
  "Fitness & Nutrition",
  "Finance & Investing",
  "Marketing & Growth",
  "Data Science",
];

interface AgentGridProps {
  onSelect?: (id: string, voiceEnabled?: boolean, name?: string, domain?: string) => void;
  extraAgents?: AgentWithMeta[];
}

export function AgentGrid({ onSelect, extraAgents = [] }: AgentGridProps) {
  const [search, setSearch] = useState("");
  const [activeDomain, setActiveDomain] = useState("All");
  const [serverAgents, setServerAgents] = useState<AgentWithMeta[]>([]);

  useEffect(() => {
    fetch(`${SERVER_URL}/agents`)
      .then((r) => r.json())
      .then((data: { agents: AgentWithMeta[] }) => setServerAgents(data.agents ?? []))
      .catch(() => {});
  }, [extraAgents]);

  const baseAgents: AgentWithMeta[] = serverAgents.length > 0 ? serverAgents : (getAgents() as AgentWithMeta[]);
  const extraIds = new Set(baseAgents.map((a) => a.id));
  const merged = [
    ...baseAgents,
    ...extraAgents.filter((a) => !extraIds.has(a.id)),
  ];

  const filtered = merged.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.description.toLowerCase().includes(search.toLowerCase());
    const matchesDomain = activeDomain === "All" || agent.domain === activeDomain;
    return matchesSearch && matchesDomain;
  });

  return (
    <section id="agents" className="px-8 md:px-12 py-16 md:py-24 bg-[var(--bg-paper)]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-[var(--accent-light)] text-[var(--accent)] text-[10px] font-bold uppercase tracking-[0.2em]">
              Marketplace
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Verified <span className="italic font-serif font-medium">Agents</span>
            </h2>
            <p className="text-[var(--text-muted)] text-lg max-w-md">
              Every agent is World ID-verified — backed by a unique, real human.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group w-full sm:w-80">
              <input
                type="text"
                placeholder="Search by expertise..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-6 py-4 text-sm focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-light)] focus:outline-none transition-all placeholder:text-[var(--text-dim)] shadow-sm group-hover:shadow-md"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-dim)] group-hover:text-[var(--accent)] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-12">
          {DOMAINS.map((domain) => (
            <button
              key={domain}
              onClick={() => setActiveDomain(domain)}
              className={`rounded-xl px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all border ${
                activeDomain === domain
                  ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-[0_10px_20px_rgba(109,40,217,0.2)]"
                  : "bg-white text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border-light)] hover:text-[var(--text)] hover:shadow-sm"
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onSelect={onSelect}
                isNew={!!agent.deployedBy}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-card)]">
            <p className="text-[var(--text-muted)] font-medium">No agents found matching your criteria.</p>
            <button
              onClick={() => { setSearch(""); setActiveDomain("All"); }}
              className="mt-4 text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
