import React from 'react';
import { MdEmail } from 'react-icons/md';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';

const iconClass =
  "w-8 h-8 p-1 flex items-center justify-center text-center align-center rounded bg-[#111] border border-[#0f0] text-[#0f0] hover:bg-[#0f0] hover:text-[#111] transition-colors";

const ContactSection = () => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-6 gap-6 h-full">
      <div className="text-center">
        <h3 className="text-sm font-bold text-[#0f0] mb-4 tracking-wider">GET IN TOUCH</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-[#0f0]">Email:</span>
            <a 
              href="mailto:me@vik-sharma.com" 
              className="text-xs text-[#0f0] hover:text-[#0a0] underline transition-colors"
            >
              me@vik-sharma.com
            </a>
          </div>
        </div>
      </div>
      
      <div className="flex flex-row gap-4 justify-center">
        <a 
          href="mailto:me@vik-sharma.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={iconClass} 
          aria-label="Email"
        >
          <MdEmail size={20} />
        </a>
        <a 
          href="https://linkedin.com/in/vik-sharma-04" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={iconClass} 
          aria-label="LinkedIn"
        >
          <FaLinkedin size={20} />
        </a>
        <a 
          href="https://instagram.com/justlikevik" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={iconClass} 
          aria-label="Instagram"
        >
          <FaInstagram size={20} />
        </a>
      </div>
      
      <div className="text-center">
        <p className="text-xs text-[#0f0] opacity-80 leading-relaxed">
          Feel free to reach out for collaborations,<br />
          opportunities, or just to say hello!
        </p>
      </div>
    </div>
  )
}

export default ContactSection