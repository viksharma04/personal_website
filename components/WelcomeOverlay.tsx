'use client';
import React from 'react';
import { X } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Semi-transparent backdrop */}
      <div className="absolute inset-0 bg-transparent backdrop-blur-sm -z-10" />
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-green-500 hover:text-green-400 transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        
        <div className='flex-col'>
          {/* Welcome text */}
          <div className="text-green-500 font-mono space-y-4">
            <div style={{position: 'relative', height: '300px'}}>
              <TextPressure
                text="Hello!"
                flex={true}
                alpha={false}
                stroke={false}
                width={true}
                weight={true}
                italic={true}
                textColor="#22C55E"
                strokeColor="#ff0000"
                minFontSize={18}
              />
            </div>
            <p className="text-sm leading-relaxed">
              Welcome to my website.
            </p>
            <p className="text-sm leading-relaxed">
              You're about to enter a 3D experience - feel free to look around and try clicking on objects.
            </p>
          </div>
          
          {/* Enter button */}
            <button
            onClick={onClose}
            className="mt-8 px-6 py-3 bg-green-500 text-black font-bold rounded hover:bg-green-400 hover:cursor-pointer transition-colors font-mono"
            >
            Enter!
            </button>
        </div>
      </div>
  );
};

export default WelcomeOverlay;