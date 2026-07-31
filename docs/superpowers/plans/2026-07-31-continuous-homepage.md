# Continuous Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Greentomato homepage as one continuous editorial scroll from Hero through Artists, Selected Work, Services, and Contact while preserving the accepted content and interactions.

**Architecture:** Keep the existing semantic HTML and JavaScript behavior, then add a final, focused CSS cascade layer for page rhythm and responsive layout. Add static Node tests that verify section order, removal of slide-style snapping, scalable artist navigation, and the four-work-item content contract.

**Tech Stack:** Semantic HTML, CSS, vanilla JavaScript, Node.js built-in test runner.

## Global Constraints

- Preserve the current hero treatment and all existing artist/work/service content.
- Section order is Hero → Artists/brand statement → Selected Work → Services → Contact.
- The homepage must scroll continuously with no `scroll-snap`, forced per-section fullscreen height, or long sticky chapter.
- Artists remains one page chapter with immediate name/portrait switching and a `View more artists` path.
- Desktop and mobile layouts must both remain usable.

---

### Task 1: Homepage structure regression tests

**Files:**
- Create: `tests/homepage-continuity.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `index.html`, `home-v4.css`, `home-v4.js`
- Produces: `npm test` regression gate for page order and continuous-scroll rules

- [ ] **Step 1: Write failing tests**

Create tests that assert the ordered section class names, five artist controls, four work rows, the artist directory link, and the absence of `scroll-snap` or sticky positioning in final homepage rules.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL because the test script and continuity contract are not yet present.

- [ ] **Step 3: Add the Node test script**

Set `"test": "node --test tests/*.test.mjs"` in `package.json`.

- [ ] **Step 4: Run tests and retain the expected continuity-rule failure**

Run: `npm test`
Expected: structural assertions pass; CSS continuity assertion fails until Task 2.

### Task 2: Continuous page rhythm

**Files:**
- Modify: `home-v4.css`

**Interfaces:**
- Consumes: existing section classes in `index.html`
- Produces: `.artists`, `.success-stories`, `.services`, `.contact` as natural-height connected chapters

- [ ] **Step 1: Add a final `@layer continuity`-style cascade block**

Add explicit natural-height, spacing, divider, overflow, and mobile rules. Remove duplicate interrupted Artists lock declarations rather than adding another conflicting copy.

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 3: Validate CSS syntax**

Run: `npx --yes stylelint home-v4.css --custom-syntax postcss-css --allow-empty-input`
Expected: no CSS parse errors (style warnings may be reviewed separately).

### Task 3: Browser verification

**Files:**
- Modify only if browser checks reveal a regression: `index.html`, `home-v4.css`, `home-v4.js`

**Interfaces:**
- Consumes: local homepage served by `server.js`
- Produces: desktop and mobile evidence for hierarchy, section flow, and interaction

- [ ] **Step 1: Start the local server**

Run: `npm start`
Expected: local HTTP server remains running.

- [ ] **Step 2: Inspect desktop at 1440×1000**

Verify section order, no slide snapping, readable Artists layout, immediate artist portrait switching, and natural Work/Services/Contact transitions.

- [ ] **Step 3: Inspect mobile at 390×844**

Verify no horizontal overflow, usable artist names/preview, legible work cards, and reachable contact CTA.

- [ ] **Step 4: Run final verification**

Run: `npm test && git diff --check`
Expected: all tests pass and no whitespace errors.
