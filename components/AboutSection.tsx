'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react'

const AboutSection = () => {
  const [dimensions, setDimensions] = useState({ width: 150, height: 150 });

  useEffect(() => {
    const updateDimensions = () => {
      const size = Math.min(window.innerWidth * 0.12, 120);
      setDimensions({ width: size, height: size });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start px-4 py-4 gap-4 h-full overflow-y-auto">
      {/* Left: Image */}
      <div className="flex-shrink-0 flex items-start">
        <Image
          src="/pfp.jpg"
          alt="Profile"
          width={dimensions.width}
          height={dimensions.height}
          className="rounded-full border-2 border-[#0f0] object-cover shadow-lg"
          style={{
            filter:
              'contrast(1.1) saturate(1.1) sepia(0.15) hue-rotate(-10deg) brightness(1.1) drop-shadow(2px 2px 0 #0f0)',
            imageRendering: 'pixelated',
          }}
          priority
          unoptimized
          onError={(e) => {
            console.error('Image failed to load:', e);
          }}
        />
      </div>
      {/* Right: Text */}
      <div className="flex flex-col items-center text-center lg:text-start lg:items-start flex-1 min-w-0">
        <div className='text-xs sm:text-sm text-[#0f0] leading-relaxed'>
          <p className="mb-3">Hi, I&apos;m Vik :)</p>
          <p className="mb-3">I work as a technology consultant at EY and graduated from the University of Illinois with a Master of Science in Finance.</p>
          <p className="mb-2">My interests include:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
            <span>• Economics</span>
            <span>• Public equity markets</span>
            <span>• AI & consciousness</span>
            <span>• Quantitative trading</span>
            <span>• Poker & F1</span>
            <span>• Gaming (AC, RPGs)</span>
            <span>• Web development</span>
            <span>• Electronics & IoT</span>
            <span>• PC building</span>
            <span>• Whiskey</span>
          </div>
          <p className="mt-3 text-xs opacity-80">...and much more</p>
        </div>
      </div>
    </div>
  )
}

export default AboutSection