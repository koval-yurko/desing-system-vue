# Story 11.3: Mirror DsButton's loading-state refactor in DsIconButton

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a design system maintainer,
I want DsIconButton free of `:deep(.p-button-*)` patches so the Button family is internally consistent with the conformed DsButton,
so that DsIconButton survives PrimeVue upgrades without specificity wars and the last `:deep(.p-button-*)` in the Button family is gone.

## Context

This is **Story 3 of Epic 11 (Wave 2)** of the PrimeVue styles refactor — the final story in the wave. Story 11.1 (`done`) retired DsButton's `:deep(.p-button-*)` selectors; Story 11.2 (`review`) removed DsButton's last `!important`. This story does **DsIconButton**, the mirror called for by FR6.

**This is an internals-only refactor.** Zero public API changes, zero consumer-visible diff (NFR3). Success criterion: "Storybook looks identical before and after." Any visual change is a regression, not a feature.

DsIconButton has **1 `:deep(.p-button-*)` selector block** to retire (the audit count in `refactor-styles-plan.md` → DsIconButton = 1):
- `DsIconButton.vue:249-252` — `.ds-icon-button--loading :deep(.p-button-label), .ds-icon-button--loading :deep(.p-button-icon) { visibility: hidden }`

> ⚠️ **READ "Critical implementation intelligence" below before touching code.** The epic's BDD for this story says to "mirror Story 11.1's `:pt` shape (label class + icon class)." **Do not do that literally.** Story 11.1's code review proved that `:pt`-attached *inner*-part classes are inert under Vue scoped CSS, and DsIconButton's slot architecture makes the existing `:deep` loading-hide **doubly dead**. The honest, correct mirror here is to **delete the dead `:deep` block** — adding a `:pt` label/icon binding would ship dead code on a false mechanism. This section tells you exactly what to verify so you reach that conclusion empirically (probe-then-decide), not by trusting this note.

## Acceptance Criteria

1. **Zero `:deep(.p-button-*)` remain (FR6)** — The `.ds-icon-button--loading :deep(.p-button-label), .ds-icon-button--loading :deep(.p-button-icon) { visibility: hidden }` block is removed. `grep -n ':deep' src/components/DsIconButton/DsIconButton.vue` returns **nothing**. No `:deep(.p-*)` selectors remain (there are no other `:deep` in this file).

2. **No dead `:pt` / no false mechanism introduced** — A `:pt="{ label: …, icon: … }"` binding is **NOT** added (it would attach owned classes to PrimeVue inner parts that this component never renders, and that plain scoped CSS cannot reach — see Dev Notes "scope-id finding"). No new owned-class loading-hide selectors (`.ds-icon-button__label` / `.ds-icon-button__icon`) are added, because they would match nothing. (If, on the strength of the probe in Task 2, the dev still believes a `:pt` mirror is warranted for family consistency, that is a **deviation requiring sign-off** — see the open question at the end of this story; do not add it silently.)

3. **Loading hides the icon and centers the indicator, no layout shift (epic AC #2)** — With `loading=true`, the icon is not visible and the loading-dots overlay sits centered over the button with the outer (square) dimension unchanged versus the same button not loading. This already holds via the existing template (`v-if="!loading && $slots.default"` removes the icon span; `v-else-if="loading"` renders the absolutely-positioned `inset:0` overlay) and the `:dt iconOnlyWidth` / `--ds-icon-button-dimension` square sizing — removing the dead `:deep` does **not** change it. **Verify against the captured pre-refactor baseline** (AC #6).

4. **`loading` + `disabled` behavior unchanged** — With `loading=true`, the button is already disabled (`:disabled="disabled || loading"`); with `disabled=true` and `loading=true` together, rendered behavior matches the pre-refactor baseline (disabled per-type styling applies; loading overlay renders).

5. **Validation triple passes (NFR4)** — `npm run build && npm test && npm run lint` all exit zero with no new warnings. `npm test` has a **known pre-existing** failure set in `DsSelect.test.ts` (15 failures) unrelated to this story — confirm via `git stash` that they fail identically without your change; the **DsIconButton suite must remain fully green** (the file has its full pre-existing suite; expect every block to pass unchanged).

6. **Visual parity (NFR5)** — Every DsIconButton story — **Primary, Outlined, Text, Disabled, Loading, WithIndicator, WithCounterBadge, AllSizes, AllTypes** — in light **and** dark themes is visually identical to the pre-refactor baseline (manual diff). Capture the baseline **before** editing. Pay special attention to the **Loading** story and the `loading + disabled` combo.

7. **Zero public API diff (NFR3)** — Exported props (`DsIconButtonProps`), slots, events, and TypeScript types are unchanged. The `<script setup>` block is byte-for-byte unchanged. `git diff` shows **only** the `<style>` block changing (one rule block removed).

## Tasks / Subtasks

- [x] **Task 1: Capture the real pre-refactor baseline** (AC: #3, #4, #6)
  - [x] Run `npm run storybook` and walk every DsIconButton story — Primary, Outlined, Text, Disabled, **Loading**, WithIndicator, WithCounterBadge, AllSizes, AllTypes — in **both** light and dark themes. *(Headless env — reproduced analytically per the Story 11.1/10.1 precedent.)*
  - [x] **Pay special attention to the `Loading` story** (`DsIconButton.stories.ts:94`): record exactly what renders today — the icon is replaced by the centered dot overlay; the square outer dimension is unchanged. Temporarily set `loading + disabled` together and record that combo for AC #4. *(Probe confirmed: loading renders only `.ds-icon-button-loading-overlay` inside the square button; `disabled || loading` already disables the button so the combo adds disabled per-type styling + overlay.)*
  - [x] If the environment is headless (no browser), reproduce the baseline analytically per the Story 11.1 / 10.1 precedent: mount with `@vue/test-utils`, dump `wrapper.html()`, and reason about the cascade. Use the probe snippet in Dev Notes.

- [x] **Task 2: Probe the rendered DOM — confirm the `:deep` block is dead before deleting** (AC: #1, #2)
  - [x] Run a DOM probe (Vitest mount + `wrapper.html()`, then delete the probe file) for three states: (a) icon via default slot not loading, (b) loading, (c) no slot not loading. Confirmed: PrimeVue's `.p-button-label` / `.p-button-icon` parts **do not render in any state** (`grep -c 'p-button-label|p-button-icon'` over the probe dump = **0**); when `loading=true` the only content is `.ds-icon-button-loading-overlay` and `.ds-icon-button-icon` is absent; even the empty/no-slot path renders only comment nodes (PrimeVue fallback suppressed). All owned DOM carries the `data-v-` scope id.
  - [x] Conclusion recorded: the `.ds-icon-button--loading :deep(.p-button-label/.p-button-icon)` block targets elements that **never exist in any path** → dead code, safe to delete with zero behavioral/visual change.

- [x] **Task 3: Confirm the scope-id finding — why a `:pt` mirror would be dead too** (AC: #2)
  - [x] Confirmed (Story 11.1 review + memory `project-pt-scope-id-inner-parts` + guide §2c gotcha #4): a `:pt`-attached class on a PrimeVue **inner** part does not carry the wrapper `data-v-` scope id, so a scoped `.ds-icon-button__icon[data-v-…]` rule matches nothing.
  - [x] Conclusion recorded: combined with Task 2 (part never renders + icon span removed during loading), there is nothing to attach to and nothing to hide → deleting the dead `:deep` is the only honest change. **No `:pt` added.**

- [x] **Task 4: Delete the dead `:deep` loading-hide block** (AC: #1)
  - [x] Removed the 4-line block (`.ds-icon-button--loading :deep(.p-button-label), :deep(.p-button-icon) { visibility: hidden }`) at the former `DsIconButton.vue:249-252`.
  - [x] **No** `:pt` binding, owned `.ds-icon-button__label`/`__icon` classes, or replacement loading-hide rule added.
  - [x] Nothing else touched: `<Button>` open tag, `v-if`/`v-else-if` markup, `:dt sizeTokens`, `:style`, `.ds-icon-button-icon` sizing, wrapper `<div>`, indicator/counter-badge markup, and the 20 `!important` declarations are all untouched (out of scope).

- [x] **Task 5: Confirm zero `:deep` remain** (AC: #1)
  - [x] `grep -n ':deep' src/components/DsIconButton/DsIconButton.vue` returns nothing (exit 1).
  - [x] `grep -c '!important' src/components/DsIconButton/DsIconButton.vue` returns **20** (unchanged).

- [x] **Task 6: Run the validation triple** (AC: #5)
  - [x] `npm run build` (vue-tsc + vite) → exit 0, no new warnings.
  - [x] `npm test` → DsIconButton suite fully green (**47/47**); confirmed the 15 `DsSelect.test.ts` failures are pre-existing via `git stash` (identical 15 failures with the change stashed).
  - [x] `npm run lint` (`biome check ./src`) → clean (69 files, no fixes).

- [x] **Task 7: Visual parity + confirm zero API diff** (AC: #3, #4, #6, #7)
  - [x] Visual parity verified analytically (headless): the removed block was a confirmed no-op in every path (Task 2), so the rendered output is byte-identical; the Loading story and loading+disabled combo are unchanged (owned overlay + disabled per-type rules untouched). **Recommend a real-browser Storybook spot-check of the Loading / AllSizes / AllTypes stories (light + dark) at review.**
  - [x] `git diff src/components/DsIconButton/DsIconButton.vue` shows **only** the `<style>` block changed (single hunk, 5 deletions). The `<script setup>` block and `<template>` are byte-for-byte unchanged.

## Dev Notes

### Critical implementation intelligence — DsIconButton's loading-hide `:deep` is doubly dead (READ FIRST)

Two independent facts, both verifiable by probe, make the `:deep(.p-button-label/.p-button-icon)` loading-hide block at `DsIconButton.vue:249-252` a **no-op in every path**:

1. **PrimeVue's `.p-button-label` / `.p-button-icon` never render.** PrimeVue Button emits those parts only as the *fallback* of its default slot (`node_modules/primevue/button/Button.vue:3-13`). DsIconButton **always** supplies the `<Button>` default slot (the `v-if`/`v-else-if` spans at `DsIconButton.vue:124-131`), so PrimeVue's fallback is suppressed and the `.p-button-*` parts are never created. This is the exact architecture proven empirically for DsButton in Story 11.1 (its DOM probe showed `.p-button-icon`/`.p-button-label` render **only** on the props path, never the slot path). DsIconButton's icon comes via the **default slot**, so it is always on the slot path.

2. **During loading, the icon span is removed entirely.** The template is `<span v-if="!loading && $slots.default" class="ds-icon-button-icon">…</span>` followed by `<span v-else-if="loading" class="ds-icon-button-loading-overlay">…</span>`. When `loading=true`, the icon span is **not rendered** — only the overlay is. The existing test "hides icon slot when loading" (`DsIconButton.test.ts:249-256`) asserts `.ds-icon-button-icon` does not exist when loading. So even the component's *own* icon element is gone during loading. There is literally nothing for a loading-hide rule to act on.

**Consequence:** removing the `:deep` block changes nothing visible — it was already inert. That is exactly what makes this a safe, zero-visual-diff refactor (no-op removed → parity preserved, NFR3/NFR5). DsIconButton's loading state hides the icon by **not rendering it** (template `v-if`), and centers the dots via the absolutely-positioned `inset:0` overlay — a fully owned-DOM mechanism that needs no PrimeVue-internal styling.

### The scope-id finding — why mirroring 11.1's `:pt` would also be dead (do NOT add `:pt`)

The epic's BDD for this story says "the `<Button>` receives the same `:pt` shape as Story 11.1 (label class + icon class) and loading-state visibility is gated by owned-class selectors." **Story 11.1's code review proved that approach is a false mechanism**, and it is even more clearly wrong here:

- A `:pt`-attached class on a PrimeVue **inner** part (`label`/`icon`) is rendered by PrimeVue's own render function, so it does **not** carry the wrapper component's `data-v-` scope id. Vue scoped CSS compiles `.ds-icon-button__icon` to `.ds-icon-button__icon[data-v-HASH]`, which **requires** that attribute → it matches nothing. (`:pt` on the **`root`** part works — the root *does* inherit the parent scope id — which is why Wave 1's DsAvatar/DsBadge `root` refactors are fine. Inner parts are the exception. See memory `project-pt-scope-id-inner-parts`.)
- Story 11.1's corrected Completion Notes record this verbatim: its `:pt` `label`/`icon` keys and the `.ds-button__*` rules are **inert dead CSS** in documented usage; parity held only because they were no-op-for-no-op swaps.
- For DsIconButton the case is stronger still: the parts never render (fact 1) **and** the icon is gone during loading (fact 2). So a `:pt` mirror would attach classes to non-existent elements and gate visibility on non-existent nodes — pure dead code that also asserts a mechanism that doesn't work.

**Therefore: delete the dead `:deep`, add no `:pt`.** This satisfies FR6's real goal ("DsIconButton is free of `:deep(.p-button-*)` patches") without shipping dead code or repeating the 11.1 false-mechanism mistake. (Family "consistency" with DsButton's `:pt` is not a reason to copy dead code — DsButton's `:pt` is itself now documented as inert.)

### Difference from DsButton (Story 11.1) — there is no icon-sizing `:deep` to migrate

DsButton had **3** `:deep(.p-button-*)` selectors (2 loading-hide + 1 icon-sizing). DsIconButton has only the **2 loading-hide** selectors (one block). DsIconButton's icon sizing already lives on its **own** `<span class="ds-icon-button-icon">` element (owned DOM that carries `data-v-`), styled by plain scoped CSS at `DsIconButton.vue:265-273` (`width`/`height`/`font-size: var(--ds-icon-button-icon-size)`). That is already correct and conformant — **leave it untouched**. There is no PrimeVue-internal icon part to size here.

### Exact change surface

Only `src/components/DsIconButton/DsIconButton.vue`, only the `<style scoped>` block, only the deletion of the 4-line `:deep` block at `DsIconButton.vue:249-252`. No `<script setup>` change, no `<template>` change, no `:pt`/`:dt` change, no new files, no barrel/story/doc/test changes.

### Out of scope (do not do here)

- **Adding a `:pt` `label`/`icon` binding or owned-class loading-hide selectors** — dead code, false mechanism (see above). This is the central correctness call of this story.
- **The 20 `!important` declarations** in DsIconButton (per-type disabled/hover/active colors at `:167-227`; square-dimension enforcement at `:256-258`). These are **not** loading-state related and there is **no FR** covering them in Epic 11 (FR6 is loading-only; FR5 covered DsButton's single `--medium` `!important`, not DsIconButton). Removing them is a separate, unscheduled effort — observe and report if you wish, but do not touch them here.
- **`docs/ai-guidelines/ds-icon-button.md`** — consumer-API-facing; API is unchanged (NFR3), so no update.
- **`docs/component-addition-guide.md`** — §2c documents the `:pt`-attach-class pattern but does **not** yet record the root-vs-inner-part scope-id distinction. Amending the guide to add that gotcha is valuable but is a **doc task outside this story's scope** (raise separately; see open question).
- **Tests asserting `:pt`/`:deep`/computed visibility internals** — per the Story 10.1/11.1 precedent these are brittle (jsdom mounts `theme:'none'`, no `:dt`/`:pt` resolution). The existing suite is the regression guard; visual parity (AC #6) is the manual check. Do not add such tests.

### Test impact

`DsIconButton.test.ts` asserts on `.ds-icon-button*` classes, `:dt` size/dimension token values, `.ds-icon-button-loading-overlay` / `.ds-icon-button-loading-dots` presence, `.ds-icon-button-icon` presence/absence (incl. "hides icon slot when loading"), aria attrs, indicator/counter-badge, and `$attrs`/event passthrough — **none reference `.p-button-label`, `.p-button-icon`, `:deep`, or `:pt`**. Deleting the dead `:deep` block does not touch any asserted behavior. The suite should pass untouched. Do not modify it.

### Project conventions (from CLAUDE.md)

- Customization priority order (pick the first that fits, never skip down): **1. `:dt`** → **2. `:pt`-attach-class + plain scoped CSS (root part, or any part that carries the scope id)** → **3. `<style scoped>` for own DOM only.** Never `:deep(.p-*)`, never `!important` to beat PrimeVue specificity, never `:host`. This story removes the Button family's last `:deep(.p-button-*)`.
- DsIconButton's loading state is already step-3-conformant: it hides the icon via template `v-if` (own DOM) and overlays dots via an owned absolutely-positioned `<span>`. No PrimeVue-internal styling is needed — which is precisely why the `:deep` block was always vestigial.
- Biome: single quotes, 2-space indent, 100-char width. Lint-staged runs `biome check --write` on commit.
- Branch/PR per **wave** (NFR7): this story shares the Wave 2 branch/PR with Stories 11.1 and 11.2; validation runs **per component/story** (NFR4). This is the **last** story in Wave 2 — after it, Epic 11 is code-complete and the Wave 2 PR can be opened.

### Project Structure Notes

Single-file change: `src/components/DsIconButton/DsIconButton.vue` (`<style scoped>` only). Aligns with `refactor-styles-plan.md` Wave 2 / 2.2 and FR6. The four-file component layout (`.vue`, `.stories.ts`, `.test.ts`, `index.ts`) is untouched except the `.vue` style block.

### Probe snippet (delete after use)

```ts
// tmp/probe-icon-button.test.ts — mount, dump HTML, then delete the file.
import { mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import { writeFileSync } from 'node:fs';
import { describe, it } from 'vitest';
import DsIconButton from '../src/components/DsIconButton/DsIconButton.vue';
const g = { plugins: [[PrimeVue, { theme: 'none' }]] };
describe('probe', () => {
  it('dump', () => {
    const slot = mount(DsIconButton, { props: { ariaLabel: 'a' }, slots: { default: '<svg class="i"/>' }, global: g });
    const loading = mount(DsIconButton, { props: { ariaLabel: 'a', loading: true }, slots: { default: '<svg class="i"/>' }, global: g });
    const empty = mount(DsIconButton, { props: { ariaLabel: 'a' }, global: g });
    writeFileSync('tmp/probe-icon-out.txt',
      '== slot (not loading) ==\n' + slot.html() +
      '\n\n== loading ==\n' + loading.html() +
      '\n\n== empty (no slot) ==\n' + empty.html());
  });
});
```

### References

- [Source: _bmad-output/planning-artifacts/epics-refactor-styles.md#Story 11.3] — story statement + 4 BDD acceptance criteria (FR6). **Note:** the BDD "mirror the `:pt` shape" wording is superseded by the scope-id finding — see Dev Notes; FR6's real goal is "no `:deep(.p-button-*)`".
- [Source: _bmad-output/planning-artifacts/refactor-styles-plan.md#Wave 2 — 2.2 DsIconButton] — "Mirror image of DsButton's loading-state changes." Audit count: DsIconButton = 1 `:deep(.p-*)`.
- [Source: _bmad-output/planning-artifacts/epics-refactor-styles.md#Requirements Inventory] — FR6 (this story), FR1 (cross-cutting conformance), NFR1/NFR3/NFR4/NFR5/NFR7/NFR8.
- [Source: src/components/DsIconButton/DsIconButton.vue:249-252] — the dead `:deep(.p-button-label/.p-button-icon)` loading-hide block being removed.
- [Source: src/components/DsIconButton/DsIconButton.vue:124-131] — template `v-if="!loading && $slots.default"` icon span + `v-else-if="loading"` overlay (the real loading-hide mechanism; icon is removed from DOM during loading).
- [Source: src/components/DsIconButton/DsIconButton.vue:265-273] — `.ds-icon-button-icon` owned-class icon sizing (already conformant; leave untouched).
- [Source: src/components/DsIconButton/DsIconButton.vue:167-227,256-258] — the 20 `!important` declarations (out of scope — no FR covers them).
- [Source: src/components/DsIconButton/DsIconButton.test.ts:249-256] — "hides icon slot when loading" asserts `.ds-icon-button-icon` absent during loading (confirms fact 2).
- [Source: _bmad-output/implementation-artifacts/11-1-refactor-dsbutton-loading-state-visibility-and-icon-sizing-through-pt-keys.md] — predecessor; established the probe-then-decide method, the Button slot architecture, and (in its corrected Completion Notes) the scope-id finding that `:pt` inner-part classes are inert.
- [Source: node_modules/primevue/button/Button.vue:3-13] — Button template proving label/icon parts render only as default-slot fallback (root cause of fact 1).
- [Source: docs/component-addition-guide.md#2c-styling-customization-priority-order] — canonical `:pt`-attach-class pattern (root example; does not yet cover the inner-part scope-id caveat).
- [Source: CLAUDE.md#Conventions] — priority order and anti-patterns.

## Dev Agent Record

### Agent Model Used

claude-opus-4-8 (1M context) — bmad-dev-story workflow

### Debug Log References

- DOM probe (`tmp/probe-icon-button.test.ts`, run then deleted) over three states (slot/not-loading, loading, empty/no-slot): `grep -c 'p-button-label|p-button-icon'` over the dump = **0** → PrimeVue's label/icon parts never render in any state. Loading state renders only `.ds-icon-button-loading-overlay` (icon span `v-if`'d out). All owned DOM carries `data-v-d706f65e`.
- `grep -n ':deep' src/components/DsIconButton/DsIconButton.vue` → no matches (exit 1). `grep -c '!important'` → 20 (unchanged).
- `npm run build` → exit 0, no new warnings.
- `npx vitest run src/components/DsIconButton/DsIconButton.test.ts` → 47 passed.
- `git stash` cross-check on `DsIconButton.vue` → DsSelect.test.ts 15 failures identical with/without the change (pre-existing, unrelated).
- `npm run lint` → clean (69 files, no fixes).
- `git diff --stat src/` → 1 file changed, 5 deletions (single `<style>` hunk).

### Completion Notes List

**Outcome: dead `:deep` block deleted; no `:pt` added (honest mirror, per the Story 11.1 scope-id finding).**

- **AC #1 — zero `:deep(.p-button-*)` remain (FR6):** Removed the `.ds-icon-button--loading :deep(.p-button-label), :deep(.p-button-icon) { visibility: hidden }` block. `grep ':deep'` now returns nothing. This clears the last `:deep(.p-button-*)` in the Button family.
- **AC #2 — no dead `:pt` / no false mechanism:** Did **not** add a `:pt` label/icon binding or owned-class loading-hide selectors. DOM probe (Task 2) confirmed PrimeVue's `.p-button-label`/`.p-button-icon` never render here (DsIconButton always supplies the `<Button>` default slot), and during loading the icon span is removed entirely (`v-if="!loading && $slots.default"`). Combined with the scope-id finding (a `:pt` inner-part class can't be reached by plain scoped CSS — memory `project-pt-scope-id-inner-parts`, guide §2c gotcha #4), a `:pt` mirror would attach classes to non-existent elements and gate visibility on non-existent nodes — pure dead code. The deleted `:deep` was already dead for the same reasons, so removing it is the only honest change.
- **AC #3/#4 — loading hides icon, centers indicator, no layout shift; loading+disabled unchanged:** Unchanged by this story. The icon is hidden by the template (`v-if` removes the span); the dots center via the absolutely-positioned `inset:0` owned overlay; the square outer dimension comes from `:dt iconOnlyWidth` / `--ds-icon-button-dimension`. `loading` already implies disabled (`:disabled="disabled || loading"`); the disabled per-type `!important` rules and overlay are untouched.
- **AC #5 — validation triple:** build exit 0; DsIconButton **47/47** green; lint clean. The 15 `DsSelect.test.ts` failures are pre-existing and unrelated (confirmed identical via `git stash`).
- **AC #6 — visual parity:** Verified analytically (headless env, per the Story 11.1/10.1 precedent). The removed block was a confirmed no-op in every path, so the render is byte-identical before/after — parity holds for all stories incl. Loading and loading+disabled. Recommend a real-browser Storybook spot-check at review (Loading / AllSizes / AllTypes, light + dark).
- **AC #7 — zero public API diff (NFR3):** `git diff` is a single `<style>` hunk (5 deletions). `<script setup>` (interface, props, computeds) and `<template>` are byte-for-byte unchanged; `DsIconButtonProps`, slots, events, types unchanged.
- **Difference from DsButton 11.1:** DsButton had 3 `:deep` (2 loading-hide + 1 icon-sizing); DsIconButton had only the 2 loading-hide selectors. DsIconButton's icon sizing already lives on the owned `.ds-icon-button-icon` span (scoped CSS, correct) — nothing to migrate there.
- **Out of scope (not touched):** the 20 `!important` declarations (per-type disabled/hover/active colors + square-dimension enforcement) — no FR covers them in Epic 11. Observed only.
- **Wave status:** This is the last story in Wave 2; Epic 11 is now code-complete pending review of 11.2 and 11.3.

### File List

- `src/components/DsIconButton/DsIconButton.vue` (modified — `<style scoped>` only: removed the dead `:deep(.p-button-label/.p-button-icon)` loading-hide block)

## Change Log

| Date       | Version | Description                                                                                                                                              | Author |
| ---------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| 2026-06-07 | 0.1     | Removed the dead `:deep(.p-button-label/.p-button-icon)` loading-hide block in DsIconButton (no-op in all paths). No `:pt` added per the scope-id finding. Clears the last `:deep(.p-button-*)` in the Button family. Internals-only, zero public API / visual diff (NFR3). | Yurii  |
