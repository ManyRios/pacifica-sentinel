# Sentinel: Multichain Whale-Tracking & Strategy Agent

Sentinel is a high-performance autonomous agent designed to bridge the gap between deep-chain liquidity movements and automated execution. I developed this system to monitor large-scale movements (whales) on Ethereum and Solana, processing these signals in real-time to manage a conservative BTC-based trading strategy through Pacifica's infrastructure.

## Key Features

- Multichain Surveillance: Synchronized dual monitoring for Solana (via smart polling) and Ethereum, designed to bypass public RPC node limitations.
- Social Sentiment Validation: Integration with social data layers to filter on-chain signals based on real-world conviction.
- Pacifica Real-Time Integration: Direct WebSocket connection for millisecond-latency price feeds and order execution.
- Privacy-First Onboarding: Simplified Web3 authentication using Privy, supporting social logins and external wallets.
- Autonomous Vault Architecture: Strict separation between monitoring addresses (targets) and execution addresses (vaults).

## The Stack & Sponsors

I integrated industry-standard technologies to ensure stability and professional execution:

### 1. Elfa (Social Intelligence API)
Elfa acts as the project's social oracle. I integrated the Elfa API to filter whale movements detected on-chain against real-time social sentiment and developer activity from X/Twitter. This ensures the Sentinel only reacts to high-conviction signals with a verified social footprint, drastically reducing noise from random liquidity transfers.

### 2. Pacifica (Market Data & Execution)
Acts as the core pricing engine. I utilized Pacifica's WebSocket infrastructure to maintain a live price feed and trigger risk management modules as soon as a confirmed whale signal is detected.

### 3. Privy (Identity & Auth)
Used as the primary identity bridge. I chose Privy to abstract the complexity of multiple wallet providers, allowing users to connect and fund the bot's vault directly from the UI, supporting both EVM and Solana ecosystems seamlessly.

### 4. Alchemy (Node Infrastructure)
The primary gateway to the blockchain. Alchemy provides high-availability RPC endpoints required for real-time balance queries and on-chain activity monitoring without rate-limiting issues.

## Monorepo Structure

- packages/backend: Node.js/Express environment. Handles whale watchers, Elfa sentiment analysis, Pacifica service integration, and API logic.
- packages/frontend: Vite + React. Includes the operational dashboard, real-time charting with Recharts, and Privy SDK integration.
- .env: Global configuration for RPCs, Vault addresses, and API Keys.

## Technical Highlights

### Resilient Polling vs WebSockets
Due to inconsistencies in the accountSubscribe methods of several Solana RPC nodes, I implemented a smart polling system in the backend. This ensures the Sentinel never misses a vault balance change while maintaining a clean error log and high reliability during execution.

### Single Source of Truth (SSoT)
I designed the backend to serve as the sole source of truth. Vault addresses and detection thresholds are configured server-side and transmitted dynamically to the frontend, simplifying scalability and reducing manual configuration errors.

## Setup & Installation

Follow these steps to clone the repository and configure the environment for local development.

### 1. Clone the Repository
```bash
git clone [https://github.com/ManyRios/pacifica-sentinel.git](https://github.com/ManyRios/pacifica-sentinel.git)
cd pacifica-sentinel
```

### 2. Install Dependencies

I used a monorepo structure, so you can install all dependencies for both frontend and backend from the root:

```bash
npm install:all
# or if you prefer pnpm
pnpm install
```
### 3. Environment Configuration
I have included a .env.example file. You need to create a .env file in the root (or inside each package if preferred) with the following keys:

### 4. Running the Project
```bash
npm run dev:backend && npm run dev:frontend
```

### 3. Copy your url in the corresponding .env 

Copy the url in the corresponding .env in the backend for cors and the frontend to fetch from the API




