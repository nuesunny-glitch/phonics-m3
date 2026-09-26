# DESIGN.md — English M.3 Permanent Design System

**Status: aspirational reference document.** This file defines the target
design system for the whole site. Creating this file does **not** change
any existing page — no HTML/CSS/JS was modified when this document was
written. Treat every rule below as the standard to apply the next time a
page is created or a design pass is done, not as a description of what's
already live everywhere today (see §10 "Current Implementation Gap" for
exactly where today's CSS falls short of these numbers).

This document is written so a future Claude session can read it alone and
know what to do — it does not assume you've read the rest of this
conversation. Where it references existing project structure, it points
to concrete file paths so you can go verify/edit the right place.

---

## 1. Audience

**Thai Gen Alpha students, ages 13–15 (มัธยมศึกษาปีที่ 3 / M.3), with weak
English foundations.** Every design decision in this document exists to
serve that audience specifically:

- They are native Thai readers learning English as a foreign language —
  Thai text is not a "secondary" language to shrink; it must be as large
  and readable as the English it explains.
- They are digital natives who expect app/game-like polish, not a printed
  textbook rendered as a webpage.
- Weak foundations means low tolerance for dense text, small type, or
  cognitive overload — minimal text per screen and large, unambiguous
  visual hierarchy are not aesthetic preferences here, they are
  accessibility requirements for this specific audience.
- Many will use this on a phone. Design mobile-first; desktop is the
  enhancement, not the baseline.

---

## 2. Core Design Principles

These twelve principles are the permanent contract. Every other section in
this document is a concrete implementation of one or more of these:

1. **Very large, highly readable typography.** See §3 for exact sizes.
2. **Bright, cheerful, child-friendly colors.** See §4.
3. **Cute mascots, illustrations, and visual cues.** Emoji-based by
   project convention (no image/icon pipeline exists) — see §6.
4. **Minimal text per screen.** One idea per card/screen. Short
   explanations (≤2 sentences where possible). Picture or mascot before
   text.
5. **Large buttons and touch targets.** Minimum comfortable tap target,
   generous padding — see §3 and §5.
6. **Generous spacing and white space.** Never cram unrelated ideas into
   one screen — see §5.
7. **Game-like learning experience.** Progress bars, stars, XP, streaks,
   confetti/celebration on success, encouraging (never harsh) feedback
   copy — see §8.
8. **English words and sentences must be visually prominent.** English is
   the subject being taught — it should read as the star of the screen,
   not an afterthought next to the Thai gloss.
9. **Thai explanations must also be large and readable.** Thai is the
   scaffolding that makes the English learnable — it gets the same
   readability standard as English, not a smaller "translation footnote"
   treatment.
10. **Mobile, tablet, and desktop responsive.** Mobile-first; see §7.
11. **Consistent design across lessons, games, quizzes, flashcards, and
    result screens.** One system, applied everywhere a student sees
    content — see §9 for how "one system" maps onto this project's
    multi-system technical architecture.
12. **Accessibility.** High contrast, visible focus states, readable line
    spacing, no tiny text, ever — see §11.

---

## 3. Typography System

All sizes below are the **target** scale for this project going forward.
Apply the desktop size at ≥900px viewport width, the mobile size below
that (align to whatever breakpoint the page's system already uses — see
§7 for the actual breakpoints in use).

| Role | Desktop | Mobile | Notes |
|---|---|---|---|
| Page title (H1) | 48–56px | 36–42px | One per screen. The lesson/game/chapter name. |
| Section title (H2) | 36–42px | 30–34px | Major subsections within a page. |
| English vocabulary (single word/short phrase) | 32–38px | 32–38px | Doesn't shrink on mobile — it's already the shortest text on screen. |
| English sentences (examples, quiz prompts) | 30–36px | 30–36px | Same reasoning — sentences are already short; don't shrink further. |
| Thai explanations | 24–30px | 24–30px | Equal priority to English body text — never smaller than this band. |
| Quiz choices | 28–32px | 28–32px | Choice button label text. |
| Buttons | 24–28px | 24–28px | Button label text (not counting padding — see §5 for touch target size). |
| Progress / helper / meta text | ≥18px | ≥18px | **Absolute floor.** Nothing on any screen, ever, should render below 18px — this includes badges, timestamps, footer text, "1/7" progress counters, and small print. |

**Font families**: keep the existing per-system pairing (don't invent a
new one) —
- System A (main course): `Poppins` (English) + `Kanit` (Thai), per
  `style.css` `--font-base`.
- System B (printable lessons) and Adventure games: `Kanit`/`Mali` for
  body/display, per each system's existing `@font-face`/Google Fonts
  `<link>`. Games may also use `Baloo 2` for extra-playful display text
  where already established.
- Don't introduce a fourth font family. If a new page needs a display
  font, reuse `Mali` (already the project's "fun/display" font) rather
  than adding something new.

**Line height**: minimum 1.4 for body/paragraph text, 1.5–1.75 preferred
for Thai body copy (Thai script benefits from extra line height more than
Latin script does — this project's existing `body { line-height: 1.75; }`
in `style.css` is a good default to keep).

---

## 4. Color System

**Principle: bright and cheerful, not corporate.** This project already
has two color languages in production — keep using them, don't invent a
third:

- **System A (main course, `style.css`)**: blue/white/soft-yellow brand
  (`--primary` #2563eb, `--accent-yellow` #fbbf24) plus teal/pink accent
  colors (`--accent-teal`, `--accent-pink`) added for extra warmth. This
  is the site's "app chrome" identity — topbar, sidebar, nav buttons.
- **System B (printable lessons) and every Adventure game**: a 6-color
  rainbow palette (`--c1` red, `--c2` orange, `--c3` blue, `--c4` green,
  `--c5` purple, `--c6` pink — exact hex values differ slightly per game
  folder but the 6-color rainbow *shape* is consistent). This is what
  satisfies "color-coded lesson categories" (principle 2.2) — a new
  lesson topic, quiz card, or game category should pick one of the six
  and use it consistently for that category's cards/badges/accents.

**Rules**:
- Reuse an existing palette. Don't design a new brand palette for a new
  page — pick System A's palette (app-shell pages) or the rainbow `--c1`–
  `--c6` palette (lesson-content pages), matching whichever system the
  new page belongs to.
- Backgrounds stay light (`#f4f8ff`-family blues, `#fff`, soft pastels).
  This is a bright-and-cheerful system, not a dark-mode-first one — System
  A's optional dark mode is a nice-to-have toggle, never the default.
  System B and the games do not need a dark mode.
- Contrast: every text/background pairing must clear **4.5:1** for normal
  text and **3:1** for large text (≥24px), per WCAG AA — see §11.

---

## 5. Spacing, Buttons, and Touch Targets

- **Minimum tap target**: 44×44px (iOS Human Interface Guidelines
  minimum) for any tappable control — icon buttons, close buttons, choice
  buttons. Prefer 48px+ where the layout allows.
- **Button padding**: generous — vertical padding roughly 1–1.3× the
  button's font-size, horizontal padding roughly 2× the vertical. A
  24–28px-label button should have noticeably more than a "just fits the
  text" box around it.
- **Card padding**: generous on all sides — never let content touch a
  card's edge. Prefer rounded, breathing-room-heavy cards over dense,
  bordered tables (see §6).
- **Gaps between interactive elements**: enough that a thumb can't
  mis-tap the wrong choice — err generous over compact, especially in
  choice grids (`.choice-grid`, `.choice-btn` patterns already used
  site-wide in the Adventure games and System B quizzes).
- **White space**: when in doubt, add more margin/padding, not less. A
  screen that feels "empty" is usually right for this audience; a screen
  that feels "full" is usually wrong.

---

## 6. Visual Style — Cards, Buttons, Navigation, Progress, Dialogs

**Reference direction**: use [shadcn/ui](https://ui.shadcn.com) and
[shadcn.io](https://shadcn.io) **only as visual inspiration** for the
patterns below — their rounded-corner, soft-shadow, clean-hierarchy
aesthetic is the *look* to aim for. This project does not and will not run
React or Tailwind (see §12 for why, and what "inspiration only" means in
practice for a vanilla HTML/CSS/JS codebase).

- **Cards**: rounded corners (16–24px radius — matches this project's
  existing `--radius`/`--radius-lg` custom properties, roughly 16–22px
  already), soft drop shadow (subtle, never harsh/high-contrast — matches
  existing `--shadow`/`--shadow-sm` tokens), light border or none. One
  card per idea/question/word.
- **Buttons**: fully rounded (`border-radius: 999px`, i.e. pill-shaped —
  already the convention for primary actions in this project's `.btn`,
  `.nav-btn`, `.choice-btn` classes) or large-radius rounded-rect.
  Distinct visual weight for primary vs. secondary actions (solid fill vs.
  outline/lighter fill). Clear, obvious hover/active/disabled states.
- **Navigation**: a simple top bar and/or sidebar with a clearly
  highlighted "active" state (color fill or left-border accent) —
  System A's existing `.chapter-header.active`/`.topic-link.active`
  pattern is the right shape to keep reusing.
- **Progress indicators**: rounded-track, rounded-fill progress bars
  (matches existing `.progress-fill`, `.stage-bar-fill`,
  `.phonics-navbar .nav-progress-fill` patterns) — gradient fills are
  encouraged for extra cheerfulness (already used in several places).
  Pair with a star/XP display where the screen represents a scored
  activity.
- **Dialogs/modals**: centered card over a dimmed/blurred overlay, rounded
  corners, one clear dismiss action. If a future page needs a modal
  (none currently exist in this codebase as a distinct dialog component),
  build it as plain CSS + a `<dialog>`-like overlay div, following this
  same rounded-card-on-overlay shape — don't reach for a component
  library to get there.
- **Avoid**: sharp corners, dense data tables as the primary UI, dark or
  low-saturation "enterprise dashboard" palettes, hairline borders as the
  main visual separator instead of spacing/shadow, small dense
  multi-column layouts, anything that reads like a textbook page ported
  to HTML rather than an app/game screen.

---

## 7. Responsive Design

**Mobile-first.** Design and test at ~375px width first, then confirm the
layout still holds up wider. This project's existing breakpoints are
already reasonable — keep using them rather than inventing new ones:

- `480px` — smallest-phone adjustments (hide secondary label text, tighten
  padding).
- `640px` — the main "phone vs. tablet+" breakpoint used across System B
  and the Adventure games.
- `900px` — the main "mobile vs. desktop" breakpoint used in System A
  (sidebar becomes persistent, content gets more padding).
- `1200px` — desktop content max-width increase.

At every breakpoint: no horizontal scrolling/overflow, tap targets stay
≥44px, and text never drops below the floors in §3.

---

## 8. Game-Like Learning Patterns

- **Progress**: always show where the student is (`"3 / 7"`-style
  counters, filled progress bars) — never leave a student wondering how
  much is left.
- **Scoring**: stars (☆/★, typically a 0–3 scale) and/or XP/points,
  displayed prominently on result screens with a large, celebratory
  number — not a small printed total.
- **Feedback tone**: encouraging, never harsh. Existing convention
  (`Game-Standards/feedback-standard.js`) explicitly avoids "Wrong"/
  "Incorrect" in favor of randomized gentler phrasing and a 3-tier
  win/retry/review framing instead of pass/fail — keep this pattern for
  any new feedback copy.
- **Celebration**: confetti/emoji bursts and a mascot reaction on strong
  results; a gentle "try again" nudge (not a scolding one) on weak
  results.
- **Mascots**: reuse an existing series mascot (e.g. Connie the Fox 🦊
  across the Present Simple/Continuous/Preposition/Conjunction Adventure
  games) rather than introducing a new character per page.

---

## 9. Applying "One System" Across This Project's Architecture

This project has **three technically separate CSS/JS systems** that do
not share files (by established, deliberate convention — see
`CLAUDE.md` §6/§7 for the full technical reasoning). "Consistent design
across lessons, games, quizzes, flashcards, and result screens" (principle
2.11) means **the same numbers and visual rules from this document,
hand-mirrored into each system's own files** — not literally one shared
CSS file, which isn't technically feasible here (no bundler, `file://`
pages, static HTML). Concretely:

- **System A** (main course reader): `style.css` at the project root.
  Uses CSS custom properties (`--fs-body`, `--fs-h1`, etc.) — extend these
  variables rather than hardcoding new values inline.
- **System B** (printable lesson pages): `01-Phonics/_tools/shared.css`
  (edit once, affects all generated Phonics pages), plus
  `02-Spelling/_tools/combined-style.css` (edit + re-run `build.sh`), plus
  `03-Grammar`'s Node-generated inline `<style>` blocks (identical across
  all 40 generated files — apply via a scoped find/replace across all of
  them, not a hand-edit of one).
- **Adventure games**: each of the 7 game folders
  (`16-Verb-Adventure` … `22-Present-Continuous-Adventure`) has its own
  `_tools/game.css` — edit each one individually, applying the same
  target values, to keep the "one file per game" convention intact while
  still converging on one visual system.
- **Shared components** (`Pronunciation-System/`, `Game-Standards/`) —
  root-level, referenced by multiple games/pages; update once, applies
  everywhere it's linked.

When a task says "apply this design system-wide," it means touching all
of the above, not just one of them — check which system(s) are in scope
before assuming a single edit propagates everywhere (it won't).

---

## 10. Current Implementation Gap (as of this document's creation)

This document's typography scale (§3) is **larger** than what's live in
the codebase today. The most recent applied baseline
(`CLAUDE.md` §9.1, "Global Typography Scale v2") uses smaller numbers,
for example:

| Role | This document's target | Current live value (v2) |
|---|---|---|
| Page title (H1) | 48–56px desktop | ~34px (`--fs-h1: 2.15rem`) |
| Section title (H2) | 36–42px desktop | ~26px (`--fs-h2: 1.6rem`) |
| Body/Thai explanation | 24–30px | ~20–21px (`--fs-body`) |
| Buttons | 24–28px | ~20px (`1.25rem`) |

This gap is expected and fine — this document defines where the design
system should end up, not a retroactive claim about what's already
shipped. No file was changed to produce this gap or to close it; closing
it is future work, done deliberately (see §14).

---

## 11. Accessibility

- **Contrast**: minimum 4.5:1 for text under 24px, 3:1 for text ≥24px
  (WCAG AA). Verify any new color pairing against this before shipping it.
- **Focus states**: every interactive element needs a visible
  `:focus-visible` outline — this project's existing pattern
  (`.pron-btn:focus-visible { outline: 2px solid ...; outline-offset: 2px; }`
  in `Pronunciation-System/pronunciation.css`) is the right shape to
  replicate on any new interactive component.
- **Line spacing**: see §3 (minimum 1.4, prefer 1.5–1.75 for Thai body
  text).
- **No tiny text, ever**: the 18px floor in §3 is absolute — it applies to
  every text node on every screen, including ones that feel "minor"
  (badges, timestamps, footnotes).
- **Touch targets**: see §5 (44×44px minimum).
- **Motion**: respect `prefers-reduced-motion` for any animation (already
  handled site-wide in `style.css`'s `@media (prefers-reduced-motion:
  reduce)` block — replicate this guard for any new animated component).
- **Semantic HTML**: real `<button>` elements for actions (not clickable
  `<div>`s), so keyboard/screen-reader users get native behavior for
  free — already the established pattern site-wide.

---

## 12. shadcn/ui — Compatibility and What "Inspiration Only" Means

**shadcn/ui is a React + Tailwind CSS component collection.** This
project is static HTML + hand-written CSS + vanilla JavaScript, served
directly from `file://`/plain static hosting, with no build step for
System A/Games (System B has small Node/bash generators, but nothing
resembling a modern JS bundler/React toolchain — see `CLAUDE.md` §1 for
the full stack description).

**This means shadcn/ui components cannot be installed or used directly**
in this project without adopting React, a bundler (Vite/Next.js), and
Tailwind — which would mean rebuilding the entire site's rendering layer.
That is explicitly out of scope per this task's instructions ("do not
replace the existing technology stack," "do not install new frameworks
yet").

**What *is* safe to adopt**: shadcn/ui's *visual language* — copy the
"shape" of its components (corner radius, shadow depth, spacing rhythm,
color-state conventions, focus-ring styling) by hand in plain CSS, the
same way this document's §6 already describes. Concretely, safe to adapt
without any framework change:
- Card shape (radius + shadow + padding conventions).
- Button variants (solid/outline/ghost visual treatment, size scale).
- Progress bar visual styling (rounded track/fill, color use).
- Focus-ring styling.
- Spacing scale / rhythm between elements.
- Dialog/overlay visual treatment, if a modal is ever needed.

**Not safe / not being done**: importing shadcn's actual component code,
its Radix UI primitives, Tailwind utility classes, or its
build-time-generated component files. None of that runs in a
script-tag/plain-CSS static site without the React+Tailwind toolchain
behind it.

---

## 13. Home Page Reference Implementation (`home.html`)

`home.html` (project root) is the site's all-in-one dashboard — every
lesson system, all 7 Adventure games, and a live progress summary, linked
from one page — and is the **first page built fully compliant with this
document's typography/visual rules** (§3/§4/§6). Treat it as the concrete
worked example whenever these rules feel abstract:

- **Hero**: full-width gradient banner (`--primary` → `--accent-teal` →
  `--accent-pink`), large emoji mascot cluster, page-title-scale `<h1>`
  (§3), one primary pill CTA button ("เริ่มเรียนเลย 🚀") linking to the
  course reader. This is the concrete shape for "Start Learning" any
  future hero section should copy.
- **Section shell**: a centered heading (`.home-section-head`, section-
  title scale) + one-line Thai subtitle, followed by a responsive card
  grid (`grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`).
  Reuse this exact shell for any new grouped set of destinations.
- **Card anatomy** (`.home-card`): circular color-badged icon (68px,
  gradient background), card-title-scale heading, Thai-explanation-scale
  description, a pill CTA at the bottom. The whole card is one `<a>` (not
  a separate button inside it) so the entire card is one large, easy
  touch target. Color-badge classes `.c1`–`.c7` cycle through the site's
  bright accent palette (§4) — pick the next unused one for a new card,
  don't reuse the same color for adjacent cards.
- **Single wide banner card** (`.home-banner`): used once, for "see the
  full games hub" — the shape to reuse any time a section's real content
  lives on another page and this page should just be a large, obvious
  doorway to it, rather than duplicating that page's content.
- **Live progress widget**: reads the same `localStorage` keys/shape
  `games.html` already writes (`readChapterProgress()` pattern, ported
  directly — see `home.html`'s inline `<script>`), aggregates each game's
  chapters into one percentage bar per game, and shows a real, honest
  empty-state message (not a "Coming Soon" badge — the feature works,
  there's just no data yet) when nothing has been played. Use this exact
  pattern for any future page that wants to surface real progress data —
  do not fabricate progress data for a system that has none (e.g. this
  page deliberately has no lesson-progress section, since System A's
  course reader has no completion tracking to read from).
- **`.coming-soon` badge class**: defined in `home.html`'s stylesheet but
  currently unused (every section this page needed had a real
  destination) — kept for the next page that has a genuinely-not-ready
  section, per this document's original "Coming Soon, never a broken
  link" instruction.

---

## 14. How Future Claude Sessions Should Use This Document

- Treat this file as the **default design standard for any new page**,
  the same way `CLAUDE.md` §9 already establishes a design-standard
  policy — this document supersedes/extends those numbers going forward.
- When asked to build a new lesson, game, quiz, or result screen: apply
  the typography scale in §3, the color rules in §4, and the component
  shapes in §6 by default, without being asked to re-derive them.
- When asked to "update the whole site's design" or similar: this
  document is the target scale to converge on — use §9 to know which
  files actually need touching per system, and diff against §10 to see
  how far a given file currently is from target.
- Do not silently start installing React/Tailwind/shadcn's actual
  packages because this document mentions shadcn/ui — re-read §12. If a
  future task explicitly asks to adopt a real framework migration, that's
  a distinct, much larger decision requiring explicit user sign-off, not
  something this document authorizes on its own.
