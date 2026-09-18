'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Layers, BarChart2, TrendingUp, 
  Satellite, BookOpen, Award
} from 'lucide-react';

export const RESULTS_NAV_TABS = [
  { id: 'overview', key: 'tabOverview', icon: Layers, number: 1 },
  { id: 'results', key: 'tabResults', icon: BarChart2, number: 2 },
  { id: 'impact', key: 'tabImpact', icon: TrendingUp, number: 3 },
  { id: 'nasa', key: 'tabNasaData', icon: Satellite, number: 4 },
  { id: 'lessons', key: 'tabLessons', icon: BookOpen, number: 5 },
  { id: 'evaluation', key: 'tabEvaluation', icon: Award, number: 6 },
];

export default function ResultsSidebar({ mission, activeSideTab, setActiveSideTab }) {
  const { t, lang } = useLanguage();

  return (
    <>
      {/* Mobile Horizontal Page Switcher (Visible on < lg screens) */}
      <div className="lg:hidden flex flex-col gap-1.5 shrink-0">
        <div className="p-1 bg-[#061633]/95 border border-cyan-500/30 rounded-xl flex items-center gap-1 overflow-x-auto no-scrollbar shadow-lg">
          {RESULTS_NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSideTab === tab.id;
            const label = t[tab.key] || tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveSideTab(tab.id)}
                className={`flex-1 min-w-[72px] sm:min-w-[90px] flex flex-col items-center justify-center gap-1 py-1.5 px-1.5 text-[10px] sm:text-xs font-black transition-all rounded-lg cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/30 border border-cyan-300/40 scale-[1.02]'
                    : 'text-slate-300 hover:text-white bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8.5px] font-bold ${isActive ? 'bg-white text-blue-900' : 'bg-slate-700 text-slate-300'}`}>
                    {tab.number}
                  </span>
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                </div>
                <span className="truncate w-full text-center leading-tight">{label}</span>
              </button>
            );
          })}
        </div>
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
              <span className="text-xs text-cyan-300 font-bold">{t.resultsReportTag}</span>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="space-y-1.5">
            {RESULTS_NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSideTab === tab.id;
              const label = t[tab.key] || tab.id;

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
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${isActive ? 'bg-white text-blue-900' : 'bg-slate-700 text-slate-300'}`}>
                    {tab.number}
                  </span>
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
