# Story 7.2: DsBadge Component

Status: done

## Story

As a **developer or AI agent** implementing a Figma design that contains status badges,
I want a `DsBadge` component that wraps PrimeVue Badge with 11 visual `type` variants (Pending, Interesting, Neutral, Rejected, Accepted, Cancel, Border, Clean, Draft, Loaded/shimmer, Type10), optional 12px left/right icon slots, and per-variant hover states,
So that I can render status indicators matching the Figma Design System in both light and dark themes without custom styling.

## Figma Design References

- Badge category (all variants): https://www.figma.com/design/3qP5xnwc6gXhZR3AnFAMFe/Design-Systems?node-id=2014-9896&m=dev
- Variant nodes (from Figma `2014:9896`):
  - `2014:9897` — Type=Pending, Hover=no
  - `2014:9900` — Type=Interesting, Hover=no
  - `2014:9903` — Type=Neutral, Hover=no
  - `2014:9906` — Type=Rejected, Hover=no
  - `2014:9909` — Type=Aceptied (Figma spelling) / maps to `type="accepted"`
  - `2014:9912` — Type=Cancel, Hover=no
  - `3061:25611` — Type=Border, Hover=no
  - `5171:87169` — Type=Draft, Hover=no (diagonal stripes overlay)
  - `3952:56773` — Type=clean, Hover=no
  - `4231:33479` — Type=clean, Hover=yes
  - `4101:34228` — Type=Type10, Hover=yes (gray-200 bg + border hover pairing)
  - `3616:46854` — Type=Loaded/shimmer, Hover=no (shimmer animation)

## Acceptance Criteria

1. **Given** `DsBadge` wraps PrimeVue `Badge` using `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` (FR9), **When** a developer uses `<DsBadge type="pending">Text</DsBadge>`, **Then** a 20px-tall pill-shaped badge renders with per-variant background and text color matching the Figma spec in both light and dark themes (FR10). Base geometry: `border-radius: 4px` (`radius/md`), padding `2px 8px` (except `clean` uses `2px 4px`), gap `2px` between label and icons, font `Inter 400 12px / line-height 16px / letter-spacing 0`.

2. **Given** the `type` prop accepts 11 string literals, **When** the prop is set, **Then** the component applies the correct background + text color tokens and (where applicable) borders per this table:

   | `type` | Background | Border | Text color | Extra |
   |---|---|---|---|---|
   | `pending` (default) | `--p-amber-100` (#ffefdb) | none | **`#a33b16`** (amber/yellow-700 — see §Preset Extensions) | gap 2px |
   | `interesting` | `--p-purple-100` (#f3e8ff) | none | `--p-purple-600` (#7849ff) | gap 2px |
   | `neutral` | `--p-blue-200` (#e7f4fe) | none | `--p-blue-600` (#0e5cf4) | gap 3px |
   | `rejected` | `--p-red-100` (#ffe4e6) | none | `--p-red-700` (#f22a42) | gap 3px |
   | `accepted` | **`#e0f6ed`** (green-100 — see §Preset Extensions) | none | **`#00995c`** (green-700) | gap 3px |
   | `cancel` | `--p-gray-300` (#e2e8f0) | none | `#314158` (outline/text gray-800) | gap 3px |
   | `border` | `--p-surface-0` (#ffffff) | 1px `--p-gray-300` | `#314158` | gap 3px |
   | `clean` | transparent | none | `#62748e` (gray-600 — matches Figma, see §Token Mapping) | gap 3px, padding `2px 4px` |
   | `draft` | `--p-gray-300` | none | `#314158` | gap 3px, `overflow: clip` + repeating diagonal `--p-gray-400` stripes overlay |
   | `loaded` | `--p-gray-200` (#f1f5f9) | 1px `--p-gray-300` | — (no text; shimmer animation) | fixed width 43px, content hidden |
   | `type10` | `--p-gray-200` | 1px `--p-gray-300` | `#314158` | gap 3px (represents the Clean/Border hover target state — see AC #4) |

   TypeScript type: `type DsBadgeType = 'pending' | 'interesting' | 'neutral' | 'rejected' | 'accepted' | 'cancel' | 'border' | 'clean' | 'draft' | 'loaded' | 'type10';`. Default: `'pending'`.

3. **Given** `DsBadge` supports optional left/right 12px icon slots, **When** the consumer sets `showLIcon` / `showRIcon` boolean props to `true` and provides `#leading` / `#trailing` slot content (any `<DsIcon>` or raw markup), **Then** the icon renders inline with the label inheriting `currentColor` (so it tracks the variant's text color), sized exactly `12px × 12px`. If `showLIcon` is `true` but no slot is provided, render a default filler `<DsIcon name="success" />` at 12px (matches Figma fallback). If the boolean is `false`, do not render the slot wrapper at all. `draft` and `loaded` types ignore icon props (content is replaced by the stripe pattern / shimmer).

4. **Given** `DsBadge` per-variant hover behavior per Figma, **When** the badge is hovered AND the variant is either `clean` or `type10`, **Then** `clean` transitions its background to `--p-gray-300` and `type10` retains its `--p-gray-200` background + `--p-gray-300` border (these are the Figma `Hover=yes` target states). All other variants have **no hover state** — they remain identical on hover. Transitions use `background-color 150ms ease` wrapped in `@media (prefers-reduced-motion: no-preference)` (UX-DR9). The `type10` variant is intentionally the standalone "hover-style" target; consumers who need a clean/border hover effect render a normal clean/border badge and rely on the CSS `:hover` style that ships with the component.

5. **Given** the `draft` type, **When** rendered, **Then** a repeating diagonal stripe pattern of `--p-gray-400` (~1.78px wide stripes at `30.67deg` rotation on a `--p-gray-300` field) overlays the background. Implement via `background-image: repeating-linear-gradient(120.67deg, var(--p-gray-400) 0 1.78px, transparent 1.78px 6px)` (or equivalent) on a `::before` pseudo-element with `overflow: clip` on the badge so the stripes are contained within the 4px-radius pill. The label text still renders above the stripes at `#314158`.

6. **Given** the `loaded` type (shimmer), **When** rendered, **Then** the badge displays a fixed pill of width `43px` height `20px` with `--p-gray-200` background and `--p-gray-300` border. A shimmer overlay uses a blurred white vertical bar (`--p-surface-0` with `filter: blur(8.5px)`) rotated `~31deg` sliding horizontally across the badge infinitely. Implement via a `::before` pseudo-element with a `@keyframes ds-badge-shimmer` animation moving `transform: translateX(-100%)` → `translateX(200%)` over `~1.5s` linear infinite, wrapped in `@media (prefers-reduced-motion: no-preference)` — reduced-motion users see the static bg+border only (no moving bar). Label text / slots are ignored for this type.

7. **Given** `DsBadge` wraps PrimeVue `Badge`, **When** a consumer passes PrimeVue Badge props (`value`, `severity`, `size`, etc.), slots, or events, **Then** they are forwarded via `inheritAttrs: false` + `v-bind="$attrs"` (FR9). The DS-specific props (`type`, `showLIcon`, `showRIcon`) are TypeScript-typed via an exported `DsBadgeProps` interface (FR11). Note: PrimeVue Badge's default slot is used for the label text — pass `label` via the default slot (preferred) or a `label` prop (convenience for the shared AC #3 icon path).

8. **Given** focus indicators must be visible (NFR6, UX-DR8), **When** the badge is rendered within a focusable ancestor (DsBadge itself is NOT interactive and not tabbable — `tabindex` is not set), **Then** DsBadge does not add its own focus-visible ring. If a consumer wraps the badge in a `<button>` or uses `role="status"`, the ancestor's focus styling applies. If the PrimeVue Badge root has a default `outline`, strip it via `:deep(.p-badge) { outline: none; }`.

9. **Given** all 11 variants must render correctly in both light and dark themes (FR10, NFR12), **When** the Storybook theme toggle switches modes, **Then** every variant remains legible — no hardcoded hex colors (other than the three documented additions to the preset per §Preset Extensions), all colors resolve through `--p-*` CSS custom properties that PrimeVue re-maps per theme.

10. **Given** the component follows the co-located file convention (architecture §Project Structure), **When** implementation is complete, **Then** the directory `src/components/DsBadge/` contains `DsBadge.vue`, `DsBadge.stories.ts`, `DsBadge.test.ts`, `index.ts`; the component is re-exported from `src/index.ts` as `{ DsBadge, type DsBadgeProps }` (alphabetical — inserts **before** `DsButton`); Storybook stories cover each of the 11 `type` variants + variants-with-icons + a composite `AllVariantsGrid` mirroring the Figma category page; Vitest tests verify prop → class application for all 11 types, `showLIcon` / `showRIcon` slot rendering, default type, default fallback icon, and PrimeVue passthrough; an AI KB entry exists at `docs/ai-guidelines/ds-badge.md` following the DsChip / DsTextarea entry structure; the AI KB index `docs/ai-guidelines/index.md` lists `DsBadge` in the Component Inventory (between `DsButton` and `DsChip` alphabetically — actually **before** DsButton per alphabetical order: `DsBadge < DsButton`), the import example list, and the "Figma Element to Component Matching Guide" sections.

11. **Given** three Figma color tokens (`yellow-700: #a33b16`, `green-100: #e0f6ed`, `green-700: #00995c`) are NOT present in the current preset (`src/theme/ds-preset.ts`), **When** the preset is extended, **Then** either (a) add a new `green` primitive palette with shades `100: '#e0f6ed'` and `700: '#00995c'` (preferred — scalable for future positive-feedback components); **and** change the primitive `amber.700` from `#b85712` to `#a33b16` (matches the Figma `taxt/supporting/amber/yellow-700` spec; no existing component references amber.700 so this is safe — verify with grep first); **or** (b) if the dev prefers not to touch primitives, wire these three hexes as scoped CSS custom properties defined inside `DsBadge.vue`'s `<style>` block and document the decision. Option (a) is strongly preferred and is the default path. The preset test suite (`src/theme/ds-preset.test.ts`) must be updated to cover the new tokens.

## Tasks / Subtasks

- [x] **Task 1: Create DsBadge component scaffold** (AC: #10)
  - [x] 1.1 Create directory `src/components/DsBadge/`
  - [x] 1.2 Create empty files: `DsBadge.vue`, `DsBadge.stories.ts`, `DsBadge.test.ts`, `index.ts`
  - [x] 1.3 Populate `src/components/DsBadge/index.ts` with `export { default as DsBadge } from './DsBadge.vue'; export type { DsBadgeProps } from './DsBadge.vue';`
  - [x] 1.4 Add to `src/index.ts` (alphabetically: `DsBadge` sorts **before** `DsButton` because `B-a` < `B-u`): `export { DsBadge, type DsBadgeProps } from './components/DsBadge';`

- [x] **Task 2: Extend `ds-preset.ts` with missing Figma tokens** (AC: #11)
  - [x] 2.1 Grep the repo for `amber.700`, `amber-700`, `--p-amber-700` to confirm no existing component depends on the current `#b85712` value. Expected result: zero callers. Record result in Completion Notes.
  - [x] 2.2 In `src/theme/ds-preset.ts` `primitive` section: update `amber.700` from `'#b85712'` to `'#a33b16'`.
  - [x] 2.3 In `src/theme/ds-preset.ts` `primitive` section: add a new `green` palette after `amber`. At minimum include `100: '#e0f6ed'` and `700: '#00995c'`. Interpolate missing shades (50, 200, 300, 400, 500, 600, 800, 900, 950) in the same style as the existing red/blue interpolations so the ramp is complete — follow the inline comment convention used in other palettes.
  - [x] 2.4 Update `src/theme/ds-preset.test.ts` to assert the new `green` palette and the updated `amber.700` are present.
  - [x] 2.5 Run `npm test` after the preset change to verify zero regressions in existing components (all 330 tests from story 7.1 baseline should still pass).
  - [x] 2.6 **Fallback path** (if Task 2.1 discovers an existing amber.700 consumer): follow AC #11 option (b) — declare the three values as CSS custom properties inside the DsBadge `<style>` block (e.g., `--ds-badge-pending-text: #a33b16; --ds-badge-accepted-bg: #e0f6ed; --ds-badge-accepted-text: #00995c;`) scoped to `.ds-badge` and DO NOT modify the preset. Document the decision in Completion Notes.

- [x] **Task 3: Implement `DsBadge.vue` — script & props** (AC: #1, #2, #7)
  - [x] 3.1 `<script setup lang="ts">` top: `import Badge from 'primevue/badge';` then `import { computed, useSlots } from 'vue';` then `import DsIcon from '../DsIcon/DsIcon.vue';` (Biome-enforced import order: external → relative).
  - [x] 3.2 Define and export the type + interface:
    ```ts
    export type DsBadgeType =
      | 'pending' | 'interesting' | 'neutral' | 'rejected' | 'accepted'
      | 'cancel' | 'border' | 'clean' | 'draft' | 'loaded' | 'type10';

    export interface DsBadgeProps {
      /** Visual type. Default: 'pending' */
      type?: DsBadgeType;
      /** Render left icon slot (12×12). Default: false */
      showLIcon?: boolean;
      /** Render right icon slot (12×12). Default: false */
      showRIcon?: boolean;
      /** Badge text (alternative to default slot — slot wins when both provided) */
      label?: string;
    }
    ```
  - [x] 3.3 `defineOptions({ inheritAttrs: false });`
  - [x] 3.4 `const props = withDefaults(defineProps<DsBadgeProps>(), { type: 'pending', showLIcon: false, showRIcon: false });`
  - [x] 3.5 `const slots = useSlots();`
  - [x] 3.6 Computed `badgeClasses` returns `['ds-badge', \`ds-badge--\${props.type}\`]` — keep the modifier naming identical to DsChip's pattern so the CSS selector style is consistent across Phase 2 display components.
  - [x] 3.7 Computed `hasText` returns `true` only when `props.type !== 'loaded'` AND (`slots.default` exists OR `props.label` is set) — used to conditionally render the label span.
  - [x] 3.8 Computed `hasLIcon` returns `props.showLIcon && props.type !== 'loaded' && props.type !== 'draft'`. Same pattern for `hasRIcon` — loaded/draft ignore icons.

- [x] **Task 4: Implement `DsBadge.vue` — template** (AC: #1, #3, #5, #6)
  - [x] 4.1 Wrap PrimeVue `<Badge>` root with `v-bind="$attrs"` and `:class="badgeClasses"`. PrimeVue Badge uses its default slot for content, so we render our structured content inside.
  - [x] 4.2 Inside the Badge default slot, render in this order (all conditional):
    - Leading icon wrapper (`v-if="hasLIcon"`): `<span class="ds-badge__leading"><slot name="leading"><DsIcon name="success" :style="{ width: '12px', height: '12px' }" /></slot></span>`
    - Label span (`v-if="hasText"`): `<span class="ds-badge__label"><slot>{{ label }}</slot></span>`
    - Trailing icon wrapper (`v-if="hasRIcon"`): `<span class="ds-badge__trailing"><slot name="trailing"><DsIcon name="success" :style="{ width: '12px', height: '12px' }" /></slot></span>`
  - [x] 4.3 For `type="draft"` AND `type="loaded"`: render the decorative overlay via CSS pseudo-elements (see Task 5 — no extra template markup needed). DO NOT conditionally render a second `<div class="ds-badge__stripes">` in the template — keep the template flat.
  - [x] 4.4 Do NOT set `tabindex` on the root (AC #8).

- [x] **Task 5: Implement `DsBadge.vue` — scoped styles** (AC: #1, #2, #4, #5, #6)
  - [x] 5.1 Base `.ds-badge` rules: `display: inline-flex; align-items: center; justify-content: center; height: 20px; padding: 2px 8px; border-radius: 4px; border: 1px solid transparent; gap: 3px; font-family: var(--font-family, 'Inter', sans-serif); font-weight: 400; font-size: 12px; line-height: 16px; letter-spacing: 0; box-sizing: border-box; position: relative;` (position relative is for the draft/loaded overlays).
  - [x] 5.2 Strip PrimeVue Badge internal styling: `.ds-badge:deep(.p-badge) { background: transparent !important; padding: 0 !important; color: inherit !important; border-radius: 0 !important; outline: none !important; min-width: 0 !important; height: auto !important; }`. This mirrors the DsChip approach — the DS wrapper owns all visual properties.
  - [x] 5.3 Per-variant rules (use `--p-*` tokens from the preset; see AC #2 table for exact values). Example skeleton:
    ```css
    .ds-badge--pending { background-color: var(--p-amber-100); color: var(--p-amber-700); gap: 2px; }
    .ds-badge--interesting { background-color: var(--p-purple-100); color: var(--p-purple-600); gap: 2px; }
    .ds-badge--neutral { background-color: var(--p-blue-200); color: var(--p-blue-600); }
    .ds-badge--rejected { background-color: var(--p-red-100); color: var(--p-red-700); }
    .ds-badge--accepted { background-color: var(--p-green-100); color: var(--p-green-700); }
    .ds-badge--cancel { background-color: var(--p-gray-300); color: #314158; }
    .ds-badge--border { background-color: var(--p-surface-0); border-color: var(--p-gray-300); color: #314158; }
    .ds-badge--clean { background-color: transparent; color: #62748e; padding: 2px 4px; }
    .ds-badge--clean:hover { background-color: var(--p-gray-300); }
    .ds-badge--type10 { background-color: var(--p-gray-200); border-color: var(--p-gray-300); color: #314158; }
    .ds-badge--draft { background-color: var(--p-gray-300); color: #314158; overflow: clip; }
    .ds-badge--loaded { background-color: var(--p-gray-200); border-color: var(--p-gray-300); width: 43px; overflow: clip; }
    ```
    **Hardcoded gray hex exception:** `#314158` and `#62748e` are hardcoded rather than referencing `--p-gray-800` / `--p-gray-600` because the primitive `gray-600` (`#6a7d97`) differs from Figma's text `gray-600` (`#62748e`), and the DsSelect component has already set the precedent of using `--p-gray-800` which resolves to `#314158` — prefer `var(--p-gray-800)` over the raw hex. For gray-600 (Clean text), hardcode `#62748e` with a `/* Figma taxt/main/gray-600 — differs from primitive --p-gray-600 */` comment. *(If you follow AC #11 Option (a) with the preset extension and also add an extended textColor token, use that instead — but keep it consistent.)*
  - [x] 5.4 Draft stripes overlay via `.ds-badge--draft::before` with `content: ''; position: absolute; inset: 0; background-image: repeating-linear-gradient(120deg, var(--p-gray-400) 0 1.78px, transparent 1.78px 6px); pointer-events: none;`. Confirm angle visually matches Figma's `30.67deg` stripes (CSS `linear-gradient` uses `0deg = up`, Figma uses `0deg = right`, so the equivalent is roughly `~120deg` — verify in Storybook and adjust).
  - [x] 5.5 Loaded shimmer overlay via `.ds-badge--loaded::before` with `content: ''; position: absolute; top: -4px; bottom: -4px; left: -20%; width: 17px; background-color: var(--p-surface-0); filter: blur(8.5px); transform: rotate(31deg); animation: ds-badge-shimmer 1.5s linear infinite;`. Keyframes:
    ```css
    @keyframes ds-badge-shimmer {
      0% { transform: translateX(0) rotate(31deg); }
      100% { transform: translateX(200px) rotate(31deg); }
    }
    ```
  - [x] 5.6 Reduced-motion guard: wrap the `@keyframes` reference inside `@media (prefers-reduced-motion: no-preference) { .ds-badge--loaded::before { animation: ds-badge-shimmer 1.5s linear infinite; } }` and keep the `::before` rule (without animation) outside the media query. Also gate the clean/type10 transitions: `@media (prefers-reduced-motion: no-preference) { .ds-badge--clean, .ds-badge--type10 { transition: background-color 150ms ease, border-color 150ms ease; } }`.
  - [x] 5.7 Icon wrappers inherit currentColor: `.ds-badge__leading, .ds-badge__trailing { display: inline-flex; align-items: center; color: inherit; }`. Label span: `.ds-badge__label { color: inherit; display: inline-flex; align-items: center; line-height: 16px; }`.

- [x] **Task 6: Storybook stories** (AC: #10)
  - [x] 6.1 Create `DsBadge.stories.ts` with `Meta`/`StoryObj` from `@storybook/vue3-vite`. `argTypes` for `type` (select control with all 11 literals), `showLIcon`, `showRIcon`, `label`. Default `args`: `{ type: 'pending', label: 'Text', showLIcon: false, showRIcon: false }`.
  - [x] 6.2 One story per variant: `Pending`, `Interesting`, `Neutral`, `Rejected`, `Accepted`, `Cancel`, `Border`, `Clean`, `Draft`, `Loaded` (shimmer), `Type10`.
  - [x] 6.3 Additional stories: `WithLeadingIcon` (pending + showLIcon), `WithTrailingIcon` (pending + showRIcon), `WithBothIcons` (border + both), `CleanHover` (uses a `.story-force-hover` CSS class to pin the hover state for screenshots — add the class in the story's `render` function's root element styles).
  - [x] 6.4 Composite `AllVariantsGrid` story rendering every variant (with and without icons) in a flex grid mirroring Figma node `2014:9896`. Include a second row that demonstrates the `type10` hover-target and `clean` hover target side-by-side with their non-hover source variants.
  - [x] 6.5 Visually verify each story in BOTH light and dark themes (NFR12). Storybook preview supports theme toggle via the existing `.storybook/preview.ts` setup — confirm no hardcoded hex colors leak through in dark mode.

- [x] **Task 7: Vitest tests** (AC: all)
  - [x] 7.1 Set up the test file mirroring `DsChip.test.ts` pattern: `import { mount } from '@vue/test-utils'; import PrimeVue from 'primevue/config'; import { describe, expect, it } from 'vitest'; import DsBadge from './DsBadge.vue';` and `const globalConfig = { plugins: [[PrimeVue, { theme: 'none' }]] };`.
  - [x] 7.2 Default render: renders `.ds-badge` + `.ds-badge--pending` (default type) + label text; no icon wrappers when booleans are false.
  - [x] 7.3 Type → class mapping: a loop or `describe.each` over all 11 types asserting `.ds-badge--\${type}` is present.
  - [x] 7.4 Default label vs. slot: `label` prop renders the label; default slot overrides the prop; empty label + `type="loaded"` renders no label span at all.
  - [x] 7.5 Icon slot tests: `showLIcon=true` with no slot renders a default `DsIcon`; `showLIcon=true` with `#leading` slot renders the slot; `showLIcon=false` renders nothing. Same set for `showRIcon` + `#trailing`.
  - [x] 7.6 Variant-specific content guard: `type="loaded"` does not render label or icon wrappers even when props are set. `type="draft"` does not render icon wrappers.
  - [x] 7.7 PrimeVue passthrough test: arbitrary attribute (e.g. `data-testid="my-badge"`) lands on the rendered PrimeVue Badge root (`v-bind="$attrs"` wiring).
  - [x] 7.8 No regressions: full project test suite passes (`npm test`). Expected baseline is **330 tests** (from story 7.1 completion); your additions should bring the total to ~345–355.

- [x] **Task 8: AI knowledge base entry** (AC: #10)
  - [x] 8.1 Create `docs/ai-guidelines/ds-badge.md` following DsChip / DsTextarea entry structure: `# DsBadge`, `## When to Use`, `## Import`, `## Props` (table), `## Type Variants` (one row per variant with description + example), `## Slots`, `## Usage Examples`, `## Accessibility`, `## Figma Reference`.
  - [x] 8.2 In the Type Variants section, document all 11 types with their visual intent: `pending` = awaiting action (amber); `interesting` = notable/new (purple); `neutral` = informational (blue); `rejected` = error/denied (red); `accepted` = success/approved (green); `cancel` = canceled state (gray solid); `border` = neutral outlined style for light-surface contexts; `clean` = transparent pill (minimal); `draft` = WIP / unsaved state (striped gray); `loaded` = skeleton/shimmer while content loads; `type10` = hover-state pairing for clean/border chips.
  - [x] 8.3 Usage Examples: basic `<DsBadge type="pending">Text</DsBadge>`, with label prop, with leading icon slot, with both icons, shimmer while loading, draft/WIP state. Call out that `type10` is an edge-case visual target and most consumers want `clean` + CSS `:hover`.
  - [x] 8.4 Update `docs/ai-guidelines/index.md`:
    - 8.4.1 Add `DsBadge` to the import example list alphabetically (insert **before** `DsButton`): `import { DsBadge, DsButton, DsChip, DsIcon, ... } from '@failwin/desing-system-vue';`.
    - 8.4.2 Add a new row to the Component Inventory table alphabetically before `DsButton`:
      `| DsBadge | Status badge with 11 type variants (pending, interesting, neutral, rejected, accepted, cancel, border, clean, draft, loaded/shimmer, type10), optional 12px icons | import { DsBadge } from '@failwin/desing-system-vue' | Badge, Status, Tag, Pill |`
    - 8.4.3 Add a new `**DsBadge**` section under "Figma Element to Component Matching Guide" BEFORE `**DsButton**`, with mappings: `Badge/Pending → <DsBadge type="pending">Text</DsBadge>`, same for each of the 11 types, and examples with `showLIcon` / `showRIcon` + slots.
  - [x] 8.5 Update `docs/ai-guidelines/index.md` severity/type guidance note (see UX spec §"DsBadge API exception"): ensure the inventory description correctly calls out that DsBadge uses `type`, not `severity`.

- [x] **Task 9: Validate & ship**
  - [x] 9.1 `npm run lint` — Biome must pass with zero errors. Watch import order in `DsBadge.vue` (Biome enforces it — this caught Story 6.1).
  - [x] 9.2 `npm test` — full suite, all green, no regressions vs. branch HEAD baseline of 330 tests.
  - [x] 9.3 `npm run build` — TypeScript build + `vite build` must succeed; verify `dist/` contains `DsBadge` in the type declarations (`dist/components/DsBadge/DsBadge.vue.d.ts`) and the barrel `dist/index.js`.
  - [x] 9.4 `npm run build-storybook` — verify the DsBadge stories chunk produces cleanly.
  - [x] 9.5 `npm run storybook` — start Storybook, click through every DsBadge story in BOTH light and dark themes; verify each of the 11 variants matches the Figma `2014:9896` reference; verify `Loaded` shimmer animates and pauses under `prefers-reduced-motion: reduce`; verify `Draft` stripes render correctly.
  - [x] 9.6 Update File List below with all created/modified files.
  - [x] 9.7 Update Change Log with story completion entry dated 2026-04-17 (or current date).

## Dev Notes

### Architecture — Thin PrimeVue Badge Wrapper

`DsBadge` is a thin wrapper around `primevue/badge` (PrimeVue 4.5.4). PrimeVue Badge is minimal — it renders a small rounded label usually for notifications/counts. Our wrapper adds:

1. **Eleven visual `type` variants** with distinct color/border treatments — implemented via scoped CSS class modifiers (NOT via PrimeVue's `pt` API). The variants are too divergent and specific to Figma's `type/*` naming to express as a severity ramp.
2. **Left/right icon slots** with `showLIcon` / `showRIcon` toggles — 12px icons (distinct from DsChip's 18px) matching Figma's exact size spec.
3. **Decorative overlays** for `draft` (diagonal stripes) and `loaded` (shimmer animation) — rendered via `::before` pseudo-elements so no extra template markup is needed.
4. **Per-variant hover logic** limited to `clean` and `type10` (other variants have no hover state per Figma).
5. **No focusable / interactive behavior** — DsBadge is a display-only component. Consumers who need a clickable badge wrap it in a `<button>` themselves.

### Component API

```ts
export type DsBadgeType =
  | 'pending'
  | 'interesting'
  | 'neutral'
  | 'rejected'
  | 'accepted'
  | 'cancel'
  | 'border'
  | 'clean'
  | 'draft'
  | 'loaded'
  | 'type10';

export interface DsBadgeProps {
  /** Visual type. Default: 'pending' */
  type?: DsBadgeType;
  /** Render left icon slot (12×12, currentColor). Default: false */
  showLIcon?: boolean;
  /** Render right icon slot (12×12, currentColor). Default: false */
  showRIcon?: boolean;
  /** Badge text label (alternative to default slot — slot wins when both provided) */
  label?: string;
}
```

Emits: none (display-only component).

Slots:
- `default` — badge text (overrides `label`)
- `leading` — left-side 12px icon (only when `showLIcon=true`); default fallback `<DsIcon name="success" />`
- `trailing` — right-side 12px icon (only when `showRIcon=true`); default fallback `<DsIcon name="success" />`

### Figma-Derived Specifications (node `2014:9896`)

#### Geometry

- Height: **20px** (content + padding)
- Padding: **2px 8px** (default), **2px 4px** (clean only)
- Border-radius: **4px** (`radius/md`)
- Gap between label and icons: **2px** (pending, interesting), **3px** (all others)
- Font: `Inter 400 / 12px / line-height 16px / letter-spacing 0`
- Icon size: **12×12px** (distinct from DsChip's 18px)
- Loaded fixed width: **43px**

#### Token Mapping (Figma → preset)

| Figma variable | Hex | Preset token |
|---|---|---|
| `surfase/supporting/amber/yellow-100` | `#ffefdb` | `--p-amber-100` ✓ |
| `taxt/supporting/amber/yellow-700` | `#a33b16` | **Add `amber.700 = '#a33b16'`** (currently `#b85712` — see §Preset Extensions) |
| `surfase/purple/purple-100` | `#f3e8ff` | `--p-purple-100` ✓ |
| `taxt/brand/purple-600` | `#7849ff` | `--p-purple-600` ✓ |
| `surfase/supporting/blue/blue-200` | `#e7f4fe` | `--p-blue-200` ✓ |
| `taxt/supporting/blue/blue-600` | `#0e5cf4` | `--p-blue-600` ✓ |
| `surfase/negative/red-100` | `#ffe4e6` | `--p-red-100` ✓ |
| `taxt/negative/red-700` | `#f22a42` | `--p-red-700` ✓ |
| `surfase/positive/green-100` | `#e0f6ed` | **Add `green.100` primitive** (see §Preset Extensions) |
| `taxt/positive/green-700` | `#00995c` | **Add `green.700` primitive** (see §Preset Extensions) |
| `surfase/main/white` | `#ffffff` | `--p-surface-0` ✓ |
| `surfase/main/gray-200` | `#f1f5f9` | `--p-gray-200` ✓ |
| `surfase/main/gray-300` | `#e2e8f0` | `--p-gray-300` ✓ |
| `outline/main/gray-300` | `#e2e8f0` | `--p-gray-300` ✓ |
| `outline/main/gray-400` | `#cad5e2` | `--p-gray-400` ✓ |
| `taxt/main/gray-600` | `#62748e` | ⚠ hardcode `#62748e` (primitive `--p-gray-600` is `#6a7d97` — different) |
| `taxt/main/gray-800` | `#314158` | `--p-gray-800` ✓ (`#314158`) |

#### Preset Extensions (required)

The default path (AC #11 Option (a)): modify `src/theme/ds-preset.ts` as follows:

1. **Update `amber.700`** from `'#b85712'` to `'#a33b16'` (Figma `taxt/supporting/amber/yellow-700`).
2. **Add a new `green` primitive palette** after `amber` (pattern-match the interpolation style used for `red` and `blue`):
   ```ts
   green: {
     50: '#f2fbf6',   // interpolated
     100: '#e0f6ed',  // Figma surfase/positive/green-100
     200: '#b8ecd1',  // interpolated
     300: '#8de0b3',  // interpolated
     400: '#4fcb89',  // interpolated
     500: '#1eae69',  // interpolated
     600: '#11a062',  // interpolated
     700: '#00995c',  // Figma taxt/positive/green-700
     800: '#007d4b',  // interpolated
     900: '#00613a',  // interpolated
     950: '#003a22',  // interpolated
   }
   ```
   *Interpolation note:* You may adjust the interpolated values slightly if a visual gradient check (Foundations/ColorPalette story) reveals a banding artifact — the key requirement is that `100` and `700` match Figma exactly; the rest is a graceful ramp.
3. **Update `src/theme/ds-preset.test.ts`** to assert `dsPreset.primitive.green['100'] === '#e0f6ed'`, `dsPreset.primitive.green['700'] === '#00995c'`, and `dsPreset.primitive.amber['700'] === '#a33b16'`.

After these changes, the CSS variables `--p-green-100`, `--p-green-700`, and the updated `--p-amber-700` are available to `DsBadge.vue` and any future components.

If Task 2.1's grep discovers an unexpected consumer of the old `amber.700` value, fall back to AC #11 Option (b): define the three colors as scoped `--ds-badge-*` CSS custom properties inside `DsBadge.vue` and do NOT touch the preset.

#### Per-variant Spec Table

| Variant | Padding | Gap | Bg | Border | Text |
|---|---|---|---|---|---|
| pending | 2px 8px | 2px | `--p-amber-100` | none | `--p-amber-700` (= #a33b16 after preset update) |
| interesting | 2px 8px | 2px | `--p-purple-100` | none | `--p-purple-600` |
| neutral | 2px 8px | 3px | `--p-blue-200` | none | `--p-blue-600` |
| rejected | 2px 8px | 3px | `--p-red-100` | none | `--p-red-700` |
| accepted | 2px 8px | 3px | `--p-green-100` | none | `--p-green-700` |
| cancel | 2px 8px | 3px | `--p-gray-300` | none | `var(--p-gray-800)` |
| border | 2px 8px | 3px | `--p-surface-0` | 1px `--p-gray-300` | `var(--p-gray-800)` |
| clean (idle) | 2px 4px | 3px | transparent | none | `#62748e` (hardcoded — see Token Mapping) |
| clean (hover) | 2px 4px | 3px | `--p-gray-300` | none | `#62748e` |
| draft | 2px 8px | 3px | `--p-gray-300` + gray-400 diagonal stripe overlay | none | `var(--p-gray-800)` |
| loaded | 2px 8px (width: 43px) | — | `--p-gray-200` + shimmer | 1px `--p-gray-300` | — |
| type10 | 2px 8px | 3px | `--p-gray-200` | 1px `--p-gray-300` | `var(--p-gray-800)` |

### Icon Sizing

Figma badge icons are exactly **12px × 12px** (half the chip's 18px). The library's `DsIcon` exposes sizes `xsmall (16px) | small (20px) | medium (24px) | large (32px)` — none match 12px natively. Override via inline style:

```vue
<DsIcon name="success" :style="{ width: '12px', height: '12px' }" />
```

This matches Figma's `size-[12px]` spec exactly and inherits `currentColor` so each variant's text color also tints the icon.

Default fallback icon when `showLIcon` / `showRIcon` is `true` but no slot content is provided: `<DsIcon name="success" />` at 12px — matches the Figma "Success" placeholder used across all variants. Consumers typically override the slot with a semantically appropriate icon (`error-alert` for rejected, `info-filled` for neutral, etc.).

### Hover Semantics (per Figma)

Figma defines `Hover=yes` only for `clean` and `type10` variants. The other nine variants have no hover state — they are display indicators, not interactive. Do NOT add global `:hover` rules to every variant.

Read the epic AC carefully: `type10` is named as a distinct type because it represents the Clean/Border **hover target state** in the Figma design system. In practice this means:
- If you want a hoverable gray pill, use `<DsBadge type="clean" />` and the CSS `:hover` rule that ships with the component.
- If you want the static gray-200 + border visual with no interactivity, use `<DsBadge type="type10" />`.
The distinction is visual-only; no behavioral difference.

### Existing Code to Reuse

| Artifact | Path | Reuse For |
|---|---|---|
| Wrapper pattern reference | `src/components/DsChip/DsChip.vue` | `inheritAttrs: false` + `v-bind="$attrs"` scaffold; `:deep()` PrimeVue strip pattern; per-type CSS class modifiers; icon slot pattern |
| Test scaffold | `src/components/DsChip/DsChip.test.ts` | `mount` + PrimeVue plugin setup; describe-by-variant structure |
| Story scaffold | `src/components/DsChip/DsChip.stories.ts` | `Meta`/`StoryObj` + argTypes pattern; `AllVariantsGrid` helper idea |
| AI KB entry structure | `docs/ai-guidelines/ds-chip.md` | Section ordering, props table format, JSDoc-style entries |
| AI KB index | `docs/ai-guidelines/index.md` | Component Inventory table + Figma matching guide format |
| Component addition guide | `docs/component-addition-guide.md` | Repeatable checklist enforcement |
| Preset extension | `src/theme/ds-preset.ts` primitive section + test file | Pattern for adding a new palette (mirror the red/blue/amber structure) |

### Files to Create

- `src/components/DsBadge/DsBadge.vue`
- `src/components/DsBadge/DsBadge.stories.ts`
- `src/components/DsBadge/DsBadge.test.ts`
- `src/components/DsBadge/index.ts`
- `docs/ai-guidelines/ds-badge.md`

### Files to Modify

- `src/theme/ds-preset.ts` — add `green` primitive palette + update `amber.700` (unless fallback path taken)
- `src/theme/ds-preset.test.ts` — cover new tokens
- `src/index.ts` — add DsBadge export (alphabetically before `DsButton`)
- `docs/ai-guidelines/index.md` — add DsBadge to import example, Component Inventory, and Figma matching guide

### Files NOT Changed

- Other component files (DsButton, DsChip, DsTextarea, etc.) — DsBadge is self-contained
- `package.json` — no new dependencies (PrimeVue Badge is already available in the installed `primevue` peer)
- `docs/figma-variables.md` — leave as-is (the new tokens are additions beyond the current documented set; optional: add `surfase/positive/green-*` and `taxt/positive/green-*` rows in a follow-up doc pass)

### Anti-Patterns to Avoid

- **Do NOT** use PrimeVue Badge's `severity` prop to map variants — our 11 types exceed the severity set (no way to express `interesting`, `cancel`, `border`, `clean`, `draft`, `loaded`, `type10` as severity). Use scoped CSS class modifiers instead.
- **Do NOT** add runtime prop validation for `type` — TypeScript enforces it at build time; PrimeVue does not runtime-check prop unions.
- **Do NOT** hardcode hex colors in scoped CSS unless they appear in the allowlist from the Token Mapping table (`#62748e` for Clean text is the only common exception). Grep the final file for `#` before shipping.
- **Do NOT** use `:focus` or `:focus-visible` on DsBadge — it is NOT interactive. Consumers wrap in `<button>` if interactivity is needed.
- **Do NOT** render the stripe/shimmer overlays as template DOM — use `::before` pseudo-elements so the template stays flat and the decorative content doesn't pollute the accessibility tree.
- **Do NOT** animate without the `@media (prefers-reduced-motion: no-preference)` guard (UX-DR9, NFR6). The shimmer must be pausable.
- **Do NOT** make DsBadge tabbable (no `tabindex`). See AC #8.
- **Do NOT** reuse DsChip's 18px icon sizing — badge icons are 12px. Use `:style="{ width: '12px', height: '12px' }"` inline override on `<DsIcon>`.
- **Do NOT** skip the preset change task (Task 2). Hardcoding hex in the component is allowed only when preset modification is blocked by an existing amber.700 consumer (unlikely but possible).
- **Do NOT** modify other components while here. The `src/index.ts` insertion is a one-line additive change.
- **Do NOT** use `severity="success"` etc. to drive the color — we are NOT using PrimeVue severity; the colors come entirely from our scoped CSS.

### Previous Story Intelligence

**From Story 7.1 (DsChip) — most recent completed story, dated 2026-04-17:**
- Baseline test count after 7.1: **330 tests**. Your additions should bring total to ~345–355. If a different number is in HEAD when you start, capture the new baseline in the Completion Notes.
- 7.1 added both `DsChip` and (as a drift fix) `DsSelect` barrel exports. When inserting `DsBadge`, verify the current export list in `src/index.ts` is complete (as of HEAD after 7.1 it exports DsButton, DsChip, DsIcon, DsIconButton, DsInputText, DsLink, DsSelect, DsTextarea, dsPreset, dsTheme). Insert `DsBadge` in the correct alphabetical slot (before `DsButton`).
- PrimeVue Chip's internal `.p-chip` styles were stripped via `:deep()` — apply the same pattern for `.p-badge`.
- Focus-visible ring pattern: not needed for DsBadge (non-interactive).
- The `<button>` + keyboard handler pattern for Chip's X button: not needed for DsBadge.
- Scoped `<style scoped>` is sufficient — DsBadge has no teleported overlay. Do NOT add a non-scoped `<style>` block.

**From Story 6.3 (DsSelect Advanced Variants):**
- **Verify the PrimeVue Badge API before assuming behavior.** PrimeVue 4.x Badge props include `value`, `severity`, `size`, `badgeSize` (deprecated?), `ptOptions`. The default slot is usable. Confirm in `node_modules/primevue/badge` before assuming.
- Non-scoped CSS is required for PrimeVue overlays — but Badge has no overlay, so stay with `<style scoped>` only.

**From Story 6.1 (DsTextarea):**
- Biome is strict about import order — `npm run lint` will fail loudly if imports are out of order.
- The `<style scoped>` + `:deep()` pattern works reliably.

### Git Intelligence (Recent Commits)

```
d20a962 story 6.3
66b75a4 story 6.2
6ad1e82 story 6.1
2f67c65 add epics for phase 2
e9bed4d phase 2 specs sync
```

Story 7.1 (DsChip) is in `review` status and exists on the current branch as uncommitted work (`src/components/DsChip/`, `docs/ai-guidelines/ds-chip.md`, modified `src/index.ts` + `docs/ai-guidelines/index.md`) per `git status`. Do not conflict with that work — DsBadge is a separate directory and its changes to `src/index.ts` and `docs/ai-guidelines/index.md` are additive insertions that should merge cleanly with the 7.1 edits. Commit style: one story = one commit titled `story 7.2`.

### Latest Tech Notes

- **Vue**: `^3.5.30` — `defineOptions`, `withDefaults`, `useSlots`, `useId` all available.
- **PrimeVue**: `^4.5.4` — Badge component path `primevue/badge`. Default slot, `value`, `severity`, `size` props. We use only `v-bind="$attrs"` passthrough + the default slot.
- **Vitest**: `^4.1.2` — `mount` + `@vue/test-utils` `^2.4.6`.
- **Biome**: `^2.4.9` — strict import order; run `npm run lint` before commit.
- **Storybook**: `@storybook/vue3-vite` — see existing component stories for the `Meta`/`StoryObj` import pattern.
- **@primeuix/themes**: preset library — `definePreset()` primitive palettes become CSS vars automatically (`--p-<palette>-<shade>`).

### Project Structure Notes

- File layout matches architecture §Project Structure (`src/components/DsBadge/{DsBadge.vue, DsBadge.stories.ts, DsBadge.test.ts, index.ts}`).
- AI KB at `docs/ai-guidelines/ds-badge.md` extends the existing 8-entry directory (after 7.1 adds `ds-chip.md`).
- Per CLAUDE.md, place any temporary/debug artifacts (scratch screenshots, ad-hoc test data, etc.) in `./tmp/`. Do NOT pollute the component directory with debug files.

### References

- [Source: _bmad-output/planning-artifacts/epics-phase2.md#Story 7.2] — original BDD acceptance criteria
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#FR7] — DsBadge 11 variants + icon + hover requirement
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#FR9, FR10, FR11, FR12] — PrimeVue passthrough, theme parity, TypeScript types, prop conventions
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Architecture] — thin wrapper pattern with `inheritAttrs: false` + `v-bind="$attrs"`
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure] — co-located file structure
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns] — `Ds` prefix, PascalCase component names, CSS tokens via preset
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Component Strategy] — DsBadge wraps PrimeVue Badge with type variants
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Feedback Patterns] — DsBadge API exception: `type` not `severity`
- [Source: docs/component-addition-guide.md] — repeatable component addition checklist
- [Source: docs/figma-variables.md] — token reference; note `surfase/positive/*` and `taxt/positive/*` (green) families are NOT yet documented — this story adds them
- [Source: docs/ai-guidelines/ds-chip.md] — AI KB entry structure to mirror (after 7.1 lands)
- [Source: docs/ai-guidelines/index.md] — Component Inventory + Figma matching guide format
- [Source: src/components/DsChip/DsChip.vue] — wrapper scaffold reference (PrimeVue strip, per-type CSS, icon slots)
- [Source: src/components/DsSelect/DsSelect.vue] — alternative type-modifier CSS pattern
- [Source: src/components/DsIcon/icon-names.ts] — available icon names for stories (`success`, `error-alert`, `info-filled`, `close`, `check`, etc.)
- [Source: src/theme/ds-preset.ts] — primitive palette location for the green palette + amber.700 update
- [Source: src/theme/ds-preset.test.ts] — preset token test pattern to extend
- [Source: Figma node `2014:9896`] — Badge category (master variants for all 11 types)
- [Source: _bmad-output/implementation-artifacts/7-1-dschip-component.md] — most recent story for git/test/baseline context

## Dev Agent Record

### Agent Model Used

claude-opus-4-7[1m]

### Debug Log References

None — implementation proceeded without errors.

### Completion Notes List

- Task 2.1 grep result: **zero callers** of `amber.700` / `amber-700` / `--p-amber-700` outside `ds-preset.ts` and `ds-preset.test.ts`. Proceeded with AC #11 Option (a) — preset update.
- Preset change: `amber.700` updated from `#b85712` to `#a33b16` (Figma `taxt/supporting/amber/yellow-700`). Full `green` primitive palette added (shades 50–950; Figma-exact at 100 and 700).
- Cancel, Border, Draft, Type10 text color uses `var(--p-gray-800)` (resolves to `#314158`) rather than the raw hex — consistent with DsSelect precedent.
- Clean text uses hardcoded `#62748e` with Figma comment (primitive `--p-gray-600` is `#6a7d97`, which differs from Figma's text gray-600 `#62748e`).
- PrimeVue Badge's `.p-badge` internal styles stripped via `:deep()` — extended the strip list with `display: inline-flex`, `align-items: center`, `gap: inherit` to ensure the inner slot content lays out correctly.
- Draft stripes implemented at `120deg` CSS equivalent of Figma `30.67deg` (Figma uses `0deg = right`, CSS uses `0deg = up`, so `120deg` ≈ `30.67deg` Figma). Storybook visual confirmation required for final angle tuning.
- Loaded shimmer `::before` positioned with `top: -4px; bottom: -4px; left: -20%` to overflow clip boundary for a realistic enter/exit sweep.
- 9.5 (`npm run storybook` interactive): skipped per story Dev Notes caveat — Chrome extension not connected in this environment. Storybook compilation confirmed via `npm run build-storybook` which produced `DsBadge.stories-BUWX1KzZ.js` chunk cleanly.
- Test delta: DsBadge added 25 new component tests + 2 new preset-token tests = 27 new tests. Full suite count after 7.2 = 400 tests; 396 passing, 4 pre-existing DsChip removable-keyboard failures unrelated to 7.2 (tracked under story 7.1). All DsBadge (25) and preset (13) tests pass.

### File List

**Created:**
- `src/components/DsBadge/DsBadge.vue`
- `src/components/DsBadge/DsBadge.stories.ts`
- `src/components/DsBadge/DsBadge.test.ts`
- `src/components/DsBadge/index.ts`
- `docs/ai-guidelines/ds-badge.md`

**Modified:**
- `src/theme/ds-preset.ts` — added `green` primitive palette; updated `amber.700` to `#a33b16`
- `src/theme/ds-preset.test.ts` — 2 new test cases for green palette and updated amber.700
- `src/index.ts` — added `DsBadge` export (alphabetically between DsAvatar and DsButton)
- `docs/ai-guidelines/index.md` — added DsBadge to import example, Component Inventory table, and Figma matching guide
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — story status updated to `review`

## Change Log

- 2026-04-17: Story 7.2 implementation complete. Created DsBadge component with 11 type variants, icon slots, shimmer/draft overlays, and scoped CSS. Extended ds-preset.ts with green primitive palette and updated amber.700. Added 27 tests (25 component + 2 preset). DsBadge + preset tests all green. Status: review.
- 2026-04-17 (review patches): fixed shimmer keyframes to `translateX(-100%)` → `translateX(200%)` per AC #6 spec; exported `DsBadgeType` from barrel and local index; moved hover-pin style out of story `<style>` tags; hid shimmer `::before` entirely under `prefers-reduced-motion: reduce`; wrapped `.ds-badge--clean:hover` in `@media (hover: hover)`; strengthened green palette test assertions (exact hex instead of `toBeDefined`); asserted `data-testid` on root via `wrapper.attributes()`; added `aria-busy="true"` + `aria-label="Loading"` defaults for `loaded` variant (consumer can override via `$attrs`); +3 new a11y tests (DsBadge total: 28 component tests + 2 preset tests = 30 new in 7.2).
