import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DsAvatar from './DsAvatar.vue';

const SIZES = ['large', 'medium', 'small', 'xsmall'] as const;
const COLORS = [
  'blue',
  'light-purple',
  'yellow',
  'pink',
  'purple',
  'deep-blue',
  'turquoise',
  'orange',
  'red',
] as const;

const meta = {
  title: 'Components/DsAvatar',
  component: DsAvatar,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['initials-colored', 'initials-monochrome', 'icon', 'image'],
    },
    size: {
      control: 'select',
      options: SIZES,
    },
    color: {
      control: 'select',
      options: COLORS,
    },
    initials: { control: 'text' },
    image: { control: 'text' },
    alt: { control: 'text' },
    ariaLabel: { control: 'text' },
  },
  args: {
    size: 'medium',
    initials: 'EM',
    color: 'blue',
  },
} satisfies Meta<typeof DsAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ColoredInitials: Story = {
  args: { initials: 'EM', color: 'blue' },
  render: (args) => ({
    components: { DsAvatar },
    setup() {
      return { args };
    },
    template: '<DsAvatar v-bind="args" />',
  }),
};

export const MonochromeInitials: Story = {
  args: { initials: 'EM', color: undefined },
  render: (args) => ({
    components: { DsAvatar },
    setup() {
      return { args };
    },
    template: '<DsAvatar v-bind="args" />',
  }),
};

export const IconFallback: Story = {
  args: { initials: undefined, color: undefined, image: undefined },
  render: (args) => ({
    components: { DsAvatar },
    setup() {
      return { args };
    },
    template: '<DsAvatar v-bind="args" />',
  }),
};

export const Image: Story = {
  args: {
    initials: undefined,
    color: undefined,
    image: 'https://i.pravatar.cc/80?u=ds-avatar-sample',
    alt: 'Sample user photo',
  },
  render: (args) => ({
    components: { DsAvatar },
    setup() {
      return { args };
    },
    template: '<DsAvatar v-bind="args" />',
  }),
};

export const ImageFallbackToInitials: Story = {
  args: {
    initials: 'EM',
    color: 'purple',
    image: 'https://invalid.example/does-not-exist.png',
    alt: 'Broken image, initials shown',
  },
  render: (args) => ({
    components: { DsAvatar },
    setup() {
      return { args };
    },
    template: '<DsAvatar v-bind="args" />',
  }),
};

export const ImageFallbackToIcon: Story = {
  args: {
    initials: undefined,
    color: undefined,
    image: 'https://invalid.example/also-broken.png',
    alt: 'Broken image, icon shown',
  },
  render: (args) => ({
    components: { DsAvatar },
    setup() {
      return { args };
    },
    template: '<DsAvatar v-bind="args" />',
  }),
};

export const AllSizesColored: Story = {
  args: { initials: 'EM', color: 'blue' },
  render: (args) => ({
    components: { DsAvatar },
    setup() {
      return { args, sizes: SIZES };
    },
    template: `
      <div style="display: inline-flex; align-items: center; gap: 12px;">
        <DsAvatar v-for="s in sizes" :key="s" v-bind="args" :size="s" />
      </div>
    `,
  }),
};

export const AllSizesMonochrome: Story = {
  args: { initials: 'EM', color: undefined },
  render: (args) => ({
    components: { DsAvatar },
    setup() {
      return { args, sizes: SIZES };
    },
    template: `
      <div style="display: inline-flex; align-items: center; gap: 12px;">
        <DsAvatar v-for="s in sizes" :key="s" v-bind="args" :size="s" />
      </div>
    `,
  }),
};

export const AllSizesIcon: Story = {
  args: { initials: undefined, color: undefined },
  render: (args) => ({
    components: { DsAvatar },
    setup() {
      return { args, sizes: SIZES };
    },
    template: `
      <div style="display: inline-flex; align-items: center; gap: 12px;">
        <DsAvatar v-for="s in sizes" :key="s" v-bind="args" :size="s" />
      </div>
    `,
  }),
};

export const AllColors: Story = {
  args: { initials: 'EM' },
  render: (args) => ({
    components: { DsAvatar },
    setup() {
      return { args, sizes: SIZES, colors: COLORS };
    },
    template: `
      <div style="display: grid; grid-template-columns: 120px repeat(4, 60px); gap: 12px; align-items: center;">
        <div></div>
        <div v-for="s in sizes" :key="s" style="font-family: Inter, sans-serif; font-size: 12px; color: var(--p-gray-600); text-align: center;">
          {{ s.toUpperCase() }}
        </div>
        <template v-for="c in colors" :key="c">
          <div style="font-family: Inter, sans-serif; font-size: 12px; color: var(--p-gray-700);">
            {{ c }}
          </div>
          <div v-for="s in sizes" :key="s" style="display: flex; justify-content: center;">
            <DsAvatar v-bind="args" :color="c" :size="s" />
          </div>
        </template>
      </div>
    `,
  }),
};
