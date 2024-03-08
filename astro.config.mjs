import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	markdown: {
		syntaxHighlight: 'prism',
	},
	redirects: {
		"/": "/intro/getting-started/",
	},

	integrations: [
		starlight({
			title: '@cardellini/ts-result',
			social: {
				github: 'https://github.com/DScheglov/ts-result',
			},
			components: {
				// Override the default `SocialIcons` component.
				SocialIcons: './src/components/SocialLinks/index.astro',
			},
			sidebar: [
				{
					label: 'Introduction',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Getting Started', link: '/intro/getting-started/' },
						{ label: 'Motivation', link: '/intro/motivation/' },
					],
				},
				{
					label: 'Tutorial',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Creating Results', link: '/guides/creating-result/' },
						{ label: 'Checking and Unwrapping', link: '/guides/checking-and-unwrapping/'},
						{ label: 'Mapping Result', link: '/guides/mapping-result/' },
						{ label: 'Chaining Computations', link: '/guides/chaining-computations/' },
						{ label: 'Imperative Style', link: '/guides/imperative-style/' },
						// { label: 'Example ', link: '/guides/example/' },
					],
				},
				{
					label: 'Result Instance Methods',
					autogenerate: { directory: 'result-instance-methods' },
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
