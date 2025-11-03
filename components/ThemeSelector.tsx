import React from 'react';
import { Theme } from '../types';

export const ThemeSelector: React.FC<{
    themes: Theme[];
    onThemeSelect: (theme: Theme) => void;
    isLoading: boolean;
    selectedTheme: Theme | null;
}> = ({ themes, onThemeSelect, isLoading, selectedTheme }) => {
    return (
        <div className="w-full p-1 animate-fade-in">
            <h2 className="font-cartoon text-4xl text-center mb-4 text-[var(--color-primary)]" style={{textShadow: '2px 2px 0 #000'}}>Choose a Style</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {themes.map((theme) => {
                    const isSelected = isLoading && theme.name === selectedTheme?.name;
                    return (
                        <button
                            key={theme.name}
                            onClick={() => onThemeSelect(theme)}
                            disabled={isLoading}
                            className={`group relative text-left h-24 sm:h-32 rounded-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 border-2 border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-[var(--color-accent)] active:translate-y-px overflow-hidden shadow-[4px_4px_0px_#000] ${isSelected ? 'ring-4 ring-[var(--color-accent)] ring-offset-2 ring-offset-white' : ''}`}
                            style={{
                              backgroundImage: `url(${theme.imageUrl})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                        >
                            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all duration-300 p-2 sm:p-3 flex flex-col justify-end">
                              <h3 className="font-bold text-base sm:text-lg text-white leading-tight" style={{textShadow: '1px 1px 2px #000'}}>{theme.name}</h3>
                              <p className="hidden sm:block text-xs text-gray-200" style={{textShadow: '1px 1px 2px #000'}}>{theme.description}</p>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    );
};
