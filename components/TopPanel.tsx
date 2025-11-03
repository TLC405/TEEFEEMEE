
import React, { useState, useRef, useCallback } from 'react';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from '../constants';

export const TopPanel: React.FC<{
  photoPreview: string | null;
  isLoading: boolean;
  loadingMessage: string;
  resultDataUrl: string | null;
  onFileUpdate: (file: File | null) => void;
  onSave: () => void;
  addToast: (message: string, type: 'success' | 'error') => void;
}> = ({
  photoPreview,
  isLoading,
  loadingMessage,
  resultDataUrl,
  onFileUpdate,
  onSave,
  addToast,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (file: File) => {
    if (!file) return;
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
    if(resultDataUrl) {
        const link = document.createElement('a');
        link.href = resultDataUrl;
        link.download = `teefeeme_${new Date().getTime()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  }

  const DisplayContent = () => {
    if (isLoading) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
          {photoPreview && <img src={photoPreview} alt="Processing" className="absolute inset-0 w-full h-full object-cover rounded-md opacity-20" />}
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[var(--color-primary)] mx-auto transition-colors duration-300"></div>
          <p className="mt-4 font-cartoon text-2xl text-gray-300">{loadingMessage}</p>
        </div>
      );
    }
    if (resultDataUrl && photoPreview) {
      return (
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="flex flex-col items-center text-center">
                <h2 className="font-cartoon text-3xl text-[var(--color-secondary)] mb-2">Original</h2>
                <div className="w-full aspect-square bg-black/20 rounded-lg border-2 border-black overflow-hidden">
                    <img src={photoPreview} alt="Original" className="w-full h-full object-cover" />
                </div>
            </div>
            <div className="flex flex-col items-center text-center">
                <h2 className="font-cartoon text-3xl text-[var(--color-primary)] mb-2">Toonified!</h2>
                <div className="w-full aspect-square bg-black/20 rounded-lg border-2 border-black overflow-hidden">
                    <img src={resultDataUrl} alt="Cartoonified" className="w-full h-full object-cover" />
                </div>
            </div>
        </div>
      );
    }
    if (photoPreview) {
      return (
        <div className="relative w-full max-w-lg h-full group flex items-center justify-center">
          <img src={photoPreview} alt="Uploaded" className="max-w-full max-h-full object-contain" />
           <button onClick={() => onFileUpdate(null)} className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-black/80 transition-opacity">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>
      );
    }
    return (
      <div 
        {...dragHandlers} 
        onClick={() => fileInputRef.current?.click()}
        className={`w-full h-full border-4 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-500 cursor-pointer transition-colors ${isDragging ? 'border-[var(--color-primary)] bg-[var(--color-surface)]' : 'border-black/50 hover:border-[var(--color-primary)]'}`}
      >
        <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && handleFileDrop(e.target.files[0])} accept={ALLOWED_MIME_TYPES.join(',')} className="hidden" />
        <div className="text-center p-8">
            <h2 className="font-cartoon text-5xl text-gray-400" style={{textShadow: '3px 3px 0 #000'}}>Upload an Image!</h2>
            <p className="font-semibold text-gray-500 mt-2">Drag & drop or click here</p>
            <p className="text-xs mt-1 text-gray-600">PNG, JPG, WEBP up to {MAX_FILE_SIZE_MB}MB</p>
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-6 relative">
       <div className="absolute top-6 right-6 z-10 flex gap-3">
          <button onClick={onSave} disabled={!resultDataUrl || isLoading} className="font-cartoon bg-[var(--color-accent)] text-lg text-[var(--color-text-on-primary)] py-2 px-5 rounded-md border-2 border-black hover:bg-[var(--color-primary)] disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed disabled:border-gray-900 transition-all duration-300 flex items-center justify-center gap-2 active:translate-y-px">
            <span>Save</span>
          </button>
          <button onClick={handleDownload} disabled={!resultDataUrl || isLoading} className="font-cartoon bg-gray-700 text-lg text-white py-2 px-5 rounded-md border-2 border-black hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed disabled:border-gray-900 transition-colors flex items-center justify-center gap-2 active:translate-y-px">
            <span>Download</span>
          </button>
      </div>
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <DisplayContent />
      </div>
    </div>
  );
};