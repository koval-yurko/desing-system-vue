import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { onMounted, ref } from 'vue';
import DsCodeInput from './DsCodeInput.vue';

const meta = {
  title: 'Components/DsCodeInput',
  component: DsCodeInput,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    modelValue: { control: 'text' },
  },
  args: {
    disabled: false,
  },
} satisfies Meta<typeof DsCodeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { DsCodeInput },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsCodeInput v-bind="args" v-model="value" />',
  }),
};

export const Filled: Story = {
  args: { modelValue: '5234' },
  render: (args) => ({
    components: { DsCodeInput },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsCodeInput v-bind="args" v-model="value" />',
  }),
};

export const WithLabel: Story = {
  args: { label: 'Verification code' },
  render: (args) => ({
    components: { DsCodeInput },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsCodeInput v-bind="args" v-model="value" />',
  }),
};

export const WithHint: Story = {
  args: {
    label: 'Verification code',
    hint: 'Check your email for a 4-digit code',
  },
  render: (args) => ({
    components: { DsCodeInput },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsCodeInput v-bind="args" v-model="value" />',
  }),
};

export const ErrorState: Story = {
  args: {
    label: 'Verification code',
    error: 'Invalid code',
    modelValue: '5234',
  },
  render: (args) => ({
    components: { DsCodeInput },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsCodeInput v-bind="args" v-model="value" />',
  }),
};

export const Disabled: Story = {
  args: {
    label: 'Verification code',
    disabled: true,
    modelValue: '5234',
  },
  render: (args) => ({
    components: { DsCodeInput },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsCodeInput v-bind="args" v-model="value" />',
  }),
};

export const CustomLength: Story = {
  args: { label: 'Verification code' },
  render: (args) => ({
    components: { DsCodeInput },
    setup() {
      const value = ref('');
      return { args, value };
    },
    template: '<DsCodeInput v-bind="args" v-model="value" :length="6" />',
  }),
};

export const IntegerOnly: Story = {
  args: { label: 'Verification code (digits only)' },
  render: (args) => ({
    components: { DsCodeInput },
    setup() {
      const value = ref('');
      return { args, value };
    },
    template: '<DsCodeInput v-bind="args" v-model="value" :integer-only="true" />',
  }),
};

export const MaskedPin: Story = {
  args: { label: 'PIN' },
  render: (args) => ({
    components: { DsCodeInput },
    setup() {
      const value = ref('');
      return { args, value };
    },
    template:
      '<DsCodeInput v-bind="args" v-model="value" :length="4" :mask="true" :integer-only="true" />',
  }),
};

export const PasteInteractive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Paste `1234` into the first cell — all 4 cells auto-populate. Demonstrates PrimeVue's built-in paste handling.",
      },
    },
  },
  render: () => ({
    components: { DsCodeInput },
    setup() {
      const value = ref('');
      return { value };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <DsCodeInput v-model="value" label="Paste 1234 into the first cell" />
        <div style="font-family: Inter, sans-serif; font-size: 12px; color: var(--p-gray-600);">
          Current value: <code>{{ value || '(empty)' }}</code>
        </div>
      </div>
    `,
  }),
};

export const AllStates: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Mirrors the Figma canvas rows: Default, Focused (first cell auto-focused), Input (filled), Error, Disabled. Hover is CSS-driven — point at a cell in the Default row to see it.',
      },
    },
  },
  render: () => ({
    components: { DsCodeInput },
    setup() {
      const empty = ref('');
      const focused = ref('');
      const filled = ref('5234');
      const errored = ref('5234');
      const disabled = ref('5234');
      const focusedRow = ref<HTMLElement | null>(null);
      // PrimeVue InputOtp does not route `autofocus` onto cell inputs; reach
      // into the mounted DOM and focus the first cell to demo the Focused state.
      onMounted(() => {
        focusedRow.value?.querySelector('input')?.focus();
      });
      return { empty, focused, filled, errored, disabled, focusedRow };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <DsCodeInput v-model="empty" label="Default — hover a cell" />
        <div ref="focusedRow">
          <DsCodeInput v-model="focused" label="Focused (first cell auto-focused)" />
        </div>
        <DsCodeInput v-model="filled" label="Input" />
        <DsCodeInput v-model="errored" label="Error" error="Invalid code" />
        <DsCodeInput v-model="disabled" label="Disabled" disabled />
      </div>
    `,
  }),
};
