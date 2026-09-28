# Shorif Ahmmed — professional portfolio

Evidence-led professional website for Shorif Ahmmed, a garment Pattern Master / Pattern Maker in Dhaka, Bangladesh.

## Stack

- Astro 7.3.3, statically rendered
- `@astrojs/sitemap` 3.7.4
- No client-side framework or analytics dependency
- Cloudflare-compatible `_headers`, `robots.txt`, sitemap and custom 404

## Local commands

```sh
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## Cloudflare deployment

- Production branch: `portfolio-deploy`
- Build command: `pnpm build`
- Output directory: `dist`
- Node version: current Cloudflare-supported LTS

The current `pages.dev` URL in `astro.config.mjs` is a deployment placeholder. Replace it with the assigned project URL after the first deployment, then replace it again when a permanent custom domain is approved. Update the canonical URL, sitemap URL and robots sitemap together.

## Publishing rule

Public content is derived from the private Google Drive SSOT only after factual, privacy and confidentiality review. Never commit buyer tech packs, proprietary patterns, internal comments, private contact details or restricted garment images.
