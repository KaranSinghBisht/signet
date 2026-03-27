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
  initialInput?: string;
}

function AgentChatInner({ walletAddress, initialInput = "" }: AgentChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState(initialInput);
  const [status, setStatus] = useState<"connecting" | "ready" | "sending" | "error">("connecting");
  const [errorMsg, setErrorMsg] = useState("");
  const clientRef = useRef<Client | null>(null);
  const dmRef = useRef<unknown>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialInput) setInput(initialInput);
  }, [initialInput]);

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
    if (!text || !dmRef.current || (status !== "ready" && status !== "sending")) return;

    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: "user", text },
    ]);
    const oldStatus = status;
    setStatus("sending");

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (dmRef.current as any).sendText(text);
      setStatus("ready");
    } catch (err: unknown) {
      setStatus(oldStatus);
      const msg = err instanceof Error ? err.message : "Send failed";
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, sender: "agent", text: `Error: ${msg}` },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-[600px] rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--bg-card)] shadow-xl">
      <div className="flex items-center gap-3 border-b border-[var(--border)] px-6 py-4 bg-[var(--bg-paper)]">
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-white text-sm font-bold shadow-sm">
            S
          </div>
          <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${status === "ready" || status === "sending" ? "bg-emerald-500" : status === "connecting" ? "bg-yellow-500 animate-pulse" : "bg-red-500"}`} />
        </div>
        <div>
          <h3 className="text-sm font-bold leading-none">Signet Gateway</h3>
          <p className="text-[10px] text-[var(--text-muted)] mt-1 font-medium uppercase tracking-wider">
            {status === "connecting" ? "Initializing XMTP..." : status === "error" ? "Connection Failed" : "Secure XMTP Channel"}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="rounded-full bg-[var(--bg-subtle)] px-2.5 py-1 text-[10px] font-bold text-[var(--text-dim)] font-mono">
            BASE
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 scrollbar-hide">
        {messages.length === 0 && status === "ready" && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 max-w-xs mx-auto">
            <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border)]">
              <p className="text-sm text-[var(--text)] font-medium">Welcome to Signet!</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Send a command to interact with verified agents.</p>
            </div>
            <div className="grid grid-cols-1 gap-2 w-full">
              {[
                { label: "List Agents", cmd: "/agents" },
                { label: "Help Guide", cmd: "/help" },
              ].map(tip => (
                <button
                  key={tip.cmd}
                  onClick={() => setInput(tip.cmd)}
                  className="flex items-center justify-between px-4 py-2 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] transition-all text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--accent)]"
                >
                  {tip.label}
                  <code className="text-[10px] opacity-60">{tip.cmd}</code>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start animate-in fade-in slide-in-from-left-2"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
              msg.sender === "user"
                ? "bg-[var(--accent)] text-white rounded-tr-none"
                : "bg-[var(--bg-paper)] border border-[var(--border)] rounded-tl-none text-[var(--text)]"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {status === "sending" && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-[var(--bg-subtle)] border border-[var(--border)] rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--text-dim)] animate-bounce" />
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--text-dim)] animate-bounce [animation-delay:0.2s]" />
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--text-dim)] animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-[var(--bg-paper)] border-t border-[var(--border)]">
        <div className="flex gap-2 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-1.5 focus-within:border-[var(--accent)] focus-within:ring-4 focus-within:ring-[var(--accent-light)] transition-all shadow-inner">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder={status === "ready" ? "Ask an agent..." : "Connecting..."}
            disabled={status !== "ready" && status !== "sending"}
            className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none disabled:opacity-50 font-medium"
          />
          <button
            onClick={send}
            disabled={(status !== "ready" && status !== "sending") || !input.trim()}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md active:scale-95"
          >
            {status === "sending" ? "..." : "SEND"}
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between px-1">
          <p className="text-[10px] text-[var(--text-dim)] font-bold uppercase tracking-widest">
            {status === "ready" ? "Ready to route" : "Syncing..."}
          </p>
          <p className="text-[10px] text-[var(--text-dim)] font-mono">
            XMTP DEV NETWORK
          </p>
        </div>
      </div>
    </div>
  );
}

export default AgentChatInner;
