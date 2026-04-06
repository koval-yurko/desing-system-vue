import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, ref } from 'vue';
import DsIcon from '../../components/DsIcon/DsIcon.vue';
import type { IconName } from '../../components/DsIcon/icon-names';
import { icons } from '../../components/DsIcon/icon-registry';

const meta = {
  title: 'Foundations/Icons',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { DsIcon },
    setup() {
      const search = ref('');
      const allIcons = Object.keys(icons) as IconName[];
      const filtered = computed(() =>
        search.value
          ? allIcons.filter((name) => name.toLowerCase().includes(search.value.toLowerCase()))
          : allIcons,
      );
      return { search, filtered, total: allIcons.length };
    },
    template: `
      <div style="font-family: Inter, sans-serif; max-width: 1200px;">
        <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 8px;">Icons</h1>
        <p style="font-size: 13px; color: var(--p-text-muted-color); margin-bottom: 24px;">
          All available icons for <code style="font-family: 'SF Mono', SFMono-Regular, Consolas, monospace; font-size: 12px;">&lt;DsIcon name="..." /&gt;</code>
        </p>

        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
          <input
            v-model="search"
            type="text"
            placeholder="Search icons..."
            style="
              font-family: Inter, sans-serif;
              font-size: 14px;
              padding: 8px 12px;
              border: 1px solid var(--p-form-field-border-color);
              border-radius: 6px;
              outline: none;
              width: 280px;
              background: transparent;
              color: inherit;
            "
          />
          <span style="font-size: 13px; color: var(--p-text-muted-color);">
            Showing {{ filtered.length }} of {{ total }} icons
          </span>
        </div>

        <div
          v-if="filtered.length === 0"
          style="padding: 48px 0; text-align: center; color: var(--p-text-muted-color); font-size: 14px;"
        >
          No icons found
        </div>

        <div
          v-else
          style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px;"
        >
          <div
            v-for="name in filtered"
            :key="name"
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 16px 8px;
              border: 1px solid var(--p-form-field-border-color);
              border-radius: 8px;
              cursor: default;
              transition: border-color 0.15s, background-color 0.15s;
            "
            @mouseenter="$event.currentTarget.style.borderColor = 'var(--p-form-field-hover-border-color)'; $event.currentTarget.style.backgroundColor = 'var(--p-content-hover-background)'"
            @mouseleave="$event.currentTarget.style.borderColor = 'var(--p-form-field-border-color)'; $event.currentTarget.style.backgroundColor = 'transparent'"
          >
            <DsIcon :name="name" size="medium" />
            <span style="font-family: 'SF Mono', SFMono-Regular, Consolas, monospace; font-size: 11px; text-align: center; word-break: break-all; color: inherit;">
              {{ name }}
            </span>
          </div>
        </div>
      </div>
    `,
  }),
};
