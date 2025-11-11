
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
    <div className="bg-black min-h-screen text-white flex flex-col font-sans antialiased relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse delay-100"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-200"></div>
      </div>
      
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        {/* Hero Section - Only show when idle */}
        {status === 'idle' && !file && (
          <div className="w-full max-w-4xl mx-auto text-center mb-8 space-y-6">
            <div className="relative inline-block">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 animate-gradient">
                  Transform Vocals
                </span>
                <br />
                <span className="text-white">into Full Tracks</span>
              </h2>
              <div className="absolute -top-8 -right-8 text-4xl animate-bounce">✨</div>
            </div>
            
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              Upload your isolated vocal track and let AI create professional-quality music around it
            </p>
            
            {/* Feature pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <div className="px-4 py-2 bg-purple-600/20 border border-purple-500/50 rounded-full text-sm text-purple-300 flex items-center space-x-2">
                <span>⚡</span>
                <span>AI-Powered</span>
              </div>
              <div className="px-4 py-2 bg-pink-600/20 border border-pink-500/50 rounded-full text-sm text-pink-300 flex items-center space-x-2">
                <span>🎵</span>
                <span>Studio Quality</span>
              </div>
              <div className="px-4 py-2 bg-indigo-600/20 border border-indigo-500/50 rounded-full text-sm text-indigo-300 flex items-center space-x-2">
                <span>⚡</span>
                <span>Fast Generation</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="w-full max-w-2xl mx-auto bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-purple-500/10 overflow-hidden border border-gray-800 relative">
          {/* Decorative gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-indigo-600/20 rounded-2xl blur-xl"></div>
          
          <div className="relative p-6 sm:p-8">
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
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-full bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/50 rounded-xl p-4 mb-2">
                      <p className="text-sm text-center text-purple-300">
                        ✨ Ready to generate! Click the button below
                      </p>
                    </div>
                    <button
                      onClick={handleGenerateMusic}
                      className="group relative w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                      disabled={!file}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative flex items-center justify-center space-x-2">
                        <span>🎵</span>
                        <span>Generate Music</span>
                        <span>✨</span>
                      </span>
                    </button>
                  </div>
              )}

              {status === 'loading' && (
                <div className="flex flex-col items-center justify-center space-y-6">
                  {/* Prominent Status Banner */}
                  <div className="w-full bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-2 border-purple-500/60 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-center space-x-4 mb-3">
                      <Loader />
                      <div className="text-left">
                        <p className="text-xl font-bold text-purple-300">🎵 Generating Your Music...</p>
                        <p className="text-sm text-gray-400 mt-1">This can take up to 3 minutes</p>
                      </div>
                    </div>
                    
                    {/* Progress indicator */}
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
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
                          className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
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
                          className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md transition-colors"
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
                <div className="text-center p-6 bg-red-900/30 border-2 border-red-700/50 rounded-xl backdrop-blur-sm">
                  <div className="text-5xl mb-3">⚠️</div>
                  <p className="font-bold text-xl text-red-300">Generation Failed</p>
                  <p className="text-sm text-red-400 mt-2">{error}</p>
                   <button
                      onClick={handleReset}
                      className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Try Again
                    </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* How it Works Section - Only show when idle */}
        {status === 'idle' && (
          <div className="w-full max-w-4xl mx-auto mt-12 space-y-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              How It Works
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="group bg-gray-900/30 border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105">
                <div className="text-5xl mb-4 text-center group-hover:animate-bounce">📤</div>
                <div className="bg-purple-600/20 text-purple-300 text-xs font-bold px-3 py-1 rounded-full w-fit mx-auto mb-3">
                  STEP 1
                </div>
                <h4 className="text-lg font-bold text-white text-center mb-2">Upload Vocals</h4>
                <p className="text-sm text-gray-400 text-center">
                  Upload your isolated vocal track in MP3 or WAV format
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="group bg-gray-900/30 border border-gray-800 rounded-xl p-6 hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 hover:scale-105">
                <div className="text-5xl mb-4 text-center group-hover:animate-bounce">🤖</div>
                <div className="bg-pink-600/20 text-pink-300 text-xs font-bold px-3 py-1 rounded-full w-fit mx-auto mb-3">
                  STEP 2
                </div>
                <h4 className="text-lg font-bold text-white text-center mb-2">AI Processing</h4>
                <p className="text-sm text-gray-400 text-center">
                  Our AI analyzes your vocals and generates complementary music
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="group bg-gray-900/30 border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-105">
                <div className="text-5xl mb-4 text-center group-hover:animate-bounce">🎵</div>
                <div className="bg-indigo-600/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full w-fit mx-auto mb-3">
                  STEP 3
                </div>
                <h4 className="text-lg font-bold text-white text-center mb-2">Download Track</h4>
                <p className="text-sm text-gray-400 text-center">
                  Get your complete track with professional-quality instrumentals
                </p>
              </div>
            </div>
            
            {/* Stats/Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">AI</div>
                <div className="text-xs text-gray-400 mt-1">Powered</div>
              </div>
              <div className="bg-gradient-to-br from-pink-900/20 to-pink-800/20 border border-pink-600/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-pink-400">Studio</div>
                <div className="text-xs text-gray-400 mt-1">Quality</div>
              </div>
              <div className="bg-gradient-to-br from-indigo-900/20 to-indigo-800/20 border border-indigo-600/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-indigo-400">3 Min</div>
                <div className="text-xs text-gray-400 mt-1">Generation</div>
              </div>
              <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 border border-green-600/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">MP3</div>
                <div className="text-xs text-gray-400 mt-1">Download</div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="relative z-10 text-center p-6 border-t border-gray-800 bg-black/30 backdrop-blur-sm">
        <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} AI Music Generator. All Rights Reserved.</p>
        <p className="text-xs text-gray-600 mt-1">Powered by Advanced AI Technology</p>
      </footer>
    </div>
  );
};

export default App;
