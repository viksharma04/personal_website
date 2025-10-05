'use client';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface QuotesClientProps {
  principles: { name: string; description: string }[];
  quotes: string[];
}

export default function QuotesClient({ principles, quotes }: QuotesClientProps) {
  const [activeQuote, setActiveQuote] = useState<number | null>(null);
  const [activePrinciple, setActivePrinciple] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ [key: number]: string }>({});
  const principleRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const calculatePositions = () => {
      const positions: { [key: number]: string } = {};
      principleRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const tooltipWidth = 280; // Approximate tooltip width
          const screenWidth = window.innerWidth;
          const center = rect.left + rect.width / 2;

          // Check if centered tooltip would overflow left
          if (center - tooltipWidth / 2 < 16) {
            positions[index] = 'left-0';
          }
          // Check if centered tooltip would overflow right
          else if (center + tooltipWidth / 2 > screenWidth - 16) {
            positions[index] = 'right-0';
          }
          // Default centered
          else {
            positions[index] = 'left-1/2 -translate-x-1/2';
          }
        }
      });
      setTooltipPosition(positions);
    };

    calculatePositions();
    window.addEventListener('resize', calculatePositions);
    return () => window.removeEventListener('resize', calculatePositions);
  }, [principles]);

  return (
    <main className="min-h-screen h-screen overflow-y-auto bg-gradient-to-b from-gray-900 to-black py-16 px-8">
      {/* Close button */}
      <Link
        href="/"
        className="fixed top-4 right-4 z-40 w-12 h-12 bg-black bg-opacity-70 hover:cursor-pointer rounded-full flex items-center justify-center text-green-500 hover:text-green-400 hover:border-green-400 transition-colors backdrop-blur-sm"
        aria-label="Back to home"
      >
        <X size={20} />
      </Link>

      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <h1 className="text-5xl font-bold text-center mb-12 font-serif text-gray-100">
          Quotes I Like
        </h1>

        {/* Principles Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 font-serif text-gray-200">
            Principles
          </h2>
          <div className="flex flex-wrap gap-3">
            {principles.map((principle, index) => (
              <span
                key={index}
                ref={(el) => { principleRefs.current[index] = el; }}
                className={`px-6 py-3 bg-gray-800/50 border border-gray-700 rounded-full font-serif text-lg transition-all relative group cursor-help ${
                  activePrinciple === index
                    ? 'bg-gray-700/50 text-yellow-200 text-xl'
                    : 'text-gray-300'
                }`}
                onMouseEnter={() => setActivePrinciple(index)}
                onMouseLeave={() => setActivePrinciple(null)}
                onTouchStart={() => setActivePrinciple(index)}
                onTouchEnd={() => setTimeout(() => setActivePrinciple(null), 2000)}
              >
                {principle.name}
                <span className={`absolute bottom-full ${tooltipPosition[index] || 'left-1/2 -translate-x-1/2'} mb-2 px-4 py-2 bg-gray-900 border border-gray-600 rounded-2xl text-sm text-gray-200 text-center transition-opacity pointer-events-none w-max max-w-[90vw] sm:max-w-md ${
                  activePrinciple === index ? 'opacity-100' : 'opacity-0'
                }`}>
                  {principle.description}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Quotes Section */}
        <div className="space-y-6">
          {quotes.map((quote, index) => (
            <div
              key={index}
              className={`p-6 bg-gray-800/30 border border-gray-700/50 rounded-lg transition-all duration-200 group ${
                activeQuote === index ? 'bg-gray-800/40 border-gray-600/50' : ''
              }`}
              onMouseEnter={() => setActiveQuote(index)}
              onMouseLeave={() => setActiveQuote(null)}
              onTouchStart={() => setActiveQuote(index)}
              onTouchEnd={() => setTimeout(() => setActiveQuote(null), 1000)}
            >
              <p className={`leading-relaxed font-serif transition-all duration-200 ${
                activeQuote === index ? 'text-2xl text-yellow-200' : 'text-xl text-gray-300'
              }`}>
                {quote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
