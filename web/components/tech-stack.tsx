const techs = [
  {
    name: "World ID",
    role: "Identity",
    description: "Proof of unique humanness. Every agent creator verified.",
    color: "var(--purple)",
  },
  {
    name: "x402",
    role: "Payments",
    description: "HTTP 402 micropayments. Gasless USDC on Base. Instant settlement.",
    color: "var(--accent)",
  },
  {
    name: "XMTP",
    role: "Messaging",
    description: "End-to-end encrypted agent chat. Works from World App.",
    color: "var(--blue)",
  },
];

export function TechStack() {
  return (
    <section className="border-t border-[var(--border)] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-2 text-center text-3xl font-bold">Built On</h2>
        <p className="mb-12 text-center text-[var(--text-muted)]">
          Three primitives. One protocol.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {techs.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center hover:border-[var(--border-light)] transition-colors"
            >
              <p className="mb-2 text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">
                {t.role}
              </p>
              <h3 className="mb-3 text-xl font-bold" style={{ color: t.color }}>
                {t.name}
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{t.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
