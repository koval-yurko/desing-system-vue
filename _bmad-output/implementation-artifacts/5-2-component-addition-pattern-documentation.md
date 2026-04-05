# Story 5.2: Component Addition Pattern Documentation

Status: done

## Story

As a library maintainer,
I want documented, repeatable patterns for adding new components,
so that I can extend the library predictably whether adding a PrimeVue wrapper or a custom Tailwind component.

## Acceptance Criteria

1. **Given** a component addition guide exists (in README or docs), **When** the maintainer wants to add a new PrimeVue-based component, **Then** the guide documents the exact steps:
   - Create component directory with `.vue`, `.stories.ts`, `.test.ts`, `index.ts`
   - Implement wrapper with `inheritAttrs: false` + `v-bind="$attrs"`
   - Add TypeScript prop types
   - Verify light + dark theme rendering
   - Write Storybook stories for all variants/states
   - Write Vitest tests
   - Add AI KB entry in `docs/ai-guidelines/`
   - Export from barrel `src/index.ts`

2. **Given** the guide covers custom Tailwind components, **When** the maintainer wants to add a component without a PrimeVue equivalent, **Then** the guide documents:
   - Use semantic HTML elements, not divs with click handlers
   - Follow PrimeVue prop naming (`severity`, `size`, `disabled`, `variant`)
   - Include ARIA attributes and keyboard handlers
   - Use `focus-visible:` for focus rings, `motion-safe:` for transitions

## Tasks / Subtasks

- [x] Task 1: Create `docs/component-addition-guide.md` (AC: #1, #2)
  - [x] 1.1 Write the PrimeVue wrapper component pattern section with step-by-step checklist
  - [x] 1.2 Write the custom Tailwind component pattern section with step-by-step checklist
  - [x] 1.3 Include code snippets derived from existing DsButton (PrimeVue wrapper) as the reference implementation
  - [x] 1.4 Include a code snippet skeleton for custom Tailwind components showing semantic HTML, ARIA, keyboard handling, `focus-visible:`, `motion-safe:`
  - [x] 1.5 Document the barrel export pattern (`src/components/DsX/index.ts` + `src/index.ts`)
  - [x] 1.6 Document the AI KB entry pattern (`docs/ai-guidelines/ds-x.md`) with template structure
  - [x] 1.7 Document the Storybook story pattern with required story variants (default, all sizes, all severities/variants, disabled, light/dark)
  - [x] 1.8 Document the Vitest test pattern with required coverage (rendering, prop variations, accessibility attributes, slot rendering)

- [x] Task 2: Update `README.md` to reference the guide (AC: #1, #2)
  - [x] 2.1 Add a "Adding Components" section to README.md linking to `docs/component-addition-guide.md`

- [x] Task 3: Validate documentation accuracy (AC: #1, #2)
  - [x] 3.1 Verify all file paths mentioned match actual project structure
  - [x] 3.2 Verify code snippets are consistent with existing component patterns (DsButton, DsIcon, DsLink, etc.)
  - [x] 3.3 Run `npm run build` and `npm test` to confirm no regressions (documentation-only story, but verify project health)

## Dev Notes

### Architecture Requirements

From architecture document, "Implementation Patterns & Consistency Rules" and "Process Patterns":

**Component Directory Pattern (every component follows this):**
```
src/components/DsX/
  DsX.vue          # Component implementation
  DsX.stories.ts   # Storybook stories
  DsX.test.ts      # Vitest tests
  index.ts          # Re-export for clean imports
```

**Component Implementation Checklist (enforced order):**
1. Create component directory with all files
2. Implement `.vue` file with PrimeVue wrapper or custom Tailwind
3. Add TypeScript prop types
4. Verify light + dark theme rendering
5. Write Storybook stories covering all variants/states
6. Write Vitest tests
7. Add AI KB markdown entry
8. Export from barrel `index.ts`

**Naming Conventions:**
- Component directories: PascalCase — `DsButton/`
- Vue files: PascalCase — `DsButton.vue`
- Story files: PascalCase — `DsButton.stories.ts`
- Test files: PascalCase — `DsButton.test.ts`
- Theme/token files: kebab-case — `ds-preset.ts`
- AI KB files: kebab-case — `ds-button.md`
- All components prefixed with `Ds`

**Enforcement Rules (from architecture):**
- Use `inheritAttrs: false` + `v-bind="$attrs"` for PrimeVue wrappers
- Never hardcode color hex values — always use design tokens from preset
- TypeScript types for all props (generic syntax with `defineProps<T>()`)
- PascalCase in templates: `<DsButton>` not `<ds-button>`
- No external composables, no state management, no global CSS
- No `scoped` styles that fight PrimeVue's **token** system — however, `<style scoped>` IS used in practice for component-specific CSS (e.g., loading overlays, transitions in DsButton.vue). The anti-pattern only applies to scoped styles that override PrimeVue design token custom properties.

### Existing Components as Reference

5 components exist following identical patterns:

| Component | Type | Key Pattern |
|-----------|------|-------------|
| DsButton | PrimeVue wrapper | Full severity/size mapping, `dt` prop for size tokens, loading overlay |
| DsIcon | Custom presentational (uses `<i>` tag) | Icon name/size/color props, uses PrimeVue icon classes — not interactive, lighter a11y requirements |
| DsIconButton | PrimeVue wrapper | Composes DsIcon inside DsButton (only cross-component import) |
| DsInputText | PrimeVue wrapper | v-model support, size/disabled/invalid props |
| DsLink | PrimeVue wrapper | Anchor element, severity/size variants |

**PrimeVue wrapper pattern (from DsButton.vue):**
- Import PrimeVue component: `import Button from 'primevue/button'`
- Define interface: `export interface DsButtonProps { ... }`
- `defineOptions({ inheritAttrs: false })`
- `withDefaults(defineProps<DsButtonProps>(), { ... })`
- Computed mappers to translate DS props → PrimeVue props
- Template: `<Button v-bind="$attrs" :severity="mapped" ...>`

**Barrel export pattern (from `src/components/DsButton/index.ts`):**
```ts
export type { DsButtonProps } from './DsButton.vue';
export { default as DsButton } from './DsButton.vue';
```

**Root barrel pattern (from `src/index.ts`):**
```ts
export { DsButton, type DsButtonProps } from './components/DsButton';
```

**AI KB entry pattern (from `docs/ai-guidelines/ds-button.md`):**
- Sections: When to Use, Import, Props table, Variants, Sizes, States, Accessibility, Common Patterns, Gotchas
- Uses `@failwin/desing-system-vue` import path

### Custom Tailwind Component Requirements (from PRD FR29 + UX spec)

Custom **interactive** components (no PrimeVue equivalent) must:
- Use semantic HTML (`<button>`, `<a>`, `<input>`) — NOT divs with click handlers
- Follow PrimeVue prop naming: `severity`, `size`, `disabled`, `loading`, `variant` (architecture includes `loading` — document it even though epics AC omits it)
- Include ARIA attributes for accessibility
- Implement keyboard handlers (Enter, Space for buttons; Escape for dismissible)
- Use `focus-visible:` for focus ring styling
- Use `motion-safe:` prefix for transitions/animations
- Feel indistinguishable from PrimeVue wrappers to consumers (uniform API)

Custom **presentational** components (e.g., DsIcon) have lighter requirements — no keyboard handlers or interactive ARIA needed, but must still follow naming conventions, prop patterns, and the full file structure.

### Current Project State

- README.md is minimal (just Figma links) — needs project overview + guide reference
- No `docs/component-addition-guide.md` exists — create from scratch
- All 5 components + AI KB entries + Storybook stories + tests exist as real examples
- 171 tests pass, Biome clean, build succeeds
- Package: `@failwin/desing-system-vue` (scoped, public)

### Anti-Patterns to Avoid

- Do NOT modify any source code files (`.vue`, `.ts`, `.test.ts`, `.stories.ts`) — this is documentation only
- Do NOT create example/template component files — use code snippets in the markdown guide
- Do NOT duplicate the full architecture document — reference it and summarize the actionable patterns
- Do NOT add tooling or scripts — the guide is purely documentation
- Do NOT use the `lint` npm script as the canonical lint command in docs — use `npx biome check ./src ./.storybook` which covers all source

### Key Dependencies & Versions (for documentation accuracy)

- **Vue 3** + Composition API (`<script setup>`)
- **PrimeVue 4.x** — Styled Mode with `definePreset()`
- **Tailwind CSS 4.x** — utility classes
- **Biome 2.x** — linter/formatter
- **Vitest 4.x** — test runner
- **Storybook 10.x** — documentation
- **vite-plugin-dts 4.5.x** — TypeScript declarations

### Previous Story Intelligence

**From Story 5.1 (CI/CD Pipeline Setup):**
- Clean implementation with no issues
- 3 GitHub Actions workflows created (test.yml, publish.yml, storybook.yml)
- All validations passed: 171 tests, Biome clean, build succeeds
- CI runs `npx biome check ./src ./.storybook` (not `npm run lint`)
- No source code changes in 5.1

### Git Intelligence

Recent commits (master):
- `f1ac084` story 5.1 (CI/CD pipeline setup — 3 workflow files)
- `2b220d4` story 4.2 (per-component AI KB entries)
- `f3aae9c` story 4.1 (AI KB structure & component index)
- `3cd836a` story 3.4 (composed layout example pages)
- `610a484` story 3.3 (component stories with interactive controls)

Epic 5 is in-progress. Story 5.1 is done. This is the final story before the epic-5-retrospective.

### Project Structure Notes

- `docs/component-addition-guide.md` is a new file in the existing `docs/` directory
- `README.md` exists at project root — will be updated, not replaced
- No conflicts with architecture — FR28/FR29 explicitly require this documentation
- File is not published to npm (not under `src/`, not in `files` array)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.2] — Acceptance criteria and user story
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules] — Naming, structure, process patterns
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries] — Directory structure, boundaries
- [Source: _bmad-output/planning-artifacts/prd.md#FR28-FR29] — Repeatable component addition patterns
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md] — Custom Tailwind component requirements, accessibility
- [Source: src/components/DsButton/DsButton.vue] — Reference PrimeVue wrapper pattern
- [Source: src/components/DsButton/index.ts] — Barrel export pattern
- [Source: src/index.ts] — Root barrel export pattern
- [Source: docs/ai-guidelines/ds-button.md] — AI KB entry pattern
- [Source: _bmad-output/implementation-artifacts/5-1-cicd-pipeline-setup.md] — Previous story learnings

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log References
None — documentation-only story, no debugging needed.

### Completion Notes List
- Created `docs/component-addition-guide.md` with comprehensive 8-step checklist covering both PrimeVue wrapper and custom Tailwind component patterns
- Guide includes code snippets derived from actual DsButton implementation (PrimeVue wrapper pattern) and a custom Tailwind skeleton with semantic HTML, ARIA, keyboard handling, focus-visible, motion-safe
- Documents barrel export, AI KB entry, Storybook story, and Vitest test patterns with templates
- Includes quick reference checklist and anti-patterns section
- Updated README.md with "Adding Components" section linking to the guide, added brief project description
- All file paths verified against actual project structure
- Build succeeds, 171 tests pass, no regressions

### Change Log
- 2026-04-05: Created component addition guide and updated README (Story 5.2)

### File List
- docs/component-addition-guide.md (new)
- README.md (modified)
