'use client';
import AboutSection from "@/components/AboutSection";
import ProjectSection from "@/components/ProjectSection";
import ContactSection from "@/components/ContactSection";
import DraggableWindow from '@/components/DraggableWindow';

import Link from "next/link";
import { CloseBox } from "@nsmr/pixelart-react";
import React, { useState } from "react";

export default function Terminal() {
  const [showAbout, setShowAbout] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // zIndex management
  const [zIndices, setZIndices] = useState<{about: number, projects: number, contact: number}>({about: 1, projects: 2, contact: 3});
  const [zCounter, setZCounter] = useState(3);

  const bringToFront = (section: 'about' | 'projects' | 'contact') => {
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
        <div className='py-6 text-md md:text-2xl flex'>
          <button
            className='cursor-pointer text-green-500 drop-shadow-[0_0_0.6px_#00FF00] hover:underline px-4 flicker bg-transparent border-none outline-none'
            style={{ background: "none" }}
            onClick={() => {
              setShowAbout(v => !v);
              bringToFront('about');
            }}
          >
            {">"} about
          </button>
          <button
            className='cursor-pointer text-green-500 drop-shadow-[0_0_0.6px_#00FF00] hover:underline px-4 flicker bg-transparent border-none outline-none'
            style={{ background: "none" }}
            onClick={() => {
              setShowProjects(v => !v);
              bringToFront('projects');
            }}
          >
            {">"} projects
          </button>
          <button
            className='cursor-pointer text-green-500 drop-shadow-[0_0_0.6px_#00FF00] hover:underline px-4 flicker bg-transparent border-none outline-none'
            style={{ background: "none" }}
            onClick={() => {
              setShowContact(v => !v);
              bringToFront('contact');
            }}
          >
            {">"} contact
          </button>
        </div>
        <Link href={'/'} className='cursor-pointer text-green-500 drop-shadow-[0_0_0.6px_#00FF00] px-4 md:scale-200'>
          <CloseBox size={24} className='hover:scale-120'/> 
        </Link>
      </div>
      {showAbout && (
        <DraggableWindow
          title="ABOUT.EXE"
          zIndex={zIndices.about}
          onFocus={() => bringToFront('about')}
          icon={<span className="bg-[#0f0] text-[#111] rounded w-3 h-3 inline-block mr-2" />}
          initialPos={{ x: window.innerWidth*0.02, y: window.innerHeight*0.1 }}
        >
          <AboutSection/>
        </DraggableWindow>
      )}
      {showProjects && (
        <DraggableWindow
          title="PROJECTS.EXE"
          zIndex={zIndices.projects}
          onFocus={() => bringToFront('projects')}
          icon={<span className="bg-[#0f0] text-[#111] rounded w-3 h-3 inline-block mr-2" />}
          initialPos={{ x: window.innerWidth*0.1, y: window.innerHeight*0.2 }}
        >
          <ProjectSection/>
        </DraggableWindow>
      )}
      {showContact && (
        <DraggableWindow
          title="CONTACT.EXE"
          zIndex={zIndices.contact}
          onFocus={() => bringToFront('contact')}
          icon={<span className="bg-[#0f0] text-[#111] rounded w-3 h-3 inline-block mr-2" />}
          initialPos={{ x: window.innerWidth*0.05, y: window.innerHeight*0.4 }}
        >
          <ContactSection/>
        </DraggableWindow>
      )}
    </main>
  );
}