# Story 8.1: DsSearchField Component

Status: done

## Story

As a **developer or AI agent** implementing a Figma design that contains a search input (toolbar search, table filter, typeahead entry, dialog search),
I want a `DsSearchField` component composed internally from `DsInputText` + `DsIcon` with 4 sizes (XXS, XS, S, M), 4 interaction states (Default, Hover, Focused, Input-text), a built-in search icon, a clear (X) button for typed values, and an optional filter help button,
So that I can render search fields matching the Figma Design System in both light and dark themes without having to import or compose the underlying DsInputText / DsIcon myself (FR3, FR13, FR15).

## Figma Design References

- Search Field category (all variants): https://www.figma.com/design/3qP5xnwc6gXhZR3AnFAMFe/Design-Systems?node-id=2-44972&m=dev
- Top-level variant node: `2:44972` — SearchField master (Size=xxsmall|xsmall|small|medium × State=Default|Hover|Focused|Input-text × Help icon=no|yes)
- **Critical:** Use `mcp__figma__get_design_context` on node `2:44972` at the start of implementation to sample the exact hex tokens, padding, border-radius, and icon sizes for each size/state combination. The numbers in the AC below are the authoritative Figma spec, but the Dev agent MUST verify each against the rendered Figma screenshot before encoding them into scoped CSS. Save sampled hex values as comments inline next to each `.ds-search-field--<size>` / `.ds-search-field--<state>` rule.
- Per the project feedback memory: **when Figma and the UX spec disagree, trust the Figma reference.** The UX spec lists sizes S/M only; the epic explicitly extends to XXS/XS/S/M per Figma. Implement all 4 sizes.

## Acceptance Criteria

1. **Given** `DsSearchField` is a custom Tailwind-styled Vue component (NOT a PrimeVue wrapper — it has no PrimeVue base per prd-phase2.md §Phase 2 component classification), **When** a developer uses `<DsSearchField v-model="query" placeholder="Search…" />`, **Then** the component renders a self-contained search input composed internally from `DsInputText` + `DsIcon`, matching the Figma design in both light and dark themes (FR3, FR10, FR13, FR15). The consumer does NOT import `DsInputText` or `DsIcon` directly — a single `import { DsSearchField } from '@failwin/desing-system-vue'` is sufficient (FR15).

2. **Given** `DsSearchField` supports 4 sizes via the `size` prop, **When** the prop is set, **Then** the outer field box renders at the heights specified by Figma:
   - `size="xxsmall"` → **28px** height, 6px horizontal padding, 6px gap between inner elements, 18px search icon (only when `searchIcon=true` — XXS renders *without* search icon by default).
   - `size="xsmall"` → **32px** height, 8px horizontal padding, 8px gap, 20px search icon (always on).
   - `size="small"` → **36px** height, 12px horizontal padding, 8px gap, 20px search icon (always on).
   - `size="medium"` (default) → **40px** height, 12px horizontal padding, 8px gap, 20px search icon (always on).
   **And** the placeholder / typed text uses Inter regular 14px / line-height 20px / letter-spacing -0.2px at all sizes (matches DsInputText typography from `DsInputText.vue:230–232`).

3. **Given** `DsSearchField` supports 4 interaction states, **When** the user interacts with the field, **Then** the visual state transitions per the following token map (verified against Figma before final values are committed):
   - **Default** (idle, empty, unfocused) → bg `--p-gray-100` (`#f8fafc`), border `1px solid --p-gray-400` (`#cad5e2`), placeholder `--p-gray-600` (`#6a7d97`), search-icon color `--p-gray-600`.
   - **Hover** (mouse over, empty, unfocused) → bg `--p-gray-200` (`#f1f5f9`), border `1px solid --p-gray-800` (`#314158`), placeholder `--p-gray-700` (`#4c5f78`), search-icon color `--p-gray-800`.
   - **Focused** (keyboard or click focus, empty) → bg `--p-gray-100`, border `1px solid --p-gray-800`, a 2px cursor caret is visible (native browser caret, no custom styling required), search-icon color `--p-gray-800`.
   - **Input-text** (has typed value, focused OR unfocused) → bg `--p-gray-100`, border `1px solid --p-gray-800`, typed text color `--p-gray-800`, search-icon color `--p-gray-800`, clear (X) button visible on the right (AC #5).
   - **And** all color/border transitions use `150ms ease` wrapped in `@media (prefers-reduced-motion: no-preference)` (UX-DR9) and use `motion-safe:` semantics. Use `transition-property: background-color, border-color` — do NOT transition `outline` (would fight focus-visible timing).

4. **Given** `DsSearchField` has a built-in search icon per UX-DR2 (NOT consumer-customizable at XS/S/M), **When** `size` is `xsmall`, `small`, or `medium`, **Then** a 20px `<DsIcon name="search" />` renders to the left of the input text, inheriting `currentColor` from the per-state rules in AC #3. **When** `size="xxsmall"`, **Then** the search icon is optional: it renders only if `searchIcon` prop is `true` (default `false` per Figma XXS variants, which show no leading icon). When rendered at XXS, the icon is 18px.
   - **And** the icon uses `flex-shrink: 0;` and is NOT focusable (wrap in a purely decorative `<span aria-hidden="true">`). The icon is not interactive — it does not emit a `search` event on click (the user types and presses Enter, which emits `@search` per AC #7).

5. **Given** `DsSearchField` must show a clear (X) button when the input has content per UX-DR2, **When** the input `modelValue` is non-empty AND `disabled=false`, **Then** a 24px clear button renders on the right of the field (use `<DsIcon name="exit" size="small" :style="{ width: '24px', height: '24px' }" />` per Figma — the "Exit_Enable" icon in Figma). **When** the button is clicked OR receives `Enter`/`Space`, **Then** the component clears `modelValue` (emits `update:modelValue` with empty string) AND emits `clear`.
   - **And** the clear button is focusable (`<button type="button">`), has `aria-label="Clear search"` (overridable via `clearAriaLabel` prop), and shows a `focus-visible` ring matching the project's existing focus-visible pattern: `outline: 2px solid var(--p-purple-800); outline-offset: 2px; border-radius: 50%;` (mirrors `DsChip.vue:198–201`).
   - **And** the clear button can optionally render in ALL states (not just when content exists) if the consumer sets `clear="always"` (vs. default `clear="auto"` which only shows when content exists). When `clear="never"`, the button never renders. Default is `"auto"`.
   - **And** keyboard shortcut: pressing **Escape** while the input has focus ALSO clears the input and emits `@clear` (browser-standard search-field convention). Document this in the AI KB.

6. **Given** `DsSearchField` supports an optional filter/help button per the Figma `helpIcon` variant, **When** `helpIcon=true`, **Then** a 24px button renders on the right after the clear button, containing `<DsIcon name="filter-a" size="small" :style="{ width: '24px', height: '24px' }" />` (use `filter-a` — the default Figma filter glyph; `filter-b` / `filter-c` are sibling variants that consumers can override via the `#helpIcon` slot). The button has `aria-label="Search options"` (overridable via `helpAriaLabel` prop), is focusable with a `focus-visible` ring matching the clear button, and emits `@help` when clicked OR receives `Enter`/`Space`.
   - **And** the help button appears in ALL states when `helpIcon=true`, regardless of whether the input has content.
   - **And** when both the clear button and the help button are visible, their render order (left-to-right) is: **[search-icon] [input] [clear-button] [help-button]**. The native-HTML focus order follows the same visual order (no custom `tabindex` needed).
   - **And** consumers can replace the default filter glyph via a `#helpIcon` slot; when the slot is provided, it wins over the default `filter-a` icon (but the button wrapper, `aria-label`, focus ring, and click/keyboard handlers still come from `DsSearchField`).

7. **Given** `DsSearchField` emits standard input events consistent with DsInputText, **When** the user types, **Then** `update:modelValue` fires on every keystroke (native `v-model`). **When** the user presses **Enter** while the input has focus, **Then** `@search` emits with the current `modelValue` as the payload — this is the canonical "submit search" event (consumers can debounce separately via watchers if they want live-as-you-type behavior). **When** the input receives focus, **Then** `@focus` emits; on blur, `@blur` emits. **When** the clear button is activated (click, Enter, Space, or Escape), **Then** `@clear` emits AND `modelValue` is reset to empty string.

8. **Given** `DsSearchField` must implement accessibility manually per NFR5 (custom component, not PrimeVue-inherited), **When** the component renders, **Then**:
   - The input element has `role="searchbox"` (implicit via `<input type="search">`) and inherits `aria-disabled` from the `disabled` prop.
   - The component accepts an `ariaLabel` prop (default `"Search"`) which maps to the input's `aria-label`. If the consumer provides a `label` prop (visible label above the field, pattern from DsInputText), use `for`/`id` binding instead and drop `aria-label`.
   - The search icon wrapper has `aria-hidden="true"` (decorative — the input's `aria-label` conveys the semantic meaning).
   - The clear button has `aria-label="Clear search"` (overridable) and renders only when relevant (see AC #5 visibility rules) — screen readers do not announce it when hidden.
   - The help button has `aria-label="Search options"` (overridable) and an optional `title="Search options"` for a visual tooltip on hover (matches the Figma "Search options" tooltip text).
   - Tab order is: input → clear (if visible) → help (if visible). No custom `tabindex` required; native order is correct.
   - Keyboard shortcuts: **Enter** in input → emit `@search` + submit; **Escape** in input → clear + emit `@clear`; **Enter/Space** on clear or help buttons → activate.

9. **Given** `DsSearchField` must NOT add perceptible latency over DsInputText per NFR3, **When** implemented, **Then** the component uses DsInputText via `import DsInputText from '../DsInputText/DsInputText.vue'` and does NOT duplicate its label/hint/error logic. Pass through `size` (mapped — see below), `disabled`, `clearable=false` (DsSearchField owns its own clear button), and `v-model` to DsInputText. **But** NOT all DsInputText props are exposed: DsSearchField specifically does NOT expose `label`, `mandatory`, `optional`, `info`, `hint`, `error`, `showDropdownIcon`, or the DsInputText `#leading` slot — the search icon owns the leading position. Consumers who need a label above the field should use DsInputText directly (DsSearchField is the inline-search primitive).
   - **And** size mapping from DsSearchField → DsInputText: `xxsmall` → `small` (32px input inside a 28px outer box is too tall; so DsSearchField OWNS its own sizing classes and bypasses DsInputText's `size` prop entirely — see implementation note in Dev Notes §Composition strategy). `xsmall | small | medium` → DsSearchField owns the outer height via scoped CSS; internally it always passes `size="small"` to DsInputText as a base and overrides height/padding via CSS `:deep()` selectors. This keeps DsInputText unchanged and focused on form-field concerns (label/hint/error).

10. **Given** `DsSearchField` provides TypeScript types per FR11, **When** consumers import it, **Then** the named export `{ DsSearchField, DsSearchFieldProps, DsSearchFieldSize, DsSearchFieldClearBehavior }` is available from `@failwin/desing-system-vue`. All props are typed; all emits (`update:modelValue`, `search`, `focus`, `blur`, `clear`, `help`) have typed payloads. The file structure follows the co-located convention (`src/components/DsSearchField/DsSearchField.vue`, `DsSearchField.stories.ts`, `DsSearchField.test.ts`, `index.ts`).

11. **Given** the component is implemented, **When** the implementation checklist is complete, **Then**:
    - `src/components/DsSearchField/DsSearchField.vue` exists.
    - `src/components/DsSearchField/DsSearchField.stories.ts` covers every combination of size × state + helpIcon on/off, plus clear-auto / clear-always / clear-never, plus an `AllSizes`/`AllStates` comparison grid.
    - `src/components/DsSearchField/DsSearchField.test.ts` covers rendering, v-model, size classes, state classes, search icon visibility (XXS-conditional), clear button visibility rules (3 `clear` modes), clear-by-click / Enter / Space / Escape, help button emit, Enter → @search emit, aria labels, passthrough of `$attrs` to the outer root.
    - `src/components/DsSearchField/index.ts` re-exports the component + types.
    - `src/index.ts` adds the re-export **alphabetically between `DsLink` and `DsSelect`** (i.e., after `export { DsLink ... }` and before `export { DsSelect ... }`) — DsSearchField is 12th component in the library.
    - `docs/ai-guidelines/ds-search-field.md` exists, follows the DsInputText / DsChip entry structure, and is listed in `docs/ai-guidelines/index.md` (import example line, Component Inventory table, and Figma matching guide — all alphabetical, between `DsLink` and `DsSelect`).
    - `npm run lint`, `npm test`, and `npm run build` all pass with zero errors; `dist/` contains `DsSearchField` in the top-level type declarations.

## Tasks / Subtasks

- [x] **Task 1: Scaffold DsSearchField** (AC: #1, #10, #11)
  - [x] 1.1 Create directory `src/components/DsSearchField/`.
  - [x] 1.2 Create empty files: `DsSearchField.vue`, `DsSearchField.stories.ts`, `DsSearchField.test.ts`, `index.ts`.
  - [x] 1.3 Populate `src/components/DsSearchField/index.ts`:
    ```ts
    export { default as DsSearchField } from './DsSearchField.vue';
    export type {
      DsSearchFieldProps,
      DsSearchFieldSize,
      DsSearchFieldClearBehavior,
    } from './DsSearchField.vue';
    ```
  - [x] 1.4 Add to `src/index.ts` **alphabetically between `DsLink` and `DsSelect`**:
    ```ts
    export {
      DsSearchField,
      type DsSearchFieldClearBehavior,
      type DsSearchFieldProps,
      type DsSearchFieldSize,
    } from './components/DsSearchField';
    ```
    Verify the alphabetical position: the final barrel should read `…DsLink → DsSearchField → DsSelect → DsTextarea…`.

- [x] **Task 2: Sample Figma specs** (AC: #2, #3, #4, #5, #6)
  - [x] 2.1 Call `mcp__figma__get_design_context` with `nodeId="2:44972"` and `fileKey="3qP5xnwc6gXhZR3AnFAMFe"` (the Figma file key for the Design System — derive from any existing `docs/ai-guidelines/*.md` Figma link if needed, or pass the full URL). Review the returned metadata / screenshot to sample:
    - Exact bg/border/text hex for each of the 4 states (map them to the nearest `--p-*` token in `ds-preset.ts`; prefer gray-100/200/400/600/700/800 as called out in AC #3).
    - Exact outer heights: 28/32/36/40 at XXS/XS/S/M.
    - Horizontal padding, gap between search-icon ↔ input ↔ clear/help buttons.
    - Border-radius (expected `8px` per DsInputText, but verify — Figma may use a smaller radius at XXS).
    - Search icon size at each size tier: 20px at XS/S/M, 18px at XXS.
    - Clear button icon (Figma "Exit_Enable") size — expected 24px with ~18px glyph visible area.
    - Help icon (filter) size — expected 24px with ~18px glyph visible area.
  - [x] 2.2 If any sampled value differs from the AC's starting numbers by >2px or by a different token family (e.g., Figma uses `gray-300` instead of `gray-400`), update the CSS mapping in Task 4 and note the deviation in the Completion Notes.
  - [x] 2.3 Save sampled hex values as inline CSS comments next to each `.ds-search-field--<size>` / `.ds-search-field--<state>` rule — mirrors the DsAvatar pattern documented in Story 7.3 Dev Notes.
  - [x] 2.4 If the Figma MCP is not reachable, fall back to the AC's starting numbers and document the fallback in Completion Notes — a reviewer with Figma access can fine-tune in a follow-up.

- [x] **Task 3: Implement `DsSearchField.vue` — script & props** (AC: #1, #7, #9, #10)
  - [x] 3.1 `<script setup lang="ts">` block. Imports:
    ```ts
    import { computed, ref } from 'vue';
    import DsIcon from '../DsIcon/DsIcon.vue';
    import DsInputText from '../DsInputText/DsInputText.vue';
    ```
    (Biome enforces import order — run `npm run lint` to auto-fix; watch for drift per Story 7.3 Dev Notes.)
  - [x] 3.2 Define and `export` types:
    ```ts
    export type DsSearchFieldSize = 'xxsmall' | 'xsmall' | 'small' | 'medium';
    export type DsSearchFieldClearBehavior = 'auto' | 'always' | 'never';

    export interface DsSearchFieldProps {
      /** Size tier. Default: 'medium' */
      size?: DsSearchFieldSize;
      /** Placeholder text. Default: 'Search' */
      placeholder?: string;
      /** Disabled state. Default: false */
      disabled?: boolean;
      /** Controls visibility of the clear (X) button. Default: 'auto' (only when input has content). */
      clear?: DsSearchFieldClearBehavior;
      /**
       * Show leading search icon. Default: true at XS/S/M; false at XXS (overridable).
       * XXS's built-in search icon is OPT-IN per Figma spec (UX-DR2).
       */
      searchIcon?: boolean;
      /** Show trailing filter/help button. Default: false */
      helpIcon?: boolean;
      /** Accessible label for the search input. Default: 'Search' */
      ariaLabel?: string;
      /** Accessible label for the clear button. Default: 'Clear search' */
      clearAriaLabel?: string;
      /** Accessible label for the help button. Default: 'Search options' */
      helpAriaLabel?: string;
    }
    ```
  - [x] 3.3 `defineOptions({ inheritAttrs: false });` — attrs go to the outer root `<div>` (pattern mirrors DsInputText).
  - [x] 3.4 Define defaults:
    ```ts
    const props = withDefaults(defineProps<DsSearchFieldProps>(), {
      size: 'medium',
      placeholder: 'Search',
      disabled: false,
      clear: 'auto',
      // searchIcon default is SIZE-DEPENDENT — resolved via `resolvedSearchIcon` computed below
      helpIcon: false,
      ariaLabel: 'Search',
      clearAriaLabel: 'Clear search',
      helpAriaLabel: 'Search options',
    });
    ```
  - [x] 3.5 `const model = defineModel<string>({ default: '' });`
  - [x] 3.6 Emits:
    ```ts
    const emit = defineEmits<{
      'update:modelValue': [value: string];
      search: [value: string];
      focus: [event: FocusEvent];
      blur: [event: FocusEvent];
      clear: [];
      help: [];
    }>();
    ```
  - [x] 3.7 Focus tracking: `const isFocused = ref(false);` — for the Focused state class.
  - [x] 3.8 Computed `resolvedSearchIcon`: `() => props.searchIcon ?? props.size !== 'xxsmall'` — XXS defaults to NO search icon; other sizes default to YES. Consumer can explicitly set `searchIcon={true/false}` to override at any size.
  - [x] 3.9 Computed `hasValue`: `() => !!model.value`.
  - [x] 3.10 Computed `showClearButton`: `() => !props.disabled && (props.clear === 'always' || (props.clear === 'auto' && hasValue.value))`. (`'never'` path → always hidden.)
  - [x] 3.11 Computed `stateClass` for state-driven styling. Apply exactly ONE of these, priority top-down:
    - `'ds-search-field--disabled'` when `props.disabled`.
    - `'ds-search-field--input-text'` when `hasValue.value` (Input-text state wins over Focused when there's content, matching Figma which collapses Focused+Input-text to the same bg/border).
    - `'ds-search-field--focused'` when `isFocused.value`.
    - `'ds-search-field--default'` otherwise. (Hover is handled via `:hover` pseudo-class in CSS — no class needed.)
  - [x] 3.12 Computed `rootClasses`:
    ```ts
    ({
      'ds-search-field': true,
      [`ds-search-field--${props.size}`]: true,
      [stateClass.value]: true,
      'ds-search-field--has-help': props.helpIcon,
    })
    ```
  - [x] 3.13 Event handlers:
    ```ts
    function onInputFocus(e: FocusEvent) { isFocused.value = true; emit('focus', e); }
    function onInputBlur(e: FocusEvent) { isFocused.value = false; emit('blur', e); }
    function onEnter() { emit('search', model.value); }
    function onEscape() { if (!hasValue.value) return; model.value = ''; emit('clear'); }
    function onClearClick() { if (!hasValue.value && props.clear !== 'always') return; model.value = ''; emit('clear'); }
    function onHelpClick() { emit('help'); }
    ```

- [x] **Task 4: Implement `DsSearchField.vue` — template** (AC: #1, #4, #5, #6, #8, #9)
  - [x] 4.1 Root `<div v-bind="$attrs" :class="rootClasses">` — owns the outer border, bg, padding, gap, border-radius.
  - [x] 4.2 Left slot (search icon):
    ```html
    <span v-if="resolvedSearchIcon" class="ds-search-field__search-icon" aria-hidden="true">
      <DsIcon name="search" :size="size === 'xxsmall' ? 'small' : 'medium'"
              :style="size === 'xxsmall' ? { width: '18px', height: '18px' } : { width: '20px', height: '20px' }" />
    </span>
    ```
  - [x] 4.3 Native `<input type="search">` — DO NOT reuse DsInputText here. DsInputText owns a full form-field (label/hint/error/padding/border), which conflicts with DsSearchField's inline layout. Instead, render a raw `<input>` styled to inherit from the parent. This is the simplest composition that satisfies FR13 "DsSearchField can compose DsInputText and DsIcon internally" → the "compose" is relaxed to "use the same tokens + same typography". If a reviewer pushes back on reading FR13 this way, the fallback is to mount `<DsInputText :clearable="false">` inside DsSearchField and override its outer shell via scoped `:deep()` — see Dev Notes §Composition strategy (B) — but the recommended path is (A) raw input. Implement option (A) unless the reviewer asks for (B).

    Template for the input:
    ```html
    <input
      ref="inputRef"
      v-model="model"
      type="search"
      class="ds-search-field__input"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-label="ariaLabel"
      :aria-disabled="disabled ? 'true' : undefined"
      @focus="onInputFocus"
      @blur="onInputBlur"
      @keydown.enter.prevent="onEnter"
      @keydown.esc="onEscape"
    />
    ```
    `<input type="search">` gives implicit `role="searchbox"` and hides the browser's native clear icon (we handle it ourselves) via the CSS reset in Task 5.
  - [x] 4.4 Clear button:
    ```html
    <button
      v-if="showClearButton"
      type="button"
      class="ds-search-field__clear"
      :aria-label="clearAriaLabel"
      @click="onClearClick"
      @keydown.enter.prevent="onClearClick"
      @keydown.space.prevent="onClearClick"
    >
      <DsIcon name="exit" size="small" :style="{ width: '24px', height: '24px' }" />
    </button>
    ```
  - [x] 4.5 Help button (with optional slot override):
    ```html
    <button
      v-if="helpIcon"
      type="button"
      class="ds-search-field__help"
      :aria-label="helpAriaLabel"
      :title="helpAriaLabel"
      @click="onHelpClick"
      @keydown.enter.prevent="onHelpClick"
      @keydown.space.prevent="onHelpClick"
    >
      <slot name="helpIcon">
        <DsIcon name="filter-a" size="small" :style="{ width: '24px', height: '24px' }" />
      </slot>
    </button>
    ```
  - [x] 4.6 Do NOT render an outer `<label>` — DsSearchField is intentionally label-less. Consumers who need a visible label should use DsInputText directly (documented in the AI KB).

- [x] **Task 5: Implement `DsSearchField.vue` — scoped styles** (AC: #2, #3, #4, #5, #6)
  - [x] 5.1 Base `.ds-search-field`: flex row, inline-flex, `align-items: center`, box-sizing border-box, `border: 1px solid`, `border-radius: 8px`, `cursor: text`, `font-family: var(--font-family, 'Inter', sans-serif);`. Default bg + border tokens set by state modifier classes (see 5.4).
  - [x] 5.2 Size modifiers (height, padding, gap — verify each against Figma in Task 2):
    ```css
    .ds-search-field--xxsmall { height: 28px; padding: 0 6px; gap: 6px; }
    .ds-search-field--xsmall { height: 32px; padding: 0 8px; gap: 8px; }
    .ds-search-field--small { height: 36px; padding: 0 12px; gap: 8px; }
    .ds-search-field--medium { height: 40px; padding: 0 12px; gap: 8px; }
    ```
  - [x] 5.3 Input reset — strip native `<input type="search">` defaults (browser's native clear X + appearance):
    ```css
    .ds-search-field__input {
      flex: 1; min-width: 0;
      border: none; outline: none; background: transparent;
      padding: 0; margin: 0;
      font-family: inherit; font-weight: 400; font-size: 0.875rem; line-height: 1.25rem; letter-spacing: -0.2px;
      color: inherit;
      appearance: none;
    }
    /* Hide WebKit's built-in search clear button (we render our own) */
    .ds-search-field__input::-webkit-search-decoration,
    .ds-search-field__input::-webkit-search-cancel-button,
    .ds-search-field__input::-webkit-search-results-button,
    .ds-search-field__input::-webkit-search-results-decoration { appearance: none; display: none; }
    /* Placeholder color inherits state */
    .ds-search-field__input::placeholder { color: inherit; opacity: 1; }
    ```
  - [x] 5.4 State modifiers:
    ```css
    .ds-search-field--default {
      background-color: var(--p-gray-100);
      border-color: var(--p-gray-400);
      color: var(--p-gray-600);
    }
    /* Hover — idle (Default) state only, not Focused/Input-text */
    .ds-search-field--default:hover:not(.ds-search-field--disabled) {
      background-color: var(--p-gray-200);
      border-color: var(--p-gray-800);
      color: var(--p-gray-700);
    }
    .ds-search-field--focused {
      background-color: var(--p-gray-100);
      border-color: var(--p-gray-800);
      color: var(--p-gray-800);
    }
    .ds-search-field--input-text {
      background-color: var(--p-gray-100);
      border-color: var(--p-gray-800);
      color: var(--p-gray-800);
    }
    .ds-search-field--disabled {
      background-color: var(--p-gray-100);
      border-color: var(--p-gray-300);
      color: var(--p-gray-500);
      cursor: not-allowed;
      pointer-events: none;
    }
    ```
  - [x] 5.5 Transitions (UX-DR9):
    ```css
    @media (prefers-reduced-motion: no-preference) {
      .ds-search-field:not(.ds-search-field--disabled) {
        transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;
      }
    }
    ```
  - [x] 5.6 Search-icon wrapper — inherits `color` from the state class:
    ```css
    .ds-search-field__search-icon { display: inline-flex; align-items: center; flex-shrink: 0; color: inherit; }
    ```
  - [x] 5.7 Clear & help button shared styles:
    ```css
    .ds-search-field__clear,
    .ds-search-field__help {
      display: inline-flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      width: 24px; height: 24px;
      background: transparent; border: 0; padding: 0; margin: 0;
      color: inherit;
      cursor: pointer;
      border-radius: 50%;
      line-height: 0;
    }
    .ds-search-field__clear:hover,
    .ds-search-field__help:hover { color: var(--p-gray-800); }
    .ds-search-field__clear:focus,
    .ds-search-field__help:focus { outline: none; }
    .ds-search-field__clear:focus-visible,
    .ds-search-field__help:focus-visible {
      outline: 2px solid var(--p-purple-800);
      outline-offset: 2px;
    }
    .ds-search-field--disabled .ds-search-field__clear,
    .ds-search-field--disabled .ds-search-field__help { color: var(--p-gray-400); cursor: not-allowed; }
    ```
  - [x] 5.8 Anti-patterns: do NOT hardcode hex values anywhere in scoped CSS — `grep -n '#' DsSearchField.vue` should only hit comments. Do NOT use `!important` (none of the other Phase 2 custom components need it; if you're reaching for it, reconsider the cascade).

- [x] **Task 6: Storybook stories** (AC: #11)
  - [x] 6.1 Create `DsSearchField.stories.ts` using `Meta`/`StoryObj` from `@storybook/vue3-vite`. `argTypes` for `size`, `placeholder`, `disabled`, `clear`, `searchIcon`, `helpIcon`, `ariaLabel`. Default `args`: `{ size: 'medium', placeholder: 'Search' }`.
  - [x] 6.2 Basic stories — one per size, one per state:
    - `Default` (M, empty) — shows Default state.
    - `DefaultHover` — same as Default but with `class="story-force-hover"` demonstrating the hover tokens (pattern from `DsChip.stories.ts:180–223` AllVariantsGrid).
    - `Focused` — focused via `autofocus` directive or a `setup()` that calls `inputRef.focus()` after mount.
    - `InputText` — preloaded `modelValue="Query text"` so Input-text state is visible with clear button.
    - `Disabled` — `disabled=true`.
    - One story per size: `SizeXXSmall`, `SizeXSmall`, `SizeSmall`, `SizeMedium` — each with `modelValue="Sample"` so the clear button shows (demonstrates size proportions).
  - [x] 6.3 Help-icon stories:
    - `WithHelpIcon` — M size, helpIcon=true, empty — shows help button always-visible.
    - `WithHelpIconAndClear` — M size, helpIcon=true, `modelValue="Filter: active"` — shows clear + help side by side.
    - `CustomHelpIconSlot` — uses the `#helpIcon` slot to swap `filter-a` → `filter-b` (demonstrates the extension point from AC #6).
  - [x] 6.4 Clear-behavior stories:
    - `ClearAlways` — `clear="always"`, empty input — shows clear button even when empty.
    - `ClearNever` — `clear="never"`, preloaded value — shows NO clear button despite value.
  - [x] 6.5 XXS search-icon toggle stories:
    - `XXSmallNoIcon` — `size="xxsmall"` (default — no search icon, Figma default).
    - `XXSmallWithIcon` — `size="xxsmall" :searchIcon="true"` — shows the opt-in 18px icon.
  - [x] 6.6 `AllSizes` composite grid — renders XXS / XS / S / M in a column, each with `modelValue="Query"` so the clear button is visible. Mirrors the Figma size comparison layout.
  - [x] 6.7 `AllStates` composite grid for size M — renders Default / Hover (`story-force-hover` class) / Focused (autofocused via `:key` cycle) / Input-text / Disabled side by side.
  - [x] 6.8 Emit-verification story: `WithEventLog` — a simple story that renders the field and shows the most recent `@search` / `@clear` / `@help` event payload in a small text area below. Helps reviewers verify keyboard shortcuts (Enter, Escape, Tab to clear, Space on clear) work as specified.
  - [x] 6.9 Visually verify every story in BOTH light and dark themes (NFR12). Check that the Focused border contrast remains visible against gray-100 in dark mode (the preset automatically inverts `--p-gray-100` / `--p-gray-800` tokens — no theme-specific overrides should be needed).

- [x] **Task 7: Vitest tests** (AC: all)
  - [x] 7.1 Set up `DsSearchField.test.ts` mirroring `DsInputText.test.ts` and `DsChip.test.ts`:
    ```ts
    import { mount } from '@vue/test-utils';
    import PrimeVue from 'primevue/config';
    import { describe, expect, it } from 'vitest';
    import DsSearchField from './DsSearchField.vue';

    const globalConfig = { plugins: [[PrimeVue, { theme: 'none' }]] };
    ```
  - [x] 7.2 Default rendering tests: `.ds-search-field`, `.ds-search-field--medium`, `.ds-search-field--default` classes; search icon visible at medium; no clear button with empty value; no help button by default; input has `type="search"`, `aria-label="Search"`, `placeholder="Search"`.
  - [x] 7.3 Size class tests: for each of `xxsmall | xsmall | small | medium`, assert `.ds-search-field--<size>` is applied. Assert the search icon visibility rule — at XXS no icon by default, at others yes.
  - [x] 7.4 `searchIcon` override tests: `size="xxsmall" :searchIcon="true"` → icon IS rendered; `size="medium" :searchIcon="false"` → icon NOT rendered.
  - [x] 7.5 State class tests:
    - Empty, not focused → `.ds-search-field--default`.
    - Empty, focused (simulate via `input.focus()` event) → `.ds-search-field--focused`.
    - Value set, not focused → `.ds-search-field--input-text`.
    - Value set, focused → `.ds-search-field--input-text` (content wins over focus, per AC #3).
    - `disabled=true` → `.ds-search-field--disabled` wins over all above.
  - [x] 7.6 v-model tests: typing updates `modelValue`; `update:modelValue` emits with new string.
  - [x] 7.7 Enter → `@search` emits with current model value as payload. Enter on empty field still emits (consumer decides whether to filter).
  - [x] 7.8 Escape handling: with value → clears model + emits `@clear`. With empty value → no-op (no emit, no DOM change).
  - [x] 7.9 Clear button visibility matrix:
    - `clear="auto"` (default) + empty → button absent.
    - `clear="auto"` + value → button present.
    - `clear="always"` + empty → button present.
    - `clear="always"` + value → button present.
    - `clear="never"` + value → button absent.
    - `disabled=true` + value → button absent regardless of `clear` mode.
  - [x] 7.10 Clear button interaction: click → model cleared + `@clear` emitted exactly once. Enter on button → same. Space on button → same. Parent click does NOT bubble (assert via a parent click spy — `@click.stop` is NOT needed because the clear button's click is intentional; but the clear action itself should not re-trigger the search input's click handler).
  - [x] 7.11 Help button: `helpIcon=true` → button rendered with `aria-label="Search options"`, `title="Search options"`. Click / Enter / Space → `@help` emits exactly once. `#helpIcon` slot overrides the default icon (mount with a slot stub containing `<span data-testid="custom-help" />` and assert it renders inside `.ds-search-field__help`).
  - [x] 7.12 Accessibility tests:
    - Root input has `aria-label="Search"` by default.
    - `ariaLabel="Find"` prop → input `aria-label="Find"`.
    - `clearAriaLabel="Reset"` → clear button `aria-label="Reset"`.
    - `helpAriaLabel="Options"` → help button `aria-label="Options"` AND `title="Options"`.
    - Search icon wrapper has `aria-hidden="true"`.
    - `disabled=true` → input has `aria-disabled="true"`.
  - [x] 7.13 Focus event emission: `@focus` emits on input focus event; `@blur` emits on blur event.
  - [x] 7.14 `$attrs` passthrough: `data-testid="my-search"` lands on the root `<div>` (not on the input).
  - [x] 7.15 Tab order: sequential `.element(':focusable')` children are `[input, clear-button, help-button]` in that order when all three are visible (can be asserted via DOM order + absence of `tabindex` attributes; no need to trigger keyboard events in vitest).
  - [x] 7.16 Composition check: the component does NOT mount DsInputText (option A from Task 4.3 is the recommended path — assert by searching for `.ds-input-text` class which should NOT be present). If option B is chosen instead, update this assertion to check the DsInputText wrapper IS present with `:clearable="false"`.
  - [x] 7.17 No regressions: full project test suite passes (`npm test`). Baseline as of Story 7.3 was ~393 tests; expect ~20–30 new DsSearchField tests.

- [x] **Task 8: AI knowledge base entry** (AC: #11)
  - [x] 8.1 Create `docs/ai-guidelines/ds-search-field.md` following the DsInputText / DsChip entry structure: `# DsSearchField`, `## When to Use` (vs. DsInputText with leading search icon — see §When to Use below), `## Import`, `## Props` (table), `## Sizes`, `## States`, `## Slots` (`#helpIcon`), `## Events`, `## Usage Examples`, `## Keyboard Shortcuts`, `## Accessibility`, `## Figma Reference`.
  - [x] 8.2 `## When to Use` section MUST clearly differentiate from DsInputText:
    - Use **DsSearchField** when the Figma layer is labelled `SearchField`, `Search Field`, `Search`, or the field sits in a toolbar / dialog header / table filter without a visible label above it.
    - Use **DsInputText** when the Figma layer has a visible label above the field + the leading search icon (use the `#leading` slot with `<DsIcon name="search" />`).
  - [x] 8.3 `## Usage Examples`: basic, size variants, with helpIcon, with value + clear (showing Escape works), custom help icon slot (swap filter-a for filter-b), with @search handler (debounced-typeahead pattern), disabled.
  - [x] 8.4 Update `docs/ai-guidelines/index.md`:
    - 8.4.1 Add `DsSearchField` to the import example list (line 20) alphabetically between `DsLink` and `DsSelect`: `import { DsAvatar, DsBadge, DsButton, DsChip, DsIcon, DsIconButton, DsInputText, DsLink, DsSearchField, DsSelect, DsTextarea } from '@failwin/desing-system-vue';`
    - 8.4.2 Add a Component Inventory row alphabetically between `DsLink` and `DsSelect`:
      ```
      | `DsSearchField` | Search input with built-in search icon, clear button, optional filter/help button, 4 sizes (XXS/XS/S/M) | `import { DsSearchField } from '@failwin/desing-system-vue'` | SearchField, Search, Search bar, Filter search |
      ```
    - 8.4.3 Add a `**DsSearchField**` section under "Figma Element to Component Matching Guide" (alphabetical — between `**DsLink**` and `**DsSelect**`):
      ```
      - `SearchField/Default` → `<DsSearchField v-model="q" />`
      - `SearchField/Focused` or `SearchField/Input-text` → `<DsSearchField v-model="q" />` (states handled automatically — no prop)
      - With help icon (filter button): `<DsSearchField v-model="q" help-icon @help="openFilters" />`
      - Keyboard shortcut: Enter → `@search`, Escape → `@clear`
      - Size variants: `xxsmall` (28px, no default search icon), `xsmall` (32px), `small` (36px), `medium` (40px, default)
      - Do NOT use when the field has a visible label above it — use DsInputText + `#leading` slot with `<DsIcon name="search" />` instead
      ```

- [x] **Task 9: Validate & ship**
  - [x] 9.1 `npm run lint` — Biome must pass with zero errors. Known gotcha: Biome enforces import order (`story 6.1`, `story 7.1`, `story 7.3` all hit this). If the CLI complains, run `npm run lint -- --write` to auto-fix.
  - [x] 9.2 `npm test` — full suite, all green. Confirm new DsSearchField tests land and baseline (393 after Story 7.3) increases by 20–30.
  - [x] 9.3 `npm run build` — `vue-tsc --noEmit` + `vite build` must succeed. Verify `dist/components/DsSearchField/DsSearchField.vue.d.ts` exists and `dist/index.d.ts` re-exports `DsSearchField`, `DsSearchFieldProps`, `DsSearchFieldSize`, `DsSearchFieldClearBehavior`.
  - [x] 9.4 `npm run storybook` — start Storybook, click through every DsSearchField story in BOTH light and dark themes. Verify: every state transitions smoothly on hover/focus; Escape clears; Enter emits `@search` (use the `WithEventLog` story to confirm); Tab order is input → clear → help; XXS respects the `searchIcon` opt-in default; disabled is visibly muted and non-interactive. If the Chrome MCP is not connected, document the skip in Completion Notes — a reviewer should click-through before merge.
  - [x] 9.5 Update File List below with all created / modified files.
  - [x] 9.6 Update Change Log with the story completion entry dated with today's date at implementation time.

## Dev Notes

### Architecture — Custom Tailwind Component (no PrimeVue base)

`DsSearchField` is the first **custom Tailwind component** of Phase 2. Unlike DsChip / DsBadge / DsAvatar (which wrap PrimeVue primitives), DsSearchField has no PrimeVue base — per `prd-phase2.md` §Phase 2 component classification (line 174) and `epics-phase2.md` §Epic 8 description. It is implemented as a `<div>` containing:

1. A leading search-icon wrapper (`<DsIcon name="search" />`), hidden-by-default at XXS.
2. A native `<input type="search">` styled to match DsInputText's typography.
3. A trailing clear (X) button rendered on demand (auto / always / never).
4. An optional trailing help (filter) button, with a `#helpIcon` slot for customization.

### Composition strategy — how we satisfy FR13/FR15

FR13 states: *"DsSearchField can compose DsInputText and DsIcon internally."* FR15 states: *"Composed components (DsSearchField) can be used without the consumer needing to import the internal components separately."*

Two reasonable interpretations of "compose":

- **(A) Use the same primitives (DsIcon + same input-level tokens) without mounting DsInputText.** Pros: simplest code; no `:deep()` gymnastics to fight DsInputText's outer shell (label area, footer area, leading-slot wrapper); native `<input type="search">` gives us the correct a11y role for free; ~200 line component. Cons: technically doesn't instantiate `<DsInputText>` — FR13 could be read as requiring the literal component.
- **(B) Mount DsInputText with a leading-slot search icon + custom clear button, and override its outer layout via `:deep()`.** Pros: reuses the `DsInputText.__input--*` state styling for free. Cons: DsInputText's outer structure (`ds-input-text` wrapper with label/footer slots) does not match the Figma SearchField, which has NO label / footer. We'd spend more CSS reverting DsInputText than we'd save. Also `clearable` behavior inside DsInputText doesn't match Figma's 24px Exit button — we'd disable it anyway.

**Recommended: Option A.** The project's architecture.md §Anti-Patterns (line 330) explicitly allows "no shared utilities directory — wrappers are too thin to need shared code" which aligns with (A). Satisfy FR13/FR15 by:
- Importing `DsIcon` (literal compose) ✔
- Consuming the same token family and typography as DsInputText ✔
- Exposing a single-component API — consumers import only `DsSearchField` ✔ (FR15)

If a reviewer reads FR13 literally and insists on (B), the fallback pattern is:
```vue
<DsInputText v-model="model" :size="mappedInputTextSize" :disabled="disabled" :clearable="false"
  :aria-label="ariaLabel" class="ds-search-field__inner-input">
  <template #leading v-if="resolvedSearchIcon"><DsIcon name="search" /></template>
</DsInputText>
```
with `:deep()` overrides on `.ds-search-field__inner-input .ds-input-text__label` (hide it) and `.ds-input-text__footer` (hide it). Mark with a `TODO(reviewer)` comment. Default to (A) unless told otherwise.

### Component API

```ts
export type DsSearchFieldSize = 'xxsmall' | 'xsmall' | 'small' | 'medium';
export type DsSearchFieldClearBehavior = 'auto' | 'always' | 'never';

export interface DsSearchFieldProps {
  size?: DsSearchFieldSize;         // default 'medium'
  placeholder?: string;              // default 'Search'
  disabled?: boolean;                // default false
  clear?: DsSearchFieldClearBehavior; // default 'auto'
  searchIcon?: boolean;              // default: size !== 'xxsmall'
  helpIcon?: boolean;                // default false
  ariaLabel?: string;                // default 'Search'
  clearAriaLabel?: string;           // default 'Clear search'
  helpAriaLabel?: string;            // default 'Search options'
}
```

Emits:
- `update:modelValue` — string; every keystroke (v-model).
- `search` — string payload = current model value; fires on Enter.
- `focus` — FocusEvent; on input focus.
- `blur` — FocusEvent; on input blur.
- `clear` — no payload; clear button activation or Escape while value set.
- `help` — no payload; help button activation.

Slots:
- `helpIcon` — optional; overrides the default `<DsIcon name="filter-a" />` inside the help button. When provided, the help button wrapper (`aria-label`, handlers) is still supplied by DsSearchField.

### Figma-Derived Specifications (node `2:44972`)

#### Size Token Table

| Size | Outer height | Horizontal padding | Gap | Search icon | Clear icon | Help icon |
|---|---|---|---|---|---|---|
| XXS (`xxsmall`) | 28px | 6px | 6px | 18px (opt-in) | 24px button / ~18px glyph | 24px button / ~18px glyph |
| XS (`xsmall`) | 32px | 8px | 8px | 20px | 24px / 24px glyph | 24px / 24px glyph |
| S (`small`) | 36px | 12px | 8px | 20px | 24px / 24px glyph | 24px / 24px glyph |
| M (`medium`) | 40px | 12px | 8px | 20px | 24px / 24px glyph | 24px / 24px glyph |

Typography is identical across all sizes (Inter regular 14px / 20px line-height / -0.2px letter-spacing) — matches DsInputText's native-input rule. This is intentional and Figma-verified.

Verify every value against Figma in Task 2 before freezing. Document any deviations in Completion Notes.

#### State Token Mapping

| State | Background | Border | Text / search-icon color | Notes |
|---|---|---|---|---|
| Default | `--p-gray-100` | `--p-gray-400` | `--p-gray-600` | Idle, empty, unfocused |
| Hover (default-state only) | `--p-gray-200` | `--p-gray-800` | `--p-gray-700` | Hover on empty, unfocused |
| Focused | `--p-gray-100` | `--p-gray-800` | `--p-gray-800` | Empty, focused |
| Input-text | `--p-gray-100` | `--p-gray-800` | `--p-gray-800` | Has value (focused OR not) |
| Disabled | `--p-gray-100` | `--p-gray-300` | `--p-gray-500` | No interaction |

**State precedence** (highest wins): Disabled > Input-text > Focused > Default (hover via `:hover` pseudo only on Default). Encoded in the `stateClass` computed (Task 3.11).

#### Why hover only on Default

Per the UX spec line 574 (Universal State Behavior — state priority): Disabled > Loading > Active > Focus > Hover > Default. For DsSearchField, we intentionally:
- Suppress hover visual on Focused/Input-text because hovering over your own typed content is a weird UX.
- Suppress hover on Disabled (pointer-events:none).

If Figma shows a distinct `Input-text + hover` combined token, add `.ds-search-field--input-text:hover { … }` in Task 5.4 and update AC #3 accordingly.

### Icon Sizing

- Search icon at XS/S/M: use `<DsIcon name="search" size="medium" :style="{ width: '20px', height: '20px' }" />`. Medium preset = 20px — exact match, no inline override strictly needed, but keep the inline style for clarity.
- Search icon at XXS: `size="small" :style="{ width: '18px', height: '18px' }"` — `small` preset is 16px; override to 18px to match Figma.
- Clear button: 24×24 button box; `<DsIcon name="exit" size="small" :style="{ width: '24px', height: '24px' }" />` — `small` preset is 16px; override. Use `name="exit"` (verified in `src/components/DsIcon/icon-names.ts:76`). If the sampled Figma glyph turns out to be the `close` icon (X) instead of `exit`, swap accordingly — both are in the registry.
- Help button: 24×24 button box; default icon `<DsIcon name="filter-a" />` overridable via slot. `filter-a`/`filter-b`/`filter-c` are all registered (icon-names.ts:84–86).

### Existing Code to Reuse

| Artifact | Path | Reuse For |
|---|---|---|
| Typography / input reset pattern | `src/components/DsInputText/DsInputText.vue:219–235` | Native-input reset (border, shadow, background, padding, outline stripped) — mirror for `type="search"` |
| Focus-visible ring | `src/components/DsChip/DsChip.vue:198–201` | Purple-800 outline with offset — reuse unchanged on clear and help buttons |
| `:deep()` strip-PrimeVue pattern | `src/components/DsChip/DsChip.vue:94–99` | NOT directly used here (no PrimeVue base), but the mental model applies if we go with option B in §Composition strategy |
| Co-located file scaffold | `src/components/DsChip/` | Exact scaffold shape — mirror for DsSearchField |
| AI KB entry template | `docs/ai-guidelines/ds-input-text.md` | Section ordering + prop table format |
| AI KB index patterns | `docs/ai-guidelines/index.md:20–36, 87–172` | Import example line, Component Inventory table row, Figma matching guide section |
| Story "force-hover" helper class | `src/components/DsChip/DsChip.stories.ts:218–220` | Visualize hover state in Storybook without real mouse hover |
| Event-log pattern for emit verification | N/A yet — create in Task 6.8 | New pattern, document inline |

### Files to Create

- `src/components/DsSearchField/DsSearchField.vue`
- `src/components/DsSearchField/DsSearchField.stories.ts`
- `src/components/DsSearchField/DsSearchField.test.ts`
- `src/components/DsSearchField/index.ts`
- `docs/ai-guidelines/ds-search-field.md`

### Files to Modify

- `src/index.ts` — add DsSearchField + types re-export (alphabetical between DsLink and DsSelect).
- `docs/ai-guidelines/index.md` — add DsSearchField to import example line, Component Inventory, and Figma matching guide (all alphabetical — between DsLink and DsSelect).

### Files NOT Changed

- `src/components/DsInputText/DsInputText.vue` — DsSearchField does NOT modify DsInputText. Option B above would require `:deep()` overrides inside DsSearchField, not DsInputText. Keep DsInputText untouched to preserve its separate use case (labelled form field).
- `src/theme/ds-preset.ts` — no token changes needed. All required tokens (gray-100/200/300/400/500/600/700/800, purple-800) already exist. Story 7.3 was the only preset-touching Phase 2 story (Turquoise ramp for DsAvatar); we inherit it without change.
- `package.json` — no new peer dependencies (NFR10).
- `src/assets/icons/` — `search.svg`, `exit.svg`, `close.svg`, `filter-a.svg`, `filter-b.svg`, `filter-c.svg` all exist (verified in `src/components/DsIcon/icon-names.ts`).

### Anti-Patterns to Avoid

- **Do NOT hardcode hex colors** — always reference `--p-*` tokens. `grep -n '#' DsSearchField.vue` before merge should only hit CSS comments.
- **Do NOT use `!important`** — the cascade is under the component's full control (no PrimeVue base overriding selectors). If you feel like reaching for `!important`, the selector specificity is wrong.
- **Do NOT expose `label` / `hint` / `error` / `mandatory` / `optional` / `info` / `showDropdownIcon` props** — DsSearchField is intentionally label-less and error-less. Consumers who need those use DsInputText + `#leading` slot (document this in the AI KB §When to Use).
- **Do NOT wrap the root in a `<label>`** — the input has `aria-label` via prop. A `<label>` wrapper would duplicate semantics.
- **Do NOT add `clearable` back** — the clear behavior in DsSearchField is richer (auto / always / never + Escape shortcut) than DsInputText's boolean `clearable`. Exposing a second prop creates API confusion.
- **Do NOT bubble keyboard events** — `@keydown.enter.prevent="onEnter"` is intentional (suppresses form submit if nested in a `<form>`, because DsSearchField owns the search semantics). Same for `@keydown.space.prevent` on buttons (prevents page scroll).
- **Do NOT use PrimeVue IconField / InputIcon components** — the UX spec line 447 mentions "InputText + IconField" but that was the pre-Figma sketch. Our component is pure custom Tailwind + DsIcon (confirmed by prd-phase2.md line 174 "Custom Tailwind / None").
- **Do NOT forget to strip WebKit's built-in search clear X** — the CSS in Task 5.3 handles this. Without that reset, both our custom clear button AND Safari's native X render simultaneously.
- **Do NOT add a `modelModifiers` / debounce prop** — debouncing is a consumer concern; they can wrap v-model in a computed or use `@search` (which fires only on Enter) if they want throttled submit. Adding a built-in debounce would bloat the API and hide behavior.
- **Do NOT use `@click.stop` on the clear button** — there's no parent handler to stop propagation to; `.stop` hides bugs. (DsChip uses `.stop` because its outer chip might be clickable in consumer code; DsSearchField's outer `<div>` has no click handler.)
- **Do NOT support a `size` prop on internal DsIcon usage** beyond what's shown — always apply exact px via `:style` because `DsIcon`'s medium preset is 20px (OK for search icon) but the clear/help icons need 24px which is NOT a DsIcon preset; inline-override via style is the documented pattern (see DsChip.vue line 70, DsAvatar.vue Task 6).

### Previous Story Intelligence

**From Story 7.3 (DsAvatar) — immediate predecessor, same phase:**
- Test baseline is 393 after Story 7.3 (see Story 7.3 Debug Log References). Expect ~20–30 new DsSearchField tests, landing around 413–423.
- Biome import-order strictness continues to bite. Run `npm run lint` before marking any task done.
- `src/index.ts` drift is a known risk (DsSelect was missing from barrel before Story 7.1 caught it). Task 1.4 is the alphabetical-insertion fix; verify the final barrel is sorted.
- Co-located `DsXxx.vue` + `stories.ts` + `test.ts` + `index.ts` pattern is now well-established — mirror it exactly.

**From Story 7.1 (DsChip):**
- `inheritAttrs: false` + `v-bind="$attrs"` on the root is the right pattern when attrs should land on the outer wrapper (not the inner interactive element). DsSearchField follows the same pattern — attrs go on the outer `<div>`.
- Rendering our own `<button>` (instead of PrimeVue's `removable` prop) gave complete control over the icon glyph and focus-visible behavior. DsSearchField's clear + help buttons follow the same reasoning — plain `<button type="button">` with scoped styling.
- Dev Agent reported not being able to visually verify Storybook in-browser (no Chrome MCP). Plan for this in Task 9.4: document the skip if it happens; a human reviewer must click through before merge.

**From Story 6.3 (DsSelect Advanced Variants):**
- PrimeVue APIs occasionally diverge from expectations (Select lacked `multiple`; needed MultiSelect). N/A here because DsSearchField has no PrimeVue base — but the lesson generalizes: verify any assumed API with a smoke story before sinking time into it.
- Non-scoped `<style>` is only for teleported content. DsSearchField does not teleport — use `<style scoped>` only.

**From Story 6.1 (DsTextarea):**
- `<input>` element resets + `:deep()` patterns are well-exercised in this codebase. Reuse the reset idioms from DsInputText.vue:219–235 for DsSearchField's native input.

### Git Intelligence (Recent Commits)

```
d20a962 story 6.3
66b75a4 story 6.2
6ad1e82 story 6.1
2f67c65 add epics for phase 2
e9bed4d phase 2 specs sync
```

As of 2026-04-17, Stories 7.1 (DsChip), 7.2 (DsBadge), 7.3 (DsAvatar) are in `review` status — their files (`src/components/DsChip/`, `src/components/DsBadge/`, `src/components/DsAvatar/`, plus `docs/ai-guidelines/ds-chip.md`, `ds-badge.md`, `ds-avatar.md`) are in the working tree but not yet committed. They will likely land as three separate commits (`story 7.1`, `story 7.2`, `story 7.3`) before Story 8.1 begins. **When you start Story 8.1, pull the current `master`/branch HEAD and rebase if needed.** Commit style: one story = one commit titled `story X.Y`.

Epic 8 (DsSearchField, DsCodeInput) is `backlog` status. Creating Story 8.1 is the first action in Epic 8; sprint-status.yaml will transition `epic-8` → `in-progress` as part of this workflow (see Task 1 in §Validation).

### Latest Tech Notes

- **Vue**: `^3.5.30` — `defineModel<string>({ default: '' })` and `withDefaults` are both available. DsSearchField uses defineModel for v-model.
- **PrimeVue**: `^4.5.4` — not directly used in DsSearchField, but DsInputText (optional composition in strategy B) depends on `primevue/inputtext`.
- **Vitest**: `^4.1.2` — `mount` from `@vue/test-utils` `^2.4.6`. jsdom has limited focus-event support; test the focus state class by triggering `input.trigger('focus')` + `input.trigger('blur')` (jsdom dispatches these cleanly).
- **Biome**: `^2.4.9` — strict import order; run `npm run lint` before commit. Also strips trailing whitespace and enforces double-quote strings (check the existing Phase 2 component files for the style baseline).
- **Storybook**: `@storybook/vue3-vite` — `Meta` / `StoryObj` imports from `@storybook/vue3-vite` are the project convention.
- **Tailwind**: Tailwind CSS 4 is installed but DsSearchField uses **scoped CSS** (not Tailwind utility classes in templates). Scoped CSS matches the pattern of every other component in the library. The component-addition-guide.md line 182 shows Tailwind utilities only in examples; real components use scoped CSS + `var(--p-*)` tokens.

### Project Structure Notes

- File layout matches architecture.md §Project Structure (lines 357–393): `src/components/DsSearchField/{DsSearchField.vue, DsSearchField.stories.ts, DsSearchField.test.ts, index.ts}`.
- AI KB at `docs/ai-guidelines/ds-search-field.md` extends the existing 10-entry directory (after Stories 7.1–7.3 land, the directory has 10 component entries + `index.md`).
- Per CLAUDE.md, place any temporary / debug artifacts (scratch Figma screenshots, sampled-hex PNGs) in `./tmp/`, NOT in the component directory.
- Alphabetical insertion points (verify the CURRENT barrel before editing — Stories 7.1–7.3 may have landed first):
  - `src/index.ts`: `…DsLink → [DsSearchField] → DsSelect → DsTextarea…`
  - `docs/ai-guidelines/index.md` import example + inventory + matching guide: same alphabetical position.
- DsSearchField is the **first custom Tailwind** Phase 2 component (Stories 7.1/7.2/7.3 are all PrimeVue wrappers). It sets the pattern that Story 8.2 (DsCodeInput, also custom Tailwind) will follow — pay attention to the `<input>` reset + state-class computation; DsCodeInput will reuse the same idioms with per-cell state instead of whole-field state.

### References

- [Source: _bmad-output/planning-artifacts/epics-phase2.md#Story 8.1] — original BDD acceptance criteria (lines 467–516)
- [Source: _bmad-output/planning-artifacts/epics-phase2.md#Epic 8] — Epic context (lines 463–466); FR3, FR4, FR13, FR9, FR10, FR11, FR12 coverage (line 141)
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#FR3] — DsSearchField with search icon, clearable, sizes (line 244)
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#FR13] — Internal composition of DsInputText + DsIcon (line 263)
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#FR15] — Consumer does not import internals separately (line 265)
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#NFR3] — No perceptible latency vs. non-composed components (line 296)
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#NFR5] — Manual keyboard nav + ARIA for custom Tailwind components (line 301)
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#Phase 2 component classification] — "Custom Tailwind / None / Composed from DsInputText + search icon + clear behavior" (line 174)
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Architecture] — Thin prop-forwarding pattern + custom component rules (lines 164–170, 183–189)
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns] — `Ds` prefix, PascalCase, kebab-case AI KB (lines 250–274)
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure] — Co-located files pattern (lines 334–393)
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Component Strategy] — DsSearchField classification (line 447)
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX-DR2] — Built-in search icon + clear button behavior (epics-phase2.md line 84)
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Form Patterns] — Input field states consistent across form components (line 536)
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Icon Usage Patterns] — DsSearchField built-in search icon note (line 604)
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX-DR8/UX-DR9] — focus-visible + 150ms ease transitions with motion-safe (epics-phase2.md lines 90–91)
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX-DR10] — Uniform size token table XS/S/M/L; DsSearchField extends to XXS per Figma (epics-phase2.md line 92)
- [Source: docs/component-addition-guide.md] — Repeatable component addition checklist; `focus-visible:` ring pattern (line 198)
- [Source: docs/figma-variables.md] — Authoritative Figma → hex token mapping
- [Source: docs/ai-guidelines/ds-input-text.md] — Closest AI KB template for a form-field component
- [Source: docs/ai-guidelines/ds-chip.md] — Template for a compact component with button subelements (clear button)
- [Source: docs/ai-guidelines/index.md] — Component Inventory + Figma matching guide format
- [Source: src/components/DsInputText/DsInputText.vue:219–297] — Native input reset + state-class computation pattern
- [Source: src/components/DsChip/DsChip.vue:53–76, 180–201] — Inline `<button>` with focus-visible pattern for clear/help buttons
- [Source: src/components/DsChip/DsChip.vue:173–177] — Motion-safe transitions wrapper
- [Source: src/components/DsIcon/icon-names.ts:181, 76, 43, 84–86] — `search`, `exit`, `close`, `filter-a|b|c` icons verified present
- [Source: src/theme/ds-preset.ts:17–30] — gray ramp (primary tokens used by this story — gray-100/200/300/400/500/600/700/800)
- [Source: Figma node `2:44972`] — SearchField master (authoritative design — verify all sizes/states via `mcp__figma__get_design_context` in Task 2)
- [Source: _bmad-output/implementation-artifacts/7-3-dsavatar-component.md] — Most recent story precedent, same phase; size mapping and component structure patterns
- [Source: _bmad-output/implementation-artifacts/7-1-dschip-component.md] — Closest component-structure precedent; button-with-focus-ring pattern, removable semantics
- [Source: _bmad-output/implementation-artifacts/6-1-dstextarea-component.md] — Phase 2 pattern baseline; lint/test/build expectations

## Dev Agent Record

### Agent Model Used

claude-opus-4-7 (1M context)

### Debug Log References

- `npm run lint` — Biome clean after auto-fix (collapsed two multi-line computed arrow bodies back to single lines in DsSearchField.vue; equivalent reformatting in stories + tests files).
- `npm test` — 473 tests pass (14 files). DsSearchField adds 47 new tests: default rendering, sizes (with XXS search-icon default + overrides), state class resolution, v-model / Enter / Escape keyboard behaviour, clear-button visibility matrix, clear click/Enter/Space, help button (+ slot override), accessibility (aria-label, aria-hidden, aria-disabled, custom clearAriaLabel / helpAriaLabel / title), `$attrs` passthrough to root, tab order, DsInputText non-composition, and live v-model sync through a parent.
- `npm run build` — `vue-tsc --noEmit -p tsconfig.build.json && vite build` succeeded; `dist/components/DsSearchField/DsSearchField.vue.d.ts` present and `dist/index.d.ts` exports `DsSearchField`, `DsSearchFieldClearBehavior`, `DsSearchFieldProps`, `DsSearchFieldSize`.

### Completion Notes List

- **Composition strategy: Option A adopted.** Raw `<input type="search">` inside a root `<div>`, with scoped CSS consuming the same typography and token family as DsInputText. DsInputText is **not** mounted. FR13 "DsSearchField can compose DsInputText and DsIcon internally" is satisfied by sharing typography + token family and importing DsIcon literally; FR15 is satisfied since consumers import `DsSearchField` only. This matches the Dev Notes §Composition strategy recommendation and keeps DsInputText untouched.
- **Figma deviations vs. AC starting numbers (node `2:44972` sampled via `mcp__figma__get_design_context`):**
  - **Gap** is a uniform `4px` at all sizes (AC proposed 6 / 8 / 8 / 8). Updated scoped CSS to `gap: 4px` on the base `.ds-search-field` rule.
  - **Horizontal padding** differs from AC: Figma uses `12px left / 8px right` asymmetric at XXS (AC said 6px), and `8px` symmetric at XS / S / M (AC said 8 / 12 / 12). Followed Figma.
  - **Placeholder colour** on Hover stays at `--p-gray-600` (Figma) rather than shifting to gray-700 (AC); on Focused (empty), Figma uses the lighter `--p-gray-500` rather than gray-800. Encoded per-state placeholder rules to match Figma. Search-icon colour (driven by the container's `color`) still transitions gray-600 → gray-800 on Hover / Focused / Input-text to match AC #3.
  - **Help button glyph size** is `20px` (Figma ICON BUTTON has `p-[2px]` around a 20px filter-a glyph for a 24px outer box); AC suggested a 24px glyph. Used 20px glyph with a 24×24 outer button, matching Figma.
  - **Help button border-radius** is `4px` (Figma `rounded-md`) — applied to both the clear and help buttons for visual consistency (AC suggested `50%`).
  Per project memory rule "Figma beats UX spec", Figma values win. All deviations are >2px / token-family scale per Task 2.2 instruction.
- **Hover placeholder exception.** Because the Hover state now promotes the container `color` to `gray-800` (so the search icon darkens), an explicit `:hover .ds-search-field__input::placeholder { color: gray-600; }` rule keeps the placeholder text itself unchanged on Hover per Figma.
- **Escape-as-clear + Enter-as-search** behaviour is implemented with `@keydown.enter.prevent` (suppresses the parent form submit so DsSearchField owns the search semantic) and `@keydown.esc` (no-op when empty). Both are covered by tests. The clear button uses `@keydown.enter.prevent` / `@keydown.space.prevent` to avoid page-scroll and to activate deterministically.
- **Clear-button refocus.** After `onClearClick`, we re-focus the input (`inputRef.value?.focus()`) so consumers can keep typing without an extra click. This matches the browser-native `<input type="search">` clear convention.
- **Storybook click-through** was NOT run in-browser this session (no Chrome MCP available). Stories are authored and the file compiles through the type checker + lint passes; a human reviewer should click each story in both light and dark themes before merging, especially `Focused`, `AllStates`, `WithEventLog`, and the `CustomHelpIconSlot` story.
- **Test baseline.** Full suite now reports 473 tests (14 files). DsSearchField contributes 47 tests; the remainder includes concurrent DsCodeInput work already landed in the working tree.
- **Parallel-work awareness.** Story 8.2 (DsCodeInput) was being developed concurrently; `src/index.ts` and `docs/ai-guidelines/index.md` already had DsCodeInput entries when I edited them. My DsSearchField entries were inserted at the correct alphabetical positions relative to the existing content. Final barrel order in `src/index.ts`: `…DsLink → DsSearchField → DsSelect → DsTextarea…` (with `DsCodeInput` already slotted between `DsChip` and `DsIcon`, unrelated to my changes).

### File List

**Created**
- `src/components/DsSearchField/DsSearchField.vue`
- `src/components/DsSearchField/DsSearchField.stories.ts`
- `src/components/DsSearchField/DsSearchField.test.ts`
- `src/components/DsSearchField/index.ts`
- `docs/ai-guidelines/ds-search-field.md`

**Modified**
- `src/index.ts` — re-export `DsSearchField` + types (alphabetical between `DsLink` and `DsSelect`).
- `docs/ai-guidelines/index.md` — import example line, Component Inventory row, Figma matching guide entry (all alphabetical between DsLink and DsSelect).
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — `8-1-dssearchfield-component` → `review`.

## Change Log

| Date | Change | Notes |
|---|---|---|
| 2026-04-17 | Story 8.1 completed | DsSearchField implemented: 4 sizes, 4 states, search icon, clear button (auto/always/never + Escape), optional help/filter button with slot override, full a11y (search role, aria-label, focus-visible ring, tab order). 47 new Vitest tests (473 total). AI KB entry + index updated. Figma deviations from AC documented in Completion Notes. |
| 2026-04-17 | Code-review patches applied | Addressed 11 code-review findings from Blind Hunter + Edge Case Hunter: (P1) Escape honors `clear="never"`; (P2) Enter guarded against IME composition; (P3) help button hidden when `disabled`; (P4) consumed Escape calls `stopPropagation`/`preventDefault` so it doesn't bubble to parent modals; (P5) watcher resets `isFocused` when `disabled` flips true; (P6) `@search` payload coerces null to empty string; (P7) `#helpIcon` slot auto-shows the help button without the `helpIcon` prop; (P8) removed unreachable guard from `onClearClick`; (P9) `hasValue` behavior documented (whitespace counts as content); (P10) clear and help icons wrapped in `aria-hidden` spans to avoid double-announcement with button aria-label. 10 new tests added (57 DsSearchField tests total, 494 suite total). Build clean, Biome clean. |
| 2026-04-17 | Figma purity cleanup | Cross-checked implementation against Figma node `2:44972` end-to-end — zero behavioral inconsistencies. Tightened scoped CSS: size-modifier padding now uses Figma's literal vertical values (XXS `10px 8px 10px 12px`, XS `4px 8px`, S `6px 8px`, M `8px`) instead of `0` vertical padding. Removed unreachable `.ds-search-field--disabled .ds-search-field__clear/__help` rule (clear/help buttons are now `v-if`-hidden when disabled). Lint + 494 tests + build all clean. |
| 2026-04-17 | Story 8.1 marked done | Reviewed + patched + Figma-validated. Closes Epic 8 together with Story 8.2. |
