import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { buildJsonLd, buildLlmsTxt, buildRobots, buildSitemap, siteUrlFromEnv } from './src/seo-data.js';

// Generates canonical/OG URLs, JSON-LD, robots.txt, sitemap.xml and llms.txt.
// Absolute URLs need the live domain: set SITE_URL, or deploy on Vercel (VERCEL_PROJECT_PRODUCTION_URL is used).
function seo() {
  const url = siteUrlFromEnv(process.env);
  return {
    name: 'filmyhardik-seo',
    transformIndexHtml() {
      const tags = [
        { tag: 'script', attrs: { type: 'application/ld+json' }, children: JSON.stringify(buildJsonLd(url)), injectTo: 'head' },
      ];
      if (url) {
        tags.push(
          { tag: 'link', attrs: { rel: 'canonical', href: `${url}/` }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:url', content: `${url}/` }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:image', content: `${url}/og-image.png` }, injectTo: 'head' },
          { tag: 'meta', attrs: { name: 'twitter:image', content: `${url}/og-image.png` }, injectTo: 'head' }
        );
      }
      return tags;
    },
    generateBundle() {
      const emit = (fileName, source) => this.emitFile({ type: 'asset', fileName, source });
      emit('robots.txt', buildRobots(url));
      emit('llms.txt', buildLlmsTxt(url));
      emit('llms-full.txt', buildLlmsTxt(url, true));
      if (url) emit('sitemap.xml', buildSitemap(url));
    },
  };
}

export default defineConfig({ plugins: [react(), seo()] });
