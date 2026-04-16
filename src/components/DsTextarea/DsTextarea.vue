<script setup lang="ts">
import Textarea from 'primevue/textarea';
import { computed, ref, useId } from 'vue';
import DsIcon from '../DsIcon/DsIcon.vue';

export interface DsTextareaProps {
  /** Textarea size. Default: 'medium' */
  size?: 'small' | 'medium';
  /** Disabled state. Default: false — overrides Error */
  disabled?: boolean;
  /** Label text above the textarea */
  label?: string;
  /** Show mandatory asterisk after label. Default: false. Mutually exclusive with `optional` (neither renders if both true) */
  mandatory?: boolean;
  /** Show "(Optional)" text after label. Default: false. Mutually exclusive with `mandatory` */
  optional?: boolean;
  /** Show info/help icon next to label. Default: false */
  info?: boolean;
  /** Hint/helper text below the textarea */
  hint?: string;
  /** Error message — triggers Error visual state and aria-invalid */
  error?: string;
  /** Max character count — enables counter + overflow-triggered error state */
  maxLength?: number;
  /** Initial visible rows (passed to PrimeVue Textarea). Default: 3 */
  rows?: number;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DsTextareaProps>(), {
  size: 'medium',
  disabled: false,
  mandatory: false,
  optional: false,
  info: false,
  rows: 3,
});

const model = defineModel<string>();

const emit = defineEmits<{
  clear: [];
}>();

const errorId = useId();
const hintId = useId();
const inputId = useId();

const focused = ref(false);
const wrapperRef = ref<HTMLDivElement | null>(null);

const hasValue = computed(() => !!model.value);
const isError = computed(() => !!props.error);
const currentLength = computed(() => model.value?.length ?? 0);
const isOverflow = computed(() => props.maxLength != null && currentLength.value > props.maxLength);
const effectiveError = computed(() => (isError.value || isOverflow.value) && !props.disabled);
const showError = computed(() => isError.value && !props.disabled);

const wrapperClasses = computed(() => ({
  'ds-textarea__input': true,
  [`ds-textarea__input--${props.size}`]: true,
  'ds-textarea__input--error': effectiveError.value,
  'ds-textarea__input--disabled': props.disabled,
  'ds-textarea__input--filled': hasValue.value && !props.disabled,
  'ds-textarea__input--transitions': !props.disabled,
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

const showClearButton = computed(
  () => hasValue.value && !props.disabled && (focused.value || effectiveError.value),
);

const ariaDescribedby = computed(() => {
  if (showError.value) return errorId;
  if (props.hint && !props.disabled) return hintId;
  return undefined;
});

function handleClear() {
  model.value = '';
  emit('clear');
  wrapperRef.value?.querySelector('textarea')?.focus();
}

function handleFocusin() {
  focused.value = true;
}

function handleFocusout() {
  focused.value = false;
}
</script>

<template>
  <div
    class="ds-textarea"
    :class="[`ds-textarea--${size}`]"
  >
    <!-- Label section -->
    <label v-if="label" class="ds-textarea__label" :for="inputId">
      <span class="ds-textarea__label-text">{{ label }}</span>
      <span v-if="mandatory && !optional" class="ds-textarea__label-mandatory">*</span>
      <span v-if="optional && !mandatory" class="ds-textarea__label-optional">(Optional)</span>
      <span v-if="info" class="ds-textarea__label-info">
        <DsIcon name="help" :size="size === 'small' ? 'xsmall' : 'small'" />
      </span>
    </label>

    <!-- Textarea wrapper -->
    <div ref="wrapperRef" :class="wrapperClasses" @focusin="handleFocusin" @focusout="handleFocusout">
      <Textarea
        v-bind="$attrs"
        :id="inputId"
        v-model="model"
        :rows="rows"
        :disabled="disabled"
        :dt="sizeTokens"
        class="ds-textarea__native"
        :aria-describedby="ariaDescribedby"
        :aria-invalid="effectiveError ? 'true' : undefined"
        :aria-disabled="disabled ? 'true' : undefined"
      />

      <!-- Clear button -->
      <span
        v-if="showClearButton"
        class="ds-textarea__clear"
        role="button"
        tabindex="0"
        aria-label="Clear"
        @mousedown.prevent
        @click="handleClear"
        @keydown.enter.prevent="handleClear"
        @keydown.space.prevent="handleClear"
      >
        <DsIcon name="close" size="small" />
      </span>
    </div>

    <!-- Footer row -->
    <div v-if="hint || showError || maxLength != null" class="ds-textarea__footer">
      <div class="ds-textarea__footer-left">
        <div v-if="showError" class="ds-textarea__error-msg" :id="errorId">
          <span class="ds-textarea__error-msg-icon" aria-hidden="true">
            <DsIcon name="error" size="xsmall" />
          </span>
          <span>{{ error }}</span>
        </div>
        <div v-else-if="hint" class="ds-textarea__hint" :id="hintId">
          {{ hint }}
        </div>
      </div>
      <div v-if="maxLength != null" class="ds-textarea__counter">
        <span :class="{ 'ds-textarea__counter-over': isOverflow }">{{ currentLength }}</span><span>/{{ maxLength }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ds-textarea {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

/* Label */
.ds-textarea__label {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-bottom: 2px;
}

.ds-textarea__label-text {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: -0.2px;
  color: var(--p-gray-900);
}

.ds-textarea__label-mandatory {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: -0.2px;
  color: var(--p-gray-900);
}

.ds-textarea__label-optional {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--p-gray-600);
  padding-left: 2px;
}

.ds-textarea__label-info {
  display: inline-flex;
  align-items: center;
  color: var(--p-gray-500);
}

/* Textarea wrapper */
.ds-textarea__input {
  position: relative;
  display: flex;
  align-items: flex-start;
  border: 1px solid var(--p-gray-400);
  border-radius: 8px;
  padding: 8px 32px 8px 12px;
  background-color: var(--p-surface-0, #fff);
  box-shadow: 0px 1px 2px 0px var(--p-gray-300);
  overflow: hidden;
  cursor: text;
}

.ds-textarea__input--small {
  padding: 6px 32px 6px 12px;
}

.ds-textarea__input--medium {
  padding: 8px 32px 8px 12px;
}

/* Native textarea reset — strip PrimeVue border/shadow so the wrapper controls them */
.ds-textarea__native {
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
  resize: vertical;
  width: 100%;
}

.ds-textarea__native::placeholder {
  color: var(--p-gray-600);
}

/* Hover state — keeps shadow (unlike DsInputText) */
.ds-textarea__input--transitions:not(.ds-textarea__input--error):not(.ds-textarea__input--disabled):hover {
  border-color: var(--p-gray-600);
  background-color: var(--p-gray-100);
}

.ds-textarea__input--transitions:not(.ds-textarea__input--error):not(.ds-textarea__input--disabled):hover .ds-textarea__native::placeholder {
  color: var(--p-gray-500);
}

/* Focus state */
.ds-textarea__input:not(.ds-textarea__input--disabled):focus-within:not(.ds-textarea__input--error) {
  border-color: var(--p-purple-400);
  background-color: var(--p-surface-0, #fff);
  box-shadow: none;
}

/* Input-text state (focus-within + has value, not error) */
.ds-textarea__input--filled:not(.ds-textarea__input--error):not(.ds-textarea__input--disabled):focus-within {
  background-color: #fbfbfd; /* bw-01 */
}

/* Filled state (has value, idle) — no shadow */
.ds-textarea__input--filled:not(.ds-textarea__input--error):not(.ds-textarea__input--disabled) {
  box-shadow: none;
}

/* Filled-Hover — darker border than default hover */
.ds-textarea__input--filled.ds-textarea__input--transitions:not(.ds-textarea__input--error):not(.ds-textarea__input--disabled):hover {
  border-color: var(--p-gray-800);
  background-color: var(--p-gray-100);
}

/* Error state */
.ds-textarea__input--error {
  border-color: var(--p-red-700);
  box-shadow: none;
}

/* Error + focused: red ring */
.ds-textarea__input--error:focus-within {
  box-shadow: 0px 0px 0px 3px var(--p-red-100);
}

/* Disabled state */
.ds-textarea__input--disabled {
  background-color: var(--p-gray-100);
  border-color: var(--p-gray-400);
  box-shadow: none;
  pointer-events: none;
}

.ds-textarea__input--disabled .ds-textarea__native {
  color: var(--p-gray-500);
}

.ds-textarea__input--disabled .ds-textarea__native::placeholder {
  color: var(--p-gray-500);
}

/* Transitions */
@media (prefers-reduced-motion: no-preference) {
  .ds-textarea__input--transitions {
    transition: background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
  }
}

/* Clear button */
.ds-textarea__clear {
  position: absolute;
  top: 7px;
  right: 7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  cursor: pointer;
  color: var(--p-gray-500);
  border-radius: 50%;
}

.ds-textarea__clear:hover {
  color: var(--p-gray-700);
}

/* Footer */
.ds-textarea__footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  min-height: 20px;
}

.ds-textarea__footer-left {
  flex: 1;
}

.ds-textarea__hint {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: -0.2px;
  color: var(--p-gray-600);
}

.ds-textarea__error-msg {
  display: flex;
  align-items: center;
  gap: 2px;
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--p-red-700);
}

.ds-textarea__error-msg-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--p-red-700);
}

/* Counter */
.ds-textarea__counter {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--p-gray-600);
  white-space: nowrap;
}

.ds-textarea__counter-over {
  color: var(--p-red-700);
}
</style>
