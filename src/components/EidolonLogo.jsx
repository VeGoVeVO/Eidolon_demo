import React, { useState } from 'react';
import { Sparkles as SparkleIcon } from 'lucide-react';

/**
 * EIDOLON LOGO COMPONENT (V12)
 * ---------------------------
 * - ADJUSTED: Spacing/Kerning.
 * 1. Removed `gap-1` from main container.
 * 2. Added negative margin (`mx-[-8px]`) to the Prism container to compensate 
 * for the empty space inside the 3D scene's bounding box, effectively 
 * tightening the letters "E" and "D" against the crystal.
 */

// --- STATIC RESOURCES ---

// Glass material style
const faceStyle = {
  position: 'absolute',
  width: '32px',  
  height: '48px', 
  background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.8) 0%, rgba(249, 115, 22, 0.7) 100%)',
  boxShadow: 'inset 0 0 15px rgba(255, 255, 255, 0.25)', 
  backfaceVisibility: 'hidden',
};

// --- HELPER COMPONENTS ---

const TextFragment = ({ children }) => (
  <span 
    className="text-6xl md:text-7xl font-black tracking-tight bg-clip-text text-transparent relative z-10"
    style={{
      backgroundImage: 'linear-gradient(135deg, #9333ea 0%, #db2777 25%, #f97316 50%, #db2777 75%, #9333ea 100%)',
      backgroundSize: '300% 300%',
      animation: 'eidolonGradient 8s ease infinite',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0px 2px 4px rgba(147, 51, 234, 0.15))'
    }}
  >
    {children}
  </span>
);

const SparkleBurst = () => (
  <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center -translate-y-4">
    {[...Array(6)].map((_, i) => (
      <div 
          key={i} 
          className="absolute animate-sparkle-burst"
          style={{
              top: '50%', left: '50%',
              '--angle': `${i * 60 - 30}deg`,
              '--distance': '50px',
              animationDelay: '0.1s'
          }}
      >
          <SparkleIcon size={10} className="text-white fill-white opacity-80" />
      </div>
    ))}
  </div>
);

// --- MAIN COMPONENT ---

const EidolonLogo = () => {
  const [isActive, setIsActive] = useState(false);

  const triggerAnimation = () => {
    if (!isActive) {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 1500);
    }
  };

  return (
    <div 
        // Changed gap-1 to gap-0 to tighten spacing
        className="flex items-center gap-0 select-none cursor-pointer font-sans"
        onClick={triggerAnimation}
    >
      
      {/* 1. LETTER "E" */}
      <TextFragment>E</TextFragment>

      {/* 2. THE PRISM "I" */}
      {/* Changed mx-1 to -mx-2 (negative margin) to pull letters closer to the thin crystal */}
      <div className="relative w-12 h-24 flex items-center justify-center -mx-2">
          {/* SCALING WRAPPER */}
          <div className="transform scale-[0.65] origin-center">
            
            <div className="relative w-12 h-24 flex items-center justify-center" style={{ perspective: '800px' }}>
                <div 
                    className={`relative w-full h-full ${isActive ? 'animate-elevation' : ''}`}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Ambient Glow */}
                    <div className={`
                        absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full blur-2xl transition-all duration-500
                        ${isActive ? 'bg-orange-500/60 scale-150' : 'bg-purple-500/20'}
                    `}></div>

                    {/* Burst Effects */}
                    {isActive && <SparkleBurst />}

                    {/* Rotating Crystal */}
                    <div 
                        className={`relative w-full h-full ${isActive ? 'animate-fast-spin' : 'animate-idle-spin'}`} 
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                    
                    {/* Top Pyramid */}
                    <div className="absolute top-1/2 left-1/2 w-0 h-0" style={{ transformStyle: 'preserve-3d', transform: 'translateY(-48px)' }}>
                        <div className="crystal-face origin-bottom" 
                        style={{ ...faceStyle, transform: 'translateX(-50%) translateZ(16px) rotateX(19deg)', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/60 to-transparent w-[200%] -translate-x-full animate-shine"></div>
                        </div>
                        <div className="crystal-face origin-bottom" style={{ ...faceStyle, transform: 'translateX(-50%) rotateY(90deg) translateZ(16px) rotateX(19deg)', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                        <div className="crystal-face origin-bottom" style={{ ...faceStyle, transform: 'translateX(-50%) rotateY(180deg) translateZ(16px) rotateX(19deg)', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                        <div className="crystal-face origin-bottom" style={{ ...faceStyle, transform: 'translateX(-50%) rotateY(-90deg) translateZ(16px) rotateX(19deg)', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                    </div>

                    {/* Bottom Pyramid */}
                    <div className="absolute top-1/2 left-1/2 w-0 h-0" style={{ transformStyle: 'preserve-3d' }}>
                        <div className="crystal-face origin-top" style={{ ...faceStyle, transform: 'translateX(-50%) translateZ(16px) rotateX(-19deg)', clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }} />
                        <div className="crystal-face origin-top" style={{ ...faceStyle, transform: 'translateX(-50%) rotateY(90deg) translateZ(16px) rotateX(-19deg)', clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }} />
                        <div className="crystal-face origin-top" style={{ ...faceStyle, transform: 'translateX(-50%) rotateY(180deg) translateZ(16px) rotateX(-19deg)', clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }} />
                        <div className="crystal-face origin-top" style={{ ...faceStyle, transform: 'translateX(-50%) rotateY(-90deg) translateZ(16px) rotateX(-19deg)', clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }} />
                    </div>

                    {/* Internal Core */}
                    <div 
                        className="absolute top-1/2 left-1/2 w-1.5 h-12 blur-md -translate-x-1/2 -translate-y-1/2" 
                        style={{ 
                            transform: 'translateZ(0px)', 
                            background: 'rgba(255, 255, 255, 0.6)', 
                            boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.4)' 
                        }}
                    ></div>

                    </div>
                </div>
            </div>
          </div>
      </div>

      {/* 3. LETTERS "DOLON" */}
      <TextFragment>DOLON</TextFragment>

      {/* ANIMATIONS & STYLES */}
      <style>{`
          @keyframes eidolonGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes crystalSpin {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(360deg); }
          }
          @keyframes elevation {
            0% { transform: translateY(0); }
            20% { transform: translateY(5px); }
            50% { transform: translateY(-30px); }
            60% { transform: translateY(-30px); }
            100% { transform: translateY(0); }
          }
          @keyframes fastSpin {
            0% { transform: rotateY(0deg); }
            20% { transform: rotateY(180deg); }
            50% { transform: rotateY(720deg); }
            60% { transform: rotateY(900deg); }
            100% { transform: rotateY(1080deg); }
          }
          @keyframes sparkleBurst {
            0% { transform: rotate(var(--angle)) translateY(0) scale(0); opacity: 0; }
            50% { opacity: 1; transform: rotate(var(--angle)) translateY(var(--distance)) scale(1); }
            100% { transform: rotate(var(--angle)) translateY(calc(var(--distance) + 20px)) scale(0); opacity: 0; }
          }
          @keyframes glassShine {
            0% { transform: translateX(-150%) skewX(-20deg); }
            50% { transform: translateX(150%) skewX(-20deg); }
            100% { transform: translateX(150%) skewX(-20deg); }
          }
          .animate-idle-spin { animation: crystalSpin 8s linear infinite; }
          .animate-elevation { animation: elevation 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
          .animate-fast-spin { animation: fastSpin 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
          .animate-sparkle-burst { animation: sparkleBurst 0.8s ease-out forwards; }
          .animate-shine { animation: glassShine 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default EidolonLogo;
