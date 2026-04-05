# Component Addition Guide

This guide documents the repeatable patterns for adding new components to `@failwin/desing-system-vue`. Follow the steps in order — each component must go through the full checklist regardless of type.

## Component Types

| Type | When to Use | Example |
|---|---|---|
| **PrimeVue Wrapper** | A suitable PrimeVue component exists | DsButton, DsInputText, DsLink |
| **Custom Tailwind** | No PrimeVue equivalent, or PrimeVue component doesn't fit | (future components) |

Both types follow the same directory structure, naming, and export patterns. They differ in the `.vue` implementation file.

---

## Step-by-Step Checklist

### 1. Create the Component Directory

Every component lives in its own directory under `src/components/`:

```
src/components/DsX/
  DsX.vue          # Component implementation
  DsX.stories.ts   # Storybook stories
  DsX.test.ts      # Vitest tests
  index.ts          # Re-export for clean imports
```

**Naming rules:**
- Directory: PascalCase, prefixed with `Ds` — e.g. `DsButton/`
- Vue file: PascalCase — `DsButton.vue`
- Story file: PascalCase — `DsButton.stories.ts`
- Test file: PascalCase — `DsButton.test.ts`

### 2. Implement the Component

Choose the pattern that matches your component type:

#### 2a. PrimeVue Wrapper Pattern

Wraps a PrimeVue component while exposing a design-system-specific API.

```vue
<script setup lang="ts">
import PrimeComponent from 'primevue/component';
import { computed } from 'vue';

export interface DsXProps {
  /** Visual variant. Default: 'primary' */
  severity?: 'primary' | 'outlined' | 'negative';
  /** Size. Default: 'medium' */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /** Disabled state. Default: false */
  disabled?: boolean;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DsXProps>(), {
  severity: 'primary',
  size: 'medium',
  disabled: false,
});

// Map DS severity → PrimeVue severity prop
const mappedSeverity = computed(() => {
  const map: Record<string, string | undefined> = {
    primary: undefined,
    outlined: undefined,
    negative: 'danger',
  };
  return map[props.severity];
});

// Map DS severity → PrimeVue variant prop (some components need both)
const mappedVariant = computed(() => {
  const map: Record<string, string | undefined> = {
    primary: undefined,
    outlined: 'outlined',
    negative: undefined,
  };
  return map[props.severity];
});

// Map DS size → PrimeVue size prop
const mappedSize = computed(() => {
  const map: Record<string, string | undefined> = {
    xsmall: 'small',
    small: 'small',
    medium: undefined,
    large: 'large',
  };
  return map[props.size];
});

// Optional: design token overrides per size for exact Figma dimensions.
// Use the `dt` prop on PrimeVue components to override token values per-instance.
// See DsButton.vue for a full example with fontSize, paddingX, paddingY.
const sizeTokens = computed(() => {
  const map: Record<string, Record<string, string>> = {
    xsmall: { fontSize: '0.75rem', paddingX: '0.5rem', paddingY: '0.25rem' },
    small:  { fontSize: '0.875rem', paddingX: '0.75rem', paddingY: '0.375rem' },
    medium: { fontSize: '0.875rem', paddingX: '1rem', paddingY: '0.5rem' },
    large:  { fontSize: '0.875rem', paddingX: '2rem', paddingY: '0.625rem' },
  };
  return map[props.size];
});
</script>

<template>
  <PrimeComponent
    v-bind="$attrs"
    :severity="mappedSeverity"
    :variant="mappedVariant"
    :size="mappedSize"
    :dt="sizeTokens"
    :disabled="disabled"
    :aria-disabled="disabled ? 'true' : undefined"
  >
    <slot />
  </PrimeComponent>
</template>
```

**Key rules:**
- `defineOptions({ inheritAttrs: false })` — prevents duplicate attribute binding
- `v-bind="$attrs"` on the PrimeVue component — passes through all unrecognized attrs
- TypeScript interface exported from `<script setup>` with JSDoc comments on every prop
- `withDefaults(defineProps<DsXProps>(), { ... })` — generic syntax, never runtime array syntax
- Computed mappers translate DS prop values to PrimeVue prop values — some PrimeVue components need **both** `severity` and `variant` mapped separately (see DsButton for a full example)
- Use `:dt="tokens"` to override PrimeVue design token values per size tier for exact Figma dimensions
- Use `<style scoped>` only for component-specific CSS (loading overlays, transitions) — never to override PrimeVue design token custom properties. Use `:deep()` selectors within scoped styles when targeting PrimeVue internal classes (e.g., `.p-button-label`)
- Never hardcode color hex values — always use design tokens from the preset

#### 2b. Custom Tailwind Component Pattern

For interactive components without a PrimeVue equivalent:

```vue
<script setup lang="ts">
export interface DsXProps {
  /** Visual variant. Default: 'primary' */
  severity?: 'primary' | 'outlined' | 'negative';
  /** Structural variant (e.g., 'ghost', 'link'). Optional — use when severity alone is not enough. */
  variant?: string;
  /** Size. Default: 'medium' */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /** Disabled state. Default: false */
  disabled?: boolean;
  /** Loading state. Default: false */
  loading?: boolean;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DsXProps>(), {
  severity: 'primary',
  size: 'medium',
  disabled: false,
  loading: false,
});

const emit = defineEmits<{ activate: [] }>();

function handleActivate() {
  if (!props.disabled && !props.loading) {
    emit('activate');
  }
}
</script>

<template>
  <!-- Use semantic HTML: <button>, <a>, <input> — NOT divs with click handlers -->
  <button
    v-bind="$attrs"
    type="button"
    :disabled="disabled"
    :aria-disabled="disabled ? 'true' : undefined"
    :aria-busy="loading ? 'true' : undefined"
    class="
      focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500
      motion-safe:transition-colors motion-safe:duration-150
    "
    @keydown.enter.prevent="handleActivate"
    @keydown.space.prevent="handleActivate"
  >
    <slot />
  </button>
</template>
```

**Key rules for interactive custom components:**
- Use semantic HTML elements (`<button>`, `<a>`, `<input>`) — never `<div>` with click handlers
- Follow PrimeVue prop naming conventions: `severity`, `size`, `disabled`, `loading`, `variant`
- Include ARIA attributes (`aria-disabled`, `aria-busy`, `aria-live`, `role` as needed)
- Implement keyboard handlers (Enter/Space for buttons, Escape for dismissible elements)
- Use `focus-visible:` for focus ring styling (not `:focus`)
- Use `motion-safe:` prefix for all transitions and animations
- The consumer API should feel indistinguishable from PrimeVue wrappers

**For presentational (non-interactive) custom components** (like DsIcon): keyboard handlers and interactive ARIA are not needed, but the file structure, naming, prop patterns, and exports must still follow this guide.

### 3. Add TypeScript Prop Types

Props are defined as an exported TypeScript interface in the `<script setup>` block:

```ts
export interface DsXProps {
  /** JSDoc description for every prop. Default: 'value' */
  propName?: 'option-a' | 'option-b';
}
```

- Use union types for constrained values (not `string`)
- Document defaults in JSDoc comments
- Use `withDefaults(defineProps<DsXProps>(), { ... })` — never runtime array/object syntax

### 4. Verify Light + Dark Theme Rendering

- Run Storybook (`npm run storybook`)
- Toggle between light and dark themes
- Confirm all variants render correctly in both themes
- Verify no hardcoded colors — all colors must come from design tokens

### 5. Write Storybook Stories

Create `DsX.stories.ts` with required story variants:

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DsX from './DsX.vue';

const meta = {
  title: 'Components/DsX',
  component: DsX,
  tags: ['autodocs'],
  argTypes: {
    severity: {
      control: 'select',
      options: ['primary', 'outlined', 'negative'],
    },
    size: {
      control: 'select',
      options: ['xsmall', 'small', 'medium', 'large'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    severity: 'primary',
    size: 'medium',
    disabled: false,
  },
} satisfies Meta<typeof DsX>;

export default meta;
type Story = StoryObj<typeof meta>;

// Required stories:
export const Default: Story = {
  render: (args) => ({
    components: { DsX },
    setup() {
      return { args };
    },
    template: '<DsX v-bind="args">Content</DsX>',
  }),
};

// One story per severity/variant value
export const Primary: Story = {
  args: { severity: 'primary' },
  render: (args) => ({
    components: { DsX },
    setup() { return { args }; },
    template: '<DsX v-bind="args">Primary</DsX>',
  }),
};

// Gallery stories showing all options at once
export const AllSizes: Story = {
  render: () => ({
    components: { DsX },
    template: `
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <DsX size="xsmall">XSmall</DsX>
        <DsX size="small">Small</DsX>
        <DsX size="medium">Medium</DsX>
        <DsX size="large">Large</DsX>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    components: { DsX },
    template: `
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <DsX severity="primary">Primary</DsX>
        <DsX severity="outlined">Outlined</DsX>
        <DsX severity="negative">Negative</DsX>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => ({
    components: { DsX },
    setup() { return { args }; },
    template: '<DsX v-bind="args">Disabled</DsX>',
  }),
};

// Add Loading story if the component supports it
```

**Required stories:** Default, one per variant/severity, AllSizes, AllVariants, Disabled, and any component-specific states (Loading, etc.).

### 6. Write Vitest Tests

Create `DsX.test.ts` covering:

```ts
import { mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import { describe, expect, it, vi } from 'vitest';
import DsX from './DsX.vue';

const globalConfig = {
  plugins: [[PrimeVue, { theme: 'none' }]],
};

describe('DsX', () => {
  // 1. Rendering with default props
  it('renders with default props', () => {
    const wrapper = mount(DsX, { global: globalConfig });
    expect(wrapper.exists()).toBe(true);
  });

  // 2. Prop variations — each severity/variant value
  describe('severity variants', () => {
    it.each([
      ['primary', /* expected PrimeVue mapping */],
      ['outlined', /* ... */],
    ])('renders %s variant correctly', (severity) => {
      const wrapper = mount(DsX, {
        props: { severity },
        global: globalConfig,
      });
      // Assert PrimeVue prop mapping or class presence
    });
  });

  // 3. Accessibility attributes
  describe('accessibility', () => {
    it('sets aria-disabled when disabled', () => {
      const wrapper = mount(DsX, {
        props: { disabled: true },
        global: globalConfig,
      });
      expect(wrapper.attributes('aria-disabled')).toBe('true');
    });
  });

  // 4. Slot rendering
  describe('slots', () => {
    it('renders default slot content', () => {
      const wrapper = mount(DsX, {
        slots: { default: 'Content' },
        global: globalConfig,
      });
      expect(wrapper.text()).toContain('Content');
    });
  });

  // 5. $attrs passthrough
  describe('$attrs passthrough', () => {
    it('passes data-testid through', () => {
      const wrapper = mount(DsX, {
        attrs: { 'data-testid': 'my-component' },
        global: globalConfig,
      });
      expect(wrapper.find('[data-testid="my-component"]').exists()).toBe(true);
    });
  });
});
```

**Required test coverage:**
- Rendering with default props
- Every prop variation (severity, size, etc.)
- Accessibility attributes (aria-disabled, aria-busy, aria-live)
- Slot rendering (default slot, named slots)
- `$attrs` passthrough (data-testid, id, etc.)
- Event passthrough for interactive components

### 7. Add AI Knowledge Base Entry

Create `docs/ai-guidelines/ds-x.md` (kebab-case filename):

```markdown
# DsX

## When to Use

Describe when an AI agent should choose this component.

## Import

\```ts
import { DsX } from '@failwin/desing-system-vue';
\```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| severity | `'primary' \| 'outlined' \| 'negative'` | `'primary'` | Visual variant |
| size | `'xsmall' \| 'small' \| 'medium' \| 'large'` | `'medium'` | Component size |
| disabled | `boolean` | `false` | Disabled state |

## Variants

- **primary** — Description and when to use.
- **outlined** — Description and when to use.

## Sizes

- **xsmall** — 24px height. Compact contexts.
- **small** — 32px height. Dense UIs.
- **medium** — 36px height. Default.
- **large** — 40px height. Prominent contexts.

## Slots

- **default** — Main content.

## Usage Examples

\```vue
<DsX>Default usage</DsX>
\```

\```vue
<DsX severity="outlined" size="small">Small outlined</DsX>
\```

## Accessibility

- Document all ARIA attributes set by the component.
- Document keyboard interaction patterns.

## Figma Reference

| Figma Layer | Component Prop |
|---|---|
| Component/Primary | `severity="primary"` (default) |
```

**Required sections:** When to Use, Import, Props table, Variants, Sizes, Slots, Usage Examples, Accessibility, Figma Reference.

### 8. Export from Barrel Files

**Component barrel** (`src/components/DsX/index.ts`):

```ts
export type { DsXProps } from './DsX.vue';
export { default as DsX } from './DsX.vue';
```

**Root barrel** (`src/index.ts`) — add a new line:

```ts
export { DsX, type DsXProps } from './components/DsX';
```

---

## Quick Reference Checklist

Use this checklist when adding any new component:

- [ ] Create `src/components/DsX/` directory with all 4 files
- [ ] Implement `.vue` file (PrimeVue wrapper or custom Tailwind)
- [ ] Export TypeScript prop interface from `<script setup>`
- [ ] `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"`
- [ ] Verify light + dark theme rendering in Storybook
- [ ] Write Storybook stories (Default, all variants, all sizes, disabled, component-specific states)
- [ ] Write Vitest tests (rendering, props, accessibility, slots, attrs passthrough)
- [ ] Create AI Knowledge Base entry at `docs/ai-guidelines/ds-x.md`
- [ ] Add component barrel export in `src/components/DsX/index.ts`
- [ ] Add root barrel export in `src/index.ts`
- [ ] Run `npm run build` — build must succeed
- [ ] Run `npm test` — all tests must pass
- [ ] Run `npx biome check ./src ./.storybook` — no lint errors

## Anti-Patterns to Avoid

- **No external composables** — components are self-contained
- **No state management** (Pinia, Vuex, etc.) — components are stateless
- **No global CSS** — use scoped styles or Tailwind utilities
- **No scoped styles overriding PrimeVue design tokens** — `<style scoped>` is fine for component-specific CSS (loading overlays, transitions), but never use it to fight PrimeVue's token system
- **No hardcoded hex colors** — always use design tokens from the preset
- **No runtime prop validation** — use TypeScript types with `defineProps<T>()`
- **No cross-component imports** (exception: composing components like DsIconButton using DsIcon)
- **No `<ds-x>` kebab-case in templates** — always use PascalCase: `<DsX>`
