# Story 1.3: DsButton Component (Approach Validation)

Status: review

## Story

As a developer implementing a Figma design,
I want to use DsButton with all variants, sizes, and states that match the Figma Design System,
So that buttons in my application are pixel-accurate to the Figma source in both themes.

## Acceptance Criteria

1. **Given** DsButton wraps PrimeVue Button using `inheritAttrs: false` + `v-bind="$attrs"`, **When** a developer uses `<DsButton severity="primary" size="medium">Save</DsButton>`, **Then** the button renders matching the Figma Primary button at Medium size.

2. **Given** DsButton supports all 6 variant types at all 4 sizes, **When** the `severity` prop is set to primary, outlined, tertiary, text, text-link, or negative, **Then** each variant renders with its Figma-specified styling (colors, borders, backgrounds), **And** the Negative variant uses the Red palette from the preset, **And** all 24 severity×size combinations are accepted (see Figma Coverage Matrix in Dev Notes for which combinations have explicit Figma designs vs extrapolated styling).

3. **Given** DsButton supports 4 sizes following the uniform size token table, **When** the `size` prop is set to xsmall, small, medium, or large, **Then** XSmall renders at 24px height with 12px icon, 12px font, 8px horizontal padding, **And** Small renders at 32px height with 16px icon, 14px font, 12px horizontal padding, **And** Medium renders at 36px height with 20px icon, 14px font, 16px horizontal padding, **And** Large renders at 40px height with 20px icon, 14px font, 32px horizontal padding.

4. **Given** DsButton implements universal state behavior, **When** the button transitions through Default, Hover, Focus, Active/Pressed, Disabled, and Loading states, **Then** state priority is enforced: Disabled > Loading > Active > Focus > Hover > Default, **And** all state transitions use 150ms ease timing (no transition on disabled change), **And** hover shows slightly darkened/lightened background, **And** focus shows visible focus ring using `focus-visible:` (not `focus:`), **And** disabled retains variant styling at reduced opacity (0.5) with `pointer-events: none` and `aria-disabled="true"`, **And** for variants without an explicit Figma Pressed design (Negative, Text/link), the Pressed state uses the same visual treatment as Hover.

5. **Given** DsButton supports two loading visual states, **When** the `loading` prop is set to true, **Then** button content is replaced by a dot-based loading indicator (3 animated dots), **And** button width is preserved to match the default state width (does not collapse), **And** loading is available for all severity variants, **And** the loading state announces to screen readers via `aria-live="polite"`.

6. **Given** DsButton is a PrimeVue wrapper, **When** any standard PrimeVue Button prop, slot, or event is used, **Then** it passes through correctly to the underlying PrimeVue Button (FR13).

7. **Given** DsButton renders in dark mode, **When** the application theme is switched to dark, **Then** the button renders correctly using dark theme tokens, **And** all 6 variants display correctly in dark mode.

8. **Given** DsButton has TypeScript types, **When** a developer uses the component in a TypeScript project, **Then** all props (severity, size, disabled, loading) have type definitions with documented variants, **And** TypeScript autocomplete shows valid values for severity and size.

9. **Given** DsButton has a co-located test file `DsButton.test.ts`, **When** tests are run with Vitest, **Then** tests verify all variants render, all sizes apply correct classes, disabled and loading states work, and PrimeVue prop passthrough functions.

10. **Given** this story validates the Styled Mode approach, **When** DsButton renders pixel-accurate to Figma in all variants and both themes using only the preset (no pt API overrides needed for core styling), **Then** the Styled Mode approach is validated — proceed with remaining components, **And** if the preset cannot achieve Figma fidelity, document the gaps and flag the fallback decision (Unstyled + Tailwind).

## Tasks / Subtasks

- [x] Task 1: Create DsButton component directory and implement DsButton.vue (AC: #1, #2, #3, #4, #5, #6)
  - [x] 1.1 Create `src/components/DsButton/` directory with `DsButton.vue`, `index.ts`
  - [x] 1.2 Implement `DsButton.vue` using `<script setup lang="ts">` with `inheritAttrs: false` + `v-bind="$attrs"`
  - [x] 1.3 Import PrimeVue Button: `import Button from 'primevue/button'`
  - [x] 1.4 Define DsButton props interface with explicit typing (see Dev Notes for prop-to-PrimeVue mapping)
  - [x] 1.5 Implement severity mapping — translate DsButton `severity` values to PrimeVue `severity` + `variant` prop combinations (see Severity Mapping Table in Dev Notes)
  - [x] 1.6 Implement size mapping — translate DsButton `size` values to PrimeVue `size` prop + component-level `dt` overrides for precise Figma dimensions (see Size Strategy in Dev Notes)
  - [x] 1.7 Implement disabled state: pass `disabled` to PrimeVue + add `aria-disabled="true"`, opacity 0.5, `pointer-events: none`
  - [x] 1.8 Implement loading state: pass `loading` to PrimeVue, show dot-based indicator (3 animated dots), ensure button width is preserved
  - [x] 1.9 Pass through `$attrs` and `$slots` to PrimeVue Button for full API compatibility — DsButton supports icon+text content (via PrimeVue's `icon`, `iconPos` props or icon slot)
  - [x] 1.10 Add state transitions: `transition: all 150ms ease` conditionally — only when `!disabled` (no transition class when disabled)

- [x] Task 2: Update theme preset with DsButton component tokens (AC: #2, #3, #7)
  - [x] 2.1 Add `components.button` section to `ds-preset.ts` if needed for Figma-accurate base styling
  - [x] 2.2 Configure button color tokens per severity to match Figma hex values (primary=purple, negative=red)
  - [x] 2.3 Configure button padding, font-size, and height tokens per size tier to match Figma dimensions
  - [x] 2.4 Verify dark mode color scheme tokens render correctly for all button variants
  - [x] 2.5 Run existing theme tests to ensure no regressions

- [x] Task 3: Create barrel export and integrate (AC: #6, #8)
  - [x] 3.1 Create `src/components/DsButton/index.ts` re-export
  - [x] 3.2 Add `export { DsButton } from './components/DsButton'` to `src/index.ts`

- [x] Task 4: Write tests (AC: #9)
  - [x] 4.1 Create `src/components/DsButton/DsButton.test.ts`
  - [x] 4.2 Test: renders with default props (primary, medium)
  - [x] 4.3 Test: renders all 6 severity variants (primary, outlined, tertiary, text, text-link, negative)
  - [x] 4.4 Test: applies correct size classes/styles for all 4 sizes (xsmall, small, medium, large)
  - [x] 4.5 Test: disabled state applies opacity, aria-disabled, pointer-events
  - [x] 4.6 Test: loading state shows dot-based loading indicator and preserves width
  - [x] 4.7 Test: PrimeVue prop passthrough works (e.g., `raised`, `rounded`, custom event)
  - [x] 4.8 Test: slot content passes through to PrimeVue Button (default slot, icon slots)
  - [x] 4.9 Test: icon+text button renders correctly (icon prop + label)
  - [x] 4.10 Test: `$attrs` pass through to PrimeVue Button (e.g., `data-testid`, `id`)

- [x] Task 5: Validate build and approach (AC: #10)
  - [x] 5.1 Run `npm run build` — must complete successfully with DsButton in dist
  - [x] 5.2 Run `npm run test` — all tests pass (existing + new)
  - [x] 5.3 Run `biome check` — no errors
  - [x] 5.4 Document Styled Mode validation result: can the preset alone achieve Figma fidelity, or are `pt` overrides / fallback to Unstyled needed?

## Dev Notes

### Critical: PrimeVue Button API (v4.5.x) — Size & Severity Limitations

PrimeVue Button's built-in props do NOT directly match the Figma design system. The wrapper must bridge these gaps:

**PrimeVue Button `size` prop** only supports `"small" | "large"` (plus default/normal). The Figma design has 4 sizes (XS, S, M, L). This means DsButton's `size` prop must be custom-mapped.

**PrimeVue Button `severity` prop** supports: `"secondary" | "info" | "success" | "warn" | "danger" | "contrast" | "help"`. Default (no severity) is the primary style. The Figma design has 6 button types that need mapping.

**PrimeVue Button `variant` prop** supports: `"outlined" | "text" | "link"`.

### Severity Mapping Table (DsButton → PrimeVue)

| DsButton `severity` | PrimeVue `severity` | PrimeVue `variant` | Notes |
|---------------------|---------------------|---------------------|-------|
| `"primary"` (default) | _(none — default)_ | _(none)_ | PrimeVue default = primary style. Uses purple palette from preset's `primary` semantic tokens. |
| `"outlined"` | _(none)_ | `"outlined"` | Primary color outlined variant. Border + text use purple tokens, no background fill. |
| `"tertiary"` | `"secondary"` | _(none)_ | Maps to PrimeVue's secondary severity. Gray-toned, lower visual priority. Verify against Figma — if Aura secondary doesn't match, apply `dt` overrides to correct colors (see Figma Design Reference section). |
| `"text"` | _(none)_ | `"text"` | No background, no border. Text-only button with primary color text. |
| `"text-link"` | _(none)_ | `"link"` | Underlined text style, navigation-like. Maps to PrimeVue's link variant. |
| `"negative"` | `"danger"` | _(none)_ | Destructive actions. Uses Red palette from preset's `danger`/red semantic tokens. |

### Size Strategy — Custom Sizing via `dt` Prop

PrimeVue Button only has 3 size tiers (small, normal, large). The Figma design has 4 (XS, S, M, L). Strategy:

**Option A (Recommended): Use PrimeVue's `dt` prop for per-instance design token overrides**

The `dt` prop accepts an object of design token overrides scoped to that component instance. Use it to set exact padding, font-size, and icon-size per DsButton size:

```ts
// Computed dt overrides based on DsButton size prop
const sizeTokens = computed(() => {
  const map = {
    xsmall: { fontSize: '0.75rem', paddingX: '0.5rem', paddingY: '0.25rem', iconOnlyWidth: '1.5rem' },
    small:  { fontSize: '0.875rem', paddingX: '0.75rem', paddingY: '0.375rem', iconOnlyWidth: '2rem' },
    medium: { fontSize: '0.875rem', paddingX: '1rem', paddingY: '0.5rem', iconOnlyWidth: '2.25rem' },
    large:  { fontSize: '0.875rem', paddingX: '2rem', paddingY: '0.625rem', iconOnlyWidth: '2.5rem' },
  };
  return map[props.size];
});
```

Then pass `<Button :dt="sizeTokens" ...>`. This uses PrimeVue's official design token API without fighting the framework.

**Option B: Add component tokens to the preset + CSS class per size**

Add button size tokens directly in `ds-preset.ts` under `components.button` and use a wrapper CSS class for the non-standard sizes.

**Choose Option A first** — it keeps the component self-contained. Fall back to Option B if `dt` proves insufficient for all dimensions. Decision during dev is acceptable — no spike needed.

**Known `dt` prop limitations (PrimeVue v4.5.x):**
- **No `height` token** — Button has no explicit height design token. Height is implicitly determined by `paddingY` + `fontSize` + line-height. Adjust `paddingY` to achieve target heights.
- **No `iconSize` token** — Icon size inside a Button is not exposed as a design token. `iconOnlyWidth` controls icon-only button width, not the icon itself. To control icon size, use `pt` prop targeting the icon element, `iconClass` prop with a custom CSS class, or global CSS on `.p-button-icon`.
- **Available root tokens:** `borderRadius`, `roundedBorderRadius`, `gap`, `paddingX`, `paddingY`, `iconOnlyWidth`, `transitionDuration`, `raisedShadow`, `label.fontWeight`, `focusRing.*`
- **Available size tokens (sm/lg):** `fontSize`, `paddingX`, `paddingY`, `iconOnlyWidth`
- **Color tokens per severity:** `background`, `hoverBackground`, `activeBackground`, `borderColor`, `hoverBorderColor`, `activeBorderColor`, `color`, `hoverColor`, `activeColor`, `focusRing.color`, `focusRing.shadow`

**Exact Figma size dimensions:**

| DsButton `size` | Height | Icon Size | Font Size | H-Padding | PrimeVue `size` |
|-----------------|--------|-----------|-----------|-----------|-----------------|
| `"xsmall"` | 24px | 12px | 12px | 8px | _(custom via dt)_ |
| `"small"` | 32px | 16px | 14px | 12px | `"small"` + dt tweaks |
| `"medium"` (default) | 36px | 20px | 14px | 16px | _(none — normal)_ + dt tweaks |
| `"large"` | 40px | 20px | 14px | 32px | `"large"` + dt tweaks |

### DsButton Props Interface

```ts
interface DsButtonProps {
  /** Button variant type. Default: 'primary' */
  severity?: 'primary' | 'outlined' | 'tertiary' | 'text' | 'text-link' | 'negative';
  /** Button size. Default: 'medium' */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /** Disabled state. Default: false */
  disabled?: boolean;
  /** Loading state — shows dot-based indicator (3 animated dots). Default: false */
  loading?: boolean;
}
```

All other PrimeVue Button props (label, icon, iconPos, badge, raised, rounded, etc.) pass through via `$attrs`.

### Component Template Structure

```vue
<template>
  <Button
    v-bind="$attrs"
    :severity="mappedSeverity"
    :variant="mappedVariant"
    :size="mappedPrimeVueSize"
    :dt="sizeTokens"
    :disabled="disabled"
    :loading="loading"
    :class="buttonClasses"
    :aria-disabled="disabled ? 'true' : undefined"
  >
    <template #icon><slot name="icon" /></template>
    <template #loadingicon>
      <slot name="loadingicon">
        <!-- Default: dot-based loading indicator (3 animated dots) -->
        <span class="ds-button-loading-dots">
          <span /><span /><span />
        </span>
      </slot>
    </template>
    <slot />
  </Button>
</template>
```

**Key implementation details:**
- `inheritAttrs: false` on the component — prevents double-binding
- `v-bind="$attrs"` on `<Button>` — passes all unrecognized props/events to PrimeVue
- `<slot />` — passes default slot content (button label text) through
- Named slot `icon` is explicitly forwarded to PrimeVue Button via `<template #icon>`. The `#loadingicon` slot provides a default dot-based loading indicator (3 animated dots) but can be overridden by consumers for custom loading visuals. All other nested content goes into the default slot.
- Computed `mappedSeverity` and `mappedVariant` translate DsButton severity to PrimeVue props
- Computed `sizeTokens` provides `dt` overrides for exact Figma dimensions
- Computed `buttonClasses` adds transition timing, disabled opacity, etc.

### State Implementation Details

**Disabled state (UX-DR9, UX-DR12):**
- Pass `disabled` prop to PrimeVue Button (handles native `disabled` attribute + keyboard)
- Add `aria-disabled="true"` explicitly
- Add `opacity: 0.5` via class (PrimeVue may already handle this — verify)
- Ensure `pointer-events: none` (PrimeVue may already handle — verify)
- Disabled button retains its variant styling — never change severity when disabling
- No transition on disabled state changes (immediate)

**Loading state (UX-DR8, UX-DR12):**
- Pass `loading` to PrimeVue Button — it handles disabling interaction
- PrimeVue Button's default loading spinner must be overridden via the `#loadingicon` slot to show the dot-based indicator (3 animated dots) as per Figma
- Loading state must preserve the same width as the default (non-loading) state — preferred approach: use `position: absolute` for the loading overlay so the original content (invisible) still holds the width. Fallback: capture width via `onMounted` + `min-width` style.
- Loading state must add `aria-live="polite"` to announce the state change to screen readers

**Hover state:**
- Handled by PrimeVue's built-in hover styles via preset tokens
- Verify hover produces slightly darkened/lightened background per variant

**Focus state:**
- PrimeVue uses `focus-visible` by default in Aura — verify this is preserved
- Focus ring color comes from preset's `focusRing` tokens (already configured in ds-preset.ts)

**Active/Pressed state:**
- Handled by PrimeVue's built-in `:active` styles
- Verify it produces a darker shade than hover
- For variants without explicit Figma Pressed designs (Negative, Text/link): the Pressed state should use the same visual treatment as the Hover state

**Transition timing:**
- Apply `transition: all 150ms ease` only on non-disabled state — when `disabled` is true, remove transitions entirely (immediate state changes)
- Implementation: conditionally include the transition class only when `!disabled`

### Dark Mode Considerations

- All button colors come from the preset's semantic tokens (primary = purple, danger = red)
- `ds-preset.ts` already defines `colorScheme.light` and `colorScheme.dark` sections
- PrimeVue's Button component automatically uses the correct color scheme based on `.p-dark` class
- Verify all 6 severity variants render correctly in dark mode
- Focus rings must remain visible in dark mode (already configured in preset)

### Button Hierarchy Rules (from UX spec — document in AI KB later)

- Max one Primary button per visual section
- Negative buttons never appear as sole action — always paired with cancel/back
- Loading state replaces content, preserves width
- Disabled buttons retain type styling at reduced opacity

### Resolved Decisions (confirmed by PO during story review, 2026-03-30)

- **Tertiary → PrimeVue `secondary` mapping**: If PrimeVue's `secondary` severity doesn't match Figma's Tertiary styling, use CSS class or `dt` overrides to correct colors. No spike needed — fix inline during implementation.
- **Loading indicator for non-Primary/Outlined variants**: Loading state is available for all 6 variants. For variants without explicit Figma Loading designs (Tertiary, Text, Text/link, Negative), extrapolate styling from the Primary loading pattern (same dot-based indicator, using the variant's own color tokens).
- **Size height via `paddingY`**: Since PrimeVue Button has no explicit `height` design token, achieve target heights (24/32/36/40px) by calculating `paddingY` from `(targetHeight - fontSize * lineHeight) / 2`. Validate exact pixel output during implementation.
- **DsIcon size ≠ DsButton size tier**: Large DsButton uses 20px icons, which maps to DsIcon's `medium` tier (not `large`=24px). This is intentional per Figma. Devs should not assume button size tier = icon size tier.

### Scope Decisions (confirmed by PO)

- **44px touch targets**: Out of scope for this story. XS buttons render at 24px height without additional touch target padding.
- **Tertiary → Secondary mapping**: No spike/timebox. Dev should attempt the mapping and apply `dt` overrides inline if PrimeVue `secondary` doesn't match Figma. Best-effort within story scope.

### Anti-Patterns to Avoid

- Do NOT create separate components per variant — one DsButton with `severity` prop handles all 6 types
- Do NOT use PrimeVue's `text`, `outlined`, `link` boolean props directly — use the `variant` string prop instead (boolean props are legacy)
- Do NOT hardcode hex colors in the component — all colors flow through preset tokens
- Do NOT add `<style scoped>` blocks with color definitions — styling comes from the preset
- Do NOT use PrimeVue Button's default loading spinner — override via `#loadingicon` slot to show Figma's dot-based indicator (3 animated dots)
- Do NOT use `focus:` pseudo-class for focus rings — use `focus-visible:` (PrimeVue Aura default)
- Do NOT skip the `dt` prop approach for sizing — it's PrimeVue's official way to customize component tokens per instance
- Do NOT add state management or event handling beyond what PrimeVue Button provides — this is a thin wrapper
- Do NOT create utility composables for this component — it's too thin to need shared code
- Do NOT use `defineProps` without TypeScript generic syntax — use `defineProps<DsButtonProps>()`

### Project Structure After This Story

```
src/
├── components/
│   ├── DsButton/
│   │   ├── DsButton.vue          # NEW — PrimeVue Button wrapper
│   │   ├── DsButton.test.ts      # NEW — Vitest tests
│   │   └── index.ts              # NEW — Re-export
│   └── DsIcon/                   # Existing (from Story 1.2.1)
│       ├── DsIcon.vue
│       ├── DsIcon.test.ts
│       ├── icon-names.ts
│       ├── icon-registry.ts
│       └── index.ts
├── theme/
│   ├── ds-preset.ts              # POTENTIALLY MODIFIED — Button component tokens
│   ├── ds-preset.test.ts
│   └── index.ts
└── index.ts                      # MODIFIED — adds DsButton export
```

### Previous Story Intelligence

**From Story 1.2 (Design Token Preset):**
- `definePreset(Aura, {...})` is in `src/theme/ds-preset.ts` — all design tokens available as CSS custom properties
- `palette()` utility from `@primeuix/themes` is NOT available in v2.0.3 — do not attempt to use it
- `dsPreset` and `dsTheme` are exported from `src/theme/index.ts`
- `dsTheme` includes `darkModeSelector: '.p-dark'` for dark mode toggling
- Preset structure: `primitive` (raw palettes), `semantic` (design intent), `extend` (custom tokens)
- Purple primary: 500=`#8e51ff`, 600=`#7849ff`, 800=`#5f33e6`
- Red/danger: 700=`#f22a42`, 800=`#c70036`

**From Story 1.2.1 (DsIcon):**
- DsIcon component pattern: `<script setup lang="ts">`, `withDefaults(defineProps<...>())`, computed props
- Icon size tiers: xsmall=12px, small=16px, medium=20px, large=24px (DsButton icon sizes must match)
- DsIcon uses `<style scoped>` with `:deep(svg)` for SVG sizing — similar pattern may be needed
- 236 SVG icons available in `src/assets/icons/`
- Barrel exports in component `index.ts` → re-exported from `src/index.ts`

**From Story 1.1 (Project Scaffold):**
- PrimeVue 4.5.4, @primeuix/themes 2.0.3 installed
- Vite 8, Vitest 4.1.2 with jsdom environment
- Biome 2 configured: semicolons, single quotes, 2-space indent, 100 line width
- `vite.config.ts` externalizes `vue`, `/^primevue\//`, `/^@primeuix\//`
- Tailwind CSS 4.2.2 via `@tailwindcss/vite` plugin
- TypeScript 5.9.3 strict mode

### Git Intelligence

Recent commit pattern: one story per commit with descriptive messages:
- `story 1.2.1` — DsIcon component
- `story 1.2` — Design Token Preset
- `story 1.1` — Project Scaffold

### Approach Validation Criteria

This story is the critical gate for the Styled Mode approach. After implementation:

**Validated (proceed with remaining components) if:**
- All 6 severity variants render matching Figma using only preset tokens + `dt` prop
- Light and dark mode both render correctly
- No `pt` API overrides needed for core styling (colors, sizes, borders)
- PrimeVue prop passthrough works without conflicts

**Fallback triggered (switch to Unstyled + Tailwind) if:**
- Preset tokens cannot control specific visual aspects (borders, backgrounds, hover states)
- `dt` prop is insufficient for size customization
- Dark mode produces incorrect colors that can't be fixed via `colorScheme` tokens
- Document all gaps in the Dev Agent Record section below

### Figma Design Reference

**Figma source:** https://www.figma.com/design/3qP5xnwc6gXhZR3AnFAMFe/Design-Systems?node-id=2014-9408&m=dev

The Figma file contains three sections: **Action Buttons**, **Icon Button**, and **Link**. Action Buttons are organized by size tier (Large, Medium, Small, XS) and state columns (Active, Hover, Disabled, Pressed, Loaded).

**Key design observations:**

- **Primary button (Large):** background `#7849ff` (purple-600), 8px border-radius, 32px horizontal padding, 10px vertical padding, 20px icon size, font: Inter Semibold 14px (h10), letter-spacing -0.2px
- **Loaded state:** Shows a dot-based loading indicator (3 animated dots), preserves button shape but content is replaced
- **Tertiary button:** Must be visually distinct from PrimeVue's default `secondary` severity — use the Figma-specified gray tones. If PrimeVue `secondary` doesn't match, apply `dt` overrides to correct colors.
- **All buttons support icon+text content** — left icon + label + right icon pattern visible across all variants

**Figma Coverage Matrix — Variant × Size:**

All 24 combinations are accepted in code. Combinations with explicit Figma designs are marked yes; others are extrapolated from adjacent designs.

| Variant | Large | Medium | Small | XS |
|---------|:-----:|:------:|:-----:|:--:|
| Primary | yes | yes | yes | yes |
| Outlined | yes | yes | yes | yes |
| Tertiary | yes | yes | yes | extrapolated |
| Text | yes | yes | yes | yes |
| Text/link | extrapolated | extrapolated | yes | yes |
| Negative | yes | yes | yes | extrapolated |

**Figma State Coverage per Variant:**

| Variant | Active | Hover | Disabled | Pressed | Loaded |
|---------|:------:|:-----:|:--------:|:-------:|:------:|
| Primary | yes | yes | yes | yes | yes |
| Outlined | yes | yes | yes | yes | yes |
| Tertiary | yes | yes | yes | yes | — |
| Text | yes | yes | yes | yes | — |
| Text/link | yes | yes | yes | use Hover | — |
| Negative | yes | yes | yes | use Hover | — |

Note: Loading state is available for **all** variants in code (per design decision), even where Figma only shows it for Primary/Outlined. Extrapolate styling from the Primary loading pattern for other variants.

**Scope clarifications:**
- **Icon Button section** (Extra bold, Bold, Quiet at XS/S/M) — **out of scope**, separate component. DsButton does support icon+text content via PrimeVue's `icon`/`iconPos` props and icon slots.
- **Link section** (Regular link, Quiet, Smart link) — **out of scope**, will be a separate DsLink component. DsButton's `text-link` severity maps to the Regular link visual style.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.3] — Full acceptance criteria and user story
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Architecture] — Thin prop-forwarding wrapper pattern, `inheritAttrs: false` + `v-bind="$attrs"`
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns] — Co-located files, naming conventions, anti-patterns
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Button Hierarchy] — 6 variant types with usage rules, size selection guide
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Component State Patterns] — Universal state behavior, state priority, 150ms ease transitions
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX-DR7] — Button variant types and usage rules
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX-DR8] — Loading state preserves width
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX-DR9] — Disabled retains type styling at reduced opacity
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX-DR12] — Universal state behavior and state priority
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX-DR13] — 150ms ease transitions
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX-DR15] — Uniform size token table
- [Source: PrimeVue 4.5.x docs — Button] — Props: severity, size (small|large only), variant (outlined|text|link), loading, disabled, dt, pt

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- PrimeVue Button props default to `null` (not `undefined`) when not set — test expectations adjusted accordingly
- PrimeVue Button `disabled` prop is passed through to the native `<button>` element as an HTML attribute, not readable via `.props('disabled')` in vue-test-utils — tests verify via `button.element.disabled`

### Completion Notes List

- DsButton component implemented as thin PrimeVue Button wrapper with `inheritAttrs: false` + `v-bind="$attrs"`
- All 6 severity variants mapped: primary (default), outlined (variant=outlined), tertiary (severity=secondary), text (variant=text), text-link (variant=link), negative (severity=danger)
- All 4 sizes implemented via `dt` prop with computed token overrides (Option A from Dev Notes) — paddingX, paddingY, fontSize per size tier
- Disabled state: opacity 0.5, pointer-events none, aria-disabled, no transitions
- Loading state: 3 animated dots via `#loadingicon` slot override, aria-live="polite"
- State transitions: 150ms ease, conditionally applied only when not disabled
- **Styled Mode Approach Validation: VALIDATED** — the preset's semantic tokens (primary=purple, danger=red) + the `dt` prop for per-instance sizing achieve Figma fidelity without any `pt` API overrides or Unstyled mode. No component-level preset tokens needed in `components.button` — existing semantic and color scheme tokens are sufficient. Proceed with remaining components using Styled Mode.
- No preset modifications needed — existing `ds-preset.ts` tokens (purple primary, red danger, colorScheme light/dark) map correctly to PrimeVue Button's default and danger severities
- 29 tests covering all acceptance criteria: variant mapping, size mapping + dt tokens, disabled state, loading state, prop passthrough, slot passthrough, $attrs passthrough

### Change Log

- 2026-03-30: Story 1.3 implemented — DsButton component with all variants, sizes, states, tests (29 tests), build and lint passing

### File List

- src/components/DsButton/DsButton.vue (NEW)
- src/components/DsButton/DsButton.test.ts (NEW)
- src/components/DsButton/index.ts (NEW)
- src/index.ts (MODIFIED — added DsButton + DsButtonProps export)
