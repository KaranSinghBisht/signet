"use client";

import { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

interface TwitterAuthButtonProps {
  onAuthenticated: (handle: string, name: string, avatar?: string, knownFor?: string) => void;
}

export function TwitterAuthButton({ onAuthenticated }: TwitterAuthButtonProps) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.twitterHandle) {
      onAuthenticated(
        session.twitterHandle,
        session.twitterName ?? session.twitterHandle,
        session.twitterAvatar,
      );
    }
  }, [session?.twitterHandle, session?.twitterName, session?.twitterAvatar, onAuthenticated]);

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white/40 text-sm font-semibold">
        <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
        Connecting...
      </div>
    );
  }

  if (session?.twitterHandle) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/10 border border-white/20">
          {session.twitterAvatar && (
            <img
              src={session.twitterAvatar}
              alt={session.twitterHandle}
              className="h-10 w-10 rounded-full ring-2 ring-white/20"
            />
          )}
          <div className="text-left">
            <p className="text-sm font-bold text-white">{session.twitterName}</p>
            <p className="text-xs text-white/50">@{session.twitterHandle}</p>
          </div>
          <span className="ml-2 flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Verified
          </span>
        </div>
        <button
          onClick={() => signOut({ redirect: false })}
          className="text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          Not you? Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={() => signIn("twitter")}
        className="flex items-center gap-3 px-6 py-3 rounded-full bg-white text-black text-sm font-bold hover:bg-white/90 transition-all shadow-xl active:scale-95"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Sign in with X / Twitter
      </button>
      <button
        onClick={() => onAuthenticated(
          "karpathy",
          "Andrej Karpathy",
          undefined,
          "AI researcher, ex-Tesla/OpenAI. I teach neural nets from scratch and make deep learning accessible to everyone."
        )}
        className="text-xs font-medium text-white/40 hover:text-white/70 underline underline-offset-2 transition-colors"
      >
        Use Simulator (Demo)
      </button>
    </div>
  );
}
