const EARTH_RADIUS_METERS = 6371008.8;
const FEDDAN_SQUARE_METERS = 4200.833;

export const FARM_AREA_UNITS = Object.freeze({
  feddan: { labelEn: 'Feddan', labelAr: 'فدان', squareMeters: FEDDAN_SQUARE_METERS },
  hectare: { labelEn: 'Hectare', labelAr: 'هكتار', squareMeters: 10000 },
  squareMeter: { labelEn: 'Square meter', labelAr: 'متر مربع', squareMeters: 1 },
  squareKilometer: { labelEn: 'Square kilometer', labelAr: 'كيلومتر مربع', squareMeters: 1000000 },
});

export function validateCoordinates(latitude, longitude) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return { valid: false, error: 'Enter numeric latitude and longitude.' };
  }
  if (latitude < -90 || latitude > 90) {
    return { valid: false, error: 'Latitude must be between -90° and 90°.' };
  }
  if (longitude < -180 || longitude > 180) {
    return { valid: false, error: 'Longitude must be between -180° and 180°.' };
  }
  return { valid: true, error: null };
}

export function convertArea(value, fromUnit, toUnit) {
  const from = FARM_AREA_UNITS[fromUnit];
  const to = FARM_AREA_UNITS[toUnit];
  if (!Number.isFinite(value) || value < 0 || !from || !to) return null;
  return (value * from.squareMeters) / to.squareMeters;
}

function samePoint(a, b) {
  return Math.abs(a.latitude - b.latitude) < 1e-9 && Math.abs(a.longitude - b.longitude) < 1e-9;
}

function unwrapLongitudes(points) {
  if (!points.length) return [];
  const unwrapped = [{ ...points[0], x: points[0].longitude }];
  for (let i = 1; i < points.length; i += 1) {
    let delta = points[i].longitude - points[i - 1].longitude;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    unwrapped.push({ ...points[i], x: unwrapped[i - 1].x + delta });
  }
  return unwrapped;
}

function cross(a, b, c) {
  return (b.x - a.x) * (c.latitude - a.latitude) - (b.latitude - a.latitude) * (c.x - a.x);
}

function onSegment(a, b, p) {
  return p.x >= Math.min(a.x, b.x) - 1e-10 && p.x <= Math.max(a.x, b.x) + 1e-10 &&
    p.latitude >= Math.min(a.latitude, b.latitude) - 1e-10 && p.latitude <= Math.max(a.latitude, b.latitude) + 1e-10;
}

function segmentsIntersect(a, b, c, d) {
  const abC = cross(a, b, c);
  const abD = cross(a, b, d);
  const cdA = cross(c, d, a);
  const cdB = cross(c, d, b);
  if (((abC > 0 && abD < 0) || (abC < 0 && abD > 0)) &&
      ((cdA > 0 && cdB < 0) || (cdA < 0 && cdB > 0))) return true;
  return (Math.abs(abC) < 1e-10 && onSegment(a, b, c)) ||
    (Math.abs(abD) < 1e-10 && onSegment(a, b, d)) ||
    (Math.abs(cdA) < 1e-10 && onSegment(c, d, a)) ||
    (Math.abs(cdB) < 1e-10 && onSegment(c, d, b));
}

/** Validate a farm outline represented as Leaflet-style {latitude, longitude} points. */
export function validateFarmPolygon(points) {
  if (!Array.isArray(points) || points.length < 3) {
    return { valid: false, error: 'Add at least three boundary points.' };
  }

  for (const point of points) {
    const result = validateCoordinates(point?.latitude, point?.longitude);
    if (!result.valid) return result;
  }

  for (let i = 0; i < points.length; i += 1) {
    if (samePoint(points[i], points[(i + 1) % points.length])) {
      return { valid: false, error: 'Boundary points must not be repeated.' };
    }
  }

  const unwrapped = unwrapLongitudes(points);
  const edgeCount = unwrapped.length;
  for (let i = 0; i < edgeCount; i += 1) {
    const a = unwrapped[i];
    const b = unwrapped[(i + 1) % edgeCount];
    for (let j = i + 1; j < edgeCount; j += 1) {
      if (j === i || j === (i + 1) % edgeCount || (j + 1) % edgeCount === i) continue;
      if (segmentsIntersect(a, b, unwrapped[j], unwrapped[(j + 1) % edgeCount])) {
        return { valid: false, error: 'Boundary edges cross. Move a point to make a simple polygon.' };
      }
    }
  }

  const areaSquareMeters = calculateSphericalArea(points);
  if (!Number.isFinite(areaSquareMeters) || areaSquareMeters < 1) {
    return { valid: false, error: 'The boundary is too small or has no measurable area.' };
  }
  if (areaSquareMeters > 1e12) {
    return { valid: false, error: 'The boundary is too large to be a farm parcel.' };
  }

  return { valid: true, error: null, areaSquareMeters };
}

/** Spherical geodesic area using the Chamberlain-Duquette surface integral. */
export function calculateSphericalArea(points) {
  if (!Array.isArray(points) || points.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < points.length; i += 1) {
    const current = points[i];
    const next = points[(i + 1) % points.length];
    let deltaLongitude = (next.longitude - current.longitude) * Math.PI / 180;
    if (deltaLongitude > Math.PI) deltaLongitude -= 2 * Math.PI;
    if (deltaLongitude < -Math.PI) deltaLongitude += 2 * Math.PI;
    const latitude1 = current.latitude * Math.PI / 180;
    const latitude2 = next.latitude * Math.PI / 180;
    sum += deltaLongitude * (2 + Math.sin(latitude1) + Math.sin(latitude2));
  }
  return Math.abs(sum * EARTH_RADIUS_METERS * EARTH_RADIUS_METERS / 2);
}

/** Return a closed GeoJSON Polygon ring in [longitude, latitude] order. */
export function toGeoJsonPolygon(points) {
  const coordinates = points.map(({ latitude, longitude }) => [longitude, latitude]);
  if (coordinates.length) coordinates.push([...coordinates[0]]);
  let signedArea = 0;
  for (let i = 0; i < coordinates.length - 1; i += 1) {
    signedArea += coordinates[i][0] * coordinates[i + 1][1] - coordinates[i + 1][0] * coordinates[i][1];
  }
  if (signedArea < 0) coordinates.reverse();
  return { type: 'Polygon', coordinates: [coordinates] };
}

/** Calculate a representative point from the planar centroid of the local outline. */
export function getPolygonCentroid(points) {
  if (!Array.isArray(points) || points.length < 3) return null;
  const unwrapped = unwrapLongitudes(points);
  let twiceArea = 0;
  let xSum = 0;
  let ySum = 0;
  for (let i = 0; i < unwrapped.length; i += 1) {
    const a = unwrapped[i];
    const b = unwrapped[(i + 1) % unwrapped.length];
    const factor = a.x * b.latitude - b.x * a.latitude;
    twiceArea += factor;
    xSum += (a.x + b.x) * factor;
    ySum += (a.latitude + b.latitude) * factor;
  }
  if (Math.abs(twiceArea) < 1e-12) return null;
  let longitude = xSum / (3 * twiceArea);
  while (longitude > 180) longitude -= 360;
  while (longitude < -180) longitude += 360;
  return [ySum / (3 * twiceArea), longitude];
}

export function formatArea(value, unit, locale = 'en') {
  if (!Number.isFinite(value)) return '—';
  const labels = {
    feddan: locale === 'ar' ? 'فدان' : 'feddan',
    hectare: locale === 'ar' ? 'هكتار' : 'ha',
    squareMeter: locale === 'ar' ? 'م²' : 'm²',
    squareKilometer: locale === 'ar' ? 'كم²' : 'km²',
  };
  const digits = value < 1 ? 3 : value < 100 ? 2 : 0;
  return `${new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en', { maximumFractionDigits: digits }).format(value)} ${labels[unit] || unit}`;
}

/** Build the normalized farm-location/session record for either UI selection method. */
export function createFarmLocationSelection({ mode, latitude, longitude, area, areaUnit, boundaryPoints = [], label }) {
  const coordinatesValidation = validateCoordinates(latitude, longitude);
  if (!coordinatesValidation.valid) return { valid: false, error: coordinatesValidation.error };
  if (!FARM_AREA_UNITS[areaUnit]) return { valid: false, error: 'Choose a supported area unit.' };

  const source = {
    id: mode === 'boundary' ? 'user-drawn-boundary' : 'user-point-area',
    name: mode === 'boundary' ? 'User-drawn GeoJSON farm boundary' : 'User-selected reference point and entered area',
    dataKind: 'derived',
    limitations: mode === 'boundary'
      ? ['Area uses a spherical Earth model; the polygon is retained for future spatial analysis']
      : ['Entered area is an estimate around a reference point; it does not define the farm boundary'],
  };

  if (mode === 'point-area') {
    const areaSquareMeters = convertArea(area, areaUnit, 'squareMeter');
    if (!Number.isFinite(area) || area <= 0 || !Number.isFinite(areaSquareMeters) || areaSquareMeters > 1e12) {
      return { valid: false, error: 'Enter a farm area greater than zero and within the supported range.' };
    }
    const farmLocation = {
      latitude,
      longitude,
      label,
      area,
      areaUnit,
      selectionMethod: 'point-area',
      geometry: null,
      boundaryDerivedArea: null,
      source,
    };
    return {
      valid: true,
      error: null,
      farmLocation,
      farmArea: { geometryType: 'point', coordinates: [latitude, longitude], area, areaUnit, selectionMethod: 'point-area', geometry: null, boundaryDerivedArea: null, source },
    };
  }

  const polygonValidation = validateFarmPolygon(boundaryPoints);
  if (!polygonValidation.valid) return { valid: false, error: polygonValidation.error };
  const centroid = getPolygonCentroid(boundaryPoints);
  if (!centroid) return { valid: false, error: 'Could not determine a representative point for this boundary.' };
  const geometry = toGeoJsonPolygon(boundaryPoints);
  const areaInSelectedUnit = convertArea(polygonValidation.areaSquareMeters, 'squareMeter', areaUnit);
  const boundaryDerivedArea = { value: polygonValidation.areaSquareMeters, unit: 'squareMeter' };
  const farmLocation = {
    latitude: centroid[0],
    longitude: centroid[1],
    label: label || 'Farm boundary centroid',
    area: areaInSelectedUnit,
    areaUnit,
    selectionMethod: 'polygon-boundary',
    geometry,
    boundaryDerivedArea,
    source,
  };
  return {
    valid: true,
    error: null,
    farmLocation,
    farmArea: { geometryType: 'polygon', coordinates: geometry.coordinates, area: areaInSelectedUnit, areaUnit, selectionMethod: 'polygon-boundary', geometry, boundaryDerivedArea, source },
  };
}
