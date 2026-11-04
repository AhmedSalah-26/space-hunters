import { Sprout, Layers, Satellite } from 'lucide-react';

/**
 * Crop Database, Soil Database, and Satellite Sensors Reference
 * Ready for database / API connection
 */

export const agriBankHeader = {
  badge: "Scenario Reference Catalog",
  subAr: "كتالوج توضيحي محلي للمحاصيل والتربة ومراجع المستشعرات",
  subEn: "Illustrative local catalog of crops, soils, and sensor references",
  searchPlaceholderAr: "بحث في بنك المحاصيل...",
  searchPlaceholderEn: "Search crops database...",
  footerNoteAr: "بيانات توضيحية ثابتة؛ ليست قياسات تربة محلية أو رصداً من NASA",
  footerNoteEn: "Static illustrative data; not local soil measurements or NASA observations",
  closeBtnAr: "إغلاق",
  closeBtnEn: "Close"
};

export const agriBankTabs = [
  { id: 'crops', labelAr: 'بنك المحاصيل والبذور', labelEn: 'Crop & Seed Vault', icon: Sprout, iconColor: 'text-emerald-400' },
  { id: 'soil', labelAr: 'أمثلة توضيحية للتربة', labelEn: 'Illustrative Soil Profiles', icon: Layers, iconColor: 'text-amber-400' },
  { id: 'satellites', labelAr: 'مراجع مستشعرات NASA', labelEn: 'NASA Sensor References', icon: Satellite, iconColor: 'text-cyan-400' },
];

export const agriBankLabels = {
  waterUsageAr: "استهلاك المياه:",
  waterUsageEn: "Water Usage:",
  nitrogenAr: "النيتروجين:",
  nitrogenEn: "Nitrogen:",
  optimalSeasonAr: "الموسم الأمثل:",
  optimalSeasonEn: "Optimal Season:",
  organicMatterAr: "المادة العضوية:",
  organicMatterEn: "Organic Matter:",
  drainageAr: "النفاذية والتصريف:",
  drainageEn: "Drainage:",
  recommendedRotationAr: "الدورة الزراعية الموصى بها:",
  recommendedRotationEn: "Recommended Rotation:",
  spaceUsageAr: "التطبيق الزراعي:",
  spaceUsageEn: "Agronomic Usage:"
};

export const cropDatabase = [
  {
    id: 'wheat',
    nameAr: 'القمح الشتوي المقاوم',
    nameEn: 'Winter Wheat',
    categoryAr: 'حبوب رئيسية',
    categoryEn: 'Cereal Grain',
    image: '/images/crop_wheat.jpg',
    waterLevel: 'يتباين حسب الصنف والإدارة؛ تقدير نوعي فقط',
    waterLevelEn: 'Varies by cultivar and management; qualitative only',
    nitrogen: 'احتياج النيتروجين يتباين؛ الكمية غير متاحة',
    nitrogenEn: 'Nitrogen need varies; quantity unavailable',
    soilBenefitAr: 'يحمي التربة من الرياح الربيعية',
    soilBenefitEn: 'Potential soil cover depends on local practice',
    optimalSeasonAr: 'الموسم الشتوي',
    optimalSeasonEn: 'Winter Season'
  },
  {
    id: 'legumes',
    nameAr: 'الفول البلدي والبقوليات',
    nameEn: 'Faba Beans & Legumes',
    categoryAr: 'بقوليات مخصبة',
    categoryEn: 'N-Fixing Legume',
    image: '/images/crop_legumes.jpg',
    waterLevel: 'يتباين حسب الصنف والإدارة؛ تقدير نوعي فقط',
    waterLevelEn: 'Varies by cultivar and management; qualitative only',
    nitrogen: 'قد تثبت بعض الأنواع النيتروجين؛ الكمية غير مضمونة',
    nitrogenEn: 'Some species may fix nitrogen; amount is not guaranteed',
    soilBenefitAr: 'تجديد خصوبة التربة وتقليل الأسمدة الكيماوية',
    soilBenefitEn: 'Potential contribution depends on species and conditions',
    optimalSeasonAr: 'الموسم الصيفي / التعاقبي',
    optimalSeasonEn: 'Summer / Intermediate'
  },
  {
    id: 'sorghum',
    nameAr: 'الذرة الرفيعة (سورغم / دخن)',
    nameEn: 'Sorghum & Millets',
    categoryAr: 'حبوب مقاومة للجفاف',
    categoryEn: 'Drought-Hardy Grain',
    image: '/images/crop_rice.jpg',
    waterLevel: 'يتباين حسب الصنف والإدارة؛ تقدير نوعي فقط',
    waterLevelEn: 'Varies by cultivar and management; qualitative only',
    nitrogen: 'الكمية غير متاحة',
    nitrogenEn: 'Quantity unavailable',
    soilBenefitAr: 'جذور عميقة تفكك الطبقات الصماء وتمنع التملح',
    soilBenefitEn: 'Root traits vary by species and cultivar',
    optimalSeasonAr: 'الموسم الصيفي الجاف',
    optimalSeasonEn: 'Dry Summer Season'
  },
  {
    id: 'corn',
    nameAr: 'الذرة الصيفية المتكيفة',
    nameEn: 'Adapted Summer Corn',
    categoryAr: 'محصول نقدي وغذائي',
    categoryEn: 'Cash Crop',
    image: '/images/crop_corn.jpg',
    waterLevel: 'يتباين حسب الصنف والإدارة؛ تقدير نوعي فقط',
    waterLevelEn: 'Varies by cultivar and management; qualitative only',
    nitrogen: 'احتياج النيتروجين يتباين؛ الكمية غير متاحة',
    nitrogenEn: 'Nitrogen need varies; quantity unavailable',
    soilBenefitAr: 'إنتاجية وفيرة عند زراعتها بعد البقوليات',
    soilBenefitEn: 'Yield response depends on local soil and management',
    optimalSeasonAr: 'الموسم الصيفي الرطب',
    optimalSeasonEn: 'Summer Season'
  }
];

export const soilDatabase = [
  {
    typeAr: 'طميية ثقيلة (Clay Loam)',
    typeEn: 'Heavy Clay Loam',
    regionAr: 'دلتا النيل (مصر)',
    regionEn: 'Nile Delta (Egypt)',
    ph: 'غير متاح دون تحليل عينة',
    phEn: 'Unavailable without a soil test',
    organicMatter: 'غير متاحة دون تحليل عينة',
    organicMatterEn: 'Unavailable without a soil test',
    drainageAr: 'متوسط إلى بطيء',
    drainageEn: 'Moderate to Slow',
    recRotationAr: 'قمح ➔ فول بلدي ➔ ذرة صفراء',
    recRotationEn: 'Wheat ➔ Legumes ➔ Corn'
  },
  {
    typeAr: 'تربة لاتوسول حمراء (Oxisol)',
    typeEn: 'Oxisol Tropical Clay',
    regionAr: 'حوض الأمازون وسيرادو (البرازيل)',
    regionEn: 'Amazon Basin (Brazil)',
    ph: 'غير متاح دون تحليل عينة',
    phEn: 'Unavailable without a soil test',
    organicMatter: 'غير متاحة دون تحليل عينة',
    organicMatterEn: 'Unavailable without a soil test',
    drainageAr: 'سريع وعالي النفاذية',
    drainageEn: 'Fast & High Permeability',
    recRotationAr: 'حبوب تغطية ➔ فول صويا ➔ ذرة براكياريا',
    recRotationEn: 'Cover Crop ➔ Soybeans ➔ Brachiaria Corn'
  },
  {
    typeAr: 'طميية غرينية سهلية (Alluvial Silt)',
    typeEn: 'Alluvial Silt Loam',
    regionAr: 'سهول البنجاب (الهند)',
    regionEn: 'Punjab Plains (India)',
    ph: 'غير متاح دون تحليل عينة',
    phEn: 'Unavailable without a soil test',
    organicMatter: 'غير متاحة دون تحليل عينة',
    organicMatterEn: 'Unavailable without a soil test',
    drainageAr: 'سريع التبخر السطحي',
    drainageEn: 'Rapid surface evaporation',
    recRotationAr: 'قمح قصير الموسم ➔ حمص ➔ دخن وسورغم',
    recRotationEn: 'Short-cycle Wheat ➔ Chickpeas ➔ Sorghum/Millets'
  }
];

export const satellitesData = [
  {
    name: 'SMAP (Soil Moisture Active Passive)',
    metricAr: 'رطوبة التربة السطحية والجذرية',
    metricEn: 'Root-Zone Soil Moisture',
    resolution: 'Not integrated',
    usageAr: 'تحديد الجفاف تحت السطحي ومواعيد الري الدقيق للدورات الزراعية',
    usageEn: 'Detect subsurface drought and optimize irrigation timing for crop rotations'
  },
  {
    name: 'Landsat-9 & Sentinel-2',
    metricAr: 'مؤشر الغطاء النباتي (NDVI) والحرارة السطحية (LST)',
    metricEn: 'Vegetation Health (NDVI) & Land Surface Temp',
    resolution: 'Not integrated',
    usageAr: 'مراقبة صحة المحاصيل ورصد التغيرات التاريخية للتربة',
    usageEn: 'Monitor crop vigor and analyze historical soil evolution'
  },
  {
    name: 'ECOSTRESS (ISS)',
    metricAr: 'التبخر-النتح والإجهاد الحراري للنباتات',
    metricEn: 'Evapotranspiration & Thermal Stress',
    resolution: 'Not integrated',
    usageAr: 'قياس حرارة أوراق النباتات والإنذار المبكر قبل ذبول المحصول',
    usageEn: 'Measure canopy temperature for early warning of thermal crop stress'
  },
  {
    name: 'GRACE-FO',
    metricAr: 'حركة ومخزون المياه الجوفية العميقة',
    metricEn: 'Groundwater Storage Anomaly',
    resolution: 'Not integrated',
    usageAr: 'حماية الأحواض الجوفية من النضوب والتخطيط المستدام',
    usageEn: 'Safeguard deep aquifers from depletion and plan sustainable rotations'
  }
];
