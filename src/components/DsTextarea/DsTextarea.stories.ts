import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import DsTextarea from './DsTextarea.vue';

const meta = {
  title: 'Components/DsTextarea',
  component: DsTextarea,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    mandatory: { control: 'boolean' },
    optional: { control: 'boolean' },
    info: { control: 'boolean' },
    hint: { control: 'text' },
    error: { control: 'text' },
    maxLength: { control: 'number' },
    rows: { control: 'number' },
    modelValue: { control: 'text' },
  },
  args: {
    size: 'medium',
    label: 'Label',
    disabled: false,
    mandatory: false,
    optional: false,
    info: false,
    rows: 3,
  },
} satisfies Meta<typeof DsTextarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { DsTextarea },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsTextarea v-bind="args" v-model="value" />',
  }),
};

export const WithLabel: Story = {
  args: { label: 'Description' },
  render: (args) => ({
    components: { DsTextarea },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsTextarea v-bind="args" v-model="value" />',
  }),
};

export const Mandatory: Story = {
  args: { label: 'Comments', mandatory: true },
  render: (args) => ({
    components: { DsTextarea },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsTextarea v-bind="args" v-model="value" />',
  }),
};

export const Optional: Story = {
  args: { label: 'Notes', optional: true },
  render: (args) => ({
    components: { DsTextarea },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsTextarea v-bind="args" v-model="value" />',
  }),
};

export const WithInfo: Story = {
  args: { label: 'Bio', info: true },
  render: (args) => ({
    components: { DsTextarea },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsTextarea v-bind="args" v-model="value" />',
  }),
};

export const WithHint: Story = {
  args: { label: 'Description', hint: 'Provide a brief description of the issue' },
  render: (args) => ({
    components: { DsTextarea },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsTextarea v-bind="args" v-model="value" />',
  }),
};

export const WithError: Story = {
  args: {
    label: 'Description',
    error: 'Description is required',
    modelValue: '',
  },
  render: (args) => ({
    components: { DsTextarea },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsTextarea v-bind="args" v-model="value" />',
  }),
};

export const Disabled: Story = {
  args: { label: 'Notes', disabled: true, modelValue: 'Some disabled content' },
  render: (args) => ({
    components: { DsTextarea },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsTextarea v-bind="args" v-model="value" />',
  }),
};

export const Filled: Story = {
  args: {
    label: 'Description',
    modelValue:
      'This is a filled textarea with some content that spans multiple lines to demonstrate the filled state.',
  },
  render: (args) => ({
    components: { DsTextarea },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsTextarea v-bind="args" v-model="value" />',
  }),
};

export const WithCounter: Story = {
  args: { label: 'Bio', maxLength: 200, hint: 'Tell us about yourself' },
  render: (args) => ({
    components: { DsTextarea },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsTextarea v-bind="args" v-model="value" />',
  }),
};

export const CounterOverflow: Story = {
  args: {
    label: 'Short bio',
    maxLength: 20,
    modelValue: 'This text exceeds the maximum character count limit',
  },
  render: (args) => ({
    components: { DsTextarea },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsTextarea v-bind="args" v-model="value" />',
  }),
};

export const ErrorWithHint: Story = {
  args: {
    label: 'Description',
    hint: 'Provide at least 10 characters',
    error: 'Description is too short',
    modelValue: 'Short',
  },
  render: (args) => ({
    components: { DsTextarea },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsTextarea v-bind="args" v-model="value" />',
  }),
};

export const AllSizes: Story = {
  render: () => ({
    components: { DsTextarea },
    setup() {
      const small = ref('');
      const medium = ref('');
      return { small, medium };
    },
    template: `
      <div style="display: flex; gap: 24px; align-items: flex-start;">
        <div style="flex: 1;">
          <DsTextarea label="Small" size="small" v-model="small" placeholder="Small textarea" />
        </div>
        <div style="flex: 1;">
          <DsTextarea label="Medium" size="medium" v-model="medium" placeholder="Medium textarea" />
        </div>
      </div>
    `,
  }),
};

export const AllStates: Story = {
  render: () => ({
    components: { DsTextarea },
    setup() {
      const defaultVal = ref('');
      const filled = ref('Filled value with some text content');
      const errorVal = ref('Invalid input');
      const disabledVal = ref('Disabled content');
      const counterVal = ref('');
      const overflowVal = ref('This exceeds the limit');
      return { defaultVal, filled, errorVal, disabledVal, counterVal, overflowVal };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px; max-width: 400px;">
        <DsTextarea label="Default" v-model="defaultVal" placeholder="Enter text..." />
        <DsTextarea label="Filled" v-model="filled" />
        <DsTextarea label="Error" error="Something went wrong" v-model="errorVal" />
        <DsTextarea label="Disabled" disabled v-model="disabledVal" />
        <DsTextarea label="With Counter" :max-length="100" v-model="counterVal" hint="Character counter example" />
        <DsTextarea label="Counter Overflow" :max-length="10" v-model="overflowVal" />
      </div>
    `,
  }),
};
