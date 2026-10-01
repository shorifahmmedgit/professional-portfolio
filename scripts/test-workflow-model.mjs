import assert from 'node:assert/strict';
import { orderedProjectImages, visibleStages } from '../src/lib/workflow.js';

const image = { src: '/test.webp' };
const cases = [
  [['inspiration', 'twoD', 'clo3D', 'physicalSample'], { inspiration: [image], twoD: [image], clo3D: [image], physicalSample: [image] }],
  [['inspiration', 'clo3D', 'physicalSample'], { inspiration: [image], twoD: [], clo3D: [image], physicalSample: [image] }],
  [['clo3D', 'physicalSample'], { inspiration: [], twoD: [], clo3D: [image], physicalSample: [image] }],
  [['physicalSample'], { inspiration: [], twoD: [], clo3D: [], physicalSample: [image] }]
];
for (const [expected, stages] of cases) assert.deepEqual(visibleStages(stages).map(([key]) => key), expected);
assert.equal(visibleStages({ inspiration: [], twoD: [], clo3D: Array(5).fill(image), physicalSample: [] })[0][1].length, 5);
const ordered = orderedProjectImages({ inspiration: [{ src: '/i.webp' }], twoD: [], clo3D: [{ src: '/c.webp' }], physicalSample: [{ src: '/s.webp' }] });
assert.deepEqual(ordered.map(item => item.src), ['/i.webp', '/c.webp', '/s.webp']);
assert.deepEqual(ordered.map(item => item.stageLabel), ['Inspiration', 'CLO 3D', 'Physical Sample']);
for (const count of [2, 5, 12]) {
  const assets = Array.from({ length: count }, (_, index) => ({ src: `/image-${index}.webp` }));
  assert.equal(orderedProjectImages({ inspiration: [], twoD: [], clo3D: assets, physicalSample: [] }).length, count);
}
console.log('Workflow model tests passed: missing stages skip cleanly and project images flatten in workflow order.');
