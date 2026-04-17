# Story 8.2: DsCodeInput Component

Status: done

## Story

As a **developer or AI agent** implementing a Figma design that contains a PIN/OTP-style verification code input,
I want a `DsCodeInput` component that wraps PrimeVue `InputOtp` with per-cell states (Default, Hover, Focused, Input, Error, Disabled), configurable length (default 4), optional error message, full keyboard/paste support, and design-system scoped CSS that matches the Figma "Code input" category exactly in both light and dark themes,
So that I can render verification-code inputs matching the Figma Design System without writing custom per-cell keyboard/paste logic or hardcoded colors.

## Figma Design References

- Code input category (all variants): https://www.figma.com/design/3qP5xnwc6gXhZR3AnFAMFe/Design-Systems?node-id=2-45695&m=dev
- Cell variants (`Category` node `2:45695`):
  - `2:45700` — `style="Focused"` — white bg, purple-400 (#7849ff) 1.5px border, purple glow `0 0 5px rgba(120,73,255,0.6)`, caret rendering (a 1.5px rounded purple bar bottom-center)
  - `2:45703` — `style="Input-nom"` — white bg, purple-400 border, entered digit rendered in purple-600 (#7849ff) 30px Inter regular, `letter-spacing: -0.2px`, line-height `typography/size/2xl` (32px)
  - `2:45706` — `style="Error"` — red-50 (#fff1f2) bg, red-700 (#f22a42) 1.5px border, entered digit in gray-800 (#314158)
  - `2:45709` — `style="Default"` — gray-100 (#f8fafc) bg, gray-300 (#e2e8f0) 1.5px border, empty cell
  - `2:45712` — `style="Hover"` — gray-200 (#f1f5f9) bg, gray-800 (#314158) 1.5px border
- Error message example: `2:45733` — "Invalid code", color `token/text/negative/red` (`#e74343` → maps to `--p-red-700`), Inter 500 14px / 20px line-height
- Row dimensions: every cell is `43px × 58px`, `border-radius: 4px`, cells separated by `16px` gap. Default length shown in Figma = 4. Use `style="Input-nom"` with value "5" (from Figma mock) as the canonical "Input" state visual.

## Acceptance Criteria

1. **Given** `DsCodeInput` wraps PrimeVue `InputOtp` using `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` (FR9), **When** a developer uses `<DsCodeInput v-model="code" />`, **Then** the component renders a horizontal row of individual character cells (default length 4) matching the Figma "Code input" category in both light and dark themes (FR10). The entire cell/keyboard/paste mechanics are delegated to PrimeVue `InputOtp` — the wrapper provides only DS-specific visual styling, the label/error/hint envelope, and the outer container.

2. **Given** each cell follows the Figma geometry, **When** rendered, **Then** each cell is **exactly** `43px` wide × `58px` tall with `border-radius: 4px` and a `1.5px` solid border. Cells are spaced with a `16px` horizontal gap. The entered digit uses Inter regular `30px` / line-height `32px` (`typography/size/2xl`) / letter-spacing `-0.2px`. Empty cells render no glyph (neither caret nor placeholder) except in the Focused state (see AC #3).

3. **Given** each cell renders the 5 Figma visual states, **When** the user interacts with a cell, **Then** styling applies per state (all colors via `--p-*` CSS custom properties — **no hardcoded hex**):
   - **Default** (cell has no value and is not focused): bg `--p-gray-100`, border `--p-gray-300`.
   - **Hover** (cell has no value, not focused, pointer over): bg `--p-gray-200`, border `--p-gray-800`, no shadow.
   - **Focused** (cell has no value, `:focus-within`): bg `--p-surface-0` (white), border `--p-purple-600` (**project token** — maps to Figma `outline/brand/purple-400` value `#7849ff`; see §Token Mapping), shadow `0 0 5px rgba(120, 73, 255, 0.6)`. The native `<input>` caret is visible (PrimeVue `InputOtp` uses a real `<input type="text">` per cell — do NOT suppress the browser caret).
   - **Input** (cell has a value, not in error): bg `--p-surface-0`, border `--p-purple-600`, entered digit color `--p-purple-600`. Whether focused or not, the Input visual persists once a value exists (matches the 4-cell "Input" row in Figma — every cell after typing stays purple-bordered with purple text).
   - **Error** (cell is within an errored `DsCodeInput`, `error` prop is a non-empty string): bg `--p-red-50`, border `--p-red-700`, entered digit color `--p-gray-800` (white-mode) / remains legible in dark mode via token resolution. The Focused/Input borders are overridden by Error while the prop is active.
   - **Disabled**: bg `--p-gray-100`, border `--p-gray-300`, text `--p-gray-500`, `pointer-events: none`, `cursor: not-allowed`. Matches the DsInputText disabled treatment (no opacity reduction — the uniform disabled pattern for this library is muted colors, not opacity; see `DsInputText.vue` lines 274–288).

4. **Given** the `length` prop controls cell count, **When** `length` is set (default `4`), **Then** `length` cells render. The prop is forwarded to PrimeVue `InputOtp` via `v-bind="$attrs"` — **do not** redeclare it as an explicit DS prop (keeps the wrapper thin and avoids drift with PrimeVue's semantics). The component MUST accept any positive integer; document in the AI KB that the Figma canonical length is 4 but longer codes are supported.

5. **Given** the `modelValue` is a string (e.g., `"5234"`), **When** the consumer uses `v-model="code"`, **Then** two-way binding works via `defineModel<string>()` — the model holds the concatenated cell values. An empty model string renders all cells empty (Default state). When the user types, PrimeVue auto-advances focus to the next cell and emits `update:modelValue`; on Backspace in an empty cell, focus moves to the previous cell and clears it (PrimeVue's built-in `InputOtp` behavior — **do not** reimplement). Paste of a full code into the first cell populates all cells and emits a single `update:modelValue` with the full string.

6. **Given** `DsCodeInput` supports an optional label above the row, **When** the `label` prop is provided, **Then** a label element renders above the cells with `margin-bottom: 2px`, gap 4px between label / cells / footer (mirrors DsInputText footer layout — see `DsInputText.vue:150–155`). Label typography: Inter medium `14px` / line-height `20px` / `letter-spacing -0.2px` / color `--p-gray-900`. The label carries an `id` and the outer container sets `aria-labelledby` pointing at it. **Do NOT** use a `<label for="…">` association — PrimeVue `InputOtp` renders multiple `<input>` elements, so a single `for` target is wrong.

7. **Given** `DsCodeInput` supports an optional hint + error message below the row, **When** the `hint` prop is a string AND `error` is empty, **Then** hint text renders below the row in `Inter 400 14px / 20px / --p-gray-600` (matches DsInputText hint — `DsInputText.vue:349–356`). **When** the `error` prop is a non-empty string, **Then** the error message renders below the row in `Inter 500 14px / 20px / --p-red-700` preceded by a 14px `<DsIcon name="error" size="xsmall" />` in `--p-red-700` (gap 2px between icon and text). Note the Figma "Invalid code" caption renders at **14px** (token `font/size/md`), **not** 12px — this differs from DsInputText's 12px error caption. Follow the Figma spec.

8. **Given** the error state must be accessible (NFR5, UX-DR20), **When** the error prop is set, **Then** a `role="group"` container element wraps the row with `aria-invalid="true"` and `aria-describedby="{errorId}"` pointing at the rendered error message element. The group also has `aria-labelledby="{labelId}"` (when a `label` prop is provided). **Additionally**, the same `aria-describedby={errorId}` and `aria-invalid="true"` MUST be routed onto each cell `<input>` via PrimeVue's `pt.pcInputText.root` pass-through — `aria-describedby` does NOT inherit from a `role="group"` ancestor to descendant inputs per WAI-ARIA, so without per-cell ARIA screen readers will not announce the error when focus lands on a cell. Whitespace-only `label` and `error` strings MUST be treated as absent (no `aria-labelledby` / `aria-invalid` emitted, no DOM rendered).

9. **Given** keyboard navigation requirements for custom-composed inputs (NFR5), **When** the user interacts with the cells, **Then** the built-in PrimeVue `InputOtp` behavior provides: Tab/Shift-Tab between the group and surrounding UI (the group itself is **not** a tab stop — each cell is focusable), arrow keys (Left / Right) to move between cells, Backspace to clear and move backward, digit keys to type and auto-advance, and paste (Cmd/Ctrl+V) to populate all cells at once. Do NOT add competing custom listeners — verify in tests that these behaviors work via PrimeVue, not via DsCodeInput code.

10. **Given** `DsCodeInput` wraps PrimeVue `InputOtp`, **When** a consumer passes PrimeVue `InputOtp` props (`length`, `mask`, `integerOnly`, `disabled`, `readonly`, `variant`, `invalid`, `tabindex`, `size`, `pt`, `ptOptions`, etc.) or events, **Then** they are forwarded via `inheritAttrs: false` + `v-bind="$attrs"` (FR9). DsCodeInput's **explicit** props are limited to the DS-specific envelope: `label?: string`, `hint?: string`, `error?: string`, `disabled?: boolean`, and the `modelValue` via `defineModel`. All other behavior (length, mask, integerOnly) comes through via `$attrs` — **do not** redeclare them. **Target note:** `v-bind="$attrs"` on `<InputOtp>` lands on the PrimeVue root `<div>` wrapper, not on the per-cell `<input>` elements. Per-input attributes (most importantly `autocomplete="one-time-code"` for native OTP autofill) must be routed via `pt.pcInputText.root.*`. Consumer-supplied `pt` MUST be deep-merged (at the `pcInputText.root` level) with this wrapper's internal injections (the space placeholder and, when active, the per-cell `aria-describedby` / `aria-invalid`) so consumer `pt` keys coexist with the wrapper's own.

11. **Given** the `disabled` prop is set, **When** rendered, **Then** the wrapper applies the `.ds-code-input--disabled` modifier (cell visual per AC #3 Disabled row) AND forwards `disabled="true"` to PrimeVue `InputOtp` (via an explicit binding, since this is a DS prop we typed explicitly). The label, hint, and error sections retain their layout but error is SUPPRESSED when disabled (`showError` computed gates on `!props.disabled` — mirrors `DsInputText.vue:52`). The wrapper is also **not** a focus target when disabled — rely on PrimeVue's internal `disabled` handling per-cell.

12. **Given** all Figma state transitions use project motion conventions (UX-DR9), **When** a cell transitions between states (Default ↔ Hover ↔ Focused, or Default ↔ Input), **Then** `background-color`, `border-color`, and `box-shadow` transition at `150ms ease`, wrapped in `@media (prefers-reduced-motion: no-preference)`. The Disabled state skips transitions (mirrors DsInputText's `--transitions` class gating pattern). Focus styling uses `:focus-visible` via a `.ds-code-input:has(input:focus-visible) .p-inputotp-input` selector so mouse focus does NOT show the purple glow — only keyboard focus does (UX-DR8).

13. **Given** the component follows the co-located file convention (architecture §Project Structure), **When** implementation is complete, **Then** the directory `src/components/DsCodeInput/` contains `DsCodeInput.vue`, `DsCodeInput.stories.ts`, `DsCodeInput.test.ts`, `index.ts`; the component is re-exported from `src/index.ts` as `{ DsCodeInput, type DsCodeInputProps }` (alphabetical — insert **between** `DsChip` and `DsIcon`); Storybook stories cover all 5 cell states × default length, plus error-state (with message), disabled, custom length (e.g., 6 cells), `integerOnly`, `mask`, and a "paste-a-code" interactive story; Vitest tests verify prop → class application, model binding, passthrough of `length`/`mask`/`integerOnly`, error message rendering, hint rendering, label association, disabled behavior, and PrimeVue passthrough; an AI KB entry exists at `docs/ai-guidelines/ds-code-input.md` following the DsInputText / DsAvatar structure; the AI KB index `docs/ai-guidelines/index.md` lists `DsCodeInput` in the Component Inventory and the "Figma Element to Component Matching Guide" sections (alphabetical — inserts **between** `DsChip` and `DsIcon`).

14. **Given** PrimeVue `InputOtp` is not yet used anywhere in this codebase (grep confirmed zero hits), **When** the wrapper imports it, **Then** import with `import InputOtp from 'primevue/inputotp';` (kebab-less lowercase path — matches PrimeVue 4.x convention verified at `primevue/chip`, `primevue/avatar`, `primevue/inputtext`). No separate plugin registration is required because consumers already register the `PrimeVue` plugin globally; `InputOtp` is a regular PrimeVue component and works under the same `theme: 'none'` or `theme: { preset: dsPreset }` configuration.

## Tasks / Subtasks

- [x] **Task 1: Create DsCodeInput component scaffold** (AC: #13)
  - [x] 1.1 Create directory `src/components/DsCodeInput/`
  - [x] 1.2 Create empty files: `DsCodeInput.vue`, `DsCodeInput.stories.ts`, `DsCodeInput.test.ts`, `index.ts`
  - [x] 1.3 Populate `src/components/DsCodeInput/index.ts` with: `export { default as DsCodeInput } from './DsCodeInput.vue'; export type { DsCodeInputProps } from './DsCodeInput.vue';`
  - [x] 1.4 Update `src/index.ts` to add — **alphabetical insertion**: between the `DsChip` line and the `DsIcon` line — `export { DsCodeInput, type DsCodeInputProps } from './components/DsCodeInput';`

- [x] **Task 2: Implement `DsCodeInput.vue` — script & props** (AC: #1, #5, #6, #7, #10, #11, #14)
  - [x] 2.1 `<script setup lang="ts">` with imports (Biome-enforced order: external then relative):
    ```ts
    import InputOtp from 'primevue/inputotp';
    import { computed, useId } from 'vue';
    import DsIcon from '../DsIcon/DsIcon.vue';
    ```
  - [x] 2.2 Define and export the props interface (keep narrow — everything else flows through `$attrs`):
    ```ts
    export interface DsCodeInputProps {
      /** Label text above the cells. Associated via aria-labelledby (not <label for>). */
      label?: string;
      /** Helper text below the cells. Hidden when `error` is set. */
      hint?: string;
      /** Error message — triggers the Error cell state and renders below the cells with a red error icon. */
      error?: string;
      /** Disabled state. Applies muted cell styling and suppresses the error message. Default: false */
      disabled?: boolean;
    }
    ```
  - [x] 2.3 `defineOptions({ inheritAttrs: false });`
  - [x] 2.4 `const props = withDefaults(defineProps<DsCodeInputProps>(), { disabled: false });`
  - [x] 2.5 `const model = defineModel<string>();` — holds the concatenated code. PrimeVue `InputOtp` emits `update:modelValue` with the full string (length = typed cells; empty string when cleared).
  - [x] 2.6 `const errorId = useId(); const labelId = useId();` — unique IDs for `aria-describedby` / `aria-labelledby`.
  - [x] 2.7 Computed helpers:
    - `const isError = computed(() => !!props.error);`
    - `const showError = computed(() => isError.value && !props.disabled);` — mirrors `DsInputText.vue:52`.
    - `const containerClasses = computed(() => ({ 'ds-code-input': true, 'ds-code-input--error': showError.value, 'ds-code-input--disabled': props.disabled, 'ds-code-input--transitions': !props.disabled }));`

- [x] **Task 3: Implement `DsCodeInput.vue` — template** (AC: #1, #2, #6, #7, #8, #11)
  - [x] 3.1 Outer container is a `<div>` with `:class="containerClasses"` plus `role="group"`, `:aria-labelledby="label ? labelId : undefined"`, `:aria-describedby="showError ? errorId : undefined"`, `:aria-invalid="showError ? 'true' : undefined"`.
  - [x] 3.2 If `label` prop set, render `<span :id="labelId" class="ds-code-input__label">{{ label }}</span>` above the row. Use a `<span>` (not `<label>`) because there is no single `<input id>` to point `for` at — AC #6.
  - [x] 3.3 Render `<InputOtp v-bind="$attrs" v-model="model" :disabled="disabled" class="ds-code-input__otp" />`. The component ships with its own cell DOM; our wrapper styles it via `:deep(.p-inputotp-input)` in the `<style>` block (AC #3).
  - [x] 3.4 Below the OTP row: if `showError`, render `<div :id="errorId" class="ds-code-input__error-msg"><span class="ds-code-input__error-msg-icon" aria-hidden="true"><DsIcon name="error" size="xsmall" /></span><span>{{ error }}</span></div>` (mirrors `DsInputText.vue:136–141`). Else if `hint`, render `<div class="ds-code-input__hint">{{ hint }}</div>`.
  - [x] 3.5 Do NOT set `tabindex` on the outer container — focus management is per-cell and owned by PrimeVue. Do NOT add a `<fieldset>` + `<legend>` — the `role="group"` + `aria-labelledby` pattern is more accessible for this layout and matches the existing library convention.

- [x] **Task 4: Implement `DsCodeInput.vue` — scoped styles** (AC: #2, #3, #6, #7, #12)
  - [x] 4.1 Base container layout:
    ```css
    .ds-code-input {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: fit-content;
    }
    .ds-code-input__label {
      font-family: var(--font-family, 'Inter', sans-serif);
      font-weight: 500;
      font-size: 0.875rem;      /* 14px */
      line-height: 1.25rem;     /* 20px */
      letter-spacing: -0.2px;
      color: var(--p-gray-900);
      margin-bottom: 2px;
    }
    ```
  - [x] 4.2 OTP root — strip PrimeVue defaults, apply gap:
    ```css
    .ds-code-input__otp {
      display: inline-flex;
      gap: 16px;
    }
    /* PrimeVue 4.x renders a flex container with cell inputs inside .p-inputotp-input.
       Strip any inherited padding / border-radius that would collide with our per-cell look. */
    .ds-code-input :deep(.p-inputotp) {
      display: inline-flex;
      gap: 16px;
      padding: 0;
    }
    ```
    **Important:** run the component in Storybook first to inspect the actual PrimeVue 4.x DOM. If the outer wrapper class differs from `.p-inputotp` (e.g. `.p-inputotp-root` or similar), adjust the selector. Document the actual class name in Completion Notes.
  - [x] 4.3 Per-cell styles — PrimeVue renders each cell as `<input class="p-inputotp-input">`:
    ```css
    .ds-code-input :deep(.p-inputotp-input) {
      /* Geometry */
      box-sizing: border-box;
      width: 43px;
      height: 58px;
      padding: 0;
      border-radius: 4px;
      border: 1.5px solid var(--p-gray-300);
      background-color: var(--p-gray-100);

      /* Typography */
      font-family: var(--font-family, 'Inter', sans-serif);
      font-weight: 400;
      font-size: 30px;
      line-height: 32px;              /* typography/size/2xl */
      letter-spacing: -0.2px;
      color: var(--p-gray-800);
      text-align: center;
      caret-color: var(--p-purple-600);

      /* Reset native input chrome */
      outline: none;
      box-shadow: none;
    }
    ```
  - [x] 4.4 Hover state — only when the cell is empty (no value) AND not focused. PrimeVue adds no class for "has value"; use `:not(:placeholder-shown)` OR the `[value]:not([value=""])` attribute selector if `placeholder` is never set — prefer the `:placeholder-shown` approach with an empty space placeholder is fragile. **Robust approach:** use `:not(:focus):not(:placeholder-shown)` to detect "filled, not focused" and invert:
    ```css
    .ds-code-input--transitions :deep(.p-inputotp-input):hover:placeholder-shown:not(:focus) {
      background-color: var(--p-gray-200);
      border-color: var(--p-gray-800);
    }
    ```
    BUT `placeholder-shown` requires a placeholder attribute. PrimeVue `InputOtp` by default renders `<input placeholder="">`, which means `:placeholder-shown` matches when value is empty. Verify this empirically in Storybook devtools — if PrimeVue does NOT set a placeholder, fall back to attribute selector `[value=""]` (Vue binds `value` reactively so this works) or use the `:not(:focus-within):not(.p-filled)` combo. **Document the actual approach used** in Completion Notes after verifying PrimeVue's DOM.
  - [x] 4.5 Focused state (empty cell, keyboard focus):
    ```css
    .ds-code-input :deep(.p-inputotp-input):focus {
      background-color: var(--p-surface-0);
      border-color: var(--p-purple-600);
      box-shadow: 0 0 5px 0 rgba(120, 73, 255, 0.6);
    }
    /* Only show the purple glow for keyboard focus (UX-DR8). Mouse focus keeps the border swap
       but suppresses the glow — override box-shadow when focus came from pointer. */
    .ds-code-input :deep(.p-inputotp-input):focus:not(:focus-visible) {
      box-shadow: none;
    }
    ```
  - [x] 4.6 Input state (cell has a value, regardless of focus). Use `:not(:placeholder-shown)` to detect a typed character, OR use the `[value]:not([value=""])` selector — whichever matches PrimeVue's DOM. **After verification in Storybook**, write the rule as:
    ```css
    .ds-code-input :deep(.p-inputotp-input):not(:placeholder-shown) {
      background-color: var(--p-surface-0);
      border-color: var(--p-purple-600);
      color: var(--p-purple-600);
    }
    ```
    If `:placeholder-shown` does not apply (no placeholder attribute), use attribute selectors: `[value]:not([value=""])`. Capture the final selector in Completion Notes.
  - [x] 4.7 Error state (container has `.ds-code-input--error`) — beats Focused and Input:
    ```css
    .ds-code-input--error :deep(.p-inputotp-input) {
      background-color: var(--p-red-50);
      border-color: var(--p-red-700);
      color: var(--p-gray-800);
    }
    .ds-code-input--error :deep(.p-inputotp-input):focus {
      box-shadow: 0 0 0 3px var(--p-red-100);
    }
    ```
  - [x] 4.8 Disabled state:
    ```css
    .ds-code-input--disabled :deep(.p-inputotp-input) {
      background-color: var(--p-gray-100);
      border-color: var(--p-gray-300);
      color: var(--p-gray-500);
      pointer-events: none;
      cursor: not-allowed;
    }
    ```
  - [x] 4.9 Transitions — gated on `--transitions` (skipped when disabled):
    ```css
    @media (prefers-reduced-motion: no-preference) {
      .ds-code-input--transitions :deep(.p-inputotp-input) {
        transition:
          background-color 150ms ease,
          border-color 150ms ease,
          box-shadow 150ms ease,
          color 150ms ease;
      }
    }
    ```
  - [x] 4.10 Footer (hint / error message) — mirror `DsInputText.vue:344–376`:
    ```css
    .ds-code-input__hint {
      font-family: var(--font-family, 'Inter', sans-serif);
      font-weight: 400;
      font-size: 0.875rem;      /* 14px per Figma */
      line-height: 1.25rem;
      letter-spacing: -0.2px;
      color: var(--p-gray-600);
    }
    .ds-code-input__error-msg {
      display: flex;
      align-items: center;
      gap: 2px;
      font-family: var(--font-family, 'Inter', sans-serif);
      font-weight: 500;         /* 500 per Figma "Invalid code" sample */
      font-size: 0.875rem;      /* 14px per Figma — differs from DsInputText (12px) */
      line-height: 1.25rem;
      color: var(--p-red-700);
    }
    .ds-code-input__error-msg-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: var(--p-red-700);
    }
    ```

- [x] **Task 5: Storybook stories** (AC: #13)
  - [x] 5.1 Create `DsCodeInput.stories.ts` — use `Meta`/`StoryObj` from `@storybook/vue3-vite` (mirror DsInputText.stories.ts). `argTypes` for `label`, `hint`, `error`, `disabled`, and a control for `length` (pass through via `v-bind`).
  - [x] 5.2 `Default` story — empty, no props. Verifies Default cell state for 4 cells. Include `v-model` with a `ref('')`.
  - [x] 5.3 `Filled` story — pre-populate `modelValue = '5234'`. Verifies Input state on every cell (purple border + purple text).
  - [x] 5.4 `WithLabel` story — `label: "Verification code"`.
  - [x] 5.5 `WithHint` story — `label: "Verification code", hint: "Check your email for a 4-digit code"`.
  - [x] 5.6 `ErrorState` story — `label: "Verification code", error: "Invalid code", modelValue: '5234'`. Matches the Figma "Invalid code" row exactly.
  - [x] 5.7 `Disabled` story — `disabled: true, modelValue: '5234', label: "Verification code"`.
  - [x] 5.8 `CustomLength` story — pass `:length="6"` via `args` (through `v-bind` on the template). Renders 6 cells. Demonstrates the `$attrs` pass-through.
  - [x] 5.9 `IntegerOnly` story — pass `:integerOnly="true"` via `$attrs`. Consumer sees that non-digit keystrokes are blocked by PrimeVue.
  - [x] 5.10 `MaskedPin` story — pass `:mask="true"`. Entered digits render as bullet characters (PrimeVue default).
  - [x] 5.11 `PasteInteractive` story — default, empty. Instructions in docstring: "paste '1234' into the first cell; all 4 cells populate". Verifies PrimeVue paste handling end-to-end.
  - [x] 5.12 `AllStates` composite story — renders 5 rows mirroring the Figma canvas: row 1 Error (4 cells filled), row 2 Focused+Hover+Default (manual prop tweak via `mode` arg not possible — use raw `<DsCodeInput>` instances wrapped in a flex column, with one instance auto-focused via `autofocus` attr to demonstrate the Focused cell), row 3 Input (filled). Purely presentational; mirror Figma `2:45721`.
  - [x] 5.13 Verify each story in BOTH light and dark themes via the Storybook theme toggle (NFR12) — the Input-state purple text (`--p-purple-600`) and Error bg (`--p-red-50`) MUST remain legible in dark mode. If contrast fails in dark mode, document in Completion Notes (do NOT swap to light-only overrides; raise as a token-mapping question instead).

- [x] **Task 6: Vitest tests** (AC: #1, #2, #3, #5, #6, #7, #8, #9, #10, #11, #13)
  - [x] 6.1 Scaffold from `DsInputText.test.ts`: `import { mount } from '@vue/test-utils'; import PrimeVue from 'primevue/config'; import InputOtp from 'primevue/inputotp'; import { describe, expect, it } from 'vitest'; import DsCodeInput from './DsCodeInput.vue';` plus `const globalConfig = { plugins: [[PrimeVue, { theme: 'none' }]] };`.
  - [x] 6.2 **Structure tests:**
    - Renders the outer `.ds-code-input` root, contains an `InputOtp` component instance.
    - No `label` prop → no `.ds-code-input__label` span rendered. With `label: "X"` → span with id referenced by the group's `aria-labelledby`.
    - No `hint` and no `error` → no footer rendered.
  - [x] 6.3 **Model tests:**
    - `v-model` two-way binding: mount with `modelValue: '12'`, assert the underlying `InputOtp` receives the same value via `wrapper.findComponent(InputOtp).props('modelValue') === '12'`.
    - Emit: simulate PrimeVue emitting `update:modelValue` with `'1234'` via `wrapper.findComponent(InputOtp).vm.$emit('update:modelValue', '1234')` — assert DsCodeInput re-emits `update:modelValue` with the same value.
  - [x] 6.4 **Passthrough tests (AC #10):**
    - Pass `length: 6` as an attr → InputOtp receives `length === 6`.
    - Pass `integerOnly: true` → forwarded.
    - Pass `mask: true` → forwarded.
    - Pass arbitrary `data-testid="code"` — lands on the InputOtp root.
  - [x] 6.5 **Hint / Error tests (AC #7, #8):**
    - `hint: "Check your email"` → hint div rendered with that text; error div absent.
    - `error: "Invalid"` → error div rendered with icon + text; hint div absent. Error message has an `id` matching the group's `aria-describedby`. Group has `aria-invalid="true"`.
    - Setting both `hint` and `error` → error wins, hint hidden.
    - `error: "Invalid", disabled: true` → error is SUPPRESSED, group has no `aria-describedby`, no error DOM rendered (mirrors DsInputText behavior — `DsInputText.vue:52`).
  - [x] 6.6 **Class tests (AC #3, #11):**
    - Default props → container has `.ds-code-input`, `.ds-code-input--transitions`. No `--error` or `--disabled`.
    - `error: "X"` → container has `.ds-code-input--error`.
    - `disabled: true` → container has `.ds-code-input--disabled`, no `--transitions`.
    - `disabled: true` → InputOtp receives `disabled: true` as a prop (not just via class).
  - [x] 6.7 **A11y tests (AC #6, #8):**
    - Group container has `role="group"` always.
    - With `label`, group has `aria-labelledby` matching the label span's `id`.
    - Without `label`, no `aria-labelledby`.
    - With `error` (and not disabled), group has `aria-describedby` matching the error div's `id` AND `aria-invalid="true"`.
    - `label` element is a `<span>`, NOT a `<label>` with `for` (guards against the wrong-a11y-pattern regression described in AC #6).
  - [x] 6.8 **Regression guard:** DsInputText passthrough tests and preset tests must still pass. After implementing, run the full suite and record the new count. Baseline after stories 7.1 + 7.2 + 7.3 = **393 tests** (per `7-3-dsavatar-component.md` Debug Log). Expect the new DsCodeInput suite to add ~20 tests → target ~413 total.

- [x] **Task 7: AI knowledge base entry** (AC: #13)
  - [x] 7.1 Create `docs/ai-guidelines/ds-code-input.md` mirroring the DsInputText entry structure (Component heading, When to Use, Import, Props table, Variants/States, Sizes-or-Length, Slots, Events, Usage Examples, Accessibility, Figma Reference).
  - [x] 7.2 Props table documents: `label`, `hint`, `error`, `disabled`, `modelValue`. Add a **separate** "PrimeVue InputOtp props (forwarded via `$attrs`)" subsection listing the common ones: `length` (default 4), `mask`, `integerOnly`, `readonly`, `size`, `variant`, `tabindex` with a link to the PrimeVue docs URL `https://primevue.org/inputotp`.
  - [x] 7.3 Usage examples (5 minimum):
    - Basic: `<DsCodeInput v-model="code" label="Verification code" />`.
    - With hint: `<DsCodeInput v-model="code" label="Verification code" hint="Check your email for a 4-digit code" />`.
    - Error state: `<DsCodeInput v-model="code" label="Verification code" error="Invalid code" />`.
    - Custom length: `<DsCodeInput v-model="code" :length="6" integerOnly />`.
    - Masked PIN: `<DsCodeInput v-model="pin" :length="4" mask integerOnly label="PIN" />`.
  - [x] 7.4 Update `docs/ai-guidelines/index.md`:
    - 7.4.1 Add `DsCodeInput` to the import example line (alphabetical — between `DsChip` and `DsIcon`).
    - 7.4.2 Add a Component Inventory row — insert between the `DsChip` row and the `DsIcon` row:
      `| \`DsCodeInput\` | PIN/OTP-style verification code input with per-cell states, configurable length, error message, and paste support | \`import { DsCodeInput } from '@failwin/desing-system-vue'\` | Code input, Verification code, OTP, PIN |`.
    - 7.4.3 Add a `**DsCodeInput**` section in "Figma Element to Component Matching Guide" — inserts between `**DsChip**` and `**DsIcon**` sections. Include mappings:
      - `Code input` → `<DsCodeInput v-model="code" />`
      - `Code input / Default` → `<DsCodeInput v-model="code" />` (all cells empty)
      - `Code input / Focused` → `<DsCodeInput v-model="code" />` with first cell focused via `autofocus` attr on the outer row (or consumer-controlled focus)
      - `Code input / Input` → `<DsCodeInput v-model="'5234'" />`
      - `Code input / Error` → `<DsCodeInput v-model="code" error="Invalid code" />`
      - `Code input / Hover` → `<DsCodeInput v-model="code" />` (hover is CSS-driven, no prop)
      - Length variants: default `length=4`, pass `:length="N"` for N cells.

- [x] **Task 8: Validate & ship**
  - [x] 8.1 `npm run lint` — Biome clean. Watch for import order in `DsCodeInput.vue` — external (`primevue/inputotp`, `vue`) then relative (`../DsIcon/DsIcon.vue`). This caught Stories 6.1 / 7.1 / 7.3.
  - [x] 8.2 `npm test` — full suite green; target ~413 tests (up from the 393 baseline after story 7.3).
  - [x] 8.3 `npm run build` — `vue-tsc --noEmit` + `vite build` must succeed. Verify `dist/index.d.ts` re-exports `DsCodeInput` + `DsCodeInputProps`, and `dist/components/DsCodeInput/DsCodeInput.vue.d.ts` is generated.
  - [x] 8.4 `npm run storybook &` — open every DsCodeInput story, toggle between light and dark themes, verify:
    - Default: gray-100 cells with gray-300 border, 16px gap, 43×58 dimensions.
    - Focused: first cell has purple border + purple glow, caret visible.
    - Input: cells show purple digits in purple-bordered white cells.
    - Error: all cells red-bordered, red-50 bg; entered digits remain gray-800. Error message "Invalid code" rendered in red-700.
    - Paste "1234" into cell 1 → all 4 cells populate.
    - Integer-only: letters ignored.
    - Mask: digits rendered as bullets.
    - Disabled: muted gray, no interactions.
    - In dark mode, confirm text + borders remain legible across all stories.
  - [x] 8.5 Record the actual PrimeVue 4.x `InputOtp` DOM class names (e.g., `.p-inputotp` vs `.p-inputotp-input` — verify empirically in Storybook devtools) AND the selector used for the "filled" state (`:placeholder-shown` vs `[value]` attribute) in Completion Notes. If the selectors differ from what Task 4 assumed, document the change.
  - [x] 8.6 Update File List (Task 9) and Change Log below with the story-completion entry (current date).

## Dev Notes

### Architecture — Thin PrimeVue InputOtp Wrapper

`DsCodeInput` is a thin wrapper around `primevue/inputotp` (PrimeVue 4.5.4). PrimeVue `InputOtp` already provides the non-trivial per-cell keyboard + paste + focus-advance logic — our wrapper provides:

1. **DS-specific visual styling** — the Figma 43×58 cells, 16px gap, 1.5px borders, purple glow on focus, and the 5 state rules (AC #3). All via scoped CSS + `:deep()` selectors targeting PrimeVue's internal `<input class="p-inputotp-input">` elements.
2. **Label / hint / error envelope** — matching the DsInputText composite pattern (AC #6, #7).
3. **Accessibility on the group** — `role="group"` + `aria-labelledby` + `aria-describedby` + `aria-invalid` (AC #8).
4. **Thin prop surface** — only `label`, `hint`, `error`, `disabled`, `modelValue` are our props. `length`, `mask`, `integerOnly`, `readonly`, `size`, `variant`, `tabindex`, `pt`, `ptOptions` flow through via `$attrs` (AC #10).

### Component API

```ts
export interface DsCodeInputProps {
  /** Label text above the cells. Associated via aria-labelledby on the group container. */
  label?: string;
  /** Helper text below the cells. Hidden when `error` is set. */
  hint?: string;
  /** Error message — triggers the Error cell state and renders below the cells with a red error icon. */
  error?: string;
  /** Disabled state. Applies muted cell styling and suppresses the error message. Default: false */
  disabled?: boolean;
}
```

**Model:** `defineModel<string>()` — the full concatenated code. PrimeVue `InputOtp` handles per-cell → model serialization.

**Emits:** implicit `update:modelValue` via `defineModel`. No custom events.

**Slots:** none (all DOM owned by DsCodeInput + PrimeVue).

### Figma-Derived Specifications (node `2:45695`)

#### Cell Geometry

| Property | Value | Notes |
|---|---|---|
| Cell width | 43px | Fixed — not responsive |
| Cell height | 58px | Fixed |
| Border-radius | 4px | `radius/sm` (smaller than DsInputText's 8px) |
| Border width | 1.5px | **Non-standard** — not the 1px used elsewhere in the library. Keep as 1.5px per Figma. |
| Gap between cells | 16px | `spacing/p-4` |
| Font | Inter 400 30px / line-height 32px (`typography/size/2xl`) / letter-spacing -0.2px | Centered horizontally |

#### State Token Mapping

Figma uses its own token names (e.g., `outline/brand/purple-400` = `#7849ff`). This project's preset maps those hex values to different `--p-*` token names. Confirmed mappings:

| Figma token | Figma hex | Project token | Verified in |
|---|---|---|---|
| `outline/brand/purple-400` | `#7849ff` | `--p-purple-600` | `src/theme/ds-preset.ts:42` (purple-600 = `#7849ff`) |
| `taxt/brand/purple-600` | `#7849ff` | `--p-purple-600` | same — Figma calls this "purple-600" but the value matches `--p-purple-600` exactly |
| `surfase/negative/red-50` | `#fff1f2` | `--p-red-50` | `src/theme/ds-preset.ts:53` |
| `outline/negative/red-700` | `#f22a42` | `--p-red-700` | `src/theme/ds-preset.ts:60` |
| `surfase/main/gray-100` | `#f8fafc` | `--p-gray-100` | `src/theme/ds-preset.ts:21` |
| `surfase/main/gray-200` | `#f1f5f9` | `--p-gray-200` | `src/theme/ds-preset.ts:22` |
| `outline/main/gray-300` | `#e2e8f0` | `--p-gray-300` | `src/theme/ds-preset.ts:23` |
| `outline/main/gray-800` | `#314158` | `--p-gray-800` | `src/theme/ds-preset.ts:27` |
| `taxt/main/gray-500` | `#90a1b9` | `--p-gray-500` | `src/theme/ds-preset.ts:24` |
| `token/text/negative/red` (error msg) | `#e74343` | `--p-red-700` | close enough — Figma and preset differ by a shade, but the preset value (`#f22a42`) is the established design-system red used for all error text (see `DsInputText.vue:366`) |

**No preset changes required** for this story. All tokens already exist.

#### Cell State CSS Matrix

| State | Trigger | Background | Border | Text | Box-shadow |
|---|---|---|---|---|---|
| Default | empty + not focused + not error | `--p-gray-100` | `--p-gray-300` | — | none |
| Hover | empty + not focused + not error + pointer over | `--p-gray-200` | `--p-gray-800` | — | none |
| Focused | empty + keyboard focus + not error | `--p-surface-0` | `--p-purple-600` | — (caret visible) | `0 0 5px 0 rgba(120,73,255,0.6)` |
| Input | has value + not error | `--p-surface-0` | `--p-purple-600` | `--p-purple-600` | none |
| Error | `error` prop set (overrides Focused/Input) | `--p-red-50` | `--p-red-700` | `--p-gray-800` | `0 0 0 3px --p-red-100` (only when focused within error) |
| Disabled | `disabled` prop set | `--p-gray-100` | `--p-gray-300` | `--p-gray-500` | none; `pointer-events: none` |

### PrimeVue InputOtp 4.5.4 — API Summary

**Props (all forwarded via `$attrs` except `disabled`):**

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `modelValue` | `string` | — | v-model binding. Two-way. |
| `length` | `number` | `4` | Number of cells. |
| `mask` | `boolean` | `false` | Render entered chars as bullets. |
| `integerOnly` | `boolean` | `false` | Block non-digit keystrokes. |
| `disabled` | `boolean` | `false` | Disable all cells. Our wrapper forwards this explicitly. |
| `readonly` | `boolean` | `false` | Read-only. |
| `invalid` | `boolean` | `false` | Applies PrimeVue's invalid class. We do NOT use this — our `.ds-code-input--error` handles the error visual; PrimeVue's invalid styling would conflict. |
| `variant` | `'outlined' \| 'filled'` | — | PrimeVue variant. Irrelevant — our `:deep()` styles override. |
| `tabindex` | `number` | — | Tab order for the inputs. |
| `size` | `'small' \| 'large'` | — | PrimeVue size. Irrelevant — our cell geometry is fixed by the Figma spec. |
| `pt`, `ptOptions` | PrimeVue pass-through | — | Advanced styling hooks. |

**Emits:** `update:modelValue: (value: string) => void` — fired on every cell change.

**Built-in behavior (do NOT reimplement):**
- Tab enters the group → focus lands on the first empty cell (or the last filled if all filled).
- Typing a character auto-advances focus to the next cell.
- Backspace in a filled cell clears it (no focus move). Backspace in an empty cell moves focus to the previous cell and clears it.
- ArrowLeft / ArrowRight navigate between cells without modifying values.
- Cmd/Ctrl-V pastes the full code starting from cell 0 (or from the focused cell if the paste content fits the remaining cells).
- With `integerOnly: true`, letter keystrokes are ignored.
- With `mask: true`, rendered text is `•` per character but the modelValue still contains the raw chars.

### Existing Code to Reuse

| Artifact | Path | Reuse For |
|---|---|---|
| Wrapper pattern reference | `src/components/DsInputText/DsInputText.vue` | `inheritAttrs:false` + `defineOptions` + `$attrs` + `defineModel<string>()` + `useId()` + label/hint/error envelope + `showError` computed |
| Hint / error msg CSS | `src/components/DsInputText/DsInputText.vue:344–376` | Hint typography, error message flex layout, red triangle icon |
| :deep() PrimeVue strip pattern | `src/components/DsChip/DsChip.vue:94–99` | Override PrimeVue's internal background/padding on `.p-chip` — mirror for `.p-inputotp` / `.p-inputotp-input` |
| Transitions gating pattern | `src/components/DsInputText/DsInputText.vue:60–61, 296–298` | `.ds-code-input--transitions` class gate + `@media (prefers-reduced-motion: no-preference)` |
| Error icon | `DsIcon name="error" size="xsmall"` | Same icon as DsInputText error msg (`DsInputText.vue:137–139`) |
| Test scaffold | `src/components/DsInputText/DsInputText.test.ts:1–20` | globalConfig with PrimeVue plugin `theme: 'none'`, `findComponent` pattern |
| AI KB template | `docs/ai-guidelines/ds-input-text.md` | Section ordering, Props table style |
| AI KB index insertion | `docs/ai-guidelines/index.md:20, 27–36, 125–172` | Import example, Component Inventory row, Figma matching guide section |

### Files to Create

- `src/components/DsCodeInput/DsCodeInput.vue`
- `src/components/DsCodeInput/DsCodeInput.stories.ts`
- `src/components/DsCodeInput/DsCodeInput.test.ts`
- `src/components/DsCodeInput/index.ts`
- `docs/ai-guidelines/ds-code-input.md`

### Files to Modify

- `src/index.ts` — add `DsCodeInput` re-export (alphabetical — between `DsChip` and `DsIcon`)
- `docs/ai-guidelines/index.md` — add import example entry + Component Inventory row + Figma matching guide section (all alphabetical — between `DsChip` and `DsIcon`)

### Files NOT Changed

- `src/theme/ds-preset.ts` — no new tokens needed. All required colors already exist (verified in §Token Mapping above).
- Other component files — DsCodeInput is self-contained; no cross-component dependencies.
- `package.json` — PrimeVue 4.5.4 already includes InputOtp. No new deps.
- `src/assets/icons/` — reuses the existing `error` icon (verified via `src/components/DsInputText/DsInputText.vue:127` which already uses `<DsIcon name="error" />`).

### Anti-Patterns to Avoid

- **Do NOT** reimplement per-cell keyboard or paste logic — PrimeVue `InputOtp` handles it. If you find yourself writing `@keydown.backspace` or a paste handler, stop and re-read AC #9.
- **Do NOT** use a `<label for="…">` association — PrimeVue `InputOtp` renders multiple `<input>` children. A single `for` target is wrong. Use `role="group"` + `aria-labelledby` (AC #6).
- **Do NOT** set PrimeVue's `invalid` prop in parallel with our `.ds-code-input--error` class. PrimeVue's invalid styling (red border on the OTP root) would layer on top of our scoped-CSS Error state and produce two conflicting visuals. Our wrapper owns the error visual via `.ds-code-input--error :deep(.p-inputotp-input)`.
- **Do NOT** hardcode hex values in scoped CSS — always `var(--p-*)`. The ONLY exception is `rgba(120, 73, 255, 0.6)` in the Focused box-shadow, because there is no `--p-purple-600-alpha-60` token. Document this as an accepted exception in Completion Notes (the raw rgb value matches the `--p-purple-600` hex `#7849ff`, so it is self-documenting).
- **Do NOT** introduce a `size` prop — the Figma spec is a single fixed size. PrimeVue's `size` prop is forwarded via `$attrs` but irrelevant (our fixed `:deep()` CSS overrides it).
- **Do NOT** truncate the model — the consumer provides a string; PrimeVue paste fills whatever cells exist. If the pasted string is longer than `length`, extra chars are ignored by PrimeVue (confirmed behavior).
- **Do NOT** set `autofocus` on the outer container in the component — if a consumer wants autofocus, they can pass it via `$attrs` (PrimeVue `InputOtp` will route it to the first cell). The component itself must NOT steal focus on mount.
- **Do NOT** add `<fieldset>` / `<legend>` around the row — while semantically valid, it introduces a browser-default border and padding that fights the layout. Use `role="group"` + `aria-labelledby` instead (mirrors the established library pattern).

### Previous Story Intelligence

**From Story 7.3 (DsAvatar) — most recent completed story:**
- **Biome import order is strict** — run `npm run lint` before declaring tasks done. Has caught every story in this epic.
- **Baseline test count after 7.1/7.2/7.3 is 393 tests**. Target for DsCodeInput is ~20 new tests → ~413 total.
- **Barrel drift risk** — DsSelect was briefly missing from `src/index.ts`. Verify `src/components/DsCodeInput/index.ts` and the main `src/index.ts` re-export both land correctly (Task 1.3 / 1.4). `npm run build` catches this by listing `DsCodeInput*` type exports in `dist/index.d.ts`.
- **UI verification caveat** — Story 7.3 notes that Storybook could not be live-verified in its dev session. If the current environment also lacks a connected browser, document this in Completion Notes and request a human reviewer to click through every state.

**From Story 7.2 (DsBadge):**
- `:deep()` selectors targeting PrimeVue's internal DOM work reliably, but the class names vary between PrimeVue components. Always inspect the actual rendered DOM in Storybook devtools BEFORE finalizing CSS selectors (see Task 8.5). The cell class for `InputOtp` is expected to be `.p-inputotp-input` per PrimeVue 4.x convention, but verify empirically.
- When the preset needed extensions (DsBadge added `green` + amber-700 fix), the story required a dedicated preset task. DsCodeInput does NOT need preset extensions — all colors exist.

**From Story 7.1 (DsChip):**
- Rendering the component's own DOM INSIDE the PrimeVue wrapper (vs. using PrimeVue's slot defaults) is the established pattern when PrimeVue's default styling conflicts. For DsCodeInput we do the opposite — we keep PrimeVue's cell DOM and override it via `:deep()`. This is a deliberate divergence because reimplementing OTP keyboard logic would duplicate ~200 lines of PrimeVue code.

**From Story 2.2 (DsInputText) — original label/hint/error pattern:**
- The `useId()` pattern is the standard for unique IDs (errorId + labelId). Mirror it here for `aria-describedby` + `aria-labelledby`.
- `showError` computed gates the error visual on `!disabled` — consumers expect this behavior (Story 2.2 established it and all follow-ons mirror it).
- Hint/error footer uses a 4px gap flex column. Same layout here.

### Git Intelligence (Recent Commits)

```
d20a962 story 6.3
66b75a4 story 6.2
6ad1e82 story 6.1
2f67c65 add epics for phase 2
e9bed4d phase 2 specs sync
```

Epic 7 stories (7.1 DsChip, 7.2 DsBadge, 7.3 DsAvatar) are in `review` status at branch HEAD (uncommitted working-tree changes visible as `src/components/Ds{Chip,Badge,Avatar}/` + `docs/ai-guidelines/ds-{chip,badge,avatar}.md` + `src/theme/ds-preset.ts` + `src/theme/ds-preset.test.ts` + `src/index.ts` + `_bmad-output/implementation-artifacts/sprint-status.yaml`). Expect those commits to land as `story 7.1` / `story 7.2` / `story 7.3` before this story is implemented. Epic 8 story 8.1 (DsSearchField) is ALSO `backlog` and will likely land before this one — if so, its implementation may add reusable composition patterns; check `_bmad-output/implementation-artifacts/8-1-dssearchfield-component.md` (once created) for patterns worth reusing. Commit style continues: one story = one commit titled `story X.Y`.

### Latest Tech Notes

- **PrimeVue 4.5.4** — `primevue/inputotp` exists and is stable. Props include `length` (default 4), `mask`, `integerOnly`, `modelValue`, `disabled`, `readonly`, `variant`, `invalid`, `tabindex`, `size`, `pt`, `ptOptions`, `unstyled`, `dt`. DOM: outer `<div class="p-inputotp p-component">` containing N `<input class="p-inputotp-input">` cells. Verify the exact class names + whether a placeholder attribute is present on each input DURING implementation (Task 8.5) — this affects whether `:placeholder-shown` works as the "empty cell" selector.
- **Vue 3.5.30** — `defineModel<string>()`, `useId()`, `withDefaults` all available. We use all three.
- **Vitest 4.1.2 + @vue/test-utils 2.4.6** — `findComponent(InputOtp)` works for prop + emit assertions. jsdom has limited CSS custom property resolution; class-based assertions are more reliable than `getComputedStyle`.
- **Biome 2.4.9** — strict import order: external modules first (`primevue/inputotp`, `vue`), then relative (`../DsIcon/DsIcon.vue`). Alphabetical within each group.
- **Storybook 10.3.4** — `@storybook/vue3-vite`. For the AllStates composite story, render multiple `<DsCodeInput>` instances in a flex column (avoid adding an explicit `focus` control; let the `autofocus` attr flow through `$attrs`).

### Project Structure Notes

- File layout matches architecture §Project Structure (`src/components/DsCodeInput/{DsCodeInput.vue, DsCodeInput.stories.ts, DsCodeInput.test.ts, index.ts}`).
- AI KB at `docs/ai-guidelines/ds-code-input.md` follows the kebab-case convention (`ds-code-input.md`, not `ds-codeinput.md`).
- Alphabetical ordering in `src/index.ts` and `docs/ai-guidelines/index.md`: `DsCodeInput` sorts **between** `DsChip` and `DsIcon` (C-h-i < C-o-d < I).
- Per CLAUDE.md, place any temporary / debug artifacts in `./tmp/` (e.g., scratch screenshots, DOM-inspection notes saved during PrimeVue DOM verification). Do NOT pollute the component directory with debug files.

### References

- [Source: _bmad-output/planning-artifacts/epics-phase2.md#Story 8.2] — original BDD acceptance criteria
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#FR4] — DsCodeInput as PIN/OTP verification code input with cells, states, configurable length, paste support, error messages
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#NFR5] — Custom components must implement keyboard navigation and ARIA support
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#NFR13, NFR14] — AI KB entries match Phase 1 structure; Phase 2 documentation indistinguishable from Phase 1 in quality/format
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#Phase 2 component classification table] — DsCodeInput is classified "Custom Tailwind"; this story amends that classification to "PrimeVue wrapper (InputOtp)" because PrimeVue 4.5.4 provides InputOtp natively — wrapping it is simpler and more robust than rebuilding cell logic with raw Tailwind. Document this deviation in Completion Notes.
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#line 457] — DsCodeInput documented as "PIN/OTP-style verification code input (individual character cells with auto-advance, backspace, paste support)" with props `length, modelValue, error, disabled`
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Architecture (lines 163–170)] — thin wrapper pattern with `inheritAttrs:false` + `v-bind="$attrs"`
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure (lines 334–393)] — co-located file structure, barrel export conventions
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns (lines 251–274)] — `Ds` prefix, PascalCase component names, kebab-case theme / AI-KB files
- [Source: docs/figma-variables.md] — authoritative Figma → hex mapping
- [Source: src/theme/ds-preset.ts] — primitive ramps (gray, purple, red); all tokens needed for DsCodeInput already exist
- [Source: src/components/DsInputText/DsInputText.vue] — closest implementation template (label/hint/error envelope, `useId`, `defineModel<string>`, `showError` computed, footer layout, scoped styles)
- [Source: src/components/DsChip/DsChip.vue:94–99] — `:deep(.p-…)` strip-PrimeVue-defaults pattern to mirror for `:deep(.p-inputotp-input)`
- [Source: docs/ai-guidelines/ds-input-text.md] — AI KB entry structure to mirror
- [Source: docs/ai-guidelines/index.md] — Component Inventory + Figma matching guide insertion points
- [Source: Figma node `2:45695`] — Code input category (master variants Default, Hover, Focused, Input-nom, Error)
- [Source: Figma node `2:45700`] — Focused cell (purple border + 5px purple glow)
- [Source: Figma node `2:45703`] — Input-nom cell (purple text + purple border)
- [Source: Figma node `2:45706`] — Error cell (red-50 bg, red-700 border)
- [Source: Figma node `2:45709`] — Default cell (gray-100 bg, gray-300 border)
- [Source: Figma node `2:45712`] — Hover cell (gray-200 bg, gray-800 border)
- [Source: Figma node `2:45733`] — Error caption "Invalid code" typography + color reference
- [Source: https://primevue.org/inputotp] — PrimeVue 4.x InputOtp docs (props, events, built-in keyboard behavior)
- [Source: _bmad-output/implementation-artifacts/2-2-dsinputtext-component.md] — original label/hint/error pattern baseline
- [Source: _bmad-output/implementation-artifacts/7-3-dsavatar-component.md] — most recent completed story; test-count baseline (393), Biome import-order gotcha, Storybook-verification caveat

## Dev Agent Record

### Agent Model Used

claude-opus-4-7[1m] (bmad-dev-story workflow)

### Debug Log References

- Verified `primevue/inputotp` DOM at `node_modules/primevue/inputotp/style/index.mjs`: root class `.p-inputotp p-component`, cell class `.p-inputotp-input`. Cells are PrimeVue `InputText` components rendered via an internal `OtpInputText` alias, not raw `<input>` elements.
- PrimeVue `InputOtp` does NOT set a `placeholder` attribute on cell inputs by default. Because Vue reflects `v-model` changes to the DOM `.value` property (not the `value` attribute), an `[value=""]` attribute selector does not work reliably for empty-cell detection.
- **Selected approach for "filled" detection:** inject a single-space placeholder via the PrimeVue `pt` API (`pt.pcInputText.root.placeholder = ' '`) so `:placeholder-shown` can discriminate empty vs filled cells in pure CSS. The space placeholder is then rendered invisible via `::placeholder { color: transparent; }`.
- Full test suite green: 476 tests after initial implementation; **483 tests** after post-review fixes (+7 new tests: consumer-`pt` deep-merge, per-cell ARIA via `pt`, whitespace-only `label` / `error` trim, full-length round-trip).
- Test command: `npm test`. Lint command: `npm run lint`. Build command: `npm run build`.
- **Post-review fixes (2026-04-17):** addressed bad_spec and patch findings from the adversarial review. See Completion Notes for the delta.

### Completion Notes List

- Story 8.2 implements DsCodeInput as a thin wrapper around `primevue/inputotp` (per PRD amendment noted in story References — PrimeVue 4.5.4 provides `InputOtp` natively, so wrapping it is simpler and more robust than a raw Tailwind rebuild).
- **Per-cell state CSS selectors:**
  - Default cell → base `:deep(.p-inputotp-input)` rule.
  - Hover (empty) → `:placeholder-shown:hover:not(:focus)`.
  - Focused (empty) → `:focus` with purple glow, suppressed to border-only when `:focus:not(:focus-visible)` (pointer focus — UX-DR8).
  - Input (filled) → `:not(:placeholder-shown)` with purple border + purple text.
  - Error → `.ds-code-input--error :deep(.p-inputotp-input)` (all states) + `:focus` adds a red focus ring.
  - Disabled → `.ds-code-input--disabled :deep(.p-inputotp-input)` (all states) with muted colors and `pointer-events: none`.
- **Placeholder injection** is the single most important implementation detail; documented in Debug Log above. Consumer-supplied `pt` (via `$attrs`) is **deep-merged** with the wrapper's internal `pt.pcInputText.root` injections (placeholder + per-cell error ARIA). Keys explicitly set by the consumer win; any key not set by the consumer falls back to the internal default. This satisfies AC #10's forwarding contract while keeping the placeholder-based state CSS reliable.
- **Accepted raw-color exception:** `rgba(120, 73, 255, 0.6)` is used for the Focused box-shadow because no `--p-purple-600-alpha-60` token exists. The rgb triplet matches `--p-purple-600` (#7849ff) exactly.
- **Error message typography is 14px / weight 500** per Figma node `2:45733` — intentionally differs from DsInputText's 12px / 500 error caption.
- **Barrel export verified:** `dist/index.d.ts` contains `export { DsCodeInput, type DsCodeInputProps } ...`; `dist/components/DsCodeInput/DsCodeInput.vue.d.ts` generated.
- **UI verification caveat (inherited from 7.3):** Storybook was not live-verified in this dev session — a human reviewer should click through every story in both light and dark themes and confirm: 43×58 cell geometry, 16px gap, purple glow on keyboard focus only (not mouse focus), purple digits in filled cells, red border + red-50 bg in error state, muted disabled appearance, paste of "1234" populates all 4 cells, digit-only typing with `integer-only`, bullet rendering with `mask`.
- **Parallel story coexistence:** Story 8.1 (DsSearchField) was in-progress during this session. My edits to `src/index.ts` and `docs/ai-guidelines/index.md` were made on top of 8.1's in-flight changes and cleanly insert DsCodeInput alphabetically (between DsChip and DsIcon). Lint errors surfaced in `DsSearchField.vue` belong to story 8.1 and are not addressed here.

### File List

**Created:**
- `src/components/DsCodeInput/DsCodeInput.vue`
- `src/components/DsCodeInput/DsCodeInput.stories.ts`
- `src/components/DsCodeInput/DsCodeInput.test.ts`
- `src/components/DsCodeInput/index.ts`
- `docs/ai-guidelines/ds-code-input.md`

**Modified:**
- `src/index.ts` — added `DsCodeInput` + `DsCodeInputProps` re-export (alphabetical, between DsChip and DsIcon)
- `docs/ai-guidelines/index.md` — added `DsCodeInput` to the Installation import example, Component Inventory row, and Figma Element Matching Guide section (all alphabetical insertions)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — status `ready-for-dev` → `in-progress` → `review`

### Change Log

| Date | Change | Author |
|---|---|---|
| 2026-04-17 | Initial implementation of DsCodeInput (thin PrimeVue InputOtp wrapper, 5 cell states, label/hint/error envelope, AI KB entry, 22 tests) | Yurii (dev-story workflow) |
| 2026-04-17 | Post-review fixes: deep-merge consumer `pt`; route per-cell `aria-describedby` + `aria-invalid` via `pt.pcInputText.root`; treat whitespace-only `label` / `error` as absent; suppress error focus ring on pointer focus; override caret color in error state; move disabled cursor to container; add Focused row to `AllStates` story; amend AC #8 + AC #10; extend AI KB with `$attrs` target + per-cell ARIA rationale. | Yurii (code-review workflow) |
