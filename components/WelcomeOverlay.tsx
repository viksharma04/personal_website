'use client';
import React from 'react';
import { X, Move, Pointer, Navigation, Eye, ZoomIn } from 'lucide-react';
import TextPressure from './TextPressure';

// Note:
// Make sure the font you're using supports all the variable properties. 
// React Bits does not take responsibility for the fonts used

interface WelcomeOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Semi-transparent backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      
      {/* Main content container */}
      <div className="relative bg-black/80 backdrop-blur-md rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-green-500 hover:text-green-400 transition-colors bg-black/50 rounded-full p-2"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        
        <div className="p-6 sm:p-8 lg:p-12">
          {/* Welcome header */}
          <div className="text-center mb-8">
            <div className="relative h-20 sm:h-24 lg:h-32 mb-6">
              <TextPressure
                text="Hello!"
                flex={true}
                alpha={false}
                stroke={false}
                width={false}
                weight={true}
                italic={true}
                textColor="#22C55E"
                strokeColor="#fff111"
                minFontSize={32}
                maxFontSize={80}
              />
            </div>
            <p className="text-green-400 text-lg sm:text-xl font-mono">
              Welcome to my website
            </p>
          </div>

          {/* Instructions */}
          <div className="flex flex-col items-center space-y-6 text-center">
            <h3 className="text-green-500 font-mono font-bold text-xl mb-4 flex items-center justify-center">
              <Navigation className="mr-2" size={24} />
              How to Explore
            </h3>
            
            {/* 2x2 Grid of instruction cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 flex flex-col items-center space-y-3 hover:bg-green-900/30 transition-colors">
                <Move className="text-green-500" size={24} />
                <div className="text-center">
                  <p className="font-semibold text-green-300">Look Around</p>
                  <p className="text-green-400/80 text-sm">Click and drag to rotate the camera around the scene</p>
                </div>
              </div>
              
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 flex flex-col items-center space-y-3 hover:bg-green-900/30 transition-colors">
                <Pointer className="text-green-500" size={24} />
                <div className="text-center">
                  <p className="font-semibold text-green-300">Interactive Objects</p>
                  <p className="text-green-400/80 text-sm">Click on 3D objects to find hidden animations and content</p>
                </div>
              </div>
              
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 flex flex-col items-center space-y-3 hover:bg-green-900/30 transition-colors">
                <Eye className="text-green-500" size={24} />
                <div className="text-center">
                  <p className="font-semibold text-green-300">Look Out!</p>
                  <p className="text-green-400/80 text-sm">Explore different angles to find hidden details and easter eggs</p>
                </div>
              </div>
              
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 flex flex-col items-center space-y-3 hover:bg-green-900/30 transition-colors">
                <ZoomIn className="text-green-500" size={24} />
                <div className="text-center">
                  <p className="font-semibold text-green-300">Look Closer</p>
                  <p className="text-green-400/80 text-sm">Use scroll wheel or pinch to zoom in and out for different perspectives</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-8 pt-6 border-t border-green-500/20 text-center">
            <p className="text-green-400/60 text-xs mb-4 font-mono">
              Best experienced with sound enabled • Works on desktop and mobile
            </p>
            
            {/* Enter button */}
            <button
              onClick={onClose}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-black font-bold rounded-lg hover:from-green-500 hover:to-green-400 transition-all duration-100 font-mono text-lg transform hover:scale-101 hover:cursor-pointer"
            >
              Enter Experience
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeOverlay;