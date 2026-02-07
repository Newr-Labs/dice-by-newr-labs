
import React, { useState, useEffect } from 'react';
import { audio } from '../../services/AudioService';
import { ToolType, Language } from '../../types';
import { getTranslation } from '../../services/LocalizationService';

interface PickerToolProps {
  onResult?: (result: string) => void;
  theme?: string;
  language: Language;
}

const PickerTool: React.FC<PickerToolProps> = ({ onResult, theme, language }) => {
  const [listText, setListText] = useState("Alpha\nBeta\nGamma\nDelta\nEpsilon\nZeta");
  const [isPicking, setIsPicking] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [removeAfterPick, setRemoveAfterPick] = useState(false);
  const [isConfirmingPurge, setIsConfirmingPurge] = useState(false);
  const t = getTranslation(language);

  const pick = async () => {
    const items = listText.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    if (items.length === 0) return;

    setIsPicking(true);
    setResult(null);

    const index = Math.floor(Math.random() * items.length);
    const winner = items[index];
    const speechPromise = audio.prefetchSpeech(winner);
    
    const scanInterval = setInterval(() => {
      audio.playClick(0.01);
    }, 150);

    setTimeout(async () => {
      clearInterval(scanInterval);
      setResult(winner);
      setIsPicking(false);
      audio.playBlip(990, 0.04);
      onResult?.(winner);

      const buffer = await speechPromise;
      audio.playSpeechBuffer(buffer);

      if (removeAfterPick) {
        const newList = [...items];
        newList.splice(index, 1);
        setListText(newList.join('\n'));
      }
    }, 2000); 
  };

  const handlePurge = () => {
    if (!isConfirmingPurge) {
      setIsConfirmingPurge(true);
      audio.playClick(0.05);
      setTimeout(() => setIsConfirmingPurge(false), 3000);
      return;
    }

    setListText("");
    setResult(null);
    setIsConfirmingPurge(false);
    audio.playBlip(200, 0.1);
  };

  return (
    <div className="w-full max-w-5xl flex flex-col items-center space-y-10 py-4 px-2 sm:px-4">
      <div className="text-center w-full px-4">
        <h2 className="text-4xl sm:text-6xl font-bold text-theme mb-2 tracking-tight">{t.tools[ToolType.PICKER]}</h2>
        <p className="text-muted-theme text-xs sm:text-sm tracking-[0.4em] uppercase font-bold opacity-70">{t.bios[ToolType.PICKER]}</p>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-stretch max-w-5xl">
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="flex justify-between items-end px-4">
            <label className="text-[10px] uppercase tracking-widest text-muted-theme font-black">{t.common.listInput}</label>
            <button 
              onClick={handlePurge} 
              className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${isConfirmingPurge ? 'text-red-500 scale-110' : 'text-muted-theme hover:text-red-500 opacity-60'}`}
            >
              {isConfirmingPurge ? t.common.confirmPurge : t.common.purge}
            </button>
          </div>
          <div className="relative flex-grow min-h-[260px] sm:min-h-[360px]">
            <textarea
              value={listText}
              onChange={(e) => setListText(e.target.value)}
              disabled={isPicking}
              placeholder={t.common.placeholderList}
              className="w-full h-full bg-surface border border-border-theme rounded-[2.5rem] p-6 sm:p-8 text-theme resize-none focus:outline-none focus:border-accent transition-all mono text-sm disabled:opacity-20 placeholder:text-muted-theme transition-colors duration-500 shadow-inner"
            />
            <div className="absolute bottom-6 right-8 text-[10px] font-black text-muted-theme uppercase pointer-events-none opacity-40">
                {listText.split('\n').filter(s => s.trim()).length} {t.common.units}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col space-y-6">
          <div className="flex-grow min-h-[300px] sm:min-h-[380px] bg-surface/50 backdrop-blur-md border border-border-theme rounded-[3rem] flex flex-col items-center justify-center relative overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.05)] px-6 transition-colors duration-500">
            
            {isPicking ? (
              <div className="flex flex-col items-center space-y-8 animate-reveal">
                 <div className="flex space-x-3">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="w-3 h-3 rounded-full animate-bounce bg-theme" style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.8em] text-theme animate-pulse">{t.common.analyzing}</span>
              </div>
            ) : result ? (
              <div className="animate-reveal flex flex-col items-center text-center">
                <p className="text-[10px] font-black uppercase tracking-export-wide text-muted-theme mb-8 opacity-60">{t.common.selectedUnit}</p>
                <div className="relative">
                    <div className="absolute -inset-16 bg-theme/5 blur-[100px] rounded-full animate-pulse" />
                    <div className="relative px-8 sm:px-20 py-10 sm:py-14 bg-surface/80 backdrop-blur-xl border border-border-theme rounded-[3rem] shadow-3xl transition-colors duration-500">
                       <span className="text-3xl sm:text-6xl font-black text-theme tracking-tighter uppercase leading-tight">
                         {result}
                       </span>
                    </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center opacity-20">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-dashed border-theme flex items-center justify-center mb-6">
                    <span className="text-2xl sm:text-3xl font-black text-theme">?</span>
                </div>
                <span className="text-[10px] uppercase font-black tracking-[0.4em] text-theme">{t.common.systemIdle}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-4">
            <button
              onClick={() => !isPicking && setRemoveAfterPick(!removeAfterPick)}
              className={`flex-grow sm:flex-grow-0 sm:w-1/3 flex items-center justify-center space-x-3 px-6 py-5 rounded-[2rem] border transition-all ${
                removeAfterPick ? 'bg-theme/10 border-accent/40 text-theme shadow-inner' : 'bg-surface border-border-theme text-muted-theme'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${removeAfterPick ? 'bg-accent shadow-[0_0_8px_rgba(var(--accent-rgb),1)]' : 'bg-muted-theme'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">{t.common.autoPurge}</span>
            </button>
            
            <button
              onClick={pick}
              disabled={isPicking || listText.trim().length === 0}
              className="flex-grow py-6 sm:py-7 font-black rounded-[2rem] hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 shadow-xl uppercase tracking-[0.3em] text-[10px] sm:text-xs"
              style={{ backgroundColor: 'var(--text)', color: 'var(--bg)' }}
            >
              {isPicking ? t.common.processing.toUpperCase() : t.common.runSelection.toUpperCase()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickerTool;
