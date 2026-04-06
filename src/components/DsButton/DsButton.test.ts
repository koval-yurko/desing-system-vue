import { mount } from '@vue/test-utils';
import Button from 'primevue/button';
import PrimeVue from 'primevue/config';
import { describe, expect, it, vi } from 'vitest';
import DsButton from './DsButton.vue';

const globalConfig = {
  plugins: [[PrimeVue, { theme: 'none' }]],
};

describe('DsButton', () => {
  it('renders with default props (primary, medium)', () => {
    const wrapper = mount(DsButton, { global: globalConfig });
    const btn = wrapper.findComponent(Button);
    expect(btn.exists()).toBe(true);
    expect(wrapper.classes()).toContain('ds-button');
    expect(wrapper.classes()).toContain('ds-button--primary');
    expect(wrapper.classes()).toContain('ds-button--medium');
  });

  describe('severity variants', () => {
    it.each([
      ['primary', null, null],
      ['outlined', null, 'outlined'],
      ['tertiary', 'secondary', null],
      ['text', null, 'text'],
      ['text-link', null, 'link'],
      ['negative', 'danger', null],
    ] as const)('renders %s variant with correct PrimeVue mapping (severity=%s, variant=%s)', (dsSeverity, expectedSeverity, expectedVariant) => {
      const wrapper = mount(DsButton, {
        props: { severity: dsSeverity },
        global: globalConfig,
      });
      const btn = wrapper.findComponent(Button);
      expect(btn.props('severity')).toBe(expectedSeverity);
      expect(btn.props('variant')).toBe(expectedVariant);
      expect(wrapper.classes()).toContain(`ds-button--${dsSeverity}`);
    });
  });

  describe('sizes', () => {
    it.each([
      ['xsmall', 'small'],
      ['small', 'small'],
      ['medium', null],
      ['large', 'large'],
    ] as const)('applies correct PrimeVue size for %s (mapped=%s)', (dsSize, expectedPvSize) => {
      const wrapper = mount(DsButton, {
        props: { size: dsSize },
        global: globalConfig,
      });
      const btn = wrapper.findComponent(Button);
      expect(btn.props('size')).toBe(expectedPvSize);
      expect(wrapper.classes()).toContain(`ds-button--${dsSize}`);
    });

    it('passes dt size tokens for xsmall', () => {
      const wrapper = mount(DsButton, {
        props: { size: 'xsmall' },
        global: globalConfig,
      });
      const btn = wrapper.findComponent(Button);
      const dt = btn.props('dt') as Record<string, unknown>;
      expect(dt.fontSize).toBe('0.75rem');
      expect(dt.paddingX).toBe('0.25rem');
      expect(dt.paddingY).toBe('3px');
      expect(dt.borderRadius).toBe('4px');
    });

    it('passes dt size tokens for small', () => {
      const wrapper = mount(DsButton, {
        props: { size: 'small' },
        global: globalConfig,
      });
      const btn = wrapper.findComponent(Button);
      const dt = btn.props('dt') as Record<string, unknown>;
      expect(dt.fontSize).toBe('0.875rem');
      expect(dt.paddingX).toBe('2rem');
      expect(dt.paddingY).toBe('5px');
      expect(dt.borderRadius).toBe('8px');
    });

    it('passes dt size tokens for medium', () => {
      const wrapper = mount(DsButton, {
        props: { size: 'medium' },
        global: globalConfig,
      });
      const btn = wrapper.findComponent(Button);
      const dt = btn.props('dt') as Record<string, unknown>;
      expect(dt.fontSize).toBe('0.875rem');
      expect(dt.paddingX).toBe('2rem');
      expect(dt.paddingY).toBe('7px');
      expect(dt.borderRadius).toBe('8px');
    });

    it('passes dt size tokens for large', () => {
      const wrapper = mount(DsButton, {
        props: { size: 'large' },
        global: globalConfig,
      });
      const btn = wrapper.findComponent(Button);
      const dt = btn.props('dt') as Record<string, unknown>;
      expect(dt.fontSize).toBe('0.875rem');
      expect(dt.paddingX).toBe('2rem');
      expect(dt.paddingY).toBe('9px');
      expect(dt.borderRadius).toBe('8px');
    });
  });

  describe('typography per size', () => {
    it.each([
      ['xsmall', '400', 'normal', '16px'],
      ['small', '500', '-0.2px', '20px'],
      ['medium', '600', '-0.2px', '20px'],
      ['large', '600', '-0.2px', '20px'],
    ] as const)('applies correct font weight, letter spacing, line height for %s', (dsSize, expectedWeight, expectedSpacing, expectedLineHeight) => {
      const wrapper = mount(DsButton, {
        props: { size: dsSize },
        global: globalConfig,
      });
      const style = wrapper.attributes('style') || '';
      expect(style).toContain(`font-weight: ${expectedWeight}`);
      if (expectedSpacing === 'normal') {
        expect(style).toContain('letter-spacing: 0');
      } else {
        expect(style).toContain(`letter-spacing: ${expectedSpacing}`);
      }
      expect(style).toContain(`line-height: ${expectedLineHeight}`);
    });
  });

  describe('disabled state', () => {
    it('applies disabled class, aria-disabled, and removes transitions', () => {
      const wrapper = mount(DsButton, {
        props: { disabled: true },
        global: globalConfig,
      });
      expect(wrapper.classes()).toContain('ds-button--disabled');
      expect(wrapper.classes()).not.toContain('ds-button--transitions');
      expect(wrapper.attributes('aria-disabled')).toBe('true');
    });

    it('passes disabled to the rendered button element', () => {
      const wrapper = mount(DsButton, {
        props: { disabled: true },
        global: globalConfig,
      });
      const button = wrapper.find('button');
      expect(button.element.disabled).toBe(true);
    });

    it('has transitions when not disabled', () => {
      const wrapper = mount(DsButton, { global: globalConfig });
      expect(wrapper.classes()).toContain('ds-button--transitions');
      expect(wrapper.classes()).not.toContain('ds-button--disabled');
    });
  });

  describe('loading state', () => {
    it('shows dot-based loading indicator', () => {
      const wrapper = mount(DsButton, {
        props: { loading: true },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-button-loading-overlay').exists()).toBe(true);
      expect(wrapper.findAll('.ds-button-loading-dots > span')).toHaveLength(3);
    });

    it('does not render loading elements when not loading', () => {
      const wrapper = mount(DsButton, { global: globalConfig });
      expect(wrapper.find('.ds-button-loading-overlay').exists()).toBe(false);
      expect(wrapper.find('.ds-button-loading-dots').exists()).toBe(false);
    });

    it('applies loading class with pointer-events prevention', () => {
      const wrapper = mount(DsButton, {
        props: { loading: true },
        global: globalConfig,
      });
      expect(wrapper.classes()).toContain('ds-button--loading');
    });

    it('adds aria-live="polite" when loading', () => {
      const wrapper = mount(DsButton, {
        props: { loading: true },
        global: globalConfig,
      });
      expect(wrapper.attributes('aria-live')).toBe('polite');
    });

    it('does not have aria-live when not loading', () => {
      const wrapper = mount(DsButton, { global: globalConfig });
      expect(wrapper.attributes('aria-live')).toBeUndefined();
    });

    it('adds aria-busy="true" when loading', () => {
      const wrapper = mount(DsButton, {
        props: { loading: true },
        global: globalConfig,
      });
      expect(wrapper.attributes('aria-busy')).toBe('true');
    });

    it('does not have aria-busy when not loading', () => {
      const wrapper = mount(DsButton, { global: globalConfig });
      expect(wrapper.attributes('aria-busy')).toBeUndefined();
    });
  });

  describe('PrimeVue prop passthrough', () => {
    it('passes raised prop through $attrs', () => {
      const wrapper = mount(DsButton, {
        props: { raised: true } as Record<string, unknown>,
        global: globalConfig,
      });
      const btn = wrapper.findComponent(Button);
      expect(btn.props('raised')).toBe(true);
    });

    it('passes rounded prop through $attrs', () => {
      const wrapper = mount(DsButton, {
        props: { rounded: true } as Record<string, unknown>,
        global: globalConfig,
      });
      const btn = wrapper.findComponent(Button);
      expect(btn.props('rounded')).toBe(true);
    });

    it('passes label prop through $attrs', () => {
      const wrapper = mount(DsButton, {
        props: { label: 'Click me' } as Record<string, unknown>,
        global: globalConfig,
      });
      const btn = wrapper.findComponent(Button);
      expect(btn.props('label')).toBe('Click me');
    });
  });

  describe('event passthrough', () => {
    it('emits click event through to PrimeVue Button', async () => {
      const onClick = vi.fn();
      const wrapper = mount(DsButton, {
        attrs: { onClick },
        global: globalConfig,
      });
      await wrapper.find('button').trigger('click');
      expect(onClick).toHaveBeenCalledOnce();
    });
  });

  describe('slot passthrough', () => {
    it('passes default slot content through', () => {
      const wrapper = mount(DsButton, {
        slots: { default: 'Save' },
        global: globalConfig,
      });
      expect(wrapper.text()).toContain('Save');
    });

    it('passes icon slot through to PrimeVue Button', () => {
      const wrapper = mount(DsButton, {
        slots: { icon: '<span class="custom-icon">*</span>' },
        global: globalConfig,
      });
      expect(wrapper.find('.custom-icon').exists()).toBe(true);
    });
  });

  describe('icon+text button', () => {
    it('renders correctly with icon prop and label', () => {
      const wrapper = mount(DsButton, {
        props: { icon: 'pi pi-check', label: 'Confirm' } as Record<string, unknown>,
        global: globalConfig,
      });
      const btn = wrapper.findComponent(Button);
      expect(btn.props('icon')).toBe('pi pi-check');
      expect(btn.props('label')).toBe('Confirm');
    });
  });

  describe('$attrs passthrough', () => {
    it('passes data-testid to PrimeVue Button', () => {
      const wrapper = mount(DsButton, {
        attrs: { 'data-testid': 'submit-btn' },
        global: globalConfig,
      });
      expect(wrapper.find('[data-testid="submit-btn"]').exists()).toBe(true);
    });

    it('passes id to PrimeVue Button', () => {
      const wrapper = mount(DsButton, {
        attrs: { id: 'my-button' },
        global: globalConfig,
      });
      expect(wrapper.find('#my-button').exists()).toBe(true);
    });
  });
});
