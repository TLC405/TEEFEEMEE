import React, { useState, useCallback, useEffect, useRef } from 'react';
import { cartoonStyles, CartoonStyle } from '../data/seed';
import { useCartoonStyleGenerator } from '../hooks/useCartoonStyleGenerator';
import { ImageUploader, UploadedImage } from '../components/ImageUploader';
import { cartoonifyImage } from '../services/geminiService';

const Header = () => (
    <header className="bg-comic-blue py-4">
        <h1 className="text-5xl md:text-7xl font-display text-center tracking-wider text-comic-yellow" style={{ WebkitTextStroke: '2px black', textShadow: '4px 4px 0px #000' }}>
            TeeFeeMe
        </h1>
    </header>
);

const Panel: React.FC<{title: string; titleColor: string; children: React.ReactNode; className?: string;}> = ({ title, titleColor, children, className }) => (
    <div className={`bg-comic-white border-4 border-comic-black rounded-2xl p-4 flex flex-col h-full shadow-comic ${className}`}>
        <h2 className={`font-display text-4xl text-center mb-4 drop-shadow-hard`} style={{ color: titleColor }}>{title}</h2>
        <div className="flex-grow flex flex-col">
            {children}
        </div>
    </div>
);

const StyleCardSpinner = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-800/80 rounded-lg">
        <svg className="animate-spin h-8 w-8 text-comic-pink" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
    </div>
);

const StyleCard: React.FC<{ style: CartoonStyle; onClick: () => void; isSelected: boolean; isLoading: boolean; isDisabled: boolean }> = ({ style, onClick, isSelected, isLoading, isDisabled }) => (
  <button 
    onClick={onClick}
    disabled={isDisabled || isLoading}
    className={`relative bg-gray-800 p-2 rounded-lg border-4 transition-all duration-200 text-left w-full h-full flex flex-col focus:outline-none focus-visible:ring-4 ring-offset-2 ring-comic-pink ${isSelected ? 'border-comic-pink' : 'border-gray-800 hover:border-comic-pink/70 hover:-translate-y-1'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${isLoading ? 'border-comic-pink/50' : ''}`}
    aria-pressed={isSelected}
    aria-label={`Select style: ${style.name}`}
  >
    <div className={`aspect-video rounded-md mb-2 flex items-center justify-center ${style.thumbnail}`}>
        <span className="font-bold text-black/50 text-sm">{style.name}</span>
    </div>
    <div className="text-white p-1">
        <h3 className="font-bold text-sm">{style.name}</h3>
        <p className="text-xs text-gray-300">{style.description}</p>
    </div>
    {isLoading && <StyleCardSpinner />}
  </button>
);

const ResultDisplay: React.FC<{generatedImage: string | null; isLoading: boolean; error: string | null}> = ({ generatedImage, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg animate-pulse" role="status">
                <svg className="animate-spin h-12 w-12 text-comic-pink" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <p className="mt-4 font-bold text-gray-600">Generating your art...</p>
                <p className="text-sm text-gray-500">This can take a moment!</p>
            </div>
        )
    }
    if (error) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-red-100 rounded-lg p-4 text-center" role="alert">
                <p className="font-bold text-red-600">Generation Failed</p>
                <p className="text-sm text-red-500 mt-2">{error}</p>
            </div>
        )
    }
    if (generatedImage) {
        return <img src={generatedImage} alt="TeeFeeMe version" className="w-full h-full object-contain rounded-lg animate-fade-in" />;
    }
    return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
            <p className="text-gray-500 font-semibold">Your creation will appear here</p>
        </div>
    );
};

const Toast: React.FC<{message: string; onDismiss: () => void}> = ({ message, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 5000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <div role="alert" className="fixed bottom-5 right-5 z-50 bg-red-600 text-white font-bold py-3 px-5 rounded-lg shadow-2xl animate-slide-in-up">
           <p>{message}</p>
        </div>
    );
}

export const Cartoonifier: React.FC = () => {
    const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<CartoonStyle | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [toastError, setToastError] = useState<string | null>(null);

    const { status: styleGenStatus, data: stylePromptData, error: styleGenError, generate: generateStylePrompt, reset: resetStyleGenerator } = useCartoonStyleGenerator();
    
    const styleBeingGenerated = styleGenStatus === 'loading' ? selectedStyle?.name : null;

    useEffect(() => {
        if (styleGenStatus === 'error') {
            setToastError(styleGenError);
        }
    }, [styleGenStatus, styleGenError]);

    const handleImageUpload = (image: UploadedImage | null) => {
        setUploadedImage(image);
        handleStartOver(); // Reset everything but the image
    };
    
    const handleStyleSelect = useCallback((style: CartoonStyle) => {
        if (!uploadedImage) {
            setToastError("Please upload an image first!");
            return;
        };
        setSelectedStyle(style);
        generateStylePrompt(style.name);
    }, [generateStylePrompt, uploadedImage]);

    useEffect(() => {
        const cartoonify = async () => {
            if (uploadedImage && stylePromptData?.prompt && styleGenStatus === 'success') {
                setIsGenerating(true);
                setGeneratedImage(null);
                setGenerationError(null);
                try {
                    const result = await cartoonifyImage(uploadedImage.base64, uploadedImage.mimeType, stylePromptData.prompt);
                    setGeneratedImage(result);
                } catch (e) {
                    setGenerationError(e instanceof Error ? e.message : 'An unknown error occurred.');
                } finally {
                    setIsGenerating(false);
                }
            }
        };
        cartoonify();
    }, [stylePromptData, uploadedImage, styleGenStatus]);
    
    const handleStartOver = () => {
        setUploadedImage(null);
        setSelectedStyle(null);
        setGeneratedImage(null);
        setGenerationError(null);
        setIsGenerating(false);
        resetStyleGenerator();
    };
    
    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `teefeeme-${selectedStyle?.name.replace(/\s+/g, '-') || 'art'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const isAppBusy = isGenerating || styleGenStatus === 'loading';

    return (
      <>
        <Header />
        {toastError && <Toast message={toastError} onDismiss={() => setToastError(null)} />}
        <main className="p-4 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {/* Panel 1: Original */}
                <Panel title="Original" titleColor="#00c2d1">
                    <ImageUploader onImageUpload={handleImageUpload} disabled={isAppBusy} />
                </Panel>
                
                {/* Panel 2: Choose a Style */}
                <div className="relative">
                     <Panel title="Choose a Style" titleColor="#00c2d1" className={!uploadedImage ? 'opacity-60' : ''}>
                        {!uploadedImage && <div className="absolute inset-0 z-10" title="Upload an image to enable styles"></div>}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 flex-grow">
                            {cartoonStyles.map(style => (
                                <StyleCard 
                                    key={style.name} 
                                    style={style} 
                                    onClick={() => handleStyleSelect(style)} 
                                    isSelected={selectedStyle?.name === style.name} 
                                    isLoading={styleBeingGenerated === style.name}
                                    isDisabled={isAppBusy}
                                    />
                            ))}
                        </div>
                        <div className="mt-4 flex flex-col gap-3">
                            <button
                                onClick={handleDownload}
                                disabled={!generatedImage || isAppBusy}
                                aria-label="Download generated art"
                                className="w-full bg-comic-pink text-white font-display text-2xl py-3 rounded-xl border-4 border-comic-black shadow-comic-sm hover:scale-105 active:scale-100 transition-transform disabled:bg-gray-400 disabled:opacity-70 disabled:scale-100 disabled:shadow-none"
                            >
                                Download Art
                            </button>
                            <button 
                                onClick={handleStartOver}
                                disabled={isAppBusy}
                                aria-label="Start over with a new image"
                                className="w-full bg-comic-white text-comic-black font-display text-2xl py-3 rounded-xl border-4 border-comic-black shadow-comic-sm hover:scale-105 active:scale-100 transition-transform disabled:opacity-70"
                            >
                                Start Over
                            </button>
                        </div>
                    </Panel>
                </div>

                {/* Panel 3: TeeFeeMe Version */}
                <Panel title="TeeFeeMe Version" titleColor="#ff007a">
                    <div className="flex-grow w-full h-full min-h-[300px]" aria-live="polite">
                       <ResultDisplay generatedImage={generatedImage} isLoading={isGenerating} error={generationError} />
                    </div>
                </Panel>
            </div>
            <footer className="text-center mt-8 text-black/60">
                <p>Powered by Gemini. Built for fun.</p>
                <p className="mt-4 text-xs font-bold">Suggestions for next version:</p>
                <ul className="text-xs list-disc list-inside inline-block text-left">
                    <li>Style Blending: Mix two styles for a unique result.</li>
                    <li>Negative Prompts: Specify what you *don't* want in the image.</li>
                    <li>Magic Edit: Select an area and use text to modify it (e.g., "add a hat").</li>
                    <li>Fine-grained control over details like facial features & accessories ("Face-lock Jewelry").</li>
                    <li>"Surprise Me!" button for random style combinations.</li>
                </ul>
            </footer>
        </main>
      </>
    );
};
