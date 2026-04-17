<script setup lang="ts">
import Avatar from 'primevue/avatar';
import { computed, ref, watch } from 'vue';
import DsIcon from '../DsIcon/DsIcon.vue';

export type DsAvatarVariant = 'initials-colored' | 'initials-monochrome' | 'icon' | 'image';
export type DsAvatarSize = 'large' | 'medium' | 'small' | 'xsmall';
export type DsAvatarColor =
  | 'blue'
  | 'light-purple'
  | 'yellow'
  | 'pink'
  | 'purple'
  | 'deep-blue'
  | 'turquoise'
  | 'orange'
  | 'red';

export interface DsAvatarProps {
  /** Visual variant. If omitted, auto-derived from image/initials/color props. */
  variant?: DsAvatarVariant;
  /** Avatar size. Default: 'medium' */
  size?: DsAvatarSize;
  /** Color palette for initials-colored variant. Default: 'blue' when variant resolves to 'initials-colored'. */
  color?: DsAvatarColor;
  /** Initials text (1–3 chars recommended; no truncation performed). */
  initials?: string;
  /** Image URL. Triggers image variant. Falls back to initials/icon on load error. */
  image?: string;
  /** Alt text for the image (also used as root aria-label when set). */
  alt?: string;
  /** Explicit aria-label override (takes precedence over alt and initials). */
  ariaLabel?: string;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DsAvatarProps>(), {
  size: 'medium',
});

const emit = defineEmits<{
  error: [event: Event];
  load: [event: Event];
}>();

const imageFailed = ref(false);

// Reset the failure flag whenever the consumer swaps the image URL so the new
// URL gets a fresh attempt instead of staying in the fallback state forever.
watch(
  () => props.image,
  () => {
    imageFailed.value = false;
  },
);

function onImageError(event: Event) {
  imageFailed.value = true;
  emit('error', event);
}

function onImageLoad(event: Event) {
  imageFailed.value = false;
  emit('load', event);
}

const resolvedVariant = computed<DsAvatarVariant>(() => {
  // An explicit variant is honoured only when its required content is
  // available. Without the content, fall through the auto-derivation chain so
  // a blank circle is never rendered (e.g., variant="image" with no image URL,
  // or variant="initials-*" with no initials).
  if (props.variant === 'image' && props.image && !imageFailed.value) return 'image';
  if (props.variant === 'initials-colored' && props.initials) return 'initials-colored';
  if (props.variant === 'initials-monochrome' && props.initials) return 'initials-monochrome';
  if (props.variant === 'icon') return 'icon';

  if (props.image && !imageFailed.value) return 'image';
  if (props.initials && props.color) return 'initials-colored';
  if (props.initials) return 'initials-monochrome';
  return 'icon';
});

const resolvedColor = computed<DsAvatarColor | undefined>(() => {
  if (resolvedVariant.value !== 'initials-colored') return undefined;
  return props.color ?? 'blue';
});

const resolvedAriaLabel = computed<string>(() => {
  // Nullish coalescing would pass through empty strings, leaving the avatar
  // silently unlabeled. Treat empty / whitespace-only values as absent.
  const pick = (value: string | undefined): string | undefined => {
    if (value == null) return undefined;
    const trimmed = value.trim();
    return trimmed.length > 0 ? value : undefined;
  };
  return pick(props.ariaLabel) ?? pick(props.alt) ?? pick(props.initials) ?? 'User avatar';
});

const avatarClasses = computed(() => ({
  'ds-avatar': true,
  [`ds-avatar--${resolvedVariant.value}`]: true,
  [`ds-avatar--${props.size}`]: true,
  [`ds-avatar--${resolvedColor.value}`]: resolvedColor.value != null,
}));

// Figma icon sizes per avatar size (verified against node 4544:29416 and siblings).
// DsIcon is SVG-based, so width/height drive the rendered size (no fontSize needed).
const iconStyle = computed(() => {
  switch (props.size) {
    case 'large':
    case 'medium':
      return { width: '24px', height: '24px' };
    case 'small':
      return { width: '20px', height: '20px' };
    case 'xsmall':
      return { width: '14px', height: '14px' };
    default: {
      const _exhaustive: never = props.size;
      return _exhaustive;
    }
  }
});

// DsIcon's closest preset size for the inline-style override above.
const iconPresetSize = computed(() => {
  switch (props.size) {
    case 'large':
    case 'medium':
      return 'medium' as const;
    case 'small':
      return 'small' as const;
    case 'xsmall':
      return 'xsmall' as const;
    default: {
      const _exhaustive: never = props.size;
      return _exhaustive;
    }
  }
});
</script>

<template>
  <Avatar
    v-bind="$attrs"
    :class="avatarClasses"
    shape="circle"
    role="img"
    :aria-label="resolvedAriaLabel"
    tabindex="-1"
  >
    <img
      v-if="resolvedVariant === 'image' && image"
      :key="image"
      class="ds-avatar__image"
      :src="image"
      alt=""
      @error="onImageError"
      @load="onImageLoad"
    />
    <span
      v-else-if="resolvedVariant === 'initials-colored' || resolvedVariant === 'initials-monochrome'"
      class="ds-avatar__initials"
      aria-hidden="true"
    >
      {{ initials }}
    </span>
    <DsIcon
      v-else
      name="personal"
      class="ds-avatar__icon"
      :size="iconPresetSize"
      :style="iconStyle"
      aria-hidden="true"
    />
  </Avatar>
</template>

<style scoped>
.ds-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  box-sizing: border-box;
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 600;
  line-height: 1;
}

/* Strip PrimeVue Avatar internal styling — the wrapper owns all visual properties */
.ds-avatar:deep(.p-avatar) {
  background: transparent;
  padding: 0;
  border-radius: 50%;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
}

/* Size modifiers — width/height of the circle + initials typography */
.ds-avatar--large {
  width: 40px;
  height: 40px;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.2px;
}

.ds-avatar--medium {
  width: 34px;
  height: 34px;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.2px;
}

.ds-avatar--small {
  width: 28px;
  height: 28px;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0;
}

.ds-avatar--xsmall {
  width: 20px;
  height: 20px;
  font-size: 9px;
  line-height: 16px;
  letter-spacing: 0;
}

/* Variant backgrounds + foreground colors */
/* Figma monochrome/icon background = #F1F5F9 = --p-gray-200 (verified from
 * avatar asset nodes 2086:7472 and 4544:29416). */
.ds-avatar--initials-monochrome,
.ds-avatar--icon {
  background-color: var(--p-gray-200);
  color: var(--p-gray-800);
}

.ds-avatar--initials-colored {
  /* Figma `taxt/main/white` is a fixed constant in both themes. Using
   * var(--p-surface-0) would flip in dark mode and lose contrast against
   * the (non-flipping) colored backgrounds below. */
  color: #ffffff;
}

/* Image variant: gray-200 placeholder before the image loads. */
.ds-avatar--image {
  background-color: var(--p-gray-200);
}

/* Per-color backgrounds — each hex verified against the Figma avatar SVG
 * asset fill, not just a visual screenshot. Token choices are noted inline.
 */
.ds-avatar--blue {
  background-color: var(--p-blue-600); /* Figma #0E5CF4 — exact */
}

.ds-avatar--light-purple {
  background-color: var(--p-purple-300); /* Figma #C27AFF — preset purple-300 updated to match */
}

.ds-avatar--yellow {
  background-color: var(--p-amber-400); /* Figma #F8BC3B — exact */
}

.ds-avatar--pink {
  background-color: var(--p-pink-200); /* Figma #FF4DD2 — exact */
}

.ds-avatar--purple {
  background-color: var(--p-purple-500); /* Figma #8E51FF — exact (preset purple-500) */
}

.ds-avatar--deep-blue {
  background-color: var(--p-blue-900); /* Figma #082C54 — preset blue-900 updated to match */
}

.ds-avatar--turquoise {
  background-color: var(--p-turquoise-500); /* Figma #07B096 — preset turquoise-500 */
}

.ds-avatar--orange {
  background-color: var(--p-amber-600); /* Figma #DA6B16 — exact (preset amber-600, a burnt orange) */
}

.ds-avatar--red {
  /* Figma avatar "Red" sample #9F2D00 is a burnt brick-red that has no
   * existing primitive match (red ramp is magenta-based, orange ramp is
   * too salmon). Hardcoded with this note per story 7.3 color audit. */
  background-color: #9f2d00;
}

/* Image fills the circular clip without distortion */
.ds-avatar__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

@media (prefers-reduced-motion: no-preference) {
  .ds-avatar__image {
    transition: opacity 150ms ease;
  }
}

.ds-avatar__initials {
  display: inline-block;
  line-height: inherit;
  color: inherit;
}

.ds-avatar__icon {
  color: inherit;
  line-height: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
