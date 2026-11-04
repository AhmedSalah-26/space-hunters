/**
 * Risk screening must not infer a hazard level from climatology without crop,
 * local, and validated thresholds. This function reports evidence and gaps.
 */
export function assessEnvironmentalRisk({ observations = [], farmLocation = null, farmInputs = {}, strategies = [] } = {}) {
  const reference = observations.filter((item) => item?.source?.dataKind === 'reference' && Number.isFinite(item.value));
  const monthlyReference = reference.filter((item) => String(item.referenceDate || '').startsWith('climatology:'));
  const rangeFor = (variable) => {
    const values = monthlyReference.filter((item) => item.variable === variable);
    if (values.length < 2) return null;
    const numbers = values.map((item) => item.value);
    return { min: Math.min(...numbers), max: Math.max(...numbers), unit: values[0].unit, coverage: values[0].temporalCoverage, source: values[0].source };
  };
  const risks = [
    { id: 'water-stress', label: 'Water stress', labelAr: 'الإجهاد المائي', level: 'unassessed', evidence: rangeFor('PRECTOTCORR'), reason: 'Rainfall climatology alone cannot establish crop or farm water stress; soil moisture, crop stage, irrigation, and thresholds are unavailable.', reasonAr: 'مرجع الهطول وحده لا يثبت إجهاد المحصول أو المزرعة؛ رطوبة التربة ومرحلة المحصول والري والحدود غير متاحة.' },
    { id: 'heat-stress', label: 'Heat stress', labelAr: 'الإجهاد الحراري', level: 'unassessed', evidence: rangeFor('T2M'), reason: 'Air-temperature climatology is exposure context, not crop heat stress; crop-specific thresholds and planting dates are unavailable.', reasonAr: 'مرجع حرارة الهواء سياق للتعرض وليس إجهاداً للمحصول؛ حدود المحاصيل ومواعيد الزراعة غير متاحة.' },
    { id: 'rainfall-variability', label: 'Rainfall variability', labelAr: 'تباين الأمطار', level: 'unassessed', evidence: rangeFor('PRECTOTCORR'), reason: 'Monthly climatological seasonality is not year-to-year rainfall variability; a dated multi-year time series is not integrated.', reasonAr: 'الموسمية المناخية الشهرية ليست تبايناً بين السنوات؛ لا تتوفر سلسلة زمنية مؤرخة متعددة السنوات.' },
    { id: 'vegetation-stress', label: 'Vegetation stress', labelAr: 'إجهاد الغطاء النباتي', level: 'unassessed', evidence: null, reason: 'No vegetation-index or canopy-stress provider is integrated.', reasonAr: 'لا يوجد مزود مدمج لمؤشر الغطاء النباتي أو إجهاده.' },
    { id: 'erosion', label: 'Soil erosion potential', labelAr: 'قابلية تعرية التربة', level: 'unassessed', evidence: null, reason: 'Slope, soil erodibility, ground cover, and rainfall intensity inputs are unavailable.', reasonAr: 'بيانات الانحدار وقابلية التربة للتعرية والغطاء النباتي وشدة الأمطار غير متاحة.' },
    { id: 'crop-suitability', label: 'Crop suitability risk', labelAr: 'مخاطر ملاءمة المحاصيل', level: 'unassessed', evidence: null, reason: 'Local crop calendar, soil response, and validated crop-specific heat/water limits are unavailable.', reasonAr: 'تقويم المحاصيل المحلي واستجابة التربة وحدود الحرارة والمياه الموثقة غير متاحة.' },
    { id: 'seasonal-vulnerability', label: 'Seasonal vulnerability', labelAr: 'قابلية التأثر الموسمية', level: 'unassessed', evidence: rangeFor('T2M'), reason: 'The reference shows month-of-year climate patterns, but no verified planting/harvest dates connect them to crop stages.', reasonAr: 'يعرض المرجع نمط المناخ حسب الشهر، لكن لا توجد مواعيد زراعة وحصاد موثقة لربطها بمراحل المحصول.' },
  ];
  const source = monthlyReference[0]?.source || null;
  return {
    risks,
    classification: 'unassessed',
    method: 'Evidence screening only. Risk classes require local thresholds and compatible observations; no forecast or probability is produced.',
    source,
    spatial: {
      status: 'point-reference-only',
      farmGeometry: farmLocation?.geometry || null,
      location: farmLocation ? { latitude: farmLocation.latitude, longitude: farmLocation.longitude } : null,
      explanation: farmLocation?.selectionMethod === 'polygon-boundary'
        ? 'Farm polygon is retained as geometry; POWER values are centroid-point reference only. No spatial aggregation or zone layer is supported.'
        : 'Selected coordinate is a reference point only. POWER climatology is not a field-scale risk surface; no colored risk zones are supported.',
    },
    dataKind: source ? 'historical-climatological-reference' : 'unavailable',
    temporalCoverage: source?.temporalCoverage || null,
    spatialResolution: source?.spatialResolution || null,
    strategyCount: strategies.length,
    farmInputs,
  };
}
