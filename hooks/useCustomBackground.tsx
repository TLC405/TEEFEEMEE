import { useState, useEffect, useCallback } from 'react';
import { CUSTOM_BACKGROUND_STORAGE_KEY } from '../constants';

export const useCustomBackground = () => {
    const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);

    useEffect(() => {
        const storedUrl = localStorage.getItem(CUSTOM_BACKGROUND_STORAGE_KEY);
        if (storedUrl) {
            setBackgroundUrl(storedUrl);
        }
    }, []);

    useEffect(() => {
        if (backgroundUrl) {
            document.body.style.backgroundImage = `url(${backgroundUrl})`;
            document.body.classList.add('custom-bg');
        } else {
            document.body.style.backgroundImage = '';
            document.body.classList.remove('custom-bg');
        }
    }, [backgroundUrl]);

    const setCustomBackgroundFile = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            localStorage.setItem(CUSTOM_BACKGROUND_STORAGE_KEY, result);
            setBackgroundUrl(result);
        };
        reader.readAsDataURL(file);
    }, []);

    const clearCustomBackground = useCallback(() => {
        localStorage.removeItem(CUSTOM_BACKGROUND_STORAGE_KEY);
        setBackgroundUrl(null);
    }, []);

    return { setCustomBackgroundFile, clearCustomBackground };
};
