/**
 * Shared data contracts for the browser-only working session.
 * These JSDoc shapes are documentation and editor hints, not runtime validation.
 * Keep demo/reference values distinguishable from processed observations.
 *
 * @typedef {Object} DataSourceMetadata
 * @property {string} id Stable provider or dataset identifier.
 * @property {string} [dataset] Dataset/product name.
 * @property {string} [provider] Organization or service providing the data.
 * @property {string} name Human-readable source name.
 * @property {'observation'|'reference'|'demo'|'derived'} dataKind Provenance class.
 * @property {string} [url] Source documentation or API URL.
 * @property {{latitude:number,longitude:number}} [requestCoordinates] Coordinates used for a point request.
 * @property {string} [coordinateReferenceSystem] CRS for spatial request coordinates.
 * @property {string} [retrievedAt] ISO timestamp when retrieved by this client.
 * @property {string} [observationDate] Observation date, where applicable.
 * @property {string} [temporalCoverage] Temporal period/coverage or climatology period.
 * @property {string|number} [spatialResolution] Resolution and its unit, when known.
 * @property {string[]} [limitations] Known caveats or transformations.
 */

/**
 * @typedef {Object} FarmLocation
 * @property {number} latitude Representative/reference latitude in decimal degrees.
 * @property {number} longitude Representative/reference longitude in decimal degrees.
 * @property {string} [label]
 * @property {number|null} [area] Area in areaUnit; entered for point-area, calculated for polygon.
 * @property {'feddan'|'hectare'|'squareMeter'|'squareKilometer'} [areaUnit]
 * @property {'point-area'|'polygon-boundary'} [selectionMethod]
 * @property {{type:'Polygon',coordinates:number[][][]}|null} [geometry] Closed GeoJSON Polygon; coordinates are [longitude, latitude].
 * @property {{value:number,unit:'squareMeter'}|null} [boundaryDerivedArea] Polygon area in canonical square meters.
 * @property {DataSourceMetadata} [source]
 */
/** @typedef {{ geometryType: 'point'|'polygon', coordinates: number[]|number[][][], area?: number|null, areaUnit?: 'squareMeter'|'hectare'|'feddan'|'squareKilometer', selectionMethod?: 'point-area'|'polygon-boundary', geometry?: {type:'Polygon',coordinates:number[][][]}|null, boundaryDerivedArea?: {value:number,unit:'squareMeter'}|null, source?: DataSourceMetadata }} FarmArea */
/** @typedef {{ texture?: string, ph?: number, organicMatterPercent?: number, nitrogen?: number, nitrogenUnit?: string, source?: DataSourceMetadata, limitations?: string[] }} SoilInformation */
/** @typedef {{ id: string, name: string, family?: string, season?: string, waterDemand?: number, waterDemandUnit?: string, nitrogenImpact?: number, nitrogenUnit?: string, source?: DataSourceMetadata }} Crop */
/** @typedef {{ variable: string, value: number|string|null, unit: string, source: DataSourceMetadata, observationDate?: string, referenceDate?: string, temporalCoverage?: string, spatialResolution?: string|number, temporalResolution?: string, quality?: string, limitations?: string[] }} EnvironmentalObservation */
/** @typedef {{ id: string, name: string, crops: string[], isBaseline?: boolean, source?: DataSourceMetadata, priorities?: Record<string, number> }} RotationStrategy */
/** @typedef {{ id: string, variable: string, level: 'low'|'medium'|'high'|'unknown', value?: number|string, unit?: string, rationale?: string, source?: DataSourceMetadata }} RiskIndicator */
/** @typedef {{ id: string, variable: string, level: 'low'|'medium'|'high'|'unknown', range?: [number, number], unit?: string, rationale?: string }} UncertaintyIndicator */

/**
 * @typedef {Object} WorkingSession
 * @property {FarmLocation|null} farmLocation
 * @property {FarmArea|null} farmArea
 * @property {SoilInformation|null} farmInformation
 * @property {EnvironmentalObservation[]} environmentalObservations
 * @property {Crop[]} selectedCrops
 * @property {RotationStrategy[]} rotationStrategies
 * @property {Object|null} analysisResults Reserved for a later analysis phase.
 */

export const DATA_KINDS = Object.freeze({
  OBSERVATION: 'observation',
  REFERENCE: 'reference',
  DEMO: 'demo',
  DERIVED: 'derived',
});

/** @returns {WorkingSession} */
export function createEmptyWorkingSession() {
  return {
    farmLocation: null,
    farmArea: null,
    farmInformation: null,
    environmentalObservations: [],
    selectedCrops: [],
    rotationStrategies: [],
    analysisResults: null,
  };
}
