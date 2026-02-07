
import React, { useState, useEffect } from 'react';
import { audio } from '../../services/AudioService';
import { ToolType, Language } from '../../types';
import { getTranslation } from '../../services/LocalizationService';

interface RngToolProps {
  onResult?: (result: string) => void;
  theme?: string;
  language: Language;
}

const RngTool: React.FC<RngToolProps> = ({ onResult, theme, language }) => {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [result, setResult] = useState<number | null>(null);
  const [displayResult, setDisplayResult] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isConfirmingPurge, setIsConfirmingPurge] = useState(false);
  const t = getTranslation(language);

  const generate = async () => {
    if (min >= max) return;
    
    setIsGenerating(true);
    setResult(null);
    setCopied(false);

    const finalVal = Math.floor(Math.random() * (max - min + 1)) + min;
    const speechPromise = audio.prefetchSpeech(finalVal.toString());

    let iterations = 0;
    const maxIterations = 20;

    const interval = setInterval(async () => {
      setDisplayResult(Math.floor(Math.random() * (max - min + 1)) + min);
      audio.playClick(0.015);
      iterations++;
      
      if (iterations >= maxIterations) {
        clearInterval(interval);
        setResult(finalVal);
        setDisplayResult(finalVal);
        setIsGenerating(false);
        audio.playBlip(770, 0.04);
        onResult?.(finalVal.toString());
        
        const buffer = await speechPromise;
        audio.playSpeechBuffer(buffer);
      }
    }, 50);
  };

  const copyToClipboard = () => {
    if (result !== null) {
      navigator.clipboard.writeText(result.toString());
      setCopied(true);
      audio.playBlip(1200, 0.02);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePurge = () => {
    if (!isConfirmingPurge) {
      setIsConfirmingPurge(true);
      audio.playClick(0.05);
      setTimeout(() => setIsConfirmingPurge(false), 3000);
      return;
    }
    setResult(null);
    setDisplayResult(null);
    setIsConfirmingPurge(false);
    audio.playBlip(220, 0.02);
  };

  return (
    <div className="w-full flex flex-col items-center max-w-4xl mx-auto py-2 sm:py-8">
      <div className="text-center mb-8 sm:mb-16 px-4">
        <h2 className="text-5xl sm:text-8xl font-black text-theme tracking-tighter mb-2 uppercase opacity-90">{t.tools[ToolType.NUMBER]}</h2>
        <p className="text-muted-theme text-[10px] tracking-[1em] uppercase font-black opacity-40">{t.bios[ToolType.NUMBER]}</p>
      </div>

      <div className="w-full max-lg px-4 mb-8 sm:mb-16">
        <div className="bg-surface/30 backdrop-blur-[40px] p-6 sm:p-10 rounded-[3rem] border border-border-theme shadow-2xl flex flex-col gap-6 sm:gap-10 transition-colors duration-500">
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div className="flex flex-col space-y-2 sm:space-y-3">
              <label className="text-[9px] uppercase tracking-widest text-muted-theme font-black ml-4">{t.common.min}</label>
              <input 
                type="number" 
                value={min} 
                onChange={(e) => setMin(parseInt(e.target.value) || 0)}
                className="w-full bg-bg/50 border border-theme/20 rounded-[1.5rem] px-6 py-4 text-theme focus:outline-none focus:border-accent transition-all mono font-black text-base sm:text-xl shadow-inner"
              />
            </div>
            <div className="flex flex-col space-y-2 sm:space-y-3">
              <label className="text-[9px] uppercase tracking-widest text-muted-theme font-black ml-4">{t.common.max}</label>
              <input 
                type="number" 
                value={max} 
                onChange={(e) => setMax(parseInt(e.target.value) || 0)}
                className="w-full bg-bg/50 border border-theme/20 rounded-[1.5rem] px-6 py-4 text-theme focus:outline-none focus:border-accent transition-all mono font-black text-base sm:text-xl shadow-inner"
              />
            </div>
          </div>
          
          <button
            onClick={generate}
            disabled={isGenerating}
            className="w-full py-6 sm:py-8 font-black rounded-[2rem] hover:opacity-90 active:scale-95 transition-all shadow-xl disabled:opacity-30 uppercase tracking-[0.4em] text-[10px] sm:text-xs"
            style={{ backgroundColor: 'var(--text)', color: 'var(--bg)' }}
          >
            {isGenerating ? t.common.consulting : t.common.generate}
          </button>
        </div>
      </div>

      <div className="min-h-[160px] sm:min-h-[300px] flex flex-col items-center justify-center w-full px-4 mb-12">
        {(isGenerating || displayResult !== null) && (
          <div className="animate-reveal flex flex-col items-center w-full">
            <p className="text-[9px] text-muted-theme uppercase tracking-[1em] font-black mb-10 opacity-40">{t.common.result}</p>
            <div className="relative group cursor-pointer" onClick={copyToClipboard}>
              <div 
                className="absolute -inset-8 sm:-inset-16 blur-[40px] sm:blur-[100px] rounded-full animate-pulse opacity-20" 
                style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.3)' }}
              />
              <div className="relative px-10 sm:px-28 py-10 sm:py-20 bg-surface/80 backdrop-blur-xl rounded-[4rem] border border-border-theme shadow-3xl flex items-center justify-center max-w-full overflow-hidden transition-colors duration-500">
                 <span className="text-5xl sm:text-[10rem] font-black text-theme tracking-tighter mono leading-none truncate drop-shadow-[0_0_20px_rgba(var(--accent-rgb),0.1)]">
                   {displayResult}
                 </span>
                 
                 {result !== null && !isGenerating && (
                    <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 border rounded-full transition-all duration-300 ${copied ? 'bg-theme border-theme shadow-lg' : 'bg-surface-alt border-border-theme opacity-60 sm:opacity-40 group-hover:opacity-100 group-hover:bg-theme group-hover:text-bg'}`}>
                        <span className={`text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${copied ? 'text-bg' : 'text-theme'}`}>
                            {copied ? t.common.copied : t.common.tapToCopy}
                        </span>
                    </div>
                 )}
              </div>
            </div>
            {result !== null && !isGenerating && (
              <button 
                onClick={handlePurge} 
                className={`mt-20 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${isConfirmingPurge ? 'text-red-500 scale-110' : 'text-muted-theme hover:text-red-500 opacity-60'}`}
              >
                {isConfirmingPurge ? t.common.confirmPurge : t.common.purge}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RngTool;
