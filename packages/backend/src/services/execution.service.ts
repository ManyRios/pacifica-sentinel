import axios from "axios";
import { ethers } from "ethers";
import { v4 as uuidv4 } from 'uuid';

const Mainnet = 'https://api.pacifica.fi/api/v1';
const Tesnet = 'https://test-api.pacifica.fi/api/v1'

export class ExecutionService {
    private wallet: ethers.Wallet;
    private readonly apiUrl = Tesnet || Mainnet;

    constructor(privateKey: string) {
        this.wallet = new ethers.Wallet(privateKey);
        console.log(`Ready to execute with wallet: ${this.wallet.address}`);
    }

    // Execute a market order
    async placeMarketOrder(symbol: string, side: 'bid' | 'ask', amount: string) {
        try {
            const time = Date.now();
            const clientOrderId = uuidv4();


            // OnlyOwner can open a position
            const message = `ORDER:${symbol}:${side}:${amount}:${time}:${clientOrderId}`;
            const signature = await this.wallet.signMessage(message);

            const payload = {
                account: this.wallet.address,
                signature: signature,
                timestamp: time,
                symbol: symbol,
                amount: amount,
                side: side,
                slippage_percent: 1,
                reduce_only: false,
                client_order_id: clientOrderId
            };

            console.log(`[EXECUTION] Sending order ${side} to ${symbol}`);

            const res = await axios.post(`${this.apiUrl}/orders/create_market`, payload, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (res.data) {
                console.log('Pacifica Response:', res.data);
                return res.data;
            }

        } catch (error: any) {
            const errorData = error.response?.data || error.message;
            console.error('Error Pacifica execution:', errorData);
            throw error;
        }
    }
}