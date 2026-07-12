'use client';
import AboutSection from "@/components/AboutSection";
import ProjectSection from "@/components/ProjectSection";
import ContactSection from "@/components/ContactSection";
import DraggableWindow from '@/components/DraggableWindow';
import SplashCursor from '@/components/SplashCursor'

import { useRouter } from "next/navigation";
import { CloseBox } from "@nsmr/pixelart-react";
import React, { useState } from "react";

export default function Terminal() {
  const router = useRouter();
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

  const handleClose = () => {
    if (typeof window === 'undefined') return;

    // The URL the document was originally loaded with. When the user
    // client-navigated into /terminal from another in-app page (the room,
    // the landing, etc.) this differs from the current path, so there is an
    // in-app page to return to. When /terminal was opened directly or
    // refreshed it equals /terminal, so we fall back to the room instead of
    // walking off the site with router.back().
    const [navEntry] = performance.getEntriesByType(
      'navigation'
    ) as PerformanceNavigationTiming[];
    const initialPath = navEntry
      ? new URL(navEntry.name).pathname
      : window.location.pathname;

    if (initialPath !== window.location.pathname) {
      router.back();
    } else {
      router.push('/room');
    }
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
        <button
          type='button'
          aria-label='Close terminal'
          onClick={handleClose}
          className='cursor-pointer text-green-500 drop-shadow-[0_0_0.6px_#00FF00] px-4 md:scale-200 bg-transparent border-none outline-none'
        >
          <CloseBox size={24} className='hover:scale-120'/>
        </button>
      </div>
      {showAbout && (
        <DraggableWindow
          title="ABOUT.EXE"
          zIndex={zIndices.about}
          onFocus={() => bringToFront('about')}
          icon={<span className="bg-[#0f0] text-[#111] rounded w-3 h-3 inline-block mr-2" />}
          initialPos={{ x: 20, y: 80 }}
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
          initialPos={{ x: 60, y: 120 }}
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
          initialPos={{ x: 100, y: 160 }}
        >
          <ContactSection/>
        </DraggableWindow>
      )}
      <SplashCursor />
    </main>
  );
}