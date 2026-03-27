"use client";

import { useState, useEffect, useRef } from "react";
import { Client, ConsentState, IdentifierKind } from "@xmtp/browser-sdk";
import { createEoaSigner } from "@/lib/xmtp-signer";

const AGENT_ADDRESS = process.env.NEXT_PUBLIC_XMTP_AGENT_ADDRESS || "";

interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  text: string;
}

interface AgentChatProps {
  walletAddress: `0x${string}`;
}

function AgentChatInner({ walletAddress }: AgentChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"connecting" | "ready" | "sending" | "error">("connecting");
  const [errorMsg, setErrorMsg] = useState("");
  const clientRef = useRef<Client | null>(null);
  const dmRef = useRef<unknown>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        setStatus("connecting");
        const signer = createEoaSigner(walletAddress);
        // @ts-expect-error — env is valid but TS inference drops it
        const client = await Client.create(signer, { env: "dev" });
        if (cancelled) return;
        clientRef.current = client;

        const dm = await client.conversations.createDmWithIdentifier({
          identifier: AGENT_ADDRESS.toLowerCase(),
          identifierKind: IdentifierKind.Ethereum,
        });
        if (cancelled) return;
        dmRef.current = dm;

        setStatus("ready");

        await client.conversations.streamAllMessages({
          consentStates: [ConsentState.Allowed, ConsentState.Unknown],
          onValue: (msg) => {
            if (cancelled) return;
            if (msg.senderInboxId === client.inboxId) return;
            const text = typeof msg.content === "string"
              ? msg.content
              : JSON.stringify(msg.content);
            setMessages((prev) => [
              ...prev,
              { id: msg.id, sender: "agent", text },
            ]);
          },
          onError: (err) => console.error("Stream error:", err),
        });
      } catch (err: unknown) {
        if (cancelled) return;
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "Failed to connect");
      }
    }

    init();
    return () => { cancelled = true; };
  }, [walletAddress]);

  const send = async () => {
    const text = input.trim();
    if (!text || !dmRef.current || status !== "ready") return;

    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: "user", text },
    ]);
    setStatus("sending");

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (dmRef.current as any).sendText(text);
      setStatus("ready");
    } catch (err: unknown) {
      setStatus("ready");
      const msg = err instanceof Error ? err.message : "Send failed";
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, sender: "agent", text: `Error: ${msg}` },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-[500px] rounded-xl border border-[var(--border)] overflow-hidden">
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3" style={{ background: "var(--bg-subtle, #f9fafb)" }}>
        <span className={`h-2 w-2 rounded-full ${status === "ready" || status === "sending" ? "bg-emerald-500" : status === "connecting" ? "bg-yellow-500 animate-pulse" : "bg-red-500"}`} />
        <span className="text-sm font-medium">Signet Agent</span>
        <span className="text-xs text-[var(--text-muted)] ml-auto">
          {status === "connecting" ? "Connecting to XMTP..." : status === "error" ? errorMsg : "via XMTP + x402"}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && status === "ready" && (
          <div className="text-center text-sm text-[var(--text-muted)] mt-8 space-y-2">
            <p>Connected! Send a command to start.</p>
            <p><code className="px-2 py-1 rounded text-xs" style={{ background: "var(--bg-subtle, #f9fafb)" }}>/help</code> — see commands</p>
            <p><code className="px-2 py-1 rounded text-xs" style={{ background: "var(--bg-subtle, #f9fafb)" }}>/ask codesage What is TypeScript?</code></p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
              msg.sender === "user"
                ? "bg-[var(--accent)] text-white"
                : "border border-[var(--border)]"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-[var(--border)] px-4 py-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder={status === "ready" ? "Type a message..." : "Connecting..."}
          disabled={status !== "ready" && status !== "sending"}
          className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none disabled:opacity-50"
        />
        <button
          onClick={send}
          disabled={status !== "ready" || !input.trim()}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default AgentChatInner;
