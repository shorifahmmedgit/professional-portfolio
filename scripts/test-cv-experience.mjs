import assert from 'node:assert/strict';
import { experience } from '../src/data/site.ts';

assert.deepEqual(experience.map(item => [item.organization, item.designation, item.period]), [
  ['Interfab Shirt Manufacturing LTD. (VIYELLATEX Group)', 'Pattern Master.', '10 Jan/2026 - Present'],
  ['Fun Factory BD Ltd.', 'Pattern Master.', 'May/2025 - December/2025'],
  ['International Trading Service Ltd. (Standard Group)', 'CAD Pattern Maker.', 'Feb/2022 - April/2025']
]);
assert.deepEqual(experience.map(item => item.sections.flatMap(section => section.responsibilities).length), [12, 5, 3]);
assert.equal(experience.flatMap(item => item.sections.flatMap(section => section.responsibilities)).length, 20);
console.log('CV experience check passed: 3 factories, exact designations/dates, 20 responsibility points.');
