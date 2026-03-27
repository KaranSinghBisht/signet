import "dotenv/config";

function env(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

function required(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

export const config = {
  port: Number(env("PORT", "3001")),
  aiProvider: env("AI_PROVIDER", "groq") as "groq" | "gemini",
  groqApiKey: required("GROQ_API_KEY"),
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  facilitatorUrl: env("FACILITATOR_URL", "https://x402.org/facilitator"),
  paymentNetwork: env("PAYMENT_NETWORK", "eip155:84532"),
  agentWalletAddress: required("AGENT_WALLET_ADDRESS"),
};
