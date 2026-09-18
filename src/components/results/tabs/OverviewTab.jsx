'use client';

import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Droplets, Sprout, ShieldCheck } from 'lucide-react';

export default function OverviewTab({ mission, dynamicResults }) {
  const { t, lang } = useLanguage();
  const sequenceCrops = dynamicResults;

  return (
    <div className="flex flex-col gap-2.5">
      {/* Top Celebration Banner */}
      <div
        className="p-3 border border-emerald-500/40 bg-gradient-to-r from-emerald-950/60 via-[#0a1f3d] to-[#081730] flex items-center justify-between gap-3.5 shadow-2xl relative overflow-hidden rounded-2xl shrink-0"
        style={{
          clipPath: 'polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px)',
        }}
      >
        <div className="relative z-10 flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-emerald-400 text-xl">🌱</span>
            <h2 className="text-sm sm:text-base font-black text-white">{t.congratsTitle}</h2>
          </div>

          <p className="text-xs sm:text-sm font-black text-emerald-300 mb-1">
            {t.congratsSub}: {lang === 'ar' ? sequenceCrops.sequenceNameAr : sequenceCrops.sequenceNameEn}
          </p>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed line-clamp-2">
            {t.congratsDesc}
          </p>
        </div>

        {/* Happy Farmer Portrait */}
        <div className="relative z-10 flex flex-col items-center gap-1 shrink-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 overflow-hidden shadow-xl shadow-emerald-500/30 border-2 border-emerald-400/60 rounded-xl">
            <img src={mission.farmerHappyImage} alt="Happy Farmer" className="w-full h-full object-cover" />
          </div>
          <span className="text-[10px] sm:text-xs text-emerald-300 font-bold italic text-center max-w-[120px] truncate">
            "{t.farmerQuoteEnd}"
          </span>
        </div>

        <div className="absolute right-0 top-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 3-Season Sequence Implemented Banner */}
      <div className="p-2.5 bg-[#061633] border border-cyan-400/40 rounded-xl shrink-0 shadow-md">
        <div className="flex items-center justify-between mb-1.5 text-xs sm:text-sm font-black text-cyan-300">
          <span className="flex items-center gap-1.5">
            <span>🔄</span>
            <span>{t.sequenceExecutedTitle}</span>
          </span>
          <span className="text-emerald-400 text-xs font-mono font-bold">{t.consecutiveSeasonsTag}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
          {[
            { 
              season: t.season1Label, 
              crop: sequenceCrops.c1, 
              badge: '❄️ ' + (lang === 'ar' ? sequenceCrops.c1.nameAr : sequenceCrops.c1.nameEn), 
              tag: t.seasonWinterMain 
            },
            { 
              season: t.season2Label, 
              crop: sequenceCrops.c2, 
              badge: '☀️ ' + (lang === 'ar' ? sequenceCrops.c2.nameAr : sequenceCrops.c2.nameEn), 
              tag: sequenceCrops.hasLegume ? t.seasonLegumeTag : t.seasonSummerTag 
            },
            { 
              season: t.season3Label, 
              crop: sequenceCrops.c3, 
              badge: '🍂 ' + (lang === 'ar' ? sequenceCrops.c3.nameAr : sequenceCrops.c3.nameEn), 
              tag: t.seasonPestBreakTag 
            },
          ].map((item, idx) => (
            <div key={idx} className="p-2 bg-[#081f42] border border-cyan-500/30 rounded-lg flex flex-col items-center justify-between shadow-sm">
              <span className="text-xs font-bold text-cyan-300 block">{item.season}</span>
              <span className="text-xs sm:text-sm font-black text-white my-0.5">{item.badge}</span>
              <span className="text-[11px] text-emerald-300 font-bold">{item.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Core Agronomic Pillar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="p-2.5 bg-[#081730] border border-sky-500/35 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-black text-sky-300">
            <Droplets className="w-4 h-4 text-sky-400" />
            <span>{t.pillarWaterTitle}</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {t.pillarWaterDesc}
          </p>
        </div>

        <div className="p-2.5 bg-[#081730] border border-emerald-500/35 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-black text-emerald-300">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>{t.pillarSoilTitle}</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {t.pillarSoilDesc}
          </p>
        </div>

        <div className="p-2.5 bg-[#081730] border border-amber-500/35 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{t.pillarStressTitle}</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {t.pillarStressDesc}
          </p>
        </div>
      </div>

      {/* Farmer Bottom Appreciation Quote */}
      <div className="p-2.5 bg-[#061021] border border-white/10 flex items-center gap-2.5 rounded-xl shrink-0 mt-auto">
        <div className="w-9 h-9 rounded-full bg-amber-700/80 flex items-center justify-center text-lg shrink-0">
          👳‍♂️
        </div>
        <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
          "{t.farmerAppreciation}"
        </p>
      </div>
    </div>
  );
}
