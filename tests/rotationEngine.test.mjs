import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateRotationStrategies } from '../src/analysis/rotation/evaluateStrategies.js';
import { cropCatalog } from '../src/data/cropCatalog.js';

const make = (seqs, priorities) => evaluateRotationStrategies(seqs.map((sequence, i) => ({ id: `s${i}`, isBaseline: i === 0, sequence })), { priorities });

test('scores all strategies with one shared criterion set and a 0-100 direction', () => {
  const result = make([
    ['winter_wheat', 'summer_corn', 'winter_wheat'],
    ['winter_wheat', 'faba_beans', 'sorghum_grain'],
    ['barley', 'faba_beans', 'sunflower'],
  ]);
  assert.deepEqual(result.scoredCriteria, ['waterNeed', 'nitrogenPotential', 'familyDiversity', 'pestBreak']);
  for (const strategy of result.strategies) assert.ok(strategy.metrics.overallScore >= 0 && strategy.metrics.overallScore <= 100);
  assert.ok(result.strategies[1].metrics.waterNeed > result.strategies[0].metrics.waterNeed);
  assert.ok(result.strategies[1].metrics.nitrogenPotential < 100);
  assert.match(result.strategies[1].assumptions.join(' '), /not a nitrogen quantity/);
});

test('unsupported traits are excluded across every strategy and never earn a default score', () => {
  const result = make([
    ['cotton', 'cotton', 'cotton'],
    ['cotton', 'cotton', 'cotton'],
    ['cotton', 'cotton', 'cotton'],
  ]);
  assert.deepEqual(result.scoredCriteria, []);
  for (const strategy of result.strategies) assert.equal(strategy.metrics.overallScore, null);
  assert.ok(result.excludedCriteria.includes('marketSuitability'));
});

test('changing farmer weights changes normalized influence without changing raw criteria scores', () => {
  const strategies = [
    ['winter_wheat', 'summer_corn', 'winter_wheat'],
    ['winter_wheat', 'faba_beans', 'sorghum_grain'],
    ['barley', 'faba_beans', 'sunflower'],
  ];
  const waterFocused = make(strategies, { waterNeed: 100, nitrogenPotential: 0, familyDiversity: 0, pestBreak: 0, droughtResilience: 0 });
  const nitrogenFocused = make(strategies, { waterNeed: 0, nitrogenPotential: 100, familyDiversity: 0, pestBreak: 0, droughtResilience: 0 });
  assert.equal(waterFocused.normalizedWeights.waterNeed, 100);
  assert.equal(nitrogenFocused.normalizedWeights.nitrogenPotential, 100);
  assert.notEqual(waterFocused.strategies[0].metrics.overallScore, nitrogenFocused.strategies[0].metrics.overallScore);
  assert.equal(waterFocused.strategies[0].metrics.waterNeed, nitrogenFocused.strategies[0].metrics.waterNeed);
});

test('the unified catalog omits unsupported numeric legacy traits', () => {
  const wheat = cropCatalog.find((crop) => crop.id === 'winter_wheat');
  assert.equal(wheat.rootCharacteristics, null);
  assert.equal(wheat.marketSuitability, null);
  assert.ok(wheat.cropWaterNeed.source.url.includes('fao.org'));
  assert.equal(wheat.droughtSensitivity, null);
  assert.equal(resultDoesNotScoreDrought(), true);
});

function resultDoesNotScoreDrought() {
  const result = make([
    ['winter_wheat', 'summer_corn', 'winter_wheat'],
    ['winter_wheat', 'faba_beans', 'sorghum_grain'],
    ['barley', 'faba_beans', 'sunflower'],
  ]);
  return !result.scoredCriteria.includes('droughtResilience') && result.strategies.every((strategy) => strategy.metrics.droughtResilience === null);
}
