import { ROTATION_CRITERIA } from './evaluateStrategies.js';

/** Describe relative supported improvements and sacrifices against baseline. */
export function analyzeRotationTradeoffs(evaluation) {
  const baseline = evaluation?.strategies?.find((strategy) => strategy.isBaseline) || evaluation?.strategies?.[0] || null;
  if (!baseline) return [];
  return evaluation.strategies.map((strategy) => {
    const changes = evaluation.scoredCriteria.map((criterion) => ({
      criterion,
      label: ROTATION_CRITERIA[criterion].labelEn,
      labelAr: ROTATION_CRITERIA[criterion].labelAr,
      baseline: baseline.metrics[criterion],
      value: strategy.metrics[criterion],
      delta: strategy.metrics[criterion] - baseline.metrics[criterion],
    }));
    return {
      strategyId: strategy.id,
      strategyName: strategy.name,
      changes,
      improves: changes.filter((change) => change.delta > 0),
      sacrifices: changes.filter((change) => change.delta < 0),
      unchanged: changes.filter((change) => change.delta === 0),
      unavailableTradeoffs: ['Market suitability', 'Soil cover / erosion protection', 'Local growing-season fit', 'Crop production / yield constraints'],
      note: strategy === baseline ? 'Baseline reference.' : 'Changes are relative scores for supported crop traits, not yield or financial outcomes.',
    };
  });
}
