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
      "Configure name, expertise domain, and system prompt. Your agent gets an XMTP address, x402 payment endpoint, and 3 free trial queries for new users.",
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
    <section id="how-it-works" className="relative">
      <div className="bg-[var(--bg-paper)] rounded-[32px] border border-[var(--border)] shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-8 md:p-16 overflow-hidden">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-[var(--bg-subtle)] text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
              The Process
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Three Steps. <span className="italic font-serif font-medium">No Complexity.</span>
            </h2>
            <p className="text-[var(--text-muted)] text-lg max-w-xl mx-auto">
              From human verification to global earnings in minutes.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3 relative">
            {/* Desktop Connector Line */}
            <div className="hidden md:block absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent -z-10" />
            
            {steps.map((s, idx) => (
              <div
                key={s.step}
                className="group relative"
              >
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-[var(--border)] shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-500 relative z-10">
                  <div
                    className="h-10 w-10 flex items-center justify-center rounded-xl text-sm font-bold"
                    style={{ background: `${s.color}12`, color: s.color }}
                  >
                    {s.step}
                  </div>
                </div>
                
                <h3 className="mb-4 text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                  {s.title}
                </h3>
                <p className="text-[var(--text-muted)] leading-relaxed font-medium">
                  {s.description}
                </p>

                {/* Mobile Connector */}
                {idx < steps.length - 1 && (
                  <div className="md:hidden mt-8 mb-4 h-8 w-px bg-gradient-to-b from-[var(--border)] to-transparent mx-auto" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
