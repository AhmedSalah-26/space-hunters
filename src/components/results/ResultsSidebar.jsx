'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Award, Satellite, BookOpen, Layers, BarChart2 } from 'lucide-react';

export const RESULTS_NAV_TABS = [
  { id: 'score', key: 'tabResultScore', icon: Award, number: 1, labelAr: '🏆 النتيجة والتقييم', labelEn: '🏆 Result & Score' },
  { id: 'nasa', key: 'tabNasaTelemetry', icon: Satellite, number: 2, labelAr: '🛰️ بيانات ناسا', labelEn: '🛰️ NASA Data' },
  { id: 'certificate', key: 'tabCertificateLessons', icon: BookOpen, number: 3, labelAr: '🎓 الشهادة والدروس', labelEn: '🎓 Certificate & Lessons' },
];

export default function ResultsSidebar({ mission, activeSideTab, setActiveSideTab }) {
  const { lang } = useLanguage();

  return (
    <>
      {/* Mobile Horizontal Page Switcher - 3 Big, Readable, Spacious Buttons */}
      <div className="lg:hidden p-1 bg-[#061633]/95 border border-cyan-500/30 rounded-xl grid grid-cols-3 gap-1.5 shrink-0 shadow-lg">
        {RESULTS_NAV_TABS.map((tab) => {
          const isActive = activeSideTab === tab.id;
          const label = lang === 'ar' ? tab.labelAr : tab.labelEn;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveSideTab(tab.id)}
              className={`py-2 px-1 rounded-lg text-xs font-black transition-all cursor-pointer text-center truncate ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/30 border border-cyan-300/40'
                  : 'text-slate-300 hover:text-white bg-white/5 border border-transparent'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Desktop Vertical Sidebar (Visible on lg:flex) */}
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
              <span className="text-xs text-cyan-300 font-bold">NASA Mission Results</span>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="space-y-1.5">
            {RESULTS_NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSideTab === tab.id;
              const label = lang === 'ar' ? tab.labelAr : tab.labelEn;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSideTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs sm:text-sm font-black transition-all rounded-lg cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border border-cyan-400/40'
                      : 'text-slate-300 hover:text-white hover:bg-cyan-500/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
