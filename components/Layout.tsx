
import React from 'react';
import { Settings, Compass } from 'lucide-react';

interface HeaderProps {
  onSettingsClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  return (
    <header className="py-10 flex items-center justify-between sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5 px-2">
      <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.location.reload()}>
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center text-white font-outfit shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all group-hover:rotate-12 duration-500">
          <Compass size={22} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-2xl font-outfit font-black text-slate-100 tracking-widest leading-none mb-1">UNVAGUE</h2>
          <div className="flex items-center gap-2">
             <span className="text-[8px] uppercase font-bold tracking-[0.4em] text-emerald-400/60">Expectation Translator</span>
          </div>
        </div>
      </div>

      <button 
        onClick={onSettingsClick}
        className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-100 transition-all rounded-xl hover:bg-slate-900 border border-transparent hover:border-white/5"
        aria-label="Settings and Privacy"
      >
        <Settings size={20} strokeWidth={1.5} />
      </button>
    </header>
  );
};
