# DsIconButton

## When to Use

Use DsIconButton for icon-only action buttons — toolbars, close buttons, compact actions, and toggle controls where a text label is not needed.

## Import

```ts
import { DsIconButton } from '@failwin/desing-system-vue';
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| type | `'primary' \| 'outlined' \| 'text'` | `'primary'` | Visual variant of the button |
| size | `'xsmall' \| 'small' \| 'medium'` | `'medium'` | Button size (square dimensions) |
| disabled | `boolean` | `false` | Disabled state (reduces opacity, prevents interaction) |
| loading | `boolean` | `false` | Loading state (shows animated dots, prevents interaction) |
| ariaLabel | `string` | — | Accessible label (required — icon buttons have no visible text) |
| ariaLabelledby | `string` | — | ID of element that labels this button (alternative to ariaLabel) |

## Variants

- **primary** — Filled blue background. Default, high-prominence icon action.
- **outlined** — Bordered with no fill. Secondary icon actions.
- **text** — No background or border. Minimal prominence, inline icon actions.

## Sizes

- **xsmall** — 1.5rem (24px) square. Compact contexts like table cells.
- **small** — 2rem (32px) square. Dense toolbars and secondary actions.
- **medium** — 2.25rem (36px) square. Default for most contexts.

## Slots

- **default** — Icon content. Place a `<DsIcon>` component here. The button CSS constrains icon dimensions per size tier, but for best results match DsIcon size to button size: xsmall/small → `size="small"`, medium → `size="medium"`.

## Usage Examples

```vue
<!-- Primary close button -->
<DsIconButton ariaLabel="Close">
  <DsIcon name="close" />
</DsIconButton>
```

```vue
<!-- Outlined settings button -->
<DsIconButton type="outlined" ariaLabel="Settings">
  <DsIcon name="settings" />
</DsIconButton>
```

```vue
<!-- Text icon button (minimal) -->
<DsIconButton type="text" size="small" ariaLabel="Edit">
  <DsIcon name="edit" />
</DsIconButton>
```

```vue
<!-- Loading state -->
<DsIconButton :loading="true" ariaLabel="Saving">
  <DsIcon name="check" />
</DsIconButton>
```

## Accessibility

- `ariaLabel` is required (or `ariaLabelledby`) — icon buttons have no visible text, so screen readers need an explicit label.
- `aria-disabled="true"` is set when `disabled` or `loading` is true.
- `aria-busy="true"` is set when `loading` is true.
- `aria-live="polite"` is set when `loading` is true.
- Loading state replaces icon content with animated dots and includes `role="status"`.

## Figma Reference

| Figma Layer | Component Prop |
|---|---|
| IconButton/Primary | `type="primary"` (default) |
| IconButton/Outlined | `type="outlined"` |
| IconButton/Text | `type="text"` |
| Button/Icon | Generic icon button reference |
