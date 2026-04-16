import { Request, Response } from 'express';
import { WalletService } from '../services/wallet.service';

const walletService = new WalletService();

export const getBalances = async (req: Request, res: Response) => {
  try {
    const balances = await walletService.getBalances();
    res.json(balances);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const fundWallet = async (req: Request, res: Response) => {
  const { network, amount, toAddress } = req.body;

  try {
    if (network === 'solana') {
      const result = await walletService.fundSolana(toAddress, parseFloat(amount));
      return res.json(result);
    } 
    
    const result = await walletService.fundAccount(amount.toString(), toAddress);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};