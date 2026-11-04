import { DATA_KINDS } from '../../data/models.js';

const POWER_API_URL = 'https://power.larc.nasa.gov/api/temporal/climatology/point';
export const POWER_DOCS_URL = 'https://power.larc.nasa.gov/docs/services/api/temporal/climatology/';
export const POWER_TEMPORAL_DOCS_URL = 'https://power.larc.nasa.gov/docs/services/api/temporal/';
const PARAMETER_INFO = Object.freeze({
  T2M: { unit: 'degC', label: '2 m air temperature' },
  PRECTOTCORR: { unit: 'mm/day', label: 'Corrected precipitation' },
  RH2M: { unit: '%', label: '2 m relative humidity' },
  ALLSKY_SFC_SW_DWN: { unit: 'MJ/m²/day', label: 'All-sky surface shortwave downward radiation' },
});
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const responseCache = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000;

function validateCoordinates(latitude, longitude) {
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) throw new RangeError('latitude must be between -90 and 90');
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) throw new RangeError('longitude must be between -180 and 180');
}

function normalizedValue(value, fillValue) {
  if (value === null || value === undefined || value === '' || !Number.isFinite(Number(value))) return null;
  const number = Number(value);
  const hasFillValue = fillValue !== null && fillValue !== undefined && fillValue !== '';
  if (number === -999 || (hasFillValue && Number.isFinite(Number(fillValue)) && number === Number(fillValue))) return null;
  return number;
}

/** Fetch and normalize the NASA POWER monthly climatology for a single point.
 * This is a long-term reference product, not a current observation or forecast.
 * @param {{latitude:number,longitude:number,signal?:AbortSignal,fetchImpl?:typeof fetch}} options
 * @returns {Promise<import('../../data/models').EnvironmentalObservation[]>}
 */
export async function getPowerClimatology({ latitude, longitude, signal, fetchImpl = fetch }) {
  validateCoordinates(latitude, longitude);
  const cacheKey = `${latitude},${longitude}`;
  const cached = responseCache.get(cacheKey);
  if (fetchImpl === fetch && cached && cached.expiresAt > Date.now()) return cached.observations;
  if (cached) responseCache.delete(cacheKey);

  const url = new URL(POWER_API_URL);
  url.search = new URLSearchParams({
    parameters: Object.keys(PARAMETER_INFO).join(','),
    community: 'AG',
    longitude: String(longitude),
    latitude: String(latitude),
    format: 'JSON',
  }).toString();

  const response = await fetchImpl(url.toString(), { signal });
  if (!response.ok) throw new Error(`NASA POWER request failed with HTTP ${response.status}`);

  const json = await response.json();
  const values = json?.properties?.parameter;
  if (!values || typeof values !== 'object') throw new Error('NASA POWER response did not include parameter values');
  const missingParameters = Object.keys(PARAMETER_INFO).filter((name) => !values[name] || typeof values[name] !== 'object');
  if (missingParameters.length) throw new Error(`NASA POWER response omitted requested parameters: ${missingParameters.join(', ')}`);

  const retrievedAt = new Date().toISOString();
  const period = json?.header?.start && json?.header?.end
    ? `${json.header.start}–${json.header.end}`
    : 'NASA POWER predefined climatology period (period metadata not returned)';
  const fillValue = json?.header?.fill_value;

  const observations = Object.entries(PARAMETER_INFO).flatMap(([variable, info]) => MONTHS.map((month) => {
    const value = normalizedValue(values[variable][month], fillValue);
    return {
      variable,
      value,
      unit: info.unit,
      referenceDate: `climatology:${month}`,
      temporalResolution: 'Monthly climatological average',
      temporalCoverage: period,
      quality: value === null ? 'Missing in NASA POWER response' : 'NASA POWER analysis-ready value; no additional app quality screening',
      source: {
        id: 'nasa-power-climatology',
        dataset: 'NASA POWER Agroclimatology (AG) monthly climatology',
        provider: 'NASA Langley Research Center POWER Project',
        name: 'NASA POWER Climatology API',
        dataKind: DATA_KINDS.REFERENCE,
        url: POWER_DOCS_URL,
        requestCoordinates: { latitude, longitude },
        coordinateReferenceSystem: 'EPSG:4326',
        retrievedAt,
        temporalCoverage: period,
        spatialResolution: 'Varies by parameter and underlying source; see POWER methodology/parameter metadata',
        limitations: [
          'Long-term climatological reference, not real-time weather, a field measurement, or a forecast',
          'Point values represent gridded products and are not farm-boundary averages',
          'No additional quality screening is performed by this application',
        ],
      },
    };
  }));
  if (fetchImpl === fetch) {
    if (responseCache.size >= 100) responseCache.delete(responseCache.keys().next().value);
    responseCache.set(cacheKey, { observations, expiresAt: Date.now() + CACHE_TTL_MS });
  }
  return observations;
}

/** Provider interface consumed by the environmental data layer. */
export const powerProvider = Object.freeze({
  id: 'nasa-power',
  name: 'NASA POWER',
  status: 'available',
  temporalProduct: 'monthly climatology',
  request: getPowerClimatology,
});

export const POWER_REQUEST_EXAMPLE = `${POWER_API_URL}?parameters=T2M%2CPRECTOTCORR%2CRH2M%2CALLSKY_SFC_SW_DWN&community=AG&longitude=31.31&latitude=30.825&format=JSON`;

