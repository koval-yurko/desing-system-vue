import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { nextTick, onMounted, ref } from 'vue';
import DsIcon from '../DsIcon/DsIcon.vue';
import DsSearchField from './DsSearchField.vue';

const meta = {
  title: 'Components/DsSearchField',
  component: DsSearchField,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xxsmall', 'xsmall', 'small', 'medium'],
    },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    clear: {
      control: 'select',
      options: ['auto', 'always', 'never'],
    },
    searchIcon: { control: 'boolean' },
    helpIcon: { control: 'boolean' },
    ariaLabel: { control: 'text' },
    clearAriaLabel: { control: 'text' },
    helpAriaLabel: { control: 'text' },
  },
  args: {
    size: 'medium',
    placeholder: 'Search',
    disabled: false,
    clear: 'auto',
    helpIcon: false,
  },
} satisfies Meta<typeof DsSearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderWithModel =
  (initial = ''): Story['render'] =>
  (args) => ({
    components: { DsSearchField },
    setup() {
      const value = ref(initial);
      return { args, value };
    },
    template: '<DsSearchField v-bind="args" v-model="value" />',
  });

export const Default: Story = {
  render: renderWithModel(),
};

export const DefaultHover: Story = {
  parameters: {
    pseudo: { hover: true },
  },
  render: (args) => ({
    components: { DsSearchField },
    setup() {
      const value = ref('');
      return { args, value };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 360px;">
        <p style="margin: 0; font-size: 12px; color: #6a7d97;">
          Hover the field below to see the Hover state tokens (bg gray-200, border gray-800).
        </p>
        <DsSearchField v-bind="args" v-model="value" />
      </div>
    `,
  }),
};

export const Focused: Story = {
  render: (args) => ({
    components: { DsSearchField },
    setup() {
      const value = ref('');
      const fieldRef = ref<{ $el: HTMLElement } | null>(null);
      onMounted(async () => {
        await nextTick();
        const el = fieldRef.value?.$el as HTMLElement | undefined;
        el?.querySelector('input')?.focus();
      });
      return { args, value, fieldRef };
    },
    template: '<DsSearchField ref="fieldRef" v-bind="args" v-model="value" />',
  }),
};

export const InputText: Story = {
  args: { clear: 'auto' },
  render: renderWithModel('Query text'),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: renderWithModel(''),
};

export const SizeXXSmall: Story = {
  args: { size: 'xxsmall' },
  render: renderWithModel('Sample'),
};

export const SizeXXSmallWithIcon: Story = {
  args: { size: 'xxsmall', searchIcon: true },
  render: renderWithModel('Sample'),
};

export const SizeXSmall: Story = {
  args: { size: 'xsmall' },
  render: renderWithModel('Sample'),
};

export const SizeSmall: Story = {
  args: { size: 'small' },
  render: renderWithModel('Sample'),
};

export const SizeMedium: Story = {
  args: { size: 'medium' },
  render: renderWithModel('Sample'),
};

export const WithHelpIcon: Story = {
  args: { helpIcon: true },
  render: renderWithModel(''),
};

export const WithHelpIconAndClear: Story = {
  args: { helpIcon: true },
  render: renderWithModel('Filter: active'),
};

export const CustomHelpIconSlot: Story = {
  args: { helpIcon: true },
  render: (args) => ({
    components: { DsSearchField, DsIcon },
    setup() {
      const value = ref('');
      return { args, value };
    },
    template: `
      <DsSearchField v-bind="args" v-model="value">
        <template #helpIcon>
          <DsIcon name="filter-b" size="medium" :style="{ width: '20px', height: '20px' }" />
        </template>
      </DsSearchField>
    `,
  }),
};

export const ClearAlways: Story = {
  args: { clear: 'always' },
  render: renderWithModel(''),
};

export const ClearNever: Story = {
  args: { clear: 'never' },
  render: renderWithModel('Cannot clear me'),
};

export const AllSizes: Story = {
  render: (args) => ({
    components: { DsSearchField },
    setup() {
      const values = ref({
        xxsmall: 'Sample',
        xsmall: 'Sample',
        small: 'Sample',
        medium: 'Sample',
      });
      return { args, values };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 360px;">
        <div>
          <label style="display: block; font-size: 12px; color: #6a7d97; margin-bottom: 4px;">xxsmall (28px)</label>
          <DsSearchField size="xxsmall" v-model="values.xxsmall" placeholder="Search" />
        </div>
        <div>
          <label style="display: block; font-size: 12px; color: #6a7d97; margin-bottom: 4px;">xsmall (32px)</label>
          <DsSearchField size="xsmall" v-model="values.xsmall" placeholder="Search" />
        </div>
        <div>
          <label style="display: block; font-size: 12px; color: #6a7d97; margin-bottom: 4px;">small (36px)</label>
          <DsSearchField size="small" v-model="values.small" placeholder="Search" />
        </div>
        <div>
          <label style="display: block; font-size: 12px; color: #6a7d97; margin-bottom: 4px;">medium (40px)</label>
          <DsSearchField size="medium" v-model="values.medium" placeholder="Search" />
        </div>
      </div>
    `,
  }),
};

export const AllStates: Story = {
  render: () => ({
    components: { DsSearchField },
    setup() {
      const values = ref({
        default: '',
        focused: '',
        inputText: 'Query text',
        disabled: '',
      });
      const focusedRef = ref<{ $el: HTMLElement } | null>(null);
      onMounted(async () => {
        await nextTick();
        const el = focusedRef.value?.$el as HTMLElement | undefined;
        el?.querySelector('input')?.focus();
      });
      return { values, focusedRef };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 360px;">
        <div>
          <label style="display: block; font-size: 12px; color: #6a7d97; margin-bottom: 4px;">Default</label>
          <DsSearchField v-model="values.default" placeholder="Search" />
        </div>
        <div>
          <label style="display: block; font-size: 12px; color: #6a7d97; margin-bottom: 4px;">Focused (autofocus)</label>
          <DsSearchField ref="focusedRef" v-model="values.focused" placeholder="Search" />
        </div>
        <div>
          <label style="display: block; font-size: 12px; color: #6a7d97; margin-bottom: 4px;">Input-text (has value + clear)</label>
          <DsSearchField v-model="values.inputText" placeholder="Search" />
        </div>
        <div>
          <label style="display: block; font-size: 12px; color: #6a7d97; margin-bottom: 4px;">Disabled</label>
          <DsSearchField v-model="values.disabled" placeholder="Search" disabled />
        </div>
      </div>
    `,
  }),
};

export const WithEventLog: Story = {
  args: { helpIcon: true },
  render: (args) => ({
    components: { DsSearchField },
    setup() {
      const value = ref('');
      const log = ref<string[]>([]);
      const onSearch = (v: string) => log.value.unshift(`@search: "${v}"`);
      const onClear = () => log.value.unshift('@clear');
      const onHelp = () => log.value.unshift('@help');
      return { args, value, log, onSearch, onClear, onHelp };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 420px;">
        <DsSearchField
          v-bind="args"
          v-model="value"
          @search="onSearch"
          @clear="onClear"
          @help="onHelp"
        />
        <div style="font-family: 'JetBrains Mono', Menlo, monospace; font-size: 12px; background: #f1f5f9; padding: 8px 12px; border-radius: 8px; min-height: 80px;">
          <div style="color: #6a7d97; margin-bottom: 4px;">Events (most recent first):</div>
          <div v-if="log.length === 0" style="color: #6a7d97;">(type and press Enter · press Escape · click clear/help)</div>
          <div v-for="(e, i) in log" :key="i">{{ e }}</div>
        </div>
      </div>
    `,
  }),
};
