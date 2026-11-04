const KEY_VARIABLES = ['T2M', 'PRECTOTCORR', 'RH2M', 'ALLSKY_SFC_SW_DWN'];

function sameCoordinate(a, b) {
  return Number.isFinite(a?.latitude) && Number.isFinite(a?.longitude)
    && a.latitude === b?.latitude && a.longitude === b?.longitude;
}

/**
 * Compare two observations before placing them in a shared environmental
 * context. Values from different units remain separate dimensions; this does
 * not numerically average or scale unlike variables.
 */
export function areObservationsCompatible(a, b) {
  if (!a || !b || !a.source || !b.source) return false;
  if (!['observation', 'reference'].includes(a.source.dataKind) || a.source.dataKind !== b.source.dataKind) return false;
  if (!a.source.provider || !a.source.dataset || !a.source.coordinateReferenceSystem) return false;
  if (a.source.provider !== b.source.provider || a.source.dataset !== b.source.dataset) return false;
  if (a.source.coordinateReferenceSystem !== b.source.coordinateReferenceSystem) return false;
  if (!a.referenceDate || !a.temporalResolution || !a.temporalCoverage) return false;
  if (a.referenceDate !== b.referenceDate || a.temporalResolution !== b.temporalResolution) return false;
  if (a.temporalCoverage !== b.temporalCoverage) return false;
  const spatialA = a.spatialResolution || a.source.spatialResolution;
  const spatialB = b.spatialResolution || b.source.spatialResolution;
  if (!spatialA || spatialA !== spatialB) return false;
  if (!a.unit || !b.unit || (a.variable === b.variable && a.unit !== b.unit)) return false;
  return sameCoordinate(a.source.requestCoordinates, b.source.requestCoordinates);
}

/**
 * Build month-aligned, source-homogeneous context bundles. No values are
 * collapsed into a single index. Polygon farms retain point sampling semantics
 * because the current POWER product does not provide boundary aggregation.
 */
export function fuseEnvironmentalObservations(observations = [], farmLocation = null) {
  const records = observations.filter((item) => (
    Number.isFinite(item?.value)
    && item.source
    && ['observation', 'reference'].includes(item.source.dataKind)
    && KEY_VARIABLES.includes(item.variable)
  ));
  const groups = [];
  records.forEach((observation) => {
    let group = groups.find((candidate) => areObservationsCompatible(candidate.observations[0], observation));
    if (!group) {
      group = {
        id: `${observation.source.id}:${observation.referenceDate}`,
        referenceDate: observation.referenceDate,
        source: observation.source,
        temporalResolution: observation.temporalResolution,
        temporalCoverage: observation.temporalCoverage,
        spatialResolution: observation.spatialResolution || observation.source.spatialResolution || 'Not reported',
        observations: [],
      };
      groups.push(group);
    }
    group.observations.push(observation);
  });

  const isPolygonPointSample = farmLocation?.selectionMethod === 'polygon-boundary';
  return groups.map((group) => ({
    ...group,
    combination: 'Aligned observations; values and units remain separate',
    dataQualityConsideration: [...new Set(group.observations.map((item) => item.quality || 'Quality not reported'))],
    spatialInterpretation: isPolygonPointSample
      ? 'Representative point sample at the polygon centroid; no farm-area aggregation was performed.'
      : 'Point sample at the selected reference coordinate; not a farm-area average.',
  }));
}
