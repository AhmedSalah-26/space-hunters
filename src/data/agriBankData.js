import { Sprout, Layers, Satellite } from 'lucide-react';

/**
 * Crop Database, Soil Database, and Satellite Sensors Reference
 * Ready for database / API connection
 */

export const agriBankHeader = {
  badge: "NASA Field Shift Vault",
  subAr: "قاعدة بيانات المحاصيل، التربة، والاستشعار الفضائي لدعم قرارات الدورات الزراعية",
  subEn: "Comprehensive database of crops, soils, and NASA Earth telemetry supporting crop rotations",
  searchPlaceholderAr: "بحث في بنك المحاصيل...",
  searchPlaceholderEn: "Search crops database...",
  footerNoteAr: "بيانات محدثة مباشرة من مستودع NASA Earth Science Data",
  footerNoteEn: "Data directly synchronized from NASA Earth Science Data repository",
  closeBtnAr: "إغلاق",
  closeBtnEn: "Close"
};

export const agriBankTabs = [
  { id: 'crops', labelAr: 'بنك المحاصيل والبذور', labelEn: 'Crop & Seed Vault', icon: Sprout, iconColor: 'text-emerald-400' },
  { id: 'soil', labelAr: 'بيانات التربة المحلية', labelEn: 'Local Soil Profiles', icon: Layers, iconColor: 'text-amber-400' },
  { id: 'satellites', labelAr: 'أقمار ومستشعرات NASA', labelEn: 'NASA Space Telemetry', icon: Satellite, iconColor: 'text-cyan-400' },
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
    waterLevel: 'منخفض - متوسط (-25%)',
    waterLevelEn: 'Low - Medium (-25%)',
    nitrogen: 'يستهلك (-20 kg/ha)',
    nitrogenEn: 'Consumes (-20 kg/ha)',
    droughtScore: 88,
    soilBenefitAr: 'يحمي التربة من الرياح الربيعية',
    soilBenefitEn: 'Protects against wind erosion',
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
    waterLevel: 'منخفض جداً (-40%)',
    waterLevelEn: 'Very Low (-40%)',
    nitrogen: 'يثبت نيتروجين طبيعي (+45 kg/ha)',
    nitrogenEn: 'Fixes Bio-Nitrogen (+45 kg/ha)',
    droughtScore: 92,
    soilBenefitAr: 'تجديد خصوبة التربة وتقليل الأسمدة الكيماوية',
    soilBenefitEn: 'Restores fertility & cuts chemical fertilizer',
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
    waterLevel: 'منخفض جداً (-55%)',
    waterLevelEn: 'Ultra Low (-55%)',
    nitrogen: 'متوازن (-10 kg/ha)',
    nitrogenEn: 'Balanced (-10 kg/ha)',
    droughtScore: 99,
    soilBenefitAr: 'جذور عميقة تفكك الطبقات الصماء وتمنع التملح',
    soilBenefitEn: 'Deep taproots aerate subsoil and curb salinity',
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
    waterLevel: 'متوسط إلى مرتفع',
    waterLevelEn: 'Moderate to High',
    nitrogen: 'شره للنيتروجين (-35 kg/ha)',
    nitrogenEn: 'N-Demanding (-35 kg/ha)',
    droughtScore: 72,
    soilBenefitAr: 'إنتاجية وفيرة عند زراعتها بعد البقوليات',
    soilBenefitEn: 'Optimal yields when preceded by legumes',
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
    ph: '7.8',
    organicMatter: '1.2% (بحاجة لدعم عضوي)',
    organicMatterEn: '1.2% (Needs organic recharge)',
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
    ph: '5.6',
    organicMatter: '1.8% (معرضة للانجراف السريع)',
    organicMatterEn: '1.8% (Vulnerable to erosion)',
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
    ph: '8.1',
    organicMatter: '0.9% (مستنزف بموجات الحر)',
    organicMatterEn: '0.9% (Depleted by heatwaves)',
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
    resolution: '9 km / 3 أيام',
    usageAr: 'تحديد الجفاف تحت السطحي ومواعيد الري الدقيق للدورات الزراعية',
    usageEn: 'Detect subsurface drought and optimize irrigation timing for crop rotations'
  },
  {
    name: 'Landsat-9 & Sentinel-2',
    metricAr: 'مؤشر الغطاء النباتي (NDVI) والحرارة السطحية (LST)',
    metricEn: 'Vegetation Health (NDVI) & Land Surface Temp',
    resolution: '30 m / 8 أيام',
    usageAr: 'مراقبة صحة المحاصيل ورصد التغيرات التاريخية للتربة',
    usageEn: 'Monitor crop vigor and analyze historical soil evolution'
  },
  {
    name: 'ECOSTRESS (ISS)',
    metricAr: 'التبخر-النتح والإجهاد الحراري للنباتات',
    metricEn: 'Evapotranspiration & Thermal Stress',
    resolution: '70 m / محطة الفضاء الدولية',
    usageAr: 'قياس حرارة أوراق النباتات والإنذار المبكر قبل ذبول المحصول',
    usageEn: 'Measure canopy temperature for early warning of thermal crop stress'
  },
  {
    name: 'GRACE-FO',
    metricAr: 'حركة ومخزون المياه الجوفية العميقة',
    metricEn: 'Groundwater Storage Anomaly',
    resolution: 'Gravity Anomaly Tracking',
    usageAr: 'حماية الأحواض الجوفية من النضوب والتخطيط المستدام',
    usageEn: 'Safeguard deep aquifers from depletion and plan sustainable rotations'
  }
];
