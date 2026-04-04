# Story 2.1: DsIconButton Component

Status: done

## Story

As a developer implementing a Figma design,
I want to use DsIconButton for icon-only buttons with all sizes,
So that icon buttons match the Figma Design System and behave consistently with DsButton.

## Acceptance Criteria

1. **Given** DsIconButton wraps PrimeVue Button using `inheritAttrs: false` + `v-bind="$attrs"`, **When** a developer uses `<DsIconButton size="medium"><DsIcon name="edit" /></DsIconButton>`, **Then** the button renders as an icon-only button at the correct size.

2. **Given** DsIconButton contains DsIcon as a child via default slot (not via props), **When** any DsIcon is passed as slot content, **Then** the icon renders inside the button with flexible icon composition (UX-DR17).

3. **Given** DsIconButton supports 3 sizes (XS, S, M), **When** the `size` prop is set, **Then** the button height and icon size match the uniform size token table (UX-DR15), **And** the button maintains square proportions (width equals height).

4. **Given** DsIconButton implements universal state behavior, **When** the button transitions through states, **Then** it follows the same state priority, transitions (150ms ease), and disabled behavior as DsButton, **And** focus ring is visible using `focus-visible:`, **And** disabled state uses opacity 0.5 with `aria-disabled="true"`.

5. **Given** DsIconButton has an accessible name, **When** the component renders, **Then** an `aria-label` prop is required (or `aria-labelledby`) since there is no visible text.

6. **Given** DsIconButton renders correctly in both themes, **When** the application switches between light and dark mode, **Then** the button and its icon adapt via design tokens.

7. **Given** DsIconButton has TypeScript types and a co-located test file, **When** the component is used and tests are run, **Then** all props have type definitions and tests verify all sizes, slot rendering, accessibility attributes, and state behavior.

## Tasks / Subtasks

- [ ] Task 1: Create DsIconButton component directory and files (AC: #7)
  - [ ] 1.1 Create `src/components/DsIconButton/` directory
  - [ ] 1.2 Create `DsIconButton.vue`, `DsIconButton.test.ts`, `DsIconButton.stories.ts`, `index.ts`

- [ ] Task 2: Implement DsIconButton.vue (AC: #1, #2, #3, #4, #5, #6)
  - [ ] 2.1 Define `DsIconButtonProps` interface with `size`, `disabled`, `loading`, `ariaLabel` props
  - [ ] 2.2 Wrap PrimeVue `Button` with `inheritAttrs: false` + `v-bind="$attrs"` (same pattern as DsButton)
  - [ ] 2.3 Use the default slot for DsIcon child content — do NOT use an `icon` prop (UX-DR17)
  - [ ] 2.4 Apply square dimensions per size using `dt` prop: XS=24px, S=32px, M=36px, L=40px (width === height)
  - [ ] 2.5 Apply `aria-label` from props to the underlying Button (required for icon-only accessibility)
  - [ ] 2.6 Apply disabled state: opacity 0.5, `pointer-events: none`, `aria-disabled="true"`
  - [ ] 2.7 Apply loading state with dot-based indicator matching DsButton pattern
  - [ ] 2.8 Apply 150ms ease transitions for state changes (not on disabled)
  - [ ] 2.9 Ensure `focus-visible` focus ring is visible

- [ ] Task 3: Implement index.ts barrel export (AC: #7)
  - [ ] 3.1 Export `DsIconButton` component and `DsIconButtonProps` type from `index.ts`

- [ ] Task 4: Register in main barrel export (AC: #7)
  - [ ] 4.1 Add `export { DsIconButton, type DsIconButtonProps } from './components/DsIconButton'` to `src/index.ts`

- [ ] Task 5: Write Vitest tests (AC: #1, #2, #3, #4, #5, #7)
  - [ ] 5.1 Test: renders with default props (medium size)
  - [ ] 5.2 Test: all 4 sizes apply correct PrimeVue size mapping and dt tokens
  - [ ] 5.3 Test: default slot renders DsIcon child content
  - [ ] 5.4 Test: aria-label is passed to the underlying button element
  - [ ] 5.5 Test: disabled state applies class, aria-disabled, removes transitions
  - [ ] 5.6 Test: loading state shows dot indicator and aria-busy
  - [ ] 5.7 Test: PrimeVue prop passthrough via $attrs (e.g., rounded, data-testid)
  - [ ] 5.8 Test: click event passthrough
  - [ ] 5.9 Test: square proportions enforced via dt tokens (width === height per size)

- [ ] Task 6: Run tests and lint (AC: #7)
  - [ ] 6.1 Run `npx vitest run` — all tests pass (existing + new)
  - [ ] 6.2 Run `npx biome check` — no errors
  - [ ] 6.3 Run `npm run build` — build succeeds, new component in dist output

## Dev Notes

### Architecture Pattern — Follow DsButton Exactly

DsIconButton is a thin PrimeVue Button wrapper, identical in architecture to DsButton (`src/components/DsButton/DsButton.vue`). Key patterns to replicate:

1. **`defineOptions({ inheritAttrs: false })`** — prevents double-applying attrs
2. **`v-bind="$attrs"`** on the PrimeVue `<Button>` — full PrimeVue prop/event passthrough
3. **`dt` prop** for per-instance design token overrides — controls sizing
4. **Computed mappers** for severity/size to PrimeVue equivalents
5. **Scoped CSS** for transitions, disabled opacity, loading overlay

### Critical Difference from DsButton

DsIconButton is an **icon-only** button. Key differences:
- **No label/text** — the default slot receives a `<DsIcon>` component, not text
- **Square proportions** — width must equal height (not variable-width like DsButton)
- **`aria-label` is mandatory** — there is no visible text, so the button MUST have an accessible name
- **Type variants** — DsIconButton supports `primary`, `outlined`, and `text` types, mapped to PrimeVue severity/variant props.

### Size Token Mapping (from UX-DR15)

DsIconButton must be **square** — both width and height equal the component height:

| Size | Height | Width | Icon Size | dt tokens |
|------|--------|-------|-----------|-----------|
| xsmall | 24px (1.5rem) | 24px | 20px | `{ fontSize: '0', paddingX: '0', paddingY: '0', iconOnlyWidth: '1.5rem', borderRadius: '4px' }` |
| small | 32px (2rem) | 32px | 20px | `{ fontSize: '0', paddingX: '0', paddingY: '0', iconOnlyWidth: '2rem', borderRadius: '8px' }` |
| medium | 36px (2.25rem) | 36px | 24px | `{ fontSize: '0', paddingX: '0', paddingY: '0', iconOnlyWidth: '2.25rem', borderRadius: '8px' }` |

**Note:** DsButton already defines `iconOnlyWidth` per size in its `sizeTokens` computed. PrimeVue Button uses `iconOnlyWidth` design token to set width when there is no label. DsIconButton should leverage this same mechanism. The key difference is that DsIconButton should set `paddingX: '0'` (or minimal) since the icon is centered and the width is fixed by `iconOnlyWidth`.

### PrimeVue Icon-Only Button Behavior

PrimeVue Button renders as icon-only when it has an `icon` prop but no `label` or default slot text. However, per UX-DR17, DsIconButton uses a **slot** for the icon, not PrimeVue's `icon` prop. This means:
- The icon slot content (DsIcon) is passed via the default slot
- PrimeVue Button may not auto-detect this as an "icon-only" button
- You may need to force square dimensions via the `dt` prop's `iconOnlyWidth` or explicit CSS `width`/`aspect-ratio`
- Test both approaches and use whichever achieves the correct square dimensions

### Slot Pattern (UX-DR17)

```vue
<!-- Usage: DsIcon passed as child, not as prop -->
<DsIconButton size="medium" aria-label="Edit">
  <DsIcon name="edit" />
</DsIconButton>
```

The component template should pass the default slot through to PrimeVue Button. Since DsIcon inherits `currentColor`, it will automatically pick up the button's text color in all states (hover, focus, disabled).

### State Behavior (same as DsButton)

- **Transitions:** 150ms ease on `background-color`, `color`, `border-color`, `box-shadow`, `opacity`
- **Disabled:** opacity 0.5, `pointer-events: none`, `aria-disabled="true"`, no transitions
- **Loading:** dot-based indicator (3 animated dots), `pointer-events: none`, `aria-busy="true"`, `aria-live="polite"`, icon hidden during loading
- **Focus:** `focus-visible` ring — rely on PrimeVue's built-in focus ring from the preset

### Accessibility Requirements

- `aria-label` prop is **required** — enforce via TypeScript (make it non-optional or document as required)
- Consider making `ariaLabel` a required prop in the TypeScript interface to catch missing labels at build time
- `aria-disabled="true"` when disabled
- `aria-busy="true"` + `aria-live="polite"` when loading

### Existing Code to Reuse

- **DsButton.vue** (`src/components/DsButton/DsButton.vue`) — copy the wrapper pattern, severity/size mapping, dt tokens, disabled/loading styles
- **DsButton.test.ts** (`src/components/DsButton/DsButton.test.ts`) — copy the test structure and globalConfig setup
- **DsIcon** (`src/components/DsIcon/`) — imported by consumers, not by DsIconButton itself (DsIcon comes via slot)

### Files to Create

```
src/components/DsIconButton/
  DsIconButton.vue          # Component implementation
  DsIconButton.stories.ts   # Storybook stories (placeholder — Epic 3)
  DsIconButton.test.ts      # Vitest tests
  index.ts                  # Re-export for barrel imports
```

### Files to Modify

- `src/index.ts` — add DsIconButton + DsIconButtonProps export

### Testing Approach

Follow DsButton.test.ts pattern exactly:
- Mount with `@vue/test-utils` `mount()`
- Use `globalConfig` with `PrimeVue` plugin (`theme: 'none'`)
- Find inner PrimeVue `Button` via `wrapper.findComponent(Button)`
- Check props via `btn.props('severity')`, `btn.props('dt')`
- Check classes on wrapper: `ds-icon-button`, `ds-icon-button--medium`, etc.
- Check attributes: `aria-label`, `aria-disabled`, `aria-busy`

### Project Structure Notes

- Follows co-located file structure: `.vue`, `.stories.ts`, `.test.ts`, `index.ts` in `src/components/DsIconButton/`
- Naming: PascalCase directory and files (`DsIconButton/DsIconButton.vue`)
- Stories file created as placeholder — full stories implementation is Epic 3
- No new dependencies required — uses existing PrimeVue Button + project's DsIcon

### Anti-Patterns to Avoid

- Do NOT accept icon as a prop — use slot per UX-DR17
- Do NOT import DsIcon inside DsIconButton — consumers pass it via slot
- Do NOT hardcode hex colors — all colors via design tokens/preset
- Do NOT use `<style scoped>` with hardcoded pixel values for sizes — use dt tokens
- Do NOT skip `aria-label` — icon-only buttons are inaccessible without it
- Do NOT create a new severity mapping — reuse DsButton's mapping if DsIconButton supports severity variants
- Do NOT add state management or composables — this is a stateless thin wrapper
- Do NOT use `defineProps` without TypeScript generic syntax

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.1] — Acceptance criteria and user story
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Architecture] — Thin prop-forwarding wrapper pattern
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns] — Co-located files, naming, enforcement rules
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Size Consistency] — Uniform size token table
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX-DR17] — DsIcon as child slot, not prop
- [Source: _bmad-output/planning-artifacts/prd.md#FR10] — DsIconButton containing DsIcon, all DsButton sizes
- [Source: src/components/DsButton/DsButton.vue] — Reference implementation for wrapper pattern, dt tokens, state styles
- [Source: src/components/DsButton/DsButton.test.ts] — Reference test pattern (29 tests, globalConfig, PrimeVue plugin)
- [Source: PrimeVue Button docs] — `dt` prop for scoped CSS variables, `iconOnlyWidth` token, severity/variant/size props

### Previous Story Intelligence

**From Story 1.4 (Package Distribution):**
- Build output verified: dist/index.js (123KB), dist/index.css (1.33KB)
- 67 tests passing across 4 test files
- Barrel exports work correctly — new component just needs to be added to `src/index.ts`
- Consumer test project exists in `tmp/consumer-test/` for manual validation

**From Story 1.3 (DsButton):**
- Styled Mode approach is validated and works
- `dt` prop approach works for per-instance sizing overrides
- DsButton has `iconOnlyWidth` in sizeTokens — DsIconButton can leverage this
- 29 DsButton tests passing — use same test structure
- Loading state uses 3 animated dots, not a spinner

**From Story 1.2.1 (DsIcon):**
- DsIcon uses `currentColor` for icon color — will inherit button text color automatically
- DsIcon accepts `size` prop: xsmall (12px), small (16px), medium (20px), large (24px)
- DsIcon uses inline `v-html` for SVG content with scoped `:deep(svg)` styling

### Git Intelligence

Recent commits: `story 1.4` → `story 1.3` → `story 1.2.1` → `story 1.2` → `story 1.1`
All on `master` branch. One commit per story. Build and lint clean at HEAD.

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
