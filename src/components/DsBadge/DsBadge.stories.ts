import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DsIcon from '../DsIcon/DsIcon.vue';
import DsBadge from './DsBadge.vue';

const meta = {
  title: 'Components/DsBadge',
  component: DsBadge,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: [
        'pending',
        'interesting',
        'neutral',
        'rejected',
        'accepted',
        'cancel',
        'border',
        'clean',
        'draft',
        'loaded',
        'type10',
      ],
    },
    showLIcon: { control: 'boolean' },
    showRIcon: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    type: 'pending',
    label: 'Text',
    showLIcon: false,
    showRIcon: false,
  },
} satisfies Meta<typeof DsBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = {
  args: { type: 'pending', label: 'Pending' },
  render: (args) => ({
    components: { DsBadge },
    setup() {
      return { args };
    },
    template: '<DsBadge v-bind="args" />',
  }),
};

export const Interesting: Story = {
  args: { type: 'interesting', label: 'Interesting' },
  render: (args) => ({
    components: { DsBadge },
    setup() {
      return { args };
    },
    template: '<DsBadge v-bind="args" />',
  }),
};

export const Neutral: Story = {
  args: { type: 'neutral', label: 'Neutral' },
  render: (args) => ({
    components: { DsBadge },
    setup() {
      return { args };
    },
    template: '<DsBadge v-bind="args" />',
  }),
};

export const Rejected: Story = {
  args: { type: 'rejected', label: 'Rejected' },
  render: (args) => ({
    components: { DsBadge },
    setup() {
      return { args };
    },
    template: '<DsBadge v-bind="args" />',
  }),
};

export const Accepted: Story = {
  args: { type: 'accepted', label: 'Accepted' },
  render: (args) => ({
    components: { DsBadge },
    setup() {
      return { args };
    },
    template: '<DsBadge v-bind="args" />',
  }),
};

export const Cancel: Story = {
  args: { type: 'cancel', label: 'Cancelled' },
  render: (args) => ({
    components: { DsBadge },
    setup() {
      return { args };
    },
    template: '<DsBadge v-bind="args" />',
  }),
};

export const Border: Story = {
  args: { type: 'border', label: 'Border' },
  render: (args) => ({
    components: { DsBadge },
    setup() {
      return { args };
    },
    template: '<DsBadge v-bind="args" />',
  }),
};

export const Clean: Story = {
  args: { type: 'clean', label: 'Clean' },
  render: (args) => ({
    components: { DsBadge },
    setup() {
      return { args };
    },
    template: '<DsBadge v-bind="args" />',
  }),
};

export const Draft: Story = {
  args: { type: 'draft', label: 'Draft' },
  render: (args) => ({
    components: { DsBadge },
    setup() {
      return { args };
    },
    template: '<DsBadge v-bind="args" />',
  }),
};

export const Loaded: Story = {
  args: { type: 'loaded' },
  render: (args) => ({
    components: { DsBadge },
    setup() {
      return { args };
    },
    template: '<DsBadge v-bind="args" />',
  }),
};

export const Type10: Story = {
  args: { type: 'type10', label: 'Type10' },
  render: (args) => ({
    components: { DsBadge },
    setup() {
      return { args };
    },
    template: '<DsBadge v-bind="args" />',
  }),
};

export const WithLeadingIcon: Story = {
  args: { type: 'pending', label: 'Pending', showLIcon: true },
  render: (args) => ({
    components: { DsBadge, DsIcon },
    setup() {
      return { args };
    },
    template: `
      <DsBadge v-bind="args">
        <template #leading>
          <DsIcon name="success" :style="{ width: '12px', height: '12px' }" />
        </template>
        {{ args.label }}
      </DsBadge>
    `,
  }),
};

export const WithTrailingIcon: Story = {
  args: { type: 'pending', label: 'Pending', showRIcon: true },
  render: (args) => ({
    components: { DsBadge, DsIcon },
    setup() {
      return { args };
    },
    template: `
      <DsBadge v-bind="args">
        {{ args.label }}
        <template #trailing>
          <DsIcon name="arrow-right" :style="{ width: '12px', height: '12px' }" />
        </template>
      </DsBadge>
    `,
  }),
};

export const WithBothIcons: Story = {
  args: { type: 'border', label: 'Border', showLIcon: true, showRIcon: true },
  render: (args) => ({
    components: { DsBadge, DsIcon },
    setup() {
      return { args };
    },
    template: `
      <DsBadge v-bind="args">
        <template #leading>
          <DsIcon name="info-filled" :style="{ width: '12px', height: '12px' }" />
        </template>
        {{ args.label }}
        <template #trailing>
          <DsIcon name="arrow-right" :style="{ width: '12px', height: '12px' }" />
        </template>
      </DsBadge>
    `,
  }),
};

export const CleanHover: Story = {
  args: { type: 'clean', label: 'Clean (hover pinned)' },
  render: (args) => ({
    components: { DsBadge },
    setup() {
      return { args };
    },
    template: `
      <DsBadge v-bind="args" style="background-color: var(--p-gray-300);" />
    `,
  }),
};

export const AllVariantsGrid: Story = {
  render: () => ({
    components: { DsBadge },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; font-family: Inter, sans-serif;">
        <section>
          <h3 style="font-size: 12px; font-weight: 600; margin: 0 0 8px 0; color: var(--p-gray-700); text-transform: uppercase; letter-spacing: 0.5px;">
            All 11 Variants (Figma node 2014:9896)
          </h3>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
            <DsBadge type="pending" label="Pending" />
            <DsBadge type="interesting" label="Interesting" />
            <DsBadge type="neutral" label="Neutral" />
            <DsBadge type="rejected" label="Rejected" />
            <DsBadge type="accepted" label="Accepted" />
            <DsBadge type="cancel" label="Cancelled" />
            <DsBadge type="border" label="Border" />
            <DsBadge type="clean" label="Clean" />
            <DsBadge type="draft" label="Draft" />
            <DsBadge type="loaded" />
            <DsBadge type="type10" label="Type10" />
          </div>
        </section>

        <section>
          <h3 style="font-size: 12px; font-weight: 600; margin: 0 0 8px 0; color: var(--p-gray-700); text-transform: uppercase; letter-spacing: 0.5px;">
            With Icons
          </h3>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
            <DsBadge type="pending" label="Pending" :showLIcon="true" />
            <DsBadge type="accepted" label="Accepted" :showLIcon="true" />
            <DsBadge type="rejected" label="Rejected" :showLIcon="true" />
            <DsBadge type="neutral" label="Neutral" :showRIcon="true" />
            <DsBadge type="border" label="Border" :showLIcon="true" :showRIcon="true" />
          </div>
        </section>

        <section>
          <h3 style="font-size: 12px; font-weight: 600; margin: 0 0 8px 0; color: var(--p-gray-700); text-transform: uppercase; letter-spacing: 0.5px;">
            Hover States: clean (idle → hover) + type10 (always static hover-target)
          </h3>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
            <DsBadge type="clean" label="Clean (idle)" />
            <DsBadge type="clean" label="Clean (hover pinned)" style="background-color: var(--p-gray-300);" />
            <DsBadge type="type10" label="Type10 (hover-target)" />
          </div>
        </section>
      </div>
    `,
  }),
};
