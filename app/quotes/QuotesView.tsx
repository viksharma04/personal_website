import Link from 'next/link';

interface QuotesViewProps {
  principles: { name: string; description: string }[];
  quotes: string[];
}

// The source quotes are wrapped in straight double quotes; drop the outer pair
// so the typography, not stray glyphs, carries the quotation.
function stripWrappingQuotes(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length >= 2 && trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export default function QuotesView({ principles, quotes }: QuotesViewProps) {
  return (
    <main className="h-screen overflow-y-auto bg-[#efe7db] text-[#241f1c]">
      {/* Back to landing — mirrors the landing nav's letter-spaced links */}
      <div className="mx-auto max-w-3xl px-6 pt-6">
        <Link
          href="/"
          className="font-sans text-xs uppercase tracking-[0.18em] text-[#4a423b] hover:text-[#8b3a3a] transition-colors"
        >
          ← Home
        </Link>
      </div>

      <div className="mx-auto max-w-3xl px-6 pt-12 pb-24">
        <p className="font-sans text-[11px] uppercase tracking-[0.36em] text-[#a98b6a] mb-12">
          Things I return to
        </p>

        {/* Principles — an editorial definition list */}
        <section className="mb-20">
          <h2 className="font-display leading-none text-[clamp(2.5rem,8vw,4rem)] text-[#8b3a3a] mb-8">
            Principles
          </h2>
          <dl className="border-y border-[#d8cbb8] divide-y divide-[#d8cbb8]">
            {principles.map((p) => (
              <div
                key={p.name}
                className="grid gap-1 py-5 sm:grid-cols-[14rem_1fr] sm:gap-8"
              >
                <dt className="font-display text-2xl leading-tight text-[#241f1c]">
                  {p.name}
                </dt>
                <dd className="font-sans text-[15px] leading-relaxed text-[#5c534a] sm:pt-1.5">
                  {p.description}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Quotes — serif pull-quotes with a quiet maroon hover accent */}
        <section>
          <h2 className="font-display leading-none text-[clamp(2.5rem,8vw,4rem)] text-[#8b3a3a] mb-8">
            Quotes
          </h2>
          <ul className="divide-y divide-[#d8cbb8]">
            {quotes.map((quote, index) => (
              <li key={index} className="group py-8">
                <blockquote className="relative pl-5">
                  <span
                    aria-hidden
                    className="absolute inset-y-1 left-0 w-[2px] bg-[#8b3a3a] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <p className="font-display italic leading-snug text-[clamp(1.35rem,3.5vw,1.9rem)] text-[#5c534a] transition-colors duration-300 group-hover:text-[#241f1c]">
                    {stripWrappingQuotes(quote)}
                  </p>
                </blockquote>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
