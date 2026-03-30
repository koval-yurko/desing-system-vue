---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
inputDocuments:
  - product-brief-desing-system-vue-2026-03-23.md
  - "Figma: Design-Systems (3qP5xnwc6gXhZR3AnFAMFe) - Base Components page (node 1:2)"
  - docs/figma-variables.md
date: 2026-03-23
author: Yurii
---

# UX Design Specification desing-system-vue

**Author:** Yurii
**Date:** 2026-03-23

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

### Project Vision

desing-system-vue is a standalone Vue 3 component library that bridges the gap between Figma design intent and production Vue code. Built on PrimeVue and styled with Tailwind CSS, it provides project-specific design tokens and component wrappers that match the Figma Design System exactly. The library serves a dual audience — human developers via Storybook and AI coding agents via a centralized knowledge base — ensuring consistent, design-faithful implementations regardless of who writes the code.

### Target Users

1. **AI Coding Agents (Primary)** — Claude, Cursor, Copilot and similar tools that implement Figma designs into Vue 3 applications. They need structured, machine-readable component documentation to produce correct imports and prop usage instead of generating raw Tailwind CSS markup.

2. **Mid-Level Frontend Developers (Primary)** — Vue developers implementing features from Figma designs. They need Storybook with live examples, prop documentation, and usage patterns to quickly find and correctly use design system components.

3. **Design System Maintainer (Secondary)** — Solo maintainer (Yurii) responsible for creating components, keeping them aligned with Figma, writing AI knowledge base entries, and maintaining Storybook stories.

### Key Design Challenges

- **Component API consistency** — Each wrapper component needs a predictable, uniform prop interface (variants, sizes, states) so both developers and AI agents can use them without per-component learning curves
- **Figma-to-code fidelity** — Design tokens (colors with 50–950 shades, typography scales, shadows, spacing) must map precisely from Figma to Tailwind config and PrimeVue theming with zero drift
- **AI discoverability** — The knowledge base must be structured for LLM consumption: component name, when to use, props/variants, usage examples, and Figma reference — enabling agents to match Figma elements to library components reliably

### Design Opportunities

- **AI-first documentation standard** — Establish a documentation format optimized for LLM consumption that could become a reusable pattern for other design systems
- **Storybook as living specification** — Use Storybook not just for documentation but as the visual acceptance test — if the story matches the Figma design, the component is correct
- **Progressive coverage model** — Start with MVP (buttons, inputs, links) and expand systematically to the full 25+ component Figma system, with each addition following the established pattern

## Core User Experience

### Defining Experience

The core experience of desing-system-vue is **component consumption**: a developer or AI agent imports a component, passes the correct props/variants, and it renders matching the Figma design on first attempt. Every design decision in the library serves this single interaction — making it fast, predictable, and correct.

The library follows Tailwind CSS and PrimeVue best practices and code standards as its implementation foundation, ensuring that consumers familiar with either ecosystem encounter no surprises.

### Platform Strategy

- **Web-only Vue 3 npm package** consumed in browser-based applications
- **Desktop-first developer tooling** — Storybook for human developers, structured knowledge base for AI agents
- **Components render on any viewport** — while the dev tooling is desktop-oriented, the components themselves must be responsive
- **Dark mode support** — the library ships with both light and dark themes, leveraging PrimeVue's theming system and Tailwind's dark mode utilities
- **No offline requirements** — standard web delivery

### Effortless Interactions

- **Component discovery** — Finding the right component for a Figma element should take seconds, not minutes, whether in Storybook or the AI knowledge base
- **Prop usage** — Every component has a consistent, predictable prop interface (variant, size, state) that follows PrimeVue conventions
- **Theme switching** — Dark/light mode works automatically via PrimeVue's theming with no per-component configuration
- **Import and use** — Single package import, tree-shakeable, zero configuration beyond initial setup

### Critical Success Moments

1. **First correct render** — A component imported with the right props matches the Figma design exactly, in both light and dark mode
2. **AI agent compliance** — An AI agent produces `import { DsButton } from 'desing-system-vue'` instead of raw Tailwind markup when given a Figma screenshot
3. **Developer confidence** — A developer browses Storybook, sees the exact Figma variant they need, copies the usage pattern, and it works in their feature without modification
4. **Theme consistency** — Switching between light and dark mode produces a coherent, designed result — not a broken inversion

### Experience Principles

1. **Figma fidelity first** — Every component must be a pixel-accurate translation of its Figma counterpart; visual correctness is non-negotiable
2. **Convention over configuration** — Follow PrimeVue and Tailwind CSS best practices and standards; don't invent patterns when established ones exist
3. **Dual-audience parity** — The developer experience (Storybook) and AI agent experience (knowledge base) must be equally complete and discoverable
4. **Dark mode as a first-class citizen** — Both themes are designed, not derived; dark mode is not an afterthought but a core requirement

## Desired Emotional Response

### Primary Emotional Goals

- **Efficiency** — The dominant feeling: finding and using the right component is instant, with zero time wasted on searching, guessing, or rebuilding what already exists

### Emotional Journey Mapping

| Stage | Feeling | Design Implication |
|-------|---------|-------------------|
| Discovery | Relief — "it exists" | Clear component index in Storybook and AI knowledge base |
| Usage | Familiarity — "props work as expected" | Consistent API following PrimeVue conventions |
| Result | Trust — "matches the Figma exactly" | Pixel-accurate token mapping, both themes |
| Error | Guidance — "I know what went wrong" | Clear prop validation, TypeScript types, helpful error messages |
| Return | Consistency — "same patterns as last time" | Uniform component structure across the entire library |

### Micro-Emotions

- **Confidence over confusion** — Every prop, variant, and slot is documented with examples; no guesswork
- **Trust over skepticism** — Visual output matches Figma source; dark mode is designed, not auto-generated
- **Accomplishment over frustration** — First render is correct; no trial-and-error cycle to match the design

### Design Implications

- **Efficiency** → Logical component naming matching Figma layer names; searchable knowledge base with "when to use" guidance; sensible defaults requiring minimal props
- **Confidence** → Comprehensive Storybook stories showing every variant and state; TypeScript prop types with JSDoc descriptions
- **Trust** → Side-by-side Figma/Storybook comparison in docs; design token traceability from Figma to CSS variables

### Emotional Design Principles

1. **No surprises** — Components behave exactly as PrimeVue and Tailwind developers expect; the library adds design value, not cognitive overhead
2. **Proof over promise** — Storybook stories are the proof that components match Figma; documentation shows, not just tells
3. **Fail helpfully** — When something goes wrong (wrong prop, missing variant), the error message guides toward the correct usage
4. **Reduce decisions** — Sensible defaults for every component; the "happy path" requires minimal props

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

#### PrimeVue

PrimeVue is both the foundation and the primary inspiration for desing-system-vue. As the underlying component library, its patterns directly inform the developer experience.

**What PrimeVue does well:**
- **Consistent prop API** — Uniform prop naming across all components (severity, size, variant, disabled) creates predictability
- **Design token system** — CSS variable-based theming with preset support (Aura, Lara) enables deep customization without forking components
- **Passthrough (pt) API** — Allows surgical style overrides at any DOM level without breaking component internals
- **Unstyled mode** — Full Tailwind CSS integration path, enabling utility-first styling while retaining component logic
- **Comprehensive documentation** — Live code examples, prop tables, event documentation, and accessibility notes for every component

### Transferable UX Patterns

**API Patterns (Adopt directly):**
- Prop naming conventions: `severity`, `size`, `outlined`, `raised`, `rounded`, `disabled`, `loading`
- Slot-based composition: `#header`, `#footer`, `#content` for flexible layout
- Event naming: `@update:modelValue`, `@change`, `@focus`, `@blur`
- v-model integration for all form components

**Theming Patterns (Adopt and extend):**
- CSS variable-based design tokens for colors, spacing, typography, shadows
- Preset-based theme architecture — light and dark as two presets
- Component-level token scoping for granular control

**Documentation Patterns (Adapt for dual audience):**
- PrimeVue's prop tables and live examples → Storybook stories with controls
- PrimeVue's "when to use" guidance → AI knowledge base entries with structured component metadata

### Anti-Patterns to Avoid

- **Don't re-invent PrimeVue's API** — Wrap and configure, don't replace; consumers who know PrimeVue should feel at home
- **Don't expose unstyled PrimeVue** — Every component must have design tokens pre-applied; consumers should never need to override base styles
- **Don't duplicate PrimeVue docs** — Focus documentation on project-specific design decisions, variants, and token mappings, not on PrimeVue fundamentals
- **Don't fight the passthrough API** — Use `pt` for design token application; don't bypass it with CSS overrides that break customizability

### Design Inspiration Strategy

**Adopt:**
- PrimeVue's prop naming and composition conventions — zero learning curve for the Vue ecosystem
- PrimeVue's design token architecture — extend it with Figma-derived project tokens
- PrimeVue's unstyled + Tailwind path — use as the styling foundation

**Adapt:**
- PrimeVue's generic theming → project-specific Figma design tokens applied as the default preset
- PrimeVue's human-only docs → dual-audience documentation (Storybook + AI knowledge base)
- PrimeVue's broad component surface → curated subset matching the Figma Design System scope

**Avoid:**
- Creating custom component logic when PrimeVue already handles it
- Exposing PrimeVue internals that conflict with the Figma design language
- Building abstractions that hide PrimeVue's API instead of enhancing it

## Design System Foundation

### Design System Choice

**Themeable system: PrimeVue (unstyled) + Tailwind CSS + Figma Design Tokens**

desing-system-vue is itself a design system — the foundation choice defines how the library is built, not consumed. The stack combines PrimeVue's unstyled component primitives with Tailwind CSS utilities, themed by design tokens extracted from the Figma Design System.

### Rationale for Selection

- **PrimeVue unstyled mode** — Provides accessible, logic-complete Vue 3 components (keyboard navigation, ARIA attributes, focus management) without imposing visual opinions, allowing full Figma design fidelity
- **Tailwind CSS** — Industry-standard utility framework that AI agents and developers already know; eliminates custom CSS maintenance burden
- **Figma as source of truth** — All visual decisions (colors, typography, shadows, spacing, component variants) originate from the Figma Design System and flow into code via design tokens
- **PrimeVue design token system** — CSS variable-based tokens bridge Figma design decisions to component styling, supporting both light and dark themes as presets

### Implementation Approach

1. **Token extraction** — Map Figma design tokens (colors 50–950, typography, shadows, spacing) to Tailwind config and PrimeVue CSS variables
2. **Component wrapping** — Each design system component wraps a PrimeVue unstyled component, applying Figma tokens via the passthrough (pt) API and Tailwind classes
3. **Theme presets** — Light and dark themes implemented as PrimeVue presets, each with complete token definitions derived from Figma
4. **Progressive build** — MVP delivers foundations + buttons + inputs + links; remaining 25+ components follow the same pattern

### Customization Strategy

- **For library consumers:** Components ship with Figma design tokens pre-applied; no customization needed for standard usage
- **For edge cases:** PrimeVue's passthrough (pt) API remains accessible for consuming projects that need surgical overrides
- **For theme switching:** Light/dark mode via PrimeVue's theme switching API; no per-component configuration required
- **For library maintainer:** Adding a new component follows a repeatable pattern — wrap PrimeVue unstyled, apply tokens via pt, add Storybook story, add AI knowledge base entry

## Defining Core Experience

### Defining Experience

**"PrimeVue with a theme — import, use, and it matches Figma."**

desing-system-vue is PrimeVue with the Figma Design System theme pre-applied. The mental model is simple: if you know PrimeVue, you know this library. The only difference is that components render with project-specific design tokens instead of generic PrimeVue defaults.

For components that exist in Figma but not in PrimeVue, the library provides custom Tailwind CSS components that follow the same API conventions (props, slots, events) so consumers experience a uniform interface regardless of the underlying implementation.

### User Mental Model

**Developer mental model:** "This is PrimeVue with our project's theme. I use it exactly like PrimeVue — same imports, same props, same patterns — but it looks like our Figma."

**AI agent mental model:** "Consult the knowledge base → find the component matching the Figma element → import it → pass the documented props → done."

**Key mental model implications:**
- Consumers should never need to know whether a component is a themed PrimeVue wrapper or a custom Tailwind implementation — the API is the same
- PrimeVue documentation remains a valid reference for wrapped components; the library docs focus on what's different (design tokens, custom variants, Figma-specific props)
- No new concepts to learn; the library reduces decisions, not adds them

### Success Criteria

1. **Zero-config correct rendering** — A component renders matching the Figma design with default props; no theme setup beyond installing the package
2. **PrimeVue API compatibility** — Any PrimeVue prop, slot, or event that applies to a wrapped component works identically
3. **Seamless custom components** — Custom Tailwind components (not in PrimeVue) feel indistinguishable in API from wrapped PrimeVue components
4. **AI-verifiable correctness** — An AI agent can confirm its output matches Figma by checking component name + props against the knowledge base

### Novel UX Patterns

**Approach: Established patterns, no novelty required.**

The library deliberately avoids novel interaction patterns. Its value is in applying an existing, proven component framework (PrimeVue) with project-specific design tokens. The only "novel" element is the dual-audience documentation — Storybook for humans, structured knowledge base for AI agents — which is a documentation pattern, not an interaction pattern.

**Component type strategy:**
- **PrimeVue components in Figma** → Wrap PrimeVue unstyled, apply Figma tokens via pt API + Tailwind
- **Figma components not in PrimeVue** → Build custom with Tailwind CSS, matching PrimeVue API conventions (same prop patterns, slot naming, event conventions)
- **PrimeVue components not in Figma** → Out of scope; not included in the library

### Experience Mechanics

**1. Initiation:**
- Developer: browses Storybook or searches component index
- AI agent: queries knowledge base with Figma element description

**2. Interaction:**
- `import { DsButton } from 'desing-system-vue'`
- Pass props following PrimeVue conventions: `<DsButton severity="primary" size="large" />`
- For custom components: same pattern — `<DsFileUpload variant="drag-drop" />`

**3. Feedback:**
- Component renders matching Figma design in both light and dark mode
- TypeScript types provide autocomplete for all valid props/variants
- Invalid props trigger build-time type errors

**4. Completion:**
- Visual output matches the Figma design — verified by Storybook comparison
- No additional styling needed; the component is done

## Visual Design Foundation

### Color System

**Source of truth:** Figma Design System file (3qP5xnwc6gXhZR3AnFAMFe)

**Token naming convention:** Figma uses `/`-separated paths (e.g., `--taxt/main/gray-800`). These map to CSS custom properties in the implementation.

**Extracted semantic color tokens:**

| Semantic Role | Token Path | Hex Value |
|---------------|-----------|-----------|
| Primary text | `--taxt/main/gray-950` | `#020618` |
| Secondary text | `--taxt/main/gray-800` | `#314158` |
| Tertiary text | `--taxt/main/gray-900` | `#1d293d` |
| Disabled text | `--taxt/main/gray-500` | `#90a1b9` |
| Link default | `--taxt/supporting/blue/blue-600` | `#0e5cf4` |
| Link hover | `--taxt/supporting/blue/blue-800` | `#0042c4` |
| Link background hover | `--surfase/supporting/blue/blue-200` | `#e7f4fe` |
| Border/divider | — | `#A8B2C8` |
| Near-black | — | `#13151A` |

**Color palettes (from product brief — full 50-950 shades):**
- Gray/Neutral, Primary (Purple), Blue, Red/Error, Green/Success, Orange/Warning, Teal, Yellow, Pink

**Theme support:** Light and dark mode, implemented as PrimeVue presets with complete token definitions for each theme.

### Typography System

**Font family:** Inter (used for both headings and body text)

| Token | Role | Size | Line Height |
|-------|------|------|-------------|
| `--font-size-h9` | Base body / heading | 16px | 24px (`--typography/size/xl`) |
| `--font-size-h10` | Small body / heading | 14px | 20px (`--typography/size/lg`) |

**Typography variables:**
- `--typography/family/heading`: Inter
- `--typography/family/body`: Inter
- `--typography/weight/font-normal`: 400
- Additional heading sizes (h1-h8) and weights to be extracted from Figma as components are built

**Letter spacing:** -0.2px for most text; 0 for small link text

### Spacing & Layout Foundation

**Component sizing scale (from button specs):**
- XS: 24px height
- Small: 32px height
- Medium: 36px height
- Large: 40px height

**Spacing tokens extracted:**
- `--unit/xl`: 20px

**Layout approach:** Components are self-contained with internal padding; no external grid system imposed by the library. Consuming projects define their own layout grids.

### Accessibility Considerations

- **WCAG AA compliance** — All color combinations must meet minimum contrast ratios (4.5:1 for normal text, 3:1 for large text)
- **Keyboard navigation** — Inherited from PrimeVue's built-in keyboard support for all wrapped components; custom Tailwind components must implement equivalent keyboard handling
- **ARIA attributes** — Inherited from PrimeVue for wrapped components; custom components must include proper ARIA roles, labels, and states
- **Focus indicators** — Visible focus states for all interactive components in both light and dark themes
- **Color independence** — Information must not be conveyed by color alone; icons, text, or patterns supplement color-coded states (error, success, warning)

## Design Direction Decision

### Design Directions Explored

For a component library that wraps an existing Figma Design System, the visual design direction is predetermined — the Figma file is the authoritative source for all visual decisions. No alternative directions were explored because the goal is Figma fidelity, not visual exploration.

### Chosen Direction

**Figma-faithful PrimeVue wrapper library with Inter typography and purple primary palette.**

Key visual characteristics from the Figma Design System:
- **Primary color:** Purple (used in primary buttons, active states)
- **Accent/link color:** Blue (#0e5cf4 default, #0042c4 hover)
- **Negative/error color:** Red (used in negative buttons, error states)
- **Typography:** Inter for both headings and body, with a scale from h10 (14px) through h1
- **Component sizing:** 4-tier scale — XS (24px), Small (32px), Medium (36px), Large (40px)
- **Visual style:** Clean, minimal, with subtle borders (#A8B2C8) and light backgrounds
- **Dark mode:** Designed as a parallel theme, not an auto-inversion

### Design Rationale

- The Figma Design System represents deliberate design decisions made by the design team — the library's role is to implement these decisions faithfully, not reinterpret them
- PrimeVue's unstyled mode + Tailwind CSS provides the ideal technical foundation for pixel-accurate Figma reproduction
- Inter as the sole font family simplifies the typography system and ensures consistent rendering

### Implementation Approach

**Component visual implementation pattern:**
1. Extract exact color values, spacing, and typography from Figma component variants
2. Map to PrimeVue design tokens (CSS custom properties) for wrapped components
3. Apply via Tailwind CSS utilities for custom components
4. Verify visual output against Figma screenshots in Storybook
5. Document all applied tokens in the AI knowledge base

**Storybook organization (mirrors Figma structure):**
- Foundations: Colors, Typography, Shadows, Icons
- Components: Buttons, Input Fields, Links (MVP), then remaining components
- Each story shows all variants, sizes, and states matching Figma

## User Journey Flows

### Journey 1: Developer Implements Figma Design

**Goal:** Developer takes a Figma design and produces Vue code using library components.

**Flow:**
1. Developer receives Figma design for a feature
2. Opens Storybook, searches for matching component
3. If found: copies import + usage pattern with correct props/variant
4. Pastes into feature code, passes props matching Figma variant
5. Component renders matching Figma — no additional styling needed
6. If not found: requests new component or builds custom (flags library gap)

**Success:** First render matches Figma. No trial-and-error.

### Journey 2: AI Agent Implements Figma Design

**Goal:** AI agent produces Vue code using library components instead of raw Tailwind.

**Flow:**
1. Agent receives Figma screenshot or design context
2. Queries AI knowledge base for matching component
3. If found: reads component entry (name, props, variants, usage examples)
4. Generates import statement and component usage with correct props
5. Output matches Figma design using library components
6. If not found: falls back to raw Tailwind and flags the gap for library expansion

**Success:** Agent uses `import { DsButton } from 'desing-system-vue'` instead of generating raw markup.

### Journey 3: Maintainer Adds New Component

**Goal:** Add a new component that matches Figma and follows library patterns.

**Flow:**
1. Identify new Figma component to implement
2. Check if PrimeVue equivalent exists
3. If yes: create wrapper using PrimeVue unstyled + passthrough API
4. If no: create custom component with Tailwind CSS following PrimeVue API conventions
5. Apply Figma design tokens (colors, typography, spacing, shadows)
6. Add TypeScript types for all props/variants
7. Create Storybook stories covering all variants and states
8. Add AI knowledge base entry
9. Verify visual output against Figma screenshot

**Success:** New component is indistinguishable from existing ones in API and documentation quality.

### Journey Patterns

| Pattern | Description | Applied Where |
|---------|-------------|---------------|
| Lookup → Match → Use | Find component, verify match, use it | Developer + AI agent |
| Wrap → Token → Verify | Wrap PrimeVue, apply tokens, verify vs Figma | Maintainer |
| Fallback escalation | Flag library gap when component missing | AI agent → drives growth |

### Flow Optimization Principles

- **Minimize steps to first render** — Import + props is enough; no theme setup or CSS overrides required
- **Single source of truth** — Storybook and knowledge base always reflect current component state; never stale
- **Self-service error recovery** — TypeScript types catch wrong props at build time; Storybook shows correct usage visually
- **Gap-driven growth** — Every "component not found" event in AI agent or developer journeys becomes a backlog item for library expansion

## Component Strategy

### Design System Components (PrimeVue Wrappers)

Components with PrimeVue equivalents — wrap unstyled, apply Figma tokens via pt API:

| Component | PrimeVue Base | Sizes | Key Variants |
|-----------|--------------|-------|--------------|
| DsButton | Button | XS, S, M, L | Primary, Outlined, Tertiary, Text, Negative |
| DsIconButton | Button | XS, S, M, L | Contains DsIcon component inside (not via props) |
| DsInputText | InputText | S, M | Default, Hover, Focus, Filled, Error, Disabled |
| DsTextarea | Textarea | — | Default, Focus, Filled, Error, Disabled |
| DsSelect | Select | S, M | Default, Open, Disabled |
| DsContextMenu | ContextMenu | — | Standard menu items |
| DsBadge | Badge | — | Multiple color variants |
| DsChip | Chip | S, M | Default, Selected, Disabled |
| DsAvatar | Avatar | — | Initials, Initials Colored, Initials Monochrome |
| DsSlider | Slider | — | Single value |
| DsCard | Card | — | Standard card layout |
| DsSearchField | InputText + IconField | S, M | With search icon, clearable |

### Custom Components (Tailwind CSS)

Components without PrimeVue equivalents — built with Tailwind CSS, following PrimeVue API conventions:

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| DsIcon | Standalone icon rendering | name, size (no color prop — use Tailwind classes e.g. `class="text-primary-500"`) |
| DsLink | Navigational links | type (Regular, Smart, Quiet), size (S, M), visibility (high, low), disabled |
| DsCodeInput | Code/monospace input field | — |
| DsMentionBadge | @mention display badge | removable |
| DsDotIndicator | Status dot with text | color variant |
| DsFilterField | Filterable input with tags | — |
| DsFileUpload | File upload area | — |
| DsExpandableFileUploader | Expandable file upload | expanded state |

**Custom component rules:**
- Follow PrimeVue prop naming: `severity`, `size`, `disabled`, `variant`
- Use same slot patterns: `#default`, `#header`, `#footer`
- Emit same event patterns: `@update:modelValue`, `@change`
- Include TypeScript prop types matching PrimeVue conventions

### Component Implementation Strategy

**Per-component implementation checklist:**
1. Extract exact Figma tokens (colors, spacing, typography, border-radius, shadows)
2. For PrimeVue wrappers: configure unstyled preset + pt API with Figma tokens
3. For custom components: build with Tailwind utilities matching Figma specs
4. TypeScript types for all props, emits, slots
5. Both light and dark theme styling
6. Storybook stories covering all variants, sizes, and states
7. AI knowledge base entry: name, when to use, props, usage example, Figma reference

### Implementation Roadmap

**MVP (Phase 1) — Foundations + Core Components:**
- Design tokens (colors, typography, shadows, spacing)
- DsIcon (dependency for other components)
- DsButton + DsIconButton (most used component)
- DsInputText (core form component)
- DsLink (navigation component)

**Phase 2 — Form Components:**
- DsTextarea, DsSelect, DsSearchField
- DsCodeInput, DsFilterField
- DsChip

**Phase 3 — Display & Feedback Components:**
- DsBadge, DsMentionBadge, DsDotIndicator
- DsAvatar
- DsCard
- DsSlider

**Phase 4 — Complex Components:**
- DsContextMenu
- DsFileUpload, DsExpandableFileUploader

## UX Consistency Patterns

### Button Hierarchy

**When to use each button type:**

| Type | Usage | Example |
|------|-------|---------|
| **Primary** | One per section — the main action the user should take | "Save", "Submit", "Create" |
| **Outlined** | Secondary action alongside a primary | "Cancel", "Back", "Export" |
| **Tertiary** | Lower-priority action that shouldn't compete with primary/outlined | "Learn more", "View details" |
| **Text** | Inline or embedded actions within content | "Edit", "Remove" |
| **Text/link** | Navigation-like action styled as underlined text | "View all", "See history" |
| **Negative** | Destructive or irreversible actions requiring caution | "Delete", "Remove account" |

**Button rules:**
- Maximum one Primary button per visual section
- Negative buttons never appear as the sole action — always paired with a cancel/back option
- Loading state replaces button content, preserves button width
- Disabled buttons retain their type styling at reduced opacity — never change type when disabling

**Size selection:**

| Size | Height | Usage |
|------|--------|-------|
| Large | 40px | Page-level primary actions, hero sections |
| Medium | 36px | Default — most form actions, dialogs |
| Small | 32px | Compact contexts — tables, inline actions |
| XS | 24px | Dense UI — toolbars, tags, tight layouts |

### Form Patterns

**Input field states (consistent across DsInputText, DsTextarea, DsSelect, DsSearchField):**

| State | Visual | Trigger |
|-------|--------|---------|
| Default | Gray border | Initial render |
| Hover | Darkened border | Mouse hover |
| Focus | Primary color border | Click/tab into field |
| Filled | Subtle background change | Has value, not focused |
| Filled-Hover | Filled + hover indicator | Has value, mouse hover |
| Disabled | Reduced opacity, no cursor | `disabled` prop |
| Error | Red border + error message below | Validation failure |
| Skip | Skipped visual state | Validation skipped |

**Validation rules:**
- Validate on blur (not on every keystroke) — reduces noise
- Show error message directly below the field, not in a separate location
- Error state clears when user starts typing (re-validates on next blur)
- Required fields indicated by visual marker — not by error state on empty fields

**Form layout:**
- Labels above inputs (not inline) for consistency and mobile friendliness
- Size M inputs as default; Size S only in compact/table contexts
- Group related fields visually; separate groups with spacing, not dividers

### Component State Patterns

**Universal state behavior (applies to ALL interactive components):**

| State | Behavior | Implementation |
|-------|----------|----------------|
| **Default** | Resting state, ready for interaction | Base Figma tokens applied |
| **Hover** | Visual feedback on mouse enter | Slightly darkened/lightened background or border |
| **Focus** | Keyboard navigation indicator | Visible focus ring (primary color outline), never removed for accessibility |
| **Active/Pressed** | Momentary feedback during click | Darker shade than hover |
| **Disabled** | Non-interactive, visually muted | Reduced opacity (0.5), `pointer-events: none`, `aria-disabled="true"` |
| **Loading** | Async operation in progress | Loading indicator (e.g. animated dots), preserves component dimensions |

**State priority (highest wins):**
Disabled > Loading > Active > Focus > Hover > Default

**Transitions:**
- All state transitions use `150ms ease` — fast enough to feel responsive, slow enough to be perceptible
- No transitions on disabled state changes (immediate)

### Size Consistency

**Size tokens apply uniformly across component types:**

| Size | Component Height | Icon Size | Font Size | Padding (horizontal) |
|------|-----------------|-----------|-----------|---------------------|
| xsmall | 24px | 12px | 12px | 8px |
| small | 32px | 16px | 14px (h10) | 12px |
| medium | 36px | 20px | 14px (h10) | 16px |
| large | 40px | 20px | 14px (h10) | 32px |

**Size selection rule:** Components that appear together should use the same size. A form with Size M inputs should use Size M buttons and Size M selects.

### Icon Usage Patterns

**DsIcon (standalone):**
- Used for decorative or informational icons outside of interactive components
- Props: `name`, `size` (matches component size scale: 12/16/20/24px) — no `color` prop
- Inherits text color by default via `currentColor` — override with Tailwind utility classes (e.g., `class="text-primary-500"`)

**Icons inside components:**
- DsIconButton contains a DsIcon as a child (slot), not via props — allows flexible icon composition
- DsButton can contain DsIcon as left/right slot content
- DsLink supports left and right icon slots
- DsSearchField has a built-in search icon (not customizable)

**Icon sizing rule:** Icon size always matches the component's size tier (S component = 16px icon, M component = 20px icon, L component = 20px icon)

### Dark Mode Patterns

**Theme switching:**
- Controlled via PrimeVue's theme switching API at the application level
- No per-component theme prop — theme is global
- Components automatically adapt via CSS custom properties

**Token mapping approach:**
- Each semantic token has light and dark values defined in the PrimeVue preset
- Background and surface tokens invert: light backgrounds become dark, dark text becomes light

**Dark mode rules:**
- Never use hardcoded hex colors in components — always reference semantic tokens
- Shadows reduce in intensity in dark mode (not eliminated)
- Focus rings remain visible in both themes
- Icons inherit text color, which adapts automatically via tokens
- Borders shift from light gray to a dark-appropriate subtle divider

### Feedback Patterns

**Component-level feedback (within the library's scope):**

| Feedback Type | Visual | Component Application |
|---------------|--------|----------------------|
| **Error** | Red border + red text below | Input fields, text areas, selects |
| **Success** | Green indicator | Badges, dot indicators |
| **Warning** | Orange indicator | Badges, dot indicators |
| **Info** | Blue indicator | Badges, dot indicators |
| **Loading** | Dot-based animation | Buttons (Loaded variant) |
| **Disabled** | Reduced opacity | All interactive components |

**Severity color mapping (follows PrimeVue convention):**
- `error` / `danger`: Red palette
- `success`: Green palette
- `warning`: Orange palette
- `info`: Blue palette

### Link Patterns

**Three link types for different contexts:**

| Type | Visual | Usage |
|------|--------|-------|
| **Regular link** | Underlined, blue text | Standard hyperlinks — navigation to other pages |
| **Smart link** | Blue text, blue background on hover | Enhanced links with visual hover feedback — internal app navigation |
| **Quiet** | Blue text, no underline (underline on hover) | Subtle links within content — less visually prominent |

**Visibility levels:**
- **High** (default): Blue text color — stands out as interactive
- **Low**: Gray text color — blends with surrounding content, underline/hover reveals interactivity

**Link rules:**
- External links always use Regular link type
- Links within body text use Quiet type to avoid visual clutter
- Action-like links (that trigger behavior rather than navigate) should use Text button type instead

## Responsive Design & Accessibility

### Responsive Strategy

**Component-level responsiveness (library's responsibility):**
- Components are fluid by default — they fill their container width unless explicitly sized
- No fixed-width components; all use relative/percentage widths or `auto`
- Component sizes follow the uniform size token table; no additional touch target padding is applied
- Text uses rem-based sizing to respect user font-size preferences

**Application-level layout (consuming project's responsibility):**
- The library does NOT impose a grid system, breakpoints, or page layout
- Consuming projects define their own responsive layout using Tailwind's responsive utilities
- Components adapt to whatever container they're placed in

### Breakpoint Strategy

**The library itself does not define breakpoints.** Components are container-responsive, not viewport-responsive. However, documentation and Storybook stories should demonstrate components at common widths:

| Context | Width | Purpose |
|---------|-------|---------|
| Mobile | 320–767px | Verify components don't overflow or break at narrow widths |
| Tablet | 768–1023px | Verify spacing and layout |
| Desktop | 1024px+ | Default Storybook viewport |

**Component-specific responsive behavior:**
- DsInputText, DsTextarea, DsSelect: 100% width by default, constrained by parent
- DsButton: auto width by default, can stretch to 100% via prop or parent
- DsCard: fills container width
- DsContextMenu: positioned relative to trigger, respects viewport edges

### Accessibility Strategy

**WCAG AA compliance** — all components must meet WCAG 2.1 Level AA.

**Per-component accessibility checklist:**

| Requirement | PrimeVue Wrappers | Custom Tailwind |
|-------------|-------------------|-----------------|
| Keyboard navigation | Inherited from PrimeVue | Must implement manually |
| ARIA roles & attributes | Inherited from PrimeVue | Must implement manually |
| Focus management | Inherited from PrimeVue | Must implement manually |
| Color contrast (4.5:1 text, 3:1 large) | Enforced via Figma tokens | Enforced via Figma tokens |
| Screen reader support | Inherited from PrimeVue | Must implement manually |
| Reduced motion | Respect `prefers-reduced-motion` | Respect `prefers-reduced-motion` |

**Accessibility rules for custom Tailwind components:**
- Every interactive element must be keyboard-focusable (`tabindex="0"` or native interactive element)
- Every interactive element must have an accessible name (`aria-label`, `aria-labelledby`, or visible text)
- Focus order must follow visual order (no CSS tricks that break tab sequence)
- Error messages must be associated with their input via `aria-describedby`
- Loading states must announce to screen readers via `aria-live="polite"`

### Testing Strategy

**Automated testing (per component in CI):**
- `@vue/test-utils` for component behavior
- `axe-core` or `vitest-axe` for automated accessibility violations
- Storybook accessibility addon for visual accessibility checks

**Manual testing (per release):**
- Keyboard-only navigation through all components
- VoiceOver (macOS) screen reader testing
- Color contrast verification in both light and dark themes
- Verify all states announce correctly to assistive technology

### Implementation Guidelines

**For PrimeVue wrappers:**
- Do NOT override PrimeVue's built-in accessibility features via pt API
- Verify that pt styling doesn't hide or obscure focus indicators
- Test that Figma token colors maintain WCAG AA contrast ratios

**For custom Tailwind components:**
- Use semantic HTML elements (`<button>`, `<input>`, `<a>`) — not `<div>` with click handlers
- Include `role`, `aria-*` attributes matching the equivalent PrimeVue component's ARIA pattern
- Implement keyboard handlers: Enter/Space for activation, Escape for dismissal, Arrow keys for navigation within composite components
- Use Tailwind's `focus-visible:` for focus ring styling (not `focus:`) to avoid showing rings on mouse click
- Add `motion-safe:` prefix to all transition/animation classes to respect `prefers-reduced-motion`

## Appendix: Figma Design Token Variables

> Exported from Figma file `3qP5xnwc6gXhZR3AnFAMFe` (Vue Design System)
> Source: [docs/figma-variables.md](../../docs/figma-variables.md)

### Colors

#### Surface / Main

| Variable | Value |
|---|---|
| `surfase/main/White` | `#ffffff` |
| `surfase/main/Gray 0` | `#ffffff` |
| `surfase/main/Gray 100` | `#f8fafc` |
| `surfase/main/Gray 200` | `#f1f5f9` |
| `surfase/main/Gray 300` | `#e2e8f0` |
| `surfase/main/Gray 400` | `#cad5e2` |
| `surfase/main/Gray 500` | `#90a1b9` |
| `surfase/main/Gray 800` | `#314158` |
| `surfase/main/Gray 900` | `#1d293d` |
| `surfase/main/Gray 950` | `#020618` |

#### Surface / Purple (Brand)

| Variable | Value |
|---|---|
| `surfase/purple/Purple 50` | `#f7f6fd` |
| `surfase/purple/Purple 100` | `#f3e8ff` |
| `surfase/purple/Purple 500` | `#8e51ff` |
| `surfase/purple/Purple 600` | `#7849ff` |
| `surfase/purple/Purple 800` | `#5f33e6` |

#### Surface / Negative (Red)

| Variable | Value |
|---|---|
| `surfase/negative/Red 50` | `#fff1f2` |
| `surfase/negative/Red 100` | `#ffe4e6` |
| `surfase/negative/Red 400` | `#ff8b8b` |
| `surfase/negative/Red 700` | `#f22a42` |
| `surfase/negative/Red 800` | `#c70036` |

#### Surface / Supporting / Blue

| Variable | Value |
|---|---|
| `surfase/supporting/Blue/Blue 200` | `#e7f4fe` |
| `surfase/supporting/Blue/Blue 600` | `#0e5cf4` |

#### Surface / Supporting / Amber (Yellow)

| Variable | Value |
|---|---|
| `surfase/supporting/Amber/Yellow 100` | `#ffefdb` |
| `surfase/supporting/Amber/Yellow 400` | `#f8bc3b` |
| `surfase/supporting/Amber/Yellow 600` | `#da6b16` |

#### Surface / Supporting / Orange

| Variable | Value |
|---|---|
| `surfase/supporting/Orange/Orange 700` | `#cc332b` |

#### Surface / Supporting / Pink

| Variable | Value |
|---|---|
| `surfase/supporting/Pink/Pink 200` | `#ff4dd2` |
| `surfase/supporting/Pink/Pink 300` | `#df00b4` |

#### Outline / Main

| Variable | Value |
|---|---|
| `outline/main/White` | `#ffffff` |
| `outline/main/Gray 100` | `#f8fafc` |
| `outline/main/Gray 200` | `#f1f3f4` |
| `outline/main/Gray 300` | `#e2e8f0` |
| `outline/main/Gray 400` | `#cad5e2` |
| `outline/main/Gray 500` | `#90a1b9` |
| `outline/main/Gray 600` | `#62748e` |
| `outline/main/Gray 800` | `#314158` |
| `outline/main/Gray 900` | `#1d293d` |

#### Outline / Brand

| Variable | Value |
|---|---|
| `outline/brand/Purple 400` | `#7849ff` |
| `outline/brand/Purple 450` | `#5f33e6` |

#### Outline / Supporting

| Variable | Value |
|---|---|
| `outline/supporting/blue/Blue 300` | `#c2dfff` |
| `outline/supporting/blue/Blue 600` | `#0e5cf4` |

#### Outline / Negative

| Variable | Value |
|---|---|
| `outline/negative/Red 700` | `#f22a42` |

#### Text / Main

| Variable | Value |
|---|---|
| `taxt/main/White` | `#ffffff` |
| `taxt/main/Gray 100` | `#f8fafc` |
| `taxt/main/Gray 500` | `#90a1b9` |
| `taxt/main/Gray 600` | `#62748e` |
| `taxt/main/Gray 700` | `#45556c` |
| `taxt/main/Gray 800` | `#314158` |
| `taxt/main/Gray 900` | `#1d293d` |

#### Text / Brand

| Variable | Value |
|---|---|
| `taxt/brand/Purple 600` | `#7849ff` |
| `taxt/brand/Purple 800` | `#5f33e6` |

#### Text / Supporting

| Variable | Value |
|---|---|
| `taxt/supporting/blue/Blue 600` | `#0e5cf4` |

#### Text / Negative

| Variable | Value |
|---|---|
| `taxt/negative/Red 700` | `#f22a42` |

#### Token Colors

| Variable | Value |
|---|---|
| `token/surface/primary/BW-00` | `#ffffff` |
| `token/surface/primary/BW-01` | `#fbfbfd` |
| `token/text/main/Primary` | `#20242e` |
| `token/text/negative/Red` | `#e74343` |

#### Legacy / Text Colors & BG

| Variable | Value |
|---|---|
| `Text colors & BG/BW - 00` | `#FFFFFF` |
| `Text colors & BG/BW -02` | `#F6F7FA` |
| `Text colors & BG/BW - 05` | `#A8B2C8` |
| `Text colors & BG/BW - 08` | `#20242E` |
| `Text colors & BG/BW - 09` | `#13151A` |
| `Label Color / Light / Primary` | `#000000` |

### Typography

#### Font Families

| Variable | Value |
|---|---|
| `typography/family/heading` | `Inter` |
| `typography/family/body` | `Inter` |
| `font/family/body` | `Metric-R` |

#### Font Weights

| Variable | Value |
|---|---|
| `typography/weight/font-normal` | `regular` (400) |
| `typography/weight/font-medium` | `medium` (500) |
| `typography/weight/font-semibold` | `semibold` (600) |
| `font/weight/Medium` | `Medium` |

#### Font Sizes

| Variable | Value |
|---|---|
| `font-size-H12` | `12` |
| `font-size-H10` | `14` |
| `font/size/md` | `14` |
| `typography/size/sm` | `16` |
| `typography/size/lg` | `20` |
| `typography/size/2xl` | `32` |

#### Composite Typography Styles

| Variable | Definition |
|---|---|
| `Heading/text-xs/text-sm-normal` | Inter regular 12/16 (0 tracking) |
| `Heading/text-xs/text-sm-Medium` | Inter medium 12/16 (0 tracking) |
| `Heading/text-xs/text-sm-Semibold` | Inter semibold 12/16 (0 tracking) |
| `Heading/text-sm/text-lg-normal` | Inter regular 14/20 (-0.2 tracking) |
| `Heading/text-sm/text-lg-Medium` | Inter medium 14/20 (-0.2 tracking) |
| `Heading/text-sm/text-lg-Semibold` | Inter semibold 14/20 (-0.2 tracking) |
| `Heading/text-3xl/text-7xl-normal` | Inter regular 30/32 (-0.2 tracking) |
| `Heading/text-3xl/text-7xl-Semibold` | Inter semibold 30/32 (-0.2 tracking) |
| `Body/text-sm/text-lg-normal` | Inter regular 14/20 (-0.2 tracking) |

### Spacing

| Variable | Value (px) |
|---|---|
| `spacing (gap-*/p-*/m-*)/p-0` | `0` |
| `spacing (gap-*/p-*/m-*)/p-0_5` | `2` |
| `spacing (gap-*/p-*/m-*)/p-1` | `4` |
| `spacing (gap-*/p-*/m-*)/p-2` | `8` |
| `spacing (gap-*/p-*/m-*)/p-3` | `12` |
| `spacing (gap-*/p-*/m-*)/p-4` | `16` |
| `spacing (gap-*/p-*/m-*)/p-8` | `32` |
| `token/spacing/3` | `8` |
| `unit/XL` | `20` |

### Border Radius

| Variable | Value (px) |
|---|---|
| `radius/non` | `0` |
| `radius/md` | `4` |
| `radius/lg` | `8` |
| `radius/xl` | `12` |
| `token/radius/non` | `0` |
| `token/radius/md` | `4` |
| `token/radius/lg` | `8` |

### Border Width

| Variable | Value (px) |
|---|---|
| `custom/border-width-50` | `1` |
| `custom/border-width-100` | `1.2` |
| `custom/border-width-200` | `1.5` |

### Breakpoints

| Variable | Value (px) |
|---|---|
| `XS` | `375` |
| `S` | `768` |
| `M` | `1024` |
| `L` | `1280` |
| `XL` | `1440` |
| `XXL` | `1920` |

### Shadows / Effects

| Variable | Definition |
|---|---|
| `Shadow/XS/shadow-xs` | drop-shadow(0 1px 2px Gray 300) |
| `Shadow/SM/shadow-sm` | drop-shadow(0 1px 6px #CAD5E240), drop-shadow(0 1px 4px #CAD5E280) |
| `Down/Shadow 3` | drop-shadow(0 1px 6px #B0BDC517), drop-shadow(0 6px 13px #B0BDC524), drop-shadow(0 1px 2px #3A485012) |
| `Key light shadow` | drop-shadow(0 1px 0 #00000059) |
| `background/3px Error-100` | box-shadow(0 0 0 3px Red 100) |
