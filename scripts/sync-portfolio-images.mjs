import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';
import convertHeic from 'heic-convert';

const root = process.cwd();
const inbox = path.join(root, '.portfolio-sync');
const output = path.join(root, 'public', 'media');
const manifestPath = path.join(root, 'src', 'data', 'portfolio-images.json');
const map = JSON.parse(await fs.readFile(path.join(root, 'src', 'data', 'work-image-map.json'), 'utf8'));
const imageExt = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.heic', '.heif']);

const stageRules = [
  ['inspiration', /(^|[\s_-])(inspiration|reference)([\s_-]|$)/i],
  ['twoD', /(^|[\s_-])(2d|pattern|gerber|pds)([\s_-]|$)/i],
  ['clo3D', /(^|[\s_-])(clo\s*3d|clo|3d)([\s_-]|$)/i],
  ['physicalSample', /(^|[\s_-])(actual\s*sample|physical\s*sample|sample)([\s_-]|$)/i]
];

function slug(value) {
  return value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function normalizedStyle(value) {
  return value.toLowerCase().replace(/[_-]+/g, ' ').replace(/\b(inspiration|reference|clo\s*3d|clo|3d|2d|pattern|gerber|pds|actual\s*sample|physical\s*sample|sample|photos?|images?)\b/g, ' ').replace(/\s+/g, ' ').trim();
}

function titleCase(value) { return value.replace(/\b\w/g, c => c.toUpperCase()); }

async function exists(target) { try { await fs.access(target); return true; } catch { return false; } }

async function walk(dir) {
  if (!(await exists(dir))) return [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : path.join(dir, entry.name)));
  return nested.flat();
}

function classify(file) {
  const rel = path.relative(inbox, file);
  const parts = rel.split(path.sep);
  if (parts.some(p => /^my[\s_-]*photos?$/i.test(p))) return { type: 'profile' };
  let stage;
  let stageIndex = -1;
  for (let i = 0; i < parts.length - 1; i++) {
    const hit = stageRules.find(([, rule]) => rule.test(parts[i]));
    if (hit) { stage = hit[0]; stageIndex = i; break; }
  }
  if (!stage) return null;
  const candidate = parts[stageIndex + 1] && imageExt.has(path.extname(parts[stageIndex + 1]).toLowerCase())
    ? parts[Math.max(0, stageIndex - 1)]
    : parts[stageIndex + 1];
  const clean = normalizedStyle(candidate || parts[0]);
  const id = map.aliases[clean] || slug(clean);
  return id ? { type: 'work', stage, id, sourceTitle: clean } : null;
}

async function decode(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.heic' || ext === '.heif') {
    return convertHeic({ buffer: await fs.readFile(file), format: 'JPEG', quality: 0.94 });
  }
  return file;
}

async function redact(buffer, rules = []) {
  let base = sharp(buffer).rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true });
  let rendered = await base.toBuffer();
  const meta = await sharp(rendered).metadata();
  for (const rule of rules) {
    const region = {
      left: Math.max(0, Math.round(meta.width * rule.left)), top: Math.max(0, Math.round(meta.height * rule.top)),
      width: Math.max(1, Math.round(meta.width * rule.width)), height: Math.max(1, Math.round(meta.height * rule.height))
    };
    region.width = Math.min(region.width, meta.width - region.left);
    region.height = Math.min(region.height, meta.height - region.top);
    const blurred = await sharp(rendered).extract(region).blur(28).toBuffer();
    rendered = await sharp(rendered).composite([{ input: blurred, left: region.left, top: region.top }]).toBuffer();
  }
  return rendered;
}

async function optimize(file, publicDir, publicBase, stem, redactions = []) {
  await fs.mkdir(publicDir, { recursive: true });
  const decoded = await decode(file);
  const safe = await redact(decoded, redactions);
  const target = path.join(publicDir, `${stem}.webp`);
  const info = await sharp(safe).webp({ quality: 84, effort: 5 }).toFile(target);
  return { src: `${publicBase}/${stem}.webp`, width: info.width, height: info.height };
}

async function syncDrive() {
  const token = process.env.GOOGLE_DRIVE_ACCESS_TOKEN;
  const rootId = process.env.PORTFOLIO_DRIVE_ROOT_ID;
  if (!token || !rootId) return false;
  const driveInbox = path.join(inbox, 'Drive');
  async function request(url) {
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error(`Google Drive request failed (${response.status})`);
    return response;
  }
  async function descend(folderId, localDir) {
    await fs.mkdir(localDir, { recursive: true });
    let pageToken = '';
    do {
      const q = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
      const fields = encodeURIComponent('nextPageToken,files(id,name,mimeType,modifiedTime,size)');
      const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=${fields}&pageSize=100${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`;
      const payload = await (await request(url)).json();
      for (const item of payload.files || []) {
        const safeName = item.name.replace(/[<>:"/\\|?*]/g, '-');
        if (item.mimeType === 'application/vnd.google-apps.folder') await descend(item.id, path.join(localDir, safeName));
        else if (item.mimeType.startsWith('image/')) {
          const target = path.join(localDir, safeName);
          const response = await request(`https://www.googleapis.com/drive/v3/files/${item.id}?alt=media`);
          await fs.writeFile(target, Buffer.from(await response.arrayBuffer()));
        }
      }
      pageToken = payload.nextPageToken || '';
    } while (pageToken);
  }
  await descend(rootId, driveInbox);
  return true;
}

await syncDrive();
const files = (await walk(inbox)).filter(file => imageExt.has(path.extname(file).toLowerCase()) && !/\.preview\./i.test(file));
const professionalSources = [];
const grouped = new Map();

for (const file of files) {
  const classification = classify(file);
  if (!classification) continue;
  if (classification.type === 'profile') { professionalSources.push(file); continue; }
  const config = map.items[classification.id] || {};
  if ((config.excludeSourceNames || []).some(name => name.toLowerCase() === path.basename(file).toLowerCase())) continue;
  if (!grouped.has(classification.id)) grouped.set(classification.id, { sourceTitle: classification.sourceTitle, stages: { inspiration: [], twoD: [], clo3D: [], physicalSample: [] } });
  grouped.get(classification.id).stages[classification.stage].push(file);
}

const professional = { featured: null, supporting: [] };
professionalSources.sort();
for (let i = 0; i < professionalSources.length; i++) {
  const stem = i === 0 ? 'shorif-ahmmed-work-environment' : `professional-${String(i + 1).padStart(2, '0')}`;
  const asset = await optimize(professionalSources[i], path.join(output, 'profile'), '/media/profile', stem);
  const image = { ...asset, alt: i === 0 ? 'Shorif Ahmmed in a professional pattern-development work environment' : `Shorif Ahmmed at work, professional view ${i + 1}` };
  if (i === 0) professional.featured = image; else professional.supporting.push(image);
}

const workItems = [];
for (const [id, group] of [...grouped.entries()].sort()) {
  const config = map.items[id] || {};
  const title = config.title || titleCase(group.sourceTitle);
  const item = { id, title, category: config.category || 'Garment development workflow', description: config.description || 'Available public-safe views from the garment development process.', stages: { inspiration: [], twoD: [], clo3D: [], physicalSample: [] } };
  for (const stage of ['inspiration', 'twoD', 'clo3D', 'physicalSample']) {
    const preferred = config.stageOrder?.[stage] || [];
    const sources = group.stages[stage].sort((a, b) => {
      const ai = preferred.indexOf(path.basename(a)); const bi = preferred.indexOf(path.basename(b));
      if (ai >= 0 || bi >= 0) return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
      return a.localeCompare(b);
    });
    for (let i = 0; i < sources.length; i++) {
      const sourceName = path.basename(sources[i]);
      const dirName = stage === 'inspiration' ? 'inspiration' : stage === 'twoD' ? '2d' : stage === 'clo3D' ? 'clo-3d' : 'physical-sample';
      const stem = stage === 'physicalSample' ? 'sample' : stage === 'clo3D' ? 'clo3d' : stage.toLowerCase();
      const asset = await optimize(sources[i], path.join(output, 'work', id, dirName), `/media/work/${id}/${dirName}`, `${stem}-${String(i + 1).padStart(2, '0')}`, config.redactions?.[sourceName] || []);
      const label = stage === 'inspiration' ? 'inspiration reference' : stage === 'twoD' ? 'Gerber 2D pattern' : stage === 'clo3D' ? 'CLO 3D garment' : 'finished physical sample';
      item.stages[stage].push({ ...asset, alt: `${title} — ${label}, view ${i + 1}` });
    }
  }
  if (Object.values(item.stages).some(images => images.length)) workItems.push(item);
}

const manifest = { generatedAt: new Date().toISOString(), professional, workItems };
await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`Portfolio image sync complete: ${professionalSources.length} professional photo(s), ${workItems.length} work item(s), ${files.length} source image(s) inspected.`);
