# DsInputText

## When to Use

Use DsInputText for single-line text input — form fields, search inputs, and filters. Supports labels, validation errors, hints, and clearable functionality.

## Import

```ts
import { DsInputText } from '@failwin/desing-system-vue';
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| size | `'small' \| 'medium'` | `'medium'` | Input size |
| disabled | `boolean` | `false` | Disabled state |
| label | `string` | — | Label text above the input |
| mandatory | `boolean` | `false` | Show mandatory asterisk (*) after label. Mutually exclusive with `optional` — if both are true, neither renders. |
| optional | `boolean` | `false` | Show "(Optional)" text after label. Mutually exclusive with `mandatory` — if both are true, neither renders. |
| info | `boolean` | `false` | Show help icon next to label |
| hint | `string` | — | Hint/helper text below the input |
| error | `string` | — | Error message (triggers error visual state) |
| clearable | `boolean` | `false` | Show clear button when input has a value |
| showDropdownIcon | `boolean` | `false` | Show trailing dropdown arrow icon. Hidden when `error` is set. |
| modelValue | `string` | — | v-model binding for input value |

## Variants

DsInputText visual states are driven by props rather than explicit variants:

- **Default** — Standard input with gray border.
- **Error** — Red border with error icon and error message below. Triggered by `error` prop. Suppressed when `disabled` is also true.
- **Disabled** — Reduced opacity, no interaction. Triggered by `disabled` prop. Overrides error state if both are set.

## Sizes

- **small** — 32px height. Dense forms and compact layouts.
- **medium** — 40px height. Default for standard forms.

## Slots

- **leading** — Left-side icon slot inside the input row. Use for search icons, prefix indicators, etc.

## Events

| Event | Payload | Description |
|---|---|---|
| `clear` | — | Emitted when the clear button is clicked (`clearable` must be true) |
| `update:modelValue` | `string` | Emitted on input change (used automatically by `v-model`) |

## Usage Examples

```vue
<!-- Basic input with label -->
<DsInputText v-model="name" label="Full name" />
```

```vue
<!-- Input with hint text -->
<DsInputText v-model="email" label="Email" hint="We'll never share your email" />
```

```vue
<!-- Input with error -->
<DsInputText v-model="email" label="Email" error="Invalid email address" />
```

```vue
<!-- Clearable input -->
<DsInputText v-model="search" label="Search" clearable @clear="onClear" />
```

```vue
<!-- Input with leading icon -->
<DsInputText v-model="search" label="Search">
  <template #leading>
    <DsIcon name="search" size="small" />
  </template>
</DsInputText>
```

```vue
<!-- Input with dropdown icon (combo-box style) -->
<DsInputText v-model="selected" label="Category" show-dropdown-icon />
```

```vue
<!-- Mandatory field -->
<DsInputText v-model="username" label="Username" mandatory />
```

## Accessibility

- `aria-invalid="true"` is set when `error` is present and input is not disabled.
- `aria-describedby` links to the error message element for screen reader announcement.
- `aria-disabled="true"` is set when `disabled` is true.
- Clear button has `aria-label="Clear"` and supports keyboard interaction (Enter and Space).
- Label is connected to input via `for`/`id` attributes.

## Figma Reference

| Figma Layer | Component Usage |
|---|---|
| Input | `<DsInputText />` |
| TextField | `<DsInputText />` |
| TextInput | `<DsInputText />` |
