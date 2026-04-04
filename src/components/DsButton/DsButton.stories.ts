import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DsIcon from '../DsIcon/DsIcon.vue';
import DsButton from './DsButton.vue';

const meta = {
  title: 'Components/DsButton',
  component: DsButton,
  tags: ['autodocs'],
  argTypes: {
    severity: {
      control: 'select',
      options: ['primary', 'outlined', 'tertiary', 'text', 'text-link', 'negative'],
    },
    size: {
      control: 'select',
      options: ['xsmall', 'small', 'medium', 'large'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  args: {
    severity: 'primary',
    size: 'medium',
    disabled: false,
    loading: false,
  },
} satisfies Meta<typeof DsButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { DsButton },
    setup() {
      return { args };
    },
    template: '<DsButton v-bind="args">Button</DsButton>',
  }),
};

export const Primary: Story = {
  args: { severity: 'primary' },
  render: (args) => ({
    components: { DsButton },
    setup() {
      return { args };
    },
    template: '<DsButton v-bind="args">Primary</DsButton>',
  }),
};

export const Outlined: Story = {
  args: { severity: 'outlined' },
  render: (args) => ({
    components: { DsButton },
    setup() {
      return { args };
    },
    template: '<DsButton v-bind="args">Outlined</DsButton>',
  }),
};

export const Tertiary: Story = {
  args: { severity: 'tertiary' },
  render: (args) => ({
    components: { DsButton },
    setup() {
      return { args };
    },
    template: '<DsButton v-bind="args">Tertiary</DsButton>',
  }),
};

export const Text: Story = {
  args: { severity: 'text' },
  render: (args) => ({
    components: { DsButton },
    setup() {
      return { args };
    },
    template: '<DsButton v-bind="args">Text</DsButton>',
  }),
};

export const TextLink: Story = {
  args: { severity: 'text-link' },
  render: (args) => ({
    components: { DsButton },
    setup() {
      return { args };
    },
    template: '<DsButton v-bind="args">Text Link</DsButton>',
  }),
};

export const Negative: Story = {
  args: { severity: 'negative' },
  render: (args) => ({
    components: { DsButton },
    setup() {
      return { args };
    },
    template: '<DsButton v-bind="args">Negative</DsButton>',
  }),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => ({
    components: { DsButton },
    setup() {
      return { args };
    },
    template: '<DsButton v-bind="args">Disabled</DsButton>',
  }),
};

export const Loading: Story = {
  args: { loading: true },
  render: (args) => ({
    components: { DsButton },
    setup() {
      return { args };
    },
    template: '<DsButton v-bind="args">Loading</DsButton>',
  }),
};

export const AllSizes: Story = {
  render: () => ({
    components: { DsButton },
    template: `
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <DsButton severity="primary" size="xsmall">XSmall</DsButton>
        <DsButton severity="primary" size="small">Small</DsButton>
        <DsButton severity="primary" size="medium">Medium</DsButton>
        <DsButton severity="primary" size="large">Large</DsButton>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    components: { DsButton },
    template: `
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <DsButton severity="primary">Primary</DsButton>
        <DsButton severity="outlined">Outlined</DsButton>
        <DsButton severity="tertiary">Tertiary</DsButton>
        <DsButton severity="text">Text</DsButton>
        <DsButton severity="text-link">Text Link</DsButton>
        <DsButton severity="negative">Negative</DsButton>
      </div>
    `,
  }),
};

export const WithLeftIcon: Story = {
  render: (args) => ({
    components: { DsButton, DsIcon },
    setup() {
      return { args };
    },
    template: `
      <DsButton v-bind="args">
        <template #icon><DsIcon name="arrow-left" /></template>
        Back
      </DsButton>
    `,
  }),
};

export const WithRightIcon: Story = {
  render: (args) => ({
    components: { DsButton, DsIcon },
    setup() {
      return { args };
    },
    template: `
      <DsButton v-bind="args" icon-pos="right">
        <template #icon><DsIcon name="arrow-right" /></template>
        Next
      </DsButton>
    `,
  }),
};
