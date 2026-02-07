
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { audio } from '../../services/AudioService';
import { ToolType, Language } from '../../types';
import { getTranslation } from '../../services/LocalizationService';

interface ColorToolProps {
  onResult?: (result: string) => void;
  theme?: string;
  language: Language;
}

interface FavoriteColor {
  id: string;
  name: string;
  hex: string;
  tags: string[];
  timestamp: number;
}

interface ColorResult {
  name: string;
  hex: string;
  palette: string[];
  tags: string[];
}

type PaletteType = 'All' | 'Vibe';

const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

const rgbToHex = (r: number, g: number, b: number) => {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return "#" + ((1 << 24) + (clamp(r) << 16) + (clamp(g) << 8) + clamp(b)).toString(16).slice(1).toUpperCase();
};

const generateVariations = (hex: string): string[] => {
  const { r, g, b } = hexToRgb(hex);
  return [
    rgbToHex(255 - r, 255 - g, 255 - b),
    rgbToHex(r * 0.8, g * 0.8, b * 0.8),
    rgbToHex(r + (255 - r) * 0.5, g + (255 - g) * 0.5, b + (255 - b) * 0.5),
    rgbToHex(g, b, r),
  ];
};

const ColorTool: React.FC<ColorToolProps> = ({ onResult, theme, language }) => {
  const [palette, setPalette] = useState<PaletteType>('Vibe');
  const [vibePrompt, setVibePrompt] = useState("");
  const [result, setResult] = useState<ColorResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [isConfirmingPurge, setIsConfirmingPurge] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null); 
  const [tempName, setTempName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  const [favorites, setFavorites] = useState<FavoriteColor[]>(() => {
    const saved = localStorage.getItem('dice_color_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  
  const t = getTranslation(language);

  const QUICK_VIBES = useMemo(() => [
    { label: t.common.vibes.boy, emoji: '👦', prompt: 'Masculine, cool blues, strong deep greens, industrial, slate' },
    { label: t.common.vibes.girl, emoji: '👧', prompt: 'Feminine, soft pinks, lavender, pastel, elegant rose' },
    { label: t.common.vibes.neon, emoji: '⚡', prompt: 'Cyberpunk, high saturation, electric glows, fluorescent' },
    { label: t.common.vibes.nature, emoji: '🌿', prompt: 'Forest, organic, earthy brown, moss green, floral' },
    { label: t.common.vibes.royal, emoji: '👑', prompt: 'Gold, deep violet, navy blue, luxurious, velvet' }
  ], [t]);

  useEffect(() => {
    if (favorites.length > 0 || localStorage.getItem('dice_color_favorites')) {
        localStorage.setItem('dice_color_favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const synthesizeColorData = async (hex: string, vibe?: string): Promise<ColorResult> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = vibe 
      ? `Generate a beautiful hex color and palette for this vibe: "${vibe}". Give it a creative name. Also provide 4 complementary colors AND 6-8 descriptive visual tags. 
         IMPORTANT: The tags MUST include the basic color family in English AND ${language} (e.g., if it is pink, tags must include 'pink' and 'merah muda'). 
         Tags should cover family (e.g., 'red', 'blue'), sub-family (e.g., 'pastel', 'vibrant'), and feel (e.g., 'warm', 'cold'). 
         Respond in JSON. Language: ${language}.`
      : `Name this color creatively: ${hex}. Provide 4 complementary colors AND 6-8 visual tags. 
         IMPORTANT: The tags MUST include the basic color family name in English AND ${language} (e.g., 'blue', 'deep blue', 'cool', 'biru'). 
         Respond in JSON. Language: ${language}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hex: { type: Type.STRING },
            name: { type: Type.STRING },
            palette: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["hex", "name", "palette", "tags"]
        }
      }
    });
    
    try {
      const data = JSON.parse(response.text.trim());
      return {
        hex: (data.hex || hex).toUpperCase(),
        name: data.name || `Color ${hex}`,
        palette: (data.palette || generateVariations(hex)).map((h: string) => h.toUpperCase()),
        tags: (data.tags || []).map((tag: string) => tag.toLowerCase())
      };
    } catch {
      return { 
        hex: hex.toUpperCase(), 
        name: `Digital ${hex}`, 
        palette: generateVariations(hex),
        tags: []
      };
    }
  };

  const generateColor = useCallback(async (customPrompt?: string) => {
    setIsGenerating(true);
    setResult(null);
    setEditingId(null);
    setCopiedHex(null);
    audio.playClick(0.02);

    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const initialHex = rgbToHex(r, g, b);

    const activeVibe = customPrompt || (palette === 'Vibe' ? vibePrompt : undefined);

    try {
      const finalData = await synthesizeColorData(initialHex, activeVibe);
      const speechPromise = audio.prefetchSpeech(finalData.name);

      setTimeout(async () => {
        setResult(finalData);
        setIsGenerating(false);
        audio.playBlip(660, 0.05);
        onResult?.(`${finalData.hex} (${finalData.name})`);
        const buffer = await speechPromise;
        audio.playSpeechBuffer(buffer);
      }, 800);
    } catch (error) {
      console.error("AI Generation failed:", error);
      setIsGenerating(false);
    }
  }, [palette, vibePrompt, language, onResult]);

  const handleInstantSave = () => {
    if (!result) return;
    const isSaved = favorites.find(f => f.hex === result.hex);
    
    if (isSaved) {
      setFavorites(prev => prev.filter(f => f.hex !== result.hex));
      audio.playBlip(300, 0.05);
    } else {
      setFavorites(prev => [{
        id: crypto.randomUUID(),
        name: result.name,
        hex: result.hex,
        tags: result.tags,
        timestamp: Date.now()
      }, ...prev]);
      audio.playBlip(1000, 0.03);
    }
  };

  const triggerRename = (id: string, currentName: string) => {
    setEditingId(id);
    setTempName(currentName);
    audio.playClick(0.02);
  };

  const finalizeRename = () => {
    if (editingId && tempName.trim()) {
      setFavorites(prev => prev.map(f => f.id === editingId ? { ...f, name: tempName.trim() } : f));
      setEditingId(null);
      audio.playBlip(800, 0.05);
    }
  };

  const removeFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => prev.filter(f => f.id !== id));
    audio.playBlip(440, 0.02);
  };

  const recallFavorite = (fav: FavoriteColor) => {
    setResult({
      name: fav.name,
      hex: fav.hex,
      palette: generateVariations(fav.hex),
      tags: fav.tags
    });
    setEditingId(null);
    audio.playClick(0.05);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    audio.playBlip(1200, 0.02);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handlePurgeVault = () => {
    if (!isConfirmingPurge) {
      setIsConfirmingPurge(true);
      audio.playClick(0.05);
      setTimeout(() => setIsConfirmingPurge(false), 3000);
      return;
    }

    setFavorites([]);
    setResult(null);
    setSearchQuery("");
    setVibePrompt("");
    setIsConfirmingPurge(false);
    localStorage.removeItem('dice_color_favorites');
    audio.playBlip(200, 0.1);
  };

  const filteredFavorites = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return favorites;
    
    const queryParts = query.split(/\s+/); 

    return favorites.filter(f => {
      const targetString = [
        f.name.toLowerCase(),
        f.hex.toLowerCase(),
        ...f.tags.map(tag => tag.toLowerCase())
      ].join(' ');

      return queryParts.every(part => targetString.includes(part));
    });
  }, [favorites, searchQuery]);

  return (
    <div className="w-full flex flex-col items-center max-w-4xl mx-auto py-2 px-4 select-none">
      <div className="text-center mb-10 sm:mb-16">
        <h2 className="text-5xl sm:text-8xl font-black text-theme tracking-tighter mb-2 uppercase leading-none opacity-90">{t.tools[ToolType.COLOR]}</h2>
        <p className="text-muted-theme text-xs sm:text-sm tracking-[0.4em] uppercase font-bold opacity-70 mb-4">{t.bios[ToolType.COLOR]}</p>
        <div className="mt-4 flex items-center justify-center space-x-2 animate-pulse">
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          <p className="text-[10px] font-black uppercase tracking-widest text-accent">{t.common.onlineRequired}</p>
        </div>
      </div>

      <div className="w-full max-lg bg-surface/30 backdrop-blur-[40px] p-6 sm:p-10 rounded-[3rem] border border-border-theme shadow-2xl flex flex-col items-center gap-6 mb-12">
        <div className="flex bg-bg/40 p-1.5 rounded-[1.5rem] border border-border-theme w-full">
            {(['All', 'Vibe'] as PaletteType[]).map(p => (
              <button key={p} onClick={() => setPalette(p)} className={`flex-1 py-3 rounded-[1rem] font-black text-[10px] uppercase transition-all ${palette === p ? 'bg-theme text-bg' : 'text-muted-theme hover:text-theme'}`}>{p}</button>
            ))}
        </div>

        {palette === 'Vibe' && (
          <div className="w-full space-y-4">
            <input 
              type="text" 
              placeholder={t.common.vibePrompt} 
              value={vibePrompt} 
              onChange={(e) => setVibePrompt(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && vibePrompt.trim() && generateColor()}
              className="w-full bg-bg/50 border border-theme/20 rounded-2xl px-6 py-4 text-theme text-sm focus:border-accent outline-none transition-all shadow-inner" 
            />
            <div className="flex flex-wrap gap-2 justify-center">
               {QUICK_VIBES.map((v, idx) => (
                 <button 
                  key={idx}
                  onClick={() => generateColor(v.prompt)}
                  className="px-3 py-1.5 bg-surface-alt rounded-full border border-border-theme text-[9px] font-black uppercase tracking-widest text-muted-theme hover:text-theme hover:border-theme transition-all"
                 >
                   {v.emoji} {v.label}
                 </button>
               ))}
            </div>
          </div>
        )}

        <button 
          onClick={() => generateColor()} 
          disabled={isGenerating || (palette === 'Vibe' && !vibePrompt.trim())} 
          className="w-full py-6 bg-theme text-bg font-black rounded-[2rem] hover:opacity-90 active:scale-95 transition-all uppercase tracking-[0.6em] text-[10px] shadow-xl disabled:opacity-20 mt-2"
        >
          {isGenerating ? '...' : t.common.generate}
        </button>
      </div>

      <div className="min-h-[400px] w-full flex flex-col items-center">
        {isGenerating && (
          <div className="flex flex-col items-center animate-pulse pt-20">
             <div className="w-24 h-24 rounded-full border-4 border-dashed border-theme animate-spin" />
             <p className="mt-6 text-[10px] font-black uppercase tracking-[0.5em] text-muted-theme">{t.common.analyzing}</p>
          </div>
        )}

        {result && !isGenerating && (
          <div className="animate-reveal flex flex-col items-center w-full mb-12">
            <div 
              className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full border-8 border-theme shadow-2xl flex items-center justify-center overflow-hidden cursor-pointer group" 
              style={{ backgroundColor: result.hex }}
              onClick={() => copyToClipboard(result.hex)}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                 <svg className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
              </div>
              <div className="relative z-10 bg-black/40 backdrop-blur-md p-4 rounded-2xl text-center text-white border border-white/10 shadow-lg max-w-[85%]">
                <p className="text-[10px] font-black uppercase tracking-widest mb-1 drop-shadow-md truncate">{result.name}</p>
                <p className="text-xl sm:text-2xl font-black font-mono drop-shadow-md">{result.hex}</p>
              </div>
            </div>

            <div className="mt-10 flex items-center space-x-6">
               <button 
                  onClick={handleInstantSave}
                  className={`p-5 rounded-[1.5rem] bg-surface-alt border transition-all active:scale-90 ${favorites.some(f => f.hex === result.hex) ? 'text-pink-500 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'text-muted-theme border-border-theme hover:text-pink-500 hover:border-pink-500'}`}
                  title={t.common.save}
                >
                  <svg className="w-6 h-6" fill={favorites.some(f => f.hex === result.hex) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </button>

                {favorites.find(f => f.hex === result.hex) && (
                  <button 
                    onClick={() => {
                      const fav = favorites.find(f => f.hex === result.hex);
                      if (fav) triggerRename(fav.id, fav.name);
                    }}
                    className="p-5 rounded-[1.5rem] bg-surface-alt border border-border-theme text-muted-theme hover:text-accent hover:border-accent transition-all active:scale-90"
                    title={t.common.rename}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                )}
            </div>
          </div>
        )}

        <div className="w-full mt-10 border-t border-border-theme pt-12 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 px-4 gap-4">
                <div className="flex flex-col">
                    <h3 className="text-xl font-black uppercase tracking-tighter text-theme">{t.common.vault}</h3>
                    <p className="text-[9px] text-muted-theme uppercase tracking-[0.4em] font-black opacity-40">{t.common.favorites}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                    <div className="relative group">
                      <input 
                        type="text"
                        placeholder={t.common.placeholderSearch}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-surface-alt/50 border border-border-theme rounded-full px-4 py-2 text-[9px] font-black uppercase tracking-widest text-theme outline-none focus:border-theme transition-all w-48 sm:w-72 shadow-inner"
                      />
                    </div>
                    <button 
                      onClick={handlePurgeVault} 
                      className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${isConfirmingPurge ? 'text-red-500 scale-110' : 'text-muted-theme hover:text-red-500 opacity-60'}`}
                    >
                      {isConfirmingPurge ? t.common.confirmPurge : t.common.purge}
                    </button>
                </div>
            </div>

            {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 opacity-20">
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-theme flex items-center justify-center mb-4">
                        <span className="text-lg font-black text-theme">∅</span>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-theme">{t.common.emptyReel}</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-2">
                    {filteredFavorites.map((fav) => (
                        <div 
                            key={fav.id} 
                            onClick={() => recallFavorite(fav)}
                            className="group relative flex flex-col items-center bg-surface-alt/30 border border-border-theme/40 hover:border-theme/60 rounded-3xl p-3 transition-all cursor-pointer hover:scale-[1.02] active:scale-95 animate-reveal"
                        >
                            <div className="w-full aspect-square rounded-2xl shadow-inner mb-3 overflow-hidden relative" style={{ backgroundColor: fav.hex }}>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                                   <div className="flex space-x-2 scale-90">
                                      <button 
                                          onClick={(e) => { e.stopPropagation(); triggerRename(fav.id, fav.name); }}
                                          className="p-2 bg-white/20 rounded-lg text-white hover:bg-accent"
                                          title={t.common.rename}
                                      >
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                      </button>
                                      <button 
                                          onClick={(e) => removeFavorite(fav.id, e)}
                                          className="p-2 bg-white/20 rounded-lg text-white hover:bg-red-500"
                                          title={t.common.delete}
                                      >
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                      </button>
                                   </div>
                                </div>
                            </div>
                            
                            {editingId === fav.id ? (
                               <div className="w-full flex items-center space-x-1" onClick={e => e.stopPropagation()}>
                                  <input 
                                    ref={editInputRef}
                                    type="text"
                                    value={tempName}
                                    onChange={e => setTempName(e.target.value)}
                                    onKeyDown={e => { if(e.key === 'Enter') finalizeRename(); if(e.key === 'Escape') setEditingId(null); }}
                                    className="w-full bg-surface border border-theme/40 rounded-lg px-2 py-1 text-[9px] font-black text-theme outline-none"
                                  />
                                  <button onClick={finalizeRename} className="text-accent hover:scale-110 p-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg></button>
                               </div>
                            ) : (
                               <>
                                  <span className="text-[9px] font-black uppercase tracking-wider text-theme truncate w-full text-center mb-1 px-1">{fav.name}</span>
                                  <span className="text-[8px] font-bold font-mono text-muted-theme opacity-60">{fav.hex}</span>
                               </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ColorTool;
