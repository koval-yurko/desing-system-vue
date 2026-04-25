<script setup lang="ts">
import InputOtp from 'primevue/inputotp';
import { computed, useAttrs, useId } from 'vue';
import DsIcon from '../DsIcon/DsIcon.vue';

export interface DsCodeInputProps {
  /** Label text above the cells. Associated via aria-labelledby (not <label for>). */
  label?: string;
  /** Helper text below the cells. Hidden when `error` is set. */
  hint?: string;
  /** Error message — triggers the Error cell state and renders below the cells with a red error icon. */
  error?: string;
  /** Disabled state. Applies muted cell styling and suppresses the error message. Default: false */
  disabled?: boolean;
  /** Number of code cells. Default: 4 */
  length?: number;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DsCodeInputProps>(), {
  disabled: false,
  length: 4,
});

const model = defineModel<string>();
const attrs = useAttrs();

const errorId = useId();
const labelId = useId();

// Treat whitespace-only strings as absent so the error icon / aria-invalid
// don't fire for `error="   "` and `aria-labelledby` doesn't point at an
// empty span.
const hasLabel = computed(() => !!props.label?.trim());
const hasHint = computed(() => !!props.hint?.trim());
const isError = computed(() => !!props.error?.trim());
const showError = computed(() => isError.value && !props.disabled);

const containerClasses = computed(() => ({
  'ds-code-input': true,
  'ds-code-input--error': showError.value,
  'ds-code-input--disabled': props.disabled,
  'ds-code-input--transitions': !props.disabled,
}));

// Build the PrimeVue pass-through object, merging consumer-supplied `pt`
// (via `$attrs`) with our own injections so `$attrs` forwarding (AC #10)
// still lets consumers customize PrimeVue internals.
//
// Injections owned by this wrapper:
//   1. `placeholder: ' '` on each cell input so `:placeholder-shown` can
//      discriminate empty vs filled cells in pure CSS (see <style>).
//   2. `aria-describedby` + `aria-invalid` on each cell input when the
//      error message is shown — `aria-describedby` does NOT inherit from
//      a `role="group"` ancestor to descendant inputs, so the description
//      must be on each cell for screen readers to announce it on focus.
const otpPassThrough = computed(() => {
  const consumer = (attrs.pt ?? {}) as Record<string, Record<string, unknown>>;
  const consumerCell = (consumer.pcInputText ?? {}) as Record<string, Record<string, unknown>>;
  const consumerCellRoot = (consumerCell.root ?? {}) as Record<string, unknown>;

  const cellRoot: Record<string, unknown> = {
    ...consumerCellRoot,
    placeholder: consumerCellRoot.placeholder ?? ' ',
  };

  if (showError.value) {
    cellRoot['aria-describedby'] = errorId;
    cellRoot['aria-invalid'] = 'true';
  }

  return {
    ...consumer,
    pcInputText: {
      ...consumerCell,
      root: cellRoot,
    },
  };
});
</script>

<template>
  <div
    :class="containerClasses"
    role="group"
    :aria-labelledby="hasLabel ? labelId : undefined"
    :aria-describedby="showError ? errorId : undefined"
    :aria-invalid="showError ? 'true' : undefined"
  >
    <span v-if="hasLabel" :id="labelId" class="ds-code-input__label">{{ label }}</span>

    <InputOtp
      v-bind="$attrs"
      v-model="model"
      :length="length"
      :disabled="disabled"
      :pt="otpPassThrough"
      class="ds-code-input__otp"
    />

    <div v-if="showError" :id="errorId" class="ds-code-input__error-msg">
      <span class="ds-code-input__error-msg-icon" aria-hidden="true">
        <DsIcon name="error" size="xsmall" />
      </span>
      <span>{{ error }}</span>
    </div>
    <div v-else-if="hasHint" class="ds-code-input__hint">{{ hint }}</div>
  </div>
</template>

<style scoped>
.ds-code-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: fit-content;
}

/* Label */
.ds-code-input__label {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: -0.2px;
  color: var(--p-gray-900);
  margin-bottom: 2px;
}

/* OTP row — strip PrimeVue defaults, enforce 16px gap */
.ds-code-input :deep(.p-inputotp) {
  display: inline-flex;
  gap: 16px;
  padding: 0;
  background: transparent;
}

/* Per-cell styles */
.ds-code-input :deep(.p-inputotp-input) {
  box-sizing: border-box;
  width: 43px;
  height: 58px;
  padding: 0;
  border-radius: 4px;
  border: 1.5px solid var(--p-gray-300);
  background-color: var(--p-gray-100);

  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 30px;
  line-height: 32px;
  letter-spacing: -0.2px;
  color: var(--p-gray-800);
  text-align: center;
  caret-color: var(--p-purple-600);

  outline: none;
  box-shadow: none;
}

/* The injected space placeholder must be invisible */
.ds-code-input :deep(.p-inputotp-input)::placeholder {
  color: transparent;
}

/* Hover — empty, not focused */
.ds-code-input--transitions :deep(.p-inputotp-input):placeholder-shown:hover:not(:focus) {
  background-color: var(--p-gray-200);
  border-color: var(--p-gray-800);
}

/* Focused — empty cell with keyboard focus */
.ds-code-input :deep(.p-inputotp-input):focus {
  background-color: var(--p-surface-0);
  border-color: var(--p-purple-600);
  box-shadow: 0 0 5px 0 rgba(120, 73, 255, 0.6);
}

/* Only show the purple glow for keyboard focus; suppress it for pointer focus */
.ds-code-input :deep(.p-inputotp-input):focus:not(:focus-visible) {
  box-shadow: none;
}

/* Input — cell has a value (placeholder no longer shown) */
.ds-code-input :deep(.p-inputotp-input):not(:placeholder-shown) {
  background-color: var(--p-surface-0);
  border-color: var(--p-purple-600);
  color: var(--p-purple-600);
}

/* Error — overrides Focused / Input */
.ds-code-input--error :deep(.p-inputotp-input),
.ds-code-input--error :deep(.p-inputotp-input):not(:placeholder-shown),
.ds-code-input--error :deep(.p-inputotp-input):focus {
  background-color: var(--p-red-50);
  border-color: var(--p-red-700);
  color: var(--p-gray-800);
  caret-color: var(--p-red-700);
  box-shadow: none;
}

.ds-code-input--error :deep(.p-inputotp-input):focus {
  box-shadow: 0 0 0 3px var(--p-red-100);
}

/* Suppress the error focus ring for pointer focus (keyboard focus only) */
.ds-code-input--error :deep(.p-inputotp-input):focus:not(:focus-visible) {
  box-shadow: none;
}

/* Disabled cursor lives on the container because cells have pointer-events:none
   (which would otherwise defeat `cursor: not-allowed` on the cells themselves). */
.ds-code-input--disabled {
  cursor: not-allowed;
}

/* Disabled — overrides everything; no pointer events, muted colors */
.ds-code-input--disabled :deep(.p-inputotp-input),
.ds-code-input--disabled :deep(.p-inputotp-input):not(:placeholder-shown),
.ds-code-input--disabled :deep(.p-inputotp-input):focus {
  background-color: var(--p-gray-100);
  border-color: var(--p-gray-300);
  color: var(--p-gray-500);
  box-shadow: none;
  pointer-events: none;
}

/* Transitions — gated on --transitions (skipped when disabled) */
@media (prefers-reduced-motion: no-preference) {
  .ds-code-input--transitions :deep(.p-inputotp-input) {
    transition:
      background-color 150ms ease,
      border-color 150ms ease,
      box-shadow 150ms ease,
      color 150ms ease;
  }
}

/* Footer — hint / error */
.ds-code-input__hint {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: -0.2px;
  color: var(--p-gray-600);
}

.ds-code-input__error-msg {
  display: flex;
  align-items: center;
  gap: 2px;
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--p-red-700);
}

.ds-code-input__error-msg-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--p-red-700);
}
</style>
