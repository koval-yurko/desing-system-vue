<script setup lang="ts">
import Button from 'primevue/button';
import { computed } from 'vue';

export interface DsIconButtonProps {
  /** Button visual type. Default: 'primary' */
  type?: 'primary' | 'outlined' | 'text';
  /** Button size. Default: 'medium' */
  size?: 'xsmall' | 'small' | 'medium';
  /** Disabled state. Default: false */
  disabled?: boolean;
  /** Loading state. Default: false */
  loading?: boolean;
  /** Accessible label (required for icon-only buttons unless ariaLabelledby is provided) */
  ariaLabel?: string;
  /** ID of an element that labels this button (alternative to ariaLabel) */
  ariaLabelledby?: string;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DsIconButtonProps>(), {
  type: 'primary',
  size: 'medium',
  disabled: false,
  loading: false,
});

// Map DsIconButton type to PrimeVue variant
const mappedVariant = computed(() => {
  const map: Record<'primary' | 'outlined' | 'text', string | undefined> = {
    primary: undefined,
    outlined: 'outlined',
    text: 'text',
  };
  return map[props.type];
});

// Map DsIconButton size to PrimeVue size prop
const mappedPrimeVueSize = computed(() => {
  const map: Record<'xsmall' | 'small' | 'medium', string | undefined> = {
    xsmall: 'small',
    small: 'small',
    medium: undefined,
  };
  return map[props.size];
});

// Design token overrides per size for exact Figma square dimensions
const sizeTokens = computed(() => {
  const map: Record<'xsmall' | 'small' | 'medium', Record<string, string>> = {
    xsmall: {
      fontSize: '0',
      paddingX: '0',
      paddingY: '0',
      iconOnlyWidth: '1.5rem',
      borderRadius: '4px',
    },
    small: {
      fontSize: '0',
      paddingX: '0',
      paddingY: '0',
      iconOnlyWidth: '2rem',
      borderRadius: '8px',
    },
    medium: {
      fontSize: '0',
      paddingX: '0',
      paddingY: '0',
      iconOnlyWidth: '2.25rem',
      borderRadius: '8px',
    },
  };
  return map[props.size];
});

// Icon size per size tier (Figma: XS=20px, S=20px, M=24px)
const iconSize = computed(() => {
  const map: Record<'xsmall' | 'small' | 'medium', string> = {
    xsmall: '1.25rem',
    small: '1.25rem',
    medium: '1.5rem',
  };
  return map[props.size];
});

// Button fixed dimension derived from sizeTokens (square: width === height)
const buttonDimension = computed(() => sizeTokens.value.iconOnlyWidth);

const buttonClasses = computed(() => ({
  'ds-icon-button': true,
  [`ds-icon-button--${props.type}`]: true,
  [`ds-icon-button--${props.size}`]: true,
  'ds-icon-button--disabled': props.disabled,
  'ds-icon-button--loading': props.loading,
  'ds-icon-button--transitions': !props.disabled && !props.loading,
}));
</script>

<template>
  <Button
    v-bind="$attrs"
    :variant="mappedVariant"
    :size="mappedPrimeVueSize"
    :dt="sizeTokens"
    :disabled="disabled || loading"
    :class="buttonClasses"
    :style="{
      '--ds-icon-button-icon-size': iconSize,
      '--ds-icon-button-dimension': buttonDimension,
    }"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
    :aria-disabled="(disabled || loading) ? 'true' : undefined"
    :aria-busy="loading ? 'true' : undefined"
    :aria-live="loading ? 'polite' : undefined"
  >
    <span v-if="!loading && $slots.default" class="ds-icon-button-icon">
      <slot />
    </span>
    <span v-else-if="loading" class="ds-icon-button-loading-overlay" role="status" aria-label="Loading">
      <span class="ds-icon-button-loading-dots">
        <span /><span /><span />
      </span>
    </span>
  </Button>
</template>

<style scoped>
.ds-icon-button--transitions {
  transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease, box-shadow 150ms ease, opacity 150ms ease;
}

.ds-icon-button--disabled {
  opacity: 0.5;
  pointer-events: none;
}

.ds-icon-button--loading {
  position: relative;
  pointer-events: none;
}

.ds-icon-button--loading :deep(.p-button-label),
.ds-icon-button--loading :deep(.p-button-icon) {
  visibility: hidden;
}

/* Enforce square dimensions */
.ds-icon-button {
  width: var(--ds-icon-button-dimension) !important;
  height: var(--ds-icon-button-dimension) !important;
  min-width: unset !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ds-icon-button-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--ds-icon-button-icon-size);
  height: var(--ds-icon-button-icon-size);
  font-size: var(--ds-icon-button-icon-size);
  pointer-events: none;
}

.ds-icon-button-loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ds-icon-button-loading-dots {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.ds-icon-button-loading-dots > span {
  display: block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: currentColor;
  animation: ds-icon-dot-pulse 1.4s infinite ease-in-out both;
}

.ds-icon-button-loading-dots > span:nth-child(1) {
  animation-delay: -0.32s;
}

.ds-icon-button-loading-dots > span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes ds-icon-dot-pulse {
  0%, 80%, 100% {
    transform: scale(0.4);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
