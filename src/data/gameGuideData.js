import { Globe2, MessageSquare, RotateCcw, Award } from 'lucide-react';

/**
 * Game Guide Steps and Instructions Data
 * Schema-ready for database / CMS integration
 */

export const gameGuideHeader = {
  badge: "Field Shift 2026 Manual",
  subAr: "دليل التحدي وخطوات اتخاذ القرارات الزراعية باستخدام بيانات NASA",
  subEn: "Challenge guide and decision-making manual using NASA Earth observations",
  understandBtnAr: "فهمت، ابدأ اللعب 🚀",
  understandBtnEn: "Got it, Start Game 🚀",
  teamFooter: "NASA Space Apps Challenge 2026 • Team Space Hunters"
};

export const gameGuideHero = {
  titleAr: "ما هو الهدف من لعبة FIELD SHIFT؟",
  titleEn: "What is the Goal of FIELD SHIFT?",
  descAr: "مساعدة المزارعين على التكيف مع التغير المناخي عبر استبدال النمط الأحادي (قمح-قمح-قمح) بـ دورات زراعية ذكية متعددة المواسم (Crop Rotations) توفر مياه الري وتعيد النيتروجين الطبيعي للتربة بالاعتماد على أقمار ناسا.",
  descEn: "Help farmers adapt to climate change by shifting from monoculture to smart multi-season crop rotations that save irrigation water and restore natural soil nitrogen using NASA satellites."
};

export const gameGuideSteps = [
  {
    num: '01',
    titleAr: 'استكشاف خريطة الأزمات العالمية',
    titleEn: 'Explore Global Crisis Map',
    icon: Globe2,
    descAr: 'اختر دولة من الخريطة (مصر، البرازيل، الهند، أمريكا، أستراليا) واطلع على مؤشرات ناسا (درجات الحرارة، رطوبة التربة، تراجع الأمطار، ومؤشر الغطاء النباتي NDVI).',
    descEn: 'Select a country mission and inspect real-time NASA telemetry (Temperature, SMAP Soil Moisture, Rainfall deficit, NDVI vegetation health).'
  },
  {
    num: '02',
    titleAr: 'جلسة التوجيه والمحادثة الثنائية',
    titleEn: 'Interactive Mission Briefing',
    icon: MessageSquare,
    descAr: 'استمع لحوار المزارع المحلي مع سارة (خبيرة ناسا لعلوم الأرض) لفهم التحدي الحقيقي: نقص المياه، تآكل التربة، أو موجات الحر الشديدة.',
    descEn: 'Engage with the two-way comms dialogue between the local farmer and NASA lead Sarah to diagnose field challenges.'
  },
  {
    num: '03',
    titleAr: 'تصميم الدورة الزراعية (أزرع إيه بعد إيه؟)',
    titleEn: 'Crop Rotation Decision Engine',
    icon: RotateCcw,
    descAr: 'استخدم أداة اتخاذ القرار لاختيار استراتيجية دورة ثلاثية المواسم (مثل: قمح شتوي ➔ بقوليات لتثبيت النيتروجين ➔ ذرة/سورغم) أو جرب محاكي المناخ (ماذا لو؟).',
    descEn: 'Use the decision tool to select multi-season crop sequences (e.g. Winter Wheat ➔ N-Fixing Legumes ➔ Sorghum) and test climate sliders.'
  },
  {
    num: '04',
    titleAr: 'تقييم النتائج واستعادة خصوبة الأرض',
    titleEn: 'Results & Sustainability Evaluation',
    icon: Award,
    descAr: 'شاهد الأثر الفعلي لقراراتك: نسبة المياه الموفرة، رصيد النيتروجين العضوي المستعاد، والحصول على تقييم A+ مع تقرير NASA Space Apps المعتمد.',
    descEn: 'Measure cumulative water savings, soil nitrogen replenishment, and earn an A+ NASA Space Apps Challenge grade.'
  }
];

export const gameGuideTips = {
  titleAr: "نصائح لتحقيق الدرجة القصوى (A+ Score Tips):",
  titleEn: "Pro Tips to Achieve Maximum Grade (A+ Score):",
  items: [
    {
      textAr: "احرص دائماً على إدخال البقوليات في الموسم الثاني لتثبيت النيتروجين الطبيعي (+40 kg/ha).",
      textEn: "Always incorporate legumes in Season 2 to naturally fix biological nitrogen (+40 kg/ha)."
    },
    {
      textAr: "في المناطق المعرضة للجفاف الشديد، استبدل الذرة العادية بـ الذرة الرفيعة (سورغم) لتوفير 45% من المياه.",
      textEn: "In severe drought zones, replace water-thirsty corn with sorghum/millet to save 45% irrigation water."
    },
    {
      textAr: "جرب تحريك مؤشرات محاكي المناخ لاختبار مرونة دورة المحاصيل تحت موجات الحر الشديدة.",
      textEn: "Experiment with climate simulation scenarios to stress-test your rotation under extreme heatwaves."
    }
  ]
};
