import { NextResponse } from "next/server";

const MURF_API_KEY = process.env.MURF_API_KEY;
const MURF_VOICE_ID = "en-US-natalie";
const MAX_TEXT_LENGTH = 5000;

export async function POST(request: Request): Promise<Response> {
  let body: { text?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { text } = body;
  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json(
      { error: `Text too long (max ${MAX_TEXT_LENGTH} characters)` },
      { status: 400 },
    );
  }

  if (!MURF_API_KEY) {
    return NextResponse.json({ fallback: true });
  }

  try {
    const res = await fetch("https://api.murf.ai/v1/speech/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": MURF_API_KEY,
      },
      body: JSON.stringify({
        voiceId: MURF_VOICE_ID,
        style: "Conversational",
        text: text.slice(0, 3000),
        format: "MP3",
        sampleRate: 24000,
        channelType: "MONO",
        modelVersion: "GEN2",
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ fallback: true });
    }

    const data = (await res.json()) as { audioFile?: string };
    if (!data.audioFile) {
      return NextResponse.json({ fallback: true });
    }

    return NextResponse.json({ audioUrl: data.audioFile });
  } catch {
    return NextResponse.json({ fallback: true });
  }
}
