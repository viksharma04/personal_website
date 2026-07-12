# Landing Page (Editorial Hub) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a lightweight editorial landing hub at `/`, and move the existing 3D experience to `/room`, entered via a CRT power-on transition.

**Architecture:** `/` becomes a static, no-3D landing page (`LandingHub`) composed in `app/page.tsx`, which drives an `EnterTransition` overlay that navigates to `/room`. The current 3D experience moves verbatim from `app/page.tsx` to `app/room/page.tsx`. Tests are Playwright E2E, run against an auto-started dev server.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, `next/font/google`, Framer Motion (already a dependency), Playwright.

## Global Constraints

Every task's requirements implicitly include these. Values are copied verbatim from the spec `docs/superpowers/specs/2026-07-12-landing-page-design.md`.

- **Routes:** `/` = landing hub; `/room` = 3D experience. `/terminal`, `/quotes`, `/cards`, `/homekey` unchanged.
- **Palette (landing only, applied inline so it does not leak to other pages):** Paper `#efe7db`, Ink `#241f1c`, Oxblood `#8b3a3a`, Muted `#5c534a`, Hairline `#d8cbb8`, Tan `#a98b6a`, Social underline `#c9b79c`, Button text `#f6efe6`, Nav text `#4a423b`, Footer copyright `#8a7f72`.
- **Fonts:** Add **Cormorant Garamond** via `next/font/google` (display, used for the headline). Reuse existing **Geist Sans** (`font-sans`) for nav/tagline/CTA/footer.
- **Exact copy:**
  - Eyebrow: `Welcome`
  - Headline: `Hello, I'm Vik.` ("Vik" in oxblood italic)
  - Tagline: `I work in tech, think a lot about markets and machine intelligence, and build strange little things on the web — for the joy of it.`
  - CTA: `Enter the room →`
  - Footer left: `© 2026 · a passion project`
  - Footer socials: `GitHub`, `LinkedIn`, `Email`
- **Social hrefs:** GitHub `https://github.com/viksharma04` (assumed from git config — confirm), LinkedIn `https://linkedin.com/in/vik-sharma-04`, Email `mailto:me@vik-sharma.com`.
- **Single viewport, no scroll** (consistent with `overflow:hidden` in `globals.css`).
- **Transition** respects `prefers-reduced-motion: reduce` (skip the flourish, quick fade, then navigate).

---

### Task 1: Move the 3D experience to `/room` + Playwright config

**Files:**
- Create: `playwright.config.ts`
- Create: `app/room/page.tsx`
- Modify: `app/terminal/page.tsx:67` (close link `/` → `/room`)
- Modify: `tests/browser.test.ts` (replace the interactive stub with a real test)

**Interfaces:**
- Consumes: existing `@/components/MainScene`, `WelcomeOverlay`, `InfoButton`, `QuotesButton` (unchanged).
- Produces: route `/room` rendering the 3D experience; Playwright config with `baseURL` `http://localhost:3000` and an auto-started dev server (relied on by all later test steps).

- [ ] **Step 1: Create the Playwright config**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 2: Replace the test stub with a failing `/room` test**

Replace the entire contents of `tests/browser.test.ts`:

```ts
import { test, expect } from '@playwright/test';

test('room route renders the 3D canvas', async ({ page }) => {
  await page.goto('/room');
  await expect(page).toHaveURL(/\/room$/);
  await expect(page.locator('canvas')).toBeAttached();
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx playwright test tests/browser.test.ts --project=chromium`
Expected: FAIL — `/room` returns Next.js 404, so no `canvas` is attached.

- [ ] **Step 4: Create the `/room` page (moved 3D experience)**

Create `app/room/page.tsx` — this is the current `app/page.tsx` body, with the first-visit localStorage key renamed `hasVisitedWebsite` → `hasVisitedRoom`:

```tsx
'use client';
import MainScene from "@/components/MainScene";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import InfoButton from "@/components/InfoButton";
import QuotesButton from "@/components/QuotesButton";
import { useState, useEffect } from "react";

export default function Room() {
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    // Show the how-to-explore overlay the first time someone enters the room
    const hasVisited = localStorage.getItem('hasVisitedRoom');
    if (!hasVisited) {
      setShowOverlay(true);
      localStorage.setItem('hasVisitedRoom', 'true');
    }
  }, []);

  const handleCloseOverlay = () => setShowOverlay(false);
  const handleShowInfo = () => setShowOverlay(true);

  return (
    <main className="w-full h-screen relative">
      <MainScene />
      <QuotesButton />
      <InfoButton onClick={handleShowInfo} />
      <WelcomeOverlay isVisible={showOverlay} onClose={handleCloseOverlay} />
    </main>
  );
}
```

- [ ] **Step 5: Point the terminal close button at `/room`**

In `app/terminal/page.tsx`, line 67, change the close link so the in-room monitor → terminal → back-to-room loop is preserved:

```tsx
// before
<Link href={'/'} className='cursor-pointer text-green-500 drop-shadow-[0_0_0.6px_#00FF00] px-4 md:scale-200'>
// after
<Link href={'/room'} className='cursor-pointer text-green-500 drop-shadow-[0_0_0.6px_#00FF00] px-4 md:scale-200'>
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx playwright test tests/browser.test.ts --project=chromium`
Expected: PASS — `/room` renders and a `canvas` is attached.
(Note: `app/page.tsx` still shows the 3D scene at this point; that is replaced in Task 2.)

- [ ] **Step 7: Commit**

```bash
git add playwright.config.ts app/room/page.tsx app/terminal/page.tsx tests/browser.test.ts
git commit -m "feat: move 3D experience to /room, add Playwright config"
```

---

### Task 2: Landing hub at `/`

**Files:**
- Modify: `app/layout.tsx` (add Cormorant Garamond font variable)
- Modify: `app/globals.css` (register `--font-display` theme token)
- Create: `components/LandingHub.tsx`
- Modify: `app/page.tsx` (replace 3D experience with the landing hub)
- Modify: `tests/browser.test.ts` (add landing tests)

**Interfaces:**
- Consumes: route `/room` (Task 1) — the CTA navigates here; `font-sans` (existing Geist token).
- Produces: `LandingHub({ onEnter }: { onEnter: () => void })` default export; Tailwind `font-display` utility (Cormorant Garamond); `/` renders the landing hub.

- [ ] **Step 1: Add failing landing tests**

Append to `tests/browser.test.ts` (keep the Task 1 test above):

```ts
test('landing hub renders identity, nav, and CTA at /', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /hello, i'm vik\./i })).toBeVisible();
  await expect(page.getByText('Welcome', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Terminal' })).toHaveAttribute('href', '/terminal');
  await expect(page.getByRole('link', { name: 'Quotes' })).toHaveAttribute('href', '/quotes');
  await expect(page.getByRole('button', { name: /enter the room/i })).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0); // no 3D on the landing
});

test('landing footer has the correct contact links', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Email' })).toHaveAttribute('href', 'mailto:me@vik-sharma.com');
  await expect(page.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', 'https://linkedin.com/in/vik-sharma-04');
  await expect(page.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/viksharma04');
});

test('clicking Enter the room navigates to /room', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /enter the room/i }).click();
  await expect(page).toHaveURL(/\/room$/);
});
```

- [ ] **Step 2: Run the new tests to verify they fail**

Run: `npx playwright test tests/browser.test.ts --project=chromium`
Expected: FAIL — `/` still renders the 3D scene (heading/nav/CTA absent; a `canvas` is present).

- [ ] **Step 3: Add the Cormorant Garamond font in the layout**

In `app/layout.tsx`, extend the font import and register the variable on `<body>`:

```tsx
// change the import line
import { Geist, Geist_Mono, VT323, Cormorant_Garamond } from "next/font/google";

// add this font definition alongside the others
const cormorant = Cormorant_Garamond({
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: "--font-cormorant",
});

// add ${cormorant.variable} to the body className:
// className={`${geistSans.variable} ${geistMono.variable} ${vt323.variable} ${cormorant.variable} antialiased`}
```

- [ ] **Step 4: Register the `font-display` token**

In `app/globals.css`, add one line inside the existing `@theme inline { … }` block:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --font-terminal: var(--font-vt323);
  --font-display: var(--font-cormorant);
}
```

- [ ] **Step 5: Create the `LandingHub` component**

Create `components/LandingHub.tsx`:

```tsx
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
```

- [ ] **Step 6: Replace `app/page.tsx` with the landing hub**

Replace the entire contents of `app/page.tsx` (the CTA navigates directly for now; the transition is added in Task 3):

```tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LandingHub from '@/components/LandingHub';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/room'); // warm the 3D route so entering is snappy
  }, [router]);

  return <LandingHub onEnter={() => router.push('/room')} />;
}
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npx playwright test tests/browser.test.ts --project=chromium`
Expected: PASS — all Task 1 and Task 2 tests green.

- [ ] **Step 8: Commit**

```bash
git add app/layout.tsx app/globals.css components/LandingHub.tsx app/page.tsx tests/browser.test.ts
git commit -m "feat: add editorial landing hub at /"
```

---

### Task 3: CRT power-on transition into the room

**Files:**
- Create: `components/EnterTransition.tsx`
- Modify: `app/page.tsx` (wire the transition between the CTA and navigation)
- Modify: `tests/browser.test.ts` (add transition + reduced-motion tests)

**Interfaces:**
- Consumes: `LandingHub` (`onEnter`), route `/room`, `framer-motion` (`motion`, `AnimatePresence`, `useReducedMotion`).
- Produces: `EnterTransition({ active, onComplete }: { active: boolean; onComplete: () => void })` default export, rendering an overlay with `data-testid="enter-transition"`.

- [ ] **Step 1: Add failing transition tests**

Append to `tests/browser.test.ts`:

```ts
test('entering the room plays the transition overlay then navigates', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /enter the room/i }).click();
  await expect(page.getByTestId('enter-transition')).toBeVisible();
  await expect(page).toHaveURL(/\/room$/);
});

test('reduced motion still enters the room', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: /enter the room/i }).click();
  await expect(page).toHaveURL(/\/room$/);
});
```

- [ ] **Step 2: Run to verify the overlay test fails**

Run: `npx playwright test tests/browser.test.ts --project=chromium`
Expected: FAIL — `getByTestId('enter-transition')` never appears (the CTA navigates instantly, no overlay).

- [ ] **Step 3: Create the `EnterTransition` component**

Create `components/EnterTransition.tsx`:

```tsx
'use client';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';

interface EnterTransitionProps {
  active: boolean;
  onComplete: () => void;
}

export default function EnterTransition({ active, onComplete }: EnterTransitionProps) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!active) return;
    // Total time before navigation: quick fade for reduced motion, full flourish otherwise.
    const total = prefersReduced ? 150 : 850;
    const id = setTimeout(onComplete, total);
    return () => clearTimeout(id);
  }, [active, prefersReduced, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          data-testid="enter-transition"
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: 'easeIn' }}
        >
          {!prefersReduced && (
            <motion.div
              className="h-[3px] rounded-full bg-[#eafff0]"
              style={{
                boxShadow:
                  '0 0 18px 5px rgba(120,255,170,0.75), 0 0 60px 12px rgba(80,255,140,0.35)',
              }}
              initial={{ width: '0%', opacity: 0 }}
              animate={{ width: ['0%', '12%', '78%'], opacity: [0, 1, 1, 0.85, 1] }}
              transition={{ delay: 0.28, duration: 0.5, ease: 'easeOut' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 4: Wire the transition into `app/page.tsx`**

Replace the entire contents of `app/page.tsx`:

```tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LandingHub from '@/components/LandingHub';
import EnterTransition from '@/components/EnterTransition';

export default function Home() {
  const router = useRouter();
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    router.prefetch('/room'); // warm the 3D route so entering is snappy
  }, [router]);

  return (
    <>
      <LandingHub onEnter={() => setEntering(true)} />
      <EnterTransition active={entering} onComplete={() => router.push('/room')} />
    </>
  );
}
```

- [ ] **Step 5: Run all tests to verify they pass**

Run: `npx playwright test tests/browser.test.ts --project=chromium`
Expected: PASS — all seven tests green (Task 1 + Task 2 + Task 3).

- [ ] **Step 6: Manual verification**

Run `npm run dev`, open `http://localhost:3000`, and confirm:
- The landing page loads instantly with **no** 3D canvas mounted.
- Clicking `Enter the room →` fades to black, plays the bright line/glow, then shows the working 3D room at `/room`.
- With OS "reduce motion" enabled, entering skips the flourish and still lands in the room.
- The warm palette does **not** appear on `/terminal`, `/quotes`, or `/room`.
- On a narrow viewport, the hero remains readable and the footer stacks.

- [ ] **Step 7: Commit**

```bash
git add components/EnterTransition.tsx app/page.tsx tests/browser.test.ts
git commit -m "feat: add CRT power-on transition when entering the room"
```

---

## Self-Review

**Spec coverage:**
- Routing (`/` hub, `/room` experience, terminal close → `/room`) → Task 1 + Task 2.
- Editorial style tokens + Cormorant Garamond + Geist body → Task 2 (Steps 3–5).
- Page structure (centered nav, eyebrow, headline, tagline, CTA, footer) + exact copy → Task 2 (Step 5).
- Footer social hrefs → Task 2 (Step 1 test + Step 5).
- CRT power-on transition + reduced motion → Task 3.
- First-visit help overlay retained, key renamed → Task 1 (Step 4).
- Single viewport / palette scoped so it doesn't leak → Task 2 (inline colors) + Task 3 (Step 6 manual check).
- Responsive behavior → Task 2 (`clamp()` headline, `sm:flex-row` footer) + Task 3 (Step 6 manual check).
- Testing plan → Tasks 1–3 Playwright tests.

**Open question carried from spec:** GitHub handle assumed `viksharma04`; confirm before pushing.

No placeholders; types/props (`onEnter`, `active`/`onComplete`, `data-testid="enter-transition"`) are consistent across tasks.
