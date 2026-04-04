import type { Meta, StoryObj } from '@storybook/vue3';
import DsLink from './DsLink.vue';

const meta: Meta<typeof DsLink> = {
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
};

export default meta;
type Story = StoryObj<typeof DsLink>;

export const Regular: Story = {
  render: (args) => ({
    components: { DsLink },
    setup() {
      return { args };
    },
    template: '<DsLink v-bind="args">Link Link</DsLink>',
  }),
};
