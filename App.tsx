




import React, { useState, useEffect, useCallback, Component, ErrorInfo, ReactNode } from 'react';
import { useToast } from './hooks/useToast';
import { useGallery } from './hooks/useGallery';
import { useCustomBackground } from './hooks/useCustomBackground';
import { Header } from './components/Header';
import { ToastContainer } from './components/Toast';
import { ActionPanel } from './components/ActionPanel';
import { GalleryPanel } from './components/GalleryPanel';
import { TopPanel } from './components/TopPanel';
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { LOADING_MESSAGES, NEGATIVE_PROMPT, DEFAULT_THEME, CartoonStyle } from './constants';
import { StyleFuse } from './components/StyleFuse';
import { LoadingOverlay } from './components/LoadingOverlay';

// --- ErrorBoundary Component ---
interface EBProps { children: ReactNode; }
interface EBState { hasError: boolean; }
class ErrorBoundary extends Component<EBProps, EBState> {
  public state: EBState = { hasError: false };

  public static getDerivedStateFromError(_: Error): EBState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8 bg-red-900/50 text-red-200 rounded-lg m-4 border-2 border-red-500">
          <h1 className="font-cartoon text-3xl mb-2">Something Went Wrong</h1>
          <p className="mb-4">A critical error occurred in this section. Please try to recover or refresh the page.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="font-cartoon bg-red-500 text-white py-2 px-6 rounded-md border-2 border-black hover:bg-red-600 transition-all"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export type AppMode = 'cartoonify' | 'edit' | 'generate' | 'analyze';

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
  const { setCustomBackgroundFile, clearCustomBackground } = useCustomBackground();

  const [activeMode, setActiveMode] = useState<AppMode>('cartoonify');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [resultDataUrl, setResultDataUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isStyleFuseOpen, setIsStyleFuseOpen] = useState(false);
  const [lastUsedPrompt, setLastUsedPrompt] = useState('');
  const [activeTheme, setActiveTheme] = useState<Record<string, string>>(DEFAULT_THEME);
  const [photoAspectRatio, setPhotoAspectRatio] = useState('a square');
  const [photoAspectRatioNumber, setPhotoAspectRatioNumber] = useState<number | null>(null);
  const [generationId, setGenerationId] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(activeTheme).forEach(([key, value]) => {
      root.style.setProperty(key, String(value));
    });
  }, [activeTheme]);
  
  useEffect(() => {
    let intervalId: number | undefined;
    if (isLoading) {
      intervalId = window.setInterval(() => {
        setLoadingMessage(prev => LOADING_MESSAGES[(LOADING_MESSAGES.indexOf(prev) + 1) % LOADING_MESSAGES.length]);
      }, 2500);
    }
    return () => clearInterval(intervalId);
  }, [isLoading]);

  const resetStateForMode = (mode: AppMode) => {
    setResultDataUrl(null);
    setAnalysisResult(null);
    setError(null);
    if (mode === 'generate') {
      setPhoto(null);
      setPhotoPreview(null);
      setPhotoAspectRatioNumber(null);
    }
  };

  const handleModeChange = (mode: AppMode) => {
    setActiveMode(mode);
    resetStateForMode(mode);
  };

  const handleFileUpdate = (file: File | null) => {
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);

        const img = new Image();
        img.onload = () => {
          const ratio = img.naturalWidth / img.naturalHeight;
          setPhotoAspectRatioNumber(ratio);
          if (ratio > 1.2) setPhotoAspectRatio('a landscape');
          else if (ratio < 0.8) setPhotoAspectRatio('a portrait');
          else setPhotoAspectRatio('a square');
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
      resetStateForMode(activeMode);
      setGenerationId(id => id + 1);
    } else {
      setPhoto(null);
      setPhotoPreview(null);
      setPhotoAspectRatioNumber(null);
      resetStateForMode(activeMode);
    }
  };

  const handleStyleSelect = useCallback(async (style: CartoonStyle) => {
    if (!photo || !photoPreview) {
      addToast('Please upload a photo first.', 'error');
      return;
    }

    setIsLoading(true);
    setError(null);
    resetStateForMode('cartoonify');
    setActiveTheme(style.theme);

    try {
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
            properties: { enhancedPrompt: { type: Type.STRING } },
            required: ["enhancedPrompt"]
          }
        }
      });

      const parsedResponse = JSON.parse(enhanceResponse.text);
      const enhancedPrompt = parsedResponse.enhancedPrompt;

      if (typeof enhancedPrompt !== 'string') throw new Error("API did not return a valid enhanced prompt.");

      setLastUsedPrompt(enhancedPrompt);
      addToast('AI has enhanced the style prompt!', 'success');

      const imagePart = await fileToGenerativePart(photo);
      const textPart = { text: `Transform the main person in the foreground of the image into a cartoon character. Focus solely on the primary subject and faithfully adapt their key features (face, hair, expression) and clothing into the following art style. Ignore other people, hands, or objects in the background or edges of the frame. The final image should be in ${photoAspectRatio} aspect ratio. Style: ${enhancedPrompt}, ${NEGATIVE_PROMPT}` };

      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [imagePart, textPart] },
        config: { responseModalities: [Modality.IMAGE] },
      });

      const firstPart = imageResponse.candidates?.[0]?.content?.parts?.[0];
      if (firstPart && firstPart.inlineData) {
        const imageUrl = `data:${firstPart.inlineData.mimeType};base64,${firstPart.inlineData.data}`;
        setResultDataUrl(imageUrl);
        if (photoPreview) {
            addToGallery({
                originalImage: photoPreview,
                cartoonImage: imageUrl,
                prompt: enhancedPrompt,
            });
            addToast('Automatically saved to gallery!', 'success');
        }
        setGenerationId(id => id + 1);
      } else {
        throw new Error('No image data returned from API.');
      }

    } catch (error) {
      console.error('Error in creation process:', error);
      const msg = getApiErrorMessage(error);
      addToast(msg, 'error');
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [photo, photoPreview, addToast, photoAspectRatio, addToGallery]);

  const handleApplyFusedStyle = useCallback((prompt: string) => {
    handleStyleSelect({
      label: 'Fused Style',
      prompt,
      icon: '✨',
      theme: activeTheme
    });
    setIsStyleFuseOpen(false);
  }, [handleStyleSelect, activeTheme]);

  const getApiErrorMessage = (error: unknown): string => {
      if (error instanceof Error) {
        if (error.message.includes('xhr error')) {
            return 'A network error occurred. Please check your connection and try again.';
        }
        return error.message;
      }
      return 'An unknown error occurred.';
  }

  const handleEditImage = async (prompt: string) => {
    if (!photo || !photoPreview) {
      addToast('Please upload a photo to edit.', 'error');
      return;
    }
    setIsLoading(true);
    setError(null);
    resetStateForMode('edit');
    setLastUsedPrompt(prompt);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const imagePart = await fileToGenerativePart(photo);
      const textPart = { text: prompt };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [imagePart, textPart] },
        config: { responseModalities: [Modality.IMAGE] },
      });

      const firstPart = response.candidates?.[0]?.content?.parts?.[0];
      if (firstPart?.inlineData) {
        const imageUrl = `data:${firstPart.inlineData.mimeType};base64,${firstPart.inlineData.data}`;
        setResultDataUrl(imageUrl);
        if (photoPreview) {
          addToGallery({
              originalImage: photoPreview,
              cartoonImage: imageUrl,
              prompt: prompt,
          });
          addToast('Automatically saved to gallery!', 'success');
        }
        setGenerationId(id => id + 1);
      } else {
        throw new Error('No image data returned from API.');
      }
    } catch (error) {
      console.error('Error editing image:', error);
      const msg = getApiErrorMessage(error);
      addToast(msg, 'error');
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async (prompt: string, aspectRatio: string) => {
    setIsLoading(true);
    setError(null);
    resetStateForMode('generate');
    setLastUsedPrompt(prompt);
    const ratioMap: { [key: string]: number } = { "1:1": 1, "16:9": 16/9, "9:16": 9/16, "4:3": 4/3, "3:4": 3/4 };
    setPhotoAspectRatioNumber(ratioMap[aspectRatio] || 1);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio,
        },
      });

      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
      setResultDataUrl(imageUrl);
      addToGallery({
          originalImage: imageUrl,
          cartoonImage: imageUrl,
          prompt: prompt,
      });
      addToast('Automatically saved to gallery!', 'success');
      setGenerationId(id => id + 1);
    } catch (error) {
      console.error('Error generating image:', error);
      const msg = getApiErrorMessage(error);
      addToast(msg, 'error');
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeImage = async (prompt: string, useThinking: boolean) => {
    if (!photo) {
      addToast('Please upload a photo to analyze.', 'error');
      return;
    }
    setIsLoading(true);
    setError(null);
    resetStateForMode('analyze');
    setLastUsedPrompt(prompt);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const imagePart = await fileToGenerativePart(photo);
      const textPart = { text: prompt };
      const model = useThinking ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
      const config = useThinking ? { thinkingConfig: { thinkingBudget: 32768 } } : {};

      const response = await ai.models.generateContent({
        model,
        contents: { parts: [imagePart, textPart] },
        config,
      });

      setAnalysisResult(response.text);
    } catch (error) {
      console.error('Error analyzing image:', error);
      const msg = getApiErrorMessage(error);
      addToast(msg, 'error');
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToGallery = useCallback((finalCanvasUrl: string) => {
    if (finalCanvasUrl) {
      const original = activeMode === 'generate' 
        ? galleryItems.find(item => item.versions.some(v => v.cartoonImage === resultDataUrl))?.originalImage ?? resultDataUrl 
        : photoPreview;
      
      if (!original) {
        addToast('Cannot save, original image is missing.', 'error');
        return;
      }
      
      addToGallery({
        originalImage: original,
        cartoonImage: finalCanvasUrl,
        prompt: lastUsedPrompt + " (enhanced)",
      });
      addToast('Enhancements saved as a new version!', 'success');
    }
  }, [resultDataUrl, lastUsedPrompt, addToGallery, addToast, activeMode, galleryItems, photoPreview]);

  const handleEnhancement = async (prompt: string, sourceImage: string | null) => {
    if (!sourceImage) {
        addToast('No image to enhance.', 'error');
        return;
    }
    setIsLoading(true);
    setError(null);
    addToast('Applying enhancement...', 'success');
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const base64Data = sourceImage.split(',')[1];
        const mimeType = sourceImage.match(/data:(.*);base64,/)?.[1] || 'image/png';
        const imagePart = { inlineData: { data: base64Data, mimeType } };
        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, textPart] },
            config: { responseModalities: [Modality.IMAGE] },
        });
        
        const firstPart = response.candidates?.[0]?.content?.parts?.[0];
        if (firstPart?.inlineData) {
            const imageUrl = `data:${firstPart.inlineData.mimeType};base64,${firstPart.inlineData.data}`;
            setResultDataUrl(imageUrl); 
            addToast('Enhancement applied!', 'success');
        } else {
            throw new Error('No image data returned from API.');
        }
    } catch (error) {
        console.error('Error enhancing image:', error);
        const msg = getApiErrorMessage(error);
        addToast(msg, 'error');
        setError(msg);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleRecreateRequest = (originalImage: string, prompt: string) => {
    addToast("Recreating from gallery is not supported in this version.", "error");
  };

  const handleGalleryToggle = useCallback(() => setIsGalleryOpen(v => !v), []);
  const handleBackgroundFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCustomBackgroundFile(e.target.files[0]);
    }
  }, [setCustomBackgroundFile]);


  return (
    <div className="min-h-screen text-[var(--color-text-primary)] flex flex-col bg-transparent transition-colors duration-300">
      {isLoading && <LoadingOverlay loadingMessage={loadingMessage} />}
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
      <Header 
        onGalleryToggle={handleGalleryToggle} 
        onBackgroundChange={handleBackgroundFileChange}
        onBackgroundReset={clearCustomBackground}
      />
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 flex flex-col justify-center">
        <ErrorBoundary>
          <div className="w-full bg-[var(--color-surface)] rounded-lg border-4 border-black shadow-[8px_8px_0px_var(--color-primary)] transition-shadow duration-300 flex flex-col">
            <TopPanel
              activeMode={activeMode}
              photoPreview={photoPreview}
              resultDataUrl={resultDataUrl}
              onFileUpdate={handleFileUpdate}
              onSave={handleSaveToGallery}
              addToast={addToast}
              onEnhancement={handleEnhancement}
              photoAspectRatio={photoAspectRatioNumber}
              generationId={generationId}
              error={error}
            />
            <div className="p-6 pt-2 border-t-4 border-black">
              <ActionPanel
                mode={activeMode}
                onModeChange={handleModeChange}
                isLoading={isLoading}
                photoUploaded={!!photo}
                onStyleSelect={handleStyleSelect}
                onStyleFuseClick={() => setIsStyleFuseOpen(true)}
                onEdit={handleEditImage}
                onGenerate={handleGenerateImage}
                onAnalyze={handleAnalyzeImage}
                analysisResult={analysisResult}
                activeTheme={activeTheme}
                onThemeChange={setActiveTheme}
              />
            </div>
          </div>
        </ErrorBoundary>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm shrink-0 font-semibold">
        <p>&copy; 2024 TeefeeMe. Unleash your inner artist.</p>
      </footer>
    </div>
  );
};

export default App;