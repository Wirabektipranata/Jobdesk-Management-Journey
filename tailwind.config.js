/** @type {import('tailwindcss').Config} */

// ==================================================
// JOURNEYFX WORKSPACE
// Internal Jobdesk & Project Management System
// Version 1.0.0
// Premium Dark & Metallic Silver Design System
// ==================================================

export default {

  darkMode: 'class',

  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {

      // JOURNEYFX COLOR SYSTEM
      colors: {

        journey: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#15191E',
          950: '#0B0D10',
        },

        workspace: {
          background: '#0B0D10',
          sidebar: '#101318',
          surface: '#15191E',
          card: '#191D23',
          elevated: '#20252C',
          hover: '#252B33',
          border: '#30353C',
          divider: '#252A31',
          text: '#F5F5F5',
          muted: '#9CA3AF',
          silver: '#D1D5DB',
        },

        metallic: {
          light: '#FFFFFF',
          silver: '#D1D5DB',
          medium: '#A6ABB2',
          dark: '#777E87',
          steel: '#4B5563',
        },

        // TASK STATUS
        status: {
          pending: '#9CA3AF',
          progress: '#60A5FA',
          review: '#A78BFA',
          completed: '#34D399',
          overdue: '#F87171',
          cancelled: '#6B7280',
        },

        // TASK PRIORITY
        priority: {
          urgent: '#EF4444',
          high: '#F97316',
          medium: '#EAB308',
          low: '#94A3B8',
        },

        // SYSTEM FEEDBACK
        success: '#34D399',
        warning: '#FBBF24',
        danger: '#F87171',
        info: '#60A5FA',
      },

      // TYPOGRAPHY
      fontFamily: {
        sans: [
          'Inter',
          'Arial',
          'Helvetica',
          'sans-serif',
        ],

        display: [
          'Inter',
          'Arial',
          'sans-serif',
        ],

        mono: [
          'JetBrains Mono',
          'Consolas',
          'monospace',
        ],
      },

      fontSize: {
        '2xs': ['10px', '14px'],
        'display-sm': ['28px', '36px'],
        'display-md': ['36px', '44px'],
        'display-lg': ['48px', '56px'],
      },

      // RESPONSIVE BREAKPOINTS
      screens: {
        xs: '375px',
        '3xl': '1920px',
      },

      // DASHBOARD DIMENSIONS
      spacing: {
        sidebar: '260px',
        'sidebar-collapsed': '76px',
        header: '72px',
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
      },

      maxWidth: {
        workspace: '1920px',
        dashboard: '1600px',
        content: '1440px',
      },

      // BORDER RADIUS
      borderRadius: {
        card: '14px',
        panel: '18px',
        premium: '24px',
      },

      // PREMIUM SHADOWS
      boxShadow: {

        card: '0 4px 16px rgba(0,0,0,0.20)',

        panel: '0 8px 32px rgba(0,0,0,0.30)',

        premium: '0 12px 48px rgba(0,0,0,0.35)',

        metallic: '0 0 20px rgba(209,213,219,0.12)',

        glow: '0 0 24px rgba(255,255,255,0.08)',

        innerline:
          'inset 0 1px 0 rgba(255,255,255,0.06)',
      },

      // BACKGROUND GRADIENTS
      backgroundImage: {

        'metallic-silver':
          'linear-gradient(135deg, #FFFFFF 0%, #A6ABB2 45%, #F5F5F5 75%, #777E87 100%)',

        'workspace-dark':
          'linear-gradient(145deg, #0B0D10 0%, #15191E 100%)',

        'premium-card':
          'linear-gradient(145deg, #20252C 0%, #15191E 100%)',

        'silver-glow':
          'radial-gradient(ellipse at top, rgba(209,213,219,0.12), transparent 65%)',

        'dashboard-grid':
          'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',

        'shimmer':
          'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
      },

      backgroundSize: {
        'dashboard-grid': '32px 32px',
      },

      // ANIMATION KEYFRAMES
      keyframes: {

        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },

        fadeUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(12px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },

        slideIn: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-16px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },

        scaleIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.97)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },

        shimmer: {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },

        softPulse: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.55',
          },
        },

      },

      // ANIMATION UTILITIES
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out both',
        'fade-up': 'fadeUp 0.4s ease-out both',
        'slide-in': 'slideIn 0.3s ease-out both',
        'scale-in': 'scaleIn 0.25s ease-out both',
        'shimmer': 'shimmer 2s linear infinite',
        'soft-pulse': 'softPulse 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },

      // SMOOTH TRANSITIONS
      transitionDuration: {
        250: '250ms',
        400: '400ms',
        600: '600ms',
      },

      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },

      // LAYER MANAGEMENT
      zIndex: {
        dropdown: '40',
        sidebar: '45',
        header: '50',
        overlay: '60',
        modal: '70',
        toast: '80',
        tooltip: '90',
      },

    },
  },

  // CUSTOM JOURNEYFX COMPONENTS
  plugins: [

    function ({ addComponents, addUtilities, theme }) {

      addComponents({

        '.workspace-card': {
          backgroundColor: theme('colors.workspace.surface'),
          border: `1px solid ${theme('colors.workspace.border')}`,
          borderRadius: theme('borderRadius.card'),
          boxShadow: theme('boxShadow.card'),
          padding: '1.25rem',
        },

        '.workspace-panel': {
          backgroundColor: theme('colors.workspace.card'),
          border: `1px solid ${theme('colors.workspace.border')}`,
          borderRadius: theme('borderRadius.panel'),
          padding: '1.5rem',
        },

        '.btn-primary': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          backgroundColor: theme('colors.metallic.silver'),
          color: theme('colors.workspace.background'),
          fontWeight: '600',
          borderRadius: '10px',
          padding: '0.75rem 1.25rem',
          transition: 'all 200ms ease',

          '&:hover': {
            backgroundColor: theme('colors.metallic.light'),
          },

          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },

          '&:focus-visible': {
            outline: '2px solid #FFFFFF',
            outlineOffset: '3px',
          },
        },

        '.btn-secondary': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          backgroundColor: theme('colors.workspace.surface'),
          color: theme('colors.workspace.text'),
          border: `1px solid ${theme('colors.workspace.border')}`,
          borderRadius: '10px',
          padding: '0.75rem 1.25rem',
          transition: 'all 200ms ease',

          '&:hover': {
            backgroundColor: theme('colors.workspace.hover'),
          },

          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },

          '&:focus-visible': {
            outline: '2px solid #D1D5DB',
            outlineOffset: '3px',
          },
        },

        '.workspace-input': {
          width: '100%',
          backgroundColor: theme('colors.workspace.background'),
          color: theme('colors.workspace.text'),
          border: `1px solid ${theme('colors.workspace.border')}`,
          borderRadius: '10px',
          padding: '0.75rem 1rem',
          outline: 'none',
          transition: 'all 200ms ease',

          '&:focus': {
            borderColor: theme('colors.metallic.silver'),
            boxShadow: '0 0 0 3px rgba(209,213,219,0.10)',
          },

          '&::placeholder': {
            color: theme('colors.workspace.muted'),
          },
        },

      });

      addUtilities({

        '.text-metallic': {
          backgroundImage:
            theme('backgroundImage.metallic-silver'),
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        },

        '.glass-panel': {
          backgroundColor: 'rgba(21,25,30,0.80)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.08)',
        },

        '.scrollbar-workspace': {
          scrollbarWidth: 'thin',
          scrollbarColor: '#374151 #0B0D10',
        },

        '.scrollbar-hide': {
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },

      });

    },

  ],

};
