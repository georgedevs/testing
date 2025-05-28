import React from 'react';
import { useTheme } from 'next-themes';

interface HeartLogoProps {
  className?: string;
  size?: number;
}

const HeartLogo: React.FC<HeartLogoProps> = ({ 
  className = "w-10 h-10", 
  size = 40 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Glow filter */}
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Sparkle filter */}
        <filter id="sparkle">
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Left heart curve - wavy and disconnected */}
      <path
        d="M16 10 
           C15 8.5, 13.5 7.5, 11.5 7.5
           C9.2 7.5, 7.5 9, 7.5 11
           C7.5 12.5, 8 13.8, 9 15.2
           C9.5 15.9, 10.2 16.8, 10.8 17.5
           C11.5 18.3, 12.3 19.2, 13 20
           C13.8 20.9, 14.5 21.7, 15.2 22.5
           C15.5 22.8, 15.7 23.1, 15.9 23.4"
        stroke={isDark ? "#f97316" : "#9333ea"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#glow)"
        className="transition-all duration-300"
      />

      {/* Right heart curve - wavy and disconnected */}
      <path
        d="M16 10
           C17 8.5, 18.5 7.5, 20.5 7.5
           C22.8 7.5, 24.5 9, 24.5 11
           C24.5 12.5, 24 13.8, 23 15.2
           C22.5 15.9, 21.8 16.8, 21.2 17.5
           C20.5 18.3, 19.7 19.2, 19 20
           C18.2 20.9, 17.5 21.7, 16.8 22.5
           C16.5 22.8, 16.3 23.1, 16.1 23.4"
        stroke={isDark ? "#f97316" : "#9333ea"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#glow)"
        className="transition-all duration-300"
      />

      {/* Floating sparkle dots - static */}
      <circle
        cx="10"
        cy="13"
        r="1"
        fill={isDark ? "#f97316" : "#9333ea"}
        filter="url(#sparkle)"
        opacity="0.8"
      />
      
      <circle
        cx="22"
        cy="13"
        r="0.8"
        fill={isDark ? "#fb923c" : "#7c3aed"}
        filter="url(#sparkle)"
        opacity="0.8"
      />

      <circle
        cx="16"
        cy="18"
        r="0.6"
        fill={isDark ? "#fdba74" : "#8b5cf6"}
        filter="url(#sparkle)"
        opacity="0.8"
      />

      {/* Hospital Heart Monitor Lifeline - ECG/EKG Pattern - Static */}
      <path
        d="M4 16 
           L8 16 
           L9 14 
           L10 18 
           L11 12 
           L12 20 
           L13 16 
           L16 16
           L17 16
           L18 14
           L19 18
           L20 13
           L21 19
           L22 16
           L28 16"
        stroke={isDark ? "#a855f7" : "#f97316"}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className="transition-all duration-300"
        style={{
          filter: isDark 
            ? 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.6))' 
            : 'drop-shadow(0 0 4px rgba(249, 115, 22, 0.6))'
        }}
      />

      {/* Static dot on the lifeline */}
      <circle
        cx="16"
        cy="16"
        r="2"
        fill={isDark ? "#a855f7" : "#f97316"}
        className="transition-all duration-300"
        style={{
          filter: isDark 
            ? 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.8))' 
            : 'drop-shadow(0 0 6px rgba(249, 115, 22, 0.8))'
        }}
      />

      {/* Additional ECG blips for more realism - static */}
      <path
        d="M6 16 L7 15.5 L7.5 16.5 L8 16"
        stroke={isDark ? "#a855f7" : "#f97316"}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />

      <path
        d="M24 16 L25 15.5 L25.5 16.5 L26 16"
        stroke={isDark ? "#a855f7" : "#f97316"}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />

      {/* Wavy connection hint - static */}
      <path
        d="M15.9 23.4 
           C15.95 23.6, 16 23.8, 16 24
           C16 23.8, 16.05 23.6, 16.1 23.4"
        stroke={isDark ? "#f97316" : "#9333ea"}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
        className="transition-all duration-300"
      />
    </svg>
  );
};

export default HeartLogo;