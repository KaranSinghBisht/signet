"use client";

import { useState, useEffect, useRef } from "react";
import { Client, IdentifierKind } from "@xmtp/browser-sdk";
import { createEoaSigner } from "@/lib/xmtp-signer";

const AGENT_ADDRESS = process.env.NEXT_PUBLIC_XMTP_AGENT_ADDRESS || "";
const XMTP_ENV = (process.env.NEXT_PUBLIC_XMTP_ENV || "dev") as "dev" | "production" | "local";

interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  text: string;
}

interface SelectedAgent {
  id: string;
  name: string;
  domain: string;
}

interface AgentChatProps {
  walletAddress: `0x${string}`;
  selectedAgent?: SelectedAgent | null;
  voiceEnabled?: boolean;
  onClearAgent?: () => void;
}

async function speakText(text: string): Promise<void> {
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = (await res.json()) as { audioUrl?: string; fallback?: boolean };
    if (data.audioUrl) {
      const audio = new Audio(data.audioUrl);
      try {
        await audio.play();
      } catch {
        // Autoplay blocked (common on mobile) — fall through to browser TTS
      }
      return;
    }
  } catch {
    // TTS fetch failed — fall through to browser TTS
  }
  // Browser TTS fallback
  if (typeof window !== "undefined" && window.speechSynthesis) {
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 1.05;
    utt.pitch = 1;
    window.speechSynthesis.speak(utt);
  }
}

function AgentChatInner({ walletAddress, selectedAgent = null, voiceEnabled = false, onClearAgent }: AgentChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"connecting" | "ready" | "sending" | "error">("connecting");
  const [errorMsg, setErrorMsg] = useState("");
  const [voiceActive, setVoiceActive] = useState(voiceEnabled);
  const voiceActiveRef = useRef(voiceActive);
  useEffect(() => { voiceActiveRef.current = voiceActive; }, [voiceActive]);
  const clientRef = useRef<Client<unknown> | null>(null);
  const dmRef = useRef<{ sendText: (text: string) => Promise<string> } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        setStatus("connecting");

        if (!AGENT_ADDRESS) {
          setStatus("error");
          setErrorMsg("Agent address not configured.");
          return;
        }

        const signer = createEoaSigner(walletAddress);
        const client = await Client.create(signer, { env: XMTP_ENV } as Parameters<typeof Client.create>[1]);
        if (cancelled) return;
        clientRef.current = client as Client<unknown>;

        // Preflight: verify agent is reachable on this XMTP network
        const canMsg = await client.canMessage([
          { identifier: AGENT_ADDRESS.toLowerCase(), identifierKind: IdentifierKind.Ethereum },
        ]);
        if (cancelled) return;
        if (!canMsg.get(AGENT_ADDRESS.toLowerCase())) {
          setStatus("error");
          setErrorMsg("Agent is not reachable on XMTP. Is the agent running?");
          return;
        }

        const dm = await client.conversations.createDmWithIdentifier({
          identifier: AGENT_ADDRESS.toLowerCase(),
          identifierKind: IdentifierKind.Ethereum,
        });
        if (cancelled) return;
        dmRef.current = dm as typeof dmRef.current;

        // Sync this conversation so we have latest state
        await dm.sync();
        if (cancelled) return;

        setStatus("ready");

        // Stream only this DM conversation for agent replies
        await dm.stream({
          onValue: (msg) => {
            if (cancelled) return;
            if (msg.senderInboxId === client.inboxId) return;
            let text: string;
            if (typeof msg.content === "string") {
              text = msg.content;
            } else if (msg.content && typeof msg.content === "object" && "content" in msg.content) {
              text = String((msg.content as { content: unknown }).content);
            } else {
              text = String(msg.content ?? "");
            }
            setMessages((prev) => [
              ...prev,
              { id: String(msg.id), sender: "agent", text },
            ]);
            if (voiceActiveRef.current) {
              speakText(text).catch(() => {});
            }
          },
          onError: (err) => {
            if (cancelled) return;
            console.error("Stream error:", err);
            setStatus("error");
            setErrorMsg("Connection lost. Please refresh to reconnect.");
          },
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

    // Auto-wrap with /ask when an agent is selected and user typed a plain question
    const isCommand = text.startsWith("/");
    const xmtpText = selectedAgent && !isCommand
      ? `/ask ${selectedAgent.id} ${text}`
      : text;

    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: `user-${crypto.randomUUID()}`, sender: "user", text },
    ]);
    const oldStatus = status;
    setStatus("sending");

    try {
      await dmRef.current.sendText(xmtpText);
      setStatus("ready");
    } catch (err: unknown) {
      setStatus(oldStatus);
      const msg = err instanceof Error ? err.message : "Send failed";
      setMessages((prev) => [
        ...prev,
        { id: `err-${crypto.randomUUID()}`, sender: "agent", text: `Error: ${msg}` },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-[600px] rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--bg-card)] shadow-xl">
      <div className="flex items-center gap-3 border-b border-[var(--border)] px-6 py-4 bg-[var(--bg-paper)]">
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-white text-sm font-bold shadow-sm">
            {selectedAgent ? selectedAgent.name.charAt(0) : "S"}
          </div>
          <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${status === "ready" || status === "sending" ? "bg-emerald-500" : status === "connecting" ? "bg-yellow-500 animate-pulse" : "bg-red-500"}`} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold leading-none truncate">
            {selectedAgent ? selectedAgent.name : "Signet Gateway"}
          </h3>
          <p className="text-[10px] text-[var(--text-muted)] mt-1 font-medium uppercase tracking-wider truncate">
            {status === "connecting" ? "Initializing XMTP..." : status === "error" ? (errorMsg || "Connection Failed") : selectedAgent ? selectedAgent.domain : "Select an agent above"}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2 shrink-0">
          {selectedAgent && onClearAgent && (
            <button
              onClick={onClearAgent}
              className="rounded-full px-2.5 py-1 text-[10px] font-bold bg-[var(--bg-subtle)] text-[var(--text-dim)] hover:bg-red-50 hover:text-red-500 transition-all"
            >
              CLEAR
            </button>
          )}
          <button
            onClick={() => setVoiceActive((v) => !v)}
            title={voiceActive ? "Mute voice" : "Enable voice"}
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition-all ${
              voiceActive
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--bg-subtle)] text-[var(--text-dim)]"
            }`}
          >
            {voiceActive ? "🎙️ ON" : "🔇 OFF"}
          </button>
          <span className="rounded-full bg-[var(--bg-subtle)] px-2.5 py-1 text-[10px] font-bold text-[var(--text-dim)] font-mono">
            BASE
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 scrollbar-hide">
        {messages.length === 0 && status === "ready" && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 max-w-xs mx-auto">
            {selectedAgent ? (
              <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border)]">
                <p className="text-sm text-[var(--text)] font-medium">Chatting with {selectedAgent.name}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Just type your question — no commands needed.</p>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border)]">
                  <p className="text-sm text-[var(--text)] font-medium">Welcome to Signet!</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Select an agent above, or use commands below.</p>
                </div>
                <div className="grid grid-cols-1 gap-2 w-full">
                  {[
                    { label: "List Agents", cmd: "/list" },
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
              </>
            )}
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start animate-in fade-in slide-in-from-left-2"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
              msg.sender === "user"
                ? "bg-[#222] text-white rounded-tr-none"
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
            placeholder={status === "ready" ? (selectedAgent ? `Ask ${selectedAgent.name}...` : "Select an agent or type /help") : "Connecting..."}
            disabled={status !== "ready" && status !== "sending"}
            className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none disabled:opacity-50 font-medium"
          />
          <button
            onClick={send}
            disabled={(status !== "ready" && status !== "sending") || !input.trim()}
            className="rounded-lg bg-[#222] px-4 py-2 text-xs font-bold text-white hover:bg-black transition-colors disabled:opacity-50 shadow-md active:scale-95"
          >
            {status === "sending" ? "..." : "SEND"}
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between px-1">
          <p className="text-[10px] text-[var(--text-dim)] font-bold uppercase tracking-widest">
            {status === "ready" ? (selectedAgent ? `Routing to ${selectedAgent.id}` : "Ready") : "Syncing..."}
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
