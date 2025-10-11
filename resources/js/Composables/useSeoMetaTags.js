import { useSeoMeta } from '@unhead/react'

// Default SEO meta tags
const defaultSeoMeta = {
  title: 'Home',
  titleTemplate: '%s | OctaFlows Modern Laravel SaaS Starter Kit',
  description: 'OctaFlows is a modern Laravel boilerplate for the RILT stack (React, Inertia, Laravel, TailwindCSS). Clone and start building scalable, maintainable, and production-ready applications quickly.',
  keywords: 'OctaFlows, Laravel boilerplate, Laravel RILT, React, Inertia, TailwindCSS, Laravel Octane, Docker, FilamentPHP, OpenAI integration, Laravel Cashier, Laravel Sanctum',
  robots: 'index, follow',
  themeColor: '#000000',

  // Open Graph
  ogTitle: '%s | OctaFlows Modern Laravel SaaS Starter Kit',
  ogDescription: 'OctaFlows is a modern Laravel SaaS starter kit for the RILT stack. Clone the repo, start building scalable and maintainable applications quickly.',
  ogUrl: 'https://octaflows.com',
  ogType: 'website',
  ogImage: 'https://octaflows.com/images/og.webp',
  ogSiteName: 'OctaFlows',
  ogLocale: 'en_US',

  // Twitter
  twitterTitle: '%s | OctaFlows Modern Laravel SaaS Starter Kit',
  twitterDescription: 'OctaFlows is a modern Laravel SaaS starter kit for the RILT stack. Clone the repo, start building scalable and maintainable applications quickly.',
  twitterCard: 'summary_large_image',
  twitterImage: 'https://octaflows.com/images/og.webp',
  twitterSite: '@pushpak1300',
}

/**
 * Composable for managing SEO meta tags
 * @param {object|null} seoMeta - Custom SEO meta tags to apply
 * @param {object} options - Configuration options
 * @param {boolean} options.merge - When true, merges custom meta tags with defaults.
 *                                 When false, only uses custom meta tags.
 *                                 Useful for pages that need completely custom SEO
 *                                 without inheriting defaults.
 * @returns {void}
 */
export function useSeoMetaTags(seoMeta, options = { merge: true }) {
  return useSeoMeta(
    !seoMeta ? defaultSeoMeta : (options.merge ? { ...defaultSeoMeta, ...seoMeta } : seoMeta),
  )
}
