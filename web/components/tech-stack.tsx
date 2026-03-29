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
    description: "HTTP 402 micropayments. Gasless USDC on Base. Instant.",
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
    <section className="relative group">
      <div className="bg-[var(--bg-paper)] rounded-[32px] border border-[var(--border)] shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-8 md:p-16 overflow-hidden">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-[var(--bg-subtle)] text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
              Our Stack
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Built On <span className="italic font-serif font-medium">Core Primitives</span>
            </h2>
            <p className="text-[var(--text-muted)] text-lg max-w-xl mx-auto">
              Three pillars. One protocol. The ultimate AI agent substrate.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {techs.map((t) => (
              <div
                key={t.name}
                className="relative group p-8 rounded-2xl border border-[var(--border)] bg-white hover:border-[var(--accent)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-500 overflow-hidden"
              >
                {/* Background accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--bg-subtle)] to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 opacity-20" />
                
                <div className="relative z-10">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-muted)]">
                      {t.role}
                    </span>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                  </div>
                  
                  <h3 className="mb-4 text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                    {t.name}
                  </h3>
                  
                  <p className="text-[var(--text-muted)] leading-relaxed font-medium">
                    {t.description}
                  </p>
                </div>
                
                {/* Bottom line accent */}
                <div className="absolute bottom-0 left-0 w-0 h-1 group-hover:w-full transition-all duration-700" style={{ backgroundColor: t.color }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
