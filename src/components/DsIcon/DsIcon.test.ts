import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

const mockSvg = '<svg viewBox="0 0 24 24"><path d="M10 10" stroke="currentColor"/></svg>';

vi.mock('./icon-registry', () => ({
  getIcon: (name: string) => (name === 'search' ? mockSvg : undefined),
}));

// Import after mock setup
const { default: DsIcon } = await import('./DsIcon.vue');

describe('DsIcon', () => {
  it('renders SVG content for a valid icon name', () => {
    const wrapper = mount(DsIcon, { props: { name: 'search' } });
    expect(wrapper.html()).toContain('<svg');
    expect(wrapper.html()).toContain('currentColor');
  });

  it('applies correct dimensions for xsmall size (12px)', () => {
    const wrapper = mount(DsIcon, { props: { name: 'search', size: 'xsmall' } });
    const span = wrapper.find('span');
    expect(span.attributes('style')).toContain('width: 12px');
    expect(span.attributes('style')).toContain('height: 12px');
  });

  it('applies correct dimensions for small size (16px)', () => {
    const wrapper = mount(DsIcon, { props: { name: 'search', size: 'small' } });
    const span = wrapper.find('span');
    expect(span.attributes('style')).toContain('width: 16px');
    expect(span.attributes('style')).toContain('height: 16px');
  });

  it('applies correct dimensions for medium size (20px, default)', () => {
    const wrapper = mount(DsIcon, { props: { name: 'search' } });
    const span = wrapper.find('span');
    expect(span.attributes('style')).toContain('width: 20px');
    expect(span.attributes('style')).toContain('height: 20px');
  });

  it('applies correct dimensions for large size (24px)', () => {
    const wrapper = mount(DsIcon, { props: { name: 'search', size: 'large' } });
    const span = wrapper.find('span');
    expect(span.attributes('style')).toContain('width: 24px');
    expect(span.attributes('style')).toContain('height: 24px');
  });

  it('inherits color via currentColor by default (no inline color style)', () => {
    const wrapper = mount(DsIcon, { props: { name: 'search' } });
    const style = wrapper.find('span').attributes('style') ?? '';
    expect(style).not.toContain('color:');
  });

  it('accepts class attribute for color override', () => {
    const wrapper = mount(DsIcon, {
      props: { name: 'search' },
      attrs: { class: 'text-primary-500' },
    });
    expect(wrapper.classes()).toContain('text-primary-500');
  });

  it('sets aria-hidden="true" when no ariaLabel provided (decorative)', () => {
    const wrapper = mount(DsIcon, { props: { name: 'search' } });
    const span = wrapper.find('span');
    expect(span.attributes('aria-hidden')).toBe('true');
    expect(span.attributes('role')).toBeUndefined();
    expect(span.attributes('aria-label')).toBeUndefined();
  });

  it('sets role="img" and aria-label when ariaLabel prop provided (informational)', () => {
    const wrapper = mount(DsIcon, {
      props: { name: 'search', ariaLabel: 'Search' },
    });
    const span = wrapper.find('span');
    expect(span.attributes('role')).toBe('img');
    expect(span.attributes('aria-label')).toBe('Search');
    expect(span.attributes('aria-hidden')).toBeUndefined();
  });

  it('renders nothing for invalid icon name (graceful degradation)', () => {
    const wrapper = mount(DsIcon, {
      // @ts-expect-error testing invalid icon name
      props: { name: 'nonexistent-icon' },
    });
    expect(wrapper.find('span').exists()).toBe(false);
  });
});
