import type { Meta, StoryObj } from '@storybook/vue3';
import DsInputText from './DsInputText.vue';

const meta: Meta<typeof DsInputText> = {
  title: 'Components/DsInputText',
  component: DsInputText,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DsInputText>;

export const Default: Story = {};
