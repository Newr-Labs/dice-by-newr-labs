
import React from 'react';
import { Language } from '../types';
import { getTranslation } from '../services/LocalizationService';

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  historyCount: number;
  language: Language;
}

const Header: React.FC<HeaderProps> = ({ onOpenHistory, onOpenSettings, historyCount, language }) => {
  const t = getTranslation(language);
  
  return (
    <header className="w-full py-5 px-6 sm:px-10 flex items-center justify-between border-b border-border-theme sticky top-0 bg-surface/80 backdrop-blur-md z-50 transition-colors duration-500">
      <div className="flex items-center space-x-3 group cursor-default">
        <h1 className="text-xl sm:text-2xl font-black tracking-tighter uppercase text-theme group-hover:text-accent transition-colors">DICE</h1>
        <div className="h-4 w-px bg-border-theme" />
        <span className="text-[10px] text-muted-theme font-black uppercase tracking-[0.2em] opacity-60">NEWR LABS</span>
      </div>
      
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button 
          onClick={onOpenHistory}
          className="relative text-muted-theme hover:text-theme hover:bg-surface-alt transition-all p-2.5 rounded-xl"
          title={t.common.historyTooltip}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {historyCount > 0 && (
            <span className="absolute top-1 right-1 bg-accent text-white text-[8px] font-bold px-1 rounded-full min-w-[16px] h-4 flex items-center justify-center border-2 border-surface shadow-sm">
              {historyCount > 99 ? '99' : historyCount}
            </span>
          )}
        </button>

        <button 
          onClick={onOpenSettings}
          className="text-muted-theme hover:text-theme hover:bg-surface-alt transition-all p-2.5 rounded-xl"
          title={t.common.settingsTooltip}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
