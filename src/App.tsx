import React from 'react';
import { Cartoonifier } from './pages/Cartoonifier';
import { ErrorBoundary } from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen font-sans">
        <Cartoonifier />
      </div>
    </ErrorBoundary>
  );
};

export default App;