# DsAvatar

## When to Use

Use DsAvatar to render user avatars (profile circles, author badges, assignee pickers, mention pills). Supports three fallback variants — image, colored initials, monochrome initials, and an icon silhouette — plus 4 sizes and 9 colors for the colored-initials variant.

## Import

```ts
import { DsAvatar } from '@failwin/desing-system-vue';
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| variant | `'initials-colored' \| 'initials-monochrome' \| 'icon' \| 'image'` | auto-derived | Visual variant. If omitted, derived from `image`, `initials`, and `color`. |
| size | `'large' \| 'medium' \| 'small' \| 'xsmall'` | `'medium'` | Avatar size (L=40, M=34, S=28, XS=20). |
| color | `'blue' \| 'light-purple' \| 'yellow' \| 'pink' \| 'purple' \| 'deep-blue' \| 'turquoise' \| 'orange' \| 'red'` | — | Background color for the `initials-colored` variant. Defaults to `'blue'` when `variant` resolves to `initials-colored` and `color` is omitted. |
| initials | `string` | — | Initials text (1–3 chars recommended; no truncation). |
| image | `string` | — | Image URL. Falls back to initials or icon on load error. |
| alt | `string` | — | Alt text for the image; also used as the root `aria-label` when set. |
| ariaLabel | `string` | — | Explicit `aria-label` (highest precedence over `alt` and `initials`). |

All standard PrimeVue Avatar attributes are forwarded via `$attrs`. **Do NOT** pass PrimeVue's `label`, `icon`, or `image` props via `$attrs` — DsAvatar owns content rendering through its own template and will suppress them.

## Variants

| Variant | Background | Foreground | When to use |
|---|---|---|---|
| `image` | The image fills the circle | image | Consumer has a real user photo URL. |
| `initials-colored` | Solid color from the palette | white | Branded initials (e.g., assignee chips, mention avatars). |
| `initials-monochrome` | `--p-gray-300` | `--p-gray-800` | Neutral initials when no brand color is appropriate. |
| `icon` | `--p-gray-300` | `--p-gray-800` person silhouette | Unknown user / no initials / no image. |

Auto-derivation (when `variant` prop is omitted):
1. `image` set and not errored → `image`
2. `initials` + `color` → `initials-colored`
3. `initials` only → `initials-monochrome`
4. otherwise → `icon`

Explicit `variant` wins over auto-derivation.

## Sizes

| Size | Dimensions | Initials font | Icon size |
|---|---|---|---|
| `large` | 40×40 | Inter 600 18px / 24 | 24px |
| `medium` | 34×34 | Inter 600 14px / 20 | 24px |
| `small` | 28×28 | Inter 600 12px / 16 | 20px |
| `xsmall` | 20×20 | Inter 600 9px / 16 | 14px |

## Colors

Palette for `variant="initials-colored"`:

All hex values are sampled directly from the Figma avatar SVG assets (not visual approximation).

| Color | Token / hex | Figma sample |
|---|---|---|
| `blue` | `--p-blue-600` | `#0E5CF4` |
| `light-purple` | `--p-purple-300` | `#C27AFF` |
| `yellow` | `--p-amber-400` | `#F8BC3B` |
| `pink` | `--p-pink-200` | `#FF4DD2` |
| `purple` | `--p-purple-500` | `#8E51FF` |
| `deep-blue` | `--p-blue-900` | `#082C54` |
| `turquoise` | `--p-turquoise-500` (Phase 2 preset addition) | `#07B096` |
| `orange` | `--p-amber-600` (burnt orange) | `#DA6B16` |
| `red` | `#9f2d00` (hardcoded — no primitive match) | `#9F2D00` |

Foreground text is always `--p-surface-0` (white).

## Usage Examples

```vue
<!-- Image avatar -->
<DsAvatar
  image="https://example.com/u/42.png"
  alt="Elena Martinez"
/>
```

```vue
<!-- Colored initials -->
<DsAvatar initials="EM" color="purple" size="large" />
```

```vue
<!-- Monochrome initials (no color prop) -->
<DsAvatar initials="EM" />
```

```vue
<!-- Icon fallback (no initials, no image) -->
<DsAvatar alt="Unknown user" />
```

```vue
<!-- Image with automatic fallback chain (image → initials → icon) -->
<DsAvatar
  :image="user.photo"
  :initials="user.initials"
  color="blue"
  :alt="user.name"
/>
```

```vue
<!-- Compute initials from a name (helper stays in consumer code) -->
<script setup lang="ts">
import { DsAvatar } from '@failwin/desing-system-vue';

function getInitials(name: string, count = 2): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, count)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

const user = { name: 'Elena Martinez', color: 'purple' as const };
</script>

<template>
  <DsAvatar :initials="getInitials(user.name)" :color="user.color" :alt="user.name" />
</template>
```

## Accessibility

- Root has `role="img"` and an `aria-label` derived with this priority: explicit `ariaLabel` → `alt` → `initials` → `"User avatar"` default.
- The inner `<img>` (image variant) carries the same label via its `alt` attribute so the PrimeVue image element is announced correctly.
- The initials `<span>` and the DsIcon in the icon variant are marked `aria-hidden="true"` so screen readers don't read the letters one-by-one or duplicate the icon announcement.
- The avatar is not focusable by default (`tabindex="-1"`). Wrap it in a `<button>` or `<a>` if your UI makes it interactive.
- Image load failures silently fall back to initials (if provided) or the icon variant — never a broken-image glyph.

## Figma Reference

| Figma Layer | Component Usage |
|---|---|
| Avatar / Initials Colored | `<DsAvatar initials="EM" color="blue" />` |
| Avatar / Initials Monochrome | `<DsAvatar initials="EM" />` |
| Avatar / Icon | `<DsAvatar />` (no initials, no image) |
| Avatar / Image | `<DsAvatar image="…" alt="…" />` |
| Size L / M / S / XS | `size="large"` / `"medium"` / `"small"` / `"xsmall"` |
