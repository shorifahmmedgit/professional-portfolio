import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://professional-portfolio-62s.pages.dev',
  integrations: [sitemap()],
  output: 'static',
  trailingSlash: 'never',
  compressHTML: true,
});

