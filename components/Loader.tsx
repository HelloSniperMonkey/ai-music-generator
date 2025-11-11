
import React from 'react';

// Equalizer-style animated loader to reinforce music theme
export const Loader: React.FC = () => {
  return (
    <div className="flex items-end space-x-1 h-16 w-16 justify-center" aria-label="Loading">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-3 rounded-full bg-gradient-to-t from-purple-600 to-pink-500 animate-pulse"
          style={{
            animation: `eqPulse 1.2s ease-in-out ${i * 0.12}s infinite`,
            boxShadow: '0 0 10px rgba(236,72,153,.35), 0 0 18px rgba(139,92,246,.35)',
          }}
        />
      ))}
      <style>{`
        @keyframes eqPulse {
          0%, 100% { height: 25%; opacity: .55; }
          40% { height: 95%; opacity: 1; }
          60% { height: 55%; opacity: .85; }
        }
      `}</style>
    </div>
  );
};
