import React, { useState, CSSProperties } from 'react';
import { generateColorPalette } from '../services/geminiService';

interface CardStyle {
  spacing: string;
  shadow: string;
  rounded: string;
}

interface CardColors {
  accent: string;
  background: string;
  text: string;
}

const DemoCard: React.FC<{ cardStyle: CardStyle; colors: CardColors }> = ({ cardStyle, colors }) => (
  <div 
    className={`p-4 border border-panel-border transition-all duration-300 group hover:-translate-y-1 ${cardStyle.spacing} ${cardStyle.shadow} ${cardStyle.rounded}`}
    style={{
      '--card-bg': colors.background,
      '--card-accent': colors.accent,
      '--card-text': colors.text,
      backgroundColor: 'var(--card-bg)',
      borderColor: 'rgba(var(--color-panel-border), 0.5)'
    } as CSSProperties}
  >
    <h3 
      className="text-lg font-bold transition-colors duration-300 group-hover:opacity-80"
      style={{ color: 'var(--card-accent)' }}
    >
      Demo Card
    </h3>
    <p 
      className="text-sm"
      style={{ color: 'var(--card-text)' }}
    >
      Style me with actions.
    </p>
  </div>
);

export const Builder: React.FC = () => {
  const [cardStyle, setCardStyle] = useState<CardStyle>({
    spacing: 'space-y-2',
    shadow: 'shadow-md',
    rounded: 'rounded-lg'
  });
  const [cardColors, setCardColors] = useState<CardColors>({
     background: '#111827',
     accent: '#D7EB4A',
     text: '#9CA3AF'
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const makeCardsPop = () => {
    setCardStyle(prev => ({ ...prev, shadow: 'shadow-2xl shadow-accent/20', rounded: 'rounded-2xl' }));
  };

  const tightenSpacing = () => {
    setCardStyle(prev => ({...prev, spacing: 'space-y-1' }));
  };
  
  const generateColors = async () => {
    setIsGenerating(true);
    try {
      const newColors = await generateColorPalette();
      setCardColors(newColors);
    } catch (error) {
      console.error("Failed to generate colors:", error);
      // Here you could show a toast notification to the user
    } finally {
      setIsGenerating(false);
    }
  };

  const baseButtonStyles = "bg-accent text-background font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-all hover:scale-105 duration-200";
  const disabledButtonStyles = "disabled:opacity-75 disabled:scale-100 disabled:cursor-not-allowed";

  return (
    <div className="animate-slide-in-up">
      <h1 className="text-3xl font-bold text-text-primary mb-4">Builder</h1>
      <p className="text-text-secondary mb-6">Use quick actions to modify component styles in real-time.</p>
      
      <div className="bg-panel p-6 rounded-lg border border-panel-border mb-6">
        <h2 className="text-xl font-semibold text-accent mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={generateColors} 
            disabled={isGenerating} 
            className={`${baseButtonStyles} ${disabledButtonStyles}`}
            aria-live="polite"
          >
            {isGenerating ? 'Generating...' : 'Generate Colors'}
          </button>
          <button onClick={makeCardsPop} className={baseButtonStyles}>Make Cards Pop</button>
          <button onClick={tightenSpacing} className={baseButtonStyles}>Tighten Spacing</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DemoCard cardStyle={cardStyle} colors={cardColors} />
        <DemoCard cardStyle={cardStyle} colors={cardColors} />
        <DemoCard cardStyle={cardStyle} colors={cardColors} />
      </div>

    </div>
  );
};