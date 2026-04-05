# DsLink

## When to Use

Use DsLink for navigation links — inline text links, standalone navigation, and smart links with hover effects. Use instead of DsButton when the action is navigation rather than a command.

## Import

```ts
import { DsLink } from '@failwin/desing-system-vue';
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| type | `'regular' \| 'smart' \| 'quiet'` | `'regular'` | Link visual type |
| size | `'small' \| 'medium'` | `'medium'` | Link text size |
| visibility | `'high' \| 'low'` | `'high'` | Color prominence (high = blue, low = gray). Note: smart type forces high. |
| disabled | `boolean` | `false` | Disabled state (gray text, no interaction) |
| href | `string` | — | Link destination URL |

## Variants

- **regular** — Always underlined. Standard inline text link. Most common choice.
- **smart** — Padded container, gains blue background on hover with border-radius transition. Use for navigation menus and prominent link lists.
- **quiet** — No underline by default, gains underline on hover. Use for subtle links that should not visually compete with content.

## Sizes

- **small** — 14px font size. Inline text, footnotes, compact navigation.
- **medium** — 16px font size. Default. Standard body text links.

## Slots

- **left-icon** — Icon before the link text.
- **default** — Link text content.
- **right-icon** — Icon after the link text.

## Usage Examples

```vue
<!-- Basic regular link -->
<DsLink href="/about">About us</DsLink>
```

```vue
<!-- Smart link (navigation menu style) -->
<DsLink type="smart" href="/dashboard">Dashboard</DsLink>
```

```vue
<!-- Quiet link -->
<DsLink type="quiet" href="/terms">Terms of service</DsLink>
```

```vue
<!-- Link with icons -->
<DsLink href="/docs">
  <template #left-icon>
    <DsIcon name="link" size="small" />
  </template>
  Documentation
  <template #right-icon>
    <DsIcon name="arrow-right" size="small" />
  </template>
</DsLink>
```

```vue
<!-- Low visibility link -->
<DsLink visibility="low" href="/help">Help center</DsLink>
```

```vue
<!-- Disabled link -->
<DsLink :disabled="true" href="/restricted">Restricted area</DsLink>
```

## Accessibility

- `aria-disabled="true"` is set when `disabled` is true.
- `tabindex="-1"` is set when disabled, removing from tab order.
- `href` is removed when disabled, preventing navigation.
- `focus-visible` outline (2px purple) provides keyboard focus indication.
- Click events are prevented and stopped when disabled.

## Figma Reference

| Figma Layer | Component Prop |
|---|---|
| Link | `type="regular"` (default) |
| Hyperlink | `type="regular"` (default) |
| TextLink | `type="regular"` (default) |
| Link/Smart | `type="smart"` |
| Link/Quiet | `type="quiet"` |
