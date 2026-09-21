'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Poem } from './page';

interface PoemsViewProps {
  poems: Poem[];
}

export default function PoemsView({ poems }: PoemsViewProps) {
  const [selected, setSelected] = useState(0);
  const poem = poems[selected];
  const listRef = useRef<HTMLUListElement>(null);

  // Keep the selected title centred in the mobile strip. Scrolling is clamped
  // by the browser, so the first/last titles just sit at the edges.
  useEffect(() => {
    const list = listRef.current;
    const item = list?.children[selected] as HTMLElement | undefined;
    if (!list || !item) return;
    const isStrip = getComputedStyle(list).flexDirection === 'row';
    if (!isStrip) return;
    const target = item.offsetLeft + item.offsetWidth / 2 - list.clientWidth / 2;
    list.scrollTo({ left: target, behavior: 'smooth' });
  }, [selected]);

  // ←/→ step through the poems; ignore when focus is in a text field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') setSelected((i) => Math.min(i + 1, poems.length - 1));
      if (e.key === 'ArrowLeft') setSelected((i) => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [poems.length]);

  return (
    <main className="h-screen overflow-y-auto bg-[#efe7db] text-[#241f1c]">
      {/* Back to landing — mirrors the landing nav's letter-spaced links */}
      <div className="mx-auto max-w-4xl px-6 pt-6">
        <Link
          href="/"
          className="font-sans text-xs uppercase tracking-[0.18em] text-[#4a423b] hover:text-[#8b3a3a] transition-colors"
        >
          ← Home
        </Link>
      </div>

      <div className="mx-auto max-w-4xl px-6 pt-12 pb-24">
        <p className="font-sans text-[11px] uppercase tracking-[0.36em] text-[#a98b6a] mb-12">
          Things I return to
        </p>

        <h2 className="font-display leading-none text-[clamp(2.5rem,8vw,4rem)] text-[#8b3a3a] mb-10">
          Poems
        </h2>

        {poems.length === 0 ? (
          <p className="font-sans text-[15px] text-[#5c534a]">No poems yet.</p>
        ) : (
          <div className="grid min-w-0 gap-8 sm:grid-cols-[14rem_1fr] sm:gap-12">
            {/* Title list — a horizontal strip of pills on mobile that keeps
                the selected one centred (fade on the right hints at more), a
                column on wider screens. min-w-0 keeps the strip from
                stretching the grid and making the whole page scroll. */}
            <nav aria-label="Poems" className="relative min-w-0">
              <ul ref={listRef} className="flex gap-2 overflow-x-auto pb-2 pr-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-col sm:gap-0 sm:overflow-visible sm:pb-0 sm:pr-0 sm:border-y sm:border-[#d8cbb8] sm:divide-y sm:divide-[#d8cbb8]">
                {poems.map((p, i) => {
                  const active = i === selected;
                  return (
                    <li key={p.title + i} className="shrink-0 sm:shrink">
                      <button
                        type="button"
                        onClick={() => setSelected(i)}
                        aria-current={active ? 'true' : undefined}
                        className={`group relative block max-w-[16rem] sm:max-w-none w-full text-left cursor-pointer transition-colors rounded-full border px-4 py-2 sm:rounded-none sm:border-0 sm:px-0 sm:py-4 sm:pl-4 ${
                          active
                            ? 'text-[#8b3a3a] border-[#8b3a3a] sm:bg-transparent'
                            : 'text-[#5c534a] border-[#d8cbb8] hover:text-[#241f1c]'
                        }`}
                      >
                        <span
                          aria-hidden
                          className={`hidden sm:block absolute inset-y-4 left-0 w-[2px] bg-[#8b3a3a] transition-opacity duration-300 ${
                            active ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                          }`}
                        />
                        <span className="block font-display text-base sm:text-xl leading-tight truncate sm:whitespace-normal">
                          {p.title}
                        </span>
                        {p.author && (
                          <span className="hidden sm:block font-sans text-[11px] uppercase tracking-[0.18em] text-[#a98b6a] mt-1">
                            {p.author}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#efe7db] to-transparent sm:hidden"
              />
            </nav>

            {/* The poem — key on the index so the fade re-runs on switch */}
            <article key={selected} data-testid="poem" className="animate-[fadeIn_300ms_ease-out]">
              <h3 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-[#241f1c]">
                {poem.title}
              </h3>
              {poem.author && (
                <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#a98b6a] mt-2 mb-8">
                  {poem.author}
                </p>
              )}
              <div className="space-y-6">
                {poem.stanzas.map((stanza, si) => (
                  <p
                    key={si}
                    className="font-display text-[clamp(1.2rem,2.6vw,1.5rem)] leading-relaxed text-[#3d3530] whitespace-pre-line"
                  >
                    {stanza.join('\n')}
                  </p>
                ))}
              </div>
            </article>
          </div>
        )}
      </div>
    </main>
  );
}
