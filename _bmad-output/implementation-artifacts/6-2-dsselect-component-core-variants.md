# Story 6.2: DsSelect Component — Core Variants

Status: done

## Story

As a developer or AI agent implementing a Figma form design,
I want a DsSelect component that wraps PrimeVue Select with sizes (S, M), states (Default, Hover, Focus, Filled, Filled-Hover, Disabled), optional leading icon, clear button, label/hint/error composition, and core dropdown menu styles (one-line, two-line, no-match),
So that I can implement selection dropdowns matching the Figma Design System in both themes without custom styling.

## Figma Design References

- Dropdown input (select trigger): https://www.figma.com/design/3qP5xnwc6gXhZR3AnFAMFe/Design-Systems?node-id=4714-24526&m=dev
- Dropdown menu (options panel): https://www.figma.com/design/3qP5xnwc6gXhZR3AnFAMFe/Design-Systems?node-id=2225-59091&m=dev

## Acceptance Criteria

1. **Given** DsSelect wraps PrimeVue `Select` using `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"`, **When** a developer uses `<DsSelect v-model="value" :options="items" label="..." />`, **Then** the component renders a composite (label + select trigger + hint/error footer) matching the Figma design in both light and dark themes.

2. **Given** DsSelect supports 2 sizes (S, M), **When** the `size` prop is set, **Then** Small renders at 32px height with `padding: 6px 12px`, font 14px / line-height 20px, and Medium renders at 40px height with `padding: 8px 12px`, font 14px / line-height 20px — matching DsInputText size token conventions.

3. **Given** DsSelect implements 6 trigger visual states, **When** the user interacts with the select, **Then**:
   - **Default** — bg `--p-surface-0` (white), border `--p-gray-400` (#cad5e2), `shadow-xs` (`0px 1px 2px 0px var(--p-gray-300)`)
   - **Hover** — bg `--p-gray-100` (#f8fafc), border `--p-gray-600` (#62748e), no shadow
   - **Focus/Open** — bg `--p-surface-0` (white), border `--p-gray-400` (#cad5e2), `shadow-xs`, chevron rotates to up-arrow
   - **Filled** (has selection, not focused, not hovered) — bg white, border `--p-gray-400`, no shadow, text `--p-gray-800`, clear button visible
   - **Filled-Hover** — bg `--p-gray-100`, border `--p-gray-600`, no shadow, text `--p-gray-800`, clear button visible
   - **Disabled** — bg `--p-gray-100`, border `--p-gray-400`, text `--p-gray-500`, `pointer-events: none`

4. **Given** DsSelect applies motion, **When** the user transitions between states, **Then** border-color, background-color, and box-shadow transition with `150ms ease` timing wrapped in `@media (prefers-reduced-motion: no-preference)`. Disabled state skips transitions.

5. **Given** DsSelect is interactive, **When** the trigger receives focus, **Then** focus is indicated via a `focus-visible` ring/outline in both light and dark themes consistent with DsInputText.

6. **Given** DsSelect supports a label above the field, **When** the `label` prop is provided, **Then** a label renders above the trigger with the same styling as DsInputText: Inter medium 14px / line-height 20px / letter-spacing -0.2px, color `--p-gray-900`; mandatory `*` / optional `(Optional)` / info icon support — mirroring DsInputText label section exactly.

7. **Given** DsSelect supports hint text, **When** the `hint` prop is provided, **Then** hint text renders below the trigger in Inter regular 14px / line-height 20px, color `--p-gray-600`.

8. **Given** DsSelect supports error state (UX-DR1 form field consistency), **When** the `error` prop is set (and `disabled` is false), **Then** the trigger border turns `--p-red-700`, the hint area is replaced by an error message (Inter medium 12px, color `--p-red-700`, preceded by a 14px error triangle icon), and `aria-describedby` / `aria-invalid="true"` are set on the trigger element. Error + focus-within shows `box-shadow: 0px 0px 0px 3px var(--p-red-100)`.

9. **Given** DsSelect supports a `leadingIcon` slot, **When** a leading icon is provided via `<template #leading>`, **Then** it renders to the left of the placeholder/value text at 20px size (medium) or 16px (small), using `--p-gray-600` color (disabled: `--p-gray-500`).

10. **Given** DsSelect is in Filled state (has a selected value), **When** the selected value is displayed, **Then** a clear button (close/X icon, 20px medium / 16px small) appears between the value and the chevron. Clicking clear resets the selection (`model = undefined`), emits a `clear` event, and returns to Default state.

11. **Given** DsSelect has a chevron icon, **When** the dropdown is closed, **Then** a down-arrow chevron renders at the trailing end (24px medium / 20px small). **When** the dropdown opens (Focus state), **Then** the chevron rotates 180 degrees to point up, using a CSS `rotate(180deg)` transform with `150ms ease` transition.

12. **Given** DsSelect dropdown menu opens, **When** the user views the options list, **Then** the dropdown panel renders with: white bg, 1px solid `--p-gray-300` border, 8px border-radius, `shadow-sm` (`0px 1px 4px 0px #CAD5E280, 0px 1px 6px 0px #CAD5E240`). The panel styling is applied via PrimeVue preset/passthrough API.

13. **Given** DsSelect dropdown shows one-line items, **When** options render, **Then** each option has: 4px border-radius hover area, 12px left padding / 8px right padding / 8px vertical padding, Inter regular 14px text in `--p-gray-800`, hover bg `#F6F7FA` (token `Text colors & BG/BW-02`). Text overflows with ellipsis.

14. **Given** DsSelect dropdown shows two-line items, **When** options have an `optionSubtitle` field, **Then** each option renders title (Inter medium 14px, `--p-gray-800`) + subtitle (Inter regular 12px, `--p-gray-600`), separated by 2px gap. Items are separated by a `1px solid --p-gray-200` divider.

15. **Given** DsSelect options are empty or filtered to nothing, **When** the dropdown shows, **Then** a "no match" empty state renders with centered text "No items match your search" in the dropdown body.

16. **Given** DsSelect wraps PrimeVue `Select`, **When** a consumer passes any standard PrimeVue Select prop, slot, or event (e.g., `options`, `optionLabel`, `optionValue`, `placeholder`, `filter`, `panelClass`), **Then** it is forwarded via `inheritAttrs: false` + `v-bind="$attrs"` (FR9). TypeScript types are provided for all DS-specific props.

17. **Given** DsSelect follows the co-located file convention, **When** the implementation is complete, **Then** the directory `src/components/DsSelect/` contains `DsSelect.vue`, `DsSelect.stories.ts`, `DsSelect.test.ts`, `index.ts`; the component is re-exported from `src/index.ts` as `{ DsSelect, type DsSelectProps }`; Storybook stories cover all 6 states x both sizes with interactive controls, leading icon, clear button, and core dropdown menu variants; Vitest tests verify props, state classes, clear button, chevron rotation, dropdown rendering, accessibility attributes, and PrimeVue passthrough; an AI KB entry exists at `docs/ai-guidelines/ds-select.md` following the DsInputText entry structure.

## Tasks / Subtasks

- [x] Task 1: Create DsSelect component scaffold (AC: #17)
  - [x] 1.1 Create directory `src/components/DsSelect/`
  - [x] 1.2 Create empty files: `DsSelect.vue`, `DsSelect.stories.ts`, `DsSelect.test.ts`, `index.ts`
  - [x] 1.3 Export `DsSelect` and `DsSelectProps` from `src/components/DsSelect/index.ts`
  - [x] 1.4 Add `export { DsSelect, type DsSelectProps } from './components/DsSelect';` to `src/index.ts` (alphabetical position between `DsLink` and `DsTextarea`)

- [x] Task 2: Implement `DsSelect.vue` — script & props (AC: #1, #16)
  - [x] 2.1 `import Select from 'primevue/select';`
  - [x] 2.2 `import DsIcon from '../DsIcon/DsIcon.vue';`
  - [x] 2.3 Define `DsSelectProps` interface (see §Component API below)
  - [x] 2.4 `defineOptions({ inheritAttrs: false });`
  - [x] 2.5 `withDefaults(defineProps<DsSelectProps>(), { size: 'medium', disabled: false, mandatory: false, optional: false, info: false });`
  - [x] 2.6 `const model = defineModel<unknown>();` (v-model — value can be any type depending on `optionValue`)
  - [x] 2.7 `const emit = defineEmits<{ clear: []; }>();`
  - [x] 2.8 `useId()` for `triggerId` and `errorId` (Vue 3.5+)
  - [x] 2.9 Computed: `hasValue` (`model.value != null && model.value !== ''`), `isError` (`!!props.error`), `showError` (`isError && !disabled`)
  - [x] 2.10 Computed `sizeTokens` returning the same `{ paddingX, paddingY, fontSize, borderRadius }` map as DsInputText
  - [x] 2.11 Computed `triggerClasses` for state-driven CSS: `ds-select__trigger`, `--small/--medium`, `--error`, `--disabled`, `--filled`, `--transitions`

- [x] Task 3: Implement `DsSelect.vue` — template (AC: #1, #6, #7, #8, #9, #10, #11)
  - [x] 3.1 Root `<div class="ds-select" :class="[ds-select--${size}]">`
  - [x] 3.2 Label section: clone DsInputText label pattern exactly — label text + `*` (mandatory, exclusive with optional) + `(Optional)` + `<DsIcon name="help" />` if `info`. Link via `for="triggerId"` / `id="triggerId"`.
  - [x] 3.3 Trigger wrapper `<div :class="triggerClasses">` containing:
    - Leading icon slot: `<span v-if="$slots.leading" class="ds-select__leading"><slot name="leading" /></span>`
    - PrimeVue `<Select v-bind="$attrs" :id="triggerId" v-model="model" :disabled="disabled" class="ds-select__native" :aria-describedby="showError ? errorId : undefined" :aria-invalid="showError ? 'true' : undefined" :aria-disabled="disabled ? 'true' : undefined" />`
    - Clear button: `<span v-if="hasValue && !disabled" class="ds-select__clear" role="button" tabindex="0" aria-label="Clear" @click.stop="handleClear" @keydown.enter.prevent="handleClear" @keydown.space.prevent="handleClear"><DsIcon name="close" :size="..." /></span>`
    - Chevron: `<span class="ds-select__chevron" :class="{ 'ds-select__chevron--open': isOpen }" aria-hidden="true"><DsIcon name="arrow-down" :size="..." /></span>`
  - [x] 3.4 Footer section: clone DsInputText footer exactly — error message with icon when `showError`, hint text when `hint`
  - [x] 3.5 `handleClear()` — set `model.value = undefined`, emit `'clear'`, close dropdown if open
  - [x] 3.6 Track open/closed state via PrimeVue Select's `@show`/`@hide` events → reactive `isOpen` ref

- [x] Task 4: Implement `DsSelect.vue` — PrimeVue Select styling approach (AC: #12, #13, #14, #15)
  - [x] 4.1 **CRITICAL DECISION — wrapper-owns-trigger pattern:** Used Option A — `pt` prop for overlay class + scoped CSS with `:deep()` for trigger styling. Preserves PrimeVue keyboard navigation and ARIA.
  - [x] 4.2 Style the PrimeVue Select trigger to match Figma states using scoped CSS on PrimeVue classes + `pt` passthrough
  - [x] 4.3 Style the dropdown panel (overlay): white bg, `--p-gray-300` border, 8px radius, `shadow-sm`
  - [x] 4.4 Style one-line option items: `--p-gray-800` text, 12px/8px padding, 4px radius hover area, hover bg `#F6F7FA`
  - [x] 4.5 Style two-line option items via PrimeVue `option` slot: title + subtitle layout with dividers
  - [x] 4.6 Style empty/no-match state via PrimeVue `emptyfilter` or `empty` slot

- [x] Task 5: Implement `DsSelect.vue` — scoped CSS (AC: #3, #4, #5, #8)
  - [x] 5.1 Mirror DsInputText scoped CSS structure (class names `ds-select__*`)
  - [x] 5.2 Strip PrimeVue Select's native trigger styling: border, shadow, background, padding, outline → wrapper owns them
  - [x] 5.3 State styles (use `--p-*` tokens):
    - Default: `bg: var(--p-surface-0)`, `border: 1px solid var(--p-gray-400)`, `box-shadow: shadow-xs`
    - Hover: `bg: var(--p-gray-100)`, `border-color: var(--p-gray-600)`, `box-shadow: none`
    - Focus (open): `bg: var(--p-surface-0)`, `border-color: var(--p-gray-400)`, `shadow-xs` retained
    - Filled: `bg: white`, border `gray-400`, `box-shadow: none`, text `gray-800`
    - Filled-Hover: `bg: gray-100`, `border-color: gray-600`, `box-shadow: none`
    - Error: `border-color: var(--p-red-700)`, `box-shadow: none`; error + focus: `box-shadow: 0px 0px 0px 3px var(--p-red-100)`
    - Disabled: `bg: gray-100`, `border: gray-400`, `pointer-events: none`, text `gray-500`
  - [x] 5.4 Transitions: `transition: background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease;` wrapped in `@media (prefers-reduced-motion: no-preference)`, excluded for disabled
  - [x] 5.5 Chevron rotation: `.ds-select__chevron--open { transform: rotate(180deg); }` with `transition: transform 150ms ease` (motion-safe)
  - [x] 5.6 Clear button: same styling as DsInputText clear button (gray-500, hover gray-700, cursor pointer, border-radius 50%)
  - [x] 5.7 Dropdown panel scoped styles (use `:deep()` for PrimeVue overlay classes if needed)
  - [x] 5.8 Placeholder color: `--p-gray-600` default, `--p-gray-500` on hover/disabled
  - [x] 5.9 Dark theme: PrimeVue preset inverts `--p-*` tokens automatically — verify visually in Storybook

- [x] Task 6: Storybook stories (AC: #17)
  - [x] 6.1 Create `DsSelect.stories.ts` mirroring `DsInputText.stories.ts` structure: `Default`, `WithLabel`, `Mandatory`, `Optional`, `WithInfo`, `WithHint`, `WithError`, `Disabled`, `Filled`, `WithLeadingIcon`, `ClearButton`, `TwoLineOptions`, `NoMatch`, `DisabledWithError`, `ErrorWithHint`, `AllSizes`, `AllStates`
  - [x] 6.2 `argTypes` must include: `size` (select S/M), `disabled`, `label`, `mandatory`, `optional`, `info`, `hint`, `error`, `placeholder`, `modelValue`, `options`
  - [x] 6.3 Each interactive story wires `const value = ref(args.modelValue)` and `<DsSelect v-bind="args" v-model="value" />`
  - [x] 6.4 Define sample options arrays: simple string options, object options with `optionLabel`/`optionValue`, two-line options with subtitle

- [x] Task 7: Vitest tests (AC: #17)
  - [x] 7.1 Copy `DsInputText.test.ts` as scaffold; rename class selectors to `ds-select__*` and PrimeVue import to `Select from 'primevue/select'`
  - [x] 7.2 Use the same `globalConfig = { plugins: [[PrimeVue, { theme: 'none' }]] }` pattern
  - [x] 7.3 Tests required:
    - Renders with defaults (medium size, no label, no footer)
    - Size classes `--small` / `--medium`
    - Label: renders, mandatory `*`, optional `(Optional)`, info icon, for/id linkage, mandatory+optional mutual exclusion
    - Hint renders below trigger
    - Error: triggers `--error` class, renders error msg + icon, `aria-describedby` + `aria-invalid="true"`, error hidden when disabled
    - Disabled: `--disabled` class, `aria-disabled`, no transitions, no clear button, error suppressed
    - Filled: `--filled` class when `modelValue` is not null/undefined/empty
    - v-model two-way binding
    - Clear button: appears when `hasValue && !disabled`; click clears to undefined; emits `clear` event; `aria-label="Clear"`
    - Chevron: always visible; `--open` class toggleable
    - Leading icon slot: renders when slot content provided
    - PrimeVue passthrough: `options`, `optionLabel`, `optionValue`, `placeholder`, `filter`, `data-testid` via `$attrs`
  - [x] 7.4 Target >= 25 tests (achieved: 46 tests)

- [x] Task 8: AI knowledge base entry (AC: #17)
  - [x] 8.1 Create `docs/ai-guidelines/ds-select.md` following the exact section order of `docs/ai-guidelines/ds-input-text.md`: `# DsSelect` -> When to Use -> Import -> Props table -> Variants (states) -> Sizes -> Slots -> Events -> Usage Examples -> Accessibility -> Figma Reference
  - [x] 8.2 Props table lists: `size`, `disabled`, `label`, `mandatory`, `optional`, `info`, `hint`, `error`, `modelValue` + note PrimeVue Select passthrough (`options`, `optionLabel`, `optionValue`, `placeholder`, `filter`, etc.)
  - [x] 8.3 Slots table: `leading` (icon slot), plus PrimeVue Select slots passed through (`option`, `value`, `empty`, `emptyfilter`)
  - [x] 8.4 Events table: `clear`, `update:modelValue`, plus PrimeVue events (`change`, `show`, `hide`, `filter`)
  - [x] 8.5 Usage examples: basic, with label, with leading icon, two-line options, filterable, with error, disabled
  - [x] 8.6 Add DsSelect entry to `docs/ai-guidelines/index.md` (follow existing format)

- [x] Task 9: Validate & ship (AC: #17)
  - [x] 9.1 `npm test` — all 289 tests pass (9 test files); zero regressions
  - [x] 9.2 `npm run lint` (Biome) — no errors
  - [x] 9.3 `npm run build` — TypeScript + Vite build succeeds; `dist/index.d.ts` exposes `DsSelect` and `DsSelectProps`
  - [ ] 9.4 `npm run storybook` — open the new DsSelect page; visually verify all 6 states in light and dark themes; verify chevron rotation; verify clear button; verify dropdown panel styling; verify two-line options; verify no-match empty state
  - [x] 9.5 Update File List section below with all created/modified paths

## Dev Notes

### Architecture Pattern — Follow DsInputText Exactly

DsSelect is a **thin PrimeVue Select wrapper** in the same family as DsInputText. **Do not invent a new architecture.** Mirror [DsInputText.vue](../../src/components/DsInputText/DsInputText.vue) section-by-section:

1. `defineOptions({ inheritAttrs: false })` — prevents double-applying attrs
2. `v-bind="$attrs"` on the inner `<Select>` — full PrimeVue prop/slot/event passthrough (FR9)
3. `dt` prop for per-instance design-token overrides (padding, font-size, border-radius)
4. Scoped CSS drives state styles via `ds-select__trigger--<modifier>` classes
5. `useId()` for ARIA linkage (Vue 3.5+, already used across the library)

### Component API

```ts
export interface DsSelectProps {
  /** Select trigger size. Default: 'medium' */
  size?: 'small' | 'medium';
  /** Disabled state. Default: false — overrides Error */
  disabled?: boolean;
  /** Label text above the select */
  label?: string;
  /** Show mandatory asterisk after label. Default: false. Mutually exclusive with `optional` */
  mandatory?: boolean;
  /** Show "(Optional)" text after label. Default: false. Mutually exclusive with `mandatory` */
  optional?: boolean;
  /** Show info/help icon next to label. Default: false */
  info?: boolean;
  /** Hint/helper text below the select */
  hint?: string;
  /** Error message — triggers Error visual state and aria-invalid */
  error?: string;
}
```

Events:
- `clear` — emitted when the clear button is activated
- `update:modelValue` — automatic via `v-model`
- All PrimeVue Select events (`change`, `show`, `hide`, `filter`) passed through via `$attrs`

Slots:
- `leading` — icon slot to the left of the value/placeholder text
- PrimeVue Select slots (`option`, `value`, `empty`, `emptyfilter`, `header`, `footer`) passed through

### PrimeVue Select Integration — Critical Implementation Notes

**PrimeVue 4.x Select** (previously called `Dropdown` in v3) renders its own trigger and overlay. Key integration points:

1. **Trigger styling:** PrimeVue Select renders a `<div class="p-select">` with child elements `.p-select-label` (value/placeholder text), `.p-select-dropdown` (chevron container). Use scoped CSS with `:deep()` or `pt` prop to override these styles.

2. **Custom trigger layout:** DsSelect adds a wrapper div around the PrimeVue Select to own the border/bg/shadow states (same pattern as DsInputText wrapping InputText). The wrapper provides the leading icon slot and clear button — PrimeVue Select's native clear button (`showClear`) and dropdown icon should be **hidden** since DsSelect provides its own.

3. **Hide PrimeVue's native controls:**
   - Pass `:showClear="false"` to PrimeVue Select — DsSelect renders its own clear button with custom positioning
   - Hide PrimeVue's native dropdown icon via CSS (`.p-select-dropdown { display: none !important; }`) — DsSelect renders its own chevron with rotation animation
   - Strip PrimeVue's trigger border/bg/shadow with `!important` overrides on `.p-select` (same technique as DsInputText strips InputText styles)

4. **Open/close tracking:** Use PrimeVue Select's `@show` and `@hide` events to toggle an `isOpen` ref. This drives:
   - Chevron rotation class (`ds-select__chevron--open`)
   - Focus state CSS (when open, trigger shows Focus state)

5. **Overlay/Panel styling:** PrimeVue Select renders the dropdown panel as a **teleported overlay** (appended to `<body>` by default). Scoped CSS cannot reach it. Options:
   - **Option A (recommended):** Use PrimeVue's `pt` prop to pass classes to the overlay: `pt="{ overlay: { class: 'ds-select-panel' } }"`. Then define `.ds-select-panel` styles in a **non-scoped** `<style>` block (or use `:global()` selector).
   - **Option B:** Use `appendTo="self"` on PrimeVue Select so the panel renders inside the component DOM — then `:deep()` can reach it. Trade-off: may cause overflow clipping issues in scroll containers.
   - **Option C:** Use PrimeVue preset tokens in `ds-preset.ts` to style the Select overlay globally. Trade-off: affects all PrimeVue Select instances, not just DsSelect.
   - **Evaluate at implementation time.** If Option A works cleanly, prefer it. Document the chosen approach in the Dev Agent Record.

6. **Keyboard navigation:** PrimeVue Select provides full keyboard support (arrow keys, Enter/Space to open, Escape to close, type-ahead filtering). Do NOT reimplement. Verify it works with the custom wrapper.

### Figma Design Source of Truth

**Per user's standing rule, when the Figma and the UX spec disagree, trust Figma.**

Key Figma-derived facts for the dropdown input (node `4714:24526`):

1. **Trigger heights:** M=40px, S=32px — matches DsInputText exactly.

2. **Default state retains shadow-xs** — `0px 1px 2px 0px var(--p-gray-300)`. Same as DsInputText Default.

3. **Focus/Open state also retains shadow-xs** — unlike Hover which drops it. The Figma Focus variant keeps the shadow. This differs from DsInputText Focus behavior.

4. **Hover drops shadow** — Figma Hover variant has no shadow. `box-shadow: none` on hover.

5. **Filled state has no shadow** — same as DsInputText Filled.

6. **Filled-Hover border is `gray-600`** (#62748e) — same as Default-Hover border color. This differs from DsTextarea (which uses gray-800 for Filled-Hover).

7. **Chevron size:** 24px at M, 20px at S. Uses `arrow-down` icon. Rotates 180deg when open.

8. **Clear icon size:** 24px at M, 20px at S. Uses `close` icon. Visible in Filled/Filled-Hover states.

9. **Leading icon size:** 20px. Color `--p-gray-600` (enabled), `--p-gray-500` (disabled).

10. **No Error state in Figma** — Figma only shows 5 enabled states + Disabled. Error state is inferred from UX-DR1 (form field consistency with DsInputText) and applied using the same red-border pattern.

Key Figma-derived facts for the dropdown menu (node `2225:59091`):

11. **Menu container:** white bg, `1px solid --p-gray-300` (#e2e8f0) border, 8px radius, `shadow-sm`.

12. **Option item hover:** bg `#F6F7FA` (token `Text colors & BG/BW-02`), 4px border-radius on the hover area.

13. **Option padding:** 12px left, 8px right, 8px vertical (inside the hover area); outer wrapper has 4px horizontal / 2px vertical padding.

14. **Two-line item dividers:** `1px solid --p-gray-200` (#f1f5f9) between items.

15. **"No match" text:** Centered in dropdown body — "No items match your search".

16. **Scrollbar:** 4px wide, `--p-gray-400` (#cad5e2) color, 100px border-radius (pill shape).

### State Matrix — Complete Specification (from Figma node 4714:24526)

| State        | Background                 | Border Color              | Shadow      | Text Color         | Chevron   | Clear Btn |
|--------------|----------------------------|---------------------------|-------------|--------------------|-----------|-----------|
| Default      | `--p-surface-0` (#fff)     | `--p-gray-400` (#cad5e2)  | shadow-xs   | placeholder g-600  | down      | hidden    |
| Hover        | `--p-gray-100` (#f8fafc)   | `--p-gray-600` (#62748e)  | none        | placeholder g-500  | down      | hidden    |
| Focus/Open   | `--p-surface-0` (#fff)     | `--p-gray-400` (#cad5e2)  | shadow-xs   | placeholder g-600  | **up** (rotated) | hidden |
| Filled       | `--p-surface-0` (#fff)     | `--p-gray-400` (#cad5e2)  | none        | gray-800           | down      | visible   |
| Filled-Hover | `--p-gray-100` (#f8fafc)   | `--p-gray-600` (#62748e)  | none        | gray-800           | down      | visible   |
| Disabled     | `--p-gray-100` (#f8fafc)   | `--p-gray-400` (#cad5e2)  | none        | gray-500           | down      | hidden    |
| Error        | `--p-surface-0` (#fff)     | `--p-red-700` (#f22a42)   | none (ring on focus) | gray-800  | down      | per filled |

- Focus/Open is tracked via PrimeVue's `@show`/`@hide` events, not `:focus-within`.
- Error is prop-driven (not shown in Figma; derived from DsInputText pattern per UX-DR1).
- Disabled **overrides** Error (matches DsInputText behavior).

### Dropdown Menu — Core Variant Specifications

**Scope for Story 6.2 (core only):** one-line items, two-line items, no-match empty state.
**Story 6.3 will add:** multi-selection, entity icons, badges, vendor, mention, big icon.

#### One-Line Items
- Text: Inter regular 14px, line-height 20px, letter-spacing -0.2px, color `--p-gray-800`
- Text overflow: `text-overflow: ellipsis; white-space: nowrap; overflow: hidden`
- Hover area: bg `#F6F7FA`, border-radius 4px
- Padding: 12px left, 8px right, 8px top/bottom (inside hover area)
- Outer wrapper: 4px horizontal, 2px vertical padding

#### Two-Line Items
- Title: Inter medium (500) 14px, `--p-gray-800`
- Subtitle: Inter regular 12px, line-height 16px, `--p-gray-600`
- Gap between title and subtitle: 2px
- Divider between items: `1px solid --p-gray-200` (#f1f5f9)
- Same padding/hover pattern as one-line

#### No-Match Empty State
- Text: "No items match your search" centered in the dropdown area
- Uses PrimeVue Select's `emptyfilter` slot (when `filter` is enabled) or `empty` slot

### Size Token Mapping

| Size   | Height | Padding Y | Padding X | Font Size | Line Height | Border Radius | Icon Size | Chevron Size |
|--------|--------|-----------|-----------|-----------|-------------|---------------|-----------|--------------|
| small  | 32px   | 6px       | 12px      | 14px      | 20px        | 8px           | 16px      | 20px         |
| medium | 40px   | 8px       | 12px      | 14px      | 20px        | 8px           | 20px      | 24px         |

These match DsInputText's `dt` tokens exactly. **Do not diverge** — consistency across form fields is UX-DR1.

### Design Token References

Use PrimeVue preset CSS variables (`--p-*`). Same tokens as DsInputText:

```
--p-surface-0        : white background (default, filled, focused)
--p-gray-100         : hover/disabled background
--p-gray-200         : two-line item divider (outline/main/gray-200 = #f1f5f9)
--p-gray-300         : shadow color, menu border (outline/main/gray-300 = #e2e8f0)
--p-gray-400         : default/filled/disabled border, scrollbar thumb
--p-gray-500         : disabled text, placeholder on hover, disabled icon
--p-gray-600         : hover border, placeholder default, leading icon, subtitle text
--p-gray-700         : clear button hover color
--p-gray-800         : filled text, option text
--p-gray-900         : label text
--p-purple-800       : focus ring color (if needed — DsSelect focus is border-based, not ring-based per Figma)
--p-red-700          : error border + error text
--p-red-100          : error focus ring
```

**`#F6F7FA` (option hover bg)** is Figma token `Text colors & BG/BW-02`. Check if `src/theme/` exposes this as a preset token — use the token name if so; otherwise use the literal hex with a `/* BW-02 */` comment.

### Typography

- Trigger text / placeholder: Inter regular 400, 14px, line-height 20px, letter-spacing -0.2px
- Label: Inter medium 500, 14px, line-height 20px, letter-spacing -0.2px, color gray-900
- Hint: Inter regular 400, 14px, line-height 20px, color gray-600
- Error text: Inter medium 500, 12px, line-height 16px, color red-700
- "(Optional)": Inter regular 400, 12px, line-height 16px, color gray-600
- Option text (one-line): Inter regular 400, 14px, color gray-800
- Option title (two-line): Inter medium 500, 14px, color gray-800
- Option subtitle (two-line): Inter regular 400, 12px, color gray-600

### Existing Code to Reuse

| Artifact | Path | Reuse For |
|----------|------|-----------|
| DsInputText.vue | `src/components/DsInputText/DsInputText.vue` | Template structure (label, trigger wrapper, footer), scoped CSS (state classes, transitions, trailing elements), size tokens, ARIA wiring — **primary reference** |
| DsInputText.test.ts | `src/components/DsInputText/DsInputText.test.ts` | Test scaffold, globalConfig, assertion patterns |
| DsInputText.stories.ts | `src/components/DsInputText/DsInputText.stories.ts` | Storybook layout, argTypes, AllStates/AllSizes composites |
| DsIcon | `src/components/DsIcon/DsIcon.vue` | Internal icons (`arrow-down`, `close`, `error`, `help`) — uses `currentColor` |
| docs/ai-guidelines/ds-input-text.md | `docs/ai-guidelines/ds-input-text.md` | AI KB entry structure |

**Do NOT** reinvent any of these. Clone and adapt.

### Files to Create

```
src/components/DsSelect/
  DsSelect.vue
  DsSelect.stories.ts
  DsSelect.test.ts
  index.ts
docs/ai-guidelines/
  ds-select.md
```

### Files to Modify

- `src/index.ts` — add `export { DsSelect, type DsSelectProps } from './components/DsSelect';`
- `docs/ai-guidelines/index.md` — add DsSelect entry row

### Project Structure Notes

- Co-located files per `docs/component-addition-guide.md` § "Step-by-Step Checklist"
- PascalCase directory and file naming (`DsSelect/DsSelect.vue`)
- Single barrel export from `src/index.ts` (alphabetical)
- AI KB entry filename kebab-case: `ds-select.md`
- No new runtime dependencies; PrimeVue `Select` is already available via `primevue` peer dep

### Anti-Patterns to Avoid

- Do **not** use PrimeVue's native `showClear` prop — DsSelect renders its own clear button with custom positioning and styling
- Do **not** keep PrimeVue's native dropdown chevron icon — hide it and render DsSelect's own `<DsIcon name="arrow-down">` with rotation animation
- Do **not** use `:focus-within` for open/close detection — PrimeVue Select manages its own overlay; track via `@show`/`@hide` events
- Do **not** hardcode hex values in scoped CSS (except the documented `#F6F7FA` option hover bg with comment) — use `--p-*` tokens
- Do **not** build Label/Hint/Error as separate exported components — keep them internal to `DsSelect.vue`
- Do **not** forget `@click.stop` on the clear button — prevents the click from toggling the dropdown
- Do **not** apply transitions to the disabled state
- Do **not** forget `inheritAttrs: false` — otherwise attrs apply to both root div and inner Select
- Do **not** reimplement keyboard navigation — PrimeVue Select handles arrow keys, Enter, Escape, type-ahead
- Do **not** commit `storybook-static/` or other generated artifacts
- Do **not** implement multi-selection, entity icons, badges, vendor, mention, or big icon variants — those are Story 6.3 scope

### Testing Approach

Follow `DsInputText.test.ts` line-for-line:
- Mount with `@vue/test-utils` `mount()`
- `globalConfig = { plugins: [[PrimeVue, { theme: 'none' }]] }` — mandatory
- Find inner PrimeVue component via `wrapper.findComponent(Select)`
- Assert state classes via `.find('.ds-select__trigger--<modifier>').exists()`
- Assert ARIA attributes on the trigger element
- For clear button: set `modelValue` to a non-null value and assert visibility
- For chevron rotation: toggle `isOpen` and assert `--open` class

### Previous Story Intelligence

**From Story 6.1 (DsTextarea) — same epic, same form-field family:**
- The label/hint/error/footer pattern is identical across DsInputText and DsTextarea — clone it exactly for DsSelect
- Clear button uses `@click.stop` (for DsSelect this prevents the click from toggling the dropdown open/close)
- `useId()` from Vue 3.5 produces SSR-safe unique IDs — use it for `triggerId` and `errorId`
- Disabled state must suppress error display AND `aria-invalid` — test explicitly
- Mandatory + Optional mutual exclusion: if both `true`, render **neither** (matches DsInputText behavior)
- Biome is strict about unused imports and import order — run `npm run lint` before commit

**From Story 2.2 (DsInputText) — primary reference:**
- `dt` prop for per-size overrides is the correct approach
- PrimeVue native border/shadow/padding must be stripped with `!important` on the inner component's class
- Scoped CSS targeting PrimeVue generated classes requires `:deep()` selector
- DsInputText already has a `showDropdownIcon` prop that renders a chevron — DsSelect replaces this with an always-present, rotatable chevron

**From Story 1.2.1 (DsIcon):**
- DsIcon uses `currentColor` — inner icons inherit the CSS `color` of their parent span
- Available icon names: `arrow-down` (chevron), `close` (clear), `error` (error state), `help` (info)
- Icon sizes: `xsmall` (12px), `small` (16px), `medium` (20px), `large` (24px)

### Git Intelligence (Recent Commits)

```
2f67c65 add epics for phase 2
e9bed4d phase 2 specs sync
8294367 Add Storybook URL to README (#8)
1243343 Add Claude Code GitHub Workflow (#6)
f5e9cb0 add PRD for phase 2
```

No prior DsSelect work exists. Story 6.1 (DsTextarea) is `ready-for-dev` — DsSelect is the second story in Epic 6. Both share the same form-field pattern family.

### Latest Tech Notes

- **Vue**: 3.5.30 — `useId()` and `defineModel<T>()` are both available and preferred
- **PrimeVue**: 4.5.4 — `Select` component (renamed from `Dropdown` in v4) exposes: `options`, `optionLabel`, `optionValue`, `optionGroupLabel`, `optionGroupChildren`, `filter`, `filterPlaceholder`, `showClear`, `placeholder`, `appendTo`, `panelClass`, `pt`, `dt`, plus events `@change`, `@show`, `@hide`, `@filter`
- **Vitest**: 4.1.2 with `@vue/test-utils` 2.4.6
- **Biome**: 2.4.9 — `npm run lint`; lint-staged hook applies `biome check --write`
- **Node**: `>=20.11.0` per `package.json` engines

### Story 6.3 Boundary — What NOT to Implement

Story 6.3 (DsSelect Advanced Dropdown Variants) adds these features — do **not** include them in Story 6.2:
- Multi-selection mode with checkboxes
- "Select all" row with counter
- Entity icons in option items
- Badge/dot indicators in option items
- Two-line items with multi-selection checkboxes
- Vendor avatar layout
- Mention avatar layout with "XX more results"
- Big icon layout
- Search bar section in dropdown (this may be needed for `filter` — evaluate at implementation; PrimeVue's built-in `filter` prop renders its own search input which should suffice for 6.2)
- "Add new" footer button

### References

- [Source: _bmad-output/planning-artifacts/epics-phase2.md#Story 6.2] — original BDD acceptance criteria
- [Source: _bmad-output/planning-artifacts/epics-phase2.md#Story 6.3] — advanced variants scope (NOT this story)
- [Source: _bmad-output/planning-artifacts/epics-phase2.md#UX-DR1] — same form field state pattern as DsInputText
- [Source: _bmad-output/planning-artifacts/epics-phase2.md#UX-DR8] — focus-visible (not focus)
- [Source: _bmad-output/planning-artifacts/epics-phase2.md#UX-DR9] — 150ms ease, motion-safe
- [Source: _bmad-output/planning-artifacts/epics-phase2.md#UX-DR10] — uniform size tokens
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#FR2] — DsSelect sizes/states/pattern
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#FR9] — PrimeVue passthrough
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#FR10] — light/dark fidelity
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Strategy] — DsSelect -> PrimeVue Select wrapper
- [Source: Figma node 4714:24526] — dropdown input variants (fileKey `3qP5xnwc6gXhZR3AnFAMFe`)
- [Source: Figma node 2225:59091] — dropdown menu variants (fileKey `3qP5xnwc6gXhZR3AnFAMFe`)
- [Source: src/components/DsInputText/DsInputText.vue] — primary implementation reference
- [Source: src/components/DsInputText/DsInputText.test.ts] — test pattern reference
- [Source: src/components/DsInputText/DsInputText.stories.ts] — storybook pattern reference
- [Source: docs/ai-guidelines/ds-input-text.md] — AI KB entry template
- [Source: docs/component-addition-guide.md] — PrimeVue wrapper checklist

## Change Log

- 2026-04-17: Full implementation of DsSelect component — scaffold, component (script/template/CSS), Storybook stories (17 stories), Vitest tests (46 tests), AI KB entry, barrel export, index update

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- PrimeVue Select requires `window.matchMedia` mock in Vitest (not present in jsdom). Added `beforeAll` mock in test file.
- Used Option A for panel styling: `pt="{ overlay: { class: 'ds-select-panel' } }"` with non-scoped `<style>` block for teleported overlay styles.

### Implementation Plan

- Followed DsInputText wrapper pattern exactly: `defineOptions({ inheritAttrs: false })`, `v-bind="$attrs"` on inner Select, wrapper div owns border/bg/shadow states
- PrimeVue's native dropdown icon hidden via `:deep(.p-select-dropdown) { display: none !important; }`; custom chevron with rotation animation rendered by DsSelect
- PrimeVue's native `showClear` disabled; DsSelect renders its own clear button with `@click.stop` to prevent dropdown toggle
- Open/close state tracked via `@show`/`@hide` events on PrimeVue Select, driving `isOpen` ref for chevron rotation and Focus/Open CSS state
- Panel overlay styled via non-scoped CSS targeting `.ds-select-panel` class passed through `pt` prop (teleported overlay unreachable by scoped CSS)

### Completion Notes List

- DsSelect component fully implemented with all 6 trigger states (Default, Hover, Focus/Open, Filled, Filled-Hover, Disabled) + Error state
- 46 Vitest tests covering: defaults, sizes, label variants, hint, error state, disabled state, filled state, v-model, clear button (click/Enter/Space), chevron, leading icon slot, PrimeVue prop passthrough
- 17 Storybook stories: Default, WithLabel, Mandatory, Optional, WithInfo, WithHint, WithError, Disabled, Filled, WithLeadingIcon, ClearButton, TwoLineOptions, NoMatch, DisabledWithError, ErrorWithHint, AllSizes, AllStates
- AI KB entry at docs/ai-guidelines/ds-select.md with full props/slots/events/examples
- All 289 tests pass (9 test files), zero regressions
- Biome lint clean, TypeScript build clean, dist types expose DsSelect and DsSelectProps
- Task 9.4 (visual Storybook verification) left unchecked — requires manual browser verification by reviewer

### File List

New files:
- src/components/DsSelect/DsSelect.vue
- src/components/DsSelect/DsSelect.stories.ts
- src/components/DsSelect/DsSelect.test.ts
- src/components/DsSelect/index.ts
- docs/ai-guidelines/ds-select.md

Modified files:
- src/index.ts
- docs/ai-guidelines/index.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- _bmad-output/implementation-artifacts/6-2-dsselect-component-core-variants.md
