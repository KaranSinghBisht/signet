import { NextResponse } from "next/server";

// Server-to-server URL (not exposed to the browser)
const SERVER_URL =
  process.env.SERVER_URL ??
  process.env.NEXT_PUBLIC_SERVER_URL ??
  "http://localhost:3001";

const DEPLOY_SECRET = process.env.DEPLOY_SECRET;

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (DEPLOY_SECRET) {
    headers["Authorization"] = `Bearer ${DEPLOY_SECRET}`;
  }

  let res: Response;
  try {
    res = await fetch(`${SERVER_URL}/agents`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json({ error: "Agent server unavailable" }, { status: 503 });
  }

  const data = await res.json().catch(() => ({ error: "Invalid server response" }));
  return NextResponse.json(data, { status: res.status });
}
