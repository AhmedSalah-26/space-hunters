'use client';

import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Satellite } from 'lucide-react';
import { nasaSensorsHeader, nasaSensorCards } from '../../../data/nasaSensorsData';

export default function NasaDataTab() {
  const { lang } = useLanguage();

  return (
    <div className="flex flex-col gap-2.5">
      <div className="p-2.5 bg-[#061633] border border-cyan-400/40 rounded-xl">
        <h3 className="text-xs sm:text-sm font-black text-cyan-300 flex items-center gap-1.5 mb-1">
          <Satellite className="w-4 h-4 text-cyan-400" />
          <span>{lang === 'ar' ? nasaSensorsHeader.titleAr : nasaSensorsHeader.titleEn}</span>
        </h3>
        <p className="text-xs text-slate-300">
          {lang === 'ar' ? nasaSensorsHeader.subAr : nasaSensorsHeader.subEn}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        {nasaSensorCards.map((sensor) => (
          <div 
            key={sensor.id} 
            className={`p-2.5 bg-[#081730] border ${sensor.borderColor} rounded-xl space-y-1`}
          >
            <div className={`flex items-center justify-between font-bold ${sensor.titleColor}`}>
              <span>{sensor.satellite}</span>
              <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${sensor.badgeBg}`}>
                {sensor.badge}
              </span>
            </div>
            <p className="text-[11px] text-slate-200">
              {lang === 'ar' ? sensor.descAr : sensor.descEn}
            </p>
          </div>
        ))}
      </div>

      {/* Accuracy Stamp */}
      <div className="p-2 bg-[#040e21] border border-cyan-500/30 rounded-xl flex items-center justify-between text-xs">
        <span className="text-slate-300">
          {lang === 'ar' ? nasaSensorsHeader.accuracyStampAr : nasaSensorsHeader.accuracyStampEn}
        </span>
        <span className="text-emerald-400 font-bold font-mono">
          {nasaSensorsHeader.accuracyScore}
        </span>
      </div>
    </div>
  );
}
