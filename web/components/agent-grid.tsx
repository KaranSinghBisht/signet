import { getAgents } from "@/lib/agents-data";
import { AgentCard } from "./agent-card";

export function AgentGrid() {
  const agents = getAgents();

  return (
    <section id="agents" className="border-t border-[var(--border)] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-2 text-3xl font-bold">Verified Agents</h2>
        <p className="mb-8 text-[var(--text-muted)]">
          Every agent is World ID-verified — backed by a unique, real human.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </section>
  );
}
