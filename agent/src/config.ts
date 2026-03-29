import "dotenv/config";

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

function required(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

const VALID_XMTP_ENVS = ["dev", "production", "local"] as const;

function xmtpEnv(): (typeof VALID_XMTP_ENVS)[number] {
  const val = optional("XMTP_ENV", "dev");
  if (!VALID_XMTP_ENVS.includes(val as typeof VALID_XMTP_ENVS[number])) {
    throw new Error(`Invalid XMTP_ENV: ${val}. Must be one of: ${VALID_XMTP_ENVS.join(", ")}`);
  }
  return val as (typeof VALID_XMTP_ENVS)[number];
}

export const config = {
  xmtpEnv: xmtpEnv(),
  walletKey: required("XMTP_WALLET_KEY"),
  dbEncryptionKey: required("XMTP_DB_ENCRYPTION_KEY"),
  serverUrl: optional("SERVER_URL", "http://localhost:3001"),
};
