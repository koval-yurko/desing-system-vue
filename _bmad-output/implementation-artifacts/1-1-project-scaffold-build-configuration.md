# Story 1.1: Project Scaffold & Build Configuration

Status: done

## Story

As a library maintainer,
I want a fully configured Vue 3 + TypeScript project with Vite library mode, Biome, and all dependencies installed,
So that I have a working foundation to build components on.

## Acceptance Criteria

1. **Given** an empty directory, **When** the project is scaffolded with `npm create vite@latest desing-system-vue -- --template vue-ts`, **Then** the project initializes with Vue 3 + TypeScript base files.

2. **Given** the scaffolded project, **When** dependencies are installed, **Then** the following are present in `package.json`:
   - PrimeVue 4.5.x (`primevue`, `@primeuix/themes`)
   - Tailwind CSS 4 (`tailwindcss`, `@tailwindcss/vite`)
   - Vitest 4 + @vue/test-utils
   - Biome 2 (`@biomejs/biome`)
   - vite-plugin-dts 4.5.x

3. **Given** Vite is configured in library mode, **When** `npm run build` runs, **Then**:
   - ESM output is produced in `dist/`
   - Vue 3 and PrimeVue are externalized (peer dependencies, not bundled)
   - Entry point is `src/index.ts`

4. **Given** TypeScript is configured, **When** the project compiles, **Then**:
   - `tsconfig.json` has strict mode enabled
   - `tsconfig.build.json` excludes `*.stories.ts` and `*.test.ts` from declaration output

5. **Given** Biome is configured, **When** `biome check` runs, **Then** it passes with no errors on the initial project files.

6. **Given** the barrel export exists, **When** `src/index.ts` is inspected, **Then** it exists (empty, ready for component exports).

7. **Given** the build completes, **When** `dist/` is inspected, **Then** ESM output and `.d.ts` declaration files are generated.

## Tasks / Subtasks

- [x] Task 1: Scaffold the Vite project (AC: #1)
  - [x] 1.1 Run `npm create vite@latest desing-system-vue -- --template vue-ts` in a temp location, then move files into project root (preserving existing `.git`, `docs/`, `_bmad*/`, `.claude/`)
  - [x] 1.2 Remove Vite scaffold demo files: `src/App.vue`, `src/style.css`, `src/assets/`, `src/components/HelloWorld.vue`
  - [x] 1.3 Clean up `index.html` (keep minimal — needed for Vite dev server but NOT published)

- [x] Task 2: Install all required dependencies (AC: #2)
  - [x] 2.1 Install production dependencies: `primevue@^4.5`, `@primeuix/themes`
  - [x] 2.2 Install dev dependencies: `tailwindcss@^4`, `@tailwindcss/vite`, `vitest@^4`, `@vue/test-utils`, `@biomejs/biome@^2`, `vite-plugin-dts@^4.5`
  - [x] 2.3 Configure `peerDependencies` in `package.json`: `vue@^3.0.0`, `primevue@^4.0.0`
  - [x] 2.4 Set `package.json` fields: `name: "@failwin/desing-system-vue"`, `type: "module"`, `exports`, `types`, `files: ["dist"]`

- [x] Task 3: Configure Vite library mode (AC: #3, #7)
  - [x] 3.1 Update `vite.config.ts` with library mode entry `src/index.ts`, ESM format output
  - [x] 3.2 Configure `rollupOptions.external` for `vue` and `primevue/*` and `@primeuix/*`
  - [x] 3.3 Add `vite-plugin-dts` plugin for `.d.ts` generation
  - [x] 3.4 Add `@tailwindcss/vite` plugin
  - [x] 3.5 Add `@vitejs/plugin-vue` (already from scaffold)

- [x] Task 4: Configure TypeScript (AC: #4)
  - [x] 4.1 Verify `tsconfig.json` has `"strict": true`
  - [x] 4.2 Create `tsconfig.build.json` extending `tsconfig.json` with `exclude: ["**/*.stories.ts", "**/*.test.ts", "**/*.spec.ts"]`

- [x] Task 5: Configure Biome (AC: #5)
  - [x] 5.1 Run `npx @biomejs/biome init` to generate `biome.json`
  - [x] 5.2 Configure formatter (indent: 2 spaces, line width: 100) and linter rules
  - [x] 5.3 Add `"check"` script to `package.json`: `"lint": "biome check ./src"`
  - [x] 5.4 Remove any ESLint/Prettier config files from Vite scaffold if present

- [x] Task 6: Create project structure and barrel export (AC: #6)
  - [x] 6.1 Create `src/index.ts` (empty barrel — placeholder comment)
  - [x] 6.2 Create directory stubs: `src/components/`, `src/theme/`
  - [x] 6.3 Add npm scripts: `"build"`, `"test"`, `"lint"`, `"dev"`

- [x] Task 7: Validate build (AC: #3, #7)
  - [x] 7.1 Run `npm run build` — must complete successfully
  - [x] 7.2 Verify `dist/` contains ESM output
  - [x] 7.3 Run `biome check` — must pass with no errors
  - [x] 7.4 Run `npm run test` — must pass (no tests yet, but runner works)

## Dev Notes

### Critical Technical Details

- **Vite 8 library mode** uses `build.lib.entry` pointing to `src/index.ts`. Formats default to `es` + `umd` for single entry. We only need `es` — set `build.lib.formats: ['es']`.
- **Externals pattern for Vite 8**: Use `rollupOptions.external` with array/regex. Must externalize `vue`, all `primevue/**` subpaths, and `@primeuix/**` to prevent bundling peer deps.

```ts
// vite.config.ts pattern
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue(), dts({ tsconfigPath: './tsconfig.build.json' }), tailwindcss()],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue', /^primevue\//, /^@primeuix\//],
    },
  },
})
```

- **PrimeVue 4.x theme imports** changed: themes are now in `@primeuix/themes` package (not `@primevue/themes`). The `definePreset` utility is in `@primeuix/themes`. Import pattern:
  ```ts
  import { definePreset } from '@primeuix/themes'
  import Aura from '@primeuix/themes/aura'
  ```

- **Tailwind CSS 4** uses the Vite plugin `@tailwindcss/vite` — no `tailwind.config.js` needed. Config is done via CSS `@import "tailwindcss"` in a CSS file.

- **Biome 2** replaces ESLint + Prettier. The Vite vue-ts template may include ESLint config — **remove it**. Run `npx @biomejs/biome init` to generate `biome.json`. Biome 2.2.x supports Vue SFC files natively. Key commands: `biome check ./src` (lint + format check), `biome check --write ./src` (auto-fix).

- **vite-plugin-dts** must point to `tsconfig.build.json` (not `tsconfig.json`) to exclude stories/tests from declaration output.

- **Package.json exports field** pattern:
  ```json
  {
    "name": "@failwin/desing-system-vue",
    "type": "module",
    "exports": {
      ".": {
        "import": "./dist/index.js",
        "types": "./dist/index.d.ts"
      }
    },
    "types": "./dist/index.d.ts",
    "files": ["dist"],
    "peerDependencies": {
      "vue": "^3.0.0",
      "primevue": "^4.0.0"
    }
  }
  ```

### Scaffold Merge Strategy

The project root already contains: `.git/`, `.gitignore`, `Readme.md`, `docs/`, `_bmad/`, `_bmad-output/`, `.claude/`, `Design Systems.fig`. The Vite scaffold must be merged carefully:
1. Scaffold into a temp directory
2. Copy scaffold files (`package.json`, `tsconfig.json`, `vite.config.ts`, `src/`, `index.html`) into project root
3. Do NOT overwrite `.gitignore` — merge entries (add `dist/`, `node_modules/`)
4. Do NOT overwrite `Readme.md` — keep existing
5. Delete scaffold demo files after copying

### Anti-Patterns to Avoid

- Do NOT use `scoped` styles — they fight PrimeVue's token system
- Do NOT add ESLint or Prettier — Biome replaces both
- Do NOT create a `tailwind.config.js` — Tailwind CSS 4 uses the Vite plugin
- Do NOT add Pinia/Vuex — this is a stateless component library
- Do NOT create shared utilities or composables directories
- Do NOT use runtime prop validators — TypeScript types only (build-time)
- Do NOT bundle Vue or PrimeVue — they must be externals/peerDependencies

### Project Structure After This Story

```
desing-system-vue/
├── dist/                    # Build output (gitignored)
├── node_modules/            # Dependencies (gitignored)
├── src/
│   ├── components/          # Empty, ready for components
│   ├── theme/               # Empty, ready for ds-preset.ts
│   └── index.ts             # Empty barrel export
├── docs/                    # Existing — figma-variables.md
├── biome.json               # Biome config
├── index.html               # Vite dev entry (not published)
├── package.json             # @failwin/desing-system-vue
├── tsconfig.json            # Strict TypeScript
├── tsconfig.build.json      # Build config (excludes tests/stories)
├── vite.config.ts           # Library mode + plugins
└── .gitignore               # Updated with dist/, node_modules/
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.1] — Acceptance criteria and user story
- [Source: _bmad-output/planning-artifacts/architecture.md#Starter Template Evaluation] — Vite scaffold command, dependency list
- [Source: _bmad-output/planning-artifacts/architecture.md#Core Architectural Decisions] — Library mode, single barrel export, co-located pattern
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries] — Complete directory structure
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns] — Naming, structure, enforcement rules
- [Source: docs/figma-variables.md] — Design token reference (not needed for this story, but tokens will be consumed in Story 1.2)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Vitest exits code 1 with no test files — resolved by adding `--passWithNoTests` flag to test script
- Biome auto-fix applied to vite.config.ts (import sorting, semicolons) and package.json/tsconfig.json (formatting)

### Completion Notes List

- Scaffolded Vite vue-ts template into temp dir, merged into existing project root preserving .git, docs/, _bmad*/, .claude/
- Removed all demo files (App.vue, style.css, main.ts, assets/, components/HelloWorld.vue)
- Installed all production deps (primevue@4.5.4, @primeuix/themes@2.0.3) and dev deps (tailwindcss@4, biome@2, vitest@4, vite-plugin-dts@4.5, @vue/test-utils)
- Configured package.json: @failwin/desing-system-vue, ESM exports, peerDependencies, files field
- Configured Vite library mode: ESM-only output, vue/primevue/@primeuix externalized, vite-plugin-dts with tsconfig.build.json
- TypeScript strict mode confirmed via tsconfig.app.json; created tsconfig.build.json excluding stories/tests/specs
- Biome 2 configured: 2-space indent, 100 line width, single quotes, recommended lint rules, import sorting
- Created src/index.ts (empty barrel), src/components/, src/theme/ directory stubs
- All validations pass: `npm run build` produces dist/index.js + dist/index.d.ts, `biome check` clean, `npm run test` passes

### File List

- .gitignore (modified — added dist-ssr/, editor ignores)
- .vscode/ (new — from Vite scaffold)
- biome.json (new — Biome 2 config)
- index.html (new — minimal Vite dev entry)
- package.json (new — @failwin/desing-system-vue with all deps)
- package-lock.json (new — lockfile)
- src/index.ts (new — empty barrel export)
- src/components/ (new — empty directory stub)
- src/theme/ (new — empty directory stub)
- tsconfig.json (new — project references)
- tsconfig.app.json (new — strict TS for app code)
- tsconfig.build.json (new — excludes tests/stories from declarations)
- tsconfig.node.json (new — TS for vite config)
- vite.config.ts (new — library mode + plugins)

### Change Log

- 2026-03-27: Story 1.1 implemented — Full project scaffold with Vue 3 + TypeScript + Vite 8 library mode + PrimeVue 4.5 + Tailwind CSS 4 + Biome 2 + Vitest 4
- 2026-03-28: Post-review fixes — Fixed bare `primevue` externalization regex, removed misleading `main`/`module` fields, fixed `sideEffects` for CSS preservation, added `engines` field (Node >= 20.11), added Vitest jsdom environment, cleaned up .claude/settings.json
