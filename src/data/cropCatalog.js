import { universalCropsDatabase } from './universalRotationData.js';

export const CROP_DATA_SOURCES = Object.freeze({
  faoWater: {
    id: 'fao-crop-water-needs',
    provider: 'Food and Agriculture Organization of the United Nations',
    name: 'FAO Irrigation Water Management: Crop Water Needs, Table 14',
    url: 'https://www.fao.org/4/S2022E/s2022e07.htm',
    limitations: [
      'FAO describes these as rough indicative crop-water needs over the full growing period.',
      'Crop water need is evapotranspiration, not farm irrigation withdrawal or crop water-use efficiency.',
      'Actual values vary with climate, crop duration, cultivar, and management.',
    ],
  },
  extensionFamilies: {
    id: 'umn-crop-family-rotation',
    provider: 'University of Minnesota Extension',
    name: 'Plant families for crop rotation',
    url: 'https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/living-soil-healthy-garden',
    limitations: ['General crop-family guidance; not a local planting calendar or pest diagnosis.'],
  },
  extensionLegumes: {
    id: 'umn-legume-nitrogen',
    provider: 'University of Minnesota Extension',
    name: 'Legumes and soil nitrogen in crop rotations',
    url: 'https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/living-soil-healthy-garden',
    limitations: [
      'Nitrogen fixation depends on compatible rhizobia and growing conditions.',
      'Fixation potential is not a guaranteed quantity of plant-available nitrogen added to soil.',
    ],
  },
});

// FAO Table 14 values are indicative crop water needs (mm per full growing period).
// A generic-bean range is kept visibly qualified when shown for faba beans.
const WATER_NEEDS = Object.freeze({
  winter_wheat: { rangeMm: [450, 650] },
  barley: { rangeMm: [450, 650] },
  summer_corn: { rangeMm: [500, 800] },
  faba_beans: { rangeMm: [300, 500], scope: 'FAO generic bean category; not variety-specific faba-bean calibration', scopeAr: 'فئة فاصوليا عامة لدى FAO؛ لا تعاير لصنف الفول البلدي.' },
  soybeans: { rangeMm: [450, 700] },
  sorghum_grain: { rangeMm: [450, 650] },
  pearl_millet: { rangeMm: [450, 650] },
  sunflower: { rangeMm: [600, 1000] },
});

const SUPPORTED_FAMILIES = Object.freeze({
  winter_wheat: { family: 'Poaceae', scope: 'Wheat listed in source family guide.' },
  barley: { family: 'Poaceae', scope: 'Barley listed in source family guide.' },
  summer_corn: { family: 'Poaceae', scope: 'Corn listed in source family guide.' },
  faba_beans: { family: 'Fabaceae', scope: 'General bean/legume classification; crop-specific nitrogen outcome varies.' },
  soybeans: { family: 'Fabaceae', scope: 'Legume family; nitrogen fixation remains a conditional potential.' },
  chickpeas: { family: 'Fabaceae', scope: 'Legume family; nitrogen fixation remains a conditional potential.' },
  lentils: { family: 'Fabaceae', scope: 'Lentil listed in source family guide.' },
  egyptian_clover: { family: 'Fabaceae', scope: 'Clover/legume family; fixation outcome varies with rhizobia and management.' },
  sorghum_grain: { family: 'Poaceae', scope: 'Sorghum listed in source family guide.' },
  sunflower: { family: 'Asteraceae', scope: 'Sunflower listed in source family guide.' },
});

const LEGUME_IDS = new Set(['faba_beans', 'soybeans', 'chickpeas', 'lentils', 'egyptian_clover']);

const CROP_ALIASES = Object.freeze({
  wheat: 'winter_wheat',
  legumes_faba: 'faba_beans',
  corn: 'summer_corn',
  sorghum: 'sorghum_grain',
});

/** Unified catalog. Unavailable characteristics stay null; legacy numeric fields are deliberately not copied. */
export const cropCatalog = universalCropsDatabase.map((legacyCrop) => {
  const familyEvidence = SUPPORTED_FAMILIES[legacyCrop.id];
  const water = WATER_NEEDS[legacyCrop.id];
  const nitrogenPotential = LEGUME_IDS.has(legacyCrop.id);
  return {
    id: legacyCrop.id,
    nameAr: legacyCrop.nameAr,
    nameEn: legacyCrop.nameEn,
    category: legacyCrop.category,
    family: familyEvidence?.family || null,
    familyEvidence: familyEvidence ? { ...CROP_DATA_SOURCES.extensionFamilies, scope: familyEvidence.scope } : null,
    cropWaterNeed: water ? {
      rangeMmPerGrowingPeriod: water.rangeMm,
      source: { ...CROP_DATA_SOURCES.faoWater },
      scope: water.scope || 'General crop category; not a farm-specific estimate.',
      scopeAr: water.scopeAr || 'فئة عامة للمحصول؛ ليست تقديراً خاصاً بالمزرعة.',
    } : null,
    droughtSensitivity: water?.droughtSensitivity || null,
    droughtSensitivitySource: null,
    nitrogenFixationPotential: nitrogenPotential ? 'potential' : (familyEvidence ? 'no-legume-potential' : null),
    nitrogenFixationSource: familyEvidence ? { ...CROP_DATA_SOURCES.extensionLegumes } : null,
    growingSeason: null,
    rootCharacteristics: null,
    soilCoverCharacteristics: null,
    heatSensitivity: null,
    organicMatterContribution: null,
    localConstraints: null,
    marketSuitability: null,
    legacyFieldsStatus: 'Illustrative assumptions from the legacy demo catalog; excluded from scoring.',
  };
});

export function getCanonicalCropId(id) {
  return CROP_ALIASES[id] || id;
}

/** Adapt bundled mission scenario crops to the shared catalog without importing their unsupported metric claims. */
export function buildMissionCropCatalog(missionCrops = []) {
  return missionCrops.map((scenarioCrop) => {
    const canonicalId = getCanonicalCropId(scenarioCrop.id);
    const catalogCrop = cropCatalog.find((crop) => crop.id === canonicalId);
    if (!catalogCrop) return {
      id: scenarioCrop.id,
      nameAr: scenarioCrop.nameAr || scenarioCrop.id,
      nameEn: scenarioCrop.nameEn || scenarioCrop.id,
      family: null,
      cropWaterNeed: null,
      droughtSensitivity: null,
      nitrogenFixationPotential: null,
      familyEvidence: null,
      nitrogenFixationSource: null,
      legacyFieldsStatus: 'Unmapped mission demonstration crop; agronomic attributes are unavailable.',
    };
    return {
      ...catalogCrop,
      id: scenarioCrop.id,
      canonicalId,
      nameAr: scenarioCrop.nameAr || catalogCrop.nameAr,
      nameEn: scenarioCrop.nameEn || catalogCrop.nameEn,
      legacyFieldsStatus: 'Mission names retained; mission metric values are illustrative and excluded from scoring.',
    };
  });
}
