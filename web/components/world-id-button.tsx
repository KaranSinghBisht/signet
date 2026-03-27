"use client";

import { useState } from "react";
import { IDKitRequestWidget, orbLegacy, type RpContext } from "@worldcoin/idkit";

interface WorldIDButtonProps {
  onVerified: (nullifier: string) => void;
}

export function WorldIDButton({ onVerified }: WorldIDButtonProps) {
  const [open, setOpen] = useState(false);
  const [rpContext, setRpContext] = useState<RpContext | null>(null);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (verified) return;
    setLoading(true);
    try {
      const rpSig = await fetch("/api/rp-signature", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "verify-agent-creator" }),
      }).then((r) => r.json());

      setRpContext({
        rp_id: process.env.NEXT_PUBLIC_WORLD_RP_ID!,
        nonce: rpSig.nonce,
        created_at: rpSig.created_at,
        expires_at: rpSig.expires_at,
        signature: rpSig.sig,
      });
      setOpen(true);
    } catch {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={verified}
        className={`rounded-lg px-6 py-3 text-sm font-medium transition-all ${
          verified
            ? "bg-[var(--success-light)] text-[var(--success)] cursor-default"
            : "bg-[var(--accent)] text-white hover:opacity-90 cursor-pointer"
        }`}
      >
        {verified ? "Verified with World ID" : loading ? "Connecting..." : "Verify with World ID"}
      </button>

      {rpContext && (
        <IDKitRequestWidget
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) setLoading(false);
          }}
          app_id={process.env.NEXT_PUBLIC_WORLD_APP_ID as `app_${string}`}
          action="verify-agent-creator"
          rp_context={rpContext}
          allow_legacy_proofs={true}
          preset={orbLegacy({})}
          handleVerify={async (result) => {
            const res = await fetch("/api/verify-proof", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                rp_id: process.env.NEXT_PUBLIC_WORLD_RP_ID,
                idkitResponse: result,
              }),
            });
            if (!res.ok) throw new Error("Verification failed");
          }}
          onSuccess={(result) => {
            setVerified(true);
            setLoading(false);
            const nullifier = "nullifier" in result ? String(result.nullifier) : "verified";
            onVerified(nullifier);
          }}
        />
      )}
    </>
  );
}
