
import React, { useState } from 'react';
import { AnalysisResult, ResponseOption } from '../types';
import RiskMeter from './RiskMeter';
import { 
  Info, CheckCircle2, AlertTriangle, EyeOff, Scale, 
  MessageSquare, Copy, Check, ChevronDown, ChevronUp, 
  ShieldCheck, HelpCircle, Sparkles, Zap, Target, Share
} from 'lucide-react';

interface AnalysisViewProps {
  analysis: AnalysisResult;
}

const Section: React.FC<{ 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode;
  accent?: string;
  defaultOpen?: boolean;
}> = ({ title, icon, children, accent = "emerald", defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const colors: Record<string, string> = {
    emerald: "from-emerald-500/10 to-transparent border-emerald-500/20",
    sage: "from-emerald-400/10 to-transparent border-emerald-400/20",
    indigo: "from-indigo-500/10 to-transparent border-indigo-500/20",
    rose: "from-rose-500/10 to-transparent border-rose-500/20",
    slate: "from-slate-500/10 to-transparent border-slate-500/20",
  };

  const textAccentColors: Record<string, string> = {
    emerald: "text-emerald-400",
    sage: "text-emerald-300",
    indigo: "text-indigo-400",
    rose: "text-rose-400",
    slate: "text-slate-400",
  };

  return (
    <div className={`rounded-[2.5rem] border bg-slate-900/40 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/5 ${colors[accent] || colors.emerald}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-8 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-xl bg-slate-800 ${textAccentColors[accent] || textAccentColors.emerald}`}>
            {icon}
          </div>
          <span className="font-outfit font-bold text-slate-100 tracking-tight text-lg">{title}</span>
        </div>
        {isOpen ? <ChevronUp size={16} className="text-slate-600" /> : <ChevronDown size={16} className="text-slate-600" />}
      </button>
      
      {isOpen && (
        <div className="px-8 pb-8 text-slate-300 text-[16px] leading-relaxed animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="h-px bg-slate-800/50 mb-6" />
          {children}
        </div>
      )}
    </div>
  );
};

const AnalysisView: React.FC<AnalysisViewProps> = ({ analysis }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copySummaryStatus, setCopySummaryStatus] = useState(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyFullSummary = () => {
    const summary = `
EXPECTATION TRANSLATION
-----------------------
What was said: ${analysis.whatWasSaid}
Likely Expectations: ${analysis.whatIsExpected.join(', ')}
What is optional: ${analysis.whatIsOptional.join(', ')}
Risks: ${analysis.whatCarriesRisk.join(', ')}
What this is NOT: ${analysis.whatIsNotAskingFor.join(', ')}
Risk Meter: ${analysis.riskMeter.score}/5 - ${analysis.riskMeter.explanation}
    `.trim();
    navigator.clipboard.writeText(summary);
    setCopySummaryStatus(true);
    setTimeout(() => setCopySummaryStatus(false), 2000);
  };

  const confColors = {
    High: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    Medium: "text-amber-400 border-amber-500/20 bg-amber-500/5",
    Low: "text-rose-400 border-rose-500/20 bg-rose-500/5"
  };

  return (
    <div className="space-y-10 pb-32">
      {/* Utility Toolbar */}
      <div className="flex justify-end px-2">
         <button 
           onClick={handleCopyFullSummary}
           className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${copySummaryStatus ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-200'}`}
         >
           {copySummaryStatus ? <Check size={14} /> : <Share size={14} />}
           {copySummaryStatus ? 'Summary Copied' : 'Copy Full Summary'}
         </button>
      </div>

      {/* 1. Literal Content Anchor */}
      <div className="p-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] border border-slate-700/50 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full -mr-40 -mt-40 blur-3xl pointer-events-none transition-all group-hover:bg-emerald-500/10 duration-1000" />
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare size={16} className="text-emerald-400" />
          <span className="text-[10px] font-bold text-emerald-400/60 uppercase tracking-[0.3em]">
            {analysis.whatWasSaid.length < 50 ? 'Literal Restatement' : 'Core Observation'}
          </span>
        </div>
        <p className="text-3xl font-outfit leading-snug font-light text-white opacity-90 tracking-tight italic">
          "{analysis.whatWasSaid}"
        </p>
      </div>

      {/* 2. Confidence Signal */}
      <div className={`p-8 rounded-[2.5rem] border ${confColors[analysis.confidence.level]} flex items-start gap-6 shadow-sm backdrop-blur-md`}>
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 text-inherit shadow-lg">
          <HelpCircle size={24} strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">
              Clarity Confidence: {analysis.confidence.level}
            </h4>
          </div>
          <p className="text-[15px] text-slate-200 leading-relaxed font-medium max-w-lg">
            {analysis.confidence.reason}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* 3. Expected Actions */}
        <Section title="What is likely expected" icon={<Target size={20} />} accent="emerald">
          <ul className="space-y-6">
            {analysis.whatIsExpected.map((item, i) => (
              <li key={i} className="flex gap-5 group">
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5 transition-transform group-hover:scale-125">
                   <Zap size={10} className="text-emerald-400" />
                </div>
                <span className="font-medium text-slate-100 text-lg leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* 4. Dual Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Section title="Optional elements" icon={<Info size={20} />} accent="sage" defaultOpen={false}>
            <ul className="space-y-4">
              {analysis.whatIsOptional.map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 mt-2.5 shrink-0" />
                  <span className="text-slate-400 font-light">{item}</span>
                </li>
              ))}
            </ul>
          </Section>
          <Section title="Bounded risks" icon={<AlertTriangle size={20} />} accent="rose" defaultOpen={false}>
            <ul className="space-y-4">
              {analysis.whatCarriesRisk.map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500/40 mt-2.5 shrink-0" />
                  <span className="text-slate-400 font-light">{item}</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        {/* 5. The "NOT" Section */}
        <Section title="What this is NOT asking for" icon={<EyeOff size={20} />} accent="slate">
          <div className="p-6 bg-slate-900/50 rounded-3xl border border-white/5">
            <ul className="space-y-4">
              {analysis.whatIsNotAskingFor.map((item, i) => (
                <li key={i} className="flex gap-4 group">
                  <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-1">
                    <Check size={10} className="text-slate-500" />
                  </div>
                  <span className="text-slate-400 font-light italic group-hover:text-slate-200 transition-colors">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* 6. Dynamics */}
        <Section title="Social Etiquette & Rules" icon={<Scale size={20} />} accent="emerald" defaultOpen={false}>
          <ul className="space-y-5">
            {analysis.hiddenRules.map((item, i) => (
              <li key={i} className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500/30 mt-2.5 shrink-0" />
                <span className="text-slate-300 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* 7. Impact Assessment */}
        <div className="p-12 rounded-[3.5rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl overflow-hidden relative">
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
          <div className="flex items-center gap-3 mb-10">
             <ShieldCheck size={18} className="text-emerald-400" />
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Complexity Score</span>
          </div>
          <RiskMeter score={analysis.riskMeter.score} explanation={analysis.riskMeter.explanation} />
        </div>
      </div>

      {/* 8. Choice Support */}
      <div className="pt-32 space-y-12">
        <div className="text-center space-y-4">
          <div className="w-16 h-[2px] bg-emerald-500/30 mx-auto mb-8"></div>
          <h3 className="font-outfit font-bold text-4xl text-white tracking-tight">Choice Support</h3>
          <p className="text-slate-500 text-lg leading-relaxed max-w-md mx-auto font-light">
            You are free to choose the response that best matches your energy and intention.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          {analysis.responseSupport.map((option, i) => (
            <div key={i} className="p-10 rounded-[3.5rem] border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 transition-all duration-500 space-y-8 relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles size={120} />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <span className="px-6 py-2.5 bg-slate-800 text-emerald-400 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] border border-white/5">
                    {option.type}
                  </span>
                  <div className="h-6 w-px bg-slate-800"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Risk</span>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(r => (
                        <div key={r} className={`w-3 h-1 rounded-full ${r <= option.riskLevel ? 'bg-rose-500' : 'bg-slate-800'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-10 bg-slate-950/60 rounded-[2.5rem] border border-white/5 relative group/code overflow-hidden">
                <p className="font-mono text-xl text-emerald-200 leading-relaxed pr-12">
                  {option.wording}
                </p>
                <button 
                  onClick={() => handleCopy(option.wording, `opt-${i}`)}
                  className="absolute top-8 right-8 p-4 bg-slate-800 text-slate-400 hover:text-white rounded-2xl shadow-lg border border-white/5 transition-all opacity-0 group-hover/code:opacity-100 hover:scale-110 active:scale-90"
                >
                  {copiedId === `opt-${i}` ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tone Profile</span>
                  </div>
                  <p className="text-slate-300 font-medium leading-relaxed bg-white/5 p-6 rounded-3xl border border-white/5">
                    {option.toneDescription}
                  </p>
                </div>
                <div className="space-y-4">
                   <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Anticipated Impact</span>
                  </div>
                  <p className="text-slate-300 font-medium leading-relaxed bg-white/5 p-6 rounded-3xl border border-white/5">
                    {option.socialImpact}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;
