# Signet — Verified Human Agents, 24/7

A marketplace where World ID-verified humans deploy AI agents as their 24/7 paid representatives. Chat via XMTP. Pay via x402 micropayments.

## Demo

- **Web:** [signet.vercel.app](https://signet.vercel.app) (coming soon)
- **Chat:** [xmtp.chat/dev/dm/0x4a8a42e4b8fe0665fd32ee98343b0fd4184cab9e](http://xmtp.chat/dev/dm/0x4a8a42e4b8fe0665fd32ee98343b0fd4184cab9e)

## Architecture

```
User (World App / xmtp.chat)
  │
  ▼ XMTP message (/ask codesage How do I ...)
  │
XMTP Agent (@xmtp/agent-sdk)
  │ routes command, calls x402-protected API
  ▼
Hono API Server (x402 middleware + AgentKit)
  │ verifies World ID → free trial or payment
  │ x402: HTTP 402 → pay USDC → retry → 200
  ▼
AI Service (Groq / Gemini)
  │ agent-specific system prompt
  ▼
Response → XMTP Agent → User
```

```
signet/
├── packages/shared/    # Types + constants (agents, pricing, chain IDs)
├── server/             # Hono API — x402 payment wall + AgentKit verification
├── agent/              # XMTP bot — streams messages, pays for queries, returns answers
└── web/                # Next.js — agent directory + XMTP deep links
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Identity | **World AgentKit** | On-chain agent registration, World ID verification, free-trial mode |
| Payments | **Coinbase x402** | HTTP 402 micropayments in USDC, gasless, instant |
| Messaging | **XMTP** | E2E encrypted agent chat, reachable from World App |
| Server | **Hono** | API framework with payment + verification middleware |
| Frontend | **Next.js + Tailwind** | Agent directory with XMTP deep links |
| AI | **Groq / Gemini** | Agent response generation |

## How It Works

1. **Verify** — Agent owners register with World ID via AgentKit CLI (`npx @worldcoin/agentkit-cli register <address>`). Each agent is provably backed by a unique verified human.
2. **Browse** — Users visit the web directory to discover verified agents with different expertise and pricing.
3. **Chat** — Users message agents over XMTP (via World App or xmtp.chat). First 3 queries are free (AgentKit free-trial mode).
4. **Pay** — After the free trial, x402 handles micropayments automatically — $0.001 per query in USDC on Base Sepolia.
5. **Earn** — Agent owners earn USDC for every paid query their agent answers.

## Agents

| Agent | Domain | Price |
|-------|--------|-------|
| **CodeSage** | Software Engineering | $0.001/query |
| **LegalEagle** | Legal Advisory | $0.001/query |
| **FitCoach** | Fitness & Nutrition | $0.001/query |

## Commands (XMTP Chat)

```
/help               — Show available commands
/list               — Browse available agents
/ask <agent> <q>    — Query an agent (e.g., /ask codesage How do I use React hooks?)
```

## Setup

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Install

```bash
git clone https://github.com/your-repo/signet.git
cd signet
cp .env.example .env
# Fill in your API keys and wallet keys in .env
pnpm install
```

### Generate Keys

```bash
# Generate XMTP wallet + DB encryption key
pnpm --filter agent gen:keys
# Add output to .env
```

### Run

```bash
# Terminal 1: API server
pnpm dev:server

# Terminal 2: XMTP agent
pnpm dev:agent

# Terminal 3: Web frontend
pnpm dev:web
```

### Test

1. Open [xmtp.chat](https://xmtp.chat) and connect a wallet
2. Message the agent address shown in the agent terminal
3. Send `/help` to see available commands
4. Send `/ask codesage What is the best way to handle errors in TypeScript?`

## Integration Depth

### World ID / AgentKit — Foundational
- Every agent registered via `npx @worldcoin/agentkit-cli register`
- AgentKit middleware runs on every API request (not a checkbox — it's the auth layer)
- `agentBook.lookupHuman()` resolves agent → humanId
- Free-trial mode: 3 free queries per unique human

### Coinbase x402 — Foundational
- x402 IS the payment model (no alternative path)
- Every premium query returns HTTP 402 → client signs USDC → facilitator settles
- Gasless, sub-cent micropayments

### XMTP — Foundational
- XMTP IS the product surface (users never leave the chat)
- Agent SDK streams messages, handles conversations
- E2E encryption for sensitive queries
- World App compatibility (160 countries)

## Hackathon

AgentKit Hackathon — World x Coinbase x XMTP (March 2026)
