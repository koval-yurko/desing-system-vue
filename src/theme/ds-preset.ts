import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import type { Theme } from '@primeuix/themes/types';

// ---------------------------------------------------------------------------
// 1. PRIMITIVE — raw color palettes from Figma (docs/figma-variables.md)
//
// Missing shades are manually interpolated between neighboring Figma values.
// Figma-defined shades are marked inline.
// ---------------------------------------------------------------------------

export const dsPreset = definePreset(Aura, {
  primitive: {
    // Surface / Main Gray — overrides Aura's slate-based surface
    // Figma shades: 0, 100, 200, 300, 400, 500, 800, 900, 950
    // Interpolated: 50, 600, 700
    gray: {
      0: '#ffffff',
      50: '#f9fbfd',
      100: '#f8fafc',
      200: '#f1f5f9',
      300: '#e2e8f0',
      400: '#cad5e2',
      500: '#90a1b9',
      600: '#6a7d97',
      700: '#4c5f78',
      800: '#314158',
      900: '#1d293d',
      950: '#020618',
    },

    // Surface / Purple Brand — full ramp for PrimeVue primary
    // Figma shades: 50, 100, 500, 600, 800
    // Interpolated: 200, 300, 400, 700, 900, 950
    purple: {
      50: '#f7f6fd',
      100: '#f3e8ff',
      200: '#e0cfff',
      300: '#c27aff', // Figma DsAvatar "Light Purple" sample (#C27AFF) — was interpolated #c9a8ff
      400: '#ab7aff',
      500: '#8e51ff',
      600: '#7849ff',
      700: '#6b3ef2',
      800: '#5f33e6',
      900: '#4a27b3',
      950: '#2d1570',
    },

    // Surface / Negative Red
    // Figma shades: 50, 100, 400, 700, 800
    // Interpolated: 200, 300, 500, 600, 900, 950
    red: {
      50: '#fff1f2',
      100: '#ffe4e6',
      200: '#ffccd0',
      300: '#ffabb2',
      400: '#ff8b8b',
      500: '#f85a6a',
      600: '#f54356',
      700: '#f22a42',
      800: '#c70036',
      900: '#a0002c',
      950: '#5c0019',
    },

    // Supporting palettes — partial ramps from Figma
    blue: {
      50: '#f0f7ff',
      100: '#eef8fe',
      200: '#e7f4fe',
      300: '#c2dfff',
      400: '#6babf7',
      500: '#3584f0',
      600: '#0e5cf4',
      700: '#0b4ad0',
      800: '#0a3ba6',
      900: '#082c54', // Figma DsAvatar "Deep Blue" sample (#082C54) — was interpolated #082f80
      950: '#041a4a',
    },

    amber: {
      50: '#fffbf0',
      100: '#ffefdb',
      200: '#ffe0b5',
      300: '#ffcf8a',
      400: '#f8bc3b',
      500: '#e89b1e',
      600: '#da6b16',
      700: '#a33b16', // Figma taxt/supporting/amber/yellow-700 (updated from #b85712)
      800: '#94430e',
      900: '#70320a',
      950: '#3d1b05',
    },

    // Positive / Success Green
    // Figma shades: 100 (surfase/positive/green-100), 700 (taxt/positive/green-700)
    // Interpolated: 50, 200, 300, 400, 500, 600, 800, 900, 950
    green: {
      50: '#f2fbf6', // interpolated
      100: '#e0f6ed', // Figma surfase/positive/green-100
      200: '#b8ecd1', // interpolated
      300: '#8de0b3', // interpolated
      400: '#4fcb89', // interpolated
      500: '#1eae69', // interpolated
      600: '#11a062', // interpolated
      700: '#00995c', // Figma taxt/positive/green-700
      800: '#007d4b', // interpolated
      900: '#00613a', // interpolated
      950: '#003a22', // interpolated
    },

    orange: {
      50: '#fff5f5',
      100: '#ffe3e2',
      200: '#ffc7c5',
      300: '#ffa19e',
      400: '#f47570',
      500: '#e5504a',
      600: '#d94038',
      700: '#cc332b',
      800: '#a32822',
      900: '#7f1f1a',
      950: '#450f0d',
    },

    pink: {
      50: '#fff0fb',
      100: '#ffe0f7',
      200: '#ff4dd2',
      300: '#df00b4',
      400: '#c00098',
      500: '#a30082',
      600: '#87006b',
      700: '#6b0055',
      800: '#530042',
      900: '#3d0031',
      950: '#21001a',
    },

    // Supporting palette — Turquoise
    // Figma shade: 500 = `#07b096` (sampled from DsAvatar asset node 2022:14973).
    // All other shades interpolated around that primary. DsAvatar consumes the
    // `-500` shade as the colored-initials background.
    turquoise: {
      50: '#effcf9',
      100: '#ccf5ec',
      200: '#99ead8',
      300: '#4dd5bd',
      400: '#1fc2a8',
      500: '#07b096',
      600: '#058d79',
      700: '#046a5b',
      800: '#03473d',
      900: '#02302a',
      950: '#011a17',
    },

    // Border radius (Figma tokens: non/md/lg/xl)
    borderRadius: {
      none: '0',
      xs: '2px',
      sm: '4px',
      md: '4px',
      lg: '8px',
      xl: '12px',
    },
  },

  semantic: {
    // Primary color mapped to Purple brand
    primary: {
      50: '{purple.50}',
      100: '{purple.100}',
      200: '{purple.200}',
      300: '{purple.300}',
      400: '{purple.400}',
      500: '{purple.500}',
      600: '{purple.600}',
      700: '{purple.700}',
      800: '{purple.800}',
      900: '{purple.900}',
      950: '{purple.950}',
    },

    // Typography
    transitionDuration: '0.2s',
    focusRing: {
      width: '1px',
      style: 'solid',
      color: '{primary.color}',
      offset: '2px',
      shadow: 'none',
    },

    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '{gray.50}',
          100: '{gray.100}',
          200: '{gray.200}',
          300: '{gray.300}',
          400: '{gray.400}',
          500: '{gray.500}',
          600: '{gray.600}',
          700: '{gray.700}',
          800: '{gray.800}',
          900: '{gray.900}',
          950: '{gray.950}',
        },
        primary: {
          color: '{primary.600}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.700}',
          activeColor: '{primary.800}',
        },
        highlight: {
          background: '{primary.50}',
          focusBackground: '{primary.100}',
          color: '{primary.700}',
          focusColor: '{primary.800}',
        },
        formField: {
          background: '{surface.0}',
          disabledBackground: '{surface.200}',
          filledBackground: '{surface.50}',
          filledHoverBackground: '{surface.50}',
          filledFocusBackground: '{surface.50}',
          borderColor: '{surface.300}',
          hoverBorderColor: '{surface.400}',
          focusBorderColor: '{primary.color}',
          invalidBorderColor: '{red.400}',
          color: '{surface.800}',
          disabledColor: '{surface.500}',
          placeholderColor: '{surface.500}',
          invalidPlaceholderColor: '{red.600}',
          floatLabelColor: '{surface.500}',
          floatLabelFocusColor: '{primary.600}',
          floatLabelActiveColor: '{surface.500}',
          floatLabelInvalidColor: '{form.field.invalid.placeholder.color}',
          iconColor: '{surface.400}',
          shadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.05)',
        },
        text: {
          color: '{surface.800}',
          hoverColor: '{surface.900}',
          mutedColor: '{surface.500}',
          hoverMutedColor: '{surface.600}',
        },
        content: {
          background: '{surface.0}',
          hoverBackground: '{surface.100}',
          borderColor: '{surface.200}',
          color: '{text.color}',
          hoverColor: '{text.hover.color}',
        },
        overlay: {
          select: {
            background: '{surface.0}',
            borderColor: '{surface.200}',
            color: '{text.color}',
          },
          popover: {
            background: '{surface.0}',
            borderColor: '{surface.200}',
            color: '{text.color}',
          },
          modal: {
            background: '{surface.0}',
            borderColor: '{surface.200}',
            color: '{text.color}',
          },
        },
        list: {
          option: {
            focusBackground: '{surface.100}',
            selectedBackground: '{highlight.background}',
            selectedFocusBackground: '{highlight.focus.background}',
            color: '{text.color}',
            focusColor: '{text.hover.color}',
            selectedColor: '{highlight.color}',
            selectedFocusColor: '{highlight.focus.color}',
            icon: {
              color: '{surface.400}',
              focusColor: '{surface.500}',
            },
          },
          optionGroup: {
            background: 'transparent',
            color: '{text.muted.color}',
          },
        },
        navigation: {
          item: {
            focusBackground: '{surface.100}',
            activeBackground: '{surface.100}',
            color: '{text.color}',
            focusColor: '{text.hover.color}',
            activeColor: '{text.hover.color}',
            icon: {
              color: '{surface.400}',
              focusColor: '{surface.500}',
              activeColor: '{surface.500}',
            },
          },
          submenuLabel: {
            background: 'transparent',
            color: '{text.muted.color}',
          },
          submenuIcon: {
            color: '{surface.400}',
            focusColor: '{surface.500}',
            activeColor: '{surface.500}',
          },
        },
      },
      dark: {
        // Dark mode: semantic tokens reference high surface numbers for dark
        // backgrounds and low numbers for light text — same gray mapping as
        // light mode, matching the Aura convention (no surface inversion).
        surface: {
          0: '#ffffff',
          50: '{gray.50}',
          100: '{gray.100}',
          200: '{gray.200}',
          300: '{gray.300}',
          400: '{gray.400}',
          500: '{gray.500}',
          600: '{gray.600}',
          700: '{gray.700}',
          800: '{gray.800}',
          900: '{gray.900}',
          950: '{gray.950}',
        },
        primary: {
          color: '{primary.400}',
          contrastColor: '{surface.900}',
          hoverColor: '{primary.300}',
          activeColor: '{primary.200}',
        },
        highlight: {
          background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
          focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)',
        },
        formField: {
          background: '{surface.950}',
          disabledBackground: '{surface.700}',
          filledBackground: '{surface.800}',
          filledHoverBackground: '{surface.800}',
          filledFocusBackground: '{surface.800}',
          borderColor: '{surface.600}',
          hoverBorderColor: '{surface.500}',
          focusBorderColor: '{primary.color}',
          invalidBorderColor: '{red.300}',
          color: '{surface.0}',
          disabledColor: '{surface.400}',
          placeholderColor: '{surface.400}',
          invalidPlaceholderColor: '{red.400}',
          floatLabelColor: '{surface.400}',
          floatLabelFocusColor: '{primary.color}',
          floatLabelActiveColor: '{surface.400}',
          floatLabelInvalidColor: '{form.field.invalid.placeholder.color}',
          iconColor: '{surface.400}',
          shadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.02)',
        },
        text: {
          color: '{surface.0}',
          hoverColor: '{surface.0}',
          mutedColor: '{surface.400}',
          hoverMutedColor: '{surface.300}',
        },
        content: {
          background: '{surface.900}',
          hoverBackground: '{surface.800}',
          borderColor: '{surface.700}',
          color: '{text.color}',
          hoverColor: '{text.hover.color}',
        },
        overlay: {
          select: {
            background: '{surface.900}',
            borderColor: '{surface.700}',
            color: '{text.color}',
          },
          popover: {
            background: '{surface.900}',
            borderColor: '{surface.700}',
            color: '{text.color}',
          },
          modal: {
            background: '{surface.900}',
            borderColor: '{surface.700}',
            color: '{text.color}',
          },
        },
        list: {
          option: {
            focusBackground: '{surface.800}',
            selectedBackground: '{highlight.background}',
            selectedFocusBackground: '{highlight.focus.background}',
            color: '{text.color}',
            focusColor: '{text.hover.color}',
            selectedColor: '{highlight.color}',
            selectedFocusColor: '{highlight.focus.color}',
            icon: {
              color: '{surface.500}',
              focusColor: '{surface.400}',
            },
          },
          optionGroup: {
            background: 'transparent',
            color: '{text.muted.color}',
          },
        },
        navigation: {
          item: {
            focusBackground: '{surface.800}',
            activeBackground: '{surface.800}',
            color: '{text.color}',
            focusColor: '{text.hover.color}',
            activeColor: '{text.hover.color}',
            icon: {
              color: '{surface.500}',
              focusColor: '{surface.400}',
              activeColor: '{surface.400}',
            },
          },
          submenuLabel: {
            background: 'transparent',
            color: '{text.muted.color}',
          },
          submenuIcon: {
            color: '{surface.500}',
            focusColor: '{surface.400}',
            activeColor: '{surface.400}',
          },
        },
      },
    },
  },

  // Custom tokens not in PrimeVue's standard structure
  extend: {
    // Figma outline color groups
    // Values that match primitives use token references; values that differ
    // from primitives (e.g. outline gray200 #f1f3f4 vs surface gray200 #f1f5f9)
    // use hardcoded hex per Figma spec.
    outline: {
      main: {
        white: '#ffffff',
        gray100: '{gray.100}',
        gray200: '#f1f3f4',
        gray300: '{gray.300}',
        gray400: '{gray.400}',
        gray500: '{gray.500}',
        gray600: '#62748e',
        gray800: '{gray.800}',
        gray900: '{gray.900}',
      },
      brand: {
        purple400: '{purple.600}',
        purple450: '{purple.800}',
      },
      supporting: {
        blue300: '{blue.300}',
        blue600: '{blue.600}',
      },
      negative: {
        red700: '{red.700}',
      },
    },

    // Figma text color groups
    // Same approach: token references where values match primitives.
    textColor: {
      main: {
        white: '#ffffff',
        gray100: '{gray.100}',
        gray500: '{gray.500}',
        gray600: '#62748e',
        gray700: '#45556c',
        gray800: '{gray.800}',
        gray900: '{gray.900}',
      },
      brand: {
        purple600: '{purple.600}',
        purple800: '{purple.800}',
      },
      supporting: {
        blue600: '{blue.600}',
      },
      negative: {
        red700: '{red.700}',
      },
    },

    // Figma spacing scale
    spacing: {
      0: '0px',
      '0_5': '2px',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      8: '32px',
    },

    // Figma border width tokens
    borderWidth: {
      50: '1px',
      100: '1.2px',
      200: '1.5px',
    },

    // Figma shadow tokens — Figma spec uses drop-shadow() filter syntax but
    // PrimeVue applies these as box-shadow values, so we use box-shadow format.
    shadow: {
      xs: '0 1px 2px #e2e8f0',
      sm: '0 1px 6px #cad5e240, 0 1px 4px #cad5e280',
      shadow3: '0 1px 6px #b0bdc517, 0 6px 13px #b0bdc524, 0 1px 2px #3a485012',
      keyLight: '0 1px 0 #00000059',
      errorFocusRing: '0 0 0 3px #ffe4e6',
    },

    // Figma typography tokens
    font: {
      family: {
        heading: 'Inter, sans-serif',
        body: 'Inter, sans-serif',
      },
      weight: {
        normal: '400',
        medium: '500',
        semibold: '600',
      },
      size: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '20px',
        '2xl': '32px',
        '3xl': '30px',
      },
      lineHeight: {
        xs: '16px',
        sm: '20px',
        base: '24px',
        lg: '28px',
        '2xl': '40px',
        '3xl': '32px',
      },
      letterSpacing: {
        default: '-0.2px',
        xs: '0',
      },
    },

    // Figma semantic token colors
    token: {
      surface: {
        primaryBw00: '#ffffff',
        primaryBw01: '#fbfbfd',
      },
      text: {
        mainPrimary: '#20242e',
        negativeRed: '#e74343',
      },
    },
  },
});

// Recommended theme configuration including darkModeSelector.
// Usage: app.use(PrimeVue, { theme: dsTheme })
export const dsTheme: Theme = {
  preset: dsPreset,
  options: {
    darkModeSelector: '.p-dark',
  },
};
