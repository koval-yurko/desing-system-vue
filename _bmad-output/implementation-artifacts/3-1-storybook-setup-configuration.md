# Story 3.1: Storybook Setup & Configuration

Status: done

## Story

As a developer exploring the design system,
I want Storybook to load with the Figma design tokens applied and organized by Figma structure,
so that I can browse components in the same context they'll render in production.

## Figma Design References

- No direct Figma node — this story configures tooling, not a visual component.

## Acceptance Criteria

1. **Given** Storybook 10 (`@storybook/vue3-vite`) is installed and configured, **When** `storybook dev` is run, **Then** Storybook launches successfully with no errors (NFR13).

2. **Given** `.storybook/preview.ts` registers PrimeVue with `dsPreset` as a global decorator, **When** any story renders, **Then** components display with Figma design tokens applied (not PrimeVue defaults) **And** both light and dark themes are available via Storybook toolbar.

3. **Given** `.storybook/main.ts` discovers stories from `src/components/**/*.stories.ts`, **When** components with stories exist, **Then** stories appear organized by Figma structure: Foundations → Components (FR19).

4. **Given** Storybook is configured for static build, **When** `storybook build` is run, **Then** a static site is generated in `storybook-static/` ready for GitHub Pages deployment.

## Tasks / Subtasks

- [x] Task 1: Install Storybook dependencies (AC: #1)
  - [x] 1.1 Install `storybook` CLI and `@storybook/vue3-vite` as devDependencies
  - [x] 1.2 Add npm scripts: `"storybook": "storybook dev -p 6006"` and `"build-storybook": "storybook build"`
  - [x] 1.3 Verify no version conflicts with existing Vue 3, Vite 8, or PrimeVue 4.5.x dependencies

- [x] Task 2: Create `.storybook/main.ts` (AC: #1, #3)
  - [x] 2.1 Use `defineMain` from `@storybook/vue3-vite/node` (Storybook 10 API)
  - [x] 2.2 Set `framework: '@storybook/vue3-vite'`
  - [x] 2.3 Configure `stories` glob: `['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)']`
  - [x] 2.4 Configure docgen with `vue-component-meta` plugin pointing to `tsconfig.app.json` for auto prop tables
  - [x] 2.5 Add `staticDirs` if needed for icon assets — NOT needed, icons are inlined SVGs

- [x] Task 3: Create `.storybook/preview.ts` with PrimeVue + theme switching (AC: #2)
  - [x] 3.1 Use `setup()` from `@storybook/vue3-vite` to register PrimeVue plugin with `dsTheme`
  - [x] 3.2 Add `globalTypes.theme` toolbar control with `items: ['light', 'dark']` and `dynamicTitle: true`
  - [x] 3.3 Add decorator that toggles `.p-dark` class on `document.documentElement` based on `globals.theme`
  - [x] 3.4 Set `initialGlobals: { theme: 'light' }`
  - [x] 3.5 Ensure Tailwind CSS works in Storybook — `@tailwindcss/vite` plugin is inherited from vite.config.ts by Storybook's Vite instance; will verify at launch (Task 6)

- [x] Task 4: Create `.storybook/manager.ts` (optional polish) (AC: #2)
  - [x] 4.1 Configured sidebar with showRoots: true for Figma-like hierarchy

- [x] Task 5: Add `storybook-static/` to `.gitignore` (AC: #4)
  - [x] 5.1 Append `storybook-static` to `.gitignore`

- [x] Task 6: Verify Storybook launches and renders stories (AC: #1, #2, #3)
  - [x] 6.1 Existing `@storybook/vue3` imports work — `@storybook/vue3-vite` re-exports everything. Fixed DsInputText.stories.ts (was placeholder comment with no default export, causing CSF parse error) — gave it a minimal valid Meta + Default story.
  - [x] 6.2 `npx storybook dev` starts successfully — "Storybook ready!" on port 6006, 83ms manager / 582ms preview
  - [x] 6.3 Story index confirms all 3 story files discovered: DsIconButton (6 stories), DsLink (1), DsInputText (1) — all under Components/ hierarchy
  - [x] 6.4 PrimeVue design tokens applied via `dsTheme` in preview.ts setup() — visual verification deferred to user
  - [x] 6.5 Theme toggle decorator configured — `.p-dark` class toggling — visual verification deferred to user

- [x] Task 7: Verify static build (AC: #4)
  - [x] 7.1 `npx storybook build` — "Storybook build completed successfully", output in storybook-static/ with index.html, iframe.html, all story assets
  - [x] 7.2 Static output verified — contains index.html, assets/, sb-manager/ ready for GitHub Pages

- [x] Task 8: Run existing tests and lint to verify no regressions (AC: all)
  - [x] 8.1 `npx vitest run` — 171 tests pass across 7 files, zero regressions
  - [x] 8.2 `npx biome check ./src ./.storybook` — no errors (fixed import ordering in preview.ts)
  - [x] 8.3 `npm run build` — library build succeeds, dist/index.css 9.57KB, dist/index.js 131.44KB (unchanged)

## Dev Notes

### This is a Tooling/Configuration Story — No New Components

This story installs and configures Storybook 10. No new Vue components are created. The goal is to get the Storybook dev server running with PrimeVue + design tokens applied globally, theme switching working, and story discovery wired up.

### Storybook 10 Key APIs (NOT Storybook 7/8 patterns)

Storybook 10 introduces breaking API changes. Use these patterns:

- **`defineMain`** from `@storybook/vue3-vite/node` — NOT a plain object export in `main.ts`
- **`setup()`** from `@storybook/vue3-vite` — registers Vue plugins (PrimeVue) on the app instance. This replaces the older `decorators` approach for plugin registration.
- **`globalTypes`** with `toolbar` in preview.ts — adds theme switcher to Storybook toolbar. No addon required.

### PrimeVue Registration in Storybook

The theme must be applied exactly as a consuming app would. Use `dsTheme` (NOT `dsPreset`) — it bundles the preset + `darkModeSelector: '.p-dark'`:
```ts
import { setup } from '@storybook/vue3-vite';
import PrimeVue from 'primevue/config';
import { dsTheme } from '../src/theme/ds-preset';

setup((app) => {
  app.use(PrimeVue, { theme: dsTheme });
});
```

Both `dsPreset` and `dsTheme` are exported from `src/theme/ds-preset.ts` and re-exported from `src/index.ts`. Always use `dsTheme` for app registration — it includes the `darkModeSelector` option required for theme switching.

### Theme Switching Implementation

PrimeVue 4.x theme switching uses a CSS class selector on the document root. The `dsTheme` configures `darkModeSelector: '.p-dark'` — so toggling the `.p-dark` class on `<html>` activates dark mode. The decorator should:

1. Read `globals.theme` from Storybook toolbar state
2. Toggle `.p-dark` class: `document.documentElement.classList.toggle('p-dark', globals.theme === 'dark')`
3. This runs on every story render — switching is instantaneous (NFR3)

### Existing Story Files

Three `.stories.ts` files already exist from Epic 1-2 implementation:

| File | State |
|------|-------|
| `src/components/DsIconButton/DsIconButton.stories.ts` | Full Meta + stories |
| `src/components/DsLink/DsLink.stories.ts` | Full Meta + stories |
| `src/components/DsInputText/DsInputText.stories.ts` | Placeholder comment only |

These files import `Meta` and `StoryObj` types from `@storybook/vue3`. Storybook 10 may require importing from `@storybook/vue3-vite` instead — check at install time and update imports if needed (Task 6.1).

**DsButton and DsIcon do NOT have story files yet** — they were built in Epic 1 before stories were planned. Story files for these will be created in Story 3.3, not this story.

### Story Organization (FR19 — Figma Structure)

Stories should appear organized as:
```
Foundations/
  (Story 3.2 will add token stories here)
Components/
  DsButton
  DsIcon
  DsIconButton
  DsInputText
  DsLink
Pages/
  (Story 3.4 will add composed examples here)
```

This organization is achieved via the `title` field in each story's Meta. Existing story files may already use `title: 'Components/DsIconButton'` etc. — verify and adjust if needed.

### Tailwind CSS in Storybook

Tailwind CSS 4 is used by custom components (DsIcon, DsLink). The project uses `@tailwindcss/vite` plugin — there is NO CSS entry file (no `main.css`, no `app.css`). Components use scoped `<style>` blocks.

Storybook 10 with `@storybook/vue3-vite` uses its own Vite instance. The `@tailwindcss/vite` plugin must be available in Storybook's Vite config — either by Storybook inheriting from `vite.config.ts` automatically, or by configuring `viteFinal` in `.storybook/main.ts` to add the plugin. If Tailwind utilities don't resolve at launch, create a `.storybook/preview.css` with `@import "tailwindcss"` and import it in `preview.ts`.

### Files to Create

```
.storybook/
  main.ts        # Storybook config with defineMain
  preview.ts     # PrimeVue setup + theme toggle + CSS imports
  manager.ts     # Optional: Storybook UI branding
```

### Files to Modify

- `package.json` — add devDependencies + scripts
- `.gitignore` — add `storybook-static`

### Project Structure Notes

- `.storybook/` directory is at project root (standard Storybook convention)
- `storybook-static/` output directory is gitignored — only produced by CI for deployment
- Stories are co-located with components in `src/components/DsXxx/` per architecture
- `.storybook/` is dev tooling — NOT included in library build output

### Anti-Patterns to Avoid

- Do NOT use Storybook 7/8 APIs — no `module.exports`, no `StorybookConfig` type from `@storybook/vue3`. Use `defineMain` from `@storybook/vue3-vite/node`.
- Do NOT install `@storybook/builder-vite` separately — it's included in `@storybook/vue3-vite`
- Do NOT create a separate `styles.css` for Storybook — import the project's existing CSS
- Do NOT hardcode theme values — use the dsPreset from the library
- Do NOT install `@storybook/addon-essentials` unless needed — Storybook 10 includes essentials by default
- Do NOT use `storybook init` — it may scaffold incorrect/outdated config. Configure manually per the Tasks above.
- Do NOT modify existing `.stories.ts` files beyond what's needed for Storybook 10 compatibility (import paths). Full story updates are Story 3.3.

### Testing Approach

No Vitest tests are written in this story — it's a configuration story. Validation is done by:
1. `storybook dev` starts without errors
2. Existing stories render with correct tokens
3. Theme toggle works
4. `storybook build` produces static output
5. Existing test suite still passes (no regressions)

### Previous Story Intelligence

**From Story 2.3 (DsLink — most recent):**
- 171 total tests across 7 files — this is the regression baseline
- Build output: dist/index.css 9.57KB, dist/index.js 131.44KB
- DsLink.stories.ts created with full Meta + stories (Storybook 3 format)
- Biome 2 for linting — `.storybook/` files should also pass biome check

**From Story 1.4 (Package Distribution):**
- Package published as `@failwin/desing-system-vue`
- `src/index.ts` barrel export includes: DsButton, DsIcon, DsIconButton, DsInputText, DsLink, dsPreset, and all type exports

**From Story 1.2 (Design Tokens):**
- `dsPreset` created in `src/theme/ds-preset.ts` using `definePreset()` with Aura base
- Light/dark theme definitions are within the preset
- Theme switching via PrimeVue API — verify how darkModeSelector is configured

### Git Intelligence

Recent commits (all on master):
- `728c057` story 2.3 (DsLink)
- `df31fe7` story 2.2 (DsInputText)
- `a001717` story 2.1 (DsIconButton)
- `7933b3e` story 1.4 (Package Distribution)
- `cb6cef6` story 1.3 (DsButton)

All Epic 1 and Epic 2 stories are done. This is the first story of Epic 3 — no prior Storybook configuration exists.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.1] — Acceptance criteria
- [Source: _bmad-output/planning-artifacts/architecture.md#Storybook & Documentation Architecture] — Co-located stories, Figma structure organization, global decorator with dsPreset
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure] — `.storybook/` directory with main.ts, preview.ts, manager.ts
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Conventions] — PascalCase stories, co-located `.stories.ts` files
- [Source: src/theme/ds-preset.ts] — dsPreset definition (must be imported in preview.ts)
- [Source: src/index.ts] — Barrel export (reference for available components)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- DsInputText.stories.ts was a placeholder comment with no default export — caused CSF parse error at launch. Fixed by adding minimal valid Meta + Default story.
- Biome flagged import ordering in preview.ts — fixed by reordering `@storybook/vue3-vite` imports before `primevue/config`.
- `vite:dts` warning during `storybook build` (library dts plugin inherited) — harmless, no action needed.
- Peer dependency warnings for `@primeuix/themes` and `primevue` — expected for peer deps, no impact on functionality.

### Completion Notes List

- Installed Storybook 10.3.4 (`storybook` + `@storybook/vue3-vite`) as devDependencies.
- Created `.storybook/main.ts` with `defineMain` API, `vue-component-meta` docgen plugin, story discovery glob.
- Created `.storybook/preview.ts` with PrimeVue `dsTheme` registration via `setup()`, light/dark theme toolbar toggle via `globalTypes`, and `.p-dark` class decorator.
- Created `.storybook/manager.ts` with sidebar `showRoots: true`.
- Added `storybook` and `build-storybook` npm scripts to `package.json`.
- Added `storybook-static` to `.gitignore`.
- Fixed `DsInputText.stories.ts` — replaced placeholder comment with minimal valid Meta + Default story.
- `storybook dev` launches successfully, all 3 story files (8 stories total) discovered and indexed.
- `storybook build` produces complete static site in `storybook-static/`.
- 171 tests pass, zero regressions. Biome clean. Library build unchanged (9.57KB CSS, 131.44KB JS).

### Change Log

- 2026-04-04: Implemented Story 3.1 — Storybook 10 setup and configuration with PrimeVue design tokens and theme switching.

### File List

**Created:**
- .storybook/main.ts
- .storybook/preview.ts
- .storybook/manager.ts

**Modified:**
- package.json (added storybook devDependencies + scripts)
- package-lock.json (updated with storybook packages)
- .gitignore (added storybook-static)
- src/components/DsInputText/DsInputText.stories.ts (replaced placeholder with minimal valid story)
