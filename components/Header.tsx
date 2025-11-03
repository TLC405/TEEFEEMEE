import React, { useState, useEffect, useRef } from 'react';

export interface HeaderProps {
    onGalleryToggle: () => void;
    onBackgroundChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBackgroundReset: () => void;
}

export const Header: React.FC<HeaderProps> = React.memo(({ onGalleryToggle, onBackgroundChange, onBackgroundReset }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const backgroundInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-20 shrink-0 transition-all duration-300 ${
            isScrolled 
            ? 'bg-[var(--color-surface)]/90 backdrop-blur-lg shadow-2xl shadow-black/30 border-b border-black/20' 
            : 'bg-transparent border-b border-transparent'
        }`}>
            <div className="max-w-7xl mx-auto px-4">
                <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-16' : 'h-24'}`}>
                    <div className="group flex items-center space-x-3 cursor-default">
                        <svg className="h-10 w-10 text-[var(--color-primary)] transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 filter drop-shadow-[0_0_8px_var(--color-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                        </svg>
                        <h1 className="font-cartoon text-4xl text-[var(--color-text-primary)] tracking-tight transition-colors duration-300 group-hover:text-[var(--color-secondary)]" style={{textShadow: "3px 3px 0px #000"}}>
                            TeefeeMe
                        </h1>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <input type="file" ref={backgroundInputRef} onChange={onBackgroundChange} accept="image/*" className="hidden" />
                        <button onClick={() => backgroundInputRef.current?.click()} className="group p-2 rounded-full hover:bg-white/10 transition-colors" title="Change Background">
                          <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </button>
                        <button onClick={onBackgroundReset} className="group p-2 rounded-full hover:bg-white/10 transition-colors" title="Reset Background">
                           <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>
                        <button
                            onClick={onGalleryToggle}
                            className="group relative font-bold text-lg text-[var(--color-text-on-primary)] transition-all duration-300 p-3 rounded-full bg-gray-900/80 hover:bg-[var(--color-primary)] border-2 border-black hover:shadow-[0_0_20px_var(--color-primary)]"
                            title="Open Gallery Archives"
                            aria-label="Open Gallery Archives"
                        >
                           <div className="absolute -inset-0.5 rounded-full bg-[var(--color-primary)] opacity-0 group-hover:opacity-75 blur transition duration-500"></div>
                           <div className="relative flex items-center justify-center">
                            <svg className="w-6 h-6 text-[var(--color-primary)] group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                            </svg>
                           </div>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
});