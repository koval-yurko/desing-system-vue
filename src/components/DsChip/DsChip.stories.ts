import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { nextTick, ref } from 'vue';
import DsIcon from '../DsIcon/DsIcon.vue';
import DsChip from './DsChip.vue';

const meta = {
  title: 'Components/DsChip',
  component: DsChip,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'selected', 'not-clickable'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
    disabled: { control: 'boolean' },
    removable: { control: 'boolean' },
    label: { control: 'text' },
    removeAriaLabel: { control: 'text' },
  },
  args: {
    type: 'default',
    size: 'medium',
    label: 'MDS Entries',
    disabled: false,
    removable: false,
  },
} satisfies Meta<typeof DsChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { DsChip },
    setup() {
      return { args };
    },
    template: '<DsChip v-bind="args" />',
  }),
};

export const DefaultSmall: Story = {
  args: { size: 'small' },
  render: (args) => ({
    components: { DsChip },
    setup() {
      return { args };
    },
    template: '<DsChip v-bind="args" />',
  }),
};

export const Selected: Story = {
  args: { type: 'selected' },
  render: (args) => ({
    components: { DsChip },
    setup() {
      return { args };
    },
    template: '<DsChip v-bind="args" />',
  }),
};

export const SelectedSmall: Story = {
  args: { type: 'selected', size: 'small' },
  render: (args) => ({
    components: { DsChip },
    setup() {
      return { args };
    },
    template: '<DsChip v-bind="args" />',
  }),
};

export const NotClickable: Story = {
  args: { type: 'not-clickable' },
  render: (args) => ({
    components: { DsChip },
    setup() {
      return { args };
    },
    template: '<DsChip v-bind="args" />',
  }),
};

export const NotClickableSmall: Story = {
  args: { type: 'not-clickable', size: 'small' },
  render: (args) => ({
    components: { DsChip },
    setup() {
      return { args };
    },
    template: '<DsChip v-bind="args" />',
  }),
};

export const WithLeadingIcon: Story = {
  args: { size: 'medium', label: 'Column' },
  render: (args) => ({
    components: { DsChip, DsIcon },
    setup() {
      return { args };
    },
    template: `
      <DsChip v-bind="args">
        <template #leading>
          <DsIcon name="column-view" size="small" :style="{ width: '18px', height: '18px' }" />
        </template>
        {{ args.label }}
      </DsChip>
    `,
  }),
};

export const WithTrailingChevron: Story = {
  args: { size: 'medium', label: 'MDS Entries' },
  render: (args) => ({
    components: { DsChip, DsIcon },
    setup() {
      return { args };
    },
    template: `
      <DsChip v-bind="args">
        {{ args.label }}
        <template #trailing>
          <DsIcon name="nav-arrow-down" size="small" :style="{ width: '18px', height: '18px' }" />
        </template>
      </DsChip>
    `,
  }),
};

export const Removable: Story = {
  args: { size: 'small', removable: true, label: 'Filter' },
  render: (args) => ({
    components: { DsChip },
    setup() {
      const removed = ref(false);
      function handleRemove() {
        removed.value = true;
      }
      return { args, removed, handleRemove };
    },
    template: `
      <div>
        <DsChip v-if="!removed" v-bind="args" @remove="handleRemove" />
        <span v-else style="color: var(--p-gray-600); font-family: Inter, sans-serif; font-size: 14px;">
          Chip removed (refresh to restore)
        </span>
      </div>
    `,
  }),
};

export const SelectedRemovable: Story = {
  args: { size: 'small', type: 'selected', removable: true, label: 'Active' },
  render: (args) => ({
    components: { DsChip },
    setup() {
      const removed = ref(false);
      function handleRemove() {
        removed.value = true;
      }
      return { args, removed, handleRemove };
    },
    template: `
      <div>
        <DsChip v-if="!removed" v-bind="args" @remove="handleRemove" />
        <span v-else style="color: var(--p-gray-600); font-family: Inter, sans-serif; font-size: 14px;">
          Chip removed (refresh to restore)
        </span>
      </div>
    `,
  }),
};

export const AllVariantsGrid: Story = {
  decorators: [
    (story) => ({
      components: { story },
      template: `
        <div class="ds-chip-all-variants-grid">
          <style>
            .ds-chip-all-variants-grid .story-force-hover.ds-chip--default { background-color: var(--p-gray-100); border-color: var(--p-gray-500); }
            .ds-chip-all-variants-grid .story-force-hover.ds-chip--selected { background-color: var(--p-purple-100); border-color: var(--p-purple-800); }
          </style>
          <story />
        </div>
      `,
    }),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'All chip variants with a `.story-force-hover` class used to preview hover styles without real mouse hover. The style block is scoped to the `.ds-chip-all-variants-grid` wrapper so the forced-hover rules never match chips in other stories.',
      },
    },
  },
  render: () => ({
    components: { DsChip },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; font-family: Inter, sans-serif;">
        <section>
          <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 8px 0; color: var(--p-gray-700);">Type=Default × Size=M (idle / hover)</h3>
          <div style="display: flex; gap: 12px; align-items: center;">
            <DsChip label="Default M" />
            <DsChip label="Default M — hover" class="story-force-hover" />
          </div>
        </section>
        <section>
          <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 8px 0; color: var(--p-gray-700);">Type=Default × Size=S (idle / hover)</h3>
          <div style="display: flex; gap: 12px; align-items: center;">
            <DsChip size="small" label="Default S" />
            <DsChip size="small" label="Default S — hover" class="story-force-hover" />
          </div>
        </section>
        <section>
          <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 8px 0; color: var(--p-gray-700);">Type=Selected (M / S × idle / hover)</h3>
          <div style="display: flex; gap: 12px; align-items: center;">
            <DsChip type="selected" label="Selected M" />
            <DsChip type="selected" label="Selected M — hover" class="story-force-hover" />
            <DsChip type="selected" size="small" label="Selected S" />
            <DsChip type="selected" size="small" label="Selected S — hover" class="story-force-hover" />
          </div>
        </section>
        <section>
          <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 8px 0; color: var(--p-gray-700);">Type=Not clickable (M / S)</h3>
          <div style="display: flex; gap: 12px; align-items: center;">
            <DsChip type="not-clickable" label="Not clickable M" />
            <DsChip type="not-clickable" size="small" label="Not clickable S" />
          </div>
        </section>
      </div>
    `,
  }),
};

export const RemovableList: Story = {
  render: () => ({
    components: { DsChip },
    setup() {
      const chips = ref([
        { id: 1, label: 'React' },
        { id: 2, label: 'Vue' },
        { id: 3, label: 'Svelte' },
        { id: 4, label: 'Angular' },
      ]);
      const chipRefs = ref(new Map<number, { $el: HTMLElement }>());

      async function handleRemove(id: number) {
        const index = chips.value.findIndex((c) => c.id === id);
        if (index === -1) return;
        chips.value.splice(index, 1);
        chipRefs.value.delete(id);
        await nextTick();
        // Move focus to the chip that took the removed chip's position, or to the last remaining chip
        const nextChip = chips.value[index] ?? chips.value[chips.value.length - 1];
        if (nextChip) {
          const instance = chipRefs.value.get(nextChip.id);
          const button = instance?.$el?.querySelector<HTMLButtonElement>('.ds-chip__remove');
          button?.focus();
        } else {
          document.getElementById('removable-list-fallback')?.focus();
        }
      }

      function setRef(el: unknown, id: number) {
        if (el) {
          chipRefs.value.set(id, el as { $el: HTMLElement });
        } else {
          chipRefs.value.delete(id);
        }
      }

      return { chips, handleRemove, setRef };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; font-family: Inter, sans-serif;">
        <p style="margin: 0; color: var(--p-gray-700); font-size: 14px;">
          Remove any chip via X / Enter / Space. Focus moves to the next remaining chip automatically.
        </p>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <DsChip
            v-for="chip in chips"
            :key="chip.id"
            :ref="(el) => setRef(el, chip.id)"
            size="small"
            removable
            :label="chip.label"
            @remove="handleRemove(chip.id)"
          />
        </div>
        <button
          id="removable-list-fallback"
          type="button"
          style="align-self: flex-start; padding: 6px 12px; border: 1px solid var(--p-gray-400); border-radius: 8px; background: var(--p-surface-0); font-family: inherit; font-size: 14px; cursor: pointer;"
        >
          Fallback focus target
        </button>
      </div>
    `,
  }),
};
