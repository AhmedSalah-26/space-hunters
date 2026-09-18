'use client';

import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Award, Check, Globe, Sparkles, BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';

export default function SimplifiedCertificateTab({ mission, dynamicResults, onBackToMap }) {
  const { t, lang, isRtl } = useLanguage();
  const res = dynamicResults;

  return (
    <div className="flex flex-col gap-3">
      
      {/* 🏆 1. OFFICIAL NASA CERTIFICATE CARD */}
      <div className="p-4 bg-gradient-to-br from-[#061e47] via-[#05142f] to-[#030c1e] border-2 border-cyan-400/50 rounded-2xl shadow-[0_0_35px_rgba(6,182,212,0.2)] relative overflow-hidden">
        
        {/* Certificate Watermark Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/25">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">
                {lang === 'ar' ? 'شهادة التكيف المناخي والزراعة الذكية' : 'NASA Smart Agriculture Certificate'}
              </h3>
              <span className="text-[10px] text-cyan-300 font-mono font-bold">
                NASA SPACE APPS VERIFIED • #{mission.code}
              </span>
            </div>
          </div>
          <span className="text-xl">🌟</span>
        </div>

        {/* Dynamic Verification Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
          {res.checks.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 text-xs font-semibold py-2 px-3 border rounded-xl ${
                item.passed
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-slate-100'
                  : 'bg-red-950/30 border-red-500/30 text-slate-400'
              }`}
            >
              <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                item.passed ? 'bg-emerald-500/30 text-emerald-400' : 'bg-red-500/30 text-red-400'
              }`}>
                {item.passed ? <Check className="w-3 h-3 stroke-[3]" /> : '✕'}
              </div>
              <span className="truncate">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Farmer Wisdom & Lesson */}
        <div className="p-2.5 bg-[#030e21]/80 border border-white/10 rounded-xl flex items-center gap-3">
          <img 
            src={mission.farmerHappyImage} 
            alt="Farmer" 
            className="w-10 h-10 rounded-lg object-cover border border-emerald-400 shrink-0"
          />
          <p className="text-xs text-slate-200 leading-relaxed italic">
            "{t.farmerQuoteEnd}"
          </p>
        </div>
      </div>

      {/* 🗺️ 2. BIG ACTION BUTTON: RETURN TO MAP */}
      <button
        onClick={onBackToMap}
        className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white text-sm sm:text-base font-black rounded-2xl shadow-xl shadow-cyan-600/30 border border-cyan-300/50 flex items-center justify-center gap-2.5 transition-all active:scale-98 cursor-pointer"
      >
        <Globe className="w-5 h-5 text-white animate-pulse" />
        <span>{t.backToMap}</span>
        {isRtl ? <ArrowLeft className="w-4 h-4 text-white" /> : <ArrowRight className="w-4 h-4 text-white" />}
      </button>

    </div>
  );
}
