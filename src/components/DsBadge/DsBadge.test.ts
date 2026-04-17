import { mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import { describe, expect, it } from 'vitest';
import DsBadge from './DsBadge.vue';

const globalConfig = {
  plugins: [[PrimeVue, { theme: 'none' }]],
};

describe('DsBadge', () => {
  it('renders .ds-badge and .ds-badge--pending by default', () => {
    const wrapper = mount(DsBadge, {
      props: { label: 'Text' },
      global: globalConfig,
    });
    expect(wrapper.find('.ds-badge').exists()).toBe(true);
    expect(wrapper.find('.ds-badge--pending').exists()).toBe(true);
    expect(wrapper.find('.ds-badge__label').text()).toBe('Text');
    expect(wrapper.find('.ds-badge__leading').exists()).toBe(false);
    expect(wrapper.find('.ds-badge__trailing').exists()).toBe(false);
  });

  describe('type → class mapping', () => {
    const types = [
      'pending',
      'interesting',
      'neutral',
      'rejected',
      'accepted',
      'cancel',
      'border',
      'clean',
      'draft',
      'loaded',
      'type10',
    ] as const;

    for (const type of types) {
      it(`applies .ds-badge--${type} when type="${type}"`, () => {
        const wrapper = mount(DsBadge, {
          props: { type, label: 'Text' },
          global: globalConfig,
        });
        expect(wrapper.find(`.ds-badge--${type}`).exists()).toBe(true);
      });
    }
  });

  describe('label and default slot', () => {
    it('renders label prop inside .ds-badge__label', () => {
      const wrapper = mount(DsBadge, {
        props: { label: 'Status' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-badge__label').text()).toBe('Status');
    });

    it('default slot overrides label prop', () => {
      const wrapper = mount(DsBadge, {
        props: { label: 'From prop' },
        slots: { default: 'From slot' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-badge__label').text()).toBe('From slot');
    });

    it('renders no label span when type="loaded" even with label prop', () => {
      const wrapper = mount(DsBadge, {
        props: { type: 'loaded', label: 'Hidden' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-badge__label').exists()).toBe(false);
    });

    it('renders no label span when no label or default slot', () => {
      const wrapper = mount(DsBadge, {
        props: {},
        global: globalConfig,
      });
      expect(wrapper.find('.ds-badge__label').exists()).toBe(false);
    });
  });

  describe('showLIcon / leading slot', () => {
    it('renders default DsIcon fallback when showLIcon=true and no slot', () => {
      const wrapper = mount(DsBadge, {
        props: { type: 'pending', label: 'T', showLIcon: true },
        global: globalConfig,
      });
      const leading = wrapper.find('.ds-badge__leading');
      expect(leading.exists()).toBe(true);
      // Default fallback DsIcon renders an svg
      expect(leading.find('svg').exists()).toBe(true);
    });

    it('renders #leading slot content when provided', () => {
      const wrapper = mount(DsBadge, {
        props: { type: 'pending', label: 'T', showLIcon: true },
        slots: { leading: '<span class="custom-icon">L</span>' },
        global: globalConfig,
      });
      const leading = wrapper.find('.ds-badge__leading');
      expect(leading.exists()).toBe(true);
      expect(leading.find('.custom-icon').exists()).toBe(true);
    });

    it('does not render leading wrapper when showLIcon=false', () => {
      const wrapper = mount(DsBadge, {
        props: { type: 'pending', label: 'T', showLIcon: false },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-badge__leading').exists()).toBe(false);
    });
  });

  describe('showRIcon / trailing slot', () => {
    it('renders default DsIcon fallback when showRIcon=true and no slot', () => {
      const wrapper = mount(DsBadge, {
        props: { type: 'pending', label: 'T', showRIcon: true },
        global: globalConfig,
      });
      const trailing = wrapper.find('.ds-badge__trailing');
      expect(trailing.exists()).toBe(true);
      expect(trailing.find('svg').exists()).toBe(true);
    });

    it('renders #trailing slot content when provided', () => {
      const wrapper = mount(DsBadge, {
        props: { type: 'pending', label: 'T', showRIcon: true },
        slots: { trailing: '<span class="custom-trailing">R</span>' },
        global: globalConfig,
      });
      const trailing = wrapper.find('.ds-badge__trailing');
      expect(trailing.exists()).toBe(true);
      expect(trailing.find('.custom-trailing').exists()).toBe(true);
    });

    it('does not render trailing wrapper when showRIcon=false', () => {
      const wrapper = mount(DsBadge, {
        props: { type: 'pending', label: 'T', showRIcon: false },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-badge__trailing').exists()).toBe(false);
    });
  });

  describe('variant-specific content guards', () => {
    it('type="loaded" does not render icon wrappers even when showLIcon and showRIcon are true', () => {
      const wrapper = mount(DsBadge, {
        props: { type: 'loaded', label: 'Hidden', showLIcon: true, showRIcon: true },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-badge__leading').exists()).toBe(false);
      expect(wrapper.find('.ds-badge__trailing').exists()).toBe(false);
      expect(wrapper.find('.ds-badge__label').exists()).toBe(false);
    });

    it('type="draft" does not render icon wrappers even when showLIcon and showRIcon are true', () => {
      const wrapper = mount(DsBadge, {
        props: { type: 'draft', label: 'WIP', showLIcon: true, showRIcon: true },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-badge__leading').exists()).toBe(false);
      expect(wrapper.find('.ds-badge__trailing').exists()).toBe(false);
      // draft does render the label
      expect(wrapper.find('.ds-badge__label').exists()).toBe(true);
    });
  });

  describe('PrimeVue passthrough', () => {
    it('forwards arbitrary attribute (data-testid) to the PrimeVue Badge root', () => {
      const wrapper = mount(DsBadge, {
        props: { label: 'Test' },
        attrs: { 'data-testid': 'my-badge' },
        global: globalConfig,
      });
      expect(wrapper.attributes('data-testid')).toBe('my-badge');
    });
  });

  describe('loaded a11y defaults', () => {
    it('sets aria-busy="true" and aria-label="Loading" on loaded variant', () => {
      const wrapper = mount(DsBadge, {
        props: { type: 'loaded' },
        global: globalConfig,
      });
      expect(wrapper.attributes('aria-busy')).toBe('true');
      expect(wrapper.attributes('aria-label')).toBe('Loading');
    });

    it('does not set aria-busy or aria-label on non-loaded variants', () => {
      const wrapper = mount(DsBadge, {
        props: { type: 'pending', label: 'Text' },
        global: globalConfig,
      });
      expect(wrapper.attributes('aria-busy')).toBeUndefined();
      expect(wrapper.attributes('aria-label')).toBeUndefined();
    });

    it('lets consumer override aria-label via $attrs', () => {
      const wrapper = mount(DsBadge, {
        props: { type: 'loaded' },
        attrs: { 'aria-label': 'Fetching results' },
        global: globalConfig,
      });
      expect(wrapper.attributes('aria-label')).toBe('Fetching results');
    });
  });
});
