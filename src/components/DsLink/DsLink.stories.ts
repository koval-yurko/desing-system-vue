import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DsIcon from '../DsIcon/DsIcon.vue';
import DsLink from './DsLink.vue';

const meta = {
  title: 'Components/DsLink',
  component: DsLink,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['regular', 'smart', 'quiet'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
    visibility: {
      control: 'select',
      options: ['high', 'low'],
    },
    disabled: { control: 'boolean' },
    href: { control: 'text' },
  },
  args: {
    type: 'regular',
    size: 'medium',
    visibility: 'high',
    disabled: false,
    href: '#',
  },
} satisfies Meta<typeof DsLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Regular: Story = {
  render: (args) => ({
    components: { DsLink },
    setup() {
      return { args };
    },
    template: '<DsLink v-bind="args">Regular Link</DsLink>',
  }),
};

export const Smart: Story = {
  args: { type: 'smart' },
  render: (args) => ({
    components: { DsLink },
    setup() {
      return { args };
    },
    template: '<DsLink v-bind="args">Smart Link</DsLink>',
  }),
};

export const Quiet: Story = {
  args: { type: 'quiet' },
  render: (args) => ({
    components: { DsLink },
    setup() {
      return { args };
    },
    template: '<DsLink v-bind="args">Quiet Link</DsLink>',
  }),
};

export const LowVisibility: Story = {
  args: { type: 'regular', visibility: 'low' },
  render: (args) => ({
    components: { DsLink },
    setup() {
      return { args };
    },
    template: '<DsLink v-bind="args">Low Visibility Link</DsLink>',
  }),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => ({
    components: { DsLink },
    setup() {
      return { args };
    },
    template: '<DsLink v-bind="args">Disabled Link</DsLink>',
  }),
};

export const AllTypes: Story = {
  render: () => ({
    components: { DsLink },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <DsLink type="regular" href="#">Regular</DsLink>
        <DsLink type="smart" href="#">Smart</DsLink>
        <DsLink type="quiet" href="#">Quiet</DsLink>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    components: { DsLink },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <DsLink size="small" href="#">Small Link</DsLink>
        <DsLink size="medium" href="#">Medium Link</DsLink>
      </div>
    `,
  }),
};

export const WithIcons: Story = {
  render: () => ({
    components: { DsLink, DsIcon },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <DsLink href="#">
          <template #left-icon><DsIcon name="arrow-left" size="small" /></template>
          Back
        </DsLink>
        <DsLink href="#">
          Next
          <template #right-icon><DsIcon name="arrow-right" size="small" /></template>
        </DsLink>
      </div>
    `,
  }),
};
