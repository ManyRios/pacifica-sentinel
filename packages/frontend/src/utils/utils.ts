import { WhaleTx } from "../types";

export const initialDataChart = Array.from({ length: 20 }, (_, i) => ({
  time: new Date(Date.now() - (20 - i) * 1000).toLocaleTimeString(),
  price: 74200 + Math.random() * 100
}));


export const whalesInitial: WhaleTx[] = [
  { id: '1', chain: 'SOLANA', amount: '12,450', asset: 'SOL', time: 'Just now', from: 'Unknown Whale' },
  { id: '2', chain: 'EVM', amount: '450.2', asset: 'ETH', time: '2m ago', from: 'Binance Cold Wallet' },
  { id: '3', chain: 'SOLANA', amount: '1,200,000', asset: 'USDC', time: '5m ago', from: 'Raydium Pool' },
];