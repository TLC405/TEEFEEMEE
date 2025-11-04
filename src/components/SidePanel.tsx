import React, { useEffect, useRef } from 'react';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose, children, title }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      const panel = panelRef.current;
      if (panel) {
        const focusableElements = panel.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        firstElement?.focus();

        const handleTabKeyPress = (e: KeyboardEvent) => {
          if (e.key !== 'Tab' || !focusableElements.length) {
            return;
          }

          if (e.shiftKey) { 
            if (document.activeElement === firstElement) {
              lastElement?.focus();
              e.preventDefault();
            }
          } else { 
            if (document.activeElement === lastElement) {
              firstElement?.focus();
              e.preventDefault();
            }
          }
        };

        panel.addEventListener('keydown', handleTabKeyPress);
        
        return () => {
          document.body.style.overflow = '';
          document.removeEventListener('keydown', handleKeyDown);
          panel.removeEventListener('keydown', handleTabKeyPress);
        };
      }
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-panel shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-panel-border ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
        ref={panelRef}
        tabIndex={-1}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 id="panel-title" className="text-2xl font-bold text-accent">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-text-secondary hover:bg-panel-border/50 hover:text-text-primary focus:outline-none focus-visible:ring-2 ring-accent"
              aria-label="Close panel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 -mr-2">
            {children}
          </div>
        </div>
      </div>
      {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/60 z-40 animate-fade-in" />}
    </>
  );
};
