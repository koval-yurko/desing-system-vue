import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import DsInputText from './DsInputText.vue';

const meta = {
  title: 'Components/DsInputText',
  component: DsInputText,
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
    clearable: { control: 'boolean' },
    showDropdownIcon: { control: 'boolean' },
    modelValue: { control: 'text' },
  },
  args: {
    size: 'medium',
    label: 'Label',
    disabled: false,
    mandatory: false,
    optional: false,
    info: false,
    clearable: false,
    showDropdownIcon: false,
  },
} satisfies Meta<typeof DsInputText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { DsInputText },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsInputText v-bind="args" v-model="value" />',
  }),
};

export const WithLabel: Story = {
  args: { label: 'Email address' },
  render: (args) => ({
    components: { DsInputText },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsInputText v-bind="args" v-model="value" />',
  }),
};

export const Mandatory: Story = {
  args: { label: 'Full name', mandatory: true },
  render: (args) => ({
    components: { DsInputText },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsInputText v-bind="args" v-model="value" />',
  }),
};

export const Optional: Story = {
  args: { label: 'Nickname', optional: true },
  render: (args) => ({
    components: { DsInputText },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsInputText v-bind="args" v-model="value" />',
  }),
};

export const WithInfo: Story = {
  args: { label: 'Username', info: true },
  render: (args) => ({
    components: { DsInputText },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsInputText v-bind="args" v-model="value" />',
  }),
};

export const WithHint: Story = {
  args: { label: 'Password', hint: 'Must be at least 8 characters' },
  render: (args) => ({
    components: { DsInputText },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsInputText v-bind="args" v-model="value" />',
  }),
};

export const WithError: Story = {
  args: {
    label: 'Email',
    error: 'Invalid email address',
    modelValue: 'not-an-email',
  },
  render: (args) => ({
    components: { DsInputText },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsInputText v-bind="args" v-model="value" />',
  }),
};

export const Disabled: Story = {
  args: { label: 'Name', disabled: true, modelValue: 'John Doe' },
  render: (args) => ({
    components: { DsInputText },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsInputText v-bind="args" v-model="value" />',
  }),
};

export const Clearable: Story = {
  args: { label: 'Search', clearable: true, modelValue: 'Search term' },
  render: (args) => ({
    components: { DsInputText },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsInputText v-bind="args" v-model="value" />',
  }),
};

export const WithDropdownIcon: Story = {
  args: { label: 'Country', showDropdownIcon: true },
  render: (args) => ({
    components: { DsInputText },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsInputText v-bind="args" v-model="value" />',
  }),
};

export const DisabledWithError: Story = {
  args: {
    label: 'Email',
    disabled: true,
    error: 'Invalid email address',
    modelValue: 'not-an-email',
  },
  render: (args) => ({
    components: { DsInputText },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsInputText v-bind="args" v-model="value" />',
  }),
};

export const ErrorWithHint: Story = {
  args: {
    label: 'Password',
    hint: 'Must be at least 8 characters',
    error: 'Password is too short',
    modelValue: 'abc',
  },
  render: (args) => ({
    components: { DsInputText },
    setup() {
      const value = ref(args.modelValue || '');
      return { args, value };
    },
    template: '<DsInputText v-bind="args" v-model="value" />',
  }),
};

export const AllSizes: Story = {
  render: () => ({
    components: { DsInputText },
    setup() {
      const small = ref('');
      const medium = ref('');
      return { small, medium };
    },
    template: `
      <div style="display: flex; gap: 24px; align-items: flex-start;">
        <div style="flex: 1;">
          <DsInputText label="Small" size="small" v-model="small" />
        </div>
        <div style="flex: 1;">
          <DsInputText label="Medium" size="medium" v-model="medium" />
        </div>
      </div>
    `,
  }),
};

export const AllStates: Story = {
  render: () => ({
    components: { DsInputText },
    setup() {
      const defaultVal = ref('');
      const filled = ref('Filled value');
      const errorVal = ref('bad input');
      const disabledVal = ref('Disabled value');
      return { defaultVal, filled, errorVal, disabledVal };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px; max-width: 320px;">
        <DsInputText label="Default" v-model="defaultVal" />
        <DsInputText label="Filled" v-model="filled" />
        <DsInputText label="Error" error="Something went wrong" v-model="errorVal" />
        <DsInputText label="Disabled" disabled v-model="disabledVal" />
      </div>
    `,
  }),
};
