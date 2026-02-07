
import React from 'react';
import { ToolType, Language } from '../types';
import { audio } from '../services/AudioService';
import { getTranslation } from '../services/LocalizationService';

interface TabsProps {
  activeTab: ToolType;
  onTabChange: (tab: ToolType) => void;
  language: Language;
}

const AI_TOOLS = [ToolType.COLOR, ToolType.TRUTH_DARE];

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange, language }) => {
  const tabs = Object.values(ToolType);
  const t = getTranslation(language);

  const handleTabClick = (tab: ToolType) => {
    onTabChange(tab);
    audio.haptic(10);
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 p-2 bg-surface-alt/50 rounded-[2rem] border-2 border-theme backdrop-blur-sm transition-colors duration-500">
      {tabs.map((tab) => {
        const isAi = AI_TOOLS.includes(tab);
        return (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`
              relative px-6 py-4 rounded-[1.5rem] text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 ease-out
              ${activeTab === tab 
                ? 'bg-theme text-bg shadow-2xl scale-105' 
                : 'text-muted-theme hover:text-theme hover:bg-surface'
              }
            `}
          >
            {t.tools[tab] || tab}
            {isAi && (
              <span className={`absolute -top-1 -right-1 px-1.5 py-0.5 rounded-md text-[7px] font-black border ${activeTab === tab ? 'bg-bg text-theme border-bg' : 'bg-accent text-white border-accent'}`}>
                AI
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
