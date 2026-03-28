import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: 'var(--page-padding-x)',
        sm: 'var(--page-padding-x-sm)',
        lg: 'var(--page-padding-x-lg)',
      },
      screens: {
        '2xl': 'var(--container-2xl)',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
          subtle: 'hsl(var(--card-subtle) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'hsl(var(--success) / <alpha-value>)',
          foreground: 'hsl(var(--success-foreground) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning) / <alpha-value>)',
          foreground: 'hsl(var(--warning-foreground) / <alpha-value>)',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar) / <alpha-value>)',
          foreground: 'hsl(var(--sidebar-foreground) / <alpha-value>)',
          border: 'hsl(var(--sidebar-border) / <alpha-value>)',
          accent: 'hsl(var(--sidebar-accent) / <alpha-value>)',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground) / <alpha-value>)',
          muted: 'hsl(var(--sidebar-muted) / <alpha-value>)',
        },
        chart: {
          1: 'hsl(var(--chart-1) / <alpha-value>)',
          2: 'hsl(var(--chart-2) / <alpha-value>)',
          3: 'hsl(var(--chart-3) / <alpha-value>)',
          4: 'hsl(var(--chart-4) / <alpha-value>)',
          5: 'hsl(var(--chart-5) / <alpha-value>)',
        },
        'chart-grid': 'hsl(var(--chart-grid) / <alpha-value>)',
        'chart-axis': 'hsl(var(--chart-axis) / <alpha-value>)',
        stroke: {
          freestyle: 'hsl(var(--stroke-freestyle) / <alpha-value>)',
          backstroke: 'hsl(var(--stroke-backstroke) / <alpha-value>)',
          breaststroke: 'hsl(var(--stroke-breaststroke) / <alpha-value>)',
          butterfly: 'hsl(var(--stroke-butterfly) / <alpha-value>)',
          im: 'hsl(var(--stroke-im) / <alpha-value>)',
          drill: 'hsl(var(--stroke-drill) / <alpha-value>)',
          kick: 'hsl(var(--stroke-kick) / <alpha-value>)',
        },
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
        button: 'var(--radius-button)',
        input: 'var(--radius-input)',
        card: 'var(--radius-card)',
        dialog: 'var(--radius-dialog)',
        'chart-bar': 'var(--radius-chart-bar)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        'card-lift': 'var(--shadow-card-lift)',
        interactive: 'var(--shadow-interactive)',
        overlay: 'var(--shadow-overlay)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
      },
      fontSize: {
        'display-xl': [
          'var(--text-display-xl-size)',
          { lineHeight: 'var(--text-display-xl-leading)' },
        ],
        'display-lg': [
          'var(--text-display-lg-size)',
          { lineHeight: 'var(--text-display-lg-leading)' },
        ],
        'heading-xl': [
          'var(--text-heading-xl-size)',
          { lineHeight: 'var(--text-heading-xl-leading)' },
        ],
        'heading-lg': [
          'var(--text-heading-lg-size)',
          { lineHeight: 'var(--text-heading-lg-leading)' },
        ],
        'heading-md': [
          'var(--text-heading-md-size)',
          { lineHeight: 'var(--text-heading-md-leading)' },
        ],
        'heading-sm': [
          'var(--text-heading-sm-size)',
          { lineHeight: 'var(--text-heading-sm-leading)' },
        ],
        'body-lg': ['var(--text-body-lg-size)', { lineHeight: 'var(--text-body-lg-leading)' }],
        body: ['var(--text-body-size)', { lineHeight: 'var(--text-body-leading)' }],
        'body-sm': ['var(--text-body-sm-size)', { lineHeight: 'var(--text-body-sm-leading)' }],
        label: [
          'var(--text-label-size)',
          {
            lineHeight: 'var(--text-label-leading)',
            fontWeight: 'var(--text-label-weight)',
          },
        ],
        caption: ['var(--text-caption-size)', { lineHeight: 'var(--text-caption-leading)' }],
        'chart-tick': ['var(--text-chart-tick-size)', { lineHeight: '1rem' }],
        /** Dashboard KPI / hero metrics — larger tabular emphasis. */
        kpi: [
          'var(--text-kpi-size)',
          {
            lineHeight: 'var(--text-kpi-leading)',
            fontWeight: 'var(--text-kpi-weight)',
          },
        ],
      },
      spacing: {
        section: 'var(--space-section)',
        'section-sm': 'var(--space-section-sm)',
        'page-y': 'var(--page-padding-y)',
        card: 'var(--space-card)',
        form: 'var(--space-form)',
        'form-field': 'var(--space-form-field)',
        'list-gap': 'var(--space-list-gap)',
        stack: 'var(--gap-stack)',
        tight: 'var(--gap-tight)',
        relaxed: 'var(--gap-relaxed)',
        dialog: 'var(--dialog-padding)',
        popover: 'var(--popover-padding)',
        'table-x': 'var(--table-cell-padding-x)',
        'table-y': 'var(--table-cell-padding-y)',
        'chart-pad': 'var(--chart-container-padding)',
      },
      maxWidth: {
        content: 'var(--max-content-width)',
        page: 'var(--max-page-width)',
      },
      width: {
        sidebar: 'var(--sidebar-width)',
        'sidebar-collapsed': 'var(--sidebar-width-collapsed)',
      },
      height: {
        chart: 'var(--chart-min-height)',
        'sidebar-header': 'var(--sidebar-header-height)',
        'header-mobile': 'var(--header-height-mobile)',
      },
      minHeight: {
        chart: 'var(--chart-min-height)',
        'form-textarea': 'var(--form-textarea-min-height)',
        'chart-embed': 'var(--chart-embed-height)',
      },
      borderWidth: {
        stat: 'var(--stat-accent-width)',
      },
      transitionDuration: {
        'motion-fast': 'var(--motion-duration-fast)',
        'motion-normal': 'var(--motion-duration-normal)',
        'motion-slow': 'var(--motion-duration-slow)',
      },
      transitionTimingFunction: {
        'motion-standard': 'var(--motion-ease-standard)',
        'motion-emphasized': 'var(--motion-ease-emphasized)',
        'motion-decelerate': 'var(--motion-ease-decelerate)',
        'motion-out': 'var(--motion-ease-out)',
      },
      keyframes: {
        'swim-fade-up': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'swim-chart-fade': {
          from: { opacity: '0.88' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'swim-surface-in':
          'swim-fade-up var(--motion-duration-slow) var(--motion-ease-decelerate) both',
        'swim-chart-in':
          'swim-chart-fade var(--motion-duration-slow) var(--motion-ease-decelerate) both',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

export default config
