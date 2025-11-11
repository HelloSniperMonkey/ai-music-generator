
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { Loader } from './components/Loader';
import { AudioPlayer } from './components/AudioPlayer';
import { MemoryGame } from './components/MemoryGame';
import { generateMusic } from './services/musicService';

type Status = 'idle' | 'loading' | 'success' | 'error';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showGame, setShowGame] = useState(false);
  const [showGameNotification, setShowGameNotification] = useState(false);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    setStatus('idle');
    setGeneratedAudioUrl(null);
    setError(null);
  };

  // Show game notification after 3 seconds of loading
  useEffect(() => {
    let notificationTimer: NodeJS.Timeout;
    
    if (status === 'loading') {
      notificationTimer = setTimeout(() => {
        setShowGameNotification(true);
      }, 3000);
    } else {
      setShowGameNotification(false);
      setShowGame(false);
    }
    
    return () => {
      if (notificationTimer) clearTimeout(notificationTimer);
    };
  }, [status]);

  const handleGenerateMusic = useCallback(async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setStatus('loading');
    setError(null);
    setGeneratedAudioUrl(null);

    try {
      const audioUrl = await generateMusic(file);
      setGeneratedAudioUrl(audioUrl);
      setStatus('success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setStatus('error');
    }
  }, [file]);
  
  const handleReset = () => {
    setFile(null);
    setStatus('idle');
    setGeneratedAudioUrl(null);
    setError(null);
    setShowGame(false);
    setShowGameNotification(false);
  };

  return (
    <div className="min-h-screen text-white flex flex-col font-sans antialiased">
      <Header />
      <main className="relative flex-grow flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl mx-auto card gradient-ring overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                Upload Your Vocals
              </h2>
              <p className="mt-2 text-gray-400 text-sm sm:text-base">
                Provide an MP3 or WAV file of an isolated vocal track.
              </p>
            </div>
            
            <div className="mt-8 space-y-6">
              {status !== 'loading' && !generatedAudioUrl && (
                <FileUpload onFileChange={handleFileChange} />
              )}
              
              {file && status !== 'loading' && !generatedAudioUrl && (
                  <div className="flex flex-col items-center">
                    <button
                      onClick={handleGenerateMusic}
                      className="btn w-full sm:w-auto"
                      disabled={!file}
                    >
                      Generate Music
                    </button>
                  </div>
              )}

              {status === 'loading' && (
                <div className="flex flex-col items-center justify-center space-y-6">
                  {/* Prominent Status Banner */}
                  <div className="w-full bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/40 rounded-xl p-6 backdrop-blur-md card">
                    <div className="flex items-center justify-center space-x-4 mb-3">
                      <Loader />
                      <div className="text-left">
                        <p className="text-xl font-bold text-purple-300">🎵 Generating Your Music...</p>
                        <p className="text-sm text-gray-400 mt-1">This can take up to 3 minutes</p>
                      </div>
                    </div>
                    
                    {/* Progress indicator */}
                    <div className="w-full bg-gray-800/70 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" style={{width:'100%'}}></div>
                    </div>
                  </div>

                  {/* Game Notification */}
                  {showGameNotification && !showGame && (
                    <div className="w-full bg-gradient-to-r from-pink-900/30 to-purple-900/30 border border-pink-500/50 rounded-xl p-4 animate-bounce">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">🎮</span>
                          <div>
                            <p className="font-semibold text-pink-300">While you wait...</p>
                            <p className="text-sm text-gray-400">Play a quick memory game!</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowGame(true)}
                          className="btn"
                        >
                          Play Game
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Memory Game */}
                  {showGame && (
                    <div className="w-full">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                          Memory Game
                        </h3>
                        <button
                          onClick={() => setShowGame(false)}
                          className="btn btn-ghost text-sm px-3 py-1"
                        >
                          Hide Game
                        </button>
                      </div>
                      <MemoryGame />
                    </div>
                  )}
                </div>
              )}

              {status === 'success' && generatedAudioUrl && (
                <AudioPlayer src={generatedAudioUrl} onReset={handleReset} />
              )}

              {status === 'error' && error && (
                <div className="text-center p-4 bg-red-900/40 border border-red-700/70 rounded-lg card">
                  <p className="font-semibold">Generation Failed</p>
                  <p className="text-sm text-red-300 mt-1">{error}</p>
                   <button
                      onClick={handleReset}
                      className="mt-4 btn btn-danger text-sm"
                    >
                      Try Again
                    </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <footer className="footer-bar text-center p-4 text-xs text-gray-400">
        <p>&copy; {new Date().getFullYear()} AI Music Generator. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;
