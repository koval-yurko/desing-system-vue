import { mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import { describe, expect, it } from 'vitest';
import DsAvatar, { type DsAvatarColor, type DsAvatarSize } from './DsAvatar.vue';

const globalConfig = {
  plugins: [[PrimeVue, { theme: 'none' }]],
};

const COLORS: DsAvatarColor[] = [
  'blue',
  'light-purple',
  'yellow',
  'pink',
  'purple',
  'deep-blue',
  'turquoise',
  'orange',
  'red',
];

const SIZES: DsAvatarSize[] = ['large', 'medium', 'small', 'xsmall'];

describe('DsAvatar', () => {
  describe('variant auto-derivation', () => {
    it('defaults to icon variant when no props are provided', () => {
      const wrapper = mount(DsAvatar, { global: globalConfig });
      expect(wrapper.find('.ds-avatar').exists()).toBe(true);
      expect(wrapper.find('.ds-avatar--icon').exists()).toBe(true);
      expect(wrapper.find('.ds-avatar__initials').exists()).toBe(false);
      expect(wrapper.find('.ds-avatar__image').exists()).toBe(false);
      expect(wrapper.find('.ds-avatar__icon').exists()).toBe(true);
    });

    it('uses initials-monochrome when initials are set but no color', () => {
      const wrapper = mount(DsAvatar, {
        props: { initials: 'EM' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-avatar--initials-monochrome').exists()).toBe(true);
      expect(wrapper.find('.ds-avatar__initials').text()).toBe('EM');
      expect(wrapper.find('.ds-avatar__icon').exists()).toBe(false);
    });

    it('uses initials-colored when initials and color are set', () => {
      const wrapper = mount(DsAvatar, {
        props: { initials: 'EM', color: 'blue' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-avatar--initials-colored').exists()).toBe(true);
      expect(wrapper.find('.ds-avatar--blue').exists()).toBe(true);
      expect(wrapper.find('.ds-avatar__initials').text()).toBe('EM');
    });

    it('uses image variant when image prop is set', () => {
      const wrapper = mount(DsAvatar, {
        props: { image: 'https://example.test/u.png' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-avatar--image').exists()).toBe(true);
      expect(wrapper.find('.ds-avatar__image').exists()).toBe(true);
      expect(wrapper.find('.ds-avatar__initials').exists()).toBe(false);
      expect(wrapper.find('.ds-avatar__icon').exists()).toBe(false);
    });

    it('explicit variant prop overrides auto-derivation', () => {
      const wrapper = mount(DsAvatar, {
        props: { variant: 'icon', initials: 'EM' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-avatar--icon').exists()).toBe(true);
      expect(wrapper.find('.ds-avatar--initials-monochrome').exists()).toBe(false);
      expect(wrapper.find('.ds-avatar__initials').exists()).toBe(false);
    });

    it('falls through derivation chain when explicit variant="image" lacks image prop', () => {
      const wrapper = mount(DsAvatar, {
        props: { variant: 'image', initials: 'EM', color: 'blue' },
        global: globalConfig,
      });
      // No image prop → cannot honour explicit "image" variant → fall through
      // to the next matching step in the auto-derivation chain.
      expect(wrapper.find('.ds-avatar--image').exists()).toBe(false);
      expect(wrapper.find('.ds-avatar--initials-colored').exists()).toBe(true);
      expect(wrapper.find('.ds-avatar__initials').text()).toBe('EM');
    });

    it('falls through to icon when explicit variant="image" has no image and no initials', () => {
      const wrapper = mount(DsAvatar, {
        props: { variant: 'image' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-avatar--icon').exists()).toBe(true);
      expect(wrapper.find('.ds-avatar__icon').exists()).toBe(true);
    });

    it('falls through to icon when explicit variant="initials-colored" has empty initials', () => {
      const wrapper = mount(DsAvatar, {
        props: { variant: 'initials-colored', color: 'blue' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-avatar--initials-colored').exists()).toBe(false);
      expect(wrapper.find('.ds-avatar--icon').exists()).toBe(true);
    });

    it('falls through to icon when explicit variant="initials-monochrome" has empty initials', () => {
      const wrapper = mount(DsAvatar, {
        props: { variant: 'initials-monochrome' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-avatar--initials-monochrome').exists()).toBe(false);
      expect(wrapper.find('.ds-avatar--icon').exists()).toBe(true);
    });
  });

  describe('sizes', () => {
    for (const size of SIZES) {
      it(`applies .ds-avatar--${size} when size="${size}"`, () => {
        const wrapper = mount(DsAvatar, {
          props: { size, initials: 'EM' },
          global: globalConfig,
        });
        expect(wrapper.find(`.ds-avatar--${size}`).exists()).toBe(true);
      });
    }

    it('defaults to size medium', () => {
      const wrapper = mount(DsAvatar, {
        props: { initials: 'EM' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-avatar--medium').exists()).toBe(true);
    });
  });

  describe('colors', () => {
    for (const color of COLORS) {
      it(`applies .ds-avatar--${color} when variant resolves to initials-colored`, () => {
        const wrapper = mount(DsAvatar, {
          props: { initials: 'EM', color },
          global: globalConfig,
        });
        expect(wrapper.find(`.ds-avatar--${color}`).exists()).toBe(true);
      });
    }

    it('does NOT apply color class when variant is not initials-colored', () => {
      const wrapper = mount(DsAvatar, {
        props: { variant: 'initials-monochrome', initials: 'EM', color: 'blue' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-avatar--blue').exists()).toBe(false);
      expect(wrapper.find('.ds-avatar--initials-monochrome').exists()).toBe(true);
    });

    it('does NOT apply color class when variant="icon" (color is passed but ignored)', () => {
      const wrapper = mount(DsAvatar, {
        props: { variant: 'icon', color: 'blue' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-avatar--blue').exists()).toBe(false);
      expect(wrapper.find('.ds-avatar--icon').exists()).toBe(true);
    });

    it('defaults color to blue when variant is initials-colored and color is omitted', () => {
      const wrapper = mount(DsAvatar, {
        props: { variant: 'initials-colored', initials: 'EM' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-avatar--blue').exists()).toBe(true);
    });
  });

  describe('image fallback', () => {
    it('falls back to initials-monochrome when image errors and initials are set', async () => {
      const wrapper = mount(DsAvatar, {
        props: { image: 'https://invalid.example/x.png', initials: 'EM' },
        global: globalConfig,
      });

      expect(wrapper.find('.ds-avatar--image').exists()).toBe(true);
      const img = wrapper.find('img.ds-avatar__image');
      expect(img.exists()).toBe(true);

      await img.trigger('error');
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.ds-avatar--initials-monochrome').exists()).toBe(true);
      expect(wrapper.find('.ds-avatar__initials').text()).toBe('EM');
      expect(wrapper.find('img.ds-avatar__image').exists()).toBe(false);
      expect(wrapper.emitted('error')).toBeTruthy();
      expect(wrapper.emitted('error')?.length).toBe(1);
    });

    it('falls back to icon when image errors and no initials are set', async () => {
      const wrapper = mount(DsAvatar, {
        props: { image: 'https://invalid.example/x.png' },
        global: globalConfig,
      });

      await wrapper.find('img.ds-avatar__image').trigger('error');
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.ds-avatar--icon').exists()).toBe(true);
      expect(wrapper.find('.ds-avatar__icon').exists()).toBe(true);
      expect(wrapper.find('img.ds-avatar__image').exists()).toBe(false);
    });

    it('emits load event when image loads successfully', async () => {
      const wrapper = mount(DsAvatar, {
        props: { image: 'https://example.test/ok.png' },
        global: globalConfig,
      });
      await wrapper.find('img.ds-avatar__image').trigger('load');
      expect(wrapper.emitted('load')).toBeTruthy();
      expect(wrapper.emitted('load')?.length).toBe(1);
      expect(wrapper.find('.ds-avatar--image').exists()).toBe(true);
    });

    it('re-attempts load when image prop changes after a failure', async () => {
      const wrapper = mount(DsAvatar, {
        props: { image: 'https://invalid.example/broken.png', initials: 'EM' },
        global: globalConfig,
      });

      await wrapper.find('img.ds-avatar__image').trigger('error');
      await wrapper.vm.$nextTick();
      expect(wrapper.find('.ds-avatar--initials-monochrome').exists()).toBe(true);

      await wrapper.setProps({ image: 'https://example.test/new.png' });
      await wrapper.vm.$nextTick();
      expect(wrapper.find('.ds-avatar--image').exists()).toBe(true);
      expect(wrapper.find('img.ds-avatar__image').exists()).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('sets role="img" on the root', () => {
      const wrapper = mount(DsAvatar, { global: globalConfig });
      expect(wrapper.attributes('role')).toBe('img');
    });

    it('defaults aria-label to "User avatar" when no label sources are set', () => {
      const wrapper = mount(DsAvatar, { global: globalConfig });
      expect(wrapper.attributes('aria-label')).toBe('User avatar');
    });

    it('uses initials as aria-label when only initials are set', () => {
      const wrapper = mount(DsAvatar, {
        props: { initials: 'EM' },
        global: globalConfig,
      });
      expect(wrapper.attributes('aria-label')).toBe('EM');
    });

    it('uses alt as aria-label when alt is provided (outranks initials)', () => {
      const wrapper = mount(DsAvatar, {
        props: { initials: 'EM', alt: 'Elena Martinez' },
        global: globalConfig,
      });
      expect(wrapper.attributes('aria-label')).toBe('Elena Martinez');
    });

    it('uses explicit ariaLabel as the top priority', () => {
      const wrapper = mount(DsAvatar, {
        props: { initials: 'EM', alt: 'Elena Martinez', ariaLabel: 'Custom Label' },
        global: globalConfig,
      });
      expect(wrapper.attributes('aria-label')).toBe('Custom Label');
    });

    it('falls through empty-string ariaLabel / alt / initials to the next source', () => {
      const wrapper = mount(DsAvatar, {
        props: { ariaLabel: '', alt: '', initials: 'EM' },
        global: globalConfig,
      });
      expect(wrapper.attributes('aria-label')).toBe('EM');
    });

    it('falls through whitespace-only ariaLabel to the default', () => {
      const wrapper = mount(DsAvatar, {
        props: { ariaLabel: '   ' },
        global: globalConfig,
      });
      expect(wrapper.attributes('aria-label')).toBe('User avatar');
    });

    it('inner <img> is decorative (alt="") — parent role="img" owns the label', () => {
      const wrapper = mount(DsAvatar, {
        props: { image: 'https://example.test/u.png', alt: 'Elena Martinez' },
        global: globalConfig,
      });
      // The root carries the accessible name via role="img" + aria-label;
      // the inner <img> is decorative to avoid a duplicate announcement.
      expect(wrapper.attributes('aria-label')).toBe('Elena Martinez');
      expect(wrapper.find('img.ds-avatar__image').attributes('alt')).toBe('');
    });

    it('marks the initials span as aria-hidden', () => {
      const wrapper = mount(DsAvatar, {
        props: { initials: 'EM' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-avatar__initials').attributes('aria-hidden')).toBe('true');
    });

    it('marks the icon as aria-hidden in the icon variant', () => {
      const wrapper = mount(DsAvatar, { global: globalConfig });
      const icon = wrapper.find('.ds-avatar__icon');
      expect(icon.exists()).toBe(true);
      expect(icon.attributes('aria-hidden')).toBe('true');
    });
  });

  describe('PrimeVue passthrough', () => {
    it('forwards arbitrary attributes to the PrimeVue Avatar root', () => {
      const wrapper = mount(DsAvatar, {
        props: { initials: 'EM' },
        attrs: { 'data-testid': 'my-avatar' },
        global: globalConfig,
      });
      expect(wrapper.attributes('data-testid')).toBe('my-avatar');
    });

    it('does NOT render PrimeVue label text when a label attr is passed through $attrs', () => {
      const wrapper = mount(DsAvatar, {
        props: { initials: 'EM' },
        attrs: { label: 'XX' },
        global: globalConfig,
      });
      // Our own initials span is the only text-bearing element; PrimeVue's default
      // label rendering is suppressed because DsAvatar owns the default slot.
      expect(wrapper.find('.ds-avatar__initials').text()).toBe('EM');
      expect(wrapper.text()).not.toContain('XX');
    });

    it('tabindex is set to -1 (avatars are not focusable by default)', () => {
      const wrapper = mount(DsAvatar, { global: globalConfig });
      expect(wrapper.attributes('tabindex')).toBe('-1');
    });
  });
});
