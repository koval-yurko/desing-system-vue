import { mount } from '@vue/test-utils';
import Button from 'primevue/button';
import PrimeVue from 'primevue/config';
import { describe, expect, it, vi } from 'vitest';
import DsIconButton from './DsIconButton.vue';

const globalConfig = {
  plugins: [[PrimeVue, { theme: 'none' }]],
};

const defaultProps = { ariaLabel: 'Action' };

/** Helper: find the PrimeVue Button inside the wrapper */
function findBtn(wrapper: ReturnType<typeof mount>) {
  return wrapper.findComponent(Button);
}

describe('DsIconButton', () => {
  it('renders with default props (primary, medium)', () => {
    const wrapper = mount(DsIconButton, { props: defaultProps, global: globalConfig });
    const btn = findBtn(wrapper);
    expect(btn.exists()).toBe(true);
    expect(btn.classes()).toContain('ds-icon-button');
    expect(btn.classes()).toContain('ds-icon-button--primary');
    expect(btn.classes()).toContain('ds-icon-button--medium');
  });

  it('renders a wrapper div with ds-icon-button-wrapper class', () => {
    const wrapper = mount(DsIconButton, { props: defaultProps, global: globalConfig });
    expect(wrapper.find('.ds-icon-button-wrapper').exists()).toBe(true);
  });

  describe('type variants', () => {
    it.each([
      ['primary', null, null],
      ['outlined', null, 'outlined'],
      ['text', null, 'text'],
    ] as const)('renders %s type with correct PrimeVue mapping (severity=%s, variant=%s)', (dsType, expectedSeverity, expectedVariant) => {
      const wrapper = mount(DsIconButton, {
        props: { ...defaultProps, type: dsType },
        global: globalConfig,
      });
      const btn = findBtn(wrapper);
      expect(btn.props('severity')).toBe(expectedSeverity);
      expect(btn.props('variant')).toBe(expectedVariant);
      expect(btn.classes()).toContain(`ds-icon-button--${dsType}`);
    });
  });

  describe('sizes', () => {
    it.each([
      ['xsmall', 'small'],
      ['small', 'small'],
      ['medium', null],
    ] as const)('applies correct PrimeVue size for %s (mapped=%s)', (dsSize, expectedPvSize) => {
      const wrapper = mount(DsIconButton, {
        props: { ...defaultProps, size: dsSize },
        global: globalConfig,
      });
      const btn = findBtn(wrapper);
      expect(btn.props('size')).toBe(expectedPvSize);
      expect(btn.classes()).toContain(`ds-icon-button--${dsSize}`);
    });

    it('passes dt size tokens for xsmall', () => {
      const wrapper = mount(DsIconButton, {
        props: { ...defaultProps, size: 'xsmall' },
        global: globalConfig,
      });
      const btn = findBtn(wrapper);
      const dt = btn.props('dt') as Record<string, unknown>;
      expect(dt.fontSize).toBe('0');
      expect(dt.paddingX).toBe('0');
      expect(dt.paddingY).toBe('0');
      expect(dt.iconOnlyWidth).toBe('1.5rem');
      expect(dt.borderRadius).toBe('4px');
    });

    it('passes dt size tokens for small', () => {
      const wrapper = mount(DsIconButton, {
        props: { ...defaultProps, size: 'small' },
        global: globalConfig,
      });
      const btn = findBtn(wrapper);
      const dt = btn.props('dt') as Record<string, unknown>;
      expect(dt.fontSize).toBe('0');
      expect(dt.paddingX).toBe('0');
      expect(dt.paddingY).toBe('0');
      expect(dt.iconOnlyWidth).toBe('2rem');
      expect(dt.borderRadius).toBe('8px');
    });

    it('passes dt size tokens for medium', () => {
      const wrapper = mount(DsIconButton, {
        props: { ...defaultProps, size: 'medium' },
        global: globalConfig,
      });
      const btn = findBtn(wrapper);
      const dt = btn.props('dt') as Record<string, unknown>;
      expect(dt.fontSize).toBe('0');
      expect(dt.paddingX).toBe('0');
      expect(dt.paddingY).toBe('0');
      expect(dt.iconOnlyWidth).toBe('2.25rem');
      expect(dt.borderRadius).toBe('8px');
    });
  });

  describe('disabled state', () => {
    it('applies disabled class and aria-disabled on the button', () => {
      const wrapper = mount(DsIconButton, {
        props: { ...defaultProps, disabled: true },
        global: globalConfig,
      });
      const btn = findBtn(wrapper);
      expect(btn.classes()).toContain('ds-icon-button--disabled');
      expect(btn.classes()).not.toContain('ds-icon-button--transitions');
      expect(btn.attributes('aria-disabled')).toBe('true');
    });

    it('passes disabled to the rendered button element', () => {
      const wrapper = mount(DsIconButton, {
        props: { ...defaultProps, disabled: true },
        global: globalConfig,
      });
      const button = wrapper.find('button');
      expect(button.element.disabled).toBe(true);
    });

    it('has transitions when not disabled', () => {
      const wrapper = mount(DsIconButton, { props: defaultProps, global: globalConfig });
      const btn = findBtn(wrapper);
      expect(btn.classes()).toContain('ds-icon-button--transitions');
      expect(btn.classes()).not.toContain('ds-icon-button--disabled');
    });

    it('applies per-type disabled class for primary', () => {
      const wrapper = mount(DsIconButton, {
        props: { ...defaultProps, type: 'primary', disabled: true },
        global: globalConfig,
      });
      const btn = findBtn(wrapper);
      expect(btn.classes()).toContain('ds-icon-button--primary');
      expect(btn.classes()).toContain('ds-icon-button--disabled');
    });

    it('applies per-type disabled class for outlined', () => {
      const wrapper = mount(DsIconButton, {
        props: { ...defaultProps, type: 'outlined', disabled: true },
        global: globalConfig,
      });
      const btn = findBtn(wrapper);
      expect(btn.classes()).toContain('ds-icon-button--outlined');
      expect(btn.classes()).toContain('ds-icon-button--disabled');
    });

    it('applies per-type disabled class for text', () => {
      const wrapper = mount(DsIconButton, {
        props: { ...defaultProps, type: 'text', disabled: true },
        global: globalConfig,
      });
      const btn = findBtn(wrapper);
      expect(btn.classes()).toContain('ds-icon-button--text');
      expect(btn.classes()).toContain('ds-icon-button--disabled');
    });
  });

  describe('square proportions', () => {
    it.each([
      ['xsmall', '1.5rem'],
      ['small', '2rem'],
      ['medium', '2.25rem'],
    ] as const)('enforces square dimensions for %s (width === height === %s)', (dsSize, expectedDimension) => {
      const wrapper = mount(DsIconButton, {
        props: { ...defaultProps, size: dsSize },
        global: globalConfig,
      });
      const btn = findBtn(wrapper);
      const dt = btn.props('dt') as Record<string, unknown>;
      expect(dt.iconOnlyWidth).toBe(expectedDimension);
      const style = btn.attributes('style') || '';
      expect(style).toContain(`--ds-icon-button-dimension: ${expectedDimension}`);
    });
  });

  describe('loading state', () => {
    it('shows dot-based loading indicator', () => {
      const wrapper = mount(DsIconButton, {
        props: { ...defaultProps, loading: true },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-icon-button-loading-overlay').exists()).toBe(true);
      expect(wrapper.findAll('.ds-icon-button-loading-dots > span')).toHaveLength(3);
    });

    it('does not render loading elements when not loading', () => {
      const wrapper = mount(DsIconButton, { props: defaultProps, global: globalConfig });
      expect(wrapper.find('.ds-icon-button-loading-overlay').exists()).toBe(false);
      expect(wrapper.find('.ds-icon-button-loading-dots').exists()).toBe(false);
    });

    it('applies loading class with pointer-events prevention', () => {
      const wrapper = mount(DsIconButton, {
        props: { ...defaultProps, loading: true },
        global: globalConfig,
      });
      const btn = findBtn(wrapper);
      expect(btn.classes()).toContain('ds-icon-button--loading');
    });

    it('disables the button when loading to prevent keyboard activation', () => {
      const wrapper = mount(DsIconButton, {
        props: { ...defaultProps, loading: true },
        global: globalConfig,
      });
      const button = wrapper.find('button');
      expect(button.element.disabled).toBe(true);
    });

    it('adds aria-live="polite" when loading', () => {
      const wrapper = mount(DsIconButton, {
        props: { ...defaultProps, loading: true },
        global: globalConfig,
      });
      const btn = findBtn(wrapper);
      expect(btn.attributes('aria-live')).toBe('polite');
    });

    it('does not have aria-live when not loading', () => {
      const wrapper = mount(DsIconButton, { props: defaultProps, global: globalConfig });
      const btn = findBtn(wrapper);
      expect(btn.attributes('aria-live')).toBeUndefined();
    });

    it('adds aria-busy="true" when loading', () => {
      const wrapper = mount(DsIconButton, {
        props: { ...defaultProps, loading: true },
        global: globalConfig,
      });
      const btn = findBtn(wrapper);
      expect(btn.attributes('aria-busy')).toBe('true');
    });

    it('does not have aria-busy when not loading', () => {
      const wrapper = mount(DsIconButton, { props: defaultProps, global: globalConfig });
      const btn = findBtn(wrapper);
      expect(btn.attributes('aria-busy')).toBeUndefined();
    });

    it('hides icon slot when loading', () => {
      const wrapper = mount(DsIconButton, {
        props: { ...defaultProps, loading: true },
        slots: { default: '<span class="test-icon">icon</span>' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-icon-button-icon').exists()).toBe(false);
    });

    it('loading overlay has role="status" for accessibility', () => {
      const wrapper = mount(DsIconButton, {
        props: { ...defaultProps, loading: true },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-icon-button-loading-overlay').attributes('role')).toBe('status');
    });

    it('loading overlay has aria-label="Loading"', () => {
      const wrapper = mount(DsIconButton, {
        props: { ...defaultProps, loading: true },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-icon-button-loading-overlay').attributes('aria-label')).toBe(
        'Loading',
      );
    });

    it('sets aria-disabled="true" when loading', () => {
      const wrapper = mount(DsIconButton, {
        props: { ...defaultProps, loading: true },
        global: globalConfig,
      });
      const btn = findBtn(wrapper);
      expect(btn.attributes('aria-disabled')).toBe('true');
    });

    it('removes transitions when loading', () => {
      const wrapper = mount(DsIconButton, {
        props: { ...defaultProps, loading: true },
        global: globalConfig,
      });
      const btn = findBtn(wrapper);
      expect(btn.classes()).not.toContain('ds-icon-button--transitions');
    });
  });

  describe('slot rendering', () => {
    it('renders default slot icon content', () => {
      const wrapper = mount(DsIconButton, {
        props: defaultProps,
        slots: { default: '<span class="test-icon">icon</span>' },
        global: globalConfig,
      });
      expect(wrapper.find('.test-icon').exists()).toBe(true);
    });

    it('wraps slot in icon container', () => {
      const wrapper = mount(DsIconButton, {
        props: defaultProps,
        slots: { default: '<span class="test-icon">icon</span>' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-icon-button-icon').exists()).toBe(true);
    });
  });

  describe('accessible name', () => {
    it('passes ariaLabel prop to button element', () => {
      const wrapper = mount(DsIconButton, {
        props: { ariaLabel: 'Edit item' },
        global: globalConfig,
      });
      expect(wrapper.find('button').attributes('aria-label')).toBe('Edit item');
    });

    it('passes ariaLabelledby prop to button element', () => {
      const wrapper = mount(DsIconButton, {
        props: { ariaLabelledby: 'external-label-id' },
        global: globalConfig,
      });
      expect(wrapper.find('button').attributes('aria-labelledby')).toBe('external-label-id');
    });
  });

  describe('event passthrough', () => {
    it('emits click event through to PrimeVue Button', async () => {
      const onClick = vi.fn();
      const wrapper = mount(DsIconButton, {
        props: defaultProps,
        attrs: { onClick },
        global: globalConfig,
      });
      await wrapper.find('button').trigger('click');
      expect(onClick).toHaveBeenCalledOnce();
    });
  });

  describe('$attrs passthrough', () => {
    it('passes data-testid to PrimeVue Button', () => {
      const wrapper = mount(DsIconButton, {
        props: defaultProps,
        attrs: { 'data-testid': 'icon-btn' },
        global: globalConfig,
      });
      expect(wrapper.find('[data-testid="icon-btn"]').exists()).toBe(true);
    });

    it('passes id to PrimeVue Button', () => {
      const wrapper = mount(DsIconButton, {
        props: defaultProps,
        attrs: { id: 'my-icon-button' },
        global: globalConfig,
      });
      expect(wrapper.find('#my-icon-button').exists()).toBe(true);
    });
  });

  describe('indicator', () => {
    it('renders indicator dot when indicator=true', () => {
      const wrapper = mount(DsIconButton, {
        props: { ...defaultProps, indicator: true },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-icon-button-indicator').exists()).toBe(true);
    });

    it('hides indicator by default', () => {
      const wrapper = mount(DsIconButton, {
        props: defaultProps,
        global: globalConfig,
      });
      expect(wrapper.find('.ds-icon-button-indicator').exists()).toBe(false);
    });

    it('indicator is aria-hidden', () => {
      const wrapper = mount(DsIconButton, {
        props: { ...defaultProps, indicator: true },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-icon-button-indicator').attributes('aria-hidden')).toBe('true');
    });

    it('indicator is hidden when counterBadge is also set', () => {
      const wrapper = mount(DsIconButton, {
        props: { ...defaultProps, indicator: true, counterBadge: 3 },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-icon-button-indicator').exists()).toBe(false);
      expect(wrapper.find('.ds-icon-button-counter-badge').exists()).toBe(true);
    });
  });

  describe('counterBadge', () => {
    it('renders counter badge with value', () => {
      const wrapper = mount(DsIconButton, {
        props: { ...defaultProps, counterBadge: 9 },
        global: globalConfig,
      });
      const badge = wrapper.find('.ds-icon-button-counter-badge');
      expect(badge.exists()).toBe(true);
      expect(badge.text()).toBe('9');
    });

    it('does not render counter badge by default', () => {
      const wrapper = mount(DsIconButton, {
        props: defaultProps,
        global: globalConfig,
      });
      expect(wrapper.find('.ds-icon-button-counter-badge').exists()).toBe(false);
    });

    it('counter badge has accessible label', () => {
      const wrapper = mount(DsIconButton, {
        props: { ...defaultProps, counterBadge: 5 },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-icon-button-counter-badge').attributes('aria-label')).toBe(
        '5 notifications',
      );
    });
  });
});
