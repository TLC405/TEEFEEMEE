import React from 'react';

export const IntroOverlay: React.FC = () => {
    return (
        <div 
            id="intro-overlay" 
            className="intro-overlay"
            aria-hidden="true"
        >
            <div className="synth-grid">
                <div className="energy-pulse"></div>
            </div>
            <div className="synth-content">
                <div className="synth-logo-wrapper">
                    <div className="synth-logo">TeefeeMe</div>
                </div>
                <div className="synth-subtitle">PRESENTS</div>
            </div>
        </div>
    );
};