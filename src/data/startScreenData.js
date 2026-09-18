/**
 * Start Screen (Landing / Hero Page) Data Layer
 * Completely separated for database / CMS configuration
 */

export const startScreenData = {
  badgeAr: "NASA SPACE APPS CHALLENGE 2026",
  badgeEn: "NASA SPACE APPS CHALLENGE 2026",
  editionBadgeAr: "الإصدار الميداني الفضائي 2.0",
  editionBadgeEn: "Space-Calibrated Field Edition 2.0",
  
  titlePrefix: "FIELD",
  titleSuffix: "SHIFT",
  taglineAr: "تصميم الدورات الزراعية الذكية ببيانات أقمار NASA الفضائية",
  taglineEn: "Adaptive Crop Rotation Engine Powered by NASA Earth Telemetry",

  descAr: "انضم إلى فريق Space Hunters في مهمة عالمية لمساعدة المزارعين على التكيف مع التغير المناخي، ترشيد مياه الري، واستعادة خصوبة التربة بالاعتماد على رصد الأقمار الصناعية (SMAP, Landsat, ECOSTRESS).",
  descEn: "Join Team Space Hunters on a global mission to help farmers adapt to climate stress, conserve water, and restore soil fertility using NASA Earth observations.",

  buttons: {
    startGame: {
      id: "start",
      labelAr: "ابدأ اللعب",
      labelEn: "Start Game",
      subAr: "استكشف خريطة الأزمات العالمية والمهام",
      subEn: "Explore Global Crisis Map & Field Missions",
      icon: "Rocket",
      glowColor: "cyan"
    },
    cropBank: {
      id: "agriBank",
      labelAr: "بنك المحاصيل والتربة",
      labelEn: "Agri-Bank Vault",
      subAr: "مستودع المحاصيل وخصائص التربة ومستشعرات NASA",
      subEn: "Crops Database, Soil Profiles & Satellite Specs",
      icon: "Sprout",
      glowColor: "emerald"
    },
    sequenceBuilder: {
      id: "builder",
      labelAr: "صانع تسلسل الدورات",
      labelEn: "Rotation Sequence Builder",
      subAr: "صمم واختبر دورتك الزراعية لـ 3 مواسم فوراً",
      subEn: "Simulate & Build 3-Season Rotations Instantly",
      icon: "RotateCcw",
      glowColor: "purple"
    }
  },

  stats: [
    {
      id: "missions",
      value: "5",
      labelAr: "مهام عالمية حقيقية",
      labelEn: "Global Field Missions"
    },
    {
      id: "satellites",
      value: "4",
      labelAr: "أقمار ومستشعرات NASA",
      labelEn: "NASA Space Sensors"
    },
    {
      id: "accuracy",
      value: "99.4%",
      labelAr: "دقة المعايرة الفضائية",
      labelEn: "Calibrated Accuracy"
    }
  ],

  guideBtnAr: "دليل اللعبة والتعليمات",
  guideBtnEn: "Game Guide & Manual",
  leaderboardBtnAr: "لوحة المتصدرين",
  leaderboardBtnEn: "Leaderboard",
  teamSignature: "NASA Space Apps 2026 • Space Hunters"
};
