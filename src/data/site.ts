export const nav = [
  { href: '/about', label: 'About' },
  { href: '/expertise', label: 'Expertise' },
  { href: '/projects', label: 'Work' },
  { href: '/systems', label: 'AI & Systems' },
  { href: '/articles', label: 'Writing' },
  { href: '/research', label: 'Research' },
  { href: '/cv', label: 'CV' },
  { href: '/contact', label: 'Contact' },
];

export const timeline = [
  { period: '10 Jan 2026 — Present', role: 'Pattern Master / Pattern Maker', org: 'Intercept Shirt Manufacturing Ltd. · VLR Tex Group', note: 'Sample department · woven shirts and overshirt development' },
  { period: '10 May 2025 — 08 Jan 2026', role: 'Assistant Pattern Maker', org: 'Fun Factory BD Ltd.', note: 'Pattern adjustment, grading, sample support and consumption work' },
  { period: '2022 — 2025', role: 'Assistant Pattern Maker / CAD pattern work', org: 'International Trading Service Ltd. · Standard Group', note: 'Started with digitizing and grading; progressed into development work' },
];

export const capabilities = [
  { n: '01', title: 'Pattern development', body: 'Translating buyer sketches, specifications, blocks and reference samples into workable Gerber 2D patterns.' },
  { n: '02', title: 'Comment-led correction', body: 'Interpreting review comments, forming an adjustment hypothesis, modifying the pattern and validating the result through the sample cycle.' },
  { n: '03', title: 'Grading & production support', body: 'Production size-set grading, digital and manual checks, plus basic marker and solid-fabric consumption work.' },
  { n: '04', title: 'Technical documentation', body: 'Reading measurement charts and technical sketches, spotting missing information, and communicating technical questions clearly.' },
  { n: '05', title: 'CLO 3D pattern validation', body: 'Using 3D simulation primarily as a pre-sample checking layer: draft the pattern, dress it on an avatar, review silhouette and visible pattern issues, then refine before final pattern release.' },
  { n: '06', title: 'Professional communication', body: 'Buyer-facing email handling, technical reading, written follow-up and working English communication across speaking, listening and documentation.' },
];

export const projects = [
  {
    slug: 'comment-to-pattern-workflow',
    eyebrow: 'Workflow study',
    title: 'From buyer comment to pattern action',
    summary: 'A public-safe model for turning review comments into traceable pattern decisions without exposing buyer documents.',
    tags: ['Gerber 2D', 'Reasoning', 'Sample cycle'],
  },
  {
    slug: 'overshirt-development-system',
    eyebrow: 'Practice area',
    title: 'Overshirt development as a system',
    summary: 'A framework for connecting specification, silhouette, fabric, construction and pattern balance during development.',
    tags: ['Overshirts', 'Woven', 'Fit learning'],
  },
  {
    slug: 'clo-3d-pattern-validation',
    eyebrow: 'Digital validation practice',
    title: 'CLO 3D as a pattern-checking layer before sample release',
    summary: 'How I use 3D simulation less as presentation theatre and more as a practical checkpoint between drafting, style interpretation and physical sampling.',
    tags: ['CLO 3D', 'Pattern validation', 'Pre-sample'],
  },
  {
    slug: 'garment-knowledge-retrieval',
    eyebrow: 'Research concept',
    title: 'Garment knowledge retrieval assistant',
    summary: 'A proposed knowledge system for retrieving safe historical lessons by style, sample stage, issue and technical action.',
    tags: ['AI × garments', 'Taxonomy', 'Knowledge systems'],
  },
];

export const articles = [
  { slug: 'pattern-making-is-a-feedback-system', title: 'Pattern making is a feedback system', excerpt: 'Why development improves when comments, actions and results become a reusable technical loop.', category: 'Pattern reasoning', date: '2026-09-22', read: '5 min' },
  { slug: 'building-an-evidence-safe-portfolio', title: 'Building an evidence-safe garment portfolio', excerpt: 'How to show technical judgment without publishing a buyer tech pack, proprietary block or confidential sample.', category: 'Professional practice', date: '2026-09-22', read: '4 min' },
  { slug: 'ai-garment-knowledge-taxonomy', title: 'A practical taxonomy for AI × garment knowledge', excerpt: 'A structure for organizing style history, buyer comments, sample stages, fit issues and learned corrections.', category: 'AI × garments', date: '2026-09-22', read: '7 min' },
];
