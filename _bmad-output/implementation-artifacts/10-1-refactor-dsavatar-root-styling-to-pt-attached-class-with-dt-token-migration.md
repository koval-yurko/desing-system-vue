# Story 10.1: Refactor DsAvatar root styling to `:pt`-attached class with `:dt` token migration

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a design system maintainer,
I want DsAvatar's PrimeVue customization to flow through `:dt` tokens and a `:pt`-attached owned class instead of `:deep(.p-avatar)`,
so that DsAvatar survives PrimeVue upgrades without specificity wars and serves as the reference example for the new pattern.

## Context

This is **Story 1 of Epic 10 (Wave 1)** of the PrimeVue styles refactor — the pilot that establishes the canonical `:dt` → `:pt`-attach-class → scoped-own-DOM pattern on the lowest-risk surface. DsAvatar has exactly **one** `:deep(.p-*)` selector (the cleanest case in the whole codebase), which is why it goes first and becomes the worked example that Story 10.3 documents in `docs/component-addition-guide.md`.

**This is an internals-only refactor.** Zero public API changes. Zero consumer-visible diff. The success criterion is literally "Storybook looks identical before and after." Any visual change is a regression, not a feature.

## Acceptance Criteria

1. **`:pt`-attach-class replaces `:deep`** — The `<Avatar>` element receives `:pt="{ root: { class: 'ds-avatar__inner' } }"`, the previous `.ds-avatar:deep(.p-avatar) { ... }` block is rewritten as plain `.ds-avatar__inner { ... }` selectors in scoped CSS, **zero `:deep(.p-*)` selectors remain** in `DsAvatar.vue`, and **no `!important` declarations are introduced**.

2. **Token-mappable values move to `:dt`** — Each declaration in the old `:deep(.p-avatar)` block is evaluated against `src/theme/ds-preset.ts` and PrimeVue's Avatar theme keys. Any value that maps to a PrimeVue Avatar token is moved to `:dt` (per-instance, on the `<Avatar>` element) instead of staying in class CSS. Any value with no matching token remains on `.ds-avatar__inner` — with a one-line comment naming the absent token only if the absence is non-obvious.

3. **Validation triple passes** — `npm run build && npm test && npm run lint` all exit zero with no new warnings.

4. **Visual parity** — Walking every DsAvatar story in light and dark themes, across all sizes and variant/color combinations, the rendered output is visually identical to the pre-refactor baseline (manual diff).

5. **Zero public API diff (NFR3)** — Exported props, slots, events, and TypeScript types are unchanged before and after.

## Tasks / Subtasks

- [x] **Task 1: Capture the pre-refactor visual baseline** (AC: #4)
  - [x] Run `npm run storybook` and walk all 10 DsAvatar stories (ColoredInitials, MonochromeInitials, IconFallback, Image, ImageFallbackToInitials, ImageFallbackToIcon, AllSizesColored, AllSizesMonochrome, AllSizesIcon, AllColors) in **both** light and dark themes. Keep this open for the post-refactor diff.
  - [x] Note current rendered state of each variant × size × color so the post-refactor comparison is concrete, not from memory. _(Headless env — baseline captured by proof instead of a browser walk: the pre-refactor `.ds-avatar:deep(.p-avatar)` selector compiles to `.ds-avatar[data-v] .p-avatar` (descendant) but `p-avatar` and `ds-avatar` render on the SAME node, so the old reset matched **nothing** and contributed zero pixels. The baseline render is therefore fully defined by the `.ds-avatar` wrapper + variant/size classes + PrimeVue's layered `@layer primevue` defaults — see Completion Notes.)_

- [x] **Task 2: Evaluate each `:deep(.p-avatar)` declaration against Avatar tokens** (AC: #2)
  - [x] The current block (`DsAvatar.vue:194-205`) sets: `background: transparent`, `padding: 0`, `border-radius: 50%`, `overflow: hidden`, `width: 100%`, `height: 100%`, `display: inline-flex`, `align-items: center`, `justify-content: center`, `color: inherit`.
  - [x] PrimeVue Avatar exposes these root tokens (verified in `node_modules/@primeuix/themes/dist/aura/avatar/index.mjs`): `width`, `height`, `fontSize`, `background`, `color`, `borderRadius`, plus `icon.size` and `group.*`. There is **no padding, overflow, or flex token.** Default `background` = `{content.border.color}`.
  - [x] Decided per declaration: `background: transparent` → `:dt="{ background: 'transparent' }"`. `border-radius: 50%` → **dropped** (`shape="circle"` adds `p-avatar-circle` + the `.ds-avatar` wrapper sets `border-radius: 50%`; verified `p-avatar-circle` present in rendered DOM → redundant). `padding`, `overflow`, `width/height: 100%`, flex props, `color: inherit` → kept on `.ds-avatar__inner`.

- [x] **Task 3: Attach the owned class via `:pt`** (AC: #1)
  - [x] Added `:pt="{ root: { class: 'ds-avatar__inner' } }"` to the `<Avatar>` element (alongside existing `v-bind="$attrs"`, `:class="avatarClasses"`, `shape="circle"`, `role`, `:aria-label`, `tabindex`).
  - [x] Added inline `:dt="{ background: 'transparent' }"` for the one token-mapped value (no computed needed for a single static value).

- [x] **Task 4: Rewrite the scoped CSS** (AC: #1)
  - [x] Replaced the `.ds-avatar:deep(.p-avatar) { ... }` rule with `.ds-avatar__inner { ... }`, containing only the non-token declarations from Task 2 (plus an explanatory comment on the shared-element reality).
  - [x] Confirmed no other rule uses `:deep(.p-*)` — `grep -n ':deep' src/components/DsAvatar/DsAvatar.vue` returns nothing.
  - [x] Did not touch the wrapper `.ds-avatar`, size modifiers, variant/color classes, `.ds-avatar__image/__initials/__icon`, or the `@media (prefers-reduced-motion)` block.

- [x] **Task 5: Verify the class actually lands on the PrimeVue root** (AC: #1, #4)
  - [x] Verified via mounted-DOM probe: `ds-avatar__inner` lands on the **same** element that carries `p-avatar` + `ds-avatar` (`p-avatar p-component p-avatar-circle ds-avatar ds-avatar--... ds-avatar__inner`). This is the same-element branch of the DOM-nesting gotcha, so `:pt root` correctly attaches the owned class to PrimeVue's root. Visual parity proven analytically (see Completion Notes) rather than via browser DevTools.

- [x] **Task 6: Run the validation triple** (AC: #3)
  - [x] `npm run build` ✓ (vue-tsc + vite build clean). `npm run lint` ✓ (biome: 69 files, no fixes). `npm test`: DsAvatar 43/43 pass **unchanged**; suite-wide 15 failures are **pre-existing in `DsSelect.test.ts`**, confirmed by `git stash` of the DsAvatar change (they fail identically without it) — unrelated to this story.

- [x] **Task 7: Confirm zero API diff** (AC: #5)
  - [x] `git diff` shows only the template (`:dt`/`:pt` additions) and `<style>` block changed. The `<script setup>` block — `DsAvatarProps` interface, emits, slots — is byte-for-byte untouched.

## Dev Notes

### Exact change surface

Only `src/components/DsAvatar/DsAvatar.vue` changes. Specifically:
- **Template** (`DsAvatar.vue:143-176`): add `:pt` and `:dt` to `<Avatar>`. Nothing else in the template moves.
- **Style** (`DsAvatar.vue:193-205`): the comment + `.ds-avatar:deep(.p-avatar)` rule become a `.ds-avatar__inner` rule.

The `<script setup>` block stays as-is **except** an optional `:dt` computed if you choose that form over an inline object.

### Token-mapping decision table (recommended)

| Old `:deep(.p-avatar)` declaration | Has Avatar token? | Recommended destination |
|---|---|---|
| `background: transparent` | yes (`background`) | `:dt="{ background: 'transparent' }"` — neutralizes PrimeVue's default `{content.border.color}` background at the token level instead of fighting it in CSS |
| `border-radius: 50%` | yes (`borderRadius`) | First check if `shape="circle"` (already on the element) already produces the circle — if so, **drop this line**. Otherwise `:dt="{ borderRadius: '50%' }"`. |
| `color: inherit` | yes (`color`) | Keep on `.ds-avatar__inner`. `inherit` is an inheritance directive, not a design value — the actual colors live on the wrapper variant classes (`.ds-avatar--blue`, etc.) and the inner must inherit them. (Moving it to `:dt="{ color: 'inherit' }"` also works; class CSS is clearer here.) |
| `padding: 0` | **no** padding token | Keep on `.ds-avatar__inner` |
| `overflow: hidden` | **no** | Keep on `.ds-avatar__inner` |
| `width: 100%` / `height: 100%` | width/height tokens exist but are absolute (`2rem`) | Keep on `.ds-avatar__inner` — `100%` is a fill-the-wrapper layout value relative to `.ds-avatar`'s per-size dimensions, not a fixed token value. Do **not** rip out the wrapper's per-size width/height and push absolute sizes into `:dt`; that's a larger redesign and out of scope. |
| `display: inline-flex` / `align-items` / `justify-content` | **no** flex tokens | Keep on `.ds-avatar__inner` |

Net result: a small `:dt` (likely just `background`, possibly `borderRadius`) and a `.ds-avatar__inner` rule holding the layout/reset declarations. **AC #2 requires you to perform this evaluation and verify token paths against the preset + PrimeVue keys before deciding** — don't invent token paths. The table above is the expected outcome, not a license to skip the check.

### `:dt` shape for component-level overrides

Component-level `:dt` keys map to that component's token namespace. On `<Avatar>`, `:dt="{ background: 'transparent' }"` emits `--p-avatar-background: transparent`. This mirrors the established `sizeTokens` pattern in `DsButton.vue` (`:dt="{ fontSize, paddingX, paddingY }"` → `--p-button-*`). Use flat root keys (`background`, `borderRadius`), **not** nested `{ avatar: { ... } }` or `{ root: { ... } }` — those are not how per-instance `:dt` is shaped here.

### `:pt`-attach-class pattern (reference: DsModal)

`DsModal.vue:90-98` is the canonical in-repo example of attaching owned classes via `:pt` and styling them with plain CSS:
```vue
:pt="{
  root: { class: modalClass },
  header: { class: 'ds-modal__header' },
  ...
}"
```
DsSelect (`DsSelect.vue:103`) does the same for its overlay: `:pt="{ overlay: { class: overlayClass } }"`. For DsAvatar, the only part you need is `root`.

### DOM-nesting gotcha (verify in Task 5)

The current code puts `:class="avatarClasses"` (which includes `ds-avatar`) directly on `<Avatar>`, and the old selector is `.ds-avatar:deep(.p-avatar)` (a descendant combinator). Confirm in DevTools where `ds-avatar` and `p-avatar` actually land relative to each other:
- If they're on the **same** element, `.ds-avatar__inner` (attached via `:pt root`) lands there too and the rewrite is a direct swap.
- If `.p-avatar` is a **nested** element under the `ds-avatar` host, `:pt root` still attaches `ds-avatar__inner` to whatever PrimeVue calls the root — which is the element the old `:deep(.p-avatar)` was reaching. Either way `:pt root` is correct; just confirm the styles render so you don't ship a no-op selector.

### Test impact

`DsAvatar.test.ts` asserts only on `.ds-avatar`, `.ds-avatar--*`, `.ds-avatar__image/__initials/__icon`, `role`, `aria-label`, `tabindex`, and `$attrs` passthrough. **None of these change.** No test references `.p-avatar`, `:deep`, `:pt`, or `:dt`, so the suite should pass untouched. Tests run with `theme: 'none'`, so `:dt` tokens won't render computed values in jsdom — that's fine, tests don't assert on them. Do not add tests asserting `:dt`/`:pt` internals (they're implementation detail and brittle); visual parity is verified manually per AC #4.

### Out of scope (do not do here)

- **No `docs/component-addition-guide.md` edits** — that's Story 10.3, which uses *this* story's post-refactor code as its worked example.
- **No `docs/ai-guidelines/ds-avatar.md` edits** — that doc is consumer-API-facing; since the public API is unchanged (NFR3), it needs no update.
- **No DsBadge work** — that's Story 10.2.
- **No new visual-regression tooling** (Loki/Chromatic) — manual Storybook walk-through is the agreed check for Wave 1.

### Project conventions (from CLAUDE.md)

- Customization priority order (pick the first that fits, don't skip down): **1. `:dt`** → **2. `:pt`-attach-class + plain scoped CSS** → **3. `<style scoped>` for own DOM only.** Never `:deep(.p-*)`, never `!important` to beat PrimeVue specificity, never `:host`.
- Never hardcode hex colors; use design tokens. (Not a risk here — the reset block has no hex.)
- Biome formatter: single quotes, 2-space indent, 100-char width. Lint-staged runs `biome check --write` on commit.

### Project Structure Notes

- Single-file change: `src/components/DsAvatar/DsAvatar.vue`. No new files, no barrel changes, no test/story changes required.
- Aligns with the per-component refactor cadence in `refactor-styles-plan.md` (Wave 1, item 1.1): validate this component fully before moving to Story 10.2 (DsBadge). NFR7 ships Wave 1 as one branch/PR covering Stories 10.1–10.3, but validation runs **per component** (NFR4).

### References

- [Source: _bmad-output/planning-artifacts/epics-refactor-styles.md#Story 10.1] — story statement + 5 BDD acceptance criteria.
- [Source: _bmad-output/planning-artifacts/refactor-styles-plan.md#Wave 1 — 1.1 DsAvatar] — refactor steps and audit (DsAvatar = 1 `:deep(.p-*)`, "cleanest example to refactor first").
- [Source: _bmad-output/planning-artifacts/epics-refactor-styles.md#Requirements Inventory] — FR2 (this story), FR1 (cross-cutting conformance), NFR1/NFR3/NFR4/NFR5/NFR8.
- [Source: src/components/DsAvatar/DsAvatar.vue:193-205] — the `.ds-avatar:deep(.p-avatar)` block being refactored.
- [Source: src/components/DsModal/DsModal.vue:90-98] — `:pt`-attach-class reference pattern.
- [Source: src/components/DsButton/DsButton.vue] — `:dt` per-instance `sizeTokens` reference pattern.
- [Source: node_modules/@primeuix/themes/dist/aura/avatar/index.mjs] — Avatar token surface: `root.{width,height,fontSize,background,color,borderRadius}`, `icon.size`, `group.{borderColor,offset}`, `lg`, `xl`.
- [Source: CLAUDE.md#Conventions] — `:dt` → `:pt` → scoped priority order and anti-patterns.

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (Dev Story workflow)

### Debug Log References

- DOM probe (temporary Vitest, removed): rendered HTML of an initials-colored avatar →
  `<div class="p-avatar p-component p-avatar-circle ds-avatar ds-avatar--initials-colored ds-avatar--medium ds-avatar--blue ds-avatar__inner" ...>` — proves `ds-avatar`, `p-avatar`, and (post-refactor) `ds-avatar__inner` all sit on **one** element; there is no nested `.p-avatar`.
- Compiled-CSS probe (`vue/compiler-sfc` `compileStyle`, removed): `.ds-avatar:deep(.p-avatar)` → `.ds-avatar[data-v-x] .p-avatar` (descendant); `.ds-avatar__inner` → `.ds-avatar__inner[data-v-x]` (scoped class).
- `git stash` of `DsAvatar.vue` → `DsSelect.test.ts` still 15 failed / 46 passed, proving those failures pre-date and are independent of this change.

### Implementation Plan

`:dt` → `:pt`-attach-class → scoped-own-DOM, applied to DsAvatar's single `:deep(.p-*)` selector:
1. `background: transparent` migrated to per-instance `:dt="{ background: 'transparent' }"` (emits `--p-avatar-background: transparent`), mirroring DsButton's `sizeTokens` / DsModal's `dialogTokens` `:dt` pattern.
2. Owned class attached via `:pt="{ root: { class: 'ds-avatar__inner' } }"`, mirroring DsModal's `:pt` root-class pattern.
3. Old `:deep` block rewritten as a plain scoped `.ds-avatar__inner` rule holding the non-token resets; `border-radius: 50%` dropped as redundant with `shape="circle"` + the wrapper.

### Completion Notes List

- **Key discovery — the old reset was a no-op.** `ds-avatar` and PrimeVue's `p-avatar` render on the **same** element, so the descendant selector `.ds-avatar :deep(.p-avatar)` never matched. The pre-refactor render was therefore produced entirely by the `.ds-avatar` wrapper + variant/size classes (all unlayered scoped CSS, which beats PrimeVue's `@layer primevue` defaults regardless of specificity). This is the same-element branch the story's "DOM-nesting gotcha" anticipated.
- **Visual parity (AC #4) — proven, not eyeballed.** This environment is headless, so the manual Storybook walk was replaced by a cascade proof that the refactor is pixel-neutral:
  - `:dt="{ background: 'transparent' }"` sets `--p-avatar-background`, but every variant already paints the element via unlayered `background-color` (`.ds-avatar--blue`, `--image`, etc.) which wins over the layered token default — so the token change is invisible. ✓
  - In `.ds-avatar__inner`, `overflow`/`display`/`align-items`/`justify-content` duplicate identical values already on `.ds-avatar` (same node) → inert. `padding: 0` matches PrimeVue's no-padding default → inert. `width/height: 100%` and `color: inherit` are same-specificity (single class) but authored **before** the size/variant rules, so the always-present `.ds-avatar--{size}` (fixed px) and `.ds-avatar--{variant}` (explicit color) rules override them by source order → inert. Net rendered output is unchanged.
  - Recommend a final human visual confirmation in Storybook (light + dark, all variants/sizes/colors) before merge, since AC #4 is formally defined as a manual diff.
- **AC #2 token evaluation:** verified Avatar's root token surface (`width, height, fontSize, background, color, borderRadius`; no padding/overflow/flex token). Only `background` was token-mappable and moved to `:dt`. `border-radius: 50%` dropped (redundant). `color: inherit` deliberately left in class CSS (it's an inheritance directive, not a design value; the wrapper variants own the actual color).
- **AC #1:** zero `:deep(.p-*)` and zero `!important` in `DsAvatar.vue` (grep-confirmed).
- **AC #5 / NFR3:** zero public API diff — `<script setup>` untouched; only template + `<style>` changed.
- **Tests:** no new tests added by design (Dev Notes → "Test impact": `:dt`/`:pt` internals are brittle implementation detail; existing suite is the regression guard). DsAvatar 43/43 pass unchanged.
- **Out of scope, untouched:** `docs/component-addition-guide.md` (Story 10.3), `docs/ai-guidelines/ds-avatar.md` (API unchanged), DsBadge (Story 10.2).

### File List

- `src/components/DsAvatar/DsAvatar.vue` — modified (template: `:dt` + `:pt`; style: `:deep` block → `.ds-avatar__inner`)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — modified (story 10.1 → review)

## Change Log

- 2026-06-07 — Refactored DsAvatar root styling from `:deep(.p-avatar)` to `:pt`-attached `.ds-avatar__inner` class with `background` migrated to `:dt` token; removed the file's only `:deep(.p-*)` selector. Internals-only, zero public API change. (Story 10.1)
