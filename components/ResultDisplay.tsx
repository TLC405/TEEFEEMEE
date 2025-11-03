import React from 'react';

export const ResultDisplay: React.FC<{
    resultDataUrl: string | null;
    error: string | null;
}> = ({ resultDataUrl, error }) => {
    
    const ErrorDisplay = ({ message }: { message: string }) => (
      <div role="alert" className="w-full aspect-square flex flex-col items-center justify-center text-center p-4 bg-red-100/80 text-red-800 rounded-lg border-2 border-black">
        <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <h3 className="font-cartoon text-xl text-black mt-4">D'oh! Generation Failed</h3>
        <p className="mt-1 text-sm text-red-900 max-w-md">{message}</p>
      </div>
    );

    const Placeholder = () => (
      <div className="w-full aspect-square flex flex-col items-center justify-center text-center text-[var(--color-text-secondary)] p-8 bg-gray-100/50 rounded-lg border-2 border-dashed border-gray-400">
          <svg className="w-20 h-20 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v4h-2zm0 6h2v2h-2z"/></svg>
          <h2 className="font-cartoon text-2xl mt-4 text-black">Your art will appear here!</h2>
          <p className="mt-1">Select a style from the panel to generate your image.</p>
      </div>
    );

    return (
        <div className="w-full min-h-[300px] flex items-center justify-center relative overflow-hidden rounded-lg">
            {error ? <ErrorDisplay message={error} /> : resultDataUrl ? (
                <img src={resultDataUrl} alt="Generated result" className="rounded-lg w-full aspect-square object-cover border-2 border-black animate-fade-in" />
            ) : <Placeholder />}
        </div>
    );
}
