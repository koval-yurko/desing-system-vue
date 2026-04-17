import { mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import { describe, expect, it } from 'vitest';
import DsChip from './DsChip.vue';

const globalConfig = {
  plugins: [[PrimeVue, { theme: 'none' }]],
};

describe('DsChip', () => {
  it('renders with default props (default type, medium size, no remove button)', () => {
    const wrapper = mount(DsChip, {
      props: { label: 'Tag' },
      global: globalConfig,
    });
    expect(wrapper.find('.ds-chip').exists()).toBe(true);
    expect(wrapper.find('.ds-chip--default').exists()).toBe(true);
    expect(wrapper.find('.ds-chip--medium').exists()).toBe(true);
    expect(wrapper.find('.ds-chip__label').text()).toBe('Tag');
    expect(wrapper.find('.ds-chip__remove').exists()).toBe(false);
    expect(wrapper.find('.ds-chip__leading').exists()).toBe(false);
    expect(wrapper.find('.ds-chip__trailing').exists()).toBe(false);
  });

  describe('types', () => {
    it('applies selected class when type="selected"', () => {
      const wrapper = mount(DsChip, {
        props: { type: 'selected', label: 'Tag' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-chip--selected').exists()).toBe(true);
      expect(wrapper.find('.ds-chip--default').exists()).toBe(false);
    });

    it('applies not-clickable class when type="not-clickable"', () => {
      const wrapper = mount(DsChip, {
        props: { type: 'not-clickable', label: 'Tag' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-chip--not-clickable').exists()).toBe(true);
    });

    it('disabled=true forces not-clickable class (overrides type="default")', () => {
      const wrapper = mount(DsChip, {
        props: { disabled: true, label: 'Tag' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-chip--not-clickable').exists()).toBe(true);
      expect(wrapper.find('.ds-chip--default').exists()).toBe(false);
    });

    it('disabled=true overrides type="selected" to apply not-clickable', () => {
      const wrapper = mount(DsChip, {
        props: { disabled: true, type: 'selected', label: 'Tag' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-chip--not-clickable').exists()).toBe(true);
      expect(wrapper.find('.ds-chip--selected').exists()).toBe(false);
    });

    it('not-clickable and disabled skip the transitions modifier', () => {
      const wrapper = mount(DsChip, {
        props: { type: 'not-clickable', label: 'Tag' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-chip--transitions').exists()).toBe(false);
    });

    it('interactive types include the transitions modifier', () => {
      const wrapper = mount(DsChip, {
        props: { type: 'selected', label: 'Tag' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-chip--transitions').exists()).toBe(true);
    });

    it('not-clickable chip exposes aria-disabled="true" on the root', () => {
      const wrapper = mount(DsChip, {
        props: { type: 'not-clickable', label: 'Tag' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-chip').attributes('aria-disabled')).toBe('true');
    });

    it('interactive chip has no aria-disabled attribute', () => {
      const wrapper = mount(DsChip, {
        props: { label: 'Tag' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-chip').attributes('aria-disabled')).toBeUndefined();
    });
  });

  describe('sizes', () => {
    it('applies small size class', () => {
      const wrapper = mount(DsChip, {
        props: { size: 'small', label: 'Tag' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-chip--small').exists()).toBe(true);
      expect(wrapper.find('.ds-chip--medium').exists()).toBe(false);
    });

    it('applies medium size class', () => {
      const wrapper = mount(DsChip, {
        props: { size: 'medium', label: 'Tag' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-chip--medium').exists()).toBe(true);
    });
  });

  describe('label and slots', () => {
    it('renders the label prop inside the label span', () => {
      const wrapper = mount(DsChip, {
        props: { label: 'MDS Entries' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-chip__label').text()).toBe('MDS Entries');
    });

    it('default slot overrides label prop', () => {
      const wrapper = mount(DsChip, {
        props: { label: 'From prop' },
        slots: { default: 'From slot' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-chip__label').text()).toBe('From slot');
    });

    it('whitespace-only default slot falls back to label prop', () => {
      const wrapper = mount(DsChip, {
        props: { label: 'Fallback label' },
        slots: { default: '   ' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-chip__label').text()).toBe('Fallback label');
    });

    it('renders #leading slot content when provided', () => {
      const wrapper = mount(DsChip, {
        props: { label: 'Tag' },
        slots: { leading: '<span class="leading-content">LI</span>' },
        global: globalConfig,
      });
      const leading = wrapper.find('.ds-chip__leading');
      expect(leading.exists()).toBe(true);
      expect(leading.find('.leading-content').exists()).toBe(true);
    });

    it('does NOT render .ds-chip__leading wrapper when #leading slot is empty', () => {
      const wrapper = mount(DsChip, {
        props: { label: 'Tag' },
        slots: { leading: '' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-chip__leading').exists()).toBe(false);
    });

    it('renders #trailing slot when removable=false', () => {
      const wrapper = mount(DsChip, {
        props: { label: 'Tag' },
        slots: { trailing: '<span class="trailing-content">TR</span>' },
        global: globalConfig,
      });
      const trailing = wrapper.find('.ds-chip__trailing');
      expect(trailing.exists()).toBe(true);
      expect(trailing.find('.trailing-content').exists()).toBe(true);
    });

    it('does NOT render .ds-chip__trailing wrapper when #trailing slot is empty', () => {
      const wrapper = mount(DsChip, {
        props: { label: 'Tag' },
        slots: { trailing: '' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-chip__trailing').exists()).toBe(false);
    });

    it('does NOT render #trailing slot when removable=true (X button takes precedence)', () => {
      const wrapper = mount(DsChip, {
        props: { label: 'Tag', removable: true },
        slots: { trailing: '<span class="trailing-content">TR</span>' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-chip__trailing').exists()).toBe(false);
      expect(wrapper.find('.ds-chip__remove').exists()).toBe(true);
    });
  });

  describe('removable', () => {
    it('renders an X button with default aria-label="Remove" when removable=true', () => {
      const wrapper = mount(DsChip, {
        props: { label: 'Tag', removable: true },
        global: globalConfig,
      });
      const button = wrapper.find('.ds-chip__remove');
      expect(button.exists()).toBe(true);
      expect(button.attributes('aria-label')).toBe('Remove');
      expect(button.attributes('type')).toBe('button');
    });

    it('renders the close icon at 18px (matches Figma spec)', () => {
      const wrapper = mount(DsChip, {
        props: { label: 'Tag', removable: true },
        global: globalConfig,
      });
      const iconSpan = wrapper.find('.ds-chip__remove span');
      expect(iconSpan.exists()).toBe(true);
      const style = iconSpan.attributes('style') ?? '';
      expect(style).toMatch(/width:\s*18px/);
      expect(style).toMatch(/height:\s*18px/);
    });

    it('respects custom removeAriaLabel', () => {
      const wrapper = mount(DsChip, {
        props: { label: 'Tag', removable: true, removeAriaLabel: 'Delete tag' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-chip__remove').attributes('aria-label')).toBe('Delete tag');
    });

    it('emits "remove" once on click', async () => {
      const wrapper = mount(DsChip, {
        props: { label: 'Tag', removable: true },
        global: globalConfig,
      });
      await wrapper.find('.ds-chip__remove').trigger('click');
      expect(wrapper.emitted('remove')).toHaveLength(1);
    });

    it('does NOT bubble click to parent handlers (@click.stop), but still emits "remove"', async () => {
      let parentClicked = 0;
      const removeSpy: Array<unknown[]> = [];
      const wrapper = mount(
        {
          components: { DsChip },
          template:
            '<div @click="onClick"><DsChip label="Tag" removable @remove="onRemove" /></div>',
          methods: {
            onClick() {
              parentClicked++;
            },
            onRemove(...args: unknown[]) {
              removeSpy.push(args);
            },
          },
        },
        { global: globalConfig },
      );
      await wrapper.find('.ds-chip__remove').trigger('click');
      expect(parentClicked).toBe(0);
      expect(removeSpy).toHaveLength(1);
    });

    it('does NOT render the X button when disabled=true (prevents dead focus target)', () => {
      const wrapper = mount(DsChip, {
        props: { label: 'Tag', removable: true, disabled: true },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-chip__remove').exists()).toBe(false);
    });

    it('does NOT render the X button when type="not-clickable"', () => {
      const wrapper = mount(DsChip, {
        props: { label: 'Tag', removable: true, type: 'not-clickable' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-chip__remove').exists()).toBe(false);
    });

    it('adds the ds-chip--removable modifier class only when the X is shown', () => {
      const active = mount(DsChip, {
        props: { label: 'Tag', removable: true },
        global: globalConfig,
      });
      expect(active.find('.ds-chip--removable').exists()).toBe(true);

      const suppressed = mount(DsChip, {
        props: { label: 'Tag', removable: true, disabled: true },
        global: globalConfig,
      });
      expect(suppressed.find('.ds-chip--removable').exists()).toBe(false);
    });
  });

  describe('PrimeVue passthrough', () => {
    it('forwards arbitrary attributes to the PrimeVue Chip root', () => {
      const wrapper = mount(DsChip, {
        props: { label: 'Tag' },
        attrs: { 'data-testid': 'my-chip' },
        global: globalConfig,
      });
      expect(wrapper.find('[data-testid="my-chip"]').exists()).toBe(true);
    });
  });
});
