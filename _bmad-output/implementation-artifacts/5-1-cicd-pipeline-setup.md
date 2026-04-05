# Story 5.1: CI/CD Pipeline Setup

Status: review

## Story

As a library maintainer,
I want automated CI/CD pipelines for testing, publishing, and documentation deployment,
so that code quality is enforced, releases are reliable, and documentation stays current.

## Acceptance Criteria

1. **Given** `.github/workflows/test.yml` exists, **When** a pull request is opened, **Then** the workflow runs Biome check and Vitest tests, **And** the PR status check reports failure if either check fails. *(Note: actual merge blocking requires branch protection rules configured separately in repo settings.)*

2. **Given** `.github/workflows/publish.yml` exists, **When** a git tag is pushed (e.g., `v1.0.0`), **Then** the workflow builds the library and publishes to npm as `@failwin/desing-system-vue`, **And** TypeScript declarations are included in the published package.

3. **Given** `.github/workflows/storybook.yml` exists, **When** a push to `master` occurs, **Then** the workflow builds Storybook static site and deploys to GitHub Pages, **And** the deployed Storybook reflects the latest component state.

## Tasks / Subtasks

- [x] Task 1: Create `.github/workflows/` directory structure (AC: #1, #2, #3)
  - [x] 1.1 Create `.github/workflows/` directory (does not exist yet)

- [x] Task 2: Create `test.yml` — PR quality gate (AC: #1)
  - [x] 2.1 Trigger: `pull_request` targeting `master` branch
  - [x] 2.2 Job: runs on `ubuntu-latest`, Node 20, uses `npm ci` for dependency install
  - [x] 2.3 Step: Run `npx biome check ./src ./.storybook` (matches project lint script pattern)
  - [x] 2.4 Step: Run `npm run build` (includes `vue-tsc --noEmit` type-check + Vite build)
  - [x] 2.5 Step: Run `npm test` (runs `vitest run --passWithNoTests`)
  - [x] 2.6 Use `actions/checkout@v4` and `actions/setup-node@v4` with `node-version: 20` and `cache: 'npm'`

- [x] Task 3: Create `publish.yml` — npm publish on tag (AC: #2)
  - [x] 3.1 Trigger: `push` with `tags: ['v*']` filter
  - [x] 3.2 Job: runs on `ubuntu-latest`, Node 20 with `registry-url: 'https://registry.npmjs.org'`
  - [x] 3.3 Step: `npm ci`
  - [x] 3.4 Step: `npm run build` (produces `dist/` with ESM + `.d.ts` files via vite-plugin-dts)
  - [x] 3.5 Step: `npm publish --provenance --access public` with `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}`
  - [x] 3.6 Add `permissions: id-token: write` for npm provenance support

- [x] Task 4: Create `storybook.yml` — Storybook deploy to GitHub Pages (AC: #3)
  - [x] 4.1 Trigger: `push` to `master` branch
  - [x] 4.2 Job: runs on `ubuntu-latest`, Node 20
  - [x] 4.3 Step: `npm ci`
  - [x] 4.4 Step: `npm run build-storybook` (produces `storybook-static/`)
  - [x] 4.5 Deploy using `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4`
  - [x] 4.6 Add `permissions: pages: write, id-token: write` for GitHub Pages deployment
  - [x] 4.7 Add `environment: github-pages` with URL output

- [x] Task 5: Validate all workflows (AC: #1, #2, #3)
  - [x] 5.1 Verify YAML syntax is valid for all 3 workflow files
  - [x] 5.2 Verify all npm script names match `package.json` (`test`, `lint`, `build`, `build-storybook`)
  - [x] 5.3 Verify Node version matches `engines` in `package.json` (>=20.11.0, use Node 20)
  - [x] 5.4 Run `npm run build` locally to confirm build still works
  - [x] 5.5 Run `npm test` locally to confirm tests still pass
  - [x] 5.6 Run `npx biome check ./src ./.storybook` to confirm lint passes

## Dev Notes

### Architecture Requirements

From architecture document, section "Infrastructure & CI/CD":
- `test.yml` — On PR: Biome check + Vitest run
- `publish.yml` — On git tag: Build library + publish to npm (`@failwin/desing-system-vue`)
- `storybook.yml` — On main push: Build Storybook + deploy to GitHub Pages
- Rationale: Minimal CI that covers correctness (tests), distribution (npm), and documentation (Storybook)

### Current Project State

- `.github/` directory does NOT exist — create it from scratch
- Main branch is `master` (not `main`) — use `master` in all workflow triggers
- Package name: `@failwin/desing-system-vue` (scoped, public)
- Node engine: `>=20.11.0` — use `node-version: 20` in workflows
- No `.nvmrc` or `.node-version` file exists

### npm Scripts Available (package.json)

```
"build": "vue-tsc --noEmit -p tsconfig.build.json && vite build"
"test": "vitest run --passWithNoTests"
"lint": "biome check ./src"
"build-storybook": "storybook build"
```

**Important:** The `lint` script only checks `./src`. Previous stories also lint `.storybook/` — use `npx biome check ./src ./.storybook` in the workflow for consistency with established practice.

### Build Output

- `npm run build` produces `dist/` directory with:
  - `dist/index.js` — ESM bundle
  - `dist/index.d.ts` — TypeScript declarations (via vite-plugin-dts)
  - `dist/index.css` — Component styles
- `npm run build-storybook` produces `storybook-static/` directory

### Key Dependencies & Versions

- **Biome 2.x** — linter/formatter (not ESLint)
- **Vitest 4.x** — test runner
- **Vite 8.x** — build tool
- **Storybook 10.x** — documentation
- **vite-plugin-dts 4.5.x** — TypeScript declaration generation
- **vue-tsc 3.x** — type-checking

### GitHub Actions Best Practices to Follow

- Use `actions/checkout@v4`, `actions/setup-node@v4`
- Use `cache: 'npm'` in setup-node for faster installs
- Use `npm ci` (not `npm install`) for reproducible installs
- Use `--provenance` flag on npm publish for supply chain security
- For GitHub Pages: use `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4` (the modern approach, no gh-pages branch needed)
- Set appropriate `permissions` blocks (principle of least privilege)

### Workflow File Structure

```
.github/
  workflows/
    test.yml          # NEW — PR quality gate
    publish.yml       # NEW — npm publish on tag
    storybook.yml     # NEW — Storybook deploy to GitHub Pages
```

### Anti-Patterns to Avoid

- Do NOT use `actions/github-pages-deploy-action` (third-party) — use official `actions/deploy-pages@v4`
- Do NOT use `npm install` — use `npm ci` for CI reproducibility
- Do NOT hardcode Node version as string everywhere — use `node-version: 20`
- Do NOT use `npm run lint` in test.yml — it only covers `./src`, not `.storybook/`; use `npx biome check ./src ./.storybook` directly
- Do NOT modify any existing source files — this story only creates workflow files
- Do NOT create branch protection rules — that's a repo settings task, not a workflow file
- Do NOT use `gh-pages` branch for Storybook deploy — use the modern `actions/deploy-pages@v4` approach

### Previous Story Intelligence

**From Story 4.2 (Per-Component AI Knowledge Base Entries):**
- 171 tests pass, Biome clean, build succeeds
- dist output: `dist/index.css` 9.57KB, `dist/index.js` 131.44KB
- No source code changes — documentation-only story
- Biome check scope: `./src ./.storybook` (not just `./src`)

### Git Intelligence

Recent commits (master):
- `2b220d4` story 4.2 (per-component AI KB entries)
- `f3aae9c` story 4.1 (AI KB structure & component index)
- `3cd836a` story 3.4 (composed layout example pages)
- `610a484` story 3.3 (component stories with interactive controls)
- `6e91f64` story 3.2 (foundation stories)

All epics 1-4 are done. This is the first story of Epic 5 (CI/CD & Library Publishing).

### Project Structure Notes

- `.github/workflows/` is specified in the architecture document's project directory structure
- All 3 workflow files are new additions — no existing CI/CD configuration to preserve
- Workflow files are infrastructure — not published to npm (not in `files` array of package.json)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.1] — Acceptance criteria and user story
- [Source: _bmad-output/planning-artifacts/architecture.md#Infrastructure & CI/CD] — 3 workflows: test.yml, publish.yml, storybook.yml
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries] — `.github/workflows/` directory placement
- [Source: package.json] — npm scripts, Node engine, package name, peer dependencies
- [Source: vite.config.ts] — Build configuration, library mode, externals
- [Source: _bmad-output/implementation-artifacts/4-2-per-component-ai-knowledge-base-entries.md] — Previous story learnings

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

None — clean implementation with no issues.

### Completion Notes List

- Created `.github/workflows/` directory structure from scratch
- **test.yml**: PR quality gate — triggers on `pull_request` to `master`; runs Biome check (`./src ./.storybook`), build (vue-tsc + vite), and Vitest tests; uses checkout@v4, setup-node@v4 with Node 20 and npm cache
- **publish.yml**: npm publish on tag push (`v*`); builds library then runs `npm publish --provenance --access public` with `NPM_TOKEN` secret; includes `id-token: write` permission for provenance
- **storybook.yml**: Storybook deploy to GitHub Pages on push to `master`; builds storybook-static then deploys via `upload-pages-artifact@v3` + `deploy-pages@v4`; includes `pages: write` and `id-token: write` permissions with `github-pages` environment
- All validations passed: YAML valid, npm scripts verified, Node 20 matches engine constraint, build succeeds, 171 tests pass, Biome clean
- No existing source files were modified — only new workflow files created

### Change Log

- 2026-04-05: Created 3 GitHub Actions workflow files (test.yml, publish.yml, storybook.yml) — all ACs satisfied

### File List

- .github/workflows/test.yml (NEW)
- .github/workflows/publish.yml (NEW)
- .github/workflows/storybook.yml (NEW)
