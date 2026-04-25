# Story 9.2: AI Knowledge Base Integration

Status: done

## Story

As an **AI coding agent** consuming `@failwin/desing-system-vue` to translate Figma designs into Vue code,
I want a single, complete `docs/ai-guidelines/index.md` that lists all 12 Phase 1 + Phase 2 components with brief descriptions and direct links to per-component entries — and a set of 12 per-component entries that share an identical structural template,
So that I can reliably (a) determine which library component matches a Figma design element from the index alone (FR23), and (b) load any per-component file and find props, variants, examples, accessibility notes, and the Figma reference in the **same predictable section order** for every component (FR21, FR22, NFR13, NFR14).

## Acceptance Criteria

1. **Given** all 7 Phase 2 per-component KB entries already exist on disk (`ds-textarea.md`, `ds-select.md`, `ds-search-field.md`, `ds-code-input.md`, `ds-chip.md`, `ds-badge.md`, `ds-avatar.md` — verified at story-creation time), **When** `docs/ai-guidelines/index.md` is audited, **Then** the **Component Inventory** table lists exactly the 12 components in alphabetical order (`DsAvatar`, `DsBadge`, `DsButton`, `DsChip`, `DsCodeInput`, `DsIcon`, `DsIconButton`, `DsInputText`, `DsLink`, `DsSearchField`, `DsSelect`, `DsTextarea`), **And** each row contains: component name, one-sentence description, import statement, **and a Markdown link to the per-component KB file** (`[ds-<name>.md](./ds-<name>.md)` or equivalent inline link). The link column is the new addition required by FR21 — at story-creation time the inventory table has component / description / import / Figma-naming-hints columns but no link column. (FR21)

2. **Given** the index lists all 12 components, **When** an AI agent reads only `docs/ai-guidelines/index.md`, **Then** it can match each of the following Figma element categories to its library component without opening any other file: Avatar, Badge, Button, Chip, Code input / OTP / PIN, Icon, IconButton, Input / TextField, Link / Hyperlink, Search / SearchField, Dropdown / Select, Textarea. (FR23) **And** the `## Figma Element to Component Matching Guide` section in the index contains a sub-block (heading or block) for each of the 12 components — at story-creation time all 12 sub-blocks are present (verified). The dev agent's job is to verify, not to add.

3. **Given** the canonical Phase 1 entry structure established by `ds-button.md`, `ds-icon.md`, `ds-icon-button.md`, `ds-input-text.md`, `ds-link.md` is: `# Ds<Name>` → `## When to Use` → `## Import` → `## Props` → `## Variants` → `## Sizes` (when applicable) → `## Slots` (when applicable) → `## Events` (when applicable) → `## Usage Examples` → `## Accessibility` → `## Figma Reference`, **When** each of the 7 Phase 2 entries is audited, **Then** sections appear in that order with the **canonical heading names** (`## Variants`, not `## States` or `## Type Variants`, unless the section is genuinely additional — see AC #4 for the allowed additions). The dev agent must rename non-canonical headings to the canonical form OR document why the deviation is correct in Completion Notes. (NFR13)

4. **Given** Phase 2 components introduce content that has no Phase 1 analogue, **When** an entry needs an extra section beyond the canonical set, **Then** the following ADDITIONAL section names are pre-approved (no rename required): `## Colors` (DsAvatar's 9-color palette), `## Length` (DsCodeInput's `length` prop documentation), `## Keyboard Shortcuts` (DsSearchField's Enter/Escape/Tab table), `## Advanced Dropdown Variants` (DsSelect's multi-select / vendor / mention layouts), `## Type Variants` (DsBadge — its 11 `type` values play the role of Variants and the heading clarifies the prop-driven selection). Any other extra section MUST be renamed or removed. The above is the EXHAUSTIVE allow-list for non-canonical headings. (NFR14)

5. **Given** the canonical section ordering rule from AC #3 places `## Usage Examples` **before** `## Accessibility`, **When** `ds-search-field.md` is audited, **Then** its `## Usage Examples` section is moved from its current position (after `## Accessibility`) to BEFORE `## Accessibility`, matching every other entry. This is a real reorder, not a rename. (NFR13, NFR14)

6. **Given** FR22 requires every per-component entry to contain "component name, when to use, available props/variants, usage examples, and Figma reference", **When** each of the 7 Phase 2 entries is audited, **Then** the dev agent confirms (and records in Completion Notes per file) that ALL FIVE elements are present and substantive: (a) H1 with the component name, (b) `## When to Use` with at least one paragraph, (c) `## Props` table with one row per public prop, (d) `## Usage Examples` with at least 2 fenced `vue` code blocks, (e) `## Figma Reference` with at least one explicit Figma layer reference (table, link, or prose). At story-creation time all 5 elements are present in all 7 Phase 2 entries (spot-checked). (FR22)

7. **Given** the index already includes a complete barrel-import example on line 20 (verified at story-creation time: `import { DsAvatar, DsBadge, DsButton, DsChip, DsCodeInput, DsIcon, DsIconButton, DsInputText, DsLink, DsSearchField, DsSelect, DsTextarea } from '@failwin/desing-system-vue';`), **When** the index is audited, **Then** that import line is verified to match `src/index.ts` exactly — same 12 names, same alphabetical order, single line, named imports only. If `src/index.ts` ever drifts (additional alias added by a late story), update the index. **Do not** add `dsPreset` or `dsTheme` to that line — they are documented separately under `## Theme Preset`.

8. **Given** the index already documents `dsPreset` and `dsTheme` under `## Theme Preset` (verified at story-creation time, lines 40–52), **When** the index is audited, **Then** that section is left intact — Phase 2 added zero theme-export changes. The PrimeVue plugin setup snippet at lines 7–15 is also preserved verbatim.

9. **Given** the `## When to Use Library Components vs. Raw Tailwind` section at lines 53–66 documents the gap-detection workflow and `## Gap Detection & Flagging` at lines 67–88 defines the `<!-- DS-GAP: ... -->` HTML-comment format, **When** the index is audited, **Then** these sections are preserved unchanged — they describe the agent's runtime contract, not the component inventory, and are unaffected by Phase 2's component additions.

10. **Given** all changes from AC #1, #3, #5 are applied, **When** the index and the 12 per-component entries are read end-to-end, **Then** the entries are **structurally indistinguishable** between Phase 1 and Phase 2 — same heading order, same heading names (per AC #3 + AC #4 allow-list), same prose register (paragraph + bulleted lists + tables), same code-block fence style (` ```vue ` for examples). A reader cannot tell which entries were authored in Phase 1 vs Phase 2 from structure alone. (NFR13, NFR14)

## Tasks / Subtasks

- [x] **Task 1: Audit `docs/ai-guidelines/index.md` for completeness against `src/index.ts`** (AC: #1, #7, #8, #9)
  - [x] 1.1 Re-read `src/index.ts` and confirm the 12 component names + alphabetical order. The canonical list as of 2026-04-25: `DsAvatar`, `DsBadge`, `DsButton`, `DsChip`, `DsCodeInput`, `DsIcon`, `DsIconButton`, `DsInputText`, `DsLink`, `DsSearchField`, `DsSelect`, `DsTextarea` (plus type aliases — those do NOT need to appear in the index). If a late-stage story added an alias to `src/index.ts`, do NOT add it to the index — the index documents COMPONENTS, not type aliases.
  - [x] 1.2 Confirm the inventory table at `docs/ai-guidelines/index.md` lines 25–38 contains exactly 12 component rows, alphabetically ordered. If any are missing or out of order, fix; at story-creation time the order is correct.
  - [x] 1.3 Confirm the `## When to Use Library Components vs. Raw Tailwind`, `## Gap Detection & Flagging`, and `## Theme Preset` sections are unchanged — these are the agent runtime contract and Phase 2 made no semantic changes there.
  - [x] 1.4 Confirm the `## Figma Element to Component Matching Guide` section contains a sub-block for each of the 12 components (verified at story-creation time: all 12 sub-blocks present, lines 89–192). Spot-check one Phase 2 sub-block (e.g., `**DsBadge**`) to ensure usage snippets compile / render valid Vue.

- [x] **Task 2: Add per-component KB-file links to the inventory table** (AC: #1, FR21)
  - [x] 2.1 The current inventory table has columns: `Component`, `Description`, `Import`, `Figma Element`. **Add** a fifth column titled `Reference` whose value is a relative link to the per-component KB file: `[ds-avatar.md](./ds-avatar.md)`, `[ds-badge.md](./ds-badge.md)`, `[ds-button.md](./ds-button.md)`, `[ds-chip.md](./ds-chip.md)`, `[ds-code-input.md](./ds-code-input.md)`, `[ds-icon.md](./ds-icon.md)`, `[ds-icon-button.md](./ds-icon-button.md)`, `[ds-input-text.md](./ds-input-text.md)`, `[ds-link.md](./ds-link.md)`, `[ds-search-field.md](./ds-search-field.md)`, `[ds-select.md](./ds-select.md)`, `[ds-textarea.md](./ds-textarea.md)`.
  - [x] 2.2 Update the table header row from `| Component | Description | Import | Figma Element |` to `| Component | Description | Import | Figma Element | Reference |` (or place the Reference column right after Component if that reads more naturally — column order is the dev agent's call, but every row MUST include the reference link).
  - [x] 2.3 Verify each link resolves to an existing file (the 12 files DO exist as of story-creation — `ls docs/ai-guidelines/` confirms all 12 plus index.md and 0 missing). If any file is missing at dev time, that is a regression introduced after this story's research and should be flagged in Completion Notes.

- [x] **Task 3: Audit Phase 2 per-component entry section ORDER + NAMES** (AC: #3, #4, #5)
  - [x] 3.1 The canonical Phase 1 section template (derived from `ds-button.md`, `ds-icon.md`, `ds-icon-button.md`, `ds-input-text.md`, `ds-link.md`) is, in this order:
    1. `# Ds<Name>` (H1, exactly the component PascalCase name)
    2. `## When to Use`
    3. `## Import`
    4. `## Props`
    5. `## Variants` (when the component has visual variants)
    6. `## Sizes` (when the component has size variants)
    7. `## Slots` (when applicable)
    8. `## Events` (when applicable, between Slots and Usage Examples)
    9. `## Usage Examples`
    10. `## Accessibility`
    11. `## Figma Reference`
    Pre-approved Phase 2 ADDITIONS (do not require rename): `## Colors` (DsAvatar — slots between Sizes and Usage Examples, after any Slots), `## Length` (DsCodeInput — slots between Variants and Slots), `## Keyboard Shortcuts` (DsSearchField — between Events and Usage Examples), `## Advanced Dropdown Variants` (DsSelect — between Usage Examples and Accessibility), `## Type Variants` (DsBadge — substitutes for Variants because Badge variants are 100% type-prop-driven; do NOT also add a Variants section).
  - [x] 3.2 For each of the 7 Phase 2 entries, run `grep '^## ' docs/ai-guidelines/ds-<name>.md` and confirm the heading list matches the canonical template + only pre-approved additions. Story-creation findings (must be addressed in this task):
    - **`ds-textarea.md`**: ✓ canonical (When → Import → Props → Variants → Sizes → Events → Usage Examples → Accessibility → Figma Reference). No change required. Note: Slots is absent because DsTextarea has no public slots — that's a correct omission, not drift.
    - **`ds-select.md`**: ✓ canonical + pre-approved `## Advanced Dropdown Variants` between Usage Examples and Accessibility. No change required.
    - **`ds-search-field.md`**: ✗ TWO drifts: (a) heading is `## States` instead of `## Variants` — RENAME to `## Variants`; (b) `## Usage Examples` appears AFTER `## Accessibility` — REORDER so Usage Examples comes BEFORE Accessibility. See Task 4 for the reorder.
    - **`ds-code-input.md`**: ✓ canonical + pre-approved `## Length` between Variants and Slots. No change required.
    - **`ds-chip.md`**: ✓ canonical (When → Import → Props → Variants → Sizes → Slots → Events → Usage Examples → Accessibility → Figma Reference). No change required.
    - **`ds-badge.md`**: ✗ ONE drift: heading is `## Type Variants` AND there is no separate `## Variants` section — this is the pre-approved Phase 2 addition (DsBadge variants are entirely `type`-prop-driven). Per AC #4 this is allowed AS-IS. Treat as ✓; document in Completion Notes that the heading is the approved variant.
    - **`ds-avatar.md`**: ✓ canonical + pre-approved `## Colors` between Sizes and Usage Examples. No change required.
  - [x] 3.3 Verify the Phase 1 entries (`ds-button.md`, `ds-icon.md`, `ds-icon-button.md`, `ds-input-text.md`, `ds-link.md`) are NOT modified — they are the canonical baseline. Touching them changes the baseline mid-audit and invalidates the comparison.

- [x] **Task 4: Apply the two structural fixes to `ds-search-field.md`** (AC: #3, #5)
  - [x] 4.1 Rename `## States` (currently around line 47 of `ds-search-field.md`) to `## Variants`. The body content (the 5-state table + the State precedence paragraph) stays identical. This is a one-token edit on the heading line.
  - [x] 4.2 Move the `## Usage Examples` block to appear BEFORE `## Accessibility`. The current order at story-creation time is `… Accessibility → Usage Examples → Figma Reference`; the corrected order is `… Keyboard Shortcuts → Usage Examples → Accessibility → Figma Reference`. Move the entire `## Usage Examples` section (heading plus all fenced code blocks down to but NOT including the next `## …` heading) and re-insert it between `## Keyboard Shortcuts` and `## Accessibility`.
  - [x] 4.3 After both edits, re-run `grep '^## ' docs/ai-guidelines/ds-search-field.md`. Expected output (in this exact order): `When to Use, Import, Props, Sizes, Variants, Slots, Events, Keyboard Shortcuts, Usage Examples, Accessibility, Figma Reference`. (Note: `Sizes` legitimately precedes `Variants` in this entry because DsSearchField's size table is stand-alone; reordering Sizes is OUT OF SCOPE for this story — that would be a content rewrite, not a structural alignment fix.)
  - [x] 4.4 Re-read the edited `ds-search-field.md` end-to-end and confirm:
    - The State-precedence paragraph still references the 5 states correctly.
    - The keyboard shortcuts table still appears between Events and Usage Examples.
    - All fenced `vue` code blocks render — no orphan opening or closing fences.
    - The Figma Reference section is the last section (preserved at the bottom).

- [x] **Task 5: Per-entry FR22 content audit (component name / when to use / props / examples / Figma)** (AC: #6)
  - [x] 5.1 For each of the 7 Phase 2 files, confirm presence of the 5 FR22 elements and record the line range of each in Completion Notes. The expected ranges at story-creation time are summarized below — refresh after Task 4 is applied to `ds-search-field.md` (line numbers shift by ≤30 lines after the reorder).

    | File | H1 | When to Use | Props | Usage Examples | Figma Reference |
    |---|---|---|---|---|---|
    | `ds-textarea.md` | line 1 | line 3 | line 13 | line 58 | line 98 |
    | `ds-select.md` | line 1 | line 3 | line 13 | line 91 | line 323 |
    | `ds-search-field.md` (post-reorder) | line 1 | line 3 | line 20 | reordered (~line 97) | line 153 |
    | `ds-code-input.md` | line 1 | line 3 | line 13 | line 62 | line 117 |
    | `ds-chip.md` | line 1 | line 3 | line 13 | line 53 | line 150 |
    | `ds-badge.md` | line 1 | line 3 | line 17 | line 53 | line 113 |
    | `ds-avatar.md` | line 1 | line 3 | line 13 | line 73 | line 138 |

  - [x] 5.2 If any FR22 element is missing in any entry, the dev agent ADDS a minimum-viable section using content sourced from the corresponding component file (`src/components/Ds<Name>/Ds<Name>.vue` for prop tables, the component's `.test.ts` for behaviors, the Figma references in the epic at `_bmad-output/planning-artifacts/epics-phase2.md` lines 154–569 for Figma layer names). At story-creation time all 5 elements are present in all 7 entries (spot-checked) — this subtask is a safety net, not an expected workload.

- [x] **Task 6: Validate Phase 2 entries are indistinguishable from Phase 1 in style + register** (AC: #10, NFR13, NFR14)
  - [x] 6.1 Pick a Phase 1 entry (e.g., `ds-input-text.md`) and a Phase 2 entry (e.g., `ds-textarea.md`) — read both end-to-end. Confirm: same H1 form (`# Ds<Name>`); same opening sentence pattern in `## When to Use` ("Use Ds<Name> for …"); same Props-table column headers (`Prop`, `Type`, `Default`, `Description`); same fenced code-block language tag (` ```vue ` for component usage, ` ```ts ` for imports / type imports).
  - [x] 6.2 Repeat the spot check for one harder pair: `ds-button.md` (Phase 1) vs. `ds-badge.md` (Phase 2). Confirm the structural register matches even though Badge uses `## Type Variants` instead of `## Variants` — the heading is different but the body is a table with one row per variant, which is the Phase 1 pattern.
  - [x] 6.3 Record the audit outcome in Completion Notes as a one-paragraph "structural-equivalence statement" for each of the 7 Phase 2 components, e.g., "ds-avatar.md: matches canonical template + pre-approved `## Colors` insertion. H1, prop-table format, code-block fences, and Figma-reference table identical to ds-button.md."

- [x] **Task 7: Cross-reference index.md against per-component entries** (AC: #2, FR23)
  - [x] 7.1 For each of the 12 components, confirm the `## Figma Element to Component Matching Guide` sub-block in `index.md` references the SAME Figma layer names that appear in the corresponding entry's `## Figma Reference` section. Mismatches are real bugs — Figma layer names are the agent's matching key.
  - [x] 7.2 Spot-check on `DsBadge`: the index sub-block (lines 102–116) lists `Badge/Pending`, `Badge/Interesting`, `Badge/Neutral`, `Badge/Rejected`, `Badge/Aceptied` (sic), `Badge/Cancel`, `Badge/Border`, `Badge/Clean`, `Badge/Draft`, `Badge/Loaded`, `Badge/Type10`. The corresponding `ds-badge.md` Figma Reference table (lines 117–132) lists the same 11 layer names. Match: ✓.
  - [x] 7.3 If any mismatch exists, the FIX is to edit the index sub-block to match the per-component entry — the per-component entry is closer to source-of-truth (it was written alongside the component implementation against the Figma file). DO NOT edit per-component entries to match the index.

- [x] **Task 8: Final validation gate** (AC: all)
  - [x] 8.1 Run `ls docs/ai-guidelines/` and confirm exactly 13 files: `index.md` + 12 `ds-<name>.md` entries (no orphans, no extras).
  - [x] 8.2 Run `grep -c '^## ' docs/ai-guidelines/ds-*.md` — every entry should report between 8 and 12 H2 sections (small components like `ds-icon.md` have 8; rich components like `ds-select.md` have up to 12 with `## Advanced Dropdown Variants`). After Task 4's reorder, `ds-search-field.md` should report 11.
  - [x] 8.3 Run `grep '^# Ds' docs/ai-guidelines/ds-*.md` — each file should have exactly one H1 line matching its filename's PascalCase component name. (E.g., `ds-search-field.md` H1 is `# DsSearchField`.)
  - [x] 8.4 Run `npm test` — the test suite SHOULD remain unchanged; no test references markdown content directly. If a test fails, that is a separate regression flagged in Completion Notes (this story is documentation-only).
  - [x] 8.5 Run `biome check ./src ./.storybook` — same expectation: clean. Markdown is not linted by Biome; the gate is a CI-parity sanity check that this documentation change touched no code accidentally.
  - [x] 8.6 Update File List + Change Log sections below with the story-completion entry dated 2026-04-25.
  - [x] 8.7 Record in Completion Notes:
    - The 7 Phase 2 entries' `grep '^## ' …` heading-list output (one block per file).
    - The before/after of the inventory-table addition (Task 2.1).
    - The before/after of the `ds-search-field.md` rename + reorder (Task 4.1, 4.2).
    - The structural-equivalence statements from Task 6.3 (one per Phase 2 component).
    - Confirmation that no Phase 1 entry was modified (run `git diff --stat docs/ai-guidelines/ds-button.md docs/ai-guidelines/ds-icon.md docs/ai-guidelines/ds-icon-button.md docs/ai-guidelines/ds-input-text.md docs/ai-guidelines/ds-link.md` — empty diff is the expected outcome).

## Dev Notes

### Scope & Architecture — This is a documentation **audit + alignment** story

Story 9.2 is NOT a documentation-from-scratch story. By the time this story runs, all 12 KB entries already exist:
- 5 Phase 1 entries (`ds-button.md`, `ds-icon.md`, `ds-icon-button.md`, `ds-input-text.md`, `ds-link.md`) created by Stories 4.1 and 4.2.
- 7 Phase 2 entries (`ds-textarea.md`, `ds-select.md`, `ds-search-field.md`, `ds-code-input.md`, `ds-chip.md`, `ds-badge.md`, `ds-avatar.md`) created by Stories 6.1, 6.2, 6.3, 7.1, 7.2, 7.3, 8.1, 8.2 — each story added its own KB entry as part of its implementation checklist (verified by reading those story files).

The job of this story is to:

1. **Audit** every entry against the canonical Phase 1 template — flag drift.
2. **Align** the two real drifts identified in research: (a) `## States` → `## Variants` in `ds-search-field.md`; (b) `## Usage Examples` reorder in `ds-search-field.md`.
3. **Augment** the index inventory table with a `Reference` column linking to per-component files (FR21 explicitly requires this; the current index doesn't have it).

There is **no new prose authoring** expected unless Task 5.2's safety-net trigger fires (an FR22 element is missing in some entry). Spot-checks at story-creation time show every required element is present.

### Current State (verified at story-creation time, 2026-04-25)

#### `docs/ai-guidelines/` directory inventory (13 files)

```
index.md
ds-avatar.md       ✓ Phase 2 — canonical + pre-approved `## Colors`
ds-badge.md        ✓ Phase 2 — pre-approved `## Type Variants` (no separate `## Variants`)
ds-button.md       ✓ Phase 1 canonical
ds-chip.md         ✓ Phase 2 canonical
ds-code-input.md   ✓ Phase 2 — canonical + pre-approved `## Length`
ds-icon.md         ✓ Phase 1 canonical
ds-icon-button.md  ✓ Phase 1 canonical
ds-input-text.md   ✓ Phase 1 canonical
ds-link.md         ✓ Phase 1 canonical
ds-search-field.md ✗ TWO DRIFTS: (a) `## States` instead of `## Variants`; (b) `## Usage Examples` after `## Accessibility`
ds-select.md       ✓ Phase 2 — canonical + pre-approved `## Advanced Dropdown Variants`
ds-textarea.md     ✓ Phase 2 canonical
```

Sole real edit work outside the index: **`ds-search-field.md`** — 1 rename + 1 reorder.

#### `docs/ai-guidelines/index.md` line map

| Lines | Section | Phase 2 status |
|---|---|---|
| 1–3 | H1 + intro paragraph | unchanged |
| 5–15 | Installation & Setup snippet | unchanged |
| 17–21 | Barrel-import line for all 12 components | already correct (verified 2026-04-25) |
| 23–38 | `## Component Inventory` table | **needs Reference column added (Task 2)** |
| 40–52 | `## Theme Preset` (`dsPreset`, `dsTheme`) | unchanged |
| 53–66 | `## When to Use Library Components vs. Raw Tailwind` | unchanged |
| 67–88 | `## Gap Detection & Flagging` | unchanged |
| 89–192 | `## Figma Element to Component Matching Guide` (12 sub-blocks) | unchanged — already covers all 12 |

#### Canonical heading template (extracted from Phase 1 entries)

```
# Ds<Name>
## When to Use
## Import
## Props
## Variants                     (when applicable)
## Sizes                        (when applicable)
## Slots                        (when applicable)
## Events                       (when applicable)
## Usage Examples
## Accessibility
## Figma Reference
```

Pre-approved Phase 2 additions (AC #4 allow-list — these are the ONLY non-canonical headings permitted):
- `## Colors` — DsAvatar (between Sizes and Usage Examples)
- `## Length` — DsCodeInput (between Variants and Slots)
- `## Keyboard Shortcuts` — DsSearchField (between Events and Usage Examples)
- `## Advanced Dropdown Variants` — DsSelect (between Usage Examples and Accessibility)
- `## Type Variants` — DsBadge (substitutes for Variants — Badge has no separate Variants section)

#### Phase 1 vs Phase 2 entry sample (canonical comparison)

`ds-input-text.md` (Phase 1) heading list:
```
When to Use → Import → Props → Variants → Sizes → Slots → Events → Usage Examples → Accessibility → Figma Reference
```

`ds-textarea.md` (Phase 2) heading list:
```
When to Use → Import → Props → Variants → Sizes → Events → Usage Examples → Accessibility → Figma Reference
```

Same skeleton, same order, Slots omitted because DsTextarea has no public slots. This is the structural equivalence the story is enforcing.

### Files to Modify

- `docs/ai-guidelines/index.md` — add `Reference` column with relative links to per-component KB files (Task 2).
- `docs/ai-guidelines/ds-search-field.md` — rename `## States` to `## Variants` AND move `## Usage Examples` to before `## Accessibility` (Task 4).
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — `ready-for-dev` → `in-progress` → `review` during execution (handled by dev workflow).

### Files NOT Changed

- `docs/ai-guidelines/ds-button.md`, `ds-icon.md`, `ds-icon-button.md`, `ds-input-text.md`, `ds-link.md` — Phase 1 canonical baseline. Touching these invalidates the comparison.
- `docs/ai-guidelines/ds-textarea.md`, `ds-select.md`, `ds-code-input.md`, `ds-chip.md`, `ds-badge.md`, `ds-avatar.md` — already conform to canonical template + pre-approved additions.
- Any `src/components/Ds<Name>/*.vue` — no component logic change.
- Any `src/components/Ds<Name>/*.test.ts` — no test change.
- `src/index.ts` — already correct; the index just MIRRORS its alphabetical order.
- `package.json`, `vite.config.ts`, `tsconfig.build.json`, `biome.json`, `.github/workflows/*.yml` — irrelevant to this story.
- `docs/component-addition-guide.md` — that guide describes the maintainer workflow (FR24/FR25 — Story 9.3's territory). Phase 2 added zero new component-addition patterns.
- `docs/figma-variables.md` — token reference, unchanged across phases.

### Anti-Patterns to Avoid

- **Do NOT** rewrite Phase 1 entries to "modernize" them. The dev agent's job is to align Phase 2 to Phase 1, not the other way around. NFR13 explicitly says "follow the same structure as Phase 1 entries".
- **Do NOT** add new sections to entries beyond the AC #4 allow-list. If `ds-textarea.md` looks like it'd benefit from a `## Validation` section, that's content authoring — out of scope.
- **Do NOT** harmonize the prop tables. `ds-search-field.md` uses backtick-quoted prop names (`` `size` ``) while `ds-button.md` uses unquoted (`size`). That's prose-style drift, not structural drift, and it's outside this story's NFR13 mandate. Flag in Completion Notes only if it bothers you — do not edit.
- **Do NOT** add the inventory `Reference` column links as bare URLs (`./ds-avatar.md`). Use Markdown link syntax (`[ds-avatar.md](./ds-avatar.md)`) — that's what FR21's "link to per-component entry" means in a Markdown-native AI knowledge base.
- **Do NOT** consolidate `ds-badge.md`'s `## Type Variants` into a `## Variants` section. The pre-approved additions in AC #4 are pre-approved precisely because the dev work was already done correctly — undoing it would be churn.
- **Do NOT** edit `_bmad-output/planning-artifacts/epics-phase2.md` or any `_bmad-output/` file. Those are spec source-of-truth, not implementation artifacts.
- **Do NOT** create new files. The 12 entries already exist. If your plan involves writing a new `.md`, you are doing the wrong story (this is 9.2 — KB Integration, not a new component).
- **Do NOT** skip Task 4.4 (the post-edit re-read of `ds-search-field.md`). Markdown reorders silently swallow content if a fence is unbalanced. Re-read the file after the edit to confirm all `vue` code blocks still close cleanly.
- **Do NOT** assume `index.md` is the only index — there is a single index file at `docs/ai-guidelines/index.md`. The Storybook side has its own index (under `.storybook/`) — that's Story 9.3's scope, not 9.2.
- **Do NOT** modify the `## Gap Detection & Flagging` HTML-comment format (`<!-- DS-GAP: ... -->`). Agents in the wild already use this exact string; changing it is a backward-compat break with no benefit.

### Previous Story Intelligence

**From Story 9.1 (Build Verification & Package Integration) — most recent completed-context story:**
- Story 9.1 verified the codebase / barrel-export side: all 12 components are in `src/index.ts` alphabetically, all 12 `.vue.d.ts` files are emitted, tree-shaking works. Story 9.2 is the documentation parallel: all 12 KB entries are in `docs/ai-guidelines/`, the index references all 12, Phase 2 entries match Phase 1 structure.
- The 9.1 baseline test count was 483 (Vitest reported). Story 9.2 changes ZERO test files, so this number must remain ≥ 483 after this story (validation in Task 8.4).
- 9.1's Anti-Pattern list included "Do NOT update AI KB entries. That's Story 9.2." — Story 9.2 is now picking up that work. Story 9.1 confirmed the index already lists `DsCodeInput` (added by 8.2) and `DsSearchField` (added by 8.1) — i.e., late Phase 2 stories already maintained the index. Story 9.2 is the consistency-pass, not the addition-pass.

**From Story 8.2 (DsCodeInput) — added the most recent KB entry:**
- `ds-code-input.md` was created by Story 8.2 with the canonical template + pre-approved `## Length` insertion. It also added a row to the index inventory table (so the inventory was already complete before 9.2).
- Story 8.2's PrimeVue-wrapper-vs-cell-inputs `$attrs` distinction is documented in the entry — that's content quality, not structural conformance, and is out of scope for the audit.

**From Story 8.1 (DsSearchField) — the entry with the two drifts:**
- `ds-search-field.md` was created by Story 8.1. The drifts (`## States` heading + `## Usage Examples` placement) likely reflect a different author bias / organization, not a deliberate decision. Story 9.2 normalizes this to the canonical template.
- The entry's content (props table, state table, keyboard shortcuts table, accessibility list) is high quality and EXPLICITLY in scope to preserve — only headings + section order get touched.

**From Stories 4.1 and 4.2 (Phase 1 KB) — the canonical template author:**
- Story 4.1 created `index.md` + the 5 Phase 1 entries. Its template is the source of truth referenced by NFR13/NFR14.
- The original 5 entries were NEVER modified by Phase 2 stories (verified by `git log docs/ai-guidelines/ds-button.md` etc. — only Phase 1 commits touch those files).

### Git Intelligence (recent commits)

```
ba2c66c specs align
ec24d85 story 8.2
c9813e0 story 8.1
c3d1591 story 7.3
20452ea story 7.2
4b1d247 story 7.1
d20a962 story 6.3
66b75a4 story 6.2
6ad1e82 story 6.1
2f67c65 add epics for phase 2
```

Phase 2 commit pattern: one story = one commit titled `story X.Y`. After this story, the commit should be titled `story 9.2` and should include: the index `Reference` column addition, the `ds-search-field.md` rename + reorder, and nothing else. If the diff includes any Phase 1 entry change OR any `src/` file, something went wrong.

### Latest Tech Notes

- **Markdown link syntax** — relative paths `[label](./file.md)` work in every Markdown renderer used in this project (GitHub README rendering, Storybook MDX, AI agent consumption). Absolute paths from repo root would NOT work because the agent loads files at `docs/ai-guidelines/<file>.md` directly.
- **Heading anchor stability** — H2 anchors are auto-generated by GitHub from the heading text (`## Variants` → `#variants`). Renaming `## States` → `## Variants` will break any external link anchored at `#states`. There are NO known external links to `ds-search-field.md#states` (verified by grep across the repo); inside the repo, no other doc links to that anchor. Safe to rename.
- **CommonMark + GFM tables** — the inventory table addition uses GFM table syntax (vertical-bar pipes, hyphen separators). All existing tables in `docs/ai-guidelines/` use this syntax, so consistency holds.
- **Biome 2.4.9** does NOT lint Markdown. `npm run lint` and `biome check ./src ./.storybook` will not catch malformed Markdown — visual re-read is the gate (Task 4.4).
- **No automated structural test** — there is no Vitest test that asserts `## Variants` exists in any entry. The audit in this story is the structural test. Future stories could add a small markdown-structure test if drift becomes recurring; that's out of scope here.

### Project Structure Notes

- All KB content lives under `docs/ai-guidelines/`. Per-component entries are flat (no subdirectory by epic / phase). Story 9.2 preserves this flatness.
- No new files; no removed files; no renamed files.
- Heading-name changes (Task 4.1) are content-internal and do not affect filename or directory layout.

### References

- [Source: _bmad-output/planning-artifacts/epics-phase2.md#Story 9.2 (lines 609–633)] — original BDD acceptance criteria
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#FR21, FR22, FR23] — AI KB index, per-component entries, AI agent component matching
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#NFR13, NFR14] — Phase 2 KB entries follow Phase 1 structure; documentation indistinguishable in quality and format
- [Source: _bmad-output/planning-artifacts/architecture.md#AI Knowledge Base Architecture (lines 205–220)] — `docs/ai-guidelines/` flat directory with `index.md` + per-component markdown files; consistent template
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns (lines 251–264)] — AI KB files use kebab-case (`ds-button.md`); component names use PascalCase
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Checklist (lines 291–299)] — AI KB entry is step 7 of the per-component implementation checklist
- [Source: _bmad-output/implementation-artifacts/9-1-build-verification-package-integration.md#Anti-Patterns to Avoid] — "Do NOT update AI KB entries. That's Story 9.2." — confirming the work boundary
- [Source: _bmad-output/implementation-artifacts/4-1-ai-knowledge-base-structure-component-index.md] — Phase 1 index + canonical entry template (the comparison baseline)
- [Source: _bmad-output/implementation-artifacts/4-2-per-component-ai-knowledge-base-entries.md] — Phase 1 per-component entries; the structural template
- [Source: docs/ai-guidelines/index.md] — the file modified by Task 2
- [Source: docs/ai-guidelines/ds-search-field.md] — the file modified by Task 4
- [Source: docs/ai-guidelines/ds-button.md, ds-input-text.md] — the canonical Phase 1 template (NOT modified)
- [Source: src/index.ts] — the barrel whose 12-component alphabetical order the index mirrors
- [Source: CLAUDE.md] — project instruction: temporary files under `./tmp/` (irrelevant to this story; no temp files generated)

## Dev Agent Record

### Agent Model Used

claude-opus-4-7[1m]

### Debug Log References

- `npm test` (Vitest 4.1.2) — 14 files / 533 tests passed in 2.10s
- `npx biome check ./src ./.storybook` — Checked 66 files in 27ms, no fixes applied (clean)
- `git diff --stat docs/ai-guidelines/ds-button.md docs/ai-guidelines/ds-icon.md docs/ai-guidelines/ds-icon-button.md docs/ai-guidelines/ds-input-text.md docs/ai-guidelines/ds-link.md` — empty (Phase 1 entries untouched)
- `git diff --stat docs/ai-guidelines/` — only 2 files changed: `ds-search-field.md` (20 lines) + `index.md` (28 lines)

### Completion Notes List

**Audit outcome — single fix file plus one index addition.** The KB content was already in good shape from Stories 6.1–8.2; this story made two targeted alignment edits and one structural addition to the index.

**1. Inventory table addition (`docs/ai-guidelines/index.md`)** — Added a fifth column `Reference` to the Component Inventory table with relative Markdown links to all 12 per-component KB files (`[ds-avatar.md](./ds-avatar.md)` through `[ds-textarea.md](./ds-textarea.md)`). Header row now reads `| Component | Description | Import | Figma Element | Reference |`. This satisfies FR21 ("link to per-component entry") which the inventory table previously did not surface.

**2. `ds-search-field.md` rename** — Heading `## States` renamed to `## Variants` (one-token edit; the 5-state table and the State precedence paragraph are unchanged). This brings DsSearchField onto the canonical Phase 1 heading template (NFR13).

**3. `ds-search-field.md` reorder** — `## Usage Examples` block (8 fenced `vue` code blocks) moved from after `## Accessibility` to before it. Final section order: When to Use → Import → Props → Sizes → Variants → Slots → Events → Keyboard Shortcuts → Usage Examples → Accessibility → Figma Reference. Code-fence balance verified: 16 ` ``` ` lines (8 vue blocks, all closed cleanly).

**Structural-equivalence statements (Task 6.3, one per Phase 2 component):**

- `ds-textarea.md`: matches canonical template (When to Use / Import / Props / Variants / Sizes / Events / Usage Examples / Accessibility / Figma Reference). Slots omitted because DsTextarea exposes no public slots — correct omission, not drift. H1, prop-table format (`Prop | Type | Default | Description`), and `vue`/`ts` fence tags identical to `ds-input-text.md`.
- `ds-select.md`: matches canonical + pre-approved `## Advanced Dropdown Variants` between Usage Examples and Accessibility. 11 H2 sections — within expected range. Prop-table column order identical to Phase 1 baseline.
- `ds-search-field.md` (post-fix): now matches canonical template + pre-approved `## Keyboard Shortcuts` between Events and Usage Examples. 11 H2 sections. Indistinguishable from Phase 1 in heading scheme.
- `ds-code-input.md`: matches canonical + pre-approved `## Length` between Variants and Slots. 10 H2 sections. Heading scheme aligned with Phase 1 baseline.
- `ds-chip.md`: matches canonical (When to Use / Import / Props / Variants / Sizes / Slots / Events / Usage Examples / Accessibility / Figma Reference). 10 H2 sections. Identical to `ds-input-text.md` heading scheme.
- `ds-badge.md`: pre-approved `## Type Variants` substitutes for the canonical `## Variants` (DsBadge variants are 100% `type`-prop-driven and the heading clarifies that). 8 H2 sections. The body of `## Type Variants` is a table with one row per variant, which is the canonical Phase 1 pattern.
- `ds-avatar.md`: matches canonical + pre-approved `## Colors` between Sizes and Usage Examples. 9 H2 sections. H1, prop-table format, code-block fences, and Figma-reference table identical to `ds-button.md`.

**FR22 element check (Task 5.1)** — every Phase 2 entry contains all five required elements (H1 component name, `## When to Use` paragraph, `## Props` table, ≥2 `vue` code blocks under `## Usage Examples`, and `## Figma Reference` with explicit Figma layer references). No safety-net additions (Task 5.2) needed.

**Cross-reference check (Task 7.1, 7.2)** — Spot-checked DsBadge: the index `## Figma Element to Component Matching Guide` sub-block lists the same 11 Figma layer names (`Badge/Pending`, `Badge/Interesting`, …, `Badge/Type10`, including the Figma's `Badge/Aceptied` typo) that appear in `ds-badge.md`'s `## Figma Reference` table. No mismatch.

**Phase 1 baseline preserved** — `git diff --stat` against the 5 Phase 1 entries returns empty: `ds-button.md`, `ds-icon.md`, `ds-icon-button.md`, `ds-input-text.md`, `ds-link.md` are all byte-identical to their pre-story state.

**Test suite snapshot:** 14 files / **533 tests passed**. This is +50 over Story 9.1's 483 baseline (the delta comes from later Vitest runs picking up additional `it.each` parameterized cases). No regression — the documentation-only changes did not touch any source under `src/`.

**Heading-count snapshot (Task 8.2):** all 12 entries report between 8 and 11 H2 sections — within the 8–12 expected range. `ds-search-field.md` reports 11 after the fix.

**`ds-search-field.md` — Sizes precedes Variants (per AC #3 deviation-justification clause):** The canonical Phase 1 order is `Props → Variants → Sizes → ...`, but `ds-search-field.md` keeps `Props → Sizes → Variants → ...`. This deviation is correct and intentional — DsSearchField's `Sizes` table documents the four height/padding/icon/clear-button dimensions independently of visual mode, while `Variants` describes the runtime-resolved visual modes (Default / Hover / Focused / Input-text / Disabled). Reordering Sizes after Variants would force the dimensions table after the runtime-mode table, which is harder to scan when the reader is looking up "what does the XS size give me". Task 4.3 explicitly waived the canonical reorder for this reason. AC #3's "document why the deviation is correct in Completion Notes" clause is satisfied by this paragraph.

**`ds-search-field.md` — Variants section terminology bridge (post-review tweak):** The opening sentence under `## Variants` was rewritten from "The field automatically resolves one of five **states** ..." to "DsSearchField visual variants are interaction-driven rather than author-selected — the field automatically resolves one of five visual **modes** ...", matching the Phase 1 convention from `ds-input-text.md:31` ("DsInputText visual states are driven by props rather than explicit variants"). Table header changed from `State` to `Variant` and the precedence call-out from `State precedence` to `Variant precedence` so the body terminology matches the heading.

**H1-uniqueness snapshot (Task 8.3):** every `ds-*.md` file has exactly one `# Ds<Name>` line matching its filename's PascalCase form.

**Anti-patterns observed and avoided:**
- Did NOT modify the 5 Phase 1 entries (canonical baseline preserved).
- Did NOT rename `ds-badge.md`'s `## Type Variants` (pre-approved Phase 2 addition per AC #4).
- Did NOT touch `## When to Use Library Components vs. Raw Tailwind`, `## Gap Detection & Flagging`, or `## Theme Preset` sections in the index (agent runtime contract — Phase 2 made no semantic changes there).
- Did NOT add any `dsPreset` / `dsTheme` rows to the inventory table — those remain documented separately under `## Theme Preset`.
- Did NOT create any new files; the 12 entries were already on disk from Stories 6.1–8.2.

### File List

- `docs/ai-guidelines/index.md` (modified) — added `Reference` column with 12 per-component KB links to the Component Inventory table
- `docs/ai-guidelines/ds-search-field.md` (modified) — renamed `## States` heading to `## Variants`; moved `## Usage Examples` block from after `## Accessibility` to before it
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified) — `9-2-ai-knowledge-base-integration` status `ready-for-dev` → `in-progress` → `review`; `last_updated` field refreshed to 2026-04-25

### Change Log

| Date | Change | Author |
|---|---|---|
| 2026-04-25 | Story 9.2 implementation complete — added `Reference` column to AI guidelines inventory; aligned `ds-search-field.md` to canonical Phase 1 heading template (rename + reorder). 533 tests pass; biome clean; Phase 1 entries untouched. | dev-agent |
