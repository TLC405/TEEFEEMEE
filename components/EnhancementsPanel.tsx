

import React, { useState } from 'react';
import { STICKERS } from '../constants';

export const EnhancementsPanel: React.FC<{
  onEyeColorChange: (color: string) => void;
  onStickerAdd: (src: string) => void;
  isLoading: boolean;
}> = ({ onEyeColorChange, onStickerAdd, isLoading }) => {
  const [eyeColor, setEyeColor] = useState('#4287f5');

  return (
    <div className="w-full h-full bg-gray-900/50 p-4 rounded-lg border-2 border-black/50 shadow-lg flex flex-col space-y-4 backdrop-blur-sm">
      <h3 className="font-cartoon text-2xl text-center text-[var(--color-primary)] tracking-wider" style={{ textShadow: '2px 2px 0 #000' }}>Enhancements</h3>
      
      <div className="bg-black/20 p-4 rounded-lg border border-black/30">
        <label className="block text-sm font-semibold text-gray-300 mb-2">Change Eye Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={eyeColor}
            onChange={(e) => setEyeColor(e.target.value)}
            disabled={isLoading}
            className="w-12 h-10 p-1 bg-gray-800 border-2 border-black rounded-md cursor-pointer disabled:cursor-not-allowed"
          />
          <button
            onClick={() => onEyeColorChange(eyeColor)}
            disabled={isLoading}
            className="w-full font-cartoon text-lg bg-[var(--color-accent)] text-[var(--color-text-on-primary)] py-2 px-3 rounded-md border-2 border-black hover:opacity-90 disabled:bg-gray-800 disabled:text-gray-600 transition-all active:translate-y-px"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="bg-black/20 p-4 rounded-lg border border-black/30">
        <label className="block text-sm font-semibold text-gray-300 mb-2">Add Sticker</label>
        <div className="grid grid-cols-4 gap-2">
            {STICKERS.map(sticker => (
                <button
                    key={sticker.name}
                    title={`Add ${sticker.name} sticker`}
                    onClick={() => onStickerAdd(sticker.src)}
                    disabled={isLoading}
                    className="aspect-square bg-gray-700/50 rounded-md flex items-center justify-center p-2 border-2 border-transparent hover:border-[var(--color-primary)] hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <img src={sticker.src} alt={sticker.name} className="w-full h-full object-contain" />
                </button>
            ))}
        </div>
      </div>

    </div>
  );
};