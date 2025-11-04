import React from 'react';

const PlaceholderCard: React.FC = () => (
  <div className="aspect-square w-full bg-gray-200 rounded-lg border-2 border-black flex items-center justify-center p-4 relative overflow-hidden shimmer">
    <svg className="w-16 h-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  </div>
);

export const Gallery: React.FC = () => {
    return (
        <div className="w-full mt-4 animate-pop-in">
            <div className="simpson-panel p-8">
                <div className="text-center mb-8">
                    <h1 className="font-cartoon text-5xl text-[var(--color-primary)]" style={{textShadow: '2px 2px 0px #000'}}>Your Masterpieces</h1>
                    <p className="text-[var(--color-text-secondary)] mt-2 font-bold">A collection of your amazing creations!</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <PlaceholderCard key={index} />
                    ))}
                </div>
                
                 <div className="text-center mt-8">
                    <p className="text-gray-500">Your generated images will appear here automatically.</p>
                </div>
            </div>
        </div>
    );
};