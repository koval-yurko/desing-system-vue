# DsButton

## When to Use

Use DsButton for action triggers — form submissions, dialog confirmations, navigation actions, and destructive operations. Choose the severity variant that matches the visual prominence needed.

## Import

```ts
import { DsButton } from '@failwin/desing-system-vue';
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| severity | `'primary' \| 'outlined' \| 'tertiary' \| 'text' \| 'text-link' \| 'negative'` | `'primary'` | Visual variant of the button |
| size | `'xsmall' \| 'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| disabled | `boolean` | `false` | Disabled state (reduces opacity, prevents interaction) |
| loading | `boolean` | `false` | Loading state (shows animated dots, prevents interaction) |

## Variants

- **primary** — Filled blue background. Default, highest prominence. Use for primary actions.
- **outlined** — Bordered with no fill. Secondary actions alongside a primary button.
- **tertiary** — Subtle secondary background. Lower prominence alternative actions.
- **text** — No background or border. Minimal prominence inline actions.
- **text-link** — Link-styled button. Looks like a hyperlink but behaves as a button.
- **negative** — Destructive red. Delete, remove, or other dangerous actions.

## Sizes

- **xsmall** — 24px height. Compact contexts like table rows.
- **small** — 32px height. Dense UIs and secondary actions.
- **medium** — 36px height. Default for most contexts.
- **large** — 40px height. Hero sections and prominent CTAs.

## Slots

- **icon** — Button icon, rendered before the label text. Recommended DsIcon sizes per button size: xsmall → `size="xsmall"` (12px), small → `size="small"` (16px), medium/large → `size="medium"` (20px).
- **default** — Button label text content.

## Usage Examples

```vue
<!-- Primary button (default) -->
<DsButton>Save changes</DsButton>
```

```vue
<!-- Outlined secondary action -->
<DsButton severity="outlined">Cancel</DsButton>
```

```vue
<!-- Button with icon -->
<DsButton severity="primary" size="medium">
  <template #icon>
    <DsIcon name="add-administrator" size="medium" />
  </template>
  Add user
</DsButton>
```

```vue
<!-- Loading state -->
<DsButton :loading="isSubmitting">Submit</DsButton>
```

```vue
<!-- Disabled state -->
<DsButton :disabled="!isValid">Continue</DsButton>
```

```vue
<!-- Negative/destructive action -->
<DsButton severity="negative">Delete account</DsButton>
```

## Accessibility

- `aria-disabled="true"` is set when `disabled` is true.
- `aria-busy="true"` is set when `loading` is true.
- `aria-live="polite"` is set when `loading` is true, announcing loading state to screen readers.
- Disabled buttons use `opacity: 0.5` and `pointer-events: none`.
- Loading buttons prevent interaction and visually replace content with animated dots.

## Figma Reference

| Figma Layer | Component Prop |
|---|---|
| Button/Primary | `severity="primary"` (default) |
| Button/Outlined | `severity="outlined"` |
| Button/Tertiary | `severity="tertiary"` |
| Button/Text | `severity="text"` |
| Button/Text Link | `severity="text-link"` |
| Button/Negative | `severity="negative"` |
