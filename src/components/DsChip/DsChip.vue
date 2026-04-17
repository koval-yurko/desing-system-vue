<script setup lang="ts">
import Chip from 'primevue/chip';
import { computed, type Slot, useSlots } from 'vue';
import DsIcon from '../DsIcon/DsIcon.vue';

export interface DsChipProps {
  /** Visual type. Default: 'default' */
  type?: 'default' | 'selected' | 'not-clickable';
  /** Chip size. Default: 'medium' */
  size?: 'small' | 'medium';
  /** Disabled state — equivalent to type='not-clickable'. Overrides `type` when true. Default: false */
  disabled?: boolean;
  /** Show X (Exit) close button + emit @remove on click/Enter/Space. Default: false */
  removable?: boolean;
  /** Accessible label for the X button. Default: 'Remove' */
  removeAriaLabel?: string;
  /** Chip text label (alternative to default slot — slot wins when both provided) */
  label?: string;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DsChipProps>(), {
  type: 'default',
  size: 'medium',
  disabled: false,
  removable: false,
  removeAriaLabel: 'Remove',
});

const emit = defineEmits<{
  remove: [];
}>();

const slots = useSlots();

const effectiveType = computed<'default' | 'selected' | 'not-clickable'>(() =>
  props.disabled ? 'not-clickable' : props.type,
);

const isInteractive = computed(() => effectiveType.value !== 'not-clickable');

const showRemoveButton = computed(() => props.removable && isInteractive.value);

function hasSlotContent(slotFn: Slot | undefined): boolean {
  if (!slotFn) return false;
  const nodes = slotFn() as Array<{ type?: symbol | string; children?: unknown }>;
  return nodes.some((n) => {
    if (typeof n.type === 'symbol') return false;
    if (typeof n.children === 'string') return n.children.trim().length > 0;
    return true;
  });
}

const hasLeading = computed(() => hasSlotContent(slots.leading));
const hasTrailing = computed(() => hasSlotContent(slots.trailing));
const hasDefault = computed(() => hasSlotContent(slots.default));

const chipClasses = computed(() => ({
  'ds-chip': true,
  [`ds-chip--${effectiveType.value}`]: true,
  [`ds-chip--${props.size}`]: true,
  'ds-chip--removable': showRemoveButton.value,
  'ds-chip--transitions': isInteractive.value,
}));

const chipAriaDisabled = computed(() => (isInteractive.value ? undefined : 'true'));

function onRemove() {
  if (!showRemoveButton.value) return;
  emit('remove');
}
</script>

<template>
  <Chip
    v-bind="$attrs"
    :class="chipClasses"
    :aria-disabled="chipAriaDisabled"
    tabindex="-1"
  >
    <span v-if="hasLeading" class="ds-chip__leading">
      <slot name="leading" />
    </span>
    <span class="ds-chip__label">
      <slot>{{ hasDefault ? '' : label }}</slot>
    </span>
    <button
      v-if="showRemoveButton"
      type="button"
      class="ds-chip__remove"
      :aria-label="removeAriaLabel"
      @click.stop="onRemove"
    >
      <DsIcon name="close" size="small" :style="{ width: '18px', height: '18px' }" />
    </button>
    <span v-else-if="hasTrailing" class="ds-chip__trailing">
      <slot name="trailing" />
    </span>
  </Chip>
</template>

<style scoped>
.ds-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 8px;
  box-sizing: border-box;
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: -0.2px;
  border: 1px solid transparent;
  background-color: transparent;
  padding: 0;
}

/* Size modifiers */
.ds-chip--medium {
  padding: 6px 8px;
}

.ds-chip--small {
  padding: 4px 8px;
}

/* Label span inherits per-type text color */
.ds-chip__label {
  color: inherit;
  display: inline-flex;
  align-items: center;
}

/* Leading / trailing icon wrappers inherit currentColor */
.ds-chip__leading,
.ds-chip__trailing {
  display: inline-flex;
  align-items: center;
  color: inherit;
}

/* ---- Type: Default ---- */
.ds-chip--default {
  background-color: var(--p-surface-0);
  color: var(--p-gray-900);
}

.ds-chip--default.ds-chip--medium {
  border-color: var(--p-gray-500);
}

.ds-chip--default.ds-chip--small {
  border-color: var(--p-gray-400);
}

.ds-chip--default.ds-chip--transitions:hover {
  background-color: var(--p-gray-100);
  border-color: var(--p-gray-500);
}

/* ---- Type: Selected ---- */
.ds-chip--selected {
  background-color: var(--p-surface-0);
  border-color: var(--p-purple-800);
  color: var(--p-purple-800);
}

.ds-chip--selected.ds-chip--transitions:hover {
  background-color: var(--p-purple-100);
  border-color: var(--p-purple-800);
}

/* ---- Type: Not clickable (includes disabled) ---- */
.ds-chip--not-clickable {
  color: var(--p-gray-900);
  pointer-events: none;
}

/* Figma node 2014:9924 — no border at M, so padding absorbs the 1px to keep total height at 26px */
.ds-chip--not-clickable.ds-chip--medium {
  background-color: var(--p-gray-300);
  border: none;
  padding: 6px 8px;
}

.ds-chip--not-clickable.ds-chip--small {
  background-color: var(--p-gray-100);
  border-color: var(--p-gray-200);
}

/* Transitions — only when interactive */
@media (prefers-reduced-motion: no-preference) {
  .ds-chip--transitions {
    transition: background-color 150ms ease, border-color 150ms ease;
  }
}

/* Remove button */
.ds-chip__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 0;
  padding: 0;
  margin: 0;
  cursor: pointer;
  color: inherit;
  border-radius: 50%;
  line-height: 0;
}

.ds-chip__remove:focus {
  outline: none;
}

.ds-chip__remove:focus-visible {
  outline: 2px solid var(--p-purple-800);
  outline-offset: 2px;
}
</style>
