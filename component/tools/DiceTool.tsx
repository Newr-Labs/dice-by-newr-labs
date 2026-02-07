
import React, { useState, useMemo, useCallback } from 'react';
import { audio } from '../../services/AudioService';
import { ToolType, Language } from '../../types';
import { getTranslation } from '../../services/LocalizationService';

interface DiceToolProps {
  onResult?: (result: string) => void;
  diceSkin?: string;
  theme?: string;
  haptics?: boolean;
  language: Language;
}

const DiceFace: React.FC<{ value: number; isRolling: boolean; skin: string }> = ({ value, isRolling, skin }) => {
  const pips = useMemo(() => {
    switch (value) {
      case 1: return [4];
      case 2: return [2, 6];
      case 3: return [2, 4, 6];
      case 4: return [0, 2, 6, 8];
      case 5: return [0, 2, 4, 6, 8];
      case 6: return [0, 3, 6, 2, 5, 8];
      default: return [];
    }
  }, [value]);

  const skinClasses = {
    stealth: 'bg-black border-zinc-800',
    neon: 'bg-zinc-950 border-accent/40 shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]',
    marble: 'bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 border-slate-400',
    standard: 'bg-surface border-border-theme shadow-inner'
  };

  const pipClasses = {
    stealth: 'bg-zinc-800',
    neon: 'bg-accent shadow-[0_0_8px_rgba(var(--accent-rgb),1)]',
    marble: 'bg-slate-800 shadow-inner',
    standard: 'bg-theme opacity-80'
  };
  
  return (
    <div className={`relative w-[var(--dice-size)] h-[var(--dice-size)] rounded-[1.25rem] border transition-all flex items-center justify-center p-2 sm:p-3 shadow-lg overflow-hidden ${isRolling ? 'animate-vibrate blur-[1px]' : ''} ${(skinClasses as any)[skin] || skinClasses.standard}`}>
      <div className="grid grid-cols-3 grid-rows-3 w-full h-full gap-0.5 sm:gap-1">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            {pips.includes(i) && <div className={`w-[var(--dice-dot-size)] h-[var(--dice-dot-size)] rounded-full transition-all ${(pipClasses as any)[skin] || pipClasses.standard} ${isRolling ? 'opacity-40' : 'opacity-100'}`} />}
          </div>
        ))}
      </div>
    </div>
  );
};

const DiceTool: React.FC<DiceToolProps> = ({ onResult, diceSkin = 'standard', haptics, language }) => {
  const [numDice, setNumDice] = useState(1);
  const [results, setResults] = useState<number[]>([]);
  const [displayValues, setDisplayValues] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [isConfirmingPurge, setIsConfirmingPurge] = useState(false);
  const t = getTranslation(language);
  
  const roll = useCallback(async () => {
    if (isRolling) return;
    setIsRolling(true);
    audio.playDice();
    if (haptics) audio.haptic([10, 30, 10]);
    
    const finalResults = Array.from({ length: numDice }, () => Math.floor(Math.random() * 6) + 1);
    const sum = finalResults.reduce((a, b) => a + b, 0);
    
    const speechText = `${t.common.total} ${sum}`;
    const speechPromise = audio.prefetchSpeech(speechText);
    
    let ticks = 0;
    const interval = setInterval(async () => {
      setDisplayValues(Array.from({ length: numDice }, () => Math.floor(Math.random() * 6) + 1));
      ticks++;
      if (ticks >= 20) {
        clearInterval(interval);
        setResults(finalResults);
        setDisplayValues(finalResults);
        setIsRolling(false);
        audio.playBlip(720, 0.05);
        onResult?.(`${t.common.total}: ${sum}`);
        const buffer = await speechPromise;
        audio.playSpeechBuffer(buffer);
      }
    }, 60);
  }, [numDice, isRolling, t, haptics, onResult]);

  const handlePurge = () => {
    if (!isConfirmingPurge) {
      setIsConfirmingPurge(true);
      audio.playClick(0.05);
      setTimeout(() => setIsConfirmingPurge(false), 3000);
      return;
    }
    setResults([]);
    setDisplayValues([]);
    setIsConfirmingPurge(false);
    audio.playBlip(200, 0.05);
  };

  return (
    <div className="w-full flex flex-col items-center max-w-4xl mx-auto py-6 sm:py-10 px-4">
      <div className="text-center mb-10 sm:mb-16">
        <h2 className="text-5xl sm:text-8xl font-black text-theme tracking-tighter mb-2 uppercase leading-none opacity-90">{t.tools[ToolType.DICE]}</h2>
        <p className="text-muted-theme text-xs sm:text-sm tracking-[0.4em] uppercase font-bold opacity-70">{t.bios[ToolType.DICE]}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 mb-16 bg-surface/30 backdrop-blur-[40px] p-8 rounded-[3rem] border border-border-theme shadow-2xl transition-colors duration-500">
        <div className="flex flex-col items-center sm:items-start gap-3">
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-theme">{t.common.quantity}</span>
          <div className="flex bg-bg/40 p-1.5 rounded-[1.5rem] border border-border-theme shadow-inner">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <button key={n} onClick={() => !isRolling && setNumDice(n)} className={`w-10 h-10 sm:w-14 sm:h-14 rounded-[1rem] flex items-center justify-center font-black text-xs sm:text-xl transition-all ${numDice === n ? 'bg-theme text-bg shadow-lg scale-105' : 'text-muted-theme hover:text-theme'}`}>{n}</button>
            ))}
          </div>
        </div>
        <button onClick={roll} disabled={isRolling} className="w-full sm:w-auto px-12 py-6 sm:py-8 bg-theme text-bg font-black rounded-[2rem] hover:opacity-90 active:scale-95 disabled:opacity-40 uppercase tracking-[0.6em] text-[10px] sm:text-xs shadow-xl">{isRolling ? t.common.rolling : t.common.generate}</button>
      </div>

      <div className="flex flex-wrap justify-center gap-6 sm:gap-12 items-center min-h-[200px] mb-12">
        {(displayValues.length > 0 ? displayValues : Array.from({length: numDice}, () => 0)).map((val, i) => (
          <div key={i} className="animate-reveal"><DiceFace value={val || 0} isRolling={isRolling} skin={diceSkin} /></div>
        ))}
      </div>

      {results.length > 0 && !isRolling && (
        <div className="animate-reveal flex flex-col items-center w-full">
          <p className="text-[9px] text-muted-theme uppercase tracking-[1.8em] font-black mb-6 opacity-40">{t.common.result}</p>
          <div className="relative py-8 px-16 sm:px-32 bg-surface/90 backdrop-blur-[60px] rounded-[3rem] border border-border-theme shadow-3xl text-center transition-colors duration-500">
            <span className="text-7xl sm:text-[10rem] font-black text-theme tracking-tighter">{results.reduce((a, b) => a + b, 0)}</span>
          </div>
          <button 
            onClick={handlePurge} 
            className={`mt-10 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${isConfirmingPurge ? 'text-red-500 scale-110' : 'text-muted-theme hover:text-red-500 opacity-60'}`}
          >
            {isConfirmingPurge ? t.common.confirmPurge : t.common.purge}
          </button>
        </div>
      )}
    </div>
  );
};

export default DiceTool;
