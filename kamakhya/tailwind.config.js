/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		opacity: Object.fromEntries(Array.from({ length: 101 }, (_, i) => [i, `${i / 100}`])),
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
  			plum: {
  				DEFAULT: '#3D141E',
  				800: '#2C0F16',
  				700: '#4A1826',
  				600: '#5C1D2E'
  			},
  			maroon: '#5C1D2E',
  			lotus: {
  				DEFAULT: '#E85D75',
  				400: '#F08FA2',
  				200: '#FBD0DA',
  				100: '#FFE7EC'
  			},
  			berry: '#8E1F45',
  			lavender: {
  				DEFAULT: '#E9D5FF',
  				100: '#F5EBFF'
  			},
  			peach: {
  				DEFAULT: '#FFEDD5',
  				200: '#FFF6E9'
  			},
  			blush: '#FFF8F6',
  			cream: '#FFFDFB',
  			gold: '#F7B267'
  		},
  		fontFamily: {
  			heading: ['var(--font-heading)'],
  			body: ['var(--font-body)'],
  			display: ['var(--font-display)'],
  			mono: ['var(--font-mono)']
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'float-slow': {
  				'0%, 100%': { transform: 'translate3d(0,0,0)' },
  				'50%': { transform: 'translate3d(6px,-18px,0)' }
  			},
  			'float-slower': {
  				'0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
  				'50%': { transform: 'translate3d(-10px,20px,0) scale(1.06)' }
  			},
  			'aura': {
  				'0%': { transform: 'scale(0.85)', opacity: '0.6' },
  				'70%': { transform: 'scale(1.6)', opacity: '0' },
  				'100%': { transform: 'scale(1.6)', opacity: '0' }
  			},
  			'shimmer': {
  				'0%': { backgroundPosition: '0% 50%' },
  				'100%': { backgroundPosition: '200% 50%' }
  			},
  			'dot-wave': {
  				'0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.45' },
  				'30%': { transform: 'translateY(-5px)', opacity: '1' }
  			},
  			'spin-slow': { to: { transform: 'rotate(360deg)' } },
  			'rise': {
  				from: { opacity: '0', transform: 'translate3d(0,14px,0)' },
  				to: { opacity: '1', transform: 'translate3d(0,0,0)' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'float-slow': 'float-slow 9s ease-in-out infinite',
  			'float-slower': 'float-slower 14s ease-in-out infinite',
  			'aura': 'aura 3s ease-out infinite',
  			'shimmer': 'shimmer 7s linear infinite',
  			'dot-wave': 'dot-wave 1.2s ease-in-out infinite',
  			'spin-slow': 'spin-slow 26s linear infinite',
  			'rise': 'rise 0.6s cubic-bezier(0.22,1,0.36,1) both'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}