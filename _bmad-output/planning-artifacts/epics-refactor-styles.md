---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments:
  - _bmad-output/planning-artifacts/refactor-styles-plan.md
---

# desing-system-vue — Refactor Styles Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for the **PrimeVue customization style refactor** of `desing-system-vue`, decomposing requirements from `refactor-styles-plan.md` into implementable stories.

The refactor aligns all 13 `Ds*` components in `src/components/` to a strict customization priority order:
1. `:dt="..."` — design token overrides
2. `:pt="..."` — pass-through, attach an owned class to a specific PrimeVue inner part, then style that class with plain scoped CSS
3. `<style scoped>` — only for DOM the wrapper itself owns

The output of this refactor is internals-only: **no public API changes, no consumer-visible diff**.

## Requirements Inventory

### Functional Requirements

FR1: All 13 `Ds*` components in `src/components/` conform to the customization priority order (`:dt` → `:pt` → scoped own-DOM CSS), with no `:deep(.p-*)` selectors reaching into PrimeVue internals.

FR2: DsAvatar root styling is migrated from `:deep(.p-avatar)` to a `:pt`-attached class (`ds-avatar__inner`). Any background/padding/border-radius values that map to PrimeVue Avatar tokens are moved to `:dt` instead of class CSS.

FR3: DsBadge root styling is migrated from `:deep(.p-badge)` to a `:pt`-attached class (`ds-badge__inner`), with all 9 `!important` declarations eliminated.

FR4: DsButton loading-state visibility uses `:pt` keys (`label`, `icon`) attaching owned classes (`ds-button__label`, `ds-button__icon`). Icon sizing is pushed to `:dt` if PrimeVue exposes a Button `icon.size` token; otherwise styled via the `:pt`-attached class.

FR5: DsButton's `.ds-button--medium { font-size: var(--p-button-font-size) !important }` rule is investigated and, where possible, moved into the existing `sizeTokens` `:dt` map.

FR6: DsIconButton's loading-state visibility mirrors DsButton's `:pt` key approach (same `label`/`icon` keys + owned classes).

FR7: DsCodeInput extends `otpPassThrough` to attach owned classes via `:pt` (`pcInputText.root.class: 'ds-code-input__cell'`, `pt.root.class: 'ds-code-input__row'`), and rewrites all 11 `:deep(.p-inputotp-input)` selectors against those owned classes.

FR8: DsCodeInput preserves the `placeholder=" "` (single space) on `pcInputText.root` so the `:not(:placeholder-shown)` "filled" detection trick continues to work.

FR9: DsSelect maps every `:deep(.p-*)` selector to a `:pt` slot per the mapping table — `label` → `ds-select__label`, `dropdown` → `ds-select__dropdown`, `clearIcon` → `ds-select__clear`, plus a placeholder-state class on `label`. Already-wired `overlay: { class: overlayClass }` is extended.

FR10: DsSelect trigger root class (`ds-select__trigger`) is attached via `:pt="{ root: { class: 'ds-select__trigger' } }"` to land on the actual PrimeVue root (not via the wrapper `<div>`), so trigger styles (border/background/box-shadow) win specificity without `!important`. Trigger `border-color`/`background`/`box-shadow` overrides are migrated to `:dt` where the Select preset exposes tokens.

FR11: DsSelect placeholder color is attempted via `:dt` (e.g., `select.placeholder.color`); if that path doesn't resolve in `dsPreset`, fall back to a `:pt` label-class flag (`ds-select__label--placeholder`) styled in scoped CSS.

FR12: `docs/component-addition-guide.md` is updated to document the `:pt`-attach-class pattern alongside the `:dt` rule, with DsAvatar's refactor as the reference example.

### NonFunctional Requirements

NFR1: Zero `:deep(.p-*)` selectors remain in any refactored component (DsIcon's `:deep(svg)` targets a slotted SVG, not PrimeVue, and is exempt).

NFR2: Zero `!important` declarations remain in the DsBadge style block. `!important` count in DsSelect drops to zero (or, if a residual case is justified, it is documented inline with the reason).

NFR3: No public prop or event API changes. Consumers must see no diff after the refactor.

NFR4: After every component change, the validation triple passes: `npm run build && npm test && npm run lint`. Validation runs **per component**, not only at end of wave.

NFR5: Storybook visual parity is verified for each touched component across light + dark themes and all documented states/sizes/severities (e.g., empty / hover / focus / filled / error / disabled; sm/md; single/multi where applicable).

NFR6: DsCodeInput's `@media (prefers-reduced-motion: no-preference)` wrapper around transitions is preserved through the refactor.

NFR7: Refactor work is delivered **one branch (and PR) per wave**, not per component, to keep validation runs and review scope coherent.

NFR8: No `:deep(.p-*)`, no `!important`, and no `:host` selectors are introduced anywhere in the refactor. Style attachment must always go through `:pt`-owned classes.

### Additional Requirements

- Consult `src/theme/ds-preset.ts` before any `:dt` decision; the preset is the design-token source of truth.
- For each candidate `:dt` migration, verify that PrimeVue exposes the token in its theme keys before attempting the override (don't invent token paths).
- For DsSelect placeholder, verify the exact `:dt` token path against `dsPreset` and PrimeVue's Select theme keys.
- Consider adding screenshot stories for DsSelect **before** starting Wave 4 — DsSelect deserves a visual regression net before its rewrite.
- Consider standing up Loki or Chromatic before Wave 4 (no automated visual regression exists today; manual Storybook walk-throughs are the only check).
- Update `docs/component-addition-guide.md` in Wave 1 (not at the end), so subsequent waves reference the canonical pattern documentation.

### UX Design Requirements

_Not applicable. This refactor is internals-only and produces no UX or visual changes for consumers — the success criterion is "Storybook looks identical before and after." Any visual diff is a regression, not a feature._

### FR Coverage Map

FR1: Epics 10–13 — cross-cutting "priority-order conformance"; the union of Epics 10–13 covers all 6 in-scope components (the other 7 are already aligned and need no work). Each epic's per-component story includes "no `:deep(.p-*)` remains" as an AC.
FR2: Epic 10 — DsAvatar `:pt` class + `:dt` token migration.
FR3: Epic 10 — DsBadge `:pt` class + `!important` elimination.
FR4: Epic 11 — DsButton loading-state `:pt` keys (`label`, `icon`).
FR5: Epic 11 — DsButton `--medium !important` investigation and resolution.
FR6: Epic 11 — DsIconButton mirrors DsButton.
FR7: Epic 12 — DsCodeInput `otpPassThrough` extension with `pcInputText.root` + `root` class hooks.
FR8: Epic 12 — DsCodeInput placeholder preservation for `:not(:placeholder-shown)` filled detection.
FR9: Epic 13 — DsSelect `:pt` slot mapping (label, dropdown, clearIcon, overlay).
FR10: Epic 13 — DsSelect trigger root class via `:pt` + `:dt` migration of trigger tokens.
FR11: Epic 13 — DsSelect placeholder color via `:dt` (with `:pt` fallback).
FR12: Epic 10 — `docs/component-addition-guide.md` updated with the `:pt`-attach-class pattern.

## Epic List

### Epic 10: Pilot the `:pt`-attach-class pattern (Wave 1)
**User outcome:** Design system maintainer can refactor any component by following a documented, worked-example pattern. Two of the simplest components (DsAvatar, DsBadge) conform to the priority order and serve as canonical references.

**Why first:** Establishes the technique on the lowest-risk surface area, eliminates the `!important`-heavy DsBadge style block, and produces the documentation update that subsequent waves rely on.

**FRs covered:** FR1 (partial — 2 of 6 in-scope components), FR2, FR3, FR12
**NFRs exercised:** NFR1, NFR2, NFR3, NFR4, NFR5, NFR7, NFR8

### Epic 11: Conform Button family loading states (Wave 2)
**User outcome:** DsButton and DsIconButton route loading-state visibility (label/icon) through `:pt`-attached owned classes, removing the last `:deep(.p-button-*)` patches in the Button family. The `--medium font-size !important` rule is either migrated into `sizeTokens` `:dt` or has its existence justified.

**Why this slice:** Mechanically similar to Epic 10 but on a higher-traffic component; the loading-state pattern is reused between DsButton and DsIconButton, so they ship together.

**FRs covered:** FR1 (partial), FR4, FR5, FR6
**NFRs exercised:** NFR1, NFR3, NFR4, NFR5, NFR7, NFR8

### Epic 12: Conform DsCodeInput cell styling (Wave 3)
**User outcome:** DsCodeInput cells (43×58 px OTP cells) are styled through owned `ds-code-input__cell` / `ds-code-input__row` classes attached via `:pt`, with all 11 `:deep(.p-inputotp-input)` selectors removed. The "filled cell" detection trick (placeholder + `:not(:placeholder-shown)`) and the `prefers-reduced-motion` transition behavior are preserved exactly.

**Why this slice:** Self-contained component with bespoke sizing (no `:dt` candidates per the plan), but enough internal complexity (multi-state cells, ARIA forwarding) that it deserves its own focused wave before tackling DsSelect.

**FRs covered:** FR1 (partial), FR7, FR8
**NFRs exercised:** NFR1, NFR3, NFR4, NFR5, NFR6, NFR7, NFR8

### Epic 13: Conform DsSelect — the long pole (Wave 4)
**User outcome:** The 760-line, `!important`-heavy DsSelect customization is rebuilt on `:dt` tokens and `:pt`-attached classes. Trigger, label, dropdown, clearIcon, placeholder, and overlay are all themed without reaching into PrimeVue internals — meaning the component survives a PrimeVue 4.x → 5.x upgrade without specificity wars. A visual regression baseline (screenshot stories or Loki/Chromatic) exists *before* the rewrite begins.

**Why last:** Highest risk, largest surface, and the most `!important` declarations to retire. Going last means the pattern is documented (Epic 10), proven on three other components (Epics 11–12), and the team has a calibrated sense of edge cases before opening this one up.

**FRs covered:** FR1 (final 1 of 6 in-scope components), FR9, FR10, FR11
**NFRs exercised:** NFR1, NFR2, NFR3, NFR4, NFR5, NFR7, NFR8

---

## Epic 10: Pilot the `:pt`-attach-class pattern (Wave 1)

Establish the canonical `:dt` → `:pt`-attach-class → scoped-CSS refactor pattern by applying it to the two simplest non-conforming components (DsAvatar, DsBadge) and codifying the technique in `docs/component-addition-guide.md`. Wave 1 succeeds when subsequent waves can be executed by following a worked example, with no design or strategy work left to figure out.

### Story 10.1: Refactor DsAvatar root styling to `:pt`-attached class with `:dt` token migration

As a design system maintainer,
I want DsAvatar's PrimeVue customization to flow through `:dt` tokens and a `:pt`-attached owned class instead of `:deep(.p-avatar)`,
So that DsAvatar survives PrimeVue upgrades without specificity wars and serves as the reference example for the new pattern.

**Acceptance Criteria:**

**Given** the current `DsAvatar.vue` contains a `.ds-avatar:deep(.p-avatar) { ... }` style block
**When** the refactor is complete
**Then** the `<Avatar>` element receives `:pt="{ root: { class: 'ds-avatar__inner' } }"` and the previous `:deep(.p-avatar)` block is rewritten as plain `.ds-avatar__inner { ... }` selectors in scoped CSS
**And** zero `:deep(.p-*)` selectors remain in `DsAvatar.vue`
**And** no `!important` declarations are introduced

**Given** the existing class CSS contains background, padding, or border-radius declarations
**When** evaluating each declaration against `src/theme/ds-preset.ts` and PrimeVue's Avatar theme keys
**Then** any value that maps to a PrimeVue Avatar token is moved to `:dt="{ avatar: { ... } }"` (or the documented per-instance equivalent) instead of staying in class CSS
**And** any value with no matching token remains on `.ds-avatar__inner` with a one-line comment naming the absent token (only if the absence is non-obvious)

**Given** the refactored component
**When** running `npm run build && npm test && npm run lint`
**Then** all three commands exit zero with no new warnings

**Given** Storybook is running
**When** walking through every DsAvatar story in light and dark themes across all sizes and variant combinations
**Then** the rendered output is visually identical to the pre-refactor baseline (manual diff)

**Given** the public API of DsAvatar
**When** comparing exported props, slots, events, and TypeScript types before and after
**Then** there is zero diff (NFR3 — internals-only refactor)

### Story 10.2: Refactor DsBadge root styling to `:pt`-attached class and eliminate `!important`

As a design system maintainer,
I want DsBadge's nine `!important` declarations gone and its styling routed through a `:pt`-attached owned class,
So that DsBadge no longer fights PrimeVue's specificity and proves the pattern handles `!important`-heavy cases.

**Acceptance Criteria:**

**Given** `DsBadge.vue` currently contains `.ds-badge:deep(.p-badge) { ... }` with 9 `!important` declarations
**When** the refactor is complete
**Then** the `<Badge>` element receives `:pt="{ root: { class: 'ds-badge__inner' } }"` and styling is rewritten as plain `.ds-badge__inner { ... }` selectors targeting the owned class
**And** zero `:deep(.p-*)` selectors remain in `DsBadge.vue`
**And** zero `!important` declarations remain in the `<style scoped>` block

**Given** any color, size, or radius declaration in the rewritten block
**When** checking against `src/theme/ds-preset.ts` and PrimeVue's Badge theme keys
**Then** values that map to existing tokens are migrated to `:dt`; the remainder live on `.ds-badge__inner`

**Given** the refactored component
**When** running `npm run build && npm test && npm run lint`
**Then** all three commands exit zero

**Given** Storybook is running
**When** walking through every DsBadge story (all severities, sizes, dot/value variants) in light and dark
**Then** the rendered output is visually identical to the pre-refactor baseline

**Given** PrimeVue 4.x is the consumed major version
**When** mounting DsBadge in a real consumer fixture (not just Storybook)
**Then** the badge renders with the intended override values (verifies that removing `!important` does not allow PrimeVue defaults to win in a real app context)

### Story 10.3: Document the `:pt`-attach-class pattern in `docs/component-addition-guide.md`

As a design system contributor,
I want a worked example of the `:pt`-attach-class pattern in the canonical component guide,
So that future component refactors and new components follow the priority order without me having to read prior PRs.

**Acceptance Criteria:**

**Given** `docs/component-addition-guide.md` currently mentions `:dt` as the primary customization tool
**When** the documentation update lands
**Then** the guide explicitly documents the priority order (`:dt` → `:pt`-attach-class → scoped own-DOM CSS)
**And** includes a "When to use `:pt` to attach a class" subsection with the rule "use this when `:dt` does not expose the value, before reaching for `:deep`"
**And** uses DsAvatar's refactor as the worked example (file path reference, before/after snippet, key gotchas)

**Given** the guide previously contained any "anti-patterns" list
**When** the update lands
**Then** that list is extended with: "no `:deep(.p-*)`", "no `!important` to fight PrimeVue specificity", "no `:host` selectors"

**Given** Stories 10.1 and 10.2 are merged
**When** the documentation references them
**Then** the worked example uses the post-refactor DsAvatar code (so the doc and the code agree)

**Given** the guide is the source of truth referenced from `CLAUDE.md` and the `front-end-dev` skill
**When** these references are checked
**Then** they still link to the correct sections (no broken anchors)

---

## Epic 11: Conform Button family loading states (Wave 2)

Eliminate the remaining `:deep(.p-button-*)` patches in DsButton and DsIconButton by routing loading-state label/icon visibility and icon sizing through `:pt`-attached owned classes (and `:dt` where PrimeVue exposes tokens), and resolve the suspicious `--medium font-size !important` rule.

### Story 11.1: Refactor DsButton loading-state visibility and icon sizing through `:pt` keys

As a design system maintainer,
I want DsButton's loading state to hide the label and icon via owned classes attached through `:pt`,
So that the `:deep(.p-button-label)` / `:deep(.p-button-icon)` patches disappear and the loading dots stay correctly positioned over the hidden content.

**Acceptance Criteria:**

**Given** `DsButton.vue` currently uses `:deep(.p-button-label)` and `:deep(.p-button-icon)` to hide content during loading and to size the icon
**When** the refactor is complete
**Then** the `<Button>` receives `:pt="{ label: { class: 'ds-button__label' }, icon: { class: 'ds-button__icon' } }"`
**And** loading-state visibility is gated by `.ds-button--loading .ds-button__label { visibility: hidden }` (and icon equivalent), no `:deep`

**Given** PrimeVue's Button theme is inspected for an `icon.size` (or equivalent) token
**When** a token exists
**Then** icon sizing is moved to the existing `sizeTokens` `:dt` map (alongside other size-tier tokens)
**When** no token exists
**Then** icon sizing remains as plain CSS on `.ds-button__icon` and the rationale is captured inline in the story-completion notes

**Given** the loading dots overlay
**When** loading is true
**Then** the dots are positioned over the hidden label/icon and the button's outer width does not change (no layout shift)

**Given** `loading=true` and `disabled=true` simultaneously
**When** the component renders
**Then** behavior matches the pre-refactor baseline (disabled styling wins; loading dots still visible per current convention)

**Given** the refactored component
**When** running `npm run build && npm test && npm run lint`
**Then** all three commands exit zero
**And** zero `:deep(.p-button-*)` selectors remain in `DsButton.vue` (other `:deep` selectors targeting non-PrimeVue elements are out of scope)

**Given** every DsButton Storybook story (all variants × sizes × loading × disabled) in light and dark
**When** visually compared to the pre-refactor baseline
**Then** there is no perceptible diff

### Story 11.2: Resolve DsButton `--medium font-size !important` rule

As a design system maintainer,
I want the `.ds-button--medium { font-size: var(--p-button-font-size) !important }` rule either migrated to the `sizeTokens` `:dt` map or kept with a documented reason,
So that the last `!important` in DsButton is no longer mysterious and the size-tier story stays consistent.

**Acceptance Criteria:**

**Given** the current `DsButton.vue` contains the `.ds-button--medium { font-size: var(--p-button-font-size) !important }` rule
**When** investigating whether the medium size's font-size can be expressed via the existing `sizeTokens` `:dt` map (alongside the other size-tier tokens)
**Then** if PrimeVue's Button preset accepts a font-size token at the medium tier, the rule is removed and the value is added to `sizeTokens.medium` in `:dt`
**And** if it cannot, the `!important` is removed but the CSS rule is kept with a one-line comment explaining what specificity it overrides and why it is required

**Given** the post-refactor component
**When** running every DsButton size story (small, medium, large) in Storybook
**Then** medium-size font-size renders identically to the pre-refactor baseline

**Given** the component
**When** running `npm run build && npm test && npm run lint`
**Then** all three commands exit zero

**Given** the result of the investigation
**When** completing the story
**Then** the outcome (migrated vs. kept-with-rationale) is recorded in the PR description so future maintainers do not re-investigate

### Story 11.3: Mirror DsButton's loading-state refactor in DsIconButton

As a design system maintainer,
I want DsIconButton's loading-state styling to use the same `:pt` keys (`label`, `icon`) and owned classes as DsButton,
So that the Button family is internally consistent and DsIconButton is also free of `:deep(.p-button-*)` patches.

**Acceptance Criteria:**

**Given** `DsIconButton.vue` currently uses `:deep(.p-button-icon)` (or similar) to hide the icon during loading
**When** the refactor is complete
**Then** the `<Button>` receives the same `:pt` shape as Story 11.1 (label class + icon class) and loading-state visibility is gated by owned-class selectors
**And** zero `:deep(.p-button-*)` selectors remain in `DsIconButton.vue`

**Given** DsIconButton has no visible label (icon-only)
**When** loading is true
**Then** the icon is hidden and the loading indicator centers in the icon's place (no layout shift)

**Given** the refactored component
**When** running `npm run build && npm test && npm run lint`
**Then** all three commands exit zero

**Given** every DsIconButton Storybook story in light and dark
**When** visually compared to the pre-refactor baseline
**Then** there is no perceptible diff

---

## Epic 12: Conform DsCodeInput cell styling (Wave 3)

Move all 11 `:deep(.p-inputotp-input)` selectors in DsCodeInput onto owned classes attached via `:pt` (extending the existing `otpPassThrough`), while preserving the placeholder-based "filled cell" detection trick and the `prefers-reduced-motion` transition guard.

### Story 12.1: Migrate DsCodeInput cell and row styling to `:pt`-attached owned classes

As a design system maintainer,
I want every `:deep(.p-inputotp-input)` rule in DsCodeInput rewritten as a selector against an owned class attached via `:pt`,
So that DsCodeInput conforms to the priority order without breaking its multi-state cell rendering, ARIA forwarding, placeholder trick, or reduced-motion guard.

**Acceptance Criteria:**

**Given** `DsCodeInput.vue` currently has an `otpPassThrough` `:pt` object and 11 `:deep(.p-inputotp-input)` rules in scoped CSS
**When** the refactor is complete
**Then** `otpPassThrough` is extended so that `pcInputText.root.class` includes `'ds-code-input__cell'`
**And** the OTP root receives `pt.root.class: 'ds-code-input__row'` (replacing the previous `.p-inputotp` `:deep` strip block)
**And** all 11 `:deep` rules are rewritten as selectors against `.ds-code-input__cell` (with appropriate state modifiers like `.ds-code-input--error .ds-code-input__cell`, etc.)
**And** zero `:deep(.p-inputotp-input)` selectors remain
**And** zero `:deep(.p-inputotp)` selectors remain

**Given** the existing `pcInputText.root.placeholder` is set to a single space (`" "`)
**When** the refactor lands
**Then** that placeholder remains a single space (FR8 — preserves the `:not(:placeholder-shown)` "filled" detection trick)
**And** the existing `.ds-code-input__cell:not(:placeholder-shown)` selector (or equivalent) renders the "filled" state correctly across all six per-cell states (empty/hover/focus/filled/error/error-focus/disabled)

**Given** the existing `@media (prefers-reduced-motion: no-preference)` block scopes cell transitions
**When** the refactor lands
**Then** the same media query wraps the new owned-class transition rules (NFR6)
**And** with `prefers-reduced-motion: reduce`, no transitions fire on the cells

**Given** the existing ARIA forwarding from the wrapper to the inner inputs
**When** the refactor lands
**Then** ARIA attributes (label, describedby, invalid) reach the inputs unchanged

**Given** the refactored component
**When** running `npm run build && npm test && npm run lint`
**Then** all three commands exit zero

**Given** every DsCodeInput Storybook story (length variants × empty / partial / filled / error / disabled × light + dark)
**When** visually compared to the pre-refactor baseline
**Then** there is no perceptible diff

**Given** keyboard focus moves through the cells
**When** typing, deleting, and pasting a code
**Then** behavior matches the pre-refactor baseline (cells advance/retreat correctly; paste fills all cells)

---

## Epic 13: Conform DsSelect — the long pole (Wave 4)

Rebuild the 760-line, `!important`-heavy DsSelect customization on `:dt` tokens and `:pt`-attached classes. Establish a visual regression baseline first, then migrate inner-part styling, trigger root styling, and placeholder color in sequence; finish with an `!important` audit.

### Story 13.1: Establish visual regression baseline for DsSelect before rewrite

As a design system maintainer,
I want a deterministic visual baseline of every DsSelect state captured before the refactor begins,
So that the inevitable "did this break?" questions during the rewrite have a yes/no answer rather than a manual eye-diff.

**Acceptance Criteria:**

**Given** the current DsSelect Storybook story coverage
**When** auditing it against the validation matrix in the plan (empty / hovered / focused / open / filled / error / disabled × small / medium × single / multi)
**Then** any missing combination has a story added before the rewrite starts
**And** every state has a story with a stable, deterministic name and props

**Given** the project has no automated visual regression tooling today
**When** considering Loki vs. Chromatic vs. screenshot-only
**Then** the chosen approach is documented in the story-completion notes (with rationale: cost, CI integration, who runs it)
**And** at minimum, screenshot stories exist as a manual baseline that a reviewer can `git diff` against post-refactor

**Given** the baseline is captured
**When** running the validation triple
**Then** `npm run build && npm test && npm run lint` exit zero (no new lint warnings on the added stories)

**Given** Stories 13.2–13.5 are about to start
**When** opening the Wave 4 PR
**Then** the baseline is referenced (link or commit hash) and reviewers can use it during PR review

### Story 13.2: Migrate DsSelect inner-part styling to `:pt`-attached classes

As a design system maintainer,
I want DsSelect's label, dropdown, clearIcon, and overlay parts styled through `:pt`-attached owned classes instead of `:deep(.p-select-*)`,
So that those four parts no longer fight PrimeVue's specificity and the existing `overlay` `:pt` slot pattern extends naturally to its siblings.

**Acceptance Criteria:**

**Given** the current `DsSelect.vue` uses `:deep(.p-select-label)`, `:deep(.p-select-dropdown)`, `:deep(.p-select-clear-icon)` (and multiselect equivalents)
**When** the refactor is complete
**Then** the `<Select>` `:pt` is extended with `label: { class: 'ds-select__label' }`, `dropdown: { class: 'ds-select__dropdown' }`, `clearIcon: { class: 'ds-select__clear' }`
**And** the existing `overlay: { class: overlayClass }` wiring is preserved
**And** the corresponding scoped CSS rules now target `.ds-select__label`, `.ds-select__dropdown`, `.ds-select__clear` directly

**Given** the multi-select variant
**When** the same `:pt` keys are applied
**Then** they resolve to the equivalent multiselect inner parts (PrimeVue uses the same `:pt` key names for Select and MultiSelect)
**And** if any key does not resolve, the divergence is documented and a separate handling path is implemented

**Given** the refactored component (Story 13.2 only, before 4.3)
**When** running `npm run build && npm test && npm run lint`
**Then** all three commands exit zero
**And** the Wave 4 PR has not been opened yet (this is an in-progress wave commit)

### Story 13.3: Migrate DsSelect trigger root to `:pt`-attached class with `:dt` token migration

As a design system maintainer,
I want DsSelect's trigger root class (`ds-select__trigger`) attached to the actual PrimeVue root via `:pt` and its border / background / box-shadow values driven by `:dt` tokens where exposed,
So that trigger styles win specificity natively and the residual `!important` declarations on hover and focus drop away.

**Acceptance Criteria:**

**Given** the current `DsSelect.vue` declares `.ds-select__trigger` on a wrapper `<div>` (not on the PrimeVue root) and uses `!important` to override hover/focus styling
**When** the refactor is complete
**Then** the class is attached via `:pt="{ root: { class: 'ds-select__trigger' } }"` to the PrimeVue Select root
**And** trigger `border-color`, `background`, and `box-shadow` overrides are migrated to `:dt` for any token the Select preset exposes (verified against `src/theme/ds-preset.ts` and PrimeVue's Select theme keys)
**And** any value with no matching token remains on the owned class as plain CSS, no `!important`

**Given** the trigger's hover, focus, open, and error states
**When** each state is exercised in Storybook
**Then** the visual result matches the baseline from Story 13.1

**Given** the refactored component
**When** running `npm run build && npm test && npm run lint`
**Then** all three commands exit zero

### Story 13.4: Migrate DsSelect placeholder color via `:dt` (with `:pt` fallback)

As a design system maintainer,
I want DsSelect's placeholder color driven by a Select placeholder token (`:dt`) rather than a fragile `:deep(.p-select-label.p-placeholder)` selector,
So that the placeholder styling does not depend on undocumented PrimeVue class names.

**Acceptance Criteria:**

**Given** the Select preset and PrimeVue's Select theme keys
**When** a placeholder color token is exposed (verified by inspection of `src/theme/ds-preset.ts` and PrimeVue's documented theme tokens)
**Then** placeholder color is set via `:dt="{ select: { placeholder: { color: '...' } } }"` (or the documented equivalent path)
**And** the `:deep(.p-select-label.p-placeholder)` rule is removed

**Given** no Select placeholder token is exposed
**When** the fallback path is taken
**Then** the `:pt="{ label: { class: 'ds-select__label' } }"` from Story 13.2 is extended with a state-flag class (`ds-select__label--placeholder`) added when the value is empty / placeholder is shown
**And** the placeholder color is styled via `.ds-select__label--placeholder { color: ... }` in scoped CSS, no `:deep`

**Given** either path is implemented
**When** placeholder is shown vs. value is selected
**Then** color transitions match the pre-refactor baseline in light and dark

**Given** the refactored component
**When** running `npm run build && npm test && npm run lint`
**Then** all three commands exit zero

### Story 13.5: Audit and remove residual `!important` declarations in DsSelect

As a design system maintainer,
I want a final pass on DsSelect that removes every remaining `!important` (or documents inline why a stubborn case must stay),
So that NFR2 holds and DsSelect's style block matches the rest of the conformed components.

**Acceptance Criteria:**

**Given** Stories 13.1–13.4 are complete
**When** grepping `DsSelect.vue` for `!important`
**Then** zero matches remain
**Or** any remaining match has a one-line inline comment naming exactly what specificity it overrides and why no token / `:pt` path can remove it

**Given** the now-`:pt`-attached classes
**When** specificity is checked against PrimeVue's defaults using DevTools
**Then** the owned class wins specificity natively (no `!important` needed)

**Given** the entire DsSelect validation matrix from Story 13.1 (empty / hovered / focused / open / filled / error / disabled × small / medium × single / multi × light / dark)
**When** each state is checked against the baseline captured in Story 13.1
**Then** there is no perceptible visual diff

**Given** the full Wave 4 commit set
**When** running `npm run build && npm test && npm run lint`
**Then** all three commands exit zero
**And** zero `:deep(.p-select-*)` and zero `:deep(.p-multiselect-*)` selectors remain in `DsSelect.vue`

**Given** the Wave 4 PR is opened
**When** describing the changes
**Then** the PR description summarizes which trigger / placeholder / inner-part values became `:dt`, which became `:pt`-class, and any `!important` that survived (with rationale)
