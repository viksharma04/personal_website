'use client';
import Link from 'next/link';

const NAV = [
  { label: 'Terminal', href: '/terminal' },
  { label: 'Quotes', href: '/quotes' },
];

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/viksharma04' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/vik-sharma-04' },
  { label: 'Email', href: 'mailto:me@vik-sharma.com' },
];

interface LandingHubProps {
  onEnter: () => void;
}

export default function LandingHub({ onEnter }: LandingHubProps) {
  return (
    <main className="w-full h-screen flex flex-col bg-[#efe7db] text-[#241f1c]">
      {/* Nav — centered, no logo */}
      <nav className="flex items-center justify-center gap-8 py-5 border-b border-[#d8cbb8]">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="font-sans text-xs uppercase tracking-[0.18em] text-[#4a423b] hover:text-[#8b3a3a] transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Hero — centered identity */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <p className="font-sans text-[11px] uppercase tracking-[0.36em] text-[#a98b6a] mb-6">
          Welcome
        </p>
        <h1 className="font-display leading-none text-[clamp(3rem,10vw,5.5rem)]">
          Hello, I&apos;m <em className="italic text-[#8b3a3a]">Vik</em>.
        </h1>
        <p className="font-sans text-[15px] leading-relaxed text-[#5c534a] max-w-xl mt-6">
          I work in tech, think a lot about markets and machine intelligence, and
          build strange little things on the web — for the joy of it.
        </p>
        <button
          type="button"
          onClick={onEnter}
          className="mt-8 font-sans text-xs uppercase tracking-[0.16em] bg-[#8b3a3a] text-[#f6efe6] px-7 py-4 rounded-[2px] hover:bg-[#7c3333] transition-colors cursor-pointer"
        >
          Enter the room →
        </button>
      </div>

      {/* Footer — contact/links */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 px-8 py-5 border-t border-[#d8cbb8]">
        <span className="font-sans text-xs text-[#8a7f72]">© 2026 · a passion project</span>
        <div className="flex gap-6">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="font-sans text-[13px] text-[#241f1c] border-b border-[#c9b79c] pb-[3px] hover:text-[#8b3a3a] transition-colors"
            >
              {s.label}
            </a>
          ))}
        </div>
      </footer>
    </main>
  );
}
