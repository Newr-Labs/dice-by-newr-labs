
import React, { useMemo } from 'react';

interface ThemeDecorationsProps {
  theme: string;
  enabled: boolean;
}

const ThemeDecorations: React.FC<ThemeDecorationsProps> = ({ theme, enabled }) => {
  if (!enabled) return null;

  const particles = useMemo(() => {
    const count = 30; 
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${(i * (100 / count)) + (Math.random() * 10) - 5}%`,
      delay: `${Math.random() * -30}s`,
      duration: `${15 + Math.random() * 20}s`,
      size: `${12 + Math.random() * 18}px`,
      opacity: 0.3 + Math.random() * 0.3,
      rotation: `${Math.random() * 360}deg`,
      sway: `${Math.random() * 100 - 50}px`
    }));
  }, [theme]);

  const nebulaOrbs = useMemo(() => {
    return Array.from({ length: 4 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${350 + Math.random() * 400}px`,
      color: i % 2 === 0 ? 'rgba(var(--accent-rgb), 0.12)' : 'rgba(124, 58, 237, 0.08)',
      delay: `${i * -8}s`,
      duration: `${30 + Math.random() * 20}s`
    }));
  }, [theme]);

  const stars = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() > 0.8 ? '2px' : '1px',
      opacity: 0.2 + Math.random() * 0.5,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 7}s`,
    }));
  }, []); // Only generate once per session for stability

  const renderGrid = () => (
    <div className="cyber-grid animate-grid-scroll" />
  );

  const renderStars = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {nebulaOrbs.map(orb => (
        <div
          key={orb.id}
          className="absolute rounded-full animate-nebula blur-[80px] sm:blur-[120px] will-change-transform"
          style={{
            top: orb.top,
            left: orb.left,
            width: orb.size,
            height: orb.size,
            backgroundColor: orb.color,
            animationDelay: orb.delay,
            animationDuration: orb.duration,
          }}
        />
      ))}
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  );

  const renderSepia = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
       {particles.map(p => (
        <div
          key={p.id}
          className="falling-item"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            '--sway': p.sway,
            '--item-opacity': 0.15,
          } as any}
        >
          <div 
            className="rounded-full bg-black/10"
            style={{ width: '2px', height: '2px' }}
          />
        </div>
      ))}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]" />
    </div>
  );

  const renderLight = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-accent/5 animate-bokeh blur-[40px] will-change-transform"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${100 + Math.random() * 150}px`,
            height: `${100 + Math.random() * 150}px`,
            animationDelay: `${Math.random() * -30}s`,
            animationDuration: `${20 + Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );

  const renderSakura = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="falling-item"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            '--sway': p.sway,
            '--item-opacity': p.opacity,
          } as any}
        >
          <svg 
            width={p.size} 
            height={p.size} 
            viewBox="0 0 24 24" 
            className="text-theme/40"
            style={{ transform: `rotate(${p.rotation})` }}
          >
            <path fill="currentColor" d="M12,2C12,2 8,6 8,10C8,14 12,22 12,22C12,22 16,14 16,10C16,6 12,2 12,2Z" />
          </svg>
        </div>
      ))}
    </div>
  );

  const renderNord = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="falling-item"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            '--sway': p.sway,
            '--item-opacity': 0.2,
          } as any}
        >
          <div 
            className="bg-white/20 blur-[2px] rotate-45"
            style={{ width: p.size, height: p.size }}
          />
        </div>
      ))}
    </div>
  );

  const renderForest = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.slice(0, 10).map(p => (
        <div
          key={p.id}
          className="absolute animate-float-slow"
          style={{
            top: `${Math.random() * 100}%`,
            left: p.left,
            width: '4px',
            height: '4px',
            backgroundColor: '#fbbf24',
            borderRadius: '50%',
            boxShadow: '0 0 10px #fbbf24',
            opacity: 0.3,
            animationDelay: p.delay,
            animationDuration: `${20 + Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      <div className="grain-overlay" />
      <div className="scanlines" />
      {renderGrid()}
      
      {(theme === 'dark' || theme === 'midnight') && renderStars()}
      {theme === 'sepia' && renderSepia()}
      {theme === 'light' && renderLight()}
      {theme === 'sakura' && renderSakura()}
      {theme === 'nord' && renderNord()}
      {theme === 'forest' && renderForest()}
      
      <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-transparent to-bg/40 pointer-events-none" />
    </div>
  );
};

export default ThemeDecorations;
