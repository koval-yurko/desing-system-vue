<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue';
import DsIcon from '../DsIcon/DsIcon.vue';

export type DsSearchFieldSize = 'xxsmall' | 'xsmall' | 'small' | 'medium';
export type DsSearchFieldClearBehavior = 'auto' | 'always' | 'never';

export interface DsSearchFieldProps {
  /** Size tier. Default: 'medium' */
  size?: DsSearchFieldSize;
  /** Placeholder text. Default: 'Search' */
  placeholder?: string;
  /** Disabled state. Default: false */
  disabled?: boolean;
  /** Controls visibility of the clear (X) button. Default: 'auto' (only when input has content). */
  clear?: DsSearchFieldClearBehavior;
  /**
   * Show leading search icon. Default: true at XS/S/M; false at XXS (overridable).
   * XXS's built-in search icon is OPT-IN per Figma spec (UX-DR2).
   */
  searchIcon?: boolean;
  /** Show trailing filter/help button. Default: false */
  helpIcon?: boolean;
  /** Accessible label for the search input. Default: 'Search' */
  ariaLabel?: string;
  /** Accessible label for the clear button. Default: 'Clear search' */
  clearAriaLabel?: string;
  /** Accessible label for the help button. Default: 'Search options' */
  helpAriaLabel?: string;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DsSearchFieldProps>(), {
  size: 'medium',
  placeholder: 'Search',
  disabled: false,
  clear: 'auto',
  searchIcon: undefined,
  helpIcon: false,
  ariaLabel: 'Search',
  clearAriaLabel: 'Clear search',
  helpAriaLabel: 'Search options',
});

const model = defineModel<string>({ default: '' });

const emit = defineEmits<{
  search: [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  clear: [];
  help: [];
}>();

const slots = useSlots();

const isFocused = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

const resolvedSearchIcon = computed(() => props.searchIcon ?? props.size !== 'xxsmall');

/** Empty string, null, undefined all count as "no content". Whitespace counts as content (intentional). */
const hasValue = computed(() => !!model.value);

const showClearButton = computed(
  () => !props.disabled && (props.clear === 'always' || (props.clear === 'auto' && hasValue.value)),
);

/** Help button shows when helpIcon prop OR #helpIcon slot is provided, and field is not disabled. */
const showHelpButton = computed(() => !props.disabled && (props.helpIcon || !!slots.helpIcon));

const stateClass = computed(() => {
  if (props.disabled) return 'ds-search-field--disabled';
  if (hasValue.value) return 'ds-search-field--input-text';
  if (isFocused.value) return 'ds-search-field--focused';
  return 'ds-search-field--default';
});

const rootClasses = computed(() => ({
  'ds-search-field': true,
  [`ds-search-field--${props.size}`]: true,
  [stateClass.value]: true,
  'ds-search-field--has-help': showHelpButton.value,
}));

// Reset isFocused when disabled is toggled on — browsers don't always fire blur
// on programmatic disable, which would leave the Focused state class stuck.
watch(
  () => props.disabled,
  (d) => {
    if (d) isFocused.value = false;
  },
);

function onInputFocus(e: FocusEvent) {
  isFocused.value = true;
  emit('focus', e);
}

function onInputBlur(e: FocusEvent) {
  isFocused.value = false;
  emit('blur', e);
}

function onEnter(e: KeyboardEvent) {
  // Skip Enter that confirms an IME composition (Japanese/Chinese/Korean input)
  // — firing @search mid-composition swallows the candidate and ruins UX.
  if (e.isComposing) return;
  e.preventDefault();
  emit('search', model.value ?? '');
}

function onEscape(e: KeyboardEvent) {
  // Honor clear="never" — Escape must not silently violate the contract.
  if (props.clear === 'never' || !hasValue.value) return;
  // Consume the event so it doesn't bubble to a parent <dialog>/modal listener.
  e.stopPropagation();
  e.preventDefault();
  model.value = '';
  emit('clear');
}

function onClearClick() {
  model.value = '';
  emit('clear');
  inputRef.value?.focus();
}

function onHelpClick() {
  emit('help');
}
</script>

<template>
  <div v-bind="$attrs" :class="rootClasses">
    <span
      v-if="resolvedSearchIcon"
      class="ds-search-field__search-icon"
      aria-hidden="true"
    >
      <DsIcon
        name="search"
        :size="size === 'xxsmall' ? 'small' : 'medium'"
        :style="
          size === 'xxsmall'
            ? { width: '18px', height: '18px' }
            : { width: '20px', height: '20px' }
        "
      />
    </span>
    <input
      ref="inputRef"
      v-model="model"
      type="search"
      class="ds-search-field__input"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-label="ariaLabel"
      :aria-disabled="disabled ? 'true' : undefined"
      @focus="onInputFocus"
      @blur="onInputBlur"
      @keydown.enter="onEnter"
      @keydown.esc="onEscape"
    />
    <button
      v-if="showClearButton"
      type="button"
      class="ds-search-field__clear"
      :aria-label="clearAriaLabel"
      @click="onClearClick"
      @keydown.enter.prevent="onClearClick"
      @keydown.space.prevent="onClearClick"
    >
      <span aria-hidden="true" class="ds-search-field__clear-icon">
        <DsIcon
          name="exit"
          size="small"
          :style="{ width: '24px', height: '24px' }"
        />
      </span>
    </button>
    <button
      v-if="showHelpButton"
      type="button"
      class="ds-search-field__help"
      :aria-label="helpAriaLabel"
      :title="helpAriaLabel"
      @click="onHelpClick"
      @keydown.enter.prevent="onHelpClick"
      @keydown.space.prevent="onHelpClick"
    >
      <span aria-hidden="true" class="ds-search-field__help-icon">
        <slot name="helpIcon">
          <DsIcon
            name="filter-a"
            size="medium"
            :style="{ width: '20px', height: '20px' }"
          />
        </slot>
      </span>
    </button>
  </div>
</template>

<style scoped>
.ds-search-field {
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  gap: 4px; /* Figma node 2:44972 — uniform 4px gap across all sizes */
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: text;
  font-family: var(--font-family, 'Inter', sans-serif);
  width: 100%;
}

/* Size modifiers — values verified against Figma node 2:44972 (literal padding) */
.ds-search-field--xxsmall {
  height: 28px;
  /* Figma: pl-12 pr-8 py-10 (asymmetric) */
  padding: 10px 8px 10px 12px;
}
.ds-search-field--xsmall {
  height: 32px;
  /* Figma: px-8 py-4 */
  padding: 4px 8px;
}
.ds-search-field--small {
  height: 36px;
  /* Figma: px-8 py-6 */
  padding: 6px 8px;
}
.ds-search-field--medium {
  height: 40px;
  /* Figma: p-8 */
  padding: 8px;
}

/* Native <input type="search"> reset — mirrors DsInputText.vue:219–235 */
.ds-search-field__input {
  flex: 1 1 0;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  margin: 0;
  font-family: inherit;
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: -0.2px;
  color: inherit;
  appearance: none;
}
.ds-search-field__input::-webkit-search-decoration,
.ds-search-field__input::-webkit-search-cancel-button,
.ds-search-field__input::-webkit-search-results-button,
.ds-search-field__input::-webkit-search-results-decoration {
  appearance: none;
  display: none;
}
.ds-search-field__input::placeholder {
  color: inherit;
  opacity: 1;
}
.ds-search-field__input:disabled {
  cursor: not-allowed;
}

/* State modifiers — tokens verified against Figma node 2:44972 */
.ds-search-field--default {
  background-color: var(--p-gray-100); /* #f8fafc */
  border-color: var(--p-gray-400); /* #cad5e2 */
  color: var(--p-gray-600); /* #62748e — affects search icon + placeholder */
}
/* Hover applies only to idle (Default) state, not Focused/Input-text */
.ds-search-field--default:hover {
  background-color: var(--p-gray-200); /* #f1f5f9 */
  border-color: var(--p-gray-800); /* #314158 */
  color: var(--p-gray-800);
}
/* On hover, Figma keeps placeholder at gray-600 (unchanged from Default) */
.ds-search-field--default:hover .ds-search-field__input::placeholder {
  color: var(--p-gray-600);
}
.ds-search-field--focused {
  background-color: var(--p-gray-100);
  border-color: var(--p-gray-800);
  color: var(--p-gray-800); /* search icon gray-800 */
}
/* Figma: focused placeholder is lighter (gray-500) */
.ds-search-field--focused .ds-search-field__input::placeholder {
  color: var(--p-gray-500);
}
.ds-search-field--input-text {
  background-color: var(--p-gray-100);
  border-color: var(--p-gray-800);
  color: var(--p-gray-800);
}
.ds-search-field--disabled {
  background-color: var(--p-gray-100);
  border-color: var(--p-gray-300);
  color: var(--p-gray-500);
  cursor: not-allowed;
  pointer-events: none;
}
.ds-search-field--disabled .ds-search-field__input::placeholder {
  color: var(--p-gray-500);
}

/* Transitions — motion-safe only */
@media (prefers-reduced-motion: no-preference) {
  .ds-search-field:not(.ds-search-field--disabled) {
    transition:
      background-color 150ms ease,
      border-color 150ms ease,
      color 150ms ease;
  }
}

/* Icon wrappers (all decorative — aria-hidden). Inherit color from the state class. */
.ds-search-field__search-icon,
.ds-search-field__clear-icon,
.ds-search-field__help-icon {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  color: inherit;
  line-height: 0;
}

/* Clear + help buttons */
.ds-search-field__clear,
.ds-search-field__help {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  background: transparent;
  border: 0;
  padding: 0;
  margin: 0;
  color: inherit;
  cursor: pointer;
  border-radius: 4px; /* Figma help-button uses rounded-md (4px); clear button matches */
  line-height: 0;
}
.ds-search-field__clear:hover,
.ds-search-field__help:hover {
  color: var(--p-gray-800);
}
.ds-search-field__clear:focus,
.ds-search-field__help:focus {
  outline: none;
}
.ds-search-field__clear:focus-visible,
.ds-search-field__help:focus-visible {
  outline: 2px solid var(--p-purple-800);
  outline-offset: 2px;
}
</style>
