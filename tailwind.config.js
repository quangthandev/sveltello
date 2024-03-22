/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			keyframes: {
				fade: {
					from: { opacity: 0 },
					to: { opacity: 1 }
				}
			},
			animation: {
				fade: 'fade 0.4s'
			},
			transitionProperty: {
				width: 'width'
			},
			colors: {
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				}
			},
			height: {
				appHeader: 'var(--app-header-height)'
			},
			gridTemplateColumns: {
				'item-section': '24px 1fr',
				attachment: '100px 1fr'
			}
		}
	},
	plugins: []
};
