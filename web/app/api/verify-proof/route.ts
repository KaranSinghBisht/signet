import { NextResponse } from "next/server";

const APP_ID = process.env.NEXT_PUBLIC_WORLD_APP_ID || process.env.WORLD_APP_ID || "";

// v2 verify always uses the production developer portal
// The staging simulator still works — the `environment` field in the widget controls proof generation
const VERIFY_URL = "https://developer.world.org/api/v2/verify";

export async function POST(request: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!APP_ID) {
    return NextResponse.json({ error: "App ID not configured" }, { status: 500 });
  }

  // IDKit v4 result has responses[] array — extract the first response for v2 format
  const responses = body.responses as { nullifier?: string; merkle_root?: string; proof?: string; identifier?: string }[] | undefined;
  const action = body.action as string | undefined;

  let verifyPayload: Record<string, unknown>;

  if (responses && responses.length > 0) {
    // v4 IDKit result → convert to v2 flat format
    const r = responses[0];
    verifyPayload = {
      merkle_root: r.merkle_root,
      nullifier_hash: r.nullifier,
      proof: r.proof,
      verification_level: r.identifier || "device",
      action: action || "verify-agent-creator",
    };
  } else {
    // Already flat format
    verifyPayload = {
      merkle_root: body.merkle_root,
      nullifier_hash: body.nullifier_hash,
      proof: body.proof,
      verification_level: body.verification_level || "device",
      action: action || "verify-agent-creator",
    };
  }

  if (!verifyPayload.merkle_root || !verifyPayload.nullifier_hash || !verifyPayload.proof) {
    return NextResponse.json({ error: "Missing proof fields" }, { status: 400 });
  }

  let response: Response;
  try {
    response = await fetch(`${VERIFY_URL}/${encodeURIComponent(APP_ID)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(verifyPayload),
    });
  } catch {
    return NextResponse.json(
      { error: "World ID verification service unavailable" },
      { status: 503 },
    );
  }

  const responseText = await response.text().catch(() => "");

  if (!response.ok) {
    console.error("[verify-proof] World ID error:", response.status, responseText);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 400 },
    );
  }

  let payload: unknown;
  try {
    payload = JSON.parse(responseText);
  } catch {
    return NextResponse.json({ error: "Invalid response from World ID" }, { status: 502 });
  }

  return NextResponse.json(payload);
}
