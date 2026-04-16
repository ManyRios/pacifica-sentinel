//import { whalesInitial } from '../utils/utils'
import { SiEthereum, SiSolana } from 'react-icons/si'


export const WhaleFeed = ({ whales }: { whales: any[] }) => (
    <div className="p-6 bg-white/5 border border-white/10 rounded-3xl h-72 overflow-hidden flex flex-col">
      <h2 className="text-xs font-bold text-gray-500 uppercase mb-4">Live Whale Tracker</h2>
      <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1">
        {whales.length > 0 ? whales.map((tx) => (
          <div key={tx.id} className="bg-white/5 p-3 rounded-xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              {tx.chain === 'SOLANA' ? <SiSolana className="text-teal-400"/> : <SiEthereum className="text-blue-400"/>}
              <span className="text-sm font-bold">{tx.amount} {tx.asset}</span>
            </div>
            <span className="text-[10px] text-gray-500">{tx.time}</span>
          </div>
        )) : (
          <p className="text-gray-600 text-xs text-center mt-10">Searching for large movements...</p>
        )}
      </div>
    </div>
)