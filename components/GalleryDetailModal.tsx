import React, { useState } from 'react';
import { CartoonVersion } from '../types';

interface GalleryDetailModalProps {
  originalImage: string;
  version: CartoonVersion;
  onClose: () => void;
  onRecreate: (prompt: string) => void;
}

export const GalleryDetailModal: React.FC<GalleryDetailModalProps> = ({ 
  originalImage, 
  version, 
  onClose, 
  onRecreate 
}) => {
  const [editedPrompt, setEditedPrompt] = useState(version.prompt);

  return (
    <div 
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fade-in" 
        aria-labelledby="modal-title" 
        role="dialog" 
        aria-modal="true"
        onClick={onClose}
    >
      <div 
        className="relative bg-gray-900 w-full max-w-2xl rounded-xl shadow-xl ring-1 ring-[var(--color-primary)]/20 m-4 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 id="modal-title" className="text-lg font-bold text-[var(--color-primary)] transition-colors duration-300">Edit & Recreate</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors rounded-full p-1">
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm font-medium text-gray-400 mb-1 text-center">Original</p>
                    <img src={originalImage} alt="Original" className="w-full aspect-square object-cover rounded-md" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-400 mb-1 text-center">Cartoon</p>
                    <img src={version.cartoonImage} alt="Cartoon version" className="w-full aspect-square object-cover rounded-md" />
                </div>
            </div>

            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-400">Prompt</label>
              <textarea
                id="prompt"
                rows={4}
                value={editedPrompt}
                onChange={(e) => setEditedPrompt(e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] text-sm placeholder-gray-500 transition-colors duration-300"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
                <button 
                    onClick={onClose} 
                    className="bg-gray-700 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={() => onRecreate(editedPrompt)} 
                    className="bg-[var(--color-accent)] text-[var(--color-text-on-primary)] font-bold py-2 px-4 rounded-md hover:opacity-90 transition-all duration-300"
                >
                    Recreate with this Prompt
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};