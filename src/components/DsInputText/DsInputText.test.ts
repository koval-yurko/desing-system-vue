import { mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import InputText from 'primevue/inputtext';
import { describe, expect, it } from 'vitest';
import DsInputText from './DsInputText.vue';

const globalConfig = {
  plugins: [[PrimeVue, { theme: 'none' }]],
};

describe('DsInputText', () => {
  it('renders with default props (medium size, no label, no hint)', () => {
    const wrapper = mount(DsInputText, { global: globalConfig });
    expect(wrapper.find('.ds-input-text').exists()).toBe(true);
    expect(wrapper.find('.ds-input-text--medium').exists()).toBe(true);
    expect(wrapper.find('.ds-input-text__input--medium').exists()).toBe(true);
    expect(wrapper.find('.ds-input-text__label').exists()).toBe(false);
    expect(wrapper.find('.ds-input-text__footer').exists()).toBe(false);
  });

  describe('sizes', () => {
    it('applies small size class (32px height)', () => {
      const wrapper = mount(DsInputText, {
        props: { size: 'small' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-input-text__input--small').exists()).toBe(true);
      expect(wrapper.find('.ds-input-text--small').exists()).toBe(true);
    });

    it('applies medium size class (40px height)', () => {
      const wrapper = mount(DsInputText, {
        props: { size: 'medium' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-input-text__input--medium').exists()).toBe(true);
      expect(wrapper.find('.ds-input-text--medium').exists()).toBe(true);
    });

    it('passes dt size tokens for small', () => {
      const wrapper = mount(DsInputText, {
        props: { size: 'small' },
        global: globalConfig,
      });
      const input = wrapper.findComponent(InputText);
      const dt = input.props('dt') as Record<string, unknown>;
      expect(dt.paddingX).toBe('0.75rem');
      expect(dt.paddingY).toBe('0.375rem');
      expect(dt.fontSize).toBe('0.875rem');
    });

    it('passes dt size tokens for medium', () => {
      const wrapper = mount(DsInputText, {
        props: { size: 'medium' },
        global: globalConfig,
      });
      const input = wrapper.findComponent(InputText);
      const dt = input.props('dt') as Record<string, unknown>;
      expect(dt.paddingX).toBe('0.75rem');
      expect(dt.paddingY).toBe('0.5rem');
      expect(dt.fontSize).toBe('0.875rem');
    });
  });

  describe('label', () => {
    it('renders label text when label prop is provided', () => {
      const wrapper = mount(DsInputText, {
        props: { label: 'Email' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-input-text__label').exists()).toBe(true);
      expect(wrapper.find('.ds-input-text__label-text').text()).toBe('Email');
    });

    it('does not render label when prop is not provided', () => {
      const wrapper = mount(DsInputText, { global: globalConfig });
      expect(wrapper.find('.ds-input-text__label').exists()).toBe(false);
    });

    it('shows mandatory asterisk when mandatory is true', () => {
      const wrapper = mount(DsInputText, {
        props: { label: 'Email', mandatory: true },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-input-text__label-mandatory').exists()).toBe(true);
      expect(wrapper.find('.ds-input-text__label-mandatory').text()).toBe('*');
    });

    it('does not show asterisk when mandatory is false', () => {
      const wrapper = mount(DsInputText, {
        props: { label: 'Email' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-input-text__label-mandatory').exists()).toBe(false);
    });

    it('shows "(Optional)" text when optional is true', () => {
      const wrapper = mount(DsInputText, {
        props: { label: 'Email', optional: true },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-input-text__label-optional').exists()).toBe(true);
      expect(wrapper.find('.ds-input-text__label-optional').text()).toBe('(Optional)');
    });

    it('shows info icon when info is true', () => {
      const wrapper = mount(DsInputText, {
        props: { label: 'Email', info: true },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-input-text__label-info').exists()).toBe(true);
    });

    it('links label to input via for/id', () => {
      const wrapper = mount(DsInputText, {
        props: { label: 'Email' },
        global: globalConfig,
      });
      const label = wrapper.find('.ds-input-text__label');
      const input = wrapper.findComponent(InputText);
      const inputId = input.attributes('id');
      expect(inputId).toBeTruthy();
      expect(label.attributes('for')).toBe(inputId);
    });

    it('mandatory takes precedence over optional when both are true', () => {
      const wrapper = mount(DsInputText, {
        props: { label: 'Email', mandatory: true, optional: true },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-input-text__label-mandatory').exists()).toBe(false);
      expect(wrapper.find('.ds-input-text__label-optional').exists()).toBe(false);
    });
  });

  describe('hint text', () => {
    it('renders hint text below input', () => {
      const wrapper = mount(DsInputText, {
        props: { hint: 'Enter a valid email' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-input-text__hint').exists()).toBe(true);
      expect(wrapper.find('.ds-input-text__hint').text()).toBe('Enter a valid email');
    });

    it('does not render footer when no hint or error', () => {
      const wrapper = mount(DsInputText, { global: globalConfig });
      expect(wrapper.find('.ds-input-text__footer').exists()).toBe(false);
    });
  });

  describe('error state', () => {
    it('applies error class and shows error message with icon', () => {
      const wrapper = mount(DsInputText, {
        props: { error: 'Invalid email' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-input-text__input--error').exists()).toBe(true);
      expect(wrapper.find('.ds-input-text__error-msg').exists()).toBe(true);
      expect(wrapper.find('.ds-input-text__error-msg').text()).toContain('Invalid email');
      expect(wrapper.find('.ds-input-text__error-msg-icon').exists()).toBe(true);
    });

    it('links error message to input via aria-describedby', () => {
      const wrapper = mount(DsInputText, {
        props: { error: 'Invalid email' },
        global: globalConfig,
      });
      const errorMsg = wrapper.find('.ds-input-text__error-msg');
      const errorId = errorMsg.attributes('id');
      expect(errorId).toBeTruthy();
      const input = wrapper.findComponent(InputText);
      expect(input.attributes('aria-describedby')).toBe(errorId);
    });

    it('sets aria-invalid to true on the input when error is present', () => {
      const wrapper = mount(DsInputText, {
        props: { error: 'Invalid email' },
        global: globalConfig,
      });
      const input = wrapper.findComponent(InputText);
      expect(input.attributes('aria-invalid')).toBe('true');
    });

    it('does not show aria-invalid when no error', () => {
      const wrapper = mount(DsInputText, { global: globalConfig });
      const input = wrapper.findComponent(InputText);
      expect(input.attributes('aria-invalid')).toBeUndefined();
    });

    it('shows error icon in the input row when error is present', () => {
      const wrapper = mount(DsInputText, {
        props: { error: 'Bad input' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-input-text__error-icon').exists()).toBe(true);
    });

    it('error takes priority over hint display', () => {
      const wrapper = mount(DsInputText, {
        props: { hint: 'Some hint', error: 'An error' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-input-text__error-msg').exists()).toBe(true);
      expect(wrapper.find('.ds-input-text__hint').exists()).toBe(false);
    });
  });

  describe('leading slot', () => {
    it('renders leading icon slot content', () => {
      const wrapper = mount(DsInputText, {
        slots: { leading: '<span class="test-leading-icon">icon</span>' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-input-text__leading').exists()).toBe(true);
      expect(wrapper.find('.test-leading-icon').exists()).toBe(true);
    });

    it('does not render leading area when no slot content', () => {
      const wrapper = mount(DsInputText, { global: globalConfig });
      expect(wrapper.find('.ds-input-text__leading').exists()).toBe(false);
    });
  });

  describe('trailing elements', () => {
    it('shows dropdown icon when showDropdownIcon is true', () => {
      const wrapper = mount(DsInputText, {
        props: { showDropdownIcon: true },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-input-text__dropdown').exists()).toBe(true);
    });

    it('hides dropdown icon by default', () => {
      const wrapper = mount(DsInputText, { global: globalConfig });
      expect(wrapper.find('.ds-input-text__dropdown').exists()).toBe(false);
    });

    it('hides dropdown icon when error state is active', () => {
      const wrapper = mount(DsInputText, {
        props: { showDropdownIcon: true, error: 'Error' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-input-text__dropdown').exists()).toBe(false);
      expect(wrapper.find('.ds-input-text__error-icon').exists()).toBe(true);
    });

    it('shows clear button when clearable and input has value', async () => {
      const wrapper = mount(DsInputText, {
        props: { clearable: true, modelValue: 'hello' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-input-text__clear').exists()).toBe(true);
    });

    it('hides clear button when clearable but input is empty', () => {
      const wrapper = mount(DsInputText, {
        props: { clearable: true, modelValue: '' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-input-text__clear').exists()).toBe(false);
    });

    it('clears value when clear button is clicked', async () => {
      const wrapper = mount(DsInputText, {
        props: { clearable: true, modelValue: 'hello' },
        global: globalConfig,
      });
      await wrapper.find('.ds-input-text__clear').trigger('click');
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
      expect(wrapper.emitted('clear')).toBeTruthy();
    });

    it('clears value when Space key is pressed on clear button', async () => {
      const wrapper = mount(DsInputText, {
        props: { clearable: true, modelValue: 'hello' },
        global: globalConfig,
      });
      await wrapper.find('.ds-input-text__clear').trigger('keydown.space');
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
      expect(wrapper.emitted('clear')).toBeTruthy();
    });
  });

  describe('disabled state', () => {
    it('applies disabled class and removes transitions', () => {
      const wrapper = mount(DsInputText, {
        props: { disabled: true },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-input-text__input--disabled').exists()).toBe(true);
      expect(wrapper.find('.ds-input-text__input--transitions').exists()).toBe(false);
    });

    it('sets aria-disabled on the input', () => {
      const wrapper = mount(DsInputText, {
        props: { disabled: true },
        global: globalConfig,
      });
      const input = wrapper.findComponent(InputText);
      expect(input.attributes('aria-disabled')).toBe('true');
    });

    it('passes disabled to PrimeVue InputText', () => {
      const wrapper = mount(DsInputText, {
        props: { disabled: true },
        global: globalConfig,
      });
      const input = wrapper.findComponent(InputText);
      expect(input.props('disabled')).toBe(true);
    });

    it('does not show error message when disabled even if error prop is set', () => {
      const wrapper = mount(DsInputText, {
        props: { disabled: true, error: 'Error' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-input-text__error-msg').exists()).toBe(false);
    });

    it('does not show clear button when disabled', () => {
      const wrapper = mount(DsInputText, {
        props: { disabled: true, clearable: true, modelValue: 'hello' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-input-text__clear').exists()).toBe(false);
    });

    it('does not apply error class or aria-invalid when disabled with error', () => {
      const wrapper = mount(DsInputText, {
        props: { disabled: true, error: 'Error' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-input-text__input--error').exists()).toBe(false);
      const input = wrapper.findComponent(InputText);
      expect(input.attributes('aria-invalid')).toBeUndefined();
      expect(input.attributes('aria-describedby')).toBeUndefined();
    });
  });

  describe('filled state', () => {
    it('applies filled class when modelValue has a value', () => {
      const wrapper = mount(DsInputText, {
        props: { modelValue: 'hello' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-input-text__input--filled').exists()).toBe(true);
    });

    it('does not apply filled class when modelValue is empty', () => {
      const wrapper = mount(DsInputText, {
        props: { modelValue: '' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-input-text__input--filled').exists()).toBe(false);
    });

    it('does not apply filled class when no modelValue is provided', () => {
      const wrapper = mount(DsInputText, { global: globalConfig });
      expect(wrapper.find('.ds-input-text__input--filled').exists()).toBe(false);
    });

    it('does not apply filled class when disabled even with value', () => {
      const wrapper = mount(DsInputText, {
        props: { disabled: true, modelValue: 'hello' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-input-text__input--filled').exists()).toBe(false);
    });
  });

  describe('v-model', () => {
    it('supports two-way binding via v-model', async () => {
      const wrapper = mount(DsInputText, {
        props: { modelValue: 'initial' },
        global: globalConfig,
      });
      const input = wrapper.find('input');
      await input.setValue('updated');
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['updated']);
    });
  });

  describe('PrimeVue prop passthrough', () => {
    it('passes placeholder through $attrs', () => {
      const wrapper = mount(DsInputText, {
        attrs: { placeholder: 'Enter email' },
        global: globalConfig,
      });
      const input = wrapper.find('input');
      expect(input.attributes('placeholder')).toBe('Enter email');
    });

    it('passes maxlength through $attrs', () => {
      const wrapper = mount(DsInputText, {
        attrs: { maxlength: '100' },
        global: globalConfig,
      });
      const input = wrapper.find('input');
      expect(input.attributes('maxlength')).toBe('100');
    });

    it('passes data-testid through $attrs', () => {
      const wrapper = mount(DsInputText, {
        attrs: { 'data-testid': 'email-input' },
        global: globalConfig,
      });
      expect(wrapper.find('[data-testid="email-input"]').exists()).toBe(true);
    });
  });
});
