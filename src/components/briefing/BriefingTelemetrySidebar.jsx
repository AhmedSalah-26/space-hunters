'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Satellite, Thermometer, Droplets, 
  Sprout, Sun, ExternalLink 
} from 'lucide-react';

export default function BriefingTelemetrySidebar({ mission }) {
  const { t } = useLanguage();

  return (
    <div
      className="lg:col-span-3 p-3.5 bg-[#061633]/96 border border-cyan-400/40 shadow-2xl backdrop-blur-md flex flex-col gap-3 min-h-0 overflow-y-auto custom-scrollbar rounded-xl"
      style={{
        clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)',
      }}
    >
      <div className="space-y-2.5">
        <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2 pb-1.5 border-b border-cyan-500/20">
          <Satellite className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>{t.nasaCurrentData}</span>
        </h3>

        {/* Telemetry Metric Cards */}
        <div className="space-y-2">
          {/* Temperature */}
          <div className="p-2.5 bg-[#081730] border border-red-500/40 rounded-lg flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 rounded-md">
                <Thermometer className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-white font-bold leading-tight">{t.tempAnomaly}</p>
                <p className="text-xs text-red-300 font-semibold truncate">
                  {mission.telemetry?.historicalNoteAr || t.aboveHistorical}
                </p>
              </div>
            </div>
            <span className="text-base sm:text-lg font-black text-red-400 font-mono">
              {mission.telemetry?.tempAnomaly}
            </span>
          </div>

          {/* Rainfall */}
          <div className="p-2.5 bg-[#081730] border border-sky-500/40 rounded-lg flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0 rounded-md">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-white font-bold leading-tight">{t.rainfallTrend}</p>
                <p className="text-xs text-sky-300 font-semibold truncate">
                  {mission.telemetry?.rainNoteAr || t.belowAverage}
                </p>
              </div>
            </div>
            <span className="text-base sm:text-lg font-black text-sky-400 font-mono">
              {mission.telemetry?.rainfallTrend}
            </span>
          </div>

          {/* Soil Moisture */}
          <div className="p-2.5 bg-[#081730] border border-emerald-500/40 rounded-lg flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 rounded-md">
                <Sprout className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-white font-bold leading-tight">{t.soilMoisture}</p>
                <p className="text-xs text-emerald-300 font-semibold truncate">
                  {mission.telemetry?.soilNoteAr || t.significantDrop}
                </p>
              </div>
            </div>
            <span className="text-base sm:text-lg font-black text-emerald-400 font-mono">
              {mission.telemetry?.soilMoisture}
            </span>
          </div>

          {/* NDVI Index */}
          <div className="p-2.5 bg-[#081730] border border-cyan-500/40 rounded-lg flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0 rounded-md">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-white font-bold leading-tight">{t.ndviIndex}</p>
                <p className="text-xs text-cyan-300 font-semibold truncate">
                  {mission.telemetry?.ndviNoteAr || t.declinePlantHealth}
                </p>
              </div>
            </div>
            <span className="text-base sm:text-lg font-black text-cyan-400 font-mono">
              {mission.telemetry?.ndvi}
            </span>
          </div>
        </div>
      </div>

      {/* NASA Satellite Visualizer Card */}
      <div className="p-2.5 bg-[#081730] border border-cyan-500/35 text-center rounded-xl shrink-0 mt-auto">
        <div className="w-full h-24 sm:h-28 relative overflow-hidden border border-white/10 mb-2 rounded-lg shadow-inner">
          <img 
            src={mission.satelliteImage || mission.heroImage} 
            alt="NASA Satellite View" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-blue-500/10" />
          <span className="absolute bottom-1 right-1 text-[10px] font-mono text-cyan-300 bg-black/85 px-1.5 py-0.5 rounded border border-white/15">
            Landsat-9 / SMAP
          </span>
        </div>

        <p className="text-xs sm:text-sm font-black text-white leading-tight mb-0.5">{t.satellitePhoto}</p>
        <p className="text-xs text-slate-400 mb-2">{t.satelliteDate}</p>

        <button
          className="w-full py-2 px-3 bg-blue-600/30 hover:bg-blue-600/50 border border-cyan-400/40 text-xs sm:text-sm font-black text-cyan-300 flex items-center justify-center gap-1.5 transition-all rounded-lg cursor-pointer hover:text-white"
        >
          <ExternalLink className="w-4 h-4" />
          <span>{t.viewDetailedData}</span>
        </button>
      </div>
    </div>
  );
}
