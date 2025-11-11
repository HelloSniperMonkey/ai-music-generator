
import React from 'react';

const MusicNoteIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4V7h4V3h-6z" />
  </svg>
);

export const Header: React.FC = () => {
  return (
    <header className="header-bar py-4 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-center sm:justify-start">
        <div className="flex items-center space-x-3">
          <MusicNoteIcon className="h-8 w-8 text-purple-400 drop-shadow-[0_0_18px_rgba(168,85,247,.35)]" />
          <h1 className="site-title text-xl sm:text-2xl font-extrabold tracking-tight">
            AI Music Generator
          </h1>
        </div>
      </div>
    </header>
  );
};
