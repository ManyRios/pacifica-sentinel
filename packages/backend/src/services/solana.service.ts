import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';

export class SolanaService {
  private connection: Connection;
  private readonly whaleThreshold = 100;// 100 sol = whale move

  constructor() {
    this.connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
  }

  async getBalance(address: string): Promise<number> {
    try {
      const publicKey = new PublicKey(address);
      const balance = await this.connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error getting balance in solana:', error);
      return 0;
    }
  }

  async getRecentActivity(address: string) {
    const publicKey = new PublicKey(address);
    const signatures = await this.connection.getSignaturesForAddress(publicKey, { limit: 5 });
    return signatures;
  }

  async watchLargeMover(address: string, callback: (amount: number) => void) {
    console.log(`Monitoring whales on Solana: ${address}`);
    const pubKey = new PublicKey(address);

    this.connection.onAccountChange(pubKey, (accountInfo) => {
      const balance = accountInfo.lamports / LAMPORTS_PER_SOL;
      if (balance > this.whaleThreshold) {
        callback(balance);
      }
    }, { commitment: 'confirmed' });
  }
}