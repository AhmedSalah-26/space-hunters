'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Rocket, Sprout, RotateCcw, 
  BookOpen, Trophy, Languages, 
  ArrowLeft, ArrowRight, Satellite, Globe2
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
    <div className="relative w-full h-full flex flex-col items-center overflow-y-auto select-none">
      
      {/* ── CINEMATIC SPACE BACKGROUND ── */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <img
          src="/start_screen_bg.jpg"
          alt="Space Earth Background"
          className="w-full h-full object-cover object-center scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020a1a]/85 via-[#050c1b]/60 to-[#02050c]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#010510_90%)] opacity-90" />
        {/* Animated scan line */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-[scanline_4s_ease-in-out_infinite]" style={{animation: 'none'}} />
      </div>

      {/* ── TOP NAV STRIP ── */}
      <div className="w-full flex items-center justify-between px-3 sm:px-6 pt-3 sm:pt-4 pb-2 shrink-0 z-20">
        {/* Badge */}
        <span className="px-2.5 py-1 bg-[#061530]/90 border border-cyan-400/35 rounded-full text-[10px] sm:text-[11px] font-mono font-bold text-cyan-300 shadow-sm backdrop-blur-md">
          {lang === 'ar' ? startScreenData.badgeAr : startScreenData.badgeEn}
        </span>

        {/* Action Pills */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenGameGuide}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#061530]/90 hover:bg-[#0c2858] border border-white/10 hover:border-cyan-400/60 text-[10px] sm:text-xs font-bold text-slate-300 hover:text-white rounded-lg transition-all cursor-pointer backdrop-blur-md active:scale-95"
          >
            <BookOpen className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">{lang === 'ar' ? startScreenData.guideBtnAr : startScreenData.guideBtnEn}</span>
          </button>

          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1a1200]/90 hover:bg-[#2e2000] border border-amber-500/30 hover:border-amber-400/60 text-[10px] sm:text-xs font-bold text-amber-300 hover:text-amber-100 rounded-lg transition-all cursor-pointer backdrop-blur-md active:scale-95"
          >
            <Trophy className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">{lang === 'ar' ? startScreenData.leaderboardBtnAr : startScreenData.leaderboardBtnEn}</span>
          </button>

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#082046]/90 hover:bg-[#103672] border border-cyan-400/40 text-[10px] sm:text-xs font-bold text-cyan-300 rounded-lg transition-all cursor-pointer backdrop-blur-md active:scale-95"
          >
            <Languages className="w-3 h-3 text-cyan-400" />
            <span>{lang === 'ar' ? 'EN' : 'ع'}</span>
          </button>
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 z-10 py-2 sm:py-4 w-full max-w-lg mx-auto">
        
        {/* Logo + Title group */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
          {/* Outer glow ring */}
          <div className="relative mb-4 sm:mb-5 group">
            <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/25 via-blue-600/25 to-emerald-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -inset-1 bg-gradient-to-br from-cyan-400/40 to-blue-600/40 rounded-full blur-md" />
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-cyan-400/90 shadow-[0_0_40px_rgba(0,180,216,0.7),inset_0_0_20px_rgba(0,0,0,0.5)] bg-[#041026] transition-transform duration-500 group-hover:scale-105">
              <img
                src="/space_hunters_badge.jpg"
                alt="Space Hunters Logo"
                className="w-full h-full object-cover scale-[2.1] object-center"
              />
            </div>
            {/* NASA badge */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#0b3d91] border-2 border-cyan-300/50 shadow-[0_0_8px_rgba(11,61,145,0.8)] flex items-center justify-center overflow-hidden">
              <span className="text-[7px] font-black text-white z-10 relative">NASA</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-black tracking-wider text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)] mb-2 leading-none">
            <span>SPACE</span>
            <span className="text-[#00b4d8] ml-2 drop-shadow-[0_0_24px_rgba(0,180,216,0.9)]">HUNTERS</span>
          </h1>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-cyan-400/60" />
            <Satellite className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] text-[#38bdf8] font-black tracking-[0.2em] uppercase">NASA Space Apps 2026</span>
            <Satellite className="w-3 h-3 text-cyan-400 scale-x-[-1]" />
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-cyan-400/60" />
          </div>

          <p className="text-xs sm:text-sm font-medium text-cyan-100/75 leading-relaxed max-w-sm drop-shadow-md">
            {lang === 'ar' ? startScreenData.taglineAr : startScreenData.taglineEn}
          </p>
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div className="w-full space-y-2.5">
          
          {/* MAIN CTA — Start Game */}
          <button
            onClick={onStartGame}
            className="w-full py-3.5 sm:py-4 px-5 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-2xl shadow-[0_0_30px_rgba(0,120,220,0.5),0_8px_20px_rgba(0,0,0,0.4)] flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer border border-cyan-300/30 group relative overflow-hidden"
          >
            {/* Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <div className="flex items-center gap-3 z-10">
              <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform duration-300">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm sm:text-base font-black tracking-wide leading-tight">
                  {lang === 'ar' ? startScreenData.buttons.startGame.labelAr : startScreenData.buttons.startGame.labelEn}
                </div>
                <div className="text-[10px] text-cyan-100/80 font-medium">
                  {lang === 'ar' ? '٦ مهمات زراعية عالمية' : '6 Global Farm Missions'}
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 z-10">
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </div>
          </button>

          {/* Secondary Buttons Row */}
          <div className="grid grid-cols-2 gap-2">
            
            {/* AgriBank */}
            <button
              onClick={onOpenAgriBank}
              className="py-3 px-3.5 bg-[#061a33]/85 hover:bg-[#0a284e] border border-emerald-500/35 hover:border-emerald-400/70 rounded-xl flex items-center gap-2.5 transition-all active:scale-[0.97] cursor-pointer group backdrop-blur-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0 group-hover:scale-110 transition-transform">
                <Sprout className="w-4 h-4" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-[11px] font-black text-emerald-200 truncate leading-tight">
                  {lang === 'ar' ? startScreenData.buttons.cropBank.labelAr : startScreenData.buttons.cropBank.labelEn}
                </div>
                <div className="text-[9px] text-emerald-400/70 font-medium truncate">
                  {lang === 'ar' ? 'قاعدة البيانات' : 'Database'}
                </div>
              </div>
            </button>

            {/* Sequence Builder */}
            <button
              onClick={onOpenSequenceBuilder}
              className="py-3 px-3.5 bg-[#061a33]/85 hover:bg-[#0a1e50] border border-cyan-500/30 hover:border-cyan-400/70 rounded-xl flex items-center gap-2.5 transition-all active:scale-[0.97] cursor-pointer group backdrop-blur-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0 group-hover:rotate-180 transition-transform duration-500">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-[11px] font-black text-cyan-200 truncate leading-tight">
                  {lang === 'ar' ? startScreenData.buttons.sequenceBuilder.labelAr : startScreenData.buttons.sequenceBuilder.labelEn}
                </div>
                <div className="text-[9px] text-cyan-400/70 font-medium truncate">
                  {lang === 'ar' ? 'المحاكاة' : 'Simulation'}
                </div>
              </div>
            </button>

          </div>
        </div>

        {/* ── STATS STRIP ── */}
        <div className="mt-5 sm:mt-6 w-full grid grid-cols-3 gap-2">
          {[
            { icon: Globe2, val: '6', labelAr: 'دول', labelEn: 'Countries', color: 'text-cyan-400', border: 'border-cyan-500/25' },
            { icon: Satellite, val: '3', labelAr: 'أقمار', labelEn: 'Satellites', color: 'text-blue-400', border: 'border-blue-500/25' },
            { icon: Sprout, val: '12+', labelAr: 'محصول', labelEn: 'Crops', color: 'text-emerald-400', border: 'border-emerald-500/25' },
          ].map((stat, i) => (
            <div key={i} className={`flex flex-col items-center p-2 bg-[#051020]/70 border ${stat.border} rounded-xl backdrop-blur-sm`}>
              <stat.icon className={`w-3.5 h-3.5 ${stat.color} mb-1`} />
              <span className={`text-lg font-black ${stat.color} leading-none`}>{stat.val}</span>
              <span className="text-[9px] text-slate-400 font-bold mt-0.5">{lang === 'ar' ? stat.labelAr : stat.labelEn}</span>
            </div>
          ))}
        </div>

      </div>

      {/* ── BOTTOM SIGNATURE ── */}
      <div className="w-full flex items-center justify-center gap-2 pb-2 shrink-0 z-10">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10 max-w-[60px]" />
        <span className="text-[10px] font-mono text-slate-500">{startScreenData.teamSignature}</span>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10 max-w-[60px]" />
      </div>

    </div>
  );
}
