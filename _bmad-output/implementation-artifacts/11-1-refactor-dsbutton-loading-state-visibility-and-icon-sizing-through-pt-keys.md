# Story 11.1: Refactor DsButton loading-state visibility and icon sizing through `:pt` keys

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a design system maintainer,
I want DsButton's loading state to hide the label and icon via owned classes attached through `:pt`,
so that the `:deep(.p-button-label)` / `:deep(.p-button-icon)` patches disappear and the loading dots stay correctly positioned over the hidden content.

## Context

This is **Story 1 of Epic 11 (Wave 2)** of the PrimeVue styles refactor. Wave 1 (Epic 10) piloted and documented the `:dt` → `:pt`-attach-class → scoped-own-DOM priority order on DsAvatar/DsBadge and codified it in `docs/component-addition-guide.md`. Wave 2 applies that documented pattern to the Button family. This story does DsButton; Story 11.2 resolves the `--medium !important` rule; Story 11.3 mirrors the change in DsIconButton.

**This is an internals-only refactor.** Zero public API changes. Zero consumer-visible diff (NFR3). The success criterion is "Storybook looks identical before and after." Any visual change is a regression, not a feature.

DsButton has **3 `:deep(.p-button-*)` selectors** to retire (the audit count in `refactor-styles-plan.md`):
- `DsButton.vue:213-216` — `.ds-button--loading :deep(.p-button-label), .ds-button--loading :deep(.p-button-icon) { visibility: hidden }`
- `DsButton.vue:260-264` — `.ds-button :deep(.p-button-icon) { font-size/width/height: var(--ds-button-icon-size) }`

> ⚠️ **READ "Critical implementation intelligence" below before touching code.** A DOM probe of the *actual* rendered output shows DsButton's slot architecture means PrimeVue's `.p-button-label`/`.p-button-icon` parts **do not render in the dominant usage path**. Both the current `:deep` selectors and the new `:pt` classes you are asked to add are **no-ops in that path** (exactly the same silent-no-op situation Story 10.1 hit with DsAvatar). This does NOT block the refactor — it changes what "done" honestly means and tells you precisely what to verify and what NOT to scope-creep into fixing.

## Acceptance Criteria

1. **`:pt`-attach-class replaces `:deep`** — `<Button>` receives `:pt="{ label: { class: 'ds-button__label' }, icon: { class: 'ds-button__icon' } }"`. Loading-state visibility is expressed via `.ds-button--loading .ds-button__label { visibility: hidden }` (and the `.ds-button__icon` equivalent). **Zero `:deep(.p-button-*)` selectors remain** in `DsButton.vue` (other `:deep` targeting non-PrimeVue elements is out of scope — there are none in this file). No `!important` is introduced.

2. **Icon-size token evaluation (verified: NO token)** — PrimeVue's Button theme is inspected for an `icon.size` (or equivalent) token. **It does not exist** (verified — see Dev Notes → "Icon-size token verification"). Therefore icon sizing **stays as plain CSS** on `.ds-button__icon` (the existing `--ds-button-icon-size` mechanism), and this rationale is recorded in the Completion Notes. Do **not** invent a `:dt` icon-size token path.

3. **Loading indicator positioning / no layout shift** — When loading is true, the dots overlay sits over the content area and the button's outer width is unchanged versus the same button not loading (no layout shift). This must be **verified against the captured pre-refactor baseline**, not assumed (see AC #6 + Dev Notes — the baseline loading appearance is non-obvious).

4. **`loading` + `disabled` together** — With `loading=true` and `disabled=true` simultaneously, rendered behavior matches the pre-refactor baseline (disabled styling wins; loading dots still render per the current convention).

5. **Validation triple passes** — `npm run build && npm test && npm run lint` all exit zero with no new warnings. `npm test` has a known pre-existing failure set in `DsSelect.test.ts` (15 failures) unrelated to this story — confirm by `git stash` that they fail identically without your change; DsButton's suite must remain fully green.

6. **Visual parity** — Every DsButton story (all severities × sizes × loading × disabled), in light and dark themes, is visually identical to the pre-refactor baseline (manual diff). Capture the baseline **before** editing.

7. **Zero public API diff (NFR3)** — Exported props (`DsButtonProps`), slots, events, and TypeScript types are unchanged before and after. The `<script setup>` interface block is untouched.

## Tasks / Subtasks

- [x] **Task 1: Capture the real pre-refactor baseline** (AC: #3, #4, #6)
  - [x] Run `npm run storybook` and walk every DsButton story — Default, Primary, Outlined, Tertiary, Text, TextLink, Negative, Disabled, **Loading**, AllSizes, AllVariants, WithLeftIcon, WithRightIcon — in **both** light and dark themes. *(Headless env — reproduced analytically per Story 10.1 precedent.)*
  - [x] **Pay special attention to the `Loading` story** (`<DsButton loading>Loading</DsButton>`): record exactly what renders today (is the "Loading" text hidden, or does it show through behind the dots?). This is your parity reference — see Dev Notes "Critical implementation intelligence", which predicts the text is *not* hidden today. *(Probe confirmed: text node `Save` renders bare with no `.p-button-label`/`.p-button-icon`; the loading-hide `:deep` was a no-op, so the text shows through behind the dots — latent bug (a).)*
  - [x] Record a `loading + disabled` combo (temporarily set both in the Loading story controls) for AC #4. *(Disabled adds `ds-button--disabled` opacity:0.5/pointer-events:none; loading overlay still renders — no touched selectors affect this combo.)*
  - [x] If the environment is headless (no browser), reproduce the baseline analytically the way Story 10.1 did: mount with `@vue/test-utils`, dump `wrapper.html()`, and reason about the cascade. The probe commands in Dev Notes give you the exact DOM.

- [x] **Task 2: Verify the rendered DOM before trusting any selector** (AC: #1, #2)
  - [x] Confirm with a DOM probe (Vitest mount + `wrapper.html()`, then delete the probe — see Dev Notes for the exact snippet) where `.p-button-label` / `.p-button-icon` actually render. Expected per the probe already run: they render **only** when icon/label come via **props** (`<DsButton label="..." icon="...">`); in the default-slot text path and the `#icon`-slot path they **do not render at all**. *(Confirmed empirically — probe ran and was deleted.)*
  - [x] This confirms the icon-sizing `:deep(.p-button-icon)` → `.ds-button__icon` swap is a real, working change for the **prop-path** icon, and the loading-hide selectors are no-ops in the slot path (before and after) — which is why "visual parity" is preserved by doing the literal swap.

- [x] **Task 3: Confirm no `icon.size` Button token exists** (AC: #2)
  - [x] Grep the Button theme: `grep -o "icon[^,}]*" node_modules/@primeuix/themes/dist/aura/button/index.mjs`. Confirm the root token surface is `borderRadius, roundedBorderRadius, gap, paddingX, paddingY, iconOnlyWidth, sm.*, lg.*, label.fontWeight, raisedShadow, focusRing.*, badgeSize, transitionDuration` — **no `icon` key, no root `fontSize` key.** *(Grep returned only `iconOnlyWidth` under `icon*`; `fontSize` appears only under `sm.*`/`lg.*` — no `icon` group, no root `fontSize`.)*
  - [x] Conclusion to record in Completion Notes: no token → icon sizing stays as plain CSS on `.ds-button__icon`.

- [x] **Task 4: Attach owned classes via `:pt` and rewrite the scoped CSS** (AC: #1, #2)
  - [x] Add `:pt="{ label: { class: 'ds-button__label' }, icon: { class: 'ds-button__icon' } }"` to `<Button>` (alongside the existing `v-bind="$attrs"`, `:dt`, `:class`, `:style`, aria attrs). DsButton currently has **no** `:pt` prop, so this is a clean addition.
  - [x] Replace `.ds-button--loading :deep(.p-button-label), .ds-button--loading :deep(.p-button-icon) { visibility: hidden }` with `.ds-button--loading .ds-button__label, .ds-button--loading .ds-button__icon { visibility: hidden }`.
  - [x] Replace `.ds-button :deep(.p-button-icon) { font-size/width/height: var(--ds-button-icon-size) }` with `.ds-button__icon { font-size/width/height: var(--ds-button-icon-size) }`.
  - [x] **Do NOT touch** `.ds-button--medium { font-size: var(--p-button-font-size) !important }` (`DsButton.vue:266-268`) — that is **Story 11.2**. *(Left untouched.)*
  - [x] **Do NOT** add or alter the `#icon` slot wiring, the default `<slot/>`, or the loading overlay markup (see "Do not scope-creep" in Dev Notes). *(Untouched.)*

- [x] **Task 5: Confirm zero `:deep(.p-button-*)` remain** (AC: #1)
  - [x] `grep -n ':deep' src/components/DsButton/DsButton.vue` returns nothing. *(Verified — exit 1, no matches.)*
  - [x] `grep -n '!important' src/components/DsButton/DsButton.vue` returns only the single `.ds-button--medium` line (untouched, owned by Story 11.2). *(Verified — only line 268.)*

- [x] **Task 6: Run the validation triple** (AC: #5)
  - [x] `npm run build` (vue-tsc + vite) → exit 0, no new warnings.
  - [x] `npm test` → DsButton suite fully green (38/38); confirmed the 15 `DsSelect.test.ts` failures are pre-existing via `git stash` (identical 15 failures without the change).
  - [x] `npm run lint` (`biome check ./src`) → clean (69 files, no fixes).

- [x] **Task 7: Visual parity diff + confirm zero API diff** (AC: #3, #4, #6, #7)
  - [x] Re-walk every DsButton story (Task 1 list) in light + dark; compare to the captured baseline. Pay attention to: loading-dot centering, icon-sizing on the prop-path WithIcon usage (note: the slot-based WithLeftIcon/WithRightIcon stories render no icon today — see Dev Notes — so they trivially match), and the loading+disabled combo. *(Parity verified analytically: slot path = no-op before/after; prop-path icon now carries `ds-button__icon`, same unlayered specificity beating `@layer primevue`; overlay markup untouched.)*
  - [x] `git diff` shows **only** the `<template>` (`:pt` addition) and `<style>` block changed; the `<script setup>` block (interface, props, computed) is byte-for-byte unchanged. *(Verified — 3 hunks: 1 template line added, 2 style selector swaps; script block unchanged.)*

## Dev Notes

### Critical implementation intelligence — DsButton's slot architecture (READ FIRST)

A DOM probe (`@vue/test-utils` mount + `wrapper.html()`) of the *actual* rendered output established the following. **PrimeVue Button renders `.p-button-label`, `.p-button-icon`, and the `#icon` named slot ONLY as the fallback content of its default slot** (`node_modules/primevue/button/Button.vue:3-13`: `<slot> <slot name="icon"/> <span :class="cx('label')"/> ... </slot>`). DsButton **always** supplies that default slot (its own `<slot/>` plus the conditional loading-overlay `<span>`), so PrimeVue's fallback is suppressed. Consequences, all verified empirically:

| DsButton usage | What renders | `.p-button-label`? | `.p-button-icon`? |
|---|---|---|---|
| `<DsButton>Save</DsButton>` (default text — dominant case) | bare text node `Save` | **no** | **no** |
| `<DsButton loading>Save</DsButton>` | `Save` text **+** loading overlay (text **visible behind dots**) | **no** | **no** |
| `<DsButton><template #icon>…</template>Back</DsButton>` (WithLeftIcon) | only `Back` — **icon silently dropped**, button even gets `p-button-icon-only` | no | no |
| `<DsButton><template #icon>…</template></DsButton>` (icon-only via slot, no text) | raw slotted icon (no `.p-button-icon` wrapper) | no | no |
| `<DsButton loading><template #icon>…</template></DsButton>` | only the loading overlay (icon vanishes) | no | no |
| `<DsButton label="Confirm" icon="pi pi-check"/>` (**props**, no slots) | real `.p-button-icon` + `.p-button-label` spans | **yes** | **yes** |
| `<DsButton label="Hi" loading/>` | only the loading overlay | no | no |

**What this means for this story:**

1. **The current `:deep(.p-button-label)` / `:deep(.p-button-icon)` loading-hide selectors are no-ops in the slot path** — there is no such element to hide. This is the same "a `:deep` that matches nothing is a silent no-op" lesson documented from Story 10.1 in `docs/component-addition-guide.md` (section 2c, gotcha #1). The new `:pt`-attached `.ds-button__label` / `.ds-button__icon` classes are **equally** no-ops in the slot path, because the parts they attach to never render there. **This is fine and expected** — doing the literal swap therefore preserves the baseline exactly (no-op before, no-op after), which is what AC #6 (visual parity) requires.

2. **The icon-sizing swap IS a real change** — but only for the **prop-path** icon (`<DsButton icon="…">`), where `.p-button-icon` genuinely renders. Moving `font-size/width/height: var(--ds-button-icon-size)` from `:deep(.p-button-icon)` to the `:pt`-attached `.ds-button__icon` keeps that sizing intact (the unlayered owned class beats PrimeVue's `@layer primevue` default just like the `:deep` did). Slot-path icons are sized by the consumer's own icon component and are unaffected either way → parity holds.

3. **`:pt` is safe to add.** DsButton has no `:pt` today; PrimeVue merges the pt class onto each part when it renders and ignores it when the part doesn't. No regression risk.

### Two latent bugs you will observe — do NOT fix them here (out of scope)

While capturing the baseline you will likely notice two pre-existing defects. Both are caused by the slot architecture above and are **out of scope** for an internals-only, zero-visual-diff refactor (NFR3). Record them as observations in the Completion Notes for the backlog/PO; do **not** fix them in this story:

- **(a) Loading + default text bleeds:** `<DsButton loading>Save</DsButton>` shows "Save" behind the dots (the loading-hide never worked, per #1 above). "Fixing" it (e.g. wrapping the default slot in an owned `<span class="ds-button__label">` so there is a real element to hide) would *change* the loading visual and break visual parity — so it is explicitly not this story's job.
- **(b) `#icon` slot + default text drops the icon:** WithLeftIcon/WithRightIcon render no icon at all. Fixing the icon-slot architecture is a behavioral/visual change, out of scope.

If, on inspection of Figma / the baseline, the PO decides the loading state *must* hide the text (fixing bug **a**), that is a **separate, scoped change** (add an owned `<span class="ds-button__label"><slot/></span>` wrapper, guarded by `v-if="$slots.default"` to avoid a stray empty flex child / gap on icon-only buttons, and verify no layout-shift per AC #3). Surface it as a question rather than silently expanding this story.

### Icon-size token verification (AC #2)

Verified against `node_modules/@primeuix/themes/dist/aura/button/index.mjs`. The Button **root** token object exposes: `borderRadius, roundedBorderRadius, gap, paddingX, paddingY, iconOnlyWidth, sm.{fontSize,paddingX,paddingY,iconOnlyWidth}, lg.{…}, label.fontWeight, raisedShadow, focusRing.{…}, badgeSize, transitionDuration`. **There is no `icon` token group and no root-level `fontSize` token.** Therefore the AC's "when no token exists → icon sizing remains plain CSS on `.ds-button__icon`" branch applies. The existing `--ds-button-icon-size` CSS-var-per-size mechanism (`DsButton.vue:136-144` computes `iconSize`, bound via `:style="{ '--ds-button-icon-size': iconSize }"`) is kept as-is; only the selector that consumes it moves from `:deep(.p-button-icon)` to `.ds-button__icon`. (Aside: the absence of a root `fontSize` token is also *why* the `.ds-button--medium … !important` rule exists — but that investigation belongs to Story 11.2, not here.)

### Exact change surface

Only `src/components/DsButton/DsButton.vue` changes. Specifically:
- **Template** (`<Button>` open tag, ~`DsButton.vue:168-185`): add the `:pt="{ label: { class: 'ds-button__label' }, icon: { class: 'ds-button__icon' } }"` prop. Nothing else in the template moves — keep the `#icon` template, the default `<slot/>`, the loading overlay, and all aria attrs exactly as they are.
- **Style** (`DsButton.vue:213-216` and `:260-264`): swap the two `:deep(.p-button-*)` rules for owned-class selectors.

The `<script setup>` block stays byte-for-byte unchanged. No new files, no barrel changes, no story changes, no doc changes.

### `:pt`-attach-class pattern (canonical references)

The pattern is now documented in `docs/component-addition-guide.md` §2c ("Styling Customization Priority Order" → "When to use `:pt` to attach a class"), with DsAvatar as the worked example and a gotcha list. In-repo precedents: `DsModal.vue` (multi-part), `DsSelect.vue` (`overlay`), `DsAvatar.vue` / `DsBadge.vue` (`root`). For DsButton the parts are `label` and `icon` (PrimeVue Button's `:pt` part keys — confirmed against `node_modules/primevue/button/Button.vue:9-11`, which call `ptm('icon')` and `ptm('label')`).

### Test impact

`DsButton.test.ts` asserts on `.ds-button` classes, severity/variant/size prop mapping, `:dt` size tokens, typography `style`, disabled/loading classes and aria, `$attrs`/event/slot passthrough — **none reference `.p-button-label`, `.p-button-icon`, `:deep`, or `:pt`.** The suite should pass untouched. Tests run with `theme: 'none'` (jsdom), so `:dt`/`:pt` computed token values don't render — consistent with the existing tests, which don't assert on them. **Do not add tests asserting `:pt`/`:dt` internals** — per the Story 10.1 precedent they are brittle implementation detail; the existing suite is the regression guard, and visual parity is the manual check (AC #6).

### Out of scope (do not do here)

- **Story 11.2** — the `.ds-button--medium { font-size: … !important }` rule. Leave it exactly as-is.
- **Story 11.3** — DsIconButton's mirror refactor.
- **`docs/component-addition-guide.md`** — already updated in Story 10.3; no edits needed.
- **`docs/ai-guidelines/ds-button.md`** — consumer-API-facing; API is unchanged (NFR3), so no update.
- **Fixing latent bugs (a) and (b)** above — observe and report, don't fix.
- **New visual-regression tooling** (Loki/Chromatic) — manual Storybook walk-through is the agreed Wave 2 check.

### Project conventions (from CLAUDE.md)

- Customization priority order (pick the first that fits, never skip down): **1. `:dt`** → **2. `:pt`-attach-class + plain scoped CSS** → **3. `<style scoped>` for own DOM only.** Never `:deep(.p-*)`, never `!important` to beat PrimeVue specificity, never `:host`.
- The override wins **without `!important`** because the wrapper's unlayered scoped CSS beats PrimeVue's `@layer primevue` defaults.
- Never hardcode hex colors (not a risk here — these rules carry no color).
- Biome: single quotes, 2-space indent, 100-char width. Lint-staged runs `biome check --write` on commit.
- Branch/PR per **wave** (NFR7): this story shares the Wave 2 branch/PR with Stories 11.2 and 11.3, but validation runs **per component/story** (NFR4).

### Project Structure Notes

- Single-file change: `src/components/DsButton/DsButton.vue`. Aligns with `refactor-styles-plan.md` Wave 2 item 2.1. No conflicts with the unified structure; the four-file component layout (`.vue`, `.stories.ts`, `.test.ts`, `index.ts`) is untouched except the `.vue`.

### References

- [Source: _bmad-output/planning-artifacts/epics-refactor-styles.md#Story 11.1] — story statement + 6 BDD acceptance criteria.
- [Source: _bmad-output/planning-artifacts/refactor-styles-plan.md#Wave 2 — 2.1 DsButton] — refactor steps; audit count (DsButton = 3 `:deep(.p-*)`).
- [Source: _bmad-output/planning-artifacts/epics-refactor-styles.md#Requirements Inventory] — FR4 (this story), FR1 (cross-cutting conformance), NFR1/NFR3/NFR4/NFR5/NFR7/NFR8.
- [Source: src/components/DsButton/DsButton.vue:213-216] — loading-hide `:deep(.p-button-label/.p-button-icon)` block being replaced.
- [Source: src/components/DsButton/DsButton.vue:260-264] — icon-sizing `:deep(.p-button-icon)` block being replaced.
- [Source: src/components/DsButton/DsButton.vue:266-268] — `.ds-button--medium !important` rule — **leave untouched (Story 11.2)**.
- [Source: src/components/DsButton/DsButton.vue:136-144,176-181] — `iconSize` computed + `--ds-button-icon-size` style binding (the icon-size mechanism kept as-is).
- [Source: node_modules/primevue/button/Button.vue:3-13] — Button template proving label/icon/`#icon`-slot render only as default-slot fallback (root cause of the no-op behavior).
- [Source: node_modules/@primeuix/themes/dist/aura/button/index.mjs] — Button token surface (no `icon.size`, no root `fontSize` token).
- [Source: _bmad-output/implementation-artifacts/10-1-refactor-dsavatar-root-styling-to-pt-attached-class-with-dt-token-migration.md] — reference story (same no-op-`:deep` discovery, same probe-then-decide method).
- [Source: docs/component-addition-guide.md#2c-styling-customization-priority-order] — canonical `:pt`-attach-class pattern + gotchas.
- [Source: CLAUDE.md#Conventions] — priority order and anti-patterns.

### Probe snippet (delete after use)

```ts
// tmp/probe-button.test.ts — mount, dump HTML, then delete the file.
import { mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import { writeFileSync } from 'node:fs';
import { describe, it } from 'vitest';
import DsButton from '../src/components/DsButton/DsButton.vue';
const g = { plugins: [[PrimeVue, { theme: 'none' }]] };
describe('probe', () => {
  it('dump', () => {
    const text = mount(DsButton, { props: { loading: true }, slots: { default: 'Save' }, global: g });
    const props = mount(DsButton, { props: { icon: 'pi pi-check', label: 'Confirm' } as any, global: g });
    writeFileSync('tmp/probe-out.txt', '== loading+text ==\n'+text.html()+'\n\n== icon+label PROPS ==\n'+props.html());
  });
});
```

## Dev Agent Record

### Agent Model Used

claude-opus-4-8 (1M context) — bmad-dev-story workflow

### Debug Log References

- DOM probe (`tmp/probe-button.test.ts`, run then deleted): confirmed `.p-button-label`/`.p-button-icon` render **only** on the prop path (`<DsButton icon label>`); the default-slot text path renders a bare text node + loading overlay (no PrimeVue label/icon parts).
- Token grep `grep -o "icon[^,}]*" .../aura/button/index.mjs` → only `iconOnlyWidth`; `fontSize` only under `sm.*`/`lg.*`. No `icon` token group, no root `fontSize`.
- `grep -n ':deep' DsButton.vue` → no matches (exit 1). `grep -n '!important' DsButton.vue` → only line 268 (`.ds-button--medium`, Story 11.2).
- Validation triple: `npm run build` exit 0; `npm test` DsButton 38/38 green; `git stash` confirmed the 15 `DsSelect.test.ts` failures are pre-existing (identical with change stashed); `npm run lint` clean.

### Completion Notes List

- **AC #1 — `:pt`-attach-class replaces `:deep`:** Added `:pt="{ label: { class: 'ds-button__label' }, icon: { class: 'ds-button__icon' } }"` to `<Button>`. Loading-hide and icon-size selectors rewritten to the owned classes. Zero `:deep(.p-button-*)` remain; no `!important` introduced (the lone `!important` on `.ds-button--medium` is untouched, owned by Story 11.2).
- **AC #2 — Icon-size token (NO token, verified):** PrimeVue Button theme exposes no `icon` token group and no root `fontSize` token (only `iconOnlyWidth`, and `fontSize` under `sm.*`/`lg.*`). Therefore icon sizing **stays as plain CSS** on `.ds-button__icon` via the existing `--ds-button-icon-size` CSS-var mechanism. No `:dt` icon-size path invented. ⚠️ **Correction (post code-review):** the `.ds-button__icon` rule, although present, is **inert** — see the AC #3/#4/#6 correction below for why.
- **AC #3/#4/#6 — Visual parity:** Verified analytically (headless env, per the Story 10.1 precedent). Slot path (dominant): owned-class selectors are no-ops just as the old `:deep` selectors were (the parts don't render) → byte-identical render. **AC #6 visual parity holds for every story** (none use the prop path; the documented icon path is the `#icon` slot, where `DsIcon` self-sizes and no `.p-button-icon` renders). Loading overlay markup and the disabled rules are untouched → loading-dot centering and the loading+disabled combo are unchanged.

  ⚠️ **Correction (post code-review) — the original "icon sizing is intact" claim was WRONG.** Empirically verified (rendered DOM + built CSS): a `:pt`-attached class on a PrimeVue **inner** part (`label`/`icon`) does **not** receive the wrapper's `data-v-` scope id (rendered span: `<span class="p-button-icon … ds-button__icon">` with no `data-v-` attr), while the compiled scoped selector is `.ds-button__icon[data-v-HASH]{…}` — so it **matches nothing**. The old `:deep(.p-button-icon)` worked because it compiled to `.ds-button[data-v-HASH] .p-button-icon` (scope id on the **root**, which the button *does* carry). Net: this is a **no-op-for-no-op swap**, not "sizing kept intact." Consequences: (1) the `.ds-button__icon` / `.ds-button--loading .ds-button__*` rules and the `:pt` `icon`/`label` keys are now **dead CSS** in documented usage; (2) the icon sizing the old `:deep` provided on the **undocumented `$attrs` prop path** (`<DsButton icon="…">`) is **lost** — a latent regression on a path no story or doc uses (so AC #6 still passes). **The `:pt`-attach-class + plain scoped CSS pattern works only for the `root` part; it does not reach inner parts** — this MUST be accounted for before Story 11.3 (DsIconButton) mirrors this approach, and `docs/component-addition-guide.md` §2c should document the root-vs-inner-part distinction. See memory `project-pt-scope-id-inner-parts`.
- **AC #5 — Validation triple:** All green (build exit 0; DsButton 38/38; lint clean). The 15 `DsSelect.test.ts` failures are pre-existing and unrelated (confirmed via `git stash`).
- **AC #7 — Zero public API diff (NFR3):** `<script setup>` block byte-for-byte unchanged; `DsButtonProps`, slots, events, and types untouched. `git diff` is template (`:pt` line) + style block only.
- **Out-of-scope latent bugs observed (NOT fixed — for PO/backlog):**
  - (a) `<DsButton loading>Save</DsButton>` shows "Save" behind the loading dots — the loading-hide selector was always a no-op in the slot path; fixing it would change the loading visual and break parity. Out of scope for this zero-visual-diff refactor.
  - (b) `#icon` slot + default text (WithLeftIcon/WithRightIcon) drops the icon entirely (PrimeVue's `#icon` fallback is suppressed by DsButton's default slot). Behavioral/visual fix, out of scope.
- **No scope creep:** `.ds-button--medium !important` (Story 11.2), `#icon` slot wiring, default `<slot/>`, loading overlay markup, tests, stories, docs, and the barrel are all untouched.

### File List

- `src/components/DsButton/DsButton.vue` (modified)

## Change Log

| Date       | Version | Description                                                                                          | Author |
| ---------- | ------- | -------------------------------------------------------------------------------------------------- | ------ |
| 2026-06-07 | 0.1     | Refactored DsButton loading-state visibility + icon sizing from `:deep(.p-button-*)` to `:pt`-attached owned classes (`.ds-button__label` / `.ds-button__icon`). Zero public API / visual diff. | Yurii  |
| 2026-06-07 | 0.2     | Code-review correction: documented that `:pt`-attached **inner**-part classes lack the wrapper `data-v-` scope id, so the new scoped selectors are inert (no-op-for-no-op swap, not "sizing kept intact"); icon-sizing regresses on the undocumented `$attrs` prop path. Pattern caveat flagged for Story 11.3 + guide §2c. | Yurii  |
