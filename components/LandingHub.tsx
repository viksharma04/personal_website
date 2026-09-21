'use client';
import Link from 'next/link';
import { useEffect, useRef, useState, type MouseEvent } from 'react';

const RETURN_LINKS = [
  { label: 'Quotes', href: '/quotes' },
  { label: 'Poems', href: '/poems' },
];

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/viksharma04' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/vik-sharma-04' },
  { label: 'Email', href: 'mailto:me@vik-sharma.com' },
];

interface LandingHubProps {
  /** Enter the room — plays the quick fade, then the room's loading bar. */
  onEnterRoom: () => void;
  /** Go to the terminal — plays the CRT power-on transition. */
  onEnterTerminal: () => void;
}

// Let modified clicks (open-in-new-tab, etc.) fall through to the browser;
// only intercept a plain left click to play the transition.
function isPlainClick(e: MouseEvent) {
  return !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) && e.button === 0;
}

// "Things I return to" groups the reading pages. Opens on hover for mouse users and on
// click/tap for touch and keyboard; closes on outside click, Escape, or mouse leave.
function WordsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={`font-sans text-xs uppercase tracking-[0.18em] transition-colors cursor-pointer ${
          open ? 'text-[#8b3a3a]' : 'text-[#4a423b] hover:text-[#8b3a3a]'
        }`}
      >
        Things I return to <span aria-hidden className="text-[9px]">▾</span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-10"
        >
          <ul className="min-w-[8rem] bg-[#efe7db] border border-[#d8cbb8] py-1">
            {RETURN_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  role="menuitem"
                  className="block px-4 py-2 font-sans text-xs uppercase tracking-[0.18em] text-[#4a423b] hover:text-[#8b3a3a] hover:bg-[#e6dccc] transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function LandingHub({ onEnterRoom, onEnterTerminal }: LandingHubProps) {
  return (
    <div className="w-full h-screen flex flex-col bg-[#efe7db] text-[#241f1c]">
      {/* Nav — centered, no logo */}
      <nav className="flex items-center justify-center gap-8 py-5 border-b border-[#d8cbb8]">
        <Link
          href="/terminal"
          onClick={(e) => {
            if (!isPlainClick(e)) return;
            e.preventDefault();
            onEnterTerminal();
          }}
          className="font-sans text-xs uppercase tracking-[0.18em] text-[#4a423b] hover:text-[#8b3a3a] transition-colors"
        >
          Terminal
        </Link>
        <WordsMenu />
      </nav>

      {/* Hero — centered identity */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
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
          onClick={onEnterRoom}
          className="mt-8 font-sans text-xs uppercase tracking-[0.16em] bg-[#8b3a3a] text-[#f6efe6] px-7 py-4 rounded-[2px] hover:bg-[#7c3333] transition-colors cursor-pointer"
        >
          Enter the room →
        </button>
      </main>

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
    </div>
  );
}
