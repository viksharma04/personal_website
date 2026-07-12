# Landing Page Design — "The Editorial Hub"

- **Date:** 2026-07-12
- **Status:** Approved design, ready for implementation planning
- **Branch (planned):** `feat/landing-page`

## Overview

Today the site opens directly into the 3D room: `/` (`app/page.tsx`) immediately
renders `MainScene`, and "entering the experience" is just dismissing a first-visit
overlay layered on the already-loaded scene.

This change introduces a **lightweight landing hub** at `/` — a fast, clear front
page with many spokes — and makes the 3D experience a place you deliberately
**enter** at `/room`.

### Goals

- A fast, lightweight front door (no heavy 3D on first paint) that tells a visitor
  who Vik is and offers several ways to explore.
- Make the 3D room feel like a destination you step into, via a themed transition.
- Keep the hub simple, classic, and timeless.

### Non-goals (YAGNI)

- No CMS/config system for content — content is inline constants.
- No new pages beyond the landing hub and the moved room route.
- The `/cards` party game is intentionally **not** a spoke on the hub.
- No redesign of `/terminal`, `/quotes`, or the 3D scene itself.

## Aesthetic direction

A clean break from the site's retro-CRT/terminal-green identity: a **warm
editorial** look — cream paper, an elegant serif display, oxblood accent. The
light, quiet front door makes the dark, immersive 3D room feel like another world.

### Style tokens (scoped to the landing page only)

Applied on the landing container so the rest of the site keeps its dark theme and
is unaffected by the global `prefers-color-scheme` rules in `globals.css`.

| Token | Value | Use |
| --- | --- | --- |
| Paper | `#efe7db` | page background |
| Ink | `#241f1c` | primary text |
| Oxblood | `#8b3a3a` | accent: "Vik", CTA, hovers |
| Muted | `#5c534a` | tagline / secondary text |
| Hairline | `#d8cbb8` | nav underline, footer overline |
| Tan | `#a98b6a` | "WELCOME" eyebrow |
| Underline | `#c9b79c` | footer social underlines |
| Button text | `#f6efe6` | text on oxblood CTA |

### Fonts

- **Cormorant Garamond** (display) — added via `next/font/google` in `app/layout.tsx`,
  exposed as `--font-cormorant`. Used for the name/headline (with italic on "Vik").
- **Geist Sans** (already loaded) — reused for nav, tagline, CTA label, footer.

## Page structure

Single viewport, no scroll (consistent with the site's `overflow:hidden` on
`html, body`). Flex column filling the height:

```
┌───────────────────────────────────────────────┐
│                TERMINAL · QUOTES               │  ← nav (centered, no logo)
├───────────────────────────────────────────────┤
│                                                │
│                    WELCOME                     │  ← eyebrow
│               Hello, I'm *Vik*.                │  ← Cormorant, "Vik" oxblood italic
│      I work in tech, think a lot about ...     │  ← tagline (Geist, muted)
│                [ Enter the room → ]            │  ← oxblood CTA
│                                                │
├───────────────────────────────────────────────┤
│  © 2026 · a passion project   GitHub·LinkedIn·Email │  ← footer
└───────────────────────────────────────────────┘
```

### Exact copy

- Eyebrow: `Welcome`
- Headline: `Hello, I'm Vik.` — "Vik" rendered in oxblood italic
- Tagline: `I work in tech, think a lot about markets and machine intelligence, and build strange little things on the web — for the joy of it.`
- CTA: `Enter the room →`
- Footer left: `© 2026 · a passion project`
- Footer right: `GitHub` · `LinkedIn` · `Email`

### Nav & footer targets

| Label | Target |
| --- | --- |
| Terminal (nav) | `/terminal` |
| Quotes (nav) | `/quotes` |
| Enter the room (CTA) | `/room` (via transition) |
| GitHub (footer) | `https://github.com/viksharma04` — **confirm handle** |
| LinkedIn (footer) | `https://linkedin.com/in/vik-sharma-04` |
| Email (footer) | `mailto:me@vik-sharma.com` |

## Enter transition — CRT power-on

When the user clicks `Enter the room →`:

1. The paper hero fades to black (~250ms).
2. A **CRT power-on** flourish: a bright thin horizontal line expands from the
   vertical center outward, with a brief flicker/green glow (~400–600ms).
3. `router.push('/room')`; the room's existing `<Loader>` spinner covers model load.

Details:

- Implemented with **Framer Motion** (already a dependency).
- Total perceived transition ≈ 700–850ms before navigation.
- Respects `prefers-reduced-motion: reduce` → skip the flourish, do an instant or
  ~150ms fade, then navigate.
- The transition overlay is `position: fixed`, top z-index, and does not block the
  room once navigation completes.

## Routing changes

| Route | Before | After |
| --- | --- | --- |
| `/` | 3D experience (`MainScene` + overlay + buttons) | **Landing hub** |
| `/room` | — | 3D experience, moved verbatim |
| `/terminal` | close button → `/` | close button → `/room` (preserve monitor→terminal→room loop) |
| `/quotes` | back link → `/` | unchanged (returns to landing home) |
| `/cards`, `/homekey` | — | unchanged |

### Internal links to audit/update during implementation

- `app/terminal/page.tsx:67` — `<Link href={'/'}>` → change to `/room`.
- `app/quotes/QuotesClient.tsx:53` — `href="/"` → leave as-is (landing = home).
- `components/QuotesButton.tsx` and `components/InfoButton.tsx` — move with the room
  to `/room`; targets (`/quotes`) unchanged.
- `components/3d_models/TerminalScreen.tsx:84` — `router.push('/terminal')` unchanged.

## Component breakdown

Each unit has one clear purpose and a small interface.

### `app/page.tsx` (landing route)

- Client component. Composes `LandingHub` + `EnterTransition`.
- Holds `entering` state; `onEnter` starts the transition, whose completion calls
  `router.push('/room')`.
- **Depends on:** `LandingHub`, `EnterTransition`, `next/navigation`.

### `components/LandingHub.tsx`

- Presentational: nav, hero (eyebrow, headline, tagline, CTA), footer.
- **Props:** `onEnter: () => void`.
- Content constants (nav items, socials) live here (or a co-located `content.ts`).
- **Depends on:** `next/link`, fonts, style tokens.

### `components/EnterTransition.tsx`

- The CRT power-on overlay animation.
- **Props:** `active: boolean`, `onComplete: () => void`.
- Renders nothing (or a passthrough) when `active` is false; on activate, plays the
  Framer Motion sequence and calls `onComplete` when done. Honors reduced motion.
- **Depends on:** `framer-motion`.

### `app/room/page.tsx` (moved 3D experience)

- The current `app/page.tsx` body verbatim: `MainScene`, `WelcomeOverlay`
  (first-visit help), `InfoButton`, `QuotesButton`.
- First-visit `localStorage` gate retained; key renamed `hasVisitedWebsite` →
  `hasVisitedRoom` to reflect that it now gates the room's help overlay.

## Responsive behavior

- Headline sized with `clamp()` so it scales from mobile to desktop.
- Nav stays centered; wraps if needed.
- Footer: row on wide screens; stacks and centers on narrow screens.
- CTA remains comfortably tappable (min ~44px height).

## Accessibility

- Semantic landmarks: `<nav>`, `<main>`, `<footer>`; one `<h1>` (the headline).
- CTA is a real `<button>` that calls `onEnter` (the page is already a client
  component); keyboard-activatable and focus-visible.
- Color contrast: ink `#241f1c` on paper `#efe7db` and button text `#f6efe6` on
  oxblood `#8b3a3a` both meet WCAG AA for their text sizes.
- `prefers-reduced-motion` honored in the transition.

## Testing plan

Extend `tests/browser.test.ts` (Playwright, already configured):

- `/` renders the nav (`Terminal`, `Quotes`), the `Hello, I'm Vik.` headline, and
  the `Enter the room` CTA.
- Clicking `Enter the room` navigates to `/room` and the `<canvas>` is present.
- Nav `Terminal` → `/terminal`; nav `Quotes` → `/quotes`.
- Footer social links have correct `href`s (mailto + LinkedIn + GitHub).

## Open questions

- **GitHub handle** for the footer link — assumed `viksharma04` (from git config);
  confirm before shipping.

## Manual verification checklist

- `/` loads instantly with no 3D canvas mounted.
- Enter transition plays and lands in the working 3D room at `/room`.
- Reduced-motion setting skips the flourish.
- Landing palette does not leak into `/terminal`, `/quotes`, or `/room`.
- Mobile layout: hero readable, footer stacked, CTA tappable.

## Implementation notes (decisions made during build)

- **GitHub handle confirmed:** `viksharma04`.
- **QuotesButton removed from `/room`:** the floating quotes button no longer
  made sense inside the room once the landing hub became the entry point.
  Quotes is now reached only via the landing nav; `app/quotes` close still
  returns to `/`. The now-unused `components/QuotesButton.tsx` was deleted.
  (The room still shows `MainScene`, the first-visit help overlay, and
  `InfoButton`.)
- **Reduced-motion test scope:** the reduced-motion E2E test asserts
  navigation only. The flourish's presence is instead verified positively in
  the normal transition test (a `crt-line` test id must be visible); a
  sub-150ms "flourish is absent" assertion would be flaky, so it was
  deliberately not added.
