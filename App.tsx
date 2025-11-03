import React from 'react';
import { Header } from './components/Header';
import { ToastContainer } from './components/Toast';
import { useToast } from './hooks/useToast';
import { AudioControl } from './components/AudioControl';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CartoonizerPage } from './components/CartoonizerPage';

const App: React.FC = () => {
  const { toasts, addToast, removeToast } = useToast();

  return (
    <div className="min-h-screen flex flex-col bg-transparent transition-colors duration-300">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
      <AudioControl />
      
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto p-4 flex flex-col items-center">
        <ErrorBoundary>
          <CartoonizerPage addToast={addToast} />
        </ErrorBoundary>
      </main>

      <footer className="text-center p-4 text-[var(--color-text-primary)] text-sm shrink-0">
        <p className='font-bold' style={{textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>&copy; 2024 TeefeeMe. Transform your reality.</p>
      </footer>
    </div>
  );
};

export default App;
