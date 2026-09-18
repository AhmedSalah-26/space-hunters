'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Rocket, Sprout, RotateCcw, 
  BookOpen, Trophy, Languages, 
  ArrowLeft, ArrowRight
} from 'lucide-react';
import { startScreenData } from '../data/startScreenData';

export default function StartScreen({ 
  onStartGame, 
  onOpenAgriBank, 
  onOpenSequenceBuilder,
  onOpenGameGuide,
  onOpenLeaderboard
}) {
  const { lang, isRtl, toggleLanguage } = useLanguage();

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center overflow-y-auto select-none bg-[#030712] text-white">
      
      {/* ── SUBTLE ELEGANT BACKGROUND ── */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <img
          src="/start_screen_bg.jpg"
          alt="Earth and Space"
          className="w-full h-full object-cover object-center opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/90 via-[#03091e]/80 to-[#02050f]" />
      </div>

      {/* ── 1. CLEAN TOP HEADER ── */}
      <header className="w-full max-w-4xl flex items-center justify-between px-4 sm:px-8 pt-4 sm:pt-6 z-20">
        {/* Simple Brand Tag */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-xs font-semibold tracking-wider text-slate-300 font-sans">
            NASA Space Apps 2026
          </span>
        </div>

        {/* Clean Header Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGameGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
            title={lang === 'ar' ? 'دليل اللعبة' : 'Game Guide'}
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{lang === 'ar' ? 'دليل اللعبة' : 'Guide'}</span>
          </button>

          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
            title={lang === 'ar' ? 'المتصدرين' : 'Leaderboard'}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{lang === 'ar' ? 'المتصدرين' : 'Leaders'}</span>
          </button>

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-xs font-semibold text-cyan-300 transition-colors cursor-pointer border border-cyan-500/30"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
          </button>
        </div>
      </header>

      {/* ── 2. HERO CENTER CONTENT ── */}
      <main className="w-full max-w-md mx-auto px-4 py-6 sm:py-8 flex flex-col items-center text-center z-10 my-auto">
        
        {/* Mission Badge Logo */}
        <div className="relative mb-5">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-cyan-400/80 shadow-2xl bg-[#071326]">
            <img
              src="/space_hunters_badge.jpg"
              alt="Space Hunters Badge"
              className="w-full h-full object-cover scale-[2.2] object-center"
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 font-sans">
          SPACE <span className="text-cyan-400">HUNTERS</span>
        </h1>

        {/* Human-crafted Tagline */}
        <p className="text-sm sm:text-base font-medium text-slate-200 mb-1 max-w-sm">
          {lang === 'ar' 
            ? 'محاكاة التكيف الزراعي وإدارة الدورات المحصولية'
            : 'Farm Adaptation & Smart Crop Rotation Simulator'
          }
        </p>

        <p className="text-xs sm:text-sm text-slate-400 mb-7 max-w-xs leading-relaxed">
          {lang === 'ar'
            ? 'اعتمد على بيانات أقمار ناسا (SMAP, LST, NDVI) لتحقيق الأمن الغذائي وصمود المزارع.'
            : 'Leverage NASA Earth observations to build resilient farms and ensure global food security.'
          }
        </p>

        {/* ── PRIMARY CALL TO ACTION ── */}
        <div className="w-full space-y-3">
          <button
            onClick={onStartGame}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-base shadow-lg shadow-blue-600/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Rocket className="w-5 h-5 text-white" />
            <span>{lang === 'ar' ? 'ابدأ اللعب والمغامرة' : 'Start Mission'}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>

          {/* Secondary Clean Options */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={onOpenAgriBank}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ar' ? 'بنك المحاصيل' : 'Crop Bank'}</span>
            </button>

            <button
              onClick={onOpenSequenceBuilder}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'مختبر الدورات' : 'Rotation Lab'}</span>
            </button>
          </div>
        </div>

      </main>

      {/* ── 3. CLEAN FOOTER ── */}
      <footer className="w-full text-center pb-4 text-[11px] text-slate-500 z-10 font-sans">
        NASA Space Apps Challenge 2026 • Team Space Hunters
      </footer>

    </div>
  );
}
