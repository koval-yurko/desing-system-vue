# DsSelect

## When to Use

Use DsSelect for single-selection dropdowns — form fields where the user picks one option from a predefined list. Supports labels, validation errors, hints, leading icons, clear button, and core dropdown menu styles (one-line, two-line, no-match).

## Import

```ts
import { DsSelect } from '@failwin/desing-system-vue';
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| size | `'small' \| 'medium'` | `'medium'` | Select trigger size |
| disabled | `boolean` | `false` | Disabled state. Overrides error state. |
| label | `string` | — | Label text above the select |
| mandatory | `boolean` | `false` | Show mandatory asterisk (*) after label. Mutually exclusive with `optional` — if both are true, neither renders. |
| optional | `boolean` | `false` | Show "(Optional)" text after label. Mutually exclusive with `mandatory` — if both are true, neither renders. |
| info | `boolean` | `false` | Show help icon next to label |
| hint | `string` | — | Hint/helper text below the select |
| error | `string` | — | Error message (triggers error visual state and aria-invalid) |
| modelValue | `unknown \| unknown[]` | — | v-model binding for selected value. Pass an array when using `:multiple="true"`. Clear resets to `[]` for multi-select, `undefined` for single-select. |

PrimeVue Select props are passed through via `$attrs`. When `:multiple="true"` is set, DsSelect renders PrimeVue MultiSelect internally:

| Prop | Type | Description |
|---|---|---|
| options | `any[]` | Array of items to display |
| optionLabel | `string` | Property name for option display text |
| optionValue | `string` | Property name for option value |
| placeholder | `string` | Placeholder text when no value selected |
| filter | `boolean` | Enable search filtering in dropdown |
| filterPlaceholder | `string` | Placeholder for the filter input |
| emptyMessage | `string` | Text shown when options array is empty |
| appendTo | `string` | Where to append the dropdown overlay |
| panelClass | `string` | CSS class for the dropdown panel |

## Variants

DsSelect visual states are driven by props and user interaction:

- **Default** — Standard trigger with gray border and shadow.
- **Hover** — Gray-100 background, gray-600 border, no shadow.
- **Focus/Open** — White background, gray-400 border, shadow retained. Chevron rotates up.
- **Filled** — Has selected value. No shadow. Clear button visible.
- **Filled-Hover** — Filled + hover styling.
- **Error** — Red border with error message below. Triggered by `error` prop. Suppressed when `disabled` is also true.
- **Disabled** — Gray-100 background, no interaction. Triggered by `disabled` prop. Overrides error state.

## Sizes

- **small** — 32px height. Dense forms and compact layouts. Icons: 16px leading, 20px chevron, 20px clear.
- **medium** — 40px height. Default for standard forms. Icons: 20px leading, 24px chevron, 24px clear.

## Slots

| Slot | Description |
|---|---|
| `leading` | Left-side icon slot inside the trigger row |

PrimeVue Select slots are passed through:

| Slot | Description |
|---|---|
| `option` | Custom option template (receives `{ option }`) |
| `value` | Custom selected value display |
| `empty` | Content when options array is empty |
| `emptyfilter` | Content when filter yields no results |
| `header` | Header content above options list |
| `footer` | Footer content below options list |

## Events

| Event | Payload | Description |
|---|---|---|
| `clear` | — | Emitted when the clear button is clicked |
| `update:modelValue` | `unknown` | Emitted on selection change (used automatically by `v-model`) |

PrimeVue Select events are passed through:

| Event | Description |
|---|---|
| `change` | Emitted when selection changes |
| `show` | Emitted when dropdown opens |
| `hide` | Emitted when dropdown closes |
| `filter` | Emitted when filter input changes |

## Usage Examples

```vue
<!-- Basic select with label -->
<DsSelect v-model="fruit" label="Fruit" :options="['Apple', 'Banana', 'Cherry']" placeholder="Select a fruit" />
```

```vue
<!-- Select with object options -->
<DsSelect
  v-model="country"
  label="Country"
  :options="countries"
  option-label="name"
  option-value="code"
  placeholder="Select a country"
/>
```

```vue
<!-- Select with leading icon -->
<DsSelect v-model="value" label="Search" :options="items" placeholder="Select...">
  <template #leading>
    <DsIcon name="search" size="medium" />
  </template>
</DsSelect>
```

```vue
<!-- Two-line options -->
<DsSelect v-model="person" label="Assignee" :options="people" option-label="name" placeholder="Select a person">
  <template #option="{ option }">
    <div style="display: flex; flex-direction: column; gap: 2px;">
      <span style="font-weight: 500;">{{ option.name }}</span>
      <span style="font-size: 12px; color: var(--p-gray-600);">{{ option.role }}</span>
    </div>
  </template>
</DsSelect>
```

```vue
<!-- Filterable select -->
<DsSelect v-model="value" label="Country" :options="countries" option-label="name" filter placeholder="Search..." />
```

```vue
<!-- Select with error -->
<DsSelect v-model="value" label="Country" :options="countries" error="Please select a country" />
```

```vue
<!-- Disabled select -->
<DsSelect v-model="value" label="Country" :options="countries" disabled />
```

## Advanced Dropdown Variants

DsSelect supports advanced dropdown layouts via PrimeVue's slot system and CSS classes provided by the library. All variants use the same `<DsSelect>` component — no new props needed.

### Multi-Selection

Pass `:multiple="true"` to render a multi-select dropdown backed by PrimeVue MultiSelect. The `modelValue` becomes an array. The clear button resets to `[]`.

```vue
<DsSelect v-model="selected" label="Tags" :options="tags" option-label="name" option-value="id" :multiple="true" placeholder="Select tags">
  <template #header>
    <div class="ds-select-header-select-all" @click="toggleAll">
      <input type="checkbox" class="ds-select-header-select-all__checkbox" :checked="allSelected" />
      <span class="ds-select-header-select-all__label">Select all tags</span>
      <span class="ds-select-header-select-all__counter">{{ selected.length }} out of {{ tags.length }}</span>
    </div>
  </template>
</DsSelect>
```

### Entity Icons (with checkboxes)

Multi-select with icons. Use the `option` slot with `.ds-select-option-entity` CSS class. Override `pt` to add `ds-select-panel--entity` for tighter 4px gap between checkbox, icon, and label.

```vue
<DsSelect v-model="value" :options="items" option-label="name" :multiple="true" placeholder="Select..."
  :pt="{ overlay: { class: 'ds-select-panel ds-select-panel--multi ds-select-panel--entity' } }">
  <template #option="{ option }">
    <div class="ds-select-option-entity">
      <DsIcon :name="option.icon" size="small" class="ds-select-option-entity__icon" />
      <span>{{ option.name }}</span>
    </div>
  </template>
</DsSelect>
```

### Badge / Dot Indicator

Single-select with colored dots. No checkboxes. Use `.ds-select-option-badge` in the `option` slot and `panel-class="ds-select-panel--badge"`.

```vue
<DsSelect v-model="status" :options="statuses" option-label="name" placeholder="Select status" panel-class="ds-select-panel--badge">
  <template #option="{ option }">
    <div class="ds-select-option-badge">
      <span class="ds-select-option-badge__dot" :style="{ backgroundColor: option.color }"></span>
      <span class="ds-select-option-badge__label">{{ option.name }}</span>
    </div>
  </template>
</DsSelect>
```

### Two-Line Multi-Selection

Multi-select with name + subtitle. Use `.ds-select-option-two-line-multi` in the `option` slot. Set panel-class to include `ds-select-panel--two-line-multi` for dividers.

```vue
<DsSelect v-model="people" :options="users" option-label="name" :multiple="true" placeholder="Select..."
  :pt="{ overlay: { class: 'ds-select-panel ds-select-panel--multi ds-select-panel--two-line-multi' } }">
  <template #option="{ option }">
    <div class="ds-select-option-two-line-multi">
      <span class="ds-select-option-two-line-multi__title">{{ option.name }}</span>
      <span class="ds-select-option-two-line-multi__subtitle">{{ option.email }}</span>
    </div>
  </template>
</DsSelect>
```

### Vendor Layout

Single-select with avatar + two-line text. No checkboxes. Use `.ds-select-option-vendor` and `panel-class="ds-select-panel--vendor"`.

```vue
<DsSelect v-model="vendor" :options="vendors" option-label="name" placeholder="Select vendor" panel-class="ds-select-panel--vendor">
  <template #option="{ option }">
    <div class="ds-select-option-vendor">
      <span class="ds-select-option-vendor__avatar" :style="{ backgroundColor: option.color }">{{ option.initials }}</span>
      <div class="ds-select-option-vendor__text">
        <span class="ds-select-option-vendor__name">{{ option.name }}</span>
        <span class="ds-select-option-vendor__email">{{ option.email }}</span>
      </div>
    </div>
  </template>
</DsSelect>
```

### Mention Layout

Single-select with grouped sections, icons, and "more results" row. Use `.ds-select-option-mention` and `panel-class="ds-select-panel--mention"` (wider 409px panel).

Items include section headers (`group: '_header'`), regular items, and a "more results" row (`group: '_more'`):

```vue
<DsSelect v-model="mention" :options="items" option-label="name" placeholder="Search..." panel-class="ds-select-panel--mention" filter>
  <template #option="{ option }">
    <template v-if="option.group === '_header'">
      <div class="ds-select-option-mention__section-header">{{ option.name }}</div>
    </template>
    <template v-else-if="option.group === '_more'">
      <div class="ds-select-option-mention__more">
        <span class="ds-select-option-mention__more-icon">
          <DsIcon name="overflow" size="small" />
        </span>
        <span>{{ option.name }}</span>
      </div>
    </template>
    <template v-else>
      <div class="ds-select-option-mention">
        <DsIcon :name="option.icon" size="small" class="ds-select-option-mention__icon" />
        <div class="ds-select-option-mention__text">
          <span class="ds-select-option-mention__name">{{ option.name }}</span>
          <span class="ds-select-option-mention__subtitle">{{ option.subtitle }}</span>
        </div>
      </div>
    </template>
  </template>
</DsSelect>
```

### Big Icon Layout

Single-select with 24px icon container + label. Use `.ds-select-option-big-icon` and `panel-class="ds-select-panel--big-icon"`.

```vue
<DsSelect v-model="category" :options="categories" option-label="name" placeholder="Select category" panel-class="ds-select-panel--big-icon">
  <template #option="{ option }">
    <div class="ds-select-option-big-icon">
      <span class="ds-select-option-big-icon__container">
        <DsIcon :name="option.icon" size="small" />
      </span>
      <span class="ds-select-option-big-icon__label">{{ option.name }}</span>
    </div>
  </template>
</DsSelect>
```

### Sample Data Structures

```ts
// Multi-selection
const departments = [
  { name: 'Marketing', value: 'marketing' },
  { name: 'Sales', value: 'sales' },
];

// Entity icons
const integrations = [
  { name: 'Slack', icon: 'chat-ai' },
  { name: 'Calendar', icon: 'calendar' },
];

// Badge / Dot indicator
const statuses = [
  { name: 'Active', color: '#17B26A' },
  { name: 'Pending', color: '#F79009' },
];

// Vendor
const vendors = [
  { name: 'Alice Johnson', email: 'alice@acme.co', initials: 'AJ', color: '#6172F3' },
];

// Big icon
const categories = [
  { name: 'Business', icon: 'business' },
  { name: 'Security', icon: 'security' },
];
```

## Accessibility

- `aria-invalid="true"` is set when `error` is present and select is not disabled.
- `aria-describedby` links to the error message element for screen reader announcement.
- `aria-disabled="true"` is set when `disabled` is true.
- Clear button has `aria-label="Clear"` and supports keyboard interaction (Enter and Space).
- Label is connected to select trigger via `for`/`id` attributes.
- PrimeVue Select provides built-in keyboard navigation (arrow keys, Enter/Space, Escape, type-ahead).

## Figma Reference

| Figma Layer | Component Usage |
|---|---|
| Dropdown / Select | `<DsSelect />` |
| Dropdown input | `<DsSelect />` (trigger) |
| Dropdown menu | `<DsSelect />` (panel/overlay) |
