# Story 4.1: AI Knowledge Base Structure & Component Index

Status: done

## Story

As an AI coding agent,
I want a structured index of all available design system components,
so that I can quickly determine which library component matches a Figma design element.

## Acceptance Criteria

1. **Given** `docs/ai-guidelines/index.md` exists, **When** an AI agent reads the index, **Then** it finds a complete inventory of all available components (FR24), **And** each component entry includes: component name, one-line description, import path, **And** the index includes guidance on when to use library components vs. raw Tailwind, **And** the index includes instructions for flagging gaps when a component doesn't exist (FR27).

2. **Given** the index follows a consistent, LLM-parseable structure (NFR14), **When** an AI agent processes the document, **Then** it can reliably extract the component list and match Figma elements to components (FR26).

## Tasks / Subtasks

- [x] Task 1: Create AI KB directory and index file (AC: #1, #2)
  - [x] 1.1 Create directory `docs/ai-guidelines/` (architecture specifies this path)
  - [x] 1.2 Create `docs/ai-guidelines/index.md` with structured component inventory
  - [x] 1.3 Add header section: library name (`@failwin/desing-system-vue`), description, import instructions
  - [x] 1.4 Add component inventory table with columns: Component Name, Description, Import, Figma Element
  - [x] 1.5 Include all 5 MVP components in the inventory:
    - `DsButton` — Button with severity variants (primary, outlined, tertiary, text, text-link, negative) and 4 sizes
    - `DsIcon` — SVG icon from the design system icon set, 4 sizes
    - `DsIconButton` — Icon-only button with type variants (primary, outlined, text) and 3 sizes
    - `DsInputText` — Text input with label, hint, error, clearable, and dropdown-icon support
    - `DsLink` — Hyperlink with type variants (regular, smart, quiet) and visibility options
  - [x] 1.6 Add "Theme Preset" section documenting `dsPreset` and `dsTheme` exports for consumer setup
  - [x] 1.7 Add "When to Use Library Components vs. Raw Tailwind" guidance section explaining:
    - Use library components when a Figma element matches a component in the inventory
    - Use raw Tailwind CSS when the design element has no matching component — use design tokens (colors, spacing, typography) from the preset for consistency
    - Document available design token categories (colors, typography, spacing, shadows) with references to `src/theme/ds-preset.ts`
  - [x] 1.8 Add "Gap Detection & Flagging" section with instructions for AI agents (FR27):
    - When a Figma element has no matching component, flag it as a gap
    - Provide a suggested flag format: `<!-- DS-GAP: [element description] — no matching component in @failwin/desing-system-vue -->`
    - Instruct the agent to continue implementation using raw Tailwind + design tokens for the gap
  - [x] 1.9 Add "Figma Element to Component Matching Guide" section (FR26):
    - Map common Figma layer names to library components (e.g., "Button/Primary" → `<DsButton severity="primary">`)
    - Include prop mapping hints for each component

- [x] Task 2: Validate index structure and content (AC: #1, #2)
  - [x] 2.1 Verify the index is valid Markdown with no syntax errors
  - [x] 2.2 Verify all 5 component names match actual exports in `src/index.ts`
  - [x] 2.3 Verify import path `@failwin/desing-system-vue` matches `package.json` name
  - [x] 2.4 Run `npx biome check docs/` — if Biome is configured to check markdown (it may not be; skip if not applicable)

- [x] Task 3: Run existing tests and lint to ensure no regressions (AC: all)
  - [x] 3.1 `npx vitest run` — all existing tests must pass (zero regressions)
  - [x] 3.2 `npx biome check ./src ./.storybook` — no lint/format errors
  - [x] 3.3 `npm run build` — library build must succeed unchanged

## Dev Notes

### Target File Location

The architecture document specifies `docs/ai-guidelines/` as the AI knowledge base directory.

```
docs/
  ai-guidelines/
    index.md            # THIS STORY — component inventory + usage guidance
    ds-button.md        # Story 4.2 — per-component entries
    ds-icon-button.md   # Story 4.2
    ds-input-text.md    # Story 4.2
    ds-link.md          # Story 4.2
    ds-icon.md          # Story 4.2
```

### Component Inventory Data

All component prop interfaces are defined in their respective `.vue` files using `withDefaults(defineProps<T>())`:

**DsButton** (`src/components/DsButton/DsButton.vue`):
- `severity?: 'primary' | 'outlined' | 'tertiary' | 'text' | 'text-link' | 'negative'`
- `size?: 'xsmall' | 'small' | 'medium' | 'large'`
- `disabled?: boolean`, `loading?: boolean`
- Wraps PrimeVue Button with `inheritAttrs: false` + `v-bind="$attrs"`

**DsIcon** (`src/components/DsIcon/DsIcon.vue`):
- `name: IconName` (union type in `icon-names.ts`, ~100+ icon names)
- `size?: 'xsmall' | 'small' | 'medium' | 'large'`
- `ariaLabel?: string`
- Custom component (not PrimeVue wrapper), renders SVG icons

**DsIconButton** (`src/components/DsIconButton/DsIconButton.vue`):
- `type?: 'primary' | 'outlined' | 'text'`
- `size?: 'xsmall' | 'small' | 'medium'`
- `disabled?: boolean`, `loading?: boolean`
- `ariaLabel?: string`, `ariaLabelledby?: string`
- Wraps PrimeVue Button, contains DsIcon internally

**DsInputText** (`src/components/DsInputText/DsInputText.vue`):
- `size?: 'small' | 'medium'`
- `disabled?: boolean`, `label?: string`
- `mandatory?: boolean`, `optional?: boolean`, `info?: boolean`
- `hint?: string`, `error?: string`
- `clearable?: boolean`, `showDropdownIcon?: boolean`
- Supports `v-model` via PrimeVue InputText passthrough

**DsLink** (`src/components/DsLink/DsLink.vue`):
- `type?: 'regular' | 'smart' | 'quiet'`
- `size?: 'small' | 'medium'`
- `visibility?: 'high' | 'low'`
- `disabled?: boolean`, `href?: string`
- Custom component using `<a>` element with Tailwind styling

### Exports from `src/index.ts`

```ts
export { DsButton, type DsButtonProps } from './components/DsButton';
export { DsIcon, type IconName } from './components/DsIcon';
export { DsIconButton, type DsIconButtonProps } from './components/DsIconButton';
export { DsInputText, type DsInputTextProps } from './components/DsInputText';
export { DsLink, type DsLinkProps } from './components/DsLink';
export { dsPreset, dsTheme } from './theme';
```

### Consumer Setup Pattern

AI agents should know how consumers set up the library:

```ts
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import { dsPreset } from '@failwin/desing-system-vue';

const app = createApp(App);
app.use(PrimeVue, { theme: { preset: dsPreset } });
```

### LLM-Parseable Structure Requirements (NFR14)

The index.md must be structured so that:
- An AI agent can parse it reliably with simple text processing
- Component names, descriptions, and import paths are in a consistent table format
- Sections have clear headings that an agent can search for
- No ambiguous formatting or nested structures that could confuse parsing

### Existing File: `docs/figma-variables.md`

There is already a `docs/figma-variables.md` file in the project. The AI KB index should reference this file for detailed Figma token information rather than duplicating it.

### Anti-Patterns to Avoid

- Do NOT create files for story 4.2 (per-component entries) — this story only creates `index.md`
- Do NOT modify any source code files — this story is documentation only
- Do NOT duplicate detailed prop tables in the index — keep entries brief; story 4.2 creates detailed per-component files
- Do NOT use complex markdown structures (nested tables, HTML) — keep it simple for LLM parsing
- Do NOT hardcode file paths from the build output (`dist/`) — use the npm package name for imports

### Project Structure Notes

- Alignment: `docs/ai-guidelines/` matches architecture document's directory structure
- No conflicts with existing `docs/figma-variables.md`
- The `docs/` directory is documentation-only — not published to npm, versioned in git

### Previous Story Intelligence

**From Story 3.4 (Composed Layout Example Pages — immediate predecessor):**
- 171 tests pass, Biome clean, library build: dist/index.css 9.57KB, dist/index.js 131.44KB
- All 5 components fully implemented and documented in Storybook
- Biome auto-fixes quote style and indentation — let it
- All component stories verified working in both light and dark mode

### Git Intelligence

Recent commits (master):
- `3cd836a` story 3.4 (composed layout example pages)
- `610a484` story 3.3 (component stories with interactive controls)
- `6e91f64` story 3.2 (foundation stories)
- `551f9c9` story 3.1 (storybook setup)
- `728c057` story 2.3 (DsLink component)

All Epic 3 (Storybook documentation) stories are complete. This is the first story in Epic 4 (AI Agent Knowledge Base).

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.1] — Acceptance criteria and user story
- [Source: _bmad-output/planning-artifacts/architecture.md#AI Knowledge Base Architecture] — Directory structure `docs/ai-guidelines/`, markdown files per component, consistent template
- [Source: _bmad-output/planning-artifacts/prd.md#FR24-FR27] — AI Knowledge Base functional requirements
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure] — `docs/ai-guidelines/` directory placement
- [Source: src/index.ts] — Barrel exports: 5 components + dsPreset + dsTheme
- [Source: docs/figma-variables.md] — Existing Figma token reference
- [Source: _bmad-output/implementation-artifacts/3-4-composed-layout-example-pages.md] — Previous story learnings

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Biome not configured to lint markdown in `docs/` — Task 2.4 skipped as not applicable

### Completion Notes List

- Created `docs/ai-guidelines/index.md` with full AI component index
- Index includes: library header, installation/setup, component inventory table (5 components), theme preset docs, library vs. raw Tailwind guidance, gap detection/flagging instructions (DS-GAP format), and Figma-to-component matching guide
- Validated: markdown syntax clean, all 5 components match `src/index.ts` exports, package name matches `package.json`
- No regressions: 171 tests pass, Biome clean (36 files), build succeeds (dist/index.css 9.57KB, dist/index.js 131.44KB)
- Documentation-only story — no source code files modified

### Change Log

- 2026-04-05: Created `docs/ai-guidelines/index.md` — AI Knowledge Base component index with inventory, usage guidance, gap flagging, and Figma matching guide

### File List

- docs/ai-guidelines/index.md (new)