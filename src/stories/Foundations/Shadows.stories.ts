import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'Foundations/Shadows',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Shadow tokens — values from src/theme/ds-preset.ts (extend.shadow)
// ---------------------------------------------------------------------------

const shadowTokens = [
  { name: 'xs', value: '0 1px 2px #e2e8f0' },
  { name: 'sm', value: '0 1px 6px #cad5e240, 0 1px 4px #cad5e280' },
  { name: 'shadow3', value: '0 1px 6px #b0bdc517, 0 6px 13px #b0bdc524, 0 1px 2px #3a485012' },
  { name: 'keyLight', value: '0 1px 0 #00000059' },
  { name: 'errorFocusRing', value: '0 0 0 3px #ffe4e6' },
];

export const Default: Story = {
  render: () => ({
    setup() {
      return { shadowTokens };
    },
    template: `
      <div style="font-family: Inter, sans-serif; max-width: 800px;">
        <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 24px;">Shadows</h1>
        <div style="display: flex; flex-wrap: wrap; gap: 32px;">
          <div
            v-for="token in shadowTokens"
            :key="token.name"
            style="text-align: center;"
          >
            <div
              :style="{
                width: '200px',
                height: '100px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                boxShadow: token.value,
                border: '1px solid rgba(0,0,0,0.04)',
              }"
            ></div>
            <div style="font-size: 13px; font-weight: 500; margin-top: 10px;">{{ token.name }}</div>
            <div style="font-size: 10px; font-family: monospace; color: #90a1b9; max-width: 200px; word-break: break-all;">{{ token.value }}</div>
          </div>
        </div>
      </div>
    `,
  }),
};
