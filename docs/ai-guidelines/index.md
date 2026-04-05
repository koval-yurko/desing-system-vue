# @failwin/desing-system-vue — AI Component Index

A Vue 3 design system component library built on PrimeVue with Figma design tokens. This index helps AI coding agents determine which library component matches a Figma design element.

## Installation & Setup

```ts
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import { dsPreset } from '@failwin/desing-system-vue';
import '@failwin/desing-system-vue/style.css';

const app = createApp(App);
app.use(PrimeVue, { theme: { preset: dsPreset } });
```

All components are imported from the package root:

```ts
import { DsButton, DsIcon, DsIconButton, DsInputText, DsLink } from '@failwin/desing-system-vue';
```

## Component Inventory

| Component | Description | Import | Figma Element |
|---|---|---|---|
| `DsButton` | Button with severity variants (primary, outlined, tertiary, text, text-link, negative) and 4 sizes | `import { DsButton } from '@failwin/desing-system-vue'` | Button, Button/Primary, Button/Outlined, Button/Text |
| `DsIcon` | SVG icon from the design system icon set, 4 sizes | `import { DsIcon } from '@failwin/desing-system-vue'` | Icon, ic/*, glyph |
| `DsIconButton` | Icon-only button with type variants (primary, outlined, text) and 3 sizes | `import { DsIconButton } from '@failwin/desing-system-vue'` | IconButton, Button/Icon |
| `DsInputText` | Text input with label, hint, error, clearable, and dropdown-icon support, 2 sizes | `import { DsInputText } from '@failwin/desing-system-vue'` | Input, TextField, TextInput |
| `DsLink` | Hyperlink with type variants (regular, smart, quiet), visibility options, and 2 sizes | `import { DsLink } from '@failwin/desing-system-vue'` | Link, Hyperlink, TextLink |

## Theme Preset

The library exports two theme-related values:

- `dsPreset` — PrimeVue theme preset containing design tokens (colors, typography, spacing, shadows). Pass to `PrimeVue` plugin config.
- `dsTheme` — Pre-configured theme object combining `dsPreset` with default options. Use `dsPreset` for standard PrimeVue plugin setup (recommended); use `dsTheme` only if you need to pass the full theme object directly.

```ts
import { dsPreset, dsTheme } from '@failwin/desing-system-vue';
```

Consumer apps use `dsPreset` with PrimeVue's `theme.preset` option (see Installation & Setup above). This activates all design tokens as CSS custom properties.

## When to Use Library Components vs. Raw Tailwind

**Use a library component** when a Figma element matches a component in the inventory table above. Library components encapsulate design tokens, accessibility, and interaction patterns.

**Use raw Tailwind CSS** when the design element has no matching component. In this case, use the design tokens from the preset to stay consistent with the design system:

- **Colors** — Surface grays, primary (blue), danger (red), warning (amber), success (green), info (cyan). See `docs/figma-variables.md` for the full palette.
- **Typography** — Font sizes follow PrimeVue's semantic scale. The library uses the system default sans-serif font.
- **Spacing** — Standard Tailwind spacing scale. Specific component spacing is encoded in component styles.
- **Shadows** — PrimeVue shadow tokens are available via CSS custom properties.

For detailed Figma token values, see `docs/figma-variables.md`.

## Gap Detection & Flagging

When a Figma element has **no matching component** in the inventory above, flag it as a gap using this format:

```html
<!-- DS-GAP: [element description] — no matching component in @failwin/desing-system-vue -->
```

After flagging the gap:

1. Implement the element using raw Tailwind CSS with design tokens from `dsPreset`.
2. Continue with the rest of the implementation — do not block on gaps.
3. The gap flag serves as a signal for future design system expansion.

Example:

```html
<!-- DS-GAP: Tooltip — no matching component in @failwin/desing-system-vue -->
<div class="rounded bg-gray-900 px-3 py-1.5 text-sm text-white shadow-md">
  Tooltip content
</div>
```

## Figma Element to Component Matching Guide

Common Figma layer naming patterns and their corresponding library components:

**DsButton**
- `Button/Primary` → `<DsButton severity="primary">Label</DsButton>`
- `Button/Outlined` → `<DsButton severity="outlined">Label</DsButton>`
- `Button/Tertiary` → `<DsButton severity="tertiary">Label</DsButton>`
- `Button/Text` → `<DsButton severity="text">Label</DsButton>`
- `Button/Text Link` → `<DsButton severity="text-link">Label</DsButton>`
- `Button/Negative` → `<DsButton severity="negative">Label</DsButton>`
- Size variants: `xsmall`, `small`, `medium` (default), `large`

**DsIcon**
- `Icon/*`, `ic/*`, glyph layers → `<DsIcon name="icon-name" />`
- Size variants: `xsmall`, `small`, `medium` (default), `large`
- The `name` prop accepts values from the `IconName` type (type-checked at build time)

**DsIconButton**
- `IconButton/Primary`, `Button/Icon` → `<DsIconButton type="primary" aria-label="Action"><DsIcon name="icon-name" /></DsIconButton>`
- `IconButton/Outlined` → `<DsIconButton type="outlined" aria-label="Action"><DsIcon name="icon-name" /></DsIconButton>`
- `IconButton/Text` → `<DsIconButton type="text" aria-label="Action"><DsIcon name="icon-name" /></DsIconButton>`
- Size variants: `xsmall`, `small`, `medium` (default)

**DsInputText**
- `Input`, `TextField`, `TextInput` → `<DsInputText v-model="value" label="Label" />`
- With hint: `<DsInputText v-model="value" label="Label" hint="Help text" />`
- With error: `<DsInputText v-model="value" label="Label" error="Error message" />`
- Clearable: `<DsInputText v-model="value" clearable />`
- Size variants: `small`, `medium` (default)

**DsLink**
- `Link`, `Hyperlink`, `TextLink` → `<DsLink href="/path">Label</DsLink>`
- `Link/Smart` → `<DsLink type="smart" href="/path">Label</DsLink>`
- `Link/Quiet` → `<DsLink type="quiet" href="/path">Label</DsLink>`
- Visibility: `high` (default), `low`. Note: `visibility` is ignored when `type="smart"` (always resolves to `high`).
- Size variants: `small`, `medium` (default)
