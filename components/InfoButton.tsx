'use client';
import React from 'react';
import { Info } from 'lucide-react';

interface InfoButtonProps {
  onClick: () => void;
}

const InfoButton: React.FC<InfoButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-4 z-40 w-12 h-12 bg-black bg-opacity-70 border-2 border-green-500 rounded-full flex items-center justify-center text-green-500 hover:text-green-400 hover:border-green-400 transition-colors backdrop-blur-sm"
      aria-label="Show info"
    >
      <Info size={20} />
    </button>
  );
};

export default InfoButton;