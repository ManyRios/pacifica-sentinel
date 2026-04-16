export type TMarket = {
    symbol: string, 
    tick_size: string,
    min_tick: string,
    max_tick: string,
    lot_size: string,
    max_leverage: number,
    isolated_only: boolean,
    min_order_size: string,
    max_order_size: string,
    funding_rate: string,
    next_funding_rate: string,
    created_at: string
}

export type TPrices = {
    funding: string,
    mark: string,
    mid: string,
    next_funding: string,
    open_interest: string,
    oracle: string,
    symbol: string,
    timestamp: number,
    volume_24h: boolean,
    yesterday_price: string
}

export type TCandlePara = {
    symbol: string,
    interval: string,
    start_time: number,
    end_time: number
}

export type TCandleData = {
    t: number, //Candle start time
    T: number, //Candle end time
    s: string, //Symbol
    i: string, //Time interval of candles
    o: string, //Open price
    c: string, //Close price
    h: string, //High price
    l: string, //Low price
    v: string, //Volume
    n: number //Number of trades on Pacifica for specified symbol
}