import React, { useState } from 'react';
import { PinLockScreen } from '../components/PinLockScreen';
import { useTheme } from '../hooks/useTheme';

const CORRECT_PIN = '1309';

export const Admin: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showDevLogs, setShowDevLogs] = useState(false);
  const { isLightTheme, toggleTheme } = useTheme();

  const resetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This will reload the application.')) {
      window.location.reload();
    }
  };

  if (!isUnlocked) {
    return <PinLockScreen correctPin={CORRECT_PIN} onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <div className="animate-slide-in-up">
      <h1 className="text-3xl font-bold text-text-primary mb-4">Admin</h1>
      <p className="text-text-secondary mb-6">Manage application settings.</p>
      
      <div className="space-y-4 max-w-md">
        <div className="bg-panel p-4 rounded-lg border border-panel-border flex justify-between items-center">
          <label htmlFor="theme-toggle" className="font-medium text-text-primary">Enable Light Theme</label>
          <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input type="checkbox" name="theme-toggle" id="theme-toggle" checked={isLightTheme} onChange={toggleTheme} className="toggle-checkbox" />
              <label htmlFor="theme-toggle" className="toggle-label"></label>
          </div>
        </div>

         <div className="bg-panel p-4 rounded-lg border border-panel-border flex justify-between items-center">
          <label htmlFor="dev-logs-toggle" className="font-medium text-text-primary">Show Dev Logs</label>
          <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input type="checkbox" name="dev-logs-toggle" id="dev-logs-toggle" checked={showDevLogs} onChange={() => setShowDevLogs(!showDevLogs)} className="toggle-checkbox"/>
              <label htmlFor="dev-logs-toggle" className="toggle-label"></label>
          </div>
        </div>

        <div className="bg-panel p-4 rounded-lg border border-panel-border">
            <h2 className="text-xl font-semibold text-text-primary mb-2">Data Management</h2>
            <p className="text-text-secondary mb-4">Reload the app with the initial seed data. This can't be undone.</p>
            <button onClick={resetData} className="w-full bg-red-600/80 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
              Reset Data
            </button>
        </div>
      </div>
    </div>
  );
};