# DsChip

## When to Use

Use DsChip for tag, filter, or selection chips — small rounded labels with optional leading icons, trailing adornments, and a removable (X) action. Three visual types (Default, Selected, Not clickable) and two sizes (S, M) cover the standard Figma chip system.

## Import

```ts
import { DsChip } from '@failwin/desing-system-vue';
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| type | `'default' \| 'selected' \| 'not-clickable'` | `'default'` | Visual type. `selected` is purely visual — wrap the chip in your own `<button>` if you need click-to-toggle behavior. |
| size | `'small' \| 'medium'` | `'medium'` | Chip size (controls padding and border color at Size S default) |
| disabled | `boolean` | `false` | Disabled state. Equivalent to `type='not-clickable'`. Overrides `type` when true. |
| removable | `boolean` | `false` | Show the X (Exit) close button and emit `@remove` on click / Enter / Space |
| removeAriaLabel | `string` | `'Remove'` | Accessible label for the X button |
| label | `string` | — | Chip text. If the default slot is also provided, the slot wins. |

All standard PrimeVue Chip props (`image`, `icon`, etc.) are forwarded via `$attrs`. DsChip renders its own X button, so do NOT pass PrimeVue's built-in `removable` prop.

## Variants

- **Default** — White background with a gray border (500 at M, 400 at S), gray-900 text. Hover: gray-100 background, gray-500 border.
- **Selected** — White background, purple-800 border, purple-800 text/icons. Hover: purple-100 background.
- **Not clickable (Disabled)** — No hover, no pointer events. Size M: gray-300 background, no border. Size S: gray-100 background, gray-200 border.

## Sizes

- **small** — `padding: 4px 8px`. Compact filter lists, dense toolbars.
- **medium** — `padding: 6px 8px`. Default; matches the Figma chip master.

Both sizes share border-radius `8px`, gap `4px`, and label typography (Inter 14px / 20px line-height / -0.2px letter-spacing). Icons in both slots should render at 18px (see Accessibility/Icon notes below).

## Slots

| Slot | Description |
|---|---|
| `default` | Chip text (overrides `label` prop when provided) |
| `leading` | Left-side icon/adornment (e.g., entity icon at S, list/column icon at M) |
| `trailing` | Right-side adornment (e.g., right-arrow chevron at M). Ignored when `removable=true`. |

## Events

| Event | Payload | Description |
|---|---|---|
| `remove` | — | Emitted on X click, Enter, or Space when `removable=true`. Not emitted when `disabled` / `type='not-clickable'`. The consumer is responsible for unmounting the chip. |

## Usage Examples

```vue
<!-- Basic chip -->
<DsChip label="MDS Entries" />
```

```vue
<!-- Selected chip -->
<DsChip type="selected" label="Active filter" />
```

```vue
<!-- Removable chip with v-on handler -->
<DsChip
  size="small"
  removable
  label="React"
  @remove="handleRemove"
/>
```

```vue
<!-- Leading icon variant (matches the Figma "Column" chip glyph) -->
<DsChip label="Column">
  <template #leading>
    <DsIcon name="column-view" size="small" :style="{ width: '18px', height: '18px' }" />
  </template>
</DsChip>
```

```vue
<!-- Trailing chevron variant (matches the Figma dropdown-indicator chip) -->
<DsChip label="MDS Entries">
  <template #trailing>
    <DsIcon name="nav-arrow-down" size="small" :style="{ width: '18px', height: '18px' }" />
  </template>
</DsChip>
```

```vue
<!-- Removable list with focus management (canonical pattern) -->
<!-- Key chip refs by stable id — NOT by render index — so rapid/double removes
     cannot splice the wrong item and focus-next always resolves correctly. -->
<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { DsChip } from '@failwin/desing-system-vue';

const chips = ref([
  { id: 1, label: 'React' },
  { id: 2, label: 'Vue' },
  { id: 3, label: 'Svelte' },
]);
const chipRefs = ref(new Map<number, { $el: HTMLElement }>());

async function handleRemove(id: number) {
  const index = chips.value.findIndex((c) => c.id === id);
  if (index === -1) return;
  chips.value.splice(index, 1);
  chipRefs.value.delete(id);
  await nextTick();
  const nextChip = chips.value[index] ?? chips.value[chips.value.length - 1];
  const button = nextChip
    ? chipRefs.value.get(nextChip.id)?.$el?.querySelector<HTMLButtonElement>('.ds-chip__remove')
    : null;
  button?.focus();
}

function setRef(el: unknown, id: number) {
  if (el) chipRefs.value.set(id, el as { $el: HTMLElement });
  else chipRefs.value.delete(id);
}
</script>

<template>
  <DsChip
    v-for="chip in chips"
    :key="chip.id"
    :ref="(el) => setRef(el, chip.id)"
    size="small"
    removable
    :label="chip.label"
    @remove="handleRemove(chip.id)"
  />
</template>
```

## Accessibility

- The chip root is not focusable (`tabindex="-1"`); only the X button enters the tab order when `removable=true`.
- The X button is a real `<button type="button">` with `aria-label="Remove"` (overridable via `removeAriaLabel`).
- Keyboard: the X button responds to Enter and Space (activation). Clicks do not bubble to parent handlers.
- Focus-visible ring: the X button shows a 2px purple-800 outline with 2px offset on keyboard focus. Mouse focus does not show the ring (`:focus-visible`).
- When `disabled=true` or `type='not-clickable'`, the chip has `pointer-events: none` and the X button will not emit `remove`.
- Icons in the `leading` / `trailing` slots inherit the chip's text color via `currentColor`, so Selected chips automatically render purple icons.
- Chip text should remain short (1–3 words); long labels will not truncate.

## Figma Reference

| Figma Layer | Component Usage |
|---|---|
| Chip / Default | `<DsChip>Label</DsChip>` |
| Chip / Selected | `<DsChip type="selected">Label</DsChip>` |
| Chip / Not clickable | `<DsChip type="not-clickable">Label</DsChip>` or `<DsChip disabled>Label</DsChip>` |
| Chip with X (removable) | `<DsChip removable @remove="...">Label</DsChip>` |
| Chip with leading icon | `<DsChip><template #leading>…</template>Label</DsChip>` |
| Chip with trailing chevron | `<DsChip>Label<template #trailing>…</template></DsChip>` |
