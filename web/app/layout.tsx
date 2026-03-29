import type { Metadata } from "next";
import "./globals.css";
import { CursorGlow } from "@/components/cursor-glow";
import { AuthSessionProvider } from "@/components/session-provider";

export const metadata: Metadata = {
  title: "Signet — Verified Human Agents",
  description:
    "Deploy World ID-verified AI agents that earn via x402 micropayments, all over XMTP.",
  openGraph: {
    title: "Signet — Verified Human Agents",
    description:
      "Deploy World ID-verified AI agents that earn via x402 micropayments.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthSessionProvider>
          <CursorGlow />
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
