import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const ROOT = resolve(import.meta.dirname, '..', '..');
const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf-8'));
const distDir = resolve(ROOT, 'dist');
const distIndexJs = resolve(distDir, 'index.js');
const distIndexDts = resolve(distDir, 'index.d.ts');
const srcIndexTs = resolve(ROOT, 'src', 'index.ts');

const wordBoundary = (identifier: string) =>
  new RegExp(`(?:^|[^A-Za-z0-9_$])${identifier}(?![A-Za-z0-9_$])`);

describe('package.json distribution fields', () => {
  it('has correct package name', () => {
    expect(pkg.name).toBe('@failwin/desing-system-vue');
  });

  it('has exports field with correct import and types paths', () => {
    expect(pkg.exports['.']).toEqual({
      import: './dist/index.js',
      types: './dist/index.d.ts',
    });
  });

  it('has types field pointing to dist declarations', () => {
    expect(pkg.types).toBe('./dist/index.d.ts');
  });

  it('has correct peerDependencies', () => {
    expect(pkg.peerDependencies).toHaveProperty('vue');
    expect(pkg.peerDependencies).toHaveProperty('primevue');
    expect(pkg.peerDependencies).toHaveProperty('@primeuix/themes');
    expect(pkg.peerDependencies.vue).toMatch(/^\^3/);
    expect(pkg.peerDependencies.primevue).toMatch(/^\^4/);
    expect(pkg.peerDependencies['@primeuix/themes']).toMatch(/^\^2/);
  });

  it('has files field set to ["dist"]', () => {
    expect(pkg.files).toEqual(['dist']);
  });

  it('has main and module fields for bundler compatibility', () => {
    expect(pkg.main).toBe('./dist/index.js');
    expect(pkg.module).toBe('./dist/index.js');
  });

  it('has CSS export for style.css', () => {
    expect(pkg.exports['./style.css']).toBe('./dist/index.css');
  });
});

describe('dist output files', () => {
  let distIndexJsContent = '';

  beforeAll(() => {
    if (!existsSync(distIndexJs) || !existsSync(distIndexDts)) {
      throw new Error(
        'dist/ is missing required artifacts. Run "npm run build" before running this test suite.',
      );
    }
    if (statSync(srcIndexTs).mtimeMs > statSync(distIndexJs).mtimeMs) {
      throw new Error(
        'dist/ is stale (src/index.ts is newer than dist/index.js). Run "npm run build" to refresh.',
      );
    }
    distIndexJsContent = readFileSync(distIndexJs, 'utf-8');
  });

  it('dist/index.js exists and is valid ESM', () => {
    expect(distIndexJsContent).toContain('export');
  });

  it('dist/index.css exists', () => {
    expect(existsSync(resolve(distDir, 'index.css'))).toBe(true);
  });

  it('dist/index.js does not bundle Vue internals', () => {
    // Vue internals that would only appear if Vue source was bundled inline
    expect(distIndexJsContent).not.toContain('__VUE_OPTIONS_API__');
    expect(distIndexJsContent).not.toContain('__VUE_PROD_DEVTOOLS__');
    // All vue references should be import statements, not inlined code
    expect(distIndexJsContent).toContain('from "vue"');
  });

  it('dist/index.js does not bundle PrimeVue internals', () => {
    expect(distIndexJsContent).not.toContain('PrimeVueService');
    // PrimeVue should only appear as external imports
    expect(distIndexJsContent).toContain('from "primevue/');
  });
});

// Identifier list is grouped by component so each component's types stay co-located
// with their parent — mirrors the structure of src/index.ts.
const expectedTypeIdentifiers = [
  'DsAvatar',
  'DsAvatarColor',
  'DsAvatarProps',
  'DsAvatarSize',
  'DsAvatarVariant',
  'DsBadge',
  'DsBadgeProps',
  'DsBadgeType',
  'DsButton',
  'DsButtonProps',
  'DsChip',
  'DsChipProps',
  'DsCodeInput',
  'DsCodeInputProps',
  'DsIcon',
  'IconName',
  'DsIconButton',
  'DsIconButtonProps',
  'DsInputText',
  'DsInputTextProps',
  'DsLink',
  'DsLinkProps',
  'DsSearchField',
  'DsSearchFieldClearBehavior',
  'DsSearchFieldProps',
  'DsSearchFieldSize',
  'DsSelect',
  'DsSelectProps',
  'DsTextarea',
  'DsTextareaProps',
  'dsPreset',
  'dsTheme',
];

describe('dist/index.d.ts exports all public identifiers', () => {
  let distIndexDtsContent = '';

  beforeAll(() => {
    expect(existsSync(distIndexDts)).toBe(true);
    distIndexDtsContent = readFileSync(distIndexDts, 'utf-8');
  });

  it.each(expectedTypeIdentifiers)('dist/index.d.ts exports %s', (identifier) => {
    // Word-boundary regex prevents substring false positives
    // (e.g., 'DsIcon' must not match against 'DsIconButton')
    expect(distIndexDtsContent).toMatch(wordBoundary(identifier));
  });
});

describe('barrel exports resolve at runtime', () => {
  const componentExports = [
    'DsAvatar',
    'DsBadge',
    'DsButton',
    'DsChip',
    'DsCodeInput',
    'DsIcon',
    'DsIconButton',
    'DsInputText',
    'DsLink',
    'DsSearchField',
    'DsSelect',
    'DsTextarea',
  ];
  const themeExports = ['dsPreset', 'dsTheme'];
  let indexModule: Record<string, unknown> = {};

  beforeAll(async () => {
    expect(existsSync(distIndexJs)).toBe(true);
    indexModule = (await import('../../dist/index.js')) as Record<string, unknown>;
  });

  it.each(componentExports)('runtime export %s is a Vue component object', (componentName) => {
    const component = indexModule[componentName];
    expect(component).toBeDefined();
    expect(component).not.toBeNull();
    expect(typeof component).toBe('object');
  });

  it.each(themeExports)('runtime export %s is defined', (themeExportName) => {
    expect(indexModule[themeExportName]).toBeDefined();
  });
});
