import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DsIcon from './DsIcon.vue';

const meta = {
  title: 'Components/DsIcon',
  component: DsIcon,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    size: {
      control: 'select',
      options: ['xsmall', 'small', 'medium', 'large'],
    },
    ariaLabel: { control: 'text' },
  },
  args: {
    name: 'edit',
    size: 'medium',
  },
} satisfies Meta<typeof DsIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { DsIcon },
    setup() {
      return { args };
    },
    template: '<DsIcon v-bind="args" />',
  }),
};

export const AllSizes: Story = {
  render: () => ({
    components: { DsIcon },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <DsIcon name="edit" size="xsmall" />
          <span style="font-size: 12px; color: #62748e;">xsmall (12px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <DsIcon name="edit" size="small" />
          <span style="font-size: 12px; color: #62748e;">small (16px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <DsIcon name="edit" size="medium" />
          <span style="font-size: 12px; color: #62748e;">medium (20px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <DsIcon name="edit" size="large" />
          <span style="font-size: 12px; color: #62748e;">large (24px)</span>
        </div>
      </div>
    `,
  }),
};

export const WithAriaLabel: Story = {
  args: {
    name: 'edit',
    ariaLabel: 'Edit item',
  },
  render: (args) => ({
    components: { DsIcon },
    setup() {
      return { args };
    },
    template: '<DsIcon v-bind="args" />',
  }),
};

export const ColorInheritance: Story = {
  render: () => ({
    components: { DsIcon },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; color: #7849ff;">
          <DsIcon name="edit" size="large" />
          <span style="font-size: 12px;">Purple</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; color: #f22a42;">
          <DsIcon name="edit" size="large" />
          <span style="font-size: 12px;">Red</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; color: #0e5cf4;">
          <DsIcon name="edit" size="large" />
          <span style="font-size: 12px;">Blue</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; color: #314158;">
          <DsIcon name="edit" size="large" />
          <span style="font-size: 12px;">Gray</span>
        </div>
      </div>
    `,
  }),
};
