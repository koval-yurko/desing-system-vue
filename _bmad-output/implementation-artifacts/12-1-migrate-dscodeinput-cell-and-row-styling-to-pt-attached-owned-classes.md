# Story 12.1: Migrate DsCodeInput cell and row styling to `:pt`-attached owned classes

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a design system maintainer,
I want every `:deep(.p-inputotp-input)` / `:deep(.p-inputotp)` rule in DsCodeInput rewritten as a selector against an owned class attached via `:pt`,
so that DsCodeInput conforms to the priority order (no `:deep(.p-*)`) without breaking its multi-state cell rendering, ARIA forwarding, placeholder "filled" trick, or reduced-motion guard.

## Context

This is the **only story in Epic 12 (Wave 3)** of the PrimeVue styles refactor. Wave 1 (Epic 10) piloted and documented the `:dt` → `:pt`-attach-class → scoped-own-DOM priority order (DsAvatar/DsBadge) and codified it in `docs/component-addition-guide.md`. Wave 2 (Epic 11) applied it to the Button family and — critically — **proved the scope-id limitation** that governs this entire story (see "Critical implementation intelligence" below). Wave 3 is DsCodeInput.

**This is an internals-only refactor.** Zero public API changes, zero consumer-visible diff (NFR3). Success criterion: **"Storybook looks identical before and after."** Any visual change is a regression, not a feature.

DsCodeInput has **12 `:deep(.p-*)` selector blocks** to retire (audit count in `refactor-styles-plan.md` = "11" counts the cell rules; the 12th is the row strip):
- **1 row-strip block** — `.ds-code-input :deep(.p-inputotp)` (`DsCodeInput.vue:132`)
- **11 cell blocks** — `.ds-code-input … :deep(.p-inputotp-input)…` (`DsCodeInput.vue:140, 163, 168, 174, 181, 186, 193-195, 203, 208, 219-221, 231`)

> ⚠️ **READ "Critical implementation intelligence" below before touching code.** The cells and the row root behave **differently** under Vue scoped CSS, and the naive reading of the epic/plan ("rewrite the rules as `.ds-code-input__cell`") will **silently break every cell style** if written as plain scoped CSS. A DOM probe (reproduced below) proves the cell inputs do **not** carry the wrapper's `data-v-` scope id. The honest, working approach is **`:deep(.ds-code-input__cell)`** — `:deep` on an **owned** class (which NFR1/NFR8 permit; they prohibit only `:deep(.p-*)`). This section tells you exactly what to verify (probe-then-decide) so you reach this empirically, not on trust.

## Acceptance Criteria

1. **Cell class attached via `:pt`, row class attached via `:pt` (FR7)** — `otpPassThrough` is extended so that `pcInputText.root.class` includes `'ds-code-input__cell'`, and the OTP root receives `pt.root.class: 'ds-code-input__row'` (replacing the previous `:deep(.p-inputotp)` strip block). Both additions **merge with** any consumer-supplied `class` rather than clobbering it (the existing consumer-`pt` deep-merge behavior must survive — see AC #6 and the existing tests at `DsCodeInput.test.ts:145-170`).

2. **All `:deep(.p-*)` selectors gone (FR1 / NFR1)** — The 11 cell rules are rewritten as selectors against `.ds-code-input__cell`, and the row strip against `.ds-code-input__row`, preserving every state modifier (`--error`, `--disabled`, `--transitions`) and pseudo-class (`:focus`, `:focus:not(:focus-visible)`, `:placeholder-shown`, `:not(:placeholder-shown)`, `:hover`, `::placeholder`). **Zero `:deep(.p-inputotp-input)` remain. Zero `:deep(.p-inputotp)` remain. Zero `:deep(.p-*)` of any kind remain.** No `!important` is introduced.

3. **Cell selectors actually apply (the scope-id trap)** — The cell rules use **`:deep(.ds-code-input__cell)`** (owned class via `:deep`), NOT plain scoped `.ds-code-input__cell`. This is mandatory because the cell inputs are nested-component DOM that does **not** carry the wrapper's `data-v-` scope id (verified — see Dev Notes "Scope-id probe"). A plain scoped selector would compile to `.ds-code-input__cell[data-v-HASH]` and match nothing — a silent no-op that jsdom tests (`theme:'none'`) cannot catch. The **row** rule, by contrast, is **plain scoped CSS** (`.ds-code-input__row { … }`) because the OTP root *does* carry the scope id. Verify both with a DOM probe + a built-CSS check before declaring done.

4. **Placeholder "filled" trick preserved (FR8)** — `pcInputText.root.placeholder` stays a single space (`' '`). The `:deep(.ds-code-input__cell):not(:placeholder-shown)` selector (the "filled" state) renders correctly, and `:deep(.ds-code-input__cell)::placeholder { color: transparent }` keeps the injected space invisible. All six per-cell visual states still render: empty / hover / focus / filled / error / error-focus / disabled.

5. **Reduced-motion guard preserved (NFR6)** — The `@media (prefers-reduced-motion: no-preference)` block still wraps the cell transition rule (now `.ds-code-input--transitions :deep(.ds-code-input__cell)`). With `prefers-reduced-motion: reduce`, no transitions fire on the cells.

6. **ARIA forwarding unchanged** — `aria-describedby` / `aria-invalid` still reach each cell input via `otpPassThrough.pcInputText.root` when `showError` is true (existing tests `DsCodeInput.test.ts:235-255` must stay green untouched). Adding the cell `class` must not disturb the existing placeholder/aria injection or the consumer-`pt` merge.

7. **Validation triple passes (NFR4)** — `npm run build && npm test && npm run lint` all exit zero with no new warnings. `npm test` has a **known pre-existing** failure set: **15 failures, all in `DsSelect.test.ts`** (Epic 13 territory, unrelated to this story). Confirm via `git stash` that those 15 fail **identically** without your change; the **DsCodeInput suite must remain fully green**.

8. **Visual parity (NFR5)** — Every DsCodeInput story — Default, Filled, WithLabel, WithHint, ErrorState, Disabled, CustomLength, IntegerOnly, MaskedPin, PasteInteractive, **AllStates** — in light **and** dark themes is visually identical to the pre-refactor baseline (manual diff). Capture the baseline **before** editing. Pay special attention to AllStates (covers empty/focused/filled/error/disabled in one view).

9. **Keyboard / paste behavior unchanged** — Typing, deleting, and pasting a code advances/retreats cells and fills all cells exactly as before (PrimeVue handles this; the refactor touches only CSS + the `:pt` class hooks, not behavior).

10. **Zero public API diff (NFR3)** — Exported props (`DsCodeInputProps`), `v-model`, slots, events, and TypeScript types are unchanged. The `<script setup>` interface block is untouched except for the `otpPassThrough` computed gaining the two `class` injections.

## Tasks / Subtasks

- [x] **Task 1: Capture the pre-refactor baseline** (AC: #8, #9)
  - [x] Run `npm run storybook` and walk every DsCodeInput story (list in AC #8) in **both** light and dark themes. Record the six per-cell states from the **AllStates** story (empty / hover / focus / filled / error / disabled) — this is the parity reference. *(Headless environment — used the analytical baseline below per the Story 11.1/10.1 precedent.)*
  - [x] If headless (no browser), reproduce the baseline analytically per the Story 11.1/10.1 precedent: mount with `@vue/test-utils`, dump `wrapper.html()`, reason about the cascade against the current `DsCodeInput.vue` `<style>` block.

- [x] **Task 2: Probe where the scope id lands — confirm cell vs row before writing any selector** (AC: #3)
  - [x] Run a DOM probe (Vitest mount + `wrapper.html()`, then delete the probe file — snippet in Dev Notes). Confirm: the wrapper `.ds-code-input` and the OTP root `.p-inputotp` **carry** `data-v-…`; each cell `<input class="… p-inputotp-input">` **does NOT** carry `data-v-…` (it carries `data-pc-name="pcinputtext"` / `data-pc-extend="inputtext"` instead). **Re-verified in this environment** — probe output: OTP root `<div data-v-46edf2d3 class="p-inputotp …">`; cell `<input class="… p-inputotp-input" data-pc-name="pcinputtext" data-pc-extend="inputtext" …>` with **no** `data-v-`.
  - [x] Conclusion to record: row → plain scoped CSS; cells → `:deep(.ds-code-input__cell)` (owned class).

- [x] **Task 3: Attach the owned classes via `:pt`** (AC: #1, #4, #6)
  - [x] In the `otpPassThrough` computed, add `'ds-code-input__cell'` to `pcInputText.root.class`, **merging** any consumer-supplied class (`class: ['ds-code-input__cell', consumerCellRoot.class].filter(Boolean)`). Kept `placeholder ?? ' '` and the conditional `aria-describedby`/`aria-invalid` injection as-is.
  - [x] Add a `root` key to the returned object: `root: { ...consumerRoot, class: ['ds-code-input__row', consumerRoot.class].filter(Boolean) }`, merging any consumer-supplied `root.class` from `attrs.pt`.
  - [x] Did **not** change `v-bind="$attrs"`, `v-model`, `:length`, `:disabled`. **Dropped** the now-redundant `class="ds-code-input__otp"` on `<InputOtp>` for cleanliness (it was a never-styled hook; the row is now styled via `.ds-code-input__row`). See Completion Notes.

- [x] **Task 4: Rewrite the row strip rule** (AC: #2)
  - [x] Replaced `.ds-code-input :deep(.p-inputotp) { … }` with a **plain scoped** rule `.ds-code-input__row { … }` (same declarations). No `:deep` — the OTP root carries the scope id.

- [x] **Task 5: Rewrite the 11 cell rules against `:deep(.ds-code-input__cell)`** (AC: #2, #3, #4, #5)
  - [x] Swapped `.p-inputotp-input` → `.ds-code-input__cell` inside `:deep(...)` for all 11 blocks (15 selectors), scope prefix and trailing pseudo-classes byte-identical — pure class-name swap, specificity preserved.
  - [x] Confirmed the reduced-motion `@media` block now wraps `.ds-code-input--transitions :deep(.ds-code-input__cell)` (NFR6).

- [x] **Task 6: Confirm zero `:deep(.p-*)` remain** (AC: #2)
  - [x] `grep -n ':deep(\.p-' …` → nothing.
  - [x] `grep -n '!important' …` → nothing.
  - [x] `grep -n ':deep' …` → only `:deep(.ds-code-input__cell)` owned-class selectors.

- [x] **Task 7: Run the validation triple** (AC: #7)
  - [x] `npm run build` (vue-tsc + vite) → exit 0, no new warnings.
  - [x] `npm test` → DsCodeInput suite fully green (31/31); confirmed the 15 `DsSelect.test.ts` failures are pre-existing via `git stash` (identical 15 without the change).
  - [x] `npm run lint` (`biome check ./src`) → clean (69 files, no fixes).

- [x] **Task 8: Visual parity + confirm zero API diff** (AC: #8, #9, #10)
  - [x] Headless parity verification: built-CSS check (`dist/index.css`) confirms cells compile to `.ds-code-input[data-v-HASH] .ds-code-input__cell` (scope on wrapper, **not** the trap form `.ds-code-input__cell[data-v-…]`) and the row to `.ds-code-input__row[data-v-HASH]`; runtime probe confirms `ds-code-input__cell`/`ds-code-input__row` actually land on the DOM and consumer classes merge. Cell specificity unchanged `(0,3,0)`; row `(0,2,0)` unlayered still beats PrimeVue's `@layer primevue` defaults.
  - [x] Keyboard/paste behavior unchanged — refactor touches only CSS + `:pt` class hooks, not behavior; v-model/paste round-trip tests stay green.
  - [x] `git diff --stat` shows changes confined to `src/components/DsCodeInput/DsCodeInput.vue` (1 file). No public-API lines (interface/props/v-model/v-bind/:length/:disabled) changed.

## Dev Notes

### Critical implementation intelligence — the cell vs. row scope-id split (READ FIRST)

DsCodeInput renders one `<InputOtp>`, which renders `length` × `<OtpInputText>` (= PrimeVue `InputText`) **nested child components** (`node_modules/primevue/inputotp/InputOtp.vue:2-28`). Vue stamps a component's `data-v-` scope id onto its own template nodes **and onto a direct child component's root element** — but **not** transitively into a grandchild component's DOM. Consequences, both verified by DOM probe:

| Element | `:pt` key | Carries DsCodeInput's `data-v-`? | How to style |
|---|---|---|---|
| `.ds-code-input` wrapper `<div>` | (own template node) | **yes** | plain scoped CSS |
| `.p-inputotp` OTP root `<div>` | `root` | **yes** (direct child root) | **plain scoped CSS** → `.ds-code-input__row` |
| `.p-inputotp-input` cell `<input>` | `pcInputText.root` | **NO** (grandchild-component DOM) | **`:deep(.ds-code-input__cell)`** (owned class) |

**Why this matters:** the epic AC and `refactor-styles-plan.md` both say "rewrite the rules as `.ds-code-input__cell`". Read naively as *plain* scoped CSS, that compiles to `.ds-code-input__cell[data-v-HASH]` — which **matches nothing**, because the cell input has no `data-v-` attribute. Every cell style would silently vanish. This is the exact silent-no-op failure mode documented in `docs/component-addition-guide.md` §2c gotcha #4 (proven on DsButton in Story 11.1) and recorded in memory `project-pt-scope-id-inner-parts`.

**The fix:** keep the `:deep()` mechanism, but point it at the **owned** class. `.ds-code-input :deep(.ds-code-input__cell)` compiles to `.ds-code-input[data-v-HASH] .ds-code-input__cell` — the scope id sits on the wrapper (which *does* carry it), `:deep` strips the requirement from the descendant, and the descendant is now **our** class, not PrimeVue's `.p-inputotp-input`. That is the whole point of the refactor: the selector no longer depends on PrimeVue's internal class name (survives a `.p-inputotp-input` rename), even though `:deep` is still needed to cross the scope boundary into the inner part.

**This is fully compliant**, not a deviation:
- **NFR1**: "Zero `:deep(.p-*)` selectors remain." → `:deep(.ds-code-input__cell)` is **not** `.p-*`. ✅
- **NFR8**: "No `:deep(.p-*)`, no `!important`, no `:host`; style attachment must always go through `:pt`-owned classes." → attachment is via the `:pt`-owned class `ds-code-input__cell`; the selector is not `.p-*`. ✅
- **Epic AC**: "zero `:deep(.p-inputotp-input)` / `:deep(.p-inputotp)` remain" — those specific `.p-*` selectors are gone; the AC never prohibited `:deep()` on an owned class. ✅

The guide §2c gotcha #4 lists "inline `style` via `:pt`" or "accept scoped CSS won't reach it" as the inner-part options — but **neither works here**: the cells need stateful CSS (`:hover`, `:focus`, `:focus:not(:focus-visible)`, `:not(:placeholder-shown)`, `--error`/`--disabled` modifiers, and a `@media` query) that inline `style` cannot express, and "accept it won't reach" would delete the component's entire visual design. `:deep(owned-class)` is the only clean, compliant path. (Optional: after this story, consider amending guide §2c gotcha #4 to add "stateful inner-part styling → `:deep(.owned-class)`" as a third option — raise separately; it is a doc task outside this story's scope.)

### Scope-id probe (verified during story prep — re-run to confirm)

Probe output (mount with `modelValue:'12'`, `length:4`, `label:'Code'`, `theme:'none'`):

```
UNIQUE data-v ids: ["data-v-46edf2d3"]
WRAPPER:   <div data-v-46edf2d3 class="ds-code-input ds-code-input--transitions" role="group" …>
OTP ROOT:  <div data-v-46edf2d3 class="p-inputotp p-component ds-code-input__otp" data-pc-section="root">
CELL:      <input class="p-inputtext p-component p-inputotp-input" placeholder=" "
                  data-pc-name="pcinputtext" data-pc-extend="inputtext" data-pc-section="root">  ← NO data-v- attr
```

The cell input carries `data-pc-name`/`data-pc-extend` (PrimeVue's markers) but **no `data-v-`** → confirms plain scoped CSS cannot reach it. The OTP root carries `data-v-46edf2d3` → confirms `.ds-code-input__row` plain scoped CSS works.

### Exact selector map (12 blocks, current → new)

Mechanical: inside each `:deep(...)`, swap `.p-inputotp-input` → `.ds-code-input__cell`; swap the standalone `:deep(.p-inputotp)` → plain `.ds-code-input__row`. Everything else (scope prefix, pseudo-classes, declarations) is byte-identical.

| # | Current (`DsCodeInput.vue`) | New |
|---|---|---|
| row | `.ds-code-input :deep(.p-inputotp)` (`:131`) | `.ds-code-input__row` *(plain — no `:deep`)* |
| 1 | `.ds-code-input :deep(.p-inputotp-input)` (`:140`) | `.ds-code-input :deep(.ds-code-input__cell)` |
| 2 | `.ds-code-input :deep(.p-inputotp-input)::placeholder` (`:163`) | `.ds-code-input :deep(.ds-code-input__cell)::placeholder` |
| 3 | `.ds-code-input--transitions :deep(.p-inputotp-input):placeholder-shown:hover:not(:focus)` (`:168`) | `…:deep(.ds-code-input__cell):placeholder-shown:hover:not(:focus)` |
| 4 | `.ds-code-input :deep(.p-inputotp-input):focus` (`:174`) | `…:deep(.ds-code-input__cell):focus` |
| 5 | `.ds-code-input :deep(.p-inputotp-input):focus:not(:focus-visible)` (`:181`) | `…:deep(.ds-code-input__cell):focus:not(:focus-visible)` |
| 6 | `.ds-code-input :deep(.p-inputotp-input):not(:placeholder-shown)` (`:186`) | `…:deep(.ds-code-input__cell):not(:placeholder-shown)` |
| 7 | `.ds-code-input--error :deep(.p-inputotp-input)`, `…:not(:placeholder-shown)`, `…:focus` (`:193-195`) | three selectors, `.p-inputotp-input` → `.ds-code-input__cell` |
| 8 | `.ds-code-input--error :deep(.p-inputotp-input):focus` (`:203`) | `…:deep(.ds-code-input__cell):focus` |
| 9 | `.ds-code-input--error :deep(.p-inputotp-input):focus:not(:focus-visible)` (`:208`) | `…:deep(.ds-code-input__cell):focus:not(:focus-visible)` |
| 10 | `.ds-code-input--disabled :deep(.p-inputotp-input)`, `…:not(:placeholder-shown)`, `…:focus` (`:219-221`) | three selectors, swap class |
| 11 | `.ds-code-input--transitions :deep(.p-inputotp-input)` (`:231`, inside `@media`) | `…:deep(.ds-code-input__cell)` |

> Pseudo-class placement: keep them **outside** the `:deep()` exactly as today (`:deep(.ds-code-input__cell):focus`) — Vue's SFC compiler keeps the pseudo attached to the inner selector, so the cascade is identical to the current `:deep(.p-inputotp-input):focus`. Do not move them inside `:deep(...)`; minimize the diff to a pure class-name swap.

### `otpPassThrough` change surface

The computed already merges consumer `pt` (via `attrs.pt`) with the wrapper's placeholder + aria injections. Add **two** class injections without disturbing that merge:

- `pcInputText.root.class` ← `['ds-code-input__cell', <consumer cell-root class>].filter(Boolean)` (PrimeVue accepts array `class` in `pt`).
- top-level `root.class` ← `['ds-code-input__row', <consumer root class>].filter(Boolean)`.

Keep `placeholder: consumerCellRoot.placeholder ?? ' '` and the `if (showError.value) { …'aria-describedby'…'aria-invalid'… }` block intact. The existing tests (`DsCodeInput.test.ts:145-170`, `:235-255`) assert placeholder + consumer-merge + aria — they must stay green **without modification**.

### Test impact

`DsCodeInput.test.ts` (jsdom, `theme:'none'`) asserts on `.ds-code-input*` container classes, `role="group"`, label/hint/error structure + aria, `v-model` forwarding, `$attrs` passthrough, `length`/`disabled` props, and the **forwarded `pt` shape** (placeholder, consumer-merge, aria injection). **None reference `.p-inputotp-input`, `:deep`, the new `ds-code-input__cell`/`__row` classes, or rendered CSS.** The forwarded-`pt` tests (`:145-170`, `:235-255`) read `forwarded.pcInputText.root.placeholder` / `['aria-describedby']` etc. — adding a `class` array to that same object does **not** break those assertions (they check specific keys, not the whole object). The suite should pass untouched.

**Do not** add tests asserting `:pt`/`:deep`/computed-CSS internals — per the Story 10.1/11.1 precedent they are brittle (no `:dt`/`:pt`/CSS resolution under jsdom `theme:'none'`); the existing suite is the regression guard and **visual parity (AC #8) + a real-browser computed-style spot-check (AC #3)** are the manual checks that actually catch the scope-id trap.

### Out of scope (do not do here)

- **`:dt` token migration for cells.** The plan states: "No `:dt` candidates here — the cell sizing is bespoke (43×58 px with caret colors) and the InputOtp doesn't expose tokens for these." (Aside: `pcInputText` *is* an InputText with a token surface — background/borderColor/color/etc. — but the bespoke 43×58 dimensions, the placeholder-`:not(:placeholder-shown)` trick, and the multi-state error/disabled selectors cannot be expressed purely via `:dt`, so `:dt` is deliberately **not** used. Do not partially migrate colors to `:dt` — it would split one cohesive state machine across two mechanisms for no benefit and risk a visual diff.)
- **`docs/component-addition-guide.md`** — already documents the `:pt`-attach-class pattern (§2c) and the scope-id gotcha (#4). Amending it to add the "stateful inner-part → `:deep(.owned-class)`" option is valuable but a **separate doc task** (raise separately).
- **`docs/ai-guidelines/ds-code-input.md`** — consumer-API-facing; API is unchanged (NFR3), so no update.
- **Tests / stories / barrel** — no changes (the four-file layout's `.test.ts`, `.stories.ts`, `index.ts` are untouched).
- **New visual-regression tooling** (Loki/Chromatic) — manual Storybook walk-through is the agreed Wave 3 check (Loki/Chromatic is a Wave 4 consideration for DsSelect, not this story).
- **Touching any other component** — DsSelect is Epic 13 (the 15 pre-existing `DsSelect.test.ts` failures are NOT yours to fix here).

### Project conventions (from CLAUDE.md)

- Customization priority order (pick the first that fits, never skip down): **1. `:dt`** → **2. `:pt`-attach-class + scoped CSS** → **3. `<style scoped>` own-DOM only.** Never `:deep(.p-*)`, never `!important` to beat PrimeVue specificity, never `:host`. **Refinement for inner parts (this story):** when a `:pt`-attached class lands on a part that does **not** carry the wrapper's `data-v-` scope id (any part deeper than `root`), reach it with `:deep(.owned-class)` — still no `.p-*`, still no `!important`.
- The override wins **without `!important`** because the wrapper's unlayered scoped CSS beats PrimeVue's `@layer primevue` defaults — true for both the plain `.ds-code-input__row` rule and the `:deep(.ds-code-input__cell)` rules.
- Never hardcode hex colors — all cell/row colors already use `var(--p-*)` tokens; keep them.
- Biome: single quotes, 2-space indent, 100-char width. Lint-staged runs `biome check --write` on commit.
- Branch/PR per **wave** (NFR7): Epic 12 is a single-story wave, so this story = the whole Wave 3 branch/PR. Validation runs per component (NFR4) — here, once.

### Project Structure Notes

Single-file change: `src/components/DsCodeInput/DsCodeInput.vue` (`otpPassThrough` computed + `<style scoped>` block). Aligns with `refactor-styles-plan.md` Wave 3 and FR7/FR8. The four-file component layout (`.vue`, `.stories.ts`, `.test.ts`, `index.ts`) is untouched except the `.vue`. No conflicts with the unified structure.

### Probe snippet (delete after use)

```ts
// tmp/probe-code-input.test.ts — mount, dump HTML, then delete the file.
import { mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import { writeFileSync } from 'node:fs';
import { describe, it } from 'vitest';
import DsCodeInput from '../src/components/DsCodeInput/DsCodeInput.vue';
const g = { plugins: [[PrimeVue, { theme: 'none' }]] };
describe('probe', () => {
  it('dump', () => {
    const w = mount(DsCodeInput, { props: { modelValue: '12', length: 4, label: 'Code' }, global: g });
    const html = w.html();
    writeFileSync('tmp/probe-out.txt', html);
    // Cell input should have NO data-v- attr; OTP root SHOULD have it.
    writeFileSync('tmp/probe-summary.txt',
      'cell: ' + (html.match(/<input[^>]*p-inputotp-input[^>]*>/)?.[0] ?? 'NONE') +
      '\nroot: ' + (html.match(/<div[^>]*p-inputotp[^>]*>/)?.[0] ?? 'NONE'));
  });
});
```

### References

- [Source: _bmad-output/planning-artifacts/epics-refactor-styles.md#Story 12.1] — story statement + BDD acceptance criteria (FR7, FR8).
- [Source: _bmad-output/planning-artifacts/refactor-styles-plan.md#Wave 3 — DsCodeInput] — refactor steps; audit count (DsCodeInput = 11 `:deep(.p-inputotp-input)` + the `.p-inputotp` row strip); "no `:dt` candidates"; preserve placeholder + reduced-motion.
- [Source: _bmad-output/planning-artifacts/epics-refactor-styles.md#Requirements Inventory] — FR7, FR8, FR1 (cross-cutting conformance), NFR1/NFR3/NFR4/NFR5/NFR6/NFR7/NFR8.
- [Source: src/components/DsCodeInput/DsCodeInput.vue:58-80] — `otpPassThrough` computed (where the two `class` injections go; keep placeholder + aria merge).
- [Source: src/components/DsCodeInput/DsCodeInput.vue:131-238] — the `<style>` block: row strip (`:131`) + the 11 cell `:deep(.p-inputotp-input)` blocks + the `prefers-reduced-motion` `@media` (`:230-238`).
- [Source: node_modules/primevue/inputotp/InputOtp.vue:2-28] — InputOtp renders `<OtpInputText>` (InputText) nested child components → cells are grandchild-component DOM (root cause of the no-scope-id finding).
- [Source: docs/component-addition-guide.md#2c-styling-customization-priority-order] — `:pt`-attach-class pattern + gotcha #4 (root vs inner-part scope-id; the silent-no-op failure mode).
- [Source: _bmad-output/implementation-artifacts/11-1-refactor-dsbutton-loading-state-visibility-and-icon-sizing-through-pt-keys.md] — established the scope-id finding (corrected Completion Notes) + the probe-then-decide method.
- [Source: _bmad-output/implementation-artifacts/11-3-mirror-dsbutton-loading-state-refactor-in-dsiconbutton.md] — reused the scope-id finding; precedent that "mirror the `:pt` shape" BDD wording is superseded by empirical DOM behavior.
- [Source: src/components/DsCodeInput/DsCodeInput.test.ts:145-170,235-255] — forwarded-`pt` tests (placeholder, consumer-merge, aria) that must stay green untouched after the `class` injection.
- [Source: CLAUDE.md#Conventions] — priority order and anti-patterns.
- [Memory: project-pt-scope-id-inner-parts] — `:pt`-attach-class + plain scoped CSS reaches the `root` part only; inner parts lack the `data-v-` scope id and scoped selectors silently match nothing.

## Dev Agent Record

### Agent Model Used

claude-opus-4-8 (1M context)

### Debug Log References

- Scope-id probe (Vitest mount, `theme:'none'`): OTP root carries `data-v-46edf2d3`; cell `<input>` carries `data-pc-name="pcinputtext"`/`data-pc-extend="inputtext"` but **no** `data-v-`. Confirms row → plain scoped, cells → `:deep(owned-class)`.
- Built-CSS check (`dist/index.css`): row compiles to `.ds-code-input__row[data-v-dfbd5581]`; all 15 cell selectors compile to `.ds-code-input[data-v-dfbd5581] .ds-code-input__cell…` (scope-id on the wrapper, descendant requirement stripped by `:deep`). The silent-no-op trap form `.ds-code-input__cell[data-v-…]` is absent.
- Class-attachment probe: `ds-code-input__row` lands on the OTP root and `ds-code-input__cell` on each cell `<input>`; consumer-supplied `pt.root.class` / `pt.pcInputText.root.class` merge alongside (not clobbered); placeholder `' '` preserved.
- `git stash` baseline: the 15 `DsSelect.test.ts` failures reproduce identically without this change (pre-existing, Epic 13 territory).

### Completion Notes List

- **Internals-only refactor — zero public API diff (NFR3/AC #10).** Only `src/components/DsCodeInput/DsCodeInput.vue` changed: the `otpPassThrough` computed (two `class` injections + a new `root` key) and the `<style>` block (1 row rule + 15 cell selectors). The `<script setup>` interface/props/`defineModel` and the rest of the template are untouched.
- **Scope-id split honored.** Row → plain scoped `.ds-code-input__row` (OTP root carries `data-v-`); cells → `:deep(.ds-code-input__cell)` (owned class; cell `<input>` is grandchild-component DOM with no `data-v-`). Verified empirically by DOM probe + built-CSS check, not on trust. `:deep` on an **owned** class is NFR1/NFR8-compliant (the prohibition is on `:deep(.p-*)` only).
- **`class="ds-code-input__otp"` removed** from `<InputOtp>` (Task 3 choice): it was a redundant, never-styled hook; the row is now styled via the `:pt`-attached `.ds-code-input__row`. Grep confirmed nothing else referenced it.
- **Consumer-`pt` merge preserved.** Both `class` injections use the `['ds-...', consumerClass].filter(Boolean)` array form, so consumer-supplied root/cell classes merge instead of being clobbered. Existing placeholder + aria-merge tests (`DsCodeInput.test.ts:145-170,235-255`) stay green untouched.
- **Validation triple green:** `npm run build` exit 0 (no new warnings); DsCodeInput suite 31/31; `npm run lint` clean. Full suite: 551 passed, 15 failed — all 15 in `DsSelect.test.ts`, confirmed pre-existing via `git stash`.
- **Visual parity (headless):** no browser in this environment, so parity was verified analytically per the Story 10.1/11.1 precedent — built-CSS selector compilation + runtime class attachment + specificity analysis (cells `(0,3,0)` unchanged; row `(0,2,0)` unlayered still beats PrimeVue's `@layer primevue` defaults). A real-browser AllStates spot-check remains the recommended final manual confirmation at review.
- **Probe files** created under `tmp/` and deleted after use (per CLAUDE.md scratch convention).

### File List

- `src/components/DsCodeInput/DsCodeInput.vue` (modified)
- `src/components/DsCodeInput/DsCodeInput.test.ts` (modified — code-review patch: +2 forwarded-`pt` tests for the new `root.class` row injection)

### Post-review patch (code-review, 2026-06-08)

Code review (Blind Hunter / Edge Case Hunter / Acceptance Auditor) passed: all audited ACs satisfied, scope-id trap correctly handled, zero public-API diff. One actionable finding — the new `root.class` injection had no test coverage (existing suite only asserts `pcInputText.root.*`). Applied patch: added two tests mirroring the existing forwarded-`pt` assertions (non-brittle prop-shape checks, not the prohibited `:deep`/CSS-resolution kind) — one asserting `forwarded.root.class` / `forwarded.pcInputText.root.class` carry the owned classes, one asserting consumer-supplied root/cell classes merge. DsCodeInput suite now 33/33; lint clean; full suite 553 passed (15 `DsSelect.test.ts` failures remain pre-existing). Deferred (pre-existing, out of scope): function-form `pt` is dropped by the object spread — the wrapper has always accepted object-form `pt` only; supporting function-form would be a behavior change beyond this internals-only refactor.

## Change Log

| Date | Version | Description | Author |
| ---- | ------- | ----------- | ------ |
| 2026-06-07 | 0.1 | Story drafted: migrate DsCodeInput row (`:deep(.p-inputotp)` → plain scoped `.ds-code-input__row`) and 11 cell rules (`:deep(.p-inputotp-input)` → `:deep(.ds-code-input__cell)`, owned class) via `:pt`-attached classes. Scope-id split (row carries `data-v-`, cells do not) verified by DOM probe and documented as the central correctness call. | Yurii |
| 2026-06-07 | 1.0 | Implemented: `otpPassThrough` gains `root.class` (`ds-code-input__row`) + `pcInputText.root.class` (`ds-code-input__cell`), both merging consumer `pt`; row rule → plain scoped, 15 cell selectors → `:deep(.ds-code-input__cell)`; removed redundant `class="ds-code-input__otp"`. Zero `:deep(.p-*)`/`!important` remain. Scope-id split re-verified via DOM probe + built-CSS check. Validation triple green (build 0, DsCodeInput 31/31, lint clean; 15 DsSelect failures confirmed pre-existing). Status → review. | Yurii |
| 2026-06-08 | 1.1 | Code-review patch: added 2 forwarded-`pt` tests covering the new `root.class` row injection + consumer-class merge (closes the only actionable review finding). DsCodeInput 33/33, lint clean, full suite 553 passed (15 pre-existing DsSelect failures). | Yurii |
