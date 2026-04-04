<script setup lang="ts">
import InputText from 'primevue/inputtext';
import { computed, useId } from 'vue';
import DsIcon from '../DsIcon/DsIcon.vue';

export interface DsInputTextProps {
  /** Input size. Default: 'medium' */
  size?: 'small' | 'medium';
  /** Disabled state. Default: false */
  disabled?: boolean;
  /** Label text above the input */
  label?: string;
  /** Show mandatory asterisk after label. Default: false */
  mandatory?: boolean;
  /** Show "(Optional)" text after label. Default: false */
  optional?: boolean;
  /** Show info icon next to label. Default: false */
  info?: boolean;
  /** Hint/helper text below the input */
  hint?: string;
  /** Error message — triggers Alert visual state */
  error?: string;
  /** Show clear button when input has value. Default: false */
  clearable?: boolean;
  /** Show trailing dropdown arrow icon. Default: false */
  showDropdownIcon?: boolean;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DsInputTextProps>(), {
  size: 'medium',
  disabled: false,
  mandatory: false,
  optional: false,
  info: false,
  clearable: false,
  showDropdownIcon: false,
});

const model = defineModel<string>();

const emit = defineEmits<{
  clear: [];
}>();

const errorId = useId();
const inputId = useId();

const hasValue = computed(() => !!model.value);
const isError = computed(() => !!props.error);
const showError = computed(() => isError.value && !props.disabled);

const inputClasses = computed(() => ({
  'ds-input-text__input': true,
  [`ds-input-text__input--${props.size}`]: true,
  'ds-input-text__input--error': showError.value,
  'ds-input-text__input--disabled': props.disabled,
  'ds-input-text__input--transitions': !props.disabled,
}));

const sizeTokens = computed(() => {
  const map: Record<string, Record<string, string>> = {
    small: {
      paddingX: '0.75rem',
      paddingY: '0.375rem',
      fontSize: '0.875rem',
      borderRadius: '8px',
    },
    medium: {
      paddingX: '0.75rem',
      paddingY: '0.5rem',
      fontSize: '0.875rem',
      borderRadius: '8px',
    },
  };
  return map[props.size];
});

function handleClear() {
  model.value = '';
  emit('clear');
}
</script>

<template>
  <div
    class="ds-input-text"
    :class="[`ds-input-text--${size}`]"
  >
    <!-- Label section -->
    <label v-if="label" class="ds-input-text__label" :for="inputId">
      <span class="ds-input-text__label-text">{{ label }}</span>
      <span v-if="mandatory && !optional" class="ds-input-text__label-mandatory">*</span>
      <span v-if="optional && !mandatory" class="ds-input-text__label-optional">(Optional)</span>
      <span v-if="info" class="ds-input-text__label-info">
        <DsIcon name="help" :size="size === 'small' ? 'xsmall' : 'small'" />
      </span>
    </label>

    <!-- Input row -->
    <div :class="inputClasses">
      <!-- Leading icon slot -->
      <span v-if="$slots.leading" class="ds-input-text__leading">
        <slot name="leading" />
      </span>

      <!-- PrimeVue InputText -->
      <InputText
        v-bind="$attrs"
        :id="inputId"
        v-model="model"
        :disabled="disabled"
        :dt="sizeTokens"
        class="ds-input-text__native"
        :aria-disabled="disabled ? 'true' : undefined"
        :aria-describedby="showError ? errorId : undefined"
        :aria-invalid="showError ? 'true' : undefined"
      />

      <!-- Trailing elements -->
      <span v-if="clearable && hasValue && !disabled" class="ds-input-text__clear" role="button" tabindex="0" aria-label="Clear" @click="handleClear" @keydown.enter="handleClear" @keydown.space.prevent="handleClear">
        <DsIcon name="close" :size="size === 'small' ? 'small' : 'medium'" />
      </span>
      <span v-if="isError && !disabled" class="ds-input-text__error-icon" aria-hidden="true">
        <DsIcon name="error" :size="size === 'small' ? 'small' : 'medium'" />
      </span>
      <span v-if="showDropdownIcon && !isError" class="ds-input-text__dropdown" aria-hidden="true">
        <DsIcon name="arrow-down" :size="size === 'small' ? 'small' : 'medium'" />
      </span>
    </div>

    <!-- Hint / Error section -->
    <div v-if="hint || error" class="ds-input-text__footer">
      <div v-if="error && !disabled" class="ds-input-text__error-msg" :id="errorId">
        <span class="ds-input-text__error-msg-icon" aria-hidden="true">
          <DsIcon name="error" size="xsmall" />
        </span>
        <span>{{ error }}</span>
      </div>
      <div v-else-if="hint" class="ds-input-text__hint">
        {{ hint }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.ds-input-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

/* Label */
.ds-input-text__label {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-bottom: 2px;
}

.ds-input-text__label-text {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: -0.2px;
  color: var(--p-gray-900);
}

.ds-input-text__label-mandatory {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: -0.2px;
  color: var(--p-gray-900);
}

.ds-input-text__label-optional {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--p-gray-600);
  padding-left: 2px;
}

.ds-input-text__label-info {
  display: inline-flex;
  align-items: center;
  color: var(--p-gray-500);
}

/* Input row */
.ds-input-text__input {
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid var(--p-gray-400);
  border-radius: 8px;
  padding: 0 0.75rem;
  background-color: var(--p-surface-0, #fff);
  box-shadow: 0px 1px 2px 0px var(--p-gray-300);
  cursor: text;
}

.ds-input-text__input--small {
  height: 32px;
}

.ds-input-text__input--medium {
  height: 40px;
}

/* Native input reset — strip PrimeVue border/shadow so the wrapper controls them */
.ds-input-text__native {
  flex: 1;
  min-width: 0;
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  padding: 0 !important;
  outline: none !important;
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: -0.2px;
  color: var(--p-gray-800);
  height: 100%;
}

.ds-input-text__native::placeholder {
  color: var(--p-gray-600);
}

/* Hover state */
.ds-input-text__input--transitions:not(.ds-input-text__input--error):not(.ds-input-text__input--disabled):hover {
  border-color: var(--p-gray-600);
  background-color: var(--p-gray-100);
  box-shadow: none;
}

.ds-input-text__input--transitions:not(.ds-input-text__input--error):not(.ds-input-text__input--disabled):hover .ds-input-text__native::placeholder {
  color: var(--p-gray-500);
}

/* Focus state */
.ds-input-text__input:not(.ds-input-text__input--disabled):focus-within:not(.ds-input-text__input--error) {
  border-color: var(--p-purple-800);
  background-color: var(--p-surface-0, #fff);
  box-shadow: none;
}

/* Error state */
.ds-input-text__input--error {
  border-color: var(--p-red-700);
  box-shadow: none;
}

.ds-input-text__input--error:focus-within {
  box-shadow: 0px 0px 0px 3px var(--p-red-100);
}

/* Disabled state */
.ds-input-text__input--disabled {
  background-color: var(--p-gray-100);
  border-color: var(--p-gray-400);
  box-shadow: none;
  opacity: 0.5;
  pointer-events: none;
}

.ds-input-text__input--disabled .ds-input-text__native::placeholder {
  color: var(--p-gray-500);
}

/* Transitions */
.ds-input-text__input--transitions {
  transition: background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
}

/* Leading icon */
.ds-input-text__leading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--p-gray-600);
}

/* Trailing elements */
.ds-input-text__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  color: var(--p-gray-500);
  border-radius: 50%;
}

.ds-input-text__clear:hover {
  color: var(--p-gray-700);
}

.ds-input-text__error-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--p-red-700);
}

.ds-input-text__dropdown {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--p-gray-500);
}

/* Footer — Hint / Error message */
.ds-input-text__footer {
  min-height: 20px;
}

.ds-input-text__hint {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: -0.2px;
  color: var(--p-gray-600);
}

.ds-input-text__error-msg {
  display: flex;
  align-items: center;
  gap: 2px;
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--p-red-700);
}

.ds-input-text__error-msg-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--p-red-700);
}
</style>
