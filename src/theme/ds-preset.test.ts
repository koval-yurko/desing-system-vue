import { describe, expect, it } from 'vitest';
import { dsPreset, dsTheme } from './ds-preset';

describe('dsPreset', () => {
  it('is a valid object with expected top-level structure', () => {
    expect(dsPreset).toBeDefined();
    expect(typeof dsPreset).toBe('object');
    expect(dsPreset).toHaveProperty('primitive');
    expect(dsPreset).toHaveProperty('semantic');
    // Verify borderRadius is inside primitive (where PrimeVue resolves it)
    const br = dsPreset.primitive?.borderRadius as Record<string, string>;
    expect(br).toBeDefined();
    expect(br.none).toBe('0');
    expect(br.xs).toBe('2px');
    expect(br.sm).toBe('4px');
    expect(br.md).toBe('4px');
    expect(br.lg).toBe('8px');
    expect(br.xl).toBe('12px');
  });

  it('contains primary color palette with Purple hex values', () => {
    const primary = dsPreset.semantic?.primary as Record<string, string>;
    expect(primary).toBeDefined();

    // Verify Figma-defined Purple brand shades are referenced
    expect(primary[50]).toBe('{purple.50}');
    expect(primary[500]).toBe('{purple.500}');
    expect(primary[600]).toBe('{purple.600}');
    expect(primary[800]).toBe('{purple.800}');

    // Verify the primitive purple palette has the actual hex values
    const purple = dsPreset.primitive?.purple as Record<string, string>;
    expect(purple).toBeDefined();
    expect(purple[50]).toBe('#f7f6fd');
    expect(purple[100]).toBe('#f3e8ff');
    expect(purple[500]).toBe('#8e51ff');
    expect(purple[600]).toBe('#7849ff');
    expect(purple[800]).toBe('#5f33e6');
  });

  it('contains colorScheme with both light and dark sections', () => {
    const colorScheme = dsPreset.semantic?.colorScheme as Record<string, unknown>;
    expect(colorScheme).toBeDefined();
    expect(colorScheme).toHaveProperty('light');
    expect(colorScheme).toHaveProperty('dark');

    const light = colorScheme.light as Record<string, unknown>;
    const dark = colorScheme.dark as Record<string, unknown>;

    expect(light).toHaveProperty('surface');
    expect(light).toHaveProperty('primary');
    expect(light).toHaveProperty('text');

    expect(dark).toHaveProperty('surface');
    expect(dark).toHaveProperty('primary');
    expect(dark).toHaveProperty('text');
  });

  it('contains custom extend tokens for spacing and shadows', () => {
    const ext = dsPreset.extend as Record<string, unknown>;
    expect(ext).toBeDefined();

    // Spacing scale
    const spacing = ext.spacing as Record<string, string>;
    expect(spacing).toBeDefined();
    expect(spacing[0]).toBe('0px');
    expect(spacing[2]).toBe('8px');
    expect(spacing[4]).toBe('16px');
    expect(spacing[8]).toBe('32px');

    // Shadows
    const shadow = ext.shadow as Record<string, string>;
    expect(shadow).toBeDefined();
    expect(shadow.xs).toContain('#e2e8f0');
    expect(shadow.sm).toContain('#cad5e2');
    expect(shadow.shadow3).toContain('#b0bdc5');
    expect(shadow.keyLight).toContain('#00000059');
    expect(shadow.errorFocusRing).toContain('#ffe4e6');
  });

  it('contains gray surface palette with Figma hex values', () => {
    const gray = dsPreset.primitive?.gray as Record<string, string>;
    expect(gray).toBeDefined();
    expect(gray[0]).toBe('#ffffff');
    expect(gray[100]).toBe('#f8fafc');
    expect(gray[200]).toBe('#f1f5f9');
    expect(gray[300]).toBe('#e2e8f0');
    expect(gray[400]).toBe('#cad5e2');
    expect(gray[500]).toBe('#90a1b9');
    expect(gray[800]).toBe('#314158');
    expect(gray[900]).toBe('#1d293d');
    expect(gray[950]).toBe('#020618');
  });

  it('contains red/danger palette with Figma hex values', () => {
    const red = dsPreset.primitive?.red as Record<string, string>;
    expect(red).toBeDefined();
    expect(red[50]).toBe('#fff1f2');
    expect(red[100]).toBe('#ffe4e6');
    expect(red[400]).toBe('#ff8b8b');
    expect(red[700]).toBe('#f22a42');
    expect(red[800]).toBe('#c70036');
  });

  it('contains typography extend tokens', () => {
    const font = (dsPreset.extend as Record<string, unknown>)?.font as Record<
      string,
      Record<string, string>
    >;
    expect(font).toBeDefined();
    expect(font.family.heading).toContain('Inter');
    expect(font.family.body).toContain('Inter');
    expect(font.weight.normal).toBe('400');
    expect(font.weight.medium).toBe('500');
    expect(font.weight.semibold).toBe('600');
    expect(font.size.xs).toBe('12px');
    expect(font.size.sm).toBe('14px');
    expect(font.size.base).toBe('16px');
    expect(font.size.lg).toBe('20px');
    expect(font.size['3xl']).toBe('30px');

    expect(font.lineHeight.xs).toBe('16px');
    expect(font.lineHeight.sm).toBe('20px');
    expect(font.lineHeight.base).toBe('24px');
    expect(font.lineHeight['3xl']).toBe('32px');
  });

  it('contains border width extend tokens', () => {
    const borderWidth = (dsPreset.extend as Record<string, unknown>)?.borderWidth as Record<
      string,
      string
    >;
    expect(borderWidth).toBeDefined();
    expect(borderWidth[50]).toBe('1px');
    expect(borderWidth[100]).toBe('1.2px');
    expect(borderWidth[200]).toBe('1.5px');
  });

  it('contains outline and text color extend tokens', () => {
    const ext = dsPreset.extend as Record<string, unknown>;

    const outline = ext.outline as Record<string, Record<string, string>>;
    expect(outline).toBeDefined();
    expect(outline.main.white).toBe('#ffffff');
    expect(outline.main.gray200).toBe('#f1f3f4'); // Figma outline gray200 differs from surface gray200
    expect(outline.brand.purple400).toBe('{purple.600}');
    expect(outline.negative.red700).toBe('{red.700}');

    const textColor = ext.textColor as Record<string, Record<string, string>>;
    expect(textColor).toBeDefined();
    expect(textColor.main.gray900).toBe('{gray.900}');
    expect(textColor.brand.purple600).toBe('{purple.600}');
    expect(textColor.negative.red700).toBe('{red.700}');
  });

  it('dark mode semantic tokens reference dark surfaces and light text', () => {
    const colorScheme = dsPreset.semantic?.colorScheme as Record<string, Record<string, unknown>>;
    const dark = colorScheme.dark;

    // Dark backgrounds use high surface numbers (dark grays)
    const content = dark.content as Record<string, string>;
    expect(content.background).toBe('{surface.900}');
    expect(content.hoverBackground).toBe('{surface.800}');
    expect(content.borderColor).toBe('{surface.700}');

    // Dark text uses low surface numbers (light values)
    const text = dark.text as Record<string, string>;
    expect(text.color).toBe('{surface.0}');
    expect(text.mutedColor).toBe('{surface.400}');

    // Dark primary shifts to lighter shade for visibility
    const primary = dark.primary as Record<string, string>;
    expect(primary.color).toBe('{primary.400}');
    expect(primary.contrastColor).toBe('{surface.900}');

    // Dark form fields use dark backgrounds
    const formField = dark.formField as Record<string, string>;
    expect(formField.background).toBe('{surface.950}');
  });

  it('exports dsTheme with preset and darkModeSelector option', () => {
    expect(dsTheme).toBeDefined();
    expect(dsTheme.preset).toBe(dsPreset);
    expect(dsTheme.options?.darkModeSelector).toBe('.p-dark');
  });

  it('contains updated amber.700 matching Figma taxt/supporting/amber/yellow-700', () => {
    const amber = dsPreset.primitive?.amber as Record<string, string>;
    expect(amber).toBeDefined();
    expect(amber[700]).toBe('#a33b16'); // Figma yellow-700 (updated from #b85712)
    // Verify other amber shades are unchanged
    expect(amber[100]).toBe('#ffefdb');
    expect(amber[600]).toBe('#da6b16');
  });

  it('contains green primitive palette with Figma-specified shades', () => {
    const green = dsPreset.primitive?.green as Record<string, string>;
    expect(green).toBeDefined();
    expect(green[100]).toBe('#e0f6ed'); // Figma surfase/positive/green-100
    expect(green[700]).toBe('#00995c'); // Figma taxt/positive/green-700
    expect(green[50]).toBe('#f2fbf6');
    expect(green[950]).toBe('#003a22');
  });
});
