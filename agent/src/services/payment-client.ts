import { x402Client, wrapFetchWithPayment } from "@x402/fetch";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";
import { config } from "../config.js";

const account = privateKeyToAccount(config.walletKey as `0x${string}`);

const client = new x402Client();
registerExactEvmScheme(client, { signer: account });

export const paymentFetch = wrapFetchWithPayment(fetch, client);
