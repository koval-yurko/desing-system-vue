import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'Foundations/Color Palette',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Primitive color palettes — values from src/theme/ds-preset.ts
// ---------------------------------------------------------------------------

const palettes = {
  Gray: {
    '0': '#ffffff',
    '50': '#f9fbfd',
    '100': '#f8fafc',
    '200': '#f1f5f9',
    '300': '#e2e8f0',
    '400': '#cad5e2',
    '500': '#90a1b9',
    '600': '#6a7d97',
    '700': '#4c5f78',
    '800': '#314158',
    '900': '#1d293d',
    '950': '#020618',
  },
  Purple: {
    '50': '#f7f6fd',
    '100': '#f3e8ff',
    '200': '#e0cfff',
    '300': '#c9a8ff',
    '400': '#ab7aff',
    '500': '#8e51ff',
    '600': '#7849ff',
    '700': '#6b3ef2',
    '800': '#5f33e6',
    '900': '#4a27b3',
    '950': '#2d1570',
  },
  Red: {
    '50': '#fff1f2',
    '100': '#ffe4e6',
    '200': '#ffccd0',
    '300': '#ffabb2',
    '400': '#ff8b8b',
    '500': '#f85a6a',
    '600': '#f54356',
    '700': '#f22a42',
    '800': '#c70036',
    '900': '#a0002c',
    '950': '#5c0019',
  },
  Blue: {
    '50': '#f0f7ff',
    '100': '#eef8fe',
    '200': '#e7f4fe',
    '300': '#c2dfff',
    '400': '#6babf7',
    '500': '#3584f0',
    '600': '#0e5cf4',
    '700': '#0b4ad0',
    '800': '#0a3ba6',
    '900': '#082f80',
    '950': '#041a4a',
  },
  Amber: {
    '50': '#fffbf0',
    '100': '#ffefdb',
    '200': '#ffe0b5',
    '300': '#ffcf8a',
    '400': '#f8bc3b',
    '500': '#e89b1e',
    '600': '#da6b16',
    '700': '#b85712',
    '800': '#94430e',
    '900': '#70320a',
    '950': '#3d1b05',
  },
  Orange: {
    '50': '#fff5f5',
    '100': '#ffe3e2',
    '200': '#ffc7c5',
    '300': '#ffa19e',
    '400': '#f47570',
    '500': '#e5504a',
    '600': '#d94038',
    '700': '#cc332b',
    '800': '#a32822',
    '900': '#7f1f1a',
    '950': '#450f0d',
  },
  Pink: {
    '50': '#fff0fb',
    '100': '#ffe0f7',
    '200': '#ff4dd2',
    '300': '#df00b4',
    '400': '#c00098',
    '500': '#a30082',
    '600': '#87006b',
    '700': '#6b0055',
    '800': '#530042',
    '900': '#3d0031',
    '950': '#21001a',
  },
} as const;

const paletteRoles: Record<string, string> = {
  Gray: 'Surface / Main',
  Purple: 'Brand Primary',
  Red: 'Negative / Error',
  Blue: 'Supporting',
  Amber: 'Supporting / Warning',
  Orange: 'Supporting',
  Pink: 'Supporting',
};

// ---------------------------------------------------------------------------
// Semantic color groups — Figma extend tokens from ds-preset.ts
// ---------------------------------------------------------------------------

const semanticGroups = {
  'Outline / Main': {
    white: '#ffffff',
    gray100: '#f8fafc',
    gray200: '#f1f3f4',
    gray300: '#e2e8f0',
    gray400: '#cad5e2',
    gray500: '#90a1b9',
    gray600: '#62748e',
    gray800: '#314158',
    gray900: '#1d293d',
  },
  'Outline / Brand': {
    purple400: '#7849ff',
    purple450: '#5f33e6',
  },
  'Outline / Supporting': {
    blue300: '#c2dfff',
    blue600: '#0e5cf4',
  },
  'Outline / Negative': {
    red700: '#f22a42',
  },
  'Text Color / Main': {
    white: '#ffffff',
    gray100: '#f8fafc',
    gray500: '#90a1b9',
    gray600: '#62748e',
    gray700: '#45556c',
    gray800: '#314158',
    gray900: '#1d293d',
  },
  'Text Color / Brand': {
    purple600: '#7849ff',
    purple800: '#5f33e6',
  },
  'Text Color / Supporting': {
    blue600: '#0e5cf4',
  },
  'Text Color / Negative': {
    red700: '#f22a42',
  },
  'Token / Surface': {
    primaryBw00: '#ffffff',
    primaryBw01: '#fbfbfd',
  },
  'Token / Text': {
    mainPrimary: '#20242e',
    negativeRed: '#e74343',
  },
} as const;

// ---------------------------------------------------------------------------
// Theme-aware semantic colors — resolved hex values from ds-preset.ts
// ---------------------------------------------------------------------------

const themeColors = {
  Primary: {
    color: { light: '#7849ff', dark: '#ab7aff', lightRef: 'purple.600', darkRef: 'purple.400' },
    contrastColor: { light: '#ffffff', dark: '#1d293d', lightRef: '', darkRef: 'gray.900' },
    hoverColor: {
      light: '#6b3ef2',
      dark: '#c9a8ff',
      lightRef: 'purple.700',
      darkRef: 'purple.300',
    },
    activeColor: {
      light: '#5f33e6',
      dark: '#e0cfff',
      lightRef: 'purple.800',
      darkRef: 'purple.200',
    },
  },
  Text: {
    color: { light: '#314158', dark: '#ffffff', lightRef: 'gray.800', darkRef: 'gray.0' },
    hoverColor: { light: '#1d293d', dark: '#ffffff', lightRef: 'gray.900', darkRef: 'gray.0' },
    mutedColor: { light: '#90a1b9', dark: '#cad5e2', lightRef: 'gray.500', darkRef: 'gray.400' },
    hoverMutedColor: {
      light: '#6a7d97',
      dark: '#e2e8f0',
      lightRef: 'gray.600',
      darkRef: 'gray.300',
    },
  },
  'Form Field': {
    background: { light: '#ffffff', dark: '#020618', lightRef: 'surface.0', darkRef: 'gray.950' },
    disabledBackground: {
      light: '#f1f5f9',
      dark: '#4c5f78',
      lightRef: 'gray.200',
      darkRef: 'gray.700',
    },
    borderColor: { light: '#e2e8f0', dark: '#6a7d97', lightRef: 'gray.300', darkRef: 'gray.600' },
    hoverBorderColor: {
      light: '#cad5e2',
      dark: '#90a1b9',
      lightRef: 'gray.400',
      darkRef: 'gray.500',
    },
    focusBorderColor: {
      light: '#7849ff',
      dark: '#ab7aff',
      lightRef: 'primary.color',
      darkRef: 'primary.color',
    },
    invalidBorderColor: {
      light: '#ff8b8b',
      dark: '#ffabb2',
      lightRef: 'red.400',
      darkRef: 'red.300',
    },
    color: { light: '#314158', dark: '#ffffff', lightRef: 'gray.800', darkRef: 'gray.0' },
    placeholderColor: {
      light: '#90a1b9',
      dark: '#cad5e2',
      lightRef: 'gray.500',
      darkRef: 'gray.400',
    },
  },
  Highlight: {
    background: {
      light: '#f7f6fd',
      dark: 'color-mix(in srgb, #ab7aff, transparent 84%)',
      lightRef: 'primary.50',
      darkRef: 'color-mix',
    },
    focusBackground: {
      light: '#f3e8ff',
      dark: 'color-mix(in srgb, #ab7aff, transparent 76%)',
      lightRef: 'primary.100',
      darkRef: 'color-mix',
    },
    color: {
      light: '#6b3ef2',
      dark: 'rgba(255,255,255,.87)',
      lightRef: 'primary.700',
      darkRef: '',
    },
    focusColor: {
      light: '#5f33e6',
      dark: 'rgba(255,255,255,.87)',
      lightRef: 'primary.800',
      darkRef: '',
    },
  },
  Surface: {
    '0 (white)': { light: '#ffffff', dark: '#ffffff', lightRef: '', darkRef: '' },
    '50': { light: '#f9fbfd', dark: '#f9fbfd', lightRef: 'gray.50', darkRef: 'gray.50' },
    '900': { light: '#1d293d', dark: '#1d293d', lightRef: 'gray.900', darkRef: 'gray.900' },
    '950': { light: '#020618', dark: '#020618', lightRef: 'gray.950', darkRef: 'gray.950' },
  },
  Content: {
    background: { light: '#ffffff', dark: '#1d293d', lightRef: 'surface.0', darkRef: 'gray.900' },
    hoverBackground: {
      light: '#f8fafc',
      dark: '#314158',
      lightRef: 'gray.100',
      darkRef: 'gray.800',
    },
    borderColor: { light: '#f1f5f9', dark: '#4c5f78', lightRef: 'gray.200', darkRef: 'gray.700' },
  },
} as const;

// ---------------------------------------------------------------------------
// Helper: pick readable text color for a swatch
// ---------------------------------------------------------------------------

function textColorFor(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1d293d' : '#ffffff';
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  render: () => ({
    setup() {
      return { palettes, paletteRoles, semanticGroups, themeColors, textColorFor };
    },
    template: `
      <div style="font-family: Inter, sans-serif; max-width: 1200px;">

        <!-- Primitive Palettes -->
        <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 32px;">Primitive Color Palettes</h1>

        <div v-for="(shades, name) in palettes" :key="name" style="margin-bottom: 40px;">
          <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 4px;">{{ name }}</h2>
          <p style="font-size: 13px; color: #90a1b9; margin-bottom: 12px;">{{ paletteRoles[name] }}</p>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            <div
              v-for="(hex, shade) in shades"
              :key="shade"
              style="width: 72px; text-align: center;"
            >
              <div
                :style="{
                  backgroundColor: hex,
                  width: '72px',
                  height: '64px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: '500',
                  color: textColorFor(hex),
                }"
              >{{ hex }}</div>
              <div style="font-size: 11px; font-weight: 500; margin-top: 4px;">{{ shade }}</div>
            </div>
          </div>
        </div>

        <!-- Semantic Colors — Figma Groups -->
        <h1 style="font-size: 24px; font-weight: 600; margin: 48px 0 32px;">Semantic Colors — Figma Groups</h1>

        <div v-for="(tokens, groupName) in semanticGroups" :key="groupName" style="margin-bottom: 32px;">
          <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 10px;">{{ groupName }}</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            <div
              v-for="(hex, token) in tokens"
              :key="token"
              style="width: 100px; text-align: center;"
            >
              <div
                :style="{
                  backgroundColor: hex,
                  width: '100px',
                  height: '56px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: '500',
                  color: textColorFor(hex),
                }"
              >{{ hex }}</div>
              <div style="font-size: 10px; font-weight: 500; margin-top: 4px;">{{ token }}</div>
            </div>
          </div>
        </div>

        <!-- Theme-Aware Semantic Colors -->
        <h1 style="font-size: 24px; font-weight: 600; margin: 48px 0 16px;">Theme-Aware Semantic Colors</h1>
        <p style="font-size: 13px; color: #90a1b9; margin-bottom: 24px;">
          Surface primitive scale (gray 0\u2013950) is identical in both themes \u2014 key shades shown for reference.
          Theme differentiation happens at the semantic level: Primary, Text, Highlight, Form Field, and Content.
        </p>

        <div v-for="(tokens, group) in themeColors" :key="group" style="margin-bottom: 36px;">
          <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 10px;">{{ group }}</h3>
          <table style="border-collapse: collapse; width: 100%; font-size: 13px;">
            <thead>
              <tr style="border-bottom: 2px solid #e2e8f0;">
                <th style="text-align: left; padding: 8px 12px; font-weight: 600;">Token</th>
                <th style="text-align: left; padding: 8px 12px; font-weight: 600;">Light</th>
                <th style="text-align: left; padding: 8px 12px; font-weight: 600;">Dark</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(vals, token) in tokens"
                :key="token"
                style="border-bottom: 1px solid #f1f5f9;"
              >
                <td style="padding: 8px 12px; font-weight: 500;">{{ token }}</td>
                <td style="padding: 8px 12px;">
                  <span style="display: inline-flex; align-items: center; gap: 8px;">
                    <span
                      :style="{
                        display: 'inline-block',
                        width: '28px',
                        height: '28px',
                        borderRadius: '4px',
                        backgroundColor: vals.light,
                        border: '1px solid rgba(0,0,0,0.08)',
                      }"
                    ></span>
                    <span>{{ vals.light }}</span>
                    <span v-if="vals.lightRef" style="color: #90a1b9;">({{ vals.lightRef }})</span>
                  </span>
                </td>
                <td style="padding: 8px 12px;">
                  <span style="display: inline-flex; align-items: center; gap: 8px;">
                    <span
                      :style="{
                        display: 'inline-block',
                        width: '28px',
                        height: '28px',
                        borderRadius: '4px',
                        backgroundColor: vals.dark,
                        border: '1px solid rgba(0,0,0,0.08)',
                      }"
                    ></span>
                    <span>{{ vals.dark }}</span>
                    <span v-if="vals.darkRef" style="color: #90a1b9;">({{ vals.darkRef }})</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    `,
  }),
};
