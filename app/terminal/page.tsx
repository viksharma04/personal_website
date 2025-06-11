'use client';
import AboutSection from "@/components/AboutSection";
import Link from "next/link";
import { CloseBox } from "@nsmr/pixelart-react";
import React, { useState } from "react";

export default function Terminal() {
  const [showAbout, setShowAbout] = useState(false);
  // const [showProjects, setShowProjects] = useState(true);
  // const [showContact, setShowContact] = useState(true);

  return (
    <main className='bg-black border-2 border-green-500 font-terminal w-full h-screen scanlines p-2'>
      <div className='flex justify-between items-center'>
        <div className='py-6 text-xl md:text-4xl flex'>
          <button
            className='text-green-500 drop-shadow-[0_0_0.6px_#00FF00] hover:underline px-4 flicker bg-transparent border-none outline-none'
            style={{ background: "none" }}
            onClick={() => setShowAbout(v => !v)}
          >
            {">"} About
          </button>
          <button
            className='text-green-500 drop-shadow-[0_0_0.6px_#00FF00] hover:underline px-4 flicker bg-transparent border-none outline-none'
            style={{ background: "none" }}
            // onClick={() => setShowProjects(v => !v)}
          >
            {">"} Projects
          </button>
          <button
            className='text-green-500 drop-shadow-[0_0_0.6px_#00FF00] hover:underline px-4 flicker bg-transparent border-none outline-none'
            style={{ background: "none" }}
            // onClick={() => setShowContact(v => !v)}
          >
            {">"} Contact
          </button>
        </div>
        <Link href={'/'} className='cursor-pointer text-green-500 drop-shadow-[0_0_0.6px_#00FF00] px-4 md:scale-200'>
          <CloseBox size={24} className='hover:scale-120'/> 
        </Link>
      </div>
      {showAbout && <AboutSection />}
      {/* {showProjects && <ProjectsSection />} */}
      {/* {showContact && <ContactSection />} */}
    </main>
  );
}