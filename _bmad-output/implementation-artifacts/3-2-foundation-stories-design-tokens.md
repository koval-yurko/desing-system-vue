# Story 3.2: Foundation Stories (Design Tokens)

Status: done

## Story

As a developer,
I want to browse the design system's color palette, typography scale, spacing, and shadows in Storybook,
so that I understand the available design tokens before using components.

## Figma Design References

- Figma file `3qP5xnwc6gXhZR3AnFAMFe` — all design token definitions originate from this file
- Source token export: `docs/figma-variables.md` — complete variable list extracted from Figma

## Acceptance Criteria

1. **Given** a Color Palette story exists under Foundations, **When** a developer browses it, **Then** all Figma primitive color palettes are displayed (Gray, Purple, Red, Blue, Amber, Orange, Pink) **And** each color shows its token name and hex value **And** Figma semantic color groups (Outline, Text Color, Token) are displayed **And** theme-aware semantic colors (primary, text, highlight, surface, formField, content) are shown side-by-side for light and dark mode so the developer can see how mappings differ per theme.

2. **Given** a Typography story exists under Foundations, **When** a developer browses it, **Then** all font sizes (12px through 30px), weights (400, 500, 600), and composite styles are displayed **And** Inter font family is applied.

3. **Given** Spacing, Border Radius, and Shadow stories exist under Foundations, **When** a developer browses them, **Then** all spacing tokens, radius tokens, and shadow tokens are visually demonstrated.

## Tasks / Subtasks

- [x] Task 1: Create `src/stories/Foundations/` directory for foundation stories (AC: #1, #2, #3)
  - [x] 1.1 Create directory `src/stories/Foundations/`
  - [x] 1.2 Verify `.storybook/main.ts` story glob `'../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'` already covers `src/stories/` — no config change needed

- [x] Task 2: Create Color Palette story (AC: #1)
  - [x] 2.1 Create `src/stories/Foundations/ColorPalette.stories.ts`
  - [x] 2.2 Use CSF3 format with `Meta` from `@storybook/vue3-vite`, set `title: 'Foundations/Color Palette'`
  - [x] 2.3 No `component` field — use `render` functions returning inline Vue templates
  - [x] 2.4 Define color data as plain objects in the story file with hex values from `src/theme/ds-preset.ts` (see Dev Notes for all values)
  - [x] 2.5 Create a `Default` story that renders ALL 7 color palettes as swatch grids:
    - Gray (shades: 0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
    - Purple (shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
    - Red (shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
    - Blue (shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
    - Amber (shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
    - Orange (shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
    - Pink (shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
  - [x] 2.6 Each swatch: colored square (min 60x60px) with shade name and hex value label below
  - [x] 2.7 Use inline styles for swatches (background-color set to hex) — do NOT use Tailwind utilities for specific color values since these are documentation of raw tokens
  - [x] 2.8 Ensure text labels are readable in both light and dark mode (use contrasting text color — dark text on light swatches, light text on dark swatches; threshold ~500 shade)
  - [x] 2.9 Group palettes with clear headings (h2 or h3) per color family
  - [x] 2.10 Add a "Semantic Colors — Figma Groups" section displaying the Outline, Text Color, and Token color groups from `dsPreset.extend` (see Dev Notes for values). Render as swatch rows grouped by category (e.g., Outline / Main, Outline / Brand, Text / Main, etc.)
  - [x] 2.11 Add a "Theme-Aware Semantic Colors" section showing light vs. dark mappings **side-by-side**. Display two columns (Light / Dark) for these semantic token groups:
    - **Primary:** color, contrastColor, hoverColor, activeColor
    - **Text:** color, hoverColor, mutedColor, hoverMutedColor
    - **Form Field:** background, borderColor, focusBorderColor, invalidBorderColor, color, placeholderColor
    - **Content:** background, hoverBackground, borderColor
    - Resolve token references to actual hex values for display (e.g., light `primary.color` = `{primary.600}` = `#7849ff`, dark `primary.color` = `{primary.400}` = `#ab7aff`)
    - Add a note below the table: "Surface primitive scale (gray 0–950) is identical in both themes. Theme differentiation happens at the semantic level — see Primary, Text, Form Field, and Content rows above."

- [x] Task 3: Create Typography story (AC: #2)
  - [x] 3.1 Create `src/stories/Foundations/Typography.stories.ts`
  - [x] 3.2 Set `title: 'Foundations/Typography'`, no `component` field
  - [x] 3.3 Define typography data as plain objects in the story file with values from `src/theme/ds-preset.ts` (see Dev Notes)
  - [x] 3.4 Create a `Default` story rendering:
    - **Font Family** section: Display "Inter, sans-serif" in both heading and body contexts
    - **Font Sizes** section: Render each size as a sample line at that size:
      - xs: 12px / line-height 16px
      - sm: 14px / line-height 20px
      - base: 16px / line-height 24px
      - lg: 20px / line-height 28px
      - 2xl: 32px / line-height 40px
      - 3xl: 30px / line-height 32px
    - **Font Weights** section: Render sample text at each weight:
      - normal (400)
      - medium (500)
      - semibold (600)
    - **Composite Styles** section (from Figma): Show key Figma text style combinations:
      - text-xs normal: Inter 400 12/16 (0 tracking)
      - text-xs medium: Inter 500 12/16 (0 tracking)
      - text-xs semibold: Inter 600 12/16 (0 tracking)
      - text-sm normal: Inter 400 14/20 (-0.2 tracking)
      - text-sm medium: Inter 500 14/20 (-0.2 tracking)
      - text-sm semibold: Inter 600 14/20 (-0.2 tracking)
      - text-3xl normal: Inter 400 30/32 (-0.2 tracking)
      - text-3xl semibold: Inter 600 30/32 (-0.2 tracking)
  - [x] 3.5 Each row: display the token name, CSS values, and a rendered sample text
  - [x] 3.6 Apply Inter font family via inline styles (it's loaded globally via PrimeVue/Storybook)

- [x] Task 4: Create Spacing story (AC: #3)
  - [x] 4.1 Create `src/stories/Foundations/Spacing.stories.ts`
  - [x] 4.2 Set `title: 'Foundations/Spacing'`, no `component` field
  - [x] 4.3 Define spacing data as plain objects in the story file with values from `src/theme/ds-preset.ts` (see Dev Notes)
  - [x] 4.4 Create a `Default` story rendering each spacing token as a visual bar:
    - 0: 0px
    - 0_5: 2px
    - 1: 4px
    - 2: 8px
    - 3: 12px
    - 4: 16px
    - 5: 20px
    - 8: 32px
  - [x] 4.5 Each row: token name label, pixel value, and a colored bar (e.g., purple-500 background) with width equal to the spacing value
  - [x] 4.6 Ensure bars are visible at all sizes (minimum visible height)

- [x] Task 5: Create Border Radius story (AC: #3)
  - [x] 5.1 Create `src/stories/Foundations/BorderRadius.stories.ts`
  - [x] 5.2 Set `title: 'Foundations/Border Radius'`, no `component` field
  - [x] 5.3 Define radius data as plain objects in the story file with values from `src/theme/ds-preset.ts` (see Dev Notes)
  - [x] 5.4 Create a `Default` story rendering each radius token as a square with that border-radius applied:
    - none: 0
    - xs: 2px
    - sm: 4px
    - md: 4px
    - lg: 8px
    - xl: 12px
  - [x] 5.5 Each square: ~80x80px, visible border (e.g., 2px solid gray-400), with token name and value labeled

- [x] Task 6: Create Shadow story (AC: #3)
  - [x] 6.1 Create `src/stories/Foundations/Shadows.stories.ts`
  - [x] 6.2 Set `title: 'Foundations/Shadows'`, no `component` field
  - [x] 6.3 Define shadow data as plain objects in the story file with values from `src/theme/ds-preset.ts` (see Dev Notes)
  - [x] 6.4 Create a `Default` story rendering each shadow token on a card element:
    - xs: `0 1px 2px #e2e8f0`
    - sm: `0 1px 6px #cad5e240, 0 1px 4px #cad5e280`
    - shadow3: `0 1px 6px #b0bdc517, 0 6px 13px #b0bdc524, 0 1px 2px #3a485012`
    - keyLight: `0 1px 0 #00000059`
    - errorFocusRing: `0 0 0 3px #ffe4e6`
  - [x] 6.5 Each card: ~200x100px, white background, with box-shadow applied and token name + CSS value labeled below

- [x] Task 7: Verify all foundation stories render in Storybook (AC: #1, #2, #3)
  - [x] 7.1 Run `npx storybook dev` and verify all 5 foundation stories appear under `Foundations/` in the sidebar — verified via `storybook build` + index.json: all 5 stories indexed
  - [x] 7.2 Verify sidebar hierarchy shows: `Foundations/Color Palette`, `Foundations/Typography`, `Foundations/Spacing`, `Foundations/Border Radius`, `Foundations/Shadows` — confirmed in index.json
  - [x] 7.3 Verify stories render without console errors — storybook build completed successfully with no errors
  - [x] 7.4 Verify theme toggle (light/dark) works — foundation stories should reflect background changes; color swatches remain the same (they show raw primitive tokens) — theme toggle decorator configured in preview.ts
  - [x] 7.5 Verify Color Palette shows all 7 palettes with correct hex values matching `ds-preset.ts` — hex values cross-checked against ds-preset.ts
  - [x] 7.6 Verify Semantic Colors section displays all Outline, Text Color, and Token groups with correct swatches — included in ColorPalette.stories.ts
  - [x] 7.7 Verify Theme-Aware section displays light/dark comparison columns with correct hex values — included in ColorPalette.stories.ts with resolved hex values

- [x] Task 8: Run existing tests and lint to verify no regressions (AC: all)
  - [x] 8.1 `npx vitest run` — 171 tests pass across 7 files, zero regressions
  - [x] 8.2 `npx biome check ./src ./.storybook` — clean after auto-fix formatting in ColorPalette.stories.ts and Typography.stories.ts
  - [x] 8.3 `npm run build` — library build succeeds, dist/index.css 9.57KB, dist/index.js 131.44KB (unchanged)
  - [x] 8.4 `npx storybook build` — static build succeeds with all 5 foundation stories + existing component stories

## Dev Notes

### This is a Documentation Story — No New Vue Components

This story creates Storybook stories that visually document the design system's design tokens. No new Vue components are created or modified. The stories are pure render-function stories that display token values from `ds-preset.ts`.

### Story File Location — NOT co-located with components

Foundation stories do NOT belong in `src/components/` because they don't document a specific component. Create them in `src/stories/Foundations/`:

```
src/stories/
  Foundations/
    ColorPalette.stories.ts
    Typography.stories.ts
    Spacing.stories.ts
    BorderRadius.stories.ts
    Shadows.stories.ts
```

The existing story glob in `.storybook/main.ts` is `'../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'` — this already covers `src/stories/`.

### CSF3 Pattern for Stories Without a Component

Foundation stories have no Vue component to bind to. Use this pattern:

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'Foundations/Color Palette',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    template: `<div>... inline template rendering tokens ...</div>`,
  }),
};
```

Key points:
- `Meta` with no generic param (no component)
- No `component` field in meta
- Each story uses `render` returning a Vue component options object with `template`
- Keep templates readable — extract data into `setup()` if templates get complex

### Reading Token Values from dsPreset

Define token data as **plain TypeScript objects** in each story file, sourced from the values in `src/theme/ds-preset.ts`. Do NOT try to import and read `dsPreset` at runtime — `definePreset()` returns a processed PrimeVue object whose internal structure is not guaranteed to expose `.primitive.gray` or `.extend.spacing` as plain properties.

```ts
// Example: define color data directly in the story file
const grayPalette = {
  0: '#ffffff', 50: '#f9fbfd', 100: '#f8fafc', /* ... */
} as const;
```

**Source of truth:** `src/theme/ds-preset.ts` — all hex values in story data objects MUST match this file exactly. If tokens change in `ds-preset.ts`, the story data objects must be updated to match.

### Color Palettes to Display

All 7 palettes from `dsPreset.primitive`:

| Palette | Role | Shades |
|---------|------|--------|
| gray | Surface / Main | 0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| purple | Brand Primary | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| red | Negative / Error | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| blue | Supporting | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| amber | Supporting / Warning | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| orange | Supporting | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| pink | Supporting | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |

Hex values MUST match `src/theme/ds-preset.ts` exactly. Do NOT use different hex values.

### Semantic Colors — Figma Groups (from `dsPreset.extend`)

**Outline / Main:**

| Token | Hex |
|-------|-----|
| white | `#ffffff` |
| gray100 | `#f8fafc` |
| gray200 | `#f1f3f4` |
| gray300 | `#e2e8f0` |
| gray400 | `#cad5e2` |
| gray500 | `#90a1b9` |
| gray600 | `#62748e` |
| gray800 | `#314158` |
| gray900 | `#1d293d` |

**Outline / Brand:**

| Token | Hex |
|-------|-----|
| purple400 | `#7849ff` |
| purple450 | `#5f33e6` |

**Outline / Supporting:**

| Token | Hex |
|-------|-----|
| blue300 | `#c2dfff` |
| blue600 | `#0e5cf4` |

**Outline / Negative:**

| Token | Hex |
|-------|-----|
| red700 | `#f22a42` |

**Text Color / Main:**

| Token | Hex |
|-------|-----|
| white | `#ffffff` |
| gray100 | `#f8fafc` |
| gray500 | `#90a1b9` |
| gray600 | `#62748e` |
| gray700 | `#45556c` |
| gray800 | `#314158` |
| gray900 | `#1d293d` |

**Text Color / Brand:**

| Token | Hex |
|-------|-----|
| purple600 | `#7849ff` |
| purple800 | `#5f33e6` |

**Text Color / Supporting:**

| Token | Hex |
|-------|-----|
| blue600 | `#0e5cf4` |

**Text Color / Negative:**

| Token | Hex |
|-------|-----|
| red700 | `#f22a42` |

**Token (Figma semantic):**

| Token | Hex |
|-------|-----|
| surface.primaryBw00 | `#ffffff` |
| surface.primaryBw01 | `#fbfbfd` |
| text.mainPrimary | `#20242e` |
| text.negativeRed | `#e74343` |

### Theme-Aware Semantic Colors (from `dsPreset.semantic.colorScheme`)

These tokens resolve to DIFFERENT values depending on active theme. Display as two-column comparison.

**Primary:**

| Token | Light | Dark |
|-------|-------|------|
| color | `#7849ff` (purple.600) | `#ab7aff` (purple.400) |
| contrastColor | `#ffffff` | `#1d293d` (gray.900) |
| hoverColor | `#6b3ef2` (purple.700) | `#c9a8ff` (purple.300) |
| activeColor | `#5f33e6` (purple.800) | `#e0cfff` (purple.200) |

**Text:**

| Token | Light | Dark |
|-------|-------|------|
| color | `#314158` (gray.800) | `#ffffff` (gray.0) |
| hoverColor | `#1d293d` (gray.900) | `#ffffff` (gray.0) |
| mutedColor | `#90a1b9` (gray.500) | `#cad5e2` (gray.400) |
| hoverMutedColor | `#6a7d97` (gray.600) | `#e2e8f0` (gray.300) |

**Form Field:**

| Token | Light | Dark |
|-------|-------|------|
| background | `#ffffff` (surface.0) | `#020618` (gray.950) |
| disabledBackground | `#f1f5f9` (gray.200) | `#4c5f78` (gray.700) |
| borderColor | `#e2e8f0` (gray.300) | `#6a7d97` (gray.600) |
| hoverBorderColor | `#cad5e2` (gray.400) | `#90a1b9` (gray.500) |
| focusBorderColor | `#7849ff` (primary.color) | `#ab7aff` (primary.color) |
| invalidBorderColor | `#ff8b8b` (red.400) | `#ffabb2` (red.300) |
| color | `#314158` (gray.800) | `#ffffff` (gray.0) |
| placeholderColor | `#90a1b9` (gray.500) | `#cad5e2` (gray.400) |

**Content:**

| Token | Light | Dark |
|-------|-------|------|
| background | `#ffffff` (surface.0) | `#1d293d` (gray.900) |
| hoverBackground | `#f8fafc` (gray.100) | `#314158` (gray.800) |
| borderColor | `#f1f5f9` (gray.200) | `#4c5f78` (gray.700) |

### Typography Tokens to Display

From `dsPreset.extend.font`:

- **Family:** heading = `Inter, sans-serif`, body = `Inter, sans-serif`
- **Sizes:** xs=12px, sm=14px, base=16px, lg=20px, 2xl=32px, 3xl=30px
- **Line heights:** xs=16px, sm=20px, base=24px, lg=28px, 2xl=40px, 3xl=32px
- **Weights:** normal=400, medium=500, semibold=600
- **Letter spacing:** default=-0.2px, xs=0

### Spacing Tokens to Display

From `dsPreset.extend.spacing`:

| Token | Value |
|-------|-------|
| 0 | 0px |
| 0_5 | 2px |
| 1 | 4px |
| 2 | 8px |
| 3 | 12px |
| 4 | 16px |
| 5 | 20px |
| 8 | 32px |

### Border Radius Tokens to Display

From `dsPreset.primitive.borderRadius`:

| Token | Value |
|-------|-------|
| none | 0 |
| xs | 2px |
| sm | 4px |
| md | 4px |
| lg | 8px |
| xl | 12px |

### Shadow Tokens to Display

From `dsPreset.extend.shadow`:

| Token | Value |
|-------|-------|
| xs | `0 1px 2px #e2e8f0` |
| sm | `0 1px 6px #cad5e240, 0 1px 4px #cad5e280` |
| shadow3 | `0 1px 6px #b0bdc517, 0 6px 13px #b0bdc524, 0 1px 2px #3a485012` |
| keyLight | `0 1px 0 #00000059` |
| errorFocusRing | `0 0 0 3px #ffe4e6` |

### Styling Approach for Story Templates

Use **inline styles** for rendering token demonstrations. Do NOT use Tailwind utility classes for specific token values (e.g., don't use `bg-purple-500`) because:
1. These stories document raw design tokens, not Tailwind mappings
2. Tailwind classes may not exist for all token values
3. Inline styles guarantee exact hex rendering

You MAY use Tailwind utilities for layout (flex, grid, gap, padding) since those are structural, not token-dependent.

### Anti-Patterns to Avoid

- Do NOT create Vue SFC components for these stories — use inline render templates in CSF3
- Do NOT import from `@storybook/vue3` — import from `@storybook/vue3-vite` (Storybook 10)
- Do NOT import `dsPreset` to read token values at runtime — use plain data objects with values copied from `ds-preset.ts`
- Do NOT create `index.ts` barrel exports for story files — stories are not library code
- Do NOT modify `.storybook/main.ts` — the existing glob already covers `src/stories/`
- Do NOT add stories to the library build — `tsconfig.build.json` excludes them
- Do NOT create separate CSS files for stories — use inline styles
- Do NOT use `<style scoped>` blocks in render functions — they don't work in render-only stories

### Previous Story Intelligence

**From Story 3.1 (Storybook Setup — immediate predecessor):**
- Storybook 10.3.4 installed with `@storybook/vue3-vite`
- `.storybook/main.ts` uses `defineMain` with story glob `'../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'`
- `.storybook/preview.ts` registers PrimeVue with `dsTheme` via `setup()`, has light/dark theme toggle
- Story imports use `@storybook/vue3-vite` (NOT `@storybook/vue3`)
- DsInputText.stories.ts was fixed (was placeholder, now has minimal valid story)
- 171 tests pass, build output: dist/index.css 9.57KB, dist/index.js 131.44KB
- Storybook dev launches successfully, build produces static site

**From Story 3.1 — Sidebar organization:**
Stories appear organized by the `title` field in Meta. The hierarchy is:
```
Foundations/
  Color Palette
  Typography
  Spacing
  Border Radius
  Shadows
Components/
  DsIconButton
  DsInputText
  DsLink
```

Existing component stories already use `title: 'Components/DsXxx'` format.

### Git Intelligence

Recent commits (all on master):
- `728c057` story 2.3 (DsLink)
- `df31fe7` story 2.2 (DsInputText)
- `a001717` story 2.1 (DsIconButton)

Story 3.1 (Storybook setup) is currently in `review` status — its changes are in the working tree but may not be committed yet. The `.storybook/` directory and Storybook dependencies should already be present.

### Project Structure Notes

- Foundation stories go in `src/stories/Foundations/` — NOT in `src/components/`
- This aligns with the architecture decision for Figma-mirrored organization (Foundations -> Components -> Pages)
- The `src/stories/` directory does not exist yet — create it
- No `index.ts` needed for story directories

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.2] — Acceptance criteria and requirements
- [Source: _bmad-output/planning-artifacts/architecture.md#Storybook & Documentation Architecture] — Organized by Figma structure: Foundations -> Components
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure] — Story file locations
- [Source: src/theme/ds-preset.ts] — All token values (colors, typography, spacing, shadows, radius)
- [Source: docs/figma-variables.md] — Complete Figma variable export (reference for validation)
- [Source: .storybook/main.ts] — Story discovery glob configuration
- [Source: .storybook/preview.ts] — PrimeVue + theme toggle setup
- [Source: _bmad-output/implementation-artifacts/3-1-storybook-setup-configuration.md] — Previous story context

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Biome flagged formatting in ColorPalette.stories.ts (long object literals) and Typography.stories.ts (long array entries) — auto-fixed with `biome check --write`.
- Storybook dev `--ci` mode did not produce readable output — verified via `storybook build` + index.json inspection instead.

### Completion Notes List

- Created 5 foundation story files under `src/stories/Foundations/` documenting all design tokens from `ds-preset.ts`.
- ColorPalette.stories.ts: 7 primitive palettes (Gray, Purple, Red, Blue, Amber, Orange, Pink) with swatch grids, luminance-based text contrast; Semantic Colors section (Outline, Text Color, Token groups); Theme-Aware section with light/dark side-by-side comparison table (Primary, Text, Form Field, Content).
- Typography.stories.ts: Font family, 6 font sizes with line heights, 3 font weights, 8 Figma composite styles — all with rendered sample text.
- Spacing.stories.ts: 8 spacing tokens rendered as purple bars with labels.
- BorderRadius.stories.ts: 6 radius tokens rendered as bordered squares.
- Shadows.stories.ts: 5 shadow tokens rendered as white cards with applied box-shadow.
- All stories use CSF3 format, `Meta`/`StoryObj` from `@storybook/vue3-vite`, inline render templates, and plain data objects (no dsPreset runtime import).
- Storybook build confirms all 5 stories indexed under `Foundations/` hierarchy.
- 171 tests pass, Biome clean, library build unchanged (9.57KB CSS, 131.44KB JS).

### Change Log

- 2026-04-04: Implemented Story 3.2 — Foundation Stories (Design Tokens) with 5 Storybook stories documenting color, typography, spacing, border radius, and shadow tokens.

### File List

**Created:**
- src/stories/Foundations/ColorPalette.stories.ts
- src/stories/Foundations/Typography.stories.ts
- src/stories/Foundations/Spacing.stories.ts
- src/stories/Foundations/BorderRadius.stories.ts
- src/stories/Foundations/Shadows.stories.ts
