import React, { useState, useEffect } from 'react';

const useTypewriter = (text: string, speed = 50) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    setDisplayText(''); // Reset on text change
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);

    return () => clearInterval(typingInterval);
  }, [text, speed]);

  return displayText;
};


export const LoadingOverlay: React.FC<{ loadingMessage: string }> = ({ loadingMessage }) => {
    const [progress, setProgress] = useState(0);
    const typedMessage = useTypewriter(loadingMessage, 50);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(oldProgress => {
                if (oldProgress >= 100) return 100;
                const diff = Math.random() * 10;
                return Math.min(oldProgress + diff, 100);
            });
        }, 500);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Give a small progress boost for each new message
        setProgress(p => Math.min(p + 5, 95));
    }, [loadingMessage])

    return (
        <div role="status" aria-live="polite" className="fixed inset-0 z-[60] w-full h-full flex flex-col items-center justify-center text-center p-4 bg-[var(--color-primary)]/90 backdrop-blur-sm animate-fade-in">
            <div className="relative z-10 w-full max-w-lg">
                <h3 
                  className="font-cartoon text-7xl text-white mt-6" 
                  style={{ textShadow: '4px 4px 0 var(--color-accent), 8px 8px 0 #000' }}
                >
                    Working Magic...
                </h3>
                
                <div className="mt-8 h-8 flex items-center justify-center font-bold text-lg text-white">
                    <p style={{textShadow: '2px 2px 0 #000'}}>{typedMessage}</p>
                </div>

                <div className="w-full bg-black/30 rounded-full h-5 mt-4 border-2 border-black">
                    <div 
                        className="bg-[var(--color-accent)] h-full rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};