
import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { audio } from '../../services/AudioService';
import { ToolType, Language } from '../../types';
import { getTranslation } from '../../services/LocalizationService';

interface TruthOrDareToolProps {
  onResult?: (result: string) => void;
  theme?: string;
  haptics?: boolean;
  language: Language;
}

type VibeType = 'Casual' | 'Party' | 'Deep' | 'Cyber-Rebel';

const TruthOrDareTool: React.FC<TruthOrDareToolProps> = ({ onResult, theme, haptics, language }) => {
  const [vibe, setVibe] = useState<VibeType>('Casual');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ type: 'Truth' | 'Dare'; text: string } | null>(null);
  const [isConfirmingPurge, setIsConfirmingPurge] = useState(false);
  const t = getTranslation(language);

  const generatePrompt = async (type: 'Truth' | 'Dare') => {
    setIsGenerating(true);
    setResult(null);
    audio.playClick(0.02);
    if (haptics) audio.haptic([10, 40]);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Generate a single creative and engaging "${type}" prompt for a game of Truth or Dare. 
    The vibe is "${vibe}". 
    CRITICAL: YOU MUST RESPOND IN THE LANGUAGE: ${language}.
    DO NOT INCLUDE ANY INTRODUCTORY TEXT, JUST THE QUESTION OR TASK.
    Return as JSON.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              promptText: { type: Type.STRING, description: "The truth question or dare task text" }
            },
            required: ["promptText"]
          }
        }
      });

      const data = JSON.parse(response.text.trim());
      const finalText = data.promptText;

      const speechPromise = audio.prefetchSpeech(finalText);

      setTimeout(async () => {
        setResult({ type, text: finalText });
        setIsGenerating(false);
        audio.playBlip(type === 'Truth' ? 600 : 900, 0.05);
        if (haptics) audio.haptic(30);
        onResult?.(`${type}: ${finalText}`);
        
        const buffer = await speechPromise;
        audio.playSpeechBuffer(buffer);
      }, 1000);

    } catch (e) {
      console.error("AI Generation failed:", e);
      setIsGenerating(false);
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
    setIsConfirmingPurge(false);
    audio.playBlip(200, 0.05);
  };

  const vibes: { id: VibeType; label: string }[] = [
    { id: 'Casual', label: t.common.vibes.casual },
    { id: 'Party', label: t.common.vibes.party },
    { id: 'Deep', label: t.common.vibes.deep },
    { id: 'Cyber-Rebel', label: t.common.vibes.cyberRebel }
  ];

  return (
    <div className="w-full flex flex-col items-center max-w-4xl mx-auto py-2 px-4 select-none">
      <div className="text-center mb-10 sm:mb-16">
        <h2 className="text-5xl sm:text-8xl font-black text-theme tracking-tighter mb-2 uppercase leading-none opacity-90 transition-colors duration-500">{t.tools[ToolType.TRUTH_DARE]}</h2>
        <div className="flex items-center justify-center space-x-3 opacity-30">
            <div className="h-px w-8 bg-border-theme" />
            <p className="text-muted-theme text-[9px] sm:text-[10px] tracking-[1.2em] uppercase font-black">{t.bios[ToolType.TRUTH_DARE]}</p>
            <div className="h-px w-8 bg-border-theme" />
        </div>
        <div className="mt-4 flex items-center justify-center space-x-2 animate-pulse">
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          <p className="text-[10px] font-black uppercase tracking-widest text-accent">{t.common.onlineRequired}</p>
        </div>
      </div>

      <div className="w-full max-w-lg bg-surface/30 backdrop-blur-[40px] p-6 sm:p-10 rounded-[3rem] border border-border-theme shadow-2xl flex flex-col items-center gap-8 mb-12 transition-colors duration-500">
        <div className="flex bg-bg/40 p-1.5 rounded-[1.5rem] border border-border-theme w-full overflow-x-auto no-scrollbar shadow-inner">
            {vibes.map(v => (
              <button
                key={v.id}
                onClick={() => setVibe(v.id)}
                className={`flex-1 py-3 px-4 rounded-[1rem] font-black text-[9px] uppercase tracking-widest transition-all whitespace-nowrap ${vibe === v.id ? 'bg-theme text-bg shadow-lg scale-105' : 'text-muted-theme hover:text-theme'}`}
              >
                {v.label}
              </button>
            ))}
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
            <button onClick={() => generatePrompt('Truth')} disabled={isGenerating} className="group relative flex flex-col items-center justify-center py-8 bg-surface-alt/50 border border-theme/10 rounded-[2.5rem] hover:border-pink-500/50 hover:bg-pink-500/5 transition-all active:scale-95 disabled:opacity-20 overflow-hidden">
              <span className="relative text-xs font-black uppercase tracking-[0.4em] text-pink-400 group-hover:scale-110 transition-transform">{t.common.truth}</span>
            </button>
            <button onClick={() => generatePrompt('Dare')} disabled={isGenerating} className="group relative flex flex-col items-center justify-center py-8 bg-surface-alt/50 border border-theme/10 rounded-[2.5rem] hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all active:scale-95 disabled:opacity-20 overflow-hidden">
              <span className="relative text-xs font-black uppercase tracking-[0.4em] text-cyan-400 group-hover:scale-110 transition-transform">{t.common.dare}</span>
            </button>
        </div>
      </div>

      <div className="min-h-[300px] flex items-center justify-center w-full relative mb-12">
        {isGenerating ? (
          <div className="flex flex-col items-center animate-reveal">
            <div className="relative w-20 h-20 mb-8 border-4 border-theme/10 rounded-full border-t-accent animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.8em] text-theme animate-pulse">{t.common.consulting}</span>
          </div>
        ) : result ? (
          <div className="animate-reveal flex flex-col items-center w-full">
            <div className={`relative bg-surface/80 backdrop-blur-[60px] border-2 rounded-[3rem] p-10 sm:p-20 shadow-3xl text-center transition-all duration-500 ${result.type === 'Truth' ? 'border-pink-500/30 shadow-pink-500/5' : 'border-cyan-500/30 shadow-cyan-500/5'}`}>
              <h3 className="text-2xl sm:text-4xl font-black text-theme tracking-tight uppercase italic transition-all drop-shadow-md">"{result.text}"</h3>
            </div>
            <button 
              onClick={handlePurge} 
              className={`mt-12 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${isConfirmingPurge ? 'text-red-500 scale-110' : 'text-muted-theme hover:text-red-500 opacity-60'}`}
            >
              {isConfirmingPurge ? t.common.confirmPurge : t.common.purge}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TruthOrDareTool;
