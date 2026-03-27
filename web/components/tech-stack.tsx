const techs = [
  {
    name: "World ID",
    role: "Identity",
    description: "Proof of unique humanness via AgentKit on-chain registration",
  },
  {
    name: "x402",
    role: "Payments",
    description: "HTTP 402 micropayments — gasless USDC, instant settlement",
  },
  {
    name: "XMTP",
    role: "Messaging",
    description: "End-to-end encrypted agent chat, reachable from World App",
  },
];

export function TechStack() {
  return (
    <section className="border-t border-[var(--border)] px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-8 text-center text-2xl font-bold">Built On</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {techs.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-[var(--border)] p-6 text-center"
            >
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                {t.role}
              </p>
              <h3 className="mb-2 text-lg font-bold">{t.name}</h3>
              <p className="text-sm text-[var(--muted)]">{t.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
