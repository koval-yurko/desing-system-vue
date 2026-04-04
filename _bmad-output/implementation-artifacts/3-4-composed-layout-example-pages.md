# Story 3.4: Composed Layout Example Pages

Status: done

## Story

As a developer,
I want to see composed layout examples showing multiple components used together,
so that I understand how to combine design system components in real feature implementations.

## Acceptance Criteria

1. **Given** a dedicated pages section exists in Storybook, **When** a developer browses the Pages section in the sidebar, **Then** at least one composed layout example is available under `Pages/` (FR22).

2. **Given** a "Settings Form" composed example exists, **When** a developer views it, **Then** it shows DsInputText fields, DsButton (Primary + Outlined), and DsLink composed into a realistic form layout, **And** the example works in both light and dark mode.

3. **Given** composed pages show real usage patterns, **When** a developer reviews the source, **Then** the code demonstrates correct component imports, prop usage, and composition patterns, **And** the developer can copy the pattern for their own feature.

## Tasks / Subtasks

- [x] Task 1: Create `SettingsForm.stories.ts` page story (AC: #1, #2, #3)
  - [x] 1.1 Create file at `src/stories/Pages/SettingsForm.stories.ts`
  - [x] 1.2 Import from `@storybook/vue3-vite` (NOT `@storybook/vue3`), set `title: 'Pages/Settings Form'`. Do NOT use `tags: ['autodocs']` — there is no single `component` in meta, so autodocs would produce an empty/broken page.
  - [x] 1.3 Import required components: `DsInputText`, `DsButton`, `DsLink` from their source paths (e.g., `../../components/DsButton/DsButton.vue`). Do NOT import `DsIcon` — it is not used in any page story.
  - [x] 1.4 Import `ref` from `vue` for v-model bindings on DsInputText fields
  - [x] 1.5 Create `Default` story with render function composing a realistic "Account Settings" form:
    - Form title using a plain `<h2>` heading
    - DsInputText for "Full name" (label, mandatory: true)
    - DsInputText for "Email address" (label, mandatory: true)
    - DsInputText for "Company" (label, optional: true)
    - DsInputText for "Bio" (label, hint: 'Brief description for your profile')
    - A DsLink with text "Change password" somewhere in the form (e.g., below email)
    - Button row at the bottom: DsButton severity="outlined" text "Cancel" + DsButton severity="primary" text "Save changes"
  - [x] 1.6 Each DsInputText must bind to its own `ref()` for v-model to work
  - [x] 1.7 Use inline `style` for layout (no Tailwind utilities in stories): `max-width: 480px`, vertical flex with `gap: 20px`, button row as horizontal flex with `gap: 12px` and `justify-content: flex-end`
  - [x] 1.8 Create `WithErrors` story variant showing the form with validation errors:
    - "Full name" field empty with `error: 'Full name is required'`
    - "Email address" field pre-filled with invalid value, `error: 'Please enter a valid email'`
    - Other fields in normal state
    - Same button layout as Default
  - [x] 1.9 Create `Filled` story variant showing the form fully filled:
    - All fields pre-filled with realistic placeholder data (e.g., "Yurii Kovalchuk", "yurii@example.com", "Acme Corp", "Frontend developer passionate about design systems")
    - Same button/link layout as Default

- [x] Task 2: Verify stories render in Storybook (AC: #1, #2, #3)
  - [x] 2.1 Run `npx storybook build` and verify `Pages/Settings Form` appears in the sidebar index
  - [x] 2.2 Verify the composed page renders all components correctly — no console errors
  - [x] 2.3 Verify light/dark theme toggle works on composed page — switch to dark mode and confirm all components (DsInputText labels/borders, DsButton colors, DsLink colors, error states) render correctly with no hardcoded light-only colors
  - [x] 2.4 Verify source code tab shows the composed template with correct imports and prop usage

- [x] Task 3: Run existing tests and lint (AC: all)
  - [x] 3.1 `npx vitest run` — all existing tests must pass (zero regressions)
  - [x] 3.2 `npx biome check ./src ./.storybook` — no lint/format errors
  - [x] 3.3 `npm run build` — library build must succeed unchanged

## Dev Notes

### Story Pattern — Composed Page (No Component Prop)

Composed page stories do NOT have a single `component` in meta since they combine multiple components. Use only `title` and `tags`. All rendering is done via render functions:

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import DsButton from '../../components/DsButton/DsButton.vue';
import DsInputText from '../../components/DsInputText/DsInputText.vue';
import DsLink from '../../components/DsLink/DsLink.vue';

// NOTE: No `component` in meta — this is a multi-component page story.
// NOTE: No `tags: ['autodocs']` — autodocs requires a single component to generate prop tables.
const meta = {
  title: 'Pages/Settings Form',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Simplified example — full template with 4 fields, link, and 2 buttons is specified in Task 1.5
export const Default: Story = {
  render: () => ({
    components: { DsButton, DsInputText, DsLink },
    setup() {
      const name = ref('');
      const email = ref('');
      return { name, email };
    },
    template: `
      <div style="max-width: 480px;">
        <DsInputText v-model="name" label="Full name" :mandatory="true" />
        <DsInputText v-model="email" label="Email" :mandatory="true" />
        <DsButton severity="primary">Save changes</DsButton>
      </div>
    `,
  }),
};
```

### CRITICAL: Import Paths

Import components from their source `.vue` files using relative paths from the story location (`src/stories/Pages/`):

```ts
import DsButton from '../../components/DsButton/DsButton.vue';
import DsInputText from '../../components/DsInputText/DsInputText.vue';
import DsLink from '../../components/DsLink/DsLink.vue';
```

Do NOT import `DsIcon` — it is not used in any page story template.
Do NOT import from barrel `index.ts` — Storybook stories import directly from source.

### v-model Pattern for Multiple DsInputText

Each DsInputText field needs its own `ref()`. Create all refs in the `setup()` function:

```ts
setup() {
  const fullName = ref('');
  const email = ref('');
  const company = ref('');
  const bio = ref('');
  return { fullName, email, company, bio };
},
```

### Layout via Inline Styles Only

Stories use inline `style` attributes for layout — no Tailwind utilities, no `<style>` blocks:

```html
<div style="max-width: 480px; display: flex; flex-direction: column; gap: 20px;">
  <!-- form fields -->
  <div style="display: flex; gap: 12px; justify-content: flex-end;">
    <!-- buttons -->
  </div>
</div>
```

### Storybook Sidebar Hierarchy

The `title: 'Pages/Settings Form'` places the story under a `Pages` top-level section in the sidebar, separate from `Components/` and `Foundations/`. This fulfills FR22's "dedicated pages section" requirement. The epics AC requires "at least one" composed layout — this story delivers one page (Settings Form) with 3 variants (Default, WithErrors, Filled). Additional pages can be added in future stories if needed.

### File Location

Page stories go in `src/stories/Pages/` — following the pattern set by foundation stories in `src/stories/Foundations/`. The Storybook glob `'../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'` already picks up this path.

### Component Props Quick Reference

**DsInputText** — `v-model`, `size: 'small'|'medium'`, `label?: string`, `mandatory: boolean`, `optional: boolean`, `info: boolean`, `hint?: string`, `error?: string`, `clearable: boolean`, `disabled: boolean`, `showDropdownIcon: boolean`

**DsButton** — `severity: 'primary'|'outlined'|'tertiary'|'text'|'text-link'|'negative'`, `size: 'xsmall'|'small'|'medium'|'large'`, `disabled: boolean`, `loading: boolean`. Default slot for label text.

**DsLink** — `type: 'regular'|'smart'|'quiet'`, `size: 'small'|'medium'`, `visibility: 'high'|'low'`, `disabled: boolean`, `href?: string`. Default slot for link text.

**DsIcon** — `name: IconName`, `size: 'xsmall'|'small'|'medium'|'large'`, `ariaLabel?: string`.

### Anti-Patterns to Avoid

- Do NOT import from `@storybook/vue3` — use `@storybook/vue3-vite`
- Do NOT use Tailwind utility classes for layout in stories — use inline `style`
- Do NOT create new Vue SFC components for page templates — use inline render functions
- Do NOT add `<style scoped>` blocks
- Do NOT modify any component `.vue` files — this story is purely about documentation
- Do NOT create `index.ts` barrel exports for stories
- Do NOT import from barrel `src/index.ts` — import directly from component `.vue` files
- Do NOT add `component` to meta for multi-component page stories — leave it out
- Do NOT add `tags: ['autodocs']` — autodocs needs a single component to generate prop tables; without one the page is empty

### Previous Story Intelligence

**From Story 3.3 (Component Stories — immediate predecessor):**
- All 5 component story files use `@storybook/vue3-vite`, CSF3 format, `satisfies Meta`, `tags: ['autodocs']`
- Storybook build produces 43 component stories + 5 foundation stories
- 171 tests pass, Biome clean, library build: dist/index.css 9.57KB, dist/index.js 131.44KB
- DsButton uses PrimeVue `#icon` slot (not `left-icon`/`right-icon`)
- Biome auto-fixes quote style and indentation — let it

**From Story 3.2 (Foundation Stories):**
- Foundation stories live in `src/stories/Foundations/` — page stories should follow same pattern at `src/stories/Pages/`
- CSF3 with `Meta` and `StoryObj` from `@storybook/vue3-vite`
- `.storybook/preview.ts` already has PrimeVue + dsTheme + light/dark toggle — no config changes needed

**From Story 3.1 (Storybook Setup):**
- `vue-component-meta` docgen plugin enabled — autodocs will generate prop tables
- `tags: ['autodocs']` in meta enables automatic documentation page

### Git Intelligence

Recent commits (master):
- `610a484` story 3.3 (component stories with interactive controls)
- `6e91f64` story 3.2 (foundation stories)
- `551f9c9` story 3.1 (storybook setup)
- `728c057` story 2.3 (DsLink component)
- `df31fe7` story 2.2 (DsInputText component)

### Project Structure Notes

- Page stories go in: `src/stories/Pages/SettingsForm.stories.ts`
- Foundation stories already at: `src/stories/Foundations/*.stories.ts`
- Component stories at: `src/components/Ds*/*.stories.ts`
- Storybook glob covers all: `'../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'`
- No changes to `.storybook/main.ts` or `.storybook/preview.ts` needed

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.4] — Acceptance criteria: Settings Form with DsInputText + DsButton + DsLink
- [Source: _bmad-output/planning-artifacts/architecture.md#Storybook & Documentation Architecture] — Dedicated pages section for composed layout examples (FR22)
- [Source: _bmad-output/planning-artifacts/prd.md#FR22] — Developers can browse dedicated pages showing composed layout examples
- [Source: _bmad-output/planning-artifacts/prd.md#FR23] — Copy-able usage patterns from story source code
- [Source: .storybook/main.ts] — Story glob pattern: `'../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'`
- [Source: .storybook/preview.ts] — PrimeVue + dsTheme + light/dark toolbar toggle already configured
- [Source: src/stories/Foundations/] — Precedent for non-component story location
- [Source: _bmad-output/implementation-artifacts/3-3-component-stories-with-interactive-controls.md] — Previous story learnings

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6 (1M context)

### Debug Log References
- Biome auto-fixed quote style (double → single) and indentation in SettingsForm.stories.ts — expected per story 3.3 learnings

### Completion Notes List
- Created `src/stories/Pages/SettingsForm.stories.ts` with 3 story variants: Default, WithErrors, Filled
- All variants compose DsInputText, DsButton, and DsLink into a realistic "Account Settings" form layout
- Used inline styles for layout (no Tailwind), individual `ref()` per field for v-model binding
- No `component` or `tags: ['autodocs']` in meta — correct pattern for multi-component page stories
- Storybook build confirms `Pages/Settings Form` appears in sidebar with all 3 variants
- 171 tests pass (zero regressions), Biome clean, library build unchanged (dist/index.css 9.57KB, dist/index.js 131.44KB)

### Change Log
- 2026-04-05: Created composed page story for Settings Form with Default, WithErrors, and Filled variants

### File List
- src/stories/Pages/SettingsForm.stories.ts (new)
