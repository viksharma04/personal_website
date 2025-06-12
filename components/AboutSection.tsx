import DraggableWindow from './DraggableWindow';
import Image from 'next/image';

type AboutSectionProps = React.ComponentProps<typeof DraggableWindow>;

const AboutSection: React.FC<AboutSectionProps> = (props) => (
  <DraggableWindow
    icon={<span className="bg-[#0f0] text-[#111] rounded w-3 h-3 inline-block mr-2" />}
    initialPos={{ x: window.innerWidth*0.01, y: window.innerHeight*0.05 }}
    {...props}
  >
    <div className="flex flex-col md:flex-row items-center md:items-start px-3 py-6 gap-6">
      {/* Left: Image */}
        <div className="flex-shrink-0 flex items-start w-1/4 aspect-square">
          <Image
          src="/pfp.jfif" // Replace with your image path
          alt="Profile"
          width={256}
          height={256}
          className="w-full h-full rounded-full border-2 border-[#0f0] object-cover shadow-lg"
          style={{
            filter:
            'contrast(1.1) saturate(1.1) sepia(0.15) hue-rotate(-10deg) brightness(1.1) drop-shadow(2px 2px 0 #0f0)',
            imageRendering: 'pixelated',
          }}
          />
        </div>
      {/* Right: Text */}
      <div className="flex flex-col items-center text-center w-full">
        <header className="text-xl md:text-3xl text-[#0f0] mb-2">
          Vik Sharma
        </header>
        <ul className="text-md md:text-2xl text-[#0f0]">
          <li className="py-2">I design and build AI-driven trading and research tools.</li>
          <li className="py-2">I love combining Python, React, and cloud tech to solve real-world problems.</li>
          <li className="py-2">I&apos;m passionate about quantitative finance, automation, and open-source projects.</li>
          <li className="py-2">I enjoy experimenting with 3D graphics and vintage computer aesthetics in web design.</li>
          <li className="py-2">Always learning, iterating, and sharing ideas with the community.</li>
        </ul>
      </div>
    </div>
  </DraggableWindow>
);

export default AboutSection;