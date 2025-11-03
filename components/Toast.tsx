import React from 'react';
import { ToastMessage } from '../types';

const Toast: React.FC<{ toast: ToastMessage; onDismiss: (id: number) => void; }> = ({ toast, onDismiss }) => {
  const bgColor = toast.type === 'error' ? 'bg-red-500' : 'bg-[var(--color-accent)]';
  const textColor = toast.type === 'error' ? 'text-white' : 'text-[var(--color-text-on-primary)]';
  
  const Icon = toast.type === 'error' 
    ? <svg className={`w-6 h-6 ${textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    : <svg className={`w-6 h-6 ${textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;

  return (
    <div className={`max-w-sm w-full ${bgColor} shadow-lg rounded-md pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden animate-slide-up`}>
      <div className="p-4"><div className="flex items-start">
          <div className="flex-shrink-0">{Icon}</div>
          <div className="ml-3 w-0 flex-1 pt-0.5"><p className={`text-sm font-medium ${textColor}`}>{toast.message}</p></div>
          <div className="ml-4 flex-shrink-0 flex">
            <button onClick={() => onDismiss(toast.id)} className={`inline-flex ${textColor}/70 rounded-md hover:${textColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-lime-500 focus:ring-white`}>
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </div></div>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: ToastMessage[]; onDismiss: (id: number) => void; }> = ({ toasts, onDismiss }) => (
    <div aria-live="assertive" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50">
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast) => (<Toast key={toast.id} toast={toast} onDismiss={onDismiss} />))}
      </div>
    </div>
);
