'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  X, BookOpen, Sparkles, 
  CheckCircle2 
} from 'lucide-react';
import { 
  gameGuideHeader, 
  gameGuideHero, 
  gameGuideSteps, 
  gameGuideTips 
} from '../data/gameGuideData';

export default function GameGuideModal({ isOpen, onClose }) {
  const { t, lang } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#051329]/98 border border-cyan-400/50 shadow-[0_0_50px_rgba(0,180,216,0.35)] flex flex-col max-h-[94vh] sm:max-h-[90vh] overflow-hidden rounded-2xl"
        style={{
          clipPath: 'polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-3.5 border-b border-cyan-500/25 bg-[#071a38] shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-sm shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-base font-black text-white flex items-center gap-1.5 sm:gap-2">
                <span>{t.navGameGuide}</span>
                <span className="text-[10px] sm:text-xs text-emerald-300 font-mono px-1.5 sm:px-2 py-0.5 bg-emerald-950 border border-emerald-500/40 rounded-lg">
                  {gameGuideHeader.badge}
                </span>
              </h2>
              <p className="text-[10.5px] sm:text-xs text-slate-300 truncate max-w-[200px] sm:max-w-none">
                {lang === 'ar' ? gameGuideHeader.subAr : gameGuideHeader.subEn}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 bg-white/5 hover:bg-white/15 border border-cyan-500/30 rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3 sm:p-4 space-y-3 sm:space-y-4">
          
          {/* Hero Concept Banner */}
          <div className="p-3 sm:p-3.5 bg-gradient-to-r from-blue-950/70 via-[#071e3d] to-[#041226] border border-cyan-400/40 rounded-xl flex items-center gap-3 sm:gap-3.5 shadow-md">
            <span className="text-3xl">🌾</span>
            <div className="space-y-0.5">
              <h3 className="text-sm sm:text-base font-black text-white">
                {lang === 'ar' ? gameGuideHero.titleAr : gameGuideHero.titleEn}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {lang === 'ar' ? gameGuideHero.descAr : gameGuideHero.descEn}
              </p>
            </div>
          </div>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {gameGuideSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="p-3.5 bg-[#081730] border border-cyan-500/35 rounded-xl space-y-2 hover:border-cyan-400/70 transition-all shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-black text-white">
                        {lang === 'ar' ? step.titleAr : step.titleEn}
                      </h4>
                    </div>
                    <span className="text-xs font-black font-mono text-cyan-400 bg-black/50 px-2.5 py-0.5 rounded-lg border border-white/10">
                      {step.num}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {lang === 'ar' ? step.descAr : step.descEn}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Pro Tips Section */}
          <div className="p-3.5 bg-[#081f3d] border border-emerald-500/40 rounded-xl space-y-2 shadow-md">
            <h4 className="text-xs sm:text-sm font-black text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'ar' ? gameGuideTips.titleAr : gameGuideTips.titleEn}</span>
            </h4>
            <div className="space-y-1.5 text-xs sm:text-sm text-slate-200">
              {gameGuideTips.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{lang === 'ar' ? item.textAr : item.textEn}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-cyan-500/20 bg-[#071a38] flex items-center justify-between shrink-0">
          <div className="text-xs text-cyan-300 font-bold">
            {gameGuideHeader.teamFooter}
          </div>
          <button
            onClick={onClose}
            className="py-1.5 px-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs sm:text-sm font-black rounded-xl cursor-pointer hover:scale-105 transition-all shadow-md"
          >
            {lang === 'ar' ? gameGuideHeader.understandBtnAr : gameGuideHeader.understandBtnEn}
          </button>
        </div>

      </div>
    </div>
  );
}
