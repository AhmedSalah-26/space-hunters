'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Layers, BarChart2, TrendingUp, 
  Satellite, BookOpen 
} from 'lucide-react';

export default function ResultsSidebar({ mission, activeSideTab, setActiveSideTab }) {
  const { t, lang } = useLanguage();

  const navTabs = [
    { id: 'overview', label: t.tabOverview, icon: Layers },
    { id: 'results', label: t.tabResults, icon: BarChart2 },
    { id: 'impact', label: t.tabImpact, icon: TrendingUp },
    { id: 'nasa', label: t.tabNasaData, icon: Satellite },
    { id: 'lessons', label: t.tabLessons, icon: BookOpen },
  ];

  return (
    <>
      {/* Mobile Horizontal Tabs Switcher (Visible on < lg screens) */}
      <div className="lg:hidden p-1.5 bg-[#061633]/95 border border-cyan-500/30 rounded-xl flex items-center gap-1.5 shrink-0 overflow-x-auto no-scrollbar">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSideTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSideTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black whitespace-nowrap transition-all rounded-lg cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md border border-cyan-400/40'
                  : 'text-slate-300 hover:text-white bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
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
              <span className="text-xs text-cyan-300 font-bold">{t.resultsReportTag}</span>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="space-y-1.5">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSideTab === tab.id;
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
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
