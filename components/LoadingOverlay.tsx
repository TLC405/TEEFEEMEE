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
        <div role="status" aria-live="polite" className="fixed inset-0 z-[60] w-full h-full flex flex-col items-center justify-center text-center p-4 bg-gray-900/90 backdrop-blur-sm animate-fade-in">
             <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 via-transparent to-[var(--color-accent)]/20 opacity-50 animate-pulse"></div>
            <div className="relative z-10 w-full max-w-lg">
                <h3 
                  className="font-cartoon text-6xl text-white mt-6 transform -skew-x-12" 
                  style={{ textShadow: '3px 3px 0 #ef4444, 6px 6px 0 #000' }}
                >
                    Working Magic...
                </h3>
                
                <div className="mt-8 h-12 flex items-center justify-center font-mono text-lg text-[var(--color-secondary)]">
                    <p className="typewriter-text">{typedMessage}</p>
                </div>

                <div className="w-full bg-black/30 rounded-full h-4 mt-6">
                    <div 
                        className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 h-4 rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};
