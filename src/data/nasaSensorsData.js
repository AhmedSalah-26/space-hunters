/**
 * NASA Earth Satellite Sensors Data and Telemetry Integration
 * Schema-ready for database / API connection
 */

export const nasaSensorsHeader = {
  titleAr: "تكامل الاستشعار الفضائي (NASA Space-to-Farm Telemetry)",
  titleEn: "Space-to-Farm Telemetry (NASA Earth Observation)",
  subAr: "المستشعرات الفضائية المستخدمة في قياس ومطابقة صحة المحاصيل والتربة والمناخ.",
  subEn: "Earth-observing satellite sensors measuring crop health, soil dynamics, and climate trends.",
  accuracyStampAr: "نسبة دقة المطابقة المكانية:",
  accuracyStampEn: "Spatial Calibration Accuracy:",
  accuracyScore: "99.4% Space-Calibrated Accuracy"
};

export const nasaSensorCards = [
  {
    id: "smap",
    satellite: "🛰️ NASA SMAP",
    badge: "Soil Moisture",
    borderColor: "border-sky-500/40",
    titleColor: "text-sky-300",
    badgeBg: "bg-sky-950 text-sky-400 border-sky-500/30",
    descAr: "رصد رطوبة منطقة الجذور على عمق 5 سم؛ أكد نجاح دورتك في استعادة رطوبة التربة الطبيعية وتفادي الجفاف.",
    descEn: "Monitors root-zone soil moisture at 5cm depth, verifying soil hydration recovery and drought mitigation."
  },
  {
    id: "landsat",
    satellite: "🛰️ Landsat-9 (LST)",
    badge: "Surface Temp",
    borderColor: "border-red-500/40",
    titleColor: "text-red-300",
    badgeBg: "bg-red-950 text-red-400 border-red-500/30",
    descAr: "قياس درجة حرارة سطح الأرض؛ انخفض الإجهاد الحراري بمقدار 1.8°C بفضل التغطية المستمرة للمحاصيل.",
    descEn: "Tracks land surface temperatures, confirming a 1.8°C drop in thermal stress via continuous crop cover."
  },
  {
    id: "modis",
    satellite: "🛰️ MODIS / NDVI",
    badge: "Vegetation Index",
    borderColor: "border-emerald-500/40",
    titleColor: "text-emerald-300",
    badgeBg: "bg-emerald-950 text-emerald-400 border-emerald-500/30",
    descAr: "مؤشر صحة الكلوروفيل والغطاء الأخضر؛ سجل ارتفاعاً بنسبة +32% مما يعكس حيوية ممتازة للنباتات.",
    descEn: "Evaluates chlorophyll vitality and vegetative canopy, detecting a +32% surge in overall crop health."
  },
  {
    id: "gpm",
    satellite: "🛰️ NASA GPM",
    badge: "Precipitation",
    borderColor: "border-cyan-500/40",
    titleColor: "text-cyan-300",
    badgeBg: "bg-cyan-950 text-cyan-400 border-cyan-500/30",
    descAr: "رصد نماذج الأمطار العالمية لضبط جداول الري التكميلي ومواعيد زراعة البقوليات الصيفية.",
    descEn: "Maps global precipitation patterns to optimize supplemental irrigation schedules and legume planting windows."
  }
];
