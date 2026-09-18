'use client';

import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { TrendingUp } from 'lucide-react';
import { 
  impactHeader, 
  financialGains, 
  environmentalGains, 
  sustainabilityProjection 
} from '../../../data/impactData';

export default function ImpactTab({ mission }) {
  const { lang } = useLanguage();

  return (
    <div className="flex flex-col gap-2.5">
      <div className="p-2.5 bg-[#061633] border border-cyan-400/40 rounded-xl">
        <h3 className="text-xs sm:text-sm font-black text-cyan-300 flex items-center gap-1.5 mb-1">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'ar' ? impactHeader.titleAr : impactHeader.titleEn}</span>
        </h3>
        <p className="text-xs text-slate-300">
          {lang === 'ar' 
            ? `${impactHeader.subAr} (${mission.countryAr})` 
            : `${impactHeader.subEn} (${mission.countryEn})`}
        </p>
      </div>

      {/* Financial & Environmental Return Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div className="p-3 bg-[#081730] border border-emerald-500/40 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-300 pb-1 border-b border-white/10">
            <span className="flex items-center gap-1.5">
              <span>💰</span>
              <span>{lang === 'ar' ? financialGains.titleAr : financialGains.titleEn}</span>
            </span>
            <span className="font-mono text-emerald-400">
              {lang === 'ar' ? financialGains.badgeAr : financialGains.badgeEn}
            </span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-200">
            {financialGains.items.map((item, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">
                  {lang === 'ar' ? item.labelAr : item.labelEn}
                </span>
                <strong className="text-emerald-400">{item.value}</strong>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3 bg-[#081730] border border-cyan-500/40 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-cyan-300 pb-1 border-b border-white/10">
            <span className="flex items-center gap-1.5">
              <span>🌍</span>
              <span>{lang === 'ar' ? environmentalGains.titleAr : environmentalGains.titleEn}</span>
            </span>
            <span className="font-mono text-cyan-400">{environmentalGains.badge}</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-200">
            {environmentalGains.items.map((item, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">
                  {lang === 'ar' ? item.labelAr : item.labelEn}
                </span>
                <strong className="text-cyan-400">{item.value}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 5-Year Sustainability Projection Card */}
      <div className="p-3 bg-[#040e21] border border-amber-500/30 rounded-xl space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-amber-300">
          <span>📊 {lang === 'ar' ? sustainabilityProjection.titleAr : sustainabilityProjection.titleEn}</span>
          <span className="font-mono text-amber-400">{sustainabilityProjection.badge}</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 via-emerald-400 to-cyan-400 h-full" 
            style={{ width: sustainabilityProjection.progress }}
          />
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          {lang === 'ar' ? sustainabilityProjection.descAr : sustainabilityProjection.descEn}
        </p>
      </div>
    </div>
  );
}
