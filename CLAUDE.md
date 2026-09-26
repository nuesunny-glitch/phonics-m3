# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## English M.3 Course Website

Project guide for `English projects M3/` — a Thai-language English course for
มัธยมศึกษาปีที่ 3 (ม.3) students, built as static HTML/CSS/JS with no backend,
no bundler, and (on the current dev machine) **no Node.js/Python installed**.
Everything must run by double-clicking an `.html` file — no server required.

This file documents what actually exists in the repo today (verified by
reading the code), not an aspirational architecture. Two largely independent
systems coexist here — read §1 before touching anything. **Exception: §9 is
a forward-looking design standard — read it before creating any new page,
lesson, or game, not just when explicitly asked.**

---

## Commands

There is no test suite, linter, build tool, or CI in this repository —
verification is always manual (open the relevant `.html` file in a browser
and check it renders/prints correctly, including at 375px mobile width).

- **View any page:** open the `.html` file directly (double-click, or drag
  into a browser) — every page must work over `file://`, no server needed.
- **Rebuild System A** (`index.html`/`script.js`) after editing a chapter
  `.md` file: `node tools/build-site.js` — needs Node.js, which is **not
  installed on this dev machine**; run it elsewhere and copy `script.js`
  back.
- **Rebuild 01-Phonics System B pages** after editing a `_tools/body-*.html`
  source fragment: `bash 01-Phonics/_tools/build.sh`
- **Rebuild 02-Spelling System B pages** after editing a `_tools/body-*.html`
  source fragment: `bash 02-Spelling/_tools/build.sh`
- **Rebuild 03-Grammar pages:** `node 03-Grammar/_tools/generate.js` (or a
  per-topic `generate-book-0N.js`) — Node-only, not reproducible on this
  machine currently.
- **Export a Grammar topic to PDF:** `03-Grammar/_tools/export-pdf.sh`

---

## 1. Project Structure — two parallel systems

### System A — the main site (`index.html` + `script.js` + `style.css`)
A single-page course reader. `tools/course-manifest.json` lists all 15
chapters/topics; `tools/build-site.js` (Node) reads every chapter's `.md`
file and bakes it into `script.js` as a `COURSE` data array, which
`tools/script.template.js` (the actual UI logic) then renders client-side —
sidebar accordion, Markdown→HTML conversion, Previous/Next, dark mode,
progress bar, hash routing (`#c<chapter>-<topic>`). **This is the "official"
way students read the course**, per `README.md`.

- Rebuild after editing any `.md`: `node tools/build-site.js` (needs
  Node.js — not available on this dev machine; if you have Node elsewhere,
  run it there and copy `script.js` back)
- Content source of truth: the fifteen `0N-*.md` files, one per chapter
  (`01-Phonics/01-alphabet.md` etc. for the 9-topic Phonics chapter, one
  file per chapter for chapters 2–15)

### System B — printable "lesson book" HTML sets (per chapter, optional)
Separate, hand-built HTML page sets (`lesson.html`, `lesson-book.html`,
`quiz.html`, `worksheet.html`, `answer-key.html`) meant to be **printed and
handed out**, or browsed standalone with audio. Three chapters have these
today, **each using a different internal implementation**:

| Chapter | Status | Implementation |
|---|---|---|
| `01-Phonics/` | ✅ 9 topics × 5 files, **master template** (see §6) | External shared files (`_tools/shared.css`, `shared-nav.js`, `shared-audio.js`) referenced via `<link>`/`<script src>` — zero duplication |
| `02-Spelling/` | ✅ 5 files | CSS/JS **inlined** into every page via a bash build script (`_tools/build.sh` + `_tools/combined-style.css` + `_tools/audio-inline.html`) |
| `03-Grammar/` | ✅ 8 sub-topics × 5 files (separate mini-series, not in `course-manifest.json`) | Originally Node-generated (`_tools/generate.js`, `generate-book-0N.js`, `shared.css.js`) — was built when Node was available; not reproducible on this machine now |

12 chapters (03-Sight-Words, 04-Vocabulary, 05–15) have **only** a `.md`
file — no printable HTML set exists yet, and none is planned unless
explicitly requested.

> **Why three different implementations?** 03-Grammar predates this dev
> environment (built with Node). 02-Spelling and 01-Phonics were both built
> without Node available, but 01-Phonics was later refactored (see chat
> history / git log if present) to eliminate inlined-CSS duplication once
> the pattern proved out — 02-Spelling was never migrated. **Do not assume
> the three are interchangeable; check which one you're in before editing.**

### Other top-level items
- `Phonics-Word-Bank/` — standalone printable word-list PDFs/HTML (short/long
  vowels), unrelated to `01-Phonics/`, not linked from the manifest
- `00-Templates/CHAPTER-TEMPLATE.md` — an early/superseded content template;
  actual chapters don't follow it exactly (see `course-outline.md`)
- `course-outline.md` — course map, status per chapter, teaching schedule
- `English-M3-Course-v1.0.zip` — a packaged export snapshot
- `_tools-09-15/`, `review-report-09-15.md` — Node-based generator scripts +
  QA notes for Phonics topics 9–15... actually for chapters 9–15's `.md`
  content (Future Tense through Entrance Exam), unrelated to `01-Phonics/`
- `Landing-Page/` — a standalone marketing landing page for an "AI English
  course" business concept (`index.html`/`style.css`/`script.js`,
  self-contained, no build step). Not part of the course curriculum
  (System A/B/Games), not linked from anywhere else in the site, and not
  Thai-M.3-student-facing — a separate one-off deliverable that happens to
  live in this repo. Don't apply §9's Gen-Alpha design standard to it; it
  follows ordinary marketing-site conventions instead.

---

## 2. Folder Structure Reference

```
English projects M3/
  index.html, style.css, script.js       ← System A (main site)
  tools/
    course-manifest.json                  ← chapter/topic registry for System A
    build-site.js                         ← Node script: .md → script.js
    script.template.js                    ← actual UI logic (edit this, not script.js)
  01-alphabet.md ... 15-entrance-exam.md  ← content source of truth (one per chapter,
                                             or per-topic inside 01-Phonics/)
  01-Phonics/                             ← System B, master template (see §6)
    MASTER_TEMPLATE.md                    ← full documentation of this chapter's system
    <NN>-<TopicName>.md                   ← 9 source content files
    _tools/
      shared.css, shared-nav.js, shared-audio.js, build.sh
      body-<NN>-{lesson,worksheet,quiz,answerkey,book-intro,book-closing}.html
    01-Alphabet/ ... 09-Blending/         ← 9 generated topic folders, 5 files each
  02-Spelling/                            ← System B, inlined-CSS variant
    02-spelling.md, _tools/, lesson*.html, quiz.html, worksheet.html, answer-key.html
  03-Grammar/                             ← System B, Node-generated (8 sub-topics)
    "01-Verb to Be/" ... "08-Adding ING/" (folder names contain spaces!)
    _tools/generate.js, generate-book-0N.js, shared.css.js
  03-Sight-Words/, 04-Vocabulary/, ...15-Entrance-Exam/   ← content-only chapters (.md)
```

---

## 3. Naming Conventions

- **Chapter/topic folders:** `NN-Name-With-Dashes` (zero-padded 2-digit
  prefix), e.g. `04-Short-Vowels`, `09-Blending`. **Exception:** `03-Grammar`
  sub-topics use `NN-Name With Spaces` (spaces, not dashes) — a legacy
  inconsistency, don't "fix" it without checking every reference first.
- **Source `.md` files:** same name as the folder, lowercase-with-dashes,
  no number-padding requirement beyond matching the folder
  (`04-short-vowels.md` inside `01-Phonics/`, one per chapter elsewhere).
- **Generated output files (System B):** always exactly these five names —
  `lesson.html`, `lesson-book.html`, `quiz.html`, `worksheet.html`,
  `answer-key.html`. Never rename these; navigation/build scripts hardcode
  them.
- **Body fragment files (01-Phonics only):** `body-<NN>-<type>.html` where
  `<NN>` is the two-digit topic number and `<type>` ∈
  `{lesson, worksheet, quiz, answerkey, book-intro, book-closing}`. These
  are the *editable source*; the generated `01-Alphabet/*.html` etc. are
  build output — edit the `body-*` file and re-run `build.sh`, never the
  other way around.
- **CSS classes:** kebab-case, semantic (`.word-card`, `.mistake-card`,
  `.section-banner`), with numbered color-variant suffixes `.c1`–`.c6` /
  `.sb-c1`–`.sb-c6` (see §5).
- **Thai vs English labels:** UI copy is Thai-first; English appears as
  the subject-matter content (words being taught) or as a small `.eng`
  caption under a Thai heading.

---

## 4. Coding Standards

- **No build tooling assumed.** Every HTML file must be openable directly
  via `file://` — no dev server, no bundler, no npm install step for the
  end product. Node.js is used only as an optional *authoring* aid
  (`tools/build-site.js`, 03-Grammar's `generate.js`) and is **not present**
  on the current dev machine — new work uses plain bash scripts
  (`build.sh`) that `cat` fragment files together instead.
- **CSS/JS de-duplication:** prefer real external file references
  (`<link rel="stylesheet" href="...">`, `<script src="...">`) over
  inlining — this is what 01-Phonics does and what 02-Spelling/03-Grammar
  should eventually migrate to. `<link>`/`<script src>` load fine from
  `file://`; `fetch`/AJAX does not (CORS) — don't use fetch for
  local-only data.
- **Self-contained pages, one exception:** Google Fonts (`Kanit`, `Mali`,
  `Poppins`) are loaded from `fonts.googleapis.com` — the only external
  network dependency. Everything else is local.
- **Comments:** JS/CSS files carry a short header comment explaining *why*
  the file exists and any non-obvious constraint (e.g. "no Node on this
  machine, that's why this is bash"). Don't add narrative comments
  explaining *what* the code does when the code is already clear.
- **Vanilla JS only**, ES5-leaning syntax (`var`, `function`, no
  arrow-function-only patterns assumed) for maximum browser compatibility
  with old/offline classroom devices — no framework, no build-time
  transpilation to rely on.
- **Accessibility/print:** every interactive control (`.audio-btn`,
  `.phonics-navbar`, `.speed-toggle`) has a matching `@media print` rule
  hiding it, so worksheet/answer-key pages still print cleanly.

---

## 5. UI Style

**Two distinct visual languages exist — do not mix them:**

### System A style (`style.css`)
App-like reader UI. CSS custom properties for theming
(`--primary: #2563eb`, `--bg`, `--surface`, `--accent-yellow`, etc.), full
dark-mode support via `[data-theme]` + `prefers-color-scheme`, fonts
`Poppins` (EN) + `Kanit` (TH), rounded cards (`--radius` 10–22px), soft blue
shadows. Layout: fixed topbar + collapsible sidebar + scrollable content.

### System B style (printable worksheets, `shared.css` / `combined-style.css`)
Print-first, **no dark mode**, A4-page metaphor (`.sheet { max-width:210mm }`,
`@page { size:A4 }`). Fonts `Kanit` (body) + `Mali` (display headings).
Fixed rainbow palette via CSS vars `--c1`…`--c6` (red/orange/blue/
green/purple/pink) used for quiz-card and section-banner color rotation.
Key components: `.banner` (rainbow gradient page header), `.card.c1`–`.c6`
(quiz question cards with colored border + emoji badge), `.word-card`
(vocabulary flashcard with emoji + Thai phonetic breakdown + audio buttons),
`.cover-page` (lesson-book title page, full-bleed gradient), `.mistake-card`
(red/green wrong-vs-right comparison), `.teacher-poster` (closing-page
summary in a teacher persona's voice — "ครูอิ้ง" for 01-Phonics, "ครูสุนี"
for 03-Grammar; keep personas separate per chapter, don't merge them).

01-Phonics additionally has a fixed `.phonics-navbar` (top) and
`.speed-toggle` (bottom-right floating pill) layered on top of this — see
§7. Responsive breakpoints at `640px`/`400px` collapse multi-column grids
to 1–2 columns and stack `.card-body`/`.info-row` vertically.

---

## 6. Reusable Components

**Only 01-Phonics has true reusable components** (real shared files, single
copy, referenced not duplicated). Full contract is documented in
[`01-Phonics/MASTER_TEMPLATE.md`](01-Phonics/MASTER_TEMPLATE.md) — summary:

- **`01-Phonics/_tools/shared.css`** — every CSS rule for every page in the
  chapter, referenced via `<link>`. Edit once, applies everywhere.
- **`01-Phonics/_tools/shared-audio.js`** — Web Speech API wrapper.
  Buttons opt in via `data-audio="word|sentence|split"` + `data-text`/
  `data-word`+`data-parts` attributes; event-delegated, no per-button JS.
  Forces `en-US`/`en-GB` voice selection (never Thai), speed toggle
  (0.55×/1.0×) persisted to `localStorage`.
- **`01-Phonics/_tools/shared-nav.js`** — Home/Previous/Next/Progress bar.
  Computes the current page's position by reading the last two segments of
  `location.pathname` (no per-page ID needed) against a `TOPICS × FILETYPES`
  matrix generated at runtime. Adding a topic = one array entry.
- **`01-Phonics/_tools/build.sh`** — bash "templating engine": concatenates
  a `body-*.html` fragment between a shared head (referencing the three
  files above) and closing tags.

**02-Spelling and 03-Grammar have no equivalent** — their CSS/JS is
generated fresh per file (02-Spelling inlines a shared string at build
time via bash; 03-Grammar inlines via Node). Functionally similar output,
but editing requires re-running their own `_tools/build.sh` or
`node generate*.js` respectively, and neither can share files with
01-Phonics or each other. If asked to add a feature "everywhere," check
which system(s) are in scope — don't assume one fix propagates.

**`Game-Standards/`** (project root, sibling of `16-*` … `22-*`) — a shared
feedback/scoring layer for the Adventure game folders described in §7.
`feedback-standard.js` + `.css` provide: randomized correct/incorrect
phrases (English only, never "Wrong"/"Incorrect"), a speaker button that
reuses a game's own `window.GameAudio.playWord()` if present, and a
percentage-based 3-tier final-score screen (≥80% win + confetti,
60–79% retry, <60% review) with `onWin`/`onRetry`/`onReview` hooks. See
`Game-Standards/demo.html` for a live example. Adopted by
`21-Present-Simple-Adventure/` and `22-Present-Continuous-Adventure/`
(built after this module existed) — games `16`–`20` predate it and keep
their original Thai feedback text/scoring untouched by design; only touch
those if a task explicitly asks to extend that specific game.

**`Pronunciation-System/`** (project root, same tier as `Game-Standards/`)
— the site-wide speech engine (`pronunciation.js` + `.css`). As of the
Gen Alpha pronunciation-practice pass, this is the ONE real implementation
of "how English is spoken" on the whole site:
- **Rates**: single words/short phrases speak once at **0.70**. Example
  sentences (`renderButton(text, 'sentence')` / `speakSentence()`) speak
  **twice** — pass 1 word-by-word at **0.60** with a 300ms pause between
  words, then (after a 550ms pause) pass 2 at **0.75** for the whole
  sentence naturally. A generation-token guard cancels any in-flight
  word-by-word/two-pass chain cleanly if a new button is clicked mid-chain
  (no overlapping audio).
- **API**: `Pronunciation.speakWord(text, btn)` / `speakSentence(text, btn)`
  (explicit type), `Pronunciation.speak(text, btn)` (auto-detects word vs.
  sentence by word count — used by legacy/generic delegation, not by new
  code that already knows the type), `renderButton(text, 'word'|'sentence')`
  (🔊 speaker button), `renderPracticeButton(text, type)` (🗣️ "พูดตาม"
  repeat-after-me button — same playback, different label/style).
- **Never speaks Thai**: any text containing Thai script is silently
  refused. No caller in this codebase should ever pass Thai text in.
- **All 7 Adventure games' `_tools/game-audio.js` now delegate to this
  file** — each game keeps its own separate file (per the one-file-per-game
  convention below), but its `playWord(text, btn)` is a thin wrapper that
  calls `window.Pronunciation.speak(text, btn)` when the page has the
  script included (falls back to a minimal inline implementation
  otherwise). All 13 `game.html` files across the 7 games now include
  `pronunciation.css`/`.js`. This means every existing `[data-audio="word"]`
  button site-wide (Learn/Picture-Examples/Examples screens, feedback
  speaker buttons via `Game-Standards/feedback-standard.js`, which prefers
  `window.GameAudio` when present) automatically got the slower rate/
  two-pass upgrade with **no HTML changes** — only each game's
  `game-audio.js` was rewritten.
- **Explicitly NOT touched/absorbed**: `01-Phonics/_tools/shared-audio.js`
  (and its byte-identical inline duplicate in `02-Spelling`'s build output)
  — it has its own working slow/normal speed-toggle UI (🐢/🐇, 0.55×/1.0×)
  and a `playSplit()` phoneme-blending function for teaching individual
  letter sounds. Both are intentionally out of scope for this engine;
  don't fold them in without a separate, explicit task.
- Extend to a new page the same way as before: link the CSS/JS, call
  `Pronunciation.renderButton(text, 'word'|'sentence')` (+
  `renderPracticeButton` where a practice prompt makes sense) next to
  English text, rather than writing a new audio wrapper.

---

## 7. Game Architecture

**A third system exists alongside System A/B: standalone "Adventure" game
folders** — `16-Verb-Adventure/`, `17-Adjective-Adventure/`,
`18-Pronoun-Adventure/`, `19-Preposition-Adventure/`,
`20-Conjunction-Adventure/`, `21-Present-Simple-Adventure/`,
`22-Present-Continuous-Adventure/`. These are real, JS-graded interactive
quizzes/games — scoring, drag-and-drop, timers, mascots, localStorage
progress — numbered after the 15 course chapters but **not** registered in
`tools/course-manifest.json` (supplementary, not part of System A). Each
game is documented per-entry in `course-outline.md`; read that first for
what a specific game teaches and how it's structured.

Two structural patterns exist:
- **Multi-chapter**: `chapter-N-<topic>/game.html` +
  `_tools/game-engine-chN.js` + `_tools/<topic>-data.js`, one such trio per
  chapter, sharing one `_tools/game.css`/`game-audio.js`/`mascot.js`/
  `drag-drop.js` per game folder (e.g. `21-Present-Simple-Adventure/`).
- **Single-module**: everything in one root-level `game.html`
  (e.g. `19-Preposition-Adventure/`).

`Game-Standards/` and `Pronunciation-System/` (project root, siblings of
`16-*`…`22-*`) are shared, reusable infrastructure — feedback phrasing,
win/retry/review scoring tiers, XP, and speaker buttons — but are opt-in
for **future** games/pages only; existing games keep whatever
feedback/audio they originally shipped with unless a task explicitly asks
to extend a specific one (see §6 and §9).

System A and System B's own quiz content remains as originally built:
- **System A:** static Markdown content rendered as read-only text (no
  interactivity beyond reading/navigating).
- **System B `quiz.html` pages:** printable multiple-choice sheets with
  blank boxes for students to write A/B/C/D by hand; grading is manual via
  the paired `answer-key.html`, not JS-validated.

---

## 8. Lesson Architecture

### Content authoring flow
1. Write/edit the Thai lesson content in the chapter's `.md` file(s) —
   this is always the source of truth for *what the lesson says*.
2. **System A** picks it up automatically next time `build-site.js` runs.
3. **System B** (if the chapter has one) does *not* auto-sync from `.md` —
   its `body-*.html` fragments are hand-authored/edited separately and can
   drift from the `.md` wording. When editing lesson content that exists
   in both, update both intentionally, or note the drift.

### Per-topic page architecture (System B, 01-Phonics pattern — the model
to replicate for future chapters per `MASTER_TEMPLATE.md` §8–9)
Five pages per topic, each with a specific job:
- `lesson.html` — the standalone lesson (explanation, rules table, word
  bank with audio, example sentences, memory tips)
- `lesson-book.html` — the same content *plus* cover page, mind map,
  common-mistakes section, and the worksheet/quiz/answer-key **reused
  inline** (not retyped) — one long printable booklet
- `quiz.html` — multiple-choice cards, color-rotated, difficulty-starred
- `worksheet.html` — fill-in-the-blank exercises, print-only by default;
  audio buttons only added where the complete word is already shown in the
  prompt (never where the blank *is* the answer — see
  `MASTER_TEMPLATE.md`'s worksheet-audio rule)
- `answer-key.html` — teacher-only, flagged "ตัดหน้านี้ออกก่อนแจกนักเรียน".
  Historically had no audio; as of the §10 Project-Wide English Audio
  Standard, topics converted from 2026-07-31 onward add GlobalAudio
  buttons to its English vocabulary words too — safe because every answer
  is already shown as plain text on this page (that's its whole purpose),
  so a speaker button adds convenience, not a leak. This does NOT apply
  to `worksheet.html`/`quiz.html`, where the worksheet-audio rule above
  (never speak the blanked answer) still holds.

### Phonics-specific teaching rule (01-Phonics content, not a generic rule)
Word breakdown must show **letter/grapheme sounds before the blended
word**, e.g. `c-a-t → เคอะ-แอะ-เทอะ → cat (แค่ท)`. The Thai phonetic table
per letter is fixed (documented in `MASTER_TEMPLATE.md` and the memory file
`thai_phonics_sound_standard.md`) — don't invent new transliterations for
letters already covered without checking that reference first. Digraph/
vowel-team sounds not in the original table were extrapolated by best
judgment and are explicitly flagged as unconfirmed in the memory file.

### Extending to a new chapter
See `01-Phonics/MASTER_TEMPLATE.md` §8 (new topic within Phonics) and §9
(porting the whole system to a different chapter) for the exact steps.

---

## 9. Design Standard for New Pages (Gen Alpha / English M.3)

**Standing policy — apply automatically whenever creating any new page,
lesson, or game**, not only when explicitly asked. This project serves
Thai Gen Alpha students (มัธยมศึกษาปีที่ 3) with weak English foundations;
every screen should feel like a fun app, not a textbook page. Unlike the
rest of this file, this section is prescriptive (how new work *should*
look), not just descriptive of what exists.

- **Large, readable typography.** Body text large enough to read
  comfortably on a phone without zooming; headings clearly bigger. Concrete
  reference point: `21-Present-Simple-Adventure`'s Learn/Picture-Examples
  screens use 30–34px bold English + 24–28px Thai translation, with clear
  vertical space between them (see `_tools/game.css` `#learn-en`/`#learn-th`).
- **Bright, colorful interface.** Reuse an existing rainbow/pastel palette
  (System B's `--c1`–`--c6`, or an Adventure game's own `game.css` palette)
  rather than inventing a muted/corporate theme.
- **Cute illustrations and mascots.** Prefer a consistent mascot per game
  series — Connie the Fox 🦊 across Preposition/Conjunction/Present
  Simple/Present Continuous Adventure — over generic icons. No image
  pipeline exists in this project; mascots and illustrations are
  emoji-based by convention, not photographic/vector artwork, unless a
  task explicitly asks otherwise.
- **Minimal text per screen.** Short explanations (≤2 sentences), one idea
  per card/screen, picture before text — the pattern already established
  across every Adventure game's "Learn"/"Memory Trick" screens.
- **Plenty of white space.** Generous card padding (`.game-card`, `.card`);
  don't cram multiple unrelated ideas into one screen.
- **Big buttons.** Large tap targets for primary actions — the `.btn`/
  `.choice-btn` pill/rounded-rect pattern, never small text links.
- **Fun, game-like experience.** Progress bars, stars, XP, confetti on
  success — reuse `Game-Standards/feedback-standard.js` (randomized
  encouraging phrases, never "Wrong"/"Incorrect"; win/retry/review scoring
  tiers) rather than writing new feedback copy/logic per game.
- **Encourage reading through visual design.** Pair English words/sentences
  with an emoji illustration and, where relevant, a speaker button — reuse
  `Pronunciation-System/` (`Pronunciation.renderButton(text, 'word'|
  'sentence')`) rather than writing a new audio wrapper.
- **Mobile-first responsiveness.** Design and test at ~375px width first;
  confirm no horizontal overflow in-browser before considering a new page
  done, then check it still holds up wider.
- **Child-friendly UI.** Rounded corners, soft shadows, playful display
  fonts (`Mali`/`Kanit`/`Baloo 2` depending on which system the page
  belongs to) — avoid dense, sharp-edged, formal layouts.
- **Every lesson should feel exciting, not academic.** When building new
  content, prefer the Adventure-game model (instant feedback, drag-and-
  drop, mascot, celebration) over a static text-and-table page — this is
  why new lesson work in this project has trended toward `chapter-N-*/
  game.html` + `game-engine-chN.js` rather than more `03-Grammar`-style
  print sheets, and should keep doing so unless told otherwise.

**In practice:** default to the patterns already proven in this codebase
(an Adventure game's engine/CSS structure + `Game-Standards/` +
`Pronunciation-System/` + a consistent mascot) instead of inventing new
visual language, unless the user explicitly asks for something different.

### 9.1 Applied Baseline — Global Typography Scale v2 (2026-07-22)

This scale was applied site-wide across **every existing page** (System A,
System B, all 7 Adventure games, and shared components) in two passes on
the same day: v1, then a further v2 push (user explicitly asked for text
"much larger" than v1, plus more colorful visual feeling). It is **one
consistent set of target values**, hand-mirrored into each system's own
stylesheet(s) (System A/B/Games deliberately don't share one CSS file —
see §6/§7) rather than one literal shared file. New pages should match
these v2 numbers so the whole site stays visually consistent — do not
regress to the v1 numbers below:

| Role | v1 (superseded) | **v2 (current)** | Where defined |
|---|---|---|---|
| Body/paragraph text | ~18-19px | **~20-21px** | `style.css` `--fs-body`; System B `body{font-size}` |
| Small/muted/label text | ~15px / 0.95rem | **~16.5-18px / 1.05rem** | `--fs-sm` |
| Buttons (font) | ~1.1-1.2rem | **~1.25-1.35rem**, padding +~35-40% vs. v0 original | `.nav-btn`, `.btn`, `.choice-btn`, `.fbstd-btn` |
| Quiz/question/card text (`.qtext`, `.s1-sentence`, `.story-text`) | ~21-22px / 1.2rem | **~24px / 1.32rem** | System B `.qtext`; game `.story-text` |
| H3 / subheading | ~21px | **~22.5px** | `--fs-h3` |
| H2 / section heading | ~23px | **~25.5px** | `--fs-h2` |
| H1 / page title | ~29-30px | **~32-34px** | `--fs-h1`; System B `.banner h1` |
| Card/section padding | +~20% vs. v0 | **+~30-35% vs. v0** | `.lesson-body`, `.card`, `.game-card` |
| Gaps/margins between elements | +~15-20% vs. v0 | **+~25-30% vs. v0** | `.choice-grid` gap, list `li` margins, etc. |

**Color pass (new in v2, System A only):** added `--accent-teal`/
`--accent-teal-soft`/`--accent-pink`/`--accent-pink-soft` to `style.css`
`:root` (light + both dark-mode blocks) to give the previously blue/yellow-
only System A a bit more of the rainbow feeling System B/Games already
have — used for `.progress-fill` (now a 3-stop primary→teal→yellow
gradient), `.lesson-num` (teal→yellow gradient circle), `.lesson-body h2`
border-bottom (teal), and `.lesson-body blockquote` border-left (pink).
System B and the Adventure games were left color-untouched in v2 — they
already carry a full `--c1`-`--c6` rainbow palette, so "more colorful" was
judged not-applicable there; only System A (the flattest system) got new
accent colors. Do not hand-patch `script.js` to add per-chapter sidebar
colors — it's a Node-generated build artifact on this project (Node is
unavailable on this machine); any deeper per-item color variation there
needs `tools/build-site.js` regenerated via Node, not a hand edit.

Radii, shadows, breakpoints, and all JS/game logic were left untouched
across both passes — only font-size/padding/margin/gap values changed,
plus the small System-A color-accent set above. System A's `style.css` has
`--fs-body`/`--fs-sm`/`--fs-md`/`--fs-h3`/`--fs-h2`/`--fs-h1` custom
properties in `:root`; System B and the Adventure games don't have an
equivalent variable layer yet (their base CSS predates this scale), so
their selectors carry the literal v2 values directly — reuse the table
above when hand-editing them rather than re-deriving new numbers.

---

## 10. Project-Wide English Audio Standard (2026-07-31 →)

**Standing policy, effective from this date forward: every visible English
word/phrase/sentence added or edited anywhere on the site must get a
speaker button.** This supersedes the narrower per-task audio scopes used
earlier (Articles, Pronouns, Present Simple Ch1, Alphabet A-Z were each
their own explicitly-scoped task) — from now on, audio coverage is the
default, not something that has to be separately requested each time.

**The module**: `Audio-System/audio-system.js` + `.css` (`window.GlobalAudio`
— `speakWord`/`speakSentence`/`renderButton`/`renderPracticeButton`). This
is the **only** audio engine new work may use. Do not write a new speech
wrapper, and do not extend `Pronunciation-System/` or
`01-Phonics/_tools/shared-audio.js` with new capabilities — reuse
`GlobalAudio` exactly as documented in `Audio-System/audio-system.js`'s
header comment.

**Coverage rules** (apply per page/section, not retroactively to the whole
site at once — see rollout method below):
1. Every English letter gets a `.gaud-btn` (word-type, speaks the letter name).
2. Every English word gets a `.gaud-btn`.
3. Every English phrase gets a `.gaud-btn`.
4. Every example sentence gets a `.gaud-btn` (sentence-type).
5. Reading passages get one paragraph-level button (sentence-type, full
   paragraph text) rather than one button per sentence inside the passage.
6. Quiz questions may get a button that plays the question text.
7. Conversation-style pages get per-line/per-turn sentence playback.
8. Never Thai text, never hidden/decorative text.

**Settings** (fixed, same as every prior GlobalAudio rollout): English
voice only, `en-US` preferred → `en-GB` → any `en-*`; rate **0.85** flat
(no two-pass); `speechSynthesis.cancel()` before every new utterance;
`gaud-btn-playing` pulse class while speaking; compact icon-only button,
no visible layout change beyond the icon itself.

**What "reuse GlobalAudio" does *not* require**: pre-existing, functionally
distinct audio tools stay as they are — e.g. `01-Phonics/_tools/
shared-audio.js`'s `playSplit()` phoneme-by-phoneme blending (🔤) is a
multi-step teaching sequence, not a single word/sentence utterance, and
has no GlobalAudio equivalent; building one would itself be "creating
another audio engine." Leave `playSplit()`/the speed-toggle UI as-is;
only the *plain* word/sentence buttons on a page being touched migrate to
GlobalAudio.

**Rollout method — mandatory, do not batch multiple sections in one pass**:
work one section (one lesson page, one topic, one chapter) at a time →
convert its plain word/phrase/sentence buttons to GlobalAudio → verify
live (button count, rate/voice, no duplicate listeners, no console errors,
mobile+desktop) → **stop and report** (files touched, buttons added,
scope decisions made, test results) → wait for the go-ahead before
starting the next section. Completed so far, each as its own finished,
audited task: `03-Grammar/04-A-An-The/lesson.html` (Articles),
`18-Pronoun-Adventure/chapter-1-basic-pronouns/game.html` (Pronouns),
`21-Present-Simple-Adventure/chapter-1-affirmative/game.html` (Present
Simple Ch1), `01-Phonics/01-Alphabet/lesson.html` (Alphabet A-Z, initial
pass), `01-Phonics/02-Consonant-Sounds/` (`lesson.html`, `worksheet.html`,
`quiz.html`, `answer-key.html`, initial pass, 2026-07-31).

**Gap-fill pass (2026-07-31, same day):** an audit found the initial
Alphabet A-Z pass only covered `lesson.html`, and even there had left its
Word Bank on the old system — `worksheet.html`, `quiz.html`, and
`answer-key.html` for that topic had *no* GlobalAudio at all. Fixed as a
full-topic-parity pass, same day as Consonant Sounds:
- `01-Phonics/01-Alphabet/lesson.html` — Word Bank's 10 plain-word buttons
  migrated (66 buttons total on the page now).
- `01-Phonics/01-Alphabet/worksheet.html` (11 — every letter referenced in
  both exercise parts; only ever plays the letter *given* in the prompt,
  never a blanked answer).
- `01-Phonics/01-Alphabet/quiz.html` (50 — the existing "🔊 ฟังคำตอบ"
  answer button per question, which the page's own instructions already
  say is meant to be pressed *after* answering as a self-check — that
  intent was preserved, just re-pointed at GlobalAudio — plus a button on
  all 4 multiple-choice options per question, all four so none is
  singled out).
- `01-Phonics/01-Alphabet/answer-key.html` (14 — every clean single-letter
  answer cell in both answer tables; Thai-word answers like "สระ"/
  "พยัญชนะ" were left as-is, nothing to pronounce there).
- `01-Phonics/02-Consonant-Sounds/lesson.html` — its second table
  ("ข้อสังเกตเพิ่มเติม": Q, X, R, V, W) had zero audio of any kind; added
  5 letter buttons (23 buttons total on the page now).

NOT converted in either topic: `lesson-book.html` — each is a
separately-authored ~30KB booklet duplicating the same content inline;
left untouched both times as its own follow-up candidate rather than
silently expanding scope.

**Full-coverage pass, Alphabet A-Z only (2026-07-31, same day):** a further
request asked for *every* visible English letter/word/sequence in this one
topic to have audio, including alphabet-order runs like "A-B-C-D-E-F-G"
that read wrong through `speakWord`/`speakSentence` (they'd get run
together as one nonsense word). Added `GlobalAudio.speakSequence(text,
btn)` + `renderSequenceButton(text)` to `Audio-System/audio-system.js`
itself (not a new module) — speaks a run of letters one at a time with a
pause between each; a lone `_` or `...` token is a silent blank so
ordering-quiz prompts like "A B _ D E" can be read aloud without ever
speaking the blanked answer. Same rate/voice/cancel/playing-state
guarantees as the rest of the module. Wired into `data-gaud-type="sequence"`
in the shared click handler.

Applied across `01-Phonics/01-Alphabet/lesson.html` (91 buttons total —
+25: intro-paragraph terms, all 4 memory-trick tip-cards, and a second,
clearly-labelled British "zed" button next to Z's existing American "zee"
one), `quiz.html` (60 — +10 sequence buttons, one per question's ordering
prompt), and `answer-key.html` (37 — +23: letters/sequences embedded in
both tables' explanation columns, which the earlier pass had missed).
`worksheet.html` was already complete from the prior pass, unchanged.

**Content-mismatch note:** the request's item lists assumed some content
that doesn't exist verbatim on this page — a spelled-out 21-letter
consonant list, a separate "Common Mistakes" section, and items like
"Flashcards"/"ABC"/"bed" as standalone visible text. Per "do not change
lesson content," nothing was fabricated to match; only genuinely visible
text got a button. Reported explicitly rather than silently dropped.

**Lesson 1 (all of 01-Phonics) completed, project-wide rollout begins
(2026-07-31, same day):** the remaining 7 topics (`03-Consonant-Digraphs`
through `09-Blending`) converted in one pass, using two small Perl scripts
(scratchpad only, not committed) for the mechanical parts — **critical
lesson learned: the first draft of the conversion script corrupted every
Thai character and emoji** because it lacked `use utf8;` (Perl treats
literal UTF-8 bytes in its own source as Latin-1 by default unless told
otherwise). Caught immediately via `diff` before it touched real files;
fixed by adding `use utf8;` + `binmode(STDOUT, ':encoding(UTF-8)')`, then
re-verified byte-for-byte (`xxd`) before running on real files. **Any
future scripted find/replace across these Thai-content files must include
`use utf8;`** (or the encoding equivalent in whatever language) — this
project's existing PowerShell mojibake pattern documented in the memory
file `thai_phonics_sound_standard.md` is the same class of bug in a
different tool.

Script 1 bulk-converted every existing `data-audio="word"`/`"sentence"`
button (the old system) to GlobalAudio across all 21 `lesson.html`/
`worksheet.html`/`quiz.html` files at once; `data-audio="split"`
(phoneme-blend) left untouched everywhere, per the established rule.
Script 2 added GlobalAudio buttons to `answer-key.html`'s quiz-answer
table (`<td>B) word</td>` cells) across all 7 files — the worksheet-answer
table's Thai/prose-embedded answers were left for a future pass rather
than risk a mismatched regex on freeform text.

Hand-edited (script couldn't safely infer these): each topic's main
explanation table had comma-separated example-word groups (e.g. "ship,
shop") with **zero** audio of any kind — one `speakSentence`-type button
was added per row/cell reading the whole group (commas give natural
pauses), not one button per word, to keep the edit count sane at this
scale. `09-Blending/worksheet.html`'s "which word is misspelled" exercise
(4 complete words per question, no blanks) got a button per choice, same
as the Alphabet quiz pattern — safe because nothing is hidden.

**Deliberately not done this pass** (documented, not silently skipped):
topics 4/6/7/8's worksheets are 100% fill-in-the-missing-letter exercises
(e.g. "c_t (แมว)") — correctly got **no** audio, since speaking the
completed word would hand the student the answer letter, per the
long-standing worksheet-audio rule. `lesson-book.html` in all 9 topics —
still out of scope, still flagged as a follow-up. Answer-key's first
(worksheet-answer) table's prose-embedded words — not covered this pass.

**Lesson 2 (02-Spelling) completed (2026-08-01):** unlike 01-Phonics
(external `<link>`/`<script src>` references, output files edited
directly), 02-Spelling inlines everything per-page via `_tools/build.sh`,
which concatenates `body-*.html` source fragments + `combined-style.css`
into the 5 final files. Discovered that `lesson-book.html` is built from
the exact same `body-worksheet.html`/`body-quiz.html`/`body-answerkey.html`
fragments as the standalone pages — so for this topic only, edits were
made to the **source fragments**, not the generated output, and
`build.sh` was re-run to regenerate all 5 files. This means
`lesson-book.html` got full coverage automatically, unlike every Phonics
topic where it was left out of scope. `build.sh` itself was edited once to
always include the Audio-System `<link>`/`<script>` on all 5 pages
regardless of the pre-existing `with_audio` yes/no flag (which continues
to gate only the old `audio-inline.html` speed-toggle system, untouched).

Buttons added: `body-lesson.html` 70 (27 pre-existing Word Bank/sentence
buttons from an earlier pass + 43 new: one `speakSentence` row-button per
example group across all 5 grammar-rule tables (2.1–2.5), one word-pair
button in the irregular-plural table, a tip-card word-list button, and
6 heading buttons for embedded English terms like "Plural Nouns"/"Word
Bank"). `body-quiz.html` 51 (10 pre-existing base-word buttons + 40 new
choice-cell buttons, 4 per question uniformly — some choices are
intentionally-misspelled distractors, e.g. "knifes"/"knifies"/"kniffes",
added anyway per the established uniform-choice rule — + 1 heading).
`body-worksheet.html` 26 (25 base-word buttons across all 3 fill-in-blank
parts, safe since only the given prompt word is spoken, never the blanked
target form, + 1 heading). `body-answerkey.html` 36 (25 hand-added to the
worksheet-answer table + 10 via `convert-answerkey.pl` on the quiz-answer
table, completing what the Phonics pass left for "a future pass" + 1
heading). `body-book-intro.html` 36 (14 pre-existing + 22 new: its own
duplicate table 2.1, 4 Common-Mistakes cards' both ❌/✅ text — including
intentionally-misspelled forms like "studys"/"stoping", flagged here as
such — 4 section-heading English labels, 1 tip-card, and the mindmap's
center label "Spelling Rules"). Total: **219 buttons** across the 5
source fragments → **149 in the final `lesson-book.html`** (36+26+51+36+0,
confirming the concatenation math) plus 70+51+26+36 in the 4 standalone
pages.

**Deliberately not done this pass:** the mindmap diagram's 6 individual
branch tags (📦 Plural / 🐭 Irregular / etc.) in `body-book-intro.html` —
only the center label got a button; per-branch buttons were skipped to
avoid cluttering an intentionally tight diagram and because the same
content is already fully covered in the main lesson tables and Word Bank.
`body-book-closing.html` — confirmed 100% Thai teacher-persona text, no
English content, correctly out of scope.

**Verification:** all 6 edited source fragments checked for balanced
`<button>`/`</button>` tags, zero leftover `data-audio="word"/"sentence"`
remnants, and zero Thai/emoji corruption (spot-checked via `grep` counts
matching expected values exactly) before rebuild. All 5 regenerated
output files browser-tested: zero console errors on load and after
interaction, correct `gaud-btn` counts matching the source math, no
duplicate buttons (checked programmatically — no container holds two
buttons with identical `data-gaud-text`), event delegation and the
graceful English-voice-missing fallback both confirmed working. **One
pre-existing, out-of-scope issue found:** at 375px mobile width,
`lesson.html`'s Word Bank grid overflows the viewport by ~17px
(`scrollWidth` 392 vs `clientWidth` 375) — traced to the pre-existing
`word-grid` CSS layout in `combined-style.css`, not to anything added this
pass (the grid markup itself wasn't touched this session). Flagged here
rather than fixed silently, since a CSS layout fix is outside "add audio
buttons, don't change lesson content."

**Corrective audit of Lesson 1 / 01-Phonics (2026-08-01, same day):** user
manually checked `01-Phonics/07-Vowel-Teams-2/answer-key.html` and found
the worksheet-answer table had zero audio, despite the earlier "Lesson 1
complete" report. Re-audited all 45 output files (9 topics ×
lesson/worksheet/quiz/answer-key/lesson-book.html) by reading actual file
content rather than trusting prior counts. Found three systemic gaps that
had escaped every earlier pass:

1. **All 9 `lesson-book.html` files had zero GlobalAudio buttons** — they
   were built from the old `data-audio` system and never converted at
   all (documented as "still out of scope" in the Phonics rollout, but
   this reads very differently under a "no learner-facing file left
   uncovered" standard). Converted all 9 via the existing `convert-audio.pl`
   (mechanical 1:1 old→new button conversion, `data-audio="split"` left
   untouched as always).
2. **7 of 9 `answer-key.html` files' worksheet-answer table (the first
   table, above the quiz-answer table) had zero audio** — topics 1 and 2
   had it from an earlier bespoke pass, topics 3–9 never did. Hand-fixed
   all 7 (plus completed embedded English terms in topic 2's table that
   the original pass missed).
3. **Every `lesson.html`'s headings and tip-cards containing embedded
   English word lists had zero audio** — e.g. topic 7's "book, look, foot,
   good, cook, wood, hook" tip-card, topic 4's "Word Family" heading. Same
   gap pattern repeated across all 9 topics' `lesson.html`, plus the
   `quiz.html`/`worksheet.html`/`answer-key.html` h1 headings with
   embedded English parentheticals like "(Consonant Sounds)".

Also discovered and flagged (not fixed, out of scope for this pass): **the
`01-Phonics/_tools/body-0X-*.html` source fragments are stale** — they
still contain the pre-GlobalAudio old system, because every fix across
this entire project (Lesson 1 and this corrective pass) was applied
directly to the generated output files, never to the fragments `build.sh`
reads. If `build.sh` is ever re-run, it will silently overwrite every
output file back to the old audio system. This is a latent risk the user
should be aware of; resyncing the fragments would be a substantial
separate task (mirrors the fragment/output split already handled
correctly for 02-Spelling).

Also fixed the same gap pattern inside each `lesson-book.html`'s own
book-intro section (a condensed, separate summary of the lesson content
that only exists inside the book, not in standalone `lesson.html`) —
duplicate explanation tables, `<div class="eng">` subtitle labels, and
cover-page `<h1 class="cover-title-en">` titles, all via the same
mechanical approach (a small Perl script for the ~45 `eng`-subtitle divs,
hand-edits for the tables). **Deliberately left as-is:** `01-Alphabet`'s
tiny uppercase/lowercase sample table inside its lesson-book (redundant —
those exact letters are already spoken dozens of times elsewhere on the
same page); the mindmap branch-level detail in every topic's Memory Tricks
section (same reasoning as the 02-Spelling decision above).

Verified: all 45 files re-checked for balanced button tags and zero
`data-audio` remnants (all OK). Browser-tested the specifically-flagged
file plus several others across topics — zero console errors, correct
button counts, no duplicates, desktop and mobile.

Lesson 1 (01-Phonics) was not touched this session, per explicit
instruction. Lessons 3–15 and the Adventure modules remain for future
passes.

**System A (`index.html`/`script.js`) — new audio delivery mechanism
(2026-08-01, same day):** user clarified the real priority was never the
static HTML files under `01-Phonics/` etc. — it's the SPA at `index.html`
that students actually read, addressed by hash (`#c<chapter>-<topic>`,
e.g. `#c1-1`). This is architecturally nothing like every prior pass:
lesson content lives as **Markdown strings** in the `COURSE` array inside
`script.js`, rendered to HTML at runtime by a small hand-rolled
`mdToHtml()`. Critically, `mdToHtml`'s `inlineMd()` runs `escapeHtml()` on
all text first — so raw `<button>` markup typed into the markdown source
would just show up as literal escaped text, not a working button. Static
`.gaud-btn` HTML cannot be authored into this content at all.

**Solution:** a DOM-annotation pass (`applyLessonAudio()`, new function in
`script.js`, called once right after every `contentEl.innerHTML = ...` in
`renderPage()`) that walks the *rendered* page after each markdown→HTML
conversion and appends `.gaud-btn` elements built via
`document.createElement` — same markup shape as everywhere else, same
`window.GlobalAudio` click delegation, nothing new invented. Since content
is fully replaced on every page navigation (`innerHTML =`), there's no
cross-navigation duplicate-accumulation risk; a `data-gaud-processed` flag
guards against double-processing within one render.

Detection heuristic (`GAUD_EN_RUN_RE`): matches maximal runs of Latin
letters/apostrophes/hyphens joined by single spaces, optionally ending in
one sentence-terminal `.!?`. This means comma- or slash-separated items
(e.g. "A, E, I, O, U" or "book, look, foot") naturally split into
individual per-item buttons — matching the user's own examples ("A 🔊 B 🔊
C 🔊") exactly — while full sentences ending in punctuation stay as one
button. Applied per leaf block element (`td`, `th`, `li`, `p`,
`blockquote`, `h1`–`h6`) using `textContent` (not per raw text node), so
patterns like `**A**pple` (bold first letter, e.g. in the A-Z example
table) don't get split into "A" + "pple" — the whole reconstructed word is
matched correctly.

**Scope restriction (Priority 1/2 only, matches "don't touch
worksheets/exercises/answer-keys"):** every topic's markdown body has a
consistent section structure — `## 📖 อธิบายเป็นภาษาไทย` (explanation) →
`## ✏️ ตัวอย่าง` (examples) → `## 📝 แบบฝึกหัด` (practice — excluded) →
`## ✅ เฉลย` (answer key — excluded) → `## 🧠 เทคนิคจำ` (memory tricks) →
`## ⚠️ ข้อผิดพลาด...` (common mistakes). `.lesson-body`'s children are a
flat sibling list (h2/h3/p/table/etc, `mdToHtml` doesn't nest sub-headers
under their parent h2), so `applyLessonAudio` walks children in order,
flips an `including` boolean on each `H2` by matching its leading emoji
against an include list (📖✏️🧠⚠️) vs exclude list (📝✅), and only
annotates while `including` is true. Verified programmatically per
section on all 5 topics — 📝/✅ segments always measured **0** buttons,
📖/✏️/🧠/⚠️ segments always had substantial coverage.

**Setup:** added `<link rel="stylesheet" href="Audio-System/audio-system.css">`
and `<script src="Audio-System/audio-system.js"></script>` (before
`script.js`, so `window.GlobalAudio` exists before first render) to
`index.html`. Also annotated the page-level `<h1>` (chapter icon + topic
title, e.g. "🔤 ตัวอักษรภาษาอังกฤษ A-Z (The Alphabet)") which lives in
`.lesson-header`, outside `.lesson-body`, via the same leaf-annotation
function.

**Results for chapter 1, topics 1–5 (`#c1-1` through `#c1-5`, exactly the
same 5 Phonics topics already covered as static HTML — different
delivery mechanism, same underlying material):**

| Hash | Topic | 📖 explain | ✏️ examples | 🧠 memory | ⚠️ mistakes | Total |
|---|---|---|---|---|---|---|
| #c1-1 | The Alphabet | 93 | 110 | 20 | 23 | 248 |
| #c1-2 | Consonant Sounds | 85 | 31 | 16 | 30 | 163 |
| #c1-3 | Consonant Digraphs | 78 | 43 | 37 | 34 | 193 |
| #c1-4 | Short Vowels | 122 | 51 | 17 | 10 | 201 |
| #c1-5 | Long Vowels | 68 | 84 | 13 | 15 | 182 |

987 buttons total across the 5 sections, all newly added (System A had
zero audio of any kind before this pass — no prior `Audio-System` include
existed on `index.html`). Verified per-section: zero console errors on
every hash, zero duplicate buttons (checked programmatically — no parent
element holds two buttons with identical `data-gaud-text`), zero buttons
in `📝 แบบฝึกหัด`/`✅ เฉลย` segments (confirms answer-key text is never
spoken), clean layout at both 1280px desktop and 375px mobile (no
horizontal overflow), sampled `data-gaud-text` values for quality (no
runaway multi-word matches, no empty/garbage chunks).

**Known minor imperfection:** the "Short → Magic E → Long" pattern
notation `a...e` (source markdown, meaning "a, then any consonant, then
silent e") produces a button reading "a." (the regex's optional trailing
`.!?` consumes one of the three dots) — cosmetically odd but harmless,
TTS just reads the letter. Not worth special-casing for one recurring
pattern.

**Not touched, per explicit instruction:** `worksheet.html`, quiz/exercise
pages, `answer-key.html`, games — and within `index.html` itself, the
`📝 แบบฝึกหัด` and `✅ เฉลย` subsections of each topic's own body (same
exclusion, applied at the section level since they live in the same
markdown string as the lesson content).

---

## 11. New Adventure module: `23-Daily-Conversation-Adventure`
(2026-08-02) A brand-new Adventure-style module (not an audio-coverage
pass — a fully new game), built to the same "one module = its own
`_tools/` folder, copied not cross-linked" convention as every other
Adventure game (see `16-Verb-Adventure` through
`22-Present-Continuous-Adventure`). This is the first module teaching
**conversation/dialogue** rather than a single grammar point.

**Structure:**
- `23-Daily-Conversation-Adventure/index.html` — hub (Lesson 1 card +
  locked "Lesson 2: เร็ว ๆ นี้" placeholder for future work, same pattern
  as every other hub's locked-future-chapter cards).
- `23-Daily-Conversation-Adventure/lesson-1-hello/game.html` — the lesson
  itself, 9 screens: intro (mascot + 5-character roster) → scenes (4
  dialogue scenes) → vocab (8 words) → mini (6 ungraded practice Qs) →
  game1 (choose correct reply) → game2 (picture/word matching) → game3
  (drag-and-drop sentence building) → boss (10 of 14 pooled questions,
  scored) → result.
- `_tools/game.css` — copied from `19-Preposition-Adventure/_tools/
  game.css` verbatim (banner/card/choice-grid/match-grid/buttons/
  stage-bar/mascot/drag-drop all identical to every other game for visual
  consistency), plus three new component blocks specific to this module:
  `.cast-row`/`.cast-chip` (character roster strip), `.dialogue-line`/
  `.dialogue-bubble` (2-speaker conversation with left/right alternating
  bubbles), `.vocab-grid`/`.vocab-card` (image+English+Thai+audio
  vocabulary cards).
- `_tools/mascot.js`, `_tools/game-audio.js`, `_tools/drag-drop.js` —
  copied verbatim from existing games (Connie the Fox 🦊, the
  Pronunciation-System delegation wrapper, and the Pointer-Events
  drag-and-drop utility respectively). None of these three files were
  modified — this module does not introduce a second audio/drag engine.
- `_tools/conversation-data.js` — new content only: `CHARACTERS` (5-person
  course-wide roster: Tom, Anna, Ben, Lucy, Ms. Jane — per the module spec
  asking for reusable characters across future lessons, even though only
  Tom/Anna speak in Lesson 1), `SCENES` (the 4 required dialogue scenes),
  `VOCAB` (8 words), `MINI_QUESTIONS`, `REPLY_ROUNDS`, `SHORT_LINES`,
  `BOSS_QUESTIONS` (14-question pool; 10 drawn and shuffled each
  playthrough).
- `_tools/game-engine.js` — new engine (screens/state-machine, choice
  rendering, matching-grid logic) following the identical architectural
  pattern as `22-Present-Continuous-Adventure/_tools/game-engine-ch1.js`
  (only the Boss Quiz is scored; everything before it is ungraded
  practice).

**Audio:** every dialogue line, vocab word, and game prompt uses
`Pronunciation.renderButton()` (🔊 Listen) and, on scenes/vocab,
`Pronunciation.renderPracticeButton()` (🗣️ พูดตาม — the existing
"repeat after me" button, reused as-is rather than inventing a new
label/style). No new audio engine was created.

**Feedback/XP:** reuses `Game-Standards/feedback-standard.js` unmodified
— `FeedbackStandard.renderFeedback()` for per-question phrases (its
existing English-only pool: Great!/Awesome!/Excellent!/Well done!/
Amazing!/You got it! and Try again!/Almost!/Look carefully!/Think
again!/You're close!/Give it another try! — not the module spec's exact
word list, but the same "positive English-only" spirit; not modified
since it's shared infrastructure used by other games too), and
`FeedbackStandard.renderScoreResult()` for the win/retry/review 3-tier
result screen — its existing ≥80% "win" threshold lines up exactly with
the spec's "8/10 to pass". On win: `+100 XP` (per spec) saved into
`localStorage['dailyConversationAdventureLesson1Progress']` alongside
`unlocked: true`, matching every other game's own-progress-record
pattern (no cross-game XP ledger exists in this project).

**Site integration:** registered in `games.html`'s `GAMES` array and
`home.html`'s `GAMES` array (Adventures grid + Progress widget), same
shape/fields as every other entry, `storageKey:
'dailyConversationAdventureLesson1Progress'`, `max: 10`. Both hub pages
verified to render the new card with zero console errors.

**Verified:** full playthrough driven programmatically (every screen,
including simulated Pointer Events for the drag-and-drop game and
paired-click sequences for the matching game) — zero console errors at
every step, correct screen transitions, 8-pair matching game and 6-round
drag-drop game both completable, Boss Quiz both loss/retry path (review
tier shown, retry button reruns `startBoss()`) and win path (10/10 →
"You Win!", `+100 XP` badge rendered, `localStorage` correctly shows
`{xp:100, unlocked:true, bestStars:3}`) confirmed. No duplicate buttons.
Desktop (1280px) and mobile (375px) both checked — no horizontal
overflow, dialogue bubbles/vocab grid reflow to single-column on mobile.

**Deliberately not done (explicit instruction: "Create ONLY Lesson 1"):**
no Lesson 2 content — the hub's second card is a locked placeholder only.

---

## 12. New top-level nav category: `24-Story-Adventure`
(2026-08-02) Unlike every prior Adventure module (which lived only in
`games.html`/`home.html`), this one was explicitly required to appear as
**a new item in System A's main sidebar nav** (`index.html`'s course
table of contents), positioned after the "Vocabulary" chapter and before
"Conversation" — i.e. inside the `COURSE` array in `script.js`, not just
linked from the Adventures hub.

**COURSE array insertion:** added a new chapter object immediately after
the existing `"id": 4` (Vocabulary) chapter and before `"id": 5` (Parts
of Speech) — array **position** (not the numeric `id` field) is what
determines sidebar order, since `COURSE.forEach` renders in array order.
Gave the new chapter `"id": 16` (one past the existing max of 15,
avoiding any collision with `#c<id>-<topicId>` hash routing) rather than
renumbering any of the 6 existing chapters that now sit after it in the
list — renumbering would have touched every one of their hash links for
zero functional benefit, and the instruction was explicit: "Do not
remove or rename any existing category." The only visible side effect is
this one new chapter's own badge reads "บทที่ 16" despite being 5th in
the visual list — a self-contained cosmetic quirk (verified `COURSE.length`
is also 16 after the insertion, so "16/16" is at least internally
consistent), not a functional bug, and no existing chapter's badge is
affected.

**Why the new chapter's `body` is a short teaser, not the real
experience:** `mdToHtml()`'s own `inlineMd()` runs `escapeHtml()` first,
and its markdown-link handling (`` `[text](url)` → `text` ``) **discards
the href entirely** — this tiny hand-rolled parser was never built to
produce real hyperlinks, only styled text. Rather than rework shared
parsing logic that all 16 chapters depend on, `renderPage()` in
`script.js` got one small, narrowly-scoped addition: after
`applyLessonAudio()` runs, if `COURSE[page.chapterIdx].folder ===
'24-Story-Adventure'`, a real `<a>` CTA button
(`.story-adventure-cta-btn`, styled in `style.css` with the site's
existing gradient/pill-button language) is appended pointing at
`24-Story-Adventure/index.html`. This is the ONLY page-type-specific
branch in `renderPage()` — deliberately kept that way (a single `if`,
one clearly-commented reason) rather than generalizing into a plugin
system nobody else needs yet.

**The actual Story Adventure experience** lives entirely in
`24-Story-Adventure/`, following the exact same Adventure-module
convention as `23-Daily-Conversation-Adventure/` (own `_tools/` folder,
`game.css` copied forward and extended, own `mascot.js` — Connie the Fox
🦊, same character, not cross-linked):
- `index.html` — the hub: large hero banner (`.hero-banner`, a bigger
  variant of the existing `.banner` gradient card), a 15-node "progress
  map" (`.progress-map`/`.map-node` — visually the same "stepping stone
  chain" language as the rescue-mission progress trackers in other
  Adventure games, reused here as a mission overview rather than
  in-round progress), and 15 Episode cards (`.episode-card`) each with
  illustration/title/description/difficulty badge/time/XP badge/progress
  bar/Start button — or, for the 14 locked ones, a grayed-out card with a
  "🔒 Locked" pill and disabled button (`pointer-events:none`).
- `_tools/episode-data.js` — the 15-episode metadata table (titles/emoji
  exactly as specified; description/difficulty/time/XP are new
  placeholder card metadata, not real lesson content).
- `episode-1-first-day/game.html` + `_tools/episode1-engine.js` — the
  Episode 1 **framework only**, per explicit instruction ("Create only
  the framework. Do not build all lesson content yet."). 9 screens
  (Scene 1/2/3, Vocabulary, Listening, Speaking, Mini Game, Boss Quiz,
  Mission Complete) navigable with Prev/Next, each a clearly-labeled
  "🚧 เนื้อหาจะเพิ่มเร็ว ๆ นี้ (Coming soon)" placeholder card — no real
  dialogue, no graded quiz, no XP awarded. When real content is built,
  each placeholder step should be replaced following
  `23-Daily-Conversation-Adventure/_tools/game-engine.js`'s pattern.

**Audio/reuse:** Pronunciation-System included on the episode page (ready
for when real vocabulary/dialogue content is added — the framework
itself has no English text to speak yet, so no `.pron-btn` instances
exist on the placeholder screens themselves); Game-Standards/Mascot/
Pointer-Events drag-drop are all available via the same `_tools/`
pattern as every other module, not yet wired into Episode 1 since there
is no real content to grade. No new audio, XP, or feedback engine was
created.

**Verified:** `#c16-1` confirmed positioned between Vocabulary and
Conversation in the rendered sidebar (checked the full 24-item nav list
directly). CTA button renders with the correct href. Hub page: exactly 1
unlocked / 14 locked episode cards, 15 progress-map nodes with node 1
marked unlocked, Thai-character CSS class names (`.difficulty-ง่าย` etc.)
confirmed applying correctly. Episode 1 framework: all 9 screens
click through in order via Prev/Next with zero console errors, landing
on Mission Complete. Desktop (1280px) and mobile (375px) both checked —
no horizontal overflow on any of the 3 new pages.

**Not done, per explicit instruction ("Create ONLY the Story Adventure
category and Episode 1 framework. Do NOT create Episode 2 yet."):** no
real lesson content for Episode 1, no Episodes 2-15 content. Also **not
registered in `games.html`/`home.html`'s Adventures grid** this pass —
unlike the Daily Conversation Adventure module, that wasn't part of this
task's explicit scope (the ask was specifically "main website
navigation," which for this project's System A means the `index.html`
sidebar, not the Adventures hub); flagging this as a follow-up rather
than doing it silently, since discoverability from the hub is a
reasonable next step if wanted.

## 13. Full audio pass: `03-Grammar/04-A-An-The/` (2026-08-02)

Applied the Audio-System (`gaud-btn`, System B — same engine as
01-Phonics/02-Spelling) exhaustively across all 5 files in this topic,
per an explicit rule: every standalone English word/phrase/sentence
gets its own speaker button (never grouped), but Thai explanations that
merely *mention* an English grammar term inline (e.g. "ใช้ a หน้าเสียง
พยัญชนะ") are left untouched — only genuinely standalone English
content (table examples, quoted citations, `เช่น [English list]`
citations, flashcards, dialogue lines, worksheet lead-in sentences,
answer-key answer cells) qualifies.

**Worksheet/quiz fill-in-the-blank rule (reaffirmed):** never speak a
sentence where the blank *is* the tested answer (e.g. "I have ___
dog."). Where a multi-sentence item has one fully-visible leading
sentence before the blank (e.g. "I bought a pen. ___ pen is blue."),
only that visible leading sentence gets a button.

**Buttons added per file** (all pre-existing buttons were already
present in `lesson.html` only — 13 — everything else started at 0):
- `lesson.html`: 13 → 93 (+80)
- `worksheet.html`: 0 → 2 (added missing Audio-System `<link>`/`<script>`
  includes too — file had neither before this pass)
- `quiz.html`: 0 → 159 (also added Audio-System includes)
- `answer-key.html`: 0 → 58 (also added Audio-System includes)
- `lesson-book.html`: 0 → 372 (also added Audio-System includes; this
  file is a standalone ~1300-line combined print book — cover, 10+
  unique explanation sections, plus the worksheet/quiz/answer-key
  content re-embedded verbatim)
- **Total new speaker buttons added: 671**

**How it was done:** `lesson.html` was audited and edited by hand
(11 sequential Edit calls), fixing one pre-existing rule violation along
the way (a button that had grouped 2 separate teaching sentences into
one `data-gaud-text`, split into 2). The other 4 files — being large,
highly repetitive, and structurally regular (quiz has 50 near-identical
question cards; `lesson-book.html` re-embeds the same worksheet/quiz/
answer-key content) — were processed with disposable Perl scripts
(scratchpad only, not part of the repo) doing literal/regex string
substitution, each validated by requiring an exact match count before
writing. **Gotcha:** the first script run mojibake'd all Thai text and
🔊 emoji because it was missing `use utf8;` — Perl treats literal UTF-8
source strings as raw bytes without that pragma, causing double-encoding
on write. Always add `use utf8;` + `binmode(STDOUT, ':encoding(UTF-8)')`
when a Perl script both reads `:encoding(UTF-8)` file content *and*
contains literal Thai string constants.

**Dialogue-bubble judgment call:** in `lesson-book.html`'s "Daily
Conversation" section, each speech bubble (which may contain 2
sentences, e.g. "Okay. Look, the apple over there looks fresh.") was
kept as ONE button per bubble rather than split per sentence. This is a
deliberate exception to "never group multiple examples" — that rule is
about not merging *separate teaching examples* (like the first/second-
mention sentence pair, which *was* split), not about fragmenting a
single natural spoken utterance into disconnected pieces.

**Verified:** structural balance (`<button>` open/close counts, and
`document.querySelectorAll('.gaud-btn').length` in-browser) matched
exactly in all 5 files; zero console errors on load in all 5; clicked
sample buttons in `quiz.html` and `lesson-book.html` with no errors.

## 14. Global Audio Standard (2026-08-02 →) — permanent, site-wide

The user declared **Lesson 12 (`12-Reading`, System A)** the permanent
reference implementation for audio on this site, superseding the
narrower single-button-per-passage rule from §13. This section is the
canonical spec — any future audio work on any lesson, worksheet, quiz,
dialogue, story, or game should follow it, not re-derive rules from
scratch.

**Scope note:** the request that created this section said "implement
across ALL lessons." That is a genuinely large undertaking — System A
has 16 chapters, System B has ~8 grammar topics × 5 files each plus
01-Phonics (45 files) and 02-Spelling (5 files), and there are 9
Adventure games each with their own UI chrome. Only Lesson 12 itself has
been brought into full compliance so far (below). The rest of the site
has **not** been touched yet — rolling it out lesson-by-lesson is future
work, not a one-shot pass, precisely so each area gets the same
verification rigor Lesson 12 got.

### The rules

1. **Lesson content:** every standalone English word and every English
   sentence gets its own speaker — never one button covering a whole
   paragraph of multiple sentences.
2. **Vocabulary tables:** every row's English word gets a speaker;
   never read the Thai translation column.
3. **Grammar examples:** every English example (word, phrase, or
   sentence) gets its own speaker.
4. **Dialogues:** ① one "Play Entire Dialogue" speaker for the whole
   exchange, **and** ② a speaker after every individual line.
5. **Stories:** ① one "Read Entire Story" speaker, **and** ② a speaker
   after every sentence.
6. **Reading passages:** ① one speaker **above** the passage ("Read
   Entire Passage"), **and** ② a speaker after every sentence inside it.
7. **Reading quiz:** a speaker after the question stem only — never
   after the choices, never reading ก)/ข)/ค)/ง) (or A/B/C/D), never
   reading Thai, never reading the answer.
8. **Worksheets:** English instruction lines (e.g. "Match the
   pictures.", "Circle the word.") get a speaker. This is about the
   *instructions*, not the exercise items — the existing worksheet-audio
   rule from §10/§13 (never speak a blanked answer) still applies to
   fill-in-the-blank items themselves.
9. **Games:** UI chrome buttons/labels (Start, Next, Finish, Game Over,
   Correct, Wrong, Level Complete, Win, Lose) get a speaker.
10. **Voice settings:** en-US, rate 0.85, pitch 1.0, volume 1.0 — this
    is exactly what `Audio-System/audio-system.js`'s `speak()` already
    does (rate `0.85` is hardcoded; `SpeechSynthesisUtterance` defaults
    pitch/volume to `1.0` and nothing overrides them), so no engine
    change was needed for this rule.
11. **Engine:** reuse the existing Global Audio System only. Never let
    audio overlap — `speak()` already calls `speechSynthesis.cancel()`
    before every new utterance, satisfying this automatically. Desktop/
    tablet/mobile must all work.
12. **UI:** speaker buttons stay small, using the existing `.gaud-btn`
    purple style — never invent a new visual style, never change layout,
    colors, or move content. A "read entire X" button is visually
    *identical* to a normal `.gaud-btn` (same size/icon); it's only
    distinguished by its `aria-label` (e.g. "ฟังทั้งย่อหน้า (Read Entire
    Passage)") and by being placed above the block it reads.
13. **Never add speakers to:** Thai explanations, Thai paragraphs, Thai
    instructions — English-only, always.

### Lesson 12 reference implementation (script.js, `renderPage()`)

Markdown source can't hold raw `<button>` HTML (`mdToHtml`/`escapeHtml`
strip it — see §on mdToHtml above), so all of this is injected into the
**rendered DOM** after `mdToHtml()` runs, inside a
`folder === '12-Reading'` branch (same technique as the Story Adventure
CTA link):

- Every `blockquote > p` (each Reading Passage — Malee/Somchai/Ploy) is
  rebuilt: split on `/[^.!?]+[.!?]+/g` (sentence-boundary regex — safe
  here since none of the passages contain abbreviation periods) and a
  `GlobalAudio.renderButton(sentence, 'sentence')` is appended after
  each fragment. A separate small button reading the *whole* passage
  text is inserted as a sibling `<div>` right before the `<blockquote>`,
  with its `aria-label` overridden to "ฟังทั้งย่อหน้า (Read Entire
  Passage)" so it's distinguishable from the per-sentence ones despite
  being visually identical.
- Every `<li>` inside an `<ol>` (the two 10-question reading-quiz lists)
  is split at the first `"ก)"` substring — everything before it is the
  question stem (gets one button), everything from `"ก)"` onward (the
  four choices) is left as plain untouched text.
- This runs on *every* blockquote/list in the lesson body, not just the
  two passages named in the original request — so the earlier "Malee"
  example passage (§13, pre-existing from an even earlier phase) got
  upgraded too, replacing its old word-fragment-heavy annotation
  (12 buttons, some multi-word runs) with clean one-per-sentence
  coverage (8 buttons, one per actual sentence) — a side effect judged
  as a compliance improvement, not scope creep, since it's the same
  "Reading Passage" the new rules describe.

**Verified:** zero console errors; `Somchai`/`Ploy`/`Malee` passages
each show exactly one "Read Entire Passage" button above + one button
per sentence inside (7/6/8 respectively); both 10-question quiz lists
show exactly one stem-only button per question with choices untouched;
answer-key tables still show 0 buttons; no horizontal overflow at
375px; sample buttons clicked with no errors.

### Lesson 11 full upgrade (script.js, `renderPage()`, 2026-08-02)

Full Global Audio Standard rollout for **Lesson 11 only**
(`folder === '11-Conversation'`), plus converting every ก)/ข)/ค)/ง)
multiple-choice label to A./B./C./D. in this lesson. No other lesson
was touched.

**Key technique differences from the Lesson 12 branch:**
- This lesson's `applyLessonAudio()` include-markers (`📖`/`✏️`) would
  otherwise auto-annotate the vocab tables and dialogue text with the
  generic word-level pass — so the block starts by removing every
  `.gaud-btn` already in `.lesson-body` before doing its own fully
  custom pass, guaranteeing no duplicates/interference (verified stable
  at 260 buttons across repeated re-renders).
- **Dialogue blocks are a novel case:** `mdToHtml` has no fenced-code
  (` ``` `) support, so the 5 example dialogues render as one flat `<p>`
  per block with every line squashed together (plus stray literal
  `` ``` `` text). An explicit lookup table (`DIALOGUE_BLOCKS`, matched
  by a unique substring per block) rebuilds each into clean
  `A: ... 🔊<br>B: ... 🔊` markup — wording unchanged, only the multi-line
  presentation is restored (required to give each line its own speaker
  at all).
  - **Bug caught during testing:** the naive substring matcher also
    matched the "เฉลยตอนที่ 2" answer paragraph for ข้อ 11 (which quotes
    "Hello! My name is Nid." inside its own parenthetical), silently
    replacing that paragraph with dialogue-block markup and losing its
    "ข้อ 11: 3→4→2→1 (...)" structure. Fixed by skipping any paragraph
    containing "ข้อ" before dialogue-block matching. **Lesson:** when
    matching rendered text by substring across a whole lesson body,
    check other sections don't quote the same string back for a
    different purpose (answer keys quoting question text is a common
    culprit) — a full-body browser-side dump of matched-vs-expected
    counts per section is what caught this, not a priori reasoning.
- **Dialogue-completion items** ("A: X? B: ___ ก) ... ") get the prompt
  split from choices at the first `"ก)"` index (same technique as
  Lesson 12 rule 7), then the prompt itself is further split at a
  trailing `/\s*B:\s*___\s*$/` so "B: ___" is displayed but never
  spoken, and "A:" is stripped from the spoken text (never read the
  speaker-label prefix aloud). All 20 items (10 in "ตอนที่ 1" + 10 in
  "🧩 Quiz") follow this exact "A: X B: ___" shape.
- **Vocabulary/expression cells** use an explicit exact-text lookup
  (`VOCAB_SEGMENTS`, ~50 entries covering the 7 "สำนวน" tables + the
  summary table's 2 English columns + Flashcards) rather than a generic
  slash-splitter — several cells need real template expansion, not just
  splitting (e.g. `"It's next to / near / across from..."` → each
  alternative needs its own `"It's "` prefix and `"..."` suffix
  restored: `["It's next to...", "It's near...", "It's across from..."]`),
  which a naive `" / "`-split can't produce correctly.
- Conversation-ordering items (ตอนที่ 2, items 11-12) split on literal
  `"___"` and button each fragment that follows.
- Answer-key `<td>` cells matching `/^(ก\)|ข\)|ค\)|ง\))/` get their
  label converted and a button on the English answer only (reason
  column untouched). The "เฉลยตอนที่ 2" narrative answer paragraphs get
  buttons on each fragment inside the trailing `"(...)"`, split on `"→"`
  — the ordering numbers before the parenthesis are never spoken.

**Deliberately left untouched:** the "🗺️ Mind Map" and "🖼️ Infographic"
ASCII-art code-fence blocks — judged decorative/structural, not
learner-facing vocabulary or dialogue content (§14 rule 13 spirit).

**Verified:** 260 total buttons, stable across re-renders (no
duplicates); 0 remaining ก)/ข)/ค)/ง) labels in the lesson (confirmed
with a choice-list-shaped regex, not a blanket substring search — a
naive scan flagged one false positive, the Thai word "...ขอทาง)" whose
last two characters coincidentally read "ง)"); Lesson 10 and Lesson 12
independently re-checked and confirmed unchanged; zero console errors;
no horizontal overflow at 1280px or 375px; sample buttons clicked
successfully.

## 15. Lesson 1 (01-Phonics) illustration placeholders (2026-08-02)

Added educational-illustration placeholders to "Lesson 1" — which for
this site is the standalone **`01-Phonics/` folder** (System B, the
9-topic build-pipeline lesson set), not the condensed System A
`index.html` chapter 1 markdown summary. Confirmed by content match:
the brief's "existing A-Z table" and Apple/Ball/Cat/Dog examples exist
verbatim only in `01-Phonics/01-Alphabet/lesson.html`.

**No image-generation tool is available in this environment**, and the
brief explicitly anticipates that: rather than inventing broken `<img>`
URLs or pulling random/copyrighted internet images, every illustration
spot is a styled, clearly-labelled **placeholder component** (colorful
gradient box, dashed border, icon, caption naming the planned filename)
that reserves the correct 4:3 (or 1:1 for vocab cards) aspect ratio via
CSS `aspect-ratio`, so a real `<img>` can be dropped in later with zero
layout shift. Full asset plan, exact scenes, and the swap-in procedure:
**`01-Phonics/ILLUSTRATIONS.md`**.

**Scope:** only 4 of the 9 Phonics topics touched — `01-Alphabet` (hero
+ topic illustration + 4 vocab picture cards), `02-Consonant-Sounds`,
`04-Short-Vowels`, `09-Blending` (illustration + 2 live blend-cards
C+A+T→CAT🐱, D+O+G→DOG🐶). Topics 03/05/06/07/08 and all
worksheet/quiz/answer-key/lesson-book files across all 9 topics were
**not** touched — confirmed via `grep -rl` for the new CSS classes
across the whole `01-Phonics/` tree returning exactly the 4 intended
output files (+ their 4 source fragments).

**Architecture:** `01-Phonics/` is generated by `_tools/build.sh` from
`_tools/body-NN-lesson.html` source fragments (established pattern for
this folder — edit source, rebuild, never hand-edit generated output
directly, unlike some other folders in this project). New CSS added to
`_tools/shared.css` (`.illus-hero`, `.illus-card`, `.vocab-pic-strip`/
`.vocab-pic-card`, `.blend-row`/`.blend-card`, plus a `max-width:640px`
responsive block) — shared by all 45 generated files but only renders
where the new HTML markup exists (4 files).

**Verified:** all 4 modified topic pages load with zero console errors;
audio-button counts unchanged from before (76/28/28/15 across the 4
pages — every `.audio-btn` from the original page is still present and
functional, confirmed by click-test); no horizontal overflow at 1280px
or 375px; mobile screenshot confirms images scale down cleanly without
covering text or the fixed bottom speed-toggle control.

## 16. Site-wide per-chapter image placeholder — System A (2026-08-02)

A **different, broader** illustration mechanism from §15 — this one is
in `index.html`'s course reader (`script.js`/`style.css`), applies to
**every chapter** (not just Phonics), and uses a real `<img>` tag
(the user explicitly ruled out another SVG/CSS-drawn placeholder here,
having asked for one in the prior turn and then decided to source real
artwork externally instead — see the `ILLUSTRATIONS.md`/§15 approach
for that still-in-place SVG-free CSS-box pattern, kept only in
01-Phonics).

**What it does:** `chapterHeroHtml()` (new function in `script.js`,
called from `renderPage()`) inserts one `<figure class="chapter-hero">`
between `.lesson-header` and `.lesson-body` on every course page,
containing `<img src="images/chapter-{id:02d}.webp">`. The chapter id
comes from `COURSE[page.chapterIdx].id`, so a multi-topic chapter
(e.g. chapter 1 / Phonics, which has 9 topics) shows the **same** image
on every one of its topic pages — the naming scheme is per-chapter, not
per-topic. Skipped entirely for `folder === '24-Story-Adventure'`
(chapter 16) since that chapter is just a CTA link into its own fully
separate, already-illustrated game module.

**No broken-image icon before real files exist:** the `<img>` has an
inline `onerror` that hides itself and reveals a sibling
`.chapter-hero-fallback` box (icon + "ภาพประกอบเร็ว ๆ นี้" + the exact
expected filename) — pure CSS/HTML state toggle, not a hand-drawn
substitute illustration. `.chapter-hero` reserves `aspect-ratio: 4/3`
so there is zero layout shift whichever state (real image vs fallback)
ends up showing. `img { object-fit: cover }` guarantees no
stretch/distortion once a real (non-4:3) source file is dropped in.

**To add a real image:** just place a file at `images/chapter-NN.webp`
(01 through 15; 2-digit zero-padded chapter id) — no HTML/JS/CSS edit
needed, the `<img src>` already points there.

**Verified:** Lesson 11 and Lesson 12's custom audio blocks (§14)
untouched and fully functional — 260 and 109 `.gaud-btn` elements
respectively, exactly matching pre-change counts (the hero figure sits
as a sibling *outside* `.lesson-body`, so `applyLessonAudio()` and both
lessons' custom audio-injection blocks — which only query inside
`.lesson-body` — never see it). Next/Previous navigation tested
end-to-end (`#c1-3` → `#c1-4` via the Next button) with the correct new
chapter hero and page content loading. Chapter 16 (Story Adventure)
confirmed to have no hero figure and its pre-existing CTA button intact.
No horizontal overflow at 1280px or 375px; mobile screenshot confirms
clean layout with Next/Prev buttons unobstructed. Only console output
was the expected `404` for each not-yet-existing `images/chapter-NN.webp`
— zero actual script errors.
