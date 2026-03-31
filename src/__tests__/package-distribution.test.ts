import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(import.meta.dirname, '..', '..');
const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf-8'));
const distDir = resolve(ROOT, 'dist');
const distIndexJs = resolve(distDir, 'index.js');

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
  it('dist/index.js exists and is valid ESM', () => {
    expect(existsSync(distIndexJs)).toBe(true);
    const content = readFileSync(distIndexJs, 'utf-8');
    expect(content).toContain('export');
  });

  it('dist/index.css exists', () => {
    expect(existsSync(resolve(distDir, 'index.css'))).toBe(true);
  });

  it('dist/index.d.ts exports all public types', () => {
    const indexDts = resolve(distDir, 'index.d.ts');
    expect(existsSync(indexDts)).toBe(true);
    const content = readFileSync(indexDts, 'utf-8');
    expect(content).toContain('DsButton');
    expect(content).toContain('DsButtonProps');
    expect(content).toContain('DsIcon');
    expect(content).toContain('IconName');
    expect(content).toContain('dsPreset');
    expect(content).toContain('dsTheme');
  });

  it('dist/index.js does not bundle Vue internals', () => {
    const content = readFileSync(distIndexJs, 'utf-8');
    // Vue internals that would only appear if Vue source was bundled inline
    expect(content).not.toContain('__VUE_OPTIONS_API__');
    expect(content).not.toContain('__VUE_PROD_DEVTOOLS__');
    // All vue references should be import statements, not inlined code
    expect(content).toContain('from "vue"');
  });

  it('dist/index.js does not bundle PrimeVue internals', () => {
    const content = readFileSync(distIndexJs, 'utf-8');
    expect(content).not.toContain('PrimeVueService');
    // PrimeVue should only appear as external imports
    expect(content).toContain('from "primevue/');
  });
});

describe('barrel exports resolve correctly', () => {
  it('all named exports from src/index.ts are accessible', async () => {
    expect(existsSync(distIndexJs)).toBe(true);
    const indexModule = await import('../../dist/index.js');
    expect(indexModule.DsButton).toBeDefined();
    expect(indexModule.DsIcon).toBeDefined();
    expect(indexModule.dsPreset).toBeDefined();
    expect(indexModule.dsTheme).toBeDefined();
  });
});
