export const STAGE_ORDER = ['inspiration', 'twoD', 'clo3D', 'physicalSample'];

export const STAGE_LABELS = {
  inspiration: 'Inspiration',
  twoD: '2D Pattern',
  clo3D: 'CLO 3D',
  physicalSample: 'Physical Sample'
};

export function visibleStages(stages) {
  return STAGE_ORDER.filter(key => Array.isArray(stages?.[key]) && stages[key].length > 0)
    .map(key => [key, stages[key]]);
}

export function orderedProjectImages(stages) {
  return visibleStages(stages).flatMap(([stage, images]) =>
    images.map((image, stageIndex) => ({ ...image, stage, stageLabel: STAGE_LABELS[stage], stageIndex }))
  );
}
