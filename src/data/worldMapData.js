/**
 * World Map Continents, Controls, and Telemetry Reference Data
 */

export const continentLabels = [
  { textAr: 'أمريكا الشمالية', textEn: 'North America', lon: -105, lat: 56, size: 10.5, key: 'northAmerica' },
  { textAr: 'أمريكا الجنوبية', textEn: 'South America', lon: -66, lat: -25, size: 10.5, key: 'southAmerica' },
  { textAr: 'أوروبا', textEn: 'Europe', lon: 18, lat: 56, size: 10.5, key: 'europe' },
  { textAr: 'أفريقيا', textEn: 'Africa', lon: 16, lat: -8, size: 11.5, key: 'africa' },
  { textAr: 'آسيا', textEn: 'Asia', lon: 88, lat: 54, size: 13.5, key: 'asia' },
  { textAr: 'أستراليا', textEn: 'Australia', lon: 134, lat: -36, size: 10.5, key: 'oceania' }
];

export const mapControlsData = {
  recenterTooltipAr: "تركيز الخريطة على المهمة المحددة",
  recenterTooltipEn: "Recenter Map on Selected Mission",
  recenterBtnAr: "تركيز الخريطة",
  recenterBtnEn: "RECENTER MAP",
  prevMissionTooltipAr: "المهمة السابقة",
  prevMissionTooltipEn: "Previous Mission",
  nextMissionTooltipAr: "المهمة التالية",
  nextMissionTooltipEn: "Next Mission",
  missionNumberPrefixAr: "مهمة #",
  missionNumberPrefixEn: "Mission #",
  previousPerformanceCompareAr: "مقارنة بالأداء السابق",
  previousPerformanceCompareEn: "Compared to Previous Baseline",
  switchLangTooltip: "تبديل اللغة / Switch Language",
  langLabelAr: "عربي",
  langLabelEn: "English"
};

export const briefingRolesData = {
  nasaScienceTeamAr: "فريق علماء ناسا",
  nasaScienceTeamEn: "NASA Science Team",
  agriCoopAr: "الجمعية الزراعية",
  agriCoopEn: "Agricultural Coop",
  nasaDialogFallbackAr: "تؤكد مؤشرات الاستشعار الفضائي أهمية الاعتماد على محاصيل مقاومة للإجهاد الحراري والمائي.",
  nasaDialogFallbackEn: "Satellite observations underscore adopting heat-tolerant and water-efficient crops.",
  agriCoopDialogFallbackAr: "نحتاج لموازنة احتياجات السوق مع استهلاك المياه للحفاظ على استقرار الدخل الزراعي.",
  agriCoopDialogFallbackEn: "We must balance market demand with water savings to preserve farm income stability.",
  farmerDefaultNameAr: "المزارع",
  farmerDefaultNameEn: "Local Farmer",
  farmerRolePrefixAr: "مزارع محلي • ",
  farmerRolePrefixEn: "Local Farmer • ",
  farmerDefaultDialogueAr: "محاصيلنا تعاني من الإجهاد المائي الشديد بسبب تغير المناخ، ونحتاج لحلول عاجلة.",
  farmerDefaultDialogueEn: "Our crops are suffering from severe climate water stress, and we urgently need solutions.",
  farmerQuestionFallbackAr: "ما هو المحصول الأنسب الذي يحمي أرضنا من التدهور ويحقق عائداً مستداماً لعائلتي؟",
  farmerQuestionFallbackEn: "Which crop choice will best shield our land and secure a reliable yield for my family?",
  nasaDefaultNameAr: "سارة",
  nasaDefaultNameEn: "Sarah",
  nasaDefaultRoleAr: "مديرة عمليات رصد الأرض • NASA",
  nasaDefaultRoleEn: "Lead Earth Observation Scientist • NASA",
  nasaSolutionDialogueAr: "لدينا حلول زراعية مدعومة ببيانات الأقمار الصناعية. دعنا ننتقل فوراً إلى لوحة القرار لاختيار التوليفة الزراعية المثلى!",
  nasaSolutionDialogueEn: "We have space-calibrated options ready. Let's step into the Decision Matrix now to select the optimal crop rotation!",
  nasaTelemetryDialogueAr: (temp, soil) => `بيانات مستشعرات NASA الفضائية تؤكد وجود شذوذ حراري ${temp} وتراجعاً ملحوظاً في رطوبة التربة بنسبة ${soil}.`,
  nasaTelemetryDialogueEn: (temp, soil) => `NASA satellite observations confirm a ${temp} thermal anomaly and a ${soil} decline in soil moisture.`
};

export const briefingDialogueUiData = {
  missionPrefixAr: "مهمة #",
  missionPrefixEn: "Mission #",
  diagnosisTitlePrefixAr: "تشخيص الأزمة الزراعية: ",
  diagnosisTitlePrefixEn: "Crisis Diagnosis: ",
  resetTooltipAr: "إعادة المحادثة",
  resetTooltipEn: "Restart Dialogue",
  revealAllTooltipAr: "عرض كل الرسائل",
  revealAllTooltipEn: "Show All Messages",
  skipBtnAr: "تخطي",
  skipBtnEn: "Skip",
  fieldChallengeTagAr: "التحدي الميداني:",
  fieldChallengeTagEn: "Challenge:",
  speakingAr: "يتحدث...",
  speakingEn: "Speaking...",
  speakingFemaleAr: "تتحدث...",
  speakingFemaleEn: "Speaking...",
  receivingCommsAr: "جاري استقبال الإرسال الفضائي...",
  receivingCommsEn: "Receiving comms...",
  completeBtnAr: "إكمال ⚡",
  completeBtnEn: "Complete ⚡",
  nextBtnAr: "التالي 💬",
  nextBtnEn: "Next 💬",
  doneBtnAr: "اكتملت ✔️",
  doneBtnEn: "Done ✔️",
  proceedToDecisionBtnAr: "الانتقال إلى اتخاذ القرار 🌾",
  proceedToDecisionBtnEn: "Proceed to Decision 🌾",
  farmerRoleAr: "مزارع محلي",
  farmerRoleEn: "Local Farmer",
  nasaRoleAr: "مديرة رصد الأرض",
  nasaRoleEn: "Earth Science Lead"
};
