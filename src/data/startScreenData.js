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
  taglineAr: "ازرع صح ووفّر ميتك وفلوسك ببيانات أقمار ناسا الفضائية",
  taglineEn: "Agricultural Adaptation & Crop Rotation System Powered by NASA Earth Data",

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
      labelAr: "مهمات زراعية عالمية",
      labelEn: "Global Field Missions"
    },
    {
      id: "satellites",
      value: "4",
      labelAr: "أقمار رصد من ناسا",
      labelEn: "NASA Space Sensors"
    },
    {
      id: "accuracy",
      value: "99.4%",
      labelAr: "دقة بيانات ناسا",
      labelEn: "Calibrated Accuracy"
    }
  ],

  guideBtnAr: "ازاي تلعب؟",
  guideBtnEn: "Game Guide & Manual",
  teamSignature: "NASA Space Apps 2026 • Space Hunters"
};
