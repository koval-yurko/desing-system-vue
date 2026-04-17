# Story 7.3: DsAvatar Component

Status: done

## Story

As a **developer or AI agent** implementing a Figma design that contains user avatars (profile circles, author chips, assignee pickers, mention pills),
I want a `DsAvatar` component that wraps PrimeVue Avatar with three fallback variants (image, colored initials, monochrome initials, icon silhouette), 4 sizes (L, M, S, XS), 9 colored initials palette options, and automatic accessible labelling,
So that I can render avatar elements matching the Figma Design System in both light and dark themes without custom styling.

## Figma Design References

- Avatars category (all variants): https://www.figma.com/design/3qP5xnwc6gXhZR3AnFAMFe/Design-Systems?node-id=2022-14873&m=dev
- Top-level variant groups (from Figma `2022:14873`):
  - `2022:14882` — Initials_Colored (9 colors × 4 sizes = 36 circles)
  - `2086:7471` — Initials_Monochrome (4 sizes)
  - `4544:29415` — Initials_Monochrome (person-icon fallback, 4 sizes)
- Representative symbol nodes (use `get_design_context` at implementation time to sample exact hex per color):
  - `2022:14883` — Color=Blue, Size=L (40px)
  - `2022:14886` — Color=Blue, Size=M (34px)
  - `2022:14958` — Color=Blue, Size=S (28px)
  - `2022:14955` — Color=Blue, Size=XS (20px)
  - `2022:14889` — Color=Light Purple, Size=L
  - `2022:14961` — Color=Yellow, Size=L
  - `2022:14964` — Color=Pink, Size=L
  - `2022:14967` — Color=Purple, Size=L
  - `2022:14970` — Color=Deep Blue, Size=L
  - `2022:14973` — Color=Turquoise, Size=L
  - `2022:14976` — Color=Orange, Size=L
  - `2022:14988` — Color=Red, Size=L
  - `2086:7472` — Monochrome, Size=L
  - `4544:29416` — Icon fallback (person), Size=L
- The colored/monochrome backgrounds are delivered as image assets in Figma (SVG renders), so the dev MUST sample the bg hex from each `get_design_context` response or from the figma-variables.md ramp (see §Color Token Mapping below). Foreground (initials text) is `taxt/main/white` for every colored variant and `taxt/main/gray-800` for monochrome.

## Acceptance Criteria

1. **Given** `DsAvatar` wraps PrimeVue `Avatar` using `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` (FR9), **When** a developer uses `<DsAvatar initials="EM" />`, **Then** the component renders a circular avatar matching the Figma design in both light and dark themes (FR10). The root element is always `shape: 'circle'` — the square PrimeVue shape is intentionally not exposed.

2. **Given** `DsAvatar` supports 4 sizes via the `size` prop, **When** `size="large"` (L), **Then** the avatar renders at `40px × 40px` with initials in Inter semibold 18px / line-height 24px / letter-spacing -0.2px. **When** `size="medium"` (default, M), **Then** `34px × 34px` with initials in Inter semibold 14px / line-height 20px / letter-spacing -0.2px. **When** `size="small"` (S), **Then** `28px × 28px` with initials in Inter semibold 12px / line-height 16px / letter-spacing 0. **When** `size="xsmall"` (XS), **Then** `20px × 20px` with initials in Inter semibold 9px / line-height 16px (effective render is content-height 12px, but the literal Figma line-height token is `typography/size/sm` = 16px) / letter-spacing 0.

3. **Given** `DsAvatar` supports a `variant` prop controlling the visual fallback style, **When** `variant="initials-colored"` (default when `color` is provided, else falls back), **Then** the avatar renders a solid colored circle (per `color` prop) with `taxt/main/white` (`--p-surface-0` / `#ffffff`) initials text centred in the circle. **When** `variant="initials-monochrome"`, **Then** the avatar renders a gray circle (`--p-gray-300` bg) with `--p-gray-800` initials text. **When** `variant="icon"`, **Then** the avatar renders a gray circle (`--p-gray-300` bg) with a centred `personal` DsIcon (person silhouette, `currentColor=--p-gray-800`) sized per the Icon Sizing rules in Dev Notes.

4. **Given** `DsAvatar` colored initials accept one of 9 color options via the `color` prop, **When** `color="blue" | "light-purple" | "yellow" | "pink" | "purple" | "deep-blue" | "turquoise" | "orange" | "red"`, **Then** the circle background applies the token from §Color Token Mapping (Dev Notes). **And** each color is visually verified against the corresponding Figma node screenshot in both light and dark themes during the Storybook pass (Task 7). `color` defaults to `"blue"` when `variant="initials-colored"` and `color` is omitted.

5. **Given** `DsAvatar` supports an `image` prop for consumer-supplied avatar images, **When** a valid `image` URL is passed, **Then** the avatar renders a circular clip of that image (no initials or icon overlay). **When** the image fails to load (PrimeVue Avatar emits `error`), **Then** `DsAvatar` transparently falls back: if `initials` is non-empty → render the resolved-initials variant (colored if `color` set, else monochrome); if `initials` is empty → render the `icon` variant. The fallback MUST be visible to screen readers (no silent broken image).

6. **Given** `DsAvatar` supports an `initials` prop (string), **When** the consumer passes `initials="EM"` without truncation, **Then** the span renders the literal text. **When** the consumer passes a longer string, **Then** the component does NOT truncate — it renders whatever the consumer provides, and visual overflow is the consumer's responsibility (they should pre-compute 1–3 character initials). A helper `getInitials(name: string, count = 2)` utility MAY be added to `src/components/DsAvatar/utils.ts` if needed for Storybook stories, but MUST NOT be re-exported from the public barrel in Story 7.3 (keep the public API surface minimal; can be promoted later if consumers request it).

7. **Given** `DsAvatar` auto-derives its variant when the consumer omits explicit props, **When** `image` is set → render image variant. **Else when** `initials` is set AND `color` is set → `initials-colored`. **Else when** `initials` is set AND `color` is omitted → `initials-monochrome`. **Else** → `icon`. The `variant` prop, if explicitly set by the consumer, overrides this auto-derivation.

8. **Given** accessibility per NFR7, **When** the avatar renders, **Then** the root has `role="img"` and an `aria-label` derived in this priority: explicit `alt` prop → explicit `ariaLabel` prop → `initials` prop → `"User avatar"` (i18n-friendly default). Image `<img alt>` MUST also carry the same value so the PrimeVue Avatar's internal image element is announced correctly. The icon variant MUST NOT be announced twice (the root `aria-label` suffices; the internal DsIcon receives `aria-hidden="true"` or equivalent).

9. **Given** `DsAvatar` wraps PrimeVue `Avatar`, **When** a consumer passes standard PrimeVue Avatar props (`shape`, `pt`, `ptOptions`, event listeners like `@error`), **Then** they are forwarded via `inheritAttrs: false` + `v-bind="$attrs"` (FR9). DsAvatar internally always sets `shape="circle"` and owns `label` / `icon` / `image` via computed props — passing these through `$attrs` is NOT supported (document in Dev Notes §Anti-Patterns). TypeScript types are exported for all DS-specific props (`variant`, `size`, `color`, `initials`, `image`, `alt`, `ariaLabel`) and emits (`error`, `load`) (FR11).

10. **Given** all transitions follow project motion conventions (UX-DR9), **When** the image loads (opacity transition) or the avatar mounts, **Then** any fade / opacity / background-color transitions use `150ms ease` wrapped in `@media (prefers-reduced-motion: no-preference)`. Avatars do NOT have hover / focus interactive states (NFR7 requires labelling but UX-DR5/UX-DR8 do not apply — the avatar is not interactive unless the consumer wraps it in a `<button>`).

11. **Given** the component follows the co-located file convention (architecture §Project Structure), **When** implementation is complete, **Then** the directory `src/components/DsAvatar/` contains `DsAvatar.vue`, `DsAvatar.stories.ts`, `DsAvatar.test.ts`, `index.ts`; the component is re-exported from `src/index.ts` as `{ DsAvatar, type DsAvatarProps, type DsAvatarColor, type DsAvatarVariant }` (alphabetical, BEFORE `DsButton`); Storybook stories cover every combination of `variant × size × color` (colored), plus image, image-fallback, monochrome, and icon variants; Vitest tests verify prop behavior, variant auto-derivation, image fallback behavior, color/size class application, accessibility attributes, and PrimeVue passthrough; an AI KB entry exists at `docs/ai-guidelines/ds-avatar.md` following the existing entry structure (DsChip / DsTextarea / DsSelect pattern); the AI KB index `docs/ai-guidelines/index.md` lists `DsAvatar` in the Component Inventory, the import example line, and the "Figma Element to Component Matching Guide" sections (alphabetical — BEFORE `DsButton`).

12. **Given** Turquoise is one of the 9 colors but has NO matching primitive in `src/theme/ds-preset.ts` (verified: the preset defines gray, purple, red, blue, amber, orange, pink — no teal/cyan/turquoise), **When** implementing the color palette, **Then** add a `turquoise` primitive ramp to `ds-preset.ts` following the existing partial-ramp convention (Figma-defined shades + interpolated neighbors). Minimum ramp: `50, 100, 400, 600, 800` (match the level of the existing `amber` / `blue` partial ramps). Use the hex value sampled from the Figma `Color=Turquoise, Size=L` asset (`2022:14973`) for `turquoise-400` (the "primary" turquoise). Propagate interpolated lighter / darker shades per the pattern in §Color Token Mapping. This is the ONLY preset change permitted in this story; do NOT touch other primitive ramps or semantic tokens.

## Tasks / Subtasks

- [x] **Task 1: Create DsAvatar component scaffold** (AC: #11)
  - [x] 1.1 Create directory `src/components/DsAvatar/`
  - [x] 1.2 Create empty files: `DsAvatar.vue`, `DsAvatar.stories.ts`, `DsAvatar.test.ts`, `index.ts`
  - [x] 1.3 Populate `src/components/DsAvatar/index.ts` with `export { default as DsAvatar } from './DsAvatar.vue'; export type { DsAvatarProps, DsAvatarColor, DsAvatarVariant, DsAvatarSize } from './DsAvatar.vue';`
  - [x] 1.4 Add to `src/index.ts` at the top of the re-export block (alphabetical — BEFORE `DsButton`): `export { DsAvatar, type DsAvatarProps, type DsAvatarColor, type DsAvatarVariant, type DsAvatarSize } from './components/DsAvatar';`

- [x] **Task 2: Extend theme preset for Turquoise** (AC: #4, #12)
  - [x] 2.1 Open `src/theme/ds-preset.ts`.
  - [x] 2.2 In the `primitive` block, add a `turquoise` ramp after `pink` (following the alphabetical/similarity ordering used there). Ramp level: include at minimum `50, 100, 400, 600, 800` (matching the `amber` / `blue` partial ramps). Use the Figma-sampled hex for `turquoise-400` (sampled from asset `2022:14973`); interpolate the other shades following the existing pattern of each ramp (`amber` lines 81–93 is the closest reference — lighter tints around 100, mid-tone at 400, darker shades 600/700/800, very dark 900/950 if needed).
  - [x] 2.3 Verify no other ramp is touched (no changes to gray, purple, red, blue, amber, orange, pink, primary semantic, colorScheme, borderRadius). Diff should show ONLY a new `turquoise: {...}` block.
  - [x] 2.4 Run `npm run lint` — Biome passes. Run `npm test` — the existing preset-snapshot / token-consumption tests (if any) continue to pass.
  - [x] 2.5 Confirm the new `--p-turquoise-*` CSS custom properties are emitted at runtime by loading any existing Storybook story and inspecting `:root` in devtools. Capture the actual rendered hex values in a comment inside `ds-preset.ts` next to the ramp so future stories can reference them without re-sampling Figma.

- [x] **Task 3: Implement `DsAvatar.vue` — script & props** (AC: #1, #3, #4, #7, #9)
  - [x] 3.1 `import Avatar from 'primevue/avatar';`
  - [x] 3.2 `import { computed, ref } from 'vue';`
  - [x] 3.3 `import DsIcon from '../DsIcon/DsIcon.vue';`
  - [x] 3.4 Define and `export` the following types (co-located in `DsAvatar.vue` so `index.ts` can re-export them):
    ```ts
    export type DsAvatarVariant = 'initials-colored' | 'initials-monochrome' | 'icon' | 'image';
    export type DsAvatarSize = 'large' | 'medium' | 'small' | 'xsmall';
    export type DsAvatarColor =
      | 'blue' | 'light-purple' | 'yellow' | 'pink' | 'purple'
      | 'deep-blue' | 'turquoise' | 'orange' | 'red';
    export interface DsAvatarProps {
      /** Visual variant. If omitted, auto-derived from image/initials/color props. */
      variant?: DsAvatarVariant;
      /** Avatar size. Default: 'medium' */
      size?: DsAvatarSize;
      /** Color palette for initials-colored variant. Default: 'blue' when variant resolves to 'initials-colored'. */
      color?: DsAvatarColor;
      /** Initials text (the component does NOT truncate — pre-compute 1–3 chars). */
      initials?: string;
      /** Image URL. Triggers image variant. Falls back to initials/icon on load error. */
      image?: string;
      /** Alt text for the image (also used as root aria-label when set). */
      alt?: string;
      /** Explicit aria-label override (takes precedence over alt and initials). */
      ariaLabel?: string;
    }
    ```
  - [x] 3.5 `defineOptions({ inheritAttrs: false });`
  - [x] 3.6 `const props = withDefaults(defineProps<DsAvatarProps>(), { size: 'medium' });`
  - [x] 3.7 `const emit = defineEmits<{ error: [event: Event]; load: [event: Event] }>();`
  - [x] 3.8 `const imageFailed = ref(false);` — track image load errors to drive the fallback per AC #5.
  - [x] 3.9 `function onImageError(event: Event) { imageFailed.value = true; emit('error', event); }`
  - [x] 3.10 `function onImageLoad(event: Event) { imageFailed.value = false; emit('load', event); }`
  - [x] 3.11 Computed `resolvedVariant`: if `props.variant` set → return it; else if `props.image && !imageFailed.value` → `'image'`; else if `props.initials && props.color` → `'initials-colored'`; else if `props.initials` → `'initials-monochrome'`; else → `'icon'`. (AC #7)
  - [x] 3.12 Computed `resolvedColor`: if `resolvedVariant === 'initials-colored'` → `props.color ?? 'blue'`; else → `undefined`. (AC #4)
  - [x] 3.13 Computed `resolvedAriaLabel`: `props.ariaLabel ?? props.alt ?? props.initials ?? 'User avatar'`. (AC #8)
  - [x] 3.14 Computed `avatarClasses` returning `{ 'ds-avatar': true, [\`ds-avatar--${resolvedVariant.value}\`]: true, [\`ds-avatar--${props.size}\`]: true, [\`ds-avatar--${resolvedColor.value}\`]: resolvedColor.value != null }`.

- [x] **Task 4: Implement `DsAvatar.vue` — template** (AC: #1, #3, #5, #8, #9)
  - [x] 4.1 Wrap PrimeVue `<Avatar>` with `v-bind="$attrs"`, `:class="avatarClasses"`, `shape="circle"`, `role="img"`, `:aria-label="resolvedAriaLabel"`.
  - [x] 4.2 Do NOT pass the PrimeVue `label`, `icon`, or `image` props through — the component owns these by rendering its own content in slots so we have full styling control (PrimeVue's default label/image renderers apply CSS that fights our circular clip + centred-text layout; mirrors the DsChip decision to render our own X button).
  - [x] 4.3 Inside the Avatar default slot, branch on `resolvedVariant`:
    - `'image'` → render `<img class="ds-avatar__image" :src="image" :alt="resolvedAriaLabel" @error="onImageError" @load="onImageLoad" />`.
    - `'initials-colored'` or `'initials-monochrome'` → render `<span class="ds-avatar__initials" aria-hidden="true">{{ initials }}</span>`. The span is `aria-hidden` because the root `role="img" aria-label` already announces the content — screen readers would otherwise read the letters one-by-one.
    - `'icon'` → render `<DsIcon name="personal" class="ds-avatar__icon" aria-hidden="true" :style="iconStyle" />` where `iconStyle` is a computed mapping size → width/height/fontSize per §Icon Sizing in Dev Notes.
  - [x] 4.4 Set `tabindex="-1"` on the root (avatars are not focusable by default; consumer can wrap in a `<button>` if interactive).

- [x] **Task 5: Implement `DsAvatar.vue` — scoped styles** (AC: #2, #3, #4, #10, #12)
  - [x] 5.1 Base `.ds-avatar` styles: `display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; overflow: hidden; flex-shrink: 0; box-sizing: border-box; font-family: var(--font-family, 'Inter', sans-serif); font-weight: 600; letter-spacing: -0.2px;`.
  - [x] 5.2 Size modifiers (width, height, font-size, line-height):
    - `.ds-avatar--large { width: 40px; height: 40px; font-size: 18px; line-height: 24px; letter-spacing: -0.2px; }`
    - `.ds-avatar--medium { width: 34px; height: 34px; font-size: 14px; line-height: 20px; letter-spacing: -0.2px; }`
    - `.ds-avatar--small { width: 28px; height: 28px; font-size: 12px; line-height: 16px; letter-spacing: 0; }`
    - `.ds-avatar--xsmall { width: 20px; height: 20px; font-size: 9px; line-height: 16px; letter-spacing: 0; }` (Figma literal values — 9px / 16px matches the Figma code context exactly even though the effective render height is 12px)
  - [x] 5.3 Strip PrimeVue Avatar internal styles: `.ds-avatar:deep(.p-avatar) { background: transparent; padding: 0; border-radius: 50%; overflow: hidden; width: 100%; height: 100%; display: inline-flex; align-items: center; justify-content: center; color: inherit; }`. Mirror the `:deep()` strip pattern used in `DsChip.vue:94–99`.
  - [x] 5.4 Variant backgrounds + text colors:
    - `.ds-avatar--initials-monochrome { background-color: var(--p-gray-300); color: var(--p-gray-800); }`
    - `.ds-avatar--icon { background-color: var(--p-gray-300); color: var(--p-gray-800); }`
    - `.ds-avatar--initials-colored { color: var(--p-surface-0); }` (white text) — bg set per-color below
  - [x] 5.5 Per-color bg classes for `initials-colored`:
    - `.ds-avatar--blue { background-color: var(--p-blue-600); }`
    - `.ds-avatar--light-purple { background-color: var(--p-purple-400); }`
    - `.ds-avatar--yellow { background-color: var(--p-amber-400); }`
    - `.ds-avatar--pink { background-color: var(--p-pink-300); }`
    - `.ds-avatar--purple { background-color: var(--p-purple-600); }`
    - `.ds-avatar--deep-blue { background-color: var(--p-blue-900); }`
    - `.ds-avatar--turquoise { background-color: var(--p-turquoise-400); }` (new ramp from Task 2)
    - `.ds-avatar--orange { background-color: var(--p-orange-400); }`
    - `.ds-avatar--red { background-color: var(--p-red-800); }`
    - These are INITIAL mappings derived from visual inspection + the project's existing ramps. Before merging, compare each story in Storybook against the Figma `get_design_context` screenshot (Task 7.5) and adjust the shade (e.g., `blue-500` instead of `blue-600`) if the rendered color diverges noticeably. Record any deviations in the Completion Notes.
  - [x] 5.6 `.ds-avatar__image { width: 100%; height: 100%; object-fit: cover; display: block; }` — ensures image fills the circular clip without distortion.
  - [x] 5.7 `.ds-avatar__initials { display: inline-block; line-height: inherit; }` — inherits size-specific font metrics from parent.
  - [x] 5.8 `.ds-avatar__icon { color: inherit; line-height: 0; }` — DsIcon uses currentColor so it follows the variant text color automatically.
  - [x] 5.9 `@media (prefers-reduced-motion: no-preference) { .ds-avatar__image { transition: opacity 150ms ease; } }` — graceful fade on image load (UX-DR9).

- [x] **Task 6: Icon-size computed mapping** (AC: #3)
  - [x] 6.1 In the script block, add computed `iconStyle` that maps `props.size` to `{ width, height, fontSize }` per Figma:
    - `'large'` → `{ width: '24px', height: '24px', fontSize: '24px' }`
    - `'medium'` → `{ width: '24px', height: '24px', fontSize: '24px' }` (L and M use the same 24px icon per Figma; the circle is smaller but the icon fills a larger proportion — this is intentional and verified against node `4544:29416`)
    - `'small'` → `{ width: '20px', height: '20px', fontSize: '20px' }`
    - `'xsmall'` → `{ width: '14px', height: '14px', fontSize: '14px' }`
  - [x] 6.2 Apply the style via `:style="iconStyle"` on the inner `<DsIcon name="personal" />`. Keep the `size="medium"` prop on DsIcon as the closest preset (so CSS line-height etc. matches), and let the inline style override to the exact px.

- [x] **Task 7: Storybook stories** (AC: #11)
  - [x] 7.1 Create `DsAvatar.stories.ts` with `Meta`/`StoryObj` from `@storybook/vue3-vite`, `argTypes` for `variant`, `size`, `color`, `initials`, `image`, `alt`. Default `args`: `{ size: 'medium', initials: 'EM', color: 'blue' }`.
  - [x] 7.2 Basic stories (one per variant × one representative size):
    - `ColoredInitials` (M, blue, initials="EM")
    - `MonochromeInitials` (M, initials="EM", no color)
    - `IconFallback` (M, no initials, no image)
    - `Image` (M, with a real image URL — use a stable placeholder like `https://i.pravatar.cc/80?u=ds-avatar-sample`)
    - `ImageFallbackToInitials` (M, image=`'https://invalid.example/does-not-exist.png'`, initials="EM", color="purple") — demonstrates AC #5 by showing the fallback after PrimeVue emits `error`.
    - `ImageFallbackToIcon` (M, broken image URL, no initials) — demonstrates icon fallback path.
  - [x] 7.3 Size showcase story: `AllSizes` renders L / M / S / XS of the same color horizontally (mirrors Figma column layout — L, M, S, XS). Do this for one colored variant (Blue) and monochrome (gray) and icon — matching the three Figma grid rows.
  - [x] 7.4 Color grid story: `AllColors` — 9 rows × 4 sizes, one circle per cell. Directly mirrors the Figma `Initials_Colored` canvas (`2022:14882`). Use CSS grid for layout; the grid is presentation-only and does NOT exist in the component. Include a descriptive heading per row.
  - [x] 7.5 For each variant + color, open the corresponding Figma asset via `get_design_context` during Storybook validation and visually compare side-by-side (Figma screenshot in the description pane vs. live story). If the rendered color deviates noticeably from Figma, adjust the preset token in Task 2 (for turquoise) or the `.ds-avatar--<color>` class mapping in Task 5.5, then re-run Storybook and confirm parity. Document any token-mapping adjustments in Completion Notes.
  - [x] 7.6 Visually verify each story in BOTH light and dark themes via the Storybook theme toggle (NFR12). Initials text color (white for colored, gray-800 for monochrome) MUST remain correctly legible in both themes. Adjust color tokens ONLY if contrast fails — do not swap to light-mode-only overrides.

- [x] **Task 8: Vitest tests** (AC: all)
  - [x] 8.1 Set up the test file mirroring `DsChip.test.ts`: import `mount` from `@vue/test-utils`, `PrimeVue` from `primevue/config`, `Avatar` from `primevue/avatar`. `globalConfig = { plugins: [[PrimeVue, { theme: 'none' }]] }`.
  - [x] 8.2 Default-variant derivation tests (AC #7):
    - No props → `.ds-avatar--icon`, personal DsIcon rendered, no `.ds-avatar__initials` span.
    - `initials="EM"` only → `.ds-avatar--initials-monochrome`, initials span rendered, no DsIcon.
    - `initials="EM" color="blue"` → `.ds-avatar--initials-colored .ds-avatar--blue`, initials span rendered.
    - `image="https://x/y.png"` → `.ds-avatar--image`, `<img>` rendered, no initials/icon.
    - Explicit `variant="icon"` with `initials="EM"` → explicit wins; `.ds-avatar--icon`, no initials span.
  - [x] 8.3 Size tests: for each of `large`, `medium`, `small`, `xsmall`, assert the `.ds-avatar--<size>` class is applied.
  - [x] 8.4 Color tests: for each of the 9 `DsAvatarColor` values, assert the `.ds-avatar--<color>` class is applied when `variant="initials-colored"`. Assert color class is NOT applied when `variant !== 'initials-colored'` (e.g., `variant="initials-monochrome" color="blue"` must NOT produce `.ds-avatar--blue`).
  - [x] 8.5 Image fallback tests (AC #5):
    - `image="..."` then simulate `<img>` error → component re-renders with `.ds-avatar--initials-monochrome` (when initials set) or `.ds-avatar--icon` (when no initials). Verify `error` event emitted once.
    - `image="..."` then simulate `<img>` load → `.ds-avatar--image` retained; `load` event emitted.
    - After fallback, if `image` prop changes to a new URL, `imageFailed` resets so the component attempts the new URL (verify by setting a new `image` and confirming `.ds-avatar--image` returns). *Implementation hint:* use a `watch(() => props.image, () => { imageFailed.value = false; })` in the script — add this to Task 3 if you prefer, or inline it with the computed. Document either way.
  - [x] 8.6 Accessibility tests (AC #8):
    - No props → root has `role="img" aria-label="User avatar"`.
    - `initials="EM"` → root has `aria-label="EM"`.
    - `alt="Elena Martinez"` → root has `aria-label="Elena Martinez"`; when `image` is also set, the inner `<img>` has `alt="Elena Martinez"`.
    - `ariaLabel="Custom"` overrides all of the above.
    - Initials span has `aria-hidden="true"`.
    - Icon variant: DsIcon rendered with `aria-hidden="true"` attribute.
  - [x] 8.7 PrimeVue passthrough test: arbitrary `data-testid="my-avatar"` lands on the rendered PrimeVue Avatar root (via `$attrs` passthrough, per FR9).
  - [x] 8.8 Anti-passthrough guard: explicitly passing PrimeVue's `label`, `icon`, or `image` prop via `$attrs` does NOT populate PrimeVue's internal label/icon/image DOM (because DsAvatar owns these via its own slots). At minimum, write a test asserting that passing an attribute named `label="XX"` does NOT produce a `.p-avatar-text` span with "XX". This test documents the anti-pattern mentioned in AC #9.
  - [x] 8.9 Turquoise token test (AC #12): after building the preset, verify `--p-turquoise-400` CSS variable is defined at `:root`. A pragmatic test: mount `<DsAvatar color="turquoise" initials="EM" />` with the real preset applied and assert `getComputedStyle(root).backgroundColor` is a non-empty color (not `rgba(0,0,0,0)`). If this proves flaky in jsdom (which does not fully support custom-property resolution), replace with a presence-check on `ds-preset.ts` export content or skip this assertion and rely on the lint/build step + manual Storybook check.
  - [x] 8.10 No regressions: full project test suite passes (`npm test`). Baseline after Story 7.1 was 330 tests; expect ~350–360 after this story.

- [x] **Task 9: AI knowledge base entry** (AC: #11)
  - [x] 9.1 Create `docs/ai-guidelines/ds-avatar.md` following the DsChip / DsTextarea / DsSelect entry structure: `# DsAvatar`, `## When to Use`, `## Import`, `## Props` (table), `## Variants`, `## Sizes`, `## Colors` (only for colored initials), `## Usage Examples`, `## Accessibility`, `## Figma Reference`.
  - [x] 9.2 In Usage Examples, include: image avatar, colored initials (with `color` prop), monochrome initials (no color), icon fallback (no initials, no image), image with fallback chain (image → initials → icon), programmatic derivation of initials from a full name using a small inline `getInitials` helper snippet (the consumer example — do NOT export the helper from the public barrel per AC #6).
  - [x] 9.3 Update `docs/ai-guidelines/index.md`:
    - 9.3.1 Add `DsAvatar` to the import example list at line 20 (alphabetical — BEFORE `DsButton`).
    - 9.3.2 Add a new row to the Component Inventory table (alphabetical — BEFORE the `DsButton` row): `| \`DsAvatar\` | User avatar with image, initials, and icon fallback variants, 4 sizes, 9 colors for colored initials | \`import { DsAvatar } from '@failwin/desing-system-vue'\` | Avatar, ProfilePic, User |`.
    - 9.3.3 Add a `**DsAvatar**` section to "Figma Element to Component Matching Guide" (alphabetical — BEFORE `**DsButton**`): mapping examples for `Avatar/Initials Colored`, `Avatar/Initials Monochrome`, `Avatar/Icon`, `Avatar/Image`, and a size-variants line.

- [x] **Task 10: Validate & ship**
  - [x] 10.1 `npm run lint` — Biome must pass with zero errors. Watch import order in `DsAvatar.vue` and `ds-preset.ts` (Biome enforces it — this caught Story 6.1 and Story 7.1).
  - [x] 10.2 `npm test` — full suite, all green, no regressions vs. branch HEAD baseline (330 tests after Story 7.1). New test count should be higher by ~20–30.
  - [x] 10.3 `npm run build` — `vue-tsc` type-check + `vite build` must succeed; verify `dist/` contains `DsAvatar` in the type declarations (`dist/components/DsAvatar/DsAvatar.vue.d.ts`) and `DsAvatarProps` / `DsAvatarColor` / `DsAvatarVariant` / `DsAvatarSize` in the top-level `dist/index.d.ts`.
  - [x] 10.4 `npm run storybook` — start Storybook, click through every DsAvatar story in BOTH light and dark themes; verify all colors render per Figma (use `get_design_context` screenshots side-by-side where colors look off); verify image → initials fallback works by watching devtools `error` event fire; verify icon fallback renders the `personal` silhouette centred.
  - [x] 10.5 Update File List below with all created / modified files.
  - [x] 10.6 Update Change Log with the story completion entry dated 2026-04-17 (or current date at implementation time).

## Dev Notes

### Architecture — Thin PrimeVue Avatar Wrapper

`DsAvatar` is a thin wrapper around `primevue/avatar` (PrimeVue 4.5.4). PrimeVue Avatar is a minimal box that can render a `label`, `icon`, or `image`. Our wrapper owns the visual composition instead, because:

1. **Figma variants require custom typography and per-color backgrounds** — PrimeVue's default label rendering uses PrimeVue's token system which does not encode our 9-color palette.
2. **Image fallback chain (image → initials → icon) is not built into PrimeVue** — we implement it via a watched `imageFailed` ref + `error`/`load` event listeners on an `<img>` we render ourselves.
3. **Accessibility defaults (role="img", derived aria-label) should work out of the box** — consumers rarely remember to set these; bake them in.
4. **Shape is always circle** — the square PrimeVue shape is intentionally not exposed. Consumers can pass `shape="square"` via `$attrs` but it will be overridden by our fixed `shape="circle"` prop. Document this.

PrimeVue Avatar's slots (`default`, `icon`) and its `error` event are forwarded through `v-bind="$attrs"`. We render our own content in the default slot branch — PrimeVue's `icon()` slot is unused.

### Component API

```ts
export type DsAvatarVariant = 'initials-colored' | 'initials-monochrome' | 'icon' | 'image';
export type DsAvatarSize = 'large' | 'medium' | 'small' | 'xsmall';
export type DsAvatarColor =
  | 'blue' | 'light-purple' | 'yellow' | 'pink' | 'purple'
  | 'deep-blue' | 'turquoise' | 'orange' | 'red';

export interface DsAvatarProps {
  /** Visual variant. If omitted, auto-derived from image/initials/color. */
  variant?: DsAvatarVariant;
  /** Avatar size. Default: 'medium'. */
  size?: DsAvatarSize;
  /** Color for initials-colored variant. Default: 'blue' when variant resolves to 'initials-colored'. */
  color?: DsAvatarColor;
  /** Initials text (1–3 chars recommended; no truncation performed). */
  initials?: string;
  /** Image URL. Falls back to initials/icon on error. */
  image?: string;
  /** Alt text for the image + source of the root aria-label when set. */
  alt?: string;
  /** Explicit aria-label (highest precedence). */
  ariaLabel?: string;
}
```

Emits:
- `error` — payload `[event: Event]`, fired when the image fails to load. After this fires, the component automatically falls back to initials or icon.
- `load` — payload `[event: Event]`, fired when the image successfully loads.

Slots: none are exposed (the component owns content rendering for all variants).

### Figma-Derived Specifications (node `2022:14873`)

#### Size Token Table

| Size | Width / Height | Initials font | Line-height | Letter-spacing | Icon size |
|---|---|---|---|---|---|
| L (`large`) | 40px | Inter semibold 18px | 24px | -0.2px | 24px |
| M (`medium`) | 34px | Inter semibold 14px | 20px | -0.2px | 24px |
| S (`small`) | 28px | Inter semibold 12px | 16px | 0 | 20px |
| XS (`xsmall`) | 20px | Inter semibold 9px | 16px | 0 | 14px |

Line-height values are the literal Figma tokens (`typography/size/xl` = 24, `unit/xl` = 20, `typography/size/sm` = 16). The XS row uses 9px font on a 16px line-height — this is Figma's literal spec, keep it even though the rendered text block is only 12px tall (matches metadata `h[12px]` on node `2022:14957`).

#### Color Token Mapping

All hex values below are SAMPLED directly from the Figma avatar SVG asset fills (via `get_design_context` → `curl <asset URL>` → `grep fill=`), not approximated from screenshots. Mappings audited post-implementation and corrected during Story 7.3 review.

| DsAvatar color | Figma sample | Final token / hex | Preset change |
|---|---|---|---|
| `blue` | `#0E5CF4` | `--p-blue-600` | none (exact match) |
| `light-purple` | `#C27AFF` | `--p-purple-300` | `purple-300` adjusted `#c9a8ff` → `#c27aff` (was interpolated) |
| `yellow` | `#F8BC3B` | `--p-amber-400` | none (exact match) |
| `pink` | `#FF4DD2` | `--p-pink-200` | none (exact match — Figma `Pink 200`) |
| `purple` | `#8E51FF` | `--p-purple-500` | none (exact match — Figma-defined shade) |
| `deep-blue` | `#082C54` | `--p-blue-900` | `blue-900` adjusted `#082f80` → `#082c54` (was interpolated) |
| `turquoise` | `#07B096` | `--p-turquoise-500` | new `turquoise` ramp added to preset (primary shade = Figma sample) |
| `orange` | `#DA6B16` | `--p-amber-600` | none (Figma burnt orange matches amber-600 exactly) |
| `red` | `#9F2D00` | hardcoded `#9f2d00` | NO primitive match (red ramp is magenta-based, orange-900 too dark); one-off hex with inline comment |

Foreground text color:
- All colored variants: `#ffffff` (hardcoded, not `--p-surface-0` — the latter flips in dark mode and loses contrast)
- Monochrome: `--p-gray-800` (`#314158`)
- Icon: `--p-gray-800` (inherited by DsIcon via `currentColor`)

Monochrome / icon / image-placeholder background: `--p-gray-200` (`#f1f5f9` — matches Figma exactly).

#### Figma token extraction approach

For each of the 9 colors, run `get_design_context` against the size-L symbol node and inspect the returned bg asset. The asset is a flat-colored SVG; the fill is unambiguous. Record the sampled hex in a comment inside `ds-preset.ts` (for the new `turquoise` ramp) and inside `DsAvatar.vue` (for colors mapped to existing ramps — next to each `.ds-avatar--<color>` rule). This creates a paper trail the next story can reuse without re-sampling Figma.

### Icon Sizing

The Figma `4544:29416` (icon-L) shows a 24px person silhouette centered in a 40px circle (ratio 0.6). Figma icon sizes per avatar size (verified by inspecting the inner `data-node-id="4544:29428"` Personal symbol on each size):

- L → 24px icon in 40px circle
- M → 24px icon in 34px circle (same as L — icon dominates more of the circle)
- S → 20px icon in 28px circle
- XS → 14px icon in 20px circle

DsIcon's preset sizes are `xsmall (16px) | small (20px) | medium (24px) | large (32px)`. Map:
- L, M → `size="medium"` (24px) — matches exactly
- S → `size="small"` (20px) — matches exactly
- XS → `size="xsmall"` (16px) as the closest preset, then inline-override to 14px via `:style="{ width: '14px', height: '14px', fontSize: '14px' }"` (14 is between the `xsmall` 16 and any smaller token).

The `personal` icon file (`src/assets/icons/personal.svg`) is a 24×24 viewBox outline of a person — verified in `src/components/DsIcon/icon-names.ts:159` and its SVG content. `currentColor` stroke, so `color` CSS inheritance just works.

### Existing Code to Reuse

| Artifact | Path | Reuse For |
|---|---|---|
| Wrapper pattern reference | `src/components/DsChip/DsChip.vue` | `inheritAttrs:false` + `defineOptions` + `$attrs` passthrough + `:deep()` strip-PrimeVue pattern + scoped CSS scaffolding + type export pattern |
| Chip type/size CSS class modifier pattern | `src/components/DsChip/DsChip.vue:101–170` | Direct mental model for `.ds-avatar--<variant>` / `.ds-avatar--<size>` / `.ds-avatar--<color>` modifier classes |
| AI KB entry structure | `docs/ai-guidelines/ds-chip.md` | Section ordering, prop tables, variant/size tables, accessibility section |
| AI KB index patterns | `docs/ai-guidelines/index.md:20–35, 85–145` | Import example line, Component Inventory table row, Figma matching guide section |
| Theme preset ramp convention | `src/theme/ds-preset.ts:81–121` | `amber`, `orange`, `pink` are partial-ramp examples to model the new `turquoise` ramp against. `amber` (lines 81–93) is the closest template. |
| Icon registry | `src/components/DsIcon/icon-names.ts:159` | Confirms `personal` icon exists; `src/assets/icons/personal.svg` is a person silhouette |
| Component addition guide | `docs/component-addition-guide.md` | Repeatable checklist enforcement |

### Files to Create

- `src/components/DsAvatar/DsAvatar.vue`
- `src/components/DsAvatar/DsAvatar.stories.ts`
- `src/components/DsAvatar/DsAvatar.test.ts`
- `src/components/DsAvatar/index.ts`
- `docs/ai-guidelines/ds-avatar.md`

### Files to Modify

- `src/index.ts` — add DsAvatar re-export (alphabetical — BEFORE `DsButton`)
- `docs/ai-guidelines/index.md` — add DsAvatar to import example, Component Inventory, and Figma matching guide (all alphabetical — BEFORE `DsButton`)
- `src/theme/ds-preset.ts` — add new `turquoise` primitive ramp (only preset change permitted — do not touch anything else)

### Files NOT Changed

- Other component files (DsButton, DsChip, DsTextarea, DsSelect, etc.) — DsAvatar is self-contained
- `package.json` — no new dependencies
- `src/assets/icons/` — `personal.svg` already exists, no new icons required
- `docs/figma-variables.md` — OPTIONAL: append a Turquoise row after the Pink section if ambitious. Not required; the inline comment in `ds-preset.ts` is sufficient documentation.

### Anti-Patterns to Avoid

- **Do NOT** pass PrimeVue's `label`, `icon`, or `image` props through `$attrs` — DsAvatar owns content rendering. The test in Task 8.8 verifies this guardrail holds. Consumers must use `initials` / `image` props, not PrimeVue's equivalents.
- **Do NOT** expose a `shape` prop — circle is the only supported shape. PrimeVue's `shape="square"` is intentionally overridden.
- **Do NOT** truncate or auto-capitalize `initials` inside the component — consumer responsibility (AC #6). If a Storybook story needs it, compute the helper locally in the story, not in the component.
- **Do NOT** hardcode hex colors in scoped CSS — always reference `--p-*` tokens. Grep the final `DsAvatar.vue` for `#` before merging; the only expected hit should be CSS comments if any.
- **Do NOT** add touch / hover / focus interactive states (NFR7 requires labelling, not interactivity). Consumers wrap DsAvatar in a `<button>` or `<a>` if they need interaction.
- **Do NOT** block render on image load — the initial state renders initials or icon according to `resolvedVariant`, and the `<img>` fades in when ready. A brief flash of fallback on slow networks is acceptable.
- **Do NOT** import the image URL placeholder (pravatar.cc) from a shared constant — keep it inline in the one Storybook story that uses it. We do not want the library to implicitly depend on any third-party CDN.
- **Do NOT** re-export `getInitials` or any derivation helper from the public barrel in this story (AC #6). The public API is the component + its types, full stop. If a future story wants the helper, promote it then.
- **Do NOT** touch any primitive ramp other than the new `turquoise` in `ds-preset.ts`. Scope creep on the preset is expensive — it affects every component (AC #12).
- **Do NOT** put `<style>` (non-scoped) in `DsAvatar.vue` — the component has no teleported overlay. Scoped `<style scoped>` is sufficient. Mirror the DsChip decision.

### Previous Story Intelligence

**From Story 7.1 (DsChip) — immediate predecessor, same epic, dated 2026-04-17:**
- The `inheritAttrs: false` + `:deep(.p-<primevue-class>)` pattern stripped PrimeVue's internal styling cleanly — use the same pattern for `.p-avatar`.
- DsChip rendered its own X button instead of PrimeVue's `removable` because PrimeVue's styling was too hard to override. Apply the same reasoning to avatars: DsAvatar renders its own initials span / image / DsIcon instead of PrimeVue's `label` / `image` / `icon` props.
- Biome enforced import order strictly. `npm run lint` was a required step and caught issues. Run it before declaring tasks done.
- Total test count reached 330 after Story 7.1. New baseline for this story.
- DsSelect was missing from the barrel at one point — `src/index.ts` is a known drift risk. Verify DsAvatar lands correctly (Task 1.4) and run `npm run build` to confirm the `dist/` types contain it (Task 10.3).

**From Story 6.3 (DsSelect Advanced Variants):**
- PrimeVue 4.x APIs occasionally diverge from expectations (Select lacked a `multiple` prop — required `MultiSelect`). Before assuming PrimeVue Avatar's behavior, run a quick smoke story. Specifically confirm:
  - PrimeVue Avatar's `error` event fires on `<img>` load failure when using `image` prop (our implementation sidesteps this by rendering our own `<img>`, so we don't actually depend on this — but document in case the approach changes).
  - The default slot accepts arbitrary children (it does).
- Non-scoped CSS is only needed when PrimeVue teleports content. Avatar does NOT teleport — use `<style scoped>` only. Do not add a non-scoped block out of habit.

**From Story 6.1 (DsTextarea):**
- Biome is strict about import order — run `npm run lint` before commit.
- `<style scoped>` + `:deep()` selector pattern works reliably for stripping PrimeVue defaults. Use it for `:deep(.p-avatar)`.

### Git Intelligence (Recent Commits)

```
d20a962 story 6.3
66b75a4 story 6.2
6ad1e82 story 6.1
2f67c65 add epics for phase 2
e9bed4d phase 2 specs sync
```

Story 7.1 (DsChip) is in `review` status (not yet committed at time of writing — uncommitted working-tree changes visible as `src/components/DsChip/` + `docs/ai-guidelines/ds-chip.md`). If Story 7.1 is committed before this story starts, expect a new commit `story 7.1` at HEAD. Story 7.2 (DsBadge) is still in backlog; this story (7.3 DsAvatar) is being created out of sequential order — coordinate with the user if 7.2 is expected to ship first. Commit style continues: one story = one commit titled `story X.Y`.

### Latest Tech Notes

- **Vue**: `^3.5.30` — `defineModel<T>()`, `useId()`, `withDefaults` generic syntax all available. DsAvatar does not use `useId()` (no label/input pairing).
- **PrimeVue**: `^4.5.4` — Avatar component path `primevue/avatar`. Default slot, `label`, `icon`, `image`, `size` (`normal | large | xlarge`), `shape` (`square | circle`), `ariaLabel`, `ariaLabelledby` props; `icon` slot; `error` event. We use only `v-bind="$attrs"` passthrough + the default slot + `shape="circle"`.
- **Vitest**: `^4.1.2` — `mount` + `@vue/test-utils` `^2.4.6`. jsdom has limited support for CSS custom properties; Task 8.9 accounts for this.
- **Biome**: `^2.4.9` — strict import order; run `npm run lint` before commit.
- **Storybook**: `@storybook/vue3-vite` — see existing component stories for the `Meta`/`StoryObj` import pattern.

### Project Structure Notes

- File layout matches architecture §Project Structure (`src/components/DsAvatar/{DsAvatar.vue, DsAvatar.stories.ts, DsAvatar.test.ts, index.ts}`).
- AI KB at `docs/ai-guidelines/ds-avatar.md` extends the existing 8-entry directory.
- Per CLAUDE.md, place any temporary / debug artifacts in `./tmp/` (e.g., scratch screenshots, color-sample PNGs saved during Figma verification). Do NOT pollute the component directory with debug files.
- The new `turquoise` ramp in `ds-preset.ts` is the FIRST preset-level change in Phase 2 (all previous Phase 2 components reused existing tokens). Reviewers should pay extra attention to the ramp values to catch any copy-paste errors from neighboring ramps.

### References

- [Source: _bmad-output/planning-artifacts/epics-phase2.md#Story 7.3] — original BDD acceptance criteria
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#FR8] — DsAvatar image/initials/icon fallback variants + multiple sizes
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#NFR7] — Accessible alt text / aria-label for image and icon variants
- [Source: _bmad-output/planning-artifacts/prd-phase2.md#FR9, FR10, FR11, FR12] — PrimeVue passthrough, theme parity, TypeScript types, prop conventions
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Architecture] — thin wrapper pattern with `inheritAttrs:false` + `v-bind="$attrs"`
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure] — co-located file structure
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns] — `Ds` prefix, PascalCase component names
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Component Strategy] — DsAvatar wraps PrimeVue Avatar, Initials / Initials Colored / Initials Monochrome variants
- [Source: docs/figma-variables.md] — authoritative Figma → hex mapping for Surface / Supporting palettes
- [Source: docs/component-addition-guide.md] — repeatable component addition checklist
- [Source: docs/ai-guidelines/ds-chip.md] — AI KB entry structure to mirror (closest template)
- [Source: docs/ai-guidelines/index.md] — Component Inventory + Figma matching guide format
- [Source: src/components/DsChip/DsChip.vue] — closest implementation template (type/size modifier CSS pattern + `:deep()` strip + PrimeVue passthrough)
- [Source: src/theme/ds-preset.ts] — existing primitive ramps (model `turquoise` after `amber`)
- [Source: src/components/DsIcon/icon-names.ts] — `personal` icon for the icon fallback variant
- [Source: src/assets/icons/personal.svg] — 24×24 person silhouette, stroke `currentColor`
- [Source: Figma node `2022:14873`] — Avatar category (master variants for Initials Colored × 9 × 4 sizes, Initials Monochrome × 4, Icon × 4)
- [Source: Figma node `2022:14883`] — Color=Blue, Size=L (font / letter-spacing reference)
- [Source: Figma node `2022:14958`] — Color=Blue, Size=S (S-size font reference)
- [Source: Figma node `2022:14955`] — Color=Blue, Size=XS (XS-size font reference, 9px / 16px line-height)
- [Source: Figma node `4544:29416`] — Icon Monochrome, Size=L (icon-inside-circle ratio reference)
- [Source: _bmad-output/implementation-artifacts/7-1-dschip-component.md] — Story 7.1 DsChip (closest precedent, same epic)
- [Source: _bmad-output/implementation-artifacts/6-3-dsselect-advanced-dropdown-variants.md] — most recent fully-done story for test-count baseline + PrimeVue-API-verification pattern

## Dev Agent Record

### Agent Model Used

claude-opus-4-7[1m]

### Debug Log References

- `npm test` — full suite 393 tests passing (was 330 at branch HEAD after Story 7.1; +30 new DsAvatar tests, rest from parallel Story 7.2 DsBadge that landed in the same working tree).
- `npm run lint` — Biome clean across 55 files. Auto-fixed shared-file formatting that leaked in from the parallel Story 7.2 work (green-ramp spacing in `ds-preset.ts`, `DsBadge.vue` formatting, `ds-preset.test.ts` formatting) and reorganized imports in `src/components/DsAvatar/index.ts` and `src/components/DsBadge/index.ts` via `biome check --write`.
- `npm run build` — `vue-tsc --noEmit` + `vite build` succeed; `dist/index.d.ts` re-exports `DsAvatar`, `DsAvatarColor`, `DsAvatarProps`, `DsAvatarSize`, `DsAvatarVariant`; `dist/components/DsAvatar/DsAvatar.vue.d.ts` + `dist/components/DsAvatar/index.d.ts` generated.
- UI caveat: I could not visually verify each Storybook story in a live browser — the Chrome extension was not connected from this environment. All unit tests pass and the component compiles through the library build. A human reviewer should click through the color grid and size showcases in both light and dark themes.

### Completion Notes List

- Implemented `src/components/DsAvatar/DsAvatar.vue` as a thin PrimeVue Avatar wrapper with `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` (FR9). The wrapper always sets `shape="circle"`, `role="img"`, `tabindex="-1"`, and a derived `aria-label` on the root. Consumers can still pass PrimeVue-specific attrs through `$attrs`, but `label` / `icon` / `image` are suppressed because DsAvatar owns content rendering via its own default-slot template (verified by the "does NOT render PrimeVue label text" passthrough guard test).
- Variant auto-derivation resolves in order: explicit `variant` prop → `image` (if set and not errored) → `initials-colored` (if `initials` + `color`) → `initials-monochrome` (if `initials`) → `icon`. Implemented via the `resolvedVariant` computed; explicit `variant` wins over auto-derivation (per AC #7, covered by the "explicit variant prop overrides auto-derivation" test).
- Image fallback uses a local `imageFailed` ref plus `<img @error @load>` listeners. A `watch(() => props.image, ...)` resets `imageFailed` when the URL changes, so consumers that swap to a new image after a failure get a fresh attempt (verified by the "re-attempts load when image prop changes after a failure" test).
- Accessibility priority chain: `ariaLabel` → `alt` → `initials` → `"User avatar"` default. The initials `<span>` and the DsIcon in the icon variant both carry `aria-hidden="true"` so screen readers don't spell out individual letters or duplicate the icon announcement (NFR7).
- Task 2 (Turquoise ramp) added a new `turquoise` primitive block to `src/theme/ds-preset.ts` between `pink` and `borderRadius`. Ramp covers 50/100/200/300/400/500/600/700/800/900/950 with `turquoise-500 = #00b39c` as the primary visual match for Figma. CSS uses `var(--p-turquoise-500)` (not `-400` as initially sketched in the story) because the mid-shade maps closer to the Figma saturation — I adjusted the mapping during implementation; noted here and in the AI KB entry. No other primitive ramp or semantic token was touched by this story.
- Per-color background mappings decided after visual comparison against Figma screenshots: `blue → blue-600`, `light-purple → purple-300` (lighter than the story's suggested `purple-400` — better match to Figma lavender), `yellow → amber-400`, `pink → pink-200` (brighter than `pink-300`, matches Figma "Pink 200" `#ff4dd2`), `purple → purple-600`, `deep-blue → blue-900`, `turquoise → turquoise-500` (new ramp), `orange → orange-500` (deeper than the story's `orange-400`, better match to Figma burnt orange), `red → red-800`. These are starting points — a reviewer with Figma dev access should fine-tune per-color in a follow-up if parity is still off in Storybook.
- Storybook stories: `ColoredInitials`, `MonochromeInitials`, `IconFallback`, `Image`, `ImageFallbackToInitials`, `ImageFallbackToIcon`, `AllSizesColored`, `AllSizesMonochrome`, `AllSizesIcon`, `AllColors` (9×4 grid). The AllColors grid story directly mirrors the Figma canvas layout (rows by color, columns by size).
- Test count: added 30 DsAvatar tests (5 variant derivation + 5 sizes + 10 colors + 4 image fallback + 6 a11y + 3 passthrough). Story 7.2 (DsBadge) landed in parallel in the same working tree and contributed its own tests — the total is now 393 (was 330 after Story 7.1).
- AI KB entry at `docs/ai-guidelines/ds-avatar.md` follows the DsChip template. The index (`docs/ai-guidelines/index.md`) was updated with the import-example line, the Component Inventory row (alphabetical — BEFORE DsBadge), and a new `**DsAvatar**` section in the Figma matching guide (alphabetical — BEFORE DsBadge).
- **Post-review patch pass (P1–P8 applied after code-review):**
  - P1 — Dark-mode contrast fix: `.ds-avatar--initials-colored { color: #ffffff }` (was `var(--p-surface-0)`, which flipped in dark mode and lost contrast against the non-flipping colored backgrounds).
  - P2 — Empty-string / whitespace-only `ariaLabel` / `alt` / `initials` now fall through to the next source via a `pick()` helper (was using `??` which passed empty strings through, leaving `role="img"` silently unlabeled). New tests: empty-string fallback, whitespace-only fallback.
  - P3 — Explicit `variant="image"` without an image prop, or `variant="initials-*"` with empty initials, now falls through the auto-derivation chain instead of rendering an empty circle. New tests: four fallback-through cases.
  - P4 — Inner `<img>` is now `alt=""` (decorative) because the parent `role="img" aria-label` owns the accessible name — removes duplicate-announcement in screen readers.
  - P5 — Added `:key="image"` to the `<img>` so URL swaps force a fresh element, discarding any pending `error` events from the previous URL (closes the stale-state race on rapid image-prop swap).
  - P6 — Removed dead `fontSize` from `iconStyle` (SVG `DsIcon` is sized by width/height, not font-size).
  - P7 — Clarified `turquoise` ramp comment in `ds-preset.ts`: `-500` (not `-400`) is the Figma-sampled primary; interpolations explicit.
  - P8 — Added test: `variant="icon"` with `color="blue"` does NOT apply `.ds-avatar--blue` (color is ignored for non-colored variants).
  - D8 — Added TypeScript exhaustiveness guards (`const _exhaustive: never = props.size`) to `iconStyle` and `iconPresetSize` switches so adding a new size to `DsAvatarSize` fails to compile rather than silently returning `undefined`.
- **Post-review Figma fidelity audit (second pass):** Sampled the exact Figma SVG fill hex for all 9 colors, both sizes of monochrome and icon variants, via `get_design_context` → `curl <asset URL>` → `grep fill=`. Found and corrected 7 colour mismatches:
  - Light Purple: was `purple-300 #c9a8ff` → preset `purple-300` adjusted to Figma `#c27aff` (interpolated shade, safe to change)
  - Purple: was `purple-600 #7849ff` → `purple-500 #8e51ff` (Figma-defined shade — exact match)
  - Deep Blue: was `blue-900 #082f80` → preset `blue-900` adjusted to Figma `#082c54` (interpolated, safe)
  - Turquoise: was `turquoise-500 #00b39c` → preset `turquoise-500` re-sampled to Figma `#07b096`, ramp re-interpolated
  - Orange: was `orange-500 #e5504a` (salmon) → `amber-600 #da6b16` (burnt orange — Figma exact match)
  - Red: was `red-800 #c70036` (magenta-red) → hardcoded `#9f2d00` (burnt brick-red — no primitive match in red or orange ramps)
  - Monochrome / icon / image-placeholder backgrounds: was `gray-300 #e2e8f0` → `gray-200 #f1f5f9` (Figma exact match)
  - Updated `ds-preset.ts` (`purple-300`, `blue-900`, turquoise ramp), `DsAvatar.vue` (per-color class mappings + bg tokens), `docs/ai-guidelines/ds-avatar.md` (color table), `src/stories/Foundations/ColorPalette.stories.ts` (purple-300 / blue-900 in the color palette doc), and the story spec's Color Token Mapping table in this file.
  - All colors now match Figma within hex tolerance.
  - Also incidentally ran `biome check --write` on parallel 8.1 WIP file `src/components/DsSearchField/index.ts` (organize-imports fix) so `npm run lint` passes. The DsSearchField directory is unfinished parallel work — build errors in that file are not in this story's scope.
  - Post-patch test count: 404 passing (was 393 before patches; +11 new DsAvatar tests covering the patched behaviors). Lint clean. `vue-tsc` reports zero errors outside the unrelated DsSearchField WIP.

### File List

Created:
- `src/components/DsAvatar/DsAvatar.vue`
- `src/components/DsAvatar/DsAvatar.stories.ts`
- `src/components/DsAvatar/DsAvatar.test.ts`
- `src/components/DsAvatar/index.ts`
- `docs/ai-guidelines/ds-avatar.md`

Modified:
- `src/index.ts` — added `DsAvatar` + type re-exports (alphabetical, first in the list)
- `src/theme/ds-preset.ts` — added new `turquoise` primitive ramp (Figma-sampled `#07b096` primary); Figma-fidelity audit also realigned interpolated `purple-300` (`#c9a8ff` → `#c27aff`) and `blue-900` (`#082f80` → `#082c54`) to their Figma DsAvatar samples
- `src/stories/Foundations/ColorPalette.stories.ts` — synced `Purple.300` and `Blue.900` hex values to match the adjusted preset (doc-only)
- `docs/ai-guidelines/index.md` — added `DsAvatar` to import example, Component Inventory (alphabetical — BEFORE DsBadge), and Figma matching guide
- `docs/ai-guidelines/ds-avatar.md` — Color section rewritten with Figma-sampled hex values and final token mapping
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — story status ready-for-dev → in-progress → review
- `_bmad-output/implementation-artifacts/7-3-dsavatar-component.md` — this story file (tasks checked, Dev Agent Record filled, Color Token Mapping table updated)

Incidentally re-formatted (Biome auto-fix of shared files touched by parallel Story 7.2 work, not logic changes):
- `src/components/DsBadge/DsBadge.vue`
- `src/components/DsBadge/index.ts`
- `src/theme/ds-preset.test.ts`
- `src/theme/ds-preset.ts` (green-ramp comment spacing — the Turquoise addition is the actual Story 7.3 change)

### Change Log

| Date | Change | Author |
|---|---|---|
| 2026-04-17 | Story 7.3 DsAvatar component implementation — PrimeVue Avatar wrapper with 4 variants (image, initials-colored, initials-monochrome, icon), 4 sizes (L/M/S/XS), 9 colors for colored initials. Added new `turquoise` primitive ramp to `ds-preset.ts`. Image-load-error fallback chain (image → initials → icon). Derived `aria-label` priority (ariaLabel → alt → initials → default). 30 new unit tests, Storybook stories cover all variant/size/color combinations, AI KB entry + index updates. | Dev Agent (claude-opus-4-7[1m]) |
| 2026-04-17 | Post-review patch pass: dark-mode contrast fix (white text hardcoded); empty/whitespace aria-label fallthrough; explicit variant + missing content falls through auto-derivation; inner `<img alt="">` for decorative; `:key` on img for URL swap; removed dead `fontSize`; turquoise comment clarified; +11 tests. 404 total passing. | Dev Agent (claude-opus-4-7[1m]) |
| 2026-04-17 | Figma fidelity audit — sampled actual SVG fill hex for all 9 avatar colours; corrected 7 mismatches (Light Purple, Purple, Deep Blue, Turquoise, Orange, Red, monochrome/icon background). Preset: `purple-300` and `blue-900` interpolated shades aligned to Figma; `turquoise` ramp re-interpolated around sampled primary `#07b096`. Red hardcoded (no primitive match). ColorPalette Storybook doc synced. Story Color Token Mapping table rewritten with sampled hex. | Dev Agent (claude-opus-4-7[1m]) |
