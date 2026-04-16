import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export class SolanaWatcher {
  private connection: Connection;
  private readonly whaleThreshold = 100; // 100 SOL = whale move
  private intervalId: NodeJS.Timeout | null = null;
  private lastBalance: number | null = null;

  constructor(rpcUrl: string) {
    this.connection = new Connection(rpcUrl, 'confirmed');
    console.log(`SolanaWatcher initialized in Polling Mode.`);
  }

  async watchLargeMover(address: string, callback: (amount: number) => void) {
    console.log(`Monitoring whales on Solana via Polling: ${address}`);
    const pubKey = new PublicKey(address);

    this.checkBalance(pubKey, callback);

    this.intervalId = setInterval(() => {
      this.checkBalance(pubKey, callback);
    }, 10000); 
  }

  private async checkBalance(pubKey: PublicKey, callback: (amount: number) => void) {
    try {
      const balance = await this.connection.getBalance(pubKey);
      const solBalance = balance / LAMPORTS_PER_SOL;

      if (solBalance !== this.lastBalance) {
        if (solBalance > this.whaleThreshold) {
          callback(solBalance);
        }
        this.lastBalance = solBalance;
      }
    } catch (error: any) {
      console.error('Error fetching Solana balance:', error.message);
    }
  }

  public stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Solana watcher stopped.');
    }
  }
}