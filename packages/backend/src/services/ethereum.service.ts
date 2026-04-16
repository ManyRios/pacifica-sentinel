import { ethers } from 'ethers';

type EventCallback = (args: any[]) => void;

export class EthereumService {
    private provider: ethers.JsonRpcProvider;

    constructor(rpcUrl: string) {
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
    }

    async getBalance(address: string): Promise<string>{
        try {
            const res = await this.provider.getBalance(address);
            return ethers.formatEther(res);
        } catch (error: any) {
            console.error('Error Ethereum Balance:', error.message);
            return '0';
        }
    }

    async watchContractEvent(
         contractAdd: string, 
         abi: any, 
         eventName: string, 
         callback: EventCallback) {

        const contract = new ethers.Contract(contractAdd, abi, this.provider);
        console.log(`listening event ${eventName} on Ethereum...`);
    
        contract.on(eventName, (...args) => {
            callback(args);
        });
    }


}
