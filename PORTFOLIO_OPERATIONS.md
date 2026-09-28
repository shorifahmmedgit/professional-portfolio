# Portfolio Command Operations

This repository is operated as Shorif Ahmmed's command-driven professional portfolio.

## Operating rule
The owner should be able to request changes in natural language. The assistant must translate the request into safe source edits, commit them, allow auto-deploy, verify the live result, and report completion.

## Canonical sources
- Private professional facts/evidence: Google Drive SSOT.
- Public website source: this GitHub branch/repository.
- Runtime: current static hosting provider.
- Confidential buyer/employer documents never become public source material.

## Command patterns
Examples the owner can send:
- `Update About: add my new CLO 3D workflow.`
- `Change current role to ...`
- `Add experience: ...`
- `Add skill: ...`
- `Move this skill to learning, not expertise.`
- `Add project: <title> — <description>.`
- `Publish article: <topic>.`
- `Update CV and website together.`
- `Replace profile photo with this image.`
- `Hide the Research section.`
- `Add a new section called ...`
- `Update contact information.`
- `Audit the whole site and fix inconsistencies.`

## Change workflow
1. Interpret the owner's command.
2. Check Drive SSOT when the command changes a professional fact.
3. Check confidentiality/public-safety.
4. Update the mapped source file(s).
5. Commit to GitHub.
6. Auto-deploy.
7. Verify the public URL and metadata.
8. Log material changes in `PORTFOLIO_CHANGELOG.md`.

## Publication classes
- SAFE: public professional facts, public research, public-safe case studies.
- REVIEW: buyer names, employer examples, metrics, achievements, images from work.
- NEVER PUBLIC: buyer tech packs, proprietary blocks/patterns, internal comments/measurements, credentials, private personal-life data.

## Update scope map
See `portfolio.manifest.json`.

## Deployment behavior
The current hosting service auto-deploys on commits to the portfolio deployment branch. Future migration to Cloudflare should preserve this command -> GitHub -> auto-deploy workflow.

## Quality rule
Never claim a change is live until the public URL is fetched or otherwise verified after deployment.
