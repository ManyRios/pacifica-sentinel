import { useState } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Connection } from '@solana/web3.js'
import { BiWallet, BiCopy, BiRocket, BiCheckCircle } from 'react-icons/bi'
import { SiEthereum, SiSolana } from 'react-icons/si'
import { FundingProps } from '../types'


export const FundingModule = ({ solBalance, ethBalance, solVault, ethVault, isOnline }: FundingProps) => {
  const { authenticated, login } = usePrivy()
  const { wallets } = useWallets()

  const [activeChain, setActiveChain] = useState<'SOL' | 'ETH'>('SOL')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const currentVault = activeChain === 'SOL' ? solVault : ethVault
  const currentBalance = activeChain === 'SOL' ? solBalance : ethBalance

  const handleCopy = () => {
    navigator.clipboard.writeText(currentVault)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  };

  const handleDeposit = async () => {
    if (!authenticated) return login();
    
    const wallet = wallets.find((w) => 
      activeChain === 'SOL' ? w.walletClientType === 'solana' : w.connectorType !== 'solana'
    ) || wallets[0];

    if (!wallet) return alert("Connect your wallet");

    setLoading(true);
    try {
        //SOLANA
      if (activeChain === 'SOL') {
        const connection = new Connection(import.meta.env.VITE_RPC_SOLANA || 'https://api.mainnet-beta.solana.com');
        const fromPubkey = new PublicKey(wallet.address);
        const toPubkey = new PublicKey(solVault);

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey,
            toPubkey,
            lamports: 0.1 * LAMPORTS_PER_SOL,
          })
        );

        const { blockhash } = await connection.getLatestBlockhash()
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = fromPubkey;

        const provider = await (wallet as any).getProvider()
        const { signature } = await provider.request({
          method: 'signAndSendTransaction',
          params: { message: transaction.serialize().toString('base64') }
        });
        
        console.log("Solana Tx Signature:", signature);
      } else {
        //ETHEREUM
        const provider = await wallet.getEthereumProvider();
        const txHash = await provider.request({
          method: 'eth_sendTransaction',
          params: [{
            from: wallet.address,
            to: ethVault,
            value: '0x2386F26FC10000', // 0.01 ETH Hex
          }],
        });
        console.log("Ethereum Tx Hash:", txHash);
      }

      alert(`Depósito enviado con éxito a la bóveda de ${activeChain}`);
    } catch (error: any) {
      console.error("Error en depósito:", error);
      alert("Error: " + (error.message || "Falla en la transacción"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BiRocket className="text-indigo-400 text-lg" />
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Multichain Vault</h2>
        </div>
        <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
      </div>
      <div className="flex gap-2 mb-6 bg-black/40 p-1 rounded-2xl border border-white/5">
        <button 
          onClick={() => setActiveChain('SOL')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold transition-all ${activeChain === 'SOL' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <SiSolana size={14} /> SOLANA
        </button>
        <button 
          onClick={() => setActiveChain('ETH')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold transition-all ${activeChain === 'ETH' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <SiEthereum size={14} /> ETHEREUM
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-white/5 border border-white/10 p-5 rounded-3xl relative overflow-hidden group">
          <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Current AUM ({activeChain})</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-white">
              {parseFloat(currentBalance as string).toFixed(4)}
            </span>
            <span className="text-sm font-bold text-gray-600 pb-1">{activeChain}</span>
          </div>
        </div>

        {/* Sección de Depósito Multichain */}
        <div className="p-5 rounded-3xl bg-indigo-500/5 border border-indigo-500/20">
          <p className="text-[10px] text-indigo-400 font-bold uppercase mb-3 text-center">
            {activeChain === 'SOL' ? 'Solana' : 'Ethereum'} Deposit Address
          </p>
          
          <div className="flex items-center justify-between bg-black/40 p-3 rounded-2xl border border-white/5 mb-4 group hover:border-indigo-500/30 transition-all">
            <code className="text-[10px] text-gray-400 truncate mr-2 font-mono">
              {currentVault ? `${currentVault.slice(0, 8)}...${currentVault.slice(-8)}` : 'Fetching address...'}
            </code>
            <button 
              onClick={handleCopy}
              className="text-indigo-400 hover:text-white transition-colors"
            >
              {copied ? <BiCheckCircle size={18} className="text-green-400" /> : <BiCopy size={18} />}
            </button>
          </div>

          <button
            onClick={handleDeposit}
            disabled={loading} 
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl text-xs font-black transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
           >
            <BiWallet size={18} />
            {loading ? 'Sending...' : `DEPOSIT ${activeChain === 'SOL' ? '0.1 SOL' : '0.01 ETH'}`}
          </button>
        </div>
      </div>
      
      <div className="mt-6 flex items-center gap-3 p-3 bg-white/2 rounded-2xl border border-white/5">
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <BiRocket className="text-indigo-400" size={16} />
        </div>
        <p className="text-[9px] text-gray-500 leading-tight">
          Sentinel monitoring both <span className="text-white">EVM</span> and <span className="text-white">Solana</span> liquidity flows.
        </p>
      </div>
    </div>
  );
};