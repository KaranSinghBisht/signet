import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b border-[var(--border)] px-6 py-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Signet
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <a
            href="https://docs.world.org/agents/agent-kit"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Docs
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
