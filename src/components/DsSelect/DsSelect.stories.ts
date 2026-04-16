import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, ref } from 'vue';
import DsIcon from '../DsIcon/DsIcon.vue';
import DsSelect from './DsSelect.vue';

const simpleOptions = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

const objectOptions = [
  { name: 'United States', code: 'US' },
  { name: 'United Kingdom', code: 'UK' },
  { name: 'Germany', code: 'DE' },
  { name: 'France', code: 'FR' },
  { name: 'Japan', code: 'JP' },
];

const twoLineOptions = [
  { name: 'John Doe', role: 'Software Engineer' },
  { name: 'Jane Smith', role: 'Product Manager' },
  { name: 'Bob Wilson', role: 'UX Designer' },
  { name: 'Alice Brown', role: 'Data Scientist' },
];

const multiSelectNames = [
  { name: 'Marketing', value: 'marketing' },
  { name: 'Sales', value: 'sales' },
  { name: 'Engineering', value: 'engineering' },
  { name: 'Design', value: 'design' },
  { name: 'Product', value: 'product' },
  { name: 'Finance', value: 'finance' },
  { name: 'HR', value: 'hr' },
];

const entityIconOptions = [
  { name: 'Slack', icon: 'chat-ai' },
  { name: 'Calendar', icon: 'calendar' },
  { name: 'Email', icon: 'envelope' },
  { name: 'Dashboard', icon: 'layout-dashboard' },
  { name: 'Workflow', icon: 'workflow' },
];

const badgeOptions = [
  { name: 'Active', color: '#17B26A' },
  { name: 'Pending', color: '#F79009' },
  { name: 'Inactive', color: '#F04438' },
  { name: 'Draft', color: '#98A2B3' },
  { name: 'Scheduled', color: '#6172F3' },
];

const twoLineMultiOptions = [
  { name: 'John Doe', email: 'john.doe@example.com' },
  { name: 'Jane Smith', email: 'jane.smith@example.com' },
  { name: 'Bob Wilson', email: 'bob.wilson@example.com' },
  { name: 'Alice Brown', email: 'alice.brown@example.com' },
  { name: 'Charlie Davis', email: 'charlie.davis@example.com' },
];

const vendorOptions = [
  { name: 'Alice Johnson', email: 'alice.johnson@acme.co', initials: 'AJ', color: '#6172F3' },
  { name: 'Bob Martinez', email: 'bob.martinez@globex.com', initials: 'BM', color: '#17B26A' },
  { name: 'Carol Chen', email: 'carol.chen@initech.io', initials: 'CC', color: '#F79009' },
  { name: 'David Kim', email: 'david.kim@umbrella.corp', initials: 'DK', color: '#F04438' },
];

const mentionOptions = {
  pages: [
    { name: 'Dashboard', subtitle: 'app / pages / dashboard', icon: 'layout-dashboard' },
    { name: 'Settings', subtitle: 'app / pages / settings', icon: 'setting' },
    { name: 'Users', subtitle: 'app / pages / users', icon: 'users' },
  ],
  components: [
    { name: 'DsButton', subtitle: 'src / components / DsButton', icon: 'component' },
    { name: 'DsSelect', subtitle: 'src / components / DsSelect', icon: 'component' },
  ],
};

const bigIconOptions = [
  { name: 'Business', icon: 'business' },
  { name: 'Building', icon: 'building' },
  { name: 'Globe', icon: 'globe' },
  { name: 'Security', icon: 'security' },
  { name: 'Package', icon: 'package' },
];

const meta = {
  title: 'Components/DsSelect',
  component: DsSelect,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    mandatory: { control: 'boolean' },
    optional: { control: 'boolean' },
    info: { control: 'boolean' },
    hint: { control: 'text' },
    error: { control: 'text' },
    modelValue: { control: 'text' },
  },
  args: {
    size: 'medium',
    label: 'Label',
    disabled: false,
    mandatory: false,
    optional: false,
    info: false,
  },
} satisfies Meta<typeof DsSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template:
      '<DsSelect v-bind="args" v-model="value" :options="options" placeholder="Select a fruit" />',
    data: () => ({ options: simpleOptions }),
  }),
};

export const WithLabel: Story = {
  args: { label: 'Fruit' },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template:
      '<DsSelect v-bind="args" v-model="value" :options="options" placeholder="Select a fruit" />',
    data: () => ({ options: simpleOptions }),
  }),
};

export const Mandatory: Story = {
  args: { label: 'Country', mandatory: true },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template:
      '<DsSelect v-bind="args" v-model="value" :options="options" option-label="name" option-value="code" placeholder="Select a country" />',
    data: () => ({ options: objectOptions }),
  }),
};

export const Optional: Story = {
  args: { label: 'Preference', optional: true },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template:
      '<DsSelect v-bind="args" v-model="value" :options="options" placeholder="Select a fruit" />',
    data: () => ({ options: simpleOptions }),
  }),
};

export const WithInfo: Story = {
  args: { label: 'Category', info: true },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template:
      '<DsSelect v-bind="args" v-model="value" :options="options" placeholder="Select a category" />',
    data: () => ({ options: simpleOptions }),
  }),
};

export const WithHint: Story = {
  args: { label: 'Fruit', hint: 'Choose your favorite fruit' },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template:
      '<DsSelect v-bind="args" v-model="value" :options="options" placeholder="Select a fruit" />',
    data: () => ({ options: simpleOptions }),
  }),
};

export const WithError: Story = {
  args: {
    label: 'Country',
    error: 'Please select a country',
  },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template:
      '<DsSelect v-bind="args" v-model="value" :options="options" option-label="name" option-value="code" placeholder="Select a country" />',
    data: () => ({ options: objectOptions }),
  }),
};

export const Disabled: Story = {
  args: { label: 'Fruit', disabled: true },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref('Apple');
      return { args, value };
    },
    template:
      '<DsSelect v-bind="args" v-model="value" :options="options" placeholder="Select a fruit" />',
    data: () => ({ options: simpleOptions }),
  }),
};

export const Filled: Story = {
  args: { label: 'Fruit' },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref('Cherry');
      return { args, value };
    },
    template:
      '<DsSelect v-bind="args" v-model="value" :options="options" placeholder="Select a fruit" />',
    data: () => ({ options: simpleOptions }),
  }),
};

export const WithLeadingIcon: Story = {
  args: { label: 'Search country' },
  render: (args) => ({
    components: { DsSelect, DsIcon },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `
      <DsSelect v-bind="args" v-model="value" :options="options" option-label="name" option-value="code" placeholder="Select a country">
        <template #leading>
          <DsIcon name="search" size="medium" />
        </template>
      </DsSelect>
    `,
    data: () => ({ options: objectOptions }),
  }),
};

export const ClearButton: Story = {
  args: { label: 'Fruit (clear me)' },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref('Banana');
      return { args, value };
    },
    template:
      '<DsSelect v-bind="args" v-model="value" :options="options" placeholder="Select a fruit" />',
    data: () => ({ options: simpleOptions }),
  }),
};

export const TwoLineOptions: Story = {
  args: { label: 'Assignee' },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `
      <DsSelect v-bind="args" v-model="value" :options="options" option-label="name" placeholder="Select a person" panel-class="ds-select-panel--two-line">
        <template #option="{ option }">
          <div class="ds-select-two-line">
            <div class="ds-select-two-line__title">{{ option.name }}</div>
            <div class="ds-select-two-line__subtitle">{{ option.role }}</div>
          </div>
        </template>
      </DsSelect>
    `,
    data: () => ({ options: twoLineOptions }),
  }),
};

export const NoMatch: Story = {
  args: { label: 'Fruit' },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template:
      '<DsSelect v-bind="args" v-model="value" :options="[]" placeholder="Select a fruit" empty-message="No items match your search" />',
  }),
};

export const DisabledWithError: Story = {
  args: {
    label: 'Country',
    disabled: true,
    error: 'Please select a country',
  },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template:
      '<DsSelect v-bind="args" v-model="value" :options="options" option-label="name" option-value="code" placeholder="Select a country" />',
    data: () => ({ options: objectOptions }),
  }),
};

export const ErrorWithHint: Story = {
  args: {
    label: 'Country',
    hint: 'Select the country where you reside',
    error: 'Country is required',
  },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template:
      '<DsSelect v-bind="args" v-model="value" :options="options" option-label="name" option-value="code" placeholder="Select a country" />',
    data: () => ({ options: objectOptions }),
  }),
};

export const AllSizes: Story = {
  render: () => ({
    components: { DsSelect },
    setup() {
      const small = ref(null);
      const medium = ref(null);
      return { small, medium, options: simpleOptions };
    },
    template: `
      <div style="display: flex; gap: 24px; align-items: flex-start;">
        <div style="flex: 1;">
          <DsSelect label="Small" size="small" v-model="small" :options="options" placeholder="Select..." />
        </div>
        <div style="flex: 1;">
          <DsSelect label="Medium" size="medium" v-model="medium" :options="options" placeholder="Select..." />
        </div>
      </div>
    `,
  }),
};

export const AllStates: Story = {
  render: () => ({
    components: { DsSelect },
    setup() {
      const defaultVal = ref(null);
      const filled = ref('Cherry');
      const errorVal = ref(null);
      const disabledVal = ref('Apple');
      return { defaultVal, filled, errorVal, disabledVal, options: simpleOptions };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px; max-width: 320px;">
        <DsSelect label="Default" v-model="defaultVal" :options="options" placeholder="Select..." />
        <DsSelect label="Filled" v-model="filled" :options="options" placeholder="Select..." />
        <DsSelect label="Error" error="Something went wrong" v-model="errorVal" :options="options" placeholder="Select..." />
        <DsSelect label="Disabled" disabled v-model="disabledVal" :options="options" placeholder="Select..." />
      </div>
    `,
  }),
};

/* ==========================================
   Advanced Dropdown Variants (Story 6.3)
   ========================================== */

export const MultiSelection: Story = {
  args: { label: 'Departments' },
  render: (args) => ({
    components: { DsSelect, DsIcon },
    setup() {
      const value = ref<string[]>([]);
      const options = multiSelectNames;
      const allSelected = computed(() => value.value.length === options.length);
      const selectedCount = computed(() => value.value.length);
      const totalCount = options.length;
      function toggleAll() {
        value.value = allSelected.value ? [] : options.map((o) => o.value);
      }
      return { args, value, options, allSelected, selectedCount, totalCount, toggleAll };
    },
    template: `
      <div style="max-width: 320px;">
        <DsSelect v-bind="args" v-model="value" :options="options" option-label="name" option-value="value" :multiple="true" filter placeholder="Select departments">
          <template #header>
            <div class="ds-select-header-select-all" @click="toggleAll">
              <input type="checkbox" class="ds-select-header-select-all__checkbox" :checked="allSelected" />
              <span class="ds-select-header-select-all__label">Select all departments</span>
              <span class="ds-select-header-select-all__counter">{{ selectedCount }} out of {{ totalCount }}</span>
            </div>
          </template>
        </DsSelect>
      </div>
    `,
  }),
};

export const EntityIcons: Story = {
  args: { label: 'Integrations' },
  render: (args) => ({
    components: { DsSelect, DsIcon },
    setup() {
      const value = ref<string[]>([]);
      return { args, value, options: entityIconOptions };
    },
    template: `
      <div style="max-width: 320px;">
        <DsSelect v-bind="args" v-model="value" :options="options" option-label="name" :multiple="true" placeholder="Select integrations" :pt="{ overlay: { class: 'ds-select-panel ds-select-panel--multi ds-select-panel--entity' } }">
          <template #option="{ option }">
            <div class="ds-select-option-entity">
              <DsIcon :name="option.icon" size="small" class="ds-select-option-entity__icon" />
              <span>{{ option.name }}</span>
            </div>
          </template>
        </DsSelect>
      </div>
    `,
  }),
};

export const BadgeDotIndicator: Story = {
  args: { label: 'Status' },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value, options: badgeOptions };
    },
    template: `
      <div style="max-width: 320px;">
        <DsSelect v-bind="args" v-model="value" :options="options" option-label="name" placeholder="Select status" panel-class="ds-select-panel--badge">
          <template #option="{ option }">
            <div class="ds-select-option-badge">
              <span class="ds-select-option-badge__dot" :style="{ backgroundColor: option.color }"></span>
              <span class="ds-select-option-badge__label">{{ option.name }}</span>
            </div>
          </template>
        </DsSelect>
      </div>
    `,
  }),
};

export const TwoLineMultiSelection: Story = {
  args: { label: 'Assignees' },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref<object[]>([]);
      return { args, value, options: twoLineMultiOptions };
    },
    template: `
      <div style="max-width: 320px;">
        <DsSelect v-bind="args" v-model="value" :options="options" option-label="name" :multiple="true" placeholder="Select assignees" :pt="{ overlay: { class: 'ds-select-panel ds-select-panel--multi ds-select-panel--two-line-multi' } }">
          <template #option="{ option }">
            <div class="ds-select-option-two-line-multi">
              <span class="ds-select-option-two-line-multi__title">{{ option.name }}</span>
              <span class="ds-select-option-two-line-multi__subtitle">{{ option.email }}</span>
            </div>
          </template>
        </DsSelect>
      </div>
    `,
  }),
};

export const VendorLayout: Story = {
  args: { label: 'Vendor' },
  render: (args) => ({
    components: { DsSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value, options: vendorOptions };
    },
    template: `
      <div style="max-width: 320px;">
        <DsSelect v-bind="args" v-model="value" :options="options" option-label="name" placeholder="Select vendor" panel-class="ds-select-panel--vendor">
          <template #option="{ option }">
            <div class="ds-select-option-vendor">
              <span class="ds-select-option-vendor__avatar" :style="{ backgroundColor: option.color }">{{ option.initials }}</span>
              <div class="ds-select-option-vendor__text">
                <span class="ds-select-option-vendor__name">{{ option.name }}</span>
                <span class="ds-select-option-vendor__email">{{ option.email }}</span>
              </div>
            </div>
          </template>
        </DsSelect>
      </div>
    `,
  }),
};

export const MentionLayout: Story = {
  args: { label: 'Mention' },
  render: (args) => ({
    components: { DsSelect, DsIcon },
    setup() {
      const value = ref(args.modelValue);
      const allItems = [
        { name: 'Pages', subtitle: '', icon: '', group: '_header', section: 'Pages' },
        ...mentionOptions.pages.map((p) => ({ ...p, group: 'Pages' })),
        { name: 'Components', subtitle: '', icon: '', group: '_header', section: 'Components' },
        ...mentionOptions.components.map((c) => ({ ...c, group: 'Components' })),
        { name: '12 more results', subtitle: '', icon: 'overflow', group: '_more' },
      ];
      return { args, value, options: allItems, mentionOptions };
    },
    template: `
      <div style="max-width: 420px;">
        <DsSelect v-bind="args" v-model="value" :options="options" option-label="name" placeholder="Search or mention..." panel-class="ds-select-panel--mention" filter>
          <template #option="{ option }">
            <template v-if="option.group === '_header'">
              <div class="ds-select-option-mention__section-header">{{ option.name }}</div>
            </template>
            <template v-else-if="option.group === '_more'">
              <div class="ds-select-option-mention__more">
                <span class="ds-select-option-mention__more-icon">
                  <DsIcon name="overflow" size="small" />
                </span>
                <span>{{ option.name }}</span>
              </div>
            </template>
            <template v-else>
              <div class="ds-select-option-mention">
                <DsIcon :name="option.icon" size="small" class="ds-select-option-mention__icon" />
                <div class="ds-select-option-mention__text">
                  <span class="ds-select-option-mention__name">{{ option.name }}</span>
                  <span class="ds-select-option-mention__subtitle">{{ option.subtitle }}</span>
                </div>
              </div>
            </template>
          </template>
        </DsSelect>
      </div>
    `,
  }),
};

export const BigIconLayout: Story = {
  args: { label: 'Category' },
  render: (args) => ({
    components: { DsSelect, DsIcon },
    setup() {
      const value = ref(args.modelValue);
      return { args, value, options: bigIconOptions };
    },
    template: `
      <div style="max-width: 320px;">
        <DsSelect v-bind="args" v-model="value" :options="options" option-label="name" placeholder="Select category" panel-class="ds-select-panel--big-icon">
          <template #option="{ option }">
            <div class="ds-select-option-big-icon">
              <span class="ds-select-option-big-icon__container">
                <DsIcon :name="option.icon" size="small" />
              </span>
              <span class="ds-select-option-big-icon__label">{{ option.name }}</span>
            </div>
          </template>
        </DsSelect>
      </div>
    `,
  }),
};
