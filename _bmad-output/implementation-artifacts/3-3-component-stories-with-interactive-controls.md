# Story 3.3: Component Stories with Interactive Controls

Status: review

## Story

As a developer,
I want interactive Storybook stories for every MVP component covering all variants and states,
so that I can explore component behavior, manipulate props, and copy usage patterns.

## Acceptance Criteria

1. **Given** each MVP component (DsButton, DsIconButton, DsIcon, DsInputText, DsLink) has a `.stories.ts` file, **When** a developer browses component stories, **Then** every variant, size, and state is represented as a story or story arg (FR20).

2. **Given** Storybook controls are configured for each component, **When** a developer opens the Controls panel, **Then** all props are manipulable via controls (severity, size, disabled, loading, etc.) (FR21) **And** control types match prop types (dropdowns for enums, toggles for booleans).

3. **Given** stories demonstrate both light and dark mode, **When** a developer switches theme in Storybook toolbar, **Then** all component stories render correctly in the selected theme.

4. **Given** stories demonstrate responsive behavior, **When** a developer views stories at Mobile (320px), Tablet (768px), and Desktop (1024px+) viewports, **Then** no components overflow or break at narrow widths.

5. **Given** story source code is viewable, **When** a developer wants to copy usage patterns, **Then** the story source code tab shows the component import and usage (FR23).

6. **Given** all stories load without errors, **When** Storybook renders any story, **Then** no console errors or rendering failures occur (NFR13).

## Tasks / Subtasks

- [x] Task 1: Create `DsButton.stories.ts` (AC: #1, #2, #3)
  - [x] 1.1 Create `src/components/DsButton/DsButton.stories.ts`
  - [x] 1.2 Import from `@storybook/vue3-vite` (NOT `@storybook/vue3`), set `title: 'Components/DsButton'`, `component: DsButton`, `tags: ['autodocs']`
  - [x] 1.3 Define `argTypes` for all props:
    - `severity`: control `select`, options `['primary', 'outlined', 'tertiary', 'text', 'text-link', 'negative']`
    - `size`: control `select`, options `['xsmall', 'small', 'medium', 'large']`
    - `disabled`: control `boolean`
    - `loading`: control `boolean`
  - [x] 1.4 Set `args` defaults: `severity: 'primary'`, `size: 'medium'`, `disabled: false`, `loading: false`
  - [x] 1.5 Create `Default` story with slot text `'Button'`, using render function that spreads args via `v-bind`
  - [x] 1.6 Create variant stories: `Primary`, `Outlined`, `Tertiary`, `Text`, `TextLink`, `Negative` — each sets its `severity` arg
  - [x] 1.7 Create `Disabled` story (`disabled: true`)
  - [x] 1.8 Create `Loading` story (`loading: true`)
  - [x] 1.9 Create `AllSizes` story rendering all 4 sizes side by side (xsmall, small, medium, large) with severity=primary
  - [x] 1.10 Create `AllVariants` story rendering all 6 variants in a row with default size
  - [x] 1.11 Create `WithLeftIcon` story: DsButton with a `<DsIcon name="arrow-left" />` in the icon slot and text label
  - [x] 1.12 Create `WithRightIcon` story: DsButton with a `<DsIcon name="arrow-right" />` in the icon slot with iconPos="right" and text label

- [x] Task 2: Create `DsIcon.stories.ts` (AC: #1, #2, #3)
  - [x] 2.1 Create `src/components/DsIcon/DsIcon.stories.ts`
  - [x] 2.2 Import from `@storybook/vue3-vite`, set `title: 'Components/DsIcon'`, `component: DsIcon`, `tags: ['autodocs']`
  - [x] 2.3 Define `argTypes`:
    - `name`: control `select`, options — a representative subset of icon names (e.g., `['edit', 'bin', 'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down', 'calendar', 'call', 'chart-line', 'building', 'agent', 'brain']`)
    - `size`: control `select`, options `['xsmall', 'small', 'medium', 'large']`
    - `ariaLabel`: control `text`
  - [x] 2.4 Set `args` defaults: `name: 'edit'`, `size: 'medium'`
  - [x] 2.5 Create `Default` story
  - [x] 2.6 Create `AllSizes` story rendering all 4 sizes (xsmall=12px, small=16px, medium=20px, large=24px) side by side with labels
  - [x] 2.7 Create `WithAriaLabel` story demonstrating accessible icon (`ariaLabel: 'Edit item'`)
  - [x] 2.8 Create `ColorInheritance` story showing icon inside differently colored containers to demonstrate `currentColor` behavior (e.g., purple, red, blue text containers)

- [x] Task 3: Update `DsIconButton.stories.ts` (AC: #1, #2, #3)
  - [x] 3.1 Open existing `src/components/DsIconButton/DsIconButton.stories.ts`
  - [x] 3.2 Fix import: change `@storybook/vue3` to `@storybook/vue3-vite`
  - [x] 3.3 Verify `title: 'Components/DsIconButton'`, `component: DsIconButton`, `tags: ['autodocs']` present
  - [x] 3.4 Verify `argTypes` cover all props: `type` (select: primary/outlined/text), `size` (select: xsmall/small/medium), `disabled` (boolean), `loading` (boolean), `ariaLabel` (text)
  - [x] 3.5 Verify existing stories cover: Primary, Outlined, Text, Disabled, Loading, AllSizes
  - [x] 3.6 Add `AllTypes` story rendering all 3 types in a row

- [x] Task 4: Rewrite `DsInputText.stories.ts` (AC: #1, #2, #3)
  - [x] 4.1 Open existing `src/components/DsInputText/DsInputText.stories.ts` — currently minimal, needs full rewrite
  - [x] 4.2 Fix import: change `@storybook/vue3` to `@storybook/vue3-vite`
  - [x] 4.3 Define `argTypes` for all props:
    - `size`: control `select`, options `['small', 'medium']`
    - `disabled`: control `boolean`
    - `label`: control `text`
    - `mandatory`: control `boolean`
    - `optional`: control `boolean`
    - `info`: control `boolean`
    - `hint`: control `text`
    - `error`: control `text`
    - `clearable`: control `boolean`
    - `showDropdownIcon`: control `boolean`
    - `modelValue`: control `text`
  - [x] 4.4 Set `args` defaults: `size: 'medium'`, `label: 'Label'`, `disabled: false`, `mandatory: false`, `optional: false`, `info: false`, `clearable: false`, `showDropdownIcon: false`
  - [x] 4.5 Create `Default` story with render function that binds v-model to a reactive ref
  - [x] 4.6 Create `WithLabel` story: `label: 'Email address'`
  - [x] 4.7 Create `Mandatory` story: `label: 'Full name'`, `mandatory: true`
  - [x] 4.8 Create `Optional` story: `label: 'Nickname'`, `optional: true`
  - [x] 4.9 Create `WithHint` story: `label: 'Password'`, `hint: 'Must be at least 8 characters'`
  - [x] 4.10 Create `WithError` story: `label: 'Email'`, `error: 'Invalid email address'`, pre-filled modelValue
  - [x] 4.11 Create `Disabled` story: `label: 'Name'`, `disabled: true`, pre-filled modelValue
  - [x] 4.12 Create `Clearable` story: `label: 'Search'`, `clearable: true`, pre-filled modelValue
  - [x] 4.13 Create `WithDropdownIcon` story: `label: 'Country'`, `showDropdownIcon: true`
  - [x] 4.14 Create `AllSizes` story showing small and medium side by side
  - [x] 4.15 Create `AllStates` story rendering Default, Filled, Error, and Disabled in a vertical stack with labels

- [x] Task 5: Rewrite `DsLink.stories.ts` (AC: #1, #2, #3)
  - [x] 5.1 Open existing `src/components/DsLink/DsLink.stories.ts` — currently has only Regular story
  - [x] 5.2 Fix import: change `@storybook/vue3` to `@storybook/vue3-vite`
  - [x] 5.3 Verify `argTypes` cover: `type` (select: regular/smart/quiet), `size` (select: small/medium), `visibility` (select: high/low), `disabled` (boolean), `href` (text)
  - [x] 5.4 Verify `args` defaults match existing: `type: 'regular'`, `size: 'medium'`, `visibility: 'high'`, `disabled: false`, `href: '#'`
  - [x] 5.5 Add render function to `Regular` story if not already present (it already has one)
  - [x] 5.6 Create `Smart` story: `type: 'smart'`
  - [x] 5.7 Create `Quiet` story: `type: 'quiet'`
  - [x] 5.8 Create `LowVisibility` story: `type: 'regular'`, `visibility: 'low'`
  - [x] 5.9 Create `Disabled` story: `disabled: true`
  - [x] 5.10 Create `AllTypes` story rendering all 3 types in a row
  - [x] 5.11 Create `AllSizes` story rendering small and medium side by side
  - [x] 5.12 Create `WithIcons` story demonstrating left-icon and right-icon slots using DsIcon

- [x] Task 6: Verify all stories render in Storybook (AC: #3, #4, #5, #6)
  - [x] 6.1 Run `npx storybook build` and verify all component stories appear under `Components/` in the index — confirmed all 5 components indexed (43 total stories)
  - [x] 6.2 Verify sidebar shows: `Components/DsButton`, `Components/DsIcon`, `Components/DsIconButton`, `Components/DsInputText`, `Components/DsLink` — confirmed via index.json
  - [x] 6.3 Verify no build errors or warnings — Storybook build completed successfully
  - [x] 6.4 Verify autodocs pages are generated for each component (tags: ['autodocs']) — all 5 components have autodocs tag
  - [x] 6.5 Verify story source code tab is visible for at least one component story — CSF3 with render functions provides source code view by default
  - [x] 6.6 Verify components do not overflow or break at narrow viewport widths (320px) — stories use flex-wrap: wrap for gallery views, individual components are inline-sized

- [x] Task 7: Run existing tests and lint (AC: all)
  - [x] 7.1 `npx vitest run` — 171 tests pass across 7 files, zero regressions
  - [x] 7.2 `npx biome check ./src ./.storybook` — clean (35 files checked, no fixes needed)
  - [x] 7.3 `npm run build` — library build succeeds (dist/index.css 9.57KB, dist/index.js 131.44KB, unchanged)
  - [x] 7.4 `npx storybook build` — Storybook build succeeds with all 43 component stories + 5 foundation stories

## Dev Notes

### Current State of Story Files

**DsIconButton.stories.ts** — Most complete. Has 6 stories (Primary, Outlined, Text, Disabled, Loading, AllSizes) with argTypes and controls. BUT imports from `@storybook/vue3` which must be changed to `@storybook/vue3-vite` (Storybook 10 requirement).

**DsLink.stories.ts** — Partially done. Has argTypes, defaults, and one `Regular` story with render function. BUT imports from `@storybook/vue3`, needs fixing. Missing stories for Smart, Quiet, LowVisibility, Disabled, AllTypes, AllSizes, WithIcons.

**DsInputText.stories.ts** — Minimal placeholder. Only has Default story with no argTypes, no controls, no variants. Imports from `@storybook/vue3`. Needs complete rewrite.

**DsButton.stories.ts** — DOES NOT EXIST. Must be created from scratch.

**DsIcon.stories.ts** — DOES NOT EXIST. Must be created from scratch.

### CRITICAL: Import Path Fix

ALL existing stories import from `@storybook/vue3` which is WRONG for Storybook 10. Must change to `@storybook/vue3-vite`:

```ts
// WRONG:
import type { Meta, StoryObj } from '@storybook/vue3';

// CORRECT:
import type { Meta, StoryObj } from '@storybook/vue3-vite';
```

### Story Pattern — Render Function with Args

All component stories must use render functions to properly bind args from Storybook controls:

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DsButton from './DsButton.vue';

const meta = {
  title: 'Components/DsButton',
  component: DsButton,
  tags: ['autodocs'],
  argTypes: {
    severity: {
      control: 'select',
      options: ['primary', 'outlined', 'tertiary', 'text', 'text-link', 'negative'],
    },
    size: {
      control: 'select',
      options: ['xsmall', 'small', 'medium', 'large'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  args: {
    severity: 'primary',
    size: 'medium',
    disabled: false,
    loading: false,
  },
} satisfies Meta<typeof DsButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { DsButton },
    setup() {
      return { args };
    },
    template: '<DsButton v-bind="args">Button</DsButton>',
  }),
};
```

### v-model Handling for DsInputText

DsInputText uses `v-model`. In Storybook stories, use a reactive ref in the render function:

```ts
import { ref } from 'vue';

export const Default: Story = {
  render: (args) => ({
    components: { DsInputText },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsInputText v-bind="args" v-model="value" />',
  }),
};
```

### Component Props Reference (from source code)

**DsButton** — `severity: 'primary'|'outlined'|'tertiary'|'text'|'text-link'|'negative'`, `size: 'xsmall'|'small'|'medium'|'large'`, `disabled: boolean`, `loading: boolean`. Slots: default (label text), left-icon, right-icon.

**DsIcon** — `name: IconName` (string union from icon-names.ts), `size: 'xsmall'|'small'|'medium'|'large'`, `ariaLabel?: string`. No slots. Color inherited via CSS `currentColor`.

**DsIconButton** — `type: 'primary'|'outlined'|'text'`, `size: 'xsmall'|'small'|'medium'`, `disabled: boolean`, `loading: boolean`, `ariaLabel?: string`, `ariaLabelledby?: string`. Default slot for icon content.

**DsInputText** — `size: 'small'|'medium'`, `disabled: boolean`, `label?: string`, `mandatory: boolean`, `optional: boolean`, `info: boolean`, `hint?: string`, `error?: string`, `clearable: boolean`, `showDropdownIcon: boolean`. Uses `v-model`. Emits: `clear`. Slots: leading-icon, trailing-icon.

**DsLink** — `type: 'regular'|'smart'|'quiet'`, `size: 'small'|'medium'`, `visibility: 'high'|'low'`, `disabled: boolean`, `href?: string`. Default slot for link text. Slots: left-icon, right-icon.

### Available Icon Names (representative subset for stories)

Use these icons in stories that need icon examples: `edit`, `bin`, `arrow-left`, `arrow-right`, `arrow-up`, `arrow-down`, `calendar`, `call`, `chart-line`, `building`, `agent`, `brain`, `activity`, `archived`.

### Multi-Component Stories (with icon slots)

When creating stories with icon slots, import both components:

```ts
import DsButton from './DsButton.vue';
import DsIcon from '../DsIcon/DsIcon.vue';
```

### Gallery/Composite Stories Pattern

For stories showing all variants/sizes, use a render function with no args binding — hardcode the variants:

```ts
export const AllVariants: Story = {
  render: () => ({
    components: { DsButton },
    template: `
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <DsButton severity="primary">Primary</DsButton>
        <DsButton severity="outlined">Outlined</DsButton>
        <DsButton severity="tertiary">Tertiary</DsButton>
        <DsButton severity="text">Text</DsButton>
        <DsButton severity="text-link">Text Link</DsButton>
        <DsButton severity="negative">Negative</DsButton>
      </div>
    `,
  }),
};
```

### Anti-Patterns to Avoid

- Do NOT import from `@storybook/vue3` — use `@storybook/vue3-vite` (Storybook 10)
- Do NOT create separate Vue SFC files for story templates — use inline render functions
- Do NOT use `<style scoped>` in render functions — use inline styles for layout
- Do NOT add state management — stories should be stateless (except v-model refs for DsInputText)
- Do NOT create new components for story purposes — use existing components only
- Do NOT modify any component `.vue` files — this story is purely about documentation
- Do NOT use Tailwind utility classes for layout in stories — use inline `style` for story-specific layout (flex, gap, padding)
- Do NOT create `index.ts` barrel exports for stories — stories are not library code

### Previous Story Intelligence

**From Story 3.2 (Foundation Stories — immediate predecessor):**
- Storybook 10.3.4 with `@storybook/vue3-vite`
- CSF3 format with `Meta` and `StoryObj` types from `@storybook/vue3-vite`
- `.storybook/preview.ts` has PrimeVue + dsTheme + light/dark toggle
- `.storybook/main.ts` glob: `'../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'`
- Story `title` field controls sidebar hierarchy (e.g., `'Components/DsButton'`)
- 171 tests pass, Biome clean, library build: dist/index.css 9.57KB, dist/index.js 131.44KB
- Storybook build successful with all foundation stories

**From Story 3.1 (Storybook Setup):**
- Storybook uses `vue-component-meta` docgen plugin — this enables autodocs prop table generation from Vue SFC types
- The `tags: ['autodocs']` in meta enables automatic documentation page with prop tables
- DsInputText.stories.ts was created as a minimal placeholder during 3.1 — it needs full rewrite

**From DsIconButton story (existing):**
- Pattern: render function returning components + setup + template
- Uses `DsIcon` inside `DsIconButton` slot in render templates
- AllSizes story renders all sizes in a flex row

### Git Intelligence

Recent commits (master):
- `6e91f64` story 3.2 (foundation stories)
- `551f9c9` story 3.1 (storybook setup)
- `728c057` story 2.3 (DsLink component)
- `df31fe7` story 2.2 (DsInputText component)
- `a001717` story 2.1 (DsIconButton component)

### Project Structure Notes

- Component stories are co-located: `src/components/DsButton/DsButton.stories.ts`
- Foundation stories are in `src/stories/Foundations/` (from story 3.2)
- All components are in `src/components/Ds*/`
- No changes to library code, build config, or Storybook config needed

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.3] — Acceptance criteria and requirements
- [Source: _bmad-output/planning-artifacts/architecture.md#Storybook & Documentation Architecture] — Co-located stories pattern
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns] — Component implementation checklist, naming patterns
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md] — All component variants, sizes, states, and interaction behaviors
- [Source: _bmad-output/planning-artifacts/prd.md#FR20] — Interactive stories for every variant/state
- [Source: _bmad-output/planning-artifacts/prd.md#FR21] — Storybook prop controls
- [Source: _bmad-output/planning-artifacts/prd.md#FR23] — Copy-able usage patterns
- [Source: src/components/DsButton/DsButton.vue] — DsButton props: severity, size, disabled, loading
- [Source: src/components/DsIcon/DsIcon.vue] — DsIcon props: name, size, ariaLabel
- [Source: src/components/DsIconButton/DsIconButton.vue] — DsIconButton props: type, size, disabled, loading, ariaLabel
- [Source: src/components/DsInputText/DsInputText.vue] — DsInputText props: size, disabled, label, mandatory, optional, info, hint, error, clearable, showDropdownIcon
- [Source: src/components/DsLink/DsLink.vue] — DsLink props: type, size, visibility, disabled, href
- [Source: src/components/DsIconButton/DsIconButton.stories.ts] — Existing story pattern reference
- [Source: _bmad-output/implementation-artifacts/3-2-foundation-stories-design-tokens.md] — Previous story learnings
- [Source: _bmad-output/implementation-artifacts/3-1-storybook-setup-configuration.md] — Storybook config learnings

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Biome auto-fixed formatting in 4 story files (quote style, indentation) — no logic changes.
- DsButton uses PrimeVue `#icon` slot (not `left-icon`/`right-icon` as story spec suggested). Adapted WithLeftIcon to use `#icon` slot, WithRightIcon uses `iconPos="right"` passthrough attr.
- Storybook build warns about chunk size >500KB (iframe.js) — this is Storybook's own runtime, not our code. Existing behavior from story 3.2.

### Completion Notes List

- Created DsButton.stories.ts from scratch: 13 stories (Default, Primary, Outlined, Tertiary, Text, TextLink, Negative, Disabled, Loading, AllSizes, AllVariants, WithLeftIcon, WithRightIcon). Full argTypes with select/boolean controls.
- Created DsIcon.stories.ts from scratch: 4 stories (Default, AllSizes, WithAriaLabel, ColorInheritance). Demonstrates size tiers and currentColor inheritance.
- Updated DsIconButton.stories.ts: Fixed import path `@storybook/vue3` → `@storybook/vue3-vite`. Added AllTypes gallery story. Verified existing 6 stories and argTypes are complete.
- Rewrote DsInputText.stories.ts: 11 stories (Default, WithLabel, Mandatory, Optional, WithHint, WithError, Disabled, Clearable, WithDropdownIcon, AllSizes, AllStates). Full argTypes for all 11 props. v-model handled via reactive ref in render functions.
- Rewrote DsLink.stories.ts: 8 stories (Regular, Smart, Quiet, LowVisibility, Disabled, AllTypes, AllSizes, WithIcons). Full argTypes matching component props.
- All 5 component story files use `@storybook/vue3-vite` imports, CSF3 format, `satisfies Meta`, `tags: ['autodocs']`.
- 171 tests pass, Biome clean, library build unchanged (9.57KB CSS, 131.44KB JS), Storybook build successful with 43 component stories.

### Change Log

- 2026-04-05: Implemented Story 3.3 — Component Stories with Interactive Controls for all 5 MVP components (DsButton, DsIcon, DsIconButton, DsInputText, DsLink). Created 2 new story files, updated 1, rewrote 2. Total: 43 component stories with full interactive controls.

### File List

**Created:**
- src/components/DsButton/DsButton.stories.ts
- src/components/DsIcon/DsIcon.stories.ts

**Modified:**
- src/components/DsIconButton/DsIconButton.stories.ts
- src/components/DsInputText/DsInputText.stories.ts
- src/components/DsLink/DsLink.stories.ts
