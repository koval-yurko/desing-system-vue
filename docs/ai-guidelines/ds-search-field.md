# DsSearchField

## When to Use

Use `DsSearchField` for inline search inputs that appear in toolbars, table filters, dialog headers, or typeahead entries — the field has a built-in leading search icon, an optional clear (X) button, and an optional trailing filter/help button. No visible label sits above the field; the accessible name is supplied via `aria-label`.

**vs. `DsInputText`:**

- Use **`DsSearchField`** when the Figma layer is labelled `SearchField`, `Search Field`, `Search`, or `Search bar`, or the field has no visible label above it.
- Use **`DsInputText`** with a `#leading` slot of `<DsIcon name="search" />` when the design has a visible label above the field (the form-field pattern with label / hint / error support).

## Import

```ts
import { DsSearchField } from '@failwin/desing-system-vue';
```

Consumers never import `DsInputText` or `DsIcon` themselves — the search icon, clear, and help buttons are all composed inside `DsSearchField`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `'xxsmall' \| 'xsmall' \| 'small' \| 'medium'` | `'medium'` | Outer height tier. Heights: 28 / 32 / 36 / 40 px. |
| `placeholder` | `string` | `'Search'` | Placeholder text. |
| `disabled` | `boolean` | `false` | Disabled state (pointer-events:none, muted tokens). |
| `clear` | `'auto' \| 'always' \| 'never'` | `'auto'` | Clear-button visibility. `'auto'` = only when input has content; `'always'` = always visible; `'never'` = never rendered. |
| `searchIcon` | `boolean` | `size !== 'xxsmall'` | Leading search icon. Default is `true` at XS / S / M and `false` at XXS per Figma. Consumer can override either way at any size. |
| `helpIcon` | `boolean` | `false` | Show the trailing filter/help button. |
| `ariaLabel` | `string` | `'Search'` | Accessible label for the input. |
| `clearAriaLabel` | `string` | `'Clear search'` | Accessible label for the clear button. |
| `helpAriaLabel` | `string` | `'Search options'` | Accessible label **and** tooltip text for the help button. |

`$attrs` are forwarded to the outer root `<div>`, so `data-testid`, `id`, and custom classes land there — not on the inner `<input>`.

## Sizes

| Size | Height | Horizontal padding | Search icon | Clear / help button |
|---|---|---|---|---|
| `xxsmall` | 28 px | 12 px / 8 px (asym) | 18 px (opt-in) | 24 × 24 |
| `xsmall` | 32 px | 8 px | 20 px | 24 × 24 |
| `small` | 36 px | 8 px | 20 px | 24 × 24 |
| `medium` | 40 px | 8 px | 20 px | 24 × 24 |

Typography is identical across sizes: Inter regular 14 px / line-height 20 px / letter-spacing −0.2 px. Border-radius is `8px` at all sizes.

## Variants

DsSearchField visual variants are interaction-driven rather than author-selected — the field automatically resolves one of five visual modes from props, focus, and content:

| Variant | Background | Border | Text / search-icon |
|---|---|---|---|
| Default | `--p-gray-100` | `--p-gray-400` | `--p-gray-600` |
| Hover (default-variant only) | `--p-gray-200` | `--p-gray-800` | `--p-gray-800` |
| Focused (empty) | `--p-gray-100` | `--p-gray-800` | `--p-gray-800` (placeholder dims to `--p-gray-500`) |
| Input-text (has value) | `--p-gray-100` | `--p-gray-800` | `--p-gray-800` |
| Disabled | `--p-gray-100` | `--p-gray-300` | `--p-gray-500` |

Variant precedence (highest wins): **Disabled > Input-text > Focused > Default**. Hover is only applied to the Default variant via `:hover`. Transitions use `150ms ease` behind `@media (prefers-reduced-motion: no-preference)`.

## Slots

| Slot | Description |
|---|---|
| `helpIcon` | Overrides the default `<DsIcon name="filter-a" />` inside the help button. The button wrapper, `aria-label`, `title`, focus ring, and click/keyboard handlers still come from `DsSearchField`. |

## Events

| Event | Payload | Fires on |
|---|---|---|
| `update:modelValue` | `string` | Every keystroke (native `v-model`). |
| `search` | `string` (current model) | Pressing **Enter** while the input has focus. Fires even when empty — consumers decide whether to filter. |
| `focus` | `FocusEvent` | Input focus. |
| `blur` | `FocusEvent` | Input blur. |
| `clear` | — | Clear button click / Enter / Space, or **Escape** while the input has content. Model is reset to `''`. |
| `help` | — | Help button click / Enter / Space (only when `helpIcon=true`). |

## Keyboard Shortcuts

| Key | Effect |
|---|---|
| **Enter** (in input) | Emit `@search` with current value; default form-submit is prevented. |
| **Escape** (in input, value set) | Clear the input and emit `@clear`. No-op when empty. |
| **Enter / Space** (on clear button) | Clear the input and emit `@clear`. |
| **Enter / Space** (on help button) | Emit `@help`. |
| **Tab** | Native tab order is `input → clear (if visible) → help (if visible)`. |

## Usage Examples

```vue
<!-- Basic medium search field -->
<DsSearchField v-model="query" />
```

```vue
<!-- Sizes: xxsmall / xsmall / small / medium -->
<DsSearchField size="xxsmall" v-model="query" placeholder="Filter" />
<DsSearchField size="xsmall" v-model="query" />
<DsSearchField size="small" v-model="query" />
<DsSearchField size="medium" v-model="query" />
```

```vue
<!-- With help (filter) icon -->
<DsSearchField v-model="query" help-icon @help="openFilterDrawer" />
```

```vue
<!-- Debounced typeahead using @search (Enter) -->
<script setup lang="ts">
import { ref } from 'vue';
const query = ref('');
function runSearch(value: string) {
  // fires only on Enter — no manual debounce needed
  fetchResults(value);
}
</script>

<template>
  <DsSearchField v-model="query" @search="runSearch" @clear="runSearch('')" />
</template>
```

```vue
<!-- Custom help glyph via slot -->
<DsSearchField v-model="query" help-icon>
  <template #helpIcon>
    <DsIcon name="filter-b" :style="{ width: '20px', height: '20px' }" />
  </template>
</DsSearchField>
```

```vue
<!-- Clear behavior variations -->
<DsSearchField v-model="query" clear="always" />   <!-- X always visible -->
<DsSearchField v-model="query" clear="never" />    <!-- X never rendered -->
```

```vue
<!-- Disabled -->
<DsSearchField v-model="query" disabled />
```

## Accessibility

- The input is `<input type="search">`, which gives an implicit `role="searchbox"` and hides browser-native clear X (we render our own).
- Default accessible name is `aria-label="Search"` (overridable via `ariaLabel`).
- The leading search icon is decorative (`aria-hidden="true"`) — the input's `aria-label` carries the semantic meaning.
- When `disabled=true`, the input has `aria-disabled="true"` in addition to the native `disabled` attribute.
- Clear and help buttons both receive a visible `focus-visible` ring (`2px solid var(--p-purple-800)`).
- Help button also sets `title` equal to its `aria-label`, matching the Figma "Search options" tooltip.

## Figma Reference

Figma Design System → **Search Field** category: node `2:44972` in file `3qP5xnwc6gXhZR3AnFAMFe`.

Variants: `Size = xxsmall | xsmall | small | medium` × `State = Default | Hover | Focused | Input-text` × `Help icon = no | yes`.
