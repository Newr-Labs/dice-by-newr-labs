
import { HistoryItem, ToolType, Language } from '../types';
import { audio } from '../services/AudioService';
import { getTranslation } from '../services/LocalizationService';
import React, { useMemo, useState, useEffect } from 'react';

interface HistoryLogProps {
  isOpen: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onClear: () => void;
  onRemoveItem: (id: string) => void;
  language: Language;
}

interface FilterButtonProps {
  type: ToolType | 'All';
  label: string;
  isActive: boolean;
  count: number;
  onClick: (type: ToolType | 'All') => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ type, label, isActive, count, onClick }) => {
  return (
    <button
      onClick={() => onClick(type)}
      className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all shrink-0 active:scale-95
        ${isActive 
          ? 'bg-theme text-bg border-theme shadow-lg z-10' 
          : 'bg-surface-alt/40 text-muted-theme border-border-theme/30 hover:text-theme hover:bg-surface-alt'
        }
      `}
    >
      <span>{label}</span>
      {count > 0 && (
        <span className={`px-1.5 py-0.5 rounded-md text-[7px] font-black ${isActive ? 'bg-bg/20 text-bg' : 'bg-border-theme/50 text-muted-theme'}`}>
          {count}
        </span>
      )}
    </button>
  );
};

const getToolConfig = (tool: ToolType, t: any) => {
  switch (tool) {
    case ToolType.DICE:
      return {
        label: t.tools[ToolType.DICE],
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="4" y="4" width="16" height="16" rx="3" strokeWidth="2.5" />
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
            <circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          </svg>
        )
      };
    case ToolType.COIN:
      return {
        label: t.tools[ToolType.COIN],
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" strokeWidth="2.5" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v8M9 12h6" />
          </svg>
        )
      };
    case ToolType.YES_NO:
      return {
        label: t.tools[ToolType.YES_NO],
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 9a4 4 0 118 0c0 2.21-1.79 4-4 4M12 17h.01" />
          </svg>
        )
      };
    case ToolType.NUMBER:
      return {
        label: t.tools[ToolType.NUMBER],
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
        )
      };
    case ToolType.WHEEL:
      return {
        label: t.tools[ToolType.WHEEL],
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/20',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" strokeWidth={2.5} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 12l3-5" />
          </svg>
        )
      };
    case ToolType.PICKER:
      return {
        label: t.tools[ToolType.PICKER],
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        )
      };
    case ToolType.COLOR:
      return {
        label: t.tools[ToolType.COLOR],
        color: 'text-pink-400',
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/20',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        )
      };
    case ToolType.TRUTH_DARE:
      return {
        label: t.tools[ToolType.TRUTH_DARE],
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
    default:
      return { label: tool, color: 'text-theme', bg: 'bg-surface-alt', border: 'border-border-theme', icon: null };
  }
};

const HistoryLog: React.FC<HistoryLogProps> = ({ isOpen, onClose, items, onClear, onRemoveItem, language }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isConfirmingWipe, setIsConfirmingWipe] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ToolType | 'All'>('All');
  const [listKey, setListKey] = useState(0);

  const t = getTranslation(language);

  useEffect(() => {
    if (isOpen) {
      setListKey(prev => prev + 1);
      setIsConfirmingWipe(false);
    }
  }, [isOpen, activeFilter]);

  const formatPreciseTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString(language, { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
  };

  const copyResult = (item: HistoryItem) => {
    navigator.clipboard.writeText(item.result);
    setCopiedId(item.id);
    audio.playBlip(1100, 0.02);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleWipe = () => {
    if (!isConfirmingWipe) {
      setIsConfirmingWipe(true);
      audio.playClick(0.05);
      return;
    }
    onClear();
    setIsConfirmingWipe(false);
  };

  const filteredItems = useMemo(() => {
    if (activeFilter === 'All') return items;
    return items.filter(item => item.tool === activeFilter);
  }, [items, activeFilter]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: items.length };
    Object.values(ToolType).forEach(tool => {
      map[tool] = items.filter(i => i.tool === tool).length;
    });
    return map;
  }, [items]);

  const groupedItems = useMemo(() => {
    const groups: { date: string; items: HistoryItem[] }[] = [];
    const dateMap: { [key: string]: HistoryItem[] } = {};
    const sortedItems = [...filteredItems].sort((a, b) => b.timestamp - a.timestamp);

    sortedItems.forEach(item => {
      const date = new Date(item.timestamp);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      let groupKey = date.toLocaleDateString(language, { month: 'short', day: 'numeric', year: 'numeric' });
      if (date.toDateString() === today.toDateString()) groupKey = t.common.today;
      else if (date.toDateString() === yesterday.toDateString()) groupKey = t.common.yesterday;

      if (!dateMap[groupKey]) {
        dateMap[groupKey] = [];
        groups.push({ date: groupKey, items: dateMap[groupKey] });
      }
      dateMap[groupKey].push(item);
    });
    return groups;
  }, [filteredItems, language, t]);

  const handleFilterClick = (type: ToolType | 'All') => {
    if (activeFilter !== type) {
      setActiveFilter(type);
      audio.playClick(0.02);
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-surface border-l border-border-theme z-[101] shadow-2xl transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-border-theme bg-surface/90 backdrop-blur-xl z-50">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-theme">{t.common.registry}</h3>
                <p className="text-[9px] text-muted-theme uppercase tracking-[0.4em] font-black opacity-40">{t.common.resolved}</p>
              </div>
              <button onClick={onClose} className="p-2.5 text-muted-theme hover:text-theme hover:bg-surface-alt rounded-full transition-all active:scale-90">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
              <FilterButton 
                type="All" 
                label="All" 
                isActive={activeFilter === 'All'}
                count={counts['All'] || 0}
                onClick={handleFilterClick}
              />
              {Object.values(ToolType).map(tool => (
                <FilterButton 
                  key={tool} 
                  type={tool} 
                  label={t.tools[tool]} 
                  isActive={activeFilter === tool}
                  count={counts[tool] || 0}
                  onClick={handleFilterClick}
                />
              ))}
            </div>
          </div>

          <div key={listKey} className="flex-grow overflow-y-auto px-5 sm:px-6 py-6 space-y-10 no-scrollbar">
            {filteredItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center space-y-8 opacity-30 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-theme/40 flex items-center justify-center">
                  <span className="text-4xl font-black text-theme">∅</span>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-[0.8em] font-black text-theme">Vacant</p>
                  <p className="text-[8px] uppercase tracking-widest font-bold text-muted-theme mt-2">No records found</p>
                </div>
              </div>
            ) : (
              groupedItems.map((group) => (
                <div key={group.date} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="sticky top-[-1.5rem] z-40 bg-surface/95 backdrop-blur-md py-3 flex items-center justify-between border-b border-border-theme/20 -mx-2 px-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">{group.date}</span>
                    <span className="text-[8px] font-black text-muted-theme uppercase bg-surface-alt px-2 py-0.5 rounded-md border border-border-theme/30">{group.items.length} {t.common.units}</span>
                  </div>
                  
                  <div className="space-y-3">
                    {group.items.map((item, idx) => {
                      const cfg = getToolConfig(item.tool, t);
                      return (
                        <div 
                          key={item.id} 
                          className="group relative bg-surface-alt/20 border border-border-theme/40 hover:border-accent/30 rounded-[1.5rem] p-4 transition-all duration-300 hover:bg-surface-alt/40 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500"
                          style={{ animationDelay: `${idx * 40}ms` }}
                        >
                          <div className="flex justify-between items-start relative z-10">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2.5 ${cfg.bg} ${cfg.color} rounded-xl`}>{cfg.icon}</div>
                              <div className="flex flex-col">
                                <div className="flex items-center space-x-2">
                                  <span className={`text-[10px] font-black uppercase tracking-wider ${cfg.color}`}>{cfg.label}</span>
                                  {activeFilter === 'All' && <span className="text-[7px] font-black opacity-30 uppercase">{item.tool}</span>}
                                </div>
                                <span className="text-[9px] text-muted-theme font-black font-mono tracking-widest opacity-40">{formatPreciseTime(item.timestamp)}</span>
                              </div>
                            </div>
                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => copyResult(item)} className="p-1.5 text-muted-theme hover:text-theme rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg></button>
                              <button onClick={() => onRemoveItem(item.id)} className="p-1.5 text-muted-theme hover:text-red-500 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                            </div>
                          </div>
                          <div className="mt-4 flex items-end justify-between relative z-10">
                            <span className="text-xl sm:text-2xl font-black text-theme tracking-tight truncate max-w-[80%] uppercase">{item.result}</span>
                            {copiedId === item.id && <span className="text-[8px] font-black text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">{t.common.copied}</span>}
                          </div>
                          <div className={`absolute top-0 right-0 w-32 h-32 ${cfg.bg} blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-20`} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 border-t border-border-theme bg-surface/95 backdrop-blur-xl">
              {isConfirmingWipe ? (
                <div className="flex flex-col space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <p className="text-[9px] text-center font-black uppercase tracking-widest text-red-500">{t.common.confirmPurge}</p>
                  <div className="flex space-x-3">
                    <button onClick={() => setIsConfirmingWipe(false)} className="flex-1 py-3 text-[10px] font-black uppercase text-muted-theme bg-surface-alt border border-border-theme rounded-xl">{t.common.abort}</button>
                    <button onClick={handleWipe} className="flex-[2] py-3 text-[10px] font-black uppercase text-white bg-red-600 border border-red-500/20 rounded-xl shadow-lg shadow-red-500/20">{t.common.confirmWipe}</button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={handleWipe}
                  className="group w-full py-4 flex items-center justify-center space-x-3 bg-red-500/5 hover:bg-red-500 border border-red-500/20 rounded-2xl transition-all active:scale-98"
                >
                  <svg className="w-5 h-5 text-red-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500 group-hover:text-white">{t.common.clearAll}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryLog;
