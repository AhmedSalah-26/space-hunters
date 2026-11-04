/**
 * Start Screen (Landing / Hero Page) Data Layer
 * Completely separated for database / CMS configuration
 */

export const startScreenData = {
  badgeAr: "NASA SPACE APPS CHALLENGE 2026",
  badgeEn: "NASA SPACE APPS CHALLENGE 2026",
  editionBadgeAr: "الإصدار الميداني الفضائي 2.0",
  editionBadgeEn: "Space-Calibrated Field Edition 2.0",
  
  titlePrefix: "SPACE",
  titleSuffix: "HUNTERS",
  taglineAr: "استكشف مراجع NASA POWER المناخية وقارن سيناريوهات دورات المحاصيل بشفافية",
  taglineEn: "Explore NASA POWER climate references and transparently compare crop-rotation scenarios",

  descAr: "ساعد الفلاحين يزرعوا صح، ويوفروا مية الري، ويرجعوا عافية أرضهم وتزيد غلتهم باستخدام أقمار ناسا الفضائية.",
  descEn: "Join Team Space Hunters on a global mission to help farmers adapt to climate stress, conserve water, and restore soil fertility using NASA Earth observations.",

  buttons: {
    startGame: {
      id: "start",
      labelAr: "ابدأ اللعب",
      labelEn: "Start Game",
      subAr: "مهمات وتحديات فلاحين حول العالم",
      subEn: "Explore Global Crisis Map & Field Missions",
      icon: "Rocket",
      glowColor: "cyan"
    },
    cropBank: {
      id: "agriBank",
      labelAr: "دليل المحاصيل والأرض",
      labelEn: "Agri-Bank Vault",
      subAr: "اعرف كل زرعة ومواصفاتها واحتياجاتها",
      subEn: "Crops Database, Soil Profiles & Satellite Specs",
      icon: "Sprout",
      glowColor: "emerald"
    },
    sequenceBuilder: {
      id: "builder",
      labelAr: "جرّب دورتك الزراعية",
      labelEn: "Rotation Sequence Builder",
      subAr: "احسب وفر المية والمكسب المتوقع فوراً",
      subEn: "Simulate & Build 3-Season Rotations Instantly",
      icon: "RotateCcw",
      glowColor: "purple"
    }
  },

  stats: [
    {
      id: "missions",
      value: "5",
      labelAr: "سيناريوهات تعليمية توضيحية",
      labelEn: "Illustrative learning scenarios"
    },
    {
      id: "satellites",
      value: "1",
      labelAr: "مزود بيانات مدمج: POWER المناخي",
      labelEn: "Integrated provider: POWER climatology"
    },
    {
      id: "accuracy",
      value: "—",
      labelAr: "دقة التوصيات غير مُقيّمة",
      labelEn: "Recommendation accuracy not evaluated"
    }
  ],

  guideBtnAr: "ازاي تلعب؟",
  guideBtnEn: "Game Guide & Manual",
  teamSignature: "NASA Space Apps 2026 • Space Hunters"
};
