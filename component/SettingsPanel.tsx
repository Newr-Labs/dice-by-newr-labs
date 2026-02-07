
import React, { useState, useEffect } from 'react';
import { audio } from '../services/AudioService';
import { Language } from '../types';
import { getTranslation } from '../services/LocalizationService';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    soundEnabled: boolean;
    voiceFeedback: boolean;
    hapticsEnabled: boolean;
    highFidelity: boolean;
    accentColor: string;
    diceSkin: string;
    coinSkin: string;
    theme: string;
    voiceName: string;
    language: Language;
  };
  onUpdate: (key: string, value: any) => void;
  onReset: () => void;
}

const SectionTitle = ({ children, isRtl }: { children?: React.ReactNode; isRtl: boolean }) => (
  <p className={`text-[10px] text-muted-theme uppercase tracking-[0.3em] font-black mb-4 flex items-center ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}>
    <span className={`flex-grow h-px bg-border-theme ${isRtl ? 'ml-3' : 'mr-3'}`} />
    {children}
  </p>
);

const Toggle = ({ label, active, onClick, isRtl }: { label: string; active: boolean; onClick: () => void; isRtl: boolean }) => (
  <div className={`flex items-center justify-between py-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
    <span className={`text-xs font-bold uppercase tracking-tight text-theme ${isRtl ? 'text-right' : ''}`}>{label}</span>
    <button 
      onClick={onClick}
      className={`w-10 h-5 rounded-full transition-all relative border ${active ? 'bg-accent border-accent' : 'bg-surface-alt border-border-theme'}`}
    >
      <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all ${active ? 'left-[22px] bg-white' : 'left-0.5 bg-muted-theme'}`} />
    </button>
  </div>
);

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, settings, onUpdate, onReset }) => {
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const t = getTranslation(settings.language);
  const isRtl = settings.language === 'ar';

  useEffect(() => {
    if (!isOpen) setIsConfirmingReset(false);
  }, [isOpen]);

  const handleToggleClick = (key: string, currentValue: boolean) => {
    onUpdate(key, !currentValue);
    audio.haptic(20, key === 'hapticsEnabled');
  };

  const handleResetClick = () => {
    if (!isConfirmingReset) {
      setIsConfirmingReset(true);
      audio.haptic([10, 30]);
    } else {
      onReset();
      setIsConfirmingReset(false);
      audio.playBlip(220, 0.1);
    }
  };

  const colors = [
    { name: 'Pink', value: '#FF007F' }, { name: 'Violet', value: '#8B5CF6' }, { name: 'Indigo', value: '#6366F1' },
    { name: 'Cyan', value: '#06B6D4' }, { name: 'Emerald', value: '#10B981' }, { name: 'Amber', value: '#F59E0B' },
    { name: 'Red', value: '#EF4444' }
  ];

  const languages: { id: Language; name: string }[] = [
    { id: 'en', name: 'English' }, { id: 'es', name: 'Español' }, { id: 'fr', name: 'Français' }, 
    { id: 'de', name: 'Deutsch' }, { id: 'ru', name: 'Русский' }, { id: 'ja', name: '日本語' }, 
    { id: 'zh', name: '中文' }, { id: 'ar', name: 'العربية' }, { id: 'id', name: 'Bahasa ID' }
  ];

  const themes = ['dark', 'light', 'midnight', 'nord', 'sepia', 'sakura', 'forest'];
  const diceSkins = ['standard', 'stealth', 'neon', 'marble'];
  const coinSkins = ['standard', 'digital', 'abstract'];

  return (
    <>
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed top-0 left-0 h-full w-full sm:w-96 bg-surface border-r border-border-theme shadow-2xl z-[101] transition-transform duration-500 ease-[cubic-bezier(0.16, 1, 0.3, 1)] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full overflow-hidden">
          <div className={`p-6 border-b border-border-theme flex items-center justify-between bg-surface/80 backdrop-blur-md ${isRtl ? 'flex-row-reverse' : ''}`}>
            <div className={isRtl ? 'text-right' : 'text-left'}>
              <h3 className="text-xl font-black uppercase tracking-tighter text-theme">{t.settings.title}</h3>
              <p className="text-[9px] text-muted-theme uppercase tracking-widest font-bold mt-1 opacity-50">{t.common.version}</p>
            </div>
            <button onClick={onClose} className="p-2 text-muted-theme hover:text-theme hover:bg-surface-alt rounded-lg transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-6 space-y-10 no-scrollbar" dir={isRtl ? 'rtl' : 'ltr'}>
            <section>
              <SectionTitle isRtl={isRtl}>{t.settings.language}</SectionTitle>
              <div className="grid grid-cols-2 gap-2" dir="ltr">
                {languages.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => { onUpdate('language', lang.id); audio.haptic(10); }}
                    className={`min-h-[46px] py-2 px-3 rounded-xl text-[10px] font-bold transition-all border flex items-center justify-center text-center overflow-hidden break-words leading-tight ${settings.language === lang.id ? 'bg-theme text-bg border-theme shadow-lg scale-[1.02]' : 'bg-surface-alt text-muted-theme border-border-theme hover:text-theme'}`}
                  >
                    <span className="w-full text-center truncate px-1">{lang.name}</span>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <SectionTitle isRtl={isRtl}>{t.settings.brightness}</SectionTitle>
              <div className="grid grid-cols-2 xs:grid-cols-3 gap-2">
                {themes.map(th => (
                  <button
                    key={th}
                    onClick={() => { onUpdate('theme', th); audio.haptic(15); }}
                    className={`py-2.5 px-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all border ${settings.theme === th ? 'bg-theme text-bg border-theme shadow-md' : 'bg-surface-alt text-muted-theme border-border-theme hover:text-theme'}`}
                  >
                    {t.settings.themes[th] || th}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div>
                <SectionTitle isRtl={isRtl}>{t.settings.diceSkin}</SectionTitle>
                <div className="grid grid-cols-2 gap-2">
                  {diceSkins.map(s => (
                    <button
                      key={s}
                      onClick={() => onUpdate('diceSkin', s)}
                      className={`py-3 rounded-xl text-[10px] font-bold uppercase transition-all border ${settings.diceSkin === s ? 'bg-theme text-bg' : 'bg-surface-alt text-muted-theme border-border-theme'}`}
                    >
                      {t.settings.skins[s]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <SectionTitle isRtl={isRtl}>{t.settings.coinSkin}</SectionTitle>
                <div className="grid grid-cols-3 gap-2">
                  {coinSkins.map(s => (
                    <button
                      key={s}
                      onClick={() => onUpdate('coinSkin', s)}
                      className={`py-3 rounded-xl text-[9px] font-bold uppercase transition-all border ${settings.coinSkin === s ? 'bg-theme text-bg' : 'bg-surface-alt text-muted-theme border-border-theme'}`}
                    >
                      {t.settings.skins[s]}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <SectionTitle isRtl={isRtl}>{t.settings.audio} & AI</SectionTitle>
              <div className="space-y-1">
                <Toggle isRtl={isRtl} label={t.common.options + " SFX"} active={settings.soundEnabled} onClick={() => handleToggleClick('soundEnabled', settings.soundEnabled)} />
                <Toggle isRtl={isRtl} label={t.settings.voice} active={settings.voiceFeedback} onClick={() => handleToggleClick('voiceFeedback', settings.voiceFeedback)} />
                <Toggle isRtl={isRtl} label={t.settings.haptics} active={settings.hapticsEnabled} onClick={() => handleToggleClick('hapticsEnabled', settings.hapticsEnabled)} />
                <Toggle isRtl={isRtl} label={t.settings.fidelity} active={settings.highFidelity} onClick={() => handleToggleClick('highFidelity', settings.highFidelity)} />
              </div>
              <div className="mt-4 grid grid-cols-4 gap-1 p-1 bg-surface-alt rounded-xl border border-border-theme" dir="ltr">
                {['Kore', 'Puck', 'Charon', 'Fenrir'].map(v => (
                  <button key={v} onClick={() => { onUpdate('voiceName', v); audio.haptic(5); }} className={`py-2 rounded-lg text-[9px] font-black uppercase transition-all ${settings.voiceName === v ? 'bg-theme text-bg shadow-sm' : 'text-muted-theme hover:text-theme'}`}>{v}</button>
                ))}
              </div>
            </section>

            <section>
              <SectionTitle isRtl={isRtl}>{t.settings.theme}</SectionTitle>
              <div className="flex flex-wrap gap-2 justify-center">
                {colors.map(c => (
                  <button key={c.value} onClick={() => { onUpdate('accentColor', c.value); audio.haptic(10); }} className={`w-10 h-10 rounded-full border-4 transition-all ${settings.accentColor === c.value ? 'border-theme scale-110 shadow-xl' : 'border-transparent opacity-40 hover:opacity-100 hover:scale-105'}`} style={{ backgroundColor: c.value }} />
                ))}
              </div>
            </section>

            <section>
              <SectionTitle isRtl={isRtl}>{t.settings.social}</SectionTitle>
              <div className="grid grid-cols-1 gap-3">
                <a href="https://discord.gg/mas6yV56vz" target="_blank" className={`flex items-center justify-between p-4 bg-surface-alt border border-border-theme rounded-2xl hover:border-[#5865F2] transition-all group active:scale-95 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <span className="text-xs font-bold uppercase text-muted-theme group-hover:text-[#5865F2]">{t.settings.discord}</span>
                  <svg className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.419c0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z"/></svg>
                </a>
                <a href="https://github.com/Newr-Labs" target="_blank" className={`flex items-center justify-between p-4 bg-surface-alt border border-border-theme rounded-2xl hover:border-theme transition-all group active:scale-95 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <span className="text-xs font-bold uppercase text-muted-theme group-hover:text-theme">{t.settings.github}</span>
                  <svg className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:text-theme" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </section>
          </div>

          <div className="p-6 border-t border-border-theme bg-surface/80 backdrop-blur-md">
            <button 
              onClick={handleResetClick} 
              className={`w-full py-4 text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl transition-all ${isConfirmingReset ? 'bg-red-600 text-white shadow-xl animate-vibrate' : 'text-muted-theme hover:text-red-500 hover:bg-red-500/5'}`}
            >
              {isConfirmingReset ? t.common.confirmReset : t.settings.factoryReset}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPanel;
