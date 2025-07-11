import Image from 'next/image';
import React from 'react'

const AboutSection = () => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start px-3 py-6 gap-6">
      {/* Left: Image */}
        <div className="flex-shrink-0 flex items-start w-auto aspect-square">
          <Image
          src="/pfp.jfif" // Replace with your image path
          alt="Profile"
          width={window.innerWidth*0.15}
          height={window.innerHeight*0.15}
          className=" rounded-full border-2 border-[#0f0] object-cover shadow-lg"
          style={{
            filter:
            'contrast(1.1) saturate(1.1) sepia(0.15) hue-rotate(-10deg) brightness(1.1) drop-shadow(2px 2px 0 #0f0)',
            imageRendering: 'pixelated',
          }}
          />
        </div>
      {/* Right: Text */}
      <div className="flex flex-col items-center text-center md:text-start md:items-start w-full">
        <span className='text-xs md:text-sm text-[#0f0]'>
          Hi, I&apos;m Vik :) <br />
          I work as a technology consultant at EY. <br />
          I graduated from the University of Illinois with a Master of Science in Finance. <br />
          <br />
          My interests include, in no particular order: <br />
          - Economics <br />
          - Public equity markets <br />
          - AI (specifically artificial consciousness) <br />
          - Machine learning (specifically quantitative trading) <br />
          - Poker <br />
          - F1 <br />
          - Assassin&apos;s Creed <br />
          - RPGs in general <br />
          - Web and App development <br />
          - Electronics and IoT <br />
          - Building PCs <br />
          - Whiskey <br />
          and much more... <br />
        </span>
      </div>
    </div>
  )
}

export default AboutSection