import { mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import Textarea from 'primevue/textarea';
import { describe, expect, it } from 'vitest';
import DsTextarea from './DsTextarea.vue';

const globalConfig = {
  plugins: [[PrimeVue, { theme: 'none' }]],
};

describe('DsTextarea', () => {
  it('renders with default props (medium size, no label, no footer, rows=3)', () => {
    const wrapper = mount(DsTextarea, { global: globalConfig });
    expect(wrapper.find('.ds-textarea').exists()).toBe(true);
    expect(wrapper.find('.ds-textarea--medium').exists()).toBe(true);
    expect(wrapper.find('.ds-textarea__input--medium').exists()).toBe(true);
    expect(wrapper.find('.ds-textarea__label').exists()).toBe(false);
    expect(wrapper.find('.ds-textarea__footer').exists()).toBe(false);
    const textarea = wrapper.find('textarea');
    expect(textarea.attributes('rows')).toBe('3');
  });

  describe('sizes', () => {
    it('applies small size class', () => {
      const wrapper = mount(DsTextarea, {
        props: { size: 'small' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__input--small').exists()).toBe(true);
      expect(wrapper.find('.ds-textarea--small').exists()).toBe(true);
    });

    it('applies medium size class', () => {
      const wrapper = mount(DsTextarea, {
        props: { size: 'medium' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__input--medium').exists()).toBe(true);
      expect(wrapper.find('.ds-textarea--medium').exists()).toBe(true);
    });

    it('passes dt size tokens for small', () => {
      const wrapper = mount(DsTextarea, {
        props: { size: 'small' },
        global: globalConfig,
      });
      const textarea = wrapper.findComponent(Textarea);
      const dt = textarea.props('dt') as Record<string, unknown>;
      expect(dt.paddingX).toBe('0.75rem');
      expect(dt.paddingY).toBe('0.375rem');
      expect(dt.fontSize).toBe('0.875rem');
    });

    it('passes dt size tokens for medium', () => {
      const wrapper = mount(DsTextarea, {
        props: { size: 'medium' },
        global: globalConfig,
      });
      const textarea = wrapper.findComponent(Textarea);
      const dt = textarea.props('dt') as Record<string, unknown>;
      expect(dt.paddingX).toBe('0.75rem');
      expect(dt.paddingY).toBe('0.5rem');
      expect(dt.fontSize).toBe('0.875rem');
    });
  });

  describe('label', () => {
    it('renders label text when label prop is provided', () => {
      const wrapper = mount(DsTextarea, {
        props: { label: 'Description' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__label').exists()).toBe(true);
      expect(wrapper.find('.ds-textarea__label-text').text()).toBe('Description');
    });

    it('does not render label when prop is not provided', () => {
      const wrapper = mount(DsTextarea, { global: globalConfig });
      expect(wrapper.find('.ds-textarea__label').exists()).toBe(false);
    });

    it('shows mandatory asterisk when mandatory is true', () => {
      const wrapper = mount(DsTextarea, {
        props: { label: 'Comments', mandatory: true },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__label-mandatory').exists()).toBe(true);
      expect(wrapper.find('.ds-textarea__label-mandatory').text()).toBe('*');
    });

    it('does not show asterisk when mandatory is false', () => {
      const wrapper = mount(DsTextarea, {
        props: { label: 'Comments' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__label-mandatory').exists()).toBe(false);
    });

    it('shows "(Optional)" text when optional is true', () => {
      const wrapper = mount(DsTextarea, {
        props: { label: 'Notes', optional: true },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__label-optional').exists()).toBe(true);
      expect(wrapper.find('.ds-textarea__label-optional').text()).toBe('(Optional)');
    });

    it('shows info icon when info is true', () => {
      const wrapper = mount(DsTextarea, {
        props: { label: 'Bio', info: true },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__label-info').exists()).toBe(true);
    });

    it('links label to textarea via for/id', () => {
      const wrapper = mount(DsTextarea, {
        props: { label: 'Description' },
        global: globalConfig,
      });
      const label = wrapper.find('.ds-textarea__label');
      const textarea = wrapper.findComponent(Textarea);
      const inputId = textarea.attributes('id');
      expect(inputId).toBeTruthy();
      expect(label.attributes('for')).toBe(inputId);
    });

    it('renders neither when both mandatory and optional are true', () => {
      const wrapper = mount(DsTextarea, {
        props: { label: 'Field', mandatory: true, optional: true },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__label-mandatory').exists()).toBe(false);
      expect(wrapper.find('.ds-textarea__label-optional').exists()).toBe(false);
    });
  });

  describe('hint text', () => {
    it('renders hint text below textarea', () => {
      const wrapper = mount(DsTextarea, {
        props: { hint: 'Describe the issue in detail' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__hint').exists()).toBe(true);
      expect(wrapper.find('.ds-textarea__hint').text()).toBe('Describe the issue in detail');
    });

    it('does not render footer when no hint, error, or maxLength', () => {
      const wrapper = mount(DsTextarea, { global: globalConfig });
      expect(wrapper.find('.ds-textarea__footer').exists()).toBe(false);
    });

    it('links hint text to textarea via aria-describedby', () => {
      const wrapper = mount(DsTextarea, {
        props: { hint: 'Help text' },
        global: globalConfig,
      });
      const hintEl = wrapper.find('.ds-textarea__hint');
      const hintIdVal = hintEl.attributes('id');
      expect(hintIdVal).toBeTruthy();
      const textarea = wrapper.findComponent(Textarea);
      expect(textarea.attributes('aria-describedby')).toBe(hintIdVal);
    });

    it('does not set aria-describedby when no hint or error', () => {
      const wrapper = mount(DsTextarea, { global: globalConfig });
      const textarea = wrapper.findComponent(Textarea);
      expect(textarea.attributes('aria-describedby')).toBeUndefined();
    });
  });

  describe('error state', () => {
    it('applies error class and shows error message with icon', () => {
      const wrapper = mount(DsTextarea, {
        props: { error: 'Field is required' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__input--error').exists()).toBe(true);
      expect(wrapper.find('.ds-textarea__error-msg').exists()).toBe(true);
      expect(wrapper.find('.ds-textarea__error-msg').text()).toContain('Field is required');
      expect(wrapper.find('.ds-textarea__error-msg-icon').exists()).toBe(true);
    });

    it('links error message to textarea via aria-describedby', () => {
      const wrapper = mount(DsTextarea, {
        props: { error: 'Field is required' },
        global: globalConfig,
      });
      const errorMsg = wrapper.find('.ds-textarea__error-msg');
      const errorIdVal = errorMsg.attributes('id');
      expect(errorIdVal).toBeTruthy();
      const textarea = wrapper.findComponent(Textarea);
      expect(textarea.attributes('aria-describedby')).toBe(errorIdVal);
    });

    it('sets aria-invalid to true on the textarea when error is present', () => {
      const wrapper = mount(DsTextarea, {
        props: { error: 'Field is required' },
        global: globalConfig,
      });
      const textarea = wrapper.findComponent(Textarea);
      expect(textarea.attributes('aria-invalid')).toBe('true');
    });

    it('does not show aria-invalid when no error', () => {
      const wrapper = mount(DsTextarea, { global: globalConfig });
      const textarea = wrapper.findComponent(Textarea);
      expect(textarea.attributes('aria-invalid')).toBeUndefined();
    });

    it('error takes priority over hint display', () => {
      const wrapper = mount(DsTextarea, {
        props: { hint: 'Some hint', error: 'An error' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__error-msg').exists()).toBe(true);
      expect(wrapper.find('.ds-textarea__hint').exists()).toBe(false);
    });
  });

  describe('disabled state', () => {
    it('applies disabled class and removes transitions', () => {
      const wrapper = mount(DsTextarea, {
        props: { disabled: true },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__input--disabled').exists()).toBe(true);
      expect(wrapper.find('.ds-textarea__input--transitions').exists()).toBe(false);
    });

    it('sets aria-disabled on the textarea', () => {
      const wrapper = mount(DsTextarea, {
        props: { disabled: true },
        global: globalConfig,
      });
      const textarea = wrapper.findComponent(Textarea);
      expect(textarea.attributes('aria-disabled')).toBe('true');
    });

    it('passes disabled to PrimeVue Textarea', () => {
      const wrapper = mount(DsTextarea, {
        props: { disabled: true },
        global: globalConfig,
      });
      const textarea = wrapper.findComponent(Textarea);
      expect(textarea.props('disabled')).toBe(true);
    });

    it('does not show error message when disabled even if error prop is set', () => {
      const wrapper = mount(DsTextarea, {
        props: { disabled: true, error: 'Error' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__error-msg').exists()).toBe(false);
    });

    it('does not show clear button when disabled', async () => {
      const wrapper = mount(DsTextarea, {
        props: { disabled: true, modelValue: 'hello' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__clear').exists()).toBe(false);
    });

    it('does not apply error class or aria-invalid when disabled with error', () => {
      const wrapper = mount(DsTextarea, {
        props: { disabled: true, error: 'Error' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__input--error').exists()).toBe(false);
      const textarea = wrapper.findComponent(Textarea);
      expect(textarea.attributes('aria-invalid')).toBeUndefined();
      expect(textarea.attributes('aria-describedby')).toBeUndefined();
    });
  });

  describe('filled state', () => {
    it('applies filled class when modelValue has a value', () => {
      const wrapper = mount(DsTextarea, {
        props: { modelValue: 'hello' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__input--filled').exists()).toBe(true);
    });

    it('does not apply filled class when modelValue is empty', () => {
      const wrapper = mount(DsTextarea, {
        props: { modelValue: '' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__input--filled').exists()).toBe(false);
    });

    it('does not apply filled class when no modelValue is provided', () => {
      const wrapper = mount(DsTextarea, { global: globalConfig });
      expect(wrapper.find('.ds-textarea__input--filled').exists()).toBe(false);
    });

    it('does not apply filled class when disabled even with value', () => {
      const wrapper = mount(DsTextarea, {
        props: { disabled: true, modelValue: 'hello' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__input--filled').exists()).toBe(false);
    });
  });

  describe('v-model', () => {
    it('supports two-way binding via v-model', async () => {
      const wrapper = mount(DsTextarea, {
        props: { modelValue: 'initial' },
        global: globalConfig,
      });
      const textarea = wrapper.find('textarea');
      await textarea.setValue('updated');
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['updated']);
    });
  });

  describe('clear button', () => {
    it('shows clear button when focused and has value', async () => {
      const wrapper = mount(DsTextarea, {
        props: { modelValue: 'hello' },
        global: globalConfig,
      });
      const inputWrapper = wrapper.find('.ds-textarea__input');
      await inputWrapper.trigger('focusin');
      expect(wrapper.find('.ds-textarea__clear').exists()).toBe(true);
    });

    it('hides clear button when not focused and no error', () => {
      const wrapper = mount(DsTextarea, {
        props: { modelValue: 'hello' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__clear').exists()).toBe(false);
    });

    it('shows clear button when in error state with value', () => {
      const wrapper = mount(DsTextarea, {
        props: { modelValue: 'hello', error: 'Error' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__clear').exists()).toBe(true);
    });

    it('does not show clear button when disabled', () => {
      const wrapper = mount(DsTextarea, {
        props: { modelValue: 'hello', disabled: true, error: 'Error' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__clear').exists()).toBe(false);
    });

    it('clears value when clear button is clicked', async () => {
      const wrapper = mount(DsTextarea, {
        props: { modelValue: 'hello', error: 'Error' },
        global: globalConfig,
      });
      await wrapper.find('.ds-textarea__clear').trigger('click');
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
      expect(wrapper.emitted('clear')).toBeTruthy();
    });

    it('clears value when Enter key is pressed on clear button', async () => {
      const wrapper = mount(DsTextarea, {
        props: { modelValue: 'hello', error: 'Error' },
        global: globalConfig,
      });
      await wrapper.find('.ds-textarea__clear').trigger('keydown.enter');
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
      expect(wrapper.emitted('clear')).toBeTruthy();
    });

    it('clears value when Space key is pressed on clear button', async () => {
      const wrapper = mount(DsTextarea, {
        props: { modelValue: 'hello', error: 'Error' },
        global: globalConfig,
      });
      await wrapper.find('.ds-textarea__clear').trigger('keydown.space');
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
      expect(wrapper.emitted('clear')).toBeTruthy();
    });

    it('has aria-label="Clear" on clear button', async () => {
      const wrapper = mount(DsTextarea, {
        props: { modelValue: 'hello', error: 'Error' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__clear').attributes('aria-label')).toBe('Clear');
    });
  });

  describe('character counter', () => {
    it('renders counter when maxLength is set', () => {
      const wrapper = mount(DsTextarea, {
        props: { maxLength: 100 },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__counter').exists()).toBe(true);
      expect(wrapper.find('.ds-textarea__counter').text()).toBe('0/100');
    });

    it('does not render counter when maxLength is not set', () => {
      const wrapper = mount(DsTextarea, { global: globalConfig });
      expect(wrapper.find('.ds-textarea__counter').exists()).toBe(false);
    });

    it('displays current length in counter', () => {
      const wrapper = mount(DsTextarea, {
        props: { maxLength: 50, modelValue: 'hello' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__counter').text()).toBe('5/50');
    });

    it('applies overflow class to numerator when exceeding maxLength', () => {
      const wrapper = mount(DsTextarea, {
        props: { maxLength: 5, modelValue: 'exceeds' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__counter-over').exists()).toBe(true);
    });

    it('does not apply overflow class when within limit', () => {
      const wrapper = mount(DsTextarea, {
        props: { maxLength: 100, modelValue: 'ok' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__counter-over').exists()).toBe(false);
    });

    it('triggers error state on wrapper when counter overflows', () => {
      const wrapper = mount(DsTextarea, {
        props: { maxLength: 5, modelValue: 'exceeds' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__input--error').exists()).toBe(true);
    });

    it('sets aria-invalid when counter overflows', () => {
      const wrapper = mount(DsTextarea, {
        props: { maxLength: 5, modelValue: 'exceeds' },
        global: globalConfig,
      });
      const textarea = wrapper.findComponent(Textarea);
      expect(textarea.attributes('aria-invalid')).toBe('true');
    });

    it('counter coexists with hint text', () => {
      const wrapper = mount(DsTextarea, {
        props: { maxLength: 100, hint: 'A hint' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__hint').exists()).toBe(true);
      expect(wrapper.find('.ds-textarea__counter').exists()).toBe(true);
    });

    it('counter coexists with error text', () => {
      const wrapper = mount(DsTextarea, {
        props: { maxLength: 100, error: 'An error' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__error-msg').exists()).toBe(true);
      expect(wrapper.find('.ds-textarea__counter').exists()).toBe(true);
    });

    it('does not trigger error on wrapper when disabled even if overflow', () => {
      const wrapper = mount(DsTextarea, {
        props: { maxLength: 5, modelValue: 'exceeds', disabled: true },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-textarea__input--error').exists()).toBe(false);
    });
  });

  describe('PrimeVue prop passthrough', () => {
    it('passes rows through props', () => {
      const wrapper = mount(DsTextarea, {
        props: { rows: 5 },
        global: globalConfig,
      });
      const textarea = wrapper.find('textarea');
      expect(textarea.attributes('rows')).toBe('5');
    });

    it('passes placeholder through $attrs', () => {
      const wrapper = mount(DsTextarea, {
        attrs: { placeholder: 'Enter description' },
        global: globalConfig,
      });
      const textarea = wrapper.find('textarea');
      expect(textarea.attributes('placeholder')).toBe('Enter description');
    });

    it('passes data-testid through $attrs', () => {
      const wrapper = mount(DsTextarea, {
        attrs: { 'data-testid': 'description-textarea' },
        global: globalConfig,
      });
      expect(wrapper.find('[data-testid="description-textarea"]').exists()).toBe(true);
    });

    it('passes autoResize through $attrs', () => {
      // Mock ResizeObserver needed by PrimeVue Textarea autoResize
      globalThis.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
      } as unknown as typeof ResizeObserver;
      try {
        const wrapper = mount(DsTextarea, {
          attrs: { autoResize: true },
          global: globalConfig,
        });
        const textarea = wrapper.findComponent(Textarea);
        expect(textarea.props('autoResize')).toBe(true);
      } finally {
        (globalThis as Record<string, unknown>).ResizeObserver = undefined;
      }
    });
  });
});
