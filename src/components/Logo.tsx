import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export default function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  const sizeMap = {
    sm: { svg: 'w-8 h-8', text: 'text-base' },
    md: { svg: 'w-12 h-12', text: 'text-xl' },
    lg: { svg: 'w-16 h-16', text: 'text-2xl' },
    xl: { svg: 'w-24 h-24', text: 'text-4xl' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Premium SVG replication of the Gold & Blue logo */}
      <div className={`relative ${currentSize.svg} flex-shrink-0 animate-pulse-subtle`}>
        {/* Outer subtle blue-gold glow background */}
        <div className="absolute inset-0 rounded-full bg-linear-to-tr from-bb-dark via-bb-cyan to-bb-yellow opacity-20 blur-sm pointer-events-none"></div>
        
        <svg 
          viewBox="0 0 120 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_4px_10px_rgba(229,169,0,0.25)]"
        >
          <defs>
            {/* Golden Metallic Gradients */}
            <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF199" />
              <stop offset="35%" stopColor="#FFD43B" />
              <stop offset="70%" stopColor="#E5A900" />
              <stop offset="100%" stopColor="#9C6B00" />
            </linearGradient>
            
            <linearGradient id="blueBG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0a397c" />
              <stop offset="100%" stopColor="#031127" />
            </linearGradient>

            <linearGradient id="arrowGradient" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFD43B" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>

          {/* Background Blue/Gold Wave Circle */}
          <circle cx="60" cy="60" r="54" fill="url(#blueBG)" stroke="url(#goldGradient)" strokeWidth="3" />
          
          <path 
            d="M20 70 C 20 40, 40 25, 60 25 C 80 25, 100 40, 100 70 C 100 100, 80 100, 60 100 C 40 100, 20 85, 20 70 Z" 
            fill="#062B61" 
            opacity="0.3" 
          />

          {/* Stylized Double 'B' / Bank symbol */}
          <path 
            d="M 38 35 H 68 C 76 35, 82 41, 82 48 C 82 54, 76 59, 68 59 H 38 V 35 Z" 
            fill="none" 
            stroke="url(#goldGradient)" 
            strokeWidth="8" 
            strokeLinejoin="round"
          />
          <path 
            d="M 38 59 H 74 C 83 59, 89 65, 89 74 C 89 83, 83 89, 74 89 H 38 V 59 Z" 
            fill="none" 
            stroke="url(#goldGradient)" 
            strokeWidth="8" 
            strokeLinejoin="round"
          />
          
          {/* Vertical core pillars of B */}
          <rect x="34" y="32" width="8" height="60" rx="3" fill="url(#goldGradient)" />
          <rect x="48" y="44" width="8" height="38" rx="2" fill="url(#goldGradient)" opacity="0.9" />

          {/* Upward growing Arrow representing 'Jornada' (Ascension / Success) */}
          <path 
            d="M 22 84 L 56 50 L 68 62 L 98 28" 
            stroke="url(#goldGradient)" 
            strokeWidth="9" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Arrowhead */}
          <path 
            d="M 82 26 H 100 V 44" 
            stroke="url(#arrowGradient)" 
            strokeWidth="9" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-display font-bold tracking-tight uppercase leading-none text-slate-900 dark:text-white ${currentSize.text}`}>
            Jornada <span className="text-bb-yellow">BB</span>
          </span>
          <span className="font-sans text-[10px] tracking-widest uppercase font-semibold text-bb-cyan leading-none mt-0.5">
            Simulados
          </span>
        </div>
      )}
    </div>
  );
}
export type { LogoProps };
