import React, { useState, useCallback, DragEvent, useRef } from 'react';
import { resizeImage } from '../utils/imageUtils';

export interface UploadedImage {
  base64: string;
  mimeType: string;
  name: string;
}

interface ImageUploaderProps {
  onImageUpload: (image: UploadedImage | null) => void;
  disabled?: boolean;
}

const fileToBase64 = (file: File | Blob): Promise<{ base64: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [meta, base64] = result.split(',');
      const mimeType = meta.split(':')[1].split(';')[0];
      resolve({ base64, mimeType });
    };
    reader.onerror = error => reject(error);
  });
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, disabled }) => {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file || disabled) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, etc.).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File is too large. Please upload an image under 10MB.');
        return;
    }

    setError(null);
    try {
      const resizedBlob = await resizeImage(file, 1024, 1024);
      const { base64, mimeType } = await fileToBase64(resizedBlob);
      const newImage = { base64, mimeType, name: file.name };
      setUploadedImage(newImage);
      onImageUpload(newImage);
    } catch (e) {
      setError('Sorry, there was an issue processing that file.');
      onImageUpload(null);
    }
  }, [onImageUpload, disabled]);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if(disabled) return;
    setIsDragging(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if(disabled) return;
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    if (disabled) return;
    setUploadedImage(null);
    onImageUpload(null);
    if(inputRef.current) {
        inputRef.current.value = "";
    }
  };

  return (
    <div className="flex-grow flex flex-col w-full h-full">
      {uploadedImage ? (
        <div className="relative group w-full flex-grow rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
          <img src={`data:${uploadedImage.mimeType};base64,${uploadedImage.base64}`} alt="Uploaded preview" className="w-full h-full object-contain" />
          <div className={`absolute inset-0 bg-black/70 transition-opacity flex items-center justify-center ${disabled ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
            <button onClick={handleRemoveImage} className="bg-comic-pink text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors shadow-comic-sm border-2 border-black">
              Change Image
            </button>
          </div>
        </div>
      ) : (
        <div 
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`relative w-full flex-grow rounded-lg border-4 border-dashed flex flex-col items-center justify-center text-center p-4 transition-colors ${isDragging ? 'border-comic-pink bg-comic-pink/20' : 'border-gray-400'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-comic-pink'}`}
        >
          <input
            ref={inputRef}
            type="file"
            id="image-upload"
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            aria-label="Upload your image"
            accept="image/*"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          />
          <label htmlFor="image-upload" className={`cursor-pointer p-4 ${disabled ? 'cursor-not-allowed' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-text-primary">
              <span className="font-bold text-comic-blue">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-text-secondary mt-1">PNG, JPG, etc. Max 10MB</p>
          </label>
           {error && <p role="alert" className="text-red-500 text-sm mt-2 font-semibold">{error}</p>}
        </div>
      )}
    </div>
  );
};
