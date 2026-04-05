# Story 4.2: Per-Component AI Knowledge Base Entries

Status: done

## Story

As an AI coding agent,
I want detailed per-component documentation with props, variants, and usage examples,
so that I can generate correct import statements and component usage matching Figma designs.

## Acceptance Criteria

1. **Given** each MVP component has a dedicated markdown file in `docs/ai-guidelines/`, **When** an AI agent reads `ds-button.md`, **Then** it finds: component name (DsButton), when to use, available props with valid values, all variants and sizes, usage examples with correct imports, and Figma reference (FR25).

2. **Given** per-component entries exist for all 5 MVP components, **When** files are listed in `docs/ai-guidelines/`, **Then** `ds-button.md`, `ds-icon-button.md`, `ds-icon.md`, `ds-input-text.md`, `ds-link.md` all exist.

3. **Given** each entry follows the same consistent template structure, **When** an AI agent processes any component entry, **Then** the structure is identical across all entries (NFR14), including sections: Name, When to Use, Import, Props (table), Variants, Sizes, Slots (if applicable), Usage Examples, Accessibility, Figma Reference.

4. **Given** usage examples show correct imports and prop usage, **When** an AI agent copies an example, **Then** the import path is `@failwin/desing-system-vue`, **And** props use the correct values documented in the entry, **And** examples cover the most common use cases (primary button, error input, etc.).

## Tasks / Subtasks

- [x] Task 1: Create per-component markdown template (AC: #3)
  - [x] 1.1 Define consistent template structure all 5 files will follow. Required sections in order:
    - `# DsComponentName` (H1 heading)
    - `## When to Use` — 1-2 sentences on when an AI agent should use this component
    - `## Import` — single import statement
    - `## Props` — markdown table with columns: Prop, Type, Default, Description
    - `## Variants` — visual variant descriptions with prop combinations
    - `## Sizes` — size options with dimensions
    - `## Slots` — named slots if any (omit section if none)
    - `## Usage Examples` — 3-5 code blocks covering common use cases
    - `## Accessibility` — key a11y notes
    - `## Figma Reference` — Figma layer name mappings

- [x] Task 2: Create `docs/ai-guidelines/ds-button.md` (AC: #1, #3, #4)
  - [x] 2.1 When to Use: action triggers — form submissions, dialogs, navigation actions
  - [x] 2.2 Props table — severity, size, disabled, loading (with exact union types and defaults)
  - [x] 2.3 Document all 6 severity variants: primary (default, filled blue), outlined (bordered), tertiary (subtle background), text (no background/border), text-link (link-styled button), negative (destructive red)
  - [x] 2.4 Document 4 sizes: xsmall, small, medium (default), large
  - [x] 2.5 Slots: `icon` (button icon), default (button text)
  - [x] 2.6 Usage examples: primary button, outlined button, button with icon, loading state, disabled state, negative/destructive action
  - [x] 2.7 Accessibility notes: aria-disabled, aria-busy when loading, aria-live
  - [x] 2.8 Figma reference: Button/Primary, Button/Outlined, Button/Tertiary, Button/Text, Button/Text Link, Button/Negative

- [x] Task 3: Create `docs/ai-guidelines/ds-icon.md` (AC: #1, #3, #4)
  - [x] 3.1 When to Use: decorative or informational icons inside other components or standalone
  - [x] 3.2 Props table — name (required, IconName type), size, ariaLabel
  - [x] 3.3 Document 4 sizes with pixel values: xsmall (12px), small (16px), medium (20px, default), large (24px)
  - [x] 3.4 Note: 237 available icon names, type-checked at build time via `IconName` type
  - [x] 3.5 Usage examples: basic icon, icon with aria-label for standalone meaning, icons at different sizes
  - [x] 3.6 Accessibility: decorative icons get aria-hidden="true" automatically; provide ariaLabel only for icons that convey meaning independently
  - [x] 3.7 Figma reference: Icon/*, ic/*, glyph layers
  - [x] 3.8 Include a representative sample of common icon names (15-20 most used) — do NOT list all 237

- [x] Task 4: Create `docs/ai-guidelines/ds-icon-button.md` (AC: #1, #3, #4)
  - [x] 4.1 When to Use: icon-only action buttons — toolbars, close buttons, compact actions
  - [x] 4.2 Props table — type, size, disabled, loading, ariaLabel, ariaLabelledby
  - [x] 4.3 Document 3 type variants: primary (filled), outlined (bordered), text (minimal)
  - [x] 4.4 Document 3 sizes with dimensions: xsmall (1.5rem/24px), small (2rem/32px), medium (2.25rem/36px, default)
  - [x] 4.5 Slots: default (for DsIcon)
  - [x] 4.6 Usage examples: primary close button, outlined settings button, text icon button, loading state
  - [x] 4.7 Accessibility: ariaLabel is required (or ariaLabelledby) — icon buttons have no visible text
  - [x] 4.8 Figma reference: IconButton/Primary, IconButton/Outlined, IconButton/Text, Button/Icon

- [x] Task 5: Create `docs/ai-guidelines/ds-input-text.md` (AC: #1, #3, #4)
  - [x] 5.1 When to Use: single-line text input — forms, search fields, filters
  - [x] 5.2 Props table — size, disabled, label, mandatory, optional, info, hint, error, clearable, showDropdownIcon, modelValue (v-model)
  - [x] 5.3 Document 2 sizes: small (32px height), medium (40px height, default)
  - [x] 5.4 Document label modifiers: mandatory (asterisk), optional ("Optional" text), info (help icon)
  - [x] 5.5 Slots: `leading` (left-side icon slot)
  - [x] 5.6 Emits: `clear` (when clear button clicked), `update:modelValue` (v-model)
  - [x] 5.7 Usage examples: basic with label, with hint, with error, clearable, with leading icon, with dropdown icon, mandatory field
  - [x] 5.8 Accessibility: aria-invalid when error present, aria-describedby for error message
  - [x] 5.9 Figma reference: Input, TextField, TextInput

- [x] Task 6: Create `docs/ai-guidelines/ds-link.md` (AC: #1, #3, #4)
  - [x] 6.1 When to Use: navigation links — inline text links, standalone navigation, smart links with hover effects
  - [x] 6.2 Props table — type, size, visibility, disabled, href
  - [x] 6.3 Document 3 type variants: regular (always underlined), smart (padded, background on hover), quiet (no underline, gains underline on hover)
  - [x] 6.4 Document 2 visibility options: high (blue, default), low (gray) — note: smart type forces high visibility
  - [x] 6.5 Document 2 sizes: small (14px), medium (16px, default)
  - [x] 6.6 Slots: `left-icon`, default (text), `right-icon`
  - [x] 6.7 Usage examples: basic link, smart link, quiet link, link with icons, low visibility link, disabled link
  - [x] 6.8 Accessibility: aria-disabled, tabindex management, focus-visible outline
  - [x] 6.9 Figma reference: Link, Hyperlink, TextLink, Link/Smart, Link/Quiet

- [x] Task 7: Validate all entries (AC: #1, #2, #3, #4)
  - [x] 7.1 Verify all 5 files exist in `docs/ai-guidelines/`
  - [x] 7.2 Verify each file follows the identical template structure from Task 1
  - [x] 7.3 Verify all import paths use `@failwin/desing-system-vue`
  - [x] 7.4 Verify all prop types and default values match actual component source files
  - [x] 7.5 Verify usage examples have valid prop combinations (no invalid prop values)
  - [x] 7.6 Verify component names match exports in `src/index.ts`

- [x] Task 8: Run existing tests and lint to ensure no regressions (AC: all)
  - [x] 8.1 `npx vitest run` — all existing tests must pass (zero regressions)
  - [x] 8.2 `npx biome check ./src ./.storybook` — no lint/format errors
  - [x] 8.3 `npm run build` — library build must succeed unchanged

## Dev Notes

### Target Files

Create these 5 files in `docs/ai-guidelines/` (directory already exists from Story 4.1):

```
docs/ai-guidelines/
  ds-button.md        # NEW — this story
  ds-icon.md          # NEW — this story
  ds-icon-button.md   # NEW — this story
  ds-input-text.md    # NEW — this story
  ds-link.md          # NEW — this story
  index.md            # EXISTS — created in Story 4.1, do NOT modify
```

### Component Prop Reference (Source of Truth)

All prop interfaces are in the component `.vue` files using `withDefaults(defineProps<T>())`:

**DsButton** (`src/components/DsButton/DsButton.vue`):
- `severity?: 'primary' | 'outlined' | 'tertiary' | 'text' | 'text-link' | 'negative'` (default: `'primary'`)
- `size?: 'xsmall' | 'small' | 'medium' | 'large'` (default: `'medium'`)
- `disabled?: boolean` (default: `false`)
- `loading?: boolean` (default: `false`)
- Slots: `#icon`, default
- Wraps PrimeVue Button — `inheritAttrs: false` + `v-bind="$attrs"`

**DsIcon** (`src/components/DsIcon/DsIcon.vue`):
- `name: IconName` (required — union type from `icon-names.ts`, 237 icon names)
- `size?: 'xsmall' | 'small' | 'medium' | 'large'` (default: `'medium'`)
- `ariaLabel?: string`
- No slots. Custom component (not PrimeVue wrapper). Renders inline SVG via `v-html`.
- Size map: xsmall=12px, small=16px, medium=20px, large=24px

**DsIconButton** (`src/components/DsIconButton/DsIconButton.vue`):
- `type?: 'primary' | 'outlined' | 'text'` (default: `'primary'`)
- `size?: 'xsmall' | 'small' | 'medium'` (default: `'medium'`)
- `disabled?: boolean` (default: `false`)
- `loading?: boolean` (default: `false`)
- `ariaLabel?: string`
- `ariaLabelledby?: string`
- Slots: default (icon content)
- Square button: xsmall=1.5rem, small=2rem, medium=2.25rem

**DsInputText** (`src/components/DsInputText/DsInputText.vue`):
- `size?: 'small' | 'medium'` (default: `'medium'`)
- `disabled?: boolean` (default: `false`)
- `label?: string`
- `mandatory?: boolean` (default: `false`)
- `optional?: boolean` (default: `false`)
- `info?: boolean` (default: `false`)
- `hint?: string`
- `error?: string`
- `clearable?: boolean` (default: `false`)
- `showDropdownIcon?: boolean` (default: `false`)
- Supports `v-model` via PrimeVue InputText passthrough
- Emits: `clear`
- Slots: `#leading` (left-side icon)
- Heights: small=32px, medium=40px

**DsLink** (`src/components/DsLink/DsLink.vue`):
- `type?: 'regular' | 'smart' | 'quiet'` (default: `'regular'`)
- `size?: 'small' | 'medium'` (default: `'medium'`)
- `visibility?: 'high' | 'low'` (default: `'high'`)
- `disabled?: boolean` (default: `false`)
- `href?: string`
- Slots: `#left-icon`, default, `#right-icon`
- Smart type forces visibility='high'
- Font sizes: small=14px, medium=16px

### Template Structure (NFR14 — LLM-Parseable)

Every per-component file MUST follow this exact section order:
1. `# DsComponentName` — H1 with component name
2. `## When to Use` — 1-2 sentences
3. `## Import` — single code block
4. `## Props` — markdown table (Prop | Type | Default | Description)
5. `## Variants` — visual variant descriptions with prop combinations
6. `## Sizes` — size options with dimensions
7. `## Slots` — only if component has slots; omit entirely if none
8. `## Events` — only if component emits custom events; omit entirely if none. Table with columns: Event, Payload, Description
9. `## Usage Examples` — 3-7 fenced code blocks with `vue` or `html` language tag
10. `## Accessibility` — key a11y considerations
11. `## Figma Reference` — Figma layer name → component prop mappings

Keep entries concise and scannable. Avoid prose paragraphs — use bullet points and tables. This is for LLM consumption, not human tutorials.

### Anti-Patterns to Avoid

- Do NOT modify `docs/ai-guidelines/index.md` — it was created in Story 4.1
- Do NOT modify any source code files — this story is documentation only
- Do NOT list all 237 icon names in `ds-icon.md` — include only 15-20 representative examples
- Do NOT use HTML inside markdown — keep it pure markdown for LLM parsing
- Do NOT duplicate the component inventory table from `index.md` — per-component files are the detailed view
- Do NOT include implementation details (CSS classes, internal mapping logic) — focus on public API
- Do NOT add complex nested markdown structures — flat sections with tables and code blocks only

### Previous Story Intelligence

**From Story 4.1 (AI Knowledge Base Structure & Component Index):**
- Created `docs/ai-guidelines/index.md` with component inventory, setup instructions, gap detection, and Figma matching guide
- 171 tests pass, Biome clean, build succeeds (dist/index.css 9.57KB, dist/index.js 131.44KB)
- Biome is not configured to lint markdown in `docs/` — skip markdown lint checks
- Documentation-only story — no source code files were modified
- The index already references per-component files by name (ds-button.md, ds-icon.md, etc.)

### Git Intelligence

Recent commits (master):
- `f3aae9c` story 4.1 (AI KB structure & component index)
- `3cd836a` story 3.4 (composed layout example pages)
- `610a484` story 3.3 (component stories with interactive controls)
- `6e91f64` story 3.2 (foundation stories)
- `551f9c9` story 3.1 (storybook setup)

Epic 4 is in-progress. Story 4.1 established the index file; this story fills in the per-component detail files.

### Barrel Exports (src/index.ts)

```ts
export { DsButton, type DsButtonProps } from './components/DsButton';
export { DsIcon, type IconName } from './components/DsIcon';
export { DsIconButton, type DsIconButtonProps } from './components/DsIconButton';
export { DsInputText, type DsInputTextProps } from './components/DsInputText';
export { DsLink, type DsLinkProps } from './components/DsLink';
export { dsPreset, dsTheme } from './theme';
```

### Project Structure Notes

- Alignment: `docs/ai-guidelines/` matches architecture document's directory structure exactly
- Per-component file names match the kebab-case convention from architecture: `ds-button.md`, `ds-icon.md`, etc.
- No conflicts with existing files — `index.md` already exists, 5 new files are additive
- The `docs/` directory is documentation-only — not published to npm, versioned in git

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.2] — Acceptance criteria and user story
- [Source: _bmad-output/planning-artifacts/architecture.md#AI Knowledge Base Architecture] — `docs/ai-guidelines/` structure, markdown files per component, consistent template
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns] — kebab-case for AI KB files
- [Source: _bmad-output/planning-artifacts/prd.md#FR25] — Per-component AI KB entries requirement
- [Source: _bmad-output/planning-artifacts/prd.md#NFR14] — Consistent AI KB structure
- [Source: docs/ai-guidelines/index.md] — Existing AI component index (Story 4.1 output)
- [Source: src/index.ts] — Barrel exports: 5 components + dsPreset + dsTheme
- [Source: src/components/DsButton/DsButton.vue] — DsButton props and implementation
- [Source: src/components/DsIcon/DsIcon.vue] — DsIcon props and implementation
- [Source: src/components/DsIconButton/DsIconButton.vue] — DsIconButton props and implementation
- [Source: src/components/DsInputText/DsInputText.vue] — DsInputText props and implementation
- [Source: src/components/DsLink/DsLink.vue] — DsLink props and implementation
- [Source: _bmad-output/implementation-artifacts/4-1-ai-knowledge-base-structure-component-index.md] — Previous story learnings

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

No issues encountered. Documentation-only story — no source code modified.

### Completion Notes List

- Created 5 per-component AI knowledge base entries following consistent template (NFR14)
- All files use identical section structure: Name, When to Use, Import, Props table, Variants, Sizes, Slots (when applicable), Usage Examples, Accessibility, Figma Reference
- All prop types and defaults verified against actual component source files
- All import paths use `@failwin/desing-system-vue`
- DsIcon includes 20 representative icon names (not all 237)
- DsIcon omits Slots section (no slots) per template rules
- 171 tests pass, Biome clean, build succeeds (no regressions)

### Change Log

- 2026-04-05: Created 5 per-component AI KB documentation files in `docs/ai-guidelines/`

### File List

- docs/ai-guidelines/ds-button.md (NEW)
- docs/ai-guidelines/ds-icon.md (NEW)
- docs/ai-guidelines/ds-icon-button.md (NEW)
- docs/ai-guidelines/ds-input-text.md (NEW)
- docs/ai-guidelines/ds-link.md (NEW)
- _bmad-output/implementation-artifacts/4-2-per-component-ai-knowledge-base-entries.md (MODIFIED)
- _bmad-output/implementation-artifacts/sprint-status.yaml (MODIFIED)
