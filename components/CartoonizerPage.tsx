import React, { useState, useEffect } from 'react';
import { Theme } from '../types';
import { LOADING_MESSAGES, THEMES } from '../constants';
import { LoadingOverlay } from './LoadingOverlay';
import { Uploader } from './Uploader';
import { GeneratorPanel } from './GeneratorPanel';
import { generateCartoonImage } from '../services/geminiService';

interface CartoonizerPageProps {
  addToast: (message: string, type: 'success' | 'error') => void;
}

export const CartoonizerPage: React.FC<CartoonizerPageProps> = ({ addToast }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: number | undefined;
    if (isLoading) {
      intervalId = window.setInterval(() => {
        setLoadingMessage(prev => LOADING_MESSAGES[(LOADING_MESSAGES.indexOf(prev) + 1) % LOADING_MESSAGES.length]);
      }, 2500);
    }
    return () => clearInterval(intervalId);
  }, [isLoading]);

  const handleImageUpload = (dataUrl: string) => {
    setOriginalImage(dataUrl);
    setResultImage(null);
    setError(null);
    setSelectedTheme(null);
    addToast('Image uploaded! Now pick a style.', 'success');
  };

  const handleThemeSelect = async (theme: Theme) => {
    if (!originalImage) {
        addToast('Please upload an image first!', 'error');
        return;
    }
    
    setSelectedTheme(theme);
    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const newImageUrl = await generateCartoonImage(originalImage, theme);
      setResultImage(newImageUrl);
      addToast(`Successfully generated in ${theme.name} style!`, 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error('Error generating image:', errorMessage);
      addToast(errorMessage, 'error');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setResultImage(null);
    setError(null);
    setSelectedTheme(null);
    addToast('Ready for a new creation!', 'success');
  }

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `teefeeme_${selectedTheme?.name.toLowerCase().replace(' ', '_') ?? 'art'}_${new Date().getTime()}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <>
      {isLoading && <LoadingOverlay loadingMessage={loadingMessage} />}
      {!originalImage ? (
          <div className="w-full max-w-2xl mt-10 animate-pop-in">
              <Uploader onImageUpload={handleImageUpload} addToast={addToast} />
          </div>
      ) : (
          <GeneratorPanel 
            originalImage={originalImage}
            resultImage={resultImage}
            error={error}
            themes={THEMES}
            selectedTheme={selectedTheme}
            isLoading={isLoading}
            onThemeSelect={handleThemeSelect}
            onReset={handleReset}
            onDownload={handleDownload}
          />
      )}
    </>
  );
};
