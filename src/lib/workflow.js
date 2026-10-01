export const STAGE_ORDER = ['inspiration', 'twoD', 'clo3D', 'physicalSample'];

export function visibleStages(stages) {
  return STAGE_ORDER.filter(key => Array.isArray(stages?.[key]) && stages[key].length > 0)
    .map(key => [key, stages[key]]);
}
