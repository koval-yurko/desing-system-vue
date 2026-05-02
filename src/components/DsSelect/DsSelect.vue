<script setup lang="ts">
import MultiSelect from 'primevue/multiselect';
import Select from 'primevue/select';
import { computed, ref, useId } from 'vue';
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
  /** Multi-selection mode. Default: false */
  multiple?: boolean;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DsSelectProps>(), {
  size: 'medium',
  disabled: false,
  mandatory: false,
  optional: false,
  info: false,
  multiple: false,
});

const model = defineModel<unknown>();
const emit = defineEmits<{ clear: [] }>();

const triggerId = useId();
const errorId = useId();
const isOpen = ref(false);

const hasValue = computed(
  () =>
    model.value != null &&
    (Array.isArray(model.value) ? model.value.length > 0 : model.value !== ''),
);
const showError = computed(() => !!props.error && !props.disabled);

const SelectImpl = computed(() => (props.multiple ? MultiSelect : Select));

const triggerClass = computed(() => ({
  'ds-select__trigger': true,
  [`ds-select__trigger--${props.size}`]: true,
  'ds-select__trigger--error': showError.value,
  'ds-select__trigger--filled': hasValue.value && !props.disabled,
  'ds-select__trigger--open': isOpen.value,
}));

const overlayClass = computed(() =>
  props.multiple ? 'ds-select-panel ds-select-panel--multi' : 'ds-select-panel',
);

function handleShow() {
  isOpen.value = true;
}

function handleHide() {
  isOpen.value = false;
}

function onClear() {
  emit('clear');
}
</script>

<template>
  <div class="ds-select" :class="[`ds-select--${size}`]">
    <!-- Label section -->
    <label v-if="label" class="ds-select__label" :for="triggerId">
      <span class="ds-select__label-text">{{ label }}</span>
      <span v-if="mandatory && !optional" class="ds-select__label-mandatory">*</span>
      <span v-if="optional && !mandatory" class="ds-select__label-optional">(Optional)</span>
      <span v-if="info" class="ds-select__label-info">
        <DsIcon name="help" :size="size === 'small' ? 'xsmall' : 'small'" />
      </span>
    </label>

    <component
      :is="SelectImpl"
      v-bind="$attrs"
      :id="triggerId"
      v-model="model"
      :disabled="disabled"
      :show-clear="hasValue && !disabled"
      :show-toggle-all="multiple ? false : undefined"
      :class="triggerClass"
      :aria-describedby="showError ? errorId : undefined"
      :aria-invalid="showError ? 'true' : undefined"
      :pt="{ overlay: { class: overlayClass } }"
      @show="handleShow"
      @hide="handleHide"
      @clear="onClear"
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
      <template #dropdownicon>
        <DsIcon
          name="arrow-down"
          :size="size === 'small' || hasValue ? 'medium' : 'large'"
        />
      </template>
      <template #clearicon>
        <DsIcon name="close" :size="size === 'small' ? 'medium' : 'large'" />
      </template>
      <template #filtericon>
        <DsIcon name="search" size="small" />
      </template>
    </component>

    <!-- Hint / Error section -->
    <div v-if="hint || error" class="ds-select__footer">
      <div v-if="error && !disabled" :id="errorId" class="ds-select__error-msg">
        <span class="ds-select__error-msg-icon" aria-hidden="true">
          <DsIcon name="error" size="xsmall" />
        </span>
        <span>{{ error }}</span>
      </div>
      <div v-else-if="hint" class="ds-select__hint">{{ hint }}</div>
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

/* Trigger — applied directly to PrimeVue Select / MultiSelect root */
.ds-select__trigger {
  display: flex !important;
  align-items: center;
  gap: 4px;
  width: 100%;
  border: 1px solid var(--p-gray-400) !important;
  border-radius: 8px !important;
  padding: 0 0.75rem !important;
  background: var(--p-surface-0, #fff) !important;
  box-shadow: 0px 1px 2px 0px var(--p-gray-300) !important;
  outline: none !important;
  min-height: unset !important;
  cursor: pointer;
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: -0.2px;
  color: var(--p-gray-800);
}

.ds-select__trigger--small {
  height: 32px;
}

.ds-select__trigger--medium {
  height: 40px;
}

/* Inner label — flex to fill remaining space, ellipsis on overflow */
:deep(.p-select-label),
:deep(.p-multiselect-label) {
  flex: 1 1 auto;
  min-width: 0;
  padding: 0 !important;
  color: var(--p-gray-800);
}

:deep(.p-select-label.p-placeholder),
:deep(.p-multiselect-label.p-placeholder) {
  color: var(--p-gray-600);
}

/* Hover (idle, not error / not disabled / not open) */
.ds-select__trigger:not(.ds-select__trigger--error):not(.p-disabled):not(.ds-select__trigger--open):hover {
  border-color: var(--p-gray-600) !important;
  background: var(--p-gray-100) !important;
  box-shadow: none !important;
}

.ds-select__trigger:not(.ds-select__trigger--error):not(.p-disabled):not(.ds-select__trigger--open):hover :deep(.p-select-label.p-placeholder),
.ds-select__trigger:not(.ds-select__trigger--error):not(.p-disabled):not(.ds-select__trigger--open):hover :deep(.p-multiselect-label.p-placeholder) {
  color: var(--p-gray-500);
}

/* Open / focus — keep base look */
.ds-select__trigger--open:not(.p-disabled):not(.ds-select__trigger--error) {
  border-color: var(--p-gray-400) !important;
  background: var(--p-surface-0, #fff) !important;
  box-shadow: 0px 1px 2px 0px var(--p-gray-300) !important;
}

/* Error */
.ds-select__trigger--error {
  border-color: var(--p-red-700) !important;
  box-shadow: none !important;
}

.ds-select__trigger--error.ds-select__trigger--open,
.ds-select__trigger--error:focus-within {
  box-shadow: 0px 0px 0px 3px var(--p-red-100) !important;
}

/* Disabled — PrimeVue adds .p-disabled when :disabled="true" */
.ds-select__trigger.p-disabled {
  background: var(--p-gray-100) !important;
  border-color: var(--p-gray-400) !important;
  box-shadow: none !important;
  pointer-events: none;
}

.ds-select__trigger.p-disabled :deep(.p-select-label),
.ds-select__trigger.p-disabled :deep(.p-multiselect-label) {
  color: var(--p-gray-500) !important;
}

/* Filled (idle, has value) */
.ds-select__trigger--filled:not(.ds-select__trigger--error):not(.ds-select__trigger--open) {
  box-shadow: none !important;
}

/* Transitions */
@media (prefers-reduced-motion: no-preference) {
  .ds-select__trigger {
    transition: background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
  }

  :deep(.p-select-dropdown),
  :deep(.p-multiselect-dropdown) {
    transition: transform 150ms ease;
  }
}

/* Chevron — rotate PrimeVue's dropdown wrap when open */
:deep(.p-select-dropdown),
:deep(.p-multiselect-dropdown) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--p-gray-500);
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  width: auto !important;
}

.ds-select__trigger--open :deep(.p-select-dropdown),
.ds-select__trigger--open :deep(.p-multiselect-dropdown) {
  transform: rotate(180deg);
}

/* Clear icon */
:deep(.p-select-clear-icon),
:deep(.p-multiselect-clear-icon) {
  color: var(--p-gray-500);
  cursor: pointer;
  flex-shrink: 0;
}

:deep(.p-select-clear-icon:hover),
:deep(.p-multiselect-clear-icon:hover) {
  color: var(--p-gray-700);
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
  background: #fff;
  border: 1px solid var(--p-gray-300);
  border-radius: 8px;
  box-shadow: 0px 1px 4px 0px #CAD5E280, 0px 1px 6px 0px #CAD5E240;
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
  background-color: #F6F7FA;
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

.ds-select-panel--two-line .p-select-option {
  padding: 6px 6px 6px 12px;
}

.ds-select-panel--two-line .p-select-option + .p-select-option {
  border-top: 1px solid var(--p-gray-200);
  border-radius: 0;
}

.ds-select-panel .p-select-empty-message {
  padding: 24px 4px;
  text-align: center;
  font-family: var(--font-family, 'Inter', sans-serif);
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--p-gray-600);
}

.ds-select-panel.p-select-overlay,
.ds-select-panel.p-multiselect-overlay {
  border: 1px solid var(--p-gray-300) !important;
  border-radius: 8px !important;
  box-shadow: 0px 1px 4px 0px #CAD5E280, 0px 1px 6px 0px #CAD5E240 !important;
}

/* PrimeVue v4 MultiSelect renders #header slot BEFORE the default filter header — flip order so
   filter → custom slot (e.g. Select all) → options matches Figma */
.ds-select-panel.p-multiselect-overlay {
  display: flex;
  flex-direction: column;
}

.ds-select-panel .p-multiselect-header {
  order: 1;
}

.ds-select-panel.p-multiselect-overlay > div:not(.p-multiselect-header):not(.p-multiselect-list-container) {
  order: 2;
}

.ds-select-panel .p-multiselect-list-container {
  order: 3;
}

/* Search bar section */
.ds-select-panel .p-select-header,
.ds-select-panel .p-multiselect-header {
  display: block;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid var(--p-gray-300);
}

/* Filter input */
.ds-select-panel .p-iconfield {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.ds-select-panel .p-select-filter,
.ds-select-panel .p-multiselect-filter {
  width: 100%;
  height: 32px;
  padding: 4px 8px 4px 32px;
  background: var(--p-gray-100, #f8fafc);
  border: 1px solid var(--p-gray-400);
  border-radius: 8px;
  font-family: var(--font-family, 'Inter', sans-serif);
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: -0.2px;
  color: var(--p-gray-800);
  outline: none;
  box-sizing: border-box;
}

.ds-select-panel .p-select-filter:focus,
.ds-select-panel .p-multiselect-filter:focus {
  border-color: var(--p-gray-800);
}

.ds-select-panel .p-select-filter::placeholder,
.ds-select-panel .p-multiselect-filter::placeholder {
  color: var(--p-gray-500);
}

.ds-select-panel .p-iconfield .p-inputicon {
  position: absolute;
  left: 8px;
  top: 50%;
  margin-top: 0;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: var(--p-gray-500);
  pointer-events: none;
}

.ds-select-panel .p-iconfield .p-inputicon .p-icon,
.ds-select-panel .p-iconfield .p-inputicon svg {
  width: 20px;
  height: 20px;
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

/* Multi-selection panel */
.ds-select-panel .p-multiselect-option {
  padding: 10px 10px 10px 12px;
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
  background-color: #F6F7FA;
}

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

.ds-select-panel .p-multiselect-header > .p-checkbox {
  display: none;
}

.ds-select-panel .p-multiselect-empty-message {
  padding: 24px 4px;
  text-align: center;
  font-family: var(--font-family, 'Inter', sans-serif);
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--p-gray-600);
}

/* Advanced option layout CSS classes (consumed by slot templates) */

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

.ds-select-panel--entity .p-multiselect-option {
  gap: 4px;
}

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

.ds-select-panel--badge .p-select-option,
.ds-select-panel--badge .p-multiselect-option {
  padding: 8px 8px 8px 12px;
}

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

.ds-select-panel--two-line-multi .p-multiselect-option {
  padding: 6px 10px 6px 12px;
}

.ds-select-panel--two-line-multi .p-multiselect-option + .p-multiselect-option {
  border-top: 1px solid var(--p-gray-200);
  border-radius: 0;
}

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

.ds-select-panel--vendor .p-select-option,
.ds-select-panel--vendor .p-multiselect-option {
  padding: 6px 10px 6px 12px;
}

.ds-select-panel--vendor .p-select-option + .p-select-option,
.ds-select-panel--vendor .p-multiselect-option + .p-multiselect-option {
  border-top: 1px solid var(--p-gray-200);
  border-radius: 0;
}

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

.ds-select-panel--mention {
  width: 409px;
}

.ds-select-panel--mention .p-select-option,
.ds-select-panel--mention .p-multiselect-option {
  padding: 6px 10px 6px 12px;
}

.ds-select-panel--mention .p-select-option + .p-select-option,
.ds-select-panel--mention .p-multiselect-option + .p-multiselect-option {
  border-top: 1px solid var(--p-gray-200);
  border-radius: 0;
}

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

.ds-select-panel--big-icon .p-select-option,
.ds-select-panel--big-icon .p-multiselect-option {
  padding: 6px 10px 6px 12px;
}

/* Select all header row (used via header slot) */
.ds-select-header-select-all {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 10px 12px;
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
