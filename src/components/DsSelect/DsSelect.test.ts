import { mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import Select from 'primevue/select';
import { beforeAll, describe, expect, it } from 'vitest';
import DsSelect from './DsSelect.vue';

beforeAll(() => {
  // PrimeVue Select uses matchMedia for orientation detection
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

const globalConfig = {
  plugins: [[PrimeVue, { theme: 'none' }]],
};

const defaultOptions = ['Apple', 'Banana', 'Cherry'];

describe('DsSelect', () => {
  it('renders with default props (medium size, no label, no footer)', () => {
    const wrapper = mount(DsSelect, {
      props: { options: defaultOptions },
      global: globalConfig,
    });
    expect(wrapper.find('.ds-select').exists()).toBe(true);
    expect(wrapper.find('.ds-select--medium').exists()).toBe(true);
    expect(wrapper.find('.ds-select__trigger--medium').exists()).toBe(true);
    expect(wrapper.find('.ds-select__label').exists()).toBe(false);
    expect(wrapper.find('.ds-select__footer').exists()).toBe(false);
  });

  describe('sizes', () => {
    it('applies small size class (32px height)', () => {
      const wrapper = mount(DsSelect, {
        props: { size: 'small', options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__trigger--small').exists()).toBe(true);
      expect(wrapper.find('.ds-select--small').exists()).toBe(true);
    });

    it('applies medium size class (40px height)', () => {
      const wrapper = mount(DsSelect, {
        props: { size: 'medium', options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__trigger--medium').exists()).toBe(true);
      expect(wrapper.find('.ds-select--medium').exists()).toBe(true);
    });
  });

  describe('label', () => {
    it('renders label text when label prop is provided', () => {
      const wrapper = mount(DsSelect, {
        props: { label: 'Country', options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__label').exists()).toBe(true);
      expect(wrapper.find('.ds-select__label-text').text()).toBe('Country');
    });

    it('does not render label when prop is not provided', () => {
      const wrapper = mount(DsSelect, {
        props: { options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__label').exists()).toBe(false);
    });

    it('shows mandatory asterisk when mandatory is true', () => {
      const wrapper = mount(DsSelect, {
        props: { label: 'Country', mandatory: true, options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__label-mandatory').exists()).toBe(true);
      expect(wrapper.find('.ds-select__label-mandatory').text()).toBe('*');
    });

    it('does not show asterisk when mandatory is false', () => {
      const wrapper = mount(DsSelect, {
        props: { label: 'Country', options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__label-mandatory').exists()).toBe(false);
    });

    it('shows "(Optional)" text when optional is true', () => {
      const wrapper = mount(DsSelect, {
        props: { label: 'Country', optional: true, options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__label-optional').exists()).toBe(true);
      expect(wrapper.find('.ds-select__label-optional').text()).toBe('(Optional)');
    });

    it('shows info icon when info is true', () => {
      const wrapper = mount(DsSelect, {
        props: { label: 'Country', info: true, options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__label-info').exists()).toBe(true);
    });

    it('links label to select trigger via for/id', () => {
      const wrapper = mount(DsSelect, {
        props: { label: 'Country', options: defaultOptions },
        global: globalConfig,
      });
      const label = wrapper.find('.ds-select__label');
      const select = wrapper.findComponent(Select);
      const selectId = select.attributes('id');
      expect(selectId).toBeTruthy();
      expect(label.attributes('for')).toBe(selectId);
    });

    it('renders neither mandatory nor optional when both are true', () => {
      const wrapper = mount(DsSelect, {
        props: { label: 'Country', mandatory: true, optional: true, options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__label-mandatory').exists()).toBe(false);
      expect(wrapper.find('.ds-select__label-optional').exists()).toBe(false);
    });
  });

  describe('hint text', () => {
    it('renders hint text below trigger', () => {
      const wrapper = mount(DsSelect, {
        props: { hint: 'Choose a country', options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__hint').exists()).toBe(true);
      expect(wrapper.find('.ds-select__hint').text()).toBe('Choose a country');
    });

    it('does not render footer when no hint or error', () => {
      const wrapper = mount(DsSelect, {
        props: { options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__footer').exists()).toBe(false);
    });
  });

  describe('error state', () => {
    it('applies error class and shows error message with icon', () => {
      const wrapper = mount(DsSelect, {
        props: { error: 'Selection required', options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__trigger--error').exists()).toBe(true);
      expect(wrapper.find('.ds-select__error-msg').exists()).toBe(true);
      expect(wrapper.find('.ds-select__error-msg').text()).toContain('Selection required');
      expect(wrapper.find('.ds-select__error-msg-icon').exists()).toBe(true);
    });

    it('links error message to select via aria-describedby', () => {
      const wrapper = mount(DsSelect, {
        props: { error: 'Selection required', options: defaultOptions },
        global: globalConfig,
      });
      const errorMsg = wrapper.find('.ds-select__error-msg');
      const errorMsgId = errorMsg.attributes('id');
      expect(errorMsgId).toBeTruthy();
      const select = wrapper.findComponent(Select);
      expect(select.attributes('aria-describedby')).toBe(errorMsgId);
    });

    it('sets aria-invalid to true on the select when error is present', () => {
      const wrapper = mount(DsSelect, {
        props: { error: 'Selection required', options: defaultOptions },
        global: globalConfig,
      });
      const select = wrapper.findComponent(Select);
      expect(select.attributes('aria-invalid')).toBe('true');
    });

    it('does not show aria-invalid when no error', () => {
      const wrapper = mount(DsSelect, {
        props: { options: defaultOptions },
        global: globalConfig,
      });
      const select = wrapper.findComponent(Select);
      expect(select.attributes('aria-invalid')).toBeUndefined();
    });

    it('error takes priority over hint display', () => {
      const wrapper = mount(DsSelect, {
        props: { hint: 'Some hint', error: 'An error', options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__error-msg').exists()).toBe(true);
      expect(wrapper.find('.ds-select__hint').exists()).toBe(false);
    });
  });

  describe('disabled state', () => {
    it('applies disabled class and removes transitions', () => {
      const wrapper = mount(DsSelect, {
        props: { disabled: true, options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__trigger--disabled').exists()).toBe(true);
      expect(wrapper.find('.ds-select__trigger--transitions').exists()).toBe(false);
    });

    it('sets aria-disabled on the select', () => {
      const wrapper = mount(DsSelect, {
        props: { disabled: true, options: defaultOptions },
        global: globalConfig,
      });
      const select = wrapper.findComponent(Select);
      expect(select.attributes('aria-disabled')).toBe('true');
    });

    it('passes disabled to PrimeVue Select', () => {
      const wrapper = mount(DsSelect, {
        props: { disabled: true, options: defaultOptions },
        global: globalConfig,
      });
      const select = wrapper.findComponent(Select);
      expect(select.props('disabled')).toBe(true);
    });

    it('does not show error message when disabled even if error prop is set', () => {
      const wrapper = mount(DsSelect, {
        props: { disabled: true, error: 'Error', options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__error-msg').exists()).toBe(false);
    });

    it('does not show clear button when disabled even with value', () => {
      const wrapper = mount(DsSelect, {
        props: { disabled: true, modelValue: 'Apple', options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__clear').exists()).toBe(false);
    });

    it('does not apply error class or aria-invalid when disabled with error', () => {
      const wrapper = mount(DsSelect, {
        props: { disabled: true, error: 'Error', options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__trigger--error').exists()).toBe(false);
      const select = wrapper.findComponent(Select);
      expect(select.attributes('aria-invalid')).toBeUndefined();
      expect(select.attributes('aria-describedby')).toBeUndefined();
    });
  });

  describe('filled state', () => {
    it('applies filled class when modelValue has a value', () => {
      const wrapper = mount(DsSelect, {
        props: { modelValue: 'Apple', options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__trigger--filled').exists()).toBe(true);
    });

    it('does not apply filled class when modelValue is empty string', () => {
      const wrapper = mount(DsSelect, {
        props: { modelValue: '', options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__trigger--filled').exists()).toBe(false);
    });

    it('does not apply filled class when modelValue is null', () => {
      const wrapper = mount(DsSelect, {
        props: { modelValue: null, options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__trigger--filled').exists()).toBe(false);
    });

    it('does not apply filled class when modelValue is undefined', () => {
      const wrapper = mount(DsSelect, {
        props: { options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__trigger--filled').exists()).toBe(false);
    });

    it('does not apply filled class when disabled even with value', () => {
      const wrapper = mount(DsSelect, {
        props: { disabled: true, modelValue: 'Apple', options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__trigger--filled').exists()).toBe(false);
    });
  });

  describe('v-model', () => {
    it('supports two-way binding via v-model', () => {
      const wrapper = mount(DsSelect, {
        props: { modelValue: 'Apple', options: defaultOptions },
        global: globalConfig,
      });
      const select = wrapper.findComponent(Select);
      expect(select.props('modelValue')).toBe('Apple');
    });
  });

  describe('clear button', () => {
    it('appears when hasValue and not disabled', () => {
      const wrapper = mount(DsSelect, {
        props: { modelValue: 'Apple', options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__clear').exists()).toBe(true);
    });

    it('hidden when no value', () => {
      const wrapper = mount(DsSelect, {
        props: { options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__clear').exists()).toBe(false);
    });

    it('clears value to undefined when clicked', async () => {
      const wrapper = mount(DsSelect, {
        props: { modelValue: 'Apple', options: defaultOptions },
        global: globalConfig,
      });
      await wrapper.find('.ds-select__clear').trigger('click');
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined]);
    });

    it('emits clear event when clicked', async () => {
      const wrapper = mount(DsSelect, {
        props: { modelValue: 'Apple', options: defaultOptions },
        global: globalConfig,
      });
      await wrapper.find('.ds-select__clear').trigger('click');
      expect(wrapper.emitted('clear')).toBeTruthy();
    });

    it('has aria-label="Clear"', () => {
      const wrapper = mount(DsSelect, {
        props: { modelValue: 'Apple', options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__clear').attributes('aria-label')).toBe('Clear');
    });

    it('clears value on Enter key', async () => {
      const wrapper = mount(DsSelect, {
        props: { modelValue: 'Apple', options: defaultOptions },
        global: globalConfig,
      });
      await wrapper.find('.ds-select__clear').trigger('keydown.enter');
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined]);
      expect(wrapper.emitted('clear')).toBeTruthy();
    });

    it('clears value on Space key', async () => {
      const wrapper = mount(DsSelect, {
        props: { modelValue: 'Apple', options: defaultOptions },
        global: globalConfig,
      });
      await wrapper.find('.ds-select__clear').trigger('keydown.space');
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined]);
      expect(wrapper.emitted('clear')).toBeTruthy();
    });
  });

  describe('chevron', () => {
    it('always renders the chevron', () => {
      const wrapper = mount(DsSelect, {
        props: { options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__chevron').exists()).toBe(true);
    });

    it('does not have open class by default', () => {
      const wrapper = mount(DsSelect, {
        props: { options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__chevron--open').exists()).toBe(false);
    });

    it('applies open class when PrimeVue Select emits show', async () => {
      const wrapper = mount(DsSelect, {
        props: { options: defaultOptions },
        global: globalConfig,
      });
      const select = wrapper.findComponent(Select);
      await select.vm.$emit('show');
      await wrapper.vm.$nextTick();
      expect(wrapper.find('.ds-select__chevron--open').exists()).toBe(true);
    });

    it('removes open class when PrimeVue Select emits hide', async () => {
      const wrapper = mount(DsSelect, {
        props: { options: defaultOptions },
        global: globalConfig,
      });
      const select = wrapper.findComponent(Select);
      await select.vm.$emit('show');
      await wrapper.vm.$nextTick();
      expect(wrapper.find('.ds-select__chevron--open').exists()).toBe(true);
      await select.vm.$emit('hide');
      await wrapper.vm.$nextTick();
      expect(wrapper.find('.ds-select__chevron--open').exists()).toBe(false);
    });
  });

  describe('leading icon slot', () => {
    it('renders leading icon slot content', () => {
      const wrapper = mount(DsSelect, {
        props: { options: defaultOptions },
        slots: { leading: '<span class="test-leading-icon">icon</span>' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__leading').exists()).toBe(true);
      expect(wrapper.find('.test-leading-icon').exists()).toBe(true);
    });

    it('does not render leading area when no slot content', () => {
      const wrapper = mount(DsSelect, {
        props: { options: defaultOptions },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-select__leading').exists()).toBe(false);
    });
  });

  describe('PrimeVue prop passthrough', () => {
    it('passes options through', () => {
      const wrapper = mount(DsSelect, {
        props: { options: defaultOptions },
        global: globalConfig,
      });
      const select = wrapper.findComponent(Select);
      expect(select.props('options')).toEqual(defaultOptions);
    });

    it('passes placeholder through $attrs', () => {
      const wrapper = mount(DsSelect, {
        props: { options: defaultOptions },
        attrs: { placeholder: 'Choose one' },
        global: globalConfig,
      });
      const select = wrapper.findComponent(Select);
      expect(select.props('placeholder')).toBe('Choose one');
    });

    it('passes optionLabel through $attrs', () => {
      const objOptions = [{ name: 'A', code: '1' }];
      const wrapper = mount(DsSelect, {
        props: { options: objOptions },
        attrs: { 'option-label': 'name', 'option-value': 'code' },
        global: globalConfig,
      });
      const select = wrapper.findComponent(Select);
      expect(select.props('optionLabel')).toBe('name');
      expect(select.props('optionValue')).toBe('code');
    });

    it('passes data-testid through $attrs', () => {
      const wrapper = mount(DsSelect, {
        props: { options: defaultOptions },
        attrs: { 'data-testid': 'country-select' },
        global: globalConfig,
      });
      expect(wrapper.find('[data-testid="country-select"]').exists()).toBe(true);
    });

    it('hides PrimeVue native showClear', () => {
      const wrapper = mount(DsSelect, {
        props: { options: defaultOptions },
        global: globalConfig,
      });
      const select = wrapper.findComponent(Select);
      expect(select.props('showClear')).toBe(false);
    });

    it('passes filter through $attrs', () => {
      const wrapper = mount(DsSelect, {
        props: { options: defaultOptions },
        attrs: { filter: true },
        global: globalConfig,
      });
      const select = wrapper.findComponent(Select);
      expect(select.props('filter')).toBe(true);
    });
  });
});
