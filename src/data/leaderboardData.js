/**
 * Global Leaderboard and Top Players Data
 * Ready for database / API connection
 */

export const leaderboardHeader = {
  badge: "NASA Space Apps 2026 Rankings",
  subAr: "ترتيب الفرق والمزارعين بناءً على كفاءة الدورات الزراعية وترشيد المياه",
  subEn: "Global leaderboard tracking crop rotation efficiency, water conservation, and soil resilience",
  footerNoteAr: "يتم تحديث الترتيب دورياً مع كل محاكاة زراعية مكتملة",
  footerNoteEn: "Leaderboard updates automatically upon completing each rotation simulation",
  closeBtnAr: "إغلاق",
  closeBtnEn: "Close"
};

export const leaderboardGlobalStats = [
  {
    id: 'water',
    titleAr: 'إجمالي المياه الموفرة عالمياً',
    titleEn: 'Global Water Conserved',
    value: '178,200 m³',
    borderColor: 'border-sky-500/30',
    textColor: 'text-sky-400'
  },
  {
    id: 'nitrogen',
    titleAr: 'النيتروجين الطبيعي المستعاد',
    titleEn: 'Bio-Nitrogen Replenished',
    value: '+130 kg/ha N',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400'
  },
  {
    id: 'missions',
    titleAr: 'الدورات الزراعية المكتملة',
    titleEn: 'Completed Rotations',
    value: '24 مهمة',
    valueEn: '24 Missions',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400'
  }
];

export const leaderboardLabels = {
  waterSavedAr: "الوفر المائي:",
  waterSavedEn: "Water Saved:",
  soilRestoredAr: "صحة التربة:",
  soilRestoredEn: "Soil Health:",
  totalScoreAr: "مجموع النقاط",
  totalScoreEn: "Total Score"
};

export const topPlayers = [
  {
    rank: 1,
    teamAr: 'فريق Space Hunters (فريقك)',
    teamEn: 'Team Space Hunters (You)',
    score: 1280,
    grade: 'A+',
    countryFlag: '🇪🇬',
    waterSaved: '42,000 m³',
    soilRestored: '+35% N',
    isUser: true,
    badgeAr: 'بطل التكيف المناخي 🌟',
    badgeEn: 'Climate Champion 🌟'
  },
  {
    rank: 2,
    teamAr: 'فريق Agro-Satellites',
    teamEn: 'Team Agro-Satellites',
    score: 1195,
    grade: 'A',
    countryFlag: '🇧🇷',
    waterSaved: '38,500 m³',
    soilRestored: '+28% N',
    isUser: false,
    badgeAr: 'حارس الأمازون 🌿',
    badgeEn: 'Amazon Shield 🌿'
  },
  {
    rank: 3,
    teamAr: 'فريق Punjab Resilient Fields',
    teamEn: 'Team Punjab Resilient',
    score: 1140,
    grade: 'A',
    countryFlag: '🇮🇳',
    waterSaved: '36,200 m³',
    soilRestored: '+25% N',
    isUser: false,
    badgeAr: 'قاهر الحرارة 💧',
    badgeEn: 'Heat Master 💧'
  },
  {
    rank: 4,
    teamAr: 'فريق Ogallala Guardians',
    teamEn: 'Team Ogallala Guardians',
    score: 1080,
    grade: 'B+',
    countryFlag: '🇺🇸',
    waterSaved: '32,100 m³',
    soilRestored: '+22% N',
    isUser: false,
    badgeAr: 'درع المياه الجوفية',
    badgeEn: 'Aquifer Shield'
  },
  {
    rank: 5,
    teamAr: 'فريق Outback Soil Regenerators',
    teamEn: 'Team Outback Regenerators',
    score: 1020,
    grade: 'B+',
    countryFlag: '🇦🇺',
    waterSaved: '29,400 m³',
    soilRestored: '+20% N',
    isUser: false,
    badgeAr: 'معالج الملوحة',
    badgeEn: 'Salinity Healer'
  }
];
