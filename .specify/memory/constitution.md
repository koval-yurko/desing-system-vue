<!--
Sync Impact Report
===================
- Version change: 0.0.0 → 1.0.0 (MAJOR: initial ratification)
- Modified principles: N/A (initial creation)
- Added sections:
  - Core Principles (5): Component-First, Design Token Driven,
    Type Safety, Visual & Unit Testing, Simplicity & Consistency
  - Technology Stack
  - Development Workflow
  - Governance
- Removed sections: N/A
- Templates requiring updates:
  - .specify/templates/plan-template.md ✅ no changes needed
  - .specify/templates/spec-template.md ✅ no changes needed
  - .specify/templates/tasks-template.md ✅ no changes needed
- Follow-up TODOs: none
-->

# Design System Vue Constitution

## Core Principles

### I. Component-First

Every UI element MUST be a reusable, self-contained Vue 3 component
that wraps or extends PrimeVue primitives.

- Components MUST have a clear, minimal props API with defined
  defaults and validation.
- Components MUST be independently importable and tree-shakeable.
- Components MUST NOT contain business logic; they receive data
  and emit events.
- Each component MUST have a single, well-defined responsibility.

### II. Design Token Driven

All visual properties MUST be defined via design tokens to ensure
consistency between the Figma source (Prime 4.0) and code.

- Colors, spacing, typography, shadows, and border radii MUST be
  expressed as Tailwind CSS theme tokens, not hard-coded values.
- Token names MUST mirror the Figma design system naming where
  practical.
- Components MUST consume tokens exclusively through Tailwind
  utility classes or CSS custom properties derived from the
  Tailwind config.

### III. Type Safety

TypeScript with strict mode MUST be used across the entire
codebase.

- All component props, emits, slots, and exposed methods MUST
  have explicit TypeScript definitions.
- Shared types MUST live in a dedicated `types/` directory and
  be re-exported from the package entry point.
- `any` is prohibited; `unknown` with type guards MUST be used
  when the type cannot be determined statically.

### IV. Visual & Unit Testing

Every component MUST have both visual regression coverage and
unit tests.

- Unit tests MUST be written with Vitest and Vue Test Utils,
  covering props, events, slots, and edge cases.
- Visual tests MUST be maintained via Storybook stories that
  capture each component state (default, hover, disabled, error,
  responsive breakpoints).
- A component is not considered complete until both test types
  pass in CI.

### V. Simplicity & Consistency

Components MUST follow PrimeVue conventions and remain as lean
as possible.

- Prefer composing existing PrimeVue components over building
  from scratch.
- YAGNI: do not add props, variants, or abstractions until a
  concrete use case demands them.
- API naming MUST follow Vue 3 and PrimeVue conventions
  (e.g., `modelValue` for v-model, kebab-case events).
- Every deviation from PrimeVue defaults MUST be documented with
  a rationale.

## Technology Stack

- **Framework**: Vue 3 (Composition API, `<script setup>`)
- **Component Library**: PrimeVue (base primitives)
- **Styling**: Tailwind CSS (utility-first, design token config)
- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite
- **Testing**: Vitest + Vue Test Utils (unit), Storybook (visual)
- **Design Source**: Prime 4.0 Figma kit

All dependencies MUST be pinned to exact versions in the lockfile.
New dependencies MUST be justified by a concrete requirement and
approved before merging.

## Development Workflow

- Feature work follows the SpecKit workflow: specify, clarify,
  plan, implement, validate.
- Each component MUST have a corresponding Storybook story before
  it is considered reviewable.
- Pull requests MUST include: component code, types, unit tests,
  Storybook story, and a screenshot or visual diff.
- Breaking changes to component APIs MUST follow semver and
  include a migration note.

## Governance

This constitution is the authoritative source of project
standards. It supersedes ad-hoc decisions and informal
conventions.

- **Amendments** require: a written proposal, review by at least
  one maintainer, and an updated version number following semver.
- **Compliance** is verified during code review; reviewers MUST
  check PRs against these principles.
- **Versioning** follows semantic versioning: MAJOR for
  principle removals or incompatible redefinitions, MINOR for
  new principles or material expansions, PATCH for clarifications
  and wording fixes.

**Version**: 1.0.0 | **Ratified**: 2026-03-21 | **Last Amended**: 2026-03-21
