# Story 2.2: DsInputText Component

Status: done

## Story

As a developer implementing a Figma form design,
I want to use DsInputText with all sizes and visual states,
So that text inputs in my application match the Figma Design System with correct validation behavior.

## Figma Design References

- Input component (bare field): https://www.figma.com/design/3qP5xnwc6gXhZR3AnFAMFe/Design-Systems?node-id=2198-12433&m=dev
- InputField composite (label + input + hint): https://www.figma.com/design/3qP5xnwc6gXhZR3AnFAMFe/Design-Systems?node-id=2072-10430&m=dev

## Acceptance Criteria

1. **Given** DsInputText wraps PrimeVue InputText using `inheritAttrs: false` + `v-bind="$attrs"`, **When** a developer uses `<DsInputText size="medium" v-model="value" />`, **Then** the input renders matching the Figma text input at Medium size.

2. **Given** DsInputText supports 2 sizes (S, M), **When** the `size` prop is set, **Then** Small renders at 32px height with 14px font, **And** Medium renders at 40px height with 14px font.

3. **Given** DsInputText implements 9 visual states, **When** the input transitions through states, **Then** Default shows gray border (`--outline/main/gray-400`, #cad5e2) with shadow-xs, **And** Hover shows darkened border (`--outline/main/gray-600`, #62748e) with gray-100 background, **And** Focus shows primary purple border (`--outline/brand/purple-450`, #5f33e6), **And** Input-text shows purple border with caret and active typing, **And** Filled shows filled text with gray-400 border, **And** Filled-Hover shows filled text with darkened gray-600 border and gray-100 background, **And** Disabled shows reduced opacity (0.5) with gray-100 background, gray-400 border, and `pointer-events: none`, **And** Alert (error empty) shows red border (`--outline/negative/red-700`, #f22a42) with error icon, **And** Alert-Input (error while typing) shows red border with filled text, caret, and close button.

4. **Given** DsInputText supports a label above the input, **When** the `label` prop is provided, **Then** a label renders above the input field with 6px gap, **And** the label uses Inter medium 14px font in gray-900, **And** mandatory fields show an asterisk (*) after the label text, **And** optional fields show "(Optional)" text in 12px gray-600, **And** an optional info icon (14px) can be shown via the `info` prop.

5. **Given** DsInputText supports hint/helper text below the input, **When** the `hint` prop is provided, **Then** hint text renders below the input in 14px regular gray-600, **And** when in Alert/Alert-Input/Skip state, the hint shows as error text in 12px medium red-700 (#f22a42) with a small error triangle icon preceding the text.

6. **Given** DsInputText supports a leading icon slot, **When** content is passed to the `leading` slot (e.g., `<DsIcon name="envelope" />`), **Then** a 20px icon renders at the start of the input field before the text/placeholder.

7. **Given** DsInputText supports trailing elements, **When** the input has trailing content, **Then** a dropdown arrow icon renders by default (toggleable via `showDropdownIcon` prop), **And** a clear/close button renders when the input has a value and `clearable` is true, **And** in Alert state an error triangle icon renders on the right side.

8. **Given** DsInputText supports error state with accessible messaging, **When** an `error` prop is provided with an error message string, **Then** the error message renders below the input with the error triangle icon, **And** the error message is associated with the input via `aria-describedby` (UX-DR20), **And** the input border turns red using the Negative/Red-700 token.

9. **Given** DsInputText follows form validation patterns, **When** integrated in a form context, **Then** the component supports validation on blur (not keystroke) via standard Vue events, **And** error state can be cleared programmatically when the user starts typing.

10. **Given** DsInputText passes through PrimeVue InputText props, slots, and events, **When** any standard PrimeVue InputText prop is used (placeholder, maxlength, etc.), **Then** it passes through correctly (FR13).

11. **Given** DsInputText renders correctly in both themes, **When** the application switches themes, **Then** all 9 states display correctly in dark mode using inverted tokens.

12. **Given** DsInputText has TypeScript types and a co-located test file, **When** the component is used and tests are run, **Then** all props have type definitions and tests verify both sizes, all 9 states, label rendering, hint/error rendering, leading icon slot, trailing elements, accessibility attributes, and PrimeVue passthrough.

## Tasks / Subtasks

- [x] Task 1: Create DsInputText component directory and files (AC: #12)
  - [x] 1.1 Create `src/components/DsInputText/` directory
  - [x] 1.2 Create `DsInputText.vue`, `DsInputText.test.ts`, `DsInputText.stories.ts`, `index.ts`

- [x] Task 2: Implement DsInputText.vue (AC: #1, #2, #3, #4, #5, #6, #7, #8, #11)
  - [x] 2.1 Define `DsInputTextProps` interface:
    - `size?: 'small' | 'medium'` (default: 'medium')
    - `disabled?: boolean` (default: false)
    - `label?: string` (label text)
    - `mandatory?: boolean` (show asterisk, default: false)
    - `optional?: boolean` (show "(Optional)" text, default: false)
    - `info?: boolean` (show info icon next to label, default: false)
    - `hint?: string` (hint/helper text below input)
    - `error?: string` (error message — triggers Alert visual state)
    - `clearable?: boolean` (show clear button when filled, default: false)
    - `showDropdownIcon?: boolean` (show trailing dropdown arrow, default: false)
  - [x] 2.2 Wrap PrimeVue `InputText` with `inheritAttrs: false` + `v-bind="$attrs"` (same pattern as DsButton)
  - [x] 2.3 Implement label section above input: label text + mandatory asterisk + optional text + info icon
  - [x] 2.4 Implement leading icon slot (`#leading`) — 20px icon area before input text
  - [x] 2.5 Implement trailing elements: dropdown arrow icon, clear button, error icon (contextual per state)
  - [x] 2.6 Implement hint/error text section below input with error triangle icon for error state
  - [x] 2.7 Apply size tokens via `dt` prop or scoped CSS:
    - Small: height 32px, padding-y 6px, padding-x 12px, font 14px/20px, border-radius 8px
    - Medium: height 40px, padding-y 8px, padding-x 12px, font 14px/20px, border-radius 8px
  - [x] 2.8 Apply visual state styles:
    - Default: bg white, border gray-400, shadow-xs (0px 1px 2px gray-300)
    - Hover: bg gray-100, border gray-600, no shadow
    - Focus: bg white, border purple-450, no shadow
    - Input-text: bg white, border purple-450 (same as focus, with caret visible)
    - Filled: bg white, border gray-400, text gray-800
    - Filled-Hover: bg gray-100, border gray-600, text gray-800
    - Disabled: bg gray-100, border gray-400, opacity 0.5, pointer-events none
    - Alert: bg white, border red-700, error icon visible
    - Alert-Input: bg white, border red-700, error focus ring (3px spread red-100)
  - [x] 2.9 Apply 150ms ease transitions for state changes (not on disabled)
  - [x] 2.10 Apply disabled state: opacity 0.5, `pointer-events: none`, `aria-disabled="true"`
  - [x] 2.11 Apply error state accessibility: `aria-describedby` linking input to error message element
  - [x] 2.12 Implement `v-model` passthrough for two-way binding
  - [x] 2.13 Apply placeholder text styling: gray-500 (#90a1b9) for disabled/hover states, gray-600 (#62748e) for default/active states

- [x] Task 3: Implement index.ts barrel export (AC: #12)
  - [x] 3.1 Export `DsInputText` component and `DsInputTextProps` type from `index.ts`

- [x] Task 4: Register in main barrel export (AC: #12)
  - [x] 4.1 Add `export { DsInputText, type DsInputTextProps } from './components/DsInputText'` to `src/index.ts`

- [x] Task 5: Write Vitest tests (AC: #1, #2, #3, #4, #5, #6, #7, #8, #12)
  - [x] 5.1 Test: renders with default props (medium size, no label, no hint)
  - [x] 5.2 Test: both sizes apply correct height (S=32px, M=40px) via dt tokens
  - [x] 5.3 Test: label renders with text, mandatory asterisk, optional text, info icon
  - [x] 5.4 Test: hint text renders below input
  - [x] 5.5 Test: error prop triggers red border and error message with icon below input
  - [x] 5.6 Test: error message linked to input via aria-describedby
  - [x] 5.7 Test: leading slot renders icon content
  - [x] 5.8 Test: trailing dropdown icon shows/hides via prop
  - [x] 5.9 Test: clearable shows clear button when input has value
  - [x] 5.10 Test: disabled state applies opacity, pointer-events, aria-disabled
  - [x] 5.11 Test: v-model two-way binding works
  - [x] 5.12 Test: PrimeVue prop passthrough via $attrs (e.g., placeholder, maxlength)
  - [x] 5.13 Test: placeholder text styling differs by state (gray-500 vs gray-600)

- [x] Task 6: Run tests and lint (AC: #12)
  - [x] 6.1 Run `npx vitest run` — all tests pass (existing + new): 140 tests across 6 files
  - [x] 6.2 Run `npx biome check` — no errors
  - [x] 6.3 Run `npm run build` — build succeeds, dist/index.css 7.05KB, dist/index.js 130KB

## Dev Notes

### Architecture Pattern — Follow DsButton Exactly

DsInputText is a PrimeVue InputText wrapper, following the same architecture as DsButton (`src/components/DsButton/DsButton.vue`). Key patterns to replicate:

1. **`defineOptions({ inheritAttrs: false })`** — prevents double-applying attrs
2. **`v-bind="$attrs"`** on the PrimeVue `<InputText>` — full PrimeVue prop/event passthrough
3. **`dt` prop** for per-instance design token overrides — controls sizing
4. **Scoped CSS** for state transitions, disabled opacity

### Composite Structure (from Figma)

The Figma "InputField" component is a composite with three sections stacked vertically with 4px gap:

```
┌─────────────────────────────────┐
│ Label* (Optional) ⓘ            │  ← Label section (6px gap to input)
├─────────────────────────────────┤
│ 📧 Enter your name          ▾  │  ← Input field (leading icon + text + trailing)
├─────────────────────────────────┤
│ ⚠ Error description            │  ← Hint/Error section (4px gap from input)
└─────────────────────────────────┘
```

DsInputText should render all three sections as a single component, not three separate components.

### Size Token Mapping (from Figma — CORRECTED)

| Size   | Input Height | Font Size | Line Height | Padding Y | Padding X | Border Radius |
|--------|-------------|-----------|-------------|-----------|-----------|---------------|
| small  | 32px        | 14px      | 20px        | 6px       | 12px      | 8px           |
| medium | 40px        | 14px      | 20px        | 8px       | 12px      | 8px           |

**IMPORTANT:** The epics doc states M=36px/16px but the Figma design clearly shows **M=40px with 14px font** for both sizes. This story follows the Figma design as the source of truth.

### Visual States — Complete Specification (from Figma)

The Figma component defines **9 visual states** (the `type` prop in Figma), not 8:

| State        | Background      | Border Color        | Text Color | Shadow               | Special Elements |
|-------------|-----------------|--------------------|-----------|-----------------------|-----------------|
| Default     | white           | gray-400 (#cad5e2) | gray-600  | shadow-xs (1px 2px)   | Dropdown arrow  |
| Hover       | gray-100 (#f8fafc) | gray-600 (#62748e) | gray-500  | none                  | Dropdown arrow  |
| Focus       | white           | purple-450 (#5f33e6) | gray-500  | none                  | Dropdown arrow  |
| Input-text  | white           | purple-450 (#5f33e6) | gray-800  | none                  | Caret + close btn |
| Filled      | white           | gray-400 (#cad5e2) | gray-800  | none                  | Dropdown arrow  |
| Filled-Hover| gray-100 (#f8fafc) | gray-600 (#62748e) | gray-800  | none                  | Dropdown arrow  |
| Disabled    | gray-100 (#f8fafc) | gray-400 (#cad5e2) | gray-500  | none                  | Dropdown arrow (muted) |
| Alert       | white           | red-700 (#f22a42)  | gray-600  | none                  | Error icon ⚠    |
| Alert-Input | white           | red-700 (#f22a42)  | gray-800  | 3px red-100 ring      | Caret + close btn |

**Note on states:** Default, Hover, Focus, Filled, Filled-Hover, and Disabled are CSS-driven (`:hover`, `:focus-visible`, `:disabled`). Alert and Alert-Input are prop-driven via the `error` prop. Input-text is the natural focus+typing state. Skip is the same visual as Alert but may be used for a different semantic (skipped validation).

### Label Component Details (from Figma)

- Font: Inter medium (font-weight 500), 14px, line-height 20px, letter-spacing -0.2px
- Color: `--taxt/main/gray-900` (#1d293d)
- Mandatory asterisk: same font as label, appended immediately after label text
- Optional text: Inter regular, 12px, line-height 16px, color gray-600 (#62748e), wrapped in parentheses
- Info icon: 14px help icon, optional

### Error/Hint Text Details (from Figma)

- **Regular hint:** Inter regular, 14px, line-height 20px, color gray-600 (#62748e), text "Error description"
- **Error hint:** Inter medium (font-weight 500), 12px, line-height 16px, color red-700 (#f22a42), preceded by a 14px error triangle icon in red-700
- Position: below input, full width, 20px height

### Trailing Elements Details (from Figma)

- **Dropdown arrow (Down icon):** 24px container (M) / 20px container (S), chevron pointing down-right, rotated
- **Clear button (Exit Enable):** 20px circle with X icon, shown in Input-text and Alert-Input states
- **Error icon:** 24px (M) / 20px (S) warning triangle, shown in Alert and Skip states

### Design Token References

```
--surfase/main/white: #ffffff
--surfase/main/gray-100: #f8fafc
--surfase/main/gray-300: #e2e8f0 (shadow color)
--outline/main/gray-400: #cad5e2 (default border)
--outline/main/gray-600: #62748e (hover border)
--outline/brand/purple-450: #5f33e6 (focus border)
--outline/negative/red-700: #f22a42 (error border)
--surfase/negative/red-100: #ffe4e6 (error focus ring)
--taxt/main/gray-500: #90a1b9 (placeholder disabled/hover)
--taxt/main/gray-600: #62748e (placeholder default, hint text)
--taxt/main/gray-800: #314158 (filled text)
--taxt/main/gray-900: #1d293d (label text)
--taxt/negative/red-700: #f22a42 (error text)
--font-size-h10: 14px
--font-size-h12: 12px
--unit/xl: 20px (line-height)
--typography/size/sm: 16px (error text line-height)
--radius/lg: 8px
--spacing/(gap-*/p-*/m-*)/p-3: 12px (horizontal padding)
--spacing/(gap-*/p-*/m-*)/p-2: 8px (vertical padding M)
```

### Typography

- Input text/placeholder: Inter regular, 14px, line-height 20px, letter-spacing -0.2px
- Label: Inter medium, 14px, line-height 20px, letter-spacing -0.2px
- Error text: Inter medium, 12px, line-height 16px
- Optional text: Inter regular, 12px, line-height 16px

### Existing Code to Reuse

- **DsButton.vue** (`src/components/DsButton/DsButton.vue`) — copy the wrapper pattern, dt tokens, disabled styles
- **DsButton.test.ts** (`src/components/DsButton/DsButton.test.ts`) — copy the test structure and globalConfig setup
- **DsIcon** (`src/components/DsIcon/`) — used by consumers in the leading slot, also for error/info icons internally

### Files to Create

```
src/components/DsInputText/
  DsInputText.vue          # Component implementation
  DsInputText.stories.ts   # Storybook stories (placeholder — Epic 3)
  DsInputText.test.ts      # Vitest tests
  index.ts                 # Re-export for barrel imports
```

### Files to Modify

- `src/index.ts` — add DsInputText + DsInputTextProps export

### Project Structure Notes

- Follows co-located file structure: `.vue`, `.stories.ts`, `.test.ts`, `index.ts` in `src/components/DsInputText/`
- Naming: PascalCase directory and files (`DsInputText/DsInputText.vue`)
- Stories file created as placeholder — full stories implementation is Epic 3
- No new dependencies required — uses existing PrimeVue InputText + project's DsIcon

### Anti-Patterns to Avoid

- Do NOT use 36px for medium size — Figma clearly shows 40px
- Do NOT use 16px font for medium — both sizes use 14px per Figma
- Do NOT hardcode hex colors — all colors via design tokens/preset
- Do NOT skip the composite structure (label + input + hint) — build as single component
- Do NOT create separate Label/Hint components — keep them as internal sections of DsInputText
- Do NOT add state management or composables — this is a thin wrapper with visual state logic
- Do NOT use `defineProps` without TypeScript generic syntax

### Testing Approach

Follow DsButton.test.ts pattern exactly:
- Mount with `@vue/test-utils` `mount()`
- Use `globalConfig` with `PrimeVue` plugin (`theme: 'none'`)
- Find inner PrimeVue `InputText` via `wrapper.findComponent(InputText)`
- Check props via component props
- Check classes on wrapper for state-specific CSS classes
- Check attributes: `aria-describedby`, `aria-disabled`
- Check label/hint text rendering via `.find()` selectors

### References

- [Source: Figma node 2198:12433] — Input component variants, sizes, states, tokens
- [Source: Figma node 2072:10430] — InputField composite with Label, Input, Hint/Error, Dropdown
- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.2] — Original acceptance criteria (updated with Figma findings)
- [Source: _bmad-output/planning-artifacts/prd.md#FR11] — DsInputText with sizes and states
- [Source: _bmad-output/planning-artifacts/epics.md#UX-DR10] — 8 visual states (expanded to 9 per Figma)
- [Source: _bmad-output/planning-artifacts/epics.md#UX-DR11] — Form validation on blur
- [Source: _bmad-output/planning-artifacts/epics.md#UX-DR15] — Uniform size token table
- [Source: src/components/DsButton/DsButton.vue] — Reference wrapper pattern, dt tokens, state styles
- [Source: src/components/DsButton/DsButton.test.ts] — Reference test pattern

### Previous Story Intelligence

**From Story 2.1 (DsIconButton):**
- Wrapper pattern validated with PrimeVue Button
- `dt` prop approach confirmed working for size overrides
- Co-located file structure confirmed

**From Story 1.3 (DsButton):**
- Styled Mode approach validated
- `dt` prop for per-instance sizing overrides works
- 150ms ease transitions pattern established
- Disabled opacity 0.5 pattern established

**From Story 1.2.1 (DsIcon):**
- DsIcon uses `currentColor` — will inherit from parent context
- Can be used inside leading slot and for internal error/info icons

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Initial lint failures: unused `vi` import and import order — fixed immediately.

### Completion Notes List

- Implemented DsInputText as a composite InputField component (label + input + hint/error) matching Figma designs.
- Component wraps PrimeVue InputText with `inheritAttrs: false` + `v-bind="$attrs"` pattern (same as DsButton).
- Supports 2 sizes: small (32px) and medium (40px) with 14px font for both — corrected from original epics which stated M=36px/16px.
- Implements 9 visual states via CSS (Default, Hover, Focus, Input-text, Filled, Filled-Hover, Disabled, Alert, Alert-Input).
- Label section: text, mandatory asterisk, optional text, info icon using DsIcon.
- Hint/error text: regular hint in gray-600, error in red-700 with error triangle icon and `aria-describedby` linkage.
- Leading icon slot, trailing elements (dropdown arrow, clear button, error icon).
- Clear button emits `clear` event and resets v-model.
- 150ms ease transitions on border-color, background-color, box-shadow (disabled state skips transitions).
- Uses `useId()` (Vue 3.5+) for unique error message ID linking.
- 36 new tests, 140 total passing across 6 test files. Zero regressions.
- Build output: dist/index.css 7.05KB, dist/index.js 130KB.

### Change Log

- 2026-04-04: Implemented Story 2.2 — DsInputText component with full Figma design fidelity.

### File List

**Created:**
- src/components/DsInputText/DsInputText.vue
- src/components/DsInputText/DsInputText.test.ts
- src/components/DsInputText/DsInputText.stories.ts
- src/components/DsInputText/index.ts

**Modified:**
- src/index.ts (added DsInputText + DsInputTextProps export)
