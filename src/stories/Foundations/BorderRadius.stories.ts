import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'Foundations/Border Radius',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Border radius tokens — values from src/theme/ds-preset.ts (primitive.borderRadius)
// ---------------------------------------------------------------------------

const radiusTokens = [
  { name: 'none', value: '0' },
  { name: 'xs', value: '2px' },
  { name: 'sm', value: '4px' },
  { name: 'md', value: '4px' },
  { name: 'lg', value: '8px' },
  { name: 'xl', value: '12px' },
];

export const Default: Story = {
  render: () => ({
    setup() {
      return { radiusTokens };
    },
    template: `
      <div style="font-family: Inter, sans-serif; max-width: 800px;">
        <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 24px;">Border Radius</h1>
        <div style="display: flex; flex-wrap: wrap; gap: 24px;">
          <div
            v-for="token in radiusTokens"
            :key="token.name"
            style="text-align: center;"
          >
            <div
              :style="{
                width: '80px',
                height: '80px',
                borderRadius: token.value,
                border: '2px solid #cad5e2',
                backgroundColor: '#f7f6fd',
              }"
            ></div>
            <div style="font-size: 13px; font-weight: 500; margin-top: 8px;">{{ token.name }}</div>
            <div style="font-size: 11px; font-family: monospace; color: #90a1b9;">{{ token.value }}</div>
          </div>
        </div>
      </div>
    `,
  }),
};
