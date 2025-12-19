
import React, { useState, useEffect } from 'react';
import { ContextMode, AnalysisResult, AppState } from './types';
import { CONTEXT_MODES } from './constants';
import { analyzeInput } from './services/geminiService';
import InputSection from './components/InputSection';
import AnalysisView from './components/AnalysisView';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';
import { Header } from './components/Layout';
import { Loader2, ArrowLeft, Archive, Brain, Sparkles, MoveRight } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentAnalysis: null,
    history: [],
    isAnalyzing: false,
    error: null,
    activeMode: ContextMode.WORK,
    showInsights: false,
  });

  const [view, setView] = useState<'input' | 'analysis' | 'history' | 'settings'>('input');

  useEffect(() => {
    const saved = localStorage.getItem('expectation_history');
    if (saved) {
      try {
        const historyData = JSON.parse(saved);
        setState(prev => ({ ...prev, history: historyData }));
      } catch (e) {
        console.error("Error loading history");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('expectation_history', JSON.stringify(state.history));
  }, [state.history]);

  const handleAnalyze = async (input: string | { data: string; mimeType: string }) => {
    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));
    try {
      const result = await analyzeInput(input, state.activeMode);
      setState(prev => ({
        ...prev,
        currentAnalysis: result,
        history: [result, ...prev.history].slice(0, 50),
        isAnalyzing: false,
      }));
      setView('analysis');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: err.message || "An unexpected error occurred."
      }));
    }
  };

  const handleReset = () => {
    setState(prev => ({ ...prev, currentAnalysis: null, error: null }));
    setView('input');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteFromHistory = (id: string) => {
    setState(prev => {
      const newHistory = prev.history.filter(h => h.id !== id);
      return {
        ...prev,
        history: newHistory,
        currentAnalysis: prev.currentAnalysis?.id === id ? null : prev.currentAnalysis
      };
    });
  };

  const clearHistory = () => {
    if (confirm("Are you sure you want to delete all translation history? This cannot be undone.")) {
      setState(prev => ({ ...prev, history: [] }));
      setView('input');
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto px-5 sm:px-8 transition-all duration-700 pb-20 text-slate-200">
      <Header onSettingsClick={() => setView('settings')} />
      
      <main className="flex-1">
        {view === 'input' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="text-center space-y-6 pt-16 pb-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[9px] font-bold uppercase tracking-[0.4em] border border-emerald-500/10">
                 <Sparkles size={10} />
                 Translation Engine Active
              </div>
              <h1 className="text-5xl sm:text-6xl font-outfit font-bold text-white tracking-tight leading-[1.1]">
                Social Clarity, <br/><span className="text-slate-700">on demand.</span>
              </h1>
              <p className="text-slate-500 text-base sm:text-lg max-w-sm mx-auto leading-relaxed font-light">
                Turn vague subtext into literal actions. No guessing, no masks, no pressure.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex flex-wrap gap-2 justify-center">
                {CONTEXT_MODES.map(mode => (
                  <button
                    key={mode}
                    onClick={() => setState(prev => ({ ...prev, activeMode: mode }))}
                    className={`px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                      state.activeMode === mode 
                        ? 'bg-white text-slate-950 shadow-lg shadow-emerald-500/5' 
                        : 'bg-slate-900/50 text-slate-500 border border-slate-800/50 hover:text-slate-300'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <InputSection 
                onAnalyze={handleAnalyze} 
                isAnalyzing={state.isAnalyzing}
                error={state.error}
              />
            </div>

            <div className="flex flex-col items-center gap-4 pt-4">
              <button 
                onClick={() => setView('history')}
                className="group flex items-center gap-3 py-4 px-8 bg-slate-900/40 border border-slate-800/50 rounded-2xl text-slate-500 hover:text-slate-200 transition-all"
              >
                <Archive size={16} strokeWidth={1.5} className="group-hover:rotate-[-10deg] transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">View Archive</span>
                <MoveRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        )}

        {view === 'analysis' && state.currentAnalysis && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="flex items-center justify-between py-8">
              <button 
                onClick={handleReset}
                className="group flex items-center gap-3 text-slate-500 hover:text-white transition-all bg-slate-900/50 px-5 py-2.5 rounded-xl border border-slate-800/50"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Translate New</span>
              </button>
              <div className="px-5 py-2.5 bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-[9px] font-bold uppercase tracking-[0.3em]">
                {state.currentAnalysis.mode} Context
              </div>
            </div>
            
            <AnalysisView analysis={state.currentAnalysis} />
          </div>
        )}

        {view === 'history' && (
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="flex items-center justify-between py-8">
              <button 
                onClick={() => setView('input')}
                className="group flex items-center gap-3 text-slate-500 hover:text-white transition-all bg-slate-900/50 px-5 py-2.5 rounded-xl border border-slate-800/50"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Back Home</span>
              </button>
              <h2 className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.4em]">The Archive</h2>
            </div>
            
            <div className="mb-10 p-8 rounded-[2.5rem] bg-slate-900/30 border border-slate-800/50 backdrop-blur-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-400">
                  <Brain size={18} strokeWidth={1.5} />
                  <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Pattern Observations</span>
                </div>
                <button 
                  onClick={() => setState(prev => ({ ...prev, showInsights: !prev.showInsights }))}
                  className={`text-[9px] font-bold px-5 py-2 rounded-xl transition-all duration-500 ${state.showInsights ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-500 hover:text-white'}`}
                >
                  {state.showInsights ? 'Insights Active' : 'Enable Insights'}
                </button>
              </div>
              
              {state.showInsights && state.history.length < 3 && (
                <p className="text-xs text-slate-500 italic font-light">Continue adding interactions to surface deep context observations.</p>
              )}
            </div>
            
            <HistoryView 
              history={state.history} 
              onSelect={(item) => {
                setState(prev => ({ ...prev, currentAnalysis: item }));
                setView('analysis');
              }}
              onDelete={deleteFromHistory}
              showPatterns={state.showInsights}
            />
          </div>
        )}

        {view === 'settings' && (
          <SettingsView 
            onBack={() => setView('input')} 
            onClearHistory={clearHistory}
            historyCount={state.history.length}
          />
        )}
      </main>

      {state.isAnalyzing && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-50 flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="bg-slate-900/80 p-12 rounded-[3rem] shadow-2xl border border-white/5 max-w-sm w-full text-center space-y-8">
            <div className="relative mx-auto w-20 h-20">
               <Loader2 className="animate-spin text-emerald-500 absolute inset-0" size={80} strokeWidth={1} />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-full blur-lg animate-pulse"></div>
               </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-outfit font-bold text-white tracking-tight">Deconstructing...</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-light">
                Removing ambiguity and identifying unstated requests.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
