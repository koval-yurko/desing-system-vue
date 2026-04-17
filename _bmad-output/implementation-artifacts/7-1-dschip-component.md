# Story 7.1: DsChip Component

Status: done

## Story

As a **developer or AI agent** implementing a Figma design that contains tag/filter chips,
I want a `DsChip` component that wraps PrimeVue Chip with 3 visual types (Default, Selected, Not clickable), 2 sizes (S, M), hover states, optional left/right icon slots, and a removable (X) behavior with keyboard accessibility,
So that I can render chip elements matching the Figma Design System in both light and dark themes without custom styling.

## Figma Design References

- Chips category (all variants): https://www.figma.com/design/3qP5xnwc6gXhZR3AnFAMFe/Design-Systems?node-id=2014-9915&m=dev
- Variant nodes (from Figma `2014:9915`):
  - `2014:9920` — Type=Default, Hover=no, Size=M
  - `2014:9935` — Type=Default, Hover=yes, Size=M
  - `2657:25555` — Type=Default, Hover=no, Size=S
  - `2657:25571` — Type=Default, Hover=yes, Size=S
  - `2014:9927` — Type=Selected, Hover=no, Size=M
  - `2014:9931` — Type=Selected, Hover=yes, Size=M
  - `2014:9924` — Type=Not clickable, Hover=no, Size=M
  - `2657:25559` — Type=Not clickable, Hover=no, Size=S
  - Sub-icons: `2657:25558` (Exit/X for Size S removable), `2161:7429` (right-arrow chevron for Size M)

## Acceptance Criteria

1. **Given** `DsChip` wraps PrimeVue `Chip` using `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` (FR9), **When** a developer uses `<DsChip label="MDS Entries" />`, **Then** the component renders a chip composite (optional leading icon + label + optional trailing icon/X) matching the Figma design in both light and dark themes (FR10).

2. **Given** `DsChip` supports 2 sizes via the `size` prop, **When** `size="medium"` (default), **Then** the chip applies `padding: 6px 8px`, gap `4px`, border-radius `8px` (`--p-radius-lg` / `radius/lg`), and label uses Inter regular 14px / line-height 20px / letter-spacing -0.2px. **When** `size="small"`, **Then** the chip applies `padding: 4px 8px`, gap `4px`, border-radius `8px`, same label typography. Icons are `18px × 18px` in both sizes (use `<DsIcon size="small" />` and override to 18px via inline width/height — see Dev Notes §Icon Sizing).

3. **Given** `DsChip` supports 3 visual types via the `type` prop, **When** `type="default"` (default value), **Then**:
   - **Idle (no hover)**: bg `--p-surface-0` (white). Border at size M: `1px solid --p-gray-500` (#90a1b9). Border at size S: `1px solid --p-gray-400` (#cad5e2). Text `--p-gray-900` (#1d293d).
   - **Hover**: bg `--p-gray-100` (#f8fafc), border `1px solid --p-gray-500` (#90a1b9) at both sizes, text `--p-gray-900`.

4. **Given** `DsChip` `type="selected"`, **When** rendered idle, **Then** bg `--p-surface-0` (white), border `1px solid --p-purple-800` (#5f33e6 — maps to Figma `outline/brand/purple-450`), text and icons `--p-purple-800`. **When** hovered, **Then** bg `--p-purple-100` (#f3e8ff — Figma `surfase/purple/purple-100`), border `1px solid --p-purple-800`, text/icons `--p-purple-800`.

5. **Given** `DsChip` `type="not-clickable"` (or `disabled` prop is true), **When** rendered at size M, **Then** bg `--p-gray-300` (#e2e8f0), no border, text `--p-gray-900`, and the chip has `pointer-events: none` plus no hover styles. **When** rendered at size S, **Then** bg `--p-gray-100` (#f8fafc), border `1px solid --p-gray-200` (#f1f5f9), text `--p-gray-900`. Disabled overrides any other type.

6. **Given** `DsChip` supports `removable` behavior, **When** the `removable` prop is `true`, **Then** an Exit (X close) icon (18px, use `<DsIcon name="close" />` with a custom 18px size override) renders on the right of the label as a focusable, keyboard-activatable button. Clicking the X **or** pressing **Enter / Space** while the X has focus **emits a `remove` event** (NFR8). The X button has `aria-label="Remove"` (overridable via `removeAriaLabel` prop). After remove emission, the consumer is responsible for unmounting the chip — the component does NOT manage its own removal state.

7. **Given** `DsChip` removable behavior must implement focus management after removal (NFR8), **When** the chip is removed, **Then** the consumer pattern documented in the AI KB and demonstrated in the Storybook `RemovableList` story shows how to move focus to the next remaining chip (or to a designated fallback element) after the chip unmounts. The story uses `nextTick` + `ref` array to focus the next chip's X button (or a sibling element if last).

8. **Given** `DsChip` supports leading and trailing slots, **When** the consumer provides `#leading` content, **Then** it renders to the left of the label inside the chip (intended for entity icons at size S, list/column icons at size M). **When** the consumer provides `#trailing` content **and** `removable` is `false`, **Then** it renders to the right of the label (intended for the right-arrow chevron in size M default chips, or any custom adornment). When `removable="true"`, the X button takes precedence and the `#trailing` slot is ignored.

9. **Given** `DsChip` provides text content, **When** the `label` prop is set, **Then** it renders inside a `<span class="ds-chip__label">`. **When** the default slot is provided (no `label` prop), **Then** the slot content renders inside the same label span (slot takes precedence over the prop). Label uses Inter regular 14px / line-height 20px / letter-spacing -0.2px / color matching the type variant.

10. **Given** all transitions follow project motion conventions (UX-DR9), **When** the chip transitions between hover/idle states, **Then** `background-color`, `border-color` transition with `150ms ease` timing wrapped in `@media (prefers-reduced-motion: no-preference)`. The not-clickable / disabled state skips transitions.

11. **Given** focus indicators must be visible in both themes (NFR6, UX-DR8), **When** the chip OR its X button receives keyboard focus, **Then** a `focus-visible` ring is rendered using `outline: 2px solid var(--p-purple-800); outline-offset: 2px;` (mirroring the project's existing focus-visible pattern from `component-addition-guide.md`). `:focus` (mouse focus) does NOT show the ring.

12. **Given** `DsChip` wraps PrimeVue `Chip`, **When** a consumer passes standard PrimeVue Chip props (`image`, `icon`, etc.), slots (`removeicon`), or events, **Then** they are forwarded via `inheritAttrs: false` + `v-bind="$attrs"` (FR9). TypeScript types are exported for all DS-specific props (`type`, `size`, `disabled`, `removable`, `removeAriaLabel`, `label`) and the `remove` event (FR11).

13. **Given** the component follows the co-located file convention (architecture §Project Structure), **When** implementation is complete, **Then** the directory `src/components/DsChip/` contains `DsChip.vue`, `DsChip.stories.ts`, `DsChip.test.ts`, `index.ts`; the component is re-exported from `src/index.ts` as `{ DsChip, type DsChipProps }` (alphabetical between `DsButton` and `DsIcon`); Storybook stories cover all 3 types × 2 sizes × idle/hover states + a removable interactive story; Vitest tests verify props, type/size class application, removable behavior, keyboard interaction (Enter/Space on X), focus management via story-level pattern, accessibility attributes, and PrimeVue passthrough; an AI KB entry exists at `docs/ai-guidelines/ds-chip.md` following the existing entry structure (DsTextarea/DsSelect pattern); the AI KB index `docs/ai-guidelines/index.md` lists `DsChip` in the Component Inventory and the "Figma Element to Component Matching Guide" sections.

## Tasks / Subtasks

- [x] **Task 1: Create DsChip component scaffold** (AC: #13)
  - [x] 1.1 Create directory `src/components/DsChip/`
  - [x] 1.2 Create empty files: `DsChip.vue`, `DsChip.stories.ts`, `DsChip.test.ts`, `index.ts`
  - [x] 1.3 Populate `src/components/DsChip/index.ts` with `export { default as DsChip } from './DsChip.vue'; export type { DsChipProps } from './DsChip.vue';`
  - [x] 1.4 Add to `src/index.ts` (alphabetically between `DsButton` and `DsIcon`): `export { DsChip, type DsChipProps } from './components/DsChip';`
  - [x] 1.5 **AUDIT (cross-cut)**: while editing `src/index.ts`, verify whether `DsSelect` is currently re-exported (the AI KB index lists it, but the barrel may be missing it — confirmed missing as of branch HEAD). If missing, add `export { DsSelect, type DsSelectProps } from './components/DsSelect';` in alphabetical order between `DsLink` and `DsTextarea`. Note this in the Completion Notes List.

- [x] **Task 2: Implement `DsChip.vue` — script & props** (AC: #1, #12)
  - [x] 2.1 `import Chip from 'primevue/chip';`
  - [x] 2.2 `import { computed } from 'vue';`
  - [x] 2.3 `import DsIcon from '../DsIcon/DsIcon.vue';`
  - [x] 2.4 Define and `export interface DsChipProps` (see §Component API in Dev Notes)
  - [x] 2.5 `defineOptions({ inheritAttrs: false });`
  - [x] 2.6 `withDefaults(defineProps<DsChipProps>(), { type: 'default', size: 'medium', disabled: false, removable: false, removeAriaLabel: 'Remove' });`
  - [x] 2.7 `const emit = defineEmits<{ remove: []; }>();`
  - [x] 2.8 Computed `effectiveType`: returns `'not-clickable'` when `disabled` is `true`, otherwise returns `props.type` (so `disabled` overrides `type` per AC #5).
  - [x] 2.9 Computed `chipClasses` returning `{ 'ds-chip': true, [\`ds-chip--${effectiveType}\`]: true, [\`ds-chip--${size}\`]: true, 'ds-chip--removable': removable, 'ds-chip--transitions': effectiveType !== 'not-clickable' }`.

- [x] **Task 3: Implement `DsChip.vue` — template** (AC: #6, #8, #9)
  - [x] 3.1 Wrap PrimeVue `<Chip>` with `v-bind="$attrs"`, `:class="chipClasses"`, and pass through any standard Chip props the consumer sets.
  - [x] 3.2 Use PrimeVue Chip's default slot for content. Inside the slot, render in this order: `#leading` slot (if provided) → `<span class="ds-chip__label">{{ label }}<slot /></span>` (slot takes precedence) → trailing region.
  - [x] 3.3 Trailing region logic:
    - If `removable` is `true`: render a `<button type="button" class="ds-chip__remove" :aria-label="removeAriaLabel" @click="onRemove" @keydown.enter.prevent="onRemove" @keydown.space.prevent="onRemove">` containing `<DsIcon name="close" :style="{ width: '18px', height: '18px', fontSize: '18px' }" />`. The button must NOT trigger when `disabled`/`type='not-clickable'` — guard inside `onRemove`.
    - Else if `#trailing` slot is provided: render the slot.
    - Else: render nothing on the right.
  - [x] 3.4 `function onRemove() { if (props.disabled || effectiveType.value === 'not-clickable') return; emit('remove'); }`
  - [x] 3.5 Set `:tabindex="-1"` on the root chip (the chip itself is not focusable; only the X button is). For Selected chips intended as toggle buttons, the consumer can wrap in their own `<button>` — DsChip does not assume click-to-toggle behavior.

- [x] **Task 4: Implement `DsChip.vue` — scoped styles** (AC: #2, #3, #4, #5, #10, #11)
  - [x] 4.1 Base `.ds-chip` styles: `display: inline-flex; align-items: center; gap: 4px; border-radius: 8px;` and `box-sizing: border-box;`. Override PrimeVue's internal `.p-chip` background and padding using `:deep(.p-chip)` selectors so the wrapper owns these visual properties (mirroring the DsSelect strip-PrimeVue-styles pattern).
  - [x] 4.2 Size modifiers: `.ds-chip--medium { padding: 6px 8px; }` and `.ds-chip--small { padding: 4px 8px; }`. Both: `font-family: var(--font-family, 'Inter', sans-serif); font-weight: 400; font-size: 0.875rem; line-height: 1.25rem; letter-spacing: -0.2px;`.
  - [x] 4.3 Type=Default styles: idle bg/border/text per AC #3. Use `.ds-chip--default.ds-chip--medium { border-color: var(--p-gray-500); }` vs `.ds-chip--default.ds-chip--small { border-color: var(--p-gray-400); }`. Hover (only when transitions are active): `.ds-chip--default.ds-chip--transitions:hover { background-color: var(--p-gray-100); border-color: var(--p-gray-500); }`.
  - [x] 4.4 Type=Selected styles: idle and hover per AC #4. Use `var(--p-purple-800)` for both border AND text/icon color. Selected hover bg uses `var(--p-purple-100)`.
  - [x] 4.5 Type=Not clickable styles per AC #5. Apply `pointer-events: none;` on `.ds-chip--not-clickable`. Different bg/border per size — encode as `.ds-chip--not-clickable.ds-chip--medium { background-color: var(--p-gray-300); border: none; }` and `.ds-chip--not-clickable.ds-chip--small { background-color: var(--p-gray-100); border: 1px solid var(--p-gray-200); }`.
  - [x] 4.6 Transitions: `@media (prefers-reduced-motion: no-preference) { .ds-chip--transitions { transition: background-color 150ms ease, border-color 150ms ease; } }`.
  - [x] 4.7 Focus ring (AC #11): `.ds-chip__remove:focus-visible { outline: 2px solid var(--p-purple-800); outline-offset: 2px; border-radius: 50%; }`. The X button itself is `display: inline-flex; align-items: center; justify-content: center; background: transparent; border: 0; padding: 0; cursor: pointer; color: inherit;` so it inherits the chip's text color (purple-800 in Selected, gray-900 elsewhere).
  - [x] 4.8 The `.ds-chip__label` span uses `color: inherit;` and inherits the per-type text color set on `.ds-chip--default`, `.ds-chip--selected`, `.ds-chip--not-clickable`.
  - [x] 4.9 Selected text/icon color: `.ds-chip--selected { color: var(--p-purple-800); }` (so both label span and DsIcon `currentColor`-based SVGs render purple).

- [x] **Task 5: Storybook stories** (AC: #13)
  - [x] 5.1 Create `DsChip.stories.ts` with `Meta`/`StoryObj` from `@storybook/vue3-vite`, `argTypes` for `type`, `size`, `disabled`, `removable`, `label`, `removeAriaLabel`. Default `args`: `{ type: 'default', size: 'medium', label: 'MDS Entries', disabled: false, removable: false }`.
  - [x] 5.2 Stories: `Default` (M, default), `DefaultSmall`, `Selected`, `SelectedSmall`, `NotClickable` (M), `NotClickableSmall`, `WithLeadingIcon` (uses `#leading` slot with `<DsIcon name="boxes" />` to mirror the Figma left "column" glyph), `WithTrailingChevron` (size M default with `#trailing` containing `<DsIcon name="arrow-right" />`), `Removable` (size S default with `removable=true`), `SelectedRemovable` (size S selected with `removable=true`).
  - [x] 5.3 Add a composite `AllVariantsGrid` story rendering every combination of `type × size × hover-class` side-by-side in a flex grid (mirrors the Figma category page `2014:9915` layout — see screenshot in Dev Notes). Use a CSS class `.story-force-hover` on hovered examples to demonstrate the hover styling without requiring real mouse hover. (This is a presentation-only helper; it does not exist in the component.)
  - [x] 5.4 Add a `RemovableList` interactive story (AC #7): `setup()` creates a `ref` array of chip data; on `@remove`, the consumer splices the item from the array and uses `nextTick` + chip refs to focus the next sibling chip's X button (or a fallback button if the removed chip was last). This is the canonical focus-management pattern that the AI KB documents.
  - [x] 5.5 Visually verify each story in BOTH light and dark themes (NFR12). Storybook preview supports theme toggle via the existing `.storybook/preview.ts` setup — confirm no hardcoded hex colors leak through.

- [x] **Task 6: Vitest tests** (AC: all)
  - [x] 6.1 Set up the test file mirroring `DsSelect.test.ts` pattern: import `mount` from `@vue/test-utils`, `PrimeVue` from `primevue/config`, `Chip` from `primevue/chip`. `globalConfig = { plugins: [[PrimeVue, { theme: 'none' }]] }`.
  - [x] 6.2 Default render tests: renders `.ds-chip`, default classes `ds-chip--default ds-chip--medium`, label text from `label` prop, no remove button, no leading/trailing slot content.
  - [x] 6.3 Type tests: `type="selected"` adds `.ds-chip--selected`; `type="not-clickable"` adds `.ds-chip--not-clickable`; `disabled=true` overrides `type` to apply `.ds-chip--not-clickable`; `disabled=true` with `type="selected"` still results in `.ds-chip--not-clickable`.
  - [x] 6.4 Size tests: `size="small"` adds `.ds-chip--small`; `size="medium"` adds `.ds-chip--medium`.
  - [x] 6.5 Slot tests: `#leading` renders to the left of the label; default slot replaces `label` prop content when both are provided; `#trailing` renders only when `removable=false`.
  - [x] 6.6 Removable tests: `removable=true` renders `.ds-chip__remove` button with `aria-label="Remove"`; clicking the button emits `remove` event exactly once; pressing Enter on the button emits `remove`; pressing Space on the button emits `remove`; the click event does NOT bubble to trigger surrounding handlers (verify with a parent click spy).
  - [x] 6.7 Disabled-removable interaction: `removable=true` with `disabled=true` (or `type="not-clickable"`) — clicking X does NOT emit `remove`.
  - [x] 6.8 Custom `removeAriaLabel="Delete tag"` test — X button's `aria-label` reflects the prop.
  - [x] 6.9 PrimeVue passthrough test: arbitrary attribute (e.g. `data-testid="my-chip"`) lands on the rendered PrimeVue Chip root.
  - [x] 6.10 No regressions: full project test suite passes (`npm test`).

- [x] **Task 7: AI knowledge base entry** (AC: #13)
  - [x] 7.1 Create `docs/ai-guidelines/ds-chip.md` following DsTextarea / DsSelect entry structure: `# DsChip`, `## When to Use`, `## Import`, `## Props` (table), `## Variants`, `## Sizes`, `## Slots`, `## Events`, `## Usage Examples`, `## Accessibility`, `## Figma Reference`.
  - [x] 7.2 In Usage Examples, include: basic chip, selected chip, removable chip with v-on handler, leading icon variant, trailing chevron variant, RemovableList focus-management snippet (the exact pattern from Storybook `RemovableList` story).
  - [x] 7.3 Update `docs/ai-guidelines/index.md`:
    - 7.3.1 Add `DsChip` to the import example list (alphabetical, between `DsButton` and `DsIcon`).
    - 7.3.2 Add a new row to the Component Inventory table: `| DsChip | Tag/filter chip with default/selected/not-clickable types, 2 sizes, removable behavior | import { DsChip } from '@failwin/desing-system-vue' | Chip, Tag, FilterChip |`
    - 7.3.3 Add a `**DsChip**` section under "Figma Element to Component Matching Guide" with mapping examples: `Chip/Default → <DsChip>Label</DsChip>`, `Chip/Selected → <DsChip type="selected">Label</DsChip>`, `Chip/Disabled or Chip/Not clickable → <DsChip disabled>Label</DsChip>`, removable example, size variants line.
    - 7.3.4 If `DsSelect` is also missing from the index's import example list (it's in the inventory table but cross-check the import line), do NOT add it again — the line may already be correct. Verify, don't duplicate.

- [x] **Task 8: Validate & ship**
  - [x] 8.1 `npm run lint` — Biome must pass with zero errors. Watch import order in `DsChip.vue` (Biome enforces it — this caught Story 6.1).
  - [x] 8.2 `npm test` — full suite, all green, no regressions vs. branch HEAD baseline of 306 tests.
  - [x] 8.3 `npm run build` — TypeScript build + `vite build` must succeed; verify `dist/` contains `DsChip` in the type declarations.
  - [x] 8.4 `npm run storybook` — start Storybook, click through every DsChip story in BOTH light and dark themes; verify all 3 types × 2 sizes render per Figma; verify `RemovableList` interactive removal + focus shift; verify `WithLeadingIcon` and `WithTrailingChevron` look correct.
  - [x] 8.5 Update File List below with all created/modified files.
  - [x] 8.6 Update Change Log with story completion entry dated 2026-04-17 (or current date).

## Dev Notes

### Architecture — Thin PrimeVue Chip Wrapper

`DsChip` is a thin wrapper around `primevue/chip` (PrimeVue 4.5.4). PrimeVue Chip itself is minimal — it renders a styled `<div>` with optional label/icon/image/remove-icon and exposes a `remove` event. Our wrapper adds:

1. **Three visual `type` variants** with distinct color treatments — implemented via scoped CSS class modifiers, NOT via PrimeVue's `pt` API (the variants are too divergent for token-overrides).
2. **Two `size` variants** with different padding/border-color rules.
3. **Custom Exit (X) button** rendered via our own `<button>` (not PrimeVue's built-in `removable` prop) so we have full control over the icon (must be 18px), keyboard handlers, and focus-visible ring. This deviates from raw PrimeVue Chip's removable behavior but is necessary because PrimeVue's default close icon does not match Figma's 18px Exit glyph and is harder to style consistently.
4. **`leading` and `trailing` slots** for icon flexibility (entity icons at S, list icon + chevron at M, custom adornments).
5. **`disabled` ⇒ `not-clickable` aliasing** so consumers can use either `disabled` (DSL convention) or `type="not-clickable"` (Figma name).

### Component API

```ts
export interface DsChipProps {
  /** Visual type. Default: 'default' */
  type?: 'default' | 'selected' | 'not-clickable';
  /** Chip size. Default: 'medium' */
  size?: 'small' | 'medium';
  /** Disabled state — equivalent to type='not-clickable'. Overrides `type` when true. Default: false */
  disabled?: boolean;
  /** Show X (Exit) close button + emit @remove on click/Enter/Space. Default: false */
  removable?: boolean;
  /** Accessible label for the X button. Default: 'Remove' */
  removeAriaLabel?: string;
  /** Chip text label (alternative to default slot — slot wins when both provided) */
  label?: string;
}
```

Emits:
- `remove` — `[]` payload, fired on X click / Enter / Space.

Slots:
- `default` — chip text (overrides `label`)
- `leading` — left-side icon adornment
- `trailing` — right-side adornment (rendered only when `removable=false`)

### Figma-Derived Specifications (node `2014:9915`)

#### Token Mapping (Figma → PrimeVue preset)

| Figma variable | Hex | PrimeVue token |
|---|---|---|
| `outline/main/gray-400` | `#cad5e2` | `--p-gray-400` |
| `outline/main/gray-500` | `#90a1b9` | `--p-gray-500` |
| `outline/main/gray-200` | `#f1f5f9` | `--p-gray-200` |
| `outline/brand/purple-450` | `#5f33e6` | `--p-purple-800` (same hex; project's purple-800 is the Figma "purple-450") |
| `surfase/main/white` | `#ffffff` | `--p-surface-0` |
| `surfase/main/gray-100` | `#f8fafc` | `--p-gray-100` |
| `surfase/main/gray-300` | `#e2e8f0` | `--p-gray-300` |
| `surfase/purple/purple-100` | `#f3e8ff` | `--p-purple-100` |
| `taxt/main/gray-900` | `#1d293d` | `--p-gray-900` |
| `taxt/brand/purple-800` | `#5f33e6` | `--p-purple-800` |
| `radius/lg` | `8` | `8px` (literal — preset doesn't currently expose a CSS var for this) |

**Critical mapping note**: Figma calls the brand purple "purple-450" but its hex `#5f33e6` matches the project's existing `--p-purple-800` token (verified in `DsSelect.vue:400` focus border + `DsIconButton.vue:194` primary hover). Use `--p-purple-800` everywhere — do NOT add a new token.

#### Per-variant Spec Table

| Variant | Bg | Border | Text/Icon |
|---|---|---|---|
| Default M (idle) | `--p-surface-0` (white) | `1px solid --p-gray-500` | `--p-gray-900` |
| Default M (hover) | `--p-gray-100` | `1px solid --p-gray-500` | `--p-gray-900` |
| Default S (idle) | `--p-surface-0` (white) | `1px solid --p-gray-400` | `--p-gray-900` |
| Default S (hover) | `--p-gray-100` | `1px solid --p-gray-500` | `--p-gray-900` |
| Selected M (idle) | `--p-surface-0` (white) | `1px solid --p-purple-800` | `--p-purple-800` |
| Selected M (hover) | `--p-purple-100` | `1px solid --p-purple-800` | `--p-purple-800` |
| Selected S (idle) | `--p-surface-0` (white) | `1px solid --p-purple-800` | `--p-purple-800` |
| Selected S (hover) | `--p-purple-100` | `1px solid --p-purple-800` | `--p-purple-800` |
| Not clickable M | `--p-gray-300` | none | `--p-gray-900` |
| Not clickable S | `--p-gray-100` | `1px solid --p-gray-200` | `--p-gray-900` |

Padding: M = `6px 8px`, S = `4px 8px`. Gap: `4px`. Border-radius: `8px` (both sizes). Font: Inter 14px / line-height 20px / letter-spacing `-0.2px`.

### Icon Sizing

Figma chip icons are exactly **18px × 18px**. The library's `DsIcon` component exposes sizes `xsmall (16px) | small (20px) | medium (24px) | large (32px)` (verified in `src/components/DsIconButton/DsIconButton.vue` icon-size map). 18px is between xsmall and small. Use the `small` (20px) preset and override via inline style for chip icons:

```vue
<DsIcon name="close" :style="{ width: '18px', height: '18px', fontSize: '18px' }" />
```

This matches the Figma `size-[18px]` spec exactly and inherits `currentColor` from the chip's text color so Selected chips automatically render purple icons.

Available icons relevant to chip stories (from `src/components/DsIcon/icon-names.ts`): `close` (X for removable), `arrow-right` (trailing chevron — Figma uses a custom right-pointing back-arrow but `arrow-right` is the closest match), `boxes` (placeholder for the Figma "column" left-icon glyph in default M chips). Story authors may pick more semantic icons if the use case warrants (e.g. `tag`, `filter-a`, `filter-b`).

### Existing Code to Reuse

| Artifact | Path | Reuse For |
|---|---|---|
| Wrapper pattern reference | `src/components/DsTextarea/DsTextarea.vue` | inheritAttrs/withDefaults/defineEmits + scoped CSS scaffold |
| Chip-state-style reference | `src/components/DsSelect/DsSelect.vue:296-460` | Idle/hover/disabled CSS class modifier patterns; `:deep()` strip-PrimeVue-internal-style approach |
| Removable button pattern | `src/components/DsSelect/DsSelect.vue:209-220` | `<span role="button" tabindex="0" @keydown.enter.prevent @keydown.space.prevent>` for keyboard activation (we'll use `<button>` instead — semantically correct) |
| Focus-visible ring pattern | `docs/component-addition-guide.md:182` | `focus-visible:outline-2 focus-visible:outline-offset-2` style — translate to scoped CSS |
| AI KB entry structure | `docs/ai-guidelines/ds-textarea.md` | Section ordering, table formats, JSDoc-style props table |
| AI KB index | `docs/ai-guidelines/index.md:23-33, 84-134` | Component Inventory table + Figma matching guide format |
| Component addition guide | `docs/component-addition-guide.md` | Repeatable checklist enforcement |

### Files to Create

- `src/components/DsChip/DsChip.vue`
- `src/components/DsChip/DsChip.stories.ts`
- `src/components/DsChip/DsChip.test.ts`
- `src/components/DsChip/index.ts`
- `docs/ai-guidelines/ds-chip.md`

### Files to Modify

- `src/index.ts` — add DsChip export (and audit DsSelect re-export — see Task 1.5)
- `docs/ai-guidelines/index.md` — add DsChip to inventory + matching guide

### Files NOT Changed

- Theme preset (`src/theme/ds-preset.ts`) — DsChip uses existing PrimeVue tokens only
- Other component files (DsButton, DsTextarea, etc.) — DsChip is self-contained
- `package.json` — no new dependencies

### Anti-Patterns to Avoid

- **Do NOT** use PrimeVue Chip's built-in `removable` prop — its default close icon styling does not match Figma's 18px Exit glyph and is harder to keyboard-target consistently. Render our own `<button class="ds-chip__remove">` instead.
- **Do NOT** add a `pressed` or `selected-handler` prop — `type="selected"` is purely visual; selection toggling is the consumer's responsibility (wrap in their own `<button>` if interactive).
- **Do NOT** hardcode hex colors in scoped CSS — always reference `--p-*` tokens. Verify by grepping the final file for `#` before merging.
- **Do NOT** use `:focus` for the removable button focus ring — must be `:focus-visible` (UX-DR8).
- **Do NOT** put the chip itself in the tab order (no `tabindex="0"` on root). Only the X button is focusable. Selected chips that need to be toggleable should be wrapped by the consumer in a `<button>`.
- **Do NOT** swallow `$attrs` — pass them through to PrimeVue Chip via `v-bind="$attrs"` (FR9). Test this with the passthrough test (Task 6.9).
- **Do NOT** add a `<style>` non-scoped block (the DsSelect-style overlay-styling block) — DsChip has no teleported overlay. Scoped `<style scoped>` is sufficient.
- **Do NOT** change DsSelect or other Phase 2 components in this story. The DsSelect barrel export audit (Task 1.5) is a one-line additive fix only.
- **Do NOT** mutate the chip's own visibility on `@remove` — emit and let the consumer unmount. This keeps the component stateless and consistent with the rest of the library (per architecture §Anti-Patterns "no state management").

### Previous Story Intelligence

**From Story 6.3 (DsSelect Advanced Variants) — most recent completed story, dated 2026-04-17:**
- PrimeVue 4.x Select does NOT have a `multiple` prop — the dev had to import a separate `MultiSelect`. **Verify PrimeVue Chip's actual API before assuming behavior** (the most recent surprise of this kind). Specifically confirm:
  - `removable` prop exists on PrimeVue Chip (it does — but we're not using it).
  - `remove` event exists.
  - Default slot accepts arbitrary content (it does).
  - `pt` API is available (it is, though we won't need it heavily).
- Non-scoped CSS is required for PrimeVue overlays — but Chip has no overlay, so **stick with `<style scoped>` only**. Do not add a non-scoped block out of habit.
- The DsSelect work added 11 tests; total project test count is now 306 (per Story 6.3 completion notes). Your additions should bring the total to ~320–330. If a PrimeVue version bump or earlier change pushed the baseline elsewhere, capture the new baseline in the Completion Notes.

**From Story 6.1 (DsTextarea):**
- Biome is strict about import order — `npm run lint` will fail loudly if imports are out of order. Run lint before declaring the task done.
- The `<style scoped>` + `:deep()` selector pattern works reliably for stripping PrimeVue defaults. Use it for the chip's `:deep(.p-chip)` overrides.
- `useId()` from Vue 3.5+ is available — but DsChip does not need it (no label/input pairing).

**From Story 6.2 (DsSelect Core Variants):**
- The barrel export `src/index.ts` is a known recurring miss across stories — DsSelect is currently NOT exported from `src/index.ts` despite being listed in the AI KB index and shipped two stories ago. **Task 1.5 explicitly catches this drift.** Verify the alphabetical position you insert into is correct: current order in HEAD is `DsButton, DsIcon, DsIconButton, DsInputText, DsLink, DsTextarea, dsPreset/dsTheme`. Inserting DsChip alphabetically: between `DsButton` and `DsIcon`. Inserting DsSelect (if missing): between `DsLink` and `DsTextarea`.

### Git Intelligence (Recent Commits)

```
d20a962 story 6.3
66b75a4 story 6.2
6ad1e82 story 6.1
2f67c65 add epics for phase 2
e9bed4d phase 2 specs sync
```

Story 7.1 starts a new epic (Epic 7 — Display Components). No prior chip work exists; this is the first chip implementation. The previous three commits all follow the pattern: one story = one commit titled `story X.Y`. Maintain the same commit style.

### Latest Tech Notes

- **Vue**: `^3.5.30` — `defineModel<T>()`, `useId()`, `withDefaults` generic syntax all available.
- **PrimeVue**: `^4.5.4` — Chip component path `primevue/chip`. Default slot, `image`, `icon`, `label`, `removable`, `removeIcon` props; `removeicon` slot; `remove` event. We use only `v-bind="$attrs"` passthrough + the default slot.
- **Vitest**: `^4.1.2` — `mount` + `@vue/test-utils` `^2.4.6`.
- **Biome**: `^2.4.9` — strict import order; run `npm run lint` before commit.
- **Storybook**: `@storybook/vue3-vite` — see existing component stories for the `Meta`/`StoryObj` import pattern.

### Project Structure Notes

- File layout matches architecture §Project Structure (`src/components/DsChip/{DsChip.vue, DsChip.stories.ts, DsChip.test.ts, index.ts}`).
- AI KB at `docs/ai-guidelines/ds-chip.md` extends the existing 7-entry directory.
- Per CLAUDE.md, place any temporary/debug artifacts in `./tmp/` (e.g., scratch screenshots). Do NOT pollute the component directory with debug files.

### References

- [Source: _bmad-output/planning-artifacts/epics-phase2.md#Story 7.1] — original BDD acceptance criteria
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#FR6] — DsChip variants + removable behavior requirement
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#NFR8] — Keyboard accessibility for removable chips + focus management
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#FR9, FR10, FR11, FR12] — PrimeVue passthrough, theme parity, TypeScript types, prop conventions
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Architecture] — thin wrapper pattern with `inheritAttrs: false` + `v-bind="$attrs"`
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure] — co-located file structure
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns] — `Ds` prefix, PascalCase component names
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Component Strategy] — DsChip wraps PrimeVue Chip, S/M sizes, Default/Selected/Disabled variants
- [Source: docs/component-addition-guide.md] — repeatable component addition checklist
- [Source: docs/ai-guidelines/ds-textarea.md] — AI KB entry structure to mirror
- [Source: docs/ai-guidelines/index.md] — Component Inventory + Figma matching guide format
- [Source: src/components/DsTextarea/DsTextarea.vue] — wrapper scaffold reference
- [Source: src/components/DsSelect/DsSelect.vue] — type-modifier CSS pattern + `:deep()` PrimeVue strip pattern
- [Source: src/components/DsIcon/icon-names.ts] — available icon names for stories
- [Source: Figma node `2014:9915`] — Chips category (master variants for D/M/S × types)
- [Source: _bmad-output/implementation-artifacts/6-3-dsselect-advanced-dropdown-variants.md] — most recent story for git/test/baseline context

## Dev Agent Record

### Agent Model Used

claude-opus-4-7[1m]

### Debug Log References

- `npm test` — full suite 330 tests passing (was 306 at branch HEAD; +24 new DsChip tests)
- `npm run lint` — Biome clean (47 files)
- `npm run build` — vue-tsc + vite build succeed; `DsChip` present in `dist/index.js` and `dist/components/DsChip/DsChip.vue.d.ts`
- `npm run build-storybook` — succeeded, `DsChip.stories` chunk produced in `storybook-static/assets`
- UI caveat: I could not visually verify each story in a live browser — the Chrome extension was not connected from this environment. Story compiles via Storybook production build and all unit tests pass; a human reviewer should still click through stories in both light and dark themes.

### Completion Notes List

- Implemented `src/components/DsChip/DsChip.vue` as a thin PrimeVue Chip wrapper with `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` (FR9). All three types × two sizes styled via scoped CSS class modifiers; PrimeVue's internal `.p-chip` background/padding stripped via `:deep()` so the wrapper owns visual properties.
- Did NOT use PrimeVue Chip's built-in `removable` prop — rendered a custom `<button class="ds-chip__remove">` to own the 18px X icon, keyboard activation, and focus-visible ring (per story Anti-Patterns).
- `disabled` aliases to `type='not-clickable'` via a computed `effectiveType`. Verified by tests (disabled+selected still resolves to not-clickable).
- Task 1.5 AUDIT resolved: `DsSelect` was indeed missing from `src/index.ts`. Added both `DsChip` and `DsSelect` barrel exports in alphabetical order (between DsButton/DsIcon and DsLink/DsTextarea respectively).
- `RemovableList` story demonstrates the canonical `nextTick + ref array + .ds-chip__remove focus()` pattern for focus management after removal (NFR8).
- Focus-visible ring uses `outline: 2px solid var(--p-purple-800); outline-offset: 2px;` on the X button; `:focus` (mouse) does not show the ring — explicit `outline: none` on plain `:focus`.
- Test count baseline updated to **330** (was 306 at branch HEAD, +24 new DsChip tests).

### File List

Created:
- `src/components/DsChip/DsChip.vue`
- `src/components/DsChip/DsChip.stories.ts`
- `src/components/DsChip/DsChip.test.ts`
- `src/components/DsChip/index.ts`
- `docs/ai-guidelines/ds-chip.md`

Modified:
- `src/index.ts` — added `DsChip` and `DsSelect` barrel exports (DsSelect was missing)
- `docs/ai-guidelines/index.md` — added `DsChip` to import example, Component Inventory, and Figma matching guide
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — story status ready-for-dev → review
- `_bmad-output/implementation-artifacts/7-1-dschip-component.md` — this story file (tasks checked, Dev Agent Record filled)

### Change Log

| Date | Change | Author |
|---|---|---|
| 2026-04-17 | Story 7.1 DsChip component implementation — wrapper, styles, tests, stories, AI KB. Also fixed DsSelect barrel export drift. | Dev Agent (claude-opus-4-7[1m]) |
| 2026-04-17 | Code review follow-up patches: hide X button when disabled/not-clickable (+ aria-disabled on root); drop redundant keydown handlers (native button covers Enter/Space → click); remove dead `:deep(.p-chip)` CSS block; Not-clickable M now `border: none` to match Figma 26px height; empty-slot VNode check (`hasSlotContent`) to suppress stray wrappers and whitespace-only slots; `RemovableList` + AI KB now key chip refs by stable id (fixes stale-index bug); `AllVariantsGrid` hover CSS scoped under a decorator wrapper; corrected AI KB icon names (`boxes` → `column-view`, `arrow-right` → `nav-arrow-down`); added 18px icon assertion, aria-disabled, empty-slot, and bubble-plus-emit tests. Test count now 426 (was 404). | Dev Agent (claude-opus-4-7[1m]) post-review |
| 2026-04-17 | Story status review → done. | SM (Bob) |

