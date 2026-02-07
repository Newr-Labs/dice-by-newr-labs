
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { audio } from '../../services/AudioService';
import { ToolType, Language } from '../../types';
import { getTranslation } from '../../services/LocalizationService';

interface WheelToolProps {
  onResult?: (result: string) => void;
  theme?: string;
  language: Language;
}

const WheelTool: React.FC<WheelToolProps> = ({ onResult, theme, language }) => {
  const [input, setInput] = useState("Pizza, Tacos, Sushi, Burgers, Salad, Pasta, Steak, Ramen, Dim Sum");
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [blur, setBlur] = useState(0);
  const [isConfirmingPurge, setIsConfirmingPurge] = useState(false);
  const t = getTranslation(language);
  
  const cumulativeOffsetRef = useRef(0);
  const ITEM_HEIGHT = 80; 
  const VIEWPORT_HEIGHT = 320; 
  const CENTER_Y = VIEWPORT_HEIGHT / 2;
  const ITEM_MIDPOINT = ITEM_HEIGHT / 2;
  const CALIBRATION_OFFSET = -(CENTER_Y - ITEM_MIDPOINT);

  const options = useMemo(() => 
    input.split(/[,\n]/).map(s => s.trim()).filter(s => s.length > 0),
    [input]
  );

  const spin = async () => {
    if (options.length < 2 || isSpinning) return;

    setIsSpinning(true);
    setResult(null);
    setBlur(2); 

    const totalHeight = options.length * ITEM_HEIGHT;
    const laps = 15 + Math.floor(Math.random() * 5); 
    const winnerIndex = Math.floor(Math.random() * options.length);
    const winner = options[winnerIndex];

    const speechPromise = audio.prefetchSpeech(winner);
    
    const currentLapOffset = cumulativeOffsetRef.current % totalHeight;
    const distanceToTargetInCurrentLap = (winnerIndex * ITEM_HEIGHT) + CALIBRATION_OFFSET - currentLapOffset;
    
    const normalizedDistance = distanceToTargetInCurrentLap < 0 
      ? distanceToTargetInCurrentLap + totalHeight 
      : distanceToTargetInCurrentLap;

    const totalTravel = (laps * totalHeight) + normalizedDistance;
    const newTargetOffset = cumulativeOffsetRef.current + totalTravel;

    const totalDuration = 4000;
    const startTime = Date.now();
    const playClickWithDecay = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < totalDuration) {
        audio.playClick(0.015);
        const progress = elapsed / totalDuration;
        const nextDelay = 50 + progress * 400; 
        setTimeout(playClickWithDecay, nextDelay);
      }
    };
    playClickWithDecay();

    cumulativeOffsetRef.current = newTargetOffset;
    setCurrentOffset(newTargetOffset);

    setTimeout(async () => {
      setIsSpinning(false);
      setResult(winner);
      setBlur(0);
      audio.playBlip(550, 0.03);
      onResult?.(winner);
      
      const buffer = await speechPromise;
      audio.playSpeechBuffer(buffer);
      
      const finalLapOffset = newTargetOffset % totalHeight;
      const resetPoint = (totalHeight * 25) + finalLapOffset;
      setTimeout(() => {
          cumulativeOffsetRef.current = resetPoint;
          setCurrentOffset(resetPoint);
      }, 0);

    }, totalDuration); 
  };

  const handlePurge = () => {
    if (!isConfirmingPurge) {
      setIsConfirmingPurge(true);
      audio.playClick(0.05);
      setTimeout(() => setIsConfirmingPurge(false), 3000);
      return;
    }

    setInput("");
    setResult(null);
    setCurrentOffset(0);
    cumulativeOffsetRef.current = 0;
    setIsConfirmingPurge(false);
    audio.playBlip(200, 0.1);
  };

  return (
    <div className="w-full max-w-5xl flex flex-col items-center space-y-12 py-4 px-2 sm:px-4">
      <div className="text-center w-full px-4">
        <h2 className="text-4xl sm:text-6xl font-bold text-theme mb-2 tracking-tight">{t.tools[ToolType.WHEEL]}</h2>
        <p className="text-muted-theme text-xs sm:text-sm tracking-[0.4em] uppercase font-bold opacity-70">{t.bios[ToolType.WHEEL]}</p>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-stretch max-w-5xl">
        <div className="lg:col-span-4 flex flex-col space-y-4 order-2 lg:order-1">
          <div className="flex justify-between items-end px-4">
            <label className="text-[10px] uppercase tracking-widest text-muted-theme font-black">{t.common.optionsPool}</label>
            <div className="flex items-center space-x-3">
              <span className="text-[10px] font-black text-muted-theme uppercase opacity-60">{options.length} {t.common.units}</span>
              <button 
                onClick={handlePurge} 
                className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${isConfirmingPurge ? 'text-red-500 scale-110' : 'text-muted-theme hover:text-red-500 opacity-60'}`}
              >
                {isConfirmingPurge ? t.common.confirmPurge : t.common.purge}
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => !isSpinning && setInput(e.target.value)}
            disabled={isSpinning}
            placeholder={t.common.placeholderWheel}
            className="w-full h-40 lg:h-full min-h-[260px] bg-surface border border-border-theme rounded-[2.5rem] p-6 sm:p-8 text-theme resize-none focus:outline-none focus:border-accent transition-all mono text-sm disabled:opacity-20 placeholder:text-muted-theme transition-colors duration-500 shadow-inner"
          />
        </div>

        <div className="lg:col-span-8 flex flex-col space-y-6 order-1 lg:order-2">
          <div 
            className="relative w-full bg-surface border border-border-theme rounded-[3rem] overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.1)] transition-colors duration-500"
            style={{ height: `${VIEWPORT_HEIGHT}px` }}
          >
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[80px] z-50 pointer-events-none">
              <div className="absolute inset-x-0 top-0 h-px bg-theme/10" />
              <div className="absolute inset-x-0 bottom-0 h-px bg-theme/10" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-16 bg-theme rounded-r-full shadow-2xl" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-16 bg-theme rounded-l-full shadow-2xl" />
            </div>

            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-surface via-surface/80 to-transparent z-40 pointer-events-none transition-colors duration-500" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface via-surface/80 to-transparent z-40 pointer-events-none transition-colors duration-500" />

            <div 
              className="absolute inset-x-0 will-change-transform"
              style={{ 
                transform: `translateY(${-currentOffset}px)`, 
                transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0, 0.05, 1)' : 'none',
                filter: `blur(${blur}px)`
              }}
            >
              {[...Array(50)].map((_, setIdx) => (
                <div key={setIdx} className="w-full">
                  {options.map((opt, i) => {
                    const isWinner = !isSpinning && result === opt;
                    return (
                      <div 
                        key={`${setIdx}-${i}`}
                        className="flex items-center justify-center px-6 sm:px-10"
                        style={{ height: `${ITEM_HEIGHT}px` }}
                      >
                        <span 
                          className={`text-2xl sm:text-4xl font-black uppercase truncate text-center transition-all duration-700 ${
                            isWinner ? 'text-theme scale-110 drop-shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]' : 'text-muted-theme opacity-30'
                          }`}
                        >
                          {opt}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
              {options.length === 0 && (
                <div className="h-[320px] flex items-center justify-center opacity-10">
                   <span className="text-[10px] font-black uppercase tracking-[1em]">{t.common.emptyReel}</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={spin}
            disabled={isSpinning || options.length < 2}
            className="w-full py-6 sm:py-8 font-black rounded-[2.5rem] hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 shadow-xl uppercase tracking-[0.3em] text-[10px] sm:text-xs"
            style={{ backgroundColor: 'var(--text)', color: 'var(--bg)' }}
          >
            {isSpinning ? t.common.rolling.toUpperCase() : t.common.generate.toUpperCase()}
          </button>
        </div>
      </div>

      <div className="min-h-[140px] flex items-center justify-center w-full pb-8">
        {result && !isSpinning && (
          <div className="animate-reveal flex flex-col items-center text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.6em] text-muted-theme mb-6 opacity-60">{t.common.outcomeSelected}</p>
            <div className="relative">
              <div 
                className="absolute -inset-16 blur-[100px] rounded-full animate-pulse" 
                style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.1)' }}
              />
              <div className="relative px-10 sm:px-24 py-10 sm:py-14 bg-surface/80 backdrop-blur-xl border border-border-theme rounded-[3rem] shadow-3xl transition-colors duration-500">
                 <span className="text-4xl sm:text-7xl font-black text-theme tracking-tighter block uppercase">
                   {result}
                 </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WheelTool;
