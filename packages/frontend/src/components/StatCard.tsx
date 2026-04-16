import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
}

export const StatCard = ({ label, value, icon }: StatCardProps) => {
  return (
    <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-4 hover:bg-white/[0.07] transition-colors group">
      <div className="p-2 bg-black/40 rounded-xl border border-white/5 group-hover:border-white/20 transition-all shadow-inner">
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">
          {label}
        </p>
        <p className="text-sm font-mono font-black text-white leading-none">
          {value}
        </p>
      </div>
    </div>
  );
};