'use client';

import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { BarChart2, TrendingUp, TrendingDown } from 'lucide-react';
import { mapControlsData } from '../../../data/worldMapData';

export default function MetricsTab({ dynamicResults }) {
  const { t, lang } = useLanguage();

  return (
    <div className="flex flex-col gap-2.5">
      {/* 4 Key Metrics Trend Grid */}
      <div className="shrink-0 space-y-1.5">
        <h3 className="text-xs sm:text-sm font-black text-slate-200 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            <span>{t.keyResults}</span>
          </span>
          <span className="text-[11px] text-cyan-300 font-mono">
            {lang === 'ar' ? mapControlsData.previousPerformanceCompareAr : mapControlsData.previousPerformanceCompareEn}
          </span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Metric 1: Crop Yield */}
          <div className="p-2.5 bg-[#081730] border border-emerald-500/40 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-base">🌾</span>
              <span className={`text-xs sm:text-sm font-black flex items-center gap-0.5 ${dynamicResults.yieldChangePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {dynamicResults.yieldChangePercent >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{dynamicResults.cropYieldChange}</span>
              </span>
            </div>
            <p className="text-xs font-bold text-white mb-1 truncate">{t.cropYieldResult}</p>
            <div className="h-5 flex items-end justify-between gap-1 py-0.5 border-b border-white/10">
              <div className="w-1/4 bg-slate-600 h-1/2 rounded-t-sm" />
              <div className="w-1/4 bg-emerald-500/60 h-2/3 rounded-t-sm" />
              <div className="w-1/4 bg-emerald-500/80 h-4/5 rounded-t-sm" />
              <div className="w-1/4 bg-emerald-400 h-full rounded-t-sm" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
              <span>{t.before}: <strong className="text-slate-200">1.8 t/ha</strong></span>
              <span>{t.after}: <strong className="text-emerald-400">{dynamicResults.yieldChangePercent >= 0 ? '2.4 t/ha' : '1.4 t/ha'}</strong></span>
            </div>
          </div>

          {/* Metric 2: Water Consumption */}
          <div className="p-2.5 bg-[#081730] border border-sky-500/40 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-base">💧</span>
              <span className={`text-xs sm:text-sm font-black flex items-center gap-0.5 ${dynamicResults.waterSavedPercent >= 0 ? 'text-sky-400' : 'text-red-400'}`}>
                {dynamicResults.waterSavedPercent >= 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                <span>{dynamicResults.waterSavedChange}</span>
              </span>
            </div>
            <p className="text-xs font-bold text-white mb-1 truncate">{t.waterConsumptionResult}</p>
            <div className="h-5 flex items-end justify-between gap-1 py-0.5 border-b border-white/10">
              <div className="w-1/4 bg-red-400/80 h-full rounded-t-sm" />
              <div className="w-1/4 bg-amber-400/70 h-3/4 rounded-t-sm" />
              <div className="w-1/4 bg-blue-500/70 h-3/5 rounded-t-sm" />
              <div className="w-1/4 bg-blue-400 h-2/5 rounded-t-sm" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
              <span>{t.before}: <strong className="text-slate-200">5,800 m³</strong></span>
              <span>{t.after}: <strong className="text-cyan-400">{dynamicResults.waterSavedPercent >= 0 ? '3,900 m³' : '6,400 m³'}</strong></span>
            </div>
          </div>

          {/* Metric 3: Soil Health */}
          <div className="p-2.5 bg-[#081730] border border-emerald-500/40 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-base">🌿</span>
              <span className={`text-xs sm:text-sm font-black flex items-center gap-0.5 ${dynamicResults.soilHealthChangePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {dynamicResults.soilHealthChangePercent >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{dynamicResults.soilHealthChange}</span>
              </span>
            </div>
            <p className="text-xs font-bold text-white mb-1 truncate">{t.soilHealthResult}</p>
            <div className="h-5 flex items-end justify-between gap-1 py-0.5 border-b border-white/10">
              <div className="w-1/4 bg-slate-600 h-1/2 rounded-t-sm" />
              <div className="w-1/4 bg-emerald-600 h-3/5 rounded-t-sm" />
              <div className="w-1/4 bg-emerald-500 h-3/4 rounded-t-sm" />
              <div className="w-1/4 bg-emerald-400 h-full rounded-t-sm" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
              <span>{t.before}: <strong className="text-slate-200">45 ppm</strong></span>
              <span>{t.after}: <strong className="text-emerald-400">{dynamicResults.soilHealthChangePercent >= 0 ? '78 ppm' : '32 ppm'}</strong></span>
            </div>
          </div>

          {/* Metric 4: Climate Risk */}
          <div className="p-2.5 bg-[#081730] border border-red-500/40 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-base">🌡️</span>
              <span className={`text-xs sm:text-sm font-black flex items-center gap-0.5 ${dynamicResults.climateRiskChangePercent <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {dynamicResults.climateRiskChangePercent <= 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                <span>{dynamicResults.climateRiskChange}</span>
              </span>
            </div>
            <p className="text-xs font-bold text-white mb-1 truncate">{t.climateRiskResult}</p>
            <div className="h-5 flex items-end justify-between gap-1 py-0.5 border-b border-white/10">
              <div className="w-1/4 bg-red-500 h-full rounded-t-sm" />
              <div className="w-1/4 bg-red-400/80 h-3/4 rounded-t-sm" />
              <div className="w-1/4 bg-amber-400/60 h-1/2 rounded-t-sm" />
              <div className="w-1/4 bg-emerald-400 h-1/3 rounded-t-sm" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
              <span>{t.before}: <strong className="text-slate-200">65/100</strong></span>
              <span>{t.after}: <strong className={dynamicResults.climateRiskChangePercent <= 0 ? 'text-emerald-400' : 'text-red-400'}>{dynamicResults.climateRiskChangePercent <= 0 ? '30/100' : '85/100'}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Bar Chart vs Continuous Monoculture */}
      <div className="p-2.5 bg-[#081730] border border-cyan-500/30 rounded-xl shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <h4 className="text-xs sm:text-sm font-bold text-white">{t.comparisonBeforeAfter}</h4>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-slate-400">
              <div className="w-2 h-2 bg-slate-500 rounded-full" />
              <span>{t.beforeYourDecisions}</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              <span>{t.afterYourDecisions}</span>
            </span>
          </div>
        </div>

        {/* Mini Bar Comparison */}
        <div className="flex items-end justify-between h-12 pt-1 border-b border-white/10 px-3">
          <div className="flex gap-1 items-end">
            <div className="w-3.5 bg-slate-500 h-4 rounded-t-sm" />
            <div className="w-3.5 bg-emerald-400 h-9 rounded-t-sm" />
          </div>
          <div className="flex gap-1 items-end">
            <div className="w-3.5 bg-slate-500 h-10 rounded-t-sm" />
            <div className="w-3.5 bg-cyan-400 h-5 rounded-t-sm" />
          </div>
          <div className="flex gap-1 items-end">
            <div className="w-3.5 bg-slate-500 h-5 rounded-t-sm" />
            <div className="w-3.5 bg-emerald-400 h-10 rounded-t-sm" />
          </div>
          <div className="flex gap-1 items-end">
            <div className="w-3.5 bg-slate-500 h-9 rounded-t-sm" />
            <div className="w-3.5 bg-emerald-400 h-4 rounded-t-sm" />
          </div>
        </div>
      </div>

      {/* Seasonal Performance Cards */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="p-2 bg-[#040e21] border border-cyan-500/25 rounded-lg">
          <span className="text-cyan-300 font-bold block mb-0.5">{t.season1Label}: {t.seasonWinterMain}</span>
          <p className="text-slate-200 text-[11px]">{t.seasonWinterDesc}</p>
        </div>
        <div className="p-2 bg-[#040e21] border border-emerald-500/25 rounded-lg">
          <span className="text-emerald-300 font-bold block mb-0.5">{t.season2Label}: {t.seasonSummerTag}</span>
          <p className="text-slate-200 text-[11px]">{t.seasonSummerDesc}</p>
        </div>
        <div className="p-2 bg-[#040e21] border border-amber-500/25 rounded-lg">
          <span className="text-amber-300 font-bold block mb-0.5">{t.season3Label}: {t.seasonPestBreakTag}</span>
          <p className="text-slate-200 text-[11px]">{t.seasonRotationDesc}</p>
        </div>
      </div>
    </div>
  );
}
