'use client';
import Link from 'next/link';
import { Frame } from '@nsmr/pixelart-react';
import { useRef, useState, useEffect } from 'react';

export default function Terminal() {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const predefinedTexts: Record<string, string> = {
    about: "I'm a developer and quantitative trading enthusiast who loves building AI-powered solutions — from systematic trading strategies to cloud-deployed machine learning apps. My projects blend performance-focused Python, React, and cutting-edge financial research with a passion for tech",
    projects: "Projects: Explore my experiments in algorithmic trading, custom financial libraries, interactive 3D web experiences, and AI-powered assistants. Each project is a blend of code, data, and design — documented and open for feedback or collaboration",
    contact: 'Contact me at: me@vik-sharma.com\n',
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, []);

  const streamText = (text: string, idx = 0) => {
    if (idx <= text.length) {
      setDisplayedText(text.slice(0, idx));
      typingTimeout.current = setTimeout(() => streamText(text, idx + 1), 10);
    } else {
      setIsTyping(false);
    }
  };

  const handleLinkClick = (key: string) => {
    if (isTyping) return;
    setDisplayedText('');
    setIsTyping(true);
    streamText(predefinedTexts[key]);
  };

  return (
    <div
      className="w-[300px] h-[151px] bg-black border-1 overflow-hidden border-green-500 rounded-[7px] font-terminal flicker scanlines p-1 text-[13px] text-green-500 shadow-[0_0_5px_#00FF00] grid grid-rows-[auto_auto_1fr]"
      tabIndex={0}
    >
      <div className='flex justify-between'>
        <span className="text-green-500 drop-shadow-[0_0_0.6px_#00FF00] hover:jitter">
          $ Welcome to my terminal
        </span>
        <Link href={'/terminal'} className='hover:scale-120 cursor-pointer text-green-500 drop-shadow-[0_0_0.6px_#00FF00]'>
          <Frame size={24}/>       
        </Link>
      </div>
      <div className="flex gap-4 mb-1">
        <button
          onTouchStart={() => handleLinkClick('about')}
          onClick={() => handleLinkClick('about')}
          className="hover:underline cursor-pointer text-green-500 drop-shadow-[0_0_0.6px_#00FF00] bg-black/1 border-none p-0"
          disabled={isTyping}
        >
          {'>'} about
        </button>
        <button
          onTouchStart={() => handleLinkClick('projects')}
          onClick={() => handleLinkClick('projects')}
          className="hover:underline cursor-pointer text-green-500 drop-shadow-[0_0_0.6px_#00FF00] bg-black/1 border-none p-0"
          disabled={isTyping}
        >
          {'>'} projects
        </button>
        <button
          onTouchStart={() => handleLinkClick('contact')}
          onClick={() => handleLinkClick('contact')}
          className="hover:underline cursor-pointer text-green-500 drop-shadow-[0_0_0.6px_#00FF00] bg-black/1 border-none p-0"
          disabled={isTyping}
        >
          {'>'} contact
        </button>
      </div>
      <div className="flex-1 flex items-end whitespace-pre-wrap">
        <span className="text-green-500 drop-shadow-[0_0_0.6px_#00FF00]">&gt;</span>
        <span className="ml-2 text-green-500 drop-shadow-[0_0_0.6px_#00FF00] leading-tight">
          {displayedText}
          {/* {isTyping && <span className="animate-pulse">_</span>} */}
        </span>
      </div>
    </div>
  );
}