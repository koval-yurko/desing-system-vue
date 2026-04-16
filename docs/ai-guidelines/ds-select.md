# DsSelect

## When to Use

Use DsSelect for single-selection dropdowns — form fields where the user picks one option from a predefined list. Supports labels, validation errors, hints, leading icons, clear button, and core dropdown menu styles (one-line, two-line, no-match).

## Import

```ts
import { DsSelect } from '@failwin/desing-system-vue';
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| size | `'small' \| 'medium'` | `'medium'` | Select trigger size |
| disabled | `boolean` | `false` | Disabled state. Overrides error state. |
| label | `string` | — | Label text above the select |
| mandatory | `boolean` | `false` | Show mandatory asterisk (*) after label. Mutually exclusive with `optional` — if both are true, neither renders. |
| optional | `boolean` | `false` | Show "(Optional)" text after label. Mutually exclusive with `mandatory` — if both are true, neither renders. |
| info | `boolean` | `false` | Show help icon next to label |
| hint | `string` | — | Hint/helper text below the select |
| error | `string` | — | Error message (triggers error visual state and aria-invalid) |
| modelValue | `unknown` | — | v-model binding for selected value |

PrimeVue Select props are passed through via `$attrs`:

| Prop | Type | Description |
|---|---|---|
| options | `any[]` | Array of items to display |
| optionLabel | `string` | Property name for option display text |
| optionValue | `string` | Property name for option value |
| placeholder | `string` | Placeholder text when no value selected |
| filter | `boolean` | Enable search filtering in dropdown |
| filterPlaceholder | `string` | Placeholder for the filter input |
| emptyMessage | `string` | Text shown when options array is empty |
| appendTo | `string` | Where to append the dropdown overlay |
| panelClass | `string` | CSS class for the dropdown panel |

## Variants

DsSelect visual states are driven by props and user interaction:

- **Default** — Standard trigger with gray border and shadow.
- **Hover** — Gray-100 background, gray-600 border, no shadow.
- **Focus/Open** — White background, gray-400 border, shadow retained. Chevron rotates up.
- **Filled** — Has selected value. No shadow. Clear button visible.
- **Filled-Hover** — Filled + hover styling.
- **Error** — Red border with error message below. Triggered by `error` prop. Suppressed when `disabled` is also true.
- **Disabled** — Gray-100 background, no interaction. Triggered by `disabled` prop. Overrides error state.

## Sizes

- **small** — 32px height. Dense forms and compact layouts. Icons: 16px leading, 20px chevron, 20px clear.
- **medium** — 40px height. Default for standard forms. Icons: 20px leading, 24px chevron, 24px clear.

## Slots

| Slot | Description |
|---|---|
| `leading` | Left-side icon slot inside the trigger row |

PrimeVue Select slots are passed through:

| Slot | Description |
|---|---|
| `option` | Custom option template (receives `{ option }`) |
| `value` | Custom selected value display |
| `empty` | Content when options array is empty |
| `emptyfilter` | Content when filter yields no results |
| `header` | Header content above options list |
| `footer` | Footer content below options list |

## Events

| Event | Payload | Description |
|---|---|---|
| `clear` | — | Emitted when the clear button is clicked |
| `update:modelValue` | `unknown` | Emitted on selection change (used automatically by `v-model`) |

PrimeVue Select events are passed through:

| Event | Description |
|---|---|
| `change` | Emitted when selection changes |
| `show` | Emitted when dropdown opens |
| `hide` | Emitted when dropdown closes |
| `filter` | Emitted when filter input changes |

## Usage Examples

```vue
<!-- Basic select with label -->
<DsSelect v-model="fruit" label="Fruit" :options="['Apple', 'Banana', 'Cherry']" placeholder="Select a fruit" />
```

```vue
<!-- Select with object options -->
<DsSelect
  v-model="country"
  label="Country"
  :options="countries"
  option-label="name"
  option-value="code"
  placeholder="Select a country"
/>
```

```vue
<!-- Select with leading icon -->
<DsSelect v-model="value" label="Search" :options="items" placeholder="Select...">
  <template #leading>
    <DsIcon name="search" size="medium" />
  </template>
</DsSelect>
```

```vue
<!-- Two-line options -->
<DsSelect v-model="person" label="Assignee" :options="people" option-label="name" placeholder="Select a person">
  <template #option="{ option }">
    <div style="display: flex; flex-direction: column; gap: 2px;">
      <span style="font-weight: 500;">{{ option.name }}</span>
      <span style="font-size: 12px; color: var(--p-gray-600);">{{ option.role }}</span>
    </div>
  </template>
</DsSelect>
```

```vue
<!-- Filterable select -->
<DsSelect v-model="value" label="Country" :options="countries" option-label="name" filter placeholder="Search..." />
```

```vue
<!-- Select with error -->
<DsSelect v-model="value" label="Country" :options="countries" error="Please select a country" />
```

```vue
<!-- Disabled select -->
<DsSelect v-model="value" label="Country" :options="countries" disabled />
```

## Accessibility

- `aria-invalid="true"` is set when `error` is present and select is not disabled.
- `aria-describedby` links to the error message element for screen reader announcement.
- `aria-disabled="true"` is set when `disabled` is true.
- Clear button has `aria-label="Clear"` and supports keyboard interaction (Enter and Space).
- Label is connected to select trigger via `for`/`id` attributes.
- PrimeVue Select provides built-in keyboard navigation (arrow keys, Enter/Space, Escape, type-ahead).

## Figma Reference

| Figma Layer | Component Usage |
|---|---|
| Dropdown / Select | `<DsSelect />` |
| Dropdown input | `<DsSelect />` (trigger) |
| Dropdown menu | `<DsSelect />` (panel/overlay) |
