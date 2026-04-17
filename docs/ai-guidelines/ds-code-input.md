# DsCodeInput

## When to Use

Use DsCodeInput for PIN / OTP / verification code entry — individual character cells with auto-advance, backspace, and paste support. Thin wrapper around PrimeVue `InputOtp` that provides the design-system visuals (43×58 cells, 16px gap, purple focus glow) and the shared label/hint/error envelope.

## Import

```ts
import { DsCodeInput } from '@failwin/desing-system-vue';
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| label | `string` | — | Label text above the cells. Associated via `aria-labelledby` on the group container. |
| hint | `string` | — | Helper text below the cells. Hidden when `error` is set. |
| error | `string` | — | Error message — triggers the Error cell state and renders below the cells with a red error icon. |
| disabled | `boolean` | `false` | Disabled state — applies muted cell styling and suppresses the error message. |
| modelValue | `string` | — | v-model binding for the concatenated code. |

### PrimeVue InputOtp props (forwarded via `$attrs`)

| Prop | Type | Default | Description |
|---|---|---|---|
| length | `number` | `4` | Number of cells. |
| mask | `boolean` | `false` | Render entered characters as bullets. |
| integerOnly | `boolean` | `false` | Block non-digit keystrokes. |
| readonly | `boolean` | `false` | Read-only state. |
| variant | `'outlined' \| 'filled'` | — | PrimeVue variant (overridden by DS styling). |
| tabindex | `number` | — | Tab order for the cell inputs. |
| pt | `object` | — | Advanced PrimeVue pass-through styling hooks. |

See the full PrimeVue InputOtp reference at https://primevue.org/inputotp.

## Variants

DsCodeInput has no explicit variant prop — visual state is driven by component props and user interaction:

- **Default** — Empty cells, gray background, gray border.
- **Hover** — Empty cell under the pointer — darker gray background + border.
- **Focused** — Empty cell with keyboard focus — white background, purple border, purple glow.
- **Input** — Cell with a typed value — white background, purple border, purple digit color.
- **Error** — Triggered by `error` prop — red background, red border on all cells. Suppressed when `disabled` is also true.
- **Disabled** — Triggered by `disabled` prop — muted gray, no pointer events.

## Length

The default Figma canonical length is 4. Pass any positive integer via `length` for longer codes (e.g., `:length="6"`).

## Slots

None. All cell DOM is owned by PrimeVue `InputOtp`.

## Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `string` | Emitted when any cell changes (used automatically by `v-model`). |

## Usage Examples

```vue
<!-- Basic verification code input (length 4) -->
<DsCodeInput v-model="code" label="Verification code" />
```

```vue
<!-- With hint -->
<DsCodeInput
  v-model="code"
  label="Verification code"
  hint="Check your email for a 4-digit code"
/>
```

```vue
<!-- Error state -->
<DsCodeInput
  v-model="code"
  label="Verification code"
  error="Invalid code"
/>
```

```vue
<!-- Custom length, digits only -->
<DsCodeInput v-model="code" :length="6" integer-only />
```

```vue
<!-- Masked 4-digit PIN -->
<DsCodeInput v-model="pin" :length="4" mask integer-only label="PIN" />
```

## Accessibility

- Outer container has `role="group"` — the cells are grouped semantically for assistive technology.
- `aria-labelledby` points at the label span when a `label` prop is provided. The component does NOT use `<label for="…">` because PrimeVue renders multiple `<input>` elements — a single `for` target would be incorrect.
- When `error` is present (and `disabled` is false), the group has `aria-describedby` pointing at the error message and `aria-invalid="true"`, AND the same `aria-describedby` + `aria-invalid` are routed onto each cell input via PrimeVue's `pt.pcInputText.root` pass-through. The per-cell ARIA is required because `aria-describedby` does NOT inherit from a `role="group"` ancestor to its descendant inputs — without it, screen readers would not announce the error when focus is inside the group.
- Whitespace-only `label` and `error` strings are treated as absent — they do not emit `aria-labelledby` / `aria-invalid` or render the respective DOM.
- Keyboard navigation is handled by PrimeVue `InputOtp`:
  - Tab / Shift+Tab move focus between cells (each cell is a tab stop).
  - Arrow Left / Right navigate without modifying values.
  - Backspace clears a filled cell in place, or moves to the previous cell and clears it when the current cell is empty.
  - Typing auto-advances to the next cell.
  - Paste (Cmd/Ctrl+V) populates all cells from the pasted string. When `integer-only` is enabled, PrimeVue rejects paste content containing non-numeric characters.

### `$attrs` target — PrimeVue wrapper vs cell inputs

`v-bind="$attrs"` forwards consumer-passed attributes to the **PrimeVue `InputOtp` root (a `<div>` wrapper)**, not to the individual cell `<input>` elements. This means:

- Top-level attrs like `class`, `data-*`, and `id` land on the wrapper.
- Per-input attrs (most importantly `autocomplete="one-time-code"` for OTP autofill) must be routed through the `pt` pass-through, e.g. `:pt="{ pcInputText: { root: { autocomplete: 'one-time-code' } } }"`. Consumer-supplied `pt` is **deep-merged** with the wrapper's internal injections (placeholder + error ARIA), so this coexists safely.

## Figma Reference

| Figma Layer | Component Usage |
|---|---|
| `Code input` | `<DsCodeInput v-model="code" />` |
| `Code input / Default` | `<DsCodeInput v-model="code" />` (all cells empty) |
| `Code input / Hover` | `<DsCodeInput v-model="code" />` (hover is CSS-driven — no prop) |
| `Code input / Focused` | `<DsCodeInput v-model="code" autofocus />` (consumer-controlled focus) |
| `Code input / Input` | `<DsCodeInput :model-value="'5234'" />` |
| `Code input / Error` | `<DsCodeInput v-model="code" error="Invalid code" />` |
