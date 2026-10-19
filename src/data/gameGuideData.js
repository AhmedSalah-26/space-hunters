import { Globe2, MessageSquare, RotateCcw, Award } from 'lucide-react';

/**
 * Game Guide Steps and Instructions Data
 * Schema-ready for database / CMS integration
 */

export const gameGuideHeader = {
  badge: "Field Shift 2026 Manual",
  subAr: "دليلك البسيط: إزاي تختار الدورة الزراعية الصح وتنقذ أرضك ببيانات ناسا",
  subEn: "Challenge guide and decision-making manual using NASA Earth observations",
  understandBtnAr: "فهمت، يلا نبدأ اللعب 🚀",
  understandBtnEn: "Got it, Start Game 🚀",
  teamFooter: "NASA Space Apps Challenge 2026 • Team Space Hunters"
};

export const gameGuideHero = {
  titleAr: "إيه الهدف من اللعبة دي؟",
  titleEn: "What is the Goal of FIELD SHIFT?",
  descAr: "بنساعد الفلاح يغيّر عادة تكرار نفس المحصول (قمح ورا قمح)، ويستبدلها بـ دورات زراعية ذكية لـ ٣ مواسم توفر مية الري وترد عافية الأرض والسماد الطبيعي بالاعتماد على أقمار ناسا.",
  descEn: "Help farmers adapt to climate change by shifting from monoculture to smart multi-season crop rotations that save irrigation water and restore natural soil nitrogen using NASA satellites."
};

export const gameGuideSteps = [
  {
    num: '01',
    titleAr: 'استكشاف خريطة الأزمات الزراعية',
    titleEn: 'Explore Global Crisis Map',
    icon: Globe2,
    descAr: 'اختار أي دولة من الخريطة (مصر، البرازيل، الهند، أمريكا، أستراليا) واعرف حالة الجو والمطر ورطوبة الأرض من أقمار ناسا.',
    descEn: 'Select a country mission and inspect real-time NASA telemetry (Temperature, SMAP Soil Moisture, Rainfall deficit, NDVI vegetation health).'
  },
  {
    num: '02',
    titleAr: 'اعرف مشكلة المزرعة والفلاح',
    titleEn: 'Interactive Mission Briefing',
    icon: MessageSquare,
    descAr: 'اتكلم مع الفلاح واعرف مشكلة أرضه بالظبط، وشوف نصيحة خبيرة ناسا لحل أزمة العطش وضعف التربة.',
    descEn: 'Engage with the two-way comms dialogue between the local farmer and NASA lead Sarah to diagnose field challenges.'
  },
  {
    num: '03',
    titleAr: 'تصميم الدورة الزراعية (هتزرع إيه بعد إيه؟)',
    titleEn: 'Crop Rotation Decision Engine',
    icon: RotateCcw,
    descAr: 'اختار تسلسل الزرع لـ ٣ مواسم (زي: قمح في الشتا ➔ بقوليات تغذي الأرض ➔ ذرة رفيعة توفر مية في الصيف) وجرب محاكي الجو.',
    descEn: 'Use the decision tool to select multi-season crop sequences (e.g. Winter Wheat ➔ N-Fixing Legumes ➔ Sorghum) and test climate sliders.'
  },
  {
    num: '04',
    titleAr: 'شوف النتيجة وعافية الأرض',
    titleEn: 'Results & Sustainability Evaluation',
    icon: Award,
    descAr: 'شوف النتيجة بعينك: وفّرت كام متر مية، الأرض كسبت كام سماد طبيعي، وخد تقييم A+ مع شهادة وتقرير ناسا المعتمد.',
    descEn: 'Measure cumulative water savings, soil nitrogen replenishment, and earn an A+ NASA Space Apps Challenge grade.'
  }
];

export const gameGuideTips = {
  titleAr: "نصائح تجيب بيها أعلى تقييم (A+):",
  titleEn: "Pro Tips to Achieve Maximum Grade (A+ Score):",
  items: [
    {
      textAr: "دايماً دخل محصول بقولي (زي الفول أو البرسيم) في الموسم التاني عشان يغذي الأرض بالنيتروجين ويوفر مصاريف الكيماوي.",
      textEn: "Always incorporate legumes in Season 2 to naturally fix biological nitrogen (+40 kg/ha)."
    },
    {
      textAr: "في الأراضي اللي فيها جفاف أو قلة مية، ازرع ذرة رفيعة أو شعير عشان بيتحملوا العطش ويوفروا ٤٥٪ من المية.",
      textEn: "In severe drought zones, replace water-thirsty corn with sorghum/millet to save 45% irrigation water."
    },
    {
      textAr: "جرّب أداة المحاكي وشوف أرضك هتتصرف إزاي لو الجو حرّر أو المطر قل.",
      textEn: "Experiment with climate simulation scenarios to stress-test your rotation under extreme heatwaves."
    }
  ]
};
