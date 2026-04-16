import * as dotenv from "dotenv";
import { Request, Response } from 'express';
import { ElfaService } from '../services/elfa.service';
import { PacificaPriceData } from '../services/pacifica.service';
import { SolanaService } from '../services/solana.service';
import { EthereumService } from '../services/ethereum.service';

dotenv.config();

const elfa = new ElfaService();
const solana = new SolanaService();
const eth = new EthereumService(process.env.RPC_URL!);


let lastMarketData: PacificaPriceData | null = null;
let whaleHistory: any[] = [];
let activeSignalsCount = 0;

export const updateGlobalMarketData = (data: PacificaPriceData) => {
  lastMarketData = data;
};

export const addWhaleTransaction = (tx: any) => {
  whaleHistory = [tx, ...whaleHistory].slice(0, 10);
};

export const setSignalsCount = (count: number) => {
  activeSignalsCount = count;
};

export const getSystemStatus = async (req: Request, res: Response) => {
  try {
    const elfaHealth = await elfa.healthCheck();

    const [solBalance, ethBalanceStr] = await Promise.all([
      solana.getBalance(process.env.WHALE_SOL_ADDRESS || ''),
      eth.getBalance(process.env.WHALE_ETH_ADDRESS || '')
    ]);

    res.json({
      status: "online",
      activeSignals: activeSignalsCount,
      market: lastMarketData,
      whales: whaleHistory,
      solData: {
        balance: solBalance.toFixed(4),
        vault: process.env.WHALE_SOL_ADDRESS
      },
      ethData: {
        balance: parseFloat(ethBalanceStr).toFixed(4),
        vault: process.env.WHALE_ETH_ADDRESS
      },
      strategy: {
        name: "Conservative",
        asset: "BTC",
        mode: "Automated"
      },
      elfaStatus: elfaHealth?.data?.message || "Connected"
    });
  } catch (error) {
    console.error("Status Error:", error);
    res.status(500).json({ error: "Error getting system status" });
  }
};