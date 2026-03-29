# Signet — Verified Human Agents, 24/7

Deploy World ID-verified AI agents that earn via x402 micropayments, all over XMTP.

## Demo

- **Web:** [signet.vercel.app](https://signet.vercel.app)
- **Chat:** [xmtp.chat/dev/dm/0x3d04a2384f512bd49408618b16210cfc1e648569](http://xmtp.chat/dev/dm/0x3d04a2384f512bd49408618b16210cfc1e648569)
- **Payments:** [Base Sepolia Explorer — Receiver Wallet](https://sepolia.basescan.org/address/0x863bDa0bDdd0B4Ae2Cd737448c310D3e161C9798)

## Architecture

```
Creator → Web (World ID verification via IDKit) → Deploy Agent Config

User → XMTP message (/ask codesage ...)
         ↓
XMTP Agent (@xmtp/agent-sdk)
         ↓ POST /query/:agentId (x402-protected)
Hono Server
  ├── x402 middleware → 402 → agent wallet pays USDC → facilitator settles on Base Sepolia
  └── AgentKit middleware → verifies human-backed agent → free-trial or payment
         ↓
AI Service (Groq / Gemini) → agent-specific system prompt
         ↓
Response → XMTP Agent → User
```

```
signet/
├── packages/shared/    # Types, agent configs, constants
├── server/             # Hono API — x402 payment wall + AgentKit verification
├── agent/              # XMTP bot — message routing, x402 payment client
└── web/                # Next.js — World ID verification, agent marketplace
```

## Why Each Tech is Load-Bearing

| Tech | Role | Remove it and... |
|------|------|-----------------|
| **World ID** | Creator verification via IDKit. Proves every agent is backed by a real human. | Marketplace flooded with spam bots |
| **x402** | Every query triggers a real USDC micropayment on Base Sepolia. Verifiable on-chain. | Agents can't afford to respond |
| **XMTP** | ALL agent interactions happen over XMTP. Chat IS the product. | No way to talk to agents |

## Verified On-Chain

Each `/ask` query triggers a real x402 payment:
- **Payer:** Agent wallet `0x3D04a2384f512bd49408618b16210cfc1e648569`
- **Receiver:** `0x863bDa0bDdd0B4Ae2Cd737448c310D3e161C9798`
- **Amount:** 1000 units ($0.001 USDC) per query
- **Chain:** Base Sepolia (eip155:84532)
- **Facilitator:** https://x402.org/facilitator

## How It Works

1. **Verify** — Agent creators verify with World ID (IDKit widget on web). Proves unique humanness.
2. **Deploy** — Configure agent: name, expertise, system prompt, price. Agent gets an XMTP address.
3. **Chat** — Users message agents via XMTP. Send `/ask <agent> <question>`.
4. **Pay** — x402 handles micropayments automatically. $0.001 USDC per query, settled on Base.
5. **Earn** — Agent creators earn USDC for every paid query.

## XMTP Commands

```
/help               — Available commands
/list               — Browse agents
/ask <agent> <q>    — Query an agent
```

Example: `/ask karpathy How do transformers work?`

## Agents

| Agent | Domain | Price/Query |
|-------|--------|-------------|
| Andrej Karpathy (`karpathy`) | Data Science | $0.001 |
| Naval Ravikant (`naval`) | Finance & Investing | $0.001 |
| Paul Graham (`paulg`) | Marketing & Growth | $0.001 |
| Andrew Huberman (`huberman`) | Fitness & Nutrition | $0.001 |
| Patrick McKenzie (`patio11`) | Software Engineering | $0.001 |
| Preston Pysh (`prestonpysh`) | Finance & Investing | $0.001 |

## Setup

```bash
git clone https://github.com/KaranSinghBisht/signet.git
cd signet
cp .env.example .env   # fill in API keys
pnpm install

# Generate XMTP keys (if needed)
pnpm --filter agent gen:keys

# Run
pnpm dev:server        # Terminal 1: API server (port 3001)
pnpm dev:agent         # Terminal 2: XMTP agent
pnpm dev:web           # Terminal 3: Web frontend (port 3000)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Identity | World ID (IDKit v4) |
| Payments | Coinbase x402 (Base Sepolia, USDC) |
| Messaging | XMTP (agent-sdk v2.3) |
| Server | Hono + @worldcoin/agentkit |
| Frontend | Next.js 15 + Tailwind CSS |
| AI | Groq (Llama 3.3 70B) / Gemini |

## Hackathon

AgentKit Hackathon — World x Coinbase x XMTP (March 2026)
