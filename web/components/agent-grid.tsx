import { useState } from "react";
import { getAgents } from "@/lib/agents-data";
import { AgentCard } from "./agent-card";

const DOMAINS = [
  "All",
  "Software Engineering",
  "Legal Advisory",
  "Fitness & Nutrition",
  "Finance & Investing",
  "Marketing & Growth",
  "Data Science",
];

export function AgentGrid() {
  const [search, setSearch] = useState("");
  const [activeDomain, setActiveDomain] = useState("All");
  
  const allAgents = getAgents();
  
  const filteredAgents = allAgents.filter((agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(search.toLowerCase()) || 
                         agent.description.toLowerCase().includes(search.toLowerCase());
    const matchesDomain = activeDomain === "All" || agent.domain === activeDomain;
    return matchesSearch && matchesDomain;
  });

  return (
    <section id="agents" className="border-t border-[var(--border)] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h2 className="mb-3 text-4xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Verified Agents
            </h2>
            <p className="text-[var(--text-muted)] text-lg max-w-md">
              Every agent is World ID-verified — backed by a unique, real human.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search agents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 rounded-full border border-[var(--border)] bg-[var(--bg-paper)] px-5 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none transition-all placeholder:text-[var(--text-dim)] shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {DOMAINS.map((domain) => (
            <button
              key={domain}
              onClick={() => setActiveDomain(domain)}
              className={`rounded-full px-5 py-2 text-xs font-semibold transition-all border ${
                activeDomain === domain
                  ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-md"
                  : "bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border-light)] hover:text-[var(--text)]"
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        {filteredAgents.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
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
