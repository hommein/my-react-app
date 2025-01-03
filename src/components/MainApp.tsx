import React, { useState, useEffect } from 'react';

interface MainAppProps {
  onSignOut: () => void;
  user?: { email: string | null };
}

const MainApp = ({ onSignOut, user }: MainAppProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [countdown, setCountdown] = useState(20);
  const [inputValue, setInputValue] = useState('');

  const logInput = async (input: string) => {
    try {
      const response = await fetch('/api/log-input', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input,
          userEmail: user?.email
        })
      });
      if (!response.ok) {
        throw new Error('Failed to log input');
      }
      const data = await response.json();
      console.log('Input logged successfully:', data);
    } catch (error) {
      console.error('Failed to log input:', error);
    }
  };

  useEffect(() => {
    let timer;
    if (isGenerating && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGenerating, countdown]);

  useEffect(() => {
    if (countdown === 0) {
      setIsGenerating(false);
      setTimeout(() => setCountdown(20), 500);
    }
  }, [countdown]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      setIsGenerating(true);
      logInput(inputValue.trim());
    }
  };

  const handleEnterClick = () => {
    if (inputValue.trim()) {
      setIsGenerating(true);
      logInput(inputValue.trim());
    }
  };

  return (
    <div className="h-screen bg-black flex flex-col" style={{ fontFamily: 'Roboto Mono, monospace' }}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black bg-opacity-80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <span className="text-xl text-white font-mono tracking-tight">
            <span className="text-gray-600">dream</span>cloud
          </span>
          <button 
            onClick={onSignOut}
            className="text-gray-500 hover:text-white transition-colors"
          >
            sign out
          </button>
        </div>
      </nav>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 max-w-5xl mx-auto px-4 flex flex-col justify-center items-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-medium text-white tracking-tight font-sans text-center">
            text
            <span className="text-gray-600">→</span>
            video
          </h1>
          
          <div className="w-full max-w-2xl">
            <input 
              type="text" 
              placeholder="describe..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isGenerating}
              className="w-full bg-transparent text-white p-4 rounded-none border-b border-gray-800 focus:border-gray-600 focus:outline-none text-center disabled:opacity-50"
            />
          </div>

          <div className={`text-gray-600 text-sm tracking-wide transition-opacity duration-500 ${isGenerating ? 'opacity-100' : 'opacity-0'}`}>
            {countdown}
          </div>
        </div>

        {/* Process Section */}
        <div className="border-t border-gray-900 max-w-5xl mx-auto w-full px-4">
          <div className="py-12 grid grid-cols-3 gap-12">
            <div className="space-y-3 text-center">
              <div className="text-gray-800 font-mono">01</div>
              <p className="text-gray-600 text-sm">describe</p>
            </div>
            <div className="space-y-3 text-center">
              <div className="text-gray-800 font-mono">02</div>
              <p className="text-gray-600 text-sm">generate</p>
            </div>
            <div className="space-y-3 text-center">
              <div className="text-gray-800 font-mono">03</div>
              <p className="text-gray-600 text-sm">create</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-end items-center">
          <button 
            className={`text-white text-sm hover:text-gray-400 transition-colors ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleEnterClick}
            disabled={isGenerating}
          >
            enter
          </button>
        </div>
      </footer>
    </div>
  );
};

export default MainApp;