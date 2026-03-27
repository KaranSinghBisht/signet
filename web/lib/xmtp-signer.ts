"use client";

import { IdentifierKind } from "@xmtp/browser-sdk";
import type { Signer } from "@xmtp/browser-sdk";
import { createWalletClient, custom, toBytes } from "viem";
import { mainnet } from "viem/chains";

export function createEoaSigner(address: `0x${string}`): Signer {
  const walletClient = createWalletClient({
    chain: mainnet,
    transport: custom(window.ethereum!),
  });

  return {
    type: "EOA",
    getIdentifier: () => ({
      identifier: address.toLowerCase(),
      identifierKind: IdentifierKind.Ethereum,
    }),
    signMessage: async (message: string) => {
      const signature = await walletClient.signMessage({
        account: address,
        message,
      });
      return toBytes(signature);
    },
  };
}
