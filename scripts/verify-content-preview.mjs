import fs from 'node:fs/promises';

const version = await fetch('http://127.0.0.1:9223/json/version').then(response => response.json());
const socket = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
let nextId = 1;
const pending = new Map();
socket.addEventListener('message', ({ data }) => { const message = JSON.parse(data); if (message.id && pending.has(message.id)) { const task = pending.get(message.id); pending.delete(message.id); message.error ? task.reject(new Error(message.error.message)) : task.resolve(message.result); } });
function send(method, params = {}, sessionId) { const id = nextId++; socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) })); return new Promise((resolve, reject) => pending.set(id, { resolve, reject })); }

const pages = ['cv', 'expertise', 'projects', 'experience', 'contact'];
const results = [];
for (const page of pages) {
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  await send('Page.enable', {}, sessionId);
  const mobile = page === 'contact';
  await send('Emulation.setDeviceMetricsOverride', { width: mobile ? 390 : 1440, height: mobile ? 844 : 1000, deviceScaleFactor: 1, mobile }, sessionId);
  await send('Page.navigate', { url: `http://127.0.0.1:4321/${page}` }, sessionId);
  await new Promise(resolve => setTimeout(resolve, 900));
  const evaluation = await send('Runtime.evaluate', { expression: `(async()=>{const reveal=document.querySelector('#reveal-email');reveal?.click();const pdfLinks=[...document.querySelectorAll('a[href$=".pdf"]')];const pdfStatus=pdfLinks.length?await fetch(pdfLinks[0].href).then(r=>r.status).catch(()=>0):null;return { title:document.title, heading:document.querySelector('h1')?.textContent, horizontalOverflow:document.documentElement.scrollWidth>innerWidth, privateText:/01787|Abul Hossain|Laily Begum|Rohimabad|04 November 1997/i.test(document.body.innerText), writingText:/Writing|Technical articles/i.test(document.body.innerText), overshirtText:/Overshirt Development as a System/i.test(document.body.innerText), cvActions:pdfLinks.map(x=>({text:x.textContent.trim(),download:x.hasAttribute('download'),target:x.target})),pdfStatus,emailText:document.querySelector('#professional-email p')?.textContent,emailHref:document.querySelector('#professional-email a')?.getAttribute('href'),linkedin:[...document.querySelectorAll('a')].find(x=>x.textContent.includes('LinkedIn'))?.href,linkedinTarget:[...document.querySelectorAll('a')].find(x=>x.textContent.includes('LinkedIn'))?.target}})()`, awaitPromise: true, returnByValue: true }, sessionId);
  const shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false }, sessionId);
  await fs.mkdir('.portfolio-sync/content-preview', { recursive: true });
  await fs.writeFile(`.portfolio-sync/content-preview/${page}.png`, Buffer.from(shot.data, 'base64'));
  results.push({ page, ...evaluation.result.value });
  await send('Target.closeTarget', { targetId });
}
console.log(JSON.stringify(results, null, 2));
socket.close();
