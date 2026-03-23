---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
inputDocuments:
  - product-brief-desing-system-vue-2026-03-23.md
  - "Figma: Design-Systems (3qP5xnwc6gXhZR3AnFAMFe) - Base Components page (node 1:2)"
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
