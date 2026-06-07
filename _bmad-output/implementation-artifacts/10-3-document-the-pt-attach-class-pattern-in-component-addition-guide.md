# Story 10.3: Document the `:pt`-attach-class pattern in `docs/component-addition-guide.md`

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a design system contributor,
I want a worked example of the `:pt`-attach-class pattern in the canonical component guide,
so that future component refactors and new components follow the priority order without me having to read prior PRs.

## Context

This is **Story 3 of Epic 10 (Wave 1)** — the final story of the pilot wave. Stories 10.1 (DsAvatar, **done**) and 10.2 (DsBadge, **review**) proved the `:dt` → `:pt`-attach-class → scoped-own-DOM pattern on real components. This story **codifies** that pattern in `docs/component-addition-guide.md` so Waves 2–4 (Epics 11–13) and all future component work can follow a documented worked example instead of reverse-engineering it from merged PRs.

**This is a docs-only story.** No `.vue`, `.ts`, `.test.ts`, or `.stories.ts` files change. The only file edited is `docs/component-addition-guide.md`. There is no PrimeVue, no build-output, no API surface to touch — but the validation triple (`npm run build && npm test && npm run lint`) must still pass, because the guide is referenced as the source of truth from `CLAUDE.md`, `Readme.md`, and the `front-end-dev` skill, and the doc must stay internally consistent.

### ⚠️ The guide currently CONTRADICTS the new pattern — this is the core of the work

The guide does not merely *omit* the `:pt`-attach-class pattern; in one place it **actively recommends the anti-pattern**. `docs/component-addition-guide.md:133` (inside the PrimeVue Wrapper "Key rules") currently reads:

> Use `<style scoped>` only for component-specific CSS (loading overlays, transitions) — never to override PrimeVue design token custom properties. **Use `:deep()` selectors within scoped styles when targeting PrimeVue internal classes (e.g., `.p-button-label`)**

That bolded sentence is now **wrong** — `:deep(.p-*)` is the exact anti-pattern Epic 10 exists to eliminate (NFR1, NFR8). Wave 2 (DsButton) will be ripping out `:deep(.p-button-label)` / `:deep(.p-button-icon)` specifically. **The dev MUST correct this line**, not just append a new section, or the guide will tell future contributors to do the opposite of the priority order. This is the single most important edit in the story.

The guide also **has no "priority order" section at all** today — the `:dt` → `:pt` → scoped-CSS ordering lives only in `CLAUDE.md#Conventions`. The guide mentions `:dt` (line 132) and `<style scoped>` (line 133) but never frames them as a ranked priority, and never mentions `:pt` class attachment. This story adds that framing to the guide so the canonical component doc is self-contained.

## Acceptance Criteria

1. **Priority order is documented** — The guide explicitly documents the customization priority order: **1. `:dt` → 2. `:pt`-attach-class + plain scoped CSS → 3. `<style scoped>` for own-DOM only**, matching the order in `CLAUDE.md#Conventions` (pick the first that fits, do not skip down the list). It is presented as a ranked list, not prose, so it is scannable.

2. **"When to use `:pt` to attach a class" subsection exists** — Includes the governing rule, phrased so the trigger is unambiguous: **"use `:pt` to attach an owned class when `:dt` does not expose the value — before reaching for `:deep`."** It explains the mechanism: attach a class you own to a specific PrimeVue inner part via `:pt`, then style that class with plain scoped CSS (no `:deep`, no `!important`).

3. **DsAvatar is the worked example** — Uses DsAvatar's **post-refactor** (Story 10.1) code as the reference: a file-path reference (`src/components/DsAvatar/DsAvatar.vue`), a before/after snippet (the `:deep(.p-avatar)` block → `:dt` + `:pt` + `.ds-avatar__inner`), and the key gotchas (same-element rendering; token-mappable values go to `:dt`; unlayered scoped CSS beats PrimeVue's `@layer` defaults so no `!important` is needed). The snippet matches the **actual current code** in `DsAvatar.vue` (so doc and code agree — AC verified by reading the live file, not from memory).

4. **The `:deep` recommendation is corrected** — `docs/component-addition-guide.md:133`'s instruction to "use `:deep()` selectors … when targeting PrimeVue internal classes" is rewritten to route through `:pt`-attached classes instead. No remaining text in the guide recommends `:deep(.p-*)` as a normal practice.

5. **Anti-Patterns list is extended** — The existing "Anti-Patterns to Avoid" list (`docs/component-addition-guide.md:500-509`) gains three entries: **"no `:deep(.p-*)` selectors reaching into PrimeVue internals"**, **"no `!important` to fight PrimeVue specificity"**, and **"no `:host` selectors"**. The existing entry about `<style scoped>` not overriding tokens is reconciled with (not duplicated by) the new entries.

6. **References still resolve (no broken links/anchors)** — After the edit, the file-level references to the guide from `CLAUDE.md` (lines 14, 47), `Readme.md` (line 11), and `.claude/skills/front-end-dev/SKILL.md` (lines 14, 79) still point at a guide that contains the things they claim it contains — in particular CLAUDE.md:14 says the guide "defines … the anti-patterns list," so the **Anti-Patterns section heading must be preserved** (extend it, don't rename/remove it). No reference uses a `#section-anchor`, so heading renames are low-risk — but do not delete or rename any existing `##`/`###` heading that a reference implies (Component Types, Step-by-Step Checklist, Anti-Patterns to Avoid).

7. **Validation triple passes** — `npm run build && npm test && npm run lint` all exit zero with no new warnings. (Docs-only change → expected no-op for build/test; lint scope is `./src` and does not cover `docs/`, so this is a regression guard, not a doc linter.)

## Tasks / Subtasks

- [x] **Task 1: Re-read the live DsAvatar source so the worked example matches reality** (AC: #3)
  - [x] Read `src/components/DsAvatar/DsAvatar.vue` **now** (do not trust this story's snippets — read the file). Capture the exact post-refactor shape: template bindings `:dt="{ background: 'transparent' }"` and `:pt="{ root: { class: 'ds-avatar__inner' } }"` on `<Avatar>` (currently `DsAvatar.vue:147-148`), and the `.ds-avatar__inner { ... }` rule (currently `DsAvatar.vue:201-210`).
  - [x] Note the explanatory comment already in the file (`DsAvatar.vue:195-200`) — it explains the same-element reality and why `background` went to `:dt`. The worked example should echo this, not contradict it.

- [x] **Task 2: Add the customization priority-order section to the guide** (AC: #1, #2)
  - [x] Add a new `### ` subsection under "Step 2. Implement the Component" (or a clearly-placed sibling section) that documents the ranked priority order: 1. `:dt` → 2. `:pt`-attach-class + plain scoped CSS → 3. `<style scoped>` own-DOM only. Mirror the wording in `CLAUDE.md#Conventions` (lines 33–42) so the two never drift.
  - [x] Add the "When to use `:pt` to attach a class" content with the rule from AC #2. Reference `DsModal.vue` / `DsSelect.vue` as additional multi-part `:pt` precedents (matching CLAUDE.md's citations), and DsAvatar as the single-part worked example.

- [x] **Task 3: Write the DsAvatar before/after worked example** (AC: #3)
  - [x] Include the **before** (`.ds-avatar:deep(.p-avatar) { ... }` — the single `:deep(.p-*)` selector) and **after** (`:dt` + `:pt` on the template; `.ds-avatar__inner` plain scoped rule). Keep the snippet faithful to the live file from Task 1.
  - [x] State the three gotchas explicitly: (a) `ds-avatar` and `p-avatar` render on the **same** element, so `:pt root` attaches the owned class to that same node — verify with a DOM probe rather than assuming nesting; (b) values that map to a PrimeVue token (`background`) move to `:dt`, the rest stay on the owned class; (c) `border-radius: 50%` was **dropped** as redundant with `shape="circle"` + the wrapper; (d) the override wins **without `!important`** because the wrapper's unlayered scoped CSS beats PrimeVue's `@layer primevue` defaults regardless of specificity.

- [x] **Task 4: Correct the contradicting `:deep` recommendation** (AC: #4)
  - [x] Rewrite `docs/component-addition-guide.md:133`. Remove "Use `:deep()` selectors within scoped styles when targeting PrimeVue internal classes (e.g., `.p-button-label`)" and replace with guidance to attach an owned class via `:pt` and style it with plain scoped CSS, cross-referencing the new priority-order section.
  - [x] Grep the whole guide for any other `:deep` mention that frames it as acceptable practice; reconcile each. (DsIcon's `:deep(svg)` targeting a slotted SVG is the **one** legitimate exception per NFR1 — if you mention `:deep` at all, scope the prohibition to `:deep(.p-*)` PrimeVue-internal selectors, not slotted-content `:deep`.)

- [x] **Task 5: Extend the Anti-Patterns list** (AC: #5)
  - [x] Add the three bullets from AC #5 to `## Anti-Patterns to Avoid` (`docs/component-addition-guide.md:500`). Keep the heading text exactly "Anti-Patterns to Avoid" (CLAUDE.md:14 references "the anti-patterns list").
  - [x] Reconcile the existing bullet "No scoped styles overriding PrimeVue design tokens" (line 505) with the new `:deep`/`!important` bullets so they read as a coherent set, not three near-duplicates.

- [x] **Task 6: Verify references still resolve** (AC: #6)
  - [x] Confirm the three structural headings referenced indirectly still exist with the same names: "Component Types", "Step-by-Step Checklist", "Anti-Patterns to Avoid". Confirm no reference in `CLAUDE.md`, `Readme.md`, or `.claude/skills/front-end-dev/SKILL.md` uses a `#anchor` that your edits would break (they are all file-level links — verify, don't assume).
  - [x] Do **not** edit `CLAUDE.md`, `Readme.md`, or the `front-end-dev` skill — they already describe the guide correctly at the file level. Editing them is out of scope.

- [x] **Task 7: Run the validation triple** (AC: #7)
  - [x] `npm run build && npm test && npm run lint`. Expect a clean no-op (docs-only). **Note:** `DsSelect.test.ts` has **15 pre-existing failures** unrelated to this story (confirmed in Stories 10.1 and 10.2 via `git stash`). They are not caused by this docs change — re-confirm they are identical with/without your edit and do not attribute them here. Lint (`biome check ./src`) does not scan `docs/`, so it cannot validate the markdown — it is only a guard that you did not accidentally touch `src/`.

## Dev Notes

### Exact change surface

**One file changes: `docs/component-addition-guide.md`.** No code, no tests, no stories, no barrel, no `CLAUDE.md`, no `Readme.md`, no skill files.

Four edits within that file:
1. **Add** a customization priority-order section + "When to use `:pt`" subsection (AC #1, #2) — near "Step 2. Implement the Component" (`docs/component-addition-guide.md:36`).
2. **Add** the DsAvatar worked example (AC #3) — can live inside the new priority-order section.
3. **Rewrite** line 133's `:deep()` recommendation (AC #4).
4. **Extend** the Anti-Patterns list at line 500 (AC #5).

### The canonical priority order (copy the framing from CLAUDE.md, don't reinvent it)

`CLAUDE.md#Conventions` (lines 33–42) is the existing source of truth for the priority order. The guide must agree with it verbatim in spirit:

1. **`:dt="..."`** — per-instance design token overrides. Use for any value PrimeVue exposes as a token (sizes, colors, radii, padding tiers). Survives PrimeVue upgrades and composes with `dsPreset`. Precedent: `DsButton.vue` / `DsInputText.vue` `sizeTokens`, `DsAvatar.vue` `:dt="{ background: 'transparent' }"`.
2. **`:pt="..."`** — pass-through to attach your own class/attrs to specific PrimeVue inner parts (`header`, `overlay`, `pcCloseButton`, `root`, etc.) when tokens are not enough. Style the attached class with **plain scoped CSS — no `:deep()`, no `!important`.** Precedent: `DsModal.vue` (multi-part), `DsSelect.vue` (single `overlay` part), `DsAvatar.vue` / `DsBadge.vue` (`root` class).
3. **`<style scoped>`** — only for DOM your wrapper owns (loading overlays, transitions, your own `<div>` layout). Avoid `:deep(.p-*)` selectors that fight PrimeVue internals; if you need to style an inner part, go back to step 2.

> **Do not let the guide and CLAUDE.md drift.** CLAUDE.md's "When in doubt" clause (line 47) says the guide is the source of truth for component patterns. After this story, the guide *owns* the worked example; CLAUDE.md keeps the short rule and points readers to the guide. Keep them consistent in ordering and anti-pattern wording.

### The DsAvatar worked example — verified facts (read the live file to confirm)

**Before** (the single `:deep(.p-*)` selector that existed pre-10.1):
```css
.ds-avatar:deep(.p-avatar) {
  background: transparent;
  padding: 0;
  border-radius: 50%;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
}
```

**After** (current `DsAvatar.vue` — template + scoped CSS):
```vue
<Avatar
  v-bind="$attrs"
  :class="avatarClasses"
  :dt="{ background: 'transparent' }"
  :pt="{ root: { class: 'ds-avatar__inner' } }"
  shape="circle"
  ...
>
```
```css
.ds-avatar__inner {
  padding: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
}
```

**The decision table (what moved where, and why) — this is the teaching content:**

| Old `:deep(.p-avatar)` declaration | Destination | Why |
|---|---|---|
| `background: transparent` | `:dt="{ background: 'transparent' }"` | PrimeVue Avatar exposes a `background` token → neutralize at the token level (step 1 of the priority order). |
| `border-radius: 50%` | **dropped** | Redundant: `shape="circle"` adds `p-avatar-circle` and `.ds-avatar` already sets `border-radius: 50%`. |
| `padding`, `overflow`, `width/height: 100%`, flex props, `color: inherit` | `.ds-avatar__inner` (step 2 owned class) | No matching PrimeVue token; these are layout/reset values kept as plain scoped CSS. |

**Three gotchas to teach:**
1. **Same-element rendering.** `ds-avatar` and PrimeVue's `p-avatar` render on **one** `<span>`. So `:pt="{ root: { class: 'ds-avatar__inner' } }"` lands the owned class on that same node — and, notably, the old `.ds-avatar:deep(.p-avatar)` descendant selector matched **nothing** (it compiled to `.ds-avatar[data-v] .p-avatar`). Always verify with a mounted-DOM probe where the class actually lands before trusting a `:deep` selector — a `:deep` that matches nothing is a silent no-op.
2. **Token first, class second.** Evaluate each declaration against the component's PrimeVue token keys (verify the path exists in `src/theme/ds-preset.ts` + PrimeVue's theme — don't invent token names). Token-mappable → `:dt`; everything else → the `:pt`-owned class.
3. **No `!important` needed.** The override wins because the wrapper's **unlayered** scoped CSS beats PrimeVue's `@layer primevue` defaults regardless of specificity. Reaching for `!important` to win a specificity fight is the symptom the whole pattern cures.

### Out of scope (do not do here)

- **No code/test/story changes.** DsAvatar, DsBadge, and every other component are untouched. This is the doc that *describes* their refactor, not more refactoring.
- **No edits to `CLAUDE.md`, `Readme.md`, or `.claude/skills/front-end-dev/SKILL.md`.** They already reference the guide correctly at the file level. (If you believe one is wrong, log it in Completion Notes — do not edit it here.)
- **No new visual-regression tooling, no Storybook changes.**
- **No `docs/ai-guidelines/` edits** — those are consumer-API docs; no public API changed in Epic 10.
- **Do not rename existing headings** in the guide (Component Types, Step-by-Step Checklist, Anti-Patterns to Avoid) — references depend on them existing.

### Project conventions (from CLAUDE.md)

- The customization priority order this story documents **is** the convention: 1. `:dt` → 2. `:pt`-attach-class + plain scoped CSS → 3. `<style scoped>` own-DOM only. Never `:deep(.p-*)`, never `!important` to beat PrimeVue specificity, never `:host`.
- `docs/component-addition-guide.md` is the source of truth for component patterns; `docs/ai-guidelines/index.md` is the source of truth for the public API surface. Keep the guide self-consistent.
- The **one** legitimate `:deep` exception is DsIcon's `:deep(svg)` (slotted SVG, not a PrimeVue internal) — NFR1. Scope the guide's prohibition to `:deep(.p-*)`, not all `:deep`.

### Project Structure Notes

- Single-file docs change: `docs/component-addition-guide.md`. Plus the sprint-status update.
- Per NFR7, Wave 1 (Stories 10.1–10.3) ships as **one branch/PR**. This story completes that PR's documentation half; 10.1 (DsAvatar) and 10.2 (DsBadge) are the code half. Verify all three are on the same branch before the PR is opened.
- Validation runs per change (NFR4); for a docs-only change the triple is a regression guard (build/test untouched; lint scope excludes `docs/`).

### References

- [Source: _bmad-output/planning-artifacts/epics-refactor-styles.md#Story 10.3] — story statement + 4 BDD acceptance criteria (priority-order doc, "when to use `:pt`" subsection, DsAvatar worked example, anti-patterns extension, no-broken-anchors).
- [Source: _bmad-output/planning-artifacts/epics-refactor-styles.md#Additional Requirements] — "Update `docs/component-addition-guide.md` in Wave 1 (not at the end), so subsequent waves reference the canonical pattern documentation."
- [Source: _bmad-output/planning-artifacts/refactor-styles-plan.md:123] — "Update `docs/component-addition-guide.md` in Wave 1 to add the `:pt`-attach-class pattern alongside the `:dt` rule, with DsAvatar's refactor as the reference example."
- [Source: docs/component-addition-guide.md:36-135] — "Step 2. Implement the Component" → PrimeVue Wrapper "Key rules"; **line 133 is the `:deep()` recommendation to correct.**
- [Source: docs/component-addition-guide.md:500-509] — "Anti-Patterns to Avoid" list to extend (line 505 = the existing scoped-styles-vs-tokens bullet to reconcile).
- [Source: src/components/DsAvatar/DsAvatar.vue:143-178] — post-refactor template (`:dt` + `:pt` on `<Avatar>`); the worked-example "after".
- [Source: src/components/DsAvatar/DsAvatar.vue:195-210] — the explanatory comment + `.ds-avatar__inner` rule to mirror in the worked example.
- [Source: _bmad-output/implementation-artifacts/10-1-refactor-dsavatar-root-styling-to-pt-attached-class-with-dt-token-migration.md] — DsAvatar refactor record: same-element discovery, decision table, why no `!important`, `:dt` flat-key shape.
- [Source: _bmad-output/implementation-artifacts/10-2-refactor-dsbadge-root-styling-to-pt-attached-class-and-eliminate-important.md] — second precedent; `:pt root` class with an intentionally-empty owned class is a valid outcome.
- [Source: CLAUDE.md#Conventions] — the canonical priority order (lines 33–42) and anti-patterns the guide must agree with.
- [Source: CLAUDE.md:14] — "the guide … defines … the anti-patterns list" → preserve the Anti-Patterns heading.
- [Source: .claude/skills/front-end-dev/SKILL.md:14,79] — file-level references to the guide (the new-component path follows it "exactly"); verify they still resolve.

## Dev Agent Record

### Agent Model Used

claude-opus-4-8 (Claude Opus 4.8, 1M context)

### Debug Log References

- `npm run build` → passed (vue-tsc + Vite lib build clean; `dist/index.js` 157.08 kB, `dist/index.css` 943.85 kB).
- `npm test` → 551 passed, 15 failed. The 15 failures are all in `src/components/DsSelect/DsSelect.test.ts` and are the documented pre-existing failures (per Task 7 / Stories 10.1, 10.2). This story changed no `src/` files (`git diff --stat -- src/` is empty), so the failures are demonstrably unrelated to this docs change.
- `npm run lint` → `biome check ./src` checked 69 files, no fixes applied (clean). Lint scope excludes `docs/`, so this is a regression guard confirming `src/` was not touched.

### Completion Notes List

- **Single file changed: `docs/component-addition-guide.md`** (plus the sprint-status.yaml tracking update). No code, tests, stories, barrels, `CLAUDE.md`, `Readme.md`, or skill files were edited — matching the story's exact change surface.
- **AC #4 (the core fix):** Rewrote the contradicting line (was line 133) that recommended `:deep()` selectors for PrimeVue internals. It now routes through `:pt`-attached owned classes and cross-references the new priority-order section. No remaining text in the guide recommends `:deep(.p-*)` as normal practice — verified by grep; every surviving `:deep(.p-*)` mention frames it as the anti-pattern (prohibition, the "before" example, or the scoped slotted-content exception).
- **AC #1/#2:** Added new subsection `#### 2c. Styling Customization Priority Order` under Step 2, documenting the ranked order (1. `:dt` → 2. `:pt`-attach-class + plain scoped CSS → 3. `<style scoped>` own-DOM only), mirroring `CLAUDE.md#Conventions`. Includes the "When to use `:pt` to attach a class" subsection with the governing rule verbatim from AC #2, and cites `DsModal.vue`/`DsSelect.vue` as multi-part precedents.
- **AC #3:** DsAvatar worked example uses the **live post-refactor code** (read from `src/components/DsAvatar/DsAvatar.vue` at the start, not from the story snippets). Before/after snippets + decision table + three gotchas (same-element rendering verified by DOM probe; token-first/class-second; no `!important` needed because unlayered scoped CSS beats `@layer primevue`). The `border-radius: 50%` drop is captured in the decision table.
- **AC #5:** Anti-Patterns list extended with the three required bullets (no `:deep(.p-*)`, no `!important`, no `:host`) and the existing scoped-styles-vs-tokens bullet reconciled (now points to `:dt` + the priority-order section rather than near-duplicating the new bullets). Heading "Anti-Patterns to Avoid" preserved exactly.
- **AC #6:** All three structural headings preserved (`## Component Types`, `## Step-by-Step Checklist`, `## Anti-Patterns to Avoid`). Confirmed every external reference (`CLAUDE.md` lines 14/47, `Readme.md` line 11, `.claude/skills/front-end-dev/SKILL.md` lines 14/79) is a file-level link with no `#anchor`, so heading additions cannot break them. No external files edited.
- **AC #7:** Validation triple run — build and lint clean; test failures are the 15 pre-existing DsSelect ones only.
- Internal anchor link used in the guide (`#2c-styling-customization-priority-order`) targets the new heading within the same doc; it is not an external reference and does not affect AC #6.

### File List

- `docs/component-addition-guide.md` — modified (corrected `:deep` recommendation; added `#### 2c. Styling Customization Priority Order` section with DsAvatar worked example; extended Anti-Patterns list).
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — modified (story status tracking: ready-for-dev → in-progress → review).
- `_bmad-output/implementation-artifacts/10-3-document-the-pt-attach-class-pattern-in-component-addition-guide.md` — modified (this story file: task checkboxes, Dev Agent Record, File List, Change Log, Status).

## Change Log

| Date | Change |
|---|---|
| 2026-06-07 | Documented the `:dt` → `:pt`-attach-class → scoped-own-DOM priority order in `docs/component-addition-guide.md`: corrected the contradicting `:deep()` recommendation, added the "Styling Customization Priority Order" section with the DsAvatar worked example, and extended the Anti-Patterns list (no `:deep(.p-*)`, no `!important`, no `:host`). Status → review. |
| 2026-06-07 | Code review (bmad-code-review) passed: all 7 ACs verified against live source. Applied review fixes — relabeled `DsSelect` as single `overlay` part (was wrongly "multi-part"); scoped the `:pt` durability claim to `.p-*` CSS-class renames; corrected DsIcon's selector to `span :deep(svg)`; clarified the `border-radius` drop references the wrapper's own `.ds-avatar` rule. Corrected the same `DsSelect` "multi-part" inaccuracy in this story's Dev Notes to prevent propagation to Waves 2–4. Status → done; epic-10 (Wave 1) complete. |
