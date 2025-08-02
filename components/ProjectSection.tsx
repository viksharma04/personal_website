import React from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const ProjectSection = () => {
  const projects = [
    {
      title: "Personal Website",
      description: "Interactive 3D portfolio with retro terminal interface",
      tech: ["Next.js", "Three.js", "TypeScript"],
      github: "#",
      demo: "#"
    },
    {
      title: "Trading Algorithm",
      description: "Quantitative trading system using machine learning",
      tech: ["Python", "Pandas", "Scikit-learn"],
      github: "#",
      demo: null
    },
    {
      title: "IoT Dashboard",
      description: "Real-time monitoring system for smart home devices",
      tech: ["React", "Node.js", "MongoDB"],
      github: "#",
      demo: "#"
    }
  ];

  return (
    <div className="px-4 py-4 h-full overflow-y-auto">
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div key={index} className="border border-[#0f0] bg-[#111] p-3 rounded">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-bold text-[#0f0] tracking-wider">
                {project.title}
              </h3>
              <div className="flex gap-2">
                {project.github && (
                  <a
                    href={project.github}
                    className="text-[#0f0] hover:text-[#0a0] transition-colors"
                    aria-label="GitHub"
                  >
                    <FaGithub size={16} />
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    className="text-[#0f0] hover:text-[#0a0] transition-colors"
                    aria-label="Demo"
                  >
                    <FaExternalLinkAlt size={14} />
                  </a>
                )}
              </div>
            </div>
            <p className="text-xs text-[#0f0] mb-2 leading-relaxed">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {project.tech.map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className="text-xs bg-[#0f0] text-[#111] px-2 py-1 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectSection