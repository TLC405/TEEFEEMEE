import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ToastContainer } from './components/Toast';
import { useToast } from './hooks/useToast';
import { AudioControl } from './components/AudioControl';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CartoonizerPage } from './components/CartoonizerPage';
import { IntroOverlay } from './components/IntroOverlay';
import { Gallery } from './components/Gallery';
import { StyleFuse } from './components/StyleFuse';

type ActiveTab = 'creator' | 'gallery' | 'stylefuse';

const TabButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    role="tab"
    aria-selected={isActive}
    onClick={onClick}
    className={`font-cartoon text-4xl text-black/80 px-6 py-2 tab-button ${isActive ? 'active' : ''}`}
    style={{ textShadow: '2px 2px 0px #fff' }}
  >
    {label}
  </button>
);

const App: React.FC = () => {
  const { toasts, addToast, removeToast } = useToast();
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('creator');

  useEffect(() => {
    const timer = setTimeout(() => {
      const intro = document.getElementById('intro-overlay');
      if (intro) {
        intro.classList.add('fade-out');
      }
      const removeTimer = setTimeout(() => setShowIntro(false), 500); // Remove from DOM after fade
      return () => clearTimeout(removeTimer);
    }, 4500); // Start fade-out after 4.5s for a 5s total animation
    
    return () => clearTimeout(timer);
  }, []);


  return (
    <div className="min-h-screen flex flex-col bg-transparent transition-colors duration-300">
      {showIntro && <IntroOverlay />}
      
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
      <AudioControl />
      
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto p-4 flex flex-col items-center">
        <ErrorBoundary>
          {/* Tab Navigation */}
          <div role="tablist" className="flex items-center justify-center space-x-4 md:space-x-8 mb-6 animate-pop-in">
            <TabButton label="Creator" isActive={activeTab === 'creator'} onClick={() => setActiveTab('creator')} />
            <TabButton label="Gallery" isActive={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} />
            <TabButton label="Style Lab" isActive={activeTab === 'stylefuse'} onClick={() => setActiveTab('stylefuse')} />
          </div>

          {/* Tab Content */}
          <div className="w-full">
            {activeTab === 'creator' && <CartoonizerPage addToast={addToast} />}
            {activeTab === 'gallery' && <Gallery />}
            {activeTab === 'stylefuse' && <StyleFuse />}
          </div>
        </ErrorBoundary>
      </main>

      <footer className="text-center p-4 text-[var(--color-text-primary)] text-sm shrink-0">
        <p className='font-bold' style={{textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>&copy; 2024 TeefeeMe. Transform your reality.</p>
      </footer>
    </div>
  );
};

export default App;