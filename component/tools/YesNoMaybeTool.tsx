
import React, { useState, useEffect } from 'react';
import { audio } from '../../services/AudioService';
import { ToolType, Language } from '../../types';
import { getTranslation } from '../../services/LocalizationService';

interface YesNoMaybeToolProps {
  onResult?: (result: string) => void;
  theme?: string;
  language: Language;
}

const YesNoMaybeTool: React.FC<YesNoMaybeToolProps> = ({ onResult, theme, language }) => {
  const [answer, setAnswer] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState<string>("");
  const [isThinking, setIsThinking] = useState(false);
  const [isConfirmingPurge, setIsConfirmingPurge] = useState(false);
  const t = getTranslation(language);

  const options = [t.common.yes, t.common.no, t.common.maybe, "WAIT", "..."];

  useEffect(() => {
    let interval: any;
    if (isThinking) {
      interval = setInterval(() => {
        setDisplayText(options[Math.floor(Math.random() * options.length)]);
        audio.playClick(0.01);
      }, 70);
    }
    return () => clearInterval(interval);
  }, [isThinking, options]);

  const ask = () => {
    if (isThinking) return;
    setIsThinking(true);
    setAnswer(null);
    audio.playOracleSwell();
    
    const rand = Math.random();
    let result: string;
    if (rand < 0.45) result = t.common.yes;
    else if (rand < 0.90) result = t.common.no;
    else result = t.common.maybe;

    const speechPromise = audio.prefetchSpeech(result);
    
    setTimeout(async () => {
      setAnswer(result);
      setIsThinking(false);
      audio.playBlip(440, 0.03);
      onResult?.(result);
      
      const buffer = await speechPromise;
      audio.playSpeechBuffer(buffer);
    }, 1200);
  };

  const handlePurge = () => {
    if (!isConfirmingPurge) {
      setIsConfirmingPurge(true);
      audio.playClick(0.05);
      setTimeout(() => setIsConfirmingPurge(false), 3000);
      return;
    }
    setAnswer(null);
    setIsConfirmingPurge(false);
    audio.playBlip(220, 0.02);
  };

  return (
    <div className="w-full flex flex-col items-center space-y-8 sm:space-y-16 py-2">
      <div className="text-center px-4">
        <h2 className="text-3xl sm:text-5xl font-bold text-theme mb-2 tracking-tighter uppercase">{t.tools[ToolType.YES_NO]}</h2>
        <p className="text-muted-theme text-[10px] tracking-[1em] uppercase font-black opacity-40">{t.bios[ToolType.YES_NO]}</p>
      </div>

      <div className="h-48 sm:h-[400px] flex items-center justify-center relative w-full px-4">
        {isThinking ? (
          <div className="flex flex-col items-center justify-center animate-reveal">
            <span className="text-4xl sm:text-9xl font-bold text-theme tracking-tighter mono animate-pulse">
              {displayText}
            </span>
          </div>
        ) : answer ? (
          <div className="animate-reveal flex flex-col items-center">
            <div className="relative">
                <div 
                  className="absolute -inset-10 sm:-inset-16 blur-[60px] sm:blur-[100px] rounded-full animate-pulse opacity-40" 
                  style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.3)' }}
                />
                <span className={`relative text-5xl sm:text-[10rem] leading-none font-black tracking-tighter transition-all text-theme drop-shadow-[0_0_20px_rgba(var(--accent-rgb),0.2)]`}>
                {answer}
                </span>
            </div>
            <p className="mt-8 sm:mt-12 text-[9px] uppercase tracking-[0.6em] font-black text-muted-theme text-center opacity-60">Decision Latched</p>
          </div>
        ) : (
          <div 
            className="group cursor-pointer flex flex-col items-center py-10 sm:py-24 relative px-12 sm:px-32 rounded-[3rem] transition-all hover:bg-surface-alt/40 active:scale-95 border border-transparent hover:border-theme/20" 
            onClick={ask}
          >
            <span className="text-muted-theme font-black text-6xl sm:text-9xl transition-all duration-700 group-hover:text-theme group-hover:scale-110 opacity-20">?</span>
            <span className="mt-4 sm:mt-8 text-[10px] uppercase font-black tracking-[0.4em] text-muted-theme group-hover:text-theme opacity-60 transition-all">{t.common.tapToConsult}</span>
          </div>
        )}
      </div>

      <div className="w-full max-w-xs sm:max-w-sm px-6 flex flex-col items-center gap-6">
          <button
            onClick={ask}
            disabled={isThinking}
            className="w-full py-5 sm:py-6 font-black rounded-[2rem] hover:opacity-90 active:scale-95 transition-all shadow-xl disabled:opacity-30 uppercase tracking-[0.5em] text-[10px] sm:text-xs"
            style={{ backgroundColor: 'var(--text)', color: 'var(--bg)' }}
          >
            {isThinking ? t.common.consulting : t.common.generate}
          </button>
          {answer && (
            <button 
              onClick={handlePurge} 
              className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${isConfirmingPurge ? 'text-red-500 scale-110' : 'text-muted-theme hover:text-red-500 opacity-60'}`}
            >
              {isConfirmingPurge ? t.common.confirmPurge : t.common.purge}
            </button>
          )}
      </div>
    </div>
  );
};

export default YesNoMaybeTool;
