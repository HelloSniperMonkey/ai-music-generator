
import React, { useState, useCallback, useRef } from 'react';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
}

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);

const AudioFileIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        viewBox="0 0 24 24" 
        fill="currentColor">
        <path d="M12,3V13.55A4,4,0,1,0,14,17V7H18V3M10,19A2,2,0,1,1,12,17,2,2,0,0,1,10,19Z" />
    </svg>
);

export const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'audio/mpeg' || file.type === 'audio/wav') {
        setSelectedFile(file);
        onFileChange(file);
      } else {
        alert("Please upload an MP3 or WAV file.");
      }
    }
  }, [onFileChange]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
       const file = e.target.files[0];
       setSelectedFile(file);
       onFileChange(file);
    }
  };
  
  const onButtonClick = () => {
    inputRef.current?.click();
  };
  
  const removeFile = () => {
    setSelectedFile(null);
    onFileChange(null);
    if(inputRef.current) {
        inputRef.current.value = "";
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`dropzone rounded-xl p-8 sm:p-12 text-center transition-all duration-300 card gradient-ring ${dragActive ? 'is-active scale-[1.02]' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        id="file-upload"
        className="hidden"
        accept=".mp3,.wav,audio/mpeg,audio/wav"
        onChange={handleChange}
      />
      
      {!selectedFile ? (
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center">
            <UploadIcon className="h-12 w-12 text-gray-500 drop-shadow-[0_0_12px_rgba(255,255,255,.12)]" />
            <p className="mt-4 font-semibold text-gray-200">
              Drag & drop your audio file here
            </p>
            <p className="mt-1 text-sm text-gray-500">or</p>
            <button
              type="button"
              onClick={onButtonClick}
              className="mt-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors underline decoration-dotted"
            >
              Click to browse
            </button>
            <p className="mt-4 text-xs text-gray-600">Supports: MP3, WAV</p>
          </div>
        </label>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4">
            <AudioFileIcon className="w-12 h-12 text-purple-400 drop-shadow-[0_0_16px_rgba(168,85,247,.35)]"/>
            <p className="font-medium text-white break-all max-w-full truncate">{selectedFile.name}</p>
            <p className="text-sm text-gray-400">
              ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
            <button
                onClick={removeFile}
                className="text-sm font-semibold text-pink-500 hover:text-pink-400 transition-colors underline decoration-dotted"
            >
                Change file
            </button>
        </div>
      )}
    </div>
  );
};
