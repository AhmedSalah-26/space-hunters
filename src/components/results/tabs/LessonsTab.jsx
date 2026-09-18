'use client';

import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { BookOpen } from 'lucide-react';
import { agriculturalLessonsHeader, agriculturalLessons } from '../../../data/lessonsData';

export default function LessonsTab() {
  const { lang } = useLanguage();

  return (
    <div className="flex flex-col gap-2.5">
      <div className="p-2.5 bg-[#061633] border border-cyan-400/40 rounded-xl">
        <h3 className="text-xs sm:text-sm font-black text-cyan-300 flex items-center gap-1.5 mb-1">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>{lang === 'ar' ? agriculturalLessonsHeader.titleAr : agriculturalLessonsHeader.titleEn}</span>
        </h3>
        <p className="text-xs text-slate-300">
          {lang === 'ar' ? agriculturalLessonsHeader.subAr : agriculturalLessonsHeader.subEn}
        </p>
      </div>

      <div className="space-y-2 text-xs">
        {agriculturalLessons.map((lesson) => (
          <div key={lesson.id} className="p-2.5 bg-[#081730] border border-cyan-500/35 rounded-xl flex items-start gap-2.5">
            <span className="text-base shrink-0">{lesson.emoji}</span>
            <div>
              <strong className="text-cyan-300 font-bold block text-xs sm:text-sm mb-0.5">
                {lang === 'ar' ? lesson.titleAr : lesson.titleEn}
              </strong>
              <p className="text-slate-200 text-[11px] leading-relaxed">
                {lang === 'ar' ? lesson.descAr : lesson.descEn}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
