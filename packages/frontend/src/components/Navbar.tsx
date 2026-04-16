import { usePrivy } from '@privy-io/react-auth'
import { useState } from 'react'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { RiShieldFlashFill } from 'react-icons/ri'
import { MdOutlineDashboardCustomize } from 'react-icons/md'
import { SiSolana, SiEthereum } from 'react-icons/si'

export const Navbar = ({ isOnline }: { isOnline: boolean }) => {
    const { login, logout, authenticated, user } = usePrivy()
    const [isOpen, setIsOpen] = useState(false)

    const formatAddress = (address?: string) => {
        if (!address) return ''
        return `${address.slice(0, 4)}...${address.slice(-4)}`
    }

    return (
        <nav className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-indigo-500 rounded-lg blur opacity-25"></div>
                            <div className="relative bg-black p-2 rounded-lg border border-indigo-500/50">
                                <RiShieldFlashFill className="w-6 h-6 text-indigo-400" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-black tracking-tighter text-white leading-none">
                                PACIFICA
                            </span>
                            <span className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] leading-none mt-1">
                                SENTINEL
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <button 
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-all text-sm font-semibold py-2 px-3 rounded-lg hover:bg-white/5 hover:cursor-pointer"
                        >
                            <MdOutlineDashboardCustomize className="text-lg" />
                            Monitor
                        </button>

                        <div className="h-6 w-px bg-white/10 mx-2" />

                        {!authenticated ? (
                            <button
                                onClick={login}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all active:scale-95 hover:cursor-pointer"
                            >
                                Connect Wallet
                            </button>
                        ) : (
                            <div className="flex items-center gap-3 bg-white/5 p-1.5 pl-4 rounded-2xl border border-white/10">
                                <div className="flex flex-col items-end">
                                    <span className="text-[11px] font-mono text-gray-300">
                                        {formatAddress(user?.wallet?.address)}
                                    </span>
                                </div>
                                {user?.wallet?.chainType === 'solana' ? (
                                    <SiSolana className="text-teal-400 text-sm" title="Solana Network" />
                                ) : (
                                    <SiEthereum className="text-blue-400 text-sm" title="EVM Network" />
                                )}
                                <button
                                    onClick={logout}
                                    className="bg-red-500/10 hover:bg-red-500/20 p-2 rounded-xl text-red-500 transition-colors"
                                >
                                    <HiX className="text-lg" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                            {isOpen ? <HiX className="text-2xl" /> : <HiMenuAlt3 className="text-2xl" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-[#0a0a0a] border-b border-white/5 px-4 py-6 space-y-4 animate-in fade-in slide-in-from-top-4">
                    <button
                        onClick={() => window.location.reload()}
                        className={`flex items-center gap-2 transition-all text-sm font-semibold py-2 px-3 rounded-lg ${isOnline ? 'text-gray-400 hover:text-white' : 'text-red-400 opacity-50'}`}
                    >
                        <MdOutlineDashboardCustomize className="text-xl" />
                        {isOnline ? 'Monitoring Live' : 'System Disconnected'}
                    </button>
                    {!authenticated ? (
                        <button onClick={login} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg">
                            CONNECT WALLET
                        </button>
                    ) : (
                        <button onClick={logout} className="w-full bg-red-500/10 text-red-500 py-4 rounded-2xl font-bold border border-red-500/20">
                            LOGOUT
                        </button>
                    )}
                </div>
            )}
        </nav>
    )
}