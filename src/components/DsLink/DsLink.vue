<script setup lang="ts">
import { computed } from 'vue';

export interface DsLinkProps {
  /** Link type. Default: 'regular' */
  type?: 'regular' | 'smart' | 'quiet';
  /** Link size. Default: 'medium' */
  size?: 'small' | 'medium';
  /** Visibility level. High = blue, Low = gray. Default: 'high' */
  visibility?: 'high' | 'low';
  /** Disabled state. Default: false */
  disabled?: boolean;
  /** Link destination URL */
  href?: string;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DsLinkProps>(), {
  type: 'regular',
  size: 'medium',
  visibility: 'high',
  disabled: false,
});

// Smart link only supports high visibility per Figma design
const resolvedVisibility = computed(() => (props.type === 'smart' ? 'high' : props.visibility));

const resolvedHref = computed(() => (props.disabled ? undefined : props.href));

function handleClick(e: MouseEvent) {
  if (props.disabled) {
    e.preventDefault();
    e.stopPropagation();
  }
}

const linkClasses = computed(() => ({
  'ds-link': true,
  [`ds-link--${props.type}`]: true,
  [`ds-link--${props.size}`]: true,
  [`ds-link--${resolvedVisibility.value}`]: true,
  'ds-link--disabled': props.disabled,
  'ds-link--transitions': !props.disabled,
}));
</script>

<template>
  <a
    v-bind="$attrs"
    :href="resolvedHref"
    :class="linkClasses"
    :aria-disabled="disabled ? 'true' : undefined"
    :tabindex="disabled ? -1 : undefined"
    @click="handleClick"
  >
    <slot name="left-icon" />
    <span class="ds-link__text">
      <slot />
    </span>
    <slot name="right-icon" />
  </a>
</template>

<style scoped>
/* Base layout */
.ds-link {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  text-decoration: none;
  cursor: pointer;
  font-weight: 400;
}

/* Transitions (not on disabled) */
.ds-link--transitions {
  transition: color 150ms ease, background-color 150ms ease, text-decoration-color 150ms ease, border-radius 150ms ease;
}

/* ─── SIZE TOKENS ─── */
.ds-link--small {
  font-size: var(--font-size-h10, 14px);
  line-height: var(--unit\/xl, 20px);
  letter-spacing: -0.2px;
}

.ds-link--medium {
  font-size: var(--font-size-h9, 16px);
  line-height: var(--typography\/size\/xl, 24px);
  letter-spacing: -0.2px;
}

/* Regular link small: letter-spacing 0 override */
.ds-link--regular.ds-link--small {
  letter-spacing: 0;
}

/* ─── FONT FAMILY ─── */
.ds-link {
  font-family: var(--typography\/family\/heading, 'Inter', sans-serif);
}

/* ─── TYPE: REGULAR — always underlined ─── */
.ds-link--regular .ds-link__text {
  text-decoration: underline;
  text-decoration-skip-ink: none;
}

/* ─── TYPE: SMART — padded container, no underline ─── */
.ds-link--smart {
  padding: 4px 10px;
  border-radius: 0;
}

/* ─── TYPE: QUIET — no underline by default ─── */
.ds-link--quiet .ds-link__text {
  text-decoration: none;
}

/* ─── VISIBILITY: HIGH ─── */
.ds-link--high {
  color: var(--taxt\/supporting\/blue\/blue-600, #0e5cf4);
}

/* ─── VISIBILITY: LOW ─── */
.ds-link--low {
  color: var(--taxt\/main\/gray-800, #314158);
}

/* ─── HOVER STATES ─── */

/* All hover states gain border-radius per Figma */
.ds-link:not(.ds-link--disabled):hover {
  border-radius: 4px;
}

/* Regular (high) hover */
.ds-link--regular.ds-link--high:not(.ds-link--disabled):hover {
  color: var(--taxt\/supporting\/blue\/blue-800, #0042c4);
}

/* Regular (low) hover */
.ds-link--regular.ds-link--low:not(.ds-link--disabled):hover {
  color: var(--taxt\/main\/gray-900, #1d293d);
}

/* Smart (high) hover — gains background */
.ds-link--smart.ds-link--high:not(.ds-link--disabled):hover {
  background-color: var(--surfase\/supporting\/blue\/blue-200, #e7f4fe);
}

/* Quiet (high) hover — gains underline, darker blue, body font */
.ds-link--quiet.ds-link--high:not(.ds-link--disabled):hover {
  color: var(--taxt\/supporting\/blue\/blue-800, #0042c4);
  font-family: var(--typography\/family\/body, 'Inter', sans-serif);
}

.ds-link--quiet.ds-link--high:not(.ds-link--disabled):hover .ds-link__text {
  text-decoration: underline;
  text-decoration-skip-ink: none;
}

/* Quiet (low) hover — gains underline, darker gray, body font */
.ds-link--quiet.ds-link--low:not(.ds-link--disabled):hover {
  color: var(--taxt\/main\/gray-950, #020618);
  font-family: var(--typography\/family\/body, 'Inter', sans-serif);
}

.ds-link--quiet.ds-link--low:not(.ds-link--disabled):hover .ds-link__text {
  text-decoration: underline;
  text-decoration-skip-ink: none;
}

/* ─── DISABLED STATE ─── */
.ds-link--disabled {
  color: var(--taxt\/main\/gray-500, #90a1b9);
  pointer-events: none;
  cursor: default;
}

/* ─── FOCUS VISIBLE ─── */
.ds-link:focus-visible {
  outline: 2px solid var(--outline\/brand\/purple-450, #5f33e6);
  outline-offset: 2px;
  border-radius: 2px;
}
</style>
