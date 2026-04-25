# Changelog

All notable changes to `@failwin/desing-system-vue` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-04-25

### Added

- 7 new components covering 7 previously DS-GAP-flagged Figma patterns:
  - `DsAvatar` — image, initials, and icon fallback variants; 4 sizes; 9 colors for colored initials.
  - `DsBadge` — 11 type variants (pending, interesting, neutral, rejected, accepted, cancel, border, clean, draft, loaded/shimmer, type10) with optional 12px icons.
  - `DsChip` — default / selected / not-clickable types; 2 sizes; removable behavior with keyboard accessibility (Enter/Space) and post-removal focus management.
  - `DsCodeInput` — PIN/OTP-style verification code input wrapping PrimeVue `InputOtp`; per-cell states; configurable length; error message with per-cell `aria-describedby` / `aria-invalid`; paste support.
  - `DsSearchField` — composes `DsInputText` + `DsIcon` internally; built-in search icon; clear button; optional filter/help button; 4 sizes (XXS / XS / S / M).
  - `DsSelect` — single- and multi-selection dropdown with label / hint / error pattern, leading icon, clear button, and 7 advanced dropdown variants (entity icons, badges, two-line multi-select, vendor, mention, big icon, no-match).
  - `DsTextarea` — multi-line text input with label / hint / error / character counter / clear button; 2 sizes.
- Full TypeScript prop and variant type exports for every Phase 2 component (`Ds<Name>Props`, plus `DsAvatarColor` / `DsAvatarSize` / `DsAvatarVariant` / `DsBadgeType` / `DsSearchFieldClearBehavior` / `DsSearchFieldSize`).
- Per-component AI knowledge base entries under `docs/ai-guidelines/` for the 7 new components.
- `docs/ai-guidelines/index.md` updated to list all 12 components with import paths and Figma element matchers.
- Storybook `Introduction` landing page summarizing the library, install command, and the 12-component inventory.
- Storybook `Pages/User Profile` composed example demonstrating `DsAvatar`, `DsBadge`, `DsChip`, `DsTextarea`, `DsSelect`, `DsSearchField`, and `DsCodeInput` together.
- Explicit Storybook sidebar order (`Introduction → Foundations → Components → Pages`) via `parameters.options.storySort.order`.
- `CHANGELOG.md` (this file) following the Keep a Changelog format.

### Changed

- Bumped `package.json` `version` from `0.1.2` to `0.2.0` (semver minor — new functionality, no breaking changes to Phase 1).
- Extended `src/__tests__/package-distribution.test.ts` to verify all 12 components and their published types are exported from `dist/index.d.ts` and resolve at runtime from `dist/index.js`.
- Extended `tmp/consumer-test/src/App.vue` with a Phase 2 import example to validate the upgrade path.

### Notes

- `DsFilterField` was originally scoped for Phase 2 but deferred to Phase 3 — no Figma spec exists yet (PRD Phase 2 note, 2026-04-12). It was never released, so it is not listed under `Removed`.

## [0.1.2] - 2026-04-05

- Patch release covering `package.json` / lockfile metadata adjustments on top of `0.1.1`. No component or API changes.

## [0.1.1] - 2026-04-05

- Initial public release of the Phase 1 MVP component set: `DsButton`, `DsIcon`, `DsIconButton`, `DsInputText`, `DsLink`.
- PrimeVue Styled Mode preset (`dsPreset` / `dsTheme`) mapping the Figma design tokens (colors, typography, shadows, spacing) for both light and dark themes.
- Storybook hosted on GitHub Pages with `Foundations` (color palette, typography, shadows, spacing, border radius, icons) and `Components` sections.
- AI knowledge base under `docs/ai-guidelines/` for the 5 MVP components plus an inventory index.
- Vite library mode build with ESM output, tree-shaking, and TypeScript declarations; Vue 3 + PrimeVue + `@primeuix/themes` as peer dependencies.
- CI/CD via GitHub Actions: Biome + Vitest + `vite build` on PR; npm publish with provenance on `v*` tag push; Storybook deploy to GitHub Pages on `master`.

[Unreleased]: https://github.com/koval-yurko/desing-system-vue/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/koval-yurko/desing-system-vue/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/koval-yurko/desing-system-vue/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/koval-yurko/desing-system-vue/releases/tag/v0.1.1
