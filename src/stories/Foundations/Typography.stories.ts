import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'Foundations/Typography',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Typography tokens — values from src/theme/ds-preset.ts
// ---------------------------------------------------------------------------

const fontFamilies = {
  heading: 'Inter, sans-serif',
  body: 'Inter, sans-serif',
};

const fontSizes = [
  { name: 'xs', size: '12px', lineHeight: '16px' },
  { name: 'sm', size: '14px', lineHeight: '20px' },
  { name: 'base', size: '16px', lineHeight: '24px' },
  { name: 'lg', size: '20px', lineHeight: '28px' },
  { name: '2xl', size: '32px', lineHeight: '40px' },
  { name: '3xl', size: '30px', lineHeight: '32px' },
];

const fontWeights = [
  { name: 'normal', value: '400' },
  { name: 'medium', value: '500' },
  { name: 'semibold', value: '600' },
];

const compositeStyles = [
  { name: 'text-xs / normal', weight: '400', size: '12px', lineHeight: '16px', tracking: '0' },
  { name: 'text-xs / medium', weight: '500', size: '12px', lineHeight: '16px', tracking: '0' },
  { name: 'text-xs / semibold', weight: '600', size: '12px', lineHeight: '16px', tracking: '0' },
  { name: 'text-sm / normal', weight: '400', size: '14px', lineHeight: '20px', tracking: '-0.2px' },
  { name: 'text-sm / medium', weight: '500', size: '14px', lineHeight: '20px', tracking: '-0.2px' },
  {
    name: 'text-sm / semibold',
    weight: '600',
    size: '14px',
    lineHeight: '20px',
    tracking: '-0.2px',
  },
  {
    name: 'text-3xl / normal',
    weight: '400',
    size: '30px',
    lineHeight: '32px',
    tracking: '-0.2px',
  },
  {
    name: 'text-3xl / semibold',
    weight: '600',
    size: '30px',
    lineHeight: '32px',
    tracking: '-0.2px',
  },
];

export const Default: Story = {
  render: () => ({
    setup() {
      return { fontFamilies, fontSizes, fontWeights, compositeStyles };
    },
    template: `
      <div style="font-family: Inter, sans-serif; max-width: 960px;">

        <!-- Font Family -->
        <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 24px;">Typography</h1>

        <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 12px;">Font Family</h2>
        <table style="border-collapse: collapse; width: 100%; font-size: 14px; margin-bottom: 40px;">
          <thead>
            <tr style="border-bottom: 2px solid #e2e8f0;">
              <th style="text-align: left; padding: 8px 12px; font-weight: 600;">Role</th>
              <th style="text-align: left; padding: 8px 12px; font-weight: 600;">Family</th>
              <th style="text-align: left; padding: 8px 12px; font-weight: 600;">Sample</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(family, role) in fontFamilies" :key="role" style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 12px; font-weight: 500;">{{ role }}</td>
              <td style="padding: 8px 12px; font-family: monospace; font-size: 12px;">{{ family }}</td>
              <td :style="{ padding: '8px 12px', fontFamily: family }">The quick brown fox jumps over the lazy dog</td>
            </tr>
          </tbody>
        </table>

        <!-- Font Sizes -->
        <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 12px;">Font Sizes</h2>
        <div style="margin-bottom: 40px;">
          <div
            v-for="fs in fontSizes"
            :key="fs.name"
            style="display: flex; align-items: baseline; gap: 16px; padding: 12px 0; border-bottom: 1px solid #f1f5f9;"
          >
            <div style="width: 80px; flex-shrink: 0; font-size: 13px; font-weight: 500;">{{ fs.name }}</div>
            <div style="width: 140px; flex-shrink: 0; font-size: 12px; font-family: monospace; color: #90a1b9;">
              {{ fs.size }} / {{ fs.lineHeight }}
            </div>
            <div :style="{ fontSize: fs.size, lineHeight: fs.lineHeight, fontFamily: 'Inter, sans-serif' }">
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
        </div>

        <!-- Font Weights -->
        <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 12px;">Font Weights</h2>
        <div style="margin-bottom: 40px;">
          <div
            v-for="fw in fontWeights"
            :key="fw.name"
            style="display: flex; align-items: baseline; gap: 16px; padding: 12px 0; border-bottom: 1px solid #f1f5f9;"
          >
            <div style="width: 80px; flex-shrink: 0; font-size: 13px; font-weight: 500;">{{ fw.name }}</div>
            <div style="width: 140px; flex-shrink: 0; font-size: 12px; font-family: monospace; color: #90a1b9;">
              {{ fw.value }}
            </div>
            <div :style="{ fontSize: '16px', fontWeight: fw.value, fontFamily: 'Inter, sans-serif' }">
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
        </div>

        <!-- Composite Styles (Figma) -->
        <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 12px;">Composite Styles (Figma)</h2>
        <div style="margin-bottom: 40px;">
          <div
            v-for="cs in compositeStyles"
            :key="cs.name"
            style="display: flex; align-items: baseline; gap: 16px; padding: 12px 0; border-bottom: 1px solid #f1f5f9;"
          >
            <div style="width: 140px; flex-shrink: 0; font-size: 13px; font-weight: 500;">{{ cs.name }}</div>
            <div style="width: 200px; flex-shrink: 0; font-size: 11px; font-family: monospace; color: #90a1b9;">
              Inter {{ cs.weight }} {{ cs.size }}/{{ cs.lineHeight }} ({{ cs.tracking }})
            </div>
            <div :style="{
              fontSize: cs.size,
              lineHeight: cs.lineHeight,
              fontWeight: cs.weight,
              letterSpacing: cs.tracking,
              fontFamily: 'Inter, sans-serif',
            }">
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
        </div>

      </div>
    `,
  }),
};
