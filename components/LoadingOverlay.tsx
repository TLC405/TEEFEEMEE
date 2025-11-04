import React, { useState, useEffect, useRef } from 'react';

const useTypewriter = (text: string, speed = 50) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    setDisplayText(''); // Reset on text change
    if (text) {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(prev => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, speed);
      return () => clearInterval(typingInterval);
    }
  }, [text, speed]);

  return displayText;
};

// SVG component for the background effect
const ElectricWaterfall: React.FC = React.memo(() => (
    <svg className="absolute inset-0 w-full h-full z-0" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
            <filter id="electric-waterfall-filter">
                <feTurbulence 
                    type="fractalNoise" 
                    baseFrequency="0.005 0.9" 
                    numOctaves="2" 
                    result="turbulence" 
                />
                <feDisplacementMap 
                    in2="turbulence" 
                    in="SourceGraphic" 
                    scale="30" 
                    xChannelSelector="R" 
                    yChannelSelector="G" 
                />
                <animate 
                    attributeName="baseFrequency" 
                    from="0.005 0.9" 
                    to="0.005 0.09" 
                    dur="10s" 
                    repeatCount="indefinite"
                />
            </filter>
            <linearGradient id="glow-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'var(--synth-pink)', stopOpacity: 0 }} />
                <stop offset="50%" style={{ stopColor: 'var(--synth-cyan)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'var(--synth-pink)', stopOpacity: 0 }} />
            </linearGradient>
        </defs>
        
        <rect 
            width="100%" 
            height="100%" 
            filter="url(#electric-waterfall-filter)" 
            className="opacity-20" 
        />
        
        {Array.from({ length: 40 }).map((_, i) => {
            const duration = Math.random() * 2 + 1.5; // 1.5s to 3.5s
            const delay = Math.random() * -3;
            const left = `${(i + 1) * 2.5}%`;
            return (
                <rect 
                    key={i} 
                    x={left} 
                    y="-100%" 
                    width="2" 
                    height="100%"
                    fill="url(#glow-gradient)"
                    style={{
                      animation: `electric-flow ${duration}s linear ${delay}s infinite`,
                      filter: 'drop-shadow(0 0 3px var(--synth-cyan))',
                    }}
                />
            );
        })}
    </svg>
));

// Starfield component for a deep space effect
const Starfield: React.FC = React.memo(() => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const stars = Array.from({ length: 300 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5 + 0.5,
            alpha: Math.random(),
            dAlpha: Math.random() * 0.02 - 0.01, // Twinkle effect
        }));

        let animationFrameId: number;

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            stars.forEach(star => {
                star.alpha += star.dAlpha;
                if (star.alpha <= 0 || star.alpha >= 1) {
                    star.dAlpha *= -1;
                }
                
                star.y -= 0.1; // Move stars slowly upwards
                if (star.y < 0) {
                    star.y = height;
                }

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-[-2] opacity-70" />;
});


export const LoadingOverlay: React.FC<{ loadingMessage: string }> = ({ loadingMessage }) => {
    const typedMessage = useTypewriter(loadingMessage, 50);
    const [glowPosition, setGlowPosition] = useState({ x: '50%', y: '50%' });
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
             setGlowPosition({ x: `${e.clientX}px`, y: `${e.clientY}px` });
        };
        const handleMouseLeave = () => {
             setGlowPosition({ x: '50%', y: '50%' });
        };

        const wrapper = wrapperRef.current;
        if (wrapper) {
            window.addEventListener('mousemove', handleMouseMove);
            wrapper.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (wrapper) {
                wrapper.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);

    return (
        <div 
            ref={wrapperRef}
            role="status" 
            aria-live="polite" 
            className="fixed inset-0 z-[60] w-full h-full flex flex-col items-center justify-center text-center p-4 bg-[var(--loader-bg)] animate-fade-in overflow-hidden loader-grain"
        >
            <Starfield />

            {/* Floating Nebula Particles */}
            <div className="absolute inset-0 z-[-1] overflow-hidden">
                {Array.from({ length: 15 }).map((_, i) => {
                    const size = Math.random() * 80 + 20; // 20px to 100px
                    const duration = Math.random() * 20 + 15; // 15s to 35s
                    const delay = Math.random() * -20;
                    const left = `${Math.random() * 100}%`;
                    return (
                        <div
                            key={i}
                            className="absolute bottom-0 rounded-full bg-[var(--synth-pink)]"
                            style={{
                                width: `${size}px`,
                                height: `${size}px`,
                                left: left,
                                animation: `float-up ${duration}s linear ${delay}s infinite`,
                                filter: `blur(${size / 4}px)`,
                                opacity: 0,
                            }}
                        />
                    );
                })}
            </div>
            
            <ElectricWaterfall />

            {/* Interactive Mouse Glow */}
            <div
                className="absolute top-0 left-0 transition-all duration-300 pointer-events-none"
                style={{
                    width: '400px',
                    height: '400px',
                    background: `radial-gradient(circle, var(--loader-glow-2) 0%, transparent 60%)`,
                    opacity: 0.15,
                    transform: 'translate(-50%, -50%)',
                    filter: 'blur(50px)',
                    top: glowPosition.y,
                    left: glowPosition.x,
                }}
            />
            
            <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
                <h1 className="font-cartoon text-8xl md:text-9xl text-white" style={{ animation: 'neon-flicker 3s linear infinite' }}>
                    TeefeeMe
                </h1>
                
                <div className="mt-8 h-8 flex items-center justify-center font-['VT323',_monospace] text-2xl text-[var(--synth-cyan)]" style={{textShadow: '0 0 5px var(--synth-cyan), 0 0 10px var(--synth-cyan)'}}>
                    <p>{typedMessage}<span className="animate-pulse">_</span></p>
                </div>

                <div 
                    className="w-full max-w-sm bg-black/30 rounded-full h-5 mt-6 border-2 border-[var(--synth-cyan)]/50 overflow-hidden relative"
                    style={{ animation: 'progress-pulse 2.5s ease-in-out infinite' }}
                >
                    <div 
                        className="h-full w-full rounded-full"
                        style={{
                            animation: 'charge-sweep 2s linear infinite',
                            backgroundImage: 'linear-gradient(90deg, transparent, var(--synth-cyan), transparent)',
                            backgroundSize: '50% 100%',
                            backgroundRepeat: 'no-repeat',
                        }}
                    ></div>
                </div>
                <div 
                    className="text-white mt-4 text-sm font-bold font-['Poppins',_sans-serif]" 
                    style={{textShadow: '1px 1px 0 #000', animation: 'subtle-fade 3s ease-in-out infinite'}}
                >
                  Please wait, this can take a few moments...
                </div>
            </div>
        </div>
    );
};