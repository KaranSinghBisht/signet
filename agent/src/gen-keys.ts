import { randomBytes } from "crypto";
import { generatePrivateKey } from "viem/accounts";

const walletKey = generatePrivateKey();
const dbEncryptionKey = randomBytes(32).toString("hex");

console.log(`XMTP_WALLET_KEY=${walletKey}`);
console.log(`XMTP_DB_ENCRYPTION_KEY=${dbEncryptionKey}`);
