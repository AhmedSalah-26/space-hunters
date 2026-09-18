'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Award, Check, ArrowRight, ArrowLeft, X, MapPin } from 'lucide-react';

export default function ResultsEvaluationPanel({ mission, dynamicResults, onBackToMap }) {
  const { t, lang, isRtl } = useLanguage();

  return (
    <div className="lg:col-span-3 flex flex-col gap-3 min-h-0">

      {/* ── GRADE CARD ── */}
      <div
        className="p-3.5 bg-gradient-to-br from-[#06183a]/98 via-[#071a3d]/98 to-[#051229]/98 border border-cyan-400/40 shadow-[0_0_40px_rgba(0,100,200,0.2)] backdrop-blur-md flex flex-col gap-3 rounded-2xl overflow-hidden relative"
      >
        {/* Subtle background glow based on grade */}
        <div className={`absolute inset-0 opacity-[0.04] ${
          dynamicResults.score >= 90 ? 'bg-emerald-400' :
          dynamicResults.score >= 75 ? 'bg-blue-400' :
          dynamicResults.score >= 60 ? 'bg-amber-400' : 'bg-red-500'
        }`} />

        {/* Header */}
        <div className="flex items-center justify-between z-10">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{t.missionGrade}</span>
          </h3>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/30">
            ✓ NASA VERIFIED
          </span>
        </div>

        {/* Grade Display — Horizontal on mobile for space efficiency */}
        <div className="flex items-center gap-3 z-10">
          {/* Big grade circle */}
          <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 flex flex-col items-center justify-center shadow-lg shrink-0 ${dynamicResults.gradeColor}`}>
            <span className="text-3xl sm:text-4xl font-black font-['Orbitron',sans-serif] leading-none">{dynamicResults.grade}</span>
            <span className="text-[10px] font-bold mt-0.5 opacity-80">{dynamicResults.score}/100</span>
          </div>

          {/* Rating text + country */}
          <div className="flex-1 min-w-0">
            <div className="text-sm sm:text-base font-black text-white mb-1 leading-tight">
              {lang === 'ar' ? dynamicResults.ratingAr : dynamicResults.ratingEn}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-cyan-300 font-bold">
              <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
              <span>{lang === 'ar' ? mission.countryAr : mission.countryEn}</span>
              <span className="text-slate-500">•</span>
              <span className="font-mono text-slate-400">#{mission.code}</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  dynamicResults.score >= 90 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                  dynamicResults.score >= 75 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
                  dynamicResults.score >= 60 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                  'bg-gradient-to-r from-red-500 to-rose-400'
                }`}
                style={{ width: `${dynamicResults.score}%` }}
              />
            </div>
            <div className="text-[9px] text-slate-500 font-mono mt-0.5">{dynamicResults.score}/100 pts</div>
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-1.5 z-10">
          {dynamicResults.checks.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 text-xs font-semibold py-1.5 px-2.5 border rounded-xl transition-all ${
                item.passed
                  ? 'bg-emerald-950/30 border-emerald-500/35 text-slate-100'
                  : 'bg-red-950/25 border-red-500/30 text-slate-400'
              }`}
            >
              <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 ${
                item.passed ? 'bg-emerald-500/25 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {item.passed 
                  ? <Check className="w-3 h-3 stroke-[3]" />
                  : <X className="w-3 h-3 stroke-[2.5]" />
                }
              </div>
              <span className="truncate">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── COUNTRY THUMBNAIL + BACK BUTTON ── */}
      <div
        className="relative w-full h-28 sm:h-32 overflow-hidden rounded-2xl border border-cyan-500/25 shadow-xl cursor-pointer group"
        onClick={onBackToMap}
      >
        <img
          src={mission.heroImage}
          alt={mission.countryEn}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030c1c]/95 via-[#030c1c]/40 to-transparent" />

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col justify-between p-3">
          <div className="flex items-center gap-1.5">
            <span className="text-base">{mission.flag}</span>
            <span className="text-xs font-black text-white bg-[#030c1c]/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10">
              {lang === 'ar' ? mission.countryAr : mission.countryEn}
            </span>
          </div>

          <button
            className="self-stretch py-2 bg-gradient-to-r from-cyan-600/90 to-blue-600/90 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-black flex items-center justify-center gap-2 transition-all rounded-xl border border-cyan-400/30 active:scale-95"
          >
            {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{t.backToMap}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
