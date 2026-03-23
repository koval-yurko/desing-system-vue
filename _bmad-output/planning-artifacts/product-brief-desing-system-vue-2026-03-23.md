---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  - Readme.md
  - "Figma: Design-Systems (3qP5xnwc6gXhZR3AnFAMFe) - Unframe AI Design System"
date: 2026-03-23
author: Yurii
---

# Product Brief: desing-system-vue

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

desing-system-vue is a standalone Vue 3 component library that wraps PrimeVue components with project-specific design tokens and patterns derived from a Figma Design System. It ships as an npm package with Storybook documentation for developers and a centralized AI knowledge base that enables AI agents to correctly reuse existing components instead of generating raw Tailwind CSS from scratch. The library bridges the gap between Figma design intent and production Vue code for both human developers and AI-assisted workflows.

---

## Core Vision

### Problem Statement

When implementing Figma designs in Vue applications, AI agents consistently generate custom Tailwind CSS markup instead of reusing existing design system components. This leads to duplicated code, inconsistent styling, and components that drift from the established design language. Frontend developers face the same friction — without a clear, well-documented component library tied to the Figma source, each implementation becomes a manual translation exercise.

### Problem Impact

- **Code duplication** — The same UI patterns get reimplemented differently across features and by different agents/developers
- **Design drift** — Without a single source of truth linking Figma to code, production UIs gradually diverge from design intent
- **Wasted effort** — Developers and AI agents spend time building what already exists because discoverability is poor
- **Inconsistent quality** — Each re-implementation introduces subtle differences in spacing, color, and interaction behavior

### Why Existing Solutions Fall Short

- **PrimeVue alone** is a generic library — it doesn't encode project-specific design decisions, tokens, or composition patterns from the Figma system
- **Raw Tailwind CSS** gives too much freedom — AI agents default to it because it's universally documented, while project-specific components are not
- **Figma Code Connect and Storybook** exist as tools but are not yet adopted; without them, there is no machine-readable mapping between design components and code components
- **No centralized AI knowledge base** exists to instruct agents on which components to use, their props, and when to apply them

### Proposed Solution

A standalone npm package (`desing-system-vue`) containing:
1. **Vue 3 components** built on PrimeVue and styled with Tailwind CSS to match the Figma Design System (colors, typography, shadows, icons, and 25+ UI components)
2. **Storybook** as the interactive documentation and demo environment for developers
3. **A centralized AI knowledge base** — structured documentation that AI agents consume to understand available components, their props/variants, and usage patterns, ensuring agents reuse library components instead of generating raw markup

### Key Differentiators

- **AI-first documentation** — A dedicated knowledge base designed for LLM consumption, not just human readers, making AI agents reliable consumers of the design system
- **Figma-to-code traceability** — Each component maps back to its Figma counterpart, creating a clear chain from design to production
- **Dual audience** — Equally useful for frontend developers (via Storybook) and AI agents (via centralized knowledge base), ensuring consistent output regardless of who implements the design
- **PrimeVue foundation** — Leverages a mature, accessible component library rather than building from scratch, reducing maintenance burden while adding project-specific design value

## Target Users

### Primary Users

#### 1. AI Coding Agents (Claude, Cursor, Copilot, etc.)

**Context:** AI agents tasked with implementing Figma designs into Vue 3 applications. They receive a Figma screenshot or design context and must produce production-ready Vue code.

**Problem Experience:** Without structured component documentation, agents default to generating raw Tailwind CSS markup — recreating buttons, inputs, modals from scratch instead of importing existing design system components. This produces working but inconsistent code that duplicates what already exists.

**Success Vision:** When given a Figma design, the agent consults the centralized AI knowledge base, identifies which design system components match the design elements, and produces code that imports and composes existing components with correct props and variants. Zero raw Tailwind for patterns the library already covers.

#### 2. Mid-Level Frontend Developers

**Context:** Vue developers implementing features from Figma designs. Comfortable with Vue 3 and Tailwind CSS but not intimately familiar with every available component in the design system.

**Problem Experience:** When implementing a new feature from Figma, they spend time searching for whether a component already exists, what props it accepts, and how to compose components together. Without clear documentation, they sometimes rebuild what's already available or use components incorrectly.

**Success Vision:** Open Storybook, find the component that matches the Figma element, see live examples with prop variations, copy the usage pattern, and integrate it into their feature. Fast, confident, consistent.

### Secondary Users

#### Design System Maintainer (Yurii)

**Context:** Solo maintainer responsible for creating and evolving the component library, keeping it aligned with the Figma source, writing the AI knowledge base, and ensuring Storybook stays current.

**Success Vision:** A well-structured repo where adding a new component follows a clear pattern: build the Vue component wrapping PrimeVue, add Storybook stories, update the AI knowledge base — and both humans and agents immediately benefit.

### User Journey

1. **Discovery** — Developer or AI agent encounters a Figma design to implement and checks the design system documentation (Storybook for devs, knowledge base for agents)
2. **Component Matching** — Identifies which existing components map to the Figma elements (buttons, inputs, modals, etc.)
3. **Implementation** — Imports components from the npm package and composes them with correct props/variants
4. **Success Moment** — The implemented UI matches the Figma design using only library components — no custom Tailwind workarounds needed
5. **Long-term** — The design system becomes the default starting point for every Figma implementation, reducing time-to-code and ensuring visual consistency

## Success Metrics

### User Success Metrics

- **AI Agent Compliance** — When implementing a Figma design, AI agents use library components instead of generating raw Tailwind CSS for any UI element that has a corresponding design system component
- **Developer Adoption** — Mid-level Vue developers can find, understand, and correctly use any design system component within minutes via Storybook
- **Implementation Consistency** — Two different developers (or agents) implementing the same Figma design produce structurally identical component usage

### Business Objectives

- **Component Coverage** — 100% of Figma Design System foundations (colors, typography, shadows, icons) and components (buttons, inputs, checkbox, toggle, radio, tabs, accordion, badge, avatar, context menu, file upload, stepper, dropdown, labels, navigation, header, nav bar, sidebar, breadcrumbs, tooltip, snackbar/toast, notification, modal/dialog, contextual banner, alert dialog, drawer, share modal, popup) are implemented as Vue 3 components
- **Storybook Completeness** — Every component has Storybook stories covering all props, variants, and states visible in the Figma source
- **AI Knowledge Base Coverage** — Every component has structured documentation in the centralized knowledge base describing: when to use it, available props/variants, and usage examples
- **Package Readiness** — Published as a standalone npm package consumable by any Vue 3 project

### Key Performance Indicators

| KPI | Target | Measurement |
|-----|--------|-------------|
| Figma component coverage | 100% of design system | Components implemented / Figma components |
| Storybook story coverage | 1+ story per component variant | Stories / component variants |
| AI knowledge base entries | 1 per component | KB entries / components |
| Zero raw Tailwind for covered patterns | 0 custom implementations | Code review of AI-generated output |
| npm package published | Installable and importable | Successful npm install + import |

## MVP Scope

### Core Features

**1. Repo Infrastructure**
- Vue 3 + Vite build setup configured for npm package output
- Tailwind CSS with design tokens extracted from Figma (colors, typography, shadows, spacing)
- PrimeVue integration with token/theme customization matching the actual Figma design system
- Storybook setup as interactive component documentation
- Centralized AI knowledge base with structured component documentation

**2. Foundations (from Figma Design System)**
- Color system — Gray/Neutral, Primary (Purple), Blue, Red/Error, Green/Success, Orange/Warning, Teal, Yellow, Pink (50–950 shades) mapped to Tailwind config and PrimeVue tokens
- Typography — Font families, sizes, weights, line heights from Figma
- Shadows — Elevation system from Figma
- Icons — Icon set integration from Figma

**3. MVP Components**
- **Buttons** — All variants and states from Figma (primary, secondary, sizes, disabled, loading)
- **Input Fields** — Text inputs with labels, validation states, variants from Figma
- **Link** — Styled link component with variants from Figma

**4. Documentation (per component)**
- Storybook stories covering all props, variants, and states
- AI knowledge base entry: component name, when to use, props/variants, usage examples, Figma reference

### Out of Scope for MVP

- Figma Code Connect integration
- Automated Figma-to-code sync
- Visual regression testing
- Theming / multi-brand support
- Remaining Figma components (Checkbox, Toggle, Radio, Tabs, Accordion, Badge, Avatar, Context Menu, File Upload, Stepper, Dropdown, Navigation, Header, Nav Bar, Sidebar, Breadcrumbs, Tooltip, Snackbar/Toast, Notification, Modal/Dialog, Contextual Banner, Alert Dialog, Drawer, Share Modal, Popup)

### MVP Success Criteria

- npm package installs and imports cleanly into a Vue 3 project
- Foundations (colors, typography, shadows, icons) match the Figma design system
- PrimeVue tokens are customized to reflect Figma design decisions
- Buttons, Input Fields, and Link components render correctly with all Figma variants
- Storybook documents every MVP component with live examples
- AI knowledge base enables an agent to implement a Figma design using library components instead of raw Tailwind for any covered pattern
- A test scenario: give an AI agent a Figma screenshot containing buttons, inputs, and links — it produces code using the library, not custom markup

### Future Vision

- **Automated Figma-to-code sync** — Changes in Figma automatically propagate to component implementations, keeping design and code in lockstep
- **Visual regression testing** — Automated screenshot comparison to catch unintended visual changes across releases
- **Full component coverage** — Implement all remaining 25+ components from the Figma design system (navigation, feedback, data display patterns)
- **Figma Code Connect** — Machine-readable mapping between Figma components and code components for seamless design-to-dev handoff
