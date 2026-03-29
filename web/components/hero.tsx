"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8;
    }
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center px-6"
    >
      {/* Cinematic Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover scale-105"
          style={{ filter: "brightness(0.85) contrast(1.1)" }}
        >
          <source 
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260228_065522_522e2295-ba22-457e-8fdb-fbcd68109c73.mp4" 
            type="video/mp4" 
          />
        </video>
        {/* Subtle Vignette */}
        <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%]" />
      </div>

      {/* Floating Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-8 z-50 flex items-center justify-between w-full max-w-5xl px-6 py-3 bg-white/90 backdrop-blur-md rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20"
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm tracking-tighter">
            S
          </div>
          <span className="text-black font-bold text-lg tracking-tight font-heading">Signet</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-[13px] font-medium tracking-wide uppercase text-neutral-500">
          {[
            { label: "Agents", href: "/app#agents" },
            { label: "Deploy", href: "/app#deploy" },
            { label: "How It Works", href: "#how-it-works" },
            { label: "Chat", href: "/app#chat" },
          ].map((item) => (
            <a key={item.href} href={item.href} className="hover:text-black transition-colors duration-300">
              {item.label}
            </a>
          ))}
        </div>

        <a href="/app" className="flex items-center gap-2 bg-[#222] text-white px-5 py-2.5 rounded-full text-[13px] font-semibold hover:bg-black transition-all group active:scale-95 shadow-lg shadow-black/10">
          Launch App
          <div className="bg-white/10 p-1 rounded-full group-hover:rotate-45 transition-transform duration-300">
            <ArrowUpRight size={14} className="text-white" />
          </div>
        </a>
      </motion.nav>

      {/* Main Content */}
      <motion.div 
        style={{ y: y1, opacity }}
        className="relative z-10 flex flex-col items-center text-center max-w-5xl pt-24"
      >
        <h1 className="flex flex-col gap-0 mb-8">
          <motion.span
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white font-bold text-5xl md:text-7xl lg:text-8xl tracking-[-0.04em] font-heading drop-shadow-2xl"
          >
            The AI Agent
          </motion.span>
          <motion.span
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white italic text-6xl md:text-8xl lg:text-[110px] leading-[0.85] font-serif drop-shadow-2xl"
          >
            Marketplace
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-white/70 text-lg md:text-2xl font-medium max-w-2xl mb-12 drop-shadow-md leading-relaxed"
        >
          Prove you&apos;re human with World ID. Deploy your AI agent. <br className="hidden md:block" />
          Earn USDC for every query via x402 — settled on Base.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <a href="/app#agents" className="group relative flex items-center gap-3 bg-white text-black px-12 py-6 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-neutral-100 transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.3)] active:scale-95">
            <Play size={16} fill="black" className="group-hover:scale-110 transition-transform" />
            Browse Agents
            <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </motion.div>
      </motion.div>

      {/* Background Accents */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/50 to-transparent z-10" />
    </section>
  );
}
