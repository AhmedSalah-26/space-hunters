const CORE_CROP_EVIDENCE = ['cropWaterNeed', 'family', 'droughtSensitivity', 'nitrogenFixationPotential'];

/** Qualitative data-completeness assessment; deliberately does not output confidence percentages. */
export function assessRotationUncertainty({ strategy = null, evaluation = null, farmLocation = null, environmentalObservations = [] } = {}) {
  const crops = strategy?.crops || [];
  const knownCropEvidence = crops.reduce((total, crop) => total + CORE_CROP_EVIDENCE.filter((key) => {
    if (key === 'cropWaterNeed') return Boolean(crop?.cropWaterNeed?.source);
    if (key === 'family') return Boolean(crop?.family && crop?.familyEvidence?.url);
    if (key === 'droughtSensitivity') return Boolean(crop?.droughtSensitivity && crop?.droughtSensitivitySource?.url);
    return Boolean(crop?.nitrogenFixationSource?.url && crop?.nitrogenFixationPotential);
  }).length, 0);
  const requiredCropEvidence = crops.length * CORE_CROP_EVIDENCE.length;
  const climatology = environmentalObservations.filter((item) => item?.source?.dataKind === 'reference');
  const source = climatology[0]?.source || null;
  const temporalCoverage = source?.temporalCoverage || null;
  const yearRange = String(temporalCoverage || '').match(/^(\d{4})[–-](\d{4})$/);
  const spatialResolution = climatology[0]?.spatialResolution || source?.spatialResolution || null;
  const quality = climatology[0]?.quality || null;
  const sourceLimitations = source?.limitations || ['Environmental source data is unavailable.'];
  const scored = evaluation?.scoredCriteria || [];
  const completeness = requiredCropEvidence && knownCropEvidence === requiredCropEvidence && scored.length >= 4 ? 'Moderate data completeness' : 'Limited evidence';
  const missing = [
    ...(!farmLocation ? ['Farm coordinate or boundary is not selected.'] : []),
    ...(!evaluation?.farmInputs?.baselineConfirmed ? ['Existing baseline rotation may be an unconfirmed template.'] : []),
    'Local planting and harvest dates are not verified.',
    'Soil-specific crop response, ground cover, erosion, and market data are unavailable.',
    'Crop-specific heat and water stress thresholds are not calibrated for this farm.',
    'No integrated dated multi-year observation series or forecast is available.',
    ...(farmLocation?.selectionMethod === 'polygon-boundary' ? ['Environmental data is a representative-point/centroid sample; no area aggregation is performed.'] : ['A point reference does not describe field-wide variability.']),
  ];
  const missingAr = [
    ...(!farmLocation ? ['لم يتم تحديد إحداثية المزرعة أو حدودها.'] : []),
    ...(!evaluation?.farmInputs?.baselineConfirmed ? ['قد يكون خط الأساس قالباً غير مؤكد للدورة الحالية.'] : []),
    'مواعيد الزراعة والحصاد المحلية غير موثقة.',
    'بيانات استجابة التربة والغطاء الأرضي والتعرية والسوق غير متاحة.',
    'حدود إجهاد الحرارة والمياه الخاصة بالمحصول غير معايرة لهذه المزرعة.',
    'لا تتوفر سلسلة رصد مؤرخة متعددة السنوات أو توقعات مدمجة.',
    ...(farmLocation?.selectionMethod === 'polygon-boundary' ? ['البيئة ممثلة بنقطة مركزية؛ لا يوجد تجميع على مستوى المساحة.'] : ['النقطة المرجعية لا تصف التباين داخل الحقل.']),
  ];
  return {
    overall: completeness,
    overallAr: completeness === 'Moderate data completeness' ? 'اكتمال متوسط للصفات الزراعية' : 'أدلة محدودة',
    basis: 'Qualitative completeness rubric: moderate means sourced evidence supports the displayed crop-trait comparison, while important farm-specific inputs remain absent; limited means core evidence is missing. This is not a statistical confidence estimate.',
    basisAr: 'مقياس نوعي للاكتمال: تعني الدرجة المتوسطة أن المصادر تدعم مقارنة صفات المحاصيل مع بقاء مدخلات مهمة خاصة بالمزرعة مفقودة؛ وتعني الأدلة المحدودة غياب بيانات أساسية. هذا ليس تقديراً إحصائياً للثقة.',
    cropEvidence: { status: completeness, sourcedTraitCount: knownCropEvidence, expectedTraitCount: requiredCropEvidence, traits: CORE_CROP_EVIDENCE },
    environmentalEvidence: {
      status: climatology.length ? 'Limited evidence' : 'Unavailable',
      observationCount: climatology.length,
      kind: climatology.length ? 'Monthly climatological reference, not a dated observation or forecast' : 'No environmental source records available',
      kindAr: climatology.length ? 'مرجع مناخي شهري، وليس رصداً مؤرخاً أو توقعاً' : 'لا تتوفر سجلات مصدر بيئي',
      dataset: source?.dataset || null,
      provider: source?.provider || null,
      sourceUrl: source?.url || null,
      temporalCoverage: source?.temporalCoverage || null,
      temporalCoverageAr: temporalCoverage ? (yearRange ? `الفترة المرجعية: ${yearRange[1]}–${yearRange[2]}` : 'فترة المناخ المرجعية المحددة مسبقاً؛ تفاصيل السنوات غير واردة في الاستجابة') : null,
      temporalResolution: climatology[0]?.temporalResolution || null,
      temporalResolutionAr: climatology.length ? 'متوسط مناخي شهري' : null,
      spatialResolution,
      spatialResolutionAr: spatialResolution ? 'تختلف باختلاف المعلمة والمصدر؛ لا تمثل دقة على مستوى الحقل.' : null,
      retrievalDate: source?.retrievedAt || null,
      quality,
      qualityAr: quality ? (quality.startsWith('Missing') ? 'القيمة مفقودة في استجابة NASA POWER' : 'قيمة جاهزة للتحليل حسب NASA POWER؛ لم يُجرِ التطبيق فحص جودة إضافياً') : null,
      limitations: sourceLimitations,
      limitationsAr: climatology.length ? [
        'مرجع مناخي طويل الأمد، وليس حالة الطقس الحالية أو قياساً حقلياً أو توقعاً.',
        'القيم النقطية تمثل منتجات شبكية وليست متوسطاً لحدود المزرعة.',
        'لم يجرِ التطبيق فحص جودة إضافياً.',
      ] : ['بيانات المصدر البيئي غير متاحة.'],
    },
    missingInputs: missing,
    missingInputsAr: missingAr,
    assumptions: strategy?.assumptions || [],
    improvementNeeds: ['Confirm and document the existing rotation.', 'Provide local planting/harvest calendar, soil test and irrigation availability.', 'Add compatible dated historical rainfall/temperature and field-scale soil-moisture/vegetation products.', 'Provide crop-specific locally validated heat, water and soil response thresholds.', 'Add verified market, equipment and ground-cover constraints.'],
    improvementNeedsAr: ['تأكيد الدورة الحالية وتوثيقها.', 'توفير تقويم محلي للزراعة والحصاد وتحليل للتربة ومعلومات توفر الري.', 'إضافة بيانات مؤرخة متوافقة للأمطار والحرارة ورطوبة التربة والغطاء النباتي على مقياس مناسب.', 'توفير حدود موثقة محلياً لاستجابة المحصول للحرارة والمياه والتربة.', 'إضافة معلومات موثقة عن السوق والمعدات والغطاء الأرضي.'],
    confidence: null,
  };
}
