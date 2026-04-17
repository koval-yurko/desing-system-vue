<script setup lang="ts">
import Badge from 'primevue/badge';
import { computed, useSlots } from 'vue';
import DsIcon from '../DsIcon/DsIcon.vue';

export type DsBadgeType =
  | 'pending'
  | 'interesting'
  | 'neutral'
  | 'rejected'
  | 'accepted'
  | 'cancel'
  | 'border'
  | 'clean'
  | 'draft'
  | 'loaded'
  | 'type10';

export interface DsBadgeProps {
  /** Visual type. Default: 'pending' */
  type?: DsBadgeType;
  /** Render left icon slot (12×12). Default: false */
  showLIcon?: boolean;
  /** Render right icon slot (12×12). Default: false */
  showRIcon?: boolean;
  /** Badge text (alternative to default slot — slot wins when both provided) */
  label?: string;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DsBadgeProps>(), {
  type: 'pending',
  showLIcon: false,
  showRIcon: false,
});

const slots = useSlots();

const badgeClasses = computed(() => ['ds-badge', `ds-badge--${props.type}`]);

const hasText = computed(
  () =>
    props.type !== 'loaded' &&
    (!!slots.default || (props.label !== undefined && props.label !== '')),
);

const hasLIcon = computed(
  () => props.showLIcon && props.type !== 'loaded' && props.type !== 'draft',
);

const hasRIcon = computed(
  () => props.showRIcon && props.type !== 'loaded' && props.type !== 'draft',
);

// `loaded` has no rendered text, so screen readers hear nothing without help.
// Default to aria-busy + a label; consumer-provided $attrs take precedence
// because v-bind="$attrs" is applied after these bindings on the template root.
const ariaBusy = computed(() => (props.type === 'loaded' ? 'true' : undefined));
const ariaLabel = computed(() => (props.type === 'loaded' ? 'Loading' : undefined));
</script>

<template>
  <Badge
    :aria-busy="ariaBusy"
    :aria-label="ariaLabel"
    v-bind="$attrs"
    :class="badgeClasses"
  >
    <span v-if="hasLIcon" class="ds-badge__leading">
      <slot name="leading">
        <DsIcon name="success" :style="{ width: '12px', height: '12px' }" />
      </slot>
    </span>
    <span v-if="hasText" class="ds-badge__label">
      <slot>{{ label }}</slot>
    </span>
    <span v-if="hasRIcon" class="ds-badge__trailing">
      <slot name="trailing">
        <DsIcon name="success" :style="{ width: '12px', height: '12px' }" />
      </slot>
    </span>
  </Badge>
</template>

<style scoped>
/* Base badge layout */
.ds-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid transparent;
  gap: 3px;
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0;
  box-sizing: border-box;
  position: relative;
}

/* Strip PrimeVue Badge internal styling — DS wrapper owns all visual properties */
.ds-badge:deep(.p-badge) {
  background: transparent !important;
  padding: 0 !important;
  color: inherit !important;
  border-radius: 0 !important;
  outline: none !important;
  min-width: 0 !important;
  height: auto !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: inherit !important;
}

/* Icon wrappers inherit currentColor */
.ds-badge__leading,
.ds-badge__trailing {
  display: inline-flex;
  align-items: center;
  color: inherit;
}

/* Label span */
.ds-badge__label {
  color: inherit;
  display: inline-flex;
  align-items: center;
  line-height: 16px;
}

/* ---- Variant: Pending ---- */
.ds-badge--pending {
  background-color: var(--p-amber-100);
  color: var(--p-amber-700);
  gap: 2px;
}

/* ---- Variant: Interesting ---- */
.ds-badge--interesting {
  background-color: var(--p-purple-100);
  color: var(--p-purple-600);
  gap: 2px;
}

/* ---- Variant: Neutral ---- */
.ds-badge--neutral {
  background-color: var(--p-blue-200);
  color: var(--p-blue-600);
}

/* ---- Variant: Rejected ---- */
.ds-badge--rejected {
  background-color: var(--p-red-100);
  color: var(--p-red-700);
}

/* ---- Variant: Accepted ---- */
.ds-badge--accepted {
  background-color: var(--p-green-100);
  color: var(--p-green-700);
}

/* ---- Variant: Cancel ---- */
.ds-badge--cancel {
  background-color: var(--p-gray-300);
  color: var(--p-gray-800);
}

/* ---- Variant: Border ---- */
.ds-badge--border {
  background-color: var(--p-surface-0);
  border-color: var(--p-gray-300);
  color: var(--p-gray-800);
}

/* ---- Variant: Clean ---- */
.ds-badge--clean {
  background-color: transparent;
  padding: 2px 4px;
  /* Figma taxt/main/gray-600 — differs from primitive --p-gray-600 (#6a7d97) */
  color: #62748e;
}

@media (hover: hover) {
  .ds-badge--clean:hover {
    background-color: var(--p-gray-300);
  }
}

/* ---- Variant: Draft (diagonal stripes overlay via ::before) ---- */
.ds-badge--draft {
  background-color: var(--p-gray-300);
  color: var(--p-gray-800);
  overflow: clip;
}

.ds-badge--draft::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    120deg,
    var(--p-gray-400) 0 1.78px,
    transparent 1.78px 6px
  );
  pointer-events: none;
}

/* ---- Variant: Loaded (shimmer via ::before) ---- */
.ds-badge--loaded {
  background-color: var(--p-gray-200);
  border-color: var(--p-gray-300);
  width: 43px;
  overflow: clip;
}

.ds-badge--loaded::before {
  content: '';
  position: absolute;
  top: -4px;
  bottom: -4px;
  left: -20%;
  width: 17px;
  background-color: var(--p-surface-0);
  filter: blur(8.5px);
  transform: rotate(31deg);
}

/* ---- Variant: Type10 ---- */
.ds-badge--type10 {
  background-color: var(--p-gray-200);
  border-color: var(--p-gray-300);
  color: var(--p-gray-800);
}

/* ---- Shimmer animation (reduced-motion guarded) ---- */
@keyframes ds-badge-shimmer {
  0% {
    transform: translateX(-100%) rotate(31deg);
  }
  100% {
    transform: translateX(200%) rotate(31deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  .ds-badge--loaded::before {
    animation: ds-badge-shimmer 1.5s linear infinite;
  }
}

/* Hide the static blurred overlay entirely for reduced-motion users —
   leaving it in place renders a non-animating white smudge. */
@media (prefers-reduced-motion: reduce) {
  .ds-badge--loaded::before {
    display: none;
  }
}

/* ---- Hover transitions (reduced-motion guarded) ---- */
@media (prefers-reduced-motion: no-preference) {
  .ds-badge--clean,
  .ds-badge--type10 {
    transition: background-color 150ms ease, border-color 150ms ease;
  }
}
</style>
