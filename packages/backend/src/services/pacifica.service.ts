import WebSocket from "ws";

export interface PacificaPriceData {
    symbol: string;
    price: string;
    timestamp: number;
}

export class PacificaService {
    private ws: WebSocket | null = null;
    private readonly WsUrl = 'wss://ws.pacifica.fi/ws'; //'wss://test-ws.pacifica.fi/ws'
    private reconnectAttemp = 0;
    private readonly maxReconnectDelay = 30000;

    constructor(private onPriceUpdate: (data: PacificaPriceData) => void) { }

    public connect() {
        console.log(`Connecting to Pacifica websocket: ${this.WsUrl}`);
        this.ws = new WebSocket(this.WsUrl);

        this.ws.on('open', () => {
            console.log(`Connection established to Pacifica Websocket`);
            this.reconnectAttemp = 0;

            const subscribeMsg = {
                method: "subscribe",
                params: {
                    source: "prices",
                    symbol: "BTC"
                }
            }
            this.ws?.send(JSON.stringify(subscribeMsg));
        });

        this.ws.on('message', (data: WebSocket.Data) => {
            try {
                const res = JSON.parse(data.toString());

                if (res.channel === 'prices' && res.data) {
                    const priceInfo = res.data.find((item: any) => item.symbol === 'BTC');

                    if (priceInfo) {
                        this.onPriceUpdate({
                            symbol: priceInfo.symbol,
                            price: priceInfo.mark,
                            timestamp: priceInfo.timestamp
                        });
                    }
                }
            } catch (error: any) {
                console.error('Error parsing message', error.message);
            }
        });

        this.ws.on('error', (error) => {
            console.error('Error in websocket:', error.message);
        });

        this.ws.on('close', () => {
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttemp), this.maxReconnectDelay);
            console.warn(`Connection delay in ${delay / 1000}s...`);

            this.reconnectAttemp++;
            setTimeout(() => this.connect(), delay);
        })
    }

    public disconnect() {
        if (this.ws) {
            this.ws.close();
            console.log('Pacifica websocket disconnected manually successfully');
        }
    }
}