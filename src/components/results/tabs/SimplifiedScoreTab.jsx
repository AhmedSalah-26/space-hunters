'use client';

import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Award, TrendingUp, TrendingDown, MapPin, Sparkles, Droplets, Sprout, ShieldAlert, Wheat } from 'lucide-react';

export default function SimplifiedScoreTab({ mission, dynamicResults }) {
  const { t, lang } = useLanguage();
  const res = dynamicResults;

  return (
    <div className="flex flex-col gap-3">
      
      {/* 🌟 1. HERO GRADE & RATING CARD */}
      <div className="p-4 bg-gradient-to-br from-[#071d44] via-[#051633] to-[#040e21] border border-cyan-400/40 rounded-2xl shadow-[0_0_30px_rgba(0,120,255,0.15)] flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Big Grade Badge */}
        <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 flex flex-col items-center justify-center shadow-lg shrink-0 ${res.gradeColor}`}>
          <span className="text-3xl sm:text-4xl font-black font-['Orbitron',sans-serif] leading-none">{res.grade}</span>
          <span className="text-[11px] font-bold mt-0.5 opacity-90">{res.score}/100</span>
        </div>

        {/* Evaluation Summary */}
        <div className="flex-1 text-center sm:text-start min-w-0">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="text-sm font-black text-amber-400">✨ {lang === 'ar' ? res.ratingAr : res.ratingEn}</span>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/30">
              NASA VERIFIED
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-black text-white mb-1">
            {lang === 'ar' ? mission.titleAr : mission.titleEn}
          </h2>

          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{lang === 'ar' ? mission.countryAr : mission.countryEn}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 font-mono">#{mission.code}</span>
          </div>
        </div>

        {/* Farmer Photo Preview */}
        <div className="hidden sm:flex flex-col items-center gap-1 shrink-0">
          <img 
            src={mission.farmerHappyImage} 
            alt="Farmer" 
            className="w-14 h-14 rounded-xl object-cover border-2 border-emerald-400/60 shadow-md"
          />
          <span className="text-[10px] text-emerald-300 font-bold max-w-[90px] truncate text-center">
            "{t.farmerQuoteEnd}"
          </span>
        </div>
      </div>

      {/* 🔄 2. 3-SEASON ROTATION SUMMARY STRIP */}
      <div className="p-3 bg-[#061633]/90 border border-cyan-500/30 rounded-xl shadow-md">
        <div className="text-xs font-black text-cyan-300 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span>🔄</span>
            <span>{t.sequenceExecutedTitle}</span>
          </span>
          <span className="text-emerald-400 text-[11px] font-bold">3 {t.consecutiveSeasonsTag}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-[#081f42] border border-cyan-500/30 rounded-lg">
            <span className="text-[10px] text-cyan-400 font-bold block mb-0.5">{t.season1Label}</span>
            <span className="text-xs sm:text-sm font-black text-white block truncate">
              ❄️ {lang === 'ar' ? res.c1.nameAr : res.c1.nameEn}
            </span>
          </div>

          <div className="p-2 bg-[#081f42] border border-emerald-500/40 rounded-lg">
            <span className="text-[10px] text-emerald-400 font-bold block mb-0.5">{t.season2Label}</span>
            <span className="text-xs sm:text-sm font-black text-white block truncate">
              ☀️ {lang === 'ar' ? res.c2.nameAr : res.c2.nameEn}
            </span>
          </div>

          <div className="p-2 bg-[#081f42] border border-amber-500/30 rounded-lg">
            <span className="text-[10px] text-amber-400 font-bold block mb-0.5">{t.season3Label}</span>
            <span className="text-xs sm:text-sm font-black text-white block truncate">
              🍂 {lang === 'ar' ? res.c3.nameAr : res.c3.nameEn}
            </span>
          </div>
        </div>
      </div>

      {/* 📊 3. 4 CLEAN KEY METRICS BADGES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Metric 1: Yield */}
        <div className="p-3 bg-[#081730] border border-emerald-500/40 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-base">🌾</span>
            <span className={`text-xs font-black flex items-center gap-0.5 ${res.yieldChangePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {res.yieldChangePercent >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{res.cropYieldChange}</span>
            </span>
          </div>
          <span className="text-xs font-bold text-white mb-0.5 truncate">{t.cropYieldResult}</span>
          <span className="text-[11px] text-slate-400">2.4 t/ha <span className="text-emerald-400 font-bold">({t.after})</span></span>
        </div>

        {/* Metric 2: Water Savings */}
        <div className="p-3 bg-[#081730] border border-sky-500/40 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-base">💧</span>
            <span className={`text-xs font-black flex items-center gap-0.5 ${res.waterSavedPercent >= 0 ? 'text-sky-400' : 'text-red-400'}`}>
              {res.waterSavedPercent >= 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
              <span>{res.waterSavedChange}</span>
            </span>
          </div>
          <span className="text-xs font-bold text-white mb-0.5 truncate">{t.waterConsumptionResult}</span>
          <span className="text-[11px] text-slate-400">3,900 m³ <span className="text-sky-400 font-bold">({t.after})</span></span>
        </div>

        {/* Metric 3: Soil Nitrogen */}
        <div className="p-3 bg-[#081730] border border-emerald-500/40 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-base">🌿</span>
            <span className={`text-xs font-black flex items-center gap-0.5 ${res.soilHealthChangePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {res.soilHealthChangePercent >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{res.soilHealthChange}</span>
            </span>
          </div>
          <span className="text-xs font-bold text-white mb-0.5 truncate">{t.soilHealthResult}</span>
          <span className="text-[11px] text-slate-400">78 ppm <span className="text-emerald-400 font-bold">({t.after})</span></span>
        </div>

        {/* Metric 4: Climate Drought Risk */}
        <div className="p-3 bg-[#081730] border border-red-500/40 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-base">🌡️</span>
            <span className={`text-xs font-black flex items-center gap-0.5 ${res.climateRiskChangePercent <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {res.climateRiskChangePercent <= 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
              <span>{res.climateRiskChange}</span>
            </span>
          </div>
          <span className="text-xs font-bold text-white mb-0.5 truncate">{t.climateRiskResult}</span>
          <span className="text-[11px] text-slate-400">30/100 <span className="text-emerald-400 font-bold">({t.after})</span></span>
        </div>
      </div>

    </div>
  );
}
