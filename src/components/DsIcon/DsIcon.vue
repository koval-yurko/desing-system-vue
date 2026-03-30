<script setup lang="ts">
import { computed } from 'vue';
import type { IconName } from './icon-names';
import { getIcon } from './icon-registry';

const props = withDefaults(
  defineProps<{
    name: IconName;
    size?: 'xsmall' | 'small' | 'medium' | 'large';
    ariaLabel?: string;
  }>(),
  {
    size: 'medium',
  },
);

const sizeMap = {
  xsmall: 12,
  small: 16,
  medium: 20,
  large: 24,
} as const;

const svgContent = computed(() => getIcon(props.name));
const dimension = computed(() => `${sizeMap[props.size]}px`);
const isDecorative = computed(() => !props.ariaLabel);
</script>

<template>
  <span
    v-if="svgContent"
    v-html="svgContent"
    :style="{ width: dimension, height: dimension, display: 'inline-flex' }"
    :role="isDecorative ? undefined : 'img'"
    :aria-label="ariaLabel || undefined"
    :aria-hidden="isDecorative ? 'true' : undefined"
  />
</template>

<style scoped>
span {
  color: currentColor;
  line-height: 0;
}

span :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
