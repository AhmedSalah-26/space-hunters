'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Layers, BarChart2, TrendingUp, 
  Satellite, BookOpen 
} from 'lucide-react';

export const RESULTS_NAV_TABS = [
  { id: 'overview', key: 'tabOverview', icon: Layers, number: 1, labelAr: 'نظرة عامة', labelEn: 'Overview' },
  { id: 'results', key: 'tabResults', icon: BarChart2, number: 2, labelAr: 'النتائج والمؤشرات', labelEn: 'Metrics' },
  { id: 'impact', key: 'tabImpact', icon: TrendingUp, number: 3, labelAr: 'تأثير القرارات', labelEn: 'Impact' },
  { id: 'nasa', key: 'tabNasaData', icon: Satellite, number: 4, labelAr: 'بيانات ناسا', labelEn: 'NASA Data' },
  { id: 'lessons', key: 'tabLessons', icon: BookOpen, number: 5, labelAr: 'دروس مستفادة', labelEn: 'Key Lessons' },
];

export default function ResultsSidebar({ mission, activeSideTab, setActiveSideTab, isMobileOnly, isDesktopOnly }) {
  const { t, lang } = useLanguage();

  if (isMobileOnly) {
    return (
      <div className="lg:hidden p-1 bg-[#061633]/95 border border-cyan-500/30 rounded-xl grid grid-cols-5 gap-1 shrink-0 shadow-lg">
        {RESULTS_NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSideTab === tab.id;
          const label = t[tab.key] || (lang === 'ar' ? tab.labelAr : tab.labelEn);

          return (
            <button
              key={tab.id}
              onClick={() => setActiveSideTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-0.5 rounded-lg text-[9px] font-black transition-all cursor-pointer text-center truncate ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/30 border border-cyan-300/40'
                  : 'text-slate-300 hover:text-white bg-white/5 border border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate max-w-full">{label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Desktop Vertical Sidebar (inside lg:col-span-3)
  return (
    <div
      className="hidden lg:flex lg:col-span-3 p-3.5 bg-[#061633]/96 border border-cyan-400/40 shadow-2xl backdrop-blur-md flex-col gap-2.5 min-h-0 overflow-y-auto custom-scrollbar rounded-xl"
      style={{
        clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)',
      }}
    >
      <div className="space-y-2">
        {/* Country Badge */}
        <div className="flex items-center gap-2.5 mb-2 pb-2 border-b border-cyan-500/20">
          <span className="text-2xl">{mission.flag}</span>
          <div>
            <h3 className="text-sm sm:text-base font-black text-white">
              {lang === 'ar' ? mission.countryAr : mission.countryEn}
            </h3>
            <span className="text-xs text-cyan-300 font-bold">{t.resultsReportTag}</span>
          </div>
        </div>

        {/* Nav Tabs */}
        <div className="space-y-1.5">
          {RESULTS_NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSideTab === tab.id;
            const label = t[tab.key] || (lang === 'ar' ? tab.labelAr : tab.labelEn);

            return (
              <button
                key={tab.id}
                onClick={() => setActiveSideTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-black transition-all rounded-lg cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border border-cyan-400/40'
                    : 'text-slate-300 hover:text-white hover:bg-cyan-500/10'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
