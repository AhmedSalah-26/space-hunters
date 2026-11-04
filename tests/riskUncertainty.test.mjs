import test from 'node:test';
import assert from 'node:assert/strict';
import { assessEnvironmentalRisk } from '../src/analysis/risk/assessEnvironmentalRisk.js';
import { assessRotationUncertainty } from '../src/analysis/uncertainty/assessRotationUncertainty.js';

const climateSource = {
  provider: 'NASA POWER',
  dataset: 'NASA POWER monthly climatology',
  dataKind: 'reference',
  temporalCoverage: 'Climatology period not supplied',
  spatialResolution: 'Gridded; varies by parameter',
};
const climateObservations = [
  { variable: 'T2M', value: 30, referenceDate: 'climatology:07', unit: '°C', source: climateSource },
  { variable: 'PRECTOTCORR', value: 0.1, referenceDate: 'climatology:07', unit: 'mm/day', source: climateSource },
];

test('climatology provides evidence context but never classifies a risk or creates a spatial zone', () => {
  const result = assessEnvironmentalRisk({
    observations: climateObservations,
    farmLocation: { latitude: 30.8, longitude: 31.3, selectionMethod: 'polygon-boundary', geometry: { type: 'Polygon', coordinates: [] } },
  });
  assert.equal(result.classification, 'unassessed');
  assert.ok(result.risks.every((risk) => risk.level === 'unassessed'));
  assert.equal(result.spatial.status, 'point-reference-only');
  assert.deepEqual(result.spatial.farmGeometry, { type: 'Polygon', coordinates: [] });
});

test('uncertainty remains qualitative and reports unavailable evidence without confidence percentages', () => {
  const result = assessRotationUncertainty({
    strategy: { isBaseline: false, crops: [] },
    evaluation: { scoredCriteria: ['waterNeed'], farmInputs: { baselineConfirmed: false } },
    environmentalObservations: climateObservations,
  });
  assert.equal(result.environmentalEvidence.status, 'Limited evidence');
  assert.equal(result.confidence, null);
  assert.match(result.missingInputs.join(' '), /not verified/i);
  assert.doesNotMatch(JSON.stringify(result), /\b\d+(?:\.\d+)?%\s*confidence/i);
});

test('a confirmed baseline stays confirmed when uncertainty is assessed for an alternative strategy', () => {
  const result = assessRotationUncertainty({
    strategy: { isBaseline: false, crops: [] },
    evaluation: { scoredCriteria: ['waterNeed'], farmInputs: { baselineConfirmed: true } },
    environmentalObservations: climateObservations,
  });
  assert.ok(!result.missingInputs.some((item) => /baseline rotation may be an unconfirmed/i.test(item)));
});

test('absence of observations reports unavailable evidence rather than a favorable or quantified result', () => {
  const risk = assessEnvironmentalRisk();
  const uncertainty = assessRotationUncertainty({ strategy: { crops: [] } });
  assert.equal(risk.classification, 'unassessed');
  assert.equal(risk.dataKind, 'unavailable');
  assert.equal(uncertainty.environmentalEvidence.status, 'Unavailable');
  assert.equal(uncertainty.confidence, null);
});
