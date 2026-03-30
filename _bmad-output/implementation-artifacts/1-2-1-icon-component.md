# Story 1.2.1: Icon Component

Status: done

## Story

As a developer implementing a Figma design,
I want to use DsIcon to render SVG icons from the design system with configurable size,
so that icons in my application match the Figma Design System consistently across both themes.

## Acceptance Criteria

1. **Given** DsIcon is a custom Vue component (no PrimeVue equivalent), **When** a developer uses `<DsIcon name="search" size="medium" />`, **Then** the icon renders the correct SVG at the size tier dimensions (12px XS, 16px S, 20px M, 24px L).

2. **Given** SVG icon assets are exported from Figma (node `2014:12648` in file `3qP5xnwc6gXhZR3AnFAMFe`), **When** the component library is built, **Then** all icons are available as inline SVGs — no external font files or image requests at runtime.

3. **Given** DsIcon follows semantic HTML and accessibility rules (UX-DR19), **When** the component renders, **Then** decorative icons have `aria-hidden="true"` by default, **And** informational icons accept an `aria-label` prop for accessible naming.

4. **Given** DsIcon inherits text color by default (UX-DR16), **When** no explicit color class is provided, **Then** the icon color matches the surrounding text color via `currentColor`, **And** the color adapts automatically in dark mode.

5. **Given** DsIcon accepts a `class` attribute (standard Vue behavior), **When** a developer uses `<DsIcon name="search" class="text-primary-500" />`, **Then** the class is applied to the wrapper element, overriding the inherited `currentColor` with the Tailwind utility color. No `color` prop exists — color is controlled exclusively via CSS classes.

6. **Given** DsIcon has TypeScript types and a co-located test file, **When** the component is used in TypeScript and tests are run, **Then** all props have type definitions, **And** tests verify rendering at all size tiers, color inheritance, class passthrough, and accessibility attributes.

7. **Given** DsIcon is exported from `src/index.ts`, **When** a consumer imports `{ DsIcon }` from the library, **Then** the import resolves correctly and the component renders.

8. **Given** some icons have variants (e.g., Star outline/filled, Arrow directions, Check states), **When** the developer needs a variant, **Then** variants are accessible via the `name` prop using a consistent naming convention (e.g., `"star-outline"`, `"star-filled"`, `"arrow-left"`, `"arrow-right"`).

## Tasks / Subtasks

- [x] Task 1: Optimize SVG icons and set up icon registry (AC: #2, #8)
  - [x] 1.1 Verify SVG icon assets already present in `src/assets/icons/` (pre-exported from Figma, ~150 files in kebab-case)
  - [x] 1.2 Install `svgo` as a dev dependency: `npm install -D svgo`
  - [x] 1.3 Create `svgo.config.js` at project root with rules: remove width/height, remove hardcoded fills, ensure `currentColor` for fill/stroke, keep viewBox
  - [x] 1.4 Add npm scripts to `package.json`:
    - `"svg-optimize": "svgo -f src/assets/icons --config svgo.config.js"` — optimize all icons
    - `"svg-optimize:one": "svgo src/assets/icons/$npm_config_icon.svg --config svgo.config.js"` — optimize single icon: `npm run svg-optimize:one --icon=search`
  - [x] 1.5 Run `npm run svg-optimize` to batch-optimize all exported SVGs
  - [x] 1.6 Create `src/components/DsIcon/icon-names.ts` — a manually maintained file that exports `type IconName` as a string literal union of all icon names (matching the kebab-case file names in `src/assets/icons/` without the `.svg` extension). This provides full TypeScript autocomplete for consumers. When icons are added or removed, this file must be updated to match.
  - [x] 1.7 Create `src/components/DsIcon/icon-registry.ts` — use Vite's `import.meta.glob` to eagerly import all `.svg` files from `src/assets/icons/` as raw strings (`?raw` suffix). Build a `Record<IconName, string>` map by deriving the key from each file's path (strip directory and `.svg` extension). Import `IconName` from `icon-names.ts`. Export a `getIcon(name: IconName): string | undefined` function and re-export `IconName`.

- [x] Task 2: Implement DsIcon.vue component (AC: #1, #3, #4, #5)
  - [x] 2.1 Create `src/components/DsIcon/DsIcon.vue` using `<script setup lang="ts">`
  - [x] 2.2 Define props interface:
    - `name: IconName` (required) — the icon identifier, typed as a string literal union from `icon-names.ts` (provides full autocomplete)
    - `size: 'xsmall' | 'small' | 'medium' | 'large'` (default: `'medium'`) — maps to pixel dimensions per UX-DR15
    - `ariaLabel: string` (optional) — when provided, makes the icon informational (removes `aria-hidden`)
    - No `color` prop — color is inherited via `currentColor` by default; override with Tailwind class (e.g., `class="text-primary-500"`)
  - [x] 2.3 Render SVG inline (not via `<img>`) — use `v-html` with `getIcon(name)` from the registry to get the SVG markup
  - [x] 2.4 Apply size via computed width/height style or class: xsmall=12px, small=16px, medium=20px, large=24px
  - [x] 2.5 Apply color: default `color: currentColor`; custom colors applied via Tailwind classes on the wrapper element (e.g., `class="text-primary-500"`)
  - [x] 2.6 Accessibility: wrap in `<span>` with `role="img"` + `aria-label` when label provided; `aria-hidden="true"` when decorative

- [x] Task 3: Create barrel export and integrate (AC: #7)
  - [x] 3.1 Create `src/components/DsIcon/index.ts` re-export
  - [x] 3.2 Add `export { DsIcon } from './components/DsIcon'` to `src/index.ts`
  - [x] 3.3 Export `type IconName` from barrel (originates in `icon-names.ts`, re-exported through `icon-registry.ts`) for consumer TypeScript autocomplete

- [x] Task 4: Write tests (AC: #6)
  - [x] 4.1 Create `src/components/DsIcon/DsIcon.test.ts`
  - [x] 4.2 Test: renders SVG content for a valid icon name
  - [x] 4.3 Test: applies correct dimensions for each size tier (xsmall=12, small=16, medium=20, large=24)
  - [x] 4.4 Test: inherits color via currentColor by default (no inline color style)
  - [x] 4.5 Test: accepts class attribute for color override (e.g., `class="text-primary-500"` passes through to wrapper)
  - [x] 4.6 Test: sets `aria-hidden="true"` when no `ariaLabel` provided (decorative)
  - [x] 4.7 Test: sets `role="img"` and `aria-label` when `ariaLabel` prop provided (informational)
  - [x] 4.8 Test: renders nothing or fallback for invalid icon name (graceful degradation — components never throw)

- [x] Task 5: Validate build (AC: #1, #7)
  - [x] 5.1 Run `npm run build` — must complete successfully with DsIcon in dist
  - [x] 5.2 Run `npm run test` — all tests pass
  - [x] 5.3 Run `biome check` — no errors

## Dev Notes

### Icon Inventory from Figma

The Figma "Icon - Level 1" frame (node `2014:12648`) contains ~150 icons. Key categories:

**Standalone icons (single variant):**
Phone, Envelope, Close, Search, Edit, Bin, Note, Notes, Help, Setting, Copy, Download, Share, Upload, Plus, Minus, Refresh, Home, Link, Unlink, Password, Security, Invoice, Switch, Hamburger, Users, Play, Workflow, Lightning, Key, Lock-open, Folder, Globe, Map, Flag, Score, Dot, Pin, Emoji, Call, Agent, Source, Recorder, Microphone, Desktop, Developer, Clock, Clock-fading, Overflow, Activity, Collapse, Company, Path, Domain, Scheduled, Target, Create-lease, Paperwork, Particular, Financial, Business, Facility, Personal, Archived, Format, Phase, Number, Component, Object, Field, Context, Tags, Strudel, Notebook, File, Download-file, Excel, Access-analysis, Sorting, General-loaded, AI-Insights, Location, Tiles, Column, Log-out, Hide, Squares-plus, Squares-cards, Undone, Recommended, Sidebar, Fullscreen, Floating, Plan, Insert-right, Insert-left, Ellipsis-vertical, Distance-comparison, Layout-dashboard, Building, Image, Folder-lock, Logs, Train-front, Utensils-crossed, Mouse-pointer-click, Square-check, Hospital, Shopping-cart, Fuel, Parks, Attractions, Schools, Circle, Container, Truck, Package, Boxes, Brain, Trending-up, Trending-down, Eye-off, Circle-plus, Heading-1, Heading-2, Text-align-start, Text-align-end, Text-align-center, Palette, Image-plus, Crop, Sun, Moon, Task, Reject, Swap, Chat-ai, Regenerated, Headers, Table-2, Horizontal-bars, Chart-bar-stacked, Horizontal-chart-bar-stacked, Line, Stacked-line, Pie, Donut, Column (chart), Bold, Italic, Underline, Strikethrough, Type, Move-to, New-project, Remove-folder, Collapse-box, Expand-box, Ruler, Reference, Disconnect, Associate, Plug-integration, Open-sidebar, Collapse-sidebar, Success, Stopper, Error, Paperplane, Manually, Open-parient-in-app, External-link, New-chat, Customer-support, Related-arrow-right, Updated, Full-arrow-right, Full-arrow-left, Full-arrow-up, Full-arrow-down

**Icons with directional/state variants:**
- **Arrow:** Left, Right, Up, Down
- **Star:** outline, filled
- **Tag:** default, add-bookmark, bookmarked
- **Thumbs-up:** outline, filled
- **Thumbs-down:** outline, filled
- **Check (checkbox):** empty, empty-hover, outline, filled, in-progress
- **Info:** outline, outline-hover, outline-selected, filled, filled-hover
- **Help (circle):** outline, filled, filled-selected
- **Exit:** regular, bg, after-clicking
- **Expand/Minimize:** expand, minimize
- **Revert:** undo, redo
- **Calendar:** default, overdue
- **Error (alert):** default, with-alert
- **Global notifications:** regular, with-alert
- **Navigation arrows:** left/right with regular/hover/disable states
- **More details:** default, hover
- **bg-plus:** default, hover
- **Filter-B:** default, hide-filter, filter-on, hover

### Naming Convention for Icon Names

Normalize all icon names to **kebab-case**:
- `"search"`, `"arrow-left"`, `"star-filled"`, `"star-outline"`
- Variant icons: `"{base}-{variant}"` — e.g., `"check-filled"`, `"check-outline"`, `"thumbs-up-filled"`, `"thumbs-up-outline"`
- Directional: `"{base}-{direction}"` — e.g., `"arrow-left"`, `"full-arrow-right"`

### Architecture: SVG Files as Assets + Glob Import

**Why inline SVGs (not icon font or `<img>`):**
- `currentColor` inheritance works for automatic dark mode adaptation
- No external HTTP requests or font loading delays
- Better accessibility — SVG content is DOM-accessible

**Why SVG files as assets (not inlined strings in TS):**
- SVGs remain standalone files — easy to add/remove/update icons without touching code
- Figma export drops files directly into the `icons/` folder — zero manual wiring
- Better diffing in git — SVG changes are isolated per file
- Vite handles the bundling — SVGs are inlined into the JS bundle at build time via `?raw`

**Implementation approach — explicit icon names + glob registry:**

```ts
// src/components/DsIcon/icon-names.ts
// Manually maintained list — provides full TypeScript autocomplete for consumers
// Each name must match a .svg file in src/assets/icons/ (without extension)
export type IconName =
  | 'search'
  | 'arrow-left'
  | 'arrow-right'
  | 'star-filled'
  | 'star-outline'
  // ... all ~150 icon names
  ;
```

```ts
// src/components/DsIcon/icon-registry.ts
import type { IconName } from './icon-names';

// Vite glob import: eagerly imports all .svg files as raw strings at build time
const svgModules = import.meta.glob('../../assets/icons/*.svg', { eager: true, query: '?raw', import: 'default' });

// Build the registry map dynamically from file paths
const icons = {} as Record<IconName, string>;
for (const [path, svg] of Object.entries(svgModules)) {
  const name = path.split('/').pop()!.replace('.svg', '') as IconName;
  icons[name] = svg as string;
}

export function getIcon(name: IconName): string | undefined {
  return icons[name];
}

export { icons };
export type { IconName };
```

The component uses `v-html` to render SVG content inside a wrapper `<span>`. This is safe because SVG content comes from static asset files bundled at build time (not user input). The `icons` record is internal to the registry — not exported to consumers (only `DsIcon` component and `IconName` type are public API).

**Key design decisions:**
- **`icon-names.ts` is the explicit source of truth for TypeScript types** — provides full autocomplete and compile-time safety for consumers. Each name must correspond to a `.svg` file in `src/assets/icons/`.
- `icon-registry.ts` builds the SVG map dynamically from the folder via Vite glob import — runtime loading is still automatic
- When icons are added or removed, `icon-names.ts` must be updated to match the folder contents
- `getIcon()` returns `undefined` for unknown names — component handles gracefully

### SVG Optimization Rules

When processing exported Figma SVGs:
1. Keep `viewBox="0 0 24 24"` — all icons are 24x24 in Figma
2. Remove hardcoded `width` and `height` attributes (component controls sizing)
3. Replace all `fill`/`stroke` colors with `currentColor` (enables color inheritance). All icons are single-color by design; multi-color variants can be achieved by consumers via CSS classes on child SVG elements if needed in the future.
4. Remove Figma-specific metadata (`data-*`, `id` attributes unless needed for clip paths)
5. Consider using `svgo` for automated optimization

### Size Token Table (from UX-DR15)

| Size Prop | Icon Dimensions | Use Case |
|-----------|----------------|----------|
| `xsmall` | 12x12 px | Inline with 12px text, XS buttons |
| `small` | 16x16 px | Inline with 14px text, S buttons |
| `medium` | 20x20 px | Standard use, M buttons |
| `large` | 24x24 px | L buttons |

### Color Behavior (from UX-DR16)

- **Default:** `color: currentColor` — inherits from parent text color. In dark mode, parent text color changes via design tokens, so icon color adapts automatically.
- **Custom color:** No `color` prop. Pass a Tailwind utility class instead: `<DsIcon name="search" class="text-primary-500" />`. This keeps the component simple and leverages the existing Tailwind color system without inventing a custom mapping layer.

### Accessibility Requirements (from UX-DR19, NFR4-5)

- Use `<span>` wrapper (not `<div>`) — inline element appropriate for icon context
- Decorative icons (default): `aria-hidden="true"` — screen readers skip them
- Informational icons (when `ariaLabel` provided): `role="img"` + `aria-label="..."` — screen readers announce them
- Never use `<div>` with click handler for interactive icons — that's DsIconButton's responsibility
- Focus management is NOT needed on DsIcon itself (it's not interactive)

### Anti-Patterns to Avoid

- Do NOT use an icon font (FontAwesome, Material Icons, etc.) — these are custom Figma icons
- Do NOT use `<img src="icon.svg">` — prevents `currentColor` inheritance and dark mode adaptation
- Do NOT hardcode hex colors in SVGs — all fills/strokes must use `currentColor`
- Do NOT create a PrimeVue wrapper — there is no PrimeVue icon component to wrap; DsIcon is fully custom
- Do NOT add click handlers to DsIcon — interactive icon usage is DsIconButton's responsibility
- Do NOT import from a CDN — all icons must be bundled in the library
- Do NOT skip `aria-hidden` on decorative icons — accessibility is a requirement (NFR4-8)
- Do NOT inline SVG content as strings in TypeScript files — SVGs must be separate `.svg` asset files in the `icons/` folder, imported via Vite's `import.meta.glob` with `?raw`
- Do NOT manually map each icon name to its SVG content in the registry — the SVG map is built dynamically from the folder via glob import
- Do NOT skip updating `icon-names.ts` when adding or removing icons — the type union must stay in sync with the `src/assets/icons/` folder

### Project Structure After This Story

```
svgo.config.js                  # SVGO optimization config
src/
├── components/
│   └── DsIcon/
│       ├── DsIcon.vue          # Component implementation
│       ├── DsIcon.test.ts      # Vitest tests
│       ├── icon-names.ts       # Manually maintained IconName string literal union type
│       ├── icon-registry.ts    # Vite glob import → builds name→SVG map, re-exports IconName
│       └── index.ts            # Re-export DsIcon + IconName type
├── assets/
│   └── icons/                  # SVG icon assets
│       ├── search.svg
│       ├── arrow-left.svg
│       └── ... (~150 files)
├── theme/
│   ├── ds-preset.ts
│   ├── ds-preset.test.ts
│   └── index.ts
└── index.ts                    # MODIFIED — adds DsIcon + IconName export
```

### Previous Story Intelligence (Story 1.2)

- `definePreset()` with Aura base is in `src/theme/ds-preset.ts` — all design tokens are available as CSS custom properties
- `palette()` utility from `@primeuix/themes` is NOT available in v2.0.3 — do not attempt to use it
- Biome uses semicolons, single quotes, 2-space indent, 100 line width
- `tsconfig.build.json` excludes `*.stories.ts` and `*.test.ts` from declarations
- Vitest uses `jsdom` environment
- Build output is ESM format via Vite library mode
- All exports go through `src/index.ts` barrel

### Git Intelligence

Recent commits show a pattern of one story per commit with descriptive messages:
- `story 1.2` — Design Token Preset implementation
- `story 1.1` — Project Scaffold

### References

- [Source: Figma Design-Systems file, node 2014:12648] — Complete icon inventory (~150 icons at 24x24)
- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.1] — Original DsIcon epic story (moved to 1.2.1)
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Architecture] — Custom Tailwind component pattern
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns] — Co-located file structure, naming conventions
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Icon Usage Patterns] — UX-DR15, UX-DR16 icon sizing and color rules
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Accessibility] — UX-DR19 custom component a11y requirements

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- SVGO v4 changed `removeViewBox` override API — preset-default no longer includes it, so no override needed. Warning was cosmetic, optimization worked correctly.
- Biome required import sorting (type imports before value imports) and optional chaining instead of non-null assertion.

### Completion Notes List

- Verified 236 SVG icon assets in `src/assets/icons/` (kebab-case naming convention)
- Installed `svgo@4.0.1` and created optimization config — removes dimensions, converts hardcoded colors to `currentColor`, preserves viewBox
- Added `svg-optimize` and `svg-optimize:one` npm scripts for batch and single-icon optimization
- Ran batch optimization on all 236 SVGs — removed width/height, replaced `#314158` with `currentColor`
- Created `icon-names.ts` with 236-member `IconName` string literal union type for full TypeScript autocomplete
- Created `icon-registry.ts` using Vite `import.meta.glob` with `?raw` to build SVG map at build time
- Implemented `DsIcon.vue` with `name`, `size` (xsmall/small/medium/large), and `ariaLabel` props
- Component renders inline SVG via `v-html` in a `<span>` wrapper with `currentColor` inheritance
- Size tiers: xsmall=12px, small=16px, medium=20px (default), large=24px
- Accessibility: decorative icons get `aria-hidden="true"`, informational icons get `role="img"` + `aria-label`
- Color controlled exclusively via CSS classes (no `color` prop) — `currentColor` default adapts to dark mode
- Graceful degradation: renders nothing for invalid icon names
- Created barrel exports in `src/components/DsIcon/index.ts` and updated `src/index.ts`
- 9 unit tests covering all acceptance criteria: rendering, sizing, color, class passthrough, accessibility, graceful degradation
- All 21 tests pass (12 existing + 9 new), build succeeds, biome check clean

### Change Log

- 2026-03-30: Story 1.2.1 implemented — DsIcon component with SVG optimization, icon registry, tests, and barrel exports

### File List

- svgo.config.js (new)
- package.json (modified — added svgo dep, svg-optimize scripts)
- src/assets/icons/*.svg (modified — 236 files optimized via svgo)
- src/components/DsIcon/icon-names.ts (new)
- src/components/DsIcon/icon-registry.ts (new)
- src/components/DsIcon/DsIcon.vue (new)
- src/components/DsIcon/DsIcon.test.ts (new)
- src/components/DsIcon/index.ts (new)
- src/index.ts (modified — added DsIcon + IconName exports)
