import type { Meta, StoryObj } from '@storybook/vue3';
import DsIcon from '../DsIcon/DsIcon.vue';
import DsIconButton from './DsIconButton.vue';

const meta: Meta<typeof DsIconButton> = {
  title: 'Components/DsIconButton',
  component: DsIconButton,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['primary', 'outlined', 'text'],
    },
    size: {
      control: 'select',
      options: ['xsmall', 'small', 'medium'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    ariaLabel: { control: 'text' },
  },
  args: {
    type: 'primary',
    size: 'medium',
    disabled: false,
    loading: false,
    ariaLabel: 'Edit',
  },
};

export default meta;
type Story = StoryObj<typeof DsIconButton>;

export const Primary: Story = {
  render: (args) => ({
    components: { DsIconButton, DsIcon },
    setup() {
      return { args };
    },
    template: `
      <DsIconButton v-bind="args">
        <DsIcon name="edit" />
      </DsIconButton>
    `,
  }),
};

export const Outlined: Story = {
  args: { type: 'outlined' },
  render: (args) => ({
    components: { DsIconButton, DsIcon },
    setup() {
      return { args };
    },
    template: `
      <DsIconButton v-bind="args">
        <DsIcon name="edit" />
      </DsIconButton>
    `,
  }),
};

export const Text: Story = {
  args: { type: 'text' },
  render: (args) => ({
    components: { DsIconButton, DsIcon },
    setup() {
      return { args };
    },
    template: `
      <DsIconButton v-bind="args">
        <DsIcon name="edit" />
      </DsIconButton>
    `,
  }),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => ({
    components: { DsIconButton, DsIcon },
    setup() {
      return { args };
    },
    template: `
      <DsIconButton v-bind="args">
        <DsIcon name="edit" />
      </DsIconButton>
    `,
  }),
};

export const Loading: Story = {
  args: { loading: true },
  render: (args) => ({
    components: { DsIconButton, DsIcon },
    setup() {
      return { args };
    },
    template: `
      <DsIconButton v-bind="args">
        <DsIcon name="edit" />
      </DsIconButton>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    components: { DsIconButton, DsIcon },
    template: `
      <div style="display: flex; align-items: center; gap: 12px;">
        <DsIconButton size="xsmall" aria-label="Edit"><DsIcon name="edit" size="xsmall" /></DsIconButton>
        <DsIconButton size="small" aria-label="Edit"><DsIcon name="edit" size="small" /></DsIconButton>
        <DsIconButton size="medium" aria-label="Edit"><DsIcon name="edit" /></DsIconButton>
      </div>
    `,
  }),
};
