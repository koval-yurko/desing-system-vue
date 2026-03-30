<script setup lang="ts">
import Button from 'primevue/button';
import { computed } from 'vue';

export interface DsButtonProps {
  /** Button variant type. Default: 'primary' */
  severity?: 'primary' | 'outlined' | 'tertiary' | 'text' | 'text-link' | 'negative';
  /** Button size. Default: 'medium' */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /** Disabled state. Default: false */
  disabled?: boolean;
  /** Loading state — shows dot-based indicator (3 animated dots). Default: false */
  loading?: boolean;
}

interface ButtonSizeValues {
  fontSize: string;
  paddingX: string;
  paddingY: string;
  iconOnlyWidth: string;
}

interface ButtonSizeTokens extends ButtonSizeValues {
  sm?: ButtonSizeValues;
  lg?: ButtonSizeValues;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DsButtonProps>(), {
  severity: 'primary',
  size: 'medium',
  disabled: false,
  loading: false,
});

// Map DsButton severity to PrimeVue severity + variant
const mappedSeverity = computed(() => {
  const map: Record<string, string | undefined> = {
    primary: undefined,
    outlined: undefined,
    tertiary: 'secondary',
    text: undefined,
    'text-link': undefined,
    negative: 'danger',
  };
  return map[props.severity];
});

const mappedVariant = computed(() => {
  const map: Record<string, string | undefined> = {
    primary: undefined,
    outlined: 'outlined',
    tertiary: undefined,
    text: 'text',
    'text-link': 'link',
    negative: undefined,
  };
  return map[props.severity];
});

// Map DsButton size to PrimeVue size prop
const mappedPrimeVueSize = computed(() => {
  const map: Record<string, string | undefined> = {
    xsmall: 'small',
    small: 'small',
    medium: undefined,
    large: 'large',
  };
  return map[props.size];
});

// Design token overrides per size for exact Figma dimensions
// Heights achieved via paddingY: (targetHeight - fontSize * lineHeight) / 2
// XS: (24 - 16) / 2 = 4px = 0.25rem
// S:  (32 - 20) / 2 = 6px = 0.375rem
// M:  (36 - 20) / 2 = 8px = 0.5rem
// L:  (40 - 20) / 2 = 10px = 0.625rem
const sizeTokens = computed((): ButtonSizeTokens => {
  const map: Record<string, ButtonSizeTokens> = {
    xsmall: {
      fontSize: '0.75rem',
      paddingX: '0.5rem',
      paddingY: '0.25rem',
      iconOnlyWidth: '1.5rem',
      sm: {
        fontSize: '0.75rem',
        paddingX: '0.5rem',
        paddingY: '0.25rem',
        iconOnlyWidth: '1.5rem',
      },
    },
    small: {
      fontSize: '0.875rem',
      paddingX: '0.75rem',
      paddingY: '0.375rem',
      iconOnlyWidth: '2rem',
      sm: {
        fontSize: '0.875rem',
        paddingX: '0.75rem',
        paddingY: '0.375rem',
        iconOnlyWidth: '2rem',
      },
    },
    medium: {
      fontSize: '0.875rem',
      paddingX: '1rem',
      paddingY: '0.5rem',
      iconOnlyWidth: '2.25rem',
    },
    large: {
      fontSize: '0.875rem',
      paddingX: '2rem',
      paddingY: '0.625rem',
      iconOnlyWidth: '2.5rem',
      lg: {
        fontSize: '0.875rem',
        paddingX: '2rem',
        paddingY: '0.625rem',
        iconOnlyWidth: '2.5rem',
      },
    },
  };
  return map[props.size];
});

// Icon size per size tier (Figma: XS=12px, S=16px, M=20px, L=20px)
const iconSize = computed(() => {
  const map: Record<string, string> = {
    xsmall: '0.75rem',
    small: '1rem',
    medium: '1.25rem',
    large: '1.25rem',
  };
  return map[props.size];
});

const buttonClasses = computed(() => ({
  'ds-button': true,
  [`ds-button--${props.severity}`]: true,
  [`ds-button--${props.size}`]: true,
  'ds-button--disabled': props.disabled,
  'ds-button--loading': props.loading,
  'ds-button--transitions': !props.disabled,
}));
</script>

<template>
  <Button
    v-bind="$attrs"
    :severity="mappedSeverity"
    :variant="mappedVariant"
    :size="mappedPrimeVueSize"
    :dt="sizeTokens"
    :disabled="disabled"
    :class="buttonClasses"
    :style="{ '--ds-button-icon-size': iconSize }"
    :aria-disabled="disabled ? 'true' : undefined"
    :aria-busy="loading ? 'true' : undefined"
    :aria-live="loading ? 'polite' : undefined"
  >
    <template #icon>
      <slot name="icon" />
    </template>
    <slot />
    <span v-if="loading" class="ds-button-loading-overlay" aria-label="Loading">
      <span class="ds-button-loading-dots">
        <span /><span /><span />
      </span>
    </span>
  </Button>
</template>

<style scoped>
.ds-button--transitions {
  transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease, box-shadow 150ms ease, opacity 150ms ease;
}

.ds-button--disabled {
  opacity: 0.5;
  pointer-events: none;
}

.ds-button--loading {
  position: relative;
  pointer-events: none;
}

.ds-button--loading :deep(.p-button-label),
.ds-button--loading :deep(.p-button-icon) {
  visibility: hidden;
}

.ds-button-loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ds-button-loading-dots {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.ds-button-loading-dots > span {
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
  animation: ds-dot-pulse 1.4s infinite ease-in-out both;
}

.ds-button-loading-dots > span:nth-child(1) {
  animation-delay: -0.32s;
}

.ds-button-loading-dots > span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes ds-dot-pulse {
  0%, 80%, 100% {
    transform: scale(0.4);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.ds-button :deep(.p-button-icon) {
  font-size: var(--ds-button-icon-size);
  width: var(--ds-button-icon-size);
  height: var(--ds-button-icon-size);
}
</style>
