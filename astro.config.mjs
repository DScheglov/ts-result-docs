import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  markdown: {
    syntaxHighlight: 'prism'
  },
  redirects: {
    "/": "/intro/getting-started/"
  },
  integrations: [
    starlight({
    title: 'resultage',
    social: {
      github: 'https://github.com/DScheglov/ts-result'
    },
    customCss: [
      './src/styles.css',
    ],
    components: {
      // Override the default `SocialIcons` component.
      SocialIcons: './src/components/SocialLinks/index.astro'
    },
    sidebar: [{
      label: 'Introduction',
      items: [
      // Each item here is one entry in the navigation menu.
      {
        label: 'Getting Started',
        link: '/intro/getting-started/'
      }, {
        label: 'Motivation',
        link: '/intro/motivation/'
      }]
    }, {
      label: 'Tutorial',
      items: [
      // Each item here is one entry in the navigation menu.
      {
        label: 'Creating Results',
        link: '/tutorial/creating-result/'
      }, {
        label: 'Checking and Unwrapping',
        link: '/tutorial/checking-and-unwrapping/'
      }, {
        label: 'Mapping Result',
        link: '/tutorial/mapping-result/'
      }, {
        label: 'Chaining Computations',
        link: '/tutorial/chaining-computations/'
      }, {
        label: 'Imperative Style',
        link: '/tutorial/imperative-style/'
      }, {
        label: 'Iterating Over Results',
        link: '/tutorial/iterating-over-results/'
      }
      // { label: 'Example ', link: '/tutorial/example/' },
      ]
    }, {
      label: 'Result Instance Methods',
      autogenerate: {
        directory: 'result-instance-methods'
      }
    }, {
      label: 'Reference',
      autogenerate: {
        directory: 'reference'
      }
    }]
  })]
});