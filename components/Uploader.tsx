import React, { useCallback } from 'react';
import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB, ALLOWED_MIME_TYPES } from '../constants';

interface UploaderProps {
  onImageUpload: (dataUrl: string) => void;
  addToast: (message: string, type: 'success' | 'error') => void;
}

export const Uploader: React.FC<UploaderProps> = ({ onImageUpload, addToast }) => {

    const handleFile = useCallback((file: File) => {
        if (!file) return;

        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            addToast(`Invalid file type. Please use ${ALLOWED_MIME_TYPES.join(', ')}.`, 'error');
            return;
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
            addToast(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`, 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            if (typeof e.target?.result === 'string') {
                onImageUpload(e.target.result);
            }
        };
        reader.onerror = () => {
            addToast('Failed to read the file.', 'error');
        };
        reader.readAsDataURL(file);
    }, [addToast, onImageUpload]);

    const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files?.[0];
        if (file) {
            handleFile(file);
        }
    }, [handleFile]);

    const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    return (
        <div className="simpson-panel p-8 text-center">
            <h1 className="font-cartoon text-5xl text-[var(--color-primary)]" style={{textShadow: '2px 2px 0px #000'}}>Upload Your Image</h1>
            <p className="text-[var(--color-text-secondary)] mt-2 mb-6 font-bold">Let's create some magic! Drop an image or click to select.</p>
            
            <label htmlFor="file-upload" className="cursor-pointer">
                <div 
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    className="relative block w-full rounded-lg border-4 border-dashed border-gray-400 p-12 text-center hover:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-colors"
                >
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="mt-2 block font-semibold text-gray-600">
                        Drop your image here, or click to browse
                    </span>
                     <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to {MAX_FILE_SIZE_MB}MB</p>
                </div>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={onFileChange} accept={ALLOWED_MIME_TYPES.join(',')} />
            </label>
        </div>
    );
};
