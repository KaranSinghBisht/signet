# Signet — AI Twins of Verified Experts

Prove you're human with World ID, claim your identity via Twitter, and deploy an AI twin that earns USDC for every query — all over XMTP, paid via x402.

## Architecture

### Creator Flow

```mermaid
flowchart LR
    A["🌐 World ID\n(Anti-Sybil)"] -->|Proof of Humanness| B["🐦 Twitter OAuth\n(Identity)"]
    B -->|Verified Profile| C["🎤 Interview\n(Expertise)"]
    C -->|System Prompt| D["🚀 Deploy\nAI Twin"]
    D -->|Live on| E["💬 XMTP\nNetwork"]

    style A fill:#7c3aed,color:#fff,stroke:none
    style B fill:#1d9bf0,color:#fff,stroke:none
    style C fill:#f59e0b,color:#fff,stroke:none
    style D fill:#10b981,color:#fff,stroke:none
    style E fill:#6366f1,color:#fff,stroke:none
```

### Query & Payment Flow

```mermaid
sequenceDiagram
    participant User
    participant XMTP as XMTP Agent
    participant Server as Hono Server
    participant x402 as x402 Facilitator
    participant AI as AI Service

    User->>XMTP: /ask karpathy How do transformers work?
    XMTP->>Server: POST /query/karpathy
    Server->>x402: 402 Payment Required
    x402->>x402: Agent wallet pays $0.001 USDC
    x402-->>Server: Payment settled on Base Sepolia
    Server->>Server: AgentKit verifies human-backed agent
    Server->>AI: System prompt + question
    AI-->>Server: Response
    Server-->>XMTP: Answer
    XMTP-->>User: **Karpathy** (via x402): ...
```

### System Architecture

```mermaid
graph TB
    subgraph Web["🖥️ Web — Next.js 15"]
        WID[World ID IDKit v4]
        TW[Twitter OAuth 2.0]
        Deploy[Deploy Form]
        Chat[XMTP Browser Chat]
    end

    subgraph Server["⚡ Server — Hono"]
        x402m[x402 Middleware]
        AK[AgentKit Middleware]
        Registry[Agent Registry]
        AIService[AI Service]
    end

    subgraph Agent["🤖 Agent — XMTP SDK"]
        Router[Command Router]
        PayClient[x402 Payment Client]
    end

    subgraph External["🌍 External"]
        WorldID[(World ID API)]
        Facilitator[(x402 Facilitator)]
        Base[(Base Sepolia)]
        Groq[(Groq / Gemini)]
        Murf[(Murf.ai TTS)]
    end

    WID -->|Verify| WorldID
    TW -->|OAuth| Deploy
    Deploy -->|POST /agents| Registry
    Chat -->|XMTP| Agent

    Router -->|/ask| PayClient
    PayClient -->|POST /query/:id| x402m
    x402m -->|402| Facilitator
    Facilitator -->|Settle USDC| Base
    x402m --> AK
    AK --> AIService
    AIService --> Groq
    Chat -.->|Voice| Murf

    style Web fill:#f8fafc,stroke:#e2e8f0
    style Server fill:#f0fdf4,stroke:#bbf7d0
    style Agent fill:#fef3c7,stroke:#fde68a
    style External fill:#f5f3ff,stroke:#ddd6fe
```

### Project Structure

```
signet/
├── packages/shared/    # Types, agent configs, constants
├── server/             # Hono API — x402 payment wall + AgentKit verification
├── agent/              # XMTP bot — message routing, x402 payment client
└── web/                # Next.js — World ID + Twitter verification, agent marketplace
```

## Why Each Tech is Load-Bearing

| Tech | Role | Remove it and... |
|------|------|-----------------|
| **World ID** | Anti-sybil via IDKit. Proves every agent creator is a unique real human. | Marketplace flooded with spam bots and impersonators |
| **Twitter OAuth** | Identity claiming. Links your agent to your public Twitter profile. | No way to verify who the "expert" actually is |
| **x402** | Every query triggers a real USDC micropayment on Base Sepolia. Verifiable on-chain. | Agents can't earn, no economic model |
| **XMTP** | ALL agent interactions happen over XMTP. Chat IS the product. | No way to talk to agents |

## Verified On-Chain

Each `/ask` query triggers a real x402 payment:
- **Payer:** Agent wallet `0x3D04a2384f512bd49408618b16210cfc1e648569`
- **Receiver:** `0x863bDa0bDdd0B4Ae2Cd737448c310D3e161C9798`
- **Amount:** 1000 units ($0.001 USDC) per query
- **Chain:** Base Sepolia (eip155:84532)
- **Facilitator:** https://x402.org/facilitator

## How It Works

```mermaid
flowchart TB
    subgraph Step1["Step 1 — Verify"]
        S1[Prove you're human with World ID]
        S1a[One person = one agent, no bot farms]
    end
    subgraph Step2["Step 2 — Claim"]
        S2[Connect Twitter/X via OAuth]
        S2a[Proves your public identity]
    end
    subgraph Step3["Step 3 — Deploy"]
        S3[Answer questions about your expertise]
        S3a[Signet auto-generates your AI twin]
    end
    subgraph Step4["Step 4 — Earn"]
        S4[Users chat via XMTP, pay via x402]
        S4a[$0.001 USDC per query on Base]
    end

    Step1 --> Step2 --> Step3 --> Step4

    style Step1 fill:#7c3aed,color:#fff,stroke:none
    style Step2 fill:#1d9bf0,color:#fff,stroke:none
    style Step3 fill:#f59e0b,color:#fff,stroke:none
    style Step4 fill:#10b981,color:#fff,stroke:none
```

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

Plus any user-deployed agents via the web interface.

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
| Anti-Sybil | World ID (IDKit v4) |
| Identity | Twitter OAuth 2.0 (NextAuth) |
| Payments | Coinbase x402 (Base Sepolia, USDC) |
| Messaging | XMTP (agent-sdk v2.3) |
| Server | Hono + @worldcoin/agentkit |
| Frontend | Next.js 15 + Tailwind CSS |
| AI | Groq (Llama 3.3 70B) / Gemini |
| Voice | Murf.ai TTS (optional per agent) |
