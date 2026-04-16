# Story 6.1: DsTextarea Component

Status: review

## Story

As a developer or AI agent implementing a Figma form design,
I want a DsTextarea component that wraps PrimeVue Textarea with sizes (S, M), the full state set (Default, Hover, Focused, Input-text, Filled, Filled-Hover, Error, Disabled), label/hint/error composition, and a character counter,
So that I can render multi-line text inputs matching the Figma Design System in both themes without custom styling.

## Figma Design References

- Text-Area category (all variants): https://www.figma.com/design/3qP5xnwc6gXhZR3AnFAMFe/Design-Systems?node-id=2-45313&m=dev
- State variants (from the Figma code response for node `2:45313`):
  - Default → `node-2_45318`
  - Default-Hover → `node-2229_47074`
  - Focused → `node-2_45340`
  - Input-text → `node-2_45351`
  - Error → `node-2_45362`
  - Filled → `node-2_45441`
  - Filled-Hover → `node-2153_7820`

## Acceptance Criteria

1. **Given** DsTextarea wraps PrimeVue `Textarea` using `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"`, **When** a developer uses `<DsTextarea v-model="value" label="..." />`, **Then** the component renders a composite (label + textarea + hint/counter footer) matching the Figma design in both light and dark themes.

2. **Given** DsTextarea supports 2 sizes (S, M), **When** the `size` prop is set, **Then** Small applies `padding: 6px 12px`, font 14px / line-height 20px, and Medium applies `padding: 8px 12px`, font 14px / line-height 20px — matching DsInputText size token conventions (see §Size Token Mapping). The `rows` prop controls vertical size (default `rows=3`, min-height ≈ 82px at M).

3. **Given** DsTextarea implements 8 visual states, **When** the textarea transitions through states, **Then**:
   - **Default** — bg `--p-surface-0` (white), border `--p-gray-400` (#cad5e2), `shadow-xs` (`0px 1px 2px var(--p-gray-300)`)
   - **Hover** — bg `--p-gray-100` (#f8fafc), border `--p-gray-600` (#62748e), `shadow-xs` retained
   - **Focused** (empty, focused) — bg white, border `--p-purple-400` (#7849ff), no shadow
   - **Input-text** (focused + typing, has caret) — bg `#fbfbfd` (surface bw-01), border `--p-purple-400`, no shadow, clear button visible
   - **Filled** (has value, not focused, not hovered) — bg white, border `--p-gray-400`, no shadow, text `--p-gray-800`
   - **Filled-Hover** (has value, hovered) — bg `--p-gray-100`, border `--p-gray-800` (#314158, darker than default hover), no shadow, text `--p-gray-800`
   - **Error** — bg white, border `--p-red-700` (#f22a42), no shadow, clear button visible when value present, error icon + error text below
   - **Disabled** — bg `--p-gray-100`, border `--p-gray-400`, text `--p-gray-500`, `pointer-events: none`, reduced visual affordance (follow DsInputText disabled pattern). Disabled overrides Error.

4. **Given** DsTextarea applies motion, **When** the user transitions between states, **Then** border-color, background-color, and box-shadow transition with `150ms ease` timing wrapped in `@media (prefers-reduced-motion: no-preference)` (i.e. the `motion-safe:` equivalent). Disabled state skips transitions.

5. **Given** DsTextarea is interactive, **When** the textarea receives focus, **Then** focus is indicated via the border color change (purple-400) and a `focus-visible` ring/outline (not `:focus`) is present in both light and dark themes consistent with DsInputText.

6. **Given** DsTextarea supports a label above the field, **When** the `label` prop is provided, **Then** a label renders above the textarea with 6px gap; label uses Inter medium 14px / line-height 20px / letter-spacing -0.2px, color `--p-gray-900` (#1d293d); mandatory fields show `*` after label; optional fields show `(Optional)` in Inter regular 12px gray-600; an optional info icon renders when `info` is true — mirroring DsInputText label section.

7. **Given** DsTextarea supports hint text, **When** the `hint` prop is provided, **Then** hint text renders below the textarea in Inter regular 14px / line-height 20px, color `--p-gray-600`.

8. **Given** DsTextarea enters Error state, **When** the `error` prop is set (and `disabled` is false), **Then** the hint area is replaced by an error message: Inter medium 12px / line-height 16px, color `--p-red-700`, preceded by a 14px error triangle icon (use `DsIcon name="error" size="xsmall"`). The error message element's `id` is referenced by the textarea's `aria-describedby`, and `aria-invalid="true"` is set on the textarea.

9. **Given** DsTextarea supports character counting, **When** the `maxLength` prop is set, **Then** a counter (`"<current>/<max>"`) renders at the footer right in Inter regular 14px gray-600. When `current > max`, the numerator turns `--p-red-700` and the textarea enters Error state automatically (border red-700); the denominator remains gray-600. The counter co-exists with hint/error text in the same footer row (hint/error on the left, counter on the right).

10. **Given** DsTextarea is in Input-text or Error state with content present (and not disabled), **When** the textarea renders, **Then** a clear button (close/X icon, 18px) appears absolutely positioned at `top: 7px; right: 7px` of the textarea box. Clicking the button (or pressing Enter/Space while focused) clears `model.value` to `''`, emits a `clear` event, and returns focus to the textarea. The button has `aria-label="Clear"` and is keyboard-accessible.

11. **Given** DsTextarea wraps PrimeVue `Textarea`, **When** a consumer passes standard PrimeVue Textarea props (`rows`, `cols`, `autoResize`, `placeholder`, etc.), slots, or events, **Then** they are forwarded via `inheritAttrs: false` + `v-bind="$attrs"` (FR9). TypeScript types are defined for all DS-specific props (`size`, `label`, `mandatory`, `optional`, `info`, `hint`, `error`, `maxLength`, `disabled`) and the `clear` event.

12. **Given** DsTextarea renders in both themes (FR10), **When** the app switches between light and dark, **Then** all 8 states display correctly using PrimeVue preset tokens only — no hardcoded hex values in scoped CSS.

13. **Given** DsTextarea follows the co-located file convention, **When** the implementation is complete, **Then** the directory `src/components/DsTextarea/` contains `DsTextarea.vue`, `DsTextarea.stories.ts`, `DsTextarea.test.ts`, `index.ts`; the component is re-exported from `src/index.ts` as `{ DsTextarea, type DsTextareaProps }`; Storybook stories cover all 8 states × both sizes with interactive controls; Vitest tests verify props, all state classes, character counter, clear button behavior, accessibility attributes, and PrimeVue passthrough; an AI KB entry exists at `docs/ai-guidelines/ds-textarea.md` following the DsInputText entry structure.

## Tasks / Subtasks

- [x] Task 1: Create DsTextarea component scaffold (AC: #13)
  - [x] 1.1 Create directory `src/components/DsTextarea/`
  - [x] 1.2 Create empty files: `DsTextarea.vue`, `DsTextarea.stories.ts`, `DsTextarea.test.ts`, `index.ts`
  - [x] 1.3 Export `DsTextarea` and `DsTextareaProps` from `src/components/DsTextarea/index.ts`
  - [x] 1.4 Add `export { DsTextarea, type DsTextareaProps } from './components/DsTextarea';` to `src/index.ts` (alphabetical position between `DsLink` and `dsPreset`)

- [x] Task 2: Implement `DsTextarea.vue` — script & props (AC: #1, #11)
  - [x] 2.1 `import Textarea from 'primevue/textarea';`
  - [x] 2.2 `import DsIcon from '../DsIcon/DsIcon.vue';`
  - [x] 2.3 Define `DsTextareaProps` interface (see §Component API below)
  - [x] 2.4 `defineOptions({ inheritAttrs: false });`
  - [x] 2.5 `withDefaults(defineProps<DsTextareaProps>(), { size: 'medium', disabled: false, mandatory: false, optional: false, info: false, rows: 3 });`
  - [x] 2.6 `const model = defineModel<string>();` (v-model)
  - [x] 2.7 `const emit = defineEmits<{ clear: []; }>();`
  - [x] 2.8 `useId()` for `inputId` and `errorId` (Vue 3.5+)
  - [x] 2.9 Computed: `hasValue`, `isError` (derived from `error` prop), `showError` (`isError && !disabled`), `isOverflow` (from `maxLength` + current length), effective error state (`error` prop OR `isOverflow`)
  - [x] 2.10 Computed `sizeTokens` returning `{ paddingX, paddingY, fontSize, borderRadius }` per size (see §Size Token Mapping)
  - [x] 2.11 Computed `wrapperClasses` mirroring DsInputText class pattern: `ds-textarea__input`, `--small/--medium`, `--error`, `--disabled`, `--filled`, `--transitions`

- [x] Task 3: Implement `DsTextarea.vue` — template (AC: #1, #6, #7, #8, #9, #10)
  - [x] 3.1 Root `<div class="ds-textarea">` with optional `--small`/`--medium` modifier
  - [x] 3.2 Label section (only when `label` prop set): label text + `*` (mandatory, exclusive with optional) + `(Optional)` + `<DsIcon name="help" size="xsmall|small" />` if `info`. Link via `for="inputId"` / `id="inputId"`.
  - [x] 3.3 Textarea wrapper `<div :class="wrapperClasses">` containing PrimeVue Textarea with full ARIA wiring and clear button
  - [x] 3.4 Footer row with error/hint on left, counter on right
  - [x] 3.5 `handleClear()` — set `model.value = ''`, emit `'clear'`, restore focus to textarea element.

- [x] Task 4: Implement `DsTextarea.vue` — scoped CSS (AC: #3, #4, #5, #12)
  - [x] 4.1 Scoped CSS based on DsInputText pattern with `ds-textarea__*` class names
  - [x] 4.2 Wrapper with `align-items: flex-start`, native textarea border/shadow/bg/padding/outline stripped
  - [x] 4.3 Wrapper `border-radius: 8px`, `position: relative`, 32px right padding for clear button gutter
  - [x] 4.4 All 8 state styles using `--p-*` tokens (hover keeps shadow per Figma, focus uses purple-400, filled-hover uses gray-800)
  - [x] 4.5 Transitions wrapped in `@media (prefers-reduced-motion: no-preference)`
  - [x] 4.6 Clear button absolutely positioned at top:7px right:7px
  - [x] 4.7 Footer flex layout with left/right cells
  - [x] 4.8 Counter overflow color on numerator only
  - [x] 4.9 Placeholder colors mirror DsInputText
  - [x] 4.10 Dark theme via PrimeVue preset token inversion

- [x] Task 5: Character counter + overflow-triggered error (AC: #9)
  - [x] 5.1 Compute `currentLength = model.value?.length ?? 0`
  - [x] 5.2 Compute `isOverflow = maxLength != null && currentLength > maxLength`
  - [x] 5.3 Effective error state for CSS = `(showError || (isOverflow && !disabled))`
  - [x] 5.4 No value truncation — visual signal only
  - [x] 5.5 Counter renders only when `maxLength != null`

- [x] Task 6: Storybook stories (AC: #13)
  - [x] 6.1 Created 14 stories: Default, WithLabel, Mandatory, Optional, WithInfo, WithHint, WithError, Disabled, Filled, WithCounter, CounterOverflow, ErrorWithHint, AllSizes, AllStates
  - [x] 6.2 argTypes include all props
  - [x] 6.3 Each interactive story wires v-model pattern

- [x] Task 7: Vitest tests (AC: #13)
  - [x] 7.1 Test file mirrors DsInputText.test.ts with ds-textarea__* selectors
  - [x] 7.2 Uses same globalConfig pattern
  - [x] 7.3 All required test cases covered
  - [x] 7.4 40 tests total (exceeds 30+ target)

- [x] Task 8: AI knowledge base entry (AC: #13)
  - [x] 8.1 Created `docs/ai-guidelines/ds-textarea.md` with full section structure
  - [x] 8.2 Props table with all DS-specific props + PrimeVue passthrough note
  - [x] 8.3 Events table: `clear`, `update:modelValue`
  - [x] 8.4 Usage examples: basic, hint, error, counter, mandatory, disabled
  - [x] 8.5 Added DsTextarea entry to `docs/ai-guidelines/index.md`

- [x] Task 9: Validate & ship (AC: #13)
  - [x] 9.1 `npm test` — 243 tests pass (0 regressions)
  - [x] 9.2 `npm run lint` — 0 errors
  - [x] 9.3 `npm run build` — succeeds; `dist/index.d.ts` exports `DsTextarea` and `DsTextareaProps`
  - [ ] 9.4 `npm run storybook` — visual verification pending (requires browser)
  - [x] 9.5 File List updated below

## Dev Notes

### Architecture Pattern — Follow DsInputText Exactly

DsTextarea is a **thin PrimeVue Textarea wrapper** in the same family as DsInputText. **Do not invent a new architecture.** Mirror [DsInputText.vue](../../src/components/DsInputText/DsInputText.vue) section-by-section:

1. `defineOptions({ inheritAttrs: false })` — prevents double-applying attrs
2. `v-bind="$attrs"` on the inner `<Textarea>` — full PrimeVue prop/slot/event passthrough (FR9)
3. `dt` prop for per-instance design-token overrides (padding, font-size, border-radius)
4. Scoped CSS drives state styles via `ds-textarea__input--<modifier>` classes
5. `useId()` for ARIA linkage (Vue 3.5+, already used across the library)

### Component API

```ts
export interface DsTextareaProps {
  /** Textarea size. Default: 'medium' */
  size?: 'small' | 'medium';
  /** Disabled state. Default: false — overrides Error */
  disabled?: boolean;
  /** Label text above the textarea */
  label?: string;
  /** Show mandatory asterisk after label. Default: false. Mutually exclusive with `optional` (neither renders if both true) */
  mandatory?: boolean;
  /** Show "(Optional)" text after label. Default: false. Mutually exclusive with `mandatory` */
  optional?: boolean;
  /** Show info/help icon next to label. Default: false */
  info?: boolean;
  /** Hint/helper text below the textarea */
  hint?: string;
  /** Error message — triggers Error visual state and aria-invalid */
  error?: string;
  /** Max character count — enables counter + overflow-triggered error state */
  maxLength?: number;
  /** Initial visible rows (passed to PrimeVue Textarea). Default: 3 */
  rows?: number;
}
```

Events:
- `clear` — emitted when the clear button is activated
- `update:modelValue` — automatic via `v-model`

### Figma Design Source of Truth

**Per user's standing rule, when the Figma and the UX spec disagree, trust Figma.** Key Figma-derived facts that override or clarify `epics-phase2.md` / `ux-design-specification.md`:

1. **Focus border color is `purple-400` (#7849ff)** — not `purple-800` (DsInputText CSS) or `purple-450`. The Figma node explicitly uses `--outline/brand/purple-400` for Focused and Input-text states. Map to PrimeVue preset token `--p-purple-400`.

2. **Filled-Hover border is `gray-800` (#314158)** — darker than default Hover (gray-600). Filled-Hover is visually more prominent than Default-Hover per Figma. Use `--p-gray-800`.

3. **Default-Hover retains shadow-xs** — Figma includes `shadow-[0px_1px_2px_0px_var(--surfase\/main\/gray-300,#e2e8f0)]` on the Default-Hover variant. This is the opposite of DsInputText (which drops shadow on hover). Do **not** copy DsInputText's hover rule blindly — keep the shadow for DsTextarea hover.

4. **Input-text background is `#fbfbfd`** — Figma token `--token/surface/primary/bw-01`. Not pure white. If the PrimeVue preset exposes this as `--p-surface-50` (check `src/theme/` preset), use that token; otherwise use the literal hex `#fbfbfd` with a CSS comment linking it to the Figma token name. **Do not** use `white` for this state.

5. **Sizes** — Figma only ships a single "L Text-Area" variant. Per UX-DR1 ("same form field state pattern as DsInputText") and PRD Phase 2 FR1 ("sizes (S, M) ... consistent with DsInputText"), define S and M by mirroring DsInputText's `dt` tokens exactly. Do **not** invent different paddings. See §Size Token Mapping below.

6. **Disabled** — not rendered as its own Figma variant. Follow DsInputText disabled pattern verbatim (gray-100 bg, gray-400 border, gray-500 text, pointer-events:none, no opacity reduction).

### Size Token Mapping

| Size   | Padding Y | Padding X | Font Size | Line Height | Border Radius | Approx min-height @ rows=3 |
|--------|-----------|-----------|-----------|-------------|---------------|----------------------------|
| small  | 6px       | 12px      | 14px      | 20px        | 8px           | ~72px                      |
| medium | 8px       | 12px      | 14px      | 20px        | 8px           | ~82px                      |

These exactly match the `dt` tokens DsInputText passes to PrimeVue. **Do not diverge** — consistency across form fields is UX-DR1.

> **Resolving the epic discrepancy:** Epic 6.1 AC #1 states M=36px. DsInputText ships M=40px (corrected in Story 2.2 per Figma). For a textarea, the "height" is a min-height driven by `rows` + padding, not a fixed pixel value. The `size` prop controls **padding and font-size tokens**, not a hard height. This resolves the mismatch while honoring UX-DR1's "consistent with DsInputText" directive.

### State Matrix — Complete Specification (from Figma node 2:45313)

| State        | Background                          | Border Color              | Shadow              | Text Color       | Special Elements         |
|--------------|-------------------------------------|---------------------------|---------------------|------------------|--------------------------|
| Default      | `--p-surface-0` (#fff)              | `--p-gray-400` (#cad5e2)  | shadow-xs           | placeholder g-600| —                        |
| Hover        | `--p-gray-100` (#f8fafc)            | `--p-gray-600` (#62748e)  | **shadow-xs kept**  | placeholder g-500| —                        |
| Focused      | `--p-surface-0` (#fff)              | `--p-purple-400` (#7849ff)| none                | placeholder g-500| caret                    |
| Input-text   | `#fbfbfd` (bw-01)                   | `--p-purple-400` (#7849ff)| none                | gray-800         | caret + clear btn        |
| Filled       | `--p-surface-0` (#fff)              | `--p-gray-400`            | none                | gray-800         | —                        |
| Filled-Hover | `--p-gray-100`                      | `--p-gray-800` (#314158)  | none                | gray-800         | —                        |
| Error        | `--p-surface-0` (#fff)              | `--p-red-700` (#f22a42)   | none (+ ring on focus)| gray-800       | clear btn + error msg    |
| Disabled     | `--p-gray-100`                      | `--p-gray-400`            | none                | gray-500         | pointer-events: none     |

- Default/Hover/Focused/Input-text/Filled/Filled-Hover/Disabled are CSS-driven via `:hover`, `:focus-within`, and modifier classes.
- Error is prop-driven via `error` prop (or auto-triggered when counter overflows).
- Disabled **overrides** Error (matches DsInputText behavior).

### Character Counter + Overflow Behavior

- Only rendered when `maxLength != null`.
- Format: `<currentCount>/<maxLength>` — two spans (numerator / denominator separated by `/`).
- When `currentCount > maxLength`:
  - Numerator span gets class `ds-textarea__counter-over` → color `--p-red-700`.
  - Denominator keeps gray-600.
  - Wrapper enters effective Error state (border red-700) **even if `error` prop is empty** — this satisfies AC #9's "textarea enters Error state" clause.
  - The `error` prop (explicit error message) still takes precedence for the footer left-cell text; if no `error` set, the hint (if any) still renders. If neither, the left cell stays empty and only the counter shows red.
- Do **not** hard-truncate the value. Consumers can pass the HTML `maxlength` attribute through `$attrs` if they want a hard cap.

### Clear Button Behavior

- Visible when `hasValue && !disabled && (isFocused || effectiveError)`. Use reactive `focused` ref toggled by `@focusin`/`@focusout` on the wrapper div.
- Position: `absolute; top: 7px; right: 7px;` inside the wrapper (wrapper is `position: relative`).
- Right padding of the wrapper is `32px` (not `12px`) to leave room for the button. Keep padding constant whether or not the button renders, to prevent layout shift.
- On activation (click / Enter / Space): `model.value = ''`; emit `clear`; restore focus to the inner textarea DOM node (query via `ref` on `<Textarea>`).
- Icon: `<DsIcon name="close" />` at the DsIcon size that renders ~18px. If no exact match, use the smallest icon size available and constrain via CSS `width/height: 18px`.

### Design Token References

Use PrimeVue preset CSS variables (`--p-*`). These are the DsInputText references — same apply here:

```
--p-surface-0        : white background (default, filled, focused)
--p-gray-100         : hover/filled-hover/disabled background (Figma surfase/main/gray-100)
--p-gray-300         : shadow color (shadow-xs)
--p-gray-400         : default/filled/disabled border (outline/main/gray-400)
--p-gray-500         : disabled text, placeholder on hover
--p-gray-600         : hover border, hint text, placeholder default (outline/main/gray-600)
--p-gray-700         : clear button hover color
--p-gray-800         : filled-hover border, filled text (outline/main/gray-800 / taxt/main/gray-800)
--p-gray-900         : label text (taxt/main/gray-900)
--p-purple-400       : focus/input-text border (outline/brand/purple-400 = #7849ff)
--p-red-700          : error border + error text + counter overflow (outline/negative/red-700)
--p-red-100          : error focus ring (surfase/negative/red-100)
```

**`#fbfbfd` (Input-text bg)** is Figma token `--token/surface/primary/bw-01`. Check if `src/theme/` exposes this as a preset token — use the token name if so; otherwise use the literal hex with a `/* bw-01 */` comment.

### Typography

- Textarea text / placeholder: Inter regular, 14px, line-height 20px, letter-spacing -0.2px
- Label: Inter medium (500), 14px, line-height 20px, letter-spacing -0.2px, color gray-900
- Hint (regular): Inter regular, 14px, line-height 20px, color gray-600
- Error text: Inter medium (500), 12px, line-height 16px, color red-700
- "(Optional)" text: Inter regular, 12px, line-height 16px, color gray-600
- Counter: Inter regular, 14px, line-height 20px, color gray-600 (numerator flips to red-700 on overflow)

Font family: `var(--font-family, 'Inter', sans-serif)` (already globally imported via `@fontsource/inter`).

### Existing Code to Reuse

| Artifact | Path | Reuse For |
|----------|------|-----------|
| DsInputText.vue | `src/components/DsInputText/DsInputText.vue` | Template structure, scoped CSS, size tokens, ARIA wiring — **primary reference** |
| DsInputText.test.ts | `src/components/DsInputText/DsInputText.test.ts` | Test scaffold, globalConfig, assertion patterns |
| DsInputText.stories.ts | `src/components/DsInputText/DsInputText.stories.ts` | Storybook layout, argTypes, AllStates/AllSizes composites |
| DsIcon | `src/components/DsIcon/DsIcon.vue` | Internal icons (`error`, `close`, `help`) — uses `currentColor` |
| docs/ai-guidelines/ds-input-text.md | `docs/ai-guidelines/ds-input-text.md` | AI KB entry structure |

**Do NOT** reinvent any of these. Clone and adapt.

### Files to Create

```
src/components/DsTextarea/
  DsTextarea.vue
  DsTextarea.stories.ts
  DsTextarea.test.ts
  index.ts
docs/ai-guidelines/
  ds-textarea.md
```

### Files to Modify

- `src/index.ts` — add `export { DsTextarea, type DsTextareaProps } from './components/DsTextarea';`
- `docs/ai-guidelines/index.md` — add DsTextarea entry row

### Project Structure Notes

- Co-located files per `docs/component-addition-guide.md` § "Step-by-Step Checklist"
- PascalCase directory and file naming (`DsTextarea/DsTextarea.vue`)
- Single barrel export from `src/index.ts` (alphabetical)
- AI KB entry filename kebab-case: `ds-textarea.md`
- No new runtime dependencies; PrimeVue `Textarea` is already transitively available via `primevue` peer dep

### Anti-Patterns to Avoid

- ❌ Do **not** copy DsInputText's hover rule that removes `box-shadow` — DsTextarea **keeps** shadow on Default-Hover per Figma
- ❌ Do **not** use `purple-800` for focus border — Figma mandates `purple-400` (`#7849ff`)
- ❌ Do **not** use `gray-600` for Filled-Hover border — Figma uses `gray-800`
- ❌ Do **not** use `white` for Input-text bg — it's `#fbfbfd` (bw-01)
- ❌ Do **not** hardcode hex values anywhere in scoped CSS (except the one documented `#fbfbfd` with comment) — use `--p-*` tokens
- ❌ Do **not** build Label/Hint/Counter as separate exported components — keep them internal to `DsTextarea.vue`
- ❌ Do **not** truncate `modelValue` when counter overflows — visual signal only (AC #9)
- ❌ Do **not** apply transitions to the disabled state
- ❌ Do **not** forget `inheritAttrs: false` — otherwise attrs apply to both the root div and the inner textarea
- ❌ Do **not** remove the 32px right padding when clear button is hidden — causes layout shift when focus state toggles
- ❌ Do **not** wire a new composable, store, or `v-bind="props"` — `v-bind="$attrs"` is the only passthrough
- ❌ Do **not** commit `storybook-static/` or other generated artifacts

### Testing Approach

Follow `DsInputText.test.ts` line-for-line:
- Mount with `@vue/test-utils` `mount()`
- `globalConfig = { plugins: [[PrimeVue, { theme: 'none' }]] }` — mandatory
- Find inner PrimeVue component via `wrapper.findComponent(Textarea)`
- Assert `dt` tokens via `input.props('dt')` as `Record<string, unknown>`
- Assert state classes via `.find('.ds-textarea__input--<modifier>').exists()`
- Assert ARIA attributes on the inner `<textarea>` element (use `wrapper.find('textarea').attributes(...)`)
- For focus-driven clear-button visibility: trigger `focusin` / `focusout` on the wrapper div and then assert

### Previous Story Intelligence

**From Story 2.2 (DsInputText) — same architecture family:**
- `dt` prop for per-size overrides is the correct approach — don't use CSS custom properties for sizing
- PrimeVue native border/shadow/padding must be stripped with `!important` on the inner component's class, because PrimeVue's preset applies them at a specificity matching component defaults
- `useId()` from Vue 3.5 produces SSR-safe unique IDs — use it instead of `Math.random()` or a counter
- Disabled state must suppress error display AND `aria-invalid` — test explicitly asserts this
- Mandatory + Optional mutual exclusion: if both `true`, render **neither** (not one-takes-precedence) — unexpected but matches DsInputText behavior and tests
- Biome is strict about unused imports and import order — run `npm run lint` before commit
- Final bundle size reference: after DsInputText, `dist/index.css` was ~7.05KB / `dist/index.js` ~130KB. Expect a small increment (~1-2KB CSS, ~3-4KB JS) for DsTextarea.

**From Story 2.1 (DsIconButton):**
- `inheritAttrs: false` + `v-bind="$attrs"` confirmed as the canonical PrimeVue wrapper pattern

**From Story 1.2.1 (DsIcon):**
- DsIcon uses `currentColor` — inner icons (error, close, help) will inherit the CSS `color` of their parent span, so set `color: var(--p-red-700)` / etc. on the icon wrapper spans, not on the SVG
- Available icon names include `close`, `error`, `help`, `arrow-down` (referenced by DsInputText) — confirm `close` is present before implementation; if not, fall back to `x` or request icon addition (check `src/assets/icons/` first)

**From Story 1.3 (DsButton):**
- 150ms ease transition timing is the library-wide standard (UX-DR9)
- Scoped CSS — never global

### Git Intelligence (Recent Commits)

Recent `git log` on `master` (last 5):

```
2f67c65 add epics for phase 2
e9bed4d phase 2 specs sync
8294367 Add Storybook URL to README (#8)
1243343 Add Claude Code GitHub Workflow (#6)
f5e9cb0 add PRD for phase 2
```

No prior DsTextarea work exists — this is a greenfield component added to the established Phase 1 scaffolding. All Phase 1 components (DsButton, DsIcon, DsIconButton, DsInputText, DsLink) are `done` per `sprint-status.yaml`. This is the first Phase 2 story; Epic 6 transitions from `backlog` → `in-progress` upon creation of this story.

### Latest Tech Notes

- **Vue**: 3.5.30 — `useId()` and `defineModel<T>()` are both available and preferred
- **PrimeVue**: 4.5.4 — `Textarea` component exposes standard props (`rows`, `autoResize`, `cols`, `placeholder`) and supports `pt` / `dt` theming APIs
- **Vitest**: 4.1.2 with `@vue/test-utils` 2.4.6 — same test setup as Phase 1
- **Biome**: 2.4.9 — runs via `npm run lint`; lint-staged hook applies `biome check --write` to staged files automatically
- **Node**: `>=20.11.0` per `package.json` engines

### References

- [Source: _bmad-output/planning-artifacts/epics-phase2.md#Story 6.1] — original BDD acceptance criteria
- [Source: _bmad-output/planning-artifacts/epics-phase2.md#UX-DR1] — same form field state pattern as DsInputText
- [Source: _bmad-output/planning-artifacts/epics-phase2.md#UX-DR8] — focus-visible (not focus)
- [Source: _bmad-output/planning-artifacts/epics-phase2.md#UX-DR9] — 150ms ease, motion-safe
- [Source: _bmad-output/planning-artifacts/epics-phase2.md#UX-DR10] — uniform size tokens
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#FR1] — DsTextarea sizes/states/pattern
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#FR9] — PrimeVue passthrough
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#FR10] — light/dark fidelity
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Strategy] — DsTextarea → PrimeVue Textarea wrapper
- [Source: Figma node 2:45313] — all DsTextarea state variants (fileKey `3qP5xnwc6gXhZR3AnFAMFe`)
- [Source: src/components/DsInputText/DsInputText.vue] — primary implementation reference
- [Source: src/components/DsInputText/DsInputText.test.ts] — test pattern reference
- [Source: src/components/DsInputText/DsInputText.stories.ts] — storybook pattern reference
- [Source: docs/ai-guidelines/ds-input-text.md] — AI KB entry template
- [Source: docs/component-addition-guide.md] — PrimeVue wrapper checklist

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Fixed TS build error: PrimeVue Textarea `$el` not available on typed ref — switched to `wrapperRef` + `querySelector('textarea')` for focus restore
- Fixed Biome lint: long string in Filled story args needed multi-line formatting
- Fixed test: `rows` is an HTML attribute on `<textarea>`, not a PrimeVue component prop — assert via `wrapper.find('textarea').attributes('rows')`
- Fixed test: `autoResize` needs ResizeObserver mock in jsdom; assert via PrimeVue component `.props('autoResize')`

### Completion Notes List

- DsTextarea component fully implemented as a thin PrimeVue Textarea wrapper mirroring DsInputText architecture
- All 8 visual states implemented per Figma spec with correct token usage (purple-400 focus, gray-800 filled-hover, shadow retained on default-hover)
- Character counter with overflow-triggered error state (visual only, no value truncation)
- Clear button with focus/error visibility logic, keyboard accessibility, and focus restore
- 40 Vitest tests covering all acceptance criteria (243 total, 0 regressions)
- 14 Storybook stories with interactive controls
- AI KB entry created and index updated
- Build produces correct type exports in dist/index.d.ts

### Change Log

- 2026-04-17: Initial implementation of DsTextarea component (Story 6.1)

### File List

**Created:**
- `src/components/DsTextarea/DsTextarea.vue`
- `src/components/DsTextarea/DsTextarea.stories.ts`
- `src/components/DsTextarea/DsTextarea.test.ts`
- `src/components/DsTextarea/index.ts`
- `docs/ai-guidelines/ds-textarea.md`

**Modified:**
- `src/index.ts` — added DsTextarea + DsTextareaProps export
- `docs/ai-guidelines/index.md` — added DsTextarea row to Component Inventory and Figma matching guide
