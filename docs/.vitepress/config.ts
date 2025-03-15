import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vue Easy Pull Refresh",
  description: "Pull to refresh",
  base: '/vue-easy-pull-refresh/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Get Started', link: '/setup' },
      { text: 'API', link: '/usage' }
    ],

    sidebar: [
      {
        text: 'Guide',
        collapsed: true,
        items: [
          { text: 'Concepts', link: '/concepts' },
          { text: 'Setup', link: '/setup' }
        ]
      },
      {
        text: 'API',
        collapsed: true,
        items: [
          { text: 'Usage', link: '/usage' },
          { text: 'Component', link: '/component' },
          { text: 'Composables', link: '/composables' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/prochorz/vue-easy-pull-refresh' }
    ]
  }
})
