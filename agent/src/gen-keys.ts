import { randomBytes } from "crypto";
import { generatePrivateKey } from "viem/accounts";

const walletKey = generatePrivateKey();
const dbEncryptionKey = randomBytes(32).toString("hex");

process.stdout.write(`XMTP_WALLET_KEY=${walletKey}\n`);
process.stdout.write(`XMTP_DB_ENCRYPTION_KEY=${dbEncryptionKey}\n`);
