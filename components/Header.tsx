import React from 'react';

export const Header: React.FC<{ onGalleryToggle: () => void; }> = ({ onGalleryToggle }) => (
    <header className="w-full bg-transparent sticky top-0 z-20 shrink-0">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-20">
                <div className="flex items-center space-x-3">
                    <svg className="h-10 w-10 text-[var(--color-primary)] transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                    </svg>
                    <h1 className="font-cartoon text-4xl text-[var(--color-text-primary)] tracking-tight">TeefeeMe</h1>
                </div>
                 <div className="flex items-center space-x-4">
                    <p className="hidden md:block font-cartoon text-lg font-medium text-[var(--color-secondary)] tracking-wider uppercase transition-colors duration-300">Transform Your Reality</p>
                    <button 
                        onClick={onGalleryToggle}
                        className="text-[var(--color-primary)] hover:text-white transition-all duration-300 p-2 rounded-md bg-gray-800/50 hover:bg-gray-800 border-2 border-black hover:border-[var(--color-primary)]"
                        title="Open Gallery Archives"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </header>
);