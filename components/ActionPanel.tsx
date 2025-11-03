import React, { useState } from 'react';
import { CARTOON_STYLES, CartoonStyle, ASPECT_RATIOS } from '../constants';
import { AppMode } from '../App';

const modes: { id: AppMode; label: string, icon: string }[] = [
    { id: 'cartoonify', label: 'Cartoonify', icon: '🎨' },
    { id: 'edit', label: 'Edit', icon: '🖌️' },
    { id: 'generate', label: 'Generate', icon: '✨' },
    { id: 'analyze', label: 'Analyze', icon: '🔬' },
];

export const ActionPanel: React.FC<{
    mode: AppMode;
    onModeChange: (mode: AppMode) => void;
    isLoading: boolean;
    photoUploaded: boolean;
    onStyleSelect: (style: CartoonStyle) => void;
    onStyleFuseClick: () => void;
    onEdit: (prompt: string) => void;
    onGenerate: (prompt: string, aspectRatio: string) => void;
    onAnalyze: (prompt: string, useThinking: boolean) => void;
    analysisResult: string | null;
}> = ({ 
    mode, 
    onModeChange, 
    isLoading, 
    photoUploaded,
    onStyleSelect, 
    onStyleFuseClick,
    onEdit,
    onGenerate,
    onAnalyze,
    analysisResult
}) => {
    
    // Internal state for controlled components in each panel
    const [editPrompt, setEditPrompt] = useState('');
    const [generatePrompt, setGeneratePrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [analyzePrompt, setAnalyzePrompt] = useState('');
    const [useThinking, setUseThinking] = useState(false);

    const StyleGrid = ({ styles }: { styles: CartoonStyle[] }) => (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {styles.map(style => (
              <button 
                key={style.label} 
                onClick={() => onStyleSelect(style)} 
                title={style.label}
                disabled={isLoading || !photoUploaded}
                className="relative aspect-[4/5] rounded-lg overflow-hidden transition-all duration-200 group bg-[var(--color-surface)] border-2 border-black hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center p-2 text-center"
              >
                  <div className="font-cartoon text-3xl md:text-4xl text-[var(--color-primary)] transition-transform group-hover:scale-105"
                    style={{ textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>
                      {style.label}
                  </div>
                  {(isLoading || !photoUploaded) && <div className="absolute inset-0 bg-black/50" />}
              </button>
          ))}
        </div>
    );

    const renderPanelContent = () => {
        switch (mode) {
            case 'cartoonify':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex justify-between items-center">
                            <h3 className="font-cartoon text-2xl text-[var(--color-text-secondary)] transition-colors duration-300">Choose Your Style!</h3>
                            <button onClick={onStyleFuseClick} disabled={isLoading || !photoUploaded} className="font-cartoon bg-[var(--color-accent)] text-lg text-[var(--color-text-on-primary)] py-2 px-5 rounded-md border-2 border-black hover:bg-[var(--color-primary)] transition-colors duration-300 flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-px">
                                ✨ Style Fuse ✨
                            </button>
                        </div>
                        {!photoUploaded && <p className="text-center text-sm text-[var(--color-text-secondary)] font-semibold p-2 bg-black/20 rounded-md">Please upload a photo to start cartoonifying.</p>}
                        <div className={!photoUploaded ? 'opacity-40' : ''}>
                            <label className="font-cartoon block text-2xl text-[var(--color-secondary)] mb-2 transition-colors duration-300">Adult Animation</label>
                            <StyleGrid styles={CARTOON_STYLES.adultShows} />
                            <label className="font-cartoon block text-2xl text-[var(--color-secondary)] mb-2 mt-4 transition-colors duration-300">Kid-Friendly</label>
                            <StyleGrid styles={CARTOON_STYLES.kidShows} />
                            <label className="font-cartoon block text-2xl text-[var(--color-secondary)] mb-2 mt-4 transition-colors duration-300">Classic Toons</label>
                            <StyleGrid styles={CARTOON_STYLES.classicShows} />
                        </div>
                    </div>
                );
            case 'edit':
                return (
                    <div className="space-y-4 animate-fade-in">
                         <h3 className="font-cartoon text-2xl text-[var(--color-text-secondary)] transition-colors duration-300">Edit Your Image</h3>
                         {!photoUploaded && <p className="text-center text-sm text-[var(--color-text-secondary)] font-semibold p-2 bg-black/20 rounded-md">Please upload a photo to start editing.</p>}
                         <textarea id="edit-prompt" rows={3} value={editPrompt} onChange={(e) => setEditPrompt(e.target.value)} disabled={isLoading || !photoUploaded} className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] text-sm placeholder-gray-500 transition-colors duration-300 disabled:opacity-50" placeholder="e.g., Add a retro filter, remove the person in the background, make it black and white..." />
                         <button onClick={() => onEdit(editPrompt)} disabled={isLoading || !photoUploaded || !editPrompt.trim()} className="w-full font-cartoon bg-[var(--color-accent)] text-lg text-[var(--color-text-on-primary)] py-3 px-5 rounded-md border-2 border-black hover:bg-[var(--color-primary)] transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-px">
                            Apply Edit
                         </button>
                    </div>
                );
            case 'generate':
                 return (
                    <div className="space-y-4 animate-fade-in">
                         <h3 className="font-cartoon text-2xl text-[var(--color-text-secondary)] transition-colors duration-300">Generate an Image</h3>
                         <textarea id="generate-prompt" rows={3} value={generatePrompt} onChange={(e) => setGeneratePrompt(e.target.value)} disabled={isLoading} className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] text-sm placeholder-gray-500 transition-colors duration-300" placeholder="e.g., A photo of an astronaut riding a horse on Mars, cinematic lighting..." />
                         <div className="flex items-center gap-4">
                            <label htmlFor="aspect-ratio" className="block text-sm font-medium text-gray-400 shrink-0">Aspect Ratio:</label>
                            <select id="aspect-ratio" value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} disabled={isLoading} className="w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] text-sm transition-colors duration-300">
                                {ASPECT_RATIOS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                         </div>
                         <button onClick={() => onGenerate(generatePrompt, aspectRatio)} disabled={isLoading || !generatePrompt.trim()} className="w-full font-cartoon bg-[var(--color-accent)] text-lg text-[var(--color-text-on-primary)] py-3 px-5 rounded-md border-2 border-black hover:bg-[var(--color-primary)] transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-px">
                            Imagine
                         </button>
                    </div>
                );
            case 'analyze':
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="font-cartoon text-2xl text-[var(--color-text-secondary)] transition-colors duration-300">Analyze Your Image</h3>
                         {!photoUploaded && <p className="text-center text-sm text-[var(--color-text-secondary)] font-semibold p-2 bg-black/20 rounded-md">Please upload a photo to start analyzing.</p>}
                         <textarea id="analyze-prompt" rows={2} value={analyzePrompt} onChange={(e) => setAnalyzePrompt(e.target.value)} disabled={isLoading || !photoUploaded} className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] text-sm placeholder-gray-500 transition-colors duration-300 disabled:opacity-50" placeholder="e.g., What is in this image? Describe the historical context." />
                        <div className="flex items-center justify-between">
                             <button onClick={() => onAnalyze(analyzePrompt, useThinking)} disabled={isLoading || !photoUploaded || !analyzePrompt.trim()} className="w-2/3 font-cartoon bg-[var(--color-accent)] text-lg text-[var(--color-text-on-primary)] py-3 px-5 rounded-md border-2 border-black hover:bg-[var(--color-primary)] transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-px">
                                Analyze
                             </button>
                            <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-300 p-2 rounded-md hover:bg-gray-800/50">
                                <input type="checkbox" checked={useThinking} onChange={(e) => setUseThinking(e.target.checked)} disabled={isLoading || !photoUploaded} className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-[var(--color-accent)] focus:ring-[var(--color-accent)] disabled:opacity-50" />
                                Think Deeply
                            </label>
                        </div>
                         {analysisResult && !isLoading && (
                            <div className="pt-4 border-t border-gray-700">
                                <h4 className="font-cartoon text-xl text-[var(--color-secondary)] mb-2">Analysis Result:</h4>
                                <div className="text-sm text-gray-200 bg-black/30 p-3 rounded-md max-h-40 overflow-y-auto whitespace-pre-wrap">{analysisResult}</div>
                            </div>
                         )}
                    </div>
                );
        }
    };
    
    return (
        <div className="shrink-0">
            <div className="mb-4 border-b-2 border-black flex justify-center">
                {modes.map(modeItem => (
                    <button
                        key={modeItem.id}
                        onClick={() => onModeChange(modeItem.id)}
                        disabled={isLoading}
                        className={`flex-1 font-cartoon text-xl p-3 border-b-4 transition-all duration-200 disabled:opacity-50 ${
                            mode === modeItem.id 
                                ? 'text-[var(--color-primary)] border-[var(--color-primary)]' 
                                : 'text-gray-500 border-transparent hover:text-[var(--color-secondary)] hover:border-[var(--color-secondary)]/50'
                        }`}
                    >
                       {modeItem.icon} {modeItem.label}
                    </button>
                ))}
            </div>
            {renderPanelContent()}
        </div>
    );
};
