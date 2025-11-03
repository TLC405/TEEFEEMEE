import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from './hooks/useToast';
import { useGallery } from './hooks/useGallery';
import { Header } from './components/Header';
import { ToastContainer } from './components/Toast';
import { CreatorPanel } from './components/CreatorPanel';
import { GalleryPanel } from './components/GalleryPanel';
import { TopPanel } from './components/TopPanel';
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { LOADING_MESSAGES, NEGATIVE_PROMPT, DEFAULT_THEME, CartoonStyle } from './constants';
import { StyleFuse } from './components/StyleFuse';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const App: React.FC = () => {
  const { toasts, addToast, removeToast } = useToast();
  const { galleryItems, addToGallery, deleteGalleryItem, deleteVersion } = useGallery();
  
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [resultDataUrl, setResultDataUrl] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isStyleFuseOpen, setIsStyleFuseOpen] = useState(false);
  const [lastUsedPrompt, setLastUsedPrompt] = useState('');
  const [activeTheme, setActiveTheme] = useState<Record<string, string>>(DEFAULT_THEME);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(activeTheme).forEach(([key, value]) => {
      // FIX: Explicitly cast value to string to resolve TypeScript error where
      // value was being inferred as 'unknown'.
      root.style.setProperty(key, String(value));
    });
  }, [activeTheme]);

  useEffect(() => {
    let intervalId: number | undefined;
    if (isLoading) {
      intervalId = window.setInterval(() => {
        setLoadingMessage(prev => LOADING_MESSAGES[(LOADING_MESSAGES.indexOf(prev) + 1) % LOADING_MESSAGES.length]);
      }, 2000);
    }
    return () => clearInterval(intervalId);
  }, [isLoading]);
  
  const handleFileUpdate = (file: File | null) => {
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
      setResultDataUrl(null); // Clear previous result when new photo is uploaded
    } else {
      setPhoto(null);
      setPhotoPreview(null);
      setResultDataUrl(null);
    }
  };
  
  const handleStyleSelect = useCallback(async (style: CartoonStyle) => {
    if (!photo || !photoPreview) {
      addToast('Please upload a photo first.', 'error');
      return;
    }
    
    setIsLoading(true);
    setResultDataUrl(null);
    setActiveTheme(style.theme);
    
    try {
      // Step 1: Enhance the prompt with AI
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const enhancePromptInstruction = `You are an expert prompt engineer for an AI image generation model. Your task is to take a basic style description and expand it into a rich, detailed, and creative prompt. Add descriptive keywords, specify artistic techniques, lighting, and composition to ensure a high-quality, visually stunning result. Do not change the core subject, just enhance the style description. The prompt should be about 30-40 words.

Base style: "${style.prompt}"

Return a single JSON object with one key: "enhancedPrompt".`;
      
      const enhanceResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: enhancePromptInstruction,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              enhancedPrompt: { type: Type.STRING }
            },
            required: ["enhancedPrompt"]
          }
        }
      });
      
      // Fix: Safely parse the JSON response from the Gemini API and ensure the enhancedPrompt is a string.
      const parsedResponse = JSON.parse(enhanceResponse.text);
      const enhancedPrompt = parsedResponse.enhancedPrompt;

      if (typeof enhancedPrompt !== 'string') {
        throw new Error("API did not return a valid enhanced prompt.");
      }
      
      setLastUsedPrompt(enhancedPrompt);
      addToast('AI has enhanced the style prompt!', 'success');

      // Step 2: Generate the cartoon image with the enhanced prompt
      const imagePart = await fileToGenerativePart(photo);
      const textPart = { text: `Transform the main person in the foreground of the image into a cartoon character. Focus solely on the primary subject and faithfully adapt their key features (face, hair, expression) and clothing into the following art style. Ignore other people, hands, or objects in the background or edges of the frame. Style: ${enhancedPrompt}, ${NEGATIVE_PROMPT}` };
      
      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [imagePart, textPart] },
        config: { responseModalities: [Modality.IMAGE] },
      });

      const firstPart = imageResponse.candidates?.[0]?.content?.parts?.[0];
      if (firstPart && firstPart.inlineData) {
        const imageUrl = `data:${firstPart.inlineData.mimeType};base64,${firstPart.inlineData.data}`;
        setResultDataUrl(imageUrl);
      } else {
        throw new Error('No image data returned from API.');
      }

    } catch (error) {
      console.error('Error in creation process:', error);
      addToast('Failed to generate image. The model may have refused the request.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [photo, photoPreview, addToast]);

  const handleApplyFusedStyle = useCallback((prompt: string) => {
    handleStyleSelect({
      label: 'Fused Style',
      prompt,
      icon: '✨',
      theme: activeTheme
    });
    setIsStyleFuseOpen(false);
  }, [handleStyleSelect, activeTheme]);


  const handleSaveToGallery = useCallback(() => {
    if (photoPreview && resultDataUrl) {
      addToGallery({
        originalImage: photoPreview,
        cartoonImage: resultDataUrl,
        prompt: lastUsedPrompt,
      });
      addToast('Saved to your gallery!', 'success');
    }
  }, [photoPreview, resultDataUrl, lastUsedPrompt, addToGallery, addToast]);

  const handleRecreateRequest = (originalImage: string, prompt: string) => {
    addToast("Recreating from gallery is not part of the new workflow.", "error");
  };

  return (
    <div className="min-h-screen text-[var(--color-text-primary)] flex flex-col bg-[var(--color-background)] transition-colors duration-300">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
      {isGalleryOpen && (
          <GalleryPanel
            galleryItems={galleryItems}
            deleteGalleryItem={deleteGalleryItem}
            deleteVersion={deleteVersion}
            onRecreate={handleRecreateRequest}
            onClose={() => setIsGalleryOpen(false)}
          />
        )}
      {isStyleFuseOpen && (
        <StyleFuse 
          onApplyStyle={handleApplyFusedStyle}
          onClose={() => setIsStyleFuseOpen(false)}
        />
      )}
      <Header onGalleryToggle={() => setIsGalleryOpen(v => !v)} />
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 flex flex-col justify-center">
        <div className="w-full bg-[var(--color-surface)] rounded-lg border-4 border-black shadow-[8px_8px_0px_var(--color-primary)] transition-shadow duration-300 flex flex-col">
           <TopPanel 
             photoPreview={photoPreview}
             isLoading={isLoading}
             loadingMessage={loadingMessage}
             resultDataUrl={resultDataUrl}
             onFileUpdate={handleFileUpdate}
             onSave={handleSaveToGallery}
             addToast={addToast}
           />
           <div className="p-6 pt-2 border-t-4 border-black">
            <CreatorPanel 
              onStyleSelect={handleStyleSelect}
              isLoading={isLoading}
              onStyleFuseClick={() => setIsStyleFuseOpen(true)}
            />
           </div>
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm shrink-0 font-semibold">
        <p>&copy; 2024 TeefeeMe. Unleash your inner artist.</p>
      </footer>
    </div>
  );
};

export default App;