import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<Response> {
  const { action } = await request.json();
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
