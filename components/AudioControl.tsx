import React, { useState, useEffect, useRef } from 'react';

const MutedIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l4-4m0 0l-4-4m4 4H7" />
  </svg>
);

const UnmutedIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  </svg>
);


export const AudioControl: React.FC = () => {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const audioElement = document.getElementById('background-music') as HTMLAudioElement;
    if (audioElement) {
      audioRef.current = audioElement;
      audioRef.current.volume = 0.3; // Set a pleasant volume
      audioRef.current.muted = isMuted;
    }
    
    const onFirstInteraction = () => {
        setHasInteracted(true);
        window.removeEventListener('click', onFirstInteraction);
        window.removeEventListener('keydown', onFirstInteraction);
    };

    window.addEventListener('click', onFirstInteraction);
    window.addEventListener('keydown', onFirstInteraction);

    return () => {
        window.removeEventListener('click', onFirstInteraction);
        window.removeEventListener('keydown', onFirstInteraction);
    }

  }, []);

  useEffect(() => {
    if (hasInteracted && audioRef.current && !isMuted) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  }, [hasInteracted, isMuted]);

  const toggleMute = () => {
    if (audioRef.current) {
        setHasInteracted(true); // Ensure interaction is registered
        const shouldBeMuted = !isMuted;
        audioRef.current.muted = shouldBeMuted;
        setIsMuted(shouldBeMuted);

        if (!shouldBeMuted) {
            audioRef.current.play().catch(e => console.error("Audio play failed on toggle:", e));
        }
    }
  };

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-[var(--color-primary)] text-[var(--color-secondary)] rounded-full flex items-center justify-center shadow-lg border-2 border-black transition-transform hover:scale-110 active:scale-100"
      aria-label={isMuted ? 'Unmute music' : 'Mute music'}
      style={{textShadow: '2px 2px 0px #000'}}
    >
      {isMuted ? <MutedIcon /> : <UnmutedIcon />}
    </button>
  );
};
