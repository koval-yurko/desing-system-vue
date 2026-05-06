<script setup lang="ts">
import Dialog from 'primevue/dialog';
import { computed } from 'vue';
import DsIcon from '../DsIcon/DsIcon.vue';

export interface DsModalProps {
  /** Modal title rendered in the header. Use the `header` slot for fully custom layouts. */
  title?: string;
  /** Optional helper text rendered below the title in the header. */
  description?: string;
  /** Modal width tier — small=400px, medium=500px, large=600px. Default: 'medium' */
  size?: 'small' | 'medium' | 'large';
  /** Show built-in close (×) button in the header. Default: true */
  closable?: boolean;
  /** Click on the backdrop closes the modal. Default: true */
  dismissableMask?: boolean;
  /** Pressing Escape closes the modal. Default: true */
  closeOnEscape?: boolean;
  /** Where to teleport the dialog. Default: 'body' */
  appendTo?: 'body' | 'self' | HTMLElement;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DsModalProps>(), {
  size: 'medium',
  closable: true,
  dismissableMask: true,
  closeOnEscape: true,
  appendTo: 'body',
});

const visible = defineModel<boolean>('visible', { default: false });

defineEmits<{
  show: [];
  hide: [];
  'after-hide': [];
}>();

const widthPx = computed(() => {
  const map: Record<'small' | 'medium' | 'large', string> = {
    small: '400px',
    medium: '500px',
    large: '600px',
  };
  return map[props.size];
});

const modalClass = computed(() => `ds-modal ds-modal--${props.size}`);

// Override PrimeVue Dialog design tokens so we don't have to fight cascade
// against `.p-dialog-*` rules. Token shape mirrors @primeuix/themes/aura/dialog.
const dialogTokens = computed(() => ({
  background: 'var(--p-surface-0)',
  borderColor: 'var(--p-gray-300)',
  color: 'var(--p-gray-900)',
  borderRadius: '12px',
  shadow: '0 1px 6px #b0bdc517, 0 6px 13px #b0bdc524, 0 1px 2px #3a485012',
  header: {
    padding: '12px 24px',
    gap: '8px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
  },
  content: {
    padding: '24px',
  },
  footer: {
    padding: '16px 24px',
    gap: '12px',
  },
}));
</script>

<template>
  <Dialog
    v-bind="$attrs"
    v-model:visible="visible"
    :modal="true"
    :closable="closable"
    :draggable="false"
    :dismissable-mask="dismissableMask"
    :close-on-escape="closeOnEscape"
    :append-to="appendTo"
    :style="{ width: widthPx }"
    :dt="dialogTokens"
    :pt="{
      root: { class: modalClass },
      header: { class: 'ds-modal__header' },
      title: { class: 'ds-modal__title-block' },
      content: { class: 'ds-modal__content' },
      footer: { class: 'ds-modal__footer' },
      mask: { class: 'ds-modal__mask' },
      pcCloseButton: { root: { class: 'ds-modal__close-button' } },
    }"
    @show="$emit('show')"
    @hide="$emit('hide')"
    @after-hide="$emit('after-hide')"
  >
    <template #header>
      <slot name="header">
        <div class="ds-modal__title-block">
          <h2 v-if="title" class="ds-modal__title">{{ title }}</h2>
          <p v-if="description" class="ds-modal__description">{{ description }}</p>
        </div>
      </slot>
    </template>

    <template #closeicon>
      <DsIcon name="close" size="medium" />
    </template>

    <slot />

    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </Dialog>
</template>

<!--
  Non-scoped — Dialog teleports to body and PrimeVue's `.p-dialog-*` styles
  are injected at runtime, so scoped data-v selectors won't reach them.
  Where we conflict with PrimeVue's single-class rules, we double the class
  (`.ds-modal.ds-modal`) to bump specificity above PrimeVue's (0,0,2,0 > 0,0,1,0).
-->
<style>
/* ----- Header --------------------------------------------------------- */
/* Override PrimeVue's `align-items: center` so a title + description stack
   from the top instead of being vertically centered. */
.ds-modal__header.ds-modal__header {
  align-items: flex-start;
  border-bottom: 1px solid var(--p-gray-300);
}

.ds-modal__title-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1 1 auto;
}

.ds-modal__title {
  margin: 0;
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.2px;
  color: var(--p-gray-900);
}

.ds-modal__description {
  margin: 0;
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.2px;
  color: var(--p-gray-600);
}

/* ----- Close button --------------------------------------------------- */
/* PrimeVue's pcCloseButton is a regular Button, themed via its own tokens.
   Double the class to win against `.p-button` rules. */
.ds-modal__close-button.ds-modal__close-button {
  width: 24px;
  height: 24px;
  min-width: 24px;
  padding: 0;
  border-radius: 4px;
  background: transparent;
  border: none;
  color: var(--p-gray-500);
  box-shadow: none;
}

.ds-modal__close-button.ds-modal__close-button:hover {
  background-color: var(--p-gray-100);
  color: var(--p-gray-700);
}

.ds-modal__close-button.ds-modal__close-button:focus-visible {
  outline: 2px solid var(--p-primary-color);
  outline-offset: 2px;
}

/* ----- Content -------------------------------------------------------- */
/* Inherit color/font from `.p-dialog`; only set what PrimeVue doesn't. */
.ds-modal__content {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.2px;
}

/* ----- Footer --------------------------------------------------------- */
/* Double the class to override PrimeVue's `.p-dialog-footer` shorthand. */
.ds-modal__footer.ds-modal__footer {
  align-items: center;
  border-top: 1px solid var(--p-gray-300);
}

/* ----- Dark mode borders --------------------------------------------- */
/* Background/color flip automatically through Aura's overlay.modal tokens.
   Header/footer dividers have no token, so we adjust them explicitly. */
.p-dark .ds-modal__header.ds-modal__header {
  border-bottom-color: var(--p-surface-700);
}

.p-dark .ds-modal__footer.ds-modal__footer {
  border-top-color: var(--p-surface-700);
}

.p-dark .ds-modal__title {
  color: var(--p-surface-0);
}

.p-dark .ds-modal__description {
  color: var(--p-surface-300);
}
</style>
