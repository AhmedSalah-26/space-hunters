import test from 'node:test';
import assert from 'node:assert/strict';
import { getPowerClimatology, POWER_REQUEST_EXAMPLE } from '../src/services/nasa/powerProvider.js';

const monthValues = (value) => Object.fromEntries(['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map((month) => [month, value]));
const fixture = {
  header: { start: '1991', end: '2020', fill_value: -999 },
  properties: { parameter: {
    T2M: monthValues(20.5),
    PRECTOTCORR: monthValues(0.2),
    RH2M: { ...monthValues(55), FEB: 0 },
    ALLSKY_SFC_SW_DWN: { ...monthValues(18), JAN: -999 },
  } },
};

test('POWER request uses verified point climatology query and returns attributed monthly records', async () => {
  let requestedUrl;
  const observations = await getPowerClimatology({
    latitude: 30.825,
    longitude: 31.31,
    fetchImpl: async (url) => {
      requestedUrl = new URL(url);
      return { ok: true, json: async () => fixture };
    },
  });

  assert.equal(requestedUrl.pathname, '/api/temporal/climatology/point');
  assert.equal(requestedUrl.searchParams.get('community'), 'AG');
  assert.equal(requestedUrl.searchParams.get('format'), 'JSON');
  assert.equal(requestedUrl.searchParams.get('parameters'), 'T2M,PRECTOTCORR,RH2M,ALLSKY_SFC_SW_DWN');
  assert.equal(observations.length, 48);
  const rain = observations.find((item) => item.variable === 'PRECTOTCORR' && item.referenceDate === 'climatology:FEB');
  assert.equal(rain.value, 0.2);
  assert.equal(rain.unit, 'mm/day');
  assert.equal(rain.temporalResolution, 'Monthly climatological average');
  assert.equal(rain.temporalCoverage, '1991–2020');
  assert.equal(rain.source.dataKind, 'reference');
  assert.equal(rain.source.dataset, 'NASA POWER Agroclimatology (AG) monthly climatology');
  assert.ok(rain.source.retrievedAt);
  assert.equal(observations.find((item) => item.variable === 'ALLSKY_SFC_SW_DWN').unit, 'MJ/m²/day');
  assert.equal(observations.find((item) => item.variable === 'ALLSKY_SFC_SW_DWN').value, null);
  assert.equal(observations.find((item) => item.variable === 'RH2M' && item.referenceDate === 'climatology:FEB').value, 0);
  assert.match(POWER_REQUEST_EXAMPLE, /temporal\/climatology\/point/);
});

test('POWER rejects invalid coordinates, HTTP errors, and malformed responses', async () => {
  await assert.rejects(() => getPowerClimatology({ latitude: 91, longitude: 0, fetchImpl: async () => ({}) }), RangeError);
  await assert.rejects(() => getPowerClimatology({ latitude: 0, longitude: 0, fetchImpl: async () => ({ ok: false, status: 503 }) }), /HTTP 503/);
  await assert.rejects(() => getPowerClimatology({ latitude: 0, longitude: 0, fetchImpl: async () => ({ ok: true, json: async () => ({}) }) }), /did not include parameter values/);
});
