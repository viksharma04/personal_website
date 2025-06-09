'use client';

import { Canvas } from '@react-three/fiber';
import ComputerScreen from './3d_models/ComputerScreen';
import ComputerDesk from './3d_models/ComputerDesk';
import { Html, OrbitControls } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';

export default function MainScene() {
  return (
    <Canvas 
      className="w-full h-screen" 
      camera={{ position: [0, 0.25, 1.2], fov: 75 }}
      style={{ background: 'white' }}
    >
      <OrbitControls
      minDistance={0.5}
      maxDistance={3}
      enablePan={false}
      enableZoom={true}
      enableRotate={true}
      target={[0, 0.25, 0]}
      minPolarAngle={Math.PI / 2 - 1}
      maxPolarAngle={Math.PI / 2 + 1}
      minAzimuthAngle={-2}
      maxAzimuthAngle={2}
      />
      <ambientLight intensity={1} />
      <spotLight
      position={[-1, 1, 0]}
      angle={0.8}
      penumbra={0.8}
      intensity={20}
      castShadow
      />
      <spotLight
      position={[1, 1, 0]}
      angle={0.8}
      penumbra={0.8}
      intensity={20}
      castShadow
      />
      <ComputerScreen />
      <ComputerDesk />
      <Html
        transform
        occlude="blending"
        position={ [0, 0.266, -0.045] }
        rotation={ [0, 0, 0] }
        center={ true }
        scale={ 0.1 }
        style={{background: 'black'}}
      >
        <Terminal />
      </Html>
      {/* x:red y:green z:blue */}
      <axesHelper position={[0, 0.25, 0]}/>
    </Canvas>
  );
}

function Terminal() {
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
      className="w-[300px] h-[151px] bg-gray-900 border-2 rounded-[7px] font-terminal flicker scanlines p-3 text-xs text-green-500 shadow-[0_0_5px_#00FF00] flex flex-col"
      tabIndex={0}
    >
      <div className="mb-2">
        <span className="text-green-500 drop-shadow-[0_0_1px_#00FF00]">$</span> <span className='drop-shadow-[0_0_1px_#00FF00]'>Welcome to my terminal</span>
      </div>
      <div className="flex gap-4 mb-2">
        <button
          onClick={() => handleLinkClick('about')}
          className="hover:underline cursor-pointer text-green-500 drop-shadow-[0_0_1px_#00FF00] bg-transparent border-none p-0"
          disabled={isTyping}
        >
          {'>'} about
        </button>
        <button
          onClick={() => handleLinkClick('projects')}
          className="hover:underline cursor-pointer text-green-500 drop-shadow-[0_0_1px_#00FF00] bg-transparent border-none p-0"
          disabled={isTyping}
        >
          {'>'} projects
        </button>
        <button
          onClick={() => handleLinkClick('contact')}
          className="hover:underline cursor-pointer text-green-500 drop-shadow-[0_0_1px_#00FF00] bg-transparent border-none p-0"
          disabled={isTyping}
        >
          {'>'} contact
        </button>
      </div>
      <div className="flex-1 flex items-end whitespace-pre-wrap">
        <span className="text-green-500 drop-shadow-[0_0_1px_#00FF00]">&gt;</span>
        <span className="ml-2">
          {displayedText}
          {isTyping && <span className="animate-pulse">_</span>}
        </span>
      </div>
    </div>
  );
}
