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
import { DsAvatar, DsBadge, DsButton, DsChip, DsCodeInput, DsIcon, DsIconButton, DsInputText, DsLink, DsSearchField, DsSelect, DsTextarea } from '@failwin/desing-system-vue';
```

## Component Inventory

| Component | Description | Import | Figma Element | Reference |
|---|---|---|---|---|
| `DsAvatar` | User avatar with image, initials, and icon fallback variants, 4 sizes, 9 colors for colored initials | `import { DsAvatar } from '@failwin/desing-system-vue'` | Avatar, ProfilePic, User | [ds-avatar.md](./ds-avatar.md) |
| `DsBadge` | Status badge with 11 type variants (pending, interesting, neutral, rejected, accepted, cancel, border, clean, draft, loaded/shimmer, type10), optional 12px icons | `import { DsBadge } from '@failwin/desing-system-vue'` | Badge, Status, Tag, Pill | [ds-badge.md](./ds-badge.md) |
| `DsButton` | Button with severity variants (primary, outlined, tertiary, text, text-link, negative) and 4 sizes | `import { DsButton } from '@failwin/desing-system-vue'` | Button, Button/Primary, Button/Outlined, Button/Text | [ds-button.md](./ds-button.md) |
| `DsChip` | Tag/filter chip with default/selected/not-clickable types, 2 sizes, removable behavior | `import { DsChip } from '@failwin/desing-system-vue'` | Chip, Tag, FilterChip | [ds-chip.md](./ds-chip.md) |
| `DsCodeInput` | PIN/OTP-style verification code input with per-cell states, configurable length, error message, and paste support | `import { DsCodeInput } from '@failwin/desing-system-vue'` | Code input, Verification code, OTP, PIN | [ds-code-input.md](./ds-code-input.md) |
| `DsIcon` | SVG icon from the design system icon set, 4 sizes | `import { DsIcon } from '@failwin/desing-system-vue'` | Icon, ic/*, glyph | [ds-icon.md](./ds-icon.md) |
| `DsIconButton` | Icon-only button with type variants (primary, outlined, text) and 3 sizes | `import { DsIconButton } from '@failwin/desing-system-vue'` | IconButton, Button/Icon | [ds-icon-button.md](./ds-icon-button.md) |
| `DsInputText` | Text input with label, hint, error, clearable, and dropdown-icon support, 2 sizes | `import { DsInputText } from '@failwin/desing-system-vue'` | Input, TextField, TextInput | [ds-input-text.md](./ds-input-text.md) |
| `DsLink` | Hyperlink with type variants (regular, smart, quiet), visibility options, and 2 sizes | `import { DsLink } from '@failwin/desing-system-vue'` | Link, Hyperlink, TextLink | [ds-link.md](./ds-link.md) |
| `DsSearchField` | Search input with built-in search icon, clear button, optional filter/help button, 4 sizes (XXS/XS/S/M) | `import { DsSearchField } from '@failwin/desing-system-vue'` | SearchField, Search, Search bar, Filter search | [ds-search-field.md](./ds-search-field.md) |
| `DsSelect` | Single- or multi-selection dropdown with label, hint, error, leading icon, clear button, and 7 advanced dropdown variants (entity icons, badges, two-line multi-select, vendor, mention, big icon, no-match), 2 sizes | `import { DsSelect } from '@failwin/desing-system-vue'` | Dropdown, Select, Dropdown input | [ds-select.md](./ds-select.md) |
| `DsTextarea` | Multi-line text input with label, hint, error, character counter, and clear button, 2 sizes | `import { DsTextarea } from '@failwin/desing-system-vue'` | Text-Area, Textarea | [ds-textarea.md](./ds-textarea.md) |

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

**DsAvatar**
- `Avatar/Initials Colored` → `<DsAvatar initials="EM" color="blue" />`
- `Avatar/Initials Monochrome` → `<DsAvatar initials="EM" />`
- `Avatar/Icon` → `<DsAvatar />` (no initials, no image — person silhouette fallback)
- `Avatar/Image` → `<DsAvatar image="https://…" alt="User name" />`
- Image with fallback chain: `<DsAvatar :image="photo" :initials="initials" color="purple" :alt="name" />`
- Size variants: `large` (40px), `medium` (34px, default), `small` (28px), `xsmall` (20px)
- Colors (for colored initials): `blue`, `light-purple`, `yellow`, `pink`, `purple`, `deep-blue`, `turquoise`, `orange`, `red`

**DsBadge**
- `Badge/Pending` → `<DsBadge type="pending">Text</DsBadge>`
- `Badge/Interesting` → `<DsBadge type="interesting">Text</DsBadge>`
- `Badge/Neutral` → `<DsBadge type="neutral">Text</DsBadge>`
- `Badge/Rejected` → `<DsBadge type="rejected">Text</DsBadge>`
- `Badge/Aceptied` (Figma spelling) → `<DsBadge type="accepted">Text</DsBadge>`
- `Badge/Cancel` → `<DsBadge type="cancel">Text</DsBadge>`
- `Badge/Border` → `<DsBadge type="border">Text</DsBadge>`
- `Badge/Clean` → `<DsBadge type="clean">Text</DsBadge>` (hover state activates via CSS `:hover`)
- `Badge/Draft` → `<DsBadge type="draft">Text</DsBadge>`
- `Badge/Loaded` (shimmer/skeleton) → `<DsBadge type="loaded" />`
- `Badge/Type10` (static hover-target) → `<DsBadge type="type10">Text</DsBadge>`
- Badge with left icon: `<DsBadge type="pending" :showLIcon="true" label="Text"><template #leading><DsIcon name="success" :style="{ width: '12px', height: '12px' }" /></template></DsBadge>`
- Badge with right icon: `<DsBadge type="pending" :showRIcon="true" label="Text"><template #trailing><DsIcon name="arrow-right" :style="{ width: '12px', height: '12px' }" /></template></DsBadge>`
- Note: DsBadge uses `type`, NOT `severity`. It is display-only — wrap in `<button>` for interactivity.

**DsButton**
- `Button/Primary` → `<DsButton severity="primary">Label</DsButton>`
- `Button/Outlined` → `<DsButton severity="outlined">Label</DsButton>`
- `Button/Tertiary` → `<DsButton severity="tertiary">Label</DsButton>`
- `Button/Text` → `<DsButton severity="text">Label</DsButton>`
- `Button/Text Link` → `<DsButton severity="text-link">Label</DsButton>`
- `Button/Negative` → `<DsButton severity="negative">Label</DsButton>`
- Size variants: `xsmall`, `small`, `medium` (default), `large`

**DsChip**
- `Chip/Default` → `<DsChip>Label</DsChip>`
- `Chip/Selected` → `<DsChip type="selected">Label</DsChip>`
- `Chip/Not clickable` or `Chip/Disabled` → `<DsChip disabled>Label</DsChip>` (or `type="not-clickable"`)
- Removable: `<DsChip removable @remove="handleRemove">Label</DsChip>`
- With leading icon: `<DsChip><template #leading><DsIcon name="column-view" /></template>Label</DsChip>`
- With trailing chevron (dropdown indicator): `<DsChip>Label<template #trailing><DsIcon name="nav-arrow-down" /></template></DsChip>`
- Size variants: `small`, `medium` (default)

**DsCodeInput**
- `Code input` → `<DsCodeInput v-model="code" />`
- `Code input / Default` → `<DsCodeInput v-model="code" />` (all cells empty)
- `Code input / Focused` → `<DsCodeInput v-model="code" autofocus />` (consumer-controlled focus)
- `Code input / Input` → `<DsCodeInput :model-value="'5234'" />`
- `Code input / Error` → `<DsCodeInput v-model="code" error="Invalid code" />`
- `Code input / Hover` → `<DsCodeInput v-model="code" />` (hover is CSS-driven — no prop)
- Custom length: `<DsCodeInput v-model="code" :length="6" />` (default length = 4)
- Digits only: `<DsCodeInput v-model="code" integer-only />`
- Masked (bullets): `<DsCodeInput v-model="pin" mask integer-only />`

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

**DsSearchField**
- `SearchField/Default` → `<DsSearchField v-model="q" />`
- `SearchField/Focused` or `SearchField/Input-text` → `<DsSearchField v-model="q" />` (states handled automatically — no prop)
- With help icon (filter button): `<DsSearchField v-model="q" help-icon @help="openFilters" />`
- Keyboard shortcut: Enter → `@search`, Escape → `@clear`
- Size variants: `xxsmall` (28px, no default search icon), `xsmall` (32px), `small` (36px), `medium` (40px, default)
- Do NOT use when the field has a visible label above it — use DsInputText + `#leading` slot with `<DsIcon name="search" />` instead

**DsSelect**
- `Dropdown`, `Select`, `Dropdown input` → `<DsSelect v-model="value" label="Label" :options="items" />`
- With hint: `<DsSelect v-model="value" label="Label" :options="items" hint="Help text" />`
- With error: `<DsSelect v-model="value" label="Label" :options="items" error="Error message" />`
- With leading icon: `<DsSelect v-model="value" :options="items"><template #leading><DsIcon name="search" /></template></DsSelect>`
- Size variants: `small`, `medium` (default)

**DsTextarea**
- `Text-Area`, `Textarea` → `<DsTextarea v-model="value" label="Label" />`
- With hint: `<DsTextarea v-model="value" label="Label" hint="Help text" />`
- With error: `<DsTextarea v-model="value" label="Label" error="Error message" />`
- With counter: `<DsTextarea v-model="value" label="Label" :max-length="200" />`
- Size variants: `small`, `medium` (default)
