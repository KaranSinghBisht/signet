import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Signet — Verified Human Agents",
  description:
    "A marketplace where World ID-verified humans deploy AI agents as 24/7 paid representatives. Chat via XMTP. Pay via x402.",
  openGraph: {
    title: "Signet — Verified Human Agents",
    description:
      "World ID verified agents you can chat with and pay per query.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
