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
  /** Show filter indicator dot at top-right corner. Default: false */
  indicator?: boolean;
  /** Counter badge value. When set, shows a count badge at top-right. */
  counterBadge?: number;
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
  indicator: false,
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
  <div class="ds-icon-button-wrapper">
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
    <span
      v-if="indicator && !counterBadge"
      class="ds-icon-button-indicator"
      aria-hidden="true"
    />
    <span
      v-if="counterBadge != null"
      class="ds-icon-button-counter-badge"
      :aria-label="`${counterBadge} notifications`"
    >
      {{ counterBadge }}
    </span>
  </div>
</template>

<style scoped>
/* Wrapper for positioning indicator / counter badge */
.ds-icon-button-wrapper {
  position: relative;
  display: inline-flex;
}

.ds-icon-button--transitions {
  transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease, box-shadow 150ms ease, opacity 150ms ease;
}

/* ------------------------------------------------------------------ */
/* Disabled – per-type styling (Figma uses distinct colors, not opacity)*/
/* ------------------------------------------------------------------ */
.ds-icon-button--disabled {
  pointer-events: none;
}

/* Primary disabled: solid gray-300 bg, gray-500 icon */
.ds-icon-button--primary.ds-icon-button--disabled {
  background-color: var(--p-gray-300, #e2e8f0) !important;
  border-color: var(--p-gray-300, #e2e8f0) !important;
  color: var(--p-gray-500, #90a1b9) !important;
}

/* Outlined disabled: gray-300 border, gray-400 icon */
.ds-icon-button--outlined.ds-icon-button--disabled {
  background-color: var(--p-surface-0, #ffffff) !important;
  border-color: var(--p-gray-300, #e2e8f0) !important;
  color: var(--p-gray-400, #cad5e2) !important;
  opacity: 1;
}

/* Text disabled: muted icon */
.ds-icon-button--text.ds-icon-button--disabled {
  color: var(--p-gray-400, #cad5e2) !important;
  background-color: transparent !important;
  opacity: 1;
}

/* ------------------------------------------------------------------ */
/* Hover states (Figma-exact colors)                                   */
/* ------------------------------------------------------------------ */

/* Primary hover: purple-800 */
.ds-icon-button--primary:not(.ds-icon-button--disabled):hover {
  background-color: var(--p-primary-800, #5f33e6) !important;
  border-color: var(--p-primary-800, #5f33e6) !important;
}

/* Outlined hover: gray-200 inner bg */
.ds-icon-button--outlined:not(.ds-icon-button--disabled):hover {
  background-color: var(--p-gray-200, #f1f5f9) !important;
  border-color: var(--p-gray-400, #cad5e2) !important;
}

/* Text hover: gray-200 bg */
.ds-icon-button--text:not(.ds-icon-button--disabled):hover {
  background-color: var(--p-gray-200, #f1f5f9) !important;
}

/* ------------------------------------------------------------------ */
/* Active / pressed states                                             */
/* ------------------------------------------------------------------ */

/* Primary active: purple-800 */
.ds-icon-button--primary:not(.ds-icon-button--disabled):active {
  background-color: var(--p-primary-800, #5f33e6) !important;
  border-color: var(--p-primary-800, #5f33e6) !important;
}

/* Outlined active: gray-200 fill */
.ds-icon-button--outlined:not(.ds-icon-button--disabled):active {
  background-color: var(--p-gray-200, #f1f5f9) !important;
}

/* Text active: gray-300 fill */
.ds-icon-button--text:not(.ds-icon-button--disabled):active {
  background-color: var(--p-gray-300, #e2e8f0) !important;
}

/* ------------------------------------------------------------------ */
/* Outlined border color per size (Figma: XS/M = gray-400, S = gray-300) */
/* ------------------------------------------------------------------ */
.ds-icon-button--outlined.ds-icon-button--xsmall {
  border-color: var(--p-gray-400, #cad5e2);
}

.ds-icon-button--outlined.ds-icon-button--small {
  border-color: var(--p-gray-300, #e2e8f0);
}

.ds-icon-button--outlined.ds-icon-button--medium {
  border-color: var(--p-gray-400, #cad5e2);
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

/* ------------------------------------------------------------------ */
/* Indicator dot (Figma: 5px circle at top-right)                      */
/* ------------------------------------------------------------------ */
.ds-icon-button-indicator {
  position: absolute;
  top: 1px;
  right: 1px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: var(--p-primary-600, #7849ff);
  pointer-events: none;
}

/* ------------------------------------------------------------------ */
/* Counter badge (Figma: 20px circle at top-right offset)              */
/* ------------------------------------------------------------------ */
.ds-icon-button-counter-badge {
  position: absolute;
  top: -3px;
  right: -6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 100px;
  background-color: var(--p-primary-600, #7849ff);
  color: #ffffff;
  font-family: var(--p-font-family, 'Inter', sans-serif);
  font-size: 9px;
  font-weight: 600;
  line-height: 1;
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
