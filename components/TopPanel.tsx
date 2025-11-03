import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from '../constants';
import { AppMode } from '../App';
import { EnhancementsPanel } from './EnhancementsPanel';

declare const GIF: any;

interface Sticker {
  img: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

type TransformHandle = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'rotate' | null;

export const TopPanel: React.FC<{
  activeMode: AppMode;
  photoPreview: string | null;
  resultDataUrl: string | null;
  onFileUpdate: (file: File | null) => void;
  onSave: (dataUrl: string) => void;
  addToast: (message: string, type: 'success' | 'error') => void;
  onEnhancement: (prompt: string, sourceImage: string | null) => void;
  photoAspectRatio: number | null;
  generationId: number;
  error: string | null;
}> = ({
  activeMode,
  photoPreview,
  resultDataUrl,
  onFileUpdate,
  onSave,
  addToast,
  onEnhancement,
  photoAspectRatio,
  generationId,
  error,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isGeneratingGif, setIsGeneratingGif] = useState(false);
  const [sticker, setSticker] = useState<Sticker | null>(null);
  const [activeHandle, setActiveHandle] = useState<TransformHandle>(null);
  const [isStickerDragging, setIsStickerDragging] = useState(false);
  const interactionStart = useRef<any>(null);

  useEffect(() => {
    // Reset sticker state when a new base image is generated/uploaded.
    setSticker(null);
  }, [generationId]);

  const draw = useCallback(() => {
    if (!resultDataUrl || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = resultDataUrl;

    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      if (sticker) {
        ctx.save();
        ctx.translate(sticker.x, sticker.y);
        ctx.rotate(sticker.rotation);
        ctx.drawImage(sticker.img, -sticker.width / 2, -sticker.height / 2, sticker.width, sticker.height);
        ctx.restore();
      }
    };
  }, [resultDataUrl, sticker]);
  
  useEffect(() => {
    draw();
  }, [draw]);

  const handleFileDrop = (file: File) => {
    if (!file) return;
    setSticker(null);
    if (file.size > MAX_FILE_SIZE_BYTES) {
      addToast(`File size exceeds ${MAX_FILE_SIZE_MB}MB.`, 'error'); return;
    }
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      addToast('Invalid file type. Please upload an image.', 'error'); return;
    }
    onFileUpdate(file);
  }

  const dragHandlers = {
    onDragEnter: (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); },
    onDragLeave: (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); },
    onDragOver: (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault(); e.stopPropagation(); setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileDrop(e.dataTransfer.files[0]);
    },
  };
  
  const handleDownload = () => {
    if(canvasRef.current) {
        const link = document.createElement('a');
        link.href = canvasRef.current.toDataURL('image/png');
        link.download = `teefeeme_${new Date().getTime()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  }

  const handleDownloadGif = () => {
    if (!canvasRef.current || isGeneratingGif) return;

    setIsGeneratingGif(true);
    addToast('Brewing your animation...', 'success');

    const sourceCanvas = canvasRef.current;
    
    const generationPromise = new Promise<Blob>((resolve, reject) => {
        const gif = new GIF({
            workers: 2,
            quality: 10,
            workerScript: 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js',
            width: sourceCanvas.width,
            height: sourceCanvas.height,
        });

        const FRAMES = 20;
        const DELAY = 80;
        const MIN_SCALE = 1.0;
        const MAX_SCALE = 1.03;

        for (let i = 0; i < FRAMES; i++) {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = sourceCanvas.width;
            tempCanvas.height = sourceCanvas.height;
            const ctx = tempCanvas.getContext('2d')!;
            
            const scale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * (Math.sin((i / FRAMES) * Math.PI) ** 2);

            ctx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
            ctx.scale(scale, scale);
            ctx.drawImage(sourceCanvas, -tempCanvas.width / 2, -tempCanvas.height / 2);
            
            gif.addFrame(ctx, { copy: true, delay: DELAY });
        }

        gif.on('finished', (blob: Blob) => resolve(blob));
        gif.on('abort', () => reject(new Error('GIF generation was aborted.')));
        gif.render();
    });

    generationPromise.then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `teefeeme_anim_${new Date().getTime()}.gif`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        addToast('Animation ready!', 'success');
    }).catch(error => {
        console.error('GIF generation failed:', error);
        addToast('Failed to create animation.', 'error');
    }).finally(() => {
        setIsGeneratingGif(false);
    });
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    if (sticker) {
       const dx = coords.x - sticker.x;
       const dy = coords.y - sticker.y;
       if (Math.sqrt(dx*dx + dy*dy) < Math.max(sticker.width, sticker.height)/2) {
         setIsStickerDragging(true);
         interactionStart.current = { x: coords.x, y: coords.y, sticker };
         return;
       }
    }
  };
  
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isStickerDragging) {
      const coords = getCanvasCoords(e);
      const dx = coords.x - interactionStart.current.x;
      const dy = coords.y - interactionStart.current.y;
      setSticker(prev => prev ? {...prev, x: interactionStart.current.sticker.x + dx, y: interactionStart.current.sticker.y + dy} : null);
    }
  };
  
  const handleCanvasMouseUp = () => {
    setIsStickerDragging(false);
    setActiveHandle(null);
  };

  const handleStickerAdd = (stickerSrc: string) => {
    const img = new Image();
    img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const initialSize = canvas.width / 5;
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            setSticker({
                img, x: canvas.width / 2, y: canvas.height / 2,
                width: initialSize, height: initialSize / aspectRatio, rotation: 0,
            });
        }
    };
    img.src = stickerSrc;
  };
  
  const handleEyeColorChange = (color: string) => {
      onEnhancement(`Change the eye color of the person to ${color}. Be subtle and realistic.`, resultDataUrl);
  };
  
  const UploadPlaceholder = () => (
      <div 
        {...dragHandlers} 
        onClick={() => fileInputRef.current?.click()}
        className={`w-full h-full min-h-[400px] border-4 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-500 cursor-pointer transition-colors ${isDragging ? 'border-[var(--color-primary)] bg-[var(--color-surface)]' : 'border-black/50 hover:border-[var(--color-primary)]'}`}
      >
        <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && handleFileDrop(e.target.files[0])} accept={ALLOWED_MIME_TYPES.join(',')} className="hidden" />
        <div className="text-center p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-24 w-24 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-4 font-semibold text-2xl text-gray-400">Upload Your Photo</h2>
            <p className="font-medium text-gray-500 mt-1">Drag & drop or click to browse</p>
            <p className="text-xs mt-1 text-gray-600">PNG, JPG, WEBP up to {MAX_FILE_SIZE_MB}MB</p>
        </div>
      </div>
  );

  const ErrorDisplay = ({ message }: { message: string }) => (
    <div role="alert" className="w-full h-full min-h-[400px] flex flex-col items-center justify-center text-center p-4 bg-red-900/30 rounded-lg border-2 border-red-500/50">
      <svg className="w-16 h-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      <h3 className="font-cartoon text-3xl text-red-300 mt-4">An Error Occurred</h3>
      <p className="mt-2 font-semibold text-red-200 max-w-md">{message}</p>
    </div>
  );

  const ResultCanvas = () => (
    <div className="w-full max-w-full bg-black/20 rounded-lg border-2 border-black overflow-hidden relative">
      <canvas
        ref={canvasRef}
        className="w-full h-auto cursor-grab active:cursor-grabbing"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
      />
    </div>
  );

  const showSideBySide = photoPreview && ['cartoonify', 'edit', 'analyze'].includes(activeMode);
  
  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {showSideBySide && (
          <div className="flex-1 flex flex-col items-center w-full">
            <h3 className="font-cartoon text-2xl text-gray-500 mb-2">Original</h3>
            <div className="relative w-full bg-black/20 rounded-lg p-2 group">
              <img 
                src={photoPreview!} 
                alt="Uploaded" 
                className="w-full object-contain rounded-md" 
                style={{ aspectRatio: photoAspectRatio ? `${photoAspectRatio}`: '1 / 1'}} 
              />
              <button onClick={() => onFileUpdate(null)} className="absolute top-3 right-3 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-black/80 transition-opacity z-10">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        )}
        
        <div className="flex-1 flex flex-col items-center w-full">
          {showSideBySide && <h3 className="font-cartoon text-2xl text-gray-500 mb-2">Result</h3>}
          <div 
            className="w-full min-h-[400px] flex items-center justify-center relative overflow-hidden rounded-lg" 
            style={{ aspectRatio: photoAspectRatio ? `${photoAspectRatio}`: '1 / 1'}}
          >
            {error ? <ErrorDisplay message={error} /> : resultDataUrl ? <ResultCanvas /> : activeMode === 'generate' ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-center text-gray-500 p-8 bg-black/20 rounded-lg min-h-[400px]">
                  <h2 className="font-cartoon text-5xl text-gray-400" style={{textShadow: '3px 3px 0 #000'}}>Image Generation</h2>
                  <p className="font-semibold text-gray-500 mt-2">Use the controls below to describe the image you want to create.</p>
              </div>
            ) : <UploadPlaceholder />}
          </div>
        </div>

        {resultDataUrl && !error && (
          <div className="w-full lg:w-80 shrink-0 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => canvasRef.current && onSave(canvasRef.current.toDataURL('image/png'))} disabled={isGeneratingGif} className="font-cartoon bg-yellow-400 text-black text-base py-1 px-4 rounded-md border-2 border-black hover:bg-yellow-500 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed disabled:border-gray-900 transition-all duration-300 flex items-center justify-center gap-2 active:translate-y-px">
                  <span>Save</span>
                </button>
                <button onClick={handleDownload} disabled={isGeneratingGif} className="font-cartoon bg-gray-700 text-base text-white py-1 px-4 rounded-md border-2 border-black hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed disabled:border-gray-900 transition-colors flex items-center justify-center gap-2 active:translate-y-px">
                  <span>Download</span>
                </button>
                <button onClick={handleDownloadGif} disabled={isGeneratingGif} className="font-cartoon bg-gray-700 text-base text-white py-1 px-4 rounded-md border-2 border-fuchsia-500/80 hover:bg-gray-600 shadow-[0_0_8px_var(--color-accent)] disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed disabled:border-gray-900 disabled:shadow-none transition-all flex items-center justify-center gap-2 active:translate-y-px">
                  {isGeneratingGif ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Animating...</span>
                    </>
                  ) : (
                    <span>Download GIF</span>
                  )}
                </button>
            </div>
              <EnhancementsPanel
                  onEyeColorChange={handleEyeColorChange}
                  onStickerAdd={handleStickerAdd}
                  isLoading={false}
              />
          </div>
        )}
      </div>
    </div>
  );
};