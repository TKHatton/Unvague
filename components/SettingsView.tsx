
import React from 'react';
import { Shield, Database, Trash2, ArrowLeft, Lock, Info } from 'lucide-react';

interface SettingsViewProps {
  onBack: () => void;
  onClearHistory: () => void;
  historyCount: number;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onBack, onClearHistory, historyCount }) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700 max-w-xl mx-auto">
      <div className="flex items-center gap-6 mb-12">
        <button 
          onClick={onBack}
          className="p-4 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all rounded-3xl border border-slate-800"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-3xl font-outfit font-bold text-white tracking-tight">Settings</h2>
      </div>

      <div className="space-y-8">
        <section className="bg-slate-900 border border-slate-800 rounded-[3rem] p-12 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5">
             <Shield size={120} />
          </div>
          <div className="flex items-center gap-4 text-white">
            <Lock size={22} className="text-emerald-400" />
            <h3 className="font-outfit font-bold text-xl">Privacy & Trust</h3>
          </div>
          <p className="text-base text-slate-400 leading-relaxed font-light">
            Your clarity is personal. Analyses are processed through private instances of the Google Gemini API and are <span className="text-white font-medium">never used for model training</span>.
          </p>
          <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 text-emerald-400 rounded-2xl text-[10px] font-bold uppercase tracking-[0.25em] w-fit border border-emerald-500/20">
            <Database size={14} />
            <span>Local Encrypted Storage Only</span>
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-[3rem] p-12 shadow-2xl space-y-10">
          <div className="flex items-center gap-4 text-white">
            <Database size={22} className="text-emerald-400" />
            <h3 className="font-outfit font-bold text-xl">Data Control</h3>
          </div>
          <div className="flex items-center justify-between p-8 bg-slate-950 rounded-[2.5rem] border border-slate-800/50 shadow-inner">
            <div className="space-y-2">
              <p className="text-lg text-slate-100 font-bold font-outfit">Archive Memory</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{historyCount} items captured</p>
            </div>
            <button 
              onClick={onClearHistory}
              disabled={historyCount === 0}
              className="flex items-center gap-3 px-8 py-4 bg-rose-600/10 text-rose-500 border border-rose-500/20 rounded-3xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-rose-600 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <Trash2 size={16} />
              Clear Archive
            </button>
          </div>
        </section>

        <section className="p-8 text-center space-y-4">
           <div className="flex items-center justify-center gap-2 text-slate-600">
             <Info size={14} />
             <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Version 1.0.4 Stable</span>
           </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsView;
