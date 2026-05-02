# Project Instructions

## What this is

Vue 3 design system component library published as `@failwin/desing-system-vue`. Built on PrimeVue 4 wrappers + Tailwind CSS 4, themed with a custom `dsPreset` mapped from Figma tokens. Components are stateless, self-contained, and consumed via tree-shakeable barrel exports from `src/index.ts`.

Stack: Vite (lib build), vue-tsc, Vitest + jsdom + @vue/test-utils, Storybook 10, Biome (lint + format), Husky + lint-staged.

## Key locations

- `src/components/Ds*/` — one directory per component, four files each (`.vue`, `.stories.ts`, `.test.ts`, `index.ts`).
- `src/theme/ds-preset.ts` — PrimeVue theme preset; the source of truth for design tokens.
- `src/index.ts` — public API barrel. Every exported component must be added here.
- `docs/component-addition-guide.md` — **read this before adding or significantly modifying a component.** It defines the canonical patterns (PrimeVue wrapper vs. custom Tailwind), required tests, required stories, and the anti-patterns list.
- `docs/ai-guidelines/` — per-component usage docs for AI consumers (Figma-layer → component mapping, prop tables, examples). Update the relevant file when component props change, and `index.md` when adding a new component.
- `docs/figma-variables.md` — Figma token reference.

## Commands

- `npm run dev` — Vite dev server.
- `npm run storybook` — Storybook on port 6006 (the primary visual dev/test surface).
- `npm test` — Vitest single run.
- `npm run lint` — `biome check ./src` (read-only). Use `npx biome check --write ./src` to auto-fix.
- `npm run build` — `vue-tsc --noEmit` then Vite library build. Must pass before declaring component work done.
- `npm run svg-optimize` / `svg-optimize:one` (with `--icon=name`) — run after adding or replacing icon SVGs in `src/assets/icons/`.

After component work, the validation triple is: `npm run build && npm test && npm run lint`.

## Conventions

- Component naming: `DsX` (PascalCase, `Ds` prefix). Always import as `<DsX>` in templates — never kebab-case.
- Props: exported TS interface in `<script setup>`, `withDefaults(defineProps<DsXProps>(), { ... })`, JSDoc on every prop including the default. No runtime array/object prop syntax.
- Every component: `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` on the root element.
- Theming: never hardcode hex colors and never use `<style scoped>` to override PrimeVue design token CSS variables — override per-instance via the `:dt="..."` prop instead. Scoped styles are fine for component-specific structural CSS (overlays, transitions).
- Components are stateless and self-contained — no Pinia/Vuex, no shared composables, no cross-component imports (exception: composing primitives like `DsIconButton` using `DsIcon`).
- Biome formatter: single quotes, 2-space indent, 100-char line width. Lint-staged runs `biome check --write` on commit.

## Generated and temporary files

Place everything generated, scratch, or experimental under `./tmp/`. Don't drop scratch files in `src/`, `docs/`, or the project root.

## When in doubt

`docs/component-addition-guide.md` is the source of truth for component patterns; `docs/ai-guidelines/index.md` is the source of truth for the public API surface and Figma-layer mappings. If they disagree with this file, those win.
