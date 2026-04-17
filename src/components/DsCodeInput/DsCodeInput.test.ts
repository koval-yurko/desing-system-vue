import { mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import InputOtp from 'primevue/inputotp';
import { describe, expect, it } from 'vitest';
import DsCodeInput from './DsCodeInput.vue';

const globalConfig = {
  plugins: [[PrimeVue, { theme: 'none' }]],
};

describe('DsCodeInput', () => {
  describe('structure', () => {
    it('renders the outer .ds-code-input container with role="group"', () => {
      const wrapper = mount(DsCodeInput, { global: globalConfig });
      const root = wrapper.find('.ds-code-input');
      expect(root.exists()).toBe(true);
      expect(root.attributes('role')).toBe('group');
    });

    it('renders an InputOtp component instance', () => {
      const wrapper = mount(DsCodeInput, { global: globalConfig });
      expect(wrapper.findComponent(InputOtp).exists()).toBe(true);
    });

    it('does not render a label when no label prop is provided', () => {
      const wrapper = mount(DsCodeInput, { global: globalConfig });
      expect(wrapper.find('.ds-code-input__label').exists()).toBe(false);
    });

    it('does not render hint or error footer when neither is provided', () => {
      const wrapper = mount(DsCodeInput, { global: globalConfig });
      expect(wrapper.find('.ds-code-input__hint').exists()).toBe(false);
      expect(wrapper.find('.ds-code-input__error-msg').exists()).toBe(false);
    });
  });

  describe('label', () => {
    it('renders a <span> label (not a <label>) with matching aria-labelledby', () => {
      const wrapper = mount(DsCodeInput, {
        props: { label: 'Verification code' },
        global: globalConfig,
      });
      const label = wrapper.find('.ds-code-input__label');
      expect(label.exists()).toBe(true);
      expect(label.element.tagName.toLowerCase()).toBe('span');
      expect(label.text()).toBe('Verification code');

      const labelId = label.attributes('id');
      expect(labelId).toBeTruthy();
      expect(wrapper.find('.ds-code-input').attributes('aria-labelledby')).toBe(labelId);
    });

    it('does not use <label for> association', () => {
      const wrapper = mount(DsCodeInput, {
        props: { label: 'Verification code' },
        global: globalConfig,
      });
      expect(wrapper.find('label').exists()).toBe(false);
    });

    it('omits aria-labelledby when no label is provided', () => {
      const wrapper = mount(DsCodeInput, { global: globalConfig });
      expect(wrapper.find('.ds-code-input').attributes('aria-labelledby')).toBeUndefined();
    });

    it('treats whitespace-only label as absent', () => {
      const wrapper = mount(DsCodeInput, {
        props: { label: '   ' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-code-input__label').exists()).toBe(false);
      expect(wrapper.find('.ds-code-input').attributes('aria-labelledby')).toBeUndefined();
    });
  });

  describe('v-model', () => {
    it('forwards modelValue to PrimeVue InputOtp', () => {
      const wrapper = mount(DsCodeInput, {
        props: { modelValue: '12' },
        global: globalConfig,
      });
      const otp = wrapper.findComponent(InputOtp);
      expect(otp.props('modelValue')).toBe('12');
    });

    it('re-emits update:modelValue when InputOtp emits it', async () => {
      const wrapper = mount(DsCodeInput, {
        props: { modelValue: '' },
        global: globalConfig,
      });
      await wrapper.findComponent(InputOtp).vm.$emit('update:modelValue', '1234');
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['1234']);
    });

    it('round-trips a full-length value (e.g., paste) for non-default length', async () => {
      const wrapper = mount(DsCodeInput, {
        props: { modelValue: '' },
        attrs: { length: 6 },
        global: globalConfig,
      });
      await wrapper.findComponent(InputOtp).vm.$emit('update:modelValue', '123456');
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['123456']);
    });
  });

  describe('PrimeVue prop passthrough', () => {
    it('passes length through $attrs', () => {
      const wrapper = mount(DsCodeInput, {
        attrs: { length: 6 },
        global: globalConfig,
      });
      expect(wrapper.findComponent(InputOtp).props('length')).toBe(6);
    });

    it('passes integerOnly through $attrs', () => {
      const wrapper = mount(DsCodeInput, {
        attrs: { integerOnly: true },
        global: globalConfig,
      });
      expect(wrapper.findComponent(InputOtp).props('integerOnly')).toBe(true);
    });

    it('passes mask through $attrs', () => {
      const wrapper = mount(DsCodeInput, {
        attrs: { mask: true },
        global: globalConfig,
      });
      expect(wrapper.findComponent(InputOtp).props('mask')).toBe(true);
    });

    it('passes arbitrary data-testid through $attrs to the InputOtp root', () => {
      const wrapper = mount(DsCodeInput, {
        attrs: { 'data-testid': 'code' },
        global: globalConfig,
      });
      expect(wrapper.find('[data-testid="code"]').exists()).toBe(true);
    });

    it('deep-merges consumer pt with the internal placeholder injection', () => {
      const wrapper = mount(DsCodeInput, {
        attrs: {
          pt: { pcInputText: { root: { 'data-consumer': 'yes' } } },
        },
        global: globalConfig,
      });
      const forwarded = wrapper.findComponent(InputOtp).props('pt') as {
        pcInputText: { root: Record<string, string> };
      };
      expect(forwarded.pcInputText.root.placeholder).toBe(' ');
      expect(forwarded.pcInputText.root['data-consumer']).toBe('yes');
    });

    it('lets consumer pt override the internal placeholder', () => {
      const wrapper = mount(DsCodeInput, {
        attrs: {
          pt: { pcInputText: { root: { placeholder: 'X' } } },
        },
        global: globalConfig,
      });
      const forwarded = wrapper.findComponent(InputOtp).props('pt') as {
        pcInputText: { root: Record<string, string> };
      };
      expect(forwarded.pcInputText.root.placeholder).toBe('X');
    });
  });

  describe('hint', () => {
    it('renders hint text when hint prop is provided', () => {
      const wrapper = mount(DsCodeInput, {
        props: { hint: 'Check your email' },
        global: globalConfig,
      });
      const hint = wrapper.find('.ds-code-input__hint');
      expect(hint.exists()).toBe(true);
      expect(hint.text()).toBe('Check your email');
      expect(wrapper.find('.ds-code-input__error-msg').exists()).toBe(false);
    });

    it('treats whitespace-only hint as absent', () => {
      const wrapper = mount(DsCodeInput, {
        props: { hint: '   ' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-code-input__hint').exists()).toBe(false);
    });
  });

  describe('error state', () => {
    it('renders error message with icon and hides hint', () => {
      const wrapper = mount(DsCodeInput, {
        props: { hint: 'Help', error: 'Invalid code' },
        global: globalConfig,
      });
      const error = wrapper.find('.ds-code-input__error-msg');
      expect(error.exists()).toBe(true);
      expect(error.text()).toContain('Invalid code');
      expect(wrapper.find('.ds-code-input__error-msg-icon').exists()).toBe(true);
      expect(wrapper.find('.ds-code-input__hint').exists()).toBe(false);
    });

    it('links error message id to group aria-describedby and sets aria-invalid', () => {
      const wrapper = mount(DsCodeInput, {
        props: { error: 'Invalid code' },
        global: globalConfig,
      });
      const root = wrapper.find('.ds-code-input');
      const errorMsg = wrapper.find('.ds-code-input__error-msg');
      const errorId = errorMsg.attributes('id');
      expect(errorId).toBeTruthy();
      expect(root.attributes('aria-describedby')).toBe(errorId);
      expect(root.attributes('aria-invalid')).toBe('true');
    });

    it('applies the --error modifier class to the container', () => {
      const wrapper = mount(DsCodeInput, {
        props: { error: 'Invalid code' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-code-input--error').exists()).toBe(true);
    });

    it('does not set aria-invalid or aria-describedby when no error', () => {
      const wrapper = mount(DsCodeInput, { global: globalConfig });
      const root = wrapper.find('.ds-code-input');
      expect(root.attributes('aria-invalid')).toBeUndefined();
      expect(root.attributes('aria-describedby')).toBeUndefined();
    });

    it('routes aria-describedby and aria-invalid onto each cell input via pt', () => {
      const wrapper = mount(DsCodeInput, {
        props: { error: 'Invalid code' },
        global: globalConfig,
      });
      const errorId = wrapper.find('.ds-code-input__error-msg').attributes('id');
      const forwarded = wrapper.findComponent(InputOtp).props('pt') as {
        pcInputText: { root: Record<string, string> };
      };
      expect(forwarded.pcInputText.root['aria-describedby']).toBe(errorId);
      expect(forwarded.pcInputText.root['aria-invalid']).toBe('true');
    });

    it('does not inject aria-describedby on cells when no error', () => {
      const wrapper = mount(DsCodeInput, { global: globalConfig });
      const forwarded = wrapper.findComponent(InputOtp).props('pt') as {
        pcInputText: { root: Record<string, string> };
      };
      expect(forwarded.pcInputText.root['aria-describedby']).toBeUndefined();
      expect(forwarded.pcInputText.root['aria-invalid']).toBeUndefined();
    });

    it('treats whitespace-only error as absent', () => {
      const wrapper = mount(DsCodeInput, {
        props: { error: '   ' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-code-input__error-msg').exists()).toBe(false);
      expect(wrapper.find('.ds-code-input--error').exists()).toBe(false);
      expect(wrapper.find('.ds-code-input').attributes('aria-invalid')).toBeUndefined();
    });
  });

  describe('disabled state', () => {
    it('applies --disabled modifier and removes --transitions', () => {
      const wrapper = mount(DsCodeInput, {
        props: { disabled: true },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-code-input--disabled').exists()).toBe(true);
      expect(wrapper.find('.ds-code-input--transitions').exists()).toBe(false);
    });

    it('forwards disabled=true to InputOtp', () => {
      const wrapper = mount(DsCodeInput, {
        props: { disabled: true },
        global: globalConfig,
      });
      expect(wrapper.findComponent(InputOtp).props('disabled')).toBe(true);
    });

    it('suppresses error message when disabled + error', () => {
      const wrapper = mount(DsCodeInput, {
        props: { disabled: true, error: 'Invalid' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-code-input__error-msg').exists()).toBe(false);
      expect(wrapper.find('.ds-code-input--error').exists()).toBe(false);
      const root = wrapper.find('.ds-code-input');
      expect(root.attributes('aria-describedby')).toBeUndefined();
      expect(root.attributes('aria-invalid')).toBeUndefined();
    });
  });

  describe('container classes', () => {
    it('applies .ds-code-input and .ds-code-input--transitions by default', () => {
      const wrapper = mount(DsCodeInput, { global: globalConfig });
      expect(wrapper.find('.ds-code-input').exists()).toBe(true);
      expect(wrapper.find('.ds-code-input--transitions').exists()).toBe(true);
      expect(wrapper.find('.ds-code-input--error').exists()).toBe(false);
      expect(wrapper.find('.ds-code-input--disabled').exists()).toBe(false);
    });
  });
});
