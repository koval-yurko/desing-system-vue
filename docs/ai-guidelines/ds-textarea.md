# DsTextarea

## When to Use

Use DsTextarea for multi-line text input — descriptions, comments, feedback forms, and any field requiring more than a single line. Supports labels, validation errors, hints, character counting, and a clear button.

## Import

```ts
import { DsTextarea } from '@failwin/desing-system-vue';
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| size | `'small' \| 'medium'` | `'medium'` | Textarea size (controls padding, not height — height is driven by `rows`) |
| disabled | `boolean` | `false` | Disabled state. Overrides error state if both are set. |
| label | `string` | — | Label text above the textarea |
| mandatory | `boolean` | `false` | Show mandatory asterisk (*) after label. Mutually exclusive with `optional` — if both are true, neither renders. |
| optional | `boolean` | `false` | Show "(Optional)" text after label. Mutually exclusive with `mandatory` — if both are true, neither renders. |
| info | `boolean` | `false` | Show help icon next to label |
| hint | `string` | — | Hint/helper text below the textarea |
| error | `string` | — | Error message (triggers error visual state and aria-invalid) |
| maxLength | `number` | — | Max character count — enables counter. Overflow triggers error state visually but does not truncate input. |
| rows | `number` | `3` | Initial visible rows (passed to PrimeVue Textarea) |
| modelValue | `string` | — | v-model binding for textarea value |

All standard PrimeVue Textarea props (`autoResize`, `placeholder`, `cols`, etc.) are forwarded via `$attrs`.

## Variants

DsTextarea visual states are driven by props and interaction:

- **Default** — Standard textarea with gray border and shadow.
- **Hover** — Gray-100 background, gray-600 border, shadow retained.
- **Focused** — Purple-400 border, no shadow.
- **Input-text** — Focused with value; subtle bw-01 background.
- **Filled** — Has value, not focused; no shadow.
- **Filled-Hover** — Has value, hovered; gray-800 border (darker than default hover).
- **Error** — Red-700 border. Triggered by `error` prop or character counter overflow. Suppressed when `disabled`.
- **Disabled** — Gray-100 background, no interaction. Overrides error state.

## Sizes

- **small** — 6px vertical padding. Dense forms and compact layouts.
- **medium** — 8px vertical padding. Default for standard forms.

Height is controlled by the `rows` prop (default 3), not the size prop.

## Events

| Event | Payload | Description |
|---|---|---|
| `clear` | — | Emitted when the clear button is activated |
| `update:modelValue` | `string` | Emitted on input change (used automatically by `v-model`) |

## Usage Examples

```vue
<!-- Basic textarea with label -->
<DsTextarea v-model="description" label="Description" />
```

```vue
<!-- Textarea with hint text -->
<DsTextarea v-model="notes" label="Notes" hint="Provide additional details" />
```

```vue
<!-- Textarea with error -->
<DsTextarea v-model="comments" label="Comments" error="Comments are required" />
```

```vue
<!-- Textarea with character counter -->
<DsTextarea v-model="bio" label="Bio" :max-length="200" />
```

```vue
<!-- Mandatory textarea -->
<DsTextarea v-model="feedback" label="Feedback" mandatory />
```

```vue
<!-- Disabled textarea -->
<DsTextarea v-model="locked" label="Locked" disabled />
```

## Accessibility

- `aria-invalid="true"` is set when error state is active (prop error or counter overflow) and textarea is not disabled.
- `aria-describedby` links to the error message element for screen reader announcement.
- `aria-disabled="true"` is set when `disabled` is true.
- Clear button has `aria-label="Clear"` and supports keyboard interaction (Enter and Space).
- Label is connected to textarea via `for`/`id` attributes.

## Figma Reference

| Figma Layer | Component Usage |
|---|---|
| Text-Area | `<DsTextarea />` |
| Textarea | `<DsTextarea />` |
