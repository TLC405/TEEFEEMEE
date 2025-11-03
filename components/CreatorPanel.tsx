

import React from 'react';
import { CARTOON_STYLES, CartoonStyle } from '../constants';

export const CreatorPanel: React.FC<{
  onStyleSelect: (style: CartoonStyle) => void;
  isLoading: boolean;
  onStyleFuseClick: () => void;
}> = ({ onStyleSelect, isLoading, onStyleFuseClick }) => {

  const StyleGrid = ({ styles }: { styles: CartoonStyle[] }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {styles.map(style => (
          <button 
            key={style.label} 
            onClick={() => onStyleSelect(style)} 
            title={style.label}
            disabled={isLoading}
            className="relative aspect-[4/5] rounded-lg overflow-hidden transition-all duration-200 group bg-[var(--color-surface)] border-2 border-black hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center p-2 text-center"
          >
              <div 
                className="font-cartoon text-3xl md:text-4xl text-[var(--color-primary)] transition-transform group-hover:scale-105"
                style={{
                  textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
                }}
              >
                  {style.label}
              </div>
              {isLoading && <div className="absolute inset-0 bg-black/50" />}
          </button>
      ))}
    </div>
  );

  return (
    <div className="shrink-0">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h3 className="font-cartoon text-2xl text-[var(--color-text-secondary)] transition-colors duration-300">Choose Your Style!</h3>
            <button 
              onClick={onStyleFuseClick}
              disabled={isLoading}
              className="font-cartoon bg-[var(--color-accent)] text-lg text-[var(--color-text-on-primary)] py-2 px-5 rounded-md border-2 border-black hover:bg-[var(--color-primary)] transition-colors duration-300 flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-px"
            >
              ✨ Style Fuse ✨
            </button>
        </div>
        
        <div>
          <label className="font-cartoon block text-2xl text-[var(--color-secondary)] mb-2 transition-colors duration-300">Adult Animation</label>
          <StyleGrid styles={CARTOON_STYLES.adultShows} />
        </div>

        <div>
          <label className="font-cartoon block text-2xl text-[var(--color-secondary)] mb-2 transition-colors duration-300">Kid-Friendly</label>
          <StyleGrid styles={CARTOON_STYLES.kidShows} />
        </div>

        <div>
          <label className="font-cartoon block text-2xl text-[var(--color-secondary)] mb-2 transition-colors duration-300">Classic Toons</label>
          <StyleGrid styles={CARTOON_STYLES.classicShows} />
        </div>
      </div>
    </div>
  );
};