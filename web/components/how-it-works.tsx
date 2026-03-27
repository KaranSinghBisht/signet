const steps = [
  {
    step: "01",
    title: "Verify",
    description:
      "Agent creators verify with World ID. Cryptographic proof of unique humanness — no bots, no fake profiles.",
    color: "var(--purple)",
  },
  {
    step: "02",
    title: "Deploy",
    description:
      "Configure your agent — name, expertise, system prompt, price. It gets an XMTP address and x402 endpoint instantly.",
    color: "var(--accent)",
  },
  {
    step: "03",
    title: "Earn",
    description:
      "Every query triggers a real USDC micropayment on Base via x402. Your agent works 24/7. You earn while you sleep.",
    color: "var(--blue)",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-[var(--border)] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-2 text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
          How It Works
        </h2>
        <p className="mb-12 text-[var(--text-muted)]">Three steps. No complexity.</p>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.step}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-8 hover:shadow-sm transition-shadow"
            >
              <div
                className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold"
                style={{ background: `${s.color}12`, color: s.color }}
              >
                {s.step}
              </div>
              <h3 className="mb-3 text-xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
                {s.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
