import { ExecutionService } from './execution.service';
import { ElfaService } from './elfa.service';


export class SignalService {
    
    constructor(
        private executor: ExecutionService,
        private elfa: ElfaService
    ){}
    
    async process(symbol: string, price: string, signals: { solanaWhale: boolean, ethWhale: boolean }){
        console.log(`Processing signals for ${symbol}`);
        try {
            const elfaAlpha = await this.elfa.getTokenIntelligence(symbol);

            let side: 'bid'| 'ask' | null = null;
            const amount = "0.01";

            if(elfaAlpha?.isBullish && (signals.solanaWhale || signals.ethWhale)){
                console.log(`SIGNAL BID: Elfa (${elfaAlpha.confidence}) + Whale detected.`);
                side = 'bid';
            }else if(elfaAlpha?.confidence < 0.3){
                console.log(`SIGNAL ASK: Sentiment Elfa extremly low (${elfaAlpha?.confidence}).`);
                side = 'ask';
            }

            if(side){
                console.log(`--Executing in Pacifica: ${side.toUpperCase()} ${amount} ${symbol}`);

                const cleanSymbol = symbol.replace('-PERP', '');

                return this.executor.placeMarketOrder(
                    cleanSymbol,
                    side,
                    amount
                );
            }else {
                console.log(`Waiting better conditions...`);
                return null;
            }

        } catch (error: any) {
            console.error('Signal Proccessor error: ', error.message);
            throw error;
        }
    }
}