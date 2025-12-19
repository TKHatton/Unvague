
import React from 'react';

interface RiskMeterProps {
  score: number;
  explanation: string;
}

const RiskMeter: React.FC<RiskMeterProps> = ({ score, explanation }) => {
  const percentage = (score / 5) * 100;
  
  const getGradient = () => {
    if (score <= 1) return 'from-emerald-500 to-teal-400';
    if (score <= 2) return 'from-blue-500 to-indigo-400';
    if (score <= 3) return 'from-amber-500 to-orange-400';
    if (score <= 4) return 'from-orange-500 to-rose-400';
    return 'from-rose-600 to-red-500';
  };

  const getGlow = () => {
    if (score <= 1) return 'shadow-[0_0_15px_rgba(16,185,129,0.3)]';
    if (score <= 3) return 'shadow-[0_0_15px_rgba(245,158,11,0.3)]';
    return 'shadow-[0_0_15px_rgba(244,63,94,0.3)]';
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-end justify-between px-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Social Complexity</span>
          <span className="text-2xl font-outfit font-bold text-white leading-none">{score}<span className="text-slate-600 text-sm">/5</span></span>
        </div>
        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-[2px] border border-slate-700/50">
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${getGradient()} ${getGlow()} transition-all duration-1000 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      
      <div className="relative pl-6 py-1">
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-indigo-500/20 rounded-full"></div>
        <p className="text-sm text-slate-400 leading-relaxed font-light italic">
          {explanation}
        </p>
      </div>
    </div>
  );
};

export default RiskMeter;
