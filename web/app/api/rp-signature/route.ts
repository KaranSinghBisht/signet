import { NextResponse } from "next/server";

const ALLOWED_ACTIONS = ["verify-agent-creator"];

function isAllowedOrigin(origin: string): boolean {
  const allowed = [
    "http://localhost:3000",
    process.env.NEXTAUTH_URL,
    process.env.NEXT_PUBLIC_ROOT_DOMAIN
      ? `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
      : null,
  ].filter(Boolean) as string[];
  return allowed.some((o) => origin === o || origin.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`));
}

export async function POST(request: Request): Promise<Response> {
  // Restrict to requests originating from our web app
  const origin = request.headers.get("origin") ?? "";
  if (origin && !isAllowedOrigin(origin)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { action?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { action } = body;

  if (!action || !ALLOWED_ACTIONS.includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const signingKey = process.env.WORLD_SIGNING_KEY;

  if (!signingKey) {
    return NextResponse.json({ error: "Signing key not configured" }, { status: 500 });
  }

  const { signRequest } = await import("@worldcoin/idkit/signing");
  const { sig, nonce, createdAt, expiresAt } = signRequest(action, signingKey);

  return NextResponse.json({
    sig,
    nonce,
    created_at: createdAt,
    expires_at: expiresAt,
  });
}
