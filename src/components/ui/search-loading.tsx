import React, { useState, useEffect } from 'react';
import { CircularProgress } from './circular-progress';

interface SearchLoadingProps {
  duration?: number; // Duration in milliseconds
  onComplete?: () => void;
  message?: string;
}

const SearchLoading: React.FC<SearchLoadingProps> = ({
  duration = 5000,
  onComplete,
  message = "Searching opportunities..."
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 50); // Update every 50ms for smooth animation

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6">
        {/* Circular Progress */}
        <CircularProgress 
          percentage={progress} 
          size={140}
          strokeWidth={10}
        />
        
        {/* Loading Message */}
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">{message}</p>
          <p className="text-sm text-gray-500">
            Finding the best opportunities for you...
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 via-cyan-500 via-blue-500 via-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { SearchLoading };
