---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
status: complete
completedAt: '2026-04-07'
inputDocuments:
  - prd-phase2.md
  - architecture.md
  - ux-design-specification.md
---

# desing-system-vue Phase 2 - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for desing-system-vue Phase 2, decomposing the requirements from the PRD Phase 2, UX Design, and Architecture requirements into implementable stories. Phase 2 expands the library from 5 to 12 components by adding 4 form components and 3 display components. DsFilterField was removed from scope (no Figma design exists).

## Requirements Inventory

### Functional Requirements

- FR1: Developers can import and render DsTextarea with sizes (S, M), states (Default, Hover, Focus, Filled, Error, Disabled), and label/hint/error pattern consistent with DsInputText
- FR2: Developers can import and render DsSelect with a dropdown option list, sizes (S, M), states (Default, Hover, Focus, Filled, Error, Disabled), and label/hint/error pattern consistent with DsInputText
- FR3: Developers can import and render DsSearchField with search icon, clearable input, and sizes matching the design system scale
- FR4: Developers can import and render DsCodeInput as a PIN/OTP-style verification code input — individual character cells with states (Default, Hover, Focused, Input, Error, Disabled), configurable length, auto-advance / backspace / paste support, and error message support
- ~~FR5: REMOVED — DsFilterField removed from scope~~
- FR6: Developers can import and render DsChip with variants (Default, Selected, Disabled) and removable behavior
- FR7: Developers can import and render DsBadge with severity color variants matching the design token palette
- FR8: Developers can import and render DsAvatar with image, initials fallback, and icon fallback variants, in multiple sizes
- FR9: All Phase 2 components can accept and pass through standard PrimeVue props, slots, and events for their underlying PrimeVue base component (where applicable)
- FR10: All Phase 2 components can render matching the Figma design in both light and dark themes without additional styling
- FR11: All Phase 2 components can provide TypeScript type definitions for props, emits, and slots
- FR12: All Phase 2 components follow existing prop conventions (`severity`, `size`, `disabled`, `variant`)
- FR13: DsSearchField can compose DsInputText and DsIcon internally
- ~~FR14: REMOVED — DsFilterField removed from scope~~
- FR15: Composed components (DsSearchField) can be used without the consumer needing to import the internal components (DsInputText, DsIcon) separately
- FR16: Consuming projects can import all 13 components individually (tree-shakeable)
- FR17: The expanded package can install and build without breaking changes to existing MVP components
- FR18: Developers can browse all 13 components in Storybook organized by Figma structure
- FR19: Developers can view live interactive stories for every Phase 2 component variant and state
- FR20: Developers can manipulate Phase 2 component props via Storybook controls
- FR21: AI agents can access structured documentation listing all 13 available components
- FR22: AI agents can look up per-component entries for all 8 new components containing: component name, when to use, available props/variants, usage examples, and Figma reference
- FR23: AI agents can determine which library component matches a given Figma design element from the expanded 13-component inventory
- FR24: The maintainer can add each Phase 2 PrimeVue-wrapper component by creating a preset configuration, Storybook story, Vitest tests, and AI knowledge base entry
- FR25: The maintainer can add each Phase 2 custom Tailwind component following PrimeVue API conventions and the component addition guide
- FR26: The maintainer can validate Phase 2 component visual output against Figma screenshots in Storybook

### NonFunctional Requirements

- NFR1: Individual component bundle size must be minimized via tree-shaking — consuming projects only load components they import
- NFR2: Phase 2 components must not introduce rendering performance overhead beyond PrimeVue's baseline
- NFR3: Composed components (DsSearchField) must not add perceptible latency compared to non-composed components
- NFR4: All PrimeVue-wrapped Phase 2 components must preserve PrimeVue's built-in keyboard navigation and ARIA attributes
- NFR5: Custom / composed components without a direct PrimeVue base (DsSearchField) must implement keyboard navigation and ARIA support per the component addition guide. DsCodeInput (PrimeVue `InputOtp` wrapper — reclassified during Story 8.2) must preserve PrimeVue's built-in keyboard behavior and add per-cell `aria-describedby` / `aria-invalid` on error, because `aria-describedby` does not inherit from a `role="group"` ancestor.
- NFR6: All Phase 2 interactive components must have visible focus indicators in both light and dark themes
- NFR7: DsAvatar must provide accessible alt text or aria-label for image and icon variants
- NFR8: DsChip with removable behavior must be keyboard-accessible (Enter/Space to remove, focus management after removal)
- NFR9: Phase 2 components must be compatible with the same Vue 3.x and PrimeVue 4.x versions as Phase 1
- NFR10: Phase 2 components must not introduce new peer dependencies beyond Vue 3 and PrimeVue
- NFR11: TypeScript types for Phase 2 components must be compatible with both strict and non-strict configurations
- NFR12: Every Phase 2 Storybook story must load and render without errors
- NFR13: AI knowledge base entries for Phase 2 components must follow the same structure as Phase 1 entries, enabling reliable LLM parsing
- NFR14: Phase 2 documentation must be indistinguishable in quality and format from Phase 1 documentation

### Additional Requirements

- No starter template needed — brownfield extension of existing v0.1.2 library
- Component directory pattern must be followed: `DsXxx/DsXxx.vue`, `DsXxx.stories.ts`, `DsXxx.test.ts`, `index.ts`
- PrimeVue wrappers must use thin prop-forwarding pattern: `inheritAttrs: false` + `v-bind="$attrs"`
- All new components must be added to single barrel export in `src/index.ts`
- Design tokens consumed via PrimeVue preset — never hardcode hex values
- Stories and tests co-located with component source
- AI KB markdown entry per component in `docs/ai-guidelines/`
- Implementation checklist enforced order: .vue → TypeScript types → light/dark verify → Storybook stories → Vitest tests → AI KB entry → barrel export
- Composition patterns: DsSearchField composes existing library components (DsInputText + DsIcon) — the library's first internal component composition beyond DsIconButton using DsIcon

### UX Design Requirements

- UX-DR1: DsTextarea and DsSelect must follow the same form field state pattern as DsInputText (Default, Hover, Focus, Filled, Error, Disabled) with consistent label/hint/error layout
- UX-DR2: DsSearchField must include built-in search icon (not customizable) and clear button behavior
- UX-DR3: DsCodeInput cells must match the Figma "Code input" category exactly — each cell 43×58 with 1.5px border, 4px radius, 16px gap; digit typography Inter regular 30px / line-height 32px / letter-spacing -0.2px (per Figma `typography/size/2xl`). Any earlier "monospace code/token input" framing is superseded by the Figma PIN/OTP design and the Story 8.2 implementation.
- ~~UX-DR4: REMOVED — DsFilterField removed from scope~~
- UX-DR5: DsChip must support Selected state visual (not just Default/Disabled) and keyboard-accessible removal (Enter/Space) with focus management after removal
- UX-DR6: DsBadge must use severity color mapping: error/Red, success/Green, warning/Orange, info/Blue matching the Figma token palette
- UX-DR7: DsAvatar must support three fallback variants: image, initials, icon — with accessible alt text or aria-label
- UX-DR8: All Phase 2 interactive components must have visible focus indicators using `focus-visible:` (not `focus:`) in both light and dark themes
- UX-DR9: All state transitions in Phase 2 components must use `150ms ease` timing, with `motion-safe:` prefix for animation classes
- UX-DR10: Phase 2 components must follow the uniform size token table (XS=24px, S=32px, M=36px, L=40px) with matching icon/font/padding proportions

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 6 | DsTextarea implementation |
| FR2 | Epic 6 | DsSelect implementation |
| FR3 | Epic 8 | DsSearchField implementation |
| FR4 | Epic 8 | DsCodeInput implementation |
| ~~FR5~~ | ~~REMOVED~~ | ~~DsFilterField removed from scope~~ |
| FR6 | Epic 7 | DsChip implementation |
| FR7 | Epic 7 | DsBadge implementation |
| FR8 | Epic 7 | DsAvatar implementation |
| FR9 | Epics 6–9 | PrimeVue passthrough per component |
| FR10 | Epics 6–9 | Figma fidelity light/dark per component |
| FR11 | Epics 6–9 | TypeScript types per component |
| FR12 | Epics 6–9 | Prop conventions per component |
| FR13 | Epic 8 | DsSearchField internal composition |
| ~~FR14~~ | ~~REMOVED~~ | ~~DsFilterField removed from scope~~ |
| FR15 | Epic 8 | DsSearchField composition exposure (consumer doesn't import internals) |
| FR16 | Epic 9 | Tree-shakeable imports for all 12 |
| FR17 | Epic 9 | No breaking changes to existing MVP |
| FR18 | Epic 9 | Storybook browsing all 12 components |
| FR19 | Epic 9 | Interactive stories for all Phase 2 variants |
| FR20 | Epic 9 | Storybook controls for Phase 2 components |
| FR21 | Epic 9 | AI KB listing all 12 components |
| FR22 | Epic 9 | Per-component AI KB entries for 7 new |
| FR23 | Epic 9 | AI component matching for 12 components |
| FR24 | Epic 9 | Maintainer PrimeVue wrapper workflow |
| FR25 | Epic 9 | Maintainer custom Tailwind workflow |
| FR26 | Epic 9 | Figma visual validation in Storybook |

## Epic List

### Epic 6: PrimeVue Form Field Wrappers (DsTextarea, DsSelect)
Developers and AI agents can build forms with textarea and select dropdown components that match Figma, following the same label/hint/error pattern established by DsInputText in Phase 1.
**FRs covered:** FR1, FR2, FR9, FR10, FR11, FR12
**UX-DRs covered:** UX-DR1, UX-DR8, UX-DR9, UX-DR10
**NFRs addressed:** NFR1, NFR2, NFR4, NFR6, NFR9, NFR10, NFR11, NFR12, NFR13, NFR14

### Epic 7: Display Components (DsChip, DsBadge, DsAvatar)
Developers and AI agents can render tag chips, status badges, and user avatars matching Figma. Each component is standalone. DsChip was originally scoped as a building block for DsFilterField, which has been removed.
**FRs covered:** FR6, FR7, FR8, FR9, FR10, FR11, FR12
**UX-DRs covered:** UX-DR5, UX-DR6, UX-DR7, UX-DR8, UX-DR9, UX-DR10
**NFRs addressed:** NFR1, NFR2, NFR4, NFR6, NFR7, NFR8, NFR9, NFR10, NFR11, NFR12, NFR13, NFR14

### Epic 8: Custom Search & Code Input (DsSearchField, DsCodeInput)
Developers and AI agents can use specialized input components — a search field with built-in icon and clear behavior, and a PIN/OTP-style verification code input. Introduces the library's first internal composition pattern (DsSearchField composes DsInputText + DsIcon). Note: DsCodeInput, originally scoped as a custom Tailwind component, was reclassified during Story 8.2 as a thin PrimeVue `InputOtp` wrapper after PrimeVue 4.5.4 was found to ship the component natively.
**FRs covered:** FR3, FR4, FR13, FR9, FR10, FR11, FR12
**UX-DRs covered:** UX-DR2, UX-DR3, UX-DR8, UX-DR9, UX-DR10
**NFRs addressed:** NFR1, NFR3, NFR5, NFR6, NFR9, NFR10, NFR11, NFR12, NFR13, NFR14

### ~~DsFilterField epic: REMOVED — DsFilterField removed from scope~~

### Epic 9: Library Integration & Release
The expanded 12-component library builds, tests, and publishes without breaking changes. AI guidelines index updated to cover all 12 components. Storybook organized with complete Phase 2 coverage.
**FRs covered:** FR16, FR17, FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26
**NFRs addressed:** NFR1, NFR2, NFR9, NFR10, NFR12, NFR13, NFR14

---

## Epic 6: PrimeVue Form Field Wrappers (DsTextarea, DsSelect)

Developers and AI agents can build forms with textarea and select dropdown components that match Figma, following the same label/hint/error pattern established by DsInputText in Phase 1.

### Story 6.1: DsTextarea Component

As a **developer or AI agent**,
I want a DsTextarea component with sizes (S, M), states (Default, Hover, Focused, Input-text, Filled, Filled-Hover, Error, Disabled), label/hint/error pattern, and character counter,
So that I can implement multi-line text input fields matching the Figma design without custom styling.

**Acceptance Criteria:**

**Given** a consuming project with the design system installed
**When** the developer imports DsTextarea from the library
**Then** the component renders a labeled textarea matching Figma specs in both light and dark themes
**And** size prop accepts "small" (32px) and "medium" (36px) with correct font/padding per the size token table, matching DsInputText conventions

**Given** DsTextarea is rendered with default props
**When** the user interacts with the textarea
**Then** it transitions through states: Default → Hover (gray-100 bg, gray-600 border, shadow) → Focused (purple-400 border) → Input-text (typing with cursor, fbfbfd bg) → Filled (gray-400 border) → Filled-Hover (gray-100 bg, gray-800 border) → Error (red-700 border) → Disabled (gray-100 bg, gray-400 border, reduced opacity)
**And** all transitions use 150ms ease timing with `motion-safe:` prefix
**And** focus is indicated via `focus-visible:` ring in both light and dark themes

**Given** DsTextarea has `hint` prop set
**When** the textarea renders
**Then** hint text appears below the textarea in gray-600 14px Inter
**And** when in Error state, the hint area shows a red error icon + error text in red-700 12px Inter medium

**Given** DsTextarea has `maxLength` prop set
**When** the user types in the textarea
**Then** a character counter ("0/100") displays at the bottom-right in gray-600
**And** when character count exceeds max, the counter turns red-700 and the textarea enters Error state

**Given** DsTextarea is in Input-text or Error state
**When** the textarea has content
**Then** a clear button (X icon) appears at the top-right of the textarea

**Given** DsTextarea wraps PrimeVue Textarea
**When** a consumer passes any standard PrimeVue Textarea prop, slot, or event
**Then** it is forwarded via `inheritAttrs: false` + `v-bind="$attrs"`
**And** TypeScript types are provided for all DS-specific props (size, label, hint, error, maxLength)

**Given** the component is implemented
**When** the implementation checklist is complete
**Then** co-located files exist: `DsTextarea.vue`, `DsTextarea.stories.ts`, `DsTextarea.test.ts`, `index.ts`
**And** Storybook stories cover all 8 states × both sizes with interactive controls
**And** Vitest tests verify prop behavior, state rendering, character counter, and PrimeVue passthrough
**And** AI knowledge base entry exists at `docs/ai-guidelines/ds-textarea.md`
**And** component is exported from `src/index.ts`

**Figma reference:** `Design-Systems / node 2:45313`

### Story 6.2: DsSelect Component — Core Variants

As a **developer or AI agent**,
I want a DsSelect component with sizes (S, M), states (Default, Hover, Focus, Filled, Filled-Hover, Disabled), optional leading icon, clear button, and core dropdown menu styles (one-line, two-line, no-match),
So that I can implement selection dropdowns matching the Figma design for standard use cases.

**Acceptance Criteria:**

**Given** a consuming project with the design system installed
**When** the developer imports DsSelect from the library
**Then** the component renders a select dropdown matching Figma specs in both light and dark themes
**And** size prop accepts "small" (32px height) and "medium" (40px height) with correct padding and icon sizes per the size token table

**Given** DsSelect is rendered with an options list
**When** the user interacts with the select
**Then** it transitions through states: Default (white bg, gray-400 border, shadow) → Hover (gray-100 bg, gray-600 border) → Focus (gray-400 border, chevron flips to up-arrow) → Filled (shows selected value in gray-800) → Filled-Hover (gray-100 bg, gray-600 border) → Disabled (gray-100 bg, gray-400 border, gray-500 text)
**And** all transitions use 150ms ease timing with `motion-safe:` prefix
**And** focus is indicated via `focus-visible:` ring in both light and dark themes

**Given** DsSelect supports a `leadingIcon` slot
**When** a leading icon is provided
**Then** it renders to the left of the placeholder/value text at 20px size

**Given** DsSelect is in Filled state
**When** the selected value is displayed
**Then** a clear button (X icon) appears alongside the dropdown chevron
**And** clicking clear resets the selection and returns to Default state

**Given** DsSelect dropdown menu opens
**When** the user views the options list
**Then** the dropdown menu supports core variants: single-line items, two-line items (title + subtitle), and "no items match your search" empty state
**And** the dropdown menu styling is applied via PrimeVue preset/passthrough API

**Given** DsSelect wraps PrimeVue Select
**When** a consumer passes any standard PrimeVue Select prop, slot, or event
**Then** it is forwarded via `inheritAttrs: false` + `v-bind="$attrs"`
**And** TypeScript types are provided for all DS-specific props (size, leadingIcon)

**Given** the component is implemented
**When** the implementation checklist is complete
**Then** co-located files exist: `DsSelect.vue`, `DsSelect.stories.ts`, `DsSelect.test.ts`, `index.ts`
**And** Storybook stories cover all states × both sizes, with and without leading icon, plus core dropdown menu variants
**And** Vitest tests verify prop behavior, dropdown rendering, clear button, and PrimeVue passthrough
**And** AI knowledge base entry exists at `docs/ai-guidelines/ds-select.md`
**And** component is exported from `src/index.ts`

**Figma references:** `Design-Systems / node 4714:24526` (dropdown input), `Design-Systems / node 2225:59091` (dropdown menu)

### Story 6.3: DsSelect Advanced Dropdown Variants

As a **developer or AI agent**,
I want DsSelect to support advanced dropdown menu variants including multi-selection, entity icons, badges, vendor rows, mention, and big icon layouts,
So that I can implement rich selection patterns matching all Figma dropdown menu designs.

**Acceptance Criteria:**

**Given** DsSelect is already implemented with core variants (Story 6.2)
**When** the developer configures multi-selection mode
**Then** the dropdown renders checkboxes per item, supports multiple selected values displayed as text in the input, and the clear button removes all selections

**Given** DsSelect options include entity icons
**When** the dropdown menu opens
**Then** each option renders with its entity icon to the left of the label, matching the "With entity icons" Figma variant

**Given** DsSelect options include badges
**When** the dropdown menu opens
**Then** each option renders with a badge indicator, matching the "Badge" Figma variant

**Given** DsSelect options include two-line items with multi-selection
**When** the dropdown menu opens
**Then** each option renders title + subtitle with a checkbox, matching the "Two lines Multi selection" Figma variant

**Given** DsSelect is configured for vendor display
**When** the dropdown menu opens
**Then** each option renders in the vendor layout, matching the "Vendor" Figma variant

**Given** DsSelect is configured for mention display
**When** the dropdown menu opens
**Then** each option renders in the mention layout, matching the "Mention" Figma variant

**Given** DsSelect is configured for big icon display
**When** the dropdown menu opens
**Then** each option renders with a large icon, matching the "Big icon" Figma variant

**Given** advanced variants are implemented
**When** the Storybook stories are updated
**Then** stories cover all advanced dropdown menu variants (multi-selection, entity icons, badges, two-line multi-select, vendor, mention, big icon)
**And** AI knowledge base entry at `docs/ai-guidelines/ds-select.md` is updated to document all dropdown variants

**Figma reference:** `Design-Systems / node 2225:59091` (dropdown menu variants)

---

## Epic 7: Display Components (DsChip, DsBadge, DsAvatar)

Developers and AI agents can render tag chips, status badges, and user avatars matching Figma. Each component is standalone. DsChip was originally scoped as a building block for DsFilterField, which has been removed.

### Story 7.1: DsChip Component

As a **developer or AI agent**,
I want a DsChip component with types (Default, Selected, Not clickable), sizes (S, M), hover states, optional icons, and removable behavior,
So that I can render tag chips and filter chips matching the Figma design.

**Acceptance Criteria:**

**Given** a consuming project with the design system installed
**When** the developer imports DsChip from the library
**Then** the component renders matching Figma specs in both light and dark themes
**And** size prop accepts "small" (py-4px) and "medium" (py-6px) with border-radius 8px

**Given** DsChip type is "Default"
**When** rendered at size M
**Then** it shows white bg, gray-500 border, gray-900 text, with optional left icon and right arrow chevron slots
**And** on hover: gray-100 bg, gray-500 border

**Given** DsChip type is "Default"
**When** rendered at size S
**Then** it shows white bg, gray-400 border, with optional entity icon slot and removable Exit (X) button
**And** on hover: gray-100 bg, gray-500 border

**Given** DsChip type is "Selected"
**When** rendered
**Then** it shows white bg, purple-450 border, purple-800 text, purple-colored icons
**And** on hover: purple-100 bg, purple-450 border

**Given** DsChip type is "Not clickable" (disabled)
**When** rendered at size M
**Then** it shows gray-300 bg, no border, gray-900 text
**And** at size S: gray-100 bg, gray-200 border

**Given** DsChip has removable behavior (size S with actions)
**When** the user clicks the Exit (X) button or presses Enter/Space while focused on it
**Then** the chip emits a remove event
**And** focus management moves to the next focusable element after removal (NFR8)

**Given** DsChip wraps PrimeVue Chip
**When** a consumer passes PrimeVue Chip props, slots, or events
**Then** they are forwarded via `inheritAttrs: false` + `v-bind="$attrs"`
**And** TypeScript types are provided for DS-specific props (type, size, actions, entityIcon)

**Given** the component is implemented
**When** the implementation checklist is complete
**Then** co-located files exist: `DsChip.vue`, `DsChip.stories.ts`, `DsChip.test.ts`, `index.ts`
**And** Storybook stories cover all types × sizes × hover × disabled states
**And** Vitest tests verify type rendering, hover states, removal interaction, keyboard accessibility, and focus management
**And** AI knowledge base entry exists at `docs/ai-guidelines/ds-chip.md`
**And** component is exported from `src/index.ts`

**Figma reference:** `Design-Systems / node 2014:9915`

### Story 7.2: DsBadge Component

As a **developer or AI agent**,
I want a DsBadge component with 11 type variants (Pending, Interesting, Neutral, Rejected, Accepted, Cancel, Border, Clean, Draft, Loaded/shimmer, Type10), optional left/right icons, and hover states,
So that I can render status badges matching the Figma design.

**Acceptance Criteria:**

**Given** a consuming project with the design system installed
**When** the developer imports DsBadge from the library
**Then** the component renders matching Figma specs in both light and dark themes
**And** border-radius is 4px (radius/md), font is 12px Inter, padding py-2px px-8px

**Given** DsBadge type is set to a semantic variant
**When** rendered
**Then** each type applies correct bg and text colors:
- Pending: yellow-100 bg, amber/yellow-700 text
- Interesting: purple-100 bg, purple-600 text
- Neutral: blue-200 bg, blue-600 text
- Rejected: red-100 bg, red-700 text
- Accepted: green-100 bg, green-700 text
- Cancel: gray-300 bg, gray-800 text
- Border: white bg, gray-300 border, gray-800 text
- Clean: no bg, gray-600 text (px-4px)
- Draft: gray-300 bg with diagonal stripe pattern, gray-800 text
- Loaded/shimmer: gray-200 bg, gray-300 border with shimmer animation
- Type10: gray-200 bg with gray-300 border (hover variant)

**Given** DsBadge has optional icon slots
**When** showLIcon or showRIcon is true
**Then** left/right 12px icons render alongside the text

**Given** DsBadge type is "Clean" or "Type10"
**When** hover state is active
**Then** Clean shows gray-300 bg, Type10 shows gray-200 bg with border

**Given** DsBadge wraps PrimeVue Badge
**When** a consumer passes PrimeVue Badge props
**Then** they are forwarded via `inheritAttrs: false` + `v-bind="$attrs"`
**And** TypeScript types are provided for DS-specific props (type, showLIcon, showRIcon)

**Given** the component is implemented
**When** the implementation checklist is complete
**Then** co-located files exist: `DsBadge.vue`, `DsBadge.stories.ts`, `DsBadge.test.ts`, `index.ts`
**And** Storybook stories cover all 11 type variants with and without icons
**And** Vitest tests verify each type's color rendering and icon slot behavior
**And** AI knowledge base entry exists at `docs/ai-guidelines/ds-badge.md`
**And** component is exported from `src/index.ts`

**Figma reference:** `Design-Systems / node 2014:9896`

### Story 7.3: DsAvatar Component

As a **developer or AI agent**,
I want a DsAvatar component with three variant groups (Initials Colored, Initials Monochrome, Icon fallback), 4 sizes (L, M, S, XS), and 9 color options for colored initials,
So that I can render user avatars matching the Figma design.

**Acceptance Criteria:**

**Given** a consuming project with the design system installed
**When** the developer imports DsAvatar from the library
**Then** the component renders matching Figma specs in both light and dark themes
**And** size prop accepts "large" (40px), "medium" (34px), "small" (28px), "xsmall" (20px)

**Given** DsAvatar variant is "initials-colored"
**When** rendered with initials text and a color prop
**Then** it shows a colored circular background with white initials text
**And** color accepts: Blue, Light Purple, Yellow, Pink, Purple, Deep Blue, Orange, Turquoise, Red
**And** font size scales per size: L=18px semibold, M=14px semibold, S=12px semibold, XS=9px medium

**Given** DsAvatar variant is "initials-monochrome"
**When** rendered with initials text
**Then** it shows a gray circular background with gray-800 initials text
**And** same size/font scaling as colored variant

**Given** DsAvatar variant is "icon" (fallback)
**When** rendered without initials or image
**Then** it shows a gray circular background with a person silhouette icon
**And** icon scales per size: L/M=24px, S=20px, XS=14px

**Given** DsAvatar has an image prop
**When** a valid image URL is provided
**Then** it renders the image in a circular clip
**And** if the image fails to load, it falls back to initials or icon variant

**Given** DsAvatar renders without sufficient context
**When** no image, no initials, and no explicit variant
**Then** it defaults to the icon fallback variant
**And** provides accessible aria-label describing the avatar (NFR7)

**Given** DsAvatar wraps PrimeVue Avatar
**When** a consumer passes PrimeVue Avatar props
**Then** they are forwarded via `inheritAttrs: false` + `v-bind="$attrs"`
**And** TypeScript types are provided for DS-specific props (variant, size, color, initials, image, alt)

**Given** the component is implemented
**When** the implementation checklist is complete
**Then** co-located files exist: `DsAvatar.vue`, `DsAvatar.stories.ts`, `DsAvatar.test.ts`, `index.ts`
**And** Storybook stories cover all 3 variants × 4 sizes × 9 colors (for colored), plus image variant with fallback
**And** Vitest tests verify variant rendering, size scaling, color application, image fallback, and aria-label
**And** AI knowledge base entry exists at `docs/ai-guidelines/ds-avatar.md`
**And** component is exported from `src/index.ts`

**Figma reference:** `Design-Systems / node 2022:14873`

---

## Epic 8: Custom Search & Code Input (DsSearchField, DsCodeInput)

Developers and AI agents can use specialized input components — a search field with built-in icon and clear behavior, and a PIN/OTP-style code input for verification codes. Introduces the library's first internal composition pattern (DsSearchField composes DsInputText + DsIcon).

### Story 8.1: DsSearchField Component

As a **developer or AI agent**,
I want a DsSearchField component with 4 sizes (XXS, XS, S, M), states (Default, Hover, Focused, Input-text), built-in search icon, clear button, and optional filter help icon,
So that I can implement search inputs matching the Figma design, composed internally from DsInputText and DsIcon.

**Acceptance Criteria:**

**Given** a consuming project with the design system installed
**When** the developer imports DsSearchField from the library
**Then** the component renders matching Figma specs in both light and dark themes
**And** size prop accepts "xxsmall" (28px), "xsmall" (32px), "small" (36px), "medium" (40px)
**And** the consumer does NOT need to import DsInputText or DsIcon separately (FR15)

**Given** DsSearchField is rendered at size XS, S, or M
**When** the component is in Default state
**Then** a built-in 20px search icon renders to the left of the placeholder text
**And** at size XXS, the search icon is optional via `searchIcon` prop (18px)

**Given** DsSearchField is interacted with
**When** the user hovers, focuses, and types
**Then** it transitions: Default (gray-100 bg, gray-400 border) → Hover (gray-200 bg, gray-800 border) → Focused (gray-100 bg, gray-800 border, cursor visible) → Input-text (gray-100 bg, gray-800 border, typed text in gray-800)
**And** all transitions use 150ms ease timing with `motion-safe:` prefix
**And** focus is indicated via `focus-visible:` ring in both themes

**Given** DsSearchField is in Input-text state with content
**When** the user has typed text
**Then** a clear button (Exit Enable, 24px) appears on the right
**And** clicking clear empties the input and emits an update event
**And** optionally, the clear button can show in other states via `clear` prop

**Given** DsSearchField has `helpIcon` prop enabled
**When** the field renders
**Then** a filter icon button appears to the right with "Search options" tooltip
**And** clicking it emits a help/filter event

**Given** DsSearchField is a custom Tailwind component
**When** it composes DsInputText and DsIcon internally (FR13)
**Then** keyboard navigation (tab, escape to clear) and ARIA support are implemented manually (NFR5)
**And** TypeScript types are provided for all props (size, searchIcon, clear, helpIcon, placeholder, modelValue)

**Given** the component is implemented
**When** the implementation checklist is complete
**Then** co-located files exist: `DsSearchField.vue`, `DsSearchField.stories.ts`, `DsSearchField.test.ts`, `index.ts`
**And** Storybook stories cover all 4 sizes × all states, with/without helpIcon and clear
**And** Vitest tests verify composition, clear behavior, keyboard navigation, and ARIA
**And** AI knowledge base entry exists at `docs/ai-guidelines/ds-search-field.md`
**And** component is exported from `src/index.ts`

**Figma reference:** `Design-Systems / node 2:44972`

### Story 8.2: DsCodeInput Component

As a **developer or AI agent**,
I want a DsCodeInput component rendering individual character cells (PIN/OTP style) with states (Default, Hover, Focused, Input, Error, Disabled), configurable length, and error message support,
So that I can implement verification-code input fields matching the Figma design.

**Classification note:** DsCodeInput was originally classified "Custom Tailwind" in the PRD component table. Story 8.2 reclassified it as a **thin PrimeVue `InputOtp` wrapper** because PrimeVue 4.5.4 ships `InputOtp` natively with cell DOM, auto-advance, backspace, and paste handling built in — wrapping it is simpler and more robust than rebuilding the cell logic in Tailwind.

**Acceptance Criteria:**

**Given** a consuming project with the design system installed
**When** the developer imports DsCodeInput from the library
**Then** the component renders a row of individual PrimeVue `InputOtp` cells (default 4) matching Figma specs in both light and dark themes
**And** each cell is 43px wide × 58px tall, border-radius 4px, border 1.5px, font Inter 30px / line-height 32px / letter-spacing -0.2px, with 16px gap between cells

**Given** DsCodeInput has a `length` attribute (forwarded via `$attrs` to `InputOtp`, not a DS-explicit prop)
**When** set to a positive integer (PrimeVue default 4)
**Then** it renders that many individual character cells in a horizontal row

**Given** a user interacts with DsCodeInput cells
**When** each cell is interacted with
**Then** states render per cell (all colors via `--p-*` tokens, not hardcoded hex): Default (`--p-gray-100` bg, `--p-gray-300` border) → Hover (`--p-gray-200` bg, `--p-gray-800` border) → Focused (`--p-surface-0` bg, `--p-purple-600` border, glow `0 0 5px rgba(120,73,255,0.6)`, suppressed on pointer focus via `:focus:not(:focus-visible)`) → Input (`--p-surface-0` bg, `--p-purple-600` border, `--p-purple-600` text color)
**And** focus auto-advances to the next cell after a character is entered (PrimeVue behavior, not reimplemented)
**And** Backspace moves focus to the previous cell and clears it (PrimeVue behavior)
**And** Cmd/Ctrl+V paste populates all cells (PrimeVue behavior)

**Given** DsCodeInput is in Error state
**When** the `error` prop is a non-empty string (whitespace-only treated as absent)
**Then** all cells show `--p-red-50` bg with `--p-red-700` border
**And** entered text remains in `--p-gray-800`
**And** caret color is `--p-red-700`
**And** error message text appears below in 14px Inter 500 `--p-red-700` preceded by a 14px red error icon
**And** error is SUPPRESSED when `disabled` is also true

**Given** DsCodeInput wraps PrimeVue `InputOtp`
**When** implemented
**Then** PrimeVue's built-in keyboard navigation is preserved: Tab to enter/exit, arrow keys between cells, Backspace to go back, paste support for the full code (NFR4)
**And** ARIA attributes are set on the outer container: `role="group"`, `aria-labelledby` pointing at the label span (when `label` prop is provided), `aria-describedby` pointing at the error message (when error is shown), `aria-invalid="true"` (when error is shown)
**And** the same `aria-describedby` and `aria-invalid` are routed onto each cell `<input>` via `pt.pcInputText.root`, because `aria-describedby` does not inherit from a `role="group"` ancestor to descendant inputs (NFR5)
**And** whitespace-only `label`, `hint`, and `error` strings are treated as absent (no ARIA emitted, no DOM rendered)
**And** TypeScript types are provided for the DS-explicit props (`label`, `hint`, `error`, `disabled`, `modelValue`); `length`, `mask`, `integerOnly`, `readonly`, `tabindex`, `pt`, and other PrimeVue `InputOtp` props flow through via `$attrs`
**And** consumer-supplied `pt` is deep-merged with the wrapper's internal injections (placeholder for `:placeholder-shown` state CSS, plus per-cell ARIA on error) so `$attrs` forwarding remains useful

**Given** the component is implemented
**When** the implementation checklist is complete
**Then** co-located files exist: `DsCodeInput.vue`, `DsCodeInput.stories.ts`, `DsCodeInput.test.ts`, `index.ts`
**And** Storybook stories cover all 5 cell states, error state with message, different lengths, `integerOnly`, `mask`, paste behavior, and an AllStates composite
**And** Vitest tests verify cell rendering, prop forwarding via `$attrs`, `pt` deep-merge, per-cell ARIA on error, whitespace handling, and disabled/error suppression
**And** AI knowledge base entry exists at `docs/ai-guidelines/ds-code-input.md`
**And** component is exported from `src/index.ts` (alphabetical — between `DsChip` and `DsIcon`)

**Figma reference:** `Design-Systems / node 2:45695`

---

## Epic 9: Library Integration & Release

The expanded 12-component library builds, tests, and publishes without breaking changes. AI guidelines index updated to cover all 12 components. Storybook organized with complete Phase 2 coverage.

### Story 9.1: Build Verification & Package Integration

As a **library consumer**,
I want the expanded 12-component package to install, build, and tree-shake without breaking changes to existing MVP components,
So that I can upgrade to Phase 2 without modifying any existing code.

**Acceptance Criteria:**

**Given** all 7 new components are implemented in Epics 6–8
**When** the barrel export `src/index.ts` is updated with all new components
**Then** all 12 components (5 existing + 7 new) are individually importable

**Given** a consuming project using the Phase 1 library (v0.1.x)
**When** upgrading to the Phase 2 package
**Then** all existing imports (`DsButton`, `DsIconButton`, `DsInputText`, `DsLink`, `DsIcon`) continue to work without changes (FR17)
**And** no existing component behavior or API is modified

**Given** the library is built with `vite build`
**When** the build completes
**Then** ESM output is generated in `dist/` with `.d.ts` type declarations for all 12 components
**And** tree-shaking works — consuming projects only bundle imported components (FR16)
**And** no new peer dependencies are introduced beyond Vue 3 and PrimeVue (NFR10)

**Given** the full test suite runs
**When** `vitest run` is executed
**Then** all Phase 1 and Phase 2 component tests pass
**And** `biome check` passes with no lint errors

**Given** the package.json is updated
**When** version is bumped to the next minor version
**Then** the package is ready for `npm publish` under `@failwin/desing-system-vue`

### Story 9.2: AI Knowledge Base Integration

As an **AI coding agent**,
I want the AI guidelines index updated to list all 12 available components with consistent per-component entries,
So that I can reliably match Figma design elements to library components from the expanded inventory.

**Acceptance Criteria:**

**Given** all 7 new component AI KB entries were created in Epics 6–8
**When** `docs/ai-guidelines/index.md` is updated
**Then** it lists all 12 components with: component name, brief description, and link to per-component entry (FR21)
**And** the index follows the same structure and format as the Phase 1 index

**Given** an AI agent queries the knowledge base
**When** looking for a component matching a Figma design element
**Then** it can determine which of the 12 library components matches from the index alone (FR23)
**And** each per-component entry (7 new) contains: component name, when to use, available props/variants, usage examples, and Figma reference (FR22)

**Given** all AI KB entries are complete
**When** compared to Phase 1 entries (ds-button.md, ds-icon.md, etc.)
**Then** Phase 2 entries are indistinguishable in quality, structure, and format (NFR13, NFR14)

**Given** the knowledge base is validated
**When** an AI agent processes the documentation
**Then** the consistent entry format enables reliable LLM parsing across all 12 components

### Story 9.3: Storybook Organization & Release Validation

As a **developer**,
I want Storybook organized with all 12 components browsable by Figma structure, with interactive stories for every Phase 2 variant,
So that I can find, explore, and copy usage patterns for any component in the library.

**Acceptance Criteria:**

**Given** all 7 new component stories were created in Epics 6–8
**When** Storybook is built and browsed
**Then** all 12 components are organized by Figma structure (Foundations → Components) (FR18)
**And** every Phase 2 component variant and state has a live interactive story (FR19)
**And** all Phase 2 stories have working Storybook controls for prop manipulation (FR20)

**Given** Storybook is built with `storybook build`
**When** the static build completes
**Then** no stories produce rendering errors (NFR12)
**And** all stories render correctly in both light and dark themes

**Given** the maintainer validates the release
**When** checking each Phase 2 component in Storybook
**Then** visual output can be compared against Figma screenshots (FR26)
**And** the repeatable addition pattern is confirmed — PrimeVue wrappers follow the wrapper checklist (FR24), custom Tailwind components follow the custom checklist (FR25)

**Given** all validation passes
**When** the release is prepared
**Then** Storybook static build is ready for GitHub Pages deployment
**And** npm package is ready for publish
**And** CHANGELOG documents all 7 new components added in Phase 2
