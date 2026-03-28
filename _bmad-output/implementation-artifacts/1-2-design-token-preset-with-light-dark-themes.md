# Story 1.2: Design Token Preset with Light & Dark Themes

Status: review

## Story

As a consuming application developer,
I want to apply the Figma design token preset to PrimeVue so all components render with the project's design language,
So that my application matches the Figma Design System in both light and dark mode without custom CSS.

## Acceptance Criteria

1. **Given** `src/theme/ds-preset.ts` is created using `definePreset()` with Aura as the base, **When** a consuming app registers PrimeVue with `{ theme: { preset: dsPreset } }`, **Then** all Figma color tokens are available as CSS custom properties.

2. **Given** the color tokens are mapped, **When** components render, **Then** these palettes are available:
   - Surface/Main Gray (0, 100, 200, 300, 400, 500, 800, 900, 950)
   - Surface/Purple brand (50, 100, 500, 600, 800)
   - Surface/Negative Red (50, 100, 400, 700, 800)
   - Surface/Supporting Blue (200, 600), Amber/Yellow (100, 400, 600), Orange (700), Pink (200, 300)
   - Outline groups: Main (White, Gray 100, 200, 300, 400, 500, 600, 800, 900), Brand (Purple 400, 450), Supporting (Blue 300, 600), Negative (Red 700)
   - Text groups: Main (White, Gray 100, 500, 600, 700, 800, 900), Brand (Purple 600, 800), Supporting (Blue 600), Negative (Red 700)

3. **Given** the typography tokens are mapped, **When** components render, **Then**:
   - Inter font family is applied for headings and body
   - Font weights 400 (regular), 500 (medium), 600 (semibold) are available
   - Font sizes from 12px (H12) through 30px (3xl) with correct line heights
   - Letter spacing -0.2px is available as the `font.letterSpacing.default` extend token (consumers apply it via CSS custom property; PrimeVue does not support a global letterSpacing preset value)

4. **Given** spacing, border radius, border width, and shadow tokens are mapped, **When** components render, **Then**:
   - Spacing scale: 0/2/4/8/12/16/20/32px
   - Border radius: non (0), md (4px), lg (8px), xl (12px)
   - Border width: 50 (1px), 100 (1.2px), 200 (1.5px)
   - Shadows: XS, SM, Shadow 3, Key light shadow, Error-100 focus ring

5. **Given** light and dark themes are defined within the single preset, **When** the consuming app calls PrimeVue's theme switching API, **Then**:
   - Theme switches instantaneously with no flash of unstyled content (NFR3)
   - Dark mode uses Aura's semantic-level inversion pattern: surface primitives remain constant across schemes; color scheme semantic tokens (`content`, `text`, `overlay`, `formField`, `navigation`, `list`) provide the dark/light differentiation (Note: Figma dark mode export does not yet include explicit dark surface values; when available, surface primitives may be overridden per-scheme)
   - Shadows reduce in intensity in dark mode (**deferred**: Figma dark mode export does not yet include dark shadow values; dark shadow overrides will be added when Figma dark shadow definitions are available)
   - Focus rings remain visible in both themes

6. **Given** the preset is exported from `src/index.ts`, **When** a consumer imports `{ dsPreset, dsTheme }` from the library, **Then** the imports resolve correctly, `dsPreset` is the raw preset and `dsTheme` is a convenience wrapper including `darkModeSelector: '.p-dark'`.

7. **Given** the preset file has a co-located test, **When** `npm run test` is run, **Then** tests verify the preset exports correctly and contains expected token structure.

## Tasks / Subtasks

- [x] Task 1: Create `src/theme/ds-preset.ts` with PrimeVue definePreset (AC: #1)
  - [x] 1.1 Import `definePreset` from `@primeuix/themes` and `Aura` from `@primeuix/themes/aura`
  - [x] 1.2 Define the preset structure with `primitive`, `semantic`, and `semantic.colorScheme.light`/`dark` sections
  - [x] 1.3 Export as `dsPreset` (named export, not default)

- [x] Task 2: Map Figma color tokens to PrimeVue primitive palette (AC: #2)
  - [x] 2.1 Map Surface/Main Gray palette as custom primitive colors (see Figma Token Map below)
  - [x] 2.2 Map Surface/Purple brand palette as `primary` semantic color
  - [x] 2.3 Map Surface/Negative Red palette to PrimeVue's `red` primitive or semantic `danger`
  - [x] 2.4 Map Surface/Supporting palettes (Blue, Amber/Yellow, Orange, Pink)
  - [x] 2.5 Map Outline color groups via semantic tokens or `extend` custom tokens
  - [x] 2.6 Map Text color groups via semantic tokens or `extend` custom tokens

- [x] Task 3: Map typography tokens (AC: #3)
  - [x] 3.1 Set Inter as the font family in the preset
  - [x] 3.2 Map font weight scale (400, 500, 600) to PrimeVue typography tokens
  - [x] 3.3 Map font size scale with line heights using `extend` custom tokens

- [x] Task 4: Map spacing, border, and shadow tokens (AC: #4)
  - [x] 4.1 Map spacing scale (0/2/4/8/12/16/20/32px) via `extend` or Tailwind integration
  - [x] 4.2 Map border radius tokens: non (0), md (4px), lg (8px), xl (12px)
  - [x] 4.3 Map border width tokens: 50 (1px), 100 (1.2px), 200 (1.5px)
  - [x] 4.4 Define shadow tokens: XS, SM, Shadow 3, Key light shadow, Error-100 focus ring

- [x] Task 5: Implement light/dark theme color schemes (AC: #5)
  - [x] 5.1 Define `semantic.colorScheme.light` with light-mode surface, text, and border tokens
  - [x] 5.2 Define `semantic.colorScheme.dark` with inverted backgrounds, adapted text, reduced shadows
  - [x] 5.3 Configure `darkModeSelector` option (use `.p-dark` class selector for PrimeVue's built-in switching)

- [x] Task 6: Export preset from barrel (AC: #6)
  - [x] 6.1 Add `export { dsPreset } from './theme/ds-preset'` to `src/index.ts`
  - [x] 6.2 Create `src/theme/index.ts` re-export file (follows co-located pattern from architecture)

- [x] Task 7: Write tests (AC: #7)
  - [x] 7.1 Create `src/theme/ds-preset.test.ts`
  - [x] 7.2 Test: preset is a valid object with expected top-level structure
  - [x] 7.3 Test: primary color palette contains Purple hex values
  - [x] 7.4 Test: preset contains colorScheme with both light and dark sections
  - [x] 7.5 Test: custom extend tokens (spacing, radius, shadows) are present

- [x] Task 8: Validate build (AC: #1, #6)
  - [x] 8.1 Run `npm run build` — must complete successfully with preset in dist
  - [x] 8.2 Run `npm run test` — all tests pass
  - [x] 8.3 Run `biome check` — no errors

## Dev Notes

### Critical: PrimeVue definePreset API (v4.5.x / @primeuix/themes 2.x)

Import pattern (confirmed from PrimeVue docs and Story 1.1 notes):
```ts
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
```

**Preset structure has three layers:**
1. **`primitive`** — Raw color palettes (hex values). Override to define custom color ramps.
2. **`semantic`** — Design intent tokens that reference primitives via `{color.shade}` syntax. Includes `primary`, `surface`, `colorScheme.light`, `colorScheme.dark`.
3. **`components`** — Per-component token overrides. NOT needed for this story.

**Color scheme tokens** must be nested under `semantic.colorScheme.light` / `semantic.colorScheme.dark` — tokens defined at `semantic` root are shared across both schemes. Only color-scheme-dependent tokens (surface backgrounds, text colors) go inside `colorScheme`.

**Dark mode activation:** Configure via `options.darkModeSelector: '.p-dark'`. Consumer toggles by adding/removing `.p-dark` class on `<html>` element.

**palette() utility** from `@primeuix/themes` can generate full 50-950 shade ramps from a single hex value — useful if Figma only provides partial shades.

### Figma Token Map — Exact Hex Values

**CRITICAL: Use these exact values from `docs/figma-variables.md`. Do NOT approximate or auto-generate.**

**Surface/Main (Gray) → PrimeVue `surface` primitive or semantic surface:**
| Shade | Hex |
|-------|-----|
| 0 (White) | `#ffffff` |
| 100 | `#f8fafc` |
| 200 | `#f1f5f9` |
| 300 | `#e2e8f0` |
| 400 | `#cad5e2` |
| 500 | `#90a1b9` |
| 800 | `#314158` |
| 900 | `#1d293d` |
| 950 | `#020618` |

**Surface/Purple (Brand) → PrimeVue `primary` semantic color:**
| Shade | Hex |
|-------|-----|
| 50 | `#f7f6fd` |
| 100 | `#f3e8ff` |
| 500 | `#8e51ff` |
| 600 | `#7849ff` |
| 800 | `#5f33e6` |

Note: PrimeVue `primary` expects 50-950. For missing shades (200, 300, 400, 700, 900, 950), use `palette('#8e51ff')` to auto-generate OR manually interpolate. Document which approach was chosen.

**Surface/Negative (Red) → PrimeVue semantic `danger` or custom `red`:**
| Shade | Hex |
|-------|-----|
| 50 | `#fff1f2` |
| 100 | `#ffe4e6` |
| 400 | `#ff8b8b` |
| 700 | `#f22a42` |
| 800 | `#c70036` |

**Surface/Supporting palettes:**
- **Blue:** 200 `#e7f4fe`, 600 `#0e5cf4`
- **Amber/Yellow:** 100 `#ffefdb`, 400 `#f8bc3b`, 600 `#da6b16`
- **Orange:** 700 `#cc332b`
- **Pink:** 200 `#ff4dd2`, 300 `#df00b4`

**Outline colors (for borders/dividers):**
- Main: White `#ffffff`, Gray 100 `#f8fafc`, 200 `#f1f3f4`, 300 `#e2e8f0`, 400 `#cad5e2`, 500 `#90a1b9`, 600 `#62748e`, 800 `#314158`, 900 `#1d293d`
- Brand: Purple 400 `#7849ff`, Purple 450 `#5f33e6`
- Supporting Blue: 300 `#c2dfff`, 600 `#0e5cf4`
- Negative: Red 700 `#f22a42`

**Text colors:**
- Main: White `#ffffff`, Gray 100 `#f8fafc`, 500 `#90a1b9`, 600 `#62748e`, 700 `#45556c`, 800 `#314158`, 900 `#1d293d`
- Brand: Purple 600 `#7849ff`, Purple 800 `#5f33e6`
- Supporting Blue: 600 `#0e5cf4`
- Negative: Red 700 `#f22a42`

**Token colors (semantic):**
- `token/surface/primary/BW-00`: `#ffffff`
- `token/surface/primary/BW-01`: `#fbfbfd`
- `token/text/main/Primary`: `#20242e`
- `token/text/negative/Red`: `#e74343`

### Typography Token Map

| Style | Font | Weight | Size | Line Height | Letter Spacing |
|-------|------|--------|------|-------------|----------------|
| text-xs normal | Inter | 400 | 12px | 16px | 0 |
| text-xs medium | Inter | 500 | 12px | 16px | 0 |
| text-xs semibold | Inter | 600 | 12px | 16px | 0 |
| text-sm normal | Inter | 400 | 14px | 20px | -0.2px |
| text-sm medium | Inter | 500 | 14px | 20px | -0.2px |
| text-sm semibold | Inter | 600 | 14px | 20px | -0.2px |
| text-3xl normal | Inter | 400 | 30px | 32px | -0.2px |
| text-3xl semibold | Inter | 600 | 30px | 32px | -0.2px |
| body-sm normal | Inter | 400 | 14px | 20px | -0.2px |

Additional sizes from variables: `base` = 16px, `lg` = 20px, `2xl` = 32px.

> **Spec clarification (post-review):** The Figma variables section previously listed `sm = 16px` which conflicted with the typography table above (`text-sm = 14px`). The typography table is authoritative: `sm = 14px`. The 16px size is mapped to `base`. Additionally, `2xl` (32px) is larger than `3xl` (30px) — this is intentional: `3xl` comes from the `text-3xl` composite heading style (30px font-size, 32px line-height) while `2xl` comes from the `typography/size/2xl` variable (32px). These are distinct design tokens, not a monotonic scale.

### Shadow Token Map — Exact Values

| Token | CSS Value |
|-------|-----------|
| XS | `drop-shadow(0 1px 2px #e2e8f0)` (Gray 300) |
| SM | `drop-shadow(0 1px 6px #CAD5E240), drop-shadow(0 1px 4px #CAD5E280)` |
| Shadow 3 | `drop-shadow(0 1px 6px #B0BDC517), drop-shadow(0 6px 13px #B0BDC524), drop-shadow(0 1px 2px #3A485012)` |
| Key light | `drop-shadow(0 1px 0 #00000059)` |
| Error-100 focus ring | `box-shadow(0 0 0 3px #ffe4e6)` (Red 100) |

> **Spec clarification (post-review):** Figma exports shadow values as CSS `drop-shadow()` filter functions, but PrimeVue applies shadows via `box-shadow`. The implementation uses `box-shadow` shorthand format (e.g., `0 1px 2px #e2e8f0`) — functionally equivalent values without the `drop-shadow()` wrapper.

### Implementation Strategy: PrimeVue Preset Layers

```ts
// Recommended structure for ds-preset.ts
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

export const dsPreset = definePreset(Aura, {
  // 1. PRIMITIVE: raw color palettes with custom hex values
  primitive: {
    // Override Aura's built-in gray/surface with Figma values
    // Define custom purple ramp for primary
  },

  // 2. SEMANTIC: design intent tokens
  semantic: {
    primary: {
      // Map Purple brand palette shades
      50: '#f7f6fd',
      100: '#f3e8ff',
      // ... fill missing shades
      500: '#8e51ff',
      600: '#7849ff',
      800: '#5f33e6',
    },
    colorScheme: {
      light: {
        surface: {
          // Light mode surface colors from Gray palette
        },
        // Light-mode-specific semantic overrides
      },
      dark: {
        surface: {
          // Dark mode inverted surface colors
        },
        // Dark-mode-specific semantic overrides
      },
    },
  },

  // 3. EXTEND: custom tokens not in PrimeVue's standard structure
  extend: {
    // Custom spacing, shadows, outline/text color groups
  },
})
```

### Dark Mode Strategy

- Figma dark mode is **designed** (not auto-derived) — dark token values must come from Figma definitions
- The Figma export (`docs/figma-variables.md`) currently only contains light mode values
- **For dark mode:** Use PrimeVue Aura's built-in dark palette as a starting point, then override with any Figma-specified dark values as they become available
- Document which dark tokens are Figma-derived vs Aura defaults
- Per UX spec (UX-DR21): backgrounds invert, text inverts, shadows reduce intensity, focus rings remain visible, borders shift to dark-appropriate subtle dividers

### Anti-Patterns to Avoid

- Do NOT hardcode hex values in components — all colors must come through the preset's CSS custom properties
- Do NOT create separate light/dark preset files — use single preset with `colorScheme.light`/`dark`
- Do NOT add `<style>` blocks or global CSS for token definitions — everything flows through `definePreset()`
- Do NOT import preset directly in components — components consume tokens via PrimeVue's CSS variable system
- Do NOT skip missing Purple/Red shades — fill gaps using `palette()` utility or manual interpolation
- Do NOT use Tailwind `@theme` for design tokens — tokens flow through PrimeVue's preset system; Tailwind is only for utility classes in custom components

### Project Structure After This Story

```
src/
├── components/          # Empty (no components yet)
├── theme/
│   ├── ds-preset.ts     # NEW — PrimeVue definePreset with all Figma tokens
│   ├── ds-preset.test.ts # NEW — Preset validation tests
│   └── index.ts         # NEW — Re-export for barrel
└── index.ts             # MODIFIED — adds dsPreset export
```

### Previous Story Intelligence (Story 1.1)

- Project scaffolded successfully with Vite 8 + Vue 3 + TypeScript strict
- PrimeVue 4.5.4 and @primeuix/themes 2.0.3 are installed
- Vitest uses jsdom environment (added post-review)
- Biome 2 configured: 2-space indent, 100 line width, single quotes
- `tsconfig.build.json` excludes `*.stories.ts` and `*.test.ts`
- `vite.config.ts` externalizes `vue`, `/^primevue\//`, `/^@primeuix\//`
- `npm run build` and `biome check` pass cleanly
- `sideEffects: ["**/*.css"]` is set in package.json for CSS preservation

### References

- [Source: docs/figma-variables.md] — All Figma token hex values (authoritative)
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2] — Acceptance criteria and user story
- [Source: _bmad-output/planning-artifacts/architecture.md#Design Token / Theme Preset Architecture] — Single preset file decision, Aura base
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns] — No hardcoded hex, no scoped styles
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Visual Design Foundation] — Semantic color roles, typography system
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX-DR1 through UX-DR6] — Token requirements
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX-DR21] — Dark mode token mapping rules
- [Source: PrimeVue docs — theming/styled] — definePreset API, colorScheme structure, palette() utility

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- `palette()` utility from `@primeuix/themes` is not available in v2.0.3 — manually interpolated missing shades for purple, red, gray, and supporting palettes
- Dark mode uses inverted gray scale referencing the same Figma gray primitives (per UX-DR21), with Aura-style semantic defaults for formField, content, overlay, etc.
- Biome auto-fix applied for semicolons (project uses semicolons per Biome config)

### Completion Notes List

- Created `src/theme/ds-preset.ts` with `definePreset(Aura, {...})` containing all Figma design tokens
- Primitive layer: gray (surface/main), purple (brand), red (negative), blue, amber, orange, pink palettes with full 50-950 ramps
- Semantic layer: primary mapped to purple, light/dark colorScheme with full surface, text, formField, content, overlay, list, navigation tokens
- Extend layer: outline color groups, text color groups, spacing scale, border radius, border width, shadow tokens, typography tokens (font family, weight, size, lineHeight, letterSpacing), semantic token colors
- Created `src/theme/index.ts` barrel re-export
- Updated `src/index.ts` to export `dsPreset`
- 9 unit tests covering: structure validation, purple primary palette hex values, light/dark colorScheme presence, extend tokens (spacing, radius, shadows), gray palette, red palette, typography tokens, border widths, outline/text color groups
- All tests pass (9/9), build succeeds (11.02 kB), biome check clean

### File List

- `src/theme/ds-preset.ts` — NEW: PrimeVue preset with all Figma design tokens
- `src/theme/ds-preset.test.ts` — NEW: 9 unit tests for preset validation
- `src/theme/index.ts` — NEW: Barrel re-export for theme module
- `src/index.ts` — MODIFIED: Added dsPreset export

### Change Log

- 2026-03-28: Story 1.2 implementation complete — created PrimeVue design token preset with full Figma color, typography, spacing, border, shadow, and light/dark theme tokens. 9 tests added, build and lint pass.
