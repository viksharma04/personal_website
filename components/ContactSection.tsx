import DraggableWindow from './DraggableWindow';
import React from 'react';

type ContactSectionProps = React.ComponentProps<typeof DraggableWindow>;

const ContactSection: React.FC<ContactSectionProps> = (props) => (
  <DraggableWindow
    icon={<span className="bg-[#0f0] text-[#111] rounded w-3 h-3 inline-block mr-2" />}
    initialPos={{ x: window.innerWidth*0.1, y: window.innerHeight*0.1 }}
    {...props}
  >
    <div className="flex flex-row items-start px-3 py-6 gap-6">
      <span className='text-md md:text-2xl text-[#0f0]'>Contact me@vik-sharma.com</span>
    </div>
  </DraggableWindow>
);

export default ContactSection;