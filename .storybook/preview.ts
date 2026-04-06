import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '../src/styles/base.css';
import type { Preview } from '@storybook/vue3-vite';
import { setup } from '@storybook/vue3-vite';
import PrimeVue from 'primevue/config';
import { dsTheme } from '../src/theme/ds-preset';

// Register PrimeVue with design system theme (includes darkModeSelector: '.p-dark')
setup((app) => {
  app.use(PrimeVue, { theme: dsTheme });
});

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (story, context) => {
      const theme = context.globals.theme || 'light';
      document.documentElement.classList.toggle('p-dark', theme === 'dark');
      return story();
    },
  ],
};

export default preview;
