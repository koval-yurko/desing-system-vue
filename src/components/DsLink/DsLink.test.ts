import { mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import { describe, expect, it, vi } from 'vitest';
import DsLink from './DsLink.vue';

const globalConfig = {
  plugins: [[PrimeVue, { theme: 'none' }]],
};

describe('DsLink', () => {
  it('renders with default props (regular, medium, high visibility)', () => {
    const wrapper = mount(DsLink, {
      props: { href: '/test' },
      slots: { default: 'Test Link' },
      global: globalConfig,
    });
    const a = wrapper.find('a');
    expect(a.exists()).toBe(true);
    expect(wrapper.classes()).toContain('ds-link');
    expect(wrapper.classes()).toContain('ds-link--regular');
    expect(wrapper.classes()).toContain('ds-link--medium');
    expect(wrapper.classes()).toContain('ds-link--high');
  });

  it('renders native <a> element with href', () => {
    const wrapper = mount(DsLink, {
      props: { href: '/settings' },
      slots: { default: 'Settings' },
      global: globalConfig,
    });
    const a = wrapper.find('a');
    expect(a.exists()).toBe(true);
    expect(a.attributes('href')).toBe('/settings');
  });

  describe('type variants', () => {
    it('type="regular" has underline class', () => {
      const wrapper = mount(DsLink, {
        props: { type: 'regular', href: '#' },
        slots: { default: 'Link' },
        global: globalConfig,
      });
      expect(wrapper.classes()).toContain('ds-link--regular');
    });

    it('type="smart" has smart class, no underline', () => {
      const wrapper = mount(DsLink, {
        props: { type: 'smart', href: '#' },
        slots: { default: 'Link' },
        global: globalConfig,
      });
      expect(wrapper.classes()).toContain('ds-link--smart');
      expect(wrapper.classes()).not.toContain('ds-link--regular');
    });

    it('type="quiet" has quiet class', () => {
      const wrapper = mount(DsLink, {
        props: { type: 'quiet', href: '#' },
        slots: { default: 'Link' },
        global: globalConfig,
      });
      expect(wrapper.classes()).toContain('ds-link--quiet');
      expect(wrapper.classes()).not.toContain('ds-link--regular');
    });
  });

  describe('sizes', () => {
    it('size="small" applies small class', () => {
      const wrapper = mount(DsLink, {
        props: { size: 'small', href: '#' },
        slots: { default: 'Link' },
        global: globalConfig,
      });
      expect(wrapper.classes()).toContain('ds-link--small');
    });

    it('size="medium" applies medium class', () => {
      const wrapper = mount(DsLink, {
        props: { size: 'medium', href: '#' },
        slots: { default: 'Link' },
        global: globalConfig,
      });
      expect(wrapper.classes()).toContain('ds-link--medium');
    });
  });

  describe('visibility', () => {
    it('visibility="high" applies high class', () => {
      const wrapper = mount(DsLink, {
        props: { visibility: 'high', href: '#' },
        slots: { default: 'Link' },
        global: globalConfig,
      });
      expect(wrapper.classes()).toContain('ds-link--high');
    });

    it('visibility="low" applies low class', () => {
      const wrapper = mount(DsLink, {
        props: { visibility: 'low', href: '#' },
        slots: { default: 'Link' },
        global: globalConfig,
      });
      expect(wrapper.classes()).toContain('ds-link--low');
    });
  });

  describe('disabled state', () => {
    it('applies disabled class, aria-disabled, tabindex=-1, pointer-events none', () => {
      const wrapper = mount(DsLink, {
        props: { disabled: true, href: '#' },
        slots: { default: 'Link' },
        global: globalConfig,
      });
      expect(wrapper.classes()).toContain('ds-link--disabled');
      expect(wrapper.attributes('aria-disabled')).toBe('true');
      expect(wrapper.attributes('tabindex')).toBe('-1');
    });

    it('does not set aria-disabled or tabindex when not disabled', () => {
      const wrapper = mount(DsLink, {
        props: { href: '#' },
        slots: { default: 'Link' },
        global: globalConfig,
      });
      expect(wrapper.attributes('aria-disabled')).toBeUndefined();
      expect(wrapper.attributes('tabindex')).toBeUndefined();
    });

    it('prevents click event when disabled', async () => {
      const wrapper = mount(DsLink, {
        props: { disabled: true, href: '#' },
        slots: { default: 'Link' },
        global: globalConfig,
        attachTo: document.body,
      });
      const preventDefaultSpy = vi.fn();
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'preventDefault', { value: preventDefaultSpy });
      wrapper.find('a').element.dispatchEvent(event);
      expect(preventDefaultSpy).toHaveBeenCalled();
      wrapper.unmount();
    });

    it('does not have transitions class when disabled', () => {
      const wrapper = mount(DsLink, {
        props: { disabled: true, href: '#' },
        slots: { default: 'Link' },
        global: globalConfig,
      });
      expect(wrapper.classes()).not.toContain('ds-link--transitions');
    });

    it('removes href when disabled (P1: prevents AT/keyboard bypass)', () => {
      const wrapper = mount(DsLink, {
        props: { disabled: true, href: '/secret' },
        slots: { default: 'Link' },
        global: globalConfig,
      });
      expect(wrapper.find('a').attributes('href')).toBeUndefined();
    });

    it('renders href when not disabled', () => {
      const wrapper = mount(DsLink, {
        props: { disabled: false, href: '/page' },
        slots: { default: 'Link' },
        global: globalConfig,
      });
      expect(wrapper.find('a').attributes('href')).toBe('/page');
    });

    it('stops propagation when disabled (P2: prevents consumer handler firing)', async () => {
      const wrapper = mount(DsLink, {
        props: { disabled: true, href: '#' },
        slots: { default: 'Link' },
        global: globalConfig,
        attachTo: document.body,
      });
      const stopPropagationSpy = vi.fn();
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'stopPropagation', { value: stopPropagationSpy });
      wrapper.find('a').element.dispatchEvent(event);
      expect(stopPropagationSpy).toHaveBeenCalled();
      wrapper.unmount();
    });

    it('preserves underline for disabled regular link', () => {
      const wrapper = mount(DsLink, {
        props: { type: 'regular', disabled: true, href: '#' },
        slots: { default: 'Link' },
        global: globalConfig,
      });
      expect(wrapper.classes()).toContain('ds-link--regular');
      expect(wrapper.classes()).toContain('ds-link--disabled');
      expect(wrapper.find('.ds-link__text').exists()).toBe(true);
    });

    it('no underline for disabled smart link', () => {
      const wrapper = mount(DsLink, {
        props: { type: 'smart', disabled: true, href: '#' },
        slots: { default: 'Link' },
        global: globalConfig,
      });
      expect(wrapper.classes()).toContain('ds-link--smart');
      expect(wrapper.classes()).toContain('ds-link--disabled');
      expect(wrapper.classes()).not.toContain('ds-link--regular');
    });

    it('no underline for disabled quiet link', () => {
      const wrapper = mount(DsLink, {
        props: { type: 'quiet', disabled: true, href: '#' },
        slots: { default: 'Link' },
        global: globalConfig,
      });
      expect(wrapper.classes()).toContain('ds-link--quiet');
      expect(wrapper.classes()).toContain('ds-link--disabled');
      expect(wrapper.classes()).not.toContain('ds-link--regular');
    });
  });

  describe('smart + low visibility guard (P3)', () => {
    it('forces high visibility when type is smart regardless of visibility prop', () => {
      const wrapper = mount(DsLink, {
        props: { type: 'smart', visibility: 'low', href: '#' },
        slots: { default: 'Link' },
        global: globalConfig,
      });
      expect(wrapper.classes()).toContain('ds-link--high');
      expect(wrapper.classes()).not.toContain('ds-link--low');
    });

    it('allows low visibility for regular type', () => {
      const wrapper = mount(DsLink, {
        props: { type: 'regular', visibility: 'low', href: '#' },
        slots: { default: 'Link' },
        global: globalConfig,
      });
      expect(wrapper.classes()).toContain('ds-link--low');
    });

    it('allows low visibility for quiet type', () => {
      const wrapper = mount(DsLink, {
        props: { type: 'quiet', visibility: 'low', href: '#' },
        slots: { default: 'Link' },
        global: globalConfig,
      });
      expect(wrapper.classes()).toContain('ds-link--low');
    });
  });

  describe('slots', () => {
    it('renders default slot as link text', () => {
      const wrapper = mount(DsLink, {
        props: { href: '#' },
        slots: { default: 'Click me' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-link__text').text()).toBe('Click me');
    });

    it('renders left-icon slot', () => {
      const wrapper = mount(DsLink, {
        props: { href: '#' },
        slots: {
          default: 'Link',
          'left-icon': '<span class="test-icon-left">L</span>',
        },
        global: globalConfig,
      });
      expect(wrapper.find('.test-icon-left').exists()).toBe(true);
    });

    it('renders right-icon slot', () => {
      const wrapper = mount(DsLink, {
        props: { href: '#' },
        slots: {
          default: 'Link',
          'right-icon': '<span class="test-icon-right">R</span>',
        },
        global: globalConfig,
      });
      expect(wrapper.find('.test-icon-right').exists()).toBe(true);
    });
  });

  describe('$attrs passthrough', () => {
    it('passes target and rel to <a> element', () => {
      const wrapper = mount(DsLink, {
        props: { href: 'https://example.com' },
        attrs: { target: '_blank', rel: 'noopener' },
        slots: { default: 'External' },
        global: globalConfig,
      });
      const a = wrapper.find('a');
      expect(a.attributes('target')).toBe('_blank');
      expect(a.attributes('rel')).toBe('noopener');
    });
  });

  it('has transitions class when not disabled', () => {
    const wrapper = mount(DsLink, {
      props: { href: '#' },
      slots: { default: 'Link' },
      global: globalConfig,
    });
    expect(wrapper.classes()).toContain('ds-link--transitions');
  });
});
