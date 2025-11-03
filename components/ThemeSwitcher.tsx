import React from 'react';
import { CARTOON_STYLES, DEFAULT_THEME } from '../constants';

const allStyles = Object.values(CARTOON_STYLES).flat();
const uniqueThemes = [
  { label: 'Default', theme: DEFAULT_THEME },
  ...allStyles.reduce((acc, style) => {
    if (!acc.some(item => item.label === style.label)) {
      acc.push({ label: style.label, theme: style.theme });
    }
    return acc;
  }, [] as {label: string, theme: Record<string,string>}[]),
];

// Fix: Add helper function to correctly convert hex color to RGB values for CSS variables.
const getRgbFromHex = (hex: string): string => {
  let sanitizedHex = hex.startsWith('#') ? hex.slice(1) : hex;
  if (sanitizedHex.length === 3) {
    sanitizedHex = sanitizedHex.split('').map(char => char + char).join('');
  }
  if (sanitizedHex.length !== 6) return '0, 0, 0'; // Fallback
  const r = parseInt(sanitizedHex.substring(0, 2), 16);
  const g = parseInt(sanitizedHex.substring(2, 4), 16);
  const b = parseInt(sanitizedHex.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '0, 0, 0';
  return `${r}, ${g}, ${b}`;
};

export const ThemeSwitcher: React.FC<{
  activeTheme: Record<string, string>;
  onThemeChange: (theme: Record<string, string>) => void;
}> = ({ activeTheme, onThemeChange }) => {
  const isActive = (theme: Record<string, string>) => theme['--color-primary'] === activeTheme['--color-primary'];

  return (
    <div className="pt-4 mt-4 border-t-2 border-black">
      <h3 className="font-cartoon text-xl text-center text-[var(--color-text-secondary)] mb-3">Theme Deck</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 -mb-2">
        {uniqueThemes.map(({ label, theme }) => (
          <button
            key={label}
            onClick={() => onThemeChange(theme)}
            className={`shrink-0 w-32 h-20 rounded-lg border-2 p-2 flex flex-col justify-between transition-all duration-200 ${
              isActive(theme)
                ? 'border-[var(--color-primary)] scale-105 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.5)]'
                : 'border-black hover:border-[var(--color-secondary)]'
            }`}
            // Fix: Correctly set CSS custom property and cast to React.CSSProperties to resolve TypeScript error.
            // The previous logic for converting hex to rgb was incorrect.
            style={{
              backgroundColor: theme['--color-surface'],
              '--color-primary-rgb': getRgbFromHex(theme['--color-primary']),
            } as React.CSSProperties}
            title={`Switch to ${label} theme`}
          >
            <div className="flex gap-1">
              <div className="w-1/3 h-4 rounded" style={{ backgroundColor: theme['--color-primary'] }}></div>
              <div className="w-1/3 h-4 rounded" style={{ backgroundColor: theme['--color-accent'] }}></div>
              <div className="w-1/3 h-4 rounded" style={{ backgroundColor: theme['--color-secondary'] }}></div>
            </div>
            <p className="text-xs font-semibold truncate" style={{ color: theme['--color-text-primary'] }}>
              {label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};