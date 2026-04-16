<script setup lang="ts">
import MultiSelect from 'primevue/multiselect';
import Select from 'primevue/select';
import { type ComponentPublicInstance, computed, ref, useAttrs, useId } from 'vue';
import DsIcon from '../DsIcon/DsIcon.vue';

export interface DsSelectProps {
  /** Select trigger size. Default: 'medium' */
  size?: 'small' | 'medium';
  /** Disabled state. Default: false — overrides Error */
  disabled?: boolean;
  /** Label text above the select */
  label?: string;
  /** Show mandatory asterisk after label. Default: false. Mutually exclusive with `optional` */
  mandatory?: boolean;
  /** Show "(Optional)" text after label. Default: false. Mutually exclusive with `mandatory` */
  optional?: boolean;
  /** Show info/help icon next to label. Default: false */
  info?: boolean;
  /** Hint/helper text below the select */
  hint?: string;
  /** Error message — triggers Error visual state and aria-invalid */
  error?: string;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DsSelectProps>(), {
  size: 'medium',
  disabled: false,
  mandatory: false,
  optional: false,
  info: false,
});

const model = defineModel<unknown>();

const emit = defineEmits<{
  clear: [];
}>();

const attrs = useAttrs();
const isMultiple = computed(() => {
  if (!('multiple' in attrs)) return false;
  const val = attrs.multiple;
  return val !== false && val !== 'false' && val !== '' && val !== '0' && val !== 0;
});
const filteredAttrs = computed(() => {
  const { multiple: _multiple, ...rest } = attrs;
  return rest;
});

const triggerId = useId();
const errorId = useId();
const selectRef = ref<ComponentPublicInstance | null>(null);

const isOpen = ref(false);

const hasValue = computed(
  () =>
    model.value != null &&
    (Array.isArray(model.value) ? model.value.length > 0 : model.value !== ''),
);
const isError = computed(() => !!props.error);
const showError = computed(() => isError.value && !props.disabled);

const triggerClasses = computed(() => ({
  'ds-select__trigger': true,
  [`ds-select__trigger--${props.size}`]: true,
  'ds-select__trigger--error': showError.value,
  'ds-select__trigger--disabled': props.disabled,
  'ds-select__trigger--filled': hasValue.value && !props.disabled,
  'ds-select__trigger--open': isOpen.value,
  'ds-select__trigger--transitions': !props.disabled,
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
  model.value = Array.isArray(model.value) ? [] : undefined;
  emit('clear');
  if (isOpen.value) {
    (selectRef.value as ComponentPublicInstance & { hide: () => void })?.hide();
  }
}

function handleLabelClick() {
  const el = selectRef.value?.$el;
  if (el) {
    const focusTarget = el.querySelector('[tabindex], [role="combobox"]') || el;
    focusTarget.focus();
  }
}

function handleShow() {
  isOpen.value = true;
}

function handleHide() {
  isOpen.value = false;
}
</script>

<template>
  <div
    class="ds-select"
    :class="[`ds-select--${size}`]"
  >
    <!-- Label section -->
    <label v-if="label" class="ds-select__label" :for="triggerId" @click="handleLabelClick">
      <span class="ds-select__label-text">{{ label }}</span>
      <span v-if="mandatory && !optional" class="ds-select__label-mandatory">*</span>
      <span v-if="optional && !mandatory" class="ds-select__label-optional">(Optional)</span>
      <span v-if="info" class="ds-select__label-info">
        <DsIcon name="help" :size="size === 'small' ? 'xsmall' : 'small'" />
      </span>
    </label>

    <!-- Trigger wrapper -->
    <div :class="triggerClasses">
      <!-- Leading icon slot -->
      <span v-if="$slots.leading" class="ds-select__leading">
        <slot name="leading" />
      </span>

      <!-- PrimeVue MultiSelect (when multiple) -->
      <MultiSelect
        v-if="isMultiple"
        ref="selectRef"
        v-bind="filteredAttrs"
        :id="triggerId"
        v-model="model"
        :disabled="disabled"
        :show-clear="false"
        :show-toggle-all="false"
        display="comma"
        :dt="sizeTokens"
        class="ds-select__native"
        :aria-describedby="showError ? errorId : undefined"
        :aria-invalid="showError ? 'true' : undefined"
        :aria-disabled="disabled ? 'true' : undefined"
        :pt="{ overlay: { class: 'ds-select-panel ds-select-panel--multi' } }"
        @show="handleShow"
        @hide="handleHide"
      >
        <template v-if="$slots.option" #option="slotProps">
          <slot name="option" v-bind="slotProps" />
        </template>
        <template v-if="$slots.value" #value="slotProps">
          <slot name="value" v-bind="slotProps" />
        </template>
        <template v-if="$slots.header" #header="slotProps">
          <slot name="header" v-bind="slotProps" />
        </template>
        <template v-if="$slots.footer" #footer="slotProps">
          <slot name="footer" v-bind="slotProps" />
        </template>
      </MultiSelect>

      <!-- PrimeVue Select (single selection) -->
      <Select
        v-else
        ref="selectRef"
        v-bind="filteredAttrs"
        :id="triggerId"
        v-model="model"
        :disabled="disabled"
        :show-clear="false"
        :dt="sizeTokens"
        class="ds-select__native"
        :aria-describedby="showError ? errorId : undefined"
        :aria-invalid="showError ? 'true' : undefined"
        :aria-disabled="disabled ? 'true' : undefined"
        :pt="{ overlay: { class: 'ds-select-panel' } }"
        @show="handleShow"
        @hide="handleHide"
      >
        <template v-if="$slots.option" #option="slotProps">
          <slot name="option" v-bind="slotProps" />
        </template>
        <template v-if="$slots.value" #value="slotProps">
          <slot name="value" v-bind="slotProps" />
        </template>
        <template v-if="$slots.header" #header="slotProps">
          <slot name="header" v-bind="slotProps" />
        </template>
        <template v-if="$slots.footer" #footer="slotProps">
          <slot name="footer" v-bind="slotProps" />
        </template>
      </Select>

      <!-- Clear button -->
      <span
        v-if="hasValue && !disabled"
        class="ds-select__clear"
        role="button"
        tabindex="0"
        aria-label="Clear"
        @click.stop="handleClear"
        @keydown.enter.prevent="handleClear"
        @keydown.space.prevent="handleClear"
      >
        <DsIcon name="close" :size="size === 'small' ? 'medium' : 'large'" />
      </span>

      <!-- Chevron -->
      <span
        class="ds-select__chevron"
        :class="{ 'ds-select__chevron--open': isOpen }"
        aria-hidden="true"
      >
        <DsIcon name="arrow-down" :size="size === 'small' || hasValue ? 'medium' : 'large'" />
      </span>
    </div>

    <!-- Hint / Error section -->
    <div v-if="hint || error" class="ds-select__footer">
      <div v-if="error && !disabled" class="ds-select__error-msg" :id="errorId">
        <span class="ds-select__error-msg-icon" aria-hidden="true">
          <DsIcon name="error" size="xsmall" />
        </span>
        <span>{{ error }}</span>
      </div>
      <div v-else-if="hint" class="ds-select__hint">
        {{ hint }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.ds-select {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

/* Label */
.ds-select__label {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-bottom: 2px;
}

.ds-select__label-text {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: -0.2px;
  color: var(--p-gray-900);
}

.ds-select__label-mandatory {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: -0.2px;
  color: var(--p-gray-900);
}

.ds-select__label-optional {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--p-gray-600);
  padding-left: 2px;
}

.ds-select__label-info {
  display: inline-flex;
  align-items: center;
  color: var(--p-gray-500);
}

/* Trigger wrapper */
.ds-select__trigger {
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid var(--p-gray-400);
  border-radius: 8px;
  padding: 0 0.75rem;
  background-color: var(--p-surface-0, #fff);
  box-shadow: 0px 1px 2px 0px var(--p-gray-300);
  cursor: pointer;
}

.ds-select__trigger--small {
  height: 32px;
}

.ds-select__trigger--medium {
  height: 40px;
}

/* PrimeVue Select native reset — strip border/shadow/bg so wrapper owns them */
.ds-select__native {
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

/* Hide PrimeVue's native dropdown icon — DsSelect renders its own chevron */
:deep(.p-select-dropdown),
:deep(.p-multiselect-dropdown) {
  display: none !important;
}

/* Strip PrimeVue Select internal styles */
:deep(.p-select) {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  padding: 0 !important;
  outline: none !important;
  min-height: unset !important;
  height: 100% !important;
}

/* Strip PrimeVue MultiSelect internal styles */
:deep(.p-multiselect) {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  padding: 0 !important;
  outline: none !important;
  min-height: unset !important;
  height: 100% !important;
}

:deep(.p-select-label),
:deep(.p-multiselect-label) {
  padding: 0 !important;
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: -0.2px;
  color: var(--p-gray-800);
}

:deep(.p-select-label.p-placeholder),
:deep(.p-multiselect-label.p-placeholder) {
  color: var(--p-gray-600);
}

/* Hover state */
.ds-select__trigger--transitions:not(.ds-select__trigger--error):not(.ds-select__trigger--disabled):not(.ds-select__trigger--open):hover {
  border-color: var(--p-gray-600);
  background-color: var(--p-gray-100);
  box-shadow: none;
}

.ds-select__trigger--transitions:not(.ds-select__trigger--error):not(.ds-select__trigger--disabled):not(.ds-select__trigger--open):hover :deep(.p-select-label.p-placeholder),
.ds-select__trigger--transitions:not(.ds-select__trigger--error):not(.ds-select__trigger--disabled):not(.ds-select__trigger--open):hover :deep(.p-multiselect-label.p-placeholder) {
  color: var(--p-gray-500);
}

/* Filled-Hover state */
.ds-select__trigger--filled.ds-select__trigger--transitions:not(.ds-select__trigger--error):not(.ds-select__trigger--open):hover {
  border-color: var(--p-gray-600);
  background-color: var(--p-gray-100);
  box-shadow: none;
}

/* Focus state — keyboard focus ring (consistent with DsInputText) */
.ds-select__trigger:not(.ds-select__trigger--disabled):focus-within:not(.ds-select__trigger--error) {
  border-color: var(--p-purple-800);
  background-color: var(--p-surface-0, #fff);
  box-shadow: none;
}

/* Focus/Open state */
.ds-select__trigger--open:not(.ds-select__trigger--disabled):not(.ds-select__trigger--error) {
  border-color: var(--p-gray-400);
  background-color: var(--p-surface-0, #fff);
  box-shadow: 0px 1px 2px 0px var(--p-gray-300);
}

/* Error state — border always red */
.ds-select__trigger--error {
  border-color: var(--p-red-700);
  box-shadow: none;
}

/* Error + open: red ring */
.ds-select__trigger--error.ds-select__trigger--open {
  box-shadow: 0px 0px 0px 3px var(--p-red-100);
}

/* Error + focus-within: red ring (for keyboard focus) */
.ds-select__trigger--error:focus-within {
  box-shadow: 0px 0px 0px 3px var(--p-red-100);
}

/* Disabled state */
.ds-select__trigger--disabled {
  background-color: var(--p-gray-100);
  border-color: var(--p-gray-400);
  box-shadow: none;
  pointer-events: none;
}

.ds-select__trigger--disabled :deep(.p-select-label),
.ds-select__trigger--disabled :deep(.p-multiselect-label) {
  color: var(--p-gray-500);
}

.ds-select__trigger--disabled :deep(.p-select-label.p-placeholder),
.ds-select__trigger--disabled :deep(.p-multiselect-label.p-placeholder) {
  color: var(--p-gray-500);
}

/* Filled state (has value, idle) — no shadow */
.ds-select__trigger--filled:not(.ds-select__trigger--error):not(.ds-select__trigger--disabled):not(.ds-select__trigger--open) {
  box-shadow: none;
}

/* Transitions */
@media (prefers-reduced-motion: no-preference) {
  .ds-select__trigger--transitions {
    transition: background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
  }

  .ds-select__chevron {
    transition: transform 150ms ease;
  }
}

/* Leading icon */
.ds-select__leading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--p-gray-600);
}

.ds-select__trigger--disabled .ds-select__leading {
  color: var(--p-gray-500);
}

/* Clear button */
.ds-select__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  color: var(--p-gray-500);
  border-radius: 50%;
}

.ds-select__clear:hover {
  color: var(--p-gray-700);
}

/* Chevron */
.ds-select__chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--p-gray-500);
}

.ds-select__chevron--open {
  transform: rotate(180deg);
}

/* Footer — Hint / Error message */
.ds-select__footer {
  min-height: 20px;
}

.ds-select__hint {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: -0.2px;
  color: var(--p-gray-600);
}

.ds-select__error-msg {
  display: flex;
  align-items: center;
  gap: 2px;
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--p-red-700);
}

.ds-select__error-msg-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--p-red-700);
}

</style>

<!-- Non-scoped styles for PrimeVue teleported overlay panel -->
<style>
.ds-select-panel {
  background: #fff; /* surface-0 */
  border: 1px solid var(--p-gray-300);
  border-radius: 8px;
  box-shadow: 0px 1px 4px 0px #CAD5E280, 0px 1px 6px 0px #CAD5E240; /* shadow-sm: gray-300/50%, gray-300/25% */
  padding: 4px;
  overflow-y: auto;
}

/* Scrollbar styling */
.ds-select-panel::-webkit-scrollbar {
  width: 4px;
}

.ds-select-panel::-webkit-scrollbar-thumb {
  background-color: var(--p-gray-400);
  border-radius: 100px;
}

/* One-line option items */
.ds-select-panel .p-select-option {
  padding: 8px 8px 8px 12px;
  border-radius: 4px;
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: -0.2px;
  color: var(--p-gray-800);
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 2px 0;
}

.ds-select-panel .p-select-option:hover,
.ds-select-panel .p-select-option.p-focus {
  background-color: #F6F7FA; /* BW-02 */
}

/* Two-line option items */
.ds-select-two-line {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ds-select-two-line__title {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--p-gray-800);
}

.ds-select-two-line__subtitle {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--p-gray-600);
}

/* Two-line item padding override — Figma uses tighter right/vertical padding */
.ds-select-panel--two-line .p-select-option {
  padding: 6px 6px 6px 12px;
}

/* Two-line item dividers — applied when options contain two-line layout */
.ds-select-panel--two-line .p-select-option + .p-select-option {
  border-top: 1px solid var(--p-gray-200);
  border-radius: 0;
}

/* Empty / no-match state */
.ds-select-panel .p-select-empty-message {
  padding: 24px 4px;
  text-align: center;
  font-family: var(--font-family, 'Inter', sans-serif);
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--p-gray-600);
}

/* Strip PrimeVue overlay default styles */
.ds-select-panel.p-select-overlay,
.ds-select-panel.p-multiselect-overlay {
  border: 1px solid var(--p-gray-300) !important;
  border-radius: 8px !important;
  box-shadow: 0px 1px 4px 0px #CAD5E280, 0px 1px 6px 0px #CAD5E240 !important;
}

/* Option list wrapper */
.ds-select-panel .p-select-list-container,
.ds-select-panel .p-multiselect-list-container {
  max-height: 240px;
  overflow-y: auto;
}

.ds-select-panel .p-select-list-container::-webkit-scrollbar,
.ds-select-panel .p-multiselect-list-container::-webkit-scrollbar {
  width: 4px;
}

.ds-select-panel .p-select-list-container::-webkit-scrollbar-thumb,
.ds-select-panel .p-multiselect-list-container::-webkit-scrollbar-thumb {
  background-color: var(--p-gray-400);
  border-radius: 100px;
}

/* ==========================================
   Multi-selection panel (.ds-select-panel--multi)
   ========================================== */

/* MultiSelect option items — same base as Select options */
.ds-select-panel .p-multiselect-option {
  padding: 4px 6px 4px 8px;
  border-radius: 4px;
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: -0.2px;
  color: var(--p-gray-800);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 2px 0;
}

.ds-select-panel .p-multiselect-option:hover,
.ds-select-panel .p-multiselect-option.p-focus {
  background-color: #F6F7FA; /* BW-02 */
}

/* Checkbox styling inside multi-select options — Figma spec */
.ds-select-panel .p-checkbox {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.ds-select-panel .p-checkbox .p-checkbox-box {
  width: 16px;
  height: 16px;
  border: 1px solid var(--p-gray-600);
  border-radius: 4px;
  background: #fff;
  box-shadow: 0px 1px 2px 0px var(--p-gray-300);
}

.ds-select-panel .p-checkbox-checked .p-checkbox-box {
  background: var(--p-purple-800);
  border-color: var(--p-purple-800);
}

/* Hide MultiSelect native toggle-all header checkbox (we use custom header slot) */
.ds-select-panel .p-multiselect-header {
  display: none;
}

/* Empty state for MultiSelect */
.ds-select-panel .p-multiselect-empty-message {
  padding: 24px 4px;
  text-align: center;
  font-family: var(--font-family, 'Inter', sans-serif);
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--p-gray-600);
}

/* ==========================================
   Advanced option layout CSS classes
   Used by consumers in PrimeVue slot templates
   ========================================== */

/* --- Entity icons variant (AC #3) --- */
.ds-select-option-entity {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ds-select-option-entity__icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  overflow: hidden;
}

/* Entity icons panel — tighter gap between checkbox, icon, and label (Figma: 4px) */
.ds-select-panel--entity .p-multiselect-option {
  gap: 4px;
}

/* --- Badge / Dot indicator variant (AC #4) --- */
.ds-select-option-badge {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ds-select-option-badge__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ds-select-option-badge__label {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--p-gray-900);
}

/* Badge panel — no checkboxes, standard padding */
.ds-select-panel--badge .p-select-option,
.ds-select-panel--badge .p-multiselect-option {
  padding: 8px 8px 8px 12px;
}

/* --- Two-line multi-selection variant (AC #5) --- */
.ds-select-option-two-line-multi {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ds-select-option-two-line-multi__title {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--p-gray-800);
}

.ds-select-option-two-line-multi__subtitle {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--p-gray-600);
}

/* Two-line multi-select panel — dividers and adjusted padding */
.ds-select-panel--two-line-multi .p-multiselect-option {
  padding: 6px 6px 6px 12px;
}

.ds-select-panel--two-line-multi .p-multiselect-option + .p-multiselect-option {
  border-top: 1px solid var(--p-gray-200);
  border-radius: 0;
}

/* --- Vendor variant (AC #6) --- */
.ds-select-option-vendor {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ds-select-option-vendor__avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 600;
  font-size: 0.5rem;
  line-height: 1;
  color: #fff;
}

.ds-select-option-vendor__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.ds-select-option-vendor__name {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--p-gray-800);
}

.ds-select-option-vendor__email {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--p-gray-600);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Vendor panel — dividers and adjusted padding, no checkboxes */
.ds-select-panel--vendor .p-select-option,
.ds-select-panel--vendor .p-multiselect-option {
  padding: 6px 6px 6px 12px;
}

.ds-select-panel--vendor .p-select-option + .p-select-option,
.ds-select-panel--vendor .p-multiselect-option + .p-multiselect-option {
  border-top: 1px solid var(--p-gray-200);
  border-radius: 0;
}

/* --- Mention variant (AC #7) --- */
.ds-select-option-mention {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ds-select-option-mention__icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  overflow: hidden;
}

.ds-select-option-mention__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.ds-select-option-mention__name {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--p-gray-800);
}

.ds-select-option-mention__subtitle {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--p-gray-600);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ds-select-option-mention__section-header {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--p-gray-800);
  padding: 8px 16px 2px;
}

.ds-select-option-mention__more {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--p-gray-800);
}

.ds-select-option-mention__more-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Mention panel — wider, dividers within groups, group borders */
.ds-select-panel--mention {
  width: 409px;
}

.ds-select-panel--mention .p-select-option,
.ds-select-panel--mention .p-multiselect-option {
  padding: 6px 6px 6px 12px;
}

.ds-select-panel--mention .p-select-option + .p-select-option,
.ds-select-panel--mention .p-multiselect-option + .p-multiselect-option {
  border-top: 1px solid var(--p-gray-200);
  border-radius: 0;
}

/* --- Big icon variant (AC #8) --- */
.ds-select-option-big-icon {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ds-select-option-big-icon__container {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--p-gray-100);
  border: 1px solid var(--p-gray-300);
  border-radius: 4px;
}

.ds-select-option-big-icon__label {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--p-gray-800);
}

/* Big icon panel — adjusted padding */
.ds-select-panel--big-icon .p-select-option,
.ds-select-panel--big-icon .p-multiselect-option {
  padding: 6px 8px 6px 12px;
}

/* ==========================================
   Select all header row (used via header slot)
   ========================================== */
.ds-select-header-select-all {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 8px;
  border-bottom: 1px solid var(--p-gray-200);
}

.ds-select-header-select-all__checkbox {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  appearance: none;
  -webkit-appearance: none;
  border: 1px solid var(--p-gray-600);
  border-radius: 4px;
  background: #fff;
  box-shadow: 0px 1px 2px 0px var(--p-gray-300);
  cursor: pointer;
  position: relative;
}

.ds-select-header-select-all__checkbox:checked {
  background: var(--p-purple-800);
  border-color: var(--p-purple-800);
}

.ds-select-header-select-all__label {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--p-gray-800);
  flex: 1;
}

.ds-select-header-select-all__counter {
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--p-gray-600);
}
</style>
