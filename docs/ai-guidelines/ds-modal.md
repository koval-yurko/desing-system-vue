# DsModal

## When to Use

Use `DsModal` whenever a Figma design shows a centered overlay dialog with a header (title row), a body, and a footer with action buttons. Typical cases: form-based create/edit flows ("Add user", "Edit group"), destructive confirmations, and short prompts.

The component is a wrapper around PrimeVue `Dialog` with the design system's exact spacing, border, header divider, and close-button styling baked in. The header and footer are predefined slots; content placement inside each section is fully consumer-controlled.

## Import

```ts
import { DsModal } from '@failwin/desing-system-vue';
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `visible` | `boolean` | `false` | Controls visibility. Use with `v-model:visible`. |
| `title` | `string` | – | Title rendered in the header. Ignored when the `header` slot is used. |
| `description` | `string` | – | Optional helper text shown below the title. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Width tier — 400 / 500 / 600 px. |
| `closable` | `boolean` | `true` | Show the built-in close (×) button in the header. |
| `dismissableMask` | `boolean` | `true` | Click on the backdrop closes the modal. |
| `closeOnEscape` | `boolean` | `true` | Pressing Escape closes the modal. |
| `appendTo` | `'body' \| 'self' \| HTMLElement` | `'body'` | Teleport target for the dialog DOM. |

`$attrs` and additional PrimeVue `Dialog` props (e.g. `position`, `breakpoints`, `closeIcon`) pass through to the underlying component.

## Variants

DsModal has no severity variants — visual emphasis is communicated via the buttons placed in the `footer` slot (e.g. `<DsButton severity="negative">` for destructive actions).

## Sizes

- **small** — 400 px wide. Compact prompts and confirmations.
- **medium** — 500 px wide. Default for forms with 3–5 fields.
- **large** — 600 px wide. Wider forms or richer content.

## Slots

- **default** — Body content, rendered inside the 24 px-padded content section.
- **header** — Replaces the default title block. Provide a custom layout when `title` + `description` are not enough.
- **footer** — Footer content, typically action buttons. The footer section is omitted entirely when this slot is empty.

## Events

- `update:visible(value: boolean)` — Emitted when visibility changes (also via `v-model:visible`).
- `show()` — Emitted after the dialog becomes visible.
- `hide()` — Emitted when the dialog starts hiding.
- `after-hide()` — Emitted after the hide animation completes.

## Usage Examples

Basic confirmation:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DsButton, DsModal } from '@failwin/desing-system-vue';

const visible = ref(false);
</script>

<template>
  <DsButton @click="visible = true">Delete user</DsButton>
  <DsModal v-model:visible="visible" title="Delete user" size="small">
    <p>This action cannot be undone.</p>
    <template #footer>
      <DsButton severity="outlined" @click="visible = false">Cancel</DsButton>
      <DsButton severity="negative" @click="visible = false">Delete</DsButton>
    </template>
  </DsModal>
</template>
```

Form modal with description:

```vue
<DsModal
  v-model:visible="open"
  title="Create group"
  description="Fill the users details below"
  size="medium"
>
  <div style="display: flex; flex-direction: column; gap: 24px;">
    <DsInputText v-model="name" label="Name" mandatory />
    <DsTextarea v-model="desc" label="Description" mandatory :max-length="100" />
    <DsSelect v-model="users" label="Users" :options="opts" multiple />
  </div>
  <template #footer>
    <DsButton severity="outlined" @click="open = false">Cancel</DsButton>
    <DsButton :disabled="!name" @click="save">Create group</DsButton>
  </template>
</DsModal>
```

Custom header layout:

```vue
<DsModal v-model:visible="open">
  <template #header>
    <div style="display: flex; align-items: center; gap: 12px;">
      <DsAvatar initials="EM" color="purple" />
      <div>
        <h2 style="margin: 0;">Emma Miller</h2>
        <p style="margin: 0; color: var(--p-gray-600);">Admin</p>
      </div>
    </div>
  </template>
  <p>Profile body…</p>
</DsModal>
```

## Accessibility

- The dialog is rendered with `modal="true"` — focus is trapped inside while open and the page is inerted.
- The default header renders the title as an `<h2>` so screen readers announce it as the dialog heading.
- Pressing **Escape** closes the modal (disable with `:close-on-escape="false"`).
- The close button is keyboard-focusable and labelled by PrimeVue's built-in localization (override per app config if needed).
- Background scroll is blocked while the modal is open (PrimeVue `blockScroll` default).

## Figma Reference

| Figma Layer | Component Prop |
|---|---|
| `Modal` (container) | `<DsModal>` |
| `Modal/Header` | Header section — populated by `title` + `description` props or the `header` slot |
| Header close icon (`State=Regular` × 20px) | Built-in close button (slotting `<DsIcon name="close" />`) |
| Body container (24 px padding, 24 px gap) | Default slot |
| `BottomBar` | `footer` slot |
| Width 400 / 500 / 600 px | `size="small" \| "medium" \| "large"` |
| 12 px corner radius, gray-300 border, white background | Built into the component |
