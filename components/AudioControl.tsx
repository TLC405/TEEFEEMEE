import React, { useEffect, useRef } from 'react';

/**
 * This component provides a comprehensive debug and upgrade for the app's music.
 * It ensures the ambient lofi music plays infinitely and robustly across the application.
 */
export const AudioControl: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // The entire setup effect should only run once.
    if (isInitialized.current) return;
    isInitialized.current = true;
    
    const audioElement = document.getElementById('background-music') as HTMLAudioElement;
    if (!audioElement) {
      console.error("Audio player element not found. Music cannot be played.");
      return;
    }
    
    audioRef.current = audioElement;
    audioRef.current.volume = 0.3;

    const addInteractionListeners = () => {
      window.addEventListener('click', playAudioOnInteraction);
      window.addEventListener('keydown', playAudioOnInteraction);
      window.addEventListener('touchstart', playAudioOnInteraction);
    };

    const removeInteractionListeners = () => {
      window.removeEventListener('click', playAudioOnInteraction);
      window.removeEventListener('keydown', playAudioOnInteraction);
      window.removeEventListener('touchstart', playAudioOnInteraction);
    };
    
    // --- UPGRADE: Robust Infinite Loop ---
    // The HTML 'loop' attribute can sometimes be unreliable. This programmatic approach
    // provides a more failsafe way to ensure the music loops infinitely. When the track
    // ends, we manually reset its time and play it again.
    const handleAudioEnded = () => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(error => {
          console.error("Failed to restart music loop:", error);
          // If restarting fails, we'll wait for the next user interaction to try again.
          addInteractionListeners(); 
        });
      }
    };
    audioElement.addEventListener('ended', handleAudioEnded);
    
    // --- DEBUG & UPGRADE: Resilient Playback Initiation ---
    // Modern browsers block audio until a user interacts with the page. This system
    // attempts to play audio on the first interaction. If it fails (e.g., due to
    // browser policy), it will keep trying on subsequent interactions until it succeeds.
    const playAudioOnInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          // Success! Music is playing. We no longer need these specific listeners.
          removeInteractionListeners();
        }).catch(error => {
          // Playback was blocked by the browser. We leave the listeners active
          // to try again on the next user interaction.
          console.warn("Audio playback failed on interaction, will retry.", error);
        });
      } else {
        // If audio is already playing, we can clean up the listeners.
        removeInteractionListeners();
      }
    };

    // Initially, add the listeners to wait for the first user interaction.
    addInteractionListeners();

    // --- Cleanup ---
    // When the component unmounts, we must clean up all event listeners
    // to prevent memory leaks.
    return () => {
      if (audioElement) {
        audioElement.removeEventListener('ended', handleAudioEnded);
      }
      removeInteractionListeners();
    };
  }, []); // Empty dependency array ensures this setup runs only once.

  // This component renders no UI. Its sole purpose is to manage the background music.
  return null;
};