---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
status: complete
completedAt: '2026-03-27'
inputDocuments:
  - prd.md
  - architecture.md
  - ux-design-specification.md
---

# desing-system-vue - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for desing-system-vue, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: The library can export a PrimeVue custom theme preset with all Figma color tokens (Gray, Purple, Blue, Red, Green, Orange, Teal, Yellow, Pink with full shade ranges)
FR2: The library can export a PrimeVue custom theme preset with all Figma typography tokens (Inter font family, weight scale, size scale, line heights, letter spacing)
FR3: The library can export a PrimeVue custom theme preset with all Figma shadow tokens
FR4: The library can export a PrimeVue custom theme preset with all Figma spacing tokens
FR5: The library can provide a light theme preset derived from Figma light mode tokens
FR6: The library can provide a dark theme preset derived from Figma dark mode tokens
FR7: Consuming applications can switch between light and dark themes via PrimeVue's theme switching API
FR8: Developers can import and render DsIcon with configurable name, size, and color
FR9: Developers can import and render DsButton with variants (Primary, Outlined, Tertiary, Text, Text/link, Negative), sizes (XS, S, M, L), and states (Default, Hover, Focus, Active, Disabled, Loading)
FR10: Developers can import and render DsIconButton containing a DsIcon internally, with all DsButton sizes
FR11: Developers can import and render DsInputText with sizes (S, M) and states (Default, Hover, Focus, Filled, Error, Disabled)
FR12: Developers can import and render DsLink with types (Regular, Smart, Quiet), sizes (S, M), and visibility levels (high, low)
FR13: All components can accept and pass through standard PrimeVue props, slots, and events for their underlying PrimeVue base component
FR14: All components can render matching the Figma design in both light and dark themes without additional styling
FR15: Consuming projects can install the library via npm
FR16: Consuming projects can import individual components (tree-shakeable)
FR17: The library can declare PrimeVue and Vue 3 as peer dependencies
FR18: All components can provide TypeScript type definitions for props, emits, and slots
FR19: Developers can browse all components organized by Figma structure (Foundations → Components)
FR20: Developers can view live interactive stories for every component variant and state
FR21: Developers can manipulate component props via Storybook controls
FR22: Developers can browse dedicated pages showing composed layout examples
FR23: Developers can copy usage patterns from story source code
FR24: AI agents can access structured documentation listing all available components
FR25: AI agents can look up per-component entries containing: component name, when to use, available props/variants, usage examples, and Figma reference
FR26: AI agents can determine which library component matches a given Figma design element
FR27: AI agents can identify when no library component exists for a Figma element and flag the gap
FR28: The maintainer can add a new PrimeVue-based component by creating a preset configuration, Storybook story, and AI knowledge base entry
FR29: The maintainer can add a new custom Tailwind component following PrimeVue API conventions (same prop patterns, slot naming, event conventions)
FR30: The maintainer can validate component visual output against Figma screenshots in Storybook

### NonFunctional Requirements

NFR1: Individual component bundle size must be minimized via tree-shaking — consuming projects only load components they import
NFR2: Components must not introduce rendering performance overhead beyond PrimeVue's baseline
NFR3: Theme preset switching (light/dark) must be instantaneous with no visible flash of unstyled content
NFR4: All PrimeVue-wrapped components must preserve PrimeVue's built-in keyboard navigation and ARIA attributes
NFR5: Custom Tailwind components (DsIcon, DsLink) must implement equivalent keyboard navigation and ARIA support
NFR6: All interactive components must have visible focus indicators in both light and dark themes
NFR7: All color combinations must meet WCAG AA contrast ratios (4.5:1 normal text, 3:1 large text)
NFR8: Information must not be conveyed by color alone — icons, text, or patterns must supplement color-coded states
NFR9: The library must be compatible with Vue 3.x and PrimeVue 4.x
NFR10: The library must work with Vite-based consuming projects
NFR11: TypeScript types must be compatible with both strict and non-strict TypeScript configurations
NFR12: Tailwind CSS utilities in custom components must not conflict with consuming project's Tailwind configuration
NFR13: Every Storybook story must load and render without errors
NFR14: AI knowledge base entries must follow a consistent structure enabling reliable LLM parsing
NFR15: Documentation must stay current — no component changes without corresponding Storybook and knowledge base updates

### Additional Requirements

- Architecture specifies a custom Vite scaffold as the starter template: `npm create vite@latest desing-system-vue -- --template vue-ts` — this impacts Epic 1 Story 1
- Dependencies to install on scaffold: PrimeVue 4.5.x, Tailwind CSS 4, Storybook 10 (@storybook/vue3-vite), Vitest 4, @vue/test-utils, Biome 2, vite-plugin-dts 4.5.x
- Single-package repository (not monorepo)
- Vite 8 library mode with ESM output — Vue 3 and PrimeVue configured as externals (peer dependencies)
- Single barrel export via `src/index.ts`
- Single preset file `src/theme/ds-preset.ts` using `definePreset()` with Aura as the base preset
- Co-located file structure: each component in `src/components/DsComponentName/` with `.vue`, `.stories.ts`, `.test.ts`, `index.ts`
- AI knowledge base in `docs/ai-guidelines/`
- CI/CD: three GitHub Actions workflows — `test.yml` (PR: Biome + Vitest), `publish.yml` (tag: npm publish as `@failwin/desing-system-vue`), `storybook.yml` (main: GitHub Pages deploy)
- Component wrapper pattern: `inheritAttrs: false` + `v-bind="$attrs"` for PrimeVue wrappers
- Props validated via TypeScript types (build-time), not runtime validators
- Components never throw — graceful degradation with sensible defaults
- No shared utilities or composables directories — wrappers are too thin to need shared code
- DsButton validates the Styled Mode approach — if it fails, fallback to Unstyled + Tailwind before building remaining components
- DsIcon must be built before DsIconButton (dependency)
- Theme preset must be established before any component (all components consume tokens)
- Storybook `preview.ts` must register PrimeVue with `dsPreset` as a global decorator
- Published as `@failwin/desing-system-vue` on public npm
- Storybook static build deployed to GitHub Pages

### UX Design Requirements

UX-DR1: Implement complete Figma color token system — Surface/Main (Gray 0–950), Surface/Purple (50–800), Surface/Negative/Red (50–800), Surface/Supporting/Blue, Amber, Orange, Pink palettes, plus Outline and Text color groups — all mapped to PrimeVue CSS custom properties
UX-DR2: Implement typography token system — Inter font family for headings and body, weight scale (400 regular, 500 medium, 600 semibold), size scale (12px H12 through 30px 3xl), composite styles with specific line heights and letter spacing (-0.2px default)
UX-DR3: Implement spacing token system — 0/2/4/8/12/16/20/32px scale mapped from Figma spacing variables to PrimeVue/Tailwind tokens
UX-DR4: Implement border radius token system — non (0px), md (4px), lg (8px), xl (12px)
UX-DR5: Implement border width token system — 50 (1px), 100 (1.2px), 200 (1.5px)
UX-DR6: Implement shadow/effects token system — XS, SM, Shadow 3, Key light shadow, and Error-100 focus ring shadow
UX-DR7: DsButton must implement 6 variant types (Primary, Outlined, Tertiary, Text, Text/link, Negative) with usage rules — max one Primary per section, Negative always paired with cancel
UX-DR8: DsButton must implement loading state that replaces button content while preserving button width
UX-DR9: DsButton disabled state must retain type styling at reduced opacity (0.5) — never change type when disabling
UX-DR10: DsInputText must implement 8 visual states — Default (gray border), Hover (darkened border), Focus (primary color border), Filled (subtle background change), Filled-Hover, Disabled (reduced opacity), Error (red border + error message below), Skip
UX-DR11: Form validation must trigger on blur (not keystroke), show error below field, clear on typing, re-validate on next blur
UX-DR12: All interactive components must follow universal state behavior — Default, Hover, Focus, Active/Pressed, Disabled, Loading — with state priority: Disabled > Loading > Active > Focus > Hover > Default
UX-DR13: All state transitions must use 150ms ease timing (no transitions on disabled state changes)
UX-DR14: DsLink must implement three types — Regular (underlined blue), Smart (blue text with blue background on hover), Quiet (blue text, underline on hover) — with High and Low visibility levels
UX-DR15: Component sizing must follow uniform size token table — xsmall (24px/12px icon/12px font/8px padding), small (32px/16px/14px/12px), medium (36px/20px/14px/16px), large (40px/20px icon/14px font/32px padding)
UX-DR16: DsIcon must inherit text color by default, explicit color only for semantic meaning; icon size always matches component size tier
UX-DR17: DsIconButton must contain DsIcon as a child (slot), not via props — allows flexible icon composition
UX-DR18: Components must be fluid (fill container width); text uses rem-based sizing
UX-DR19: Custom Tailwind components must use semantic HTML elements (button, input, a — not div with click handlers), include ARIA attributes, implement keyboard handlers (Enter/Space, Escape, Arrow keys), use focus-visible: for focus rings, add motion-safe: prefix to transitions
UX-DR20: Error states in form components must use `aria-describedby` to associate error messages; loading states must announce via `aria-live="polite"`
UX-DR21: Dark mode token mapping — backgrounds invert, text inverts, shadows reduce intensity, focus rings remain visible, borders shift to dark-appropriate subtle dividers, icons inherit adapted text color
UX-DR22: Storybook must demonstrate components at three viewport widths — Mobile (320–767px), Tablet (768–1023px), Desktop (1024px+) — to verify no overflow or broken layouts

### FR Coverage Map

FR1: Epic 1 — Color tokens in PrimeVue preset
FR2: Epic 1 — Typography tokens in PrimeVue preset
FR3: Epic 1 — Shadow tokens in PrimeVue preset
FR4: Epic 1 — Spacing tokens in PrimeVue preset
FR5: Epic 1 — Light theme preset
FR6: Epic 1 — Dark theme preset
FR7: Epic 1 — Theme switching API
FR8: Epic 1 — DsIcon component (Story 1.2.1, moved from Epic 2 as foundation dependency)
FR9: Epic 1 — DsButton component (approach validation)
FR10: Epic 2 — DsIconButton component
FR11: Epic 2 — DsInputText component
FR12: Epic 2 — DsLink component
FR13: Epic 1 — PrimeVue prop passthrough (validated with DsButton)
FR14: Epic 1 — Figma fidelity in both themes (validated with DsButton)
FR15: Epic 1 — npm installable package
FR16: Epic 1 — Tree-shakeable imports
FR17: Epic 1 — PrimeVue and Vue 3 as peer dependencies
FR18: Epic 1 — TypeScript type definitions
FR19: Epic 3 — Storybook organized by Figma structure
FR20: Epic 3 — Interactive stories for all variants/states
FR21: Epic 3 — Storybook prop controls
FR22: Epic 3 — Composed layout example pages
FR23: Epic 3 — Copy-able usage patterns
FR24: Epic 4 — AI knowledge base component inventory
FR25: Epic 4 — Per-component AI KB entries
FR26: Epic 4 — Figma element to component matching
FR27: Epic 4 — Gap detection and flagging
FR28: Epic 5 — Repeatable PrimeVue component addition pattern
FR29: Epic 5 — Repeatable custom Tailwind component pattern
FR30: Epic 3 — Visual validation against Figma in Storybook

## Epic List

### Epic 1: Project Foundation, Design Tokens & Approach Validation (DsButton)
A consuming Vue 3 project can install the library, apply the Figma design token preset (colors, typography, spacing, shadows), and use DsButton with all 6 variants, 4 sizes, and all states in both light and dark themes — validating the Styled Mode approach end-to-end. DsIcon is included as a foundation dependency required by DsButton and DsIconButton.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR9, FR13, FR14, FR15, FR16, FR17, FR18

### Epic 2: Complete MVP Component Set
Developers can implement common Figma UI patterns — icons, icon buttons, text inputs, and navigation links — using library components with full variant/state coverage, all matching Figma in both themes.
**FRs covered:** FR8, FR10, FR11, FR12

### Epic 3: Developer Documentation (Storybook)
Developers can discover, explore, and learn all library components through interactive Storybook documentation organized by Figma structure, with live examples, prop controls, composed layout pages, and visual validation against Figma.
**FRs covered:** FR19, FR20, FR21, FR22, FR23, FR30

### Epic 4: AI Agent Knowledge Base
AI coding agents can access structured per-component documentation, match Figma design elements to library components, produce correct imports and prop usage, and flag gaps when a component doesn't exist yet.
**FRs covered:** FR24, FR25, FR26, FR27

### Epic 5: CI/CD & Library Publishing
The library is reliably published to npm (`@failwin/desing-system-vue`), Storybook is deployed to GitHub Pages, and the maintainer can add new components (both PrimeVue-wrapped and custom Tailwind) following repeatable, documented patterns.
**FRs covered:** FR28, FR29

---

## Epic 1: Project Foundation, Design Tokens & Approach Validation (DsButton)

A consuming Vue 3 project can install the library, apply the Figma design token preset (colors, typography, spacing, shadows), and use DsButton with all 6 variants, 4 sizes, and all states in both light and dark themes — validating the Styled Mode approach end-to-end.

### Story 1.1: Project Scaffold & Build Configuration

As a library maintainer,
I want a fully configured Vue 3 + TypeScript project with Vite library mode, Biome, and all dependencies installed,
So that I have a working foundation to build components on.

**Acceptance Criteria:**

**Given** an empty directory
**When** the project is scaffolded with `npm create vite@latest desing-system-vue -- --template vue-ts`
**Then** the following dependencies are installed and configured:
**And** PrimeVue 4.5.x, Tailwind CSS 4, Vitest 4, @vue/test-utils, Biome 2, vite-plugin-dts 4.5.x
**And** Vite is configured in library mode with ESM output
**And** Vue 3 and PrimeVue are configured as externals (peer dependencies, not bundled)
**And** `tsconfig.json` is configured with strict mode enabled
**And** `tsconfig.build.json` excludes stories and test files from declaration output
**And** Biome is configured for linting and formatting (replaces ESLint + Prettier)
**And** `src/index.ts` barrel export file exists (empty, ready for component exports)
**And** `npm run build` completes successfully producing `dist/` with ESM output
**And** `biome check` passes with no errors

### Story 1.2: Design Token Preset with Light & Dark Themes

As a consuming application developer,
I want to apply the Figma design token preset to PrimeVue so all components render with the project's design language,
So that my application matches the Figma Design System in both light and dark mode without custom CSS.

**Acceptance Criteria:**

**Given** the `src/theme/ds-preset.ts` file is created using `definePreset()` with Aura as the base
**When** a consuming app registers PrimeVue with `{ theme: { preset: dsPreset } }`
**Then** all Figma color tokens are available as CSS custom properties:
**And** Surface/Main Gray palette (0, 100, 200, 300, 400, 500, 800, 900, 950)
**And** Surface/Purple brand palette (50, 100, 500, 600, 800)
**And** Surface/Negative Red palette (50, 100, 400, 700, 800)
**And** Surface/Supporting Blue, Amber, Orange, Pink palettes
**And** Outline color groups (Main, Brand, Supporting, Negative)
**And** Text color groups (Main, Brand, Supporting, Negative)

**Given** the typography tokens are mapped in the preset
**When** components render
**Then** Inter font family is applied for both headings and body text
**And** font weights 400 (regular), 500 (medium), 600 (semibold) are available
**And** font sizes from 12px (H12) through 30px (3xl) are mapped with correct line heights
**And** letter spacing -0.2px is applied as the default

**Given** the spacing, border radius, border width, and shadow tokens are mapped
**When** components render
**Then** spacing scale 0/2/4/8/12/16/20/32px is available
**And** border radius tokens non (0), md (4px), lg (8px), xl (12px) are available
**And** border width tokens 50 (1px), 100 (1.2px), 200 (1.5px) are available
**And** shadow tokens XS, SM, Shadow 3, Key light shadow, and Error-100 focus ring are defined

**Given** light and dark themes are defined within the single preset
**When** the consuming app calls PrimeVue's theme switching API
**Then** the theme switches instantaneously with no flash of unstyled content (NFR3)
**And** dark mode inverts backgrounds and text colors per Figma dark mode definitions
**And** shadows reduce in intensity in dark mode
**And** focus rings remain visible in both themes

**Given** the preset is exported from `src/index.ts`
**When** a consumer imports `{ dsPreset }` from the library
**Then** the import resolves correctly and the preset is usable

### Story 1.2.1: Icon Component

As a developer implementing a Figma design,
I want to use DsIcon to render SVG icons from the design system with configurable size,
so that icons in my application match the Figma Design System consistently across both themes.

**Acceptance Criteria:**

**Given** DsIcon is a custom Vue component (no PrimeVue equivalent)
**When** a developer uses `<DsIcon name="search" size="medium" />`
**Then** the icon renders the correct SVG at the size tier dimensions (12px XS, 16px S, 20px M, 24px L)

**Given** SVG icon assets are exported from Figma (node `2014:12648`)
**When** the component library is built
**Then** all ~150 icons are available as inline SVGs — no external font files or image requests at runtime

**Given** DsIcon follows semantic HTML and accessibility rules (UX-DR19)
**When** the component renders
**Then** decorative icons have `aria-hidden="true"` by default
**And** informational icons accept an `aria-label` prop for accessible naming

**Given** DsIcon inherits text color by default (UX-DR16)
**When** no explicit color class is provided
**Then** the icon color matches the surrounding text color via `currentColor`
**And** the color adapts automatically in dark mode

**Given** DsIcon accepts a `class` attribute (standard Vue behavior)
**When** a developer uses `<DsIcon name="search" class="text-primary-500" />`
**Then** the class is applied to the wrapper element, overriding the inherited `currentColor` with the Tailwind utility color. No `color` prop exists — color is controlled exclusively via CSS classes.

**Given** DsIcon has TypeScript types and a co-located test file
**When** the component is used in TypeScript and tests are run
**Then** all props have type definitions and tests verify rendering at all size tiers, color inheritance, class passthrough, and accessibility attributes

**Given** DsIcon is exported from `src/index.ts`
**When** a consumer imports `{ DsIcon }` from the library
**Then** the import resolves correctly and the component renders

**Given** some icons have variants (e.g., Star outline/filled, Arrow directions, Check states)
**When** the developer needs a variant
**Then** variants are accessible via the `name` prop using a consistent naming convention (e.g., `"star-outline"`, `"star-filled"`, `"arrow-left"`)

### Story 1.3: DsButton Component (Approach Validation)

As a developer implementing a Figma design,
I want to use DsButton with all variants, sizes, and states that match the Figma Design System,
So that buttons in my application are pixel-accurate to the Figma source in both themes.

**Acceptance Criteria:**

**Given** DsButton wraps PrimeVue Button using `inheritAttrs: false` + `v-bind="$attrs"`
**When** a developer uses `<DsButton severity="primary" size="medium">Save</DsButton>`
**Then** the button renders matching the Figma Primary button at Medium size

**Given** DsButton supports all 6 variant types
**When** the `severity` prop is set to primary, outlined, tertiary, text, text-link, or negative
**Then** each variant renders with its Figma-specified styling (colors, borders, backgrounds)
**And** the Negative variant uses the Red palette from the preset

**Given** DsButton supports 4 sizes following the uniform size token table
**When** the `size` prop is set to xsmall, small, medium, or large
**Then** XS renders at 24px height with 12px icon, 12px font, 8px horizontal padding
**And** Small renders at 32px height with 16px icon, 14px font, 12px horizontal padding
**And** Medium renders at 36px height with 20px icon, 14px font, 16px horizontal padding
**And** Large renders at 40px height with 20px icon, 14px font, 32px horizontal padding

**Given** DsButton implements universal state behavior
**When** the button transitions through Default, Hover, Focus, Active/Pressed, Disabled, and Loading states
**Then** state priority is enforced: Disabled > Loading > Active > Focus > Hover > Default
**And** all state transitions use 150ms ease timing (no transition on disabled change)
**And** hover shows slightly darkened/lightened background
**And** focus shows visible focus ring using `focus-visible:` (not `focus:`)
**And** disabled retains variant styling at reduced opacity (0.5) with `pointer-events: none` and `aria-disabled="true"`

**Given** DsButton supports a loading state
**When** the `loading` prop is set to true
**Then** button content is replaced by a loading indicator
**And** button width is preserved (does not collapse)
**And** loading state announces to screen readers via `aria-live="polite"`

**Given** DsButton is a PrimeVue wrapper
**When** any standard PrimeVue Button prop, slot, or event is used
**Then** it passes through correctly to the underlying PrimeVue Button (FR13)

**Given** DsButton renders in dark mode
**When** the application theme is switched to dark
**Then** the button renders correctly using dark theme tokens
**And** all 6 variants display correctly in dark mode

**Given** DsButton has TypeScript types
**When** a developer uses the component in a TypeScript project
**Then** all props (severity, size, disabled, loading) have type definitions with documented variants
**And** TypeScript autocomplete shows valid values for severity and size

**Given** DsButton has a co-located test file `DsButton.test.ts`
**When** tests are run with Vitest
**Then** tests verify all variants render, all sizes apply correct classes, disabled and loading states work, and PrimeVue prop passthrough functions

**Given** this story validates the Styled Mode approach
**When** DsButton renders pixel-accurate to Figma in all variants and both themes using only the preset (no pt API overrides needed for core styling)
**Then** the Styled Mode approach is validated — proceed with remaining components
**And** if the preset cannot achieve Figma fidelity, document the gaps and flag the fallback decision (Unstyled + Tailwind)

### Story 1.4: Package Distribution & Consumption Validation

As a consuming project developer,
I want to install the library via npm and import components with full TypeScript support,
So that I can use design system components in my Vue 3 application with zero configuration beyond PrimeVue preset registration.

**Acceptance Criteria:**

**Given** `package.json` is configured for npm distribution
**When** the package is built
**Then** `package.json` declares `name` as `@failwin/desing-system-vue`
**And** `peerDependencies` include Vue 3.x and PrimeVue 4.x
**And** `exports` field maps `"."` to `"./dist/index.js"`
**And** `types` field points to generated `.d.ts` declarations

**Given** `src/index.ts` exports DsButton and dsPreset
**When** a consumer imports `{ DsButton, dsPreset }` from the package
**Then** both imports resolve correctly
**And** unused exports are tree-shaken by the consumer's bundler (NFR1)

**Given** vite-plugin-dts is configured
**When** `npm run build` is executed
**Then** TypeScript declaration files (`.d.ts`) are generated in `dist/`
**And** declarations are compatible with both strict and non-strict TypeScript configs (NFR11)

**Given** a fresh Vue 3 + Vite consuming project
**When** the developer installs the package, registers PrimeVue with dsPreset, and uses `<DsButton severity="primary">Test</DsButton>`
**Then** DsButton renders correctly with Figma design tokens applied
**And** no Tailwind CSS conflicts occur between library and consuming project (NFR12)
**And** the consuming project's bundle only includes DsButton code, not the entire library (tree-shaking)

---

## Epic 2: Complete MVP Component Set

Developers can implement common Figma UI patterns — icons, icon buttons, text inputs, and navigation links — using library components with full variant/state coverage, all matching Figma in both themes.

### Story 2.1: DsIconButton Component

As a developer implementing a Figma design,
I want to use DsIconButton for icon-only buttons with all sizes,
So that icon buttons match the Figma Design System and behave consistently with DsButton.

**Acceptance Criteria:**

**Given** DsIconButton wraps PrimeVue Button using `inheritAttrs: false` + `v-bind="$attrs"`
**When** a developer uses `<DsIconButton size="medium"><DsIcon name="edit" /></DsIconButton>`
**Then** the button renders as an icon-only button at the correct size

**Given** DsIconButton contains DsIcon as a child via slot (not via props)
**When** any DsIcon is passed as slot content
**Then** the icon renders inside the button with flexible icon composition (UX-DR17)

**Given** DsIconButton supports all 4 sizes (XS, S, M, L)
**When** the `size` prop is set
**Then** the button height and icon size match the uniform size token table (UX-DR15)
**And** the button maintains square proportions (width equals height)

**Given** DsIconButton implements universal state behavior
**When** the button transitions through states
**Then** it follows the same state priority, transitions (150ms ease), and disabled behavior as DsButton
**And** focus ring is visible using `focus-visible:`
**And** disabled state uses opacity 0.5 with `aria-disabled="true"`

**Given** DsIconButton has an accessible name
**When** the component renders
**Then** an `aria-label` prop is required (or `aria-labelledby`) since there is no visible text

**Given** DsIconButton renders correctly in both themes
**When** the application switches between light and dark mode
**Then** the button and its icon adapt via design tokens

**Given** DsIconButton has TypeScript types and a co-located test file
**When** the component is used and tests are run
**Then** all props have type definitions and tests verify all sizes, slot rendering, accessibility attributes, and state behavior

### Story 2.2: DsInputText Component

As a developer implementing a Figma form design,
I want to use DsInputText with all sizes and visual states,
So that text inputs in my application match the Figma Design System with correct validation behavior.

**Acceptance Criteria:**

**Given** DsInputText wraps PrimeVue InputText using `inheritAttrs: false` + `v-bind="$attrs"`
**When** a developer uses `<DsInputText size="medium" v-model="value" />`
**Then** the input renders matching the Figma text input at Medium size

**Given** DsInputText supports 2 sizes (S, M)
**When** the `size` prop is set
**Then** Small renders at 32px height with 14px font
**And** Medium renders at 36px height with 16px font

**Given** DsInputText implements 8 visual states
**When** the input transitions through states
**Then** Default shows gray border
**And** Hover shows darkened border
**And** Focus shows primary color (purple) border
**And** Filled shows subtle background change
**And** Filled-Hover shows filled style plus hover indicator
**And** Disabled shows reduced opacity (0.5) with `pointer-events: none`
**And** Error shows red border with error message text displayed below the field
**And** Skip shows the skipped visual state

**Given** DsInputText supports error state with accessible messaging
**When** an `error` prop is provided with an error message string
**Then** the error message renders below the input field
**And** the error message is associated with the input via `aria-describedby` (UX-DR20)
**And** the input border turns red using the Negative/Red token

**Given** DsInputText follows form validation patterns
**When** integrated in a form context
**Then** the component supports validation on blur (not keystroke) via standard Vue events
**And** error state can be cleared programmatically when the user starts typing

**Given** DsInputText passes through PrimeVue InputText props, slots, and events
**When** any standard PrimeVue InputText prop is used (placeholder, maxlength, etc.)
**Then** it passes through correctly (FR13)

**Given** DsInputText renders correctly in both themes
**When** the application switches themes
**Then** all 8 states display correctly in dark mode using inverted tokens

**Given** DsInputText has TypeScript types and a co-located test file
**When** the component is used and tests are run
**Then** all props have type definitions and tests verify both sizes, all states, error message rendering, accessibility attributes, and PrimeVue passthrough

### Story 2.3: DsLink Component

As a developer implementing navigation in a Figma design,
I want to use DsLink with all types, sizes, and visibility levels,
So that links in my application match the Figma Design System and are accessible.

**Acceptance Criteria:**

**Given** DsLink is a custom Tailwind component (no direct PrimeVue equivalent)
**When** a developer uses `<DsLink type="regular" size="medium" href="/settings">Settings</DsLink>`
**Then** the link renders matching the Figma Regular link at Medium size

**Given** DsLink supports 3 link types
**When** the `type` prop is set
**Then** Regular renders as underlined blue text (for standard hyperlinks)
**And** Smart renders as blue text with blue background on hover (for internal app navigation)
**And** Quiet renders as blue text with no underline, underline appears on hover (for subtle in-content links)

**Given** DsLink supports 2 sizes (S, M)
**When** the `size` prop is set
**Then** Small renders with 14px font and 20px line height
**And** Medium renders with 16px font and 24px line height

**Given** DsLink supports 2 visibility levels
**When** the `visibility` prop is set
**Then** High (default) uses blue text color — stands out as interactive
**And** Low uses gray text color — blends with content, hover reveals interactivity

**Given** DsLink uses semantic HTML and is accessible
**When** the component renders
**Then** it uses a native `<a>` element (not `<div>` or `<span>`)
**And** keyboard navigation works via Tab and Enter
**And** focus ring is visible using `focus-visible:` in both themes
**And** disabled state (if provided) sets `aria-disabled="true"` and prevents navigation

**Given** DsLink supports left and right icon slots
**When** DsIcon components are placed in icon slots
**Then** icons render at the correct size matching the link's size tier

**Given** DsLink follows PrimeVue API conventions
**When** the component is used
**Then** prop naming follows PrimeVue patterns (size, disabled)
**And** event patterns match PrimeVue conventions

**Given** DsLink renders correctly in both themes and all state transitions use 150ms ease
**When** the application switches themes
**Then** all 3 types and 2 visibility levels display correctly in dark mode

**Given** DsLink has TypeScript types and a co-located test file
**When** the component is used and tests are run
**Then** all props have type definitions and tests verify all types, sizes, visibility levels, accessibility, icon slots, and dark mode rendering

---

## Epic 3: Developer Documentation (Storybook)

Developers can discover, explore, and learn all library components through interactive Storybook documentation organized by Figma structure, with live examples, prop controls, composed layout pages, and visual validation against Figma.

### Story 3.1: Storybook Setup & Configuration

As a developer exploring the design system,
I want Storybook to load with the Figma design tokens applied and organized by Figma structure,
So that I can browse components in the same context they'll render in production.

**Acceptance Criteria:**

**Given** Storybook 10 (`@storybook/vue3-vite`) is installed and configured
**When** `storybook dev` is run
**Then** Storybook launches successfully with no errors (NFR13)

**Given** `.storybook/preview.ts` registers PrimeVue with `dsPreset` as a global decorator
**When** any story renders
**Then** components display with Figma design tokens applied (not PrimeVue defaults)
**And** both light and dark themes are available via Storybook toolbar

**Given** `.storybook/main.ts` discovers stories from `src/components/**/*.stories.ts`
**When** components with stories exist
**Then** stories appear organized by Figma structure: Foundations → Components (FR19)

**Given** Storybook is configured for static build
**When** `storybook build` is run
**Then** a static site is generated in `storybook-static/` ready for GitHub Pages deployment

### Story 3.2: Foundation Stories (Design Tokens)

As a developer,
I want to browse the design system's color palette, typography scale, spacing, and shadows in Storybook,
So that I understand the available design tokens before using components.

**Acceptance Criteria:**

**Given** a Color Palette story exists under Foundations
**When** a developer browses it
**Then** all Figma color palettes are displayed (Gray, Purple, Red, Blue, Amber, Orange, Pink)
**And** each color shows its token name and hex value
**And** both light and dark mode palettes are visible

**Given** a Typography story exists under Foundations
**When** a developer browses it
**Then** all font sizes (12px through 30px), weights (400, 500, 600), and composite styles are displayed
**And** Inter font family is applied

**Given** Spacing, Border Radius, and Shadow stories exist under Foundations
**When** a developer browses them
**Then** all spacing tokens, radius tokens, and shadow tokens are visually demonstrated

### Story 3.3: Component Stories with Interactive Controls

As a developer,
I want interactive Storybook stories for every MVP component covering all variants and states,
So that I can explore component behavior, manipulate props, and copy usage patterns.

**Acceptance Criteria:**

**Given** each MVP component (DsButton, DsIconButton, DsIcon, DsInputText, DsLink) has a `.stories.ts` file
**When** a developer browses component stories
**Then** every variant, size, and state is represented as a story or story arg (FR20)

**Given** Storybook controls are configured for each component
**When** a developer opens the Controls panel
**Then** all props are manipulable via controls (severity, size, disabled, loading, etc.) (FR21)
**And** control types match prop types (dropdowns for enums, toggles for booleans)

**Given** stories demonstrate both light and dark mode
**When** a developer switches theme in Storybook toolbar
**Then** all component stories render correctly in the selected theme

**Given** stories demonstrate responsive behavior
**When** a developer views stories at Mobile (320px), Tablet (768px), and Desktop (1024px+) viewports
**Then** no components overflow or break at narrow widths (UX-DR22)

**Given** story source code is viewable
**When** a developer wants to copy usage patterns
**Then** the story source code tab shows the component import and usage (FR23)

**Given** all stories load without errors
**When** Storybook renders any story
**Then** no console errors or rendering failures occur (NFR13)

### Story 3.4: Composed Layout Example Pages

As a developer,
I want to see composed layout examples showing multiple components used together,
So that I understand how to combine design system components in real feature implementations.

**Acceptance Criteria:**

**Given** a dedicated pages section exists in Storybook
**When** a developer browses the Pages section
**Then** at least one composed layout example is available (FR22)

**Given** a "Settings Form" composed example exists
**When** a developer views it
**Then** it shows DsInputText fields, DsButton (Primary + Outlined), and DsLink composed into a realistic form layout
**And** the example works in both light and dark mode

**Given** composed pages show real usage patterns
**When** a developer reviews the source
**Then** the code demonstrates correct component imports, prop usage, and composition patterns
**And** the developer can copy the pattern for their own feature

---

## Epic 4: AI Agent Knowledge Base

AI coding agents can access structured per-component documentation, match Figma design elements to library components, produce correct imports and prop usage, and flag gaps when a component doesn't exist yet.

### Story 4.1: AI Knowledge Base Structure & Component Index

As an AI coding agent,
I want a structured index of all available design system components,
So that I can quickly determine which library component matches a Figma design element.

**Acceptance Criteria:**

**Given** `docs/ai-kb/index.md` exists
**When** an AI agent reads the index
**Then** it finds a complete inventory of all available components (FR24)
**And** each component entry includes: component name, one-line description, import path
**And** the index includes guidance on when to use library components vs. raw Tailwind
**And** the index includes instructions for flagging gaps when a component doesn't exist (FR27)

**Given** the index follows a consistent, LLM-parseable structure (NFR14)
**When** an AI agent processes the document
**Then** it can reliably extract the component list and match Figma elements to components (FR26)

### Story 4.2: Per-Component AI Knowledge Base Entries

As an AI coding agent,
I want detailed per-component documentation with props, variants, and usage examples,
So that I can generate correct import statements and component usage matching Figma designs.

**Acceptance Criteria:**

**Given** each MVP component has a dedicated markdown file in `docs/ai-guidelines/`
**When** an AI agent reads `ds-button.md`
**Then** it finds: component name (DsButton), when to use, available props with valid values, all variants and sizes, usage examples with correct imports, and Figma reference (FR25)

**Given** per-component entries exist for all 5 MVP components
**When** files are listed in `docs/ai-guidelines/`
**Then** `ds-button.md`, `ds-icon-button.md`, `ds-icon.md`, `ds-input-text.md`, `ds-link.md` all exist

**Given** each entry follows the same consistent template structure
**When** an AI agent processes any component entry
**Then** the structure is identical across all entries (NFR14):
**And** sections: Name, When to Use, Props (table), Variants, Sizes, Usage Examples, Figma Reference

**Given** usage examples show correct imports and prop usage
**When** an AI agent copies an example
**Then** the import path is `@failwin/desing-system-vue`
**And** props use the correct values documented in the entry
**And** examples cover the most common use cases (primary button, error input, etc.)

**Given** the AI KB covers design tokens
**When** an AI agent needs to fall back to raw Tailwind for an uncovered element
**Then** the index documents available token values (colors, spacing, typography) for manual styling

---

## Epic 5: CI/CD & Library Publishing

The library is reliably published to npm (`@failwin/desing-system-vue`), Storybook is deployed to GitHub Pages, and the maintainer can add new components following repeatable, documented patterns.

### Story 5.1: CI/CD Pipeline Setup

As a library maintainer,
I want automated CI/CD pipelines for testing, publishing, and documentation deployment,
So that code quality is enforced, releases are reliable, and documentation stays current.

**Acceptance Criteria:**

**Given** `.github/workflows/test.yml` exists
**When** a pull request is opened
**Then** the workflow runs Biome check and Vitest tests
**And** the PR is blocked if either check fails

**Given** `.github/workflows/publish.yml` exists
**When** a git tag is pushed (e.g., `v1.0.0`)
**Then** the workflow builds the library and publishes to npm as `@failwin/desing-system-vue`
**And** TypeScript declarations are included in the published package

**Given** `.github/workflows/storybook.yml` exists
**When** a push to main occurs
**Then** the workflow builds Storybook static site and deploys to GitHub Pages
**And** the deployed Storybook reflects the latest component state

### Story 5.2: Component Addition Pattern Documentation

As a library maintainer,
I want documented, repeatable patterns for adding new components,
So that I can extend the library predictably whether adding a PrimeVue wrapper or a custom Tailwind component.

**Acceptance Criteria:**

**Given** a component addition guide exists (in README or docs)
**When** the maintainer wants to add a new PrimeVue-based component
**Then** the guide documents the exact steps (FR28):
**And** 1. Create component directory with `.vue`, `.stories.ts`, `.test.ts`, `index.ts`
**And** 2. Implement wrapper with `inheritAttrs: false` + `v-bind="$attrs"`
**And** 3. Add TypeScript prop types
**And** 4. Verify light + dark theme rendering
**And** 5. Write Storybook stories for all variants/states
**And** 6. Write Vitest tests
**And** 7. Add AI KB entry in `docs/ai-guidelines/`
**And** 8. Export from barrel `src/index.ts`

**Given** the guide covers custom Tailwind components
**When** the maintainer wants to add a component without a PrimeVue equivalent
**Then** the guide documents following PrimeVue API conventions (FR29):
**And** Use semantic HTML elements, not divs with click handlers
**And** Follow PrimeVue prop naming (severity, size, disabled, variant)
**And** Include ARIA attributes and keyboard handlers
**And** Use `focus-visible:` for focus rings, `motion-safe:` for transitions
