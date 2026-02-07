
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Tabs from './components/Tabs';
import HistoryLog from './components/HistoryLog';
import SettingsPanel from './components/SettingsPanel';
import ThemeDecorations from './components/ThemeDecorations';
import DiceTool from './components/tools/DiceTool';
import CoinTool from './components/tools/CoinTool';
import YesNoMaybeTool from './components/tools/YesNoMaybeTool';
import RngTool from './components/tools/RngTool';
import WheelTool from './components/tools/WheelTool';
import PickerTool from './components/tools/PickerTool';
import ColorTool from './components/tools/ColorTool';
import TruthOrDareTool from './components/tools/TruthOrDareTool';
import { ToolType, HistoryItem, Language } from './types';
import { audio } from './services/AudioService';
import { getTranslation } from './services/LocalizationService';

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  voiceFeedback: true,
  hapticsEnabled: true,
  highFidelity: true,
  accentColor: '#6366F1',
  diceSkin: 'standard',
  coinSkin: 'standard',
  theme: 'dark', 
  voiceName: 'Kore',
  language: 'en' as Language
};

const MouseGlow: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[2] will-change-[background]"
      style={{
        background: `radial-gradient(circle 500px at var(--mouse-x) var(--mouse-y), rgba(var(--accent-rgb), 0.04), transparent 80%)`
      }}
    />
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ToolType>(ToolType.DICE);
  const [resetKey, setResetKey] = useState(0);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('dice_settings');
    const parsed = saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...parsed };
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('dice_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const t = getTranslation(settings.language);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', settings.accentColor || '#6366F1');
    const hex = (settings.accentColor || '#6366F1').replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    document.documentElement.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);

    const themeClasses = ['light-mode', 'midnight-mode', 'sepia-mode', 'nord-mode', 'sakura-mode', 'forest-mode'];
    document.body.classList.remove(...themeClasses);

    if (settings.theme === 'light') document.body.classList.add('light-mode');
    else if (settings.theme === 'midnight') document.body.classList.add('midnight-mode');
    else if (settings.theme === 'sepia') document.body.classList.add('sepia-mode');
    else if (settings.theme === 'nord') document.body.classList.add('nord-mode');
    else if (settings.theme === 'sakura') document.body.classList.add('sakura-mode');
    else if (settings.theme === 'forest') document.body.classList.add('forest-mode');
  }, [settings.accentColor, settings.theme]);

  useEffect(() => {
    audio.setEnabled(settings.soundEnabled);
    audio.setVoiceEnabled(settings.voiceFeedback);
    audio.setVoiceName(settings.voiceName || 'Kore');
    audio.setHapticsEnabled(settings.hapticsEnabled);
    audio.setLanguage(settings.language);
    localStorage.setItem('dice_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('dice_history', JSON.stringify(history));
  }, [history]);

  const addToHistory = useCallback((tool: ToolType, result: string) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      tool,
      result,
      timestamp: Date.now()
    };
    setHistory(prev => [newItem, ...prev].slice(0, 50));
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    audio.playBlip(440, 0.02);
  }, []);

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const clearHistory = () => {
    setHistory([]);
    audio.playBlip(330, 0.05);
  };

  const resetAppData = () => {
    // 1. Force state reset with fresh object spread to ensure no reference sharing
    setSettings({ ...DEFAULT_SETTINGS });
    setHistory([]);
    setActiveTab(ToolType.DICE);
    
    // 2. Kill existing tool components by incrementing key
    setResetKey(prev => prev + 1); 
    
    // 3. Clear all storage keys explicitly
    localStorage.removeItem('dice_settings');
    localStorage.removeItem('dice_history');
    localStorage.removeItem('dice_color_favorites');
    
    // Keep settings open so the user sees the reset defaults
    setIsSettingsOpen(true);
    setIsHistoryOpen(false);
  };

  const renderTool = () => {
    const commonProps = { 
      key: `tool-${resetKey}`, 
      haptics: settings.hapticsEnabled,
      diceSkin: settings.diceSkin,
      coinSkin: settings.coinSkin,
      theme: settings.theme,
      language: settings.language
    };
    switch (activeTab) {
      case ToolType.DICE: return <DiceTool {...commonProps} onResult={(res) => addToHistory(ToolType.DICE, res)} />;
      case ToolType.COIN: return <CoinTool {...commonProps} onResult={(res) => addToHistory(ToolType.COIN, res)} />;
      case ToolType.YES_NO: return <YesNoMaybeTool {...commonProps} onResult={(res) => addToHistory(ToolType.YES_NO, res)} />;
      case ToolType.NUMBER: return <RngTool {...commonProps} onResult={(res) => addToHistory(ToolType.NUMBER, res)} />;
      case ToolType.WHEEL: return <WheelTool {...commonProps} onResult={(res) => addToHistory(ToolType.WHEEL, res)} />;
      case ToolType.PICKER: return <PickerTool {...commonProps} onResult={(res) => addToHistory(ToolType.PICKER, res)} />;
      case ToolType.COLOR: return <ColorTool {...commonProps} onResult={(res) => addToHistory(ToolType.COLOR, res)} />;
      case ToolType.TRUTH_DARE: return <TruthOrDareTool {...commonProps} onResult={(res) => addToHistory(ToolType.TRUTH_DARE, res)} />;
      default: return <DiceTool {...commonProps} onResult={(res) => addToHistory(ToolType.DICE, res)} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col selection:bg-[var(--accent)] selection:text-white relative ${!settings.highFidelity ? 'no-blur' : ''}`}>
      <ThemeDecorations theme={settings.theme} enabled={settings.highFidelity} />
      {settings.highFidelity && <MouseGlow />}
      
      <Header 
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        historyCount={history.length}
        language={settings.language}
      />
      
      <main className="flex-grow flex flex-col items-center justify-start pt-8 pb-20 px-4 max-w-4xl mx-auto w-full relative z-10">
        <div className="w-full mb-12">
            <Tabs activeTab={activeTab} onTabChange={setActiveTab} language={settings.language} />
        </div>
        <div className="w-full flex-grow flex flex-col items-center justify-center">
            {renderTool()}
        </div>
      </main>

      <Footer language={settings.language} />

      <SettingsPanel 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdate={updateSetting}
        onReset={resetAppData}
      />

      <HistoryLog 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        items={history}
        onClear={clearHistory}
        onRemoveItem={removeFromHistory}
        language={settings.language}
      />
    </div>
  );
};

export default App;
