'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Thermometer, Droplets, Sun, Sprout, 
  CloudRain, Globe2, CheckCircle2, BarChart3 
} from 'lucide-react';

export default function MapLegendSidebar() {
  const { t } = useLanguage();

  return (
    <div className="absolute top-3 left-3 z-20 w-[230px] flex flex-col justify-between max-h-[calc(100%-1.5rem)] overflow-y-auto pointer-events-auto">
      <div
        className="p-3 bg-[#061633]/92 border border-cyan-400/40 shadow-2xl backdrop-blur-md"
        style={{
          clipPath: 'polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px)',
        }}
      >
        {/* Header */}
        <div className="mb-2.5 pb-2 border-b border-cyan-500/20">
          <h2 className="text-sm font-black text-[#00b4d8] leading-tight">
            {t.exploreWorld}
          </h2>
          <p className="text-[10px] text-slate-300/80 mt-0.5 leading-snug">
            {t.exploreWorldSub}
          </p>
        </div>

        {/* Crisis Legend Items */}
        <div className="space-y-2 mb-3">
          {[
            { label: t.legendTemp, icon: Thermometer, circleBg: 'bg-[#e63946]', glow: '' },
            { label: t.legendWater, icon: Droplets, circleBg: 'bg-[#0284c7]', glow: '' },
            { label: t.legendDrought, icon: Sun, circleBg: 'bg-[#f59e0b]', glow: 'shadow-[0_0_8px_rgba(245,158,11,0.5)]' },
            { label: t.legendSoil, icon: Sprout, circleBg: 'bg-[#10b981]', glow: '' },
            { label: t.legendExtreme, icon: CloudRain, circleBg: 'bg-[#8b5cf6]', glow: '' },
          ].map(({ label, icon: Icon, circleBg, glow }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full ${circleBg} ${glow} flex items-center justify-center shrink-0 shadow-sm`}>
                <Icon className="w-3 h-3 text-white stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold text-slate-200">{label}</span>
            </div>
          ))}
        </div>

        {/* Stats Divider */}
        <div className="pt-2.5 border-t border-cyan-500/20 space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#0284c7]/20 border border-[#38bdf8]/40 flex items-center justify-center shrink-0">
              <Globe2 className="w-3.5 h-3.5 text-[#38bdf8]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#38bdf8]">{t.statAvailable}</p>
              <p className="text-xs font-black text-white leading-none">24</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#0284c7] flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#38bdf8]">{t.statCompleted}</p>
              <p className="text-xs font-black text-white leading-none">3</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#0284c7]/20 border border-[#38bdf8]/40 flex items-center justify-center shrink-0">
              <BarChart3 className="w-3.5 h-3.5 text-[#38bdf8]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#38bdf8]">{t.statScore}</p>
              <p className="text-xs font-black text-white leading-none">1,280</p>
            </div>
          </div>
        </div>
      </div>

      {/* NASA Quote Footer */}
      <div
        className="mt-2 p-2 bg-slate-950/85 border border-cyan-500/25 backdrop-blur-md space-y-0.5"
        style={{
          clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)',
        }}
      >
        <p className="text-[9.5px] text-cyan-300 font-bold leading-tight">"{t.quote1}"</p>
        <p className="text-[8.5px] text-slate-400">{t.quote2}</p>
        <div className="flex items-center gap-1 mt-1 pt-1 border-t border-white/10 text-[8px] text-slate-400 font-mono uppercase tracking-wider">
          <Globe2 className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
          <span>{t.onePlanet}</span>
        </div>
      </div>
    </div>
  );
}
