# Refactor plan — align components to `:dt` → `:pt` → scoped(own DOM)

**Date:** 2026-05-06
**Status:** Plan only — not yet executed
**Scope:** All 13 `Ds*` components in `src/components/`

## Context

PrimeVue customization in this repo currently mixes three approaches inconsistently. Adopt this priority order (already encoded in `CLAUDE.md` and `.claude/skills/front-end-dev/SKILL.md`):

1. **`:dt="..."`** — for any value PrimeVue exposes as a design token (sizes, colors, radii, padding tiers). Survives PrimeVue upgrades; composes with `dsPreset`.
2. **`:pt="..."`** — to attach an owned class to a specific PrimeVue inner part (`label`, `dropdown`, `clearIcon`, `header`, etc.) when tokens are not enough. Style the attached class with plain scoped CSS — no `:deep()`, no `!important`.
3. **`<style scoped>`** — only for DOM the wrapper itself owns (loading overlays, transitions, own `<div>` layout). No `:deep(.p-*)` reaching into PrimeVue internals.

This plan operationalizes that priority across the existing codebase.

---

## Audit summary

`:deep(.p-*)` selectors today, by component:

| Component | `:deep(.p-*)` count | Severity | Notes |
|---|---|---|---|
| DsSelect | 10 | **High** | Largest style block (760 lines); heavy `!important` use |
| DsCodeInput | 11 | **Medium** | Already uses `:pt` for one purpose; CSS targets a single inner part (`pcInputText`) — can extend `:pt` to attach a class |
| DsAvatar | 1 | Medium | Single "strip `.p-avatar`" block; cleanest example to refactor first |
| DsBadge | 1 | Medium | Single "strip `.p-badge`" block with 9 `!important`s |
| DsButton | 3 | Low | Loading state visibility + icon sizing |
| DsIconButton | 1 | Low | Loading state visibility (mirror DsButton) |
| DsChip, DsLink, DsInputText, DsTextarea, DsSearchField, DsModal | 0 | — | Already conform |
| DsIcon | 1 (`:deep(svg)`) | — | Targets slotted SVG, not PrimeVue — keep as-is |

**Already aligned (no refactor):** DsChip, DsLink, DsInputText, DsTextarea, DsSearchField, DsModal, DsIcon.

**Mostly aligned:** DsButton, DsIconButton (small `:deep` patches around loading state).

**Needs real work:** DsAvatar, DsBadge, DsCodeInput, DsSelect.

---

## Wave 1 — Pilot the pattern (2 components, low risk)

Goal: prove the `:pt`-attaches-a-class-then-style-it pattern on the simplest cases. Each is ~1 hour.

### 1.1 DsAvatar
- Replace `.ds-avatar:deep(.p-avatar) { ... }` with `:pt="{ root: { class: 'ds-avatar__inner' } }"` on `<Avatar>`, then style `.ds-avatar__inner` directly (no `:deep`, no `:host`, no `!important`).
- Look for any `background`/`padding`/`border-radius` properties that PrimeVue exposes as Avatar tokens — move those to `:dt` instead of class CSS.
- Acceptance: zero `:deep()` selectors remain.

### 1.2 DsBadge
- Same pattern: `:pt="{ root: { class: 'ds-badge__inner' } }"`, then style `.ds-badge__inner` directly.
- The 9 `!important` declarations exist to beat PrimeVue's specificity. Once you target a class *you* own (not a `.p-badge` you reach into), `!important` should disappear.
- Acceptance: zero `:deep()` selectors, zero `!important` in the badge style block.

**Wave 1 validation:** `npm run build && npm test && npm run lint` + Storybook visual diff for Avatar/Badge stories (light + dark, all sizes/severities).

---

## Wave 2 — Loading-state cleanup (2 components, mechanical)

### 2.1 DsButton
- `.ds-button--loading :deep(.p-button-label/.p-button-icon) { visibility: hidden }` → use `:pt="{ label: { class: 'ds-button__label' }, icon: { class: 'ds-button__icon' } }"` and gate visibility with `.ds-button--loading .ds-button__label` selectors.
- `.ds-button :deep(.p-button-icon) { font-size/width/height: var(--ds-button-icon-size) }` → push these to `:dt` if PrimeVue exposes a Button `icon.size` token; otherwise the new `.ds-button__icon` class via `:pt` works too.
- The `.ds-button--medium { font-size: var(--p-button-font-size) !important }` rule is suspicious — investigate whether this can move into the existing `sizeTokens` `:dt` map.

### 2.2 DsIconButton
- Mirror image of DsButton's loading-state changes — same `:pt` keys.

**Validation:** Verify loading dots still center over hidden label, `disabled+loading` combo intact.

---

## Wave 3 — DsCodeInput (1 component, contained)

DsCodeInput already sets `:pt="otpPassThrough"` on the OTP root and reaches into `pcInputText.root` for `placeholder` + ARIA. The migration is to also attach a *class* there and replace 11 `:deep(.p-inputotp-input)` selectors with selectors against that owned class.

- Extend `otpPassThrough` to add `pcInputText.root.class: 'ds-code-input__cell'`.
- Add `pt.root.class: 'ds-code-input__row'` for the `.p-inputotp` strip block.
- Rewrite the 11 `:deep` rules as `.ds-code-input__cell`, `.ds-code-input--error .ds-code-input__cell`, etc.
- No `:dt` candidates here — the cell sizing is bespoke (43×58 px with caret colors) and the InputOtp doesn't expose tokens for these.

**Validation:** All current states — empty/hover/focus/filled/error/error-focus/disabled, plus reduced-motion — render identically. The `.p-inputotp-input:not(:placeholder-shown)` trick to detect "filled" relies on the placeholder still being a single space; preserve that in `pcInputText.root.placeholder`.

---

## Wave 4 — DsSelect (highest risk, do last)

DsSelect is 760 lines and uses `!important` liberally because `:deep(.p-select-*)` selectors lose specificity wars with PrimeVue's defaults. This wave is its own mini-project; consider doing it on a branch with extra Storybook coverage.

### 4.1 Map every `:deep(.p-*)` to a `:pt` slot

| Current selector | PrimeVue `:pt` key | New owned class |
|---|---|---|
| `.p-select-label` / `.p-multiselect-label` | `label` | `ds-select__label` |
| `.p-select-label.p-placeholder` | `label` (style via `[data-placeholder]` or use a class flag) | `ds-select__label--placeholder` |
| `.p-select-dropdown` / `.p-multiselect-dropdown` | `dropdown` | `ds-select__dropdown` |
| `.p-select-clear-icon` / `.p-multiselect-clear-icon` | `clearIcon` | `ds-select__clear` |

Already wired: `:pt="{ overlay: { class: overlayClass } }"` — extend this object.

### 4.2 Audit `!important` removals

The trigger CSS is full of `border-color: ... !important; background: ... !important; box-shadow: ... !important`. Most exist because PrimeVue applies its own `:hover`/`:focus` styles on the trigger root. Replace with:
- `:dt` overrides for trigger background/border/shadow if Select exposes those tokens (check `dsPreset` → `select` slice and PrimeVue's Select theme keys).
- Whatever can't go through `:dt` becomes a `:pt="{ root: { class: 'ds-select__trigger' } }"` class hook (which already exists as `.ds-select__trigger`) — but **make sure the class is attached via `:pt`, not via the wrapper `<div class="ds-select__trigger">`**, so it lands on the actual PrimeVue root element. This lifts specificity automatically and most `!important` calls drop.

### 4.3 Stretch goal

The placeholder color rule via `:deep(.p-select-label.p-placeholder)` is fragile (depends on PrimeVue's class names). PrimeVue exposes a placeholder token on Select — try `:dt="{ select: { placeholder: { color: '...' } } }"` (verify the exact path against the preset).

**Validation:** Storybook coverage for: empty/hovered/focused/open/filled/error/disabled × small/medium × single/multi. Add screenshot stories before starting if missing — DsSelect deserves a visual regression net before the rewrite.

---

## Cross-cutting checklist

For every wave:

1. **Branch per wave**, not per component (keeps validation runs together).
2. **Run validation triple after each component**, not at the end of the wave: `npm run build && npm test && npm run lint`.
3. **Storybook visual check**: open Storybook, toggle light/dark, walk through every story for the touched component.
4. **Update `docs/component-addition-guide.md`** in Wave 1 to add the `:pt`-attach-class pattern alongside the `:dt` rule, with DsAvatar's refactor as the reference example.
5. **No prop API changes**. This is a pure internals refactor; consumers should see no diff.

## Risk register

- **DsSelect placeholder via `.p-placeholder` class:** PrimeVue's class is contractual but undocumented as part of `:pt`. If `:pt="{ label }"` doesn't run during the placeholder state, fall back to `:dt` token or a computed class on `pt.label.class`.
- **`!important` removal in DsBadge:** the `!important`s exist because PrimeVue's badge styles win specificity. Verify on real consumers that removal still beats whatever PrimeVue ships in 4.x — if not, that's a signal to use `:dt` instead.
- **Reduced-motion media query in DsCodeInput:** the existing `@media (prefers-reduced-motion: no-preference)` block scopes transitions; preserve that wrapper around the new owned-class selector.
- **No automated visual regression today.** Without screenshot tests, you're relying on manual Storybook walk-throughs. Consider Loki/Chromatic before Wave 4.

## Suggested order & sizing

| Wave | Components | Time estimate | Risk |
|---|---|---|---|
| 1 | DsAvatar, DsBadge | half-day | Low |
| 2 | DsButton, DsIconButton | half-day | Low |
| 3 | DsCodeInput | half-day | Medium |
| 4 | DsSelect | 1–2 days | High |

Total: roughly 3 working days, spread over multiple PRs (one per wave is the cleanest review unit).

---

## References

- `CLAUDE.md` — project conventions (priority order added 2026-05-06).
- `.claude/skills/front-end-dev/SKILL.md` — front-end-dev skill (priority order added 2026-05-06).
- `docs/component-addition-guide.md` — canonical component patterns (currently mentions `:dt` only; update planned in Wave 1).
- `src/theme/ds-preset.ts` — design token source of truth; consult before any `:dt` decision.
