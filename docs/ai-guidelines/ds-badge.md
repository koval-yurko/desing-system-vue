# DsBadge

## When to Use

Use DsBadge for status indicators, labels, and tags that communicate state in a compact pill format. DsBadge supports 11 visual `type` variants covering the full Figma Badge category — including shimmer/skeleton loading and WIP draft states. It is display-only (not interactive); wrap in a `<button>` if click behavior is needed.

**Important API note:** DsBadge uses `type` to select its variant — NOT `severity`. The 11 variants do not map to PrimeVue's severity set and cannot be expressed as severity values.

## Import

```ts
import { DsBadge } from '@failwin/desing-system-vue';
import type { DsBadgeProps, DsBadgeType } from '@failwin/desing-system-vue';
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `DsBadgeType` | `'pending'` | Visual variant. One of the 11 type values below. Controls color, border, padding, and any decorative overlays. |
| `showLIcon` | `boolean` | `false` | Render the left-side icon slot (12×12px). If `true` and no `#leading` slot is provided, renders a default `<DsIcon name="success" />` fallback. Ignored for `loaded` and `draft` types. |
| `showRIcon` | `boolean` | `false` | Render the right-side icon slot (12×12px). If `true` and no `#trailing` slot is provided, renders a default `<DsIcon name="success" />` fallback. Ignored for `loaded` and `draft` types. |
| `label` | `string` | — | Badge text label. If the default slot is also provided, the slot wins. Ignored for `loaded` type. |

All PrimeVue Badge props (`value`, `severity`, `size`, etc.) are forwarded via `$attrs`. DsBadge does not use `severity` internally.

## Type Variants

| `type` | Visual Intent | Background | Text |
|---|---|---|---|
| `pending` | Awaiting action (amber) | `--p-amber-100` | `--p-amber-700` (`#a33b16`) |
| `interesting` | Notable or new (purple) | `--p-purple-100` | `--p-purple-600` |
| `neutral` | Informational (blue) | `--p-blue-200` | `--p-blue-600` |
| `rejected` | Error or denied (red) | `--p-red-100` | `--p-red-700` |
| `accepted` | Success or approved (green) | `--p-green-100` | `--p-green-700` |
| `cancel` | Canceled state (gray solid) | `--p-gray-300` | `--p-gray-800` |
| `border` | Neutral outlined style for light surfaces | `--p-surface-0` (white) + `--p-gray-300` border | `--p-gray-800` |
| `clean` | Transparent minimal pill | transparent (hover: `--p-gray-300`) | `#62748e` |
| `draft` | WIP / unsaved state (striped gray) | `--p-gray-300` + diagonal stripe overlay | `--p-gray-800` |
| `loaded` | Skeleton/shimmer while content loads | `--p-gray-200` + shimmer animation | — (no text) |
| `type10` | Static hover-target for clean/border chips | `--p-gray-200` + `--p-gray-300` border | `--p-gray-800` |

**`type10` note:** This variant is the visual "hover state" target from Figma — it exists as a named type so designs can render the static hover appearance. Most consumers should use `<DsBadge type="clean" />` and rely on the `:hover` CSS that ships with the component, rather than hardcoding `type10`.

## Slots

| Slot | Description |
|---|---|
| `default` | Badge text (overrides `label` prop when provided). Not rendered for `loaded` type. |
| `leading` | Left-side 12×12px icon. Only rendered when `showLIcon=true`. Falls back to `<DsIcon name="success" />` if empty. Ignored for `loaded` and `draft` types. |
| `trailing` | Right-side 12×12px icon. Only rendered when `showRIcon=true`. Falls back to `<DsIcon name="success" />` if empty. Ignored for `loaded` and `draft` types. |

## Usage Examples

```vue
<!-- Basic badge — default type is pending -->
<DsBadge type="pending">Pending</DsBadge>
```

```vue
<!-- With label prop (equivalent to default slot) -->
<DsBadge type="accepted" label="Approved" />
```

```vue
<!-- With leading icon slot (12px override required) -->
<DsBadge type="neutral" label="Info" :showLIcon="true">
  <template #leading>
    <DsIcon name="info-filled" :style="{ width: '12px', height: '12px' }" />
  </template>
</DsBadge>
```

```vue
<!-- With both icon slots -->
<DsBadge type="border" label="Status" :showLIcon="true" :showRIcon="true">
  <template #leading>
    <DsIcon name="success" :style="{ width: '12px', height: '12px' }" />
  </template>
  <template #trailing>
    <DsIcon name="arrow-right" :style="{ width: '12px', height: '12px' }" />
  </template>
</DsBadge>
```

```vue
<!-- Shimmer/skeleton loading state (no label, no icons) -->
<DsBadge type="loaded" />
```

```vue
<!-- Draft / WIP state -->
<DsBadge type="draft" label="Draft" />
```

```vue
<!-- Clickable badge pattern — wrap in button, DsBadge is not interactive -->
<button type="button" @click="handleClick" style="border: none; background: none; padding: 0; cursor: pointer;">
  <DsBadge type="clean" label="Click me" />
</button>
```

## Accessibility

- DsBadge is **display-only** — no `tabindex`, no keyboard events, no focus ring.
- Consumers who need clickable badges should wrap in a `<button>` (the ancestor's focus styling applies).
- Icon slots use `currentColor` — each variant's text color automatically tints the icon.
- The `loaded` shimmer animation is wrapped in `@media (prefers-reduced-motion: no-preference)`; under `prefers-reduced-motion: reduce` the shimmer `::before` is hidden entirely so reduced-motion users see a plain gray pill with border.
- `draft` and `loaded` decorative overlays are implemented via CSS `::before` pseudo-elements so they do not pollute the accessibility tree.
- The `loaded` variant has no rendered text, so DsBadge defaults to `aria-busy="true"` and `aria-label="Loading"` on that variant. Consumers can override the label via `$attrs` (e.g. `<DsBadge type="loaded" aria-label="Fetching results" />`).
- DsBadge does not add `role="status"` by default. If the badge represents a live status update, the consumer should add `role="status"` via `$attrs`.

## Figma Reference

Figma node [`2014:9896`](https://www.figma.com/design/3qP5xnwc6gXhZR3AnFAMFe/Design-Systems?node-id=2014-9896) — Badge category (master variants for all 11 types).

| Figma Layer | Component Usage |
|---|---|
| `Badge/Pending` | `<DsBadge type="pending">Text</DsBadge>` |
| `Badge/Interesting` | `<DsBadge type="interesting">Text</DsBadge>` |
| `Badge/Neutral` | `<DsBadge type="neutral">Text</DsBadge>` |
| `Badge/Rejected` | `<DsBadge type="rejected">Text</DsBadge>` |
| `Badge/Aceptied` (Figma spelling) | `<DsBadge type="accepted">Text</DsBadge>` |
| `Badge/Cancel` | `<DsBadge type="cancel">Text</DsBadge>` |
| `Badge/Border` | `<DsBadge type="border">Text</DsBadge>` |
| `Badge/Clean` (Hover=no) | `<DsBadge type="clean">Text</DsBadge>` |
| `Badge/Clean` (Hover=yes) | `<DsBadge type="clean">Text</DsBadge>` — CSS `:hover` activates automatically |
| `Badge/Draft` | `<DsBadge type="draft">Text</DsBadge>` |
| `Badge/Loaded` (shimmer) | `<DsBadge type="loaded" />` |
| `Badge/Type10` (hover target) | `<DsBadge type="type10">Text</DsBadge>` |
| Badge with left icon | `<DsBadge type="pending" :showLIcon="true" label="Text"><template #leading><DsIcon name="success" :style="{ width: '12px', height: '12px' }" /></template></DsBadge>` |
| Badge with right icon | `<DsBadge type="pending" :showRIcon="true" label="Text"><template #trailing><DsIcon name="arrow-right" :style="{ width: '12px', height: '12px' }" /></template></DsBadge>` |
