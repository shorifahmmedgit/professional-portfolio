import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://shorif-ahmmed.pages.dev',
  integrations: [sitemap()],
  output: 'static',
  trailingSlash: 'never',
  compressHTML: true,
});

