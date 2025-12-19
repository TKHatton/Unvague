
import React from 'react';
import { AnalysisResult } from '../types';
import { Trash2, ChevronRight, Brain, Clock as ClockIcon, Layers } from 'lucide-react';

interface HistoryViewProps {
  history: AnalysisResult[];
  onSelect: (item: AnalysisResult) => void;
  onDelete: (id: string) => void;
  showPatterns?: boolean;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelect, onDelete, showPatterns }) => {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-700 space-y-6">
        <div className="w-20 h-20 bg-slate-900 rounded-[2.5rem] flex items-center justify-center border border-slate-800">
           <Layers size={32} strokeWidth={1} className="opacity-20" />
        </div>
        <p className="text-[10px] uppercase font-bold tracking-[0.4em] opacity-40">Archive is Empty</p>
      </div>
    );
  }

  // Robust pattern recognition
  const patterns = {
    vagueCount: history.filter(h => h.riskMeter?.score >= 4).length,
    frequentMode: history.reduce((acc, curr) => {
      acc[curr.mode] = (acc[curr.mode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  const entries = Object.entries(patterns.frequentMode);
  const dominantMode = entries.length > 0 
    ? entries.sort((a, b) => b[1] - a[1])[0][0] 
    : null;

  return (
    <div className="space-y-12 pb-12">
      {showPatterns && history.length >= 3 && dominantMode && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="p-10 rounded-[3rem] bg-emerald-700 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl pointer-events-none group-hover:bg-white/20 transition-all duration-1000" />
            <div className="flex items-center gap-3 mb-6">
              <Brain size={18} />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Neural Observations</span>
            </div>
            <p className="text-xl font-outfit leading-relaxed font-light">
              Interactions in <span className="font-bold underline underline-offset-8 decoration-white/30">{dominantMode}</span> settings are appearing most frequently. 
              {patterns.vagueCount > 2 
                ? " Analysis suggests a pattern of high complexity or unstated expectations in this context." 
                : " These interactions are maintaining a relatively low complexity profile."}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {history.map((item) => (
          <div 
            key={item.id}
            className="group relative"
          >
            <div 
              className="relative p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] hover:border-emerald-500/30 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-emerald-500/5 flex items-center justify-between overflow-hidden"
              onClick={() => onSelect(item)}
            >
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 rounded-[1.8rem] bg-slate-950 flex items-center justify-center text-slate-500 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-700 border border-slate-800 group-hover:border-transparent">
                  <ClockIcon size={24} strokeWidth={1.5} />
                </div>
                <div className="space-y-2 overflow-hidden">
                  <h4 className="text-lg font-outfit font-bold text-slate-100 truncate max-w-[200px] sm:max-w-[320px]">
                    {item.whatWasSaid || "Observation Captured"}
                  </h4>
                  <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    <div className="w-1 h-1 rounded-full bg-slate-800"></div>
                    <span className="text-emerald-400/80">{item.mode}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 pl-4">
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if(confirm("Remove this entry from archive?")) onDelete(item.id); 
                  }}
                  className="p-4 text-slate-700 hover:text-rose-400 hover:bg-rose-500/5 rounded-2xl transition-all"
                  title="Remove from archive"
                  aria-label="Delete entry"
                >
                  <Trash2 size={20} strokeWidth={1.5} />
                </button>
                <div className="p-4 bg-slate-950 rounded-2xl text-slate-600 group-hover:text-white group-hover:bg-emerald-600 transition-all">
                  <ChevronRight size={20} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;
