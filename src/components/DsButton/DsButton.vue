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
  borderRadius: string;
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
// Heights achieved via paddingY: (targetHeight - lineHeight - 2px border) / 2
// XS: (24 - 16 - 2) / 2 = 3px
// S:  (32 - 20 - 2) / 2 = 5px
// M:  (36 - 20 - 2) / 2 = 7px
// L:  (40 - 20 - 2) / 2 = 9px
const sizeTokens = computed((): ButtonSizeTokens => {
  const map: Record<string, ButtonSizeTokens> = {
    xsmall: {
      fontSize: '0.75rem',
      paddingX: '0.25rem',
      paddingY: '3px',
      iconOnlyWidth: '1.5rem',
      borderRadius: '4px',
      sm: {
        fontSize: '0.75rem',
        paddingX: '0.25rem',
        paddingY: '3px',
        iconOnlyWidth: '1.5rem',
        borderRadius: '4px',
      },
    },
    small: {
      fontSize: '0.875rem',
      paddingX: '2rem',
      paddingY: '5px',
      iconOnlyWidth: '2rem',
      borderRadius: '8px',
      sm: {
        fontSize: '0.875rem',
        paddingX: '2rem',
        paddingY: '5px',
        iconOnlyWidth: '2rem',
        borderRadius: '8px',
      },
    },
    medium: {
      fontSize: '0.875rem',
      paddingX: '2rem',
      paddingY: '7px',
      iconOnlyWidth: '2.25rem',
      borderRadius: '8px',
    },
    large: {
      fontSize: '0.875rem',
      paddingX: '2rem',
      paddingY: '9px',
      iconOnlyWidth: '2.5rem',
      borderRadius: '8px',
      lg: {
        fontSize: '0.875rem',
        paddingX: '2rem',
        paddingY: '9px',
        iconOnlyWidth: '2.5rem',
        borderRadius: '8px',
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

// Font weight per size tier (Figma: XS=400, S=500, M/L=600)
const fontWeight = computed(() => {
  const map: Record<string, string> = {
    xsmall: '400',
    small: '500',
    medium: '600',
    large: '600',
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
    :style="{
      '--ds-button-icon-size': iconSize,
      fontWeight,
      letterSpacing: props.size === 'xsmall' ? '0' : '-0.2px',
      lineHeight: props.size === 'xsmall' ? '16px' : '20px',
    }"
    :aria-disabled="disabled ? 'true' : undefined"
    :aria-busy="loading ? 'true' : undefined"
    :aria-live="loading ? 'polite' : undefined"
  >
    <template v-if="$slots.icon" #icon>
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

.ds-button--medium {
  font-size: var(--p-button-font-size) !important;
}
</style>
