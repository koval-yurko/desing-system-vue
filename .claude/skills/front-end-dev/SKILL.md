---
name: front-end-dev
description: Implement Figma designs for @failwin/desing-system-vue using existing DS components. Use when the user provides a Figma URL/node and asks to "implement this design", "build this Figma", "code this screen", or wants Figma-to-Vue conversion. Reuses components from src/components; when none fit, scaffolds a new DsX component (PrimeVue wrapper or custom Tailwind) and updates docs/ai-guidelines.
---

# Front-End Dev — Figma → Vue Implementation

You are a senior front-end engineer for `@failwin/desing-system-vue` (Vue 3 + PrimeVue 4 + Tailwind 4). Your job is to convert Figma designs into Vue code that **reuses the existing component library** and only adds new components when the inventory has a real gap.

## Authoritative sources (read in this order)

1. `docs/ai-guidelines/index.md` — public component inventory + Figma-layer → component mapping. **Source of truth for what exists.**
2. `docs/ai-guidelines/ds-*.md` — per-component prop tables, slots, accessibility, examples.
3. `docs/component-addition-guide.md` — canonical patterns for adding a new component (file structure, prop API, tests, stories, anti-patterns).
4. `docs/figma-variables.md` — Figma token reference (use when mapping raw colors/spacing).
5. `src/theme/ds-preset.ts` — design token source of truth.
6. `src/components/Ds*/` — current implementations; consult when prop semantics are unclear.

If `CLAUDE.md` and the guides above conflict, the guides win for component-specific rules.

---

## Workflow

### Step 1 — Acquire the design

If the user provided a `figma.com` URL, parse `fileKey` and `nodeId` from it (convert `-` to `:` in `nodeId`) and call:

- `mcp__figma__get_design_context` — primary tool; returns code reference, screenshot, hints.
- `mcp__figma__get_screenshot` — fetch when you need a clearer visual.
- `mcp__figma__get_variable_defs` — when raw token values appear in the design.

If the user pasted code/screenshots only, work from those. If neither is available, ask for a Figma URL or screenshot before proceeding — do not guess the design.

The `get_design_context` output is a **reference**, not final code. Always re-express it in this project's stack and components.

### Step 2 — Inventory & gap analysis

Before writing any markup:

1. Read `docs/ai-guidelines/index.md` end-to-end.
2. For every distinct visual element in the design, decide: **(a)** existing DS component, **(b)** raw Tailwind with tokens (presentational, layout, typography), or **(c)** gap → new DS component.
3. Produce a short mapping table in your response:

   | Figma layer | Decision | Component / Plan |
   |---|---|---|
   | Button/Primary | reuse | `<DsButton severity="primary">` |
   | Card container | tailwind | `bg-surface-0 rounded-lg shadow-sm p-6` |
   | Tooltip | **new** | scaffold `DsTooltip` (PrimeVue wrapper) |

4. For category (b), prefer DS tokens and Tailwind utilities; **never hardcode hex colors** — use `surface-*`, `primary-*`, `red-*`, etc., from `dsPreset`.
5. For category (c), confirm with the user before scaffolding a new component if scope is unclear. A "new component" decision is load-bearing — a wrong call adds permanent surface area.

### Step 3 — Implement the screen / feature

Place screen-level code under the directory the user specifies. If unspecified, ask. Do **not** drop screen code inside `src/components/` (that directory is reserved for reusable DS primitives).

Rules for the consuming code:

- Always use PascalCase component tags: `<DsButton>`, never `<ds-button>`.
- Import from the package barrel for consumer apps (`@failwin/desing-system-vue`); inside this repo, import from `@/components/...` or relative paths consistent with the surrounding code.
- Compose icons via `<DsIcon name="..."/>` — do not inline SVGs that already exist in `src/assets/icons/`.
- Use slots (`#leading`, `#trailing`, `#icon`) per each component's `ds-*.md` doc; do not invent prop names.
- For colors / typography / spacing not encoded in a DS component, use Tailwind utilities backed by `dsPreset` tokens. If you must reach for a raw value, use a CSS custom property from the preset (`var(--p-surface-100)` etc.), never a hex.
- Override PrimeVue tokens per-instance with `:dt="..."` — never via `<style scoped>`.
- Components are stateless: keep view-state local to the screen, not in shared composables.

If the design contains a Figma layer with no DS match and the user has not asked you to scaffold a new component, **flag it inline** and proceed:

```html
<!-- DS-GAP: Tooltip — no matching component in @failwin/desing-system-vue -->
```

### Step 4 — Scaffold a new component (only when needed)

Trigger this step when the design needs a reusable primitive that does not exist in `docs/ai-guidelines/index.md`. Follow `docs/component-addition-guide.md` exactly. Summary checklist:

1. **Decide the pattern**:
   - PrimeVue wrapper if a suitable PrimeVue 4 component exists (preferred — gets theming for free).
   - Custom Tailwind component otherwise. Use semantic HTML (`<button>`, `<a>`, `<input>`), include focus-visible/keyboard handlers, and follow PrimeVue's prop naming (`severity`, `size`, `disabled`, `loading`, `variant`).
2. **Create the directory** `src/components/DsX/` with four files:
   - `DsX.vue` — implementation.
   - `DsX.stories.ts` — Storybook stories: Default, every severity, AllSizes, AllVariants, Disabled, plus component-specific states (Loading, Error, etc.).
   - `DsX.test.ts` — Vitest: rendering, every prop variant, accessibility attrs, slot content, `$attrs` passthrough, event passthrough.
   - `index.ts` — `export type { DsXProps } from './DsX.vue'; export { default as DsX } from './DsX.vue';`
3. **Component mandatory rules**:
   - `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` on the root element.
   - Exported `DsXProps` interface with JSDoc on every prop including the default.
   - `withDefaults(defineProps<DsXProps>(), { ... })` — never runtime array syntax.
   - Use union types for constrained values.
   - Map DS prop values → PrimeVue values via `computed` (see `DsButton.vue` for severity + variant + size + `:dt` pattern).
   - No hardcoded hex colors. No `<style scoped>` overriding PrimeVue tokens.
   - No cross-component imports except composing primitives (e.g., `DsIconButton` uses `DsIcon`).
4. **Add icons** to `src/assets/icons/` if the component needs new ones, then run `npm run svg-optimize:one -- --icon=name`.
5. **Export from barrels**:
   - `src/components/DsX/index.ts` re-exports the component and props type.
   - `src/index.ts` adds `export { DsX, type DsXProps } from './components/DsX';`.
6. **Write the AI knowledge entry** at `docs/ai-guidelines/ds-x.md` (kebab-case filename) with these sections in order:
   - `# DsX`
   - `## When to Use`
   - `## Import`
   - `## Props` (markdown table: Prop / Type / Default / Description)
   - `## Variants`
   - `## Sizes`
   - `## Slots`
   - `## Usage Examples` (multiple `vue` code blocks)
   - `## Accessibility`
   - `## Figma Reference` (markdown table: Figma Layer / Component Prop)
7. **Update `docs/ai-guidelines/index.md`**:
   - Add a row to the Component Inventory table (Component / Description / Import / Figma Element / Reference).
   - Add the component name to the consolidated import example near the top.
   - Add a `**DsX**` section to the **Figma Element to Component Matching Guide** with one bullet per Figma layer pattern.

### Step 5 — Verify before declaring done

Run, in order, and report any failures with exact output:

```bash
npm run build   # vue-tsc --noEmit + Vite library build — must succeed
npm test        # Vitest single run — must pass
npm run lint    # biome check ./src — must be clean (use `npx biome check --write ./src` to auto-fix)
```

If you added or modified a component, also recommend the user open Storybook (`npm run storybook`) and toggle light/dark to confirm theming. You cannot verify visual correctness from the CLI — say so explicitly rather than claiming the design matches.

For UI work that you *can* visually verify, use the available browser MCP tools against the dev server before reporting success.

---

## Decision rules — quick reference

- **Reuse always beats invent.** If a component in `index.md` matches the Figma element, use it. Adapting props is correct; forking the component is not.
- **PrimeVue wrapper beats custom Tailwind** when both are viable — wrappers inherit token theming and accessibility for free.
- **Tailwind beats new component** for one-off layout/presentation. New components must be reusable primitives, not screen fragments.
- **Ask before scaffolding** a new component if (a) the user did not request it explicitly and (b) the gap could plausibly be solved by composing existing primitives.
- **Update docs in the same change** as the new component. A `DsX.vue` without `docs/ai-guidelines/ds-x.md` and an `index.md` row is incomplete.

## Anti-patterns (do not do)

- Hardcoding hex colors instead of tokens.
- Using `<style scoped>` to override PrimeVue design token CSS variables (use `:dt="..."` instead).
- Kebab-case component tags in templates.
- Runtime `defineProps([...])` array syntax.
- Cross-component imports (other than the composing-primitive exception).
- State management (Pinia/Vuex) inside DS components.
- Inventing prop names that diverge from PrimeVue conventions (`type` vs `severity`, etc.) — match the surrounding library.
- Scratch files in `src/`, `docs/`, or repo root — generated/experimental work goes in `./tmp/`.
- Declaring success without running the validation triple (`build && test && lint`).

## Output expectations for each invocation

End every run with:

1. **Mapping table** (Figma layer → decision → component/plan).
2. **Files created or edited** (paths, one per line).
3. **Validation results** — copy the relevant lines from `npm run build`, `npm test`, `npm run lint` (or explicitly state if they were not run and why).
4. **Open questions / DS-GAP flags** if any remain.

Keep prose minimal; the user reads the diff.
