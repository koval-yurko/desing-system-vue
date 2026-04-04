import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'Foundations/Spacing',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Spacing tokens — values from src/theme/ds-preset.ts (extend.spacing)
// ---------------------------------------------------------------------------

const spacingTokens = [
  { name: '0', value: '0px' },
  { name: '0_5', value: '2px' },
  { name: '1', value: '4px' },
  { name: '2', value: '8px' },
  { name: '3', value: '12px' },
  { name: '4', value: '16px' },
  { name: '5', value: '20px' },
  { name: '8', value: '32px' },
];

export const Default: Story = {
  render: () => ({
    setup() {
      return { spacingTokens };
    },
    template: `
      <div style="font-family: Inter, sans-serif; max-width: 600px;">
        <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 24px;">Spacing</h1>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div
            v-for="token in spacingTokens"
            :key="token.name"
            style="display: flex; align-items: center; gap: 16px;"
          >
            <div style="width: 48px; flex-shrink: 0; font-size: 13px; font-weight: 500;">{{ token.name }}</div>
            <div style="width: 48px; flex-shrink: 0; font-size: 12px; font-family: monospace; color: #90a1b9;">{{ token.value }}</div>
            <div
              :style="{
                width: token.value,
                minWidth: '2px',
                height: '24px',
                backgroundColor: '#8e51ff',
                borderRadius: '4px',
              }"
            ></div>
          </div>
        </div>
      </div>
    `,
  }),
};
