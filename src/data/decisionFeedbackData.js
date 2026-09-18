/**
 * Dynamic Feedback, Ratings, and Evaluation Rules for Crop Rotation Decisions
 * Schema-ready for Database / Evaluation Engine
 */

export const farmerMoodFeedback = {
  monoculture: {
    mood: "worried",
    statusAr: "قلق من النمط الأحادي",
    statusEn: "Worried about Monoculture",
    feedbackAr: "احذر يا بطل! تكرار نفس المحصول يجهد أرضنا ويسبب خسارة 35% من المياه وتراكم الآفات.",
    feedbackEn: "Warning! Repeating the same crop depletes water and exhausts soil nitrogen."
  },
  missingLegume: {
    mood: "thinking",
    statusAr: "يحتاج تنويع",
    statusEn: "Needs Diversification",
    feedbackAr: "توليفة مقبولة، لكن إدخال محصول بقولي (مثل الفول) سيعوض 45 كجم نيتروجين مجاناً للتربة!",
    feedbackEn: "Decent sequence, but adding a legume crop fixes 45 kg/ha of natural nitrogen!"
  },
  optimal: {
    mood: "happy",
    statusAr: "راضي عن الدورة",
    statusEn: "Satisfied with Sequence",
    feedbackAr: "توليفة ممتازة وذكية جداً! وفرت مياه الري وحميت خصوبة التربة وصمدت أمام الإجهاد الحراري.",
    feedbackEn: "Brilliant rotation! Conserves water, fixes natural nitrogen, and shields against heat stress."
  }
};

export const ratingTiers = {
  tierAPlus: {
    grade: "A+",
    gradeColor: "border-emerald-400 bg-emerald-950/80 text-emerald-400 shadow-emerald-500/40 ring-4 ring-emerald-500/20",
    ratingAr: "تصنيف ممتاز ومرن مناخياً 🌟",
    ratingEn: "Outstanding & Climate-Resilient 🌟"
  },
  tierA: {
    grade: "A",
    gradeColor: "border-cyan-400 bg-cyan-950/80 text-cyan-400 shadow-cyan-500/40 ring-4 ring-cyan-500/20",
    ratingAr: "تصنيف جيد جداً مع وفر مائي ملحوظ ✨",
    ratingEn: "Very Good with Substantial Water Savings ✨"
  },
  tierB: {
    grade: "B",
    gradeColor: "border-amber-400 bg-amber-950/80 text-amber-400 shadow-amber-500/40 ring-4 ring-amber-500/20",
    ratingAr: "أداء متوسط - يحتاج لإدخال بقوليات إضافية ⚠️",
    ratingEn: "Moderate - Needs Additional Legumes ⚠️"
  },
  tierC: {
    grade: "C",
    gradeColor: "border-amber-600 bg-amber-950/80 text-amber-500 shadow-amber-600/40 ring-4 ring-amber-600/20",
    ratingAr: "أداء مقبول ولكن توفير المياه محدود ⚠️",
    ratingEn: "Acceptable but Limited Water Savings ⚠️"
  },
  tierF: {
    grade: "F",
    gradeColor: "border-red-500 bg-red-950/80 text-red-400 shadow-red-500/40 ring-4 ring-red-500/20",
    ratingAr: "خطر زراعة أحادية مجهدة للتربة والمياه ❌",
    ratingEn: "Hazardous Monoculture Depleting Resources ❌"
  }
};

export const decisionChecklistLabels = {
  nasaVerifiedPassedAr: "اعتماد بيانات أقمار NASA (LST/SMAP)",
  nasaVerifiedPassedEn: "Applied NASA Space Data (LST/SMAP)",
  nasaVerifiedFailedAr: "عدم التوافق مع إجهاد ناسا الحراري",
  nasaVerifiedFailedEn: "Incompatible with NASA Thermal Stress",

  nitrogenPassedAr: "دورة زراعية متوازنة نيتروجينياً",
  nitrogenPassedEn: "Balanced N-Fixing Rotation",
  nitrogenFailedAr: "استنزاف نيتروجين التربة دون تعويض",
  nitrogenFailedEn: "Soil Nitrogen Depletion Unbalanced",

  waterSavedPassedAr: "توفير قياسي في مياه الري",
  waterSavedPassedEn: "Proven Water Conservation",
  waterSavedFailedAr: "استهلاك مائي مفرط يهدد الآبار",
  waterSavedFailedEn: "Excessive Water Consumption",

  droughtShieldPassedAr: "حماية طويلة المدى ضد الجفاف",
  droughtShieldPassedEn: "Long-term Drought Shield",
  droughtShieldFailedAr: "حساسية عالية لموجات الجفاف",
  droughtShieldFailedEn: "High Vulnerability to Drought Waves"
};

export const decisionSeasonHeaders = [
  {
    seasonIndex: 0,
    titleAr: "الموسم 1 (الشتوي)",
    titleEn: "Season 1 (Winter / Primary)",
    tagAr: "الشتوي الرئيسي",
    tagEn: "Primary Winter"
  },
  {
    seasonIndex: 1,
    titleAr: "الموسم 2 (الصيفي / البقولي)",
    titleEn: "Season 2 (Summer / Legume)",
    tagAr: "الصيفي / البقوليات",
    tagEn: "Summer / Legumes"
  },
  {
    seasonIndex: 2,
    titleAr: "الموسم 3 (التعاقبي / كسر الآفات)",
    titleEn: "Season 3 (Cover / Pest Break)",
    tagAr: "التعاقبي / كسر الآفات",
    tagEn: "Cover / Pest Break"
  }
];

export const decisionScreenLabels = {
  resetTooltipAr: "إعادة ضبط الاختيارات",
  resetTooltipEn: "Reset Sequence",
  builderTitleAr: "جرّب واصنع تسلسل دورتك الزراعية (3 مواسم)",
  builderTitleEn: "Design Your Multi-Season Crop Sequence (3 Seasons)",
  builderSubtitleAr: "انقر على المحاصيل لتجربة توافقها مع رصد الأقمار واكتشاف أفضل توليفة",
  builderSubtitleEn: "Click crops to test space data compatibility and discover the optimal sequence",
  performanceIndexAr: "مؤشر أداء دورتك:",
  performanceIndexEn: "Rotation Performance Score:",
  soilTypeLabelAr: "نوع التربة:",
  soilTypeLabelEn: "Soil Type:",
  organicMatterLabelAr: "المادة العضوية:",
  organicMatterLabelEn: "Organic Matter:",
  spaceTelemetryAr: "رصد فضائي:",
  spaceTelemetryEn: "Space Telemetry:",
  nitrogenBadgeAr: "🌿 النيتروجين:",
  nitrogenBadgeEn: "🌿 Nitrogen:",
  droughtBadgeAr: "☀️ تحمل الجفاف:",
  droughtBadgeEn: "☀️ Drought Tolerance:",
  waterUsageBadgeAr: "💧 استهلاك المياه:",
  waterUsageBadgeEn: "💧 Water Usage:",
  toleranceAr: "تحمل",
  toleranceEn: "Tolerance"
};
