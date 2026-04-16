import * as dotenv from "dotenv";
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { authPrivy } from './middleware/auth';
import apiRoutes from './routes/status.routes';
import walletRoutes from './routes/wallet.route'
import { SolanaService } from './services/solana.service';
import { SolanaWatcher } from './services/solana-watcher.service';
import { PacificaService } from './services/pacifica.service';
import { ElfaService } from './services/elfa.service';
import { EthereumService } from './services/ethereum.service';
import { ExecutionService } from './services/execution.service';
import { SignalService } from './services/signal.service';

import { updateGlobalMarketData, addWhaleTransaction, setSignalsCount } from './controllers/status.controller';

dotenv.config();
const PORT = process.env.PORT || 3000;
const CLIENT = process.env.HOST!;

const app = express();

app.use(cors({ origin: process.env.CLIENT || '*', // Aquí va la URL de tu Vercel
  methods: ['GET', 'POST'],
  credentials: true}));
app.use(express.json());


//Routes
app.use(apiRoutes);
app.use(walletRoutes);

const elfaService = new ElfaService();
const solana = new SolanaService();
const solWatcher = new SolanaWatcher(process.env.RPC_SOLANA!);
const eth = new EthereumService(process.env.RPC_URL!);
const executor = new ExecutionService(process.env.PRIVATE_KEY_ETH!);

const processor = new SignalService(executor, elfaService);

const solanaWhaleAddress = process.env.WHALE_SOL_ADDRESS!;

//Middleware 
app.use((req: Request, res: Response, next: NextFunction) => {
  authPrivy(req, res, next);
});

if (solanaWhaleAddress) {
  solWatcher.watchLargeMover(solanaWhaleAddress, (balance) => {
    console.log(`[WHALE ALERT] Movement detected: ${balance} SOL`);

    addWhaleTransaction({
      id: `sol-${Date.now()}`,
      chain: 'SOLANA',
      amount: balance.toFixed(2),
      asset: 'SOL',
      time: 'Just Now',
      from: solanaWhaleAddress.slice(0, 4) + '...' + solanaWhaleAddress.slice(-4)
    });
  });
}

const sentinel = new PacificaService(async (priceUpdate) => {
  console.log(`[MARKET] ${priceUpdate.symbol}: $${priceUpdate.price}`);
  updateGlobalMarketData(priceUpdate);
  try {

    //SOLANA
    const solBalance = await solana.getBalance(process.env.WHALE_SOL_ADDRESS!);
    const isSolanaWhaleActive = solBalance > 500;

    //ETHEREUM
    const ethBalanceStr = await eth.getBalance(process.env.WHALE_ETH_ADDRESS!);
    const isEthWhaleActive = parseFloat(ethBalanceStr) > 1000;

    if (isSolanaWhaleActive) {
      addWhaleTransaction({
        id: `sol-${Date.now()}`,
        chain: 'SOLANA',
        amount: solBalance.toFixed(2),
        asset: 'SOL',
        time: 'Active Now',
        from: 'Target Whale'
      });
    }

    if (isEthWhaleActive) {
      addWhaleTransaction({
        id: `eth-${Date.now()}`,
        chain: 'EVM',
        amount: ethBalanceStr,
        asset: 'ETH',
        time: 'Active Now',
        from: 'Target Whale'
      });
    }

    const result = await processor.process(priceUpdate.symbol, priceUpdate.price, {
      solanaWhale: isSolanaWhaleActive,
      ethWhale: isEthWhaleActive
    });

    if (result && result.activeSignals) {
      setSignalsCount(result.activeSignals.length);
    }

  } catch (error) {
    console.error('Critical error in sentinel:', error);
  }
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('SIGINT', () => {
  console.log('\nShutting down Sentinel...');
  sentinel.disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`
  ================================================
    PACIFICA SENTINEL AGENT - ONLINE
  ================================================
  - Dashboard: http://localhost:${PORT}/status
  - Environment: ${process.env.NODE_ENV || 'development'}
  - Loader: Node
  ================================================
  Listening signals from ethereum, solana and elfa...
  `);
  sentinel.connect();
});
