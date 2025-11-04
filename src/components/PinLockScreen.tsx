import React, { useState, FormEvent, useEffect, useRef } from 'react';

interface PinLockScreenProps {
  correctPin: string;
  onUnlock: () => void;
}

export const PinLockScreen: React.FC<PinLockScreenProps> = ({ correctPin, onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input when the component mounts
    inputRef.current?.focus();
  }, []);

  const handlePinSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (pin === correctPin) {
      setError('');
      onUnlock();
    } else {
      setError('Invalid PIN. Please try again.');
      setPin('');
      // Keep focus on input after error
      inputRef.current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="admin-access-title">
      <div className="bg-background border border-panel-border p-8 rounded-2xl w-full max-w-sm text-center shadow-2xl">
        <h2 id="admin-access-title" className="text-2xl font-bold text-text-primary mb-2">Admin Access</h2>
        <p className="text-text-secondary mb-6">Please enter the PIN to continue.</p>
        <form onSubmit={handlePinSubmit} noValidate>
          <input
            ref={inputRef}
            type="password"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              if (error) setError('');
            }}
            maxLength={4}
            className={`bg-panel border text-text-primary text-2xl text-center tracking-[1rem] w-full p-4 rounded-lg mb-4 focus:outline-none transition-colors duration-200 focus:border-accent ${
              error ? 'border-red-500 animate-shake' : 'border-panel-border'
            }`}
            aria-label="Admin PIN, 4 digits"
            aria-invalid={!!error}
            aria-describedby={error ? "pin-error" : undefined}
            autoComplete="off"
          />
          {error && <p id="pin-error" role="alert" className="text-red-500 text-sm mb-4">{error}</p>}
          <button type="submit" className="w-full bg-accent text-background font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-colors">
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
};