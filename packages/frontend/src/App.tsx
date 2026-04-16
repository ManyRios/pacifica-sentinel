import { useState, useEffect } from 'react'
import axios from 'axios'
import { Navbar } from './components/Navbar'
import { PriceCharts } from './components/PriceChart'
import { HiLightningBolt } from 'react-icons/hi'
import { BiPulse } from 'react-icons/bi'
import { WhaleFeed } from './components/WhaleFeed'
import { StatCard } from './components/StatCard'
import { FundingModule } from './components/FundWallet'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function App() {
  const [data, setData] = useState<any>(null)
  const [btcPrice, setBtcPrice] = useState(0)
  const [isOnline, setIsOnline] = useState(false)
  const [latency, setLatency] = useState(0)


  useEffect(() => {
    const fetchData = async () => {
      const start = Date.now();
      try {
        const res = await axios.get(`${API_URL}/status`)
        setLatency(Date.now() - start)
        setData(res.data)
        setIsOnline(true)
        if (res.data.market?.price) {
          setBtcPrice(parseFloat(res.data.market.price));
        }
      } catch (e) {
        setIsOnline(false)
        setLatency(0);
      }
    };

    const interval = setInterval(fetchData, 2000)
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-purple-600/5 blur-[100px] rounded-full" />
      </div>

      <Navbar isOnline={isOnline} />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`relative flex h-2 w-2`}>
                {isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">
                System {isOnline ? 'Live' : 'Offline'}
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight">
              Operational <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">Dashboard</span>
            </h1>
            <p className="text-gray-400 mt-2 max-w-md text-sm leading-relaxed">
              Real time monitoring multichain signals, whale flow and algorithmic execution.
            </p>
          </div>

          <div className="flex gap-3">
            <StatCard
              label="Network Latency"
              value={`${latency}ms`}
              icon={<HiLightningBolt className="text-yellow-400" />}
            />
            <StatCard
              label="Active Signals"
              value={data?.activeSignals || '0'}
              icon={<BiPulse className="text-indigo-400" />}
            />
            {/* <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3">
              <HiLightningBolt className="text-yellow-400 text-xl" />
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Network Latency</p>
                <p className="text-sm font-mono">24ms</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3">
              <BiPulse className="text-indigo-400 text-xl" />
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Active Signals</p>
                <p className="text-sm font-mono">03</p>
              </div>
            </div> */}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <section className="lg:col-span-8 space-y-6">

            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
              <PriceCharts currentPrice={btcPrice} />
            </div>
            { /*   
              btcPrice ? () : (
                <div className="h-100 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <p className="text-gray-500 font-medium animate-pulse">Waiting for Market Data...</p>
                </div>
              )
             */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl h-64 overflow-hidden">
                <WhaleFeed whales={data?.whales || []} />
              </div>
              {/* <div className="p-6 bg-white/5 border border-white/10 rounded-3xl h-48">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Solana Whale Alerts</h2>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl h-48">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Ethereum Whale Alerts</h2>
              </div> */}
            </div>
          </section>

          <aside className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-linear-to-b from-indigo-600/10 to-transparent border border-indigo-500/20 rounded-3xl">
              <FundingModule
                solBalance={data?.solData?.balance || "0.0000"} 
                ethBalance={data?.ethData?.balance || "0.0000"} 
                solVault={data?.solData?.vault || ""} 
                ethVault={data?.ethData?.vault || ""}
                isOnline={isOnline}
              />
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Active Strategy</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Mode:</span>
                  <span className="text-green-400 font-bold">Conservative</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Asset:</span>
                  <span className="font-mono">BTC</span>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  )
}

export default App
