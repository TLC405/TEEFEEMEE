import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { CARTOON_STYLES } from '../constants';

const Modal: React.FC<{ children: React.ReactNode; onClose: () => void; title: string }> = ({ children, onClose, title }) => {
  return (
    <div 
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fade-in" 
        aria-labelledby="modal-title" 
        role="dialog" 
        aria-modal="true"
        onClick={onClose}
    >
      <div 
        className="relative bg-gray-900 w-full max-w-lg rounded-xl shadow-xl ring-1 ring-[var(--color-primary)]/20 m-4 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 id="modal-title" className="text-lg font-bold text-[var(--color-primary)] transition-colors duration-300">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors rounded-full p-1">
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

interface FusedStyle {
    name: string;
    prompt: string;
}

const allStyles = [...CARTOON_STYLES.adultShows, ...CARTOON_STYLES.kidShows, ...CARTOON_STYLES.classicShows];

export const StyleFuse: React.FC<{
    onApplyStyle: (prompt: string) => void;
    onClose: () => void;
}> = ({ onApplyStyle, onClose }) => {
    const [style1, setStyle1] = useState<typeof allStyles[0]>(allStyles[0]);
    const [style2, setStyle2] = useState<typeof allStyles[0]>(allStyles[1]);
    const [fusedStyle, setFusedStyle] = useState<FusedStyle | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSurpriseMe = useCallback(() => {
        let index1 = Math.floor(Math.random() * allStyles.length);
        let index2;
        do {
            index2 = Math.floor(Math.random() * allStyles.length);
        } while (index1 === index2);
        
        setStyle1(allStyles[index1]);
        setStyle2(allStyles[index2]);
        setFusedStyle(null);
    }, []);

    const handleFuse = async () => {
        setIsLoading(true);
        setError(null);
        setFusedStyle(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const modelPrompt = `You are an expert art director specializing in creating novel visual styles. Your task is to combine two distinct art styles into a single, cohesive, and imaginative new style.

Style 1: '${style1.prompt}'

Style 2: '${style2.prompt}'

Based on these two styles, generate a new style. Provide a creative and memorable name for this fused style, and a detailed prompt description (around 30-50 words) for an AI image generator. The prompt should be descriptive, evocative, and capture the essence of the combined styles.

Return the response as a valid JSON object with two keys: "name" and "prompt".`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: modelPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING, description: "The creative name of the new fused style." },
                            prompt: { type: Type.STRING, description: "The detailed prompt for an AI image generator." }
                        },
                        required: ["name", "prompt"]
                    }
                }
            });
            
            const result = JSON.parse(response.text);
            setFusedStyle(result);
        } catch (e) {
            console.error("Style fusion failed:", e);
            setError("The AI couldn't create a style. Please try different options.");
        } finally {
            setIsLoading(false);
        }
    };

    const StyleSelector = ({ value, onChange, label }: { value: typeof allStyles[0], onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, label: string }) => (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
            <select
                value={value.label}
                onChange={onChange}
                className="w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] text-sm transition-colors duration-300"
            >
                {allStyles.map(s => <option key={s.label} value={s.label}>{s.icon} {s.label}</option>)}
            </select>
        </div>
    );

    return (
        <Modal onClose={onClose} title="✨ Style Fuse">
            <div className="space-y-6">
                <p className="text-sm text-gray-400">Combine two styles to create a unique new one!</p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <StyleSelector label="Style 1" value={style1} onChange={e => setStyle1(allStyles.find(s => s.label === e.target.value)!)} />
                    <div className="text-2xl font-bold text-[var(--color-primary)] pt-6 transition-colors duration-300">+</div>
                    <StyleSelector label="Style 2" value={style2} onChange={e => setStyle2(allStyles.find(s => s.label === e.target.value)!)} />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={handleSurpriseMe} className="w-full bg-gray-700 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 transition-colors">
                        Surprise Me!
                    </button>
                    <button onClick={handleFuse} disabled={isLoading} className="w-full bg-[var(--color-accent)] text-[var(--color-text-on-primary)] font-bold py-2 px-4 rounded-md hover:opacity-90 disabled:bg-gray-600 transition-all duration-300">
                        {isLoading ? 'Fusing...' : 'Fuse Styles'}
                    </button>
                </div>

                {isLoading && (
                    <div className="text-center py-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mx-auto"></div></div>
                )}

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                
                {fusedStyle && (
                    <div className="space-y-4 pt-4 border-t border-gray-800 animate-fade-in">
                        <h3 className="text-lg font-semibold text-white">Your New Style: <span className="text-[var(--color-secondary)] transition-colors duration-300">{fusedStyle.name}</span></h3>
                        <textarea
                            readOnly
                            value={fusedStyle.prompt}
                            rows={3}
                            className="w-full rounded-md bg-gray-800 border-gray-700 text-sm text-gray-300"
                        />
                        <button onClick={() => onApplyStyle(fusedStyle.prompt)} className="w-full bg-[var(--color-accent)] text-[var(--color-text-on-primary)] font-bold py-2 px-4 rounded-md hover:opacity-90 transition-all duration-300">
                            Use This Style
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
};