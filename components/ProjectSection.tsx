import DraggableWindow from './DraggableWindow';
import React from 'react';

type ProjectSectionProps = React.ComponentProps<typeof DraggableWindow>;

const ProjectSection: React.FC<ProjectSectionProps> = (props) => (
  <DraggableWindow
    icon={<span className="bg-[#0f0] text-[#111] rounded w-3 h-3 inline-block mr-2" />}
    initialPos={{ x: window.innerWidth*0.1, y: window.innerHeight*0.3 }}
    {...props}
  >
    <div className="flex flex-row items-start px-3 py-6 gap-6">
      <ul className="text-xs md:text-sm text-[#0f0]">
        <li className="py-2">Got through 8th grade</li>
        <li className="py-2">Stayed alive for 25 years and still going</li>
        <li className="py-2">Went to a college</li>
        <li className="py-2">And more...</li>
      </ul>
    </div>
  </DraggableWindow>
);

export default ProjectSection;