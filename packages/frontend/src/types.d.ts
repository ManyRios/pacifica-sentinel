export interface WhaleTx {
  id: string;
  chain: 'EVM' | 'SOLANA';
  amount: string;
  asset: string;
  time: string;
  from: string;
}

export interface FundingProps {
  solBalance: string | number;
  ethBalance: string | number;
  solVault: string;
  ethVault: string;
  isOnline: boolean;
}

export interface PricePoint {
  time: string;
  price: number;
}