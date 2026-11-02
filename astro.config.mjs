// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Remplacez par votre nom de domaine définitif (voir DEPLOIEMENT.md).
// Il sert aux URL canoniques, aux balises Open Graph et au sitemap.
const SITE_URL = process.env.SITE_URL ?? 'https://www.mathieu-gilles.fr';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  image: {
    layout: 'constrained',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
});
