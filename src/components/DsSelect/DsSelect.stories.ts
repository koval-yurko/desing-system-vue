import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import DsIcon from '../DsIcon/DsIcon.vue';
import DsSelect from './DsSelect.vue';

const simpleOptions = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

const objectOptions = [
  { name: 'United States', code: 'US' },
  { name: 'United Kingdom', code: 'UK' },
  { name: 'Germany', code: 'DE' },
  { name: 'France', code: 'FR' },
  { name: 'Japan', code: 'JP' },
];

const twoLineOptions = [
  { name: 'John Doe', role: 'Software Engineer' },
  { name: 'Jane Smith', role: 'Product Manager' },
  { name: 'Bob Wilson', role: 'UX Designer' },
  { name: 'Alice Brown', role: 'Data Scientist' },
];

const meta = {
  title: 'Components/DsSelect',
  component: DsSelect,
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
    modelValue: { control: 'text' },
  },
  args: {
    size: 'medium',
    label: 'Label',
    disabled: false,
    mandatory: false,
    optional: false,
    info: false,
  },
} satisfies Meta<typeof DsSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template:
      '<DsSelect v-bind="args" v-model="value" :options="options" placeholder="Select a fruit" />',
    data: () => ({ options: simpleOptions }),
  }),
};

export const WithLabel: Story = {
  args: { label: 'Fruit' },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template:
      '<DsSelect v-bind="args" v-model="value" :options="options" placeholder="Select a fruit" />',
    data: () => ({ options: simpleOptions }),
  }),
};

export const Mandatory: Story = {
  args: { label: 'Country', mandatory: true },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template:
      '<DsSelect v-bind="args" v-model="value" :options="options" option-label="name" option-value="code" placeholder="Select a country" />',
    data: () => ({ options: objectOptions }),
  }),
};

export const Optional: Story = {
  args: { label: 'Preference', optional: true },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template:
      '<DsSelect v-bind="args" v-model="value" :options="options" placeholder="Select a fruit" />',
    data: () => ({ options: simpleOptions }),
  }),
};

export const WithInfo: Story = {
  args: { label: 'Category', info: true },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template:
      '<DsSelect v-bind="args" v-model="value" :options="options" placeholder="Select a category" />',
    data: () => ({ options: simpleOptions }),
  }),
};

export const WithHint: Story = {
  args: { label: 'Fruit', hint: 'Choose your favorite fruit' },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template:
      '<DsSelect v-bind="args" v-model="value" :options="options" placeholder="Select a fruit" />',
    data: () => ({ options: simpleOptions }),
  }),
};

export const WithError: Story = {
  args: {
    label: 'Country',
    error: 'Please select a country',
  },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template:
      '<DsSelect v-bind="args" v-model="value" :options="options" option-label="name" option-value="code" placeholder="Select a country" />',
    data: () => ({ options: objectOptions }),
  }),
};

export const Disabled: Story = {
  args: { label: 'Fruit', disabled: true },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref('Apple');
      return { args, value };
    },
    template:
      '<DsSelect v-bind="args" v-model="value" :options="options" placeholder="Select a fruit" />',
    data: () => ({ options: simpleOptions }),
  }),
};

export const Filled: Story = {
  args: { label: 'Fruit' },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref('Cherry');
      return { args, value };
    },
    template:
      '<DsSelect v-bind="args" v-model="value" :options="options" placeholder="Select a fruit" />',
    data: () => ({ options: simpleOptions }),
  }),
};

export const WithLeadingIcon: Story = {
  args: { label: 'Search country' },
  render: (args) => ({
    components: { DsSelect, DsIcon },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `
      <DsSelect v-bind="args" v-model="value" :options="options" option-label="name" option-value="code" placeholder="Select a country">
        <template #leading>
          <DsIcon name="search" size="medium" />
        </template>
      </DsSelect>
    `,
    data: () => ({ options: objectOptions }),
  }),
};

export const ClearButton: Story = {
  args: { label: 'Fruit (clear me)' },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref('Banana');
      return { args, value };
    },
    template:
      '<DsSelect v-bind="args" v-model="value" :options="options" placeholder="Select a fruit" />',
    data: () => ({ options: simpleOptions }),
  }),
};

export const TwoLineOptions: Story = {
  args: { label: 'Assignee' },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `
      <DsSelect v-bind="args" v-model="value" :options="options" option-label="name" placeholder="Select a person" panel-class="ds-select-panel--two-line">
        <template #option="{ option }">
          <div class="ds-select-two-line">
            <div class="ds-select-two-line__title">{{ option.name }}</div>
            <div class="ds-select-two-line__subtitle">{{ option.role }}</div>
          </div>
        </template>
      </DsSelect>
    `,
    data: () => ({ options: twoLineOptions }),
  }),
};

export const NoMatch: Story = {
  args: { label: 'Fruit' },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template:
      '<DsSelect v-bind="args" v-model="value" :options="[]" placeholder="Select a fruit" empty-message="No items match your search" />',
  }),
};

export const DisabledWithError: Story = {
  args: {
    label: 'Country',
    disabled: true,
    error: 'Please select a country',
  },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template:
      '<DsSelect v-bind="args" v-model="value" :options="options" option-label="name" option-value="code" placeholder="Select a country" />',
    data: () => ({ options: objectOptions }),
  }),
};

export const ErrorWithHint: Story = {
  args: {
    label: 'Country',
    hint: 'Select the country where you reside',
    error: 'Country is required',
  },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template:
      '<DsSelect v-bind="args" v-model="value" :options="options" option-label="name" option-value="code" placeholder="Select a country" />',
    data: () => ({ options: objectOptions }),
  }),
};

export const AllSizes: Story = {
  render: () => ({
    components: { DsSelect },
    setup() {
      const small = ref(null);
      const medium = ref(null);
      return { small, medium, options: simpleOptions };
    },
    template: `
      <div style="display: flex; gap: 24px; align-items: flex-start;">
        <div style="flex: 1;">
          <DsSelect label="Small" size="small" v-model="small" :options="options" placeholder="Select..." />
        </div>
        <div style="flex: 1;">
          <DsSelect label="Medium" size="medium" v-model="medium" :options="options" placeholder="Select..." />
        </div>
      </div>
    `,
  }),
};

export const AllStates: Story = {
  render: () => ({
    components: { DsSelect },
    setup() {
      const defaultVal = ref(null);
      const filled = ref('Cherry');
      const errorVal = ref(null);
      const disabledVal = ref('Apple');
      return { defaultVal, filled, errorVal, disabledVal, options: simpleOptions };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px; max-width: 320px;">
        <DsSelect label="Default" v-model="defaultVal" :options="options" placeholder="Select..." />
        <DsSelect label="Filled" v-model="filled" :options="options" placeholder="Select..." />
        <DsSelect label="Error" error="Something went wrong" v-model="errorVal" :options="options" placeholder="Select..." />
        <DsSelect label="Disabled" disabled v-model="disabledVal" :options="options" placeholder="Select..." />
      </div>
    `,
  }),
};
