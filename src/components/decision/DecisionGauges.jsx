'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Check, AlertTriangle } from 'lucide-react';

export default function DecisionGauges({ customMetrics }) {
  const { t, lang } = useLanguage();

  return (
    <div className="p-2.5 sm:p-3 bg-[#040e21] border border-cyan-500/30 rounded-xl space-y-2 sm:space-y-2.5 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-1">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs sm:text-sm font-black text-white">{t.cumulativeResultsHeader}</span>
        </div>
        <span className="text-[10.5px] sm:text-xs text-cyan-300 font-mono font-bold truncate max-w-[200px] sm:max-w-none">
          {lang === 'ar' ? customMetrics.c1.nameAr : customMetrics.c1.nameEn} ➔ {lang === 'ar' ? customMetrics.c2.nameAr : customMetrics.c2.nameEn} ➔ {lang === 'ar' ? customMetrics.c3.nameAr : customMetrics.c3.nameEn}
        </span>
      </div>

      {/* 3 Live Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 text-xs text-center">
        <div className="p-2 bg-[#081730] rounded-xl border border-white/5 flex flex-col justify-between">
          <span className="text-slate-300 block text-[11px] sm:text-xs font-bold mb-1">{t.waterSavedGauge}</span>
          <span className="font-black text-sky-400 text-xs sm:text-sm">-{customMetrics.waterSaved}% {t.waterUnit}</span>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
            <div 
              className="bg-sky-400 h-full transition-all duration-300" 
              style={{ width: `${Math.min(100, customMetrics.waterSaved * 2)}%` }} 
            />
          </div>
        </div>
        
        <div className="p-2 bg-[#081730] rounded-xl border border-white/5 flex flex-col justify-between">
          <span className="text-slate-300 block text-[11px] sm:text-xs font-bold mb-1">{t.soilNGauge}</span>
          <span className={`font-black text-xs sm:text-sm ${customMetrics.nBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {customMetrics.nBalance >= 0 ? `+${customMetrics.nBalance}` : customMetrics.nBalance} kg/ha N
          </span>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
            <div 
              className={`${customMetrics.nBalance >= 0 ? 'bg-emerald-400' : 'bg-red-400'} h-full transition-all duration-300`} 
              style={{ width: `${Math.min(100, Math.max(10, customMetrics.nBalance + 50))}%` }} 
            />
          </div>
        </div>

        <div className="p-2 bg-[#081730] rounded-xl border border-white/5 flex flex-col justify-between">
          <span className="text-slate-300 block text-[11px] sm:text-xs font-bold mb-1">{t.pestBreakGauge}</span>
          <span className="font-black text-amber-400 text-xs sm:text-sm">
            {customMetrics.isMonoculture ? t.pestMonocultureWarning : t.pestExcellentScore}
          </span>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
            <div 
              className={`${customMetrics.isMonoculture ? 'bg-red-400' : 'bg-amber-400'} h-full transition-all duration-300`} 
              style={{ width: customMetrics.isMonoculture ? '20%' : '90%' }} 
            />
          </div>
        </div>
      </div>

      {/* Feedback Advice Bar */}
      <div className={`p-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 ${
        customMetrics.resilience >= 85 ? 'bg-emerald-950/70 text-emerald-200 border border-emerald-500/40' : 
        customMetrics.resilience >= 70 ? 'bg-amber-950/70 text-amber-200 border border-amber-500/40' :
        'bg-red-950/70 text-red-200 border border-red-500/40'
      }`}>
        {customMetrics.resilience >= 85 ? (
          <>
            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{t.adviceExcellent}</span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{t.adviceImprove}</span>
          </>
        )}
      </div>
    </div>
  );
}
