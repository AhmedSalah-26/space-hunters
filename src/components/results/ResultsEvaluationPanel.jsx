'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Award, Check, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ResultsEvaluationPanel({ mission, dynamicResults, onBackToMap }) {
  const { t, lang, isRtl } = useLanguage();

  return (
    <div
      className="lg:col-span-3 p-3.5 bg-[#061633]/96 border border-cyan-400/40 shadow-2xl backdrop-blur-md flex flex-col justify-between gap-3 min-h-0 overflow-y-auto custom-scrollbar rounded-xl"
      style={{
        clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)',
      }}
    >
      <div className="space-y-2.5">
        {/* Header */}
        <h3 className="text-sm sm:text-base font-black text-white flex items-center justify-between pb-1.5 border-b border-cyan-500/20">
          <span className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{t.missionGrade}</span>
          </span>
          <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
            NASA VERIFIED
          </span>
        </h3>

        {/* Circular Grade Badge */}
        <div className="flex flex-col items-center justify-center p-3 bg-[#081730] border border-cyan-500/30 shadow-lg rounded-2xl">
          <div className={`relative w-20 h-20 rounded-full border-3 flex flex-col items-center justify-center shadow-lg mb-1.5 transition-all ${dynamicResults.gradeColor}`}>
            <span className="text-3xl font-black font-['Orbitron',sans-serif]">{dynamicResults.grade}</span>
            <span className="text-[11px] font-bold">{dynamicResults.score} / 100</span>
          </div>

          <span className="text-xs sm:text-sm font-black tracking-wide text-center px-1">
            {lang === 'ar' ? dynamicResults.ratingAr : dynamicResults.ratingEn}
          </span>
        </div>

        {/* 4 Dynamic Checklist Badges */}
        <div className="space-y-1.5">
          {dynamicResults.checks.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 text-xs sm:text-sm font-semibold p-2 border rounded-lg transition-all ${
                item.passed
                  ? 'bg-emerald-950/25 border-emerald-500/40 text-slate-100'
                  : 'bg-red-950/25 border-red-500/40 text-slate-300'
              }`}
            >
              <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                item.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {item.passed ? <Check className="w-3 h-3 stroke-[3]" /> : <span className="text-[10px] font-bold">✕</span>}
              </div>
              <span className="truncate">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Landscape Thumbnail, Quote & Back to Map Action */}
      <div className="space-y-2 shrink-0">
        <div className="w-full h-24 sm:h-28 relative overflow-hidden border border-cyan-500/30 rounded-xl shadow-inner">
          <img src={mission.heroImage} alt={mission.countryEn} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061021]/90 via-transparent to-transparent flex items-end justify-center p-2">
            <span className="text-[11px] font-mono font-bold text-cyan-300">
              {lang === 'ar' ? mission.countryAr : mission.countryEn} • #{mission.code}
            </span>
          </div>
        </div>

        <p className="text-xs text-cyan-200 font-bold text-center italic leading-relaxed px-1">
          "{t.quoteTomorrow}"
        </p>

        <button
          onClick={onBackToMap}
          className="w-full py-2.5 px-4 bg-white/5 hover:bg-cyan-500/20 text-slate-200 hover:text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all border border-cyan-500/35 hover:border-cyan-400 rounded-xl cursor-pointer shadow-lg"
        >
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t.backToMap}</span>
        </button>
      </div>
    </div>
  );
}
