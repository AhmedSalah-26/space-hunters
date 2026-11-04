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
  teamFooter: "Team Space Hunters"
};

export const gameGuideHero = {
  titleAr: "إيه الهدف من اللعبة دي؟",
  titleEn: "What is the Goal of FIELD SHIFT?",
  descAr: "استكشف سيناريوهات تعليمية لمقارنة دورات المحاصيل. مراجع NASA POWER المناخية متاحة في التحليل البيئي؛ ولا تتنبأ الأداة بالغلة أو الوفر الزراعي.",
  descEn: "Explore learning scenarios that compare crop rotations. NASA POWER climatology is available in Environmental Analysis; the tool does not predict yield or farm savings."
};

export const gameGuideSteps = [
  {
    num: '01',
    titleAr: 'استكشاف خريطة الأزمات الزراعية',
    titleEn: 'Explore Global Crisis Map',
    icon: Globe2,
    descAr: 'اختر سيناريو دولة. مقاييس المهمات توضيحية؛ افتح التحليل البيئي لرؤية مرجع NASA POWER المناخي ومصدره.',
    descEn: 'Select a country scenario. Mission metrics are illustrative; Environmental Analysis shows the sourced NASA POWER climatology reference.'
  },
  {
    num: '02',
    titleAr: 'اعرف مشكلة المزرعة والفلاح',
    titleEn: 'Interactive Mission Briefing',
    icon: MessageSquare,
    descAr: 'اقرأ حواراً تعليمياً مكتوباً مسبقاً يعرض سيناريو زراعياً؛ الحوار ليس اتصالاً أو إرشاداً صادراً عن NASA.',
    descEn: 'Read a scripted educational scenario. The dialogue is not a NASA communication or NASA-issued advice.'
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
    descAr: 'قارن مؤشرات نسبية مبنية على صفات المحاصيل المنشورة، مع إظهار الافتراضات والبيانات غير المتاحة.',
    descEn: 'Compare relative indicators based on published crop traits, with assumptions and unavailable evidence shown.'
  }
];

export const gameGuideTips = {
  titleAr: "نصائح لاستخدام أدوات دعم القرار:",
  titleEn: "Decision-support tips:",
  items: [
    {
      textAr: "يمكن أن تسهم البقوليات في تثبيت النيتروجين؛ وتعتمد النتيجة على النوع والظروف والإدارة.",
      textEn: "Legumes can contribute to nitrogen fixation; outcomes depend on species, conditions, and management."
    },
    {
      textAr: "قارن احتياجات المياه الإرشادية وتحمل الجفاف بين المحاصيل، ولا تعتبرها وفراً مضموناً للري.",
      textEn: "Compare indicative crop water needs and drought tolerance; they do not guarantee irrigation savings."
    },
    {
      textAr: "جرّب أداة المحاكي وشوف أرضك هتتصرف إزاي لو الجو حرّر أو المطر قل.",
      textEn: "Experiment with climate simulation scenarios to stress-test your rotation under extreme heatwaves."
    }
  ]
};
