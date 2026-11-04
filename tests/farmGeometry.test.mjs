import test from 'node:test';
import assert from 'node:assert/strict';
import {
  convertArea,
  createFarmLocationSelection,
  validateCoordinates,
  validateFarmPolygon,
} from '../src/utils/farmGeometry.js';

const farmSquare = [
  { latitude: 30, longitude: 31 },
  { latitude: 30, longitude: 31.001 },
  { latitude: 30.001, longitude: 31.001 },
  { latitude: 30.001, longitude: 31 },
];

test('point plus entered area creates an estimate without invented boundary geometry', () => {
  const result = createFarmLocationSelection({
    mode: 'point-area',
    latitude: 30.1,
    longitude: 31.2,
    area: 2,
    areaUnit: 'feddan',
    label: 'Test farm reference',
  });

  assert.equal(result.valid, true);
  assert.equal(result.farmLocation.latitude, 30.1);
  assert.equal(result.farmLocation.longitude, 31.2);
  assert.equal(result.farmLocation.area, 2);
  assert.equal(result.farmLocation.selectionMethod, 'point-area');
  assert.equal(result.farmLocation.geometry, null);
  assert.equal(result.farmLocation.boundaryDerivedArea, null);
  assert.match(result.farmLocation.source.limitations[0], /does not define the farm boundary/);
});

test('point mode rejects invalid coordinates and non-positive areas', () => {
  assert.equal(validateCoordinates(91, 0).valid, false);
  assert.equal(validateCoordinates(0, -181).valid, false);
  assert.equal(createFarmLocationSelection({ mode: 'point-area', latitude: 0, longitude: 0, area: 0, areaUnit: 'hectare' }).valid, false);
});

test('area units convert through square meters', () => {
  assert.equal(convertArea(1, 'feddan', 'squareMeter'), 4200.833);
  assert.equal(convertArea(1, 'hectare', 'squareMeter'), 10000);
  assert.equal(convertArea(1, 'squareKilometer', 'squareMeter'), 1000000);
  assert.equal(convertArea(1000, 'squareMeter', 'squareKilometer'), 0.001);
});

test('valid polygon creates geodesic area and closed GeoJSON with longitude first', () => {
  const validation = validateFarmPolygon(farmSquare);
  const result = createFarmLocationSelection({
    mode: 'boundary',
    latitude: 0,
    longitude: 0,
    areaUnit: 'hectare',
    boundaryPoints: farmSquare,
  });

  assert.equal(validation.valid, true);
  assert.ok(validation.areaSquareMeters > 10000 && validation.areaSquareMeters < 15000);
  assert.equal(result.valid, true);
  assert.equal(result.farmLocation.selectionMethod, 'polygon-boundary');
  assert.equal(result.farmLocation.geometry.type, 'Polygon');
  assert.equal(result.farmLocation.geometry.coordinates[0].length, farmSquare.length + 1);
  assert.deepEqual(result.farmLocation.geometry.coordinates[0][0], [31, 30]);
  assert.equal(result.farmLocation.boundaryDerivedArea.unit, 'squareMeter');
  assert.ok(Math.abs(result.farmLocation.area - validation.areaSquareMeters / 10000) < 1e-12);
});

test('incomplete and self-crossing boundaries are rejected', () => {
  assert.equal(validateFarmPolygon(farmSquare.slice(0, 2)).valid, false);
  const bowTie = [
    { latitude: 30, longitude: 31 },
    { latitude: 30.001, longitude: 31.001 },
    { latitude: 30, longitude: 31.001 },
    { latitude: 30.001, longitude: 31 },
  ];
  assert.equal(validateFarmPolygon(bowTie).valid, false);
  assert.equal(createFarmLocationSelection({ mode: 'boundary', latitude: 0, longitude: 0, areaUnit: 'feddan', boundaryPoints: farmSquare.slice(0, 2) }).valid, false);
});
