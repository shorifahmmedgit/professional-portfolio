import fs from 'node:fs/promises';

const version = await fetch('http://127.0.0.1:9223/json/version').then(r => r.json());
const ws = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
let nextId = 1;
const pending = new Map();
const exceptions = [];
ws.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text);
  if (message.id && pending.has(message.id)) { const task = pending.get(message.id); pending.delete(message.id); message.error ? task.reject(new Error(message.error.message)) : task.resolve(message.result); }
});
function send(method, params = {}, sessionId) { const id = nextId++; ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) })); return new Promise((resolve, reject) => pending.set(id, { resolve, reject })); }

const cases = [{ name: 'desktop', width: 1440, height: 1000, mobile: false }, { name: 'mobile', width: 390, height: 844, mobile: true }];
const results = [];
for (const test of cases) {
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  await send('Runtime.enable', {}, sessionId); await send('Page.enable', {}, sessionId);
  await send('Emulation.setDeviceMetricsOverride', { width: test.width, height: test.height, deviceScaleFactor: 1, mobile: test.mobile, screenWidth: test.width, screenHeight: test.height }, sessionId);
  await send('Page.navigate', { url: 'http://127.0.0.1:4321/' }, sessionId);
  await new Promise(resolve => setTimeout(resolve, 1800));
  const countResult = await send('Runtime.evaluate', { expression: `document.querySelectorAll('.work-photo-system img').length`, returnByValue: true }, sessionId);
  for (let i = 0; i < countResult.result.value; i++) { await send('Runtime.evaluate', { expression: `document.querySelectorAll('.work-photo-system img')[${i}]?.scrollIntoView({block:'center'})` }, sessionId); await new Promise(resolve => setTimeout(resolve, 120)); }
  const evaluation = await send('Runtime.evaluate', { expression: `(() => { const work=document.querySelector('.work-photo-system'); const stages=[...document.querySelectorAll('.workflow-stage')]; const imgs=[...document.querySelectorAll('.work-photo-system img')]; return { title:document.title, bodyTextLength:document.body.innerText.trim().length, horizontalOverflow:document.documentElement.scrollWidth>innerWidth, errorOverlay:Boolean(document.querySelector('.vite-error-overlay,astro-dev-overlay')), workSection:Boolean(work), stageLabels:stages.map(x=>x.querySelector('h4')?.textContent), imageCount:imgs.length, brokenImages:imgs.filter(x=>!x.complete||x.naturalWidth===0).length, professionalSection:Boolean(document.querySelector('.professional-photos')), externalImageLinks:document.querySelectorAll('.media-gallery a[target="_blank"]').length }; })()`, returnByValue: true }, sessionId);
  const interaction = await send('Runtime.evaluate', { expression: `(async()=>{ const first=document.querySelector('[data-lightbox-group]'); const y=scrollY; first?.click(); await new Promise(r=>setTimeout(r,100)); const dialog=document.querySelector('.portfolio-lightbox'); const opened=dialog?.open===true; const firstSrc=dialog?.querySelector('img')?.getAttribute('src'); dialog?.querySelector('.lightbox-next')?.click(); const nextSrc=dialog?.querySelector('img')?.getAttribute('src'); const position=dialog?.querySelector('#lightbox-position')?.textContent; dialog?.querySelector('.lightbox-prev')?.click(); const previousWorked=dialog?.querySelector('img')?.getAttribute('src')===firstSrc; dialog?.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})); await new Promise(r=>setTimeout(r,100)); const escapeClosed=dialog?.open===false; first?.click(); await new Promise(r=>setTimeout(r,50)); dialog?.querySelector('.lightbox-close')?.click(); await new Promise(r=>setTimeout(r,50)); return {opened,nextWorked:firstSrc!==nextSrc,previousWorked,position,escapeClosed,xClosed:dialog?.open===false,scrollRestored:Math.abs(scrollY-y)<2,focusRestored:document.activeElement===first};})()`, awaitPromise: true, returnByValue: true }, sessionId);
  await send('Runtime.evaluate', { expression: `document.querySelector('.work-photo-system')?.scrollIntoView()` }, sessionId);
  await new Promise(resolve => setTimeout(resolve, 300));
  const shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true }, sessionId);
  await fs.writeFile(`.portfolio-sync/${test.name}-workflow.png`, Buffer.from(shot.data, 'base64'));
  results.push({ viewport: test.name, ...evaluation.result.value, ...interaction.result.value });
  await send('Target.closeTarget', { targetId });
}
console.log(JSON.stringify({ results, exceptions }, null, 2));
ws.close();
