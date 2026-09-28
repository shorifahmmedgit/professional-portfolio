import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://shorif-ahmmed.onrender.com',
  integrations: [sitemap()],
  output: 'static',
  trailingSlash: 'never',
  compressHTML: true,
});
