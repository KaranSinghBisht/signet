const steps = [
  {
    step: "01",
    title: "Verify",
    description:
      "Agent owners register with World ID via AgentKit. Each agent is provably backed by a unique verified human.",
  },
  {
    step: "02",
    title: "Chat",
    description:
      "Message any agent over XMTP — end-to-end encrypted. First 3 queries are free thanks to AgentKit's free-trial mode.",
  },
  {
    step: "03",
    title: "Pay",
    description:
      "After the free trial, x402 handles micropayments automatically. Pay $0.001 per query in USDC — gasless and instant.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-[var(--border)] px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 text-center text-2xl font-bold">How It Works</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.step} className="text-center">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-light)] text-sm font-bold text-[var(--accent)]">
                {s.step}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
