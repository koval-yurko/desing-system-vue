# Story 6.3: DsSelect Advanced Dropdown Variants

Status: done

## Story

As a **developer or AI agent**,
I want DsSelect to support advanced dropdown menu variants including multi-selection with checkboxes, entity icons, badges, two-line multi-selection, vendor rows, mention with grouped sections, and big icon layouts,
So that I can implement rich selection patterns matching all Figma dropdown menu designs.

## Figma Design References

- Dropdown menu variants: https://www.figma.com/design/3qP5xnwc6gXhZR3AnFAMFe/Design-Systems?node-id=2225-59091&m=dev
- Multi selection (node `2:47640`): search bar + "Select all" header + checkbox items
- With entity icons (node `2660:18722`): checkbox + 18px icon + label
- Badge (node `4463:47514`): DotIndicator (6px dot + text), no checkboxes
- Two lines Multi selection (node `2434:61702`): checkbox + name + subtitle + dividers + "Select all" header
- Vendor (node `4008:11643`): avatar XS (20px) + name + subtitle + dividers, no checkboxes
- Mention (node `4750:22198`): grouped sections with headers + two-line items (icon/avatar + name + subtitle) + "XX more results"
- Big icon (node `5131:37201`): 24px icon container + label

## Acceptance Criteria

1. **Given** DsSelect is already implemented with core variants (Story 6.2), **When** the developer configures multi-selection mode via PrimeVue's `:multiple="true"` prop, **Then** the dropdown renders checkboxes (16px, white bg, `--p-gray-600` border, 4px radius, shadow-xs) to the left of each item, supports multiple selected values displayed as comma-separated text in the trigger, and the clear button removes all selections.

2. **Given** DsSelect is in multi-selection mode with `filter` enabled, **When** the dropdown opens, **Then** a "Select all" header row renders below the search bar with: a checkbox on the left, bold "Select all {label}" text (Inter semibold 14px, `--p-gray-800`), and "XX out of XXX" counter on the right (Inter regular 12px, `--p-gray-600`). The header row has 40px height, `--p-gray-200` bottom border, 8px horizontal padding.

3. **Given** DsSelect options include entity icons via the `option` slot, **When** the dropdown menu opens, **Then** each option renders with a checkbox (16px) + entity icon (18px) + label (Inter regular 14px, `--p-gray-800`), with 4px gap between elements, matching the "With entity icons" Figma variant.

4. **Given** DsSelect options use the badge/dot-indicator layout via the `option` slot, **When** the dropdown menu opens, **Then** each option renders with a 6px colored dot + text label (Inter regular 14px, `--p-gray-900`), with 4px gap, matching the "Badge" Figma variant. No checkboxes in this layout.

5. **Given** DsSelect options use two-line items with multi-selection, **When** the dropdown menu opens, **Then** each option renders with: checkbox (16px) + title (Inter medium 14px, `--p-gray-800`) + subtitle (Inter regular 12px, `--p-gray-600`). Items are separated by `1px solid --p-gray-200` dividers. The "Select all" header adapts its label.

6. **Given** DsSelect is configured for vendor display via the `option` slot, **When** the dropdown menu opens, **Then** each option renders in the vendor layout: avatar (XS 20px, colored initials) + name (Inter medium 14px, `--p-gray-800`) + subtitle/email (Inter regular 12px, `--p-gray-600`, ellipsis overflow). Items separated by `1px solid --p-gray-200` dividers. No checkboxes. Padding: 12px left, 6px right, 6px vertical.

7. **Given** DsSelect is configured for mention display via the `option` slot, **When** the dropdown menu opens, **Then** the dropdown renders grouped sections with: section header (Inter regular 12px, `--p-gray-800`, 16px horizontal padding, 8px top / 2px bottom padding) + two-line items (18px icon/avatar + name + subtitle) separated by `1px solid --p-gray-200` dividers + "XX more results" row with three-dot icon (28px). Multiple groups stack vertically.

8. **Given** DsSelect is configured for big icon display via the `option` slot, **When** the dropdown menu opens, **Then** each option renders with: 24px icon container (gray-100 bg, gray-300 border, 1px border-width, 4px radius) containing an 18px icon + label (Inter regular 14px, `--p-gray-800`). Gap: 8px between icon and text. Padding: 12px left, 8px right, 6px vertical.

9. **Given** advanced dropdown variants are implemented via Storybook stories using PrimeVue slots, **When** the Storybook stories are updated, **Then** stories cover all 7 advanced dropdown menu variants (multi-selection, entity icons, badges, two-line multi-select, vendor, mention, big icon) with interactive controls and representative sample data.

10. **Given** advanced variants are documented, **When** the AI knowledge base entry at `docs/ai-guidelines/ds-select.md` is updated, **Then** it documents all advanced dropdown variants with slot-based usage examples showing how consumers render each layout.

## Tasks / Subtasks

- [x] Task 1: Implement multi-selection support (AC: #1, #2)
  - [x] 1.1 Verify PrimeVue Select `multiple` prop passes through via `$attrs` and renders correctly with DsSelect wrapper
  - [x] 1.2 Style checkbox items in the dropdown panel via non-scoped CSS (`.ds-select-panel` class): 16px checkbox with `--p-gray-600` border, 4px radius, shadow-xs
  - [x] 1.3 Handle multi-selection display in trigger: comma-separated values or chip display
  - [x] 1.4 Ensure clear button clears all selections (`model.value = []`) and emits `clear`
  - [x] 1.5 Implement "Select all" header row styling via PrimeVue `header` slot: checkbox + bold label + counter
  - [x] 1.6 Add non-scoped CSS for `.ds-select-panel--multi` modifier class applied via `pt` prop when `multiple` is true

- [x] Task 2: Add non-scoped CSS for advanced option layouts (AC: #3, #4, #5, #6, #7, #8)
  - [x] 2.1 Add `.ds-select-option-entity` styles: checkbox (16px) + entity icon (18px) + label, 4px gap
  - [x] 2.2 Add `.ds-select-option-badge` styles: 6px dot + text, 4px gap, dot colors via CSS variable
  - [x] 2.3 Add `.ds-select-option-vendor` styles: avatar (20px) + two-line text, dividers, 6px vertical padding
  - [x] 2.4 Add `.ds-select-option-mention` styles: section headers (12px, `--p-gray-800`), two-line items with icon/avatar, "XX more results" row
  - [x] 2.5 Add `.ds-select-option-big-icon` styles: 24px container (gray-100 bg, gray-300 border, 4px radius) + label, 8px gap
  - [x] 2.6 Ensure all option layout styles work with both light and dark themes (rely on `--p-*` token inversion)

- [x] Task 3: Storybook stories for advanced variants (AC: #9)
  - [x] 3.1 Add `MultiSelection` story: `multiple` prop + sample names array + "Select all" header via `header` slot
  - [x] 3.2 Add `EntityIcons` story: `option` slot with checkbox + Slack/app icon + label
  - [x] 3.3 Add `BadgeDotIndicator` story: `option` slot with colored dot + status text
  - [x] 3.4 Add `TwoLineMultiSelection` story: `multiple` prop + `option` slot with name + email + checkbox
  - [x] 3.5 Add `VendorLayout` story: `option` slot with avatar + name + email
  - [x] 3.6 Add `MentionLayout` story: `option` slot with grouped sections + icons + "more results"
  - [x] 3.7 Add `BigIconLayout` story: `option` slot with 24px icon container + label

- [x] Task 4: Update AI knowledge base (AC: #10)
  - [x] 4.1 Add "Advanced Dropdown Variants" section to `docs/ai-guidelines/ds-select.md`
  - [x] 4.2 Document multi-selection usage with `multiple` prop + `header` slot for "Select all"
  - [x] 4.3 Document each option layout variant with slot template examples
  - [x] 4.4 Add sample data structures for each variant

- [x] Task 5: Vitest tests for advanced variants (AC: #1, #2)
  - [x] 5.1 Test multi-selection: `multiple` prop passes through, `modelValue` as array, clear resets to `[]`
  - [x] 5.2 Test "Select all" header slot rendering
  - [x] 5.3 Test option slot rendering with custom content
  - [x] 5.4 Verify no regressions: run full test suite (`npm test`)

- [x] Task 6: Validate & ship
  - [x] 6.1 `npm test` — all tests pass, zero regressions
  - [x] 6.2 `npm run lint` (Biome) — no errors
  - [x] 6.3 `npm run build` — TypeScript + Vite build succeeds
  - [x] 6.4 `npm run storybook` — visually verify all advanced variant stories in light and dark themes
  - [x] 6.5 Update File List section below

## Dev Notes

### Architecture — Extend DsSelect, Don't Reinvent

Story 6.3 extends the existing DsSelect component from Story 6.2. **Do not modify DsSelect.vue's core logic.** All advanced variants are achieved through:

1. **PrimeVue Select's existing `multiple` prop** — passes through via `$attrs`; renders checkboxes natively
2. **PrimeVue Select's slot API** (`option`, `value`, `header`, `footer`) — consumers provide custom option templates
3. **Non-scoped CSS classes** — added to the existing `<style>` block in DsSelect.vue for advanced panel layouts
4. **Storybook stories** — demonstrate how to compose each layout using slots + CSS classes

The component API does NOT change. No new props are added to `DsSelectProps`. All variant rendering is consumer-controlled via PrimeVue's slot system.

### Implementation Strategy — Slots + CSS Classes

Each advanced variant is a **Storybook story demonstrating a slot pattern**, not a built-in component mode. The developer guide teaches consumers how to render each layout:

```vue
<!-- Example: Entity icons variant -->
<DsSelect v-model="value" :options="items" option-label="name" :multiple="true">
  <template #option="{ option }">
    <div class="ds-select-option-entity">
      <img :src="option.icon" class="ds-select-option-entity__icon" />
      <span>{{ option.name }}</span>
    </div>
  </template>
</DsSelect>
```

The library provides the CSS classes; the consumer provides the slot template. This is the correct pattern because:
- PrimeVue Select already handles all keyboard navigation, ARIA, and selection logic for multi-select
- Custom option layouts are infinite in variety — slot-based composition is the standard PrimeVue approach
- No new component logic is needed — only styling

### Multi-Selection — PrimeVue Integration

PrimeVue 4.x Select supports multi-selection natively via the `multiple` prop. Key integration:

1. **`multiple` prop** passes through `$attrs` to PrimeVue Select — no DsSelect changes needed
2. **PrimeVue renders checkboxes** inside each option automatically when `multiple` is true
3. **`modelValue` becomes an array** — DsSelect's `hasValue` computed must handle arrays: `model.value != null && (Array.isArray(model.value) ? model.value.length > 0 : model.value !== '')`
4. **Clear button** must reset to `[]` (empty array) for multi-select, not `undefined`
5. **"Select all" header** is implemented via PrimeVue's `header` slot — the consumer provides it, and the story demonstrates the pattern

**CRITICAL: DsSelect.vue changes needed for multi-select:**
- Update `hasValue` computed to handle arrays
- Update `handleClear()` to detect array model and reset to `[]` instead of `undefined`
- These are the ONLY changes to the component file itself

### Figma-Derived Specifications (From Dropdown Menu Node 2225:59091)

#### Shared Elements Across All Advanced Variants

**Search bar section** (optional, at top):
- Container: white bg, `--p-gray-300` bottom border, rounded top corners (8px)
- Inner wrapper: 16px horizontal padding, 12px vertical padding (4px bottom for multi-select variants)
- Search field: 32px height, gray-100 bg, gray-800 border, 8px radius, search icon + placeholder

**"Add new" button bar** (optional, at bottom):
- Container: white bg, `--p-gray-300` border, rounded bottom corners (8px), 2px padding
- Inner: plus icon (16px, blue-600) + "New {xxx}" link text (Inter regular 14px, blue-600, `--p-blue-600`)

**Scrollbar**: 4px wide, `--p-gray-400` color, 100px radius (pill), `shadow-sm`

#### Multi Selection Variant
- Item height: 40px
- Item layout: checkbox (16px) → 8px gap → label (Inter regular 14px, `--p-gray-800`)
- Item padding: 8px horizontal outer, then 8px left + 6px right + 4px vertical inner
- "Select all" header: 40px height, `--p-gray-200` bottom border
  - Checkbox (16px) + "Select all filters" (Inter semibold 14px, `--p-gray-800`) + counter (Inter regular 12px, `--p-gray-600`, right-aligned)
  - Inner padding: 8px all sides

#### With Entity Icons Variant
- Same as multi selection but with 18px icon between checkbox and label
- Layout: checkbox (16px) → 4px gap → entity icon (18px, `overflow: hidden`) → 4px gap → label
- Item padding: 8px left + 6px right, 8px vertical (inside hover area), 2px vertical outer

#### Badge / Dot Indicator Variant
- No checkboxes
- Layout: 6px colored dot (`border-radius: 50%`) → 4px gap → label (Inter regular 14px, `--p-gray-900`)
- Item padding: 12px left, 8px right, 8px vertical
- Dot color set per item via inline style or CSS variable

#### Two Lines Multi Selection Variant
- Layout: checkbox (16px) → 8px gap → text column (name + subtitle)
  - Name: Inter medium 14px, `--p-gray-800`
  - Subtitle: Inter regular 12px, `--p-gray-600`
- Dividers: `1px solid --p-gray-200` between items (border-top/bottom)
- Item padding: 12px left, 6px right, 6px vertical

#### Vendor Variant
- No checkboxes
- Layout: avatar (XS 20px, colored initials circle) → 4px gap → text column (name + email)
  - Name: Inter medium 14px, `--p-gray-800`
  - Email: Inter regular 12px, `--p-gray-600`, `text-overflow: ellipsis; white-space: nowrap`
- Dividers: `1px solid --p-gray-200` between items
- Item padding: 12px left, 6px right, 6px vertical

#### Mention Variant
- Wider panel (409px vs standard 303px)
- Grouped sections with headers:
  - Section header: Inter regular 12px, `--p-gray-800`, padding 16px horizontal, 8px top / 2px bottom
- Items: entity icon (18px) → 4px gap → text column (name + subtitle path)
  - Name: Inter medium 14px, `--p-gray-800`
  - Subtitle: Inter regular 12px, `--p-gray-600`, ellipsis
- Dividers: `1px solid --p-gray-200` between items within groups
- "XX more results" row: three-dot icon (28px circle) → label (Inter regular 14px, `--p-gray-800`)
- Groups separated by `--p-gray-300` border

#### Big Icon Variant
- No checkboxes
- Layout: icon container (24px, gray-100 bg, gray-300 border, 1px border-width, 4px radius, centered 18px icon) → 8px gap → label (Inter regular 14px, `--p-gray-800`)
- Item padding: 12px left, 8px right, 6px vertical

### Checkbox Styling (From Figma)

PrimeVue renders its own checkboxes when `multiple` is true. Style them via non-scoped CSS:
- Size: 16px × 16px
- Border: 1px solid `--p-gray-600` (#62748e)
- Border radius: 4px
- Background: white
- Shadow: shadow-xs (`0px 1px 2px 0px --p-gray-300`)
- Checked state: styled by PrimeVue (verify visually)

### Existing Code to Reuse

| Artifact | Path | Reuse For |
|----------|------|-----------|
| DsSelect.vue | `src/components/DsSelect/DsSelect.vue` | Add array-aware `hasValue` + `handleClear`, add non-scoped CSS classes |
| DsSelect.stories.ts | `src/components/DsSelect/DsSelect.stories.ts` | Add 7 new stories for advanced variants |
| DsSelect.test.ts | `src/components/DsSelect/DsSelect.test.ts` | Add multi-select tests |
| ds-select.md | `docs/ai-guidelines/ds-select.md` | Add advanced variants documentation |
| DsIcon | `src/components/DsIcon/DsIcon.vue` | Icons in stories (search, entity icons) |
| Story 6.2 story file | `_bmad-output/implementation-artifacts/6-2-dsselect-component-core-variants.md` | Reference for panel CSS patterns |

### Files to Modify

- `src/components/DsSelect/DsSelect.vue` — update `hasValue` computed + `handleClear` for arrays; add non-scoped CSS for advanced layouts
- `src/components/DsSelect/DsSelect.stories.ts` — add 7 new stories
- `src/components/DsSelect/DsSelect.test.ts` — add multi-select tests
- `docs/ai-guidelines/ds-select.md` — add advanced variants section

### Files NOT Changed

- `src/components/DsSelect/index.ts` — no new exports
- `src/index.ts` — DsSelect already exported
- `docs/ai-guidelines/index.md` — DsSelect already listed

### Anti-Patterns to Avoid

- Do **not** add new props to `DsSelectProps` for variant types — use PrimeVue slots
- Do **not** build variant-specific rendering logic inside `DsSelect.vue` — keep it in consumer slot templates
- Do **not** reimplement multi-selection checkbox logic — PrimeVue handles it
- Do **not** create separate components for each dropdown variant — use CSS classes + slot patterns
- Do **not** forget to handle `modelValue` as array in `hasValue` and `handleClear`
- Do **not** hardcode sample data icons as image URLs — use DsIcon or placeholder SVGs in stories

### Previous Story Intelligence

**From Story 6.2 (DsSelect Core Variants) — direct predecessor:**
- Non-scoped CSS for panel styling is in `<style>` block (not `<style scoped>`) because PrimeVue teleports the overlay to `<body>`
- Panel styles use `.ds-select-panel` class passed via `pt="{ overlay: { class: 'ds-select-panel' } }"`
- Two-line option CSS classes are already defined: `.ds-select-two-line`, `.ds-select-two-line__title`, `.ds-select-two-line__subtitle`
- Panel variant modifiers use `.ds-select-panel--two-line` pattern — follow same convention for advanced variants
- `handleClear()` currently sets `model.value = undefined` — must be updated for array support
- `hasValue` computed currently checks `model.value != null && model.value !== ''` — must handle arrays
- PrimeVue Select's `@show`/`@hide` events drive `isOpen` ref — unchanged for advanced variants
- 46 existing tests + 17 existing stories — add to these, don't replace

**From Story 6.1 (DsTextarea):**
- Biome strict about import order — run `npm run lint` before commit

### Git Intelligence (Recent Commits)

```
66b75a4 story 6.2
6ad1e82 story 6.1
2f67c65 add epics for phase 2
e9bed4d phase 2 specs sync
8294367 Add Storybook URL to README (#8)
```

Story 6.2 was completed immediately before this story. DsSelect core implementation is fully in place.

### Latest Tech Notes

- **Vue**: 3.5.30 — `useId()` and `defineModel<T>()` available
- **PrimeVue**: 4.5.4 — `Select` component supports `multiple` prop for multi-selection; renders checkboxes automatically; `header`/`footer` slots available for custom panel sections
- **Vitest**: 4.1.2 with `@vue/test-utils` 2.4.6
- **Biome**: 2.4.9 — `npm run lint`

### Project Structure Notes

- Co-located files per architecture: `DsSelect/DsSelect.vue`, `.stories.ts`, `.test.ts`
- Non-scoped CSS in DsSelect.vue for teleported panel — same pattern as Story 6.2
- AI KB at `docs/ai-guidelines/ds-select.md` — extend existing file

### References

- [Source: _bmad-output/planning-artifacts/epics-phase2.md#Story 6.3] — original BDD acceptance criteria
- [Source: _bmad-output/planning-artifacts/epics-phase2.md#Story 6.2] — core variants (prerequisite)
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#FR2] — DsSelect implementation
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#FR9] — PrimeVue passthrough
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Architecture] — thin wrapper pattern
- [Source: Figma node 2225:59091] — dropdown menu variants (all 10 states)
- [Source: Figma node 2:47640] — Multi selection variant
- [Source: Figma node 2660:18722] — With entity icons variant
- [Source: Figma node 4463:47514] — Badge variant
- [Source: Figma node 2434:61702] — Two lines Multi selection variant
- [Source: Figma node 4008:11643] — Vendor variant
- [Source: Figma node 4750:22198] — Mention variant
- [Source: Figma node 5131:37201] — Big icon variant
- [Source: src/components/DsSelect/DsSelect.vue] — implementation to extend
- [Source: _bmad-output/implementation-artifacts/6-2-dsselect-component-core-variants.md] — Story 6.2 learnings

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- PrimeVue 4.x does NOT have a `multiple` prop on `Select` — uses a separate `MultiSelect` component. Story assumed passthrough; adapted to conditionally render `MultiSelect` vs `Select` based on `multiple` attr.

### Completion Notes List

- **Task 1:** Updated `hasValue` computed to handle array values; updated `handleClear()` to reset to `[]` for arrays. Added conditional rendering of PrimeVue `MultiSelect` vs `Select` based on `multiple` attr. All PrimeVue slot passthrough (option, value, header, footer) works for both components. Non-scoped CSS added for multi-select panel, checkbox styling (16px, gray-600 border, 4px radius), and "Select all" header row.
- **Task 2:** Added CSS classes for all 7 advanced option layouts: `.ds-select-option-entity`, `.ds-select-option-badge`, `.ds-select-option-two-line-multi`, `.ds-select-option-vendor`, `.ds-select-option-mention`, `.ds-select-option-big-icon`. Panel modifiers: `--badge`, `--two-line-multi`, `--vendor`, `--mention` (409px width), `--big-icon`.
- **Task 3:** Added 7 Storybook stories: MultiSelection, EntityIcons, BadgeDotIndicator, TwoLineMultiSelection, VendorLayout, MentionLayout, BigIconLayout. Each with representative sample data and interactive slot templates.
- **Task 4:** Added "Advanced Dropdown Variants" section to `docs/ai-guidelines/ds-select.md` with usage examples for all 7 variants and sample data structures.
- **Task 5:** Added 11 new tests covering multi-selection: MultiSelect rendering, array hasValue, array clear, header/option slot passthrough, attr filtering. Total: 61 DsSelect tests, 306 project tests.
- **Task 6:** All tests pass (306/306), lint clean (Biome), build succeeds.

### Change Log

- 2026-04-17: Story 6.3 implementation — added multi-selection support via PrimeVue MultiSelect, 7 advanced dropdown CSS layouts, 7 Storybook stories, AI KB documentation, 11 new tests.

### File List

- `src/components/DsSelect/DsSelect.vue` — modified (MultiSelect import, conditional rendering, hasValue/handleClear array support, non-scoped CSS for multi-select and all advanced layouts)
- `src/components/DsSelect/DsSelect.stories.ts` — modified (7 new stories + sample data)
- `src/components/DsSelect/DsSelect.test.ts` — modified (11 new multi-selection tests)
- `docs/ai-guidelines/ds-select.md` — modified (advanced variants section + usage examples)
