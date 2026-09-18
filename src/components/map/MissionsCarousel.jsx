'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Target, ChevronRight, ChevronLeft } from 'lucide-react';
import { mapControlsData } from '../../data/worldMapData';

export default function MissionsCarousel({
  missions,
  selectedMission,
  setSelectedMission,
  onPrevMission,
  onNextMission,
  className = '',
  isMobile = false,
}) {
  const { t, lang } = useLanguage();

  const containerClasses = className || "absolute bottom-3 left-[245px] right-[375px] z-20 hidden lg:block pointer-events-auto";

  return (
    <div className={containerClasses}>
      <div
        className="p-3 sm:p-3.5 bg-[#051329]/96 border border-cyan-400/50 backdrop-blur-xl shadow-2xl rounded-2xl"
        style={{
          clipPath: 'polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)',
        }}
      >
        {/* Carousel Header */}
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shadow-sm">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <h3 className="text-xs sm:text-sm font-black text-white tracking-wide">{t.suggestedMissions}</h3>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400">
            <button
              onClick={onPrevMission}
              title={lang === 'ar' ? mapControlsData.prevMissionTooltipAr : mapControlsData.prevMissionTooltipEn}
              className="w-6 h-6 sm:w-7 sm:h-7 bg-[#0a1e3f] hover:bg-[#153f7e] border border-cyan-400/50 rounded-md flex items-center justify-center text-cyan-300 hover:text-white transition-all active:scale-90 shadow-sm cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={onNextMission}
              title={lang === 'ar' ? mapControlsData.nextMissionTooltipAr : mapControlsData.nextMissionTooltipEn}
              className="w-6 h-6 sm:w-7 sm:h-7 bg-[#0a1e3f] hover:bg-[#153f7e] border border-cyan-400/50 rounded-md flex items-center justify-center text-cyan-300 hover:text-white transition-all active:scale-90 shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Mission Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
          {missions.map(m => {
            const isSel = selectedMission.id === m.id;
            const countryCode = m.id === 'egypt' ? 'EG' : m.id === 'brazil' ? 'BR' : m.id === 'india' ? 'IN' : m.id === 'usa' ? 'US' : 'AU';
            return (
              <div
                key={m.id}
                onClick={() => setSelectedMission(m)}
                className={`p-2.5 cursor-pointer transition-all duration-200 border relative group ${
                  isSel
                    ? 'bg-gradient-to-b from-[#13407e]/90 via-[#0a2752]/95 to-[#04142d] border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.45)] scale-[1.03] ring-1 ring-cyan-300/60 z-10'
                    : 'bg-[#071730]/90 hover:bg-[#0c244c] border-cyan-500/25 hover:border-cyan-400/60 hover:scale-[1.015]'
                }`}
                style={{
                  clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)',
                }}
              >
                {/* Image Thumbnail */}
                <div
                  className="w-full h-20 overflow-hidden relative border border-white/10 shadow-inner"
                  style={{
                    clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)',
                  }}
                >
                  <img
                    src={m.heroImage}
                    alt={m.countryEn}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                  
                  {/* Flag & Country Code Badge */}
                  <div className="absolute bottom-1 right-1 flex items-center gap-1 bg-black/75 backdrop-blur-sm border border-white/20 px-1.5 py-0.5 rounded text-[11px] font-bold text-white shadow">
                    <span>{m.flag}</span>
                    <span className="text-[9.5px] font-mono font-bold text-cyan-300">{countryCode}</span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="mt-2 text-right">
                  <p className="text-sm font-black text-white truncate leading-tight tracking-tight">
                    {lang === 'ar' ? m.countryAr : m.countryEn}
                  </p>
                  <p className="text-xs text-cyan-300/90 truncate leading-tight mt-1 font-bold">
                    {lang === 'ar' ? m.titleAr : m.titleEn}
                  </p>
                  
                  {/* Difficulty Dots & Mission Code */}
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-cyan-500/15">
                    <span className="text-[10px] font-mono text-cyan-400/80 font-bold">#{m.code}</span>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]"></span>
                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]"></span>
                      <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
