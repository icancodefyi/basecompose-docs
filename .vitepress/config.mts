import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "docs",
  title: "BaseCompose ",
  description: "AI-powered stack generator for full-stack applications.",
  ignoreDeadLinks: true,
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', href: '/logo.png' }],
    ['meta', { property: 'og:image', content: '/og-image.png' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: '/og-image.png' }]
  ],
  themeConfig: {
    logo: '/logo.png',
    editLink: {
      pattern: 'https://github.com/icancodefyi/basecompose/edit/main/basecompose-docs/docs/:path',
      text: 'Edit this page on GitHub'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Features', link: '/features' },
      { text: 'Architecture', link: '/architecture' },
      { text: 'Contributing', link: '/contributing' },
      { text: 'FAQ', link: '/faq' },
      { text: 'License', link: '/license' }
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/introduction' },
          { text: 'Live Demo & Quick Start', link: '/quickstart' },
          { text: 'Getting Started', link: '/getting-started' },
        ]
      },
      {
        text: 'Core Concepts',
        items: [
          { text: 'Features Overview', link: '/features' },
          { text: 'Project Structure', link: '/project-structure' },
          { text: 'Architecture & Generation Flow', link: '/architecture' },
          { text: 'Supported Technologies & Stacks', link: '/technologies' },
        ]
      },
      {
        text: 'How To Use',
        items: [
          { text: 'Usage Guide', link: '/usage-guide' },
          { text: 'Templates & Addons', link: '/templates' },
          { text: 'Environment Variables', link: '/env-vars' },
        ]
      },
      {
        text: 'Development',
        items: [
          { text: 'Development Setup', link: '/dev-setup' },
          { text: 'Contribution Guide', link: '/contributing' },
        ]
      },
      {
        text: 'Help & Community',
        items: [
          { text: 'FAQ & Troubleshooting', link: '/faq' },
          { text: 'Security & Code of Conduct', link: '/security' },
        ]
      },
      {
        text: 'Meta',
        items: [
          { text: 'Release Notes & Changelog', link: '/changelog' },
          { text: 'License', link: '/license' },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/icancodefyi/basecompose' }
    ]
  }
})
