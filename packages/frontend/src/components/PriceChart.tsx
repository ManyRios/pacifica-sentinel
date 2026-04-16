import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { initialDataChart } from '../utils/utils';
import { BiTrendingUp, BiTrendingDown } from 'react-icons/bi';
import { PricePoint } from '../types'

export const PriceCharts = ({ currentPrice }: { currentPrice: number }) => {
    const [data, setData] = useState<any[]>(initialDataChart)

    useEffect(() => {
        if (currentPrice > 0) {
            const now = new Date();
            const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`

            setData((prevData) => {
                const newData = [...prevData, { time: timeStr, price: currentPrice }]
                if (newData.length > 30) return newData.slice(1)
                return newData;
            });
        }
    }, [currentPrice]);

    const latestPrice = data[data.length - 1]?.price
    const previousPrice = data[data.length - 2]?.price
    const isUp = latestPrice >= previousPrice

    const formatYAxis = (val: number) => `$${(val / 1000).toFixed(1)}k`

    return (
        <div className="h-100 w-full p-4 select-none">
      <div className="flex justify-between items-center mb-6 px-4">
        <div>
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Market Feed: BTC/USD</h3>
          <p className="text-2xl font-black text-white font-mono">
            ${currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded-md border border-green-500/20 font-bold">
            LIVE FROM PACIFICA
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
          <XAxis 
            dataKey="time" 
            hide 
          />
          <YAxis 
            domain={['auto', 'auto']} 
            orientation="right"
            tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 'bold' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatYAxis}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px', fontSize: '12px' }}
            itemStyle={{ color: '#818cf8' }}
            labelStyle={{ display: 'none' }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#818cf8"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorPrice)"
            animationDuration={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    )
}