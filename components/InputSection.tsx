
import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Send, X, MessageSquareOff, FileText, AlertTriangle } from 'lucide-react';

interface InputSectionProps {
  onAnalyze: (input: string | { data: string; mimeType: string }) => void;
  isAnalyzing: boolean;
  error: string | null;
}

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isAnalyzing, error }) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedImage(base64String);
        setMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleAnalyzeClick = (isSilence = false) => {
    if (isSilence) {
      onAnalyze("The situation is a lack of response or silence from the other party.");
      return;
    }

    if (selectedImage && mimeType) {
      const base64Data = selectedImage.split(',')[1];
      onAnalyze({ data: base64Data, mimeType });
    } else if (inputText.trim()) {
      onAnalyze(inputText.trim());
    }
  };

  return (
    <div className="space-y-8">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
        
        <div className="relative bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
               <FileText size={16} />
            </div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
              Interaction Desk
            </p>
          </div>

          <div className="space-y-6">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste a message, describe a situation, or summarize a conversation..."
              className="w-full min-h-[180px] p-6 text-slate-100 bg-slate-950/50 rounded-3xl border border-slate-800/50 resize-none outline-none text-lg leading-relaxed placeholder:text-slate-600 focus:border-emerald-500/50 transition-all shadow-inner"
              disabled={isAnalyzing}
            />
            
            {selectedImage && (
              <div className="p-4 bg-slate-950 rounded-3xl border border-slate-800 relative group/img animate-in zoom-in-95 duration-500">
                <img 
                  src={selectedImage} 
                  alt="Upload" 
                  className="max-h-72 rounded-2xl mx-auto shadow-2xl"
                />
                <button 
                  onClick={() => { setSelectedImage(null); setMimeType(null); }}
                  className="absolute top-6 right-6 p-3 bg-rose-600 text-white rounded-2xl hover:bg-rose-500 shadow-xl transition-all scale-0 group-hover/img:scale-100"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
              <div className="flex items-center gap-3 p-1.5 bg-slate-950 rounded-[1.8rem] border border-slate-800 shadow-inner">
                <button 
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800 rounded-2xl transition-all"
                  title="Camera Capture"
                >
                  <Camera size={20} strokeWidth={1.5} />
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800 rounded-2xl transition-all"
                  title="Gallery Upload"
                >
                  <ImageIcon size={20} strokeWidth={1.5} />
                </button>
                <div className="w-px h-6 bg-slate-800 mx-1"></div>
                <button 
                  onClick={() => handleAnalyzeClick(true)}
                  className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-2xl transition-all"
                  title="Analyze Silence"
                >
                  <MessageSquareOff size={20} strokeWidth={1.5} />
                </button>
              </div>

              <button
                onClick={() => handleAnalyzeClick(false)}
                disabled={(!inputText.trim() && !selectedImage) || isAnalyzing}
                className="flex items-center gap-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-10 py-4 rounded-[1.8rem] font-bold shadow-xl shadow-emerald-500/20 disabled:opacity-20 disabled:shadow-none hover:from-emerald-500 hover:to-emerald-600 transition-all active:scale-[0.97] group"
              >
                <span className="text-sm tracking-wide">{isAnalyzing ? "Processing..." : "Translate"}</span>
                <Send size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
      <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileUpload} />

      {error && (
        <div className="p-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-3xl text-sm font-medium animate-in slide-in-from-top-4 duration-500">
          <div className="flex gap-3">
             <AlertTriangle size={18} className="shrink-0" />
             <p>{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputSection;
