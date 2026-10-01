import assert from 'node:assert/strict';
import { visibleStages } from '../src/lib/workflow.js';

const image = { src: '/test.webp' };
const cases = [
  [['inspiration', 'twoD', 'clo3D', 'physicalSample'], { inspiration: [image], twoD: [image], clo3D: [image], physicalSample: [image] }],
  [['inspiration', 'clo3D', 'physicalSample'], { inspiration: [image], twoD: [], clo3D: [image], physicalSample: [image] }],
  [['clo3D', 'physicalSample'], { inspiration: [], twoD: [], clo3D: [image], physicalSample: [image] }],
  [['physicalSample'], { inspiration: [], twoD: [], clo3D: [], physicalSample: [image] }]
];
for (const [expected, stages] of cases) assert.deepEqual(visibleStages(stages).map(([key]) => key), expected);
assert.equal(visibleStages({ inspiration: [], twoD: [], clo3D: Array(5).fill(image), physicalSample: [] })[0][1].length, 5);
console.log('Workflow model tests passed: 4/3/2/1 stages and five-image stage.');
