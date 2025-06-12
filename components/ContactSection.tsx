import DraggableWindow from './DraggableWindow';
import React from 'react';
import { MdEmail } from 'react-icons/md';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';

type ContactSectionProps = React.ComponentProps<typeof DraggableWindow>;

const iconClass =
  "w-8 h-8 p-1 flex items-center justify-center text-center align-center rounded bg-[#111] border border-[#0f0] text-[#0f0] hover:bg-[#0f0] hover:text-[#111] transition-colors";

const ContactSection: React.FC<ContactSectionProps> = (props) => (
  <DraggableWindow
    icon={<span className="bg-[#0f0] text-[#111] rounded w-3 h-3 inline-block mr-2" />}
    initialPos={{ x: window.innerWidth*0.1, y: window.innerHeight*0.1 }}
    {...props}
  >
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
  </DraggableWindow>
);

export default ContactSection;