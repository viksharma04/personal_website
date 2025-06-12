import React from 'react';
import { MdEmail } from 'react-icons/md';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';

const iconClass =
  "w-8 h-8 p-1 flex items-center justify-center text-center align-center rounded bg-[#111] border border-[#0f0] text-[#0f0] hover:bg-[#0f0] hover:text-[#111] transition-colors";

const ContactSection = () => {
  return (
    <div className="flex flex-col items-start px-3 py-6 gap-6">
      <span className='text-xs md:text-sm text-[#0f0]'>Email: me@vik-sharma.com</span>
      <div className="flex flex-row gap-4">
        <a href="mailto:me@vik-sharma.com" target="_blank" rel="noopener noreferrer" className={iconClass} aria-label="Email">
          <MdEmail size={24} />
        </a>
        <a href="https://linkedin.com/in/vik-sharma-04" target="_blank" rel="noopener noreferrer" className={iconClass} aria-label="LinkedIn">
          <FaLinkedin size={24} />
        </a>
        <a href="https://instagram.com/justlikevik" target="_blank" rel="noopener noreferrer" className={iconClass} aria-label="Instagram">
          <FaInstagram size={24} />
        </a>
      </div>
    </div>
  )
}

export default ContactSection