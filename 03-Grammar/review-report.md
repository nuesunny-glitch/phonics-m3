# Grammar Book Series — Review Report (Topics 01–08)

**Reviewed:** `lesson-book.html` for each topic in `03-Grammar/`, covering the full 20-section structure (cover, Thai explanation, step-by-step rules, summary table, memory tricks, phonics corner, vocabulary, sentence patterns, dialogues, common mistakes, exam tips, mind map, worksheet, 50-question quiz, answer key, cheat sheet, teacher's notes, homework, motivation, closing summary).

**Method:** Full read-through of each file. Every quiz (50 items) and worksheet answer key cross-checked against the question logic. Checked for grammar/spelling accuracy, Thai-language simplicity appropriate for ม.3 level, structural completeness vs. Topic 01's template, and copy-paste leftovers from the Topic 01 generator.

**Overall verdict:** The series is in very good shape — accurate grammar, appropriately simple Thai, and consistent structure across all 8 books. No wrong answer-key entries were found anywhere. Three real content gaps and a handful of cosmetic nits are worth addressing.

---

## Clean — no issues found
- **Topic 01 — Verb to Be** (only note: persona is "ครูสุนี" not README's "ครูอิ้ง" — confirmed intentional, leave as-is)
- **Topic 04 — A / An / The** — sound-based a/an rules correct even for tricky cases (an hour, a university, an MP, a one-hour movie)
- **Topic 05 — How Questions** — countable/uncountable (how many/how much) applied correctly throughout
- **Topic 06 — WH Questions** — all 7 WH-words correct; "whom" deliberately omitted as a defensible M.3-level simplification

## Real content gaps — FIXED

1. **Topic 08 (Adding -ING)** — Quiz Q44–45 (begin→beginning, forget→forgetting) tested the 2-syllable stress-based doubling rule, but that rule was never taught in the Rules/Memory Tricks/Exam Tips/Mind Map/Cheat Sheet sections (which only covered single-syllable CVC doubling like run→running). Students were tested on ungraded material.
   → **Fixed:** added a new "STEP 4" teaching card to the Grammar Rules section (begin→beginning, forget→forgetting vs. open→opening), plus a matching row in the Summary Table and Cheat Sheet, so the rule is taught before it's tested. `generate-book-08.js` and `data-08-adding-ing.json` updated; `lesson-book.html`/`.pdf` regenerated.

2. **Topic 02 (Verb to Have)** — Teacher's Notes (section 17) listed a "Have you got...? Matching Game" classroom activity, but "have got" (informal British form) was never introduced anywhere in the lesson body.
   → **Fixed:** renamed the activity to "Do you have...? Matching Game" to match the structure actually taught (the game itself already only used "I have a ___." sentences, so only the title needed correcting). `generate-book-02.js` updated; `lesson-book.html`/`.pdf` regenerated.

3. **Topic 03 (Verb to Do)** — 3 quiz questions lacked time-marker words, making both past and present tense arguably correct:
   - Q39: "He ___ finish his homework." (didn't vs. doesn't — no time cue)
   - Q42: "When ___ she arrive?" (did vs. does — no time cue)
   - Q43: "Why ___ you eat your vegetables?" (didn't vs. don't — no time cue)
   → **Fixed:** added time markers — "...yesterday", "...at the party last night", "...yesterday" respectively — to force the intended past-tense reading. `data-03-verb-to-do.json` updated; standalone `quiz.html`/`lesson.html`/`worksheet.html`/`answer-key.html` + PDFs and `lesson-book.html`/`.pdf` all regenerated.

## Minor cosmetic polish (optional, low priority)

- **Topic 07 (Adding -S/-ES)**: two vocabulary flashcards use mismatched emoji (brush→🍽️ plate/fork instead of a brush; loaf→🧀 cheese instead of bread). The o-ending plural exceptions (photo/piano vs. potato/tomato) are taught as a memorized list rather than explaining the underlying vowel+o vs. consonant+o pattern — acceptable simplification but could be tightened. Closing summary page (s20) is missing the section-banner "ส่วนที่ 20" chip that every other section has — likely intentional for the closing page, but inconsistent visually with Topic 01's closing page; worth a quick visual diff.
- **Topic 02 (Verb to Have)**: "She has two brothers" is consistently translated as "พี่ชายสองคน" (specifically older brothers) — minor looseness, though Thai's lack of an age-neutral sibling word makes this largely unavoidable.
- **Topic 04 (A/An/The)**: unused `.toc` CSS class in the stylesheet — harmless dead code, no visible effect.

---

## Status
The 3 real content gaps above are fixed and regenerated (HTML + PDF). Cosmetic items were intentionally left untouched, as requested. Nothing else was changed — style, wording, and formatting elsewhere are identical to before.

Note: all content is generated from `_tools/generate-book-0X.js` + `_tools/data-0X-*.json`, not hand-edited HTML — any fix must be made in the generator/data source and then regenerated via `node generate-book-0X.js` (per-topic) or the shared `node tools/build-site.js` for the main course site, otherwise edits will be lost on the next regen.
