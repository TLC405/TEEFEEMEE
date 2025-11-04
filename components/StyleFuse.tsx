import React from 'react';

const DisabledSlider = ({ label }: { label: string }) => (
    <div>
        <label className="block text-sm font-bold text-gray-700">{label}</label>
        <div className="relative mt-1">
            <input type="range" disabled className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-not-allowed" />
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-4 h-4 bg-gray-400 rounded-full"></div>
        </div>
    </div>
);

const DisabledColorPicker = ({ label }: { label: string }) => (
    <div>
        <label className="block text-sm font-bold text-gray-700">{label}</label>
        <div className="w-12 h-12 mt-1 bg-gray-300 border-2 border-gray-400 rounded-md cursor-not-allowed"></div>
    </div>
);

export const StyleFuse: React.FC = () => {
    return (
        <div className="w-full max-w-4xl mx-auto mt-4 animate-pop-in">
            <div className="simpson-panel p-8">
                <div className="text-center">
                    <h1 className="font-cartoon text-5xl text-[var(--color-primary)]" style={{textShadow: '2px 2px 0px #000'}}>Style Lab</h1>
                    <p className="text-[var(--color-text-secondary)] mt-2 mb-6 font-bold text-lg">Coming Soon! Mix and match styles to create your own unique cartoon look.</p>
                </div>
                
                <div className="mt-8 p-6 bg-gray-100/50 rounded-lg border-2 border-dashed border-gray-400 opacity-60">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                           <h3 className="font-cartoon text-2xl text-gray-600">Appearance</h3>
                           <DisabledSlider label="Line Thickness" />
                           <DisabledSlider label="Color Saturation" />
                           <DisabledSlider label="Character Wobble" />
                        </div>
                         <div className="space-y-6">
                            <h3 className="font-cartoon text-2xl text-gray-600">Color Palette</h3>
                            <div className="flex space-x-4">
                                <DisabledColorPicker label="Primary" />
                                <DisabledColorPicker label="Secondary" />
                                <DisabledColorPicker label="Accent" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Base Style</label>
                                <select disabled className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md cursor-not-allowed bg-gray-200">
                                    <option>The Simpsons</option>
                                </select>
                            </div>
                        </div>
                    </div>
                     <div className="mt-8 text-center">
                        <button disabled className="font-cartoon bg-gray-400 text-2xl text-white py-3 px-10 rounded-lg border-2 border-black cursor-not-allowed">
                            Save My Style
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};