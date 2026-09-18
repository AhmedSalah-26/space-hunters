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
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden select-none">
      
      {/* ── CINEMATIC SPACE BACKGROUND IMAGE ── */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <img
          src="/start_screen_bg.jpg"
          alt="Space Earth Background"
          className="w-full h-full object-cover object-center transform scale-[1.02] transition-transform duration-1000"
        />
        {/* Sleek Cinematic Contrast Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030914]/80 via-[#050c1b]/65 to-[#02050c]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_#020614_95%)] opacity-85" />
      </div>
      
      {/* ── TOP LUXURY NAV BAR ── */}
      <div className="w-full max-w-4xl flex items-center justify-between gap-3 shrink-0 z-20">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[#061530]/80 border border-cyan-400/30 rounded-full text-[11px] font-mono font-bold text-cyan-300 shadow-sm backdrop-blur-md">
            {lang === 'ar' ? startScreenData.badgeAr : startScreenData.badgeEn}
          </span>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGameGuide}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#061530]/80 hover:bg-[#0c2858] border border-cyan-500/25 hover:border-cyan-400 text-xs font-bold text-slate-300 hover:text-white rounded-full transition-all cursor-pointer backdrop-blur-md"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'ar' ? startScreenData.guideBtnAr : startScreenData.guideBtnEn}</span>
          </button>

          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#061530]/80 hover:bg-[#0c2858] border border-amber-500/25 hover:border-amber-400 text-xs font-bold text-slate-300 hover:text-white rounded-full transition-all cursor-pointer backdrop-blur-md"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{lang === 'ar' ? startScreenData.leaderboardBtnAr : startScreenData.leaderboardBtnEn}</span>
          </button>

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#082046]/90 hover:bg-[#103672] border border-cyan-400/40 text-xs font-bold text-cyan-300 rounded-full transition-all shadow-sm cursor-pointer backdrop-blur-md"
          >
            <Languages className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
          </button>
        </div>
      </div>

      {/* ── CENTER MINIMALIST LUXURY HERO HUB ── */}
      <div className="my-auto flex flex-col items-center text-center z-10 space-y-5 max-w-lg w-full">
        
        {/* LOGO BADGE (Refined, Elegant Glow) */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 via-blue-600/30 to-emerald-500/30 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-cyan-400/80 shadow-[0_0_35px_rgba(0,180,216,0.6)] bg-[#041026] flex items-center justify-center">
            <img
              src="/space_hunters_badge.jpg"
              alt="Space Hunters Logo"
              className="w-full h-full object-cover scale-[2.1] object-center transition-transform duration-500 group-hover:scale-[2.25]"
            />
          </div>
        </div>

        {/* TITLES */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black tracking-wider text-white font-sans">
            <span>{startScreenData.titlePrefix}</span>
            <span className="text-[#00b4d8] ml-2 drop-shadow-[0_0_15px_rgba(0,180,216,0.7)]">
              {startScreenData.titleSuffix}
            </span>
          </h1>

          <p className="text-xs sm:text-sm font-mono font-black text-cyan-400 tracking-[0.25em] uppercase drop-shadow-[0_0_10px_rgba(0,180,216,0.6)]">
            {lang === 'ar' ? startScreenData.taglineAr : startScreenData.taglineEn}
          </p>
        </div>

        {/* ── 3 COMPACT LUXURY ACTION BUTTONS ── */}
        <div className="w-full max-w-sm space-y-2.5 pt-1">
          
          {/* BUTTON 1: ابدأ اللعب */}
          <button
            onClick={onStartGame}
            className="w-full p-2.5 sm:p-3 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl shadow-[0_0_20px_rgba(0,180,216,0.4)] flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer border border-cyan-300/40 group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white shrink-0 group-hover:rotate-6 transition-transform">
                <Rocket className="w-4 h-4" />
              </div>
              <span className="text-sm font-black tracking-wide">
                {lang === 'ar' ? startScreenData.buttons.startGame.labelAr : startScreenData.buttons.startGame.labelEn}
              </span>
            </div>

            <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </div>
          </button>

          {/* BUTTON 2: بنك المحاصيل */}
          <button
            onClick={onOpenAgriBank}
            className="w-full p-2.5 sm:p-3 bg-[#061a33]/80 hover:bg-[#0a284e] text-slate-100 hover:text-white rounded-xl border border-emerald-500/40 hover:border-emerald-400 flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm group backdrop-blur-md"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0 group-hover:rotate-6 transition-transform">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold tracking-wide text-emerald-200">
                {lang === 'ar' ? startScreenData.buttons.cropBank.labelAr : startScreenData.buttons.cropBank.labelEn}
              </span>
            </div>

            <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-300 flex items-center justify-center shrink-0">
              {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </div>
          </button>

          {/* BUTTON 3: صانع تسلسل الدورات */}
          <button
            onClick={onOpenSequenceBuilder}
            className="w-full p-2.5 sm:p-3 bg-[#091530]/80 hover:bg-[#11234c] text-slate-100 hover:text-white rounded-xl border border-cyan-500/35 hover:border-cyan-400 flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm group backdrop-blur-md"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0 group-hover:-rotate-12 transition-transform">
                <RotateCcw className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold tracking-wide text-cyan-200">
                {lang === 'ar' ? startScreenData.buttons.sequenceBuilder.labelAr : startScreenData.buttons.sequenceBuilder.labelEn}
              </span>
            </div>

            <div className="w-6 h-6 rounded-full bg-cyan-500/15 text-cyan-300 flex items-center justify-center shrink-0">
              {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </div>
          </button>

        </div>

      </div>

      {/* ── BOTTOM MINIMAL SIGNATURE ── */}
      <div className="text-[11px] font-mono text-slate-400 shrink-0 z-10 py-1">
        {startScreenData.teamSignature}
      </div>

    </div>
  );
}
