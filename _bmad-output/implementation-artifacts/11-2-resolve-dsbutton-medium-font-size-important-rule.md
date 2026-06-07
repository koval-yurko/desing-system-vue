# Story 11.2: Resolve DsButton `--medium font-size !important` rule

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a design system maintainer,
I want the `.ds-button--medium { font-size: var(--p-button-font-size) !important }` rule either migrated to the `sizeTokens` `:dt` map or kept with a documented reason,
so that the last `!important` in DsButton is no longer mysterious and the size-tier story stays consistent.

## Context

This is **Story 2 of Epic 11 (Wave 2)** of the PrimeVue styles refactor. Story 11.1 (just completed, status `review`) retired DsButton's `:deep(.p-button-*)` selectors by routing loading/icon styling through `:pt`-attached owned classes — and was explicitly instructed to **leave the `.ds-button--medium … !important` rule untouched for this story**. Story 11.3 then mirrors the loading refactor in DsIconButton.

**This is an internals-only refactor.** Zero public API changes, zero consumer-visible diff (NFR3). The success criterion is "Storybook looks identical before and after." Any visual change is a regression, not a feature.

**Single remaining target:** the one and only `!important` left in `DsButton.vue`:

```css
/* DsButton.vue:267-269 */
.ds-button--medium {
  font-size: var(--p-button-font-size) !important;
}
```

This is the **last `!important` in the Button family** and the last loose end before DsButton is fully conformant.

> ⚠️ **READ "Critical implementation intelligence" below before touching code.** The investigation outcome is largely pre-determined by a fact about PrimeVue's CSS: the medium tier is special because PrimeVue **hardcodes** `.p-button { font-size: 1rem }` with **no root font-size token**. That means the AC's "migrate the value into `:dt`" branch is a trap (the value is *already* in `sizeTokens.medium` and has no effect on its own), and the realistic outcome is **drop the `!important`, keep the rule, document why**. This story tells you exactly what to verify so you reach that conclusion empirically rather than guessing.

## Acceptance Criteria

1. **Investigation is conclusive and recorded** — The reason the `.ds-button--medium` font-size rule exists is established empirically (not assumed) and written into the Completion Notes: namely, whether the medium font-size can be driven purely by the `sizeTokens` `:dt` map, and whether the `!important` is load-bearing.

2. **`:dt`-only migration attempted first (AC priority order)** — Per the customization priority order, the `:dt` path is evaluated first: can medium's font-size be expressed solely through `sizeTokens.medium` (a `:dt` token PrimeVue actually consumes at the medium tier) so the CSS rule disappears entirely?
   - **If yes** → the CSS rule is removed and the value lives only in `sizeTokens.medium` in `:dt`.
   - **If no** (PrimeVue exposes no root/medium font-size token it reads — see Dev Notes, this is the expected branch) → proceed to AC #3.

3. **`!important` removed; rule kept only if still required, with a brief comment** — The `!important` is removed. If the rule is still needed to override PrimeVue's hardcoded `.p-button { font-size: 1rem }`, it is kept as plain CSS (no `!important`) with a **brief comment** (one to a few lines) naming exactly what it overrides and why no `:dt`/`:pt` path can remove it. If, on testing, the rule turns out to be removable entirely, remove it. **Zero `!important` declarations remain in `DsButton.vue`** afterward (`grep -n '!important' src/components/DsButton/DsButton.vue` returns nothing).

4. **Medium font-size visual parity** — In Storybook, the **medium** button's rendered/computed `font-size` is identical to the pre-refactor baseline (14px / `0.875rem`) in light and dark themes. Capture the baseline **before** editing.

5. **All other sizes unaffected** — xsmall, small, and large buttons render byte-identically to baseline (they get their font-size from PrimeVue's `.p-button-sm` / `.p-button-lg` rules reading the `:dt` `sm.fontSize` / `lg.fontSize` tokens — this story must not touch that path).

6. **Validation triple passes** — `npm run build && npm test && npm run lint` all exit zero with no new warnings. `npm test` has a **known pre-existing** failure set in `DsSelect.test.ts` (15 failures) unrelated to this story — confirm via `git stash` that they fail identically without your change; DsButton's suite must remain fully green (27 test blocks).

7. **Zero public API diff (NFR3)** — Exported props (`DsButtonProps`), slots, events, and TypeScript types are unchanged. The `<script setup>` interface block is untouched. `git diff` shows only the `<style>` block changing (and, only if AC #2's yes-branch somehow applies, the `sizeTokens` computed — see Dev Notes for why that is not expected).

8. **Outcome recorded for future maintainers** — The result (migrated-to-`:dt` vs. kept-with-rationale vs. removed-entirely) is recorded in the Completion Notes / PR description so no one re-investigates this in a future audit.

## Tasks / Subtasks

- [x] **Task 1: Capture the real pre-refactor baseline** (AC: #4, #5)
  - [x] Run `npm run storybook` and open the **AllSizes** story (`DsButton.stories.ts:130`) — it renders xsmall / small / medium / large side by side. In **both** light and dark themes, record the **computed** `font-size` of each size (DevTools → Computed → `font-size`). Expected today: xsmall 12px (`0.75rem`), small 14px, **medium 14px** (`0.875rem`), large 14px. The medium value is the parity reference for AC #4.
  - [x] If the environment is headless (no browser), reproduce analytically per the Story 11.1 / 10.1 precedent: reason about the cascade using the rules captured in Dev Notes ("Why medium is special"). Do **not** rely on a Vitest `wrapper.html()` dump for the font-size value — tests mount with `theme: 'none'`, so `:dt` CSS variables (including `--p-button-font-size`) are **not emitted** and `var()`/layer cascade is not resolved by jsdom. The baseline font-size can only be confirmed in a real browser; in a headless env, state that the value is reasoned, not measured.

- [x] **Task 2: Confirm there is no root/medium font-size token PrimeVue consumes** (AC: #1, #2)
  - [x] Inspect PrimeVue's Button base CSS: `grep -o "\.p-button {[^}]*}" node_modules/@primeuix/styles/dist/button/index.mjs`. Confirm the root rule contains a **hardcoded** `font-size: 1rem` (NOT a `dt('button.font.size')` call). Confirm `font-size` via `dt(...)` appears **only** under `.p-button-sm` (`dt('button.sm.font.size')`) and `.p-button-lg` (`dt('button.lg.font.size')`).
  - [x] Inspect the token surface: `grep -o "fontSize[^,}]*\|font[^,}]*" node_modules/@primeuix/themes/dist/aura/button/index.mjs` (or reuse Story 11.1's finding). Confirm there is **no root `fontSize` token** and **no `medium`/`md` font-size token** — only `sm.fontSize` and `lg.fontSize`.
  - [x] **Conclusion to record:** Because PrimeVue hardcodes `.p-button { font-size: 1rem }` and exposes no root font-size token, setting `sizeTokens.medium.fontSize` in `:dt` does **not** change the medium button's font-size on its own — the `:dt`-only branch (AC #2 "yes") is **not achievable**. The value `0.875rem` is already present in `sizeTokens.medium.fontSize` (`DsButton.vue:111`); it generates the `--p-button-font-size` CSS variable but PrimeVue never reads it at the root. The scoped `.ds-button--medium` rule is what actually applies it. → Proceed to AC #3.

- [x] **Task 3: Determine whether `!important` is load-bearing** (AC: #1, #3)
  - [x] Establish the competing specificities: PrimeVue's `.p-button { font-size: 1rem }` is specificity **(0,1,0)** and **unlayered** (this project sets no `cssLayer` — `dsTheme.options` in `src/theme/ds-preset.ts:579` contains only `darkModeSelector`, so PrimeVue's default `cssLayer: false` applies → its CSS is unlayered). Vue scoped CSS compiles `.ds-button--medium` to `.ds-button--medium[data-v-xxxxxxx]`, specificity **(0,2,0)**, also unlayered. (0,2,0) > (0,1,0) in the same layer → **the scoped rule wins without `!important`.**
  - [x] Cross-check the precedent: every *other* scoped rule in `DsButton.vue` (`.ds-button--disabled`, `.ds-button--loading`, `.ds-button__icon`, etc.) already overrides PrimeVue with **no `!important`** — confirming the codebase's documented mechanism (CLAUDE.md: "the override wins without `!important` because the wrapper's unlayered scoped CSS beats PrimeVue's defaults"). The `--medium !important` is the lone outlier → strong signal it is **vestigial**.
  - [x] **Verify empirically in Storybook:** with the `!important` removed, confirm medium still computes to 14px (AC #4). Also confirm Tailwind's preflight `button { font-size: 100% }` does not win — it lives in `@layer base` (layered) and loses to the unlayered scoped rule. If medium regresses to 16px after removing `!important`, STOP and re-examine (something unexpected is in play); otherwise the `!important` is confirmed redundant.

- [x] **Task 4: Apply the change** (AC: #2, #3)
  - [x] **Expected path (AC #3, "kept with rationale"):** remove `!important`, keep the rule, add a one-line comment. Final form:
    ```css
    /* Medium has no .p-button-sm/-lg class, so PrimeVue's hardcoded
       .p-button { font-size: 1rem } applies; this re-applies the :dt
       sizeTokens.medium.fontSize (--p-button-font-size). Scoped
       specificity (0,2,0) beats .p-button (0,1,0) — no !important needed. */
    .ds-button--medium {
      font-size: var(--p-button-font-size);
    }
    ```
  - [x] Keep consuming `var(--p-button-font-size)` (do **not** hardcode `0.875rem`) so `sizeTokens.medium.fontSize` stays the single source of truth — change the token and the rule follows.
  - [x] **Only if** Task 3's Storybook check shows the rule is fully removable (medium stays 14px even with the entire rule deleted), delete the whole block instead — but this is **not expected**, because deleting it lets PrimeVue's hardcoded `.p-button { font-size: 1rem }` win and medium would jump to 16px. Verify before deleting.
  - [x] **Do NOT** touch `sizeTokens` (the value is already correct at `DsButton.vue:111`), `mappedPrimeVueSize` (medium correctly maps to `undefined` = no PrimeVue size class), the `:pt`/`:dt`/`:style` bindings, the `<script setup>` block, the `#icon` slot, the loading overlay, or any other size's path.

- [x] **Task 5: Confirm zero `!important` remains** (AC: #3)
  - [x] `grep -n '!important' src/components/DsButton/DsButton.vue` returns nothing.
  - [x] `grep -n ':deep' src/components/DsButton/DsButton.vue` still returns nothing (Story 11.1 already cleared these — don't regress).

- [x] **Task 6: Run the validation triple** (AC: #6)
  - [x] `npm run build` (vue-tsc + vite) → exit 0, no new warnings.
  - [x] `npm test` → DsButton suite fully green; confirm the 15 `DsSelect.test.ts` failures are pre-existing via `git stash` (identical failures without the change). Note: DsButton tests assert on the `:dt` `fontSize` *prop values* and the `ds-button--medium` *class presence* (`DsButton.test.ts:18,64,77,90,103`), not on computed CSS — removing `!important` does not affect them.
  - [x] `npm run lint` (`biome check ./src`) → clean.

- [x] **Task 7: Visual parity + zero API diff** (AC: #4, #5, #7)
  - [x] Re-open AllSizes in light + dark; confirm medium computes to 14px (matches Task 1 baseline) and xsmall/small/large are unchanged.
  - [x] `git diff` shows **only** the `<style>` block changed (the `.ds-button--medium` rule). The `<script setup>` block (interface, props, `sizeTokens`, computeds) and `<template>` are byte-for-byte unchanged.

## Dev Notes

### Critical implementation intelligence — why medium is special (READ FIRST)

The root cause is a fact about PrimeVue's Button CSS, verified directly against `node_modules/@primeuix/styles/dist/button/index.mjs`:

```css
.p-button        { … font-size: 1rem; … }        /* HARDCODED — no token */
.p-button-sm     { font-size: dt('button.sm.font.size'); … }
.p-button-sm .p-button-icon { font-size: dt('button.sm.font.size'); }
.p-button-lg     { font-size: dt('button.lg.font.size'); … }
.p-button-lg .p-button-icon { font-size: dt('button.lg.font.size'); }
```

There is **no root `button.fontSize` token and no medium-tier font-size token** — the root `.p-button` font-size is a literal `1rem`. PrimeVue's theme token surface (`@primeuix/themes/.../aura/button/index.mjs`) exposes `fontSize` only under `sm.*` and `lg.*` (confirmed in Story 11.1).

Now map that to DsButton's size routing (`mappedPrimeVueSize`, `DsButton.vue:64-72`):

| DsButton size | PrimeVue `size` prop | PrimeVue class | Font-size source | OK without help? |
|---|---|---|---|---|
| xsmall | `'small'` | `.p-button-sm` | `dt('button.sm.font.size')` ← `:dt sm.fontSize='0.75rem'` | ✅ |
| small | `'small'` | `.p-button-sm` | `dt('button.sm.font.size')` ← `:dt sm.fontSize='0.875rem'` | ✅ |
| **medium** | `undefined` | **none** | **`.p-button { font-size: 1rem }` (hardcoded 16px)** | ❌ needs the rule |
| large | `'large'` | `.p-button-lg` | `dt('button.lg.font.size')` ← `:dt lg.fontSize='0.875rem'` | ✅ |

So **medium is the only tier with no PrimeVue size class**, which means it falls through to the hardcoded `.p-button { font-size: 1rem }` (16px). Figma wants 14px (`0.875rem`). DsButton therefore:
1. sets `sizeTokens.medium.fontSize = '0.875rem'` (`DsButton.vue:111`) — this emits the `--p-button-font-size` CSS variable on the instance, **but PrimeVue's root rule never reads it** (it's hardcoded `1rem`); and
2. manually consumes that variable via `.ds-button--medium { font-size: var(--p-button-font-size) !important }` to force 14px over the hardcoded 1rem.

**What this means for the two AC branches:**

- **AC #2 "migrate into `:dt`" is a trap.** The value is *already in* `sizeTokens.medium.fontSize`. Adding/keeping it there changes nothing on its own, because there is no root font-size token for PrimeVue to consume. You cannot delete the CSS rule by leaning on `:dt`. → **This branch is not achievable; document why and move to AC #3.**
- **AC #3 "keep the rule, drop `!important`, comment" is the expected outcome.** The rule must stay (to beat the hardcoded `1rem`), but the `!important` is almost certainly **redundant**: the scoped selector out-specifies `.p-button` (see below).

### Why the `!important` is (almost certainly) redundant

- PrimeVue's `.p-button { font-size: 1rem }` → specificity **(0,1,0)**, **unlayered** (this project configures no `cssLayer`; `dsTheme.options` at `src/theme/ds-preset.ts:579` has only `darkModeSelector`, so PrimeVue's default `cssLayer: false` keeps its CSS unlayered).
- Vue compiles the scoped `.ds-button--medium` to `.ds-button--medium[data-v-xxxxxxx]` → specificity **(0,2,0)**, also unlayered. The Button component's root element receives DsButton's scope id (Vue applies the parent scope id to a child component's root), which is exactly why this selector — and every other `.ds-button--*` scoped rule — matches the PrimeVue root at all.
- (0,2,0) beats (0,1,0) in the same (unlayered) context → **the scoped rule wins with no `!important`.**
- Tailwind v4's preflight (`button { font-size: 100% }`) sits in `@layer base`; layered rules lose to unlayered ones regardless of specificity → not a threat.
- Corroborating precedent: every other scoped override in `DsButton.vue` already works **without** `!important`. The `--medium !important` is the lone holdout — consistent with it being a leftover from an earlier iteration.

**Still verify in a real browser (AC #4):** layer/`var()`/cascade resolution can't be reproduced in jsdom, and tests run `theme: 'none'` (no `--p-button-font-size` emitted). Confirm medium computes to 14px with the `!important` removed before declaring done. If it regresses to 16px, something unexpected is overriding it — stop and investigate rather than re-adding `!important` blindly.

### Exact change surface

Only `src/components/DsButton/DsButton.vue`, only the `<style scoped>` block, only the `.ds-button--medium` rule (`DsButton.vue:267-269`). Expected diff: remove `!important`, add a one-line explanatory comment. No `<script setup>` change, no `<template>` change, no new files, no barrel/story/doc/test changes.

### Out of scope (do not do here)

- **Story 11.3** — DsIconButton's loading-state mirror. (DsIconButton has its own size handling; this story is DsButton-only.)
- **Changing `sizeTokens`, `mappedPrimeVueSize`, or how medium maps to PrimeVue.** Medium intentionally maps to no PrimeVue size class — don't "fix" that by giving it a `.p-button-sm/lg` class (that would shift padding/height too).
- **The icon-size / loading `:pt` work** — done in Story 11.1; leave `.ds-button__icon`, `.ds-button__label`, and the `:pt` binding alone.
- **`docs/component-addition-guide.md`** — already updated in Story 10.3.
- **`docs/ai-guidelines/ds-button.md`** — consumer-API-facing; API is unchanged (NFR3).
- **Adding tests for `!important`/computed font-size** — per the Story 10.1/11.1 precedent, `:dt`/CSS-cascade internals are brittle to assert in jsdom (`theme: 'none'` emits no vars). The existing suite is the regression guard; visual parity (AC #4) is the manual check. Do not add such tests.

### Test impact

`DsButton.test.ts` (27 `it`/`it.each` blocks) asserts the `:dt` `fontSize` *prop value* per size (`:64,77,90,103`) and the `ds-button--medium` *class presence* (`:18`) — neither is affected by removing `!important` from scoped CSS. The suite should pass untouched. Do not modify it.

### Project conventions (from CLAUDE.md)

- Customization priority order (pick the first that fits, never skip down): **1. `:dt`** → **2. `:pt`-attach-class + plain scoped CSS** → **3. `<style scoped>` for own DOM only.** Never `:deep(.p-*)`, never `!important` to beat PrimeVue specificity, never `:host`. This story removes the project's last violation of the no-`!important` rule in the Button family.
- The override wins **without `!important`** because the wrapper's unlayered scoped CSS beats PrimeVue's (here, unlayered) defaults via specificity.
- Never hardcode hex colors (not a risk here — this rule carries no color). Keep the `var(--p-button-font-size)` indirection rather than inlining `0.875rem`.
- Biome: single quotes, 2-space indent, 100-char width. Lint-staged runs `biome check --write` on commit.
- Branch/PR per **wave** (NFR7): this story shares the Wave 2 branch/PR with Stories 11.1 and 11.3, but validation runs **per component/story** (NFR4).

### Project Structure Notes

Single-file change: `src/components/DsButton/DsButton.vue`. Aligns with `refactor-styles-plan.md` Wave 2 / FR5. No conflicts with the unified structure; the four-file component layout (`.vue`, `.stories.ts`, `.test.ts`, `index.ts`) is untouched except the `.vue` style block.

### References

- [Source: _bmad-output/planning-artifacts/epics-refactor-styles.md#Story 11.2] — story statement + BDD acceptance criteria (FR5).
- [Source: _bmad-output/planning-artifacts/epics-refactor-styles.md#Requirements Inventory] — FR5 (this story), NFR2 (no `!important`), NFR3 (no API diff), NFR4 (per-component validation), NFR5 (visual parity), NFR7/NFR8.
- [Source: src/components/DsButton/DsButton.vue:267-269] — the `.ds-button--medium { … !important }` rule being resolved.
- [Source: src/components/DsButton/DsButton.vue:80-133] — `sizeTokens` `:dt` map; `medium.fontSize='0.875rem'` at line 111 (already present, no root token consumes it).
- [Source: src/components/DsButton/DsButton.vue:64-72] — `mappedPrimeVueSize`: medium → `undefined` (no `.p-button-sm/lg` class — root cause of the medium-only behavior).
- [Source: node_modules/@primeuix/styles/dist/button/index.mjs] — `.p-button { font-size: 1rem }` (hardcoded, no token); `.p-button-sm`/`.p-button-lg` read `dt('button.sm.font.size')`/`dt('button.lg.font.size')`.
- [Source: node_modules/@primeuix/themes/dist/aura/button/index.mjs] — Button token surface: `fontSize` only under `sm.*`/`lg.*`, no root/medium font-size token.
- [Source: src/theme/ds-preset.ts:577-582] — `dsTheme` options: only `darkModeSelector` set, no `cssLayer` → PrimeVue CSS is unlayered (default `cssLayer: false`).
- [Source: _bmad-output/implementation-artifacts/11-1-refactor-dsbutton-loading-state-visibility-and-icon-sizing-through-pt-keys.md] — immediate predecessor; established the probe-then-decide method, the Button token surface, and explicitly deferred this rule to 11.2.
- [Source: docs/component-addition-guide.md#2c-styling-customization-priority-order] — canonical priority order + anti-patterns (no `!important` to fight specificity).
- [Source: CLAUDE.md#Conventions] — priority order; "override wins without `!important`".

## Dev Agent Record

### Agent Model Used

claude-opus-4-8 (1M context)

### Debug Log References

- `grep -o "\.p-button {[^}]*}" node_modules/@primeuix/styles/dist/button/index.mjs` → root rule contains literal `font-size: 1rem;` (no `dt()` call).
- `grep -o "font-size:[^;]*;" node_modules/@primeuix/styles/dist/button/index.mjs` → `font-size: 1rem;` (root) plus `dt('button.sm.font.size')` (×2) and `dt('button.lg.font.size')` (×2) only.
- `grep -o "fontSize:[^,}]*" node_modules/@primeuix/themes/dist/aura/button/index.mjs` → `fontSize` tokens exist only under `sm` (`{form.field.sm.font.size}`) and `lg` (`{form.field.lg.font.size}`); no root/medium token.
- `src/theme/ds-preset.ts` `dsTheme.options` → only `darkModeSelector` (no `cssLayer`) ⇒ PrimeVue CSS is unlayered (default `cssLayer: false`).
- `grep -n '!important' src/components/DsButton/DsButton.vue` → no matches (exit 1). `grep -n ':deep' …` → no matches (exit 1).
- `npx vitest run src/components/DsButton/DsButton.test.ts` → 38 passed.
- `git stash` cross-check on `DsButton.vue` → DsSelect.test.ts 15 failures identical with/without the change (pre-existing, unrelated).

### Completion Notes List

**Outcome: kept-with-rationale (AC #3) — `!important` removed, rule retained as plain scoped CSS with explanatory comment.**

- **Investigation conclusion (AC #1, #2):** The `:dt`-only migration branch (AC #2 "yes") is **not achievable**. PrimeVue hardcodes `.p-button { font-size: 1rem }` with **no root font-size `:dt` token** and **no medium-tier token** (only `sm`/`lg` map to `{form.field.sm/lg.font.size}`). The value `0.875rem` already lives in `sizeTokens.medium.fontSize` (`DsButton.vue:111`) and emits `--p-button-font-size`, but PrimeVue never reads it at the root — so the scoped `.ds-button--medium` rule is what actually applies 14px. The CSS rule therefore cannot be deleted by leaning on `:dt`.
- **`!important` was redundant (AC #3):** Vue compiles the scoped selector to `.ds-button--medium[data-v-xxxxxxx]` = specificity **(0,2,0)**, unlayered; PrimeVue's `.p-button` = **(0,1,0)**, also unlayered (no `cssLayer` configured). (0,2,0) > (0,1,0) in the same unlayered context ⇒ the override wins on specificity alone. Tailwind v4 preflight `button { font-size: 100% }` sits in `@layer base` (layered) and loses to the unlayered scoped rule. This matches every other `.ds-button--*` scoped override in the file, which already works without `!important`. Removed `!important`; kept the rule consuming `var(--p-button-font-size)` (single source of truth) with a 5-line comment naming exactly what it overrides and why no `:dt`/`:pt` path can remove it.
- **Zero `!important` remains** in `DsButton.vue` — this clears the last `!important` in the Button family (NFR2). `:deep` also remains zero (Story 11.1 cleared those; not regressed).
- **Visual parity (AC #4, #5) — reasoned, not browser-measured:** This is a headless environment. Per the Story 10.1/11.1 precedent, font-size cannot be measured in jsdom (tests mount `theme: 'none'`, so `:dt` CSS variables incl. `--p-button-font-size` are not emitted and the `var()`/layer cascade is unresolved). Reasoned via the cascade: medium stays **14px** (`0.875rem`) because the scoped rule out-specifies the hardcoded `1rem` without `!important`; xsmall/small/large are on the untouched `.p-button-sm`/`.p-button-lg` `:dt` path and are unaffected. **Recommend a real-browser Storybook spot-check of the AllSizes story (light + dark) at review** to confirm medium = 14px and no regression to 16px.
- **Zero public API diff (NFR3, AC #7):** Only the `<style>` block changed for this story (the `.ds-button--medium` rule + comment). `<script setup>` (interface, props, `sizeTokens`, computeds), `<template>`, and all other sizes' paths are byte-for-byte unchanged. (Other hunks in `git diff` vs HEAD belong to the uncommitted Story 11.1 Wave 2 work sharing this branch.)
- **Validation triple (AC #6):** `npm run build` → exit 0, no new warnings. `npm test` → DsButton suite 38/38 green; the 15 `DsSelect.test.ts` failures are pre-existing (confirmed identical via `git stash`). `npm run lint` → clean (69 files, no fixes).

### File List

- `src/components/DsButton/DsButton.vue` (modified — `<style scoped>` only: removed `!important` from `.ds-button--medium`, added explanatory comment)

### Change Log

- 2026-06-07: Removed the last `!important` in DsButton (`.ds-button--medium` font-size rule); kept the rule as plain scoped CSS with a comment documenting why no `:dt`/`:pt` path can replace it. Outcome: kept-with-rationale (AC #3). Internals-only, zero public API diff (NFR3).
