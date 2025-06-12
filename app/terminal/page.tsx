'use client';
import AboutSection from "@/components/AboutSection";
import ProjectSection from "@/components/ProjectSection";
import Link from "next/link";
import { CloseBox } from "@nsmr/pixelart-react";
import React, { useState } from "react";

export default function Terminal() {
  const [showAbout, setShowAbout] = useState(false);
  const [showProjects, setShowProjects] = useState(true);

  // zIndex management
  const [zIndices, setZIndices] = useState<{about: number, projects: number}>({about: 1, projects: 2});
  const [zCounter, setZCounter] = useState(3);

  const bringToFront = (section: 'about' | 'projects') => {
    setZIndices(prev => {
      const newZ = zCounter;
      setZCounter(zCounter + 1);
      return {
        ...prev,
        [section]: newZ,
      };
    });
  };

  return (
    <main className='bg-black border-2 border-green-500 font-terminal w-full h-screen scanlines p-2'>
      <div className='flex justify-between items-center'>
        <div className='py-6 text-xl md:text-4xl flex'>
          <button
            className='cursor-pointer text-green-500 drop-shadow-[0_0_0.6px_#00FF00] hover:underline px-4 flicker bg-transparent border-none outline-none'
            style={{ background: "none" }}
            onClick={() => setShowAbout(v => !v)}
          >
            {">"} about
          </button>
          <button
            className='cursor-pointer text-green-500 drop-shadow-[0_0_0.6px_#00FF00] hover:underline px-4 flicker bg-transparent border-none outline-none'
            style={{ background: "none" }}
            onClick={() => setShowProjects(v => !v)}
          >
            {">"} projects
          </button>
          <button
            className='cursor-pointer text-green-500 drop-shadow-[0_0_0.6px_#00FF00] hover:underline px-4 flicker bg-transparent border-none outline-none'
            style={{ background: "none" }}
            // onClick={() => setShowContact(v => !v)}
          >
            {">"} contact
          </button>
        </div>
        <Link href={'/'} className='cursor-pointer text-green-500 drop-shadow-[0_0_0.6px_#00FF00] px-4 md:scale-200'>
          <CloseBox size={24} className='hover:scale-120'/> 
        </Link>
      </div>
      {showAbout && (
        <AboutSection
          zIndex={zIndices.about}
          onFocus={() => bringToFront('about')}
        />
      )}
      {showProjects && (
        <ProjectSection
          zIndex={zIndices.projects}
          onFocus={() => bringToFront('projects')}
        />
      )}
      {/* {showContact && <ContactSection />} */}
    </main>
  );
}