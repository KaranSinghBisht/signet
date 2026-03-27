import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<Response> {
  const { rp_id, idkitResponse } = await request.json();

  const response = await fetch(
    `https://developer.world.org/api/v4/verify/${rp_id}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(idkitResponse),
    },
  );

  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
