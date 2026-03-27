"use client";

import { useState } from "react";

interface ConnectWalletProps {
  onConnected: (address: `0x${string}`) => void;
}

export function ConnectWallet({ onConnected }: ConnectWalletProps) {
  const [connecting, setConnecting] = useState(false);
  const [address, setAddress] = useState<`0x${string}` | null>(null);

  const connect = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask or another wallet extension.");
      return;
    }
    setConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      }) as string[];
      const addr = accounts[0] as `0x${string}`;
      setAddress(addr);
      onConnected(addr);
    } catch {
      setConnecting(false);
    }
  };

  if (address) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm">
        <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
        <span className="font-mono text-xs">{address.slice(0, 6)}...{address.slice(-4)}</span>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={connecting}
      className="rounded-lg border border-[var(--border)] px-6 py-3 text-sm font-medium hover:bg-[var(--bg-subtle)] transition-colors"
    >
      {connecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
