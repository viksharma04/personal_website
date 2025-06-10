import { useRef, useState, useEffect } from 'react';

export default function Terminal() {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const predefinedTexts: Record<string, string> = {
    about: 'Hi, I am JarJarBinkus, a passionate developer who loves building creative web experiences.\n',
    projects: 'Projects:\n- Personal Website\n- 3D Portfolio\n- Open Source Contributions\n',
    contact: 'Contact me at: jarjarbinkus@email.com\n',
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
      typingTimeout.current = setTimeout(() => streamText(text, idx + 1), 18);
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
      className="w-[300px] h-[151px] bg-gray-900 border-2 border-gray-900 rounded-[7px] font-terminal flicker scanlines p-1 text-[13px] text-green-500 shadow-[0_0_5px_#00FF00] flex flex-col"
      tabIndex={0}
    >
      <div>
        <span className="text-green-500 drop-shadow-[0_0_0.6px_#00FF00]">$</span> <span className='drop-shadow-[0_0_0.6px_#00FF00]'>Welcome to my terminal</span>
      </div>
      <div className="flex gap-4 mb-1">
        <button
          onClick={() => { if (!isTyping) setDisplayedText(''); }}
          className="hover:underline cursor-pointer text-green-500 drop-shadow-[0_0_0.6px_#00FF00] bg-transparent border-none p-0"
          disabled={isTyping}
        >
          {'>'} home
        </button>
        <button
          onClick={() => handleLinkClick('about')}
          className="hover:underline cursor-pointer text-green-500 drop-shadow-[0_0_0.6px_#00FF00] bg-transparent border-none p-0"
          disabled={isTyping}
        >
          {'>'} about
        </button>
        <button
          onClick={() => handleLinkClick('projects')}
          className="hover:underline cursor-pointer text-green-500 drop-shadow-[0_0_0.6px_#00FF00] bg-transparent border-none p-0"
          disabled={isTyping}
        >
          {'>'} projects
        </button>
        <button
          onClick={() => handleLinkClick('contact')}
          className="hover:underline cursor-pointer text-green-500 drop-shadow-[0_0_0.6px_#00FF00] bg-transparent border-none p-0"
          disabled={isTyping}
        >
          {'>'} contact
        </button>
      </div>
      <div className="flex-1 flex items-end whitespace-pre-wrap">
        <span className="text-green-500 drop-shadow-[0_0_0.6px_#00FF00]">&gt;</span>
        <span className="ml-2 text-green-500 drop-shadow-[0_0_0.6px_#00FF00]">
          {displayedText}
          {/* {isTyping && <span className="animate-pulse">_</span>} */}
        </span>
      </div>
    </div>
  );
}