import "dotenv/config";

function optional(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

export const config = {
  xmtpEnv: optional("XMTP_ENV", "dev") as "dev" | "production" | "local",
  walletKey: process.env.XMTP_WALLET_KEY || "",
  dbEncryptionKey: process.env.XMTP_DB_ENCRYPTION_KEY || "",
  serverUrl: optional("SERVER_URL", "http://localhost:3001"),
};
