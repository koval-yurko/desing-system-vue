import type { Meta, StoryObj } from '@storybook/vue3-vite';
import pkg from '../../package.json';
import DsLink from '../components/DsLink/DsLink.vue';

const meta = {
  title: 'Introduction',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const COMPONENTS = [
  {
    name: 'DsAvatar',
    description:
      'User avatar with image, initials, and icon fallback variants, 4 sizes, 9 colors for colored initials',
  },
  {
    name: 'DsBadge',
    description:
      'Status badge with 11 type variants (pending, interesting, neutral, rejected, accepted, cancel, border, clean, draft, loaded/shimmer, type10), optional 12px icons',
  },
  {
    name: 'DsButton',
    description:
      'Button with severity variants (primary, outlined, tertiary, text, text-link, negative) and 4 sizes',
  },
  {
    name: 'DsChip',
    description:
      'Tag/filter chip with default/selected/not-clickable types, 2 sizes, removable behavior',
  },
  {
    name: 'DsCodeInput',
    description:
      'PIN/OTP-style verification code input with per-cell states, configurable length, error message, and paste support',
  },
  {
    name: 'DsIcon',
    description: 'SVG icon from the design system icon set, 4 sizes',
  },
  {
    name: 'DsIconButton',
    description: 'Icon-only button with type variants (primary, outlined, text) and 3 sizes',
  },
  {
    name: 'DsInputText',
    description:
      'Text input with label, hint, error, clearable, and dropdown-icon support, 2 sizes',
  },
  {
    name: 'DsLink',
    description:
      'Hyperlink with type variants (regular, smart, quiet), visibility options, and 2 sizes',
  },
  {
    name: 'DsSearchField',
    description:
      'Search input with built-in search icon, clear button, optional filter/help button, 4 sizes (XXS/XS/S/M)',
  },
  {
    name: 'DsSelect',
    description:
      'Single-selection dropdown with label, hint, error, leading icon, clear button, and core dropdown menu styles, 2 sizes',
  },
  {
    name: 'DsTextarea',
    description:
      'Multi-line text input with label, hint, error, character counter, and clear button, 2 sizes',
  },
] as const;

const FIGMA_URL = 'https://www.figma.com/design/3qP5xnwc6gXhZR3AnFAMFe';
const REPO_URL = 'https://github.com/koval-yurko/desing-system-vue';

export const Default: Story = {
  render: () => ({
    components: { DsLink },
    setup() {
      return {
        components: COMPONENTS,
        version: pkg.version,
        packageName: pkg.name,
        figmaUrl: FIGMA_URL,
        repoUrl: REPO_URL,
      };
    },
    template: `
      <div style="max-width: 880px; padding: 24px; font-family: Inter, sans-serif; color: var(--p-gray-900);">
        <h1 style="margin: 0 0 8px; font-size: 28px; font-weight: 600;">{{ packageName }}</h1>
        <p style="margin: 0 0 24px; font-size: 14px; color: var(--p-gray-600);">Version {{ version }} - Vue 3 component library</p>

        <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6;">
          A Vue 3 design system component library built on PrimeVue with Figma design tokens.
          The library grows in response to real DS-GAP flags from AI agents and developers - every
          component here covers a Figma element that was previously hand-coded.
        </p>

        <h2 style="margin: 32px 0 12px; font-size: 20px; font-weight: 600;">Install</h2>
        <pre style="background: var(--p-gray-100); padding: 12px 16px; border-radius: 6px; font-family: monospace; font-size: 13px; overflow-x: auto;"><code>npm install {{ packageName }}</code></pre>

        <h2 style="margin: 32px 0 12px; font-size: 20px; font-weight: 600;">{{ components.length }} Components</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead>
            <tr style="border-bottom: 1px solid var(--p-gray-300);">
              <th style="text-align: left; padding: 8px 12px 8px 0; font-weight: 600;">Component</th>
              <th style="text-align: left; padding: 8px 0; font-weight: 600;">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in components" :key="c.name" style="border-bottom: 1px solid var(--p-gray-200);">
              <td style="padding: 10px 12px 10px 0; font-family: monospace; color: var(--p-purple-700); white-space: nowrap; vertical-align: top;">{{ c.name }}</td>
              <td style="padding: 10px 0; color: var(--p-gray-700); line-height: 1.5;">{{ c.description }}</td>
            </tr>
          </tbody>
        </table>

        <h2 style="margin: 32px 0 12px; font-size: 20px; font-weight: 600;">References</h2>
        <ul style="margin: 0 0 16px; padding-left: 20px; line-height: 1.8;">
          <li><strong>Figma source:</strong> <DsLink :href="figmaUrl" target="_blank" rel="noopener noreferrer">{{ figmaUrl }}</DsLink></li>
          <li><strong>Repository:</strong> <DsLink :href="repoUrl" target="_blank" rel="noopener noreferrer">{{ repoUrl }}</DsLink></li>
          <li><strong>AI knowledge base:</strong> <code style="background: var(--p-gray-100); padding: 2px 6px; border-radius: 3px; font-family: monospace;">docs/ai-guidelines/index.md</code></li>
        </ul>

        <h2 style="margin: 32px 0 12px; font-size: 20px; font-weight: 600;">Browse</h2>
        <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>Foundations</strong> - design tokens (colors, typography, spacing, shadows, radius, icons)</li>
          <li><strong>Components</strong> - all {{ components.length }} components with interactive controls and per-prop docs</li>
          <li><strong>Pages</strong> - composed page examples demonstrating the components together</li>
        </ul>

        <p style="margin: 32px 0 0; font-size: 13px; color: var(--p-gray-500);">
          Use the toolbar above to switch between light and dark themes.
        </p>
      </div>
    `,
  }),
};
