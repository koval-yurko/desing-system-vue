import { mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import DsSearchField from './DsSearchField.vue';

const globalConfig = {
  plugins: [[PrimeVue, { theme: 'none' }]],
};

describe('DsSearchField', () => {
  describe('default rendering', () => {
    it('renders base, medium, default-state classes', () => {
      const wrapper = mount(DsSearchField, { global: globalConfig });
      expect(wrapper.find('.ds-search-field').exists()).toBe(true);
      expect(wrapper.find('.ds-search-field--medium').exists()).toBe(true);
      expect(wrapper.find('.ds-search-field--default').exists()).toBe(true);
    });

    it('renders leading search icon by default at medium', () => {
      const wrapper = mount(DsSearchField, { global: globalConfig });
      expect(wrapper.find('.ds-search-field__search-icon').exists()).toBe(true);
      expect(wrapper.find('.ds-search-field__search-icon').attributes('aria-hidden')).toBe('true');
    });

    it('has no clear button when input is empty', () => {
      const wrapper = mount(DsSearchField, { global: globalConfig });
      expect(wrapper.find('.ds-search-field__clear').exists()).toBe(false);
    });

    it('has no help button by default', () => {
      const wrapper = mount(DsSearchField, { global: globalConfig });
      expect(wrapper.find('.ds-search-field__help').exists()).toBe(false);
    });

    it('renders a type="search" input with default placeholder and aria-label', () => {
      const wrapper = mount(DsSearchField, { global: globalConfig });
      const input = wrapper.get('input.ds-search-field__input');
      expect(input.attributes('type')).toBe('search');
      expect(input.attributes('placeholder')).toBe('Search');
      expect(input.attributes('aria-label')).toBe('Search');
    });
  });

  describe('sizes', () => {
    for (const size of ['xxsmall', 'xsmall', 'small', 'medium'] as const) {
      it(`applies .ds-search-field--${size} class for size="${size}"`, () => {
        const wrapper = mount(DsSearchField, {
          props: { size },
          global: globalConfig,
        });
        expect(wrapper.find(`.ds-search-field--${size}`).exists()).toBe(true);
      });
    }

    it('does not render search icon at xxsmall by default', () => {
      const wrapper = mount(DsSearchField, {
        props: { size: 'xxsmall' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-search-field__search-icon').exists()).toBe(false);
    });

    it('renders search icon at xxsmall when searchIcon=true', () => {
      const wrapper = mount(DsSearchField, {
        props: { size: 'xxsmall', searchIcon: true },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-search-field__search-icon').exists()).toBe(true);
    });

    it('hides search icon at medium when searchIcon=false', () => {
      const wrapper = mount(DsSearchField, {
        props: { size: 'medium', searchIcon: false },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-search-field__search-icon').exists()).toBe(false);
    });
  });

  describe('state classes', () => {
    it('applies default state when empty and unfocused', () => {
      const wrapper = mount(DsSearchField, { global: globalConfig });
      expect(wrapper.find('.ds-search-field--default').exists()).toBe(true);
    });

    it('applies focused state when input receives focus and is empty', async () => {
      const wrapper = mount(DsSearchField, { global: globalConfig });
      await wrapper.get('input').trigger('focus');
      expect(wrapper.find('.ds-search-field--focused').exists()).toBe(true);
      expect(wrapper.find('.ds-search-field--default').exists()).toBe(false);
    });

    it('applies input-text state when value is set and unfocused', () => {
      const wrapper = mount(DsSearchField, {
        props: { modelValue: 'hello' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-search-field--input-text').exists()).toBe(true);
    });

    it('applies input-text state even when focused (content wins over focus)', async () => {
      const wrapper = mount(DsSearchField, {
        props: { modelValue: 'hello' },
        global: globalConfig,
      });
      await wrapper.get('input').trigger('focus');
      expect(wrapper.find('.ds-search-field--input-text').exists()).toBe(true);
      expect(wrapper.find('.ds-search-field--focused').exists()).toBe(false);
    });

    it('applies disabled state and overrides all others', async () => {
      const wrapper = mount(DsSearchField, {
        props: { disabled: true, modelValue: 'hello' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-search-field--disabled').exists()).toBe(true);
      expect(wrapper.find('.ds-search-field--input-text').exists()).toBe(false);
    });

    it('resets focused state when disabled is toggled on mid-focus', async () => {
      const wrapper = mount(DsSearchField, { global: globalConfig });
      await wrapper.get('input').trigger('focus');
      expect(wrapper.find('.ds-search-field--focused').exists()).toBe(true);
      await wrapper.setProps({ disabled: true });
      expect(wrapper.find('.ds-search-field--disabled').exists()).toBe(true);
      await wrapper.setProps({ disabled: false });
      await nextTick();
      // Focus flag should have been cleared — field returns to Default, not Focused
      expect(wrapper.find('.ds-search-field--default').exists()).toBe(true);
      expect(wrapper.find('.ds-search-field--focused').exists()).toBe(false);
    });
  });

  describe('v-model and keyboard events', () => {
    it('emits update:modelValue on typing', async () => {
      const wrapper = mount(DsSearchField, { global: globalConfig });
      const input = wrapper.get('input');
      await input.setValue('abc');
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted).toBeTruthy();
      expect(emitted?.at(-1)).toEqual(['abc']);
    });

    it('emits @search with current model value on Enter', async () => {
      const wrapper = mount(DsSearchField, {
        props: { modelValue: 'query' },
        global: globalConfig,
      });
      await wrapper.get('input').trigger('keydown.enter');
      const emitted = wrapper.emitted('search');
      expect(emitted).toBeTruthy();
      expect(emitted?.[0]).toEqual(['query']);
    });

    it('emits @search with empty string on Enter when empty (consumer decides)', async () => {
      const wrapper = mount(DsSearchField, { global: globalConfig });
      await wrapper.get('input').trigger('keydown.enter');
      expect(wrapper.emitted('search')?.[0]).toEqual(['']);
    });

    it('Escape clears value + emits @clear when there is content', async () => {
      const wrapper = mount(DsSearchField, {
        props: { modelValue: 'hello' },
        global: globalConfig,
      });
      await wrapper.get('input').trigger('keydown.esc');
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['']);
      expect(wrapper.emitted('clear')).toBeTruthy();
    });

    it('Escape is a no-op when value is already empty', async () => {
      const wrapper = mount(DsSearchField, { global: globalConfig });
      await wrapper.get('input').trigger('keydown.esc');
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      expect(wrapper.emitted('clear')).toBeFalsy();
    });

    it('Escape is a no-op when clear="never" even with value', async () => {
      const wrapper = mount(DsSearchField, {
        props: { clear: 'never', modelValue: 'hello' },
        global: globalConfig,
      });
      await wrapper.get('input').trigger('keydown.esc');
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      expect(wrapper.emitted('clear')).toBeFalsy();
    });

    it('Escape stops propagation + preventDefault when clearing', async () => {
      const wrapper = mount(DsSearchField, {
        props: { modelValue: 'hello' },
        global: globalConfig,
      });
      const escEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      });
      const stopSpy = vi.spyOn(escEvent, 'stopPropagation');
      const preventSpy = vi.spyOn(escEvent, 'preventDefault');
      (wrapper.get('input').element as HTMLInputElement).dispatchEvent(escEvent);
      expect(stopSpy).toHaveBeenCalled();
      expect(preventSpy).toHaveBeenCalled();
    });

    it('Enter during IME composition does NOT emit @search', async () => {
      const wrapper = mount(DsSearchField, {
        props: { modelValue: 'hel' },
        global: globalConfig,
      });
      await wrapper.get('input').trigger('keydown.enter', { isComposing: true });
      expect(wrapper.emitted('search')).toBeFalsy();
    });

    it('Enter calls preventDefault so form submit is suppressed', async () => {
      const wrapper = mount(DsSearchField, { global: globalConfig });
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      const preventSpy = vi.spyOn(enterEvent, 'preventDefault');
      (wrapper.get('input').element as HTMLInputElement).dispatchEvent(enterEvent);
      expect(preventSpy).toHaveBeenCalled();
      expect(wrapper.emitted('search')).toBeTruthy();
    });

    it('coerces null modelValue to empty string in @search payload', async () => {
      const wrapper = mount(DsSearchField, {
        props: { modelValue: null as unknown as string },
        global: globalConfig,
      });
      await wrapper.get('input').trigger('keydown.enter');
      expect(wrapper.emitted('search')?.[0]).toEqual(['']);
    });

    it('emits focus and blur events on input focus/blur', async () => {
      const wrapper = mount(DsSearchField, { global: globalConfig });
      const input = wrapper.get('input');
      await input.trigger('focus');
      expect(wrapper.emitted('focus')).toBeTruthy();
      await input.trigger('blur');
      expect(wrapper.emitted('blur')).toBeTruthy();
    });
  });

  describe('clear button visibility', () => {
    it('auto + empty → button absent', () => {
      const wrapper = mount(DsSearchField, {
        props: { clear: 'auto' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-search-field__clear').exists()).toBe(false);
    });

    it('auto + value → button present', () => {
      const wrapper = mount(DsSearchField, {
        props: { clear: 'auto', modelValue: 'x' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-search-field__clear').exists()).toBe(true);
    });

    it('always + empty → button present', () => {
      const wrapper = mount(DsSearchField, {
        props: { clear: 'always' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-search-field__clear').exists()).toBe(true);
    });

    it('always + value → button present', () => {
      const wrapper = mount(DsSearchField, {
        props: { clear: 'always', modelValue: 'x' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-search-field__clear').exists()).toBe(true);
    });

    it('never + value → button absent', () => {
      const wrapper = mount(DsSearchField, {
        props: { clear: 'never', modelValue: 'x' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-search-field__clear').exists()).toBe(false);
    });

    it('disabled + value → button absent regardless of clear mode', () => {
      const wrapper = mount(DsSearchField, {
        props: { disabled: true, clear: 'always', modelValue: 'x' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-search-field__clear').exists()).toBe(false);
    });
  });

  describe('clear button interaction', () => {
    it('click clears model and emits @clear', async () => {
      const wrapper = mount(DsSearchField, {
        props: { modelValue: 'x' },
        global: globalConfig,
      });
      await wrapper.get('.ds-search-field__clear').trigger('click');
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['']);
      expect(wrapper.emitted('clear')).toHaveLength(1);
    });

    it('Enter on clear button triggers clear', async () => {
      const wrapper = mount(DsSearchField, {
        props: { modelValue: 'x' },
        global: globalConfig,
      });
      await wrapper.get('.ds-search-field__clear').trigger('keydown.enter');
      expect(wrapper.emitted('clear')).toHaveLength(1);
    });

    it('Space on clear button triggers clear', async () => {
      const wrapper = mount(DsSearchField, {
        props: { modelValue: 'x' },
        global: globalConfig,
      });
      await wrapper.get('.ds-search-field__clear').trigger('keydown.space');
      expect(wrapper.emitted('clear')).toHaveLength(1);
    });
  });

  describe('help button', () => {
    it('renders when helpIcon=true', () => {
      const wrapper = mount(DsSearchField, {
        props: { helpIcon: true },
        global: globalConfig,
      });
      const btn = wrapper.get('.ds-search-field__help');
      expect(btn.attributes('aria-label')).toBe('Search options');
      expect(btn.attributes('title')).toBe('Search options');
    });

    it('click emits @help exactly once', async () => {
      const wrapper = mount(DsSearchField, {
        props: { helpIcon: true },
        global: globalConfig,
      });
      await wrapper.get('.ds-search-field__help').trigger('click');
      expect(wrapper.emitted('help')).toHaveLength(1);
    });

    it('Enter on help button emits @help', async () => {
      const wrapper = mount(DsSearchField, {
        props: { helpIcon: true },
        global: globalConfig,
      });
      await wrapper.get('.ds-search-field__help').trigger('keydown.enter');
      expect(wrapper.emitted('help')).toHaveLength(1);
    });

    it('Space on help button emits @help', async () => {
      const wrapper = mount(DsSearchField, {
        props: { helpIcon: true },
        global: globalConfig,
      });
      await wrapper.get('.ds-search-field__help').trigger('keydown.space');
      expect(wrapper.emitted('help')).toHaveLength(1);
    });

    it('#helpIcon slot overrides the default filter icon', () => {
      const wrapper = mount(DsSearchField, {
        props: { helpIcon: true },
        slots: {
          helpIcon: '<span data-testid="custom-help">Custom</span>',
        },
        global: globalConfig,
      });
      const btn = wrapper.get('.ds-search-field__help');
      expect(btn.find('[data-testid="custom-help"]').exists()).toBe(true);
    });

    it('renders help button when #helpIcon slot is provided without helpIcon prop', () => {
      const wrapper = mount(DsSearchField, {
        slots: {
          helpIcon: '<span data-testid="custom-help">Custom</span>',
        },
        global: globalConfig,
      });
      const btn = wrapper.find('.ds-search-field__help');
      expect(btn.exists()).toBe(true);
      expect(btn.find('[data-testid="custom-help"]').exists()).toBe(true);
    });

    it('hides help button when disabled, even with helpIcon=true', () => {
      const wrapper = mount(DsSearchField, {
        props: { helpIcon: true, disabled: true },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-search-field__help').exists()).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('defaults the input aria-label to "Search"', () => {
      const wrapper = mount(DsSearchField, { global: globalConfig });
      expect(wrapper.get('input').attributes('aria-label')).toBe('Search');
    });

    it('uses custom ariaLabel prop', () => {
      const wrapper = mount(DsSearchField, {
        props: { ariaLabel: 'Find' },
        global: globalConfig,
      });
      expect(wrapper.get('input').attributes('aria-label')).toBe('Find');
    });

    it('uses custom clearAriaLabel prop', () => {
      const wrapper = mount(DsSearchField, {
        props: { modelValue: 'x', clearAriaLabel: 'Reset' },
        global: globalConfig,
      });
      expect(wrapper.get('.ds-search-field__clear').attributes('aria-label')).toBe('Reset');
    });

    it('uses custom helpAriaLabel prop for both aria-label and title', () => {
      const wrapper = mount(DsSearchField, {
        props: { helpIcon: true, helpAriaLabel: 'Options' },
        global: globalConfig,
      });
      const btn = wrapper.get('.ds-search-field__help');
      expect(btn.attributes('aria-label')).toBe('Options');
      expect(btn.attributes('title')).toBe('Options');
    });

    it('marks search-icon wrapper aria-hidden', () => {
      const wrapper = mount(DsSearchField, { global: globalConfig });
      expect(wrapper.find('.ds-search-field__search-icon').attributes('aria-hidden')).toBe('true');
    });

    it('marks clear-icon wrapper aria-hidden (avoids double-announcement with button aria-label)', () => {
      const wrapper = mount(DsSearchField, {
        props: { modelValue: 'x' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-search-field__clear-icon').attributes('aria-hidden')).toBe('true');
    });

    it('marks help-icon wrapper aria-hidden', () => {
      const wrapper = mount(DsSearchField, {
        props: { helpIcon: true },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-search-field__help-icon').attributes('aria-hidden')).toBe('true');
    });

    it('sets aria-disabled="true" when disabled', () => {
      const wrapper = mount(DsSearchField, {
        props: { disabled: true },
        global: globalConfig,
      });
      expect(wrapper.get('input').attributes('aria-disabled')).toBe('true');
    });
  });

  describe('$attrs passthrough and composition', () => {
    it('forwards attrs to the root <div>', () => {
      const wrapper = mount(DsSearchField, {
        attrs: { 'data-testid': 'my-search' },
        global: globalConfig,
      });
      const root = wrapper.get('.ds-search-field');
      expect(root.attributes('data-testid')).toBe('my-search');
      expect(wrapper.get('input').attributes('data-testid')).toBeUndefined();
    });

    it('does NOT mount DsInputText internally (option A composition)', () => {
      const wrapper = mount(DsSearchField, { global: globalConfig });
      expect(wrapper.find('.ds-input-text').exists()).toBe(false);
    });
  });

  describe('tab order', () => {
    it('renders input before clear and help buttons in DOM order', () => {
      const wrapper = mount(DsSearchField, {
        props: { modelValue: 'x', helpIcon: true },
        global: globalConfig,
      });
      const root = wrapper.get('.ds-search-field').element;
      const focusables = Array.from(root.querySelectorAll<HTMLElement>('input, button'));
      expect(focusables[0].tagName).toBe('INPUT');
      expect(focusables[1].className).toContain('ds-search-field__clear');
      expect(focusables[2].className).toContain('ds-search-field__help');
    });
  });

  describe('v-model parent sync', () => {
    it('updates when parent passes v-model + clears via button', async () => {
      const Parent = defineComponent({
        components: { DsSearchField },
        data() {
          return { q: 'hello' };
        },
        render() {
          return h(DsSearchField, {
            modelValue: this.q,
            'onUpdate:modelValue': (v: string) => {
              this.q = v;
            },
          });
        },
      });
      const wrapper = mount(Parent, { global: globalConfig });
      expect(wrapper.find('.ds-search-field__clear').exists()).toBe(true);
      await wrapper.get('.ds-search-field__clear').trigger('click');
      expect(wrapper.find('.ds-search-field__clear').exists()).toBe(false);
    });
  });
});
