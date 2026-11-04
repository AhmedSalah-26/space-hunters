import { cropCatalog as sharedCropCatalog } from '../../data/cropCatalog.js';

export const DEFAULT_ROTATION_PRIORITIES = Object.freeze({
  waterNeed: 30,
  nitrogenPotential: 20,
  familyDiversity: 15,
  pestBreak: 15,
  droughtResilience: 20,
});

export const ROTATION_CRITERIA = Object.freeze({
  waterNeed: { higherIsBetter: true, unit: 'relative catalog score', labelEn: 'Lower crop water need', labelAr: 'احتياج مائي نباتي أقل' },
  nitrogenPotential: { higherIsBetter: true, unit: '% of crops with qualitative potential', labelEn: 'Nitrogen-fixing potential', labelAr: 'إمكانات تثبيت النيتروجين' },
  familyDiversity: { higherIsBetter: true, unit: '% unique families', labelEn: 'Crop-family diversity', labelAr: 'تنوع العائلات النباتية' },
  pestBreak: { higherIsBetter: true, unit: '% family transitions', labelEn: 'Potential pest-cycle breaks', labelAr: 'إمكانات كسر دورة الآفات' },
  droughtResilience: { higherIsBetter: true, unit: 'unavailable', labelEn: 'Drought resilience (not scored)', labelAr: 'تحمل الجفاف (غير محسوب)' },
  soilImprovement: { higherIsBetter: true, unit: 'unavailable', labelEn: 'Soil improvement', labelAr: 'تحسين التربة' },
  soilCover: { higherIsBetter: true, unit: 'unavailable', labelEn: 'Soil cover / erosion protection', labelAr: 'تغطية التربة والحماية من التعرية' },
  heatCompatibility: { higherIsBetter: true, unit: 'unavailable', labelEn: 'Heat compatibility', labelAr: 'التوافق مع الحرارة' },
  marketSuitability: { higherIsBetter: true, unit: 'unavailable', labelEn: 'Market suitability', labelAr: 'ملاءمة السوق' },
});

const DROUGHT_SENSITIVITY_SCORE = Object.freeze({
  low: 100,
  'low-medium': 75,
  medium: 50,
  'medium-high': 25,
  high: 0,
});

const catalogWaterMidpoints = sharedCropCatalog
  .map((crop) => crop.cropWaterNeed?.rangeMmPerGrowingPeriod)
  .filter((range) => Array.isArray(range) && range.length === 2)
  .map(([min, max]) => (min + max) / 2);
const WATER_NEED_DOMAIN = {
  min: Math.min(...catalogWaterMidpoints),
  max: Math.max(...catalogWaterMidpoints),
};

function scoreRawStrategy(strategy, catalogMap) {
  const cropIds = strategy.sequence || [];
  const crops = cropIds.map((id) => catalogMap.get(id) || null);
  const hasCompleteSequence = crops.length === 3 && crops.every(Boolean);
  const knownFamilies = crops.filter((crop) => crop?.family).map((crop) => crop.family);
  const familiesComplete = hasCompleteSequence && knownFamilies.length === crops.length;
  const waterRanges = crops.map((crop) => crop?.cropWaterNeed?.rangeMmPerGrowingPeriod || null);
  const waterComplete = hasCompleteSequence && waterRanges.every((range) => Array.isArray(range) && range.length === 2);
  const droughtValues = crops.map((crop) => crop?.droughtSensitivity ? DROUGHT_SENSITIVITY_SCORE[crop.droughtSensitivity] : null);
  const droughtComplete = hasCompleteSequence && droughtValues.every(Number.isFinite);
  const nitrogenValues = crops.map((crop) => crop?.nitrogenFixationPotential);
  const nitrogenComplete = hasCompleteSequence && nitrogenValues.every((value) => value === 'potential' || value === 'no-legume-potential');

  const scores = {
    waterNeed: waterComplete
      ? Math.max(0, Math.min(100, 100 * (WATER_NEED_DOMAIN.max - waterRanges.reduce((sum, [min, max]) => sum + ((min + max) / 2), 0) / crops.length) / (WATER_NEED_DOMAIN.max - WATER_NEED_DOMAIN.min)))
      : null,
    nitrogenPotential: nitrogenComplete ? 100 * nitrogenValues.filter((value) => value === 'potential').length / crops.length : null,
    familyDiversity: familiesComplete ? 100 * new Set(knownFamilies).size / crops.length : null,
    pestBreak: familiesComplete && crops.length > 1
      ? 100 * knownFamilies.slice(1).reduce((count, family, index) => count + (family !== knownFamilies[index] ? 1 : 0), 0) / (knownFamilies.length - 1)
      : null,
    droughtResilience: droughtComplete ? droughtValues.reduce((sum, value) => sum + value, 0) / droughtValues.length : null,
    soilImprovement: null,
    soilCover: null,
    heatCompatibility: null,
    marketSuitability: null,
  };

  const waterNeedRangeMm = waterComplete
    ? waterRanges.reduce((total, range) => ({ min: total.min + range[0], max: total.max + range[1] }), { min: 0, max: 0 })
    : null;
  const missing = [];
  if (!hasCompleteSequence) missing.push('A complete three-crop sequence is required.');
  if (!waterComplete) missing.push('Comparable FAO crop-water ranges are unavailable for at least one selected crop.');
  if (!familiesComplete) missing.push('Crop-family classification is unavailable for at least one selected crop.');
  if (!droughtComplete) missing.push('A sourced drought-sensitivity class is unavailable for at least one selected crop.');
  if (!nitrogenComplete) missing.push('Legume nitrogen-fixation potential classification is unavailable for at least one selected crop.');

  return { strategy, crops, scores, waterNeedRangeMm, missing };
}

/**
 * One shared normalized evaluator for baseline and alternatives.
 * Criteria are included in the total only when every strategy has a supported
 * score for that criterion; weights are then renormalized over that same set.
 */
export function evaluateRotationStrategies(strategies = [], options = {}) {
  const {
    cropCatalog = sharedCropCatalog,
    priorities = DEFAULT_ROTATION_PRIORITIES,
    environmentalObservations = [],
    farmInputs = {},
  } = options;
  if (!Array.isArray(strategies) || strategies.length < 3) throw new RangeError('Provide baseline and two alternative strategies.');
  const catalogMap = new Map(cropCatalog.map((crop) => [crop.id, crop]));
  const raw = strategies.map((strategy) => scoreRawStrategy(strategy, catalogMap));
  const eligibleCriteria = Object.keys(DEFAULT_ROTATION_PRIORITIES).filter((criterion) => (
    Number(priorities[criterion]) > 0 && raw.every((result) => Number.isFinite(result.scores[criterion]))
  ));
  const totalWeight = eligibleCriteria.reduce((sum, criterion) => sum + Number(priorities[criterion]), 0);
  const normalizedWeights = Object.fromEntries(eligibleCriteria.map((criterion) => [criterion, totalWeight ? 100 * Number(priorities[criterion]) / totalWeight : 0]));
  const sourceContext = environmentalObservations.filter((item) => (
    ['observation', 'reference'].includes(item?.source?.dataKind) && Number.isFinite(item?.value)
  ));

  const assessed = raw.map((result) => {
    const weightedScore = totalWeight
      ? eligibleCriteria.reduce((sum, criterion) => sum + result.scores[criterion] * normalizedWeights[criterion], 0) / 100
      : null;
    const criterionRanking = eligibleCriteria.map((criterion) => ({ criterion, score: result.scores[criterion], weight: normalizedWeights[criterion] }));
    const prioritiesMet = criterionRanking.filter((item) => item.weight > 0).sort((a, b) => b.weight - a.weight).map((item) => item.criterion);
    return {
      ...result.strategy,
      crops: result.crops,
      metrics: {
        ...result.scores,
        overallScore: Number.isFinite(weightedScore) ? Math.round(weightedScore) : null,
        waterNeedRangeMm: result.waterNeedRangeMm,
      },
      prioritiesMet,
      missing: result.missing,
      assumptions: [
        'No score is an agronomic guarantee or a predicted yield.',
        'Water score ranks indicative crop water need against the supported catalog; it is not irrigation demand or water-use efficiency.',
        'Nitrogen score is the share of crops with qualitative legume fixation potential; it is not a nitrogen quantity or guaranteed soil addition.',
        'Family diversity is a pest-cycle-disruption proxy, not a pest forecast.',
        ...(result.strategy.isBaseline && !farmInputs.baselineConfirmed ? ['Baseline template has not been confirmed as the farm’s actual existing rotation.'] : []),
        ...(!farmInputs.region ? ['Growing region is unspecified; regional crop-calendar suitability is not checked.'] : ['Regional crop-calendar suitability is not verified by this catalog.']),
        ...(farmInputs.soilType ? [`Soil type “${farmInputs.soilType}” is user-provided and not matched against crop-specific soil evidence.`] : ['Soil type is unknown and soil response traits are not scored.']),
        ...(farmInputs.waterAvailability ? [`Water availability “${farmInputs.waterAvailability}” is user-provided context; no calibrated irrigation model is applied.`] : ['Water availability is unspecified.']),
        ...(farmInputs.equipment ? ['Equipment constraints are user-provided and not evaluated against crop requirements.'] : []),
        ...(farmInputs.market ? ['Market constraints are user-provided; verified local market data is unavailable and suitability is not scored.'] : []),
      ],
      environmentalContext: sourceContext,
      environmentalCompatibility: {
        score: null,
        status: 'context-only',
        explanation: 'Environmental measurements may be shown as context, but crop-specific heat/moisture response thresholds are unavailable, so compatibility is not scored.',
      },
    };
  });

  const baseline = assessed.find((strategy) => strategy.isBaseline) || assessed[0];
  assessed.forEach((strategy) => {
    strategy.comparisonToBaseline = strategy === baseline || !Number.isFinite(strategy.metrics.overallScore) || !Number.isFinite(baseline.metrics.overallScore)
      ? null
      : strategy.metrics.overallScore - baseline.metrics.overallScore;
  });

  return {
    strategies: assessed,
    baselineId: baseline.id,
    scoredCriteria: eligibleCriteria,
    normalizedWeights,
    excludedCriteria: Object.keys(ROTATION_CRITERIA).filter((criterion) => !eligibleCriteria.includes(criterion)),
    assumptions: [
      'Scores are normalized to 0–100; higher means stronger fit to the selected scored criteria within this comparison.',
      'All strategies use the same criteria set and farmer weights. Unsupported criteria are excluded for all strategies, not awarded a favorable score.',
      'Published crop-water ranges are approximate full-growing-period crop needs, not irrigation allocations.',
    ],
    farmInputs,
  };
}
