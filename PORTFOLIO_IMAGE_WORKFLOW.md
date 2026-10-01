# Portfolio image workflow

## Architecture

Google Drive is the private source of truth. The sync creates public-safe, metadata-free WebP copies in `public/media/`; the generated `src/data/portfolio-images.json` drives the Astro components. GitHub stores only approved optimized assets, and Cloudflare Pages serves them after the normal production build.

`Google Drive → safe review/redaction → pnpm sync:portfolio-images → public/media + manifest → GitHub → Cloudflare Pages`

No Google Drive links, credentials, source filenames, or tokens are rendered in the website.

## Drive folders

```text
Portfolio Website Images/
├── My Photos/
└── Work Photos/
    ├── 2D Pattern Photos/<style>/
    ├── CLO 3D Photos/<style>/
    └── Actual Sample Photos/<style>/
```

Capitalization and common suffixes such as `CLO 3D`, `2D`, `Pattern`, `Gerber`, `PDS`, `Actual Sample`, and `Sample` are normalized. Ambiguous or exceptional names belong in `src/data/work-image-map.json`; the sync does not guess beyond these conservative rules.

Only stages containing images are rendered. An empty `My Photos` folder hides the professional-photo section cleanly.

## Add a new work item

For a style named “Shirt”, add any available stages:

```text
Work Photos/2D Pattern Photos/Shirt/
Work Photos/CLO 3D Photos/Shirt/
Work Photos/Actual Sample Photos/Shirt/
```

Then run `pnpm sync:portfolio-images` and `pnpm build`. If the style names differ materially between stages, add one explicit alias to `src/data/work-image-map.json`.

## Authorized Drive sync

Codex can use the connected Google Drive account to retrieve approved files, as performed for the initial sync. For command-line Drive access, provide short-lived credentials outside the repository:

```powershell
$env:GOOGLE_DRIVE_ACCESS_TOKEN="<short-lived OAuth token>"
$env:PORTFOLIO_DRIVE_ROOT_ID="<Portfolio Website Images folder ID>"
corepack pnpm sync:portfolio-images
```

Without these environment variables, the command processes the existing private `.portfolio-sync/` staging area. It never automatically deletes repository assets. Review confidential markings before publication; add exclusions/redaction coordinates in the mapping file when required.

## Publishing safeguards

- Publish only images owned by or approved for the portfolio.
- Exclude buyer names/logos, style numbers, measurements, tech-pack text, internal comments and proprietary pattern details.
- HEIC/JPEG/PNG sources become WebP at a maximum 1600 px edge, with metadata stripped and aspect ratio preserved.
- Non-critical images lazy-load; intrinsic width and height prevent layout shift.
