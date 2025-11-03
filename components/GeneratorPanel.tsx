import React from 'react';
import { Theme } from '../types';
import { ResultDisplay } from './ResultDisplay';
import { ThemeSelector } from './ThemeSelector';


interface GeneratorPanelProps {
    originalImage: string;
    resultImage: string | null;
    error: string | null;
    themes: Theme[];
    selectedTheme: Theme | null;
    isLoading: boolean;
    onThemeSelect: (theme: Theme) => void;
    onReset: () => void;
    onDownload: () => void;
}

export const GeneratorPanel: React.FC<GeneratorPanelProps> = ({
    originalImage,
    resultImage,
    error,
    themes,
    selectedTheme,
    isLoading,
    onThemeSelect,
    onReset,
    onDownload
}) => {
    return (
        <div className="w-full flex flex-col items-center animate-pop-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full mt-4">

                {/* Original Image Display */}
                <div className="simpson-panel p-4 flex flex-col">
                    <h2 className="font-cartoon text-3xl text-center mb-4 text-[var(--color-primary)]" style={{textShadow: '2px 2px 0 #000'}}>Original</h2>
                    <div className="aspect-square w-full">
                       <img src={originalImage} alt="User upload" className="rounded-lg w-full h-full object-cover border-2 border-black" />
                    </div>
                </div>
                
                {/* Controls Column */}
                <div className="simpson-panel p-4 flex flex-col justify-between" style={{ animationDelay: '100ms' }}>
                    <ThemeSelector themes={themes} onThemeSelect={onThemeSelect} isLoading={isLoading} selectedTheme={selectedTheme} />
                    <div className="mt-4 flex flex-col space-y-3">
                         <button 
                            onClick={onDownload} 
                            disabled={!resultImage || isLoading}
                            className="font-cartoon bg-[var(--color-accent)] text-2xl text-white py-3 px-6 rounded-lg border-2 border-black hover:bg-pink-600 transition-all active:translate-y-px shadow-[4px_4px_0px_#000] disabled:bg-gray-400 disabled:shadow-none disabled:translate-y-0">
                            Download Art
                        </button>
                        <button 
                            onClick={onReset} 
                            disabled={isLoading}
                            className="font-cartoon bg-gray-200 text-lg text-gray-800 py-2 px-6 rounded-lg border-2 border-black hover:bg-gray-300 transition-all active:translate-y-px shadow-[4px_4px_0px_#000] disabled:bg-gray-400 disabled:shadow-none disabled:translate-y-0">
                            Start Over
                        </button>
                    </div>
                </div>

                {/* Result Display */}
                <div className="simpson-panel p-4 flex flex-col" style={{ animationDelay: '200ms' }}>
                   <h2 className="font-cartoon text-3xl text-center mb-4 text-[var(--color-accent)]" style={{textShadow: '2px 2px 0 #000'}}>TeefeeMe Version</h2>
                   <ResultDisplay resultDataUrl={resultImage} error={error} />
                </div>
            </div>
        </div>
    );
}