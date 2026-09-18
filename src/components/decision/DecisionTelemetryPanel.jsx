'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { decisionScreenLabels } from '../../data/decisionFeedbackData';

export default function DecisionTelemetryPanel({ mission }) {
  const { t, lang } = useLanguage();

  return (
    <div className="lg:col-span-4 bg-[#06142e]/95 border border-cyan-500/35 shadow-2xl backdrop-blur-md flex flex-col p-3.5 rounded-2xl min-h-0 overflow-y-auto custom-scrollbar gap-2.5">
      
      {/* Country Header */}
      <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl drop-shadow">{mission.flag}</span>
          <div>
            <h3 className="text-sm sm:text-base font-black text-white">
              {lang === 'ar' ? mission.countryAr : mission.countryEn}
            </h3>
            <span className="text-xs text-cyan-300 font-bold">{t.fieldDataGuide}</span>
          </div>
        </div>
        <span className="bg-[#0b2144] border border-cyan-400/50 rounded-lg px-2.5 py-1 text-xs font-mono font-black text-cyan-300 shadow-sm">
          #{mission.code}
        </span>
      </div>

      {/* NASA Satellite Telemetry (4 Sensors) */}
      <div className="p-2.5 bg-[#040e21] rounded-xl border border-cyan-500/30 space-y-2 shrink-0 shadow-sm">
        <div className="flex items-center justify-between text-xs text-cyan-300 font-bold pb-1 border-b border-white/5">
          <span className="flex items-center gap-1.5">
            <span>🛰️</span>
            <span>{t.pillarNasa}</span>
          </span>
          <span className="text-[11px] text-slate-300 font-mono">SMAP • LST • Landsat</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-black/40 rounded-lg border border-white/5 flex items-center justify-between">
            <span className="text-slate-300 text-xs font-medium">{t.tempAnomaly}:</span>
            <span className="text-xs sm:text-sm font-black text-red-400 font-mono">{mission.telemetry?.tempAnomaly}</span>
          </div>
          <div className="p-2 bg-black/40 rounded-lg border border-white/5 flex items-center justify-between">
            <span className="text-slate-300 text-xs font-medium">{t.soilMoisture}:</span>
            <span className="text-xs sm:text-sm font-black text-sky-400 font-mono">{mission.telemetry?.soilMoisture}</span>
          </div>
          <div className="p-2 bg-black/40 rounded-lg border border-white/5 flex items-center justify-between">
            <span className="text-slate-300 text-xs font-medium">{t.rainfallTrend}:</span>
            <span className="text-xs sm:text-sm font-black text-cyan-400 font-mono">{mission.telemetry?.rainfallTrend}</span>
          </div>
          <div className="p-2 bg-black/40 rounded-lg border border-white/5 flex items-center justify-between">
            <span className="text-slate-300 text-xs font-medium">{t.ndviIndex}:</span>
            <span className="text-xs sm:text-sm font-black text-emerald-400 font-mono">{mission.telemetry?.ndvi}</span>
          </div>
        </div>
      </div>

      {/* Local Soil Truth */}
      <div className="p-2.5 bg-[#040e21] rounded-xl border border-emerald-500/30 space-y-2 shrink-0 shadow-sm">
        <div className="flex items-center justify-between text-emerald-300 font-bold text-xs pb-1 border-b border-white/5">
          <span className="flex items-center gap-1.5">
            <span>🌱</span>
            <span>{t.groundTruthTitle}</span>
          </span>
          <span className="font-mono text-[11px] text-emerald-400">{t.groundTruthTag}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-200">
          <div className="bg-black/30 p-1.5 rounded-lg border border-white/5">
            <span className="text-slate-400 block text-[11px]">
              {lang === 'ar' ? decisionScreenLabels.soilTypeLabelAr : decisionScreenLabels.soilTypeLabelEn}
            </span>
            <strong className="text-white font-bold text-xs truncate block">
              {lang === 'ar' ? mission.soilData?.textureAr : mission.soilData?.textureEn}
            </strong>
          </div>
          <div className="bg-black/30 p-1.5 rounded-lg border border-white/5">
            <span className="text-slate-400 block text-[11px]">pH:</span>
            <strong className="text-amber-300 font-black text-xs font-mono">{mission.soilData?.ph}</strong>
          </div>
          <div className="bg-black/30 p-1.5 rounded-lg border border-white/5">
            <span className="text-slate-400 block text-[11px]">
              {lang === 'ar' ? decisionScreenLabels.organicMatterLabelAr : decisionScreenLabels.organicMatterLabelEn}
            </span>
            <strong className="text-red-300 font-bold text-xs">{mission.soilData?.organicMatter}</strong>
          </div>
          <div className="bg-black/30 p-1.5 rounded-lg border border-white/5">
            <span className="text-slate-400 block text-[11px]">{t.soilNitrogen}:</span>
            <strong className="text-cyan-300 font-bold text-xs">
              {lang === 'ar' ? mission.soilData?.nitrogenLevelAr : mission.soilData?.nitrogenLevelEn}
            </strong>
          </div>
        </div>
      </div>

      {/* Farmer Priorities */}
      <div className="p-2.5 bg-[#040e21] rounded-xl border border-amber-500/30 space-y-2 shrink-0 shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold text-amber-300 pb-1 border-b border-white/5">
          <span className="flex items-center gap-1.5">
            <span>🎯</span>
            <span>{t.targetsTitle}</span>
          </span>
          <span className="text-amber-400 text-[11px] font-mono">{t.targetsTag}</span>
        </div>
        <div className="space-y-1.5 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 mb-0.5 font-bold text-[11px]">
              <span>{t.waterConsumption}</span>
              <span className="font-black text-sky-400">{mission.farmerPriorities?.waterConservation || 40}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="bg-sky-400 h-full" style={{ width: `${mission.farmerPriorities?.waterConservation || 40}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-slate-300 mb-0.5 font-bold text-[11px]">
              <span>{t.soilNitrogen}</span>
              <span className="font-black text-emerald-400">{mission.farmerPriorities?.soilHealth || 30}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full" style={{ width: `${mission.farmerPriorities?.soilHealth || 30}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-slate-300 mb-0.5 font-bold text-[11px]">
              <span>{t.productivity}</span>
              <span className="font-black text-amber-400">{mission.farmerPriorities?.yieldStability || 30}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full" style={{ width: `${mission.farmerPriorities?.yieldStability || 30}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* NASA Satellite Visualizer View */}
      <div className="relative overflow-hidden rounded-xl border border-cyan-500/40 h-28 sm:h-32 shrink-0 shadow-lg mt-auto group">
        <img
          src={mission.satelliteImage || mission.heroImage}
          alt="NASA Satellite View"
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040e21]/95 via-[#040e21]/30 to-transparent flex flex-col justify-between p-2.5 pointer-events-none">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-mono font-black text-cyan-300 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded border border-cyan-500/40 shadow">
              🛰️ Landsat-9 • SMAP
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-black/80 px-2 py-0.5 rounded border border-emerald-500/40 font-bold shadow">
              {t.spaceTelemetryLive}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-white drop-shadow">
              {lang === 'ar' 
                ? `${decisionScreenLabels.spaceTelemetryAr} ${mission.countryAr}` 
                : `${decisionScreenLabels.spaceTelemetryEn} ${mission.countryEn}`}
            </span>
            <span className="text-[10.5px] text-cyan-300 font-mono font-bold">NASA Earth Engine</span>
          </div>
        </div>
      </div>

    </div>
  );
}
