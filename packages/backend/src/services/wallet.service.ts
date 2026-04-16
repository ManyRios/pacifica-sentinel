import * as dotenv from "dotenv";
import { ethers } from 'ethers';
import { Connection, Keypair, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';
import { decodeBase58 } from '../utils/bs58'


dotenv.config();

export class WalletService {
    private wallet: ethers.Wallet;
    private provider: ethers.JsonRpcProvider;
    private solKeypair: Keypair;
    private solConnection: Connection;

    constructor() {

        const solanaKey = process.env.PRIVATE_KEY_SOLANA!;
        if (!solanaKey) throw new Error("SOLANA_PRIVATE_KEY no configured");
        try {
            const decodedKey = decodeBase58(solanaKey);
            this.solKeypair = Keypair.fromSecretKey(decodedKey);
            this.solConnection = new Connection(process.env.SOLANA_RPC_URL! || 'https://api.mainnet-beta.solana.com');

            this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL!);
            this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY_ETH!, this.provider);

            console.log(`Solana Wallet loaded: ${this.solKeypair.publicKey.toBase58()}`);
        } catch (error) {
            console.error("Error loading Solana Wallet:", error);
            throw new Error("Manual decodification of base58 failed.");
        }
    }

    async fundAccount(amount: string, vaultAddress: string) {
        console.log(`Starting deposit ${amount} to Pacifica Vault...`);

        try {
            const tx = await this.wallet.sendTransaction({
                to: vaultAddress,
                value: ethers.parseEther(amount) // eth
            });
            return tx;
        } catch (error: any) {
            console.error(`Error funding ethereum account: ${error.message}`);
            throw error;
        }
    }

    async fundSolana(toAddress: string, amountInSol: number) {
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: this.solKeypair.publicKey,
          toPubkey: new PublicKey(toAddress),
          lamports: amountInSol * 1e9,
        })
      );

      const signature = await sendAndConfirmTransaction(
        this.solConnection,
        transaction,
        [this.solKeypair]
      );

      return { success: true, signature };
    } catch (error: any) {
      console.error("Error funding solana account:", error.message);
      throw error;
    }
  }

    async getBalances() {
        const ethBalance = await this.provider.getBalance(this.wallet.address);
        const solBalance = await this.solConnection.getBalance(this.solKeypair.publicKey);

        return {
        evm: ethers.formatEther(ethBalance),
        solana: solBalance / 1e9,
        addressEvm: this.wallet.address,
        addressSolana: this.solKeypair.publicKey.toBase58()
        };
  }

}