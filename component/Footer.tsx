
import React from 'react';
import { Language } from '../types';
import { getTranslation } from '../services/LocalizationService';

interface FooterProps {
  language: Language;
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = getTranslation(language);
  
  return (
    <footer className="w-full py-8 flex flex-col items-center justify-center space-y-2 border-t border-border-theme bg-bg transition-colors duration-500">
      <div className="flex items-center space-x-3 text-muted-theme text-sm">
        <span>{t.common.madeBy} <a href="https://github.com/Newr-Labs" target="_blank" rel="noopener noreferrer" className="text-theme hover:text-accent transition-colors">NEWR Labs</a></span>
        <span className="opacity-20">•</span>
        <a href="https://discord.gg/mas6yV56vz" target="_blank" rel="noopener noreferrer" className="text-theme hover:text-[#5865F2] transition-colors font-bold">Discord</a>
      </div>
      <p className="text-muted-theme text-[10px] tracking-[0.4em] uppercase font-bold opacity-50">
        {t.bios.tagline}
      </p>
    </footer>
  );
};

export default Footer;
