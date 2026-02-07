
import React, { useState } from 'react';
import { audio } from '../../services/AudioService';
import { ToolType, Language } from '../../types';
import { getTranslation } from '../../services/LocalizationService';

interface CoinToolProps {
  onResult?: (result: string) => void;
  theme?: string;
  coinSkin?: string;
  haptics?: boolean;
  language: Language;
}

const CoinTool: React.FC<CoinToolProps> = ({ onResult, theme, coinSkin = 'standard', haptics, language }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'Heads' | 'Tails' | null>(null);
  const [displayChar, setDisplayChar] = useState<string>('?');
  const [animationKey, setAnimationKey] = useState(0);
  const [isConfirmingPurge, setIsConfirmingPurge] = useState(false);
  const t = getTranslation(language);

  const flipCoin = async () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setResult(null);
    setAnimationKey(prev => prev + 1);
    audio.playCoinToss();
    if (haptics) audio.haptic(20);

    const res = Math.random() > 0.5 ? 'Heads' : 'Tails';
    const translatedRes = res === 'Heads' ? t.common.heads : t.common.tails;
    const speechPromise = audio.prefetchSpeech(translatedRes);

    let flickerCount = 0;
    const flickerInterval = setInterval(() => {
      setDisplayChar(Math.random() > 0.5 ? 'H' : 'T');
      if (flickerCount % 2 === 0) audio.playClick(0.01);
      flickerCount++;
    }, 80);

    setTimeout(async () => {
      clearInterval(flickerInterval);
      setResult(res);
      setDisplayChar(res[0]);
      setIsFlipping(false);
      audio.playBlip(880, 0.05);
      onResult?.(translatedRes);
      
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
    setResult(null);
    setDisplayChar('?');
    setIsConfirmingPurge(false);
    audio.playBlip(200, 0.05);
  };

  const getCoinStyle = () => {
    switch (coinSkin) {
      case 'digital':
        return {
          container: "bg-zinc-950 border-accent/60 shadow-[0_0_25px_rgba(var(--accent-rgb),0.4)] relative",
          inner: "border-[2px] border-accent/20 border-dashed animate-pulse",
          text: "text-accent drop-shadow-[0_0_10px_rgba(var(--accent-rgb),1)] font-mono",
          overlay: "bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.1)_1px,transparent_1px)] bg-[size:10px_10px]"
        };
      case 'abstract':
        return {
          container: "bg-surface border-theme/40 overflow-hidden",
          inner: "border-none",
          text: "text-theme tracking-[-0.1em]",
          overlay: "bg-gradient-to-br from-theme/10 via-transparent to-theme/5"
        };
      case 'standard':
      default:
        return {
          container: "bg-surface border-theme shadow-2xl",
          inner: "border-[2px] border-dashed border-theme/10",
          text: "text-theme tracking-tighter",
          overlay: "bg-gradient-to-tr from-white/10 via-transparent to-black/20"
        };
    }
  };

  const style = getCoinStyle();

  return (
    <div className="w-full flex flex-col items-center max-w-4xl mx-auto py-2">
      <div className="text-center px-4 mb-12 sm:mb-20">
        <h2 className="text-5xl sm:text-8xl font-black text-theme tracking-tighter mb-3 uppercase leading-none opacity-90">{t.tools[ToolType.COIN]}</h2>
        <div className="flex items-center justify-center space-x-3 opacity-30">
            <div className="h-px w-8 bg-border-theme" />
            <p className="text-muted-theme text-[9px] sm:text-[10px] tracking-[1.2em] uppercase font-black">{t.bios[ToolType.COIN]}</p>
            <div className="h-px w-8 bg-border-theme" />
        </div>
      </div>

      <div className="relative group cursor-pointer h-64 sm:h-96 flex items-center justify-center w-full px-4 overflow-visible" onClick={flipCoin}>
        <div key={animationKey} className={`relative z-10 w-[var(--coin-size)] h-[var(--coin-size)] flex items-center justify-center ${isFlipping ? 'animate-coin-toss' : ''}`}>
          <div className={`w-full h-full rounded-full border-[8px] sm:border-[12px] flex flex-col items-center justify-center transition-all duration-300 ${style.container} ${isFlipping ? 'animate-coin-spin scale-105' : ''}`}>
            <div className={`absolute inset-3 rounded-full pointer-events-none ${style.inner}`} />
            <div className={`flex flex-col items-center justify-center transition-all ${isFlipping ? 'blur-[1.5px] opacity-70' : 'animate-reveal'}`}>
              <span className={`text-6xl sm:text-9xl font-black leading-none select-none ${style.text}`}>{displayChar}</span>
            </div>
            <div className={`absolute inset-0 rounded-full pointer-events-none ${style.overlay}`} />
          </div>
        </div>
      </div>

      <div className="w-full max-w-xs sm:max-w-md px-6 mt-16 sm:mt-24 flex flex-col items-center gap-6">
        <button onClick={flipCoin} disabled={isFlipping} className="w-full py-6 sm:py-8 bg-theme text-bg font-black rounded-[2.5rem] hover:opacity-90 active:scale-95 transition-all shadow-2xl disabled:opacity-30 uppercase tracking-[0.8em] text-[10px] sm:text-xs">
          {isFlipping ? t.common.tossing : t.common.generate}
        </button>
        {result && !isFlipping && (
          <div className="animate-reveal text-center flex flex-col items-center gap-4 w-full">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.6em] text-theme font-black">{t.common.result}: {result === 'Heads' ? t.common.heads : t.common.tails}</span>
            <button 
              onClick={handlePurge} 
              className={`mt-4 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${isConfirmingPurge ? 'text-red-500 scale-110' : 'text-muted-theme hover:text-red-500 opacity-60'}`}
            >
              {isConfirmingPurge ? t.common.confirmPurge : t.common.purge}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinTool;
