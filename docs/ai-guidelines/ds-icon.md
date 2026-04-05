# DsIcon

## When to Use

Use DsIcon for decorative or informational icons inside other components (buttons, inputs, links) or standalone when an icon conveys independent meaning.

## Import

```ts
import { DsIcon } from '@failwin/desing-system-vue';
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| name | `IconName` (required) | — | Icon name from the design system icon set (236 available, type-checked at build time) |
| size | `'xsmall' \| 'small' \| 'medium' \| 'large'` | `'medium'` | Icon size |
| ariaLabel | `string` | — | Accessible label for icons that convey independent meaning |

## Variants

DsIcon does not have visual variants — appearance is controlled by `name` and inherits `color` from the parent element via `currentColor`.

## Sizes

- **xsmall** — 12px. Inline indicators, label badges.
- **small** — 16px. Inside small inputs and compact UI.
- **medium** — 20px. Default. Inside buttons, standard UI elements.
- **large** — 24px. Standalone icons, larger touch targets.

## Usage Examples

```vue
<!-- Basic icon (decorative) -->
<DsIcon name="calendar" />
```

```vue
<!-- Icon with accessible label (standalone meaning) -->
<DsIcon name="error" :ariaLabel="'Error'" size="small" />
```

```vue
<!-- Icons at different sizes -->
<DsIcon name="check" size="xsmall" />
<DsIcon name="check" size="small" />
<DsIcon name="check" size="medium" />
<DsIcon name="check" size="large" />
```

```vue
<!-- Icon inside a button slot -->
<DsButton severity="outlined">
  <template #icon>
    <DsIcon name="search" />
  </template>
  Search
</DsButton>
```

## Accessibility

- Decorative icons (no `ariaLabel`) automatically get `aria-hidden="true"` — screen readers skip them.
- Provide `ariaLabel` only when the icon conveys meaning independently (not when it accompanies visible text).
- When `ariaLabel` is set, the icon gets `role="img"` and `aria-label` for screen reader announcement.

## Figma Reference

| Figma Layer | Component Usage |
|---|---|
| Icon/* | `<DsIcon name="..." />` |
| ic/* | `<DsIcon name="..." />` |
| glyph layers | `<DsIcon name="..." />` |

**Common icon names:** `arrow-down`, `arrow-left`, `arrow-right`, `arrow-up`, `bin`, `calendar`, `check`, `close`, `copy`, `edit`, `error`, `expand`, `help`, `home`, `link`, `search`, `undo`, `upload`, `users`, `workflow`
