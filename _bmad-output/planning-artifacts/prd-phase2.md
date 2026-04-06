---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain-skipped
  - step-06-innovation-skipped
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
classification:
  projectType: developer_tool
  domain: general
  complexity: low
  projectContext: brownfield
inputDocuments:
  - product-brief-desing-system-vue-2026-03-23.md
  - prd-v1.md (completed Phase 1 PRD)
  - docs/figma-variables.md
  - docs/ai-guidelines/index.md
  - docs/ai-guidelines/ds-button.md
  - docs/ai-guidelines/ds-icon.md
  - docs/ai-guidelines/ds-icon-button.md
  - docs/ai-guidelines/ds-input-text.md
  - docs/ai-guidelines/ds-link.md
  - docs/component-addition-guide.md
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 0
  projectDocs: 8
workflowType: 'prd'
---

# Product Requirements Document - desing-system-vue

**Author:** Yurii
**Date:** 2026-04-06

## Executive Summary

desing-system-vue Phase 2 expands the component library from 5 MVP components to 13, driven by real-world DS-GAP flags from AI agents and developers implementing Figma designs. The MVP (v0.1.2) validated the full pipeline — Figma tokens → PrimeVue Styled Mode preset → wrapped component → Storybook → AI knowledge base — and the approach requires no architectural changes for Phase 2.

Phase 2 adds 8 components: 5 form components (DsTextarea, DsSelect, DsSearchField, DsCodeInput, DsFilterField) and 3 display components (DsChip, DsBadge, DsAvatar). Each follows the established component addition pattern: PrimeVue wrapper or custom Tailwind implementation, TypeScript props, Storybook stories, Vitest tests, and AI knowledge base entry.

Target users remain mid-level frontend developers and AI coding agents (Claude, Cursor, Copilot). Solo maintainer: Yurii.

### What Makes This Special

The gap-driven growth model is working as designed. Rather than building components speculatively, the library expands based on real DS-GAP flags — proof that agents and developers are actively using the system and hitting its boundaries. Phase 2 is not a roadmap exercise; it's a response to validated demand.

The MVP proved that AI-first documentation works: agents reliably consume the knowledge base and reuse library components instead of generating raw Tailwind. Expanding the component inventory directly reduces the surface area where agents fall back to custom markup.

### Project Classification

- **Project Type:** Developer Tool — npm package / Vue 3 component library
- **Domain:** General — no specialized regulatory requirements
- **Complexity:** Low — established patterns from MVP, no architectural changes needed
- **Project Context:** Brownfield — extending existing v0.1.2 library with 8 new components

## Success Criteria

### User Success

- **Developer self-service (maintained):** A developer can find, understand, and correctly use any Phase 2 component without asking for help — Storybook alone is sufficient
- **AI agent coverage expansion:** AI agents produce code using library components for all 13 covered patterns (up from 5), with DS-GAP flags only for components outside the library
- **First-render accuracy (maintained):** Phase 2 components render matching Figma in both light and dark mode on first attempt

### Business Success

- **Gap reduction:** The 8 most-flagged DS-GAP patterns are eliminated from AI agent output
- **Repeatable velocity:** Each new component follows the established addition pattern — no one-off approaches or architectural detours
- **Single maintainer sustainability (maintained):** Yurii can add all 8 components following the documented pattern

### Technical Success

- **Zero breaking changes:** Phase 2 additions don't modify any existing MVP component behavior or API
- **Build and test green:** All 13 components pass Vitest tests, Biome lint, and Vite build
- **npm package installs and imports cleanly** with the expanded component set

### Measurable Outcomes

| Metric | Target |
|--------|--------|
| Component count | 13 (5 existing + 8 new) |
| Storybook story coverage | 1+ story per component variant |
| AI knowledge base entries | 1 per component (13 total) |
| DS-GAP reduction | 8 previously-flagged patterns now covered |
| Breaking changes to existing components | 0 |

## User Journeys

### Journey 1: Developer Implements a Feature Using Phase 2 Components

**Persona:** Alex, a mid-level Vue developer. Comfortable with Vue 3 and Tailwind, already familiar with the design system from Phase 1 (DsButton, DsInputText, DsLink).

**Opening Scene:** Alex receives a Figma design for a user profile page — it has a text area for bio, a select dropdown for timezone, a chip list for skills, a badge for role, and an avatar. In Phase 1, Alex would have hit DS-GAP flags for all of these.

**Rising Action:** Alex opens Storybook, searches "avatar." He finds DsAvatar with size variants and live examples. He searches "chip" — DsChip is there too, with selectable and removable variants. Every component in the Figma design now has a library match.

**Climax:** Alex composes the profile page entirely from library components — DsTextarea for bio, DsSelect for timezone, DsChip for skills, DsBadge for role, DsAvatar for the profile image. Zero custom Tailwind needed for any element covered by the Figma design.

**Resolution:** The profile page matches Figma on first render in both light and dark mode. Alex never had to write a DS-GAP comment or fall back to raw markup. The expanded library covers every element in the design.

### Journey 2: AI Agent Implements a Figma Design with Phase 2 Components

**Persona:** Claude (AI coding agent), tasked with implementing a settings form from a Figma design.

**Opening Scene:** A developer shares a Figma URL. The screenshot shows a form with a search field, a code input for API keys, a filter field, a textarea for notes, and a select dropdown.

**Rising Action:** Claude consults the AI knowledge base. All 5 form components are documented — DsSearchField, DsCodeInput, DsFilterField, DsTextarea, DsSelect — each with props, variants, and usage examples.

**Climax:** Claude generates code importing all 5 components from `desing-system-vue` with correct props. Zero raw Tailwind CSS for any covered element. The knowledge base entries are consistent with the Phase 1 format, so Claude's matching logic works identically.

**Resolution:** The developer receives production-ready code. No manual cleanup, no component replacement. The 13-component library now covers the majority of common form and display patterns.

### Journey 3: AI Agent Encounters a Missing Component

**Persona:** Claude (AI coding agent), implementing a design that includes a card layout with a dot indicator.

**Opening Scene:** The Figma design includes a DsCard with a DsDotIndicator. Claude checks the AI knowledge base — neither entry exists (deferred to post-Phase 2).

**Rising Action:** Claude recognizes the gap. For covered elements (buttons, inputs, chips, badges, avatars), it uses library components. For the card and dot indicator, it falls back to raw Tailwind CSS using design tokens from the knowledge base.

**Climax:** Claude flags both gaps: "DsCard and DsDotIndicator are not yet available in desing-system-vue. Implemented with Tailwind CSS using design system tokens."

**Resolution:** The gap flags feed into future prioritization. The gap surface is smaller than Phase 1 — fewer patterns require fallback markup, and each flagged gap is a signal for Phase 3 expansion.

### Journey 4: Maintainer Adds Phase 2 Components

**Persona:** Yurii, solo maintainer of the design system.

**Opening Scene:** Phase 2 is scoped — 8 components driven by real DS-GAP flags. Yurii has the component addition guide, the established PrimeVue Styled Mode preset, and the repeatable pattern proven by 5 MVP components.

**Rising Action:** Yurii works through each component systematically: check Figma specs, determine if PrimeVue wrapper or custom Tailwind, map tokens to preset, implement `.vue` file, write TypeScript types, create Storybook stories, write Vitest tests, add AI knowledge base entry, export from barrel files. The pattern is identical for each component — no surprises.

**Climax:** All 8 components pass the full checklist: build succeeds, tests pass, Biome lint clean, Storybook renders correctly in light and dark mode, AI knowledge base entries follow the established format. The library publishes as the next minor version.

**Resolution:** The component inventory grows from 5 to 13 without any architectural changes. The repeatable pattern held — each addition was predictable and fast. The AI guidelines index is updated, and agents immediately start using the new components.

### Journey Requirements Summary

| Journey | Capabilities Revealed |
|---------|----------------------|
| Developer implements feature | Storybook with expanded component set; consistent API patterns across all 13 components; copy-paste usage patterns |
| AI agent implements design | AI knowledge base with 13 entries; consistent entry format enabling reliable component matching; reduced gap surface |
| AI agent hits gap | Shrinking gap surface; same fallback mechanism; gap flags feed Phase 3 prioritization |
| Maintainer adds components | Repeatable addition pattern; no architectural changes; systematic checklist execution |

## Developer Tool Specific Requirements

### Technical Architecture Considerations

**No changes from Phase 1.** The architecture is established and validated:
- Vue 3 Composition API with TypeScript
- PrimeVue Styled Mode + Custom Theme Preset for token mapping
- Vite library build with tree-shakeable ESM exports
- PrimeVue and Vue 3 as peer dependencies

**Phase 2 component classification (PrimeVue wrapper vs. custom Tailwind):**

| Component | Type | PrimeVue Base | Notes |
|-----------|------|---------------|-------|
| DsTextarea | PrimeVue Wrapper | Textarea | Standard text area with label/hint/error pattern from DsInputText |
| DsSelect | PrimeVue Wrapper | Select | Dropdown with options, follows DsInputText label pattern |
| DsSearchField | Custom Tailwind | None | Composed from DsInputText + search icon + clear behavior |
| DsCodeInput | Custom Tailwind | None | Monospace input for code/tokens/API keys |
| DsFilterField | Custom Tailwind | None | Search + filter chips composition |
| DsChip | PrimeVue Wrapper | Chip | Selectable, removable variants |
| DsBadge | PrimeVue Wrapper | Badge | Status indicator with severity colors |
| DsAvatar | PrimeVue Wrapper | Avatar | Image, initials, icon fallback variants |

### API Surface Expansion

- Component exports grow from 5 to 13
- All new components follow existing prop conventions (`severity`, `size`, `disabled`, `variant`)
- Custom components (DsSearchField, DsCodeInput, DsFilterField) follow PrimeVue API conventions per the component addition guide
- Full TypeScript prop types with documented variants for all new components

### Implementation Considerations

- **Composition patterns:** DsSearchField and DsFilterField may compose existing components (DsInputText, DsIcon, DsChip) — this is the first time the library has composed its own components beyond DsIconButton using DsIcon
- **Form field consistency:** DsTextarea and DsSelect should follow the same label/hint/error pattern established by DsInputText
- **Each component goes through the full checklist:** `.vue` implementation, TypeScript types, Storybook stories, Vitest tests, AI knowledge base entry, barrel exports

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Expansion MVP — extending a validated system with gap-driven component additions. No architectural exploration needed; the pipeline is proven.

**Resource Requirements:** Solo maintainer (Yurii). Each component follows the established checklist — predictable effort per component.

### Phase 2 Feature Set (This PRD)

**Core User Journeys Supported:**
- All 4 existing journeys — developer implements feature, AI agent implements design, AI agent handles gap, maintainer adds component

**Must-Have Capabilities:**
- 5 form components: DsTextarea, DsSelect, DsSearchField, DsCodeInput, DsFilterField
- 3 display components: DsChip, DsBadge, DsAvatar
- Per component: TypeScript types, Storybook stories, Vitest tests, AI knowledge base entry
- Updated AI guidelines index covering all 13 components
- npm package version bump and publish

### Post-Phase 2 Features

**Phase 3 — Remaining Display & Interaction Components:**
- DsMentionBadge, DsDotIndicator, DsCard, DsSlider (deferred until gap-flagged)
- DsContextMenu, DsFileUpload, DsExpandableFileUploader

**Phase 4 — Automation & Scale:**
- Figma Code Connect integration
- Automated Figma-to-code sync
- Visual regression testing
- Multi-brand theming support

### Risk Mitigation Strategy

**Technical Risks:**
- Custom Tailwind components (DsSearchField, DsCodeInput, DsFilterField) have no PrimeVue base — higher implementation effort than wrappers. Mitigation: follow the custom Tailwind pattern from the component addition guide; compose existing library components where possible.
- Component composition (DsFilterField using DsChip + DsInputText) is new territory. Mitigation: implement simpler compositions first (DsSearchField), validate the pattern, then apply to DsFilterField.

**Market Risks:**
- Low. All 8 components are driven by real DS-GAP flags — validated demand.

**Resource Risks:**
- Solo maintainer. Mitigation: repeatable pattern reduces cognitive load; each component is independent, so work can be paused/resumed without losing context.

## Functional Requirements

### New Component Library — Form Components

- FR1: Developers can import and render DsTextarea with sizes (S, M), states (Default, Hover, Focus, Filled, Error, Disabled), and label/hint/error pattern consistent with DsInputText
- FR2: Developers can import and render DsSelect with a dropdown option list, sizes (S, M), states (Default, Hover, Focus, Filled, Error, Disabled), and label/hint/error pattern consistent with DsInputText
- FR3: Developers can import and render DsSearchField with search icon, clearable input, and sizes matching the design system scale
- FR4: Developers can import and render DsCodeInput for monospace code/token/API key input with sizes and states
- FR5: Developers can import and render DsFilterField combining search input with filter chip display and removal

### New Component Library — Display Components

- FR6: Developers can import and render DsChip with variants (Default, Selected, Disabled) and removable behavior
- FR7: Developers can import and render DsBadge with severity color variants matching the design token palette
- FR8: Developers can import and render DsAvatar with image, initials fallback, and icon fallback variants, in multiple sizes

### Component Consistency

- FR9: All Phase 2 components can accept and pass through standard PrimeVue props, slots, and events for their underlying PrimeVue base component (where applicable)
- FR10: All Phase 2 components can render matching the Figma design in both light and dark themes without additional styling
- FR11: All Phase 2 components can provide TypeScript type definitions for props, emits, and slots
- FR12: All Phase 2 components follow existing prop conventions (`severity`, `size`, `disabled`, `variant`)

### Component Composition

- FR13: DsSearchField can compose DsInputText and DsIcon internally
- FR14: DsFilterField can compose DsInputText, DsIcon, and DsChip internally
- FR15: Composed components can be used without the consumer needing to import the internal components separately

### Package & Distribution

- FR16: Consuming projects can import all 13 components individually (tree-shakeable)
- FR17: The expanded package can install and build without breaking changes to existing MVP components

### Developer Documentation (Storybook)

- FR18: Developers can browse all 13 components in Storybook organized by Figma structure
- FR19: Developers can view live interactive stories for every Phase 2 component variant and state
- FR20: Developers can manipulate Phase 2 component props via Storybook controls

### AI Knowledge Base

- FR21: AI agents can access structured documentation listing all 13 available components
- FR22: AI agents can look up per-component entries for all 8 new components containing: component name, when to use, available props/variants, usage examples, and Figma reference
- FR23: AI agents can determine which library component matches a given Figma design element from the expanded 13-component inventory

### Library Maintenance

- FR24: The maintainer can add each Phase 2 PrimeVue-wrapper component by creating a preset configuration, Storybook story, Vitest tests, and AI knowledge base entry
- FR25: The maintainer can add each Phase 2 custom Tailwind component following PrimeVue API conventions and the component addition guide
- FR26: The maintainer can validate Phase 2 component visual output against Figma screenshots in Storybook

## Non-Functional Requirements

### Performance

- NFR1: Individual component bundle size must be minimized via tree-shaking — consuming projects only load components they import
- NFR2: Phase 2 components must not introduce rendering performance overhead beyond PrimeVue's baseline
- NFR3: Composed components (DsSearchField, DsFilterField) must not add perceptible latency compared to non-composed components

### Accessibility

- NFR4: All PrimeVue-wrapped Phase 2 components must preserve PrimeVue's built-in keyboard navigation and ARIA attributes
- NFR5: Custom Tailwind components (DsSearchField, DsCodeInput, DsFilterField) must implement keyboard navigation and ARIA support per the component addition guide
- NFR6: All Phase 2 interactive components must have visible focus indicators in both light and dark themes
- NFR7: DsAvatar must provide accessible alt text or aria-label for image and icon variants
- NFR8: DsChip with removable behavior must be keyboard-accessible (Enter/Space to remove, focus management after removal)

### Compatibility

- NFR9: Phase 2 components must be compatible with the same Vue 3.x and PrimeVue 4.x versions as Phase 1
- NFR10: Phase 2 components must not introduce new peer dependencies beyond Vue 3 and PrimeVue
- NFR11: TypeScript types for Phase 2 components must be compatible with both strict and non-strict configurations

### Documentation Quality

- NFR12: Every Phase 2 Storybook story must load and render without errors
- NFR13: AI knowledge base entries for Phase 2 components must follow the same structure as Phase 1 entries, enabling reliable LLM parsing
- NFR14: Phase 2 documentation must be indistinguishable in quality and format from Phase 1 documentation
