
import React from 'react';

interface AudioPlayerProps {
  src: string;
  onReset: () => void;
}

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>
    </svg>
);

const ReplayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
    </svg>
);


export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, onReset }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6 text-center space-y-4">
      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-purple-500">
        Your Track is Ready!
      </h3>
      <audio controls src={src} className="w-full">
        Your browser does not support the audio element.
      </audio>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <a
          href={src}
          download="generated_music.mp3"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors duration-200"
        >
          <DownloadIcon className="w-5 h-5" />
          Download
        </a>
        <button
            onClick={onReset}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors duration-200"
        >
            <ReplayIcon className="w-5 h-5"/>
            Generate New
        </button>
      </div>
    </div>
  );
};
