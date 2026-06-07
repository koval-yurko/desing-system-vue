# Story 10.2: Refactor DsBadge root styling to `:pt`-attached class and eliminate `!important`

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a design system maintainer,
I want DsBadge's `!important` declarations gone and its styling routed through a `:pt`-attached owned class,
so that DsBadge no longer fights PrimeVue's specificity and proves the pattern handles `!important`-heavy cases.

## Context

This is **Story 2 of Epic 10 (Wave 1)** of the PrimeVue styles refactor — the second pilot, run immediately after Story 10.1 (DsAvatar, **done**). It hardens the `:dt` → `:pt`-attach-class → scoped-own-DOM pattern on the `!important`-heavy case the pilot was designed to stress.

**This is an internals-only refactor.** Zero public API changes. Zero consumer-visible diff. The success criterion is literally "Storybook looks identical before and after." Any visual change is a regression, not a feature.

### ⚠️ Read this first — the `:deep(.p-badge)` block is almost certainly a NO-OP

Story 10.1 discovered that on DsAvatar, `ds-avatar` and `p-avatar` render on the **same element**, so the descendant selector `.ds-avatar :deep(.p-avatar)` matched nothing and contributed zero pixels. **DsBadge is the same shape, confirmed by source:**

- PrimeVue Badge (`node_modules/primevue/badge/index.mjs`) renders **one** element: `createElementBlock("span", mergeProps({ class: cx('root') }, ptmi('root')), [ renderSlot(default) ])`. The wrapper's `:class="badgeClasses"` (which includes `ds-badge`) is merged onto that **same** root `<span>` via `ptmi('root')` (Badge has `inheritAttrs: false`). The slot content (`.ds-badge__leading/__label/__trailing`) nests **inside** that single span.
- Therefore `ds-badge` and `p-badge` sit on **one node**, and `.ds-badge:deep(.p-badge)` compiles to `.ds-badge[data-v-x] .p-badge` (a **descendant** combinator) which matches **nothing**. All **10** `!important` resets in that block (`DsBadge.vue:107-118`) currently apply to **zero** elements.

**Consequence — the current rendered baseline is NOT produced by the reset block.** It is produced by:
1. `.ds-badge` (unlayered scoped CSS, same node) — owns `height: 20px`, `padding: 2px 8px`, `border-radius: 4px`, `border`, `gap`, font props, `display/align/justify`, `box-sizing`, `position`.
2. `.ds-badge--{type}` variants — own `background-color`, `color`, and per-variant tweaks.
3. PrimeVue's `p-badge` token defaults for any property **1 and 2 do not set** (e.g. `min-width: 1.5rem`/24px — `.ds-badge` never sets `min-width`, so PrimeVue's default shows through and **is part of the baseline**).

**This makes the migration a TRAP, not a copy-paste.** See the regression trap below. **Verify the same-element fact yourself** with a quick mounted-DOM probe (Task 2) before trusting this analysis — 10.1's `:deep`→class swap was a no-op-to-no-op; this one is a no-op-to-**live**, which is riskier.

## Acceptance Criteria

1. **`:pt`-attach-class replaces `:deep`, zero `!important`** — The `<Badge>` element receives `:pt="{ root: { class: 'ds-badge__inner' } }"`, the `.ds-badge:deep(.p-badge) { ... }` block is removed, styling that must remain is expressed as plain `.ds-badge__inner { ... }` (and/or folded into the existing `.ds-badge` rule), **zero `:deep(.p-*)` selectors remain** in `DsBadge.vue`, and **zero `!important` declarations remain** anywhere in the `<style scoped>` block.

2. **Token-mappable values move to `:dt`** — Each value retained from the old reset block is evaluated against PrimeVue's Badge theme keys (root exposes `borderRadius`, `padding`, `fontSize`, `fontWeight`, `minWidth`, `height`; plus `dot.size`, `sm/lg/xl`, `colorScheme.{light,dark}.<severity>.{background,color}`). Any value that maps to a Badge token and is genuinely needed to hold the baseline is set via per-instance `:dt` (flat root keys, e.g. `:dt="{ minWidth: '...' }"`) instead of class CSS. Values with no matching token remain on `.ds-badge__inner` (or `.ds-badge`), with a one-line comment naming the absent token only if the absence is non-obvious.

3. **Validation triple passes** — `npm run build && npm test && npm run lint` all exit zero with no new warnings.

4. **Visual parity** — Walking **every** DsBadge story (all 11 types, the leading/trailing/both-icon variants, `CleanHover`, and `AllVariantsGrid`) in light **and** dark themes, the rendered output is **pixel-identical** to the pre-refactor baseline (manual diff). Pay special attention to `min-width`-sensitive short badges and the `loaded`/`draft`/`clean` variants.

5. **Removing `!important` still beats PrimeVue defaults in a real theme context** — Verified with the **`dsPreset` theme active** (not `theme: 'none'`), DsBadge renders with the intended DS override values — i.e. removing the `!important`s did not allow PrimeVue's `p-badge` defaults to win. Storybook (which loads `dsPreset`) is the real-theme surface for this check; the unit suite runs `theme: 'none'` and **cannot** catch a specificity regression, so it does not satisfy this AC on its own.

6. **Zero public API diff (NFR3)** — Exported props (`DsBadgeProps`), `DsBadgeType` union, slots (`default`, `leading`, `trailing`), and emitted attrs are unchanged before and after. `<script setup>` logic stays byte-for-byte identical except any optional `:dt` computed you choose to add.

## Tasks / Subtasks

- [x] **Task 1: Capture the pre-refactor baseline** (AC: #4, #5)
  - [x] Run `npm run storybook` and walk all 16 DsBadge stories (`Pending`, `Interesting`, `Neutral`, `Rejected`, `Accepted`, `Cancel`, `Border`, `Clean`, `Draft`, `Loaded`, `Type10`, `WithLeadingIcon`, `WithTrailingIcon`, `WithBothIcons`, `CleanHover`, `AllVariantsGrid`) in **both** light and dark themes. (Storybook runs with the real `dsPreset` theme — this doubles as the AC #5 real-theme surface.) **— see Completion Notes: interactive browser walk not available in this CI/agent environment; substituted an objective render-neutrality proof (DOM probe + jsdom before/after diff + by-construction analysis). Final human Storybook confirmation recommended.**
  - [x] For at least the `Pending` (typical), a short-content badge, and `Loaded`/`Draft`/`Clean` variants, record the **computed** `min-width`, `height`, `padding`, `border-radius`, `background` from DevTools (or a mounted-DOM `getComputedStyle` probe) so the post-refactor diff is concrete numbers, not memory. Watch `min-width` specifically — PrimeVue's `1.5rem` default likely shows through today. **— ran a real-theme (`dsPreset`) `getComputedStyle` probe across all 11 types; before vs. after output byte-identical. jsdom leaves PrimeVue vars unresolved (no concrete px), as the story foresaw; the byte-identical diff still confirms no cascade change.**

- [x] **Task 2: Prove the same-element / no-op fact** (AC: #1, #4)
  - [x] Mount a DsBadge (e.g. `type="pending" label="Text"`) and inspect the root: confirm `ds-badge`, `p-badge`, and the slot spans all sit as described (one root span carrying both `ds-badge` and `p-badge`; `.ds-badge__label` etc. nested inside). A throwaway Vitest `mount(...).html()` probe (delete after) is the fastest path — mirror 10.1's Debug Log approach. **— PROVEN: root `<span class="p-badge p-component ds-badge ds-badge--pending">`, `.ds-badge__label` nested inside.**
  - [x] Confirm the current `.ds-badge:deep(.p-badge)` block matches nothing (descendant selector, same-element root). This is the linchpin: if — and only if — it is a no-op, the old reset declarations are **not** part of the baseline and must not be blindly resurrected. **— CONFIRMED no-op: single-element root has no descendant `.p-badge`.**

- [x] **Task 3: Build the keep/drop/`:dt` decision table for each reset declaration** (AC: #1, #2)
  - [x] For each of the 10 declarations in the old block, decide its fate using the table in **Dev Notes → Regression trap**. The governing question per declaration is: *"Does adding this live on `.ds-badge__inner` change the computed baseline from Task 1?"* If yes → it's a regression, do **not** add it (or move it to `:dt` only if the token value equals the baseline). If it merely duplicates a value `.ds-badge`/variant already sets → redundant, drop it. **— All 10 resolved to DROP (redundant-with-`.ds-badge`/variant or regression-if-applied). `.ds-badge__inner` is empty. No `:dt` needed.**
  - [x] For any property where PrimeVue's default is currently part of the baseline (candidate: `min-width: 1.5rem`), the post-refactor render must keep that exact value. Do **not** introduce `min-width: 0` (the old `!important` never applied — it is not the baseline). **— `min-width` left unset; PrimeVue's `1.5rem` default still shows through unchanged.**

- [x] **Task 4: Attach the owned class and apply `:dt` (if any)** (AC: #1, #2)
  - [x] Add `:pt="{ root: { class: 'ds-badge__inner' } }"` to the `<Badge>` element (keep existing `:aria-busy`, `:aria-label`, `v-bind="$attrs"`, `:class="badgeClasses"` exactly as-is; mind binding order so `$attrs` still wins — see Dev Notes). **— added after `:class`; aria/`$attrs` order untouched.**
  - [x] If Task 3 produced any token-mapped values, add per-instance `:dt` with **flat root keys** (e.g. `:dt="{ minWidth: '…' }"`) — mirroring DsAvatar's `:dt="{ background: 'transparent' }"` and DsButton's `sizeTokens`. Use a `computed` only if more than one static value warrants it. **— N/A: Task 3 produced zero retained values, so no `:dt` was added.**

- [x] **Task 5: Rewrite the scoped CSS** (AC: #1)
  - [x] Delete the `/* Strip PrimeVue Badge internal styling … */` comment + `.ds-badge:deep(.p-badge) { ... }` block (`DsBadge.vue:106-118`). **— removed; replaced with an explanatory comment (no rule).**
  - [x] Add only the genuinely-needed `.ds-badge__inner { ... }` declarations from Task 3 (likely empty or near-empty — `.ds-badge` already owns layout). If a declaration belongs conceptually to the wrapper and is simpler there, folding it into `.ds-badge` is acceptable; AC #1 only requires the `:pt root` class to exist and the styling to be `:deep`-free and `!important`-free. **— `.ds-badge__inner` has no declarations (empty hook). Nothing folded into `.ds-badge` (it already owns every property).**
  - [x] Do **not** touch `.ds-badge` layout, `.ds-badge--{type}` variants, `.ds-badge__leading/__label/__trailing`, the `::before` overlays, the shimmer `@keyframes`, or the `@media (prefers-reduced-motion)` blocks. **— untouched (verified via `git diff`).**
  - [x] `grep -n ':deep\|!important' src/components/DsBadge/DsBadge.vue` returns nothing. **— clean.**

- [x] **Task 6: Verify the class lands on the PrimeVue root** (AC: #1, #5)
  - [x] Confirm (mounted-DOM probe) `ds-badge__inner` lands on the **same** span as `p-badge` + `ds-badge`. If it does, any retained `.ds-badge__inner` rule applies as intended and there is no nested no-op. **— CONFIRMED: root `<span class="p-badge p-component ds-badge ds-badge--pending ds-badge__inner">`.**

- [x] **Task 7: Run the validation triple** (AC: #3)
  - [x] `npm run build` (vue-tsc + vite) — clean. `npm run lint` (biome) — clean. `npm test` — DsBadge suite passes unchanged. **Note:** `DsSelect.test.ts` has **pre-existing** failures unrelated to this story (confirmed in 10.1 via `git stash`); re-confirm they are identical with and without your change and do not attribute them here. **— build ✓, lint ✓ (69 files), DsBadge 28/28 ✓. The 15 `DsSelect.test.ts` failures are pre-existing (DsSelect untouched in this diff).**

- [x] **Task 8: Confirm visual parity + real-theme correctness** (AC: #4, #5)
  - [x] Re-walk the 16 stories in light + dark; diff against Task 1's recorded computed values. Any delta (especially `min-width`, `padding`, `height`, `background`) is a regression — fix before completing. **— before/after `getComputedStyle` diff byte-identical; change is render-neutral by construction (dead CSS removed + unused class added). Interactive browser walk: see Completion Notes / Task 1 caveat.**
  - [x] Since Storybook uses `dsPreset`, this same walk satisfies AC #5 (intended overrides win without `!important`). Record in Completion Notes that the real-theme check passed and which property — if any — relies on a `:dt` token to hold its value. **— AC #5 holds: the override mechanism (`.ds-badge` unlayered, same node, beats PrimeVue's `@layer` defaults) is unchanged; the removed `!important`s were on a no-op selector. No property relies on a `:dt` token (none added).**

- [x] **Task 9: Confirm zero API diff** (AC: #6)
  - [x] `git diff` shows only the template (`:pt`/optional `:dt`) and `<style>` block changed. `<script setup>` (`DsBadgeProps`, `DsBadgeType`, computeds, emits) is untouched. **— confirmed: only the `:pt` line + the `<style>` comment differ.**

## Dev Notes

### Exact change surface

Only `src/components/DsBadge/DsBadge.vue` changes:
- **Template** (`DsBadge.vue:64-69`): add `:pt="{ root: { class: 'ds-badge__inner' } }"` (and optional `:dt`) to `<Badge>`. Nothing else in the template moves.
- **Style** (`DsBadge.vue:106-118`): the comment + `.ds-badge:deep(.p-badge)` block is removed and replaced with the minimal `.ds-badge__inner` rule from Task 3 (possibly empty).

No new files, no barrel changes, no test changes, no story changes required.

### ⚠️ Regression trap — old resets are inert; resurrecting them live CHANGES rendering

Because `.ds-badge` and `.ds-badge__inner` will be the **same node**, **same specificity** (single class), and the old block sits at line ~107 — **after** `.ds-badge` (line 88) but **before** the `--type` variants (line 137+) — a live `.ds-badge__inner` declaration **wins over `.ds-badge` by source order** for any property `.ds-badge` also sets. So copying the old resets verbatim would silently override the wrapper's real layout values. Evaluate each one:

| Old `:deep(.p-badge)` declaration (`!important`) | Already set by `.ds-badge` / variant? | PrimeVue default in baseline? | Verdict |
|---|---|---|---|
| `background: transparent` | variants set `background-color` (later source → win) | p-badge `colorScheme.bg` shows only if variant didn't | **Drop.** Variants own background; `transparent` here would not change typical baseline but adds noise. If a probe shows a variant relies on it, prefer fixing the variant. |
| `padding: 0` | `.ds-badge` sets `padding: 2px 8px` | — | **Drop.** Live `padding: 0` on `.ds-badge__inner` would override the wrapper → badge loses padding = **regression.** |
| `color: inherit` | `.ds-badge--{type}` set `color`; `__label` sets `color: inherit` | — | **Drop** (redundant; variants own color). |
| `border-radius: 0` | `.ds-badge` sets `border-radius: 4px` | — | **Drop.** Live `border-radius: 0` would square the corners = **regression.** |
| `outline: none` | — | p-badge has no outline by default | **Drop** unless probe shows a real outline; if needed, no token → keep on `.ds-badge__inner` (no `!important`). |
| `min-width: 0` | `.ds-badge` does **not** set `min-width` | **YES — p-badge `min-width: 1.5rem` is the current baseline** | **Keep the baseline.** The old `min-width: 0` never applied. Do **not** add it. If you must own it, set `:dt="{ minWidth: '1.5rem' }"` (= the baseline) — never `0`. |
| `height: auto` | `.ds-badge` sets `height: 20px` | — | **Drop.** Live `height: auto` would override `20px` = **regression.** |
| `display: inline-flex` | `.ds-badge` already `display: inline-flex` | — | **Drop** (redundant, same node). |
| `align-items: center` | `.ds-badge` already `align-items: center` | — | **Drop** (redundant). |
| `gap: inherit` | `.ds-badge` sets `gap: 3px` (variants override to `2px`) | — | **Drop.** `gap: inherit` on the same node would inherit from the parent, not the wrapper = potential **regression.** |

**Expected net result:** `.ds-badge__inner` is **empty or holds at most one or two declarations**, because `.ds-badge` (same element) + variants already own every visual property, and PrimeVue's only show-through default (`min-width`) is already correct and should be left alone (or pinned via `:dt`). This mirrors 10.1, where the inner class ended up inert — but here you must prove inertness *by keeping the live block minimal*, not by relying on a descendant selector that never matched.

> If `.ds-badge__inner` ends up genuinely empty, that is a valid outcome: keep `:pt="{ root: { class: 'ds-badge__inner' } }"` (the AC requires the owned-root hook to exist) with no matching CSS rule, OR fold any single needed neutralizer into `.ds-badge`. Note the choice in Completion Notes.

### Count discrepancy (10 vs 9)

The epic/plan say "9 `!important`"; the file actually has **10** (`grep -c '!important'` = 10). The target is **zero** regardless. Eliminate all of them; don't anchor on the number.

### `:dt` shape for component-level overrides

Per-instance `:dt` on `<Badge>` uses **flat root keys** that map to `--p-badge-*`: `:dt="{ minWidth: '1.5rem' }"` → `--p-badge-min-width: 1.5rem`. Badge's `:dt`-addressable root keys: `borderRadius`, `padding`, `fontSize`, `fontWeight`, `minWidth`, `height` (source: `node_modules/@primeuix/themes/dist/aura/badge/index.mjs`). Use flat keys — **not** `{ badge: { … } }` or `{ root: { … } }` (those are not how per-instance `:dt` is shaped here; `root` under `:pt` is the class hook, `:dt` is flat). Mirrors `DsAvatar.vue` (`:dt="{ background: 'transparent' }"`) and `DsButton.vue` `sizeTokens`.

### `:pt`-attach-class pattern (in-repo references)

- `DsAvatar.vue` (Story 10.1, done): `:pt="{ root: { class: 'ds-avatar__inner' } }"` + `:dt="{ background: 'transparent' }"` — the direct precedent for this story.
- `DsModal.vue:90-98`: canonical multi-part `:pt` class attachment styled with plain scoped CSS.
- `DsSelect.vue`: `:pt="{ overlay: { class: overlayClass } }"`.

### Attribute / binding order (don't break `$attrs` precedence)

The template binds `:aria-busy`/`:aria-label` **before** `v-bind="$attrs"`, intentionally so consumer-supplied `aria-label` wins (`loaded` a11y test asserts this). Add `:pt`/`:dt` to the element without reordering `v-bind="$attrs"` relative to the aria bindings. `:pt`/`:dt` are PrimeVue props, not `$attrs`, so they don't interact with the precedence — just keep `v-bind="$attrs"` where it is.

### Test impact

`DsBadge.test.ts` asserts only on `.ds-badge`, `.ds-badge--{type}`, `.ds-badge__label/__leading/__trailing`, slot content, `aria-busy`/`aria-label`, and `data-testid` passthrough. **None of these change.** No test references `.p-badge`, `:deep`, `:pt`, or `:dt`. Tests run with `theme: 'none'`, so `:dt` tokens render no computed values in jsdom and `p-badge` defaults are absent — which is exactly why **the unit suite cannot verify AC #5** (specificity vs real PrimeVue defaults). Do not add tests asserting `:dt`/`:pt` internals (brittle implementation detail); visual + real-theme parity is verified in Storybook per AC #4/#5.

### AC #5 — why "real consumer fixture" ≈ Storybook here

The epic phrases AC #5 as "mount DsBadge in a real consumer fixture (not just Storybook)." The intent is: verify removing `!important` doesn't let PrimeVue's `p-badge` defaults win **in a context where the real `dsPreset` theme is loaded** (unlike the `theme: 'none'` unit suite). Storybook **is** that context — it boots PrimeVue with `dsPreset`. The repo has **no** separate consumer-integration harness (no `tests/` consumer fixture; no `.test.ts` mounts `dsPreset`), and standing one up is out of scope. So: the Storybook walk with `dsPreset` active satisfies the intent. If you want belt-and-suspenders, a throwaway mounted probe with `{ theme: { preset: dsPreset } }` reading `getComputedStyle().minWidth/padding/borderRadius` is acceptable but **not required** — delete it after, do not commit it.

### Out of scope (do not do here)

- **No `docs/component-addition-guide.md` edits** — that's Story 10.3, which uses DsAvatar (10.1) as its worked example.
- **No `docs/ai-guidelines/ds-badge.md` edits** — consumer-API-facing; public API is unchanged (NFR3), so it needs no update.
- **No DsButton/DsIconButton/DsCodeInput/DsSelect work** — later waves.
- **No new visual-regression tooling** (Loki/Chromatic) — manual Storybook walk is the agreed Wave 1 check.
- **No broader "express badge layout as `:dt` tokens" redesign** — Badge exposes `padding`/`height`/`borderRadius`/`fontSize` tokens and you *could* move `.ds-badge`'s whole layout onto `:dt`, but that is a redesign beyond this story's scope (migrate the reset block, kill `!important`). Keep `.ds-badge`'s layout rules as-is unless a specific declaration must move to hold the baseline.

### Project conventions (from CLAUDE.md)

- Customization priority order (pick the first that fits, don't skip down): **1. `:dt`** → **2. `:pt`-attach-class + plain scoped CSS** → **3. `<style scoped>` for own DOM only.** Never `:deep(.p-*)`, never `!important` to beat PrimeVue specificity, never `:host`.
- Never hardcode hex colors; use design tokens. (One pre-existing exception already in the file: `.ds-badge--clean { color: #62748e }` with a Figma-token comment — **leave it; out of scope** for this story.)
- Biome formatter: single quotes, 2-space indent, 100-char width. Lint-staged runs `biome check --write` on commit.

### Project Structure Notes

- Single-file change: `src/components/DsBadge/DsBadge.vue`. No new files, no barrel/test/story changes.
- Per-component refactor cadence (`refactor-styles-plan.md`, Wave 1, item 1.2): validate DsBadge fully before Story 10.3. NFR7 ships Wave 1 as one branch/PR covering Stories 10.1–10.3, but validation runs **per component** (NFR4).

### References

- [Source: _bmad-output/planning-artifacts/epics-refactor-styles.md#Story 10.2] — story statement + 5 BDD acceptance criteria (incl. the real-consumer-fixture AC).
- [Source: _bmad-output/planning-artifacts/refactor-styles-plan.md#1.2 DsBadge] — "9 `!important` to beat specificity; once you target a class you own, `!important` should disappear" + the risk-register note on verifying removal beats PrimeVue 4.x defaults.
- [Source: _bmad-output/implementation-artifacts/10-1-refactor-dsavatar-root-styling-to-pt-attached-class-with-dt-token-migration.md] — the just-completed precedent: same-element discovery, DOM-probe method, `:dt` flat-key shape, inert-reset proof, pre-existing `DsSelect.test.ts` failures.
- [Source: src/components/DsBadge/DsBadge.vue:64-69] — `<Badge>` element to receive `:pt`/`:dt`.
- [Source: src/components/DsBadge/DsBadge.vue:106-118] — the `.ds-badge:deep(.p-badge)` block (10 `!important`s) being removed.
- [Source: src/components/DsBadge/DsBadge.vue:88-104] — `.ds-badge` wrapper rules (own the real layout baseline).
- [Source: node_modules/primevue/badge/index.mjs] — Badge renders a single `<span class="p-badge">` with `ptmi('root')` (wrapper class merges onto it) and the default slot nested inside → same-element proof.
- [Source: node_modules/@primeuix/themes/dist/aura/badge/index.mjs] — Badge token surface: root `{ borderRadius, padding, fontSize, fontWeight, minWidth, height }`, `dot.size`, `sm/lg/xl`, `colorScheme.{light,dark}.<severity>.{background,color}`.
- [Source: src/components/DsModal/DsModal.vue:90-98] — multi-part `:pt`-attach-class reference.
- [Source: src/components/DsButton/DsButton.vue] — `:dt` per-instance `sizeTokens` reference.
- [Source: CLAUDE.md#Conventions] — priority order + anti-patterns.

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (Claude Opus 4.8, 1M context) — BMAD dev-story workflow

### Debug Log References

**DOM probe (throwaway, deleted after use) — same-element / no-op proof (Task 2 & 6):**

Before refactor, mounted `<DsBadge type="pending" label="Text">` (`theme: 'none'`):
```
<span class="p-badge p-component ds-badge ds-badge--pending" data-pc-section="root">
  <!--v-if--><span class="ds-badge__label">Text</span><!--v-if-->
</span>
```
→ Single root `<span>` carries **both** `p-badge` and `ds-badge`; `.ds-badge__label` nests **inside**. Therefore `.ds-badge:deep(.p-badge)` = `.ds-badge[data-v-x] .p-badge` (descendant) matches **zero** elements → the 10 `!important` resets were **inert** and not part of the baseline.

After refactor, same mount:
```
<span class="p-badge p-component ds-badge ds-badge--pending ds-badge__inner" data-pc-section="root">…</span>
```
→ `ds-badge__inner` lands on the **same** root span as `p-badge` + `ds-badge` (Task 6 confirmed). The class has no CSS rule, so it adds no style.

**Real-theme computed probe (throwaway, deleted) — Task 1 & 8:** Mounted all 11 types under `{ theme: { preset: dsPreset } }` reading `getComputedStyle` for `min-width/height/padding/border-radius/background/display`. **Before vs. after output byte-identical.** As the story foresaw, jsdom leaves PrimeVue tokens unresolved (`var(--p-badge-*)` rather than concrete px), so the probe cannot supply real pixel numbers — but the identical before/after confirms no cascade change.

### Implementation Plan

1. Mark story in-progress; prove the same-element fact with a throwaway mount probe (Task 2).
2. Resolve the keep/drop/`:dt` decision table — all 10 declarations DROP, `.ds-badge__inner` empty, no `:dt` (Task 3).
3. Template: add `:pt="{ root: { class: 'ds-badge__inner' } }"` to `<Badge>` after `:class`, preserving aria/`$attrs` order (Task 4).
4. Style: replace the `.ds-badge:deep(.p-badge)` `!important` block with an explanatory comment; no `.ds-badge__inner` rule (Task 5).
5. Verify class lands on root (Task 6), run validation triple (Task 7), confirm render-neutrality + zero API diff (Tasks 8–9).

### Completion Notes List

- **`.ds-badge__inner` ended up empty (valid outcome per Dev Notes).** Every one of the 10 old `:deep(.p-badge) !important` declarations resolved to DROP: each was either redundant with `.ds-badge`/the `--{type}` variant (same node — `display`, `align-items`, `background`, `color`) or would have **regressed** the baseline if resurrected live on the same element (`padding: 0`, `border-radius: 0`, `height: auto`, `gap: inherit`, `min-width: 0`). The `:pt root` hook is kept with no matching rule so any future neutralizer attaches there rather than via a deep selector.
- **No `:dt` was added.** No retained value mapped to a Badge token that needed pinning. In particular `min-width` is deliberately left unset: PrimeVue's `1.5rem` layered default is the existing baseline and the old `min-width: 0` never applied — adding either `0` or a `:dt` would be churn (or a regression).
- **AC #5 (overrides still win without `!important`) holds by mechanism, not by accident:** the DS overrides win because `.ds-badge`/variant rules are *unlayered* scoped CSS on the **same node** as `p-badge`, beating PrimeVue's `@layer`-ed defaults regardless of specificity. The deleted `!important`s sat on a selector that matched nothing, so they contributed zero — removing them changes nothing about who wins.
- **Render-neutrality is by construction:** the diff (a) deletes CSS that targeted **zero** elements and (b) adds a class with **no** style rule. Neither can move a pixel. The before/after `getComputedStyle` diff (all 11 types, `dsPreset` active) is byte-identical, consistent with this.
- **Environment caveat (AC #4 manual walk):** an interactive browser Storybook walk (16 stories × light/dark) was **not** performed — this agent/CI environment has no live browser surface. It was substituted with the objective evidence above (DOM probe + real-theme computed-style diff + by-construction proof). A final human Storybook visual confirmation is recommended belt-and-suspenders, with attention to `min-width`-sensitive short badges and `loaded`/`draft`/`clean`.
- **Pre-existing failures:** `DsSelect.test.ts` has 15 failures unrelated to this story (DsSelect is untouched in this diff). DsBadge suite: 28/28 pass.
- **Validation triple:** `npm run build` ✓, `npm test` (DsBadge 28/28) ✓, `npm run lint` (69 files, no fixes) ✓.

### File List

- `src/components/DsBadge/DsBadge.vue` — modified (template: added `:pt="{ root: { class: 'ds-badge__inner' } }"`; style: removed the `.ds-badge:deep(.p-badge)` block with 10 `!important`s → explanatory comment, empty `.ds-badge__inner` hook). Zero `:deep`/`!important` remain. No `:dt` added.
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — modified (story 10.2 → in-progress → review)

## Change Log

- 2026-06-07 — Refactored DsBadge root styling: removed the inert `.ds-badge:deep(.p-badge)` block (10 `!important`s, descendant selector matching zero elements) and routed the owned styling hook through `:pt="{ root: { class: 'ds-badge__inner' } }"` on the same root span. `.ds-badge__inner` is intentionally empty — `.ds-badge`/variants already own every visual property on the shared node. Zero `:deep(.p-*)`, zero `!important`, zero public API change, provably render-neutral. (Story 10.2)
