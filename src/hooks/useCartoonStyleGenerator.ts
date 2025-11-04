import { useState, useCallback } from 'react';
import { generateCartoonStyleDetails } from '../services/geminiService';

interface StyleDetails {
    description: string;
    prompt: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export const useCartoonStyleGenerator = () => {
    const [status, setStatus] = useState<Status>('idle');
    const [data, setData] = useState<StyleDetails | null>(null);
    const [error, setError] = useState<string | null>(null);

    const generate = useCallback(async (styleName: string) => {
        setStatus('loading');
        setData(null);
        setError(null);
        try {
            const result = await generateCartoonStyleDetails(styleName);
            setData(result);
            setStatus('success');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
            setStatus('error');
        }
    }, []);
    
    const reset = useCallback(() => {
        setStatus('idle');
        setData(null);
        setError(null);
    }, []);

    return { status, data, error, generate, reset };
};
