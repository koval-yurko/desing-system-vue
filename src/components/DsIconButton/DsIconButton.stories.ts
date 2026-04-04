import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DsIcon from '../DsIcon/DsIcon.vue';
import DsIconButton from './DsIconButton.vue';

const meta = {
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
} satisfies Meta<typeof DsIconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

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
        <DsIconButton size="xsmall" ariaLabel="Edit"><DsIcon name="edit" size="xsmall" /></DsIconButton>
        <DsIconButton size="small" ariaLabel="Edit"><DsIcon name="edit" size="small" /></DsIconButton>
        <DsIconButton size="medium" ariaLabel="Edit"><DsIcon name="edit" /></DsIconButton>
      </div>
    `,
  }),
};

export const AllTypes: Story = {
  render: () => ({
    components: { DsIconButton, DsIcon },
    template: `
      <div style="display: flex; align-items: center; gap: 12px;">
        <DsIconButton type="primary" ariaLabel="Edit"><DsIcon name="edit" /></DsIconButton>
        <DsIconButton type="outlined" ariaLabel="Edit"><DsIcon name="edit" /></DsIconButton>
        <DsIconButton type="text" ariaLabel="Edit"><DsIcon name="edit" /></DsIconButton>
      </div>
    `,
  }),
};
