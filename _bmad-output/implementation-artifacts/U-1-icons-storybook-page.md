# Story U.1: Icons Storybook Page

Status: review

## Story

As a **developer consuming the design system**,
I want **a dedicated Icons page in Storybook that displays all available icons with search/filter capability**,
so that **I can quickly discover, preview, and identify the correct icon name to use in my application**.

## Acceptance Criteria

1. **AC1 — Icons page exists under Foundations**
   - A new Storybook story exists at `src/stories/Foundations/Icons.stories.ts`
   - It appears in the sidebar under `Foundations/Icons` alongside Color Palette, Typography, etc.

2. **AC2 — All icons are displayed**
   - Every icon from the `icon-names.ts` registry (currently 236 icons) is rendered on the page
   - Each icon shows: the rendered SVG, and its `name` string (the value to pass to `<DsIcon name="..." />`)

3. **AC3 — Search/filter functionality**
   - A text input at the top of the page allows typing to filter icons by name
   - Filtering is case-insensitive and matches partial strings (e.g., typing "arrow" shows all arrow-* icons)
   - When no icons match the search, a "No icons found" message is displayed
   - Clearing the search input restores the full icon list

4. **AC4 — Icon count indicator**
   - The page displays the total number of icons and the current filtered count (e.g., "Showing 12 of 236 icons")

5. **AC5 — Copy-friendly icon names**
   - Each icon's name string is displayed in a monospace font so developers can easily read and copy the exact name

6. **AC6 — Responsive grid layout**
   - Icons are displayed in a responsive grid that adapts to the Storybook canvas width
   - Each icon card has consistent sizing and spacing

7. **AC7 — Works in both light and dark themes**
   - Icons render correctly with proper contrast in both light and dark Storybook theme modes

## Tasks / Subtasks

- [x] Task 1: Create Icons foundation story file (AC: #1, #2, #6, #7)
  - [x] 1.1 Create `src/stories/Foundations/Icons.stories.ts`
  - [x] 1.2 Import `DsIcon` component and `iconNames` from the icon registry
  - [x] 1.3 Set meta with `title: 'Foundations/Icons'`
  - [x] 1.4 Build the Default story rendering all icons in a responsive CSS grid
  - [x] 1.5 Each grid cell: render `<DsIcon :name="icon" size="medium" />` + name label below
  - [x] 1.6 Style grid cells with consistent padding, border, and rounded corners matching existing foundation story aesthetics
  - [x] 1.7 Ensure icons use `currentColor` so they adapt to light/dark theme

- [x] Task 2: Add search/filter functionality (AC: #3, #4)
  - [x] 2.1 Add a `ref('')` for search query in the story's `setup()` function
  - [x] 2.2 Add a `computed` that filters the icon names array by the search query (case-insensitive partial match)
  - [x] 2.3 Render a text input (plain HTML `<input>`, NOT DsInputText — avoid circular dependency in stories) bound to the search ref with `v-model`
  - [x] 2.4 Style the search input to match the page aesthetic (Inter font, appropriate padding, border)
  - [x] 2.5 Display count: "Showing X of Y icons"
  - [x] 2.6 Show "No icons found" message when filtered list is empty

- [x] Task 3: Polish icon card display (AC: #5, #6)
  - [x] 3.1 Display icon name in monospace font below each icon
  - [x] 3.2 Use `font-size: 11px` for names to keep cards compact
  - [x] 3.3 Add hover effect on cards for visual feedback
  - [x] 3.4 Set grid columns using `grid-template-columns: repeat(auto-fill, minmax(120px, 1fr))`

- [x] Task 4: Verify rendering (AC: #1, #7)
  - [x] 4.1 Run `npm run storybook` and verify the Icons page appears under Foundations
  - [x] 4.2 Verify search filters correctly
  - [x] 4.3 Verify light/dark theme switching works
  - [x] 4.4 Verify all 236 icons render without errors

## Dev Notes

### Key Source Files

| File | Purpose |
|------|---------|
| `src/components/DsIcon/icon-names.ts` | Exports `IconName` union type — 236 icon names |
| `src/components/DsIcon/icon-registry.ts` | Exports `icons` record (name → SVG string) and `getIcon()` |
| `src/components/DsIcon/DsIcon.vue` | The component to render each icon |
| `src/components/DsIcon/DsIcon.stories.ts` | Existing icon component story — reference for DsIcon usage |
| `src/stories/Foundations/ColorPalette.stories.ts` | Pattern reference — Foundation story with data-driven grid layout |
| `src/stories/Foundations/Typography.stories.ts` | Pattern reference — Foundation story structure |

### Getting the Icon Names List

The `icons` object exported from `icon-registry.ts` is a `Record<IconName, string>`. Use `Object.keys(icons)` to get the full list of icon name strings for iteration. This is the canonical source — do NOT hardcode icon names.

```typescript
import { icons } from '../../components/DsIcon/icon-registry';
const allIconNames = Object.keys(icons) as IconName[];
```

### Story Pattern to Follow

Follow the Foundation story pattern (no `component` in meta, just `title`). Use the `setup()` function in the render to provide reactive state. Example from existing stories:

```typescript
const meta = {
  title: 'Foundations/Icons',
} satisfies Meta;

export const Default: Story = {
  render: () => ({
    components: { DsIcon },
    setup() {
      const search = ref('');
      const allIcons = Object.keys(icons) as IconName[];
      const filtered = computed(() => 
        search.value
          ? allIcons.filter(name => name.includes(search.value.toLowerCase()))
          : allIcons
      );
      return { search, filtered, total: allIcons.length };
    },
    template: `...`,
  }),
};
```

### Styling Approach

- Use **inline styles** — this is the established pattern in all Foundation stories (ColorPalette, Typography, etc.)
- Use `font-family: Inter, sans-serif` for consistency
- Use `font-family: 'SF Mono', SFMono-Regular, Consolas, monospace` for icon name labels
- Use CSS Grid (`display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr))`) for the icon grid
- For theme compatibility: use neutral colors that work in both light/dark mode, or reference appropriate gray token values. The existing Foundation stories use hardcoded hex colors — follow the same approach but ensure the search input and card backgrounds adapt. Consider using `color: inherit` and `border-color` values that work in both themes.

### DO NOT

- Do NOT use `DsInputText` for the search field — it's a component from this library and creates a circular documentation dependency
- Do NOT hardcode the icon names list — always derive from the registry
- Do NOT add new dependencies — everything needed is already available
- Do NOT create a separate Vue component file — keep everything in the single `.stories.ts` file (matches existing Foundation pattern)
- Do NOT add `tags: ['autodocs']` — Foundation stories don't use autodocs (no component to document)

### Project Structure Notes

- Story file goes in `src/stories/Foundations/Icons.stories.ts` alongside existing Foundation stories
- No new component files needed
- No changes to existing files needed
- Import paths from stories to components: `../../components/DsIcon/...`

### References

- [Source: src/components/DsIcon/icon-registry.ts] — icon registry with `icons` export
- [Source: src/components/DsIcon/icon-names.ts] — `IconName` type definition
- [Source: src/components/DsIcon/DsIcon.vue] — DsIcon component
- [Source: src/stories/Foundations/ColorPalette.stories.ts] — Foundation story pattern with data grids
- [Source: src/stories/Foundations/Typography.stories.ts] — Foundation story structure

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Biome lint flagged import order; fixed by reordering imports (type imports first, then value imports, alphabetical)

### Completion Notes List

- Created `src/stories/Foundations/Icons.stories.ts` following the established Foundation story pattern (inline styles, no separate component file, no autodocs)
- Renders all icons from `icon-registry.ts` using `Object.keys(icons)` — no hardcoded names
- Search/filter: reactive `ref` + `computed` with case-insensitive partial match via plain HTML `<input>` (not DsInputText)
- Count indicator: "Showing X of Y icons" displayed next to search input
- Empty state: "No icons found" message when filter matches nothing
- Icon names displayed in monospace font (`SF Mono` / `Consolas`) at 11px
- Responsive CSS grid: `repeat(auto-fill, minmax(120px, 1fr))` with 12px gap
- Hover effect on cards (border color change + subtle background)
- Theme compatibility: uses `color: inherit`, `background: transparent`, and `currentColor` for icon rendering
- All 175 existing tests pass, no regressions
- Storybook builds successfully
- Biome lint passes clean

### File List

- `src/stories/Foundations/Icons.stories.ts` (new)

### Change Log

- 2026-04-06: Implemented Icons Storybook page — all tasks complete, all ACs satisfied
