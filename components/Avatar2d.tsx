'use client';

import { useMemo } from 'react';

interface Avatar2dProps {
  isSpeaking?: boolean;
  currentChar?: string;
}

export default function Avatar2d({ isSpeaking = false, currentChar = '' }: Avatar2dProps) {
  // Analyser le caractère pour déterminer la forme de bouche
  const mouthShape = useMemo(() => {
    if (!isSpeaking || !currentChar) return 'closed';
    
    const char = currentChar.toLowerCase();
    
    // Voyelles ouvertes (grande ouverture)
    if (['a', 'à', 'â', 'o', 'ô'].includes(char)) return 'open';
    
    // Voyelles fermées (petite ouverture)
    if (['e', 'é', 'è', 'ê', 'ë', 'i', 'î', 'ï', 'u', 'ù', 'û', 'ü', 'y'].includes(char)) return 'small';
    
    // Consonnes labiales (bouche fermée/arrondie)
    if (['m', 'b', 'p'].includes(char)) return 'round';
    
    // Consonnes dentales (légèrement ouverte)
    if (['t', 'd', 'n', 'l', 's', 'z'].includes(char)) return 'teeth';
    
    // Autres consonnes
    return 'small';
  }, [isSpeaking, currentChar]);
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative">
        {/* Ondes sonores animées quand ça parle */}
        {isSpeaking && (
          <>
            <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping opacity-30" style={{ animationDuration: '1.5s' }} />
            <div className="absolute inset-0 rounded-full border-4 border-purple-400 animate-ping opacity-20" style={{ animationDuration: '2s' }} />
          </>
        )}
        
        {/* Avatar SVG avec lip-sync */}
        <div className={`relative transition-transform duration-100 ${isSpeaking ? 'scale-105' : 'scale-100'}`}>
          <svg 
            viewBox="0 0 200 200" 
            className="w-64 h-64"
          >
            {/* Background circle */}
            <circle cx="100" cy="100" r="100" fill="url(#gradient)" />
            
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient id="faceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffe8d6" />
                <stop offset="100%" stopColor="#ffd4b8" />
              </linearGradient>
            </defs>
            
            {/* Face */}
            <circle cx="100" cy="100" r="70" fill="url(#faceGradient)" />
            
            {/* Eyes */}
            <circle cx="80" cy="85" r="8" fill="#1e293b" />
            <circle cx="120" cy="85" r="8" fill="#1e293b" />
            <circle cx="82" cy="83" r="3" fill="white" opacity="0.9" />
            <circle cx="122" cy="83" r="3" fill="white" opacity="0.9" />
            
            {/* Eyebrows */}
            <path
              d="M 70 75 Q 80 72 88 75"
              stroke="#1e293b"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 112 75 Q 120 72 130 75"
              stroke="#1e293b"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            
            {/* Nose */}
            <line x1="100" y1="95" x2="100" y2="108" stroke="#ffc8a8" strokeWidth="2" strokeLinecap="round" />
            
            {/* Mouth - CHANGE selon mouthShape */}
            {mouthShape === 'closed' && (
              <path
                d="M 85 125 Q 100 130 115 125"
                stroke="#c0392b"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            )}
            
            {mouthShape === 'open' && (
              <ellipse
                cx="100"
                cy="130"
                rx="15"
                ry="18"
                fill="#8b3a3a"
                stroke="#c0392b"
                strokeWidth="2"
              />
            )}
            
            {mouthShape === 'small' && (
              <ellipse
                cx="100"
                cy="128"
                rx="12"
                ry="10"
                fill="#8b3a3a"
                stroke="#c0392b"
                strokeWidth="2"
              />
            )}
            
            {mouthShape === 'round' && (
              <circle
                cx="100"
                cy="128"
                r="8"
                fill="#8b3a3a"
                stroke="#c0392b"
                strokeWidth="2"
              />
            )}
            
            {mouthShape === 'teeth' && (
              <>
                <ellipse
                  cx="100"
                  cy="128"
                  rx="14"
                  ry="8"
                  fill="#8b3a3a"
                  stroke="#c0392b"
                  strokeWidth="2"
                />
                <rect x="95" y="125" width="10" height="3" fill="white" rx="1" />
              </>
            )}
            
            {/* Cheeks */}
            <circle cx="65" cy="110" r="12" fill="#ff9999" opacity="0.4" />
            <circle cx="135" cy="110" r="12" fill="#ff9999" opacity="0.4" />
          </svg>
          
          {/* Indicateur de statut */}
          <div className={`absolute bottom-4 right-4 w-6 h-6 rounded-full border-4 border-white shadow-lg transition-colors ${
            isSpeaking ? 'bg-green-400 animate-pulse' : 'bg-gray-300'
          }`} />
        </div>

        {/* Barres audio stylées quand ça parle */}
        {isSpeaking && (
          <div className="absolute -right-20 top-1/2 -translate-y-1/2 flex gap-2 items-end">
            {[0, 0.1, 0.2, 0.3, 0.4].map((delay, i) => (
              <div
                key={i}
                className="w-2 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full shadow-lg"
                style={{
                  height: '40px',
                  animation: `pulse 0.8s ease-in-out infinite`,
                  animationDelay: `${delay}s`
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

