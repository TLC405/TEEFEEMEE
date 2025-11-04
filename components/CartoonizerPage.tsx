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

// Helper function to resize the image client-side before processing
const resizeImage = (dataUrl: string, maxDimension: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height *= maxDimension / width;
          width = maxDimension;
        } else {
          width *= maxDimension / height;
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }
      ctx.drawImage(img, 0, 0, width, height);
      
      const mimeType = dataUrl.substring(5, dataUrl.indexOf(';'));
      const resizedDataUrl = canvas.toDataURL(mimeType, 0.9); // Use 0.9 quality for JPEGs
      resolve(resizedDataUrl);
    };
    img.onerror = () => {
      reject(new Error('Failed to load image for resizing. It might be corrupted or in an unsupported format.'));
    };
    img.src = dataUrl;
  });
};

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

  const handleImageUpload = async (dataUrl: string) => {
    setIsLoading(true);
    setLoadingMessage("Preparing your image...");
    try {
      const resizedDataUrl = await resizeImage(dataUrl, 1024); // Resize to max 1024x1024
      setOriginalImage(resizedDataUrl);
      setResultImage(null);
      setError(null);
      setSelectedTheme(null);
      addToast('Image uploaded! Now pick a style.', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      addToast(errorMessage, 'error');
      console.error("Image processing failed:", err);
    } finally {
      setIsLoading(false);
    }
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

  const handleRandomThemeSelect = () => {
    // Avoid picking the same theme twice in a row if possible
    const availableThemes = THEMES.filter(t => t.name !== selectedTheme?.name);
    const themesToChooseFrom = availableThemes.length > 0 ? availableThemes : THEMES;
    const randomIndex = Math.floor(Math.random() * themesToChooseFrom.length);
    const randomTheme = themesToChooseFrom[randomIndex];
    handleThemeSelect(randomTheme);
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

    // FIX: Dynamically determine the file extension from the result image's data URL
    // instead of incorrectly hardcoding `.jpeg`. This ensures the downloaded file
    // has the correct extension (e.g., .png, .webp) matching its format.
    const mimeType = resultImage.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/jpeg';
    const extension = mimeType.split('/')[1] || 'jpeg';

    const link = document.createElement('a');
    link.href = resultImage;

    // FIX: Use a regular expression to replace all whitespace in the theme name
    // for a cleaner, more reliable filename. The previous implementation only
    // replaced the first space.
    const themeName = selectedTheme?.name.toLowerCase().replace(/\s+/g, '_') ?? 'art';
    link.download = `teefeeme_${themeName}_${Date.now()}.${extension}`;
    
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
            onRandomThemeSelect={handleRandomThemeSelect}
          />
      )}
    </>
  );
};