"use client";

import { useState } from "react";
import { IDKitRequestWidget, deviceLegacy, type RpContext } from "@worldcoin/idkit";

interface WorldIDButtonProps {
  onVerified: (nullifier: string) => void;
}

export function WorldIDButton({ onVerified }: WorldIDButtonProps) {
  const [open, setOpen] = useState(false);
  const [rpContext, setRpContext] = useState<RpContext | null>(null);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    if (verified) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/rp-signature", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "verify-agent-creator" }),
      });
      if (!res.ok) throw new Error("Failed to get signature");
      const rpSig = await res.json();

      setRpContext({
        rp_id: process.env.NEXT_PUBLIC_WORLD_RP_ID!,
        nonce: rpSig.nonce,
        created_at: rpSig.created_at,
        expires_at: rpSig.expires_at,
        signature: rpSig.sig,
      });
      setOpen(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification setup failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        disabled={verified}
        className={`rounded-lg px-6 py-3 text-sm font-medium transition-all ${
          verified
            ? "bg-emerald-100 text-emerald-700 cursor-default"
            : "bg-[#222] text-white hover:bg-black cursor-pointer"
        }`}
      >
        {verified ? "Verified with World ID" : loading ? "Connecting..." : "Verify with World ID"}
      </button>
      {error && (
        <p className="text-xs text-red-500 max-w-xs text-center">{error}</p>
      )}

      {rpContext && (
        <IDKitRequestWidget
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) setLoading(false);
          }}
          app_id={process.env.NEXT_PUBLIC_WORLD_APP_ID as `app_${string}`}
          action="verify-agent-creator"
          environment="staging"
          rp_context={rpContext}
          allow_legacy_proofs={true}
          preset={deviceLegacy({})}
          handleVerify={async (result) => {
            const res = await fetch("/api/verify-proof", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(result),
            });
            if (!res.ok) {
              const data = await res.json().catch(() => ({ error: "Verification failed" }));
              throw new Error(data.error || "World ID verification failed");
            }
          }}
          onSuccess={(result) => {
            setVerified(true);
            setLoading(false);
            // v3: responses[0].nullifier, v4: responses[0].nullifier
            const responses = "responses" in result ? (result as { responses: { nullifier: string }[] }).responses : [];
            const nullifier = responses[0]?.nullifier || "verified";
            onVerified(nullifier);
          }}
        />
      )}
    </div>
  );
}
