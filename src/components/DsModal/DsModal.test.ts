import { mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import Dialog from 'primevue/dialog';
import { describe, expect, it, vi } from 'vitest';
import DsModal from './DsModal.vue';

const globalConfig = {
  plugins: [[PrimeVue, { theme: 'none' }]],
};

// `appendTo: 'self'` keeps Dialog DOM inside the wrapper for assertions.
function mountModal(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return mount(DsModal, {
    props: { visible: true, appendTo: 'self', ...props },
    slots,
    global: globalConfig,
    attachTo: document.body,
  });
}

describe('DsModal', () => {
  describe('rendering', () => {
    it('does not render dialog content when visible is false', () => {
      const wrapper = mount(DsModal, {
        props: { visible: false, appendTo: 'self' },
        global: globalConfig,
      });
      expect(wrapper.find('.ds-modal').exists()).toBe(false);
    });

    it('renders dialog when visible is true', () => {
      const wrapper = mountModal({ title: 'Hello' });
      expect(wrapper.find('.ds-modal').exists()).toBe(true);
      expect(wrapper.findComponent(Dialog).exists()).toBe(true);
    });

    it('renders title in the header', () => {
      const wrapper = mountModal({ title: 'Add user' });
      expect(wrapper.find('.ds-modal__title').text()).toBe('Add user');
    });

    it('renders description below the title when provided', () => {
      const wrapper = mountModal({ title: 'Add user', description: 'Fill the details' });
      expect(wrapper.find('.ds-modal__description').text()).toBe('Fill the details');
    });

    it('omits description element when not provided', () => {
      const wrapper = mountModal({ title: 'Add user' });
      expect(wrapper.find('.ds-modal__description').exists()).toBe(false);
    });
  });

  describe('size variants', () => {
    it.each([
      ['small', '400px'],
      ['medium', '500px'],
      ['large', '600px'],
    ] as const)('applies width %s -> %s', (size, expectedWidth) => {
      const wrapper = mountModal({ size, title: 'X' });
      const root = wrapper.find('.ds-modal').element as HTMLElement;
      expect(root.style.width).toBe(expectedWidth);
      expect(wrapper.find(`.ds-modal--${size}`).exists()).toBe(true);
    });

    it('defaults to medium when size is not provided', () => {
      const wrapper = mountModal({ title: 'X' });
      const root = wrapper.find('.ds-modal').element as HTMLElement;
      expect(root.style.width).toBe('500px');
      expect(wrapper.find('.ds-modal--medium').exists()).toBe(true);
    });
  });

  describe('closable / dismissable behavior', () => {
    it('passes closable=true to Dialog by default', () => {
      const wrapper = mountModal({ title: 'X' });
      expect(wrapper.findComponent(Dialog).props('closable')).toBe(true);
    });

    it('passes closable=false through to Dialog', () => {
      const wrapper = mountModal({ title: 'X', closable: false });
      expect(wrapper.findComponent(Dialog).props('closable')).toBe(false);
    });

    it('passes dismissableMask through to Dialog', () => {
      const wrapper = mountModal({ title: 'X', dismissableMask: false });
      expect(wrapper.findComponent(Dialog).props('dismissableMask')).toBe(false);
    });

    it('passes closeOnEscape through to Dialog', () => {
      const wrapper = mountModal({ title: 'X', closeOnEscape: false });
      expect(wrapper.findComponent(Dialog).props('closeOnEscape')).toBe(false);
    });

    it('forces modal=true on the underlying Dialog', () => {
      const wrapper = mountModal({ title: 'X' });
      expect(wrapper.findComponent(Dialog).props('modal')).toBe(true);
    });

    it('disables dragging on the underlying Dialog', () => {
      const wrapper = mountModal({ title: 'X' });
      expect(wrapper.findComponent(Dialog).props('draggable')).toBe(false);
    });
  });

  describe('slots', () => {
    it('renders default slot inside content section', () => {
      const wrapper = mountModal({ title: 'X' }, { default: '<p class="body-text">Body</p>' });
      const content = wrapper.find('.ds-modal__content');
      expect(content.exists()).toBe(true);
      expect(content.find('.body-text').text()).toBe('Body');
    });

    it('renders footer slot inside footer section', () => {
      const wrapper = mountModal({ title: 'X' }, { footer: '<button class="ok-btn">OK</button>' });
      const footer = wrapper.find('.ds-modal__footer');
      expect(footer.exists()).toBe(true);
      expect(footer.find('.ok-btn').exists()).toBe(true);
    });

    it('omits footer section when no footer slot provided', () => {
      const wrapper = mountModal({ title: 'X' });
      expect(wrapper.find('.ds-modal__footer').exists()).toBe(false);
    });

    it('renders custom header slot in place of title block', () => {
      const wrapper = mountModal(
        { title: 'X' },
        { header: '<div class="custom-header">Custom</div>' },
      );
      expect(wrapper.find('.custom-header').exists()).toBe(true);
      expect(wrapper.find('.ds-modal__title').exists()).toBe(false);
    });
  });

  describe('v-model:visible', () => {
    it('binds visible to the underlying Dialog', () => {
      const wrapper = mountModal({ title: 'X' });
      expect(wrapper.findComponent(Dialog).props('visible')).toBe(true);
    });

    it('forwards the show event', () => {
      const wrapper = mountModal({ title: 'X' });
      wrapper.findComponent(Dialog).vm.$emit('show');
      expect(wrapper.emitted('show')).toBeTruthy();
    });

    it('forwards the hide event', () => {
      const wrapper = mountModal({ title: 'X' });
      wrapper.findComponent(Dialog).vm.$emit('hide');
      expect(wrapper.emitted('hide')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('renders title as an h2 element for screen readers', () => {
      const wrapper = mountModal({ title: 'Add user' });
      const title = wrapper.find('.ds-modal__title');
      expect(title.element.tagName).toBe('H2');
    });

    it('renders close icon when closable', () => {
      const wrapper = mountModal({ title: 'X', closable: true });
      // The closeicon slot wraps a DsIcon — check the rendered svg span exists.
      const closeIcon = wrapper.find('.ds-modal__close-button');
      expect(closeIcon.exists()).toBe(true);
    });
  });

  describe('$attrs passthrough', () => {
    it('passes data-testid through to Dialog root', () => {
      const wrapper = mountModal({ title: 'X', 'data-testid': 'my-modal' });
      expect(wrapper.find('[data-testid="my-modal"]').exists()).toBe(true);
    });

    it('passes id through to Dialog root', () => {
      const wrapper = mountModal({ title: 'X', id: 'modal-1' });
      expect(wrapper.find('#modal-1').exists()).toBe(true);
    });

    it('does not raise errors when arbitrary attrs are passed', () => {
      const onClick = vi.fn();
      const wrapper = mountModal({ title: 'X', onClick } as Record<string, unknown>);
      expect(wrapper.find('.ds-modal').exists()).toBe(true);
    });
  });
});
