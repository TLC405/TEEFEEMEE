import React from 'react';

export const Header: React.FC = React.memo(() => {
    return (
        <header className="shrink-0 bg-[var(--color-primary)] border-b-4 border-black shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-center h-20">
                    <h1 className="font-cartoon text-6xl text-[var(--color-secondary)]" style={{textShadow: "4px 4px 0px #000"}}>
                        Teef<span className="inline-block logo-eye">e</span>eMe
                    </h1>
                </div>
            </div>
        </header>
    );
});
